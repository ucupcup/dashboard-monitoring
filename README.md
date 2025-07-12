# 🚀 React + TypeScript + Vite Starter Template

![Vite](https://img.shields.io/badge/Vite-4.x-purple?style=flat&logo=vite)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

A **lightweight and scalable** boilerplate to jumpstart your next **React** project with **Vite**, **TypeScript**, and an extensible **ESLint** setup. Designed for fast development, clean code, and a great developer experience — complete with **Hot Module Replacement (HMR)** and modern tooling.

---

## ⚙️ Features

- ⚛️ **React 18** — The latest React features out of the box  
- ⚡ **Vite 4** — Lightning-fast bundler and dev server  
- 🔷 **TypeScript 5** — Static typing with full IDE support  
- 🧼 **ESLint** — Pre-configured for strict and scalable code linting  
- 🔄 **HMR (Hot Module Replacement)** — Live preview on save  
- 🧩 Ready for plugin and tooling extensions

---

## 📁 Project Structure

```bash
├── src/               # Application source code
├── public/            # Static assets
├── tsconfig.*.json    # TypeScript configuration files
├── vite.config.ts     # Vite configuration
└── eslint.config.js   # ESLint configuration
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
npm install
# or
yarn install
npm run dev
# or
yarn dev
npm run build
# or
yarn build
npm run lint
