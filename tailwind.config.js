/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // ── Brand palette — edit CSS vars in src/index.css to retheme the whole app ──
        brand: 'rgb(var(--color-brand) / <alpha-value>)',
        'brand-hover': 'rgb(var(--color-brand-hover) / <alpha-value>)',
        'brand-subtle': 'rgb(var(--color-brand-subtle) / <alpha-value>)',
        // ── Cobalt-blue accent palette — edit CSS vars in src/index.css ──
        'cb-200': 'rgb(var(--cb-200) / <alpha-value>)',
        'cb-300': 'rgb(var(--cb-300) / <alpha-value>)',
        'cb-400': 'rgb(var(--cb-400) / <alpha-value>)',
        'cb-500': 'rgb(var(--cb-500) / <alpha-value>)',
        'cb-600': 'rgb(var(--cb-600) / <alpha-value>)',
        'cb-700': 'rgb(var(--cb-700) / <alpha-value>)',
        'cb-800': 'rgb(var(--cb-800) / <alpha-value>)',
        'cb-850': 'rgb(var(--cb-850) / <alpha-value>)',
        'cb-900': 'rgb(var(--cb-900) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}