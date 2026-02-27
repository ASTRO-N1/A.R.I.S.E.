/**
 * ParticleBackground.jsx
 * ─────────────────────────────────────────────
 * Renders a full-screen canvas with floating particles
 * and connecting lines, creating the sci-fi atmosphere.
 *
 * Performance notes:
 *   - Particle count is capped at 80 for smooth 60fps
 *   - Connection check uses squared distance to avoid sqrt
 *   - Canvas resizes on window resize
 *   - Animation is cleaned up on unmount
 */

import { useRef, useEffect } from 'react'

/** Maximum number of particles rendered on canvas */
const PARTICLE_COUNT = 80

/** Max pixel distance for drawing connection lines between particles */
const CONNECTION_DISTANCE = 140

export default function ParticleBackground() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        let animationId

        /* ── Particle class ── */
        class Particle {
            constructor() {
                this.reset()
            }

            /** Initialize with random position, size, speed, and hue */
            reset() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.size = Math.random() * 1.5 + 0.3
                this.speedX = (Math.random() - 0.5) * 0.3
                this.speedY = (Math.random() - 0.5) * 0.3
                this.opacity = Math.random() * 0.4 + 0.1
                // Alternate between cyan (185) and magenta (290) hues
                this.hue = Math.random() > 0.5 ? 185 : 290
            }

            /** Move particle; bounce off edges */
            update() {
                this.x += this.speedX
                this.y += this.speedY
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
            }

            /** Draw particle as a tiny glowing dot */
            draw() {
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`
                ctx.fill()
            }
        }

        /* ── Setup ── */
        const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle())

        function resize() {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        /** Draw faint lines between nearby particles */
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < CONNECTION_DISTANCE) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(0, 240, 255, ${0.04 * (1 - dist / CONNECTION_DISTANCE)})`
                        ctx.lineWidth = 0.5
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.stroke()
                    }
                }
            }
        }

        /** Main render loop */
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            particles.forEach((p) => {
                p.update()
                p.draw()
            })
            drawConnections()
            animationId = requestAnimationFrame(animate)
        }
        animate()

        /* ── Cleanup ── */
        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <div className="particle-bg" aria-hidden="true">
            <canvas ref={canvasRef} />
        </div>
    )
}
