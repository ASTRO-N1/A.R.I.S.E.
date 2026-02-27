"use client";
/**
 * MetricsSection.jsx
 * ─────────────────────────────────────────────
 * KPI cards with animated count-up numbers.
 *
 * When the section scrolls into view:
 *   1. Cards stagger in with fade-up animation
 *   2. Numbers count up from 0 to their final value
 *   3. Cards gently float with offset delays
 */

import { METRICS } from '../constants/content'
import { useInView, useCountUp } from '../hooks/useInView'

/** Parse metric value into components for animated counting */
function parseMetricValue(value) {
    const match = value.match(/^([+\-$]*)(\d+\.?\d?)([%M]*)$/)
    if (!match) return { prefix: '', number: value, suffix: '' }
    return { prefix: match[1], number: match[2], suffix: match[3] }
}

/** Single metric card with animated value */
function MetricCard({ metric, isVisible, index }) {
    const { prefix, number, suffix } = parseMetricValue(metric.value)
    const animatedValue = useCountUp(number, isVisible, 2200 + index * 200, prefix, suffix)

    return (
        <article
            className="metric-card"
            id={`metric-${metric.id}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s ease ${index * 0.15}s`,
                animationDelay: `${index}s`,
            }}
        >
            <span className={`metric-card__badge metric-card__badge--${metric.badgeVariant}`}>
                {metric.badge}
            </span>
            <div className={`metric-card__value metric-card__value--${metric.valueVariant}`}>
                {isVisible ? animatedValue : '0'}
            </div>
            <p className="metric-card__label">{metric.label}</p>
        </article>
    )
}

export default function MetricsSection() {
    const [ref, isVisible] = useInView({ threshold: 0.2 })

    return (
        <section className="metrics-section" id="metrics" ref={ref}>
            <div className="container">
                {/* Section header with stagger */}
                <div
                    className="metrics-section__header"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'opacity 0.6s ease, transform 0.6s ease',
                    }}
                >
                    <div className="section-label">Impact</div>
                    <h2 className="section-title">Proven Results Across Industries</h2>
                    <p className="section-subtitle">
                        Real metrics from enterprise clients deploying ARISE at scale.
                    </p>
                </div>

                {/* KPI cards with staggered animation */}
                <div className="metrics-grid">
                    {METRICS.map((metric, index) => (
                        <MetricCard
                            key={metric.id}
                            metric={metric}
                            isVisible={isVisible}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

