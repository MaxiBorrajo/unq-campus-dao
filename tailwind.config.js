import colors from 'tailwindcss/colors';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Marca UNQ (bordó institucional). 700 es el primario.
        primary: {
          DEFAULT: '#7a1827',
          50: '#fdf2f3',
          100: '#fbe5e7',
          200: '#f6c8cd',
          300: '#eda0a9',
          400: '#d86878',
          500: '#b83a4e',
          600: '#962839',
          700: '#7a1827',
          800: '#60121e',
          900: '#4a0d17',
        },
        // Superficies y texto
        surface: {
          DEFAULT: '#f0f0f0', // fondo de página
          card: '#ffffff',
          muted: '#f5f5f5',
          subtle: '#fafafa',
        },
        ink: {
          DEFAULT: '#1f2937',
          muted: '#4b5563',
          subtle: '#6b7280',
          faint: '#9ca3af',
        },
        line: {
          DEFAULT: '#e5e7eb',
          strong: '#d1d5db',
        },
        // Semánticos
        success: colors.emerald,
        danger: colors.red,
        warning: colors.amber,
        info: colors.blue,
        accent: colors.orange, // MetaMask
        // Estados de propuesta que no tienen equivalente semántico
        queued: colors.indigo,
        executed: colors.purple,
      },
      fontFamily: {
        sans: ['Raleway', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }], // 10px
        caption: ['0.6875rem', { lineHeight: '1rem' }], // 11px
      },
      boxShadow: {
        modal: '0 12px 32px rgba(0, 0, 0, 0.18)',
      },
    },
  },
  plugins: [animate],
};
