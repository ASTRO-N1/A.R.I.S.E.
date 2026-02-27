/**
 * content.js
 * ─────────────────────────────────────────────
 * Centralized content & data constants for the ARISE landing page.
 * Keeping content separate from components makes it easy to
 * update copy, add i18n, or swap data without touching JSX.
 */

/* ── Feature Cards ── */
export const FEATURES = [
    {
        id: 'predict',
        iconVariant: 'cyan',     // maps to CSS modifier class
        iconType: 'trendUp',     // maps to icon component
        title: 'Predict Demand',
        description:
            'Deep learning models analyze historical sales, seasonal patterns, and market signals to generate hyper-accurate demand forecasts up to 12 weeks ahead.',
    },
    {
        id: 'stockout',
        iconVariant: 'magenta',
        iconType: 'shield',
        title: 'Prevent Stockouts',
        description:
            'Real-time risk detection flags potential shortages before they happen, with automated reorder triggers and safety stock recommendations.',
    },
    {
        id: 'optimize',
        iconVariant: 'purple',
        iconType: 'network',
        title: 'Optimize Multi-Warehouse Supply',
        description:
            'Balance inventory across locations with intelligent redistribution algorithms that minimize transit costs while maximizing fill rates.',
    },
]

/* ── Timeline / How It Works Steps ── */
export const TIMELINE_STEPS = [
    {
        id: 'ingest',
        number: 1,
        iconType: 'satellite',
        title: 'Data Ingestion',
        description:
            'Connect your ERP, POS, and supply chain feeds. ARISE ingests data from 50+ sources in real time.',
    },
    {
        id: 'forecast',
        number: 2,
        iconType: 'brain',
        title: 'AI Forecasting',
        description:
            'Proprietary deep learning models generate multi-horizon demand forecasts with uncertainty quantification.',
    },
    {
        id: 'detect',
        number: 3,
        iconType: 'scan',
        title: 'Risk Detection',
        description:
            'Anomaly detection algorithms surface stockout risks, overstock alerts, and supply chain disruptions.',
    },
    {
        id: 'action',
        number: 4,
        iconType: 'bolt',
        title: 'Recommended Actions',
        description:
            'Receive prioritized, one-click actions: reorder, redistribute, or adjust safety stock — all AI-optimized.',
    },
]

/* ── KPI Metrics ── */
export const METRICS = [
    {
        id: 'stockout',
        badge: 'Reduction',
        badgeVariant: 'cyan',
        value: '-32%',
        valueVariant: 'cyan',
        label: 'Stockout incidents reduced across all warehouses',
    },
    {
        id: 'turnover',
        badge: 'Improvement',
        badgeVariant: 'magenta',
        value: '+18%',
        valueVariant: 'magenta',
        label: 'Inventory turnover rate improvement year-over-year',
    },
    {
        id: 'accuracy',
        badge: 'Precision',
        badgeVariant: 'emerald',
        value: '96.4%',
        valueVariant: 'emerald',
        label: 'Demand forecast accuracy at 4-week horizon',
    },
    {
        id: 'savings',
        badge: 'Savings',
        badgeVariant: 'purple',
        value: '$2.1M',
        valueVariant: 'purple',
        label: 'Average annual savings per enterprise deployment',
    },
]

/* ── AI Recommendation card data for dashboard preview ── */
export const AI_RECOMMENDATIONS = [
    {
        id: 'rec-1',
        type: 'action',      // 'action' | 'risk'
        label: 'Action Required',
        text: 'Increase stock of <strong>SKU-124</strong> by <strong>18%</strong> next week. Projected demand surge detected via social trend analysis.',
        confidence: 94,
        confidenceLevel: 'high',
        impact: 'Impact: $42K revenue',
    },
    {
        id: 'rec-2',
        type: 'action',
        label: 'Redistribution',
        text: 'Transfer <strong>2,400 units</strong> of SKU-089 from <strong>Warehouse B</strong> to <strong>Warehouse D</strong>.',
        confidence: 91,
        confidenceLevel: 'high',
        impact: 'Save: $8.7K logistics',
    },
    {
        id: 'rec-3',
        type: 'risk',
        label: 'Risk Alert',
        text: '<strong>SKU-307</strong> projected to stockout in <strong>6 days</strong>. Recommend emergency reorder of 1,200 units.',
        confidence: 78,
        confidenceLevel: 'medium',
        impact: 'Risk: High',
    },
]

/* ── Navbar links ── */
export const NAV_LINKS = [
    { href: '#problems', label: 'Problems' },
    { href: '#features', label: 'Features' },
    { href: '#metrics', label: 'Users' },
    { href: '#cta', label: 'Contact' },
]

/* ── Bar chart sample data (SKU velocity) ── */
export const BAR_DATA = [65, 45, 78, 52, 88, 40, 72, 58, 92, 48]

/* ── Line chart SVG polyline points ── */
export const CHART_LINES = {
    primary: '0,140 60,120 120,90 180,100 240,60 300,80 360,40 420,55 480,25 540,45 600,20',
    secondary: '0,150 60,140 120,130 180,110 240,120 300,100 360,90 420,75 480,85 540,70 600,55',
}
