import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        viewSubmission: '#B7AB98',
        lightcream: '#C6BEAF',
        lightcream2: '#484848',
        gray1: '#202020',
        dark: '#131313', // For the background
        accent: '#F14A16', // For the border, buttons
        lightGray: '#4D4D4D80', // Semi-transparent gray background
        cream: '#B7AB98',
        dark2: '#1F1F1F',
        green2: '#1BA94C',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')], // eslint-disable-line @typescript-eslint/no-require-imports -- Tailwind loads CJS plugins by design
  // The app builds accent classes via template interpolation (e.g. `bg-[${ACCENT_GREEN}]`),
  // which Tailwind's static scan cannot see. Safelist the concrete classes they produce.
  safelist: [
    'bg-[#1ba94c]',
    'bg-[#1ba94c]/10',
    'bg-[#1ba94c]/20',
    'bg-[#1ba94c]/30',
    'bg-[#1ba94c]/70',
    'hover:bg-[#1ba94c]',
    'hover:bg-[#1ba94c]/10',
    'hover:bg-[#1ba94c]/20',
    'hover:bg-[#1ba94c]/30',
    'focus:bg-[#1ba94c]/20',
    'focus:bg-[#1ba94c]/30',
    'data-[state=checked]:bg-[#1ba94c]',
    'data-[state=checked]:text-[#1ba94c]',
    'data-[state=indeterminate]:bg-[#1ba94c]',
    'data-[state=indeterminate]:text-[#1ba94c]',
    'data-[state=open]:bg-[#1ba94c]/10',
    'data-[state=open]:border-[#1ba94c]/70',
    'border-[#1ba94c]',
    'border-[#1ba94c]/20',
    'border-[#1ba94c]/30',
    'border-[#1ba94c]/40',
    'border-[#1ba94c]/50',
    'border-[#1ba94c]/70',
    'hover:border-[#1ba94c]',
    'hover:border-[#1ba94c]/70',
    'text-[#1ba94c]',
    'hover:text-[#1ba94c]',
    'group-hover:text-[#1ba94c]',
    'group-data-[state=open]:text-[#1ba94c]',
    'focus:border-[#1ba94c]',
    'focus:ring-[#1ba94c]',
    'focus-visible:ring-[#1ba94c]',
    'focus-visible:ring-offset-[#182319]',
    'shadow-[#1ba94c]/30',
    'shadow-[#1ba94c]/50',
    'from-[#1ba94c]',
    'to-[#15803d]',
    'bg-[#15803d]',
    'hover:bg-[#15803d]',
  ],
} satisfies Config;
