# Shivam Network — Website ও Admin Guide

## Live links
- Customer website: https://shivam-network-0hnp.onrender.com
- Backend health: https://shivam-network-backend.onrender.com/health
- Admin panel: https://shivam-network-backend.onrender.com/admin.html

## Website structure
- Root `index.html`: Render Static Site-এর customer website।
- `public/index.html`: Backend host-এর customer website copy। দুই ফাইল একই রাখতে হবে।
- `server.js`: Express API, Firebase Admin authentication, orders, inventory, service requests, returns, reviews এবং admin endpoints।
- `public/admin.html` ও `public/admin.js`: Firebase Email/Password login-সহ Admin Panel।
- Recharge ও Bill Payment customer-facing website থেকে সরানো হয়েছে।
- Website-এ Razorpay/online prepayment integration নেই। অর্ডার request হিসেবে জমা হয়; COD অথবা delivery-তে UPI বেছে নেওয়া যায়। পেমেন্ট যাচাই দোকানের দায়িত্বপ্রাপ্ত প্রাপ্তবয়স্ক ব্যক্তিকে করতে হবে।

## Render configuration
Backend service-এ secret environment variables:
- `FIREBASE_SERVICE_ACCOUNT`: Firebase service-account JSON; GitHub-এ কখনো রাখবেন না।
- `ADMIN_UIDS`: অনুমোদিত Admin Firebase UID-গুলো comma-separated আকারে।

Render Dashboard-এ secret value দেখানো বা chat-এ পাঠানোর দরকার নেই। Firebase Console-এ Customer Phone sign-in এবং Admin Email/Password sign-in provider চালু থাকতে হবে। Render-এর frontend ও backend domain Firebase Authentication-এর authorized domains-এ যোগ করা আছে কি না যাচাই করুন।

## Admin Panel ব্যবহার
1. Admin URL খুলুন এবং অনুমোদিত Firebase Admin account দিয়ে লগইন করুন।
2. প্রথমে সঠিক নাম, category, দাম, stock, ছবি, warranty ও product-specific return/delivery তথ্য দিয়ে পণ্য যোগ করুন।
3. Inventory-তে পণ্যের দাম, stock ও active status পরীক্ষা করুন।
4. Orders-এ নতুন order request দেখে stock ও delivery charge/time নিশ্চিত করে status আপডেট করুন।
5. Customer-এর কাছ থেকে টাকা পাওয়া যাচাই না করে payment status PAID করবেন না।
6. Returns, service requests ও customer reviews আলাদা বিভাগে পরিচালনা করুন।

## Customer order flow
- Customer mobile OTP দিয়ে লগইন করে নাম ও পশ্চিমবঙ্গের ঠিকানা/PIN সেভ করে।
- Android App-এ OTP যাচাই হলে অ্যাপ খোলে; অর্ডার করার আগে নাম, সম্পূর্ণ ঠিকানা ও PIN সেভ করা বাধ্যতামূলক।
- Website-এর public guest checkout আলাদা থাকে; Admin Panel-এর লগইন আলাদা ও সুরক্ষিত থাকে।
- Android App ও Website-এর অর্ডার একই Firestore `orders` collection-এ যায়; `orderSource` দিয়ে APP/WEB চিহ্নিত হয়।
- Admin Panel থেকে NEW → CONFIRMED → PROCESSING → SHIPPED → DELIVERED অথবা CANCELLED স্ট্যাটাস আপডেট করা যায়; Customer App-এর order history একই রেকর্ড পড়ে।
- Product catalog থেকে cart-এ পণ্য যোগ করে order request পাঠায়।
- Backend server-side price ও stock যাচাই করে order তৈরি করে।
- দোকান order, availability, delivery charge এবং delivery time নিশ্চিত করে WhatsApp/phone-এ জানায়।
- এই site-এ বর্তমানে Razorpay checkout নেই; online prepayment নেওয়া হয় না।

## Tests
Run locally:
```bash
npm test
```
এটি storefront copies, HTML IDs, inline JavaScript syntax, admin JavaScript, backend syntax, policy sections, service options এবং order validation-এর static checks চালায়।

## Launch checklist
- Admin login এবং customer OTP sign-in real device-এ পরীক্ষা করুন।
- Firebase authorized domains এবং Render environment variable presence প্রাপ্তবয়স্ক account owner দিয়ে যাচাই করান।
- Admin Panel-এ আসল product catalogue, সঠিক দাম, stock, ছবি ও product policy যোগ করুন।
- Test order দিয়ে Admin Panel-এ order status, stock change, cancellation, return এবং SMS configuration পরীক্ষা করুন।
- Razorpay approval পাওয়ার আগে বা secure payment integration না হওয়া পর্যন্ত website-এ online payment চালু বলে প্রচার করবেন না।
- Website live থাকা মানেই customer journey end-to-end tested বা Razorpay approved—এমন নয়।
