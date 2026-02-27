"use client";
/**
 * Icons.jsx
 * ─────────────────────────────────────────────
 * Custom SVG icon components for ARISE.
 * All icons are minimal, lined, and sci-fi styled.
 * Each icon accepts `size` (px) and `color` props.
 *
 * Usage:
 *   import { TrendUpIcon } from './icons/Icons'
 *   <TrendUpIcon size={24} color="var(--neon-cyan)" />
 */

/**
 * Trend Up — used for "Predict Demand" feature card
 */
export function TrendUpIcon({ size = 24, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    )
}

/**
 * Shield Check — used for "Prevent Stockouts" feature card
 */
export function ShieldIcon({ size = 24, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    )
}

/**
 * Network / Globe — used for "Optimize Multi-Warehouse" feature card
 */
export function NetworkIcon({ size = 24, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}

/**
 * Satellite / Data Ingestion — timeline step 1
 */
export function SatelliteIcon({ size = 24, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 7L9 3 3 9l4 4" />
            <path d="M11 13l4 4 6-6-4-4" />
            <path d="M8 16l-3 3" />
            <circle cx="20" cy="4" r="1.5" fill={color} stroke="none" />
            <path d="M17 7a4.5 4.5 0 0 1 0-6" opacity="0.5" />
        </svg>
    )
}

/**
 * Brain / AI Forecasting — timeline step 2
 */
export function BrainIcon({ size = 24, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a5 5 0 0 1 5 5c0 1.5-.5 2.5-1.5 3.5L12 14" />
            <path d="M12 2a5 5 0 0 0-5 5c0 1.5.5 2.5 1.5 3.5L12 14" />
            <path d="M12 14v8" />
            <path d="M8 18h8" />
            <circle cx="12" cy="6" r="1" fill={color} stroke="none" />
        </svg>
    )
}

/**
 * Scan / Search — Risk Detection — timeline step 3
 */
export function ScanIcon({ size = 24, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
            <path d="M11 8v6" />
            <path d="M8 11h6" />
        </svg>
    )
}

/**
 * Bolt / Lightning — Recommended Actions — timeline step 4
 */
export function BoltIcon({ size = 24, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    )
}

/**
 * Rocket — used for CTA "Launch ARISE" buttons
 */
export function RocketIcon({ size = 24, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
    )
}

/**
 * Play — used for "Watch Demo" button
 */
export function PlayIcon({ size = 24, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
    )
}

/**
 * Sparkle / AI — used for AI recommendation labels
 */
export function SparkleIcon({ size = 16, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
            <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
        </svg>
    )
}

/**
 * Alert Triangle — used for risk alerts
 */
export function AlertIcon({ size = 16, color = 'currentColor' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    )
}

