import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../utils/scroll'

/**
 * 星空粒子背景（Canvas）。
 * - 粒子为冷白光，拒绝彩色。
 * - 移动端性能降级：粒子数量与屏幕面积挂钩、限制 devicePixelRatio、后台自动暂停。
 * - 严格尊重 prefers-reduced-motion：开启减少动画时不启动动画循环。
 */

interface Particle {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  twinkle: number
  twinkleSpeed: number
}

export default function StarBackground(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 开启“减少动画”时：只绘制一帧静态星空，不启动循环
    if (prefersReducedMotion()) {
      drawStatic(canvas, ctx)
      return
    }

    let rafId = 0
    let particles: Particle[] = []
    let width = 0
    let height = 0

    const resize = () => {
      const isMobile = window.innerWidth < 640
      // 移动端限制 DPR 为 1，降低像素填充压力，保证 ≥50fps
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // 粒子数量与屏幕面积挂钩，移动端更少
      const area = width * height
      const count = Math.min(140, Math.max(30, Math.floor(area / 9000)))
      particles = Array.from({ length: count }, () => makeParticle(width, height))
    }

    const tick = () => {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.twinkle += p.twinkleSpeed

        // 边界回绕
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        const alpha = 0.25 + Math.abs(Math.sin(p.twinkle)) * 0.55
        ctx.beginPath()
        ctx.fillStyle = `rgba(230, 234, 242, ${alpha})` // 冷白光
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      rafId = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      // 页面不可见时暂停，可见时恢复
      if (document.hidden) {
        cancelAnimationFrame(rafId)
      } else {
        cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(tick)
      }
    }

    resize()
    rafId = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}

function makeParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.2 + 0.3,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.12,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.02 + 0.005
  }
}

/** 减少动画偏好下：仅绘制一帧静态星空 */
function drawStatic(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  canvas.width = width * dpr
  canvas.height = height * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const count = Math.min(120, Math.floor((width * height) / 12000))
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const r = Math.random() * 1.2 + 0.3
    ctx.beginPath()
    ctx.fillStyle = `rgba(230, 234, 242, ${0.25 + Math.random() * 0.4})`
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
}
