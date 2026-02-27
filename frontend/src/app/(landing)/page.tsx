"use client";

import { useState, useEffect } from 'react'
import ParticleBackground from '@/components/ParticleBackground'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import HeroCarousel from '@/components/HeroCarousel'
import DashboardPreview from '@/components/DashboardPreview'
import TimelineSection from '@/components/TimelineSection'
import MetricsSection from '@/components/MetricsSection'
import CtaSection from '@/components/CtaSection'
import Footer from '@/components/Footer'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="togemini-landing">
      {/* Ambient background layers */}
      <ParticleBackground />
      <div className="grid-overlay" aria-hidden="true" />
      <div className="data-streams" aria-hidden="true">
        <div className="data-stream" />
        <div className="data-stream" />
        <div className="data-stream" />
        <div className="data-stream" />
        <div className="data-stream" />
      </div>

      <Navbar scrolled={scrolled} />
      <HeroSection />
      <FeaturesSection />
      <HeroCarousel />
      <DashboardPreview />
      <TimelineSection />
      <MetricsSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
