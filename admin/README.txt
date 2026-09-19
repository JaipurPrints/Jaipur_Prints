JAIPUR PRINTS — ADMIN PANEL PART 4
Firebase + Authentication + Firestore + Storage

SETUP:
1. Create a Firebase project.
2. Enable Authentication → Sign-in method → Email/Password.
3. Create Firestore Database.
4. Create Storage.
5. Register a Web App and copy its config into ../firebase-config.js.
6. Create an admin user in Firebase Authentication.
7. Add the Firestore and Storage rules supplied in this folder.
8. Serve the folder through a web server (Firebase Hosting, Vercel, or local server). Do not open the HTML via file:// because ES modules/Firebase require a web origin.

DATABASE:
products/{PRODUCT_ID}
categories/{CATEGORY_ID}
settings/site

PRODUCT IMAGE:
Storage path products/{PRODUCT_ID}/{filename}

CUSTOMER WEBSITE:
The final customer website should read products/categories/settings from the same Firestore project and product image URLs from Storage. This removes the prototype localStorage/data.js dependency and makes Admin changes visible to customers.

IMPORTANT:
The Firebase config file contains public web-app configuration. Security comes from Firebase Authentication + Firestore/Storage rules, not from hiding the config.
