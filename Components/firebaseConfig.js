// Import the functions you need from the SDKs you need

import "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getFirestore } from "firebase/firestore";
import {FIREBASE_API_KEY} from '@env';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
   apiKey: FIREBASE_API_KEY,
  authDomain: "demo2-a2faa.firebaseapp.com",
  databaseURL: "https://demo2-a2faa-default-rtdb.firebaseio.com",
  projectId: "demo2-a2faa",
  storageBucket: "demo2-a2faa.appspot.com",
  messagingSenderId: "10337619308",
  appId: "1:10337619308:web:a96490dba497b6a14cb749",
  measurementId: "G-5JVZ5BG7C6"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig,  {
  experimentalForceLongPolling: true, // this line
  useFetchStreams: false, // and this line
});

export default firebase;

