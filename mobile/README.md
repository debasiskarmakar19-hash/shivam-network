# Shivam Network Android App

This is an isolated Capacitor Android project. It packages the customer-facing store only; the Admin Panel is not included in the customer app.

## Architecture

- Android app ID: `com.shivamnetwork.store`
- App display name: `Shivam Network`
- Web UI: copied from the existing `public/index.html`
- API: `https://shivam-network-backend.onrender.com`
- Database: existing Firebase/Firestore backend

The Android build uses bundled web files. It does not point the app at a remote website using Capacitor's development-only `server.url` setting.

## Build locally

Requirements: Node.js 22+, Android Studio, Android SDK, and the JDK supported by the installed Android Studio.

From this directory:

```bash
npm install
npm run copy:web
npx cap add android
npx cap sync android
npx cap open android
```

Then build a debug APK in Android Studio, or run:

```bash
cd android
./gradlew assembleDebug
```

## Notes

- The app requires an internet connection for product and order APIs.
- The backend must allow the Capacitor Android origin `https://localhost` in CORS.
- The first APK is a development build for testing, not a Play Store release.
- Before public release, configure the final app icon, signing, privacy information, store listing, and test the complete purchase/order flow.
- Do not put Firebase Admin credentials or other server secrets in this app.
