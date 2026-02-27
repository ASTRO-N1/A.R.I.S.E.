"use client";
/**
 * GlobeNetwork.jsx
 * ─────────────────────────────────────────────
 * SVG-based holographic warehouse network globe
 * with animated ripple waves emanating from center.
 *
 * Features:
 *   - Pulsing ripple waves expanding from center
 *   - Animated dashed connection lines
 *   - Node pulse animations with staggered delays
 *   - Orbital rotation rings
 *   - Location labels
 */

/**
 * Node positions representing warehouse locations on the globe.
 * Each node has cx, cy coordinates and a radius (r) for visual weight.
 */
const NODES = [
    { cx: 280, cy: 160, r: 5 },
    { cx: 320, cy: 100, r: 4 },
    { cx: 380, cy: 140, r: 6 },
    { cx: 240, cy: 220, r: 4 },
    { cx: 340, cy: 200, r: 7 },
    { cx: 400, cy: 220, r: 5 },
    { cx: 200, cy: 280, r: 5 },
    { cx: 280, cy: 280, r: 8 },
    { cx: 360, cy: 280, r: 5 },
    { cx: 420, cy: 280, r: 4 },
    { cx: 240, cy: 340, r: 6 },
    { cx: 320, cy: 340, r: 5 },
    { cx: 390, cy: 340, r: 4 },
    { cx: 270, cy: 400, r: 4 },
    { cx: 350, cy: 390, r: 5 },
    { cx: 180, cy: 200, r: 3 },
    { cx: 440, cy: 180, r: 3 },
    { cx: 300, cy: 250, r: 3 },
    { cx: 160, cy: 320, r: 3 },
    { cx: 450, cy: 340, r: 3 },
]

/** Edges: pairs of node indices that are connected by lines */
const CONNECTIONS = [
    [0, 1], [0, 3], [0, 4], [1, 2], [1, 4],
    [2, 5], [2, 4], [3, 6], [3, 7], [4, 7],
    [4, 8], [5, 9], [5, 8], [6, 10], [7, 10],
    [7, 11], [8, 12], [9, 12], [10, 13], [11, 13],
    [11, 14], [12, 14], [0, 15], [2, 16], [4, 17],
    [6, 18], [9, 19], [7, 8], [3, 15], [5, 16],
]

/** Ripple wave configuration — 5 waves with staggered delays */
const RIPPLES = [
    { delay: '0s', maxRadius: 220 },
    { delay: '1.2s', maxRadius: 220 },
    { delay: '2.4s', maxRadius: 220 },
    { delay: '3.6s', maxRadius: 220 },
    { delay: '4.8s', maxRadius: 220 },
]

export default function GlobeNetwork() {
    return (
        <div className="globe-container">
            {/* Orbital rings — rotating borders around the globe */}
            <div className="globe-ring" />
            <div className="globe-ring globe-ring--2" />
            <div className="globe-ring globe-ring--3" />

            <svg viewBox="0 0 600 560" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* ── Animated ripple waves from center ── */}
                {RIPPLES.map((ripple, i) => (
                    <circle
                        key={`ripple-${i}`}
                        cx="300"
                        cy="280"
                        r="10"
                        fill="none"
                        stroke="var(--neon-cyan)"
                        strokeWidth="1"
                        opacity="0"
                        style={{
                            animation: `ripple-wave 6s ease-out infinite`,
                            animationDelay: ripple.delay,
                        }}
                    />
                ))}

                {/* Globe wireframe circles (static structure) */}
                <circle cx="300" cy="280" r="180" stroke="rgba(0, 240, 255, 0.06)" strokeWidth="1" fill="none" />
                <circle cx="300" cy="280" r="140" stroke="rgba(0, 240, 255, 0.04)" strokeWidth="1" fill="none" />
                <ellipse cx="300" cy="280" rx="180" ry="80" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="0.8" fill="none" />
                <ellipse cx="300" cy="280" rx="80" ry="180" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="0.8" fill="none" />

                {/* Connection lines with animated dash flow */}
                {CONNECTIONS.map(([a, b], i) => (
                    <line
                        key={`conn-${i}`}
                        x1={NODES[a].cx}
                        y1={NODES[a].cy}
                        x2={NODES[b].cx}
                        y2={NODES[b].cy}
                        stroke="url(#lineGrad)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        opacity="0.4"
                        style={{
                            animation: `dash-flow 2s linear infinite`,
                            animationDelay: `${i * 0.1}s`,
                        }}
                    />
                ))}

                {/* Warehouse nodes */}
                {NODES.map((node, i) => (
                    <g key={`node-${i}`}>
                        {/* Outer glow halo */}
                        <circle cx={node.cx} cy={node.cy} r={node.r * 3} fill="rgba(0, 240, 255, 0.04)" />
                        {/* Core dot with pulse animation */}
                        <circle
                            cx={node.cx}
                            cy={node.cy}
                            r={node.r}
                            fill="var(--neon-cyan)"
                            opacity="0.8"
                            style={{
                                animation: `node-pulse 3s ease-in-out infinite`,
                                animationDelay: `${i * 0.2}s`,
                            }}
                        />
                    </g>
                ))}

                {/* Central radial glow — brighter core */}
                <circle cx="300" cy="280" r="40" fill="url(#centerGlow)" opacity="0.6" />
                <circle cx="300" cy="280" r="16" fill="url(#centerGlowBright)" opacity="0.8" />

                {/* Location labels */}
                <text x="340" y="195" fill="rgba(0, 240, 255, 0.5)" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="1">
                    WAREHOUSE-A1
                </text>
                <text x="200" y="278" fill="rgba(255, 0, 229, 0.4)" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="1">
                    HUB-CENTRAL
                </text>
                <text x="370" y="345" fill="rgba(0, 240, 255, 0.4)" fontSize="7" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="1">
                    DIST-NODE-7
                </text>

                {/* SVG gradient definitions */}
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="var(--neon-magenta)" stopOpacity="0.3" />
                    </linearGradient>
                    <radialGradient id="centerGlow">
                        <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="centerGlowBright">
                        <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity="0.5" />
                        <stop offset="60%" stopColor="var(--neon-cyan)" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                </defs>
            </svg>
        </div>
    )
}

