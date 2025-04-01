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
  deleteUser,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { doc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

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

  const deleteAccount = async () => {
    setAuthLoading(true);
    try {
      // Delete user data from Firestore first
      const userRef = doc(db, `users/${user.uid}`);
      await deleteDoc(userRef);
      
      // Delete user's drafts
      const draftsRef = collection(db, `users/${user.uid}/drafts`);
      const draftsSnapshot = await getDocs(draftsRef);
      const deletePromises = draftsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Delete user's published scribbles
      const scribblesRef = collection(db, "scribbles");
      const scribblesQuery = query(scribblesRef, where("author", "==", user.uid));
      const scribblesSnapshot = await getDocs(scribblesQuery);
      const deleteScribblePromises = scribblesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteScribblePromises);
      
      // Finally, delete the user account
      await deleteUser(user);
      setIsAuthenticated(false);
      router.push("/signin");
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        //functionality
        signIn, // email, password
        signUp, // email, password, displayName
        signOut, //()
        signInWithGoogle, // ()
        deleteAccount, // ()
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
