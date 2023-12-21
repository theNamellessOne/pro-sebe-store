import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#000",
              foreground: "#fff",
            },
            focus: "#000",
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: colors.amber[500],
              foreground: colors.zinc[950],
            },
            focus: "#000",
          },
        },
      },
    }),
  ],
};
export default config;
