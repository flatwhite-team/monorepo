import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2F68A8",
        background: "#FDFCF9",
      },
    },
  },
  plugins: [],
} satisfies Config;
