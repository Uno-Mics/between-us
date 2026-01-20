import admin from "firebase-admin";

// Initialize Firebase Admin SDK
// Expects FIREBASE_SERVICE_ACCOUNT environment variable to be a JSON string
// and FIREBASE_DATABASE_URL to be set.

let db: admin.database.Database;

if (process.env.FIREBASE_SERVICE_ACCOUNT && process.env.FIREBASE_DATABASE_URL) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    }
    db = admin.database();
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT or initialize Firebase:", error);
    // process.exit(1); // Keep running to allow simple server start, but DB calls will fail
  }
} else {
  console.warn(
    "WARNING: FIREBASE_SERVICE_ACCOUNT or FIREBASE_DATABASE_URL not set.\n" +
    "The application will start, but database operations will fail until these are configured."
  );
}

export { db };
