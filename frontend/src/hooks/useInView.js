"use client";
/**
 * useInView.js
 * ─────────────────────────────────────────────
 * Custom hook for scroll-triggered animations.
 *
 * Uses IntersectionObserver to detect when an element
 * enters the viewport. Supports:
 *   - One-time trigger (default) or continuous
 *   - Configurable threshold and root margin
 *
 * Usage:
 *   const [ref, isVisible] = useInView({ threshold: 0.2 })
 */

import { useRef, useState, useEffect } from 'react'

/**
 * @param {Object} options
 * @param {number} [options.threshold=0.15] — % of element visible before triggering
 * @param {string} [options.rootMargin='0px'] — margin around root
 * @param {boolean} [options.triggerOnce=true] — if true, stops observing after first trigger
 * @returns {[React.RefObject, boolean]}
 */
export function useInView({
    threshold = 0.15,
    rootMargin = '0px 0px -60px 0px',
    triggerOnce = true,
} = {}) {
    const ref = useRef(null)
    const [isInView, setIsInView] = useState(false)

    useEffect(() => {
        const node = ref.current
        if (!node) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                    if (triggerOnce) observer.unobserve(node)
                } else if (!triggerOnce) {
                    setIsInView(false)
                }
            },
            { threshold, rootMargin }
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [threshold, rootMargin, triggerOnce])

    return [ref, isInView]
}

/**
 * useCountUp — Animated number counter
 *
 * Counts up from 0 to a target value when triggered.
 * Used for KPI metric animations.
 *
 * @param {number|string} target — The target value (e.g., 96.4 or "2.1")
 * @param {boolean} shouldStart — When true, starts counting
 * @param {number} [duration=2000] — Animation duration in ms
 * @param {string} [prefix=''] — Prefix to add (e.g., '$', '+', '-')
 * @param {string} [suffix=''] — Suffix to add (e.g., '%', 'M')
 * @returns {string} — The formatted current count
 */
export function useCountUp(target, shouldStart, duration = 2000, prefix = '', suffix = '') {
    const [count, setCount] = useState(0)
    const numTarget = parseFloat(target) || 0
    const hasDecimal = String(target).includes('.')
    const startedRef = useRef(false)

    useEffect(() => {
        if (!shouldStart || startedRef.current) return
        startedRef.current = true

        const startTime = performance.now()

        function step(currentTime) {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)

            /* Ease-out quad for a natural deceleration */
            const eased = 1 - (1 - progress) * (1 - progress)
            const current = eased * numTarget

            setCount(current)

            if (progress < 1) {
                requestAnimationFrame(step)
            }
        }

        requestAnimationFrame(step)
    }, [shouldStart, numTarget, duration])

    const formatted = hasDecimal ? count.toFixed(1) : Math.round(count)
    return `${prefix}${formatted}${suffix}`
}

