import firebase from 'firebase'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "laundry-sky",
  storageBucket: "BUCKET",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);
