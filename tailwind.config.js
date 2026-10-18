/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 页面底色：深黑灰
        void: '#0B0F1A',
        // 面板卡片底色
        panel: '#1c1c1c',
        'panel-2': '#141821',
        // 金属描边色阶（冷灰银）
        steel: '#2a2f3a',
        'steel-light': '#3a4150',
        // 文字
        ink: '#E6EAF2',
        'ink-dim': '#9ca3af',
        // 点缀色：暗金（禁用亮蓝主色）
        gold: '#b8963e',
        'gold-bright': '#d4af37',
        'gold-dim': '#8a6d2f',
        // 冷灰银高光
        silver: '#8a93a6',
        // 危险 / 成功反馈色
        danger: '#b3423d',
        'danger-bright': '#e06c65',
        success: '#6f9d6f'
      },
      fontFamily: {
        display: ['Rajdhani', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      borderRadius: {
        panel: '8px'
      },
      boxShadow: {
        metal:
          'inset 0 0 0 1px rgba(138,147,166,0.08), 0 1px 2px rgba(0,0,0,0.55)',
        'metal-glow':
          '0 0 0 1px rgba(184,150,62,0.35), 0 0 18px rgba(184,150,62,0.14), inset 0 0 0 1px rgba(184,150,62,0.12)',
        'metal-silver-glow':
          '0 0 0 1px rgba(138,147,166,0.30), 0 0 14px rgba(138,147,166,0.10)'
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out',
        'slide-up': 'slideUp 0.4s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
}
