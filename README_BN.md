# Shivam Network — নতুন Phone Accessories Store

এই নতুন প্রজেক্টে শুধু Phone Accessories আছে; Computer Accessories নেই।

## নতুন Firebase Database তৈরি
1. https://console.firebase.google.com/ খুলে Add project করুন।
2. Firestore Database → Create database নির্বাচন করুন।
3. Authentication → Sign-in method → Email/Password চালু করুন।
4. Authentication → Users → Add user দিয়ে Admin email/password তৈরি করুন।
5. Project settings → General → Your apps → Web app তৈরি করে config কপি করুন।
6. `public/app.js`-এর `firebaseConfig`-এ apiKey, authDomain, projectId, appId বসান।
7. Authentication Users থেকে Admin UID কপি করুন।

## Server credential
Firebase Project settings → Service accounts → Generate new private key। JSON ফাইলের সম্পূর্ণ content Render Environment-এ `FIREBASE_SERVICE_ACCOUNT` নামে রাখুন। `ADMIN_UIDS`-এ Admin UID বসান। Service account JSON GitHub-এ দেবেন না।

## Render
GitHub-এ ZIP extract করে ফাইলগুলি নতুন repository-তে upload করুন। Render Web Service:
- Build: `npm install`
- Start: `npm start`
- Health Check Path: `/health`
- Environment: `FIREBASE_SERVICE_ACCOUNT`, `ADMIN_UIDS`

Deploy success হলে `/health` থেকে `{"ok":true}` আসবে।

## গুরুত্বপূর্ণ সীমাবদ্ধতা
- Online Payment অপশনটি এখন শুধু পেমেন্ট পছন্দ হিসেবে অর্ডারে সেভ করে; বাস্তব টাকা নেওয়ার জন্য Razorpay বা অন্য gateway, webhook এবং যাচাই যুক্ত করতে হবে।
- Product image এখন HTTPS URL দিয়ে দিতে হবে; image upload/storage এখনো নেই।
- Collections: `products`, `orders`।
- অর্ডারের সময় Firestore transaction-এ stock যাচাই ও কমানো হয়।
- Customer order endpoint-এ production-এর আগে OTP/CAPTCHA যোগ করা উচিত।
