"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Search, Package, Edit2, Trash2, DollarSign, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { createClient } from "@/utils/supabase/client";
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";

export default function InventoryPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const supabase = createClient();

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({ name: "", price: "", stock: "", restock: "" });
  const [saleQty, setSaleQty] = useState("1");

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
         router.push("/login");
         return;
      }

      // Fetch Business Name
      const { data: bData } = await supabase
        .from('businesses')
        .select('business_type')
        .eq('user_id', user.id)
        .single();
        
      if (bData) setBusinessName(bData.business_type);

      // Fetch Inventory
      const { data: iData, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (iData) setItems(iData);

    } catch (err: any) {
      toast.error("Failed to load inventory");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    // Kept here just in case, but usually handled externally now or not needed if Sidebar handles it
    // Actually wait, let's keep the header logout button if we want, or remove it. We'll leave it in the header for now.
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) return toast.error("Please fill all required fields");
    
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: bData } = await supabase.from('businesses').select('id').eq('user_id', user?.id).single();
      
      const { error } = await supabase.from('inventory').insert({
        user_id: user?.id,
        business_id: bData?.id,
        item_name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        restock_time_days: parseInt(formData.restock) || 0,
      });

      if (error) throw error;
      toast.success("Item added successfully!");
      setIsAddModalOpen(false);
      setFormData({ name: "", price: "", stock: "", restock: "" });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const { error } = await supabase.from('inventory').delete().eq('id', id);
      if (error) throw error;
      toast.success("Item deleted");
      fetchData();
    } catch (err: any) {
      toast.error("Failed to delete item");
    }
  };

  const handleRecordSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    const qty = parseInt(saleQty);
    if (qty > selectedItem.stock) return toast.error("Cannot sell more than current stock!");

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const newStock = selectedItem.stock - qty;
      const totalPrice = qty * selectedItem.price;

      // 1. Record the sale
      const { error: sErr } = await supabase.from('sales').insert({
         inventory_id: selectedItem.id,
         user_id: user?.id,
         quantity: qty,
         total_price: totalPrice
      });
      if (sErr) throw sErr;

      // 2. Decrement the stock
      const { error: iErr } = await supabase.from('inventory').update({ stock: newStock }).eq('id', selectedItem.id);
      if (iErr) throw iErr;

      toast.success(`Recorded sale of ${qty} ${selectedItem.item_name} for $${totalPrice.toFixed(2)}`);
      setIsSaleModalOpen(false);
      setSaleQty("1");
      setSelectedItem(null);
      fetchData();
    } catch (err: any) {
      toast.error("Failed to record sale");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter(item => item.item_name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!mounted) return null;

  return (
    <div className="flex relative h-screen overflow-hidden bg-transparent font-sans text-slate-900 dark:text-gray-100">
      <Toaster position="top-center" toastOptions={{ 
          style: { background: '#333', color: '#fff', borderRadius: '12px' },
          success: { style: { background: '#10B981', color: '#fff' } },
          error: { style: { background: '#EF4444', color: '#fff' } },
      }} />

      {/* Reusable Dashboard Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="w-full h-full flex flex-col p-8 md:p-12 overflow-y-auto">
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start mb-10"
        >
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-medium tracking-tight capitalize text-slate-900 dark:text-white">
                Inventory Hub
              </h1>
              <p className="text-sm text-slate-500 dark:text-gray-400 font-normal mt-0.5">
                Manage your {businessName || 'Business'} stock and record sales.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
              <ThemeToggle />
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
              >
                  <LogOut className="w-4 h-4" />
                  Logout
              </button>
          </div>
        </motion.header>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
           <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                 type="text" 
                 placeholder="Search products..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white dark:bg-[#0a0a0a] border border-slate-200/60 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
           </div>
           <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white dark:bg-white dark:text-black px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
           >
              <Plus className="w-4 h-4" />
              Add Product
           </button>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200/60 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-white/5 bg-[#f8f9fa] dark:bg-[#050505]/20">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Stock Level</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Price (Unit)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Restock Est.</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoading ? (
                   // Skeleton loader
                   [...Array(5)].map((_, i) => (
                      <tr key={i}>
                         <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32 animate-pulse" /></td>
                         <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse" /></td>
                         <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse" /></td>
                         <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20 animate-pulse" /></td>
                         <td className="px-6 py-4"><div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-24 animate-pulse ml-auto" /></td>
                      </tr>
                   ))
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-gray-400">
                       <Package className="w-8 h-8 mx-auto mb-3 opacity-20" />
                       No products found in inventory.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-400" />
                           </div>
                           {item.item_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.stock < 20 
                            ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                            : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {item.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-gray-400">{item.restock_time_days} days</td>
                      <td className="px-6 py-4 text-sm text-right">
                         <div className="flex justify-end gap-2">
                            <button 
                               onClick={() => { setSelectedItem(item); setIsSaleModalOpen(true); }}
                               className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 transition-colors font-medium text-xs"
                            >
                               <DollarSign className="w-3 h-3" /> Sale
                            </button>
                            <button 
                               onClick={() => handleDelete(item.id)}
                               className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Modal Overlay */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white dark:bg-[#0a0a0a] border border-slate-200/60 dark:border-white/5 rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative"
            >
               <div className="p-6 border-b border-slate-200/60 dark:border-white/5">
                  <h3 className="text-xl font-medium tracking-tight">Add New Product</h3>
                  <p className="text-sm text-slate-500 mt-1">Enter the details for the new inventory item.</p>
               </div>
               <form onSubmit={handleAddItem} className="p-6 space-y-4">
                  <div>
                     <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Product Name</label>
                     <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-black border border-slate-200/60 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm outline-none" placeholder="e.g. Wireless Headset" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Unit Price ($)</label>
                        <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-50 dark:bg-black border border-slate-200/60 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm outline-none" placeholder="49.99" />
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Initial Stock</label>
                        <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-slate-50 dark:bg-black border border-slate-200/60 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm outline-none" placeholder="100" />
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Restock Est. (Days)</label>
                     <input type="number" value={formData.restock} onChange={e => setFormData({...formData, restock: e.target.value})} className="w-full bg-slate-50 dark:bg-black border border-slate-200/60 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm outline-none" placeholder="7" />
                  </div>
                  <div className="pt-4 flex gap-3">
                     <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2.5 rounded-xl font-medium bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                     <button type="submit" disabled={isLoading} className="flex-1 py-2.5 rounded-xl font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity">Save Product</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Record Sale Modal Overlay */}
      <AnimatePresence>
        {isSaleModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white dark:bg-[#0a0a0a] border border-slate-200/60 dark:border-white/5 rounded-3xl shadow-xl w-full max-w-sm overflow-hidden relative"
            >
               <div className="p-6 border-b border-slate-200/60 dark:border-white/5 bg-blue-50/50 dark:bg-blue-900/10">
                  <h3 className="text-xl font-medium tracking-tight flex items-center gap-2">
                     <DollarSign className="w-5 h-5 text-blue-500" /> Record Sale
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Deduct stock for <strong className="text-slate-900 dark:text-white">{selectedItem.item_name}</strong>.</p>
               </div>
               <form onSubmit={handleRecordSale} className="p-6 space-y-4">
                  <div className="bg-slate-50 dark:bg-black border border-slate-200/60 dark:border-white/5 rounded-xl p-4 flex justify-between items-center">
                     <span className="text-sm text-slate-500 dark:text-gray-400">Current Stock:</span>
                     <span className="font-medium text-lg">{selectedItem.stock}</span>
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Quantity Sold</label>
                     <input required type="number" min="1" max={selectedItem.stock} value={saleQty} onChange={e => setSaleQty(e.target.value)} className="w-full bg-slate-50 dark:bg-black border border-slate-200/60 dark:border-white/5 rounded-xl px-4 py-3 text-lg text-center outline-none" placeholder="1" />
                  </div>
                  <div className="text-center pb-2">
                     <span className="text-sm text-slate-500">Revenue to record: </span>
                     <span className="text-lg font-medium text-green-600 dark:text-green-400">${(parseInt(saleQty || "0") * selectedItem.price).toFixed(2)}</span>
                  </div>
                  <div className="pt-2 flex gap-3">
                     <button type="button" onClick={() => { setIsSaleModalOpen(false); setSelectedItem(null); setSaleQty("1"); }} className="flex-1 py-2.5 rounded-xl font-medium bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                     <button type="submit" disabled={isLoading} className="flex-1 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">Confirm Sale</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
