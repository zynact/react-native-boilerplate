#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = path.resolve(__dirname, '..');
const ENV_FILE_PATH = path.join(ROOT, 'fastlane', '.env');

function prompt(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function main() {
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║      Fastlane Configuration Wizard    ║');
  console.log('╚═══════════════════════════════════════╝\n');

  // Ensure fastlane folder exists
  const fastlaneDir = path.join(ROOT, 'fastlane');
  if (!fs.existsSync(fastlaneDir)) {
    fs.mkdirSync(fastlaneDir, { recursive: true });
  }

  // Load existing env values if present
  const existingEnv = {};
  if (fs.existsSync(ENV_FILE_PATH)) {
    const content = fs.readFileSync(ENV_FILE_PATH, 'utf8');
    content.split('\n').forEach((line) => {
      const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
      if (match) {
        existingEnv[match[1].trim()] = match[2].trim();
      }
    });
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('--- Android Signing Details -----------------------------\n');

  const keystorePath = await prompt(
    rl,
    `Android Keystore Path [${existingEnv.KEYSTORE_PATH || 'android/app/debug.keystore'}]: `,
  );
  const keystoreStorePassword = await prompt(
    rl,
    `Keystore Store Password [${existingEnv.KEYSTORE_STORE_PASSWORD || 'android'}]: `,
  );
  const keystoreKeyAlias = await prompt(
    rl,
    `Keystore Key Alias [${existingEnv.KEYSTORE_KEY_ALIAS || 'androiddebugkey'}]: `,
  );
  const keystoreKeyPassword = await prompt(
    rl,
    `Keystore Key Password [${existingEnv.KEYSTORE_KEY_PASSWORD || 'android'}]: `,
  );

  console.log('\n--- Firebase App Distribution ---------------------------\n');

  const firebaseAppIdAndroid = await prompt(
    rl,
    `Firebase Android App ID [${existingEnv.FIREBASE_APP_ID_ANDROID || ''}]: `,
  );
  const firebaseAppIdIos = await prompt(
    rl,
    `Firebase iOS App ID [${existingEnv.FIREBASE_APP_ID_IOS || ''}]: `,
  );
  const firebaseTesters = await prompt(
    rl,
    `Firebase Testers (comma-separated) [${existingEnv.FIREBASE_TESTERS || ''}]: `,
  );

  console.log('\n--- Apple Portal Configuration --------------------------\n');

  const appleTeamId = await prompt(
    rl,
    `Apple Developer Portal Team ID [${existingEnv.APPLE_DEVELOPER_PORTAL_TEAM_ID || ''}]: `,
  );

  rl.close();

  const finalEnv = {
    KEYSTORE_PATH: keystorePath || existingEnv.KEYSTORE_PATH || 'android/app/debug.keystore',
    KEYSTORE_STORE_PASSWORD:
      keystoreStorePassword || existingEnv.KEYSTORE_STORE_PASSWORD || 'android',
    KEYSTORE_KEY_ALIAS: keystoreKeyAlias || existingEnv.KEYSTORE_KEY_ALIAS || 'androiddebugkey',
    KEYSTORE_KEY_PASSWORD: keystoreKeyPassword || existingEnv.KEYSTORE_KEY_PASSWORD || 'android',
    FIREBASE_APP_ID_ANDROID: firebaseAppIdAndroid || existingEnv.FIREBASE_APP_ID_ANDROID || '',
    FIREBASE_APP_ID_IOS: firebaseAppIdIos || existingEnv.FIREBASE_APP_ID_IOS || '',
    FIREBASE_TESTERS: firebaseTesters || existingEnv.FIREBASE_TESTERS || '',
    APPLE_DEVELOPER_PORTAL_TEAM_ID: appleTeamId || existingEnv.APPLE_DEVELOPER_PORTAL_TEAM_ID || '',
  };

  const envLines = [];
  for (const [key, value] of Object.entries(finalEnv)) {
    envLines.push(`${key}=${value}`);
  }

  fs.writeFileSync(ENV_FILE_PATH, envLines.join('\n') + '\n', 'utf8');

  console.log('\n─── Summary ─────────────────────────────────────────────\n');
  console.log(`  Saved to: ${ENV_FILE_PATH}`);
  console.log(`  KEYSTORE_PATH           : ${finalEnv.KEYSTORE_PATH}`);
  console.log(`  KEYSTORE_KEY_ALIAS      : ${finalEnv.KEYSTORE_KEY_ALIAS}`);
  console.log(`  FIREBASE_APP_ID_ANDROID : ${finalEnv.FIREBASE_APP_ID_ANDROID || '(none)'}`);
  console.log(`  FIREBASE_APP_ID_IOS     : ${finalEnv.FIREBASE_APP_ID_IOS || '(none)'}`);
  console.log(`  Apple Developer Team ID : ${finalEnv.APPLE_DEVELOPER_PORTAL_TEAM_ID || '(none)'}`);
  console.log('\n✅ Fastlane setup complete!\n');
}

main().catch((err) => {
  console.error('Fatal error during Fastlane setup:', err);
  process.exit(1);
});
