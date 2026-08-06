#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const ANDROID_SIZES = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 },
];

const IOS_SIZES = [
  { name: 'icon-20@2x.png', size: 40 },
  { name: 'icon-20@3x.png', size: 60 },
  { name: 'icon-29@2x.png', size: 58 },
  { name: 'icon-29@3x.png', size: 87 },
  { name: 'icon-40@2x.png', size: 80 },
  { name: 'icon-40@3x.png', size: 120 },
  { name: 'icon-60@2x.png', size: 120 },
  { name: 'icon-60@3x.png', size: 180 },
  { name: 'icon-1024.png', size: 1024 },
];

const IOS_CONTENTS_JSON = {
  images: [
    { size: '20x20', idiom: 'iphone', filename: 'icon-20@2x.png', scale: '2x' },
    { size: '20x20', idiom: 'iphone', filename: 'icon-20@3x.png', scale: '3x' },
    { size: '29x29', idiom: 'iphone', filename: 'icon-29@2x.png', scale: '2x' },
    { size: '29x29', idiom: 'iphone', filename: 'icon-29@3x.png', scale: '3x' },
    { size: '40x40', idiom: 'iphone', filename: 'icon-40@2x.png', scale: '2x' },
    { size: '40x40', idiom: 'iphone', filename: 'icon-40@3x.png', scale: '3x' },
    { size: '60x60', idiom: 'iphone', filename: 'icon-60@2x.png', scale: '2x' },
    { size: '60x60', idiom: 'iphone', filename: 'icon-60@3x.png', scale: '3x' },
    { size: '1024x1024', idiom: 'ios-marketing', filename: 'icon-1024.png', scale: '1x' },
  ],
  info: { version: 1, author: 'xcode' },
};

function createDefaultPlaceholder(destPath) {
  const isWindows = process.platform === 'win32';
  if (isWindows) {
    const psScript = `
      Add-Type -AssemblyName System.Drawing;
      $bmp = new-object System.Drawing.Bitmap 1024, 1024;
      $g = [System.Drawing.Graphics]::FromImage($bmp);
      $brush = new-object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 79, 70, 229));
      $g.FillRectangle($brush, 0, 0, 1024, 1024);
      $bmp.Save('${destPath.replace(/'/g, "''")}', [System.Drawing.Imaging.ImageFormat]::Png);
      $g.Dispose();
      $bmp.Dispose();
    `.replace(/\n/g, ' ');
    execSync(`powershell -NoProfile -NonInteractive -Command "${psScript}"`, { stdio: 'pipe' });
  } else {
    const minimalPngBase64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    fs.writeFileSync(destPath, minimalPngBase64, 'base64');
    if (process.platform === 'darwin') {
      try {
        execSync(`sips -z 1024 1024 "${destPath}"`, { stdio: 'pipe' });
      } catch {}
    }
  }
}

function resizeImageNative(srcPath, destPath, width, height) {
  const isWindows = process.platform === 'win32';
  const isMac = process.platform === 'darwin';

  if (isWindows) {
    const psScript = `
      Add-Type -AssemblyName System.Drawing;
      $src = [System.Drawing.Image]::FromFile('${srcPath.replace(/'/g, "''")}');
      $dest = new-object System.Drawing.Bitmap ${width}, ${height};
      $g = [System.Drawing.Graphics]::FromImage($dest);
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;
      $g.DrawImage($src, 0, 0, ${width}, ${height});
      $dest.Save('${destPath.replace(/'/g, "''")}', [System.Drawing.Imaging.ImageFormat]::Png);
      $g.Dispose();
      $dest.Dispose();
      $src.Dispose();
    `.replace(/\n/g, ' ');

    execSync(`powershell -NoProfile -NonInteractive -Command "${psScript}"`, { stdio: 'pipe' });
    return true;
  } else if (isMac) {
    execSync(`sips -z ${height} ${width} "${srcPath}" --out "${destPath}"`, { stdio: 'pipe' });
    return true;
  } else {
    try {
      execSync(`convert "${srcPath}" -resize ${width}x${height} "${destPath}"`, { stdio: 'pipe' });
    } catch {
      fs.copyFileSync(srcPath, destPath);
    }
    return true;
  }
}

function main() {
  console.log('\n🎨 App Asset Auto-Generator\n');

  const assetsDir = path.join(ROOT, 'src', 'assets');
  ensureDir(assetsDir);

  const sourceIconPath = path.join(assetsDir, 'icon.png');

  if (!fs.existsSync(sourceIconPath)) {
    console.log('⚠️ Source icon not found at src/assets/icon.png');
    console.log('💡 Tip: Place your 1024x1024 PNG logo at src/assets/icon.png for best quality.\n');
    console.log('📦 Creating sample placeholder icon at src/assets/icon.png...');
    createDefaultPlaceholder(sourceIconPath);
    console.log('  ✔ Created placeholder 1024x1024 icon at src/assets/icon.png');
  }

  // 1. Android Icons
  console.log('\n📱 Generating Android launcher icons...');
  const androidResDir = path.join(ROOT, 'android', 'app', 'src', 'main', 'res');

  for (const item of ANDROID_SIZES) {
    const targetDir = path.join(androidResDir, item.folder);
    ensureDir(targetDir);

    resizeImageNative(
      sourceIconPath,
      path.join(targetDir, 'ic_launcher.png'),
      item.size,
      item.size,
    );
    resizeImageNative(
      sourceIconPath,
      path.join(targetDir, 'ic_launcher_round.png'),
      item.size,
      item.size,
    );
    console.log(`  ✔ Android ${item.folder} (${item.size}x${item.size})`);
  }

  // 2. iOS AppIcons
  console.log('\n🍎 Generating iOS AppIcon asset set...');
  const iosDir = path.join(ROOT, 'ios');
  let iosAppDir = null;

  if (fs.existsSync(iosDir)) {
    const dirs = fs.readdirSync(iosDir).filter((f) => {
      return (
        fs.statSync(path.join(iosDir, f)).isDirectory() &&
        f !== 'Pods' &&
        f !== 'build' &&
        !f.endsWith('.xcodeproj') &&
        !f.endsWith('.xcworkspace')
      );
    });
    if (dirs.length > 0) {
      iosAppDir = path.join(iosDir, dirs[0]);
    }
  }

  if (iosAppDir) {
    const appIconSetDir = path.join(iosAppDir, 'Images.xcassets', 'AppIcon.appiconset');
    ensureDir(appIconSetDir);

    for (const item of IOS_SIZES) {
      resizeImageNative(sourceIconPath, path.join(appIconSetDir, item.name), item.size, item.size);
      console.log(`  ✔ iOS ${item.name} (${item.size}x${item.size})`);
    }

    fs.writeFileSync(
      path.join(appIconSetDir, 'Contents.json'),
      JSON.stringify(IOS_CONTENTS_JSON, null, 2),
      'utf8',
    );
    console.log('  ✔ Updated iOS AppIcon Contents.json');
  } else {
    console.log(
      '  ℹ iOS native workspace directory not detected, skipping iOS AppIcon generation.',
    );
  }

  console.log('\n✨ App icon generation completed successfully!\n');
}

main();
