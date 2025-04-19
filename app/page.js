"use client";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Conditional from "../components/Conditional";
import { useStore } from "../context/storeContext";
import ScribbleCard from "../components/ScribbleCard";
import FloatingButton from "../components/FloatingButton";
import Link from "next/link";

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome, {user.displayName}
          </h1>
          <p className="text-xl text-gray-600">
            Discover and create amazing scribbles
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {scribbles.map((scribble, index) => (
            <ScribbleCard key={index} scribble={scribble} />
          ))}
        </div>

        {scribbles.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium text-gray-900 mb-2">
              No more scribbles
            </h2>
            <p className="text-gray-600">
              Be the first to create a new scribble!
            </p>
          </div>
        )}

        {scribbles.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-6 py-2.5 text-sm font-medium rounded-full transition-colors
                ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              Page {currentPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-6 py-2.5 text-sm font-medium rounded-full bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        <FloatingButton />
      </div>
    </Conditional>
  );
}
