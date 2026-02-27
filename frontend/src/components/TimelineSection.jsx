/**
 * TimelineSection.jsx
 * ─────────────────────────────────────────────
 * "How It Works" — 4-step timeline with:
 *   - Staggered node entrance animations
 *   - Pulse animation on each node when visible
 *   - Interactive hover scaling
 */

import { TIMELINE_STEPS } from '../constants/content'
import { SatelliteIcon, BrainIcon, ScanIcon, BoltIcon } from './icons/Icons'
import { useInView } from '../hooks/useInView'

const ICON_MAP = {
    satellite: SatelliteIcon,
    brain: BrainIcon,
    scan: ScanIcon,
    bolt: BoltIcon,
}

export default function TimelineSection() {
    const [ref, isVisible] = useInView({ threshold: 0.15 })

    return (
        <section className="timeline-section" id="how-it-works" ref={ref}>
            <div className="container">
                {/* Animated header */}
                <div
                    className="timeline-section__header"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'opacity 0.6s ease, transform 0.6s ease',
                    }}
                >
                    <div className="section-label">Process</div>
                    <h2 className="section-title">How ARISE Works</h2>
                    <p className="section-subtitle">
                        From raw data to actionable intelligence in four seamless stages.
                    </p>
                </div>

                {/* Timeline steps with staggered entrance */}
                <div className="timeline">
                    {TIMELINE_STEPS.map((step, index) => {
                        const IconComponent = ICON_MAP[step.iconType]
                        return (
                            <div
                                className="timeline-step"
                                key={step.id}
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                                    transition: `opacity 0.6s ease ${0.15 + index * 0.15}s, transform 0.6s ease ${0.15 + index * 0.15}s`,
                                }}
                            >
                                <div className="timeline-step__node">
                                    <span className="timeline-step__number">{step.number}</span>
                                    <IconComponent size={28} color="var(--accent-primary)" />
                                </div>
                                <h3 className="timeline-step__title">{step.title}</h3>
                                <p className="timeline-step__desc">{step.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
