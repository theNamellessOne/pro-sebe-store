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
    extend: {
      colors: {
        "dark-gray": "#55585c",
        "light-gray": "#d9d9d9",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      layout: {
        borderWidth: {
          medium: "1px",
        },
      },
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#323232",
              foreground: "#e4e4e7",
            },
            secondary: {
              DEFAULT: "#e4e4e7",
              foreground: "#323232",
            },
            focus: "#000",
            foreground: "#323232",
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: colors.amber[500],
              foreground: colors.zinc[950],
            },
            secondary: {
              //... 50 to 900
              DEFAULT: colors.zinc[800],
              foreground: colors.amber[500],
            },
            focus: "#000",
            background: colors.zinc[900],
            foreground: "#fff",
          },
        },
      },
    }),
  ],
};
export default config;
