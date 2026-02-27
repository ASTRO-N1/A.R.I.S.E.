"use client";
/**
 * HeroSection.jsx
 * ─────────────────────────────────────────────
 * The main hero / above-the-fold section.
 *
 * Features:
 *   - Animated headline with gradient text
 *   - Holographic globe network visual (static position)
 *   - Staggered content entrance animations
 *   - Floating glow orbs in background
 */

import GlobeNetwork from './GlobeNetwork'
import { RocketIcon, PlayIcon } from './icons/Icons'
import Link from 'next/link'

export default function HeroSection() {
    return (
        <section className="hero" id="hero">
            {/* Background glow orbs — purely decorative */}
            <div className="hero__bg-glow hero__bg-glow--cyan" aria-hidden="true" />
            <div className="hero__bg-glow hero__bg-glow--magenta" aria-hidden="true" />
            <div className="hero__bg-glow hero__bg-glow--purple" aria-hidden="true" />

            <div className="container hero__inner">
                {/* ── Left: Headlines & CTAs ── */}
                <div className="hero__content">
                    <div className="hero__badge">
                        <span className="hero__badge-dot" />
                        AI-Powered Inventory Intelligence
                    </div>

                    <h1 className="hero__title">
                        Smart Inventory<br />
                        Decisions Under{' '}
                        <span className="hero__title-gradient">Uncertainty</span>
                    </h1>

                    <p className="hero__subtitle">
                        ARISE uses <strong>advanced AI forecasting</strong> and real-time supply chain
                        analytics to predict demand, prevent stockouts, and optimize multi-warehouse
                        operations — turning uncertainty into <strong>confident action</strong>.
                    </p>

                    <div className="btn-group">
                        <Link href="/onboarding" className="btn btn--primary" id="btn-launch">
                            <RocketIcon size={18} color="var(--bg-void)" />
                            Launch ARISE
                        </Link>
                        <a href="#dashboard" className="btn btn--outline" id="btn-demo">
                            <PlayIcon size={16} />
                            Watch Demo
                        </a>
                    </div>
                </div>

                {/* ── Right: Holographic globe (no mouse movement) ── */}
                <div className="hero__visual">
                    <GlobeNetwork />
                </div>
            </div>
        </section>
    )
}

