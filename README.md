# Jaipur Prints — Full Customer + Admin Firebase Project

This folder contains the customer catalog and the Firebase-powered admin panel.

## Architecture
Customer website → public Firestore/Storage reads
Admin login → Firebase Authentication → Firestore + Storage writes

## Important
The project is code-connected to Firebase, but your Firebase project is not configured yet.
Open `firebase-config.js` and paste the Web App config from Firebase Console.

Do NOT put a Firebase service-account private key in this project.

## Firebase setup
1. Create a Firebase project.
2. Add a Web App and copy its config into `firebase-config.js`.
3. Enable Authentication → Sign-in method → Email/Password.
4. Create your admin user under Authentication → Users.
5. Create Firestore Database.
6. Create Storage.
7. Deploy the included `admin/firestore.rules` and `admin/storage.rules`.
8. Run the site from a web server (for example VS Code Live Server), not by double-clicking HTML files.

## URLs
- Customer: `customer/index.html`
- Catalog: `customer/catalog.html`
- Product: `customer/product.html`
- Admin login: `admin/index.html`

## Data model
- `products/{PRODUCT_ID}`
- `categories/{CATEGORY_ID}`
- `settings/site`
- Storage: `products/{PRODUCT_ID}/{filename}`

The customer site automatically reads products, categories, images and the WhatsApp number from the same Firebase project. If Firebase config is still placeholder text, it falls back to the included demo catalog so the UI remains usable.

## Security
The included rules allow public reads and authenticated admin writes. For a production single-admin deployment, restrict writes to the admin user's UID after creating the account.
