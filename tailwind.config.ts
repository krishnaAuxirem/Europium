import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#12355B",
          50: "#E8EEF5",
          100: "#C5D3E5",
          200: "#9FB5D2",
          300: "#7896BE",
          400: "#5278AA",
          500: "#12355B",
          600: "#0F2D4F",
          700: "#0C2440",
          800: "#091B31",
          900: "#061222",
        },
        royal: {
          DEFAULT: "#2563EB",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1E40AF",
          800: "#1E3A8A",
          900: "#1E3066",
        },
        gold: {
          DEFAULT: "#D4A72C",
          50: "#FDF8EC",
          100: "#FAEDCA",
          200: "#F5D98F",
          300: "#EFC54E",
          400: "#D4A72C",
          500: "#B88A1F",
          600: "#9A6F14",
          700: "#7C550A",
          800: "#5E3D03",
          900: "#3F2700",
        },
        emerald: {
          DEFAULT: "#16A34A",
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#16A34A",
          600: "#15803D",
          700: "#166534",
          800: "#14532D",
          900: "#052e16",
        },
        soft: "#F8FAFC",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "slide-in": "slideIn 0.3s ease-out forwards",
      },
      backgroundImage: {
        "gradient-navy": "linear-gradient(135deg, #12355B 0%, #1a4a7a 50%, #2563EB 100%)",
        "gradient-gold": "linear-gradient(135deg, #D4A72C 0%, #f0c040 100%)",
        "gradient-hero": "linear-gradient(to bottom, rgba(18,53,91,0.85) 0%, rgba(18,53,91,0.5) 60%, rgba(18,53,91,0.3) 100%)",
      },
      boxShadow: {
        card: "0 2px 8px rgba(18,53,91,0.08), 0 0 0 1px rgba(18,53,91,0.05)",
        "card-hover": "0 8px 24px rgba(18,53,91,0.14), 0 0 0 1px rgba(18,53,91,0.08)",
        glow: "0 0 20px rgba(37,99,235,0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
