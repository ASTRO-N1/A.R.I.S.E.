/**
 * FeaturesSection.jsx
 * ─────────────────────────────────────────────
 * 3-column feature cards with:
 *   - Staggered scroll-triggered entrance animation
 *   - Subtle 3D tilt on mouse move
 *   - Clean elevation-only hover (no colored glow)
 */

import { useState, useCallback } from 'react'
import { FEATURES } from '../constants/content'
import { TrendUpIcon, ShieldIcon, NetworkIcon } from './icons/Icons'
import { useInView } from '../hooks/useInView'

/** Map icon type strings → icon components */
const ICON_MAP = {
    trendUp: TrendUpIcon,
    shield: ShieldIcon,
    network: NetworkIcon,
}

/** Interactive feature card with subtle 3D tilt */
function FeatureCard({ feature, isVisible, index }) {
    const [tilt, setTilt] = useState({ x: 0, y: 0 })

    const handleMouseMove = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        /* Very subtle tilt: ±5 degrees max */
        setTilt({ x: (y - 0.5) * -5, y: (x - 0.5) * 5 })
    }, [])

    const handleMouseLeave = useCallback(() => {
        setTilt({ x: 0, y: 0 })
    }, [])

    const IconComponent = ICON_MAP[feature.iconType]

    return (
        <article
            className="feature-card"
            id={`feature-${feature.id}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                    ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                    : 'perspective(800px) translateY(60px)',
                transition: isVisible
                    ? 'transform 0.15s ease-out, opacity 0.6s ease, box-shadow 0.4s ease'
                    : `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`,
            }}
        >
            <div className={`feature-card__icon feature-card__icon--${feature.iconVariant}`}>
                <IconComponent size={24} />
            </div>
            <h3 className="feature-card__title">{feature.title}</h3>
            <p className="feature-card__desc">{feature.description}</p>
        </article>
    )
}

export default function FeaturesSection() {
    const [ref, isVisible] = useInView({ threshold: 0.15 })

    return (
        <section className="features" id="features" ref={ref}>
            <div className="container">
                {/* Section header */}
                <div
                    className="features__header"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'opacity 0.6s ease, transform 0.6s ease',
                    }}
                >
                    <div className="section-label">Core Capabilities</div>
                    <h2 className="section-title">Intelligent Supply Chain Control</h2>
                    <p className="section-subtitle">
                        Three pillars of AI-driven inventory optimization, working in harmony
                        to eliminate waste and maximize efficiency.
                    </p>
                </div>

                {/* Feature cards */}
                <div className="features__grid">
                    {FEATURES.map((feature, index) => (
                        <FeatureCard
                            key={feature.id}
                            feature={feature}
                            isVisible={isVisible}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
