"use client";
/**
 * DashboardPreview.jsx
 * ─────────────────────────────────────────────
 * Widescreen sci-fi analytics dashboard preview.
 * Shows line charts, warehouse heatmap, SKU velocity
 * bar chart, and AI recommendation cards — all
 * rendered inside glassmorphism panels.
 *
 * This is a static visual preview, not interactive data.
 */

import { AI_RECOMMENDATIONS, BAR_DATA, CHART_LINES } from '../constants/content'
import { SparkleIcon, AlertIcon } from './icons/Icons'
import { useInView } from '../hooks/useInView'

/* ─── Internal sub-component: SVG line chart ─── */
function LineChart() {
    return (
        <svg viewBox="0 0 600 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Horizontal grid lines */}
            {[36, 72, 108, 144].map((y) => (
                <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(0,240,255,0.05)" strokeWidth="0.5" />
            ))}

            {/* Area fills beneath the lines */}
            <polygon points={`${CHART_LINES.primary} 600,180 0,180`} fill="url(#areaGrad1)" />
            <polygon points={`${CHART_LINES.secondary} 600,180 0,180`} fill="url(#areaGrad2)" />

            {/* Trend lines */}
            <polyline points={CHART_LINES.secondary} stroke="var(--neon-magenta)" strokeWidth="2" fill="none" opacity="0.7" />
            <polyline points={CHART_LINES.primary} stroke="var(--neon-cyan)" strokeWidth="2" fill="none" />

            {/* Data point dots on primary line */}
            {CHART_LINES.primary.split(' ').map((p, i) => {
                const [x, y] = p.split(',')
                return <circle key={i} cx={x} cy={y} r="3" fill="var(--neon-cyan)" opacity="0.8" />
            })}

            {/* Gradient definitions */}
            <defs>
                <linearGradient id="areaGrad1" x1="0" y1="0" x2="0" y2="180">
                    <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--neon-cyan)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="180">
                    <stop offset="0%" stopColor="var(--neon-magenta)" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="var(--neon-magenta)" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    )
}

/* ─── Heatmap data (stable — not regenerated on re-render) ─── */
const HEATMAP_DATA = [
    0.92, 0.34, 0.67, 0.21, 0.85, 0.45, 0.73,
    0.18, 0.56, 0.89, 0.42, 0.61, 0.33, 0.78,
    0.95, 0.27, 0.53, 0.81, 0.39, 0.69, 0.15,
    0.88, 0.44, 0.72, 0.58, 0.36, 0.91, 0.25,
]

/** Map utilization value to a color intensity */
function getHeatmapColor(value) {
    if (value > 0.8) return 'rgba(255, 0, 229, 0.7)'
    if (value > 0.6) return 'rgba(0, 240, 255, 0.6)'
    if (value > 0.4) return 'rgba(0, 240, 255, 0.35)'
    if (value > 0.2) return 'rgba(0, 240, 255, 0.18)'
    return 'rgba(0, 240, 255, 0.06)'
}

export default function DashboardPreview() {
    const [ref, isVisible] = useInView()
    const maxBar = Math.max(...BAR_DATA)

    return (
        <section
            className="dashboard-section"
            id="dashboard"
            ref={ref}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
        >
            <div className="container">
                {/* Section header */}
                <div className="dashboard-section__header">
                    <div className="section-label">Live Interface</div>
                    <h2 className="section-title">Command Center Dashboard</h2>
                    <p className="section-subtitle">
                        A unified control surface for monitoring every dimension of your supply chain in real time.
                    </p>
                </div>

                {/* Dashboard glass panel */}
                <div className="dashboard-preview" id="dashboard-preview">
                    {/* Window chrome */}
                    <div className="dash-topbar">
                        <div className="dash-topbar__left">
                            <div className="dash-topbar__dots">
                                <span className="dash-topbar__dot dash-topbar__dot--red" />
                                <span className="dash-topbar__dot dash-topbar__dot--yellow" />
                                <span className="dash-topbar__dot dash-topbar__dot--green" />
                            </div>
                            <span className="dash-topbar__title">ARISE Control Center v2.4</span>
                        </div>
                        <div className="dash-topbar__status">
                            <span className="dash-topbar__status-dot" />
                            All Systems Nominal
                        </div>
                    </div>

                    {/* Main dashboard grid layout */}
                    <div className="dash-grid">
                        {/* ── Panel: Demand Forecast Chart ── */}
                        <div className="dash-panel" id="panel-forecast">
                            <div className="dash-panel__header">
                                <span className="dash-panel__title">Demand Forecast — 12 Week Trend</span>
                                <span className="dash-panel__badge">▲ 12.4%</span>
                            </div>
                            <div className="chart-area">
                                <LineChart />
                            </div>
                        </div>

                        {/* ── Panel: AI Recommendations ── */}
                        <div className="dash-panel" id="panel-ai" style={{ gridRow: 'span 2' }}>
                            <div className="dash-panel__header">
                                <span className="dash-panel__title">AI Recommendations</span>
                            </div>
                            <div className="ai-cards">
                                {AI_RECOMMENDATIONS.map((rec) => (
                                    <div className="ai-card" key={rec.id}>
                                        <div className="ai-card__label">
                                            {rec.type === 'risk' ? (
                                                <AlertIcon size={12} color="var(--neon-amber)" />
                                            ) : (
                                                <SparkleIcon size={12} color="var(--neon-cyan)" />
                                            )}
                                            {rec.label}
                                        </div>
                                        <p
                                            className="ai-card__text"
                                            dangerouslySetInnerHTML={{ __html: rec.text }}
                                        />
                                        <div className="ai-card__meta">
                                            <span className={`ai-card__confidence ai-card__confidence--${rec.confidenceLevel}`}>
                                                {rec.confidence}% confidence
                                            </span>
                                            <span>{rec.impact}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Panel: Heatmap + Bar Chart ── */}
                        <div className="dash-panel" id="panel-bottom" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {/* Warehouse heatmap */}
                            <div>
                                <div className="dash-panel__header">
                                    <span className="dash-panel__title">Warehouse Heat Map</span>
                                </div>
                                <div className="heatmap-grid">
                                    {HEATMAP_DATA.map((v, i) => (
                                        <div
                                            key={i}
                                            className="heatmap-cell"
                                            style={{ background: getHeatmapColor(v), color: getHeatmapColor(v) }}
                                            title={`Utilization: ${Math.round(v * 100)}%`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* SKU velocity bar chart */}
                            <div>
                                <div className="dash-panel__header">
                                    <span className="dash-panel__title">SKU Velocity</span>
                                    <span className="dash-panel__badge">Top 10</span>
                                </div>
                                <div className="bar-chart">
                                    {BAR_DATA.map((v, i) => (
                                        <div
                                            key={i}
                                            className="bar-chart__bar"
                                            style={{
                                                height: `${(v / maxBar) * 100}%`,
                                                background: i % 2 === 0
                                                    ? 'linear-gradient(to top, rgba(0,240,255,0.3), rgba(0,240,255,0.7))'
                                                    : 'linear-gradient(to top, rgba(255,0,229,0.3), rgba(255,0,229,0.6))',
                                                color: i % 2 === 0 ? 'rgba(0,240,255,0.7)' : 'rgba(255,0,229,0.6)',
                                            }}
                                            title={`Velocity: ${v}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

