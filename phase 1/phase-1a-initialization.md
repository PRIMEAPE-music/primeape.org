# PHASE 1A: PROJECT INITIALIZATION & CONFIGURATION

## Part Overview
Set up the core project configuration files and dependencies. This creates the foundation for the entire build system.

## What Gets Created
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript compiler configuration
- `tsconfig.node.json` - TypeScript config for Vite
- `vite.config.ts` - Vite build tool configuration
- `.eslintrc.cjs` - ESLint code quality rules
- `.prettierrc` - Prettier formatting rules
- `.gitignore` - Git exclusion patterns

## Step-by-Step Instructions

### Step 1: Initialize Project with Vite

If starting completely fresh, run:
```bash
npm create vite@latest . -- --template react-ts
```

If the command asks to install `create-vite`, type `y` and press Enter.

When prompted:
- Package name: `primeape-foundation`
- Select framework: `React`
- Select variant: `TypeScript`

### Step 2: Create package.json

**File:** `package.json`

Replace the default package.json with this complete version:

```json
{
  "name": "primeape-foundation",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "prettier": "^3.1.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

**Important Notes:**
- We're using React 18 for concurrent features
- TypeScript 5.2+ for latest features
- ESLint and Prettier for code quality
- NO audio libraries yet (those come in Phase 3)

### Step 3: Install Dependencies

Run:
```bash
npm install
```

This will:
- Download all packages listed in package.json
- Create `node_modules/` folder
- Generate `package-lock.json`

Expected install time: 1-3 minutes depending on connection speed.

### Step 4: Create TypeScript Configurations

**File:** `tsconfig.json`

Create this file in the project root:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Key Settings Explained:**
- `"strict": true` - Catches bugs at compile time
- `"paths": { "@/*": ["./src/*"] }` - Allows clean imports like `import { Track } from '@/types'`
- `"jsx": "react-jsx"` - Uses React 18's automatic JSX runtime

**File:** `tsconfig.node.json`

Create this file in the project root:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

**Purpose:** Separate TypeScript config for Vite's config file processing.

### Step 5: Create Vite Configuration

**File:** `vite.config.ts`

Create this file in the project root:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

**Key Settings Explained:**
- `alias: { '@': ... }` - Makes `@/` path aliases work (matches tsconfig.json)
- `manualChunks` - Separates React from app code for better caching
- `port: 3000` - Consistent development server port
- `open: true` - Auto-opens browser when you run `npm run dev`

### Step 6: Create ESLint Configuration

**File:** `.eslintrc.cjs`

Create this file in the project root:

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_' },
    ],
  },
};
```

**Purpose:** Enforces code quality standards and catches common mistakes.

### Step 7: Create Prettier Configuration

**File:** `.prettierrc`

Create this file in the project root:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Formatting Standards:**
- Single quotes for strings
- Semicolons at end of statements
- 2-space indentation
- 80 character line width
- Unix line endings (LF)

### Step 8: Create Git Ignore File

**File:** `.gitignore`

Create this file in the project root:

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.production

# Music files (too large for Git)
public/music/**/*.mp3
public/music/**/*.wav
public/music/**/*.flac

# Keep directory structure
!public/music/**/.gitkeep

# Build artifacts
.cache
```

**Critical:** Music files are excluded because they're too large for Git. We'll use `.gitkeep` files to preserve the directory structure.

## Validation Checklist

After completing Part 1A, verify:

- [ ] `package.json` exists with all dependencies listed
- [ ] `npm install` completed without errors
- [ ] `node_modules/` folder exists and contains packages
- [ ] `package-lock.json` was generated
- [ ] `tsconfig.json` exists in project root
- [ ] `tsconfig.node.json` exists in project root
- [ ] `vite.config.ts` exists in project root
- [ ] `.eslintrc.cjs` exists in project root
- [ ] `.prettierrc` exists in project root
- [ ] `.gitignore` exists in project root

**Test Commands:**
```bash
# Should show TypeScript version
npx tsc --version

# Should show Vite version
npx vite --version

# Should show ESLint version
npx eslint --version
```

All commands should work without errors.

## Common Issues & Solutions

### Issue 1: npm install fails
**Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Issue 2: Path alias (@/) not working later
**Solution:** Make sure BOTH `tsconfig.json` AND `vite.config.ts` have the alias configured

### Issue 3: ESLint errors about parser
**Solution:** Make sure `@typescript-eslint/parser` is installed: `npm install --save-dev @typescript-eslint/parser`

## Next Step
Proceed to **Part 1B: Folder Structure & Type Definitions** (`phase-1b-structure-types.md`)
