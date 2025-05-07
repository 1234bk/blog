import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBhzBmMSEamJHD3RsotEC5AiISVF6ejc7E",
  authDomain: "blog-web-167b8.firebaseapp.com",
  databaseURL: "https://blog-web-167b8-default-rtdb.firebaseio.com",
  projectId: "blog-web-167b8",
  storageBucket: "blog-web-167b8.firebasestorage.app",
  messagingSenderId: "994286973736",
  appId: "1:994286973736:web:d1a12c7f82cb6defacd61d"
  // databaseURL: "https://blog-web-167b8-default-rtdb.firebaseio.com/",
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);