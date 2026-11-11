# Shivam Network Android app

This Android WebView app opens the live Shivam Network storefront and keeps the existing web backend, product catalogue, cart, WhatsApp order flow and admin dashboard connected.

- Application ID: com.shivamnetwork.app
- Minimum Android: 6.0 (API 23)
- Build: `gradle assembleDebug`
- APK output: `app/build/outputs/apk/debug/app-debug.apk`

The GitHub Actions workflow builds a debug-signed installable APK and publishes it as the `ShivamNetwork.apk` asset in GitHub Release `v1.0.0`.

This debug APK is suitable for direct Android installation/testing, not Google Play publishing. A Play Store release requires a separately managed production signing key.
