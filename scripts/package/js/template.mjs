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
const packageJson = `{
  "name": "\${PACKAGE_NAME}",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "module": "dist/index.js",
  "scripts": {
    "build": "tsc"
  },
  "devDependencies": {
    "typescript": "^5.6.2"
},
  "dependencies": {}
}
`;
const index = `export {}
`;
export const template = {
  "tsconfig.json": tsconfig,
  "package.json": packageJson,
  "src/index.ts": index,
};