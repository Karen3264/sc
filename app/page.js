"use client";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Conditional from "../components/Conditional";
import { useStore } from "../context/storeContext";
import ScribbleCard from "../components/ScribbleCard";
import FloatingButton from "../components/FloatingButton";

export default function Home() {
  const { signOut, user, setAuthLoading } = useAuth();
  const { getScribblesByRank, getNewestScribble } = useStore();
  const [scribbles, setScribbles] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get("page");
    const pageNum = page ? parseInt(page) : 1;
    setCurrentPage(pageNum);
    fetchScribbles(pageNum);
  }, [pathname]);

  const fetchScribbles = async (page) => {
    setAuthLoading(true);
    let newScr = await getNewestScribble();
    let highrank = parseInt(newScr.rank);
    page = page - 1;
    let sc = await getScribblesByRank(
      highrank - 5 - page * 5,
      highrank - page * 5
    );

    setScribbles(sc);
    setAuthLoading(false);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    router.push(`/?page=${newPage}`);
    fetchScribbles(newPage);
  };

  return (
    <Conditional>
      <h1 className="text-4xl font-bold text-black">
        Welcome {user.displayName}, you are signed in!
      </h1>
      <ul className="list-disc pl-5">
        {scribbles.map((scribble, index) => (
          <ScribbleCard key={index} scribble={scribble} />
        ))}
      </ul>
      {scribbles.length == 0 ? (
        <h1 className="text-black">No more pages</h1>
      ) : null}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={`px-4 py-2 text-white bg-blue-600 rounded-md ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 text-white bg-blue-600 rounded-md"
        >
          Next
        </button>
      </div>
      <button
        onClick={signOut}
        className="px-4 py-2 mt-4 text-white bg-red-600 rounded-md"
      >
        Sign Out
      </button>
      <FloatingButton />
    </Conditional>
  );
}
