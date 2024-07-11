// app/context/authContext.js
'use client'; // Marking this file as a client component

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      router.push('/');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signUp = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      router.push('/');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setIsAuthenticated(false);
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuthenticated(true);
      router.push('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signUp, signOut, signInWithGoogle}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
