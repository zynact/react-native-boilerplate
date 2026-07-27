#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Templates
// ─────────────────────────────────────────────────────────────────────────────

const TEMPLATES = {
  socketio: `import { io, Socket } from 'socket.io-client';
import { appConfig } from '@core/config';
import { logger } from '../logger/logger.service';

class SocketIOServiceClass {
  private socket: Socket | null = null;

  connect(token?: string): void {
    if (this.socket?.connected) return;

    this.socket = io(appConfig.API_BASE_URL, {
      auth: { token },
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      logger.info('[SocketIO] Connected successfully');
    });

    this.socket.on('connect_error', (error) => {
      logger.error('[SocketIO] Connection error', error);
    });

    this.socket.on('disconnect', (reason) => {
      logger.warn(\`[SocketIO] Disconnected: \${reason}\`);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      logger.info('[SocketIO] Disconnected manually');
    }
  }

  on(event: string, callback: (...args: any[]) => void): () => void {
    if (!this.socket) {
      logger.warn('[SocketIO] socket not initialized. Call connect() first.');
      return () => {};
    }
    this.socket.on(event, callback);
    return () => {
      this.socket?.off(event, callback);
    };
  }

  emit(event: string, data: any): void {
    if (!this.socket?.connected) {
      logger.warn('[SocketIO] socket not connected.');
      return;
    }
    this.socket.emit(event, data);
  }
}

export const SocketIOService = new SocketIOServiceClass();
`,

  websocket: `import { logger } from '../logger/logger.service';

class WebSocketServiceClass {
  private ws: WebSocket | null = null;
  private url: string = '';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private listeners: Set<(event: MessageEvent) => void> = new Set();

  connect(url: string): void {
    this.url = url;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      logger.info('[WebSocket] Connected successfully');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      this.listeners.forEach((listener) => listener(event));
    };

    this.ws.onclose = (event) => {
      logger.warn(\`[WebSocket] Closed: \${event.reason} (code \${event.code})\`);
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      logger.error('[WebSocket] Error occurred', error);
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: string | ArrayBuffer | ArrayBufferView | Blob): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      logger.warn('[WebSocket] Cannot send. Connection not open.');
    }
  }

  subscribe(callback: (event: MessageEvent) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('[WebSocket] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    logger.info(\`[WebSocket] Reconnecting in \${this.reconnectInterval}ms (Attempt \${this.reconnectAttempts}/\${this.maxReconnectAttempts})\`);
    setTimeout(() => {
      this.connect(this.url);
    }, this.reconnectInterval);
  }
}

export const WebSocketService = new WebSocketServiceClass();
`,

  sse: `import EventSource, { EventSourceListener } from 'react-native-sse';
import { logger } from '../logger/logger.service';

class SSEServiceClass {
  private sse: EventSource | null = null;

  connect(url: string, token?: string): EventSource {
    if (this.sse) {
      this.sse.close();
    }

    this.sse = new EventSource(url, {
      headers: {
        Authorization: token ? \`Bearer \${token}\` : '',
      },
    });

    this.sse.addEventListener('open', () => {
      logger.info('[SSE] Connection opened');
    });

    this.sse.addEventListener('error', (event) => {
      logger.error('[SSE] Error occurred', event);
    });

    return this.sse;
  }

  disconnect(): void {
    if (this.sse) {
      this.sse.close();
      this.sse = null;
      logger.info('[SSE] Connection closed manually');
    }
  }
}

export const SSEService = new SSEServiceClass();
`,

  stripe: `import { initStripe } from '@stripe/stripe-react-native';
import { logger } from '../logger/logger.service';

export async function setupStripe(): Promise<void> {
  try {
    await initStripe({
      publishableKey: 'pk_test_placeholder_key',
      merchantIdentifier: 'merchant.com.boilerplateapp',
    });
    logger.info('[Stripe] Initialized successfully');
  } catch (error) {
    logger.error('[Stripe] Initialization failed', error);
  }
}
`,

  sentry: `import * as Sentry from '@sentry/react-native';
import { appConfig } from '@core/config';

export function setupSentry(): void {
  Sentry.init({
    dsn: 'https://placeholder-sentry-dsn@o0.ingest.sentry.io/0',
    debug: appConfig.APP_ENV === 'development',
    environment: appConfig.APP_ENV,
    tracesSampleRate: 1.0,
  });
}
`,

  maps: `import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

interface MapComponentProps {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
}

export function MapComponent({ latitude, longitude, title, description }: MapComponentProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={title || 'Location'}
          description={description || 'Details'}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
`,

  camera: `import { Camera } from 'react-native-vision-camera';
import { logger } from '../logger/logger.service';

export const CameraPermissionsService = {
  async checkCameraPermission(): Promise<boolean> {
    const status = Camera.getCameraPermissionStatus();
    return status === 'granted';
  },

  async requestCameraPermission(): Promise<boolean> {
    const status = await Camera.requestCameraPermission();
    logger.info(\`[Camera] Permission status: \${status}\`);
    return status === 'granted';
  },

  async checkMicrophonePermission(): Promise<boolean> {
    const status = Camera.getMicrophonePermissionStatus();
    return status === 'granted';
  },

  async requestMicrophonePermission(): Promise<boolean> {
    const status = await Camera.requestMicrophonePermission();
    logger.info(\`[Camera] Microphone permission status: \${status}\`);
    return status === 'granted';
  },
};
`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Installer Actions
// ─────────────────────────────────────────────────────────────────────────────

function installSocketIO() {
  console.log('📦 Installing socket.io-client...');
  execSync('pnpm add socket.io-client', { stdio: 'inherit', cwd: ROOT });

  const destPath = path.join(ROOT, 'src', 'core', 'services', 'network', 'socketio.service.ts');
  fs.writeFileSync(destPath, TEMPLATES.socketio, 'utf8');

  // Update exports in services index
  const indexFile = path.join(ROOT, 'src', 'core', 'services', 'index.ts');
  let content = fs.readFileSync(indexFile, 'utf8');
  if (!content.includes('SocketIOService')) {
    content += `\nexport { SocketIOService } from './network/socketio.service';\n`;
    fs.writeFileSync(indexFile, content, 'utf8');
  }

  console.log('✅ Socket.IO module installed successfully!');
}

function installWebSocket() {
  console.log('📦 Setting up custom WebSocket abstraction...');

  const destPath = path.join(ROOT, 'src', 'core', 'services', 'network', 'websocket.service.ts');
  fs.writeFileSync(destPath, TEMPLATES.websocket, 'utf8');

  // Update exports in services index
  const indexFile = path.join(ROOT, 'src', 'core', 'services', 'index.ts');
  let content = fs.readFileSync(indexFile, 'utf8');
  if (!content.includes('WebSocketService')) {
    content += `\nexport { WebSocketService } from './network/websocket.service';\n`;
    fs.writeFileSync(indexFile, content, 'utf8');
  }

  console.log('✅ WebSocket module setup completed successfully!');
}

function installSSE() {
  console.log('📦 Installing react-native-sse...');
  execSync('pnpm add react-native-sse', { stdio: 'inherit', cwd: ROOT });

  const destPath = path.join(ROOT, 'src', 'core', 'services', 'network', 'sse.service.ts');
  fs.writeFileSync(destPath, TEMPLATES.sse, 'utf8');

  // Update exports in services index
  const indexFile = path.join(ROOT, 'src', 'core', 'services', 'index.ts');
  let content = fs.readFileSync(indexFile, 'utf8');
  if (!content.includes('SSEService')) {
    content += `\nexport { SSEService } from './network/sse.service';\n`;
    fs.writeFileSync(indexFile, content, 'utf8');
  }

  console.log('✅ SSE module installed successfully!');
}

function installStripe() {
  console.log('📦 Installing @stripe/stripe-react-native...');
  execSync('pnpm add @stripe/stripe-react-native', { stdio: 'inherit', cwd: ROOT });

  const serviceDir = path.join(ROOT, 'src', 'core', 'services', 'payments');
  ensureDir(serviceDir);

  fs.writeFileSync(path.join(serviceDir, 'stripe.service.ts'), TEMPLATES.stripe, 'utf8');

  // Update RootProvider.tsx to wrap StripeProvider
  const providerPath = path.join(ROOT, 'src', 'core', 'providers', 'RootProvider.tsx');
  let providerContent = fs.readFileSync(providerPath, 'utf8');

  if (!providerContent.includes('StripeProvider')) {
    providerContent = providerContent.replace(
      "import { StoreProvider } from './StoreProvider';",
      "import { StripeProvider } from '@stripe/stripe-react-native';\nimport { StoreProvider } from './StoreProvider';",
    );
    providerContent = providerContent.replace(
      '<ToastProvider>{children}</ToastProvider>',
      "<StripeProvider publishableKey='pk_test_placeholder_key'>\n                  <ToastProvider>{children}</ToastProvider>\n                </StripeProvider>",
    );
    fs.writeFileSync(providerPath, providerContent, 'utf8');
    console.log('  ✔ RootProvider.tsx updated to wrap <StripeProvider>');
  }

  console.log('✅ Stripe module installed successfully!');
}

function installSentry() {
  console.log('📦 Installing @sentry/react-native...');
  execSync('pnpm add @sentry/react-native', { stdio: 'inherit', cwd: ROOT });

  const loggerDir = path.join(ROOT, 'src', 'core', 'services', 'logger');
  fs.writeFileSync(path.join(loggerDir, 'sentry.service.ts'), TEMPLATES.sentry, 'utf8');

  // Update index.js to initialize Sentry at startup
  const indexJsPath = path.join(ROOT, 'index.js');
  let indexContent = fs.readFileSync(indexJsPath, 'utf8');

  if (!indexContent.includes('setupSentry')) {
    indexContent =
      `import { setupSentry } from './src/core/services/logger/sentry.service';\nsetupSentry();\n` +
      indexContent;
    fs.writeFileSync(indexJsPath, indexContent, 'utf8');
    console.log('  ✔ index.js updated to setup Sentry at startup');
  }

  console.log('✅ Sentry crash reporting module installed successfully!');
}

function installMaps() {
  console.log('📦 Installing react-native-maps...');
  execSync('pnpm add react-native-maps', { stdio: 'inherit', cwd: ROOT });

  const compDir = path.join(ROOT, 'src', 'shared', 'components', 'Map');
  ensureDir(compDir);

  fs.writeFileSync(path.join(compDir, 'Map.tsx'), TEMPLATES.maps, 'utf8');

  // Export in shared components barrel
  const barrelFile = path.join(ROOT, 'src', 'shared', 'components', 'index.ts');
  let barrelContent = fs.readFileSync(barrelFile, 'utf8');
  if (!barrelContent.includes('MapComponent')) {
    barrelContent += `export { MapComponent } from './Map/Map';\n`;
    fs.writeFileSync(barrelFile, barrelContent, 'utf8');
  }

  console.log('✅ Maps module installed successfully!');
}

function installCamera() {
  console.log('📦 Installing react-native-vision-camera...');
  execSync('pnpm add react-native-vision-camera', { stdio: 'inherit', cwd: ROOT });

  const permDir = path.join(ROOT, 'src', 'core', 'services', 'permissions');
  fs.writeFileSync(path.join(permDir, 'camera.service.ts'), TEMPLATES.camera, 'utf8');

  // Update permissions index or services index
  const indexFile = path.join(ROOT, 'src', 'core', 'services', 'index.ts');
  let content = fs.readFileSync(indexFile, 'utf8');
  if (!content.includes('CameraPermissionsService')) {
    content += `\nexport { CameraPermissionsService } from './permissions/camera.service';\n`;
    fs.writeFileSync(indexFile, content, 'utf8');
  }

  console.log('✅ Camera module installed successfully!');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const moduleName = args[0];

  const allowedModules = ['socketio', 'websocket', 'sse', 'stripe', 'sentry', 'maps', 'camera'];

  if (!moduleName || !allowedModules.includes(moduleName)) {
    console.log('\nUsage: pnpm add:<module>\n');
    console.log('Supported Modules:');
    console.log('  socketio    - Install Socket.IO client interface');
    console.log('  websocket   - Scaffold Custom Robust WebSocket wrapper');
    console.log('  sse         - Install Server-Sent Events client');
    console.log('  stripe      - Install Stripe payment provider');
    console.log('  sentry      - Install Sentry bug reporting tool');
    console.log('  maps        - Install Google/Apple Map View');
    console.log('  camera      - Install native Camera permissions & handler');
    console.log('');
    process.exit(1);
  }

  switch (moduleName) {
    case 'socketio':
      installSocketIO();
      break;
    case 'websocket':
      installWebSocket();
      break;
    case 'sse':
      installSSE();
      break;
    case 'stripe':
      installStripe();
      break;
    case 'sentry':
      installSentry();
      break;
    case 'maps':
      installMaps();
      break;
    case 'camera':
      installCamera();
      break;
  }
}

main();
