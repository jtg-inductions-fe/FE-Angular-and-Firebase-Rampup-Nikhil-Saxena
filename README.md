# Writica

A modern blog website.

---

## Installation

1. **Install all dependencies:**

   ```bash
   npm install
   ```

2. **Prepare Git hooks with Husky:**

   ```bash
   npm run prepare
   ```

---

## Development

To start the development server with live reloading:

```bash
npm run start
```

Then navigate to **[http://localhost:4200/](http://localhost:4200/)** in your browser.

---

## Available Commands

- **Start Development Server**

  ```bash
  npm run start
  ```

  Runs `ng serve` with live reload.

- **Build Project**

  ```bash
  npm run build
  ```

  Compiles the app into the `dist/` folder.

- **Run Unit Tests**

  ```bash
  npm test
  ```

  Executes tests using Karma and Jasmine.

- **Watch Mode Build**

  ```bash
  npm run watch
  ```

  Builds and watches files for changes.

- **Lint Code**

  ```bash
  npm run lint
  ```

  Lints the project using ESLint.

- **Fix Lint Errors Automatically**

  ```bash
  npm run lint:fix
  ```

- **Format Code with Prettier**

  ```bash
  npm run prettier
  ```

---

## Code Quality & Git Hooks

- **Husky** is configured to ensure code quality on commits.
- **ESLint** ensures consistent, error-free TypeScript code.
- **Prettier** automatically formats your codebase.
- Run manually with:

  ```bash
  npm run lint
  npm run prettier
  ```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── core/          # Core modules & components
│   ├── features/      # Feature modules & components
│   ├── modules/       # Reusable modules
│   ├── pages/         # Page-level components
│   ├── services/      # Application services
│   └── shared/        # Shared components & utilities
├── assets/            # Static assets
├── environments/      # Environment configs
styles/                # Global styles
```

---

## Technologies Used

- Angular 17
- Firebase
- Angular Material
- Quill Rich Text Editor
- ngx-chip
- ESLint & Prettier
- Husky (for Git hooks)

---

## Build for Production

Run the following command to generate production-ready code:

```bash
npm run build
```

This outputs to the `/dist/` folder.
