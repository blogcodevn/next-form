const tsconfig = `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": false,
    "declaration": true,
    "declarationDir": "dist",
    "outDir": "dist"
  },
  "include": ["src"]
}
`;
const tailwind = `import type { Config } from "tailwindcss";

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config;
`;
const postcss = `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
`;
const packageJson = `{
  "name": "\${PACKAGE_NAME}",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "module": "dist/index.js",
  "scripts": {
    "build:css": "postcss src/style.css -o dist/style.css",
    "build:lib": "tsc",
    "build": "yarn build:css && yarn build:lib"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "postcss-cli": "^11.0.0",
    "postcss-import": "^16.1.0",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.2"
  },
  "dependencies": {}
}
`;
const preset = `const config = {
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config;
`;
const style = `@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
`;
const index = `export {}
`;
export const template = {
  "tsconfig.json": tsconfig,
  "tailwind.config.ts": tailwind,
  "postcss.config.mjs": postcss,
  "package.json": packageJson,
  "src/preset.ts": preset,
  "src/style.css": style,
  "src/index.ts": index,
};