// StoreContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useAuth } from "./authContext";
import { auth, googleProvider, db } from "./firebase";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const { user } = useAuth();
  const [scribbles, setScribbles] = useState([]);

  const getScribbles = async () => {
    if (!user) {
      return [];
    }
    const scribblesCol = collection(db, "scribbles");
    const scribblesSnapshot = await getDocs(scribblesCol);
    return scribblesSnapshot.docs.map((doc) => doc.data());
  };

  return (
    <StoreContext.Provider value={{ getScribbles }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
