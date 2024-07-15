import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        md: "800px",
        lg: "1024px",
      },
      colors: {
        primary: "#8020f0",
        grey: "#3f3f3f",
        "light-grey": "#b2b2b2",
        "dark-grey": "#242424",
        "dark-white": "#f6f6f6",
        "light-black": "#121212",
      },
    },
  },
  plugins: [],
};
export default config;
