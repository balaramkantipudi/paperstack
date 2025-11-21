import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gilroy: ["Inter Tight", "Arial", "sans-serif"],
        dmsans: ["Space Grotesk", "Arial", "sans-serif"],
        roboto: ["Lora", "Georgia", "serif"],
      },
      colors: {
        brand: {
          // Palette Option 1: Warm Teal (Trust + Efficiency)
          teal: {
            50: "#eef6f6",
            100: "#d7eaea",
            200: "#afd5d5",
            300: "#87c0c0",
            400: "#5fabab",
            500: "#3d8f8f",
            600: "#317272",
            700: "#255656",
            800: "#183939",
            900: "#0c1d1d",
            DEFAULT: "#3d8f8f",
          },
          // Palette Option 2: Warm Earth (Construction + Premium)
          earth: {
            50: "#f9f5f0",
            100: "#f0e9df",
            200: "#e1d3bf",
            300: "#d2bd9f",
            400: "#c3a77f",
            500: "#b49163",
            600: "#9a7a53",
            700: "#735c3f",
            800: "#4d3d2a",
            900: "#261f15",
            DEFAULT: "#9a7a53",
          },
          // Palette Option 3: Slate Blue (Trust + Modern)
          slate: {
            50: "#f2f4f8",
            100: "#e3e7ee",
            200: "#c7cfdd",
            300: "#aab7cc",
            400: "#8e9fbb",
            500: "#7287aa",
            600: "#5b6d8f",
            700: "#45526b",
            800: "#2e3648",
            900: "#171b24",
            DEFAULT: "#5b6d8f",
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        dividerWeight: "1px", 
        disabledOpacity: 0.45, 
        fontSize: {
          tiny: "0.75rem",   // 12px
          small: "0.875rem", // 14px
          medium: "0.9375rem", // 15px
          large: "1.125rem", // 18px
        },
        lineHeight: {
          tiny: "1rem", 
          small: "1.25rem", 
          medium: "1.5rem", 
          large: "1.75rem", 
        },
        radius: {
          small: "6px", 
          medium: "8px", 
          large: "12px", 
        },
        borderWidth: {
          small: "1px", 
          medium: "1px", 
          large: "2px", 
        },
      },
      themes: {
        light: {
          colors: {
            primary: {
          50: "#D1E8E2",
          100: "#A3D4C5",
          200: "#75BFA8",
          300: "#47AA8B",
          400: "#1B4F42", // Forest Green primary
          500: "#1B4F42",
          600: "#18453B",
          700: "#153B33",
          800: "#13312B",
          900: "#102723",
          DEFAULT: "#1B4F42",
          foreground: "#FFFFFF"
        },
        secondary: {
          50: "#F5ECE5",
          100: "#EAD9CB",
          200: "#DFC6B1",
          300: "#D4B397",
          400: "#B89778", // Muted Gold secondary
          500: "#A3835E",
          600: "#8B6F47",
          700: "#735C30",
          800: "#5B4719",
          900: "#433302",
          DEFAULT: "#B89778",
          foreground: "#FFFFFF"
        }
          }
        }
      }
    })
  ]
}