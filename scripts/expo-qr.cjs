const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const root = path.join(__dirname, '..');
const out = path.join(root, 'expo-go-qr.png');

fetch('http://127.0.0.1:8081')
  .then((r) => r.json())
  .then(async (manifest) => {
    const host =
      manifest.expoGo?.debuggerHost ?? manifest.extra?.expoClient?.hostUri;
    if (!host) {
      throw new Error(
        'Impossible de lire hostUri. Lancez Metro : npx expo start --tunnel'
      );
    }
    const url = `exp://${host}:80`;
    await QRCode.toFile(out, url);
    console.log('QR enregistré :', out);
    console.log('URL Expo Go :', url);
  })
  .catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
