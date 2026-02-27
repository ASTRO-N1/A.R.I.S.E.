"use client";
/**
 * Navbar.jsx
 * ─────────────────────────────────────────────
 * Floating glassmorphism pill navbar.
 *
 * Design:
 *   - Floats with margin from top and sides
 *   - Rounded pill shape with frosted glass background
 *   - Subtle gradient border glow
 *   - Logo left, links center, CTA + theme toggle right
 *   - Smooth scroll-aware background darkening
 *   - Responsive: links collapse on mobile
 */

import { NAV_LINKS } from '../constants/content'
import { ThemeToggle } from './ThemeToggle'
import Link from 'next/link'

/**
 * @param {Object} props
 * @param {boolean} props.scrolled — Whether page is scrolled past 40px
 */
export default function Navbar({ scrolled }) {
    return (
        <header className="navbar-wrapper" id="navbar-wrapper">
            <nav
                className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
                id="navbar"
                role="navigation"
                aria-label="Main navigation"
            >
                {/* Logo */}
                <Link href="/" className="navbar__logo" id="logo" aria-label="ARISE Home">
                    <div className="navbar__logo-icon">
                        {/* Small ARISE diamond logo */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                            <line x1="12" y1="22" x2="12" y2="15.5" />
                            <line x1="22" y1="8.5" x2="15.5" y2="12" />
                            <line x1="2" y1="8.5" x2="8.5" y2="12" />
                        </svg>
                    </div>
                    <span className="navbar__logo-text">ARISE</span>
                </Link>

                {/* Center navigation links with diamond separators */}
                <ul className="navbar__nav">
                    {NAV_LINKS.map((link, i) => (
                        <li key={link.href} className="navbar__nav-item">
                            <Link href={link.href} className="navbar__link">{link.label}</Link>
                            {/* Diamond separator between links */}
                            {i < NAV_LINKS.length - 1 && (
                                <span className="navbar__separator" aria-hidden="true">◆</span>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Right side: theme toggle + CTA */}
                <div className="navbar__actions">
                    <ThemeToggle />
                    <Link href="/select-business" className="navbar__cta flex items-center justify-center p-2 rounded-full font-medium" id="nav-cta">Get Started</Link>
                </div>
            </nav>
        </header>
    )
}

