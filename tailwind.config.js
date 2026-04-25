/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F8F6F2',
        card: '#FFFFFF',
        sand: '#E8E0D5',
        sandsoft: '#EFE7DB',
        ink: '#2C2C2C',
        muted: '#9A8E80',
        subtle: '#B5A89A',
        line: 'rgba(44,44,44,0.08)',
        sage: '#D9E4D5',
        'sage-ink': '#5C7B6F',
        peach: '#F0DFD2',
        'peach-ink': '#9C6B4F',
        mauve: '#E8D5D5',
        'mauve-ink': '#8B5A5F',
        mint: '#D5E4DD',
        'mint-ink': '#4F7368',
        wheat: '#EBE2D5',
        'wheat-ink': '#7B6F5C',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '14px',
      },
      boxShadow: {
        soft: '0 1px 0 rgba(44,44,44,0.04), 0 1px 2px rgba(44,44,44,0.04)',
      },
    },
  },
  plugins: [],
};
