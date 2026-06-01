import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        cinzel: ['var(--font-cinzel)', 'serif'],
        manrope: ['var(--font-manrope)', 'sans-serif'],
        sans: ['var(--font-manrope)', 'sans-serif'],
        serif: ['var(--font-cinzel)', 'serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand Specific Semantic Aliases
        gold: {
          DEFAULT: "hsl(var(--primary))",
          leaf: "#D4AF37",
          dark: "#B7950B",
        },
        marian: {
          DEFAULT: "hsl(var(--secondary))",
          midnight: "#0B1224",
        },
        vatican: {
          white: "#FFFDF7",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
        'gradient-night': 'linear-gradient(to bottom, #0B1224, #16233D)',
        'gradient-radial-gold': 'radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
        'gradient-sacred': 'linear-gradient(135deg, #1B2A4A 0%, #2F5AA8 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 20px -5px rgba(212, 175, 55, 0.4)',
        'gold-glow-lg': '0 0 40px -5px rgba(212, 175, 55, 0.5)',
        'sacred': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 20px -5px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 40px -5px rgba(212, 175, 55, 0.5)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.5)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "modal-in": {
          from: { opacity: "0", transform: "translate(-50%, -47%) scale(0.95)" },
          to:   { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        "modal-out": {
          from: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
          to:   { opacity: "0", transform: "translate(-50%, -48%) scale(0.97)" },
        },
        "overlay-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "overlay-out": {
          from: { opacity: "1" },
          to:   { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-up": "fade-up 0.6s ease-out both",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "modal-in": "modal-in 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "modal-out": "modal-out 0.16s ease-in forwards",
        "overlay-in": "overlay-in 0.2s ease-out forwards",
        "overlay-out": "overlay-out 0.18s ease-in forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
