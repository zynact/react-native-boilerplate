#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');

function readFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function writeFile(relPath, content) {
  fs.writeFileSync(path.join(ROOT, relPath), content, 'utf8');
}

function fileExists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

/**
 * Convert a bundle ID like "com.company.appname" to a Java-style path segment
 * (used to derive the Android package path).
 * e.g. "com.acme.myapp" → "com/acme/myapp"
 */
function bundleIdToPath(bundleId) {
  return bundleId.replace(/\./g, '/');
}

/**
 * Derive a safe app name (no spaces, PascalCase) from a display name.
 * e.g. "My Cool App" → "MyCoolApp"
 */
function toAppName(displayName) {
  return displayName
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

function prompt(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// File updaters
// ─────────────────────────────────────────────────────────────────────────────

function updateAppJson(appName, displayName) {
  const filePath = 'app.json';
  const content = JSON.parse(readFile(filePath));
  content.name = appName;
  content.displayName = displayName;
  writeFile(filePath, JSON.stringify(content, null, 2) + '\n');
  console.log('  ✔ app.json updated');
}

function updateIndexJs(appName) {
  const filePath = 'index.js';
  if (!fileExists(filePath)) {
    console.log('  ⚠ index.js not found, skipping');
    return;
  }
  let content = readFile(filePath);
  // Replace the name import usage — AppRegistry.registerComponent(appName, …)
  // index.js uses: import { name as appName } from './app.json'
  // so updating app.json is sufficient, but we also handle hardcoded strings just in case.
  content = content.replace(
    /AppRegistry\.registerComponent\(['"][^'"]+['"]/,
    `AppRegistry.registerComponent('${appName}'`,
  );
  writeFile(filePath, content);
  console.log('  ✔ index.js updated');
}

function updateAndroidBuildGradle(bundleId) {
  const filePath = 'android/app/build.gradle';
  if (!fileExists(filePath)) {
    console.log('  ⚠ android/app/build.gradle not found, skipping');
    return;
  }
  let content = readFile(filePath);

  // applicationId "com.xxx"
  content = content.replace(/applicationId\s+"[^"]+"/, `applicationId "${bundleId}"`);

  // namespace "com.xxx"
  content = content.replace(/namespace\s+"[^"]+"/, `namespace "${bundleId}"`);

  // resValue "string", "build_config_package", "com.xxx"
  content = content.replace(
    /resValue\s+"string",\s+"build_config_package",\s+"[^"]+"/,
    `resValue "string", "build_config_package", "${bundleId}"`,
  );

  writeFile(filePath, content);
  console.log('  ✔ android/app/build.gradle updated');
}

function updateAndroidManifest(bundleId) {
  const filePath = 'android/app/src/main/AndroidManifest.xml';
  if (!fileExists(filePath)) {
    console.log('  ⚠ AndroidManifest.xml not found, skipping');
    return;
  }
  let content = readFile(filePath);

  // Only update if a package attribute exists (older RN projects)
  if (/package="[^"]+"/.test(content)) {
    content = content.replace(/package="[^"]+"/, `package="${bundleId}"`);
    writeFile(filePath, content);
    console.log('  ✔ AndroidManifest.xml package attribute updated');
  } else {
    console.log(
      '  ℹ AndroidManifest.xml has no package attribute (RN 0.71+ uses namespace in build.gradle) — skipped',
    );
  }
}

function updateInfoPlist(displayName, bundleId) {
  const filePath = 'ios/BoilerplateApp/Info.plist';
  if (!fileExists(filePath)) {
    console.log('  ⚠ ios/BoilerplateApp/Info.plist not found, skipping');
    return;
  }
  let content = readFile(filePath);

  // CFBundleDisplayName
  content = content.replace(
    /(<key>CFBundleDisplayName<\/key>\s*<string>)[^<]*(<\/string>)/,
    `$1${displayName}$2`,
  );

  // CFBundleIdentifier — only update if it's a hardcoded value (not a variable)
  content = content.replace(
    /(<key>CFBundleIdentifier<\/key>\s*<string>)(?!\$\(PRODUCT_BUNDLE_IDENTIFIER\))[^<]*(<\/string>)/,
    `$1${bundleId}$2`,
  );

  writeFile(filePath, content);
  console.log('  ✔ ios/BoilerplateApp/Info.plist updated');
}

function updateEnvCiExample(bundleId, androidPackageName) {
  const filePath = '.env.ci.example';
  if (!fileExists(filePath)) {
    console.log('  ⚠ .env.ci.example not found, skipping');
    return;
  }
  let content = readFile(filePath);

  content = content.replace(/^APP_BUNDLE_ID=.*/m, `APP_BUNDLE_ID=${bundleId}`);
  content = content.replace(
    /^ANDROID_PACKAGE_NAME=.*/m,
    `ANDROID_PACKAGE_NAME=${androidPackageName}`,
  );

  writeFile(filePath, content);
  console.log('  ✔ .env.ci.example updated');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║   React Native Project Setup Wizard   ║');
  console.log('╚═══════════════════════════════════════╝\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // 1. Display name
  const displayName = await prompt(rl, '1. App display name (shown on device, e.g. "My App"): ');
  if (!displayName) {
    console.error('✖ Display name is required.');
    rl.close();
    process.exit(1);
  }

  const appName = toAppName(displayName);

  // 2. Bundle ID
  const bundleId = await prompt(rl, '2. Bundle ID / package name (e.g. com.company.appname): ');
  if (!bundleId || !/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/.test(bundleId)) {
    console.error(
      '✖ Invalid bundle ID. Must be lowercase dot-separated segments, e.g. com.company.appname',
    );
    rl.close();
    process.exit(1);
  }

  // 3. Android package name (defaults to bundle ID)
  const defaultAndroidPkg = bundleId;
  const androidPackageNameInput = await prompt(
    rl,
    `3. Android package name [${defaultAndroidPkg}]: `,
  );
  const androidPackageName = androidPackageNameInput || defaultAndroidPkg;

  rl.close();

  console.log('\n─── Applying changes ───────────────────────────────────\n');

  try {
    updateAppJson(appName, displayName);
    updateIndexJs(appName);
    updateAndroidBuildGradle(bundleId);
    updateAndroidManifest(androidPackageName);
    updateInfoPlist(displayName, bundleId);
    updateEnvCiExample(bundleId, androidPackageName);
  } catch (err) {
    console.error('\n✖ Error during setup:', err.message);
    process.exit(1);
  }

  console.log('\n─── Summary ─────────────────────────────────────────────\n');
  console.log(`  Display name    : ${displayName}`);
  console.log(`  App name        : ${appName}`);
  console.log(`  Bundle ID       : ${bundleId}`);
  console.log(`  Android package : ${androidPackageName}`);
  console.log(`  Android path    : ${bundleIdToPath(androidPackageName)}`);
  console.log('\n  ⚠  Java/Kotlin source directories under android/app/src/main/java/');
  console.log('     must be renamed manually if you changed the package name.');
  console.log('     Also update the iOS bundle identifier in Xcode → Signing & Capabilities.');
  console.log('\n✅ Setup complete!\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
