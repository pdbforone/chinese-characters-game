import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Lesson theme gradients and backgrounds
    'from-slate-900', 'to-slate-800', 'via-slate-900',
    'from-violet-950', 'via-slate-900', 'to-black', 'from-violet-500', 'to-fuchsia-500', 'from-violet-600', 'to-fuchsia-600',
    'from-stone-950', 'via-amber-950', 'from-amber-600', 'to-orange-600', 'from-amber-700', 'to-orange-700',
    'from-emerald-950', 'via-green-900', 'to-stone-900', 'from-emerald-500', 'to-teal-500', 'from-emerald-600', 'to-teal-600',
    'from-rose-950', 'via-orange-950', 'to-amber-950', 'from-rose-500', 'to-pink-500', 'from-rose-600', 'to-pink-600',
    'from-yellow-950', 'via-amber-900', 'to-red-950', 'from-yellow-500', 'to-amber-500', 'from-yellow-600', 'to-amber-600',
    'from-cyan-950', 'via-teal-900', 'from-cyan-500', 'to-teal-500', 'from-cyan-600', 'to-teal-600',
    'from-orange-950', 'from-orange-500', 'to-red-500', 'from-orange-600', 'to-red-600',
    'from-red-950', 'via-rose-900', 'to-purple-950', 'from-red-500', 'to-rose-500', 'from-red-600', 'to-rose-600',
    'from-indigo-500', 'to-purple-500', 'from-indigo-600', 'to-purple-600',
    // Card backgrounds
    'bg-slate-800', 'bg-violet-950/50', 'bg-stone-900/70', 'bg-emerald-950/60', 'bg-rose-950/50',
    'bg-yellow-950/50', 'bg-cyan-950/50', 'bg-orange-950/50', 'bg-red-950/50',
    // Card borders
    'border-slate-700', 'border-violet-800/50', 'border-amber-900/50', 'border-emerald-800/50',
    'border-rose-800/50', 'border-yellow-700/50', 'border-cyan-800/50', 'border-orange-800/50', 'border-red-800/50',
    // Text colors
    'text-white', 'text-slate-300', 'text-slate-400', 'text-slate-500',
    'text-violet-100', 'text-violet-300', 'text-violet-400',
    'text-amber-50', 'text-amber-100', 'text-amber-200', 'text-amber-300/70',
    'text-emerald-50', 'text-emerald-100', 'text-emerald-200', 'text-emerald-300/70',
    'text-rose-50', 'text-rose-100', 'text-rose-200', 'text-rose-300/70',
    'text-yellow-50', 'text-yellow-100', 'text-yellow-200', 'text-yellow-300/70',
    'text-cyan-50', 'text-cyan-100', 'text-cyan-200', 'text-cyan-300/70',
    'text-orange-50', 'text-orange-100', 'text-orange-200', 'text-orange-300/70',
    'text-red-50', 'text-red-100', 'text-red-200', 'text-red-300/70',
    // Streak backgrounds and text
    'bg-amber-500/20', 'border-amber-500/50', 'text-amber-400',
    'bg-fuchsia-500/20', 'border-fuchsia-500/50', 'text-fuchsia-400',
    'bg-orange-500/20', 'border-orange-500/50', 'text-orange-400',
    'bg-lime-500/20', 'border-lime-500/50', 'text-lime-400',
    'bg-pink-500/20', 'border-pink-500/50', 'text-pink-400',
    'bg-yellow-500/20', 'border-yellow-500/50', 'text-yellow-400',
    'bg-teal-500/20', 'border-teal-500/50', 'text-teal-400',
    'bg-red-500/20', 'border-red-500/50', 'text-red-400',
    'bg-rose-500/20', 'border-rose-500/50', 'text-rose-400',
    // Header backgrounds
    'bg-slate-800', 'bg-violet-950/80', 'bg-stone-900/80', 'bg-emerald-950/80',
    'bg-rose-950/80', 'bg-yellow-950/80', 'bg-cyan-950/80', 'bg-orange-950/80', 'bg-red-950/80',
    // Lesson 16-21 theme classes
    // Lesson 16: Iron City (zinc/slate)
    'from-zinc-950', 'to-stone-950', 'bg-zinc-900/60', 'border-zinc-700/50',
    'text-zinc-100', 'text-zinc-300', 'text-zinc-400', 'from-zinc-500', 'to-slate-500',
    'from-zinc-600', 'to-slate-600', 'bg-zinc-900/80', 'bg-slate-500/20', 'border-slate-500/50',
    // Lesson 17: Political Labyrinth (slate/blue)
    'from-slate-950', 'via-blue-950', 'to-gray-950', 'bg-slate-900/60', 'border-blue-900/50',
    'text-slate-100', 'text-blue-100', 'text-blue-200', 'text-blue-300/70', 'from-blue-600',
    'from-blue-700', 'to-slate-700', 'bg-slate-900/80', 'bg-blue-500/20', 'border-blue-500/50', 'text-blue-400',
    // Lesson 18: Sky Tailor Workshop (sky/indigo)
    'from-sky-950', 'via-indigo-950', 'to-violet-950', 'bg-sky-950/50', 'border-sky-800/50',
    'text-sky-50', 'text-sky-100', 'text-sky-200', 'text-sky-300/70', 'from-sky-500', 'to-indigo-500',
    'from-sky-600', 'to-indigo-600', 'bg-sky-950/80', 'bg-indigo-500/20', 'border-indigo-500/50', 'text-indigo-400',
    // Lesson 19: Sound Mirror Temple (purple/fuchsia)
    'from-purple-950', 'via-fuchsia-950', 'bg-purple-950/50', 'border-purple-800/50',
    'text-purple-50', 'text-purple-100', 'text-purple-200', 'text-purple-300/70',
    'from-purple-500', 'from-purple-600', 'bg-purple-950/80',
    // Lesson 20: Serpent's Pond (green/lime)
    'from-green-950', 'via-lime-950', 'to-emerald-950', 'bg-green-950/50', 'border-green-800/50',
    'text-green-50', 'text-green-100', 'text-green-200', 'text-green-300/70', 'from-green-500', 'to-lime-500',
    'from-green-600', 'to-lime-600', 'bg-green-950/80',
    // Lesson 21: Forgetting Factory (gray/neutral)
    'from-gray-950', 'via-neutral-900', 'bg-gray-900/60', 'border-gray-700/50',
    'text-gray-100', 'text-gray-300', 'text-gray-400', 'from-gray-500', 'to-neutral-500',
    'from-gray-600', 'to-neutral-600', 'bg-gray-900/80', 'bg-neutral-500/20', 'border-neutral-500/50', 'text-neutral-400',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        shake: "shake 0.5s",
        "pulse-green": "pulse-green 0.5s",
        "slide-up": "slide-up 0.3s ease-out",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        "pulse-green": {
          "0%, 100%": {
            backgroundColor: "rgb(34 197 94)",
            transform: "scale(1)",
          },
          "50%": {
            backgroundColor: "rgb(74 222 128)",
            transform: "scale(1.05)",
          },
        },
        "slide-up": {
          "0%": {
            transform: "translateY(100px) translateX(-50%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0) translateX(-50%)",
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
