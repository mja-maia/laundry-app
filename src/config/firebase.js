import firebase from 'firebase'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF6_nwZ3S0DOqQfQmotDsK57KSaQ4MkbA",
  authDomain: "laundry-sky.firebaseapp.com",
  databaseURL: "https://laundry-sky.firebaseio.com",
  projectId: "laundry-sky",
  storageBucket: "laundry-sky.appspot.com",
  messagingSenderId: "928149548505",
  appId: "1:928149548505:web:a669c34c03511b072ebdc8"
};
// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);
