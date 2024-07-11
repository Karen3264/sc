// app/context/authContext.js
'use client'; // Marking this file as a client component

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' for hooks in the app directory

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const signIn = () => setIsAuthenticated(true);
  const signOut = () => {
    setIsAuthenticated(false);
    router.push('/signin');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
