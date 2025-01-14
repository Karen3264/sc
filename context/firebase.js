import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAR5nCyDO_ONBNi6IH7KuXAKWGm4ux8oNw",
  authDomain: "writtle-c2f9d.firebaseapp.com",
  projectId: "writtle-c2f9d",
  storageBucket: "writtle-c2f9d.appspot.com",
  messagingSenderId: "445990233810",
  appId: "1:445990233810:web:8c6adb7ad11c73f618af0b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };
