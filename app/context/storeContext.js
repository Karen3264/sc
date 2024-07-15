// StoreContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  setDoc,
} from "firebase/firestore";

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

  const getScribblesByRank = async (minRank, maxRank) => {
    const scribblesCollection = collection(db, "scribbles");
    const q = query(
      scribblesCollection,
      where("rank", ">=", minRank),
      where("rank", "<=", maxRank),
      orderBy("rank", "desc") // Order by rank in descending order
    );

    const querySnapshot = await getDocs(q);
    const scribbles = [];
    querySnapshot.forEach((doc) => {
      scribbles.push({ id: doc.id, ...doc.data() });
    });

    return scribbles;
  };

  const getNewestScribble = async () => {
    const scribblesCollection = collection(db, "scribbles");
    const q = query(
      scribblesCollection,
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    let newestScribble = null;
    querySnapshot.forEach((doc) => {
      newestScribble = { id: doc.id, ...doc.data() };
    });

    return newestScribble;
  };

  const saveScribble = async (text, draftId) => {
    const userId = user.uid;
    const docRef = doc(db, `users/${userId}/drafts/${draftId}`);

    await setDoc(docRef, {
      content: text,
    });

    console.log("Draft saved with ID:", draftId);
  };
  const publishScribble = async (text, status) => {
    // Add logic to publish the scribble with the given status
  };

  const getDrafts = async (userId) => {
    const draftsCollection = collection(db, `users/${user.uid}/drafts`);
    const draftSnapshot = await getDocs(draftsCollection);
    const draftsList = draftSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return draftsList;
  };

  return (
    <StoreContext.Provider
      value={{
        getScribbles,
        getScribblesByRank,
        getNewestScribble,
        saveScribble,
        publishScribble,
        getDrafts,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
