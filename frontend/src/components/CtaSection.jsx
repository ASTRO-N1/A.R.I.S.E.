/**
 * CtaSection.jsx
 * ─────────────────────────────────────────────
 * Bottom call-to-action with animated entrance
 * and interactive hover effects.
 */

import { RocketIcon } from './icons/Icons'
import { useInView } from '../hooks/useInView'

export default function CtaSection() {
    const [ref, isVisible] = useInView({ threshold: 0.3 })

    return (
        <section className="cta-section" id="cta" ref={ref}>
            <div className="container">
                <div
                    className="cta-box"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
                        transition: 'opacity 0.7s ease, transform 0.7s ease',
                    }}
                >
                    <div className="section-label">Get Started</div>
                    <h2 className="cta-box__title">Ready to Optimize Your Supply Chain?</h2>
                    <p className="cta-box__subtitle">
                        Join industry leaders using ARISE to transform inventory management
                        with the power of AI.
                    </p>
                    <div className="btn-group">
                        <button className="btn btn--primary" id="cta-launch">
                            <RocketIcon size={18} color="var(--bg-void)" />
                            Launch ARISE
                        </button>
                        <a href="#features" className="btn btn--outline" id="cta-learn">
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
