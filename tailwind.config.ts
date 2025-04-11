import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';
export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: " #0080FF",
          600: "	#2894FF",
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config;
