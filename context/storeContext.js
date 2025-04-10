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
  deleteDoc,
} from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { useAuth } from "./authContext";
import { auth, googleProvider, db } from "./firebase";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const { user, setAuthLoading, updateUser } = useAuth();
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

  const saveScribble = async (text, draftId = null, title = "") => {
    const userId = user.uid;
    const draftsCollection = collection(db, `users/${userId}/drafts`);
    
    if (draftId) {
      // Update existing draft
      const docRef = doc(db, `users/${userId}/drafts/${draftId}`);
      await setDoc(docRef, {
        content: text,
        title: title,
        timestamp: serverTimestamp(),
      });
      return draftId;
    } else {
      // Create new draft
      const docRef = await addDoc(draftsCollection, {
        content: text,
        title: title,
        timestamp: serverTimestamp(),
      });
      return docRef.id;
    }
  };

  const publishScribble = async (text, title, status, draftId = null) => {
    const scribblesCollection = collection(db, "scribbles");
    let newewstScribble = await getNewestScribble();
    console.log(newewstScribble)
    console.log(user);
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
    // If this was a draft, delete it after successful publication
    if (draftId) {
      const draftRef = doc(db, `users/${user.uid}/drafts/${draftId}`);
      await deleteDoc(draftRef);
    }

  

      // Update the user document
      console.log("tyring to update user")
      console.log(user.uid)
      const userRef = doc(db, `users/${user.uid}`);
      await setDoc(userRef, {
        isReviewing: true,
        assignedScribble: newewstScribble.id
      }, { merge: true });
      
      console.log(`Assigned scribble ${ref.id} to user ${user.id} for review`);
      
      // Fetch the updated user data from Firebase
      const updatedUserDoc = await getDoc(userRef);
      if (updatedUserDoc.exists()) {
        const updatedUserData = updatedUserDoc.data();
        console.log("Updated user data:", updatedUserData);
        
        // If the updated user is the current user, update the auth context
          const updatedUser = {
            ...user,
            isReviewing: updatedUserData.isReviewing,
            assignedScribble: updatedUserData.assignedScribble
          };
          updateUser(updatedUser);
          console.log("Updated current user in auth context");
        }
      
 

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

  const getScribbleById = async (scribbleId) => {
    const scribbleRef = doc(db, "scribbles", scribbleId);
    const scribbleSnap = await getDoc(scribbleRef);
    if (scribbleSnap.exists()) {
      return { id: scribbleSnap.id, ...scribbleSnap.data() };
    }
    return null;
  };

  const submitReview = async (scribbleId, reviewText, rating) => {
    if (!user) {
      throw new Error("User must be logged in to submit a review");
    }
    console.log("Scribble id: ", scribbleId)
    const scribbleRef = doc(db, "scribbles", scribbleId);
    const scribbleSnap = await getDoc(scribbleRef);
    
    if (!scribbleSnap.exists()) {
      throw new Error("Scribble not found");
    }

    const scribbleData = scribbleSnap.data();
    
    // Check if this is the user's assigned scribble
    const userAssignedRef = doc(db, `users/${user.uid}`);
    const userAssignedSnap = await getDoc(userAssignedRef);
    
    // if (!userAssignedSnap.exists() || userAssignedSnap.data().assignedScribble !== scribbleId) {
    //   throw new Error("You can only review your assigned scribble");
    // }

    // Update the scribble with the review
    await setDoc(scribbleRef, {
      ...scribbleData,
      reviewed: true,
      reviewer: user.uid,
      reviewer_username: user.displayName,
      review: reviewText,
      rating: rating,
      reviewTimestamp: serverTimestamp(),
    });

    // Update the user's reviewing status
    await setDoc(userAssignedRef, {
      isReviewing: false,
      assignedScribble: null,
    });

    // Update the user object in the auth context to reflect the changes
    const updatedUser = {
      ...user,
      isReviewing: false,
      assignedScribble: null
    };
    updateUser(updatedUser);

    return true;
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
        getScribbleById,
        submitReview,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  return useContext(StoreContext);
}
