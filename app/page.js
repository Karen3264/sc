"use client";
import { useAuth } from "./context/authContext";
import { useEffect, useState } from "react";
import Conditional from "./components/Conditional";
import { useStore } from "./context/storeContext";
export default function Home() {
  const { signOut, user, setAuthLoading } = useAuth();
  const { getScribbles } = useStore();
  const [scribbles, setScribbles] = useState([]);

  useEffect(() => {
    fetchScribbles();
  }, []);

  const fetchScribbles = async () => {
    let sc = await getScribbles();
    console.log(sc);
    setScribbles(sc);
    setAuthLoading(false);
  };

  return (
    <Conditional>
      <h1 className="text-4xl font-bold text-black">
        Welcome {user.displayName}, you are signed in!
      </h1>
      <ul className="list-disc pl-5">
        {scribbles.map((scribble, index) => (
          <li className="text-black" key={index}>
            {scribble.title}
          </li>
        ))}
      </ul>
      <button
        onClick={signOut}
        className="px-4 py-2 mt-4 text-white bg-red-600 rounded-md"
      >
        Sign Out
      </button>
    </Conditional>
  );
}
