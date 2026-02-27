"use client";
/**
 * Footer.jsx
 * ─────────────────────────────────────────────
 * Minimal footer with brand, copyright, and
 * quick navigation links.
 */

import { NAV_LINKS } from '../constants/content'

export default function Footer() {
    return (
        <footer className="footer" id="footer">
            <div className="container footer__inner">
                <div className="footer__brand">
                    <div className="footer__logo-icon">A</div>
                    <span className="footer__text">
                        ARISE &copy; {new Date().getFullYear()} &mdash; AI-Driven Resource & Inventory Smart Engine
                    </span>
                </div>
                <ul className="footer__links">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <a href={link.href} className="footer__link">{link.label}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    )
}

