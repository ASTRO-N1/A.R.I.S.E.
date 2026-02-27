/**
 * HeroCarousel.jsx
 * ─────────────────────────────────────────────
 * Full-width hero image carousel with:
 *   - Auto-sliding with configurable interval
 *   - Fade + scale transition between slides
 *   - Parallax background movement on mouse move
 *   - Left/right arrow navigation
 *   - Pagination dots with active progress indicator
 *   - Icon badge, title, and subtitle per slide
 *   - Dark gradient overlay for text readability
 *
 * Works beautifully in both light and dark themes.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import {
    TrendUpIcon, ShieldIcon, NetworkIcon,
    SatelliteIcon, BoltIcon,
} from './icons/Icons'

/** Slide duration in milliseconds before auto-advancing */
const SLIDE_INTERVAL = 6000

/** Carousel slide data */
const SLIDES = [
    {
        id: 'warehouse',
        image: '/images/warehouse.png',
        icon: 'network',
        badge: 'Warehouse Automation',
        title: 'Intelligent Warehouse Management',
        subtitle: 'AI-driven inventory placement and pick-path optimization that reduces handling time by 40% and eliminates dead stock.',
    },
    {
        id: 'healthcare',
        image: '/images/healthcare.png',
        icon: 'shield',
        badge: 'Healthcare & Pharma',
        title: 'Critical Supply Assurance',
        subtitle: 'Ensure life-saving supplies are always available while minimizing expiration waste across your pharmaceutical inventory.',
    },
    {
        id: 'retail',
        image: '/images/retail.png',
        icon: 'trendUp',
        badge: 'Retail & E-Commerce',
        title: 'Demand-Driven Distribution',
        subtitle: 'Predict seasonal surges, optimize fulfillment routing, and maintain perfect shelf availability across every channel.',
    },
    {
        id: 'manufacturing',
        image: '/images/manufacturing.png',
        icon: 'satellite',
        badge: 'Smart Manufacturing',
        title: 'Production Line Intelligence',
        subtitle: 'Real-time material requirement planning with AI that adapts to production schedules, supplier delays, and demand shifts.',
    },
    {
        id: 'logistics',
        image: '/images/logistics.png',
        icon: 'bolt',
        badge: 'Logistics & Distribution',
        title: 'End-to-End Supply Visibility',
        subtitle: 'Track, predict, and optimize every node in your distribution network — from last-mile delivery to cross-dock operations.',
    },
]

/** Icon component mapping */
const ICON_MAP = {
    trendUp: TrendUpIcon,
    shield: ShieldIcon,
    network: NetworkIcon,
    satellite: SatelliteIcon,
    bolt: BoltIcon,
}

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 })
    const timerRef = useRef(null)
    const containerRef = useRef(null)

    /** Navigate to a specific slide */
    const goToSlide = useCallback((index) => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrent(index)
        setTimeout(() => setIsTransitioning(false), 600)
    }, [isTransitioning])

    /** Advance to the next slide */
    const nextSlide = useCallback(() => {
        goToSlide((current + 1) % SLIDES.length)
    }, [current, goToSlide])

    /** Go to the previous slide */
    const prevSlide = useCallback(() => {
        goToSlide((current - 1 + SLIDES.length) % SLIDES.length)
    }, [current, goToSlide])

    /* Auto-slide timer */
    useEffect(() => {
        timerRef.current = setInterval(nextSlide, SLIDE_INTERVAL)
        return () => clearInterval(timerRef.current)
    }, [nextSlide])

    /** Reset auto-slide timer when user manually navigates */
    const resetTimer = useCallback(() => {
        clearInterval(timerRef.current)
        timerRef.current = setInterval(nextSlide, SLIDE_INTERVAL)
    }, [nextSlide])

    /** Parallax mouse tracking */
    const handleMouseMove = useCallback((e) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10
        setParallaxOffset({ x, y })
    }, [])

    const handleMouseLeave = useCallback(() => {
        setParallaxOffset({ x: 0, y: 0 })
    }, [])

    const slide = SLIDES[current]
    const IconComponent = ICON_MAP[slide.icon]

    return (
        <section
            className="carousel"
            id="hero-carousel"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* ── Slides ── */}
            {SLIDES.map((s, index) => (
                <div
                    key={s.id}
                    className={`carousel__slide ${index === current ? 'carousel__slide--active' : ''}`}
                    aria-hidden={index !== current}
                >
                    {/* Background image with parallax */}
                    <div
                        className="carousel__image"
                        style={{
                            backgroundImage: `url(${s.image})`,
                            transform: index === current
                                ? `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px) scale(1.08)`
                                : 'scale(1.08)',
                        }}
                    />
                    {/* Dark gradient overlay for text contrast */}
                    <div className="carousel__overlay" />
                </div>
            ))}

            {/* ── Slide Content ── */}
            <div className="carousel__content container" key={current}>
                <div className="carousel__badge">
                    <span className="carousel__badge-icon">
                        <IconComponent size={16} color="var(--neon-amber)" />
                    </span>
                    {slide.badge}
                </div>
                <h2 className="carousel__title">{slide.title}</h2>
                <p className="carousel__subtitle">{slide.subtitle}</p>
            </div>

            {/* ── Navigation Arrows ── */}
            <button
                className="carousel__arrow carousel__arrow--prev"
                onClick={() => { prevSlide(); resetTimer() }}
                aria-label="Previous slide"
                id="carousel-prev"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>
            <button
                className="carousel__arrow carousel__arrow--next"
                onClick={() => { nextSlide(); resetTimer() }}
                aria-label="Next slide"
                id="carousel-next"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 6 15 12 9 18" />
                </svg>
            </button>

            {/* ── Pagination Dots ── */}
            <div className="carousel__dots">
                {SLIDES.map((s, index) => (
                    <button
                        key={s.id}
                        className={`carousel__dot ${index === current ? 'carousel__dot--active' : ''}`}
                        onClick={() => { goToSlide(index); resetTimer() }}
                        aria-label={`Go to slide ${index + 1}: ${s.badge}`}
                    >
                        {index === current && (
                            <span
                                className="carousel__dot-progress"
                                style={{ animationDuration: `${SLIDE_INTERVAL}ms` }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </section>
    )
}
