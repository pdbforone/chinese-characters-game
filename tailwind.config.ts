import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'shake': 'shake 0.5s',
        'pulse-green': 'pulse-green 0.5s',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        'pulse-green': {
          '0%, 100%': { backgroundColor: 'rgb(34 197 94)', transform: 'scale(1)' },
          '50%': { backgroundColor: 'rgb(74 222 128)', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
