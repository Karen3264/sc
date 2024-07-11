"use client";
import { useAuth } from "./context/authContext";
import { useEffect } from "react";
import Conditional from "./components/Conditional";
export default function Home() {
  const { signOut, user, setAuthLoading } = useAuth();

  useEffect(() => {
    setAuthLoading(false);
  }, []);

  return (
    <Conditional>
      <h1 className="text-4xl font-bold text-black">
        Welcome {user.displayName}, you are signed in!
      </h1>
      <button
        onClick={signOut}
        className="px-4 py-2 mt-4 text-white bg-red-600 rounded-md"
      >
        Sign Out
      </button>
    </Conditional>
  );
}
