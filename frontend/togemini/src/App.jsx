/**
 * App.jsx
 * ═══════════════════════════════════════════════
 * Root component for the ARISE landing page.
 *
 * Section order:
 *   1. Hero Section       → headline + globe network
 *   2. Features Section   → 3 capability cards
 *   3. Hero Carousel      → full-width industry image carousel
 *   4. Dashboard Preview  → analytics interface mockup
 *   5. Timeline Section   → 4-step process
 *   6. Metrics Section    → KPI metric cards
 *   7. CTA Section        → bottom call-to-action
 *   8. Footer
 */

import { useState, useEffect } from 'react'
import './App.css'

/* ── Components ── */
import ParticleBackground from './components/ParticleBackground'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import HeroCarousel from './components/HeroCarousel'
import DashboardPreview from './components/DashboardPreview'
import TimelineSection from './components/TimelineSection'
import MetricsSection from './components/MetricsSection'
import CtaSection from './components/CtaSection'
import Footer from './components/Footer'

function App() {
  /* Track scroll position for navbar styling */
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* ── Ambient background layers (decorative) ── */}
      <ParticleBackground />
      <div className="grid-overlay" aria-hidden="true" />
      <div className="data-streams" aria-hidden="true">
        <div className="data-stream" />
        <div className="data-stream" />
        <div className="data-stream" />
        <div className="data-stream" />
        <div className="data-stream" />
      </div>

      {/* ── Page sections ── */}
      <Navbar scrolled={scrolled} />
      <HeroSection />
      <FeaturesSection />
      <HeroCarousel />
      <DashboardPreview />
      <TimelineSection />
      <MetricsSection />
      <CtaSection />
      <Footer />
    </>
  )
}

export default App
