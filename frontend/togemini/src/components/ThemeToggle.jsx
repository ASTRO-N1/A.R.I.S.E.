/**
 * ThemeToggle.jsx
 * ─────────────────────────────────────────────
 * Animated sun/moon toggle button for switching
 * between light and dark themes. Persists choice
 * to localStorage and respects system preference
 * on first visit.
 */

import { useState, useEffect } from 'react'

/** localStorage key for theme persistence */
const STORAGE_KEY = 'arise-theme'

/**
 * Detects the user's preferred theme on first visit.
 * Priority: localStorage > system preference > dark default
 */
function getInitialTheme() {
    if (typeof window === 'undefined') return 'dark'
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
    if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light'
    return 'dark'
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState(getInitialTheme)

    /* Apply theme to document root and persist */
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem(STORAGE_KEY, theme)
    }, [theme])

    const toggle = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    const isDark = theme === 'dark'

    return (
        <button
            className="theme-toggle"
            onClick={toggle}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            id="theme-toggle"
        >
            <div className={`theme-toggle__track ${isDark ? 'theme-toggle__track--dark' : 'theme-toggle__track--light'}`}>
                <div className="theme-toggle__thumb">
                    {isDark ? (
                        /* Moon icon */
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    ) : (
                        /* Sun icon */
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    )}
                </div>
            </div>
        </button>
    )
}
