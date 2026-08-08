import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a2e",
        accent: "#0f3460",
        danger: "#e94560",
        success: "#2ecc71",
        warning: "#f39c12",
        info: "#3498db",
      },
    },
  },
  plugins: [],
};
export default config;
