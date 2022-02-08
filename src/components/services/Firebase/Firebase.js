import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
  
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWuUGD0CY0wWf1ISh2nFkXqHFNIE4LOkg",
  authDomain: "gamesincommon-8f3d7.firebaseapp.com",
  databaseURL: "https://gamesincommon-8f3d7.firebaseio.com",
  projectId: "gamesincommon-8f3d7",
  storageBucket: "gamesincommon-8f3d7.appspot.com",
  messagingSenderId: "900707032365",
  appId: "1:900707032365:web:b8a5af08c645ceaf0e47a4",
  measurementId: "G-LZB2CTWFYZ"
};
  
/*const firebaseApp =*/ initializeApp(firebaseConfig);
const db = getFirestore();

export default db;