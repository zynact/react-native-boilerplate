#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
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

/**
 * Derive a safe package name (kebab-case) from a display name.
 * e.g. "My Cool App" → "my-cool-app"
 */
function toPackageName(displayName) {
  return displayName
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .join('-');
}

function prompt(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// File updaters
// ─────────────────────────────────────────────────────────────────────────────

function updatePackageJson(displayName) {
  const filePath = 'package.json';
  if (!fileExists(filePath)) return;
  const content = JSON.parse(readFile(filePath));
  content.name = toPackageName(displayName);
  writeFile(filePath, JSON.stringify(content, null, 2) + '\n');
  console.log('  ✔ package.json updated');
}

function updateAppJson(appName, displayName) {
  const filePath = 'app.json';
  if (!fileExists(filePath)) return;
  const content = JSON.parse(readFile(filePath));
  content.name = appName;
  content.displayName = displayName;
  writeFile(filePath, JSON.stringify(content, null, 2) + '\n');
  console.log('  ✔ app.json updated');
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

  rl.close();

  // Trigger react-native-rename
  try {
    console.log(`\n─── Executing native renaming via react-native-rename ───\n`);
    console.log(`  Running: npx -y react-native-rename@latest "${displayName}" -b ${bundleId}`);
    console.log(`  (This may take a moment to download and execute...)\n`);

    execSync(`npx -y react-native-rename@latest "${displayName}" -b ${bundleId}`, {
      stdio: 'inherit',
      cwd: ROOT,
    });
    console.log(`\n─── Native renaming complete! ───────────────────────────\n`);
  } catch (err) {
    console.error(`\n✖ Native renaming via react-native-rename failed: ${err.message}`);
    process.exit(1);
  }

  console.log('─── Applying package metadata updates ──────────────────\n');

  try {
    updatePackageJson(displayName);
    updateAppJson(appName, displayName);
  } catch (err) {
    console.error('\n✖ Error during metadata updates:', err.message);
    process.exit(1);
  }

  console.log('\n─── Summary ─────────────────────────────────────────────\n');
  console.log(`  Display name  : ${displayName}`);
  console.log(`  App name      : ${appName}`);
  console.log(`  Package name  : ${toPackageName(displayName)}`);
  console.log(`  Bundle ID     : ${bundleId}`);
  console.log('\n✅ Setup complete!\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
