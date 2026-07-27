# React Native Production Boilerplate

A **production-ready, feature-first React Native boilerplate** designed for scalability, absolute type-safety, and modular expansion.

This template enforces clean feature boundaries, opinionated conventions, robust offline-first caching, and complete CLI automated scaffolding.

---

## 🚀 Key Features

- **Architecture**: Feature-first domain partitioning, strict dependency boundaries, and path aliases.
- **Navigation**: Type-safe navigation flows, custom overlays (imperative bottom sheets, toast notifications, dialogs) driven by context providers.
- **State Management**: Redux Toolkit store + RTK Query with automatic token refresh queuing middleware.
- **Styling**: Dark-mode support out of the box via Tailwind CSS & Nativewind.
- **Storage**: Fast, native C++ storage backed by MMKV.
- **DevOps**: Complete Fastlane distribution tracks for iOS App Store/TestFlight & Android Google Play/Firebase App Distribution.
- **Automation**: CLI commands to initialize project names, generate domain structures, and add optional modules (Stripe, Camera, Sentry, Maps) dynamically.

---

## 📖 Table of Contents

For detailed usage guidelines, configuration, and design rules, consult the sub-documentation:

1.  **[Project Architecture & Domain Boundaries](file:///d:/Work/zynact/templates/react-native-template/docs/architecture.md)**
    - Folder layout, feature-first boundaries, code ordering, and TypeScript type-safety rules.
2.  **[Navigation & Overlays Guide](file:///d:/Work/zynact/templates/react-native-template/docs/navigation.md)**
    - Type-safe route params, bottom sheet/dialog managers, and nested stack patterns.
3.  **[State Management & Networking](file:///d:/Work/zynact/templates/react-native-template/docs/state_management.md)**
    - Store configurations, RTK Query API injection, cache tagging, and token auto-refresh middleware.
4.  **[Theme Engine & Styling](file:///d:/Work/zynact/templates/react-native-template/docs/theme_engine.md)**
    - Design system tokens, Tailwind config, utility classes, and light/dark toggles.
5.  **[Core Services & Native Hooks](file:///d:/Work/zynact/templates/react-native-template/docs/core_services.md)**
    - MMKV Storage service, Toast notifications, Permissions manager, Logger, and system hooks.
6.  **[CLI Scaffolding & Module Automation](file:///d:/Work/zynact/templates/react-native-template/docs/generators_and_automation.md)**
    - Setup wizard commands, code generators (`pnpm generate`), pluggable modules (`stripe`, `sentry`, etc.), and Fastlane config.

---

## 🛠️ Quick Start

### 1. Installation

Install Node dependencies:

```bash
pnpm install
```

### 2. Rename & Configure Project

Run the CLI Setup Wizard to configure the display name, Android package name, and iOS Bundle ID:

```bash
pnpm setup
```

### 3. Run Runtimes

```bash
# Start Metro bundler
pnpm start

# Run on Android emulator/device
pnpm android

# Run on iOS simulator/device
pnpm ios
```

---

## ⚙️ Development Commands

This project exposes script hooks in `package.json` to keep development productive:

| Script                        | Command                          | Purpose                                                      |
| :---------------------------- | :------------------------------- | :----------------------------------------------------------- |
| `pnpm setup`                  | `node scripts/setup.js`          | Configure project identifier variables.                      |
| `pnpm setup:fastlane`         | `node scripts/setup-fastlane.js` | Build `.env` details for Fastlane lanes.                     |
| `pnpm generate <type> <name>` | `node scripts/generate.js ...`   | Scaffold a component, feature, screen, api, slice, or form.  |
| `pnpm add:<module>`           | `node scripts/add-module.js ...` | Inject optional dependencies and boilerplate configurations. |
| `pnpm type-check`             | `tsc --noEmit`                   | Run compiler checks across project.                          |
| `pnpm lint`                   | `eslint . --max-warnings=0`      | Validate coding syntax and order formatting.                 |
| `pnpm format`                 | `prettier --write ...`           | Format all workspace files.                                  |

---

## 🛡️ Coding Standards

This template enforces a strict TypeScript compiler check. Every module must respect feature boundaries:

- Never cross-import internal files from sibling features.
- Export public interfaces exclusively using feature index barrels.
- Avoid using `any` or disabling type checks.
