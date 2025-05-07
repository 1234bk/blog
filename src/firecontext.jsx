import { app } from "./firebase";
import { auth } from "./firebase";
import React, { createContext } from "react";
import { signInWithPopup ,GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword ,onAuthStateChanged,signOut } from 'firebase/auth';
// import { getDatabase  } from "firebase/database";
import { useState, useEffect } from "react";

// ✅ Create context first
export const FirebaseContext = createContext();

// ✅ Initialize Firebase services
// export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const handleSignup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed up:", userCredential.user);
    } catch (error) {
      alert("Email already in use");
    }
  };


  const handleSignin = async (email, password) => {
    console.log(email, password);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in:", userCredential);
      console.log("Signed in:", userCredential.user);
      
    } catch (error) {
      alert("wrong password or email");
      console.error("Signin Error:", error.message);
    }
  };

  

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Signed in:", result);
      console.log("Signed in.user:", result.user);
    } catch (error) {
      alert("")
      console.error("Google Sign-In Error:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // User is signed in
      } else {
        setUser(null); // User is signed out
      }
    });

    return () => unsubscribe();
  }, []);





  
  return (
    <FirebaseContext.Provider value={{ handleSignup, user,handleSignin,handleGoogleLogin }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
