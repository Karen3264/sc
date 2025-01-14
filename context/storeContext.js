// StoreContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
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
    console.log(minRank);
    console.log(maxRank);
    console.log("gitd");
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

  const publishScribble = async (text, title, status) => {
    const scribblesCollection = collection(db, "scribbles");
    let newewstScribble = await getNewestScribble();
    console.log(user);
    //create new onjects
    const newScribble = {
      author: user.uid, // Author's ID
      author_username: user.displayName,
      content: text,
      rank: newewstScribble.rank + 1, // Initial rank
      rating: 0, // Initial rating
      reviewed: false, // Initially not reviewed
      reviewer: "", // Reviewer's ID
      reviewer_username: "",
      // Automatically generated timestamp
      title,
      timestamp: serverTimestamp(),
    };
    let ref = await addDoc(scribblesCollection, newScribble);
    console.log(ref);
    //add to scribble collection
    console.log("Scribble published!");
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

  const getDraft = async (draftId) => {
    const draftRef = doc(db, `users/${user.uid}/drafts`, draftId);
    const draftSnap = await getDoc(draftRef);
    console.log("GET");
    console.log(user);
    console.log(draftSnap.data());
    return draftSnap.data();
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
        getDraft,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
