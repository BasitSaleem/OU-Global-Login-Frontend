import type { Config } from 'tailwindcss';

const config: Config = {
  important: true,
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Primary Color
        primary: {
          DEFAULT: '#795CF5',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#795CF5',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          light: '#F5F3FF',
        },

        // Portal/Brand Accent Colors
        accent: {
          pink: '#B11E67',
          orange: '#FF7C3B',
          coral: '#F95C5B',
          yellow: '#FFCB00',
          teal: '#137F6A',
          cyan: '#1AD1B9',
        },

        // State Colors
        info: {
          DEFAULT: '#007BFF',
          50: '#E6F3FF',
          100: '#CCE7FF',
          200: '#99CFFF',
          300: '#66B7FF',
          400: '#339FFF',
          500: '#007BFF',
          600: '#0066CC',
          700: '#004C99',
          800: '#003366',
          900: '#001933',
        },

        success: {
          DEFAULT: '#28A745',
          50: '#F0F9F3',
          100: '#DCF2E3',
          200: '#BBE5C7',
          300: '#91D4A7',
          400: '#66C087',
          500: '#28A745',
          600: '#218838',
          700: '#1E7E34',
          800: '#155724',
          900: '#0F4419',
        },

        warning: {
          DEFAULT: '#FF7C3B',
          50: '#FFF4F0',
          100: '#FFE9E0',
          200: '#FFD3C1',
          300: '#FFBDA2',
          400: '#FFA783',
          500: '#FF7C3B',
          600: '#FF5722',
          700: '#E64100',
          800: '#BF360C',
          900: '#8D2F00',
        },

        error: {
          DEFAULT: '#D1202D',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#D1202D',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },

        // Override default gray with our brand gray
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB', // Stroke Color
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280', // Normal Text Color
          600: '#4B5563', // Icon Color
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },

        // Black and White
        black: '#000000',
        white: '#FFFFFF',
      },

      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        inter: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },

      // Professional Typography System - Jira-like compact sizes
      fontSize: {
        // Heading Typography (Inter)
        'heading-1': ['16px', { lineHeight: '20px', fontWeight: '600' }],
        'heading-2': ['14px', { lineHeight: '18px', fontWeight: '600' }],
        'heading-3': ['13px', { lineHeight: '16px', fontWeight: '600' }],

        // Body Typography (Inter)
        'body-large': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-large-bold': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'body-medium': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'body-medium-bold': ['13px', { lineHeight: '18px', fontWeight: '500' }],
        'body-small': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'body-small-bold': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'body-tiny': ['11px', { lineHeight: '14px', fontWeight: '400' }],

        // Override default Tailwind sizes
        'xs': ['11px', { lineHeight: '14px' }],
        'sm': ['12px', { lineHeight: '16px' }],
        'base': ['13px', { lineHeight: '18px' }],
        'lg': ['14px', { lineHeight: '20px' }],
        'xl': ['16px', { lineHeight: '20px' }],
        '2xl': ['18px', { lineHeight: '22px' }],
      },

      spacing: {
        '0.5': '0.125rem', // 2px
        '1.5': '0.375rem', // 6px
        '2.5': '0.625rem', // 10px
        '3.5': '0.875rem', // 14px
        '4.5': '1.125rem', // 18px
        '5.5': '1.375rem', // 22px
        '6.5': '1.625rem', // 26px
        '7.5': '1.875rem', // 30px
        '8.5': '2.125rem', // 34px
        '9.5': '2.375rem', // 38px
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },

      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;


//bgcolor: bg-gray-900
//bg card: bg-gray-800
//bg card border: bg-gray-700