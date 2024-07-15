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
  const [user, setUser] = useState({});
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setIsAuthenticated(true);
        setUser(u);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      router.push("/");
    } catch (error) {
      console.error("Error thrown signing in:", error);
      setAuthLoading(false);

      throw error;
    }
  };

  const signUp = async (email, password, displayName) => {
    setAuthLoading(true);
    try {
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
    } catch (error) {
      console.error("Error signing up:", error);
      setAuthLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setAuthLoading(true);
    try {
      await firebaseSignOut(auth);
      setIsAuthenticated(false);
      router.push("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      setAuthLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuthenticated(true);
      router.push("/");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        user,
        authLoading,
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
