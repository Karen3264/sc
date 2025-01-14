// app/context/authContext.js
"use client"; // Marking this file as a client component

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(-1);
  const [user, setUser] = useState(-1);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  //listener for autch changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setIsAuthenticated(true);
        setUser(u);
      } else {
        setIsAuthenticated(false);
        setUser(-1);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    setAuthLoading(true);
    await signInWithEmailAndPassword(auth, email, password);
    setIsAuthenticated(true);
    router.push("/");
  };

  const signUp = async (email, password, displayName) => {
    setAuthLoading(true);
    //add error cathing for wrong password enc
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, {
      displayName: displayName,
    });
    setIsAuthenticated(true);
    router.push("/");
  };

  const signOut = async () => {
    setAuthLoading(true);
    await firebaseSignOut(auth);
    setIsAuthenticated(false);
    router.push("/signin");
  };

  const signInWithGoogle = async () => {
    setAuthLoading(true);
    await signInWithPopup(auth, googleProvider);
    setIsAuthenticated(true);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        //functionality
        signIn, // email, password
        signUp, // email, password, displayName
        signOut, //()
        signInWithGoogle, // ()
        //variables
        user, //is updated as user on firebase changes
        authLoading, //should be moved to Loading context
        setAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
