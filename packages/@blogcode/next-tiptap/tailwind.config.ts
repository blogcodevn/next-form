import type { Config } from "tailwindcss";
import { BLOGCODE_CSS_PREFIX } from "./src/constants";

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  theme: {
    extend: {},
  },
  prefix: BLOGCODE_CSS_PREFIX,
  plugins: [],
}

export default config;
