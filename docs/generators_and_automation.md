# Automation, Scaffolding & Plugins

This boilerplate implements custom CLI wizards and automation scripts to accelerate setup, enforce coding structures, and install optional platform capabilities.

## 1. Project Initialization

Configure the application details (bundle identifier, package names, screen display names) across Android and iOS directories at startup:

```bash
pnpm setup
```

---

## 2. Code Scaffolding Generators

Generate structured template files conforming to features boundaries, coding practices, and TypeScript aliases:

```bash
pnpm generate <type> <name>
```

### Supported Types

- **`feature <name>`**: Scaffolds a new business folder with empty buckets for components/hooks, type definitions, navigation layouts, and API injection configs.
  ```bash
  pnpm generate feature billing
  ```
- **`screen <feature>/<name>`**: Scaffolds a screen component inside the requested feature.
  ```bash
  pnpm generate screen billing/InvoiceHistory
  ```
- **`component <folder>/<name>`**: Creates a component structure (shared or feature-specific).
  ```bash
  pnpm generate component shared/ProgressBar
  pnpm generate component billing/InvoiceRow
  ```
- **`hook <folder>/<name>`**: Generates a hook file.
  ```bash
  pnpm generate hook shared/useDebounce
  pnpm generate hook billing/useInvoiceCalculator
  ```
- **`api <feature>/<name>`**: Creates an RTK Query endpoint injector.
  ```bash
  pnpm generate api billing/billingQuery
  ```
- **`slice <name>`**: Scaffolds a standard Redux state slice.
  ```bash
  pnpm generate slice billing
  ```
- **`form <feature>/<name>`**: Creates a validation form component skeleton.
  ```bash
  pnpm generate form billing/PaymentDetails
  ```

---

## 3. Pluggable Modules (Optional Features)

To keep the boilerplate lightweight and unbloated, optional features (like Stripe payments or Sentry logging) are not pre-packaged. Install them dynamically when required:

```bash
pnpm add:<module>
```

### Available Plugins

- **`pnpm add:socketio`**: Installs Socket.IO client and creates [socketio.service.ts](file:///d:/Work/zynact/templates/react-native-template/src/core/services/network/socketio.service.ts).
- **`pnpm add:websocket`**: Configures a robust native WebSocket wrapper inside [websocket.service.ts](file:///d:/Work/zynact/templates/react-native-template/src/core/services/network/websocket.service.ts) supporting automatic reconnects.
- **`pnpm add:sse`**: Installs Server-Sent Events client and setup configuration.
- **`pnpm add:stripe`**: Installs Stripe SDK and configures `StripeProvider` wrapper in `RootProvider.tsx`.
- **`pnpm add:sentry`**: Installs Sentry SDK and hooks initialization in `index.js`.
- **`pnpm add:maps`**: Installs `react-native-maps` and generates a shared MapComponent.
- **`pnpm add:camera`**: Installs Vision Camera permission check helpers.

---

## 4. Fastlane Deployment Setup

Build and push deployment builds automatically to Apple TestFlight, App Store, Google Play Internal, or Firebase Distribution:

### Step 1: Configure credentials

Initialize signing keys and API tokens in the environment:

```bash
pnpm setup:fastlane
```

This wizard stores configurations securely under `fastlane/.env`.

### Step 2: Running deployments

```bash
# Deploy Android to Firebase Distribution
cd android && bundle exec fastlane firebase

# Deploy Android to Google Play Internal track
cd android && bundle exec fastlane internal

# Deploy iOS to Apple TestFlight
cd ios && bundle exec fastlane beta
```
