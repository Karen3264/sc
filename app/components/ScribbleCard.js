import React, { useState, useEffect } from "react";

const ScribbleCard = ({ scribble }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Example breakpoint for mobile view
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`max-w-sm rounded overflow-hidden shadow-lg bg-white m-4 ${
        isMobile ? "w-full" : "w-auto"
      }`}
    >
      <div className="px-4 py-4">
        <div className="font-bold text-lg mb-2">{scribble.title}</div>
        <p className="text-gray-700 text-base">{scribble.content}</p>
      </div>
      <div className="px-4 pt-4 pb-2 flex flex-wrap">
        <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          Rating: {scribble.rating}
        </span>
        <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          Rank: {scribble.rank}
        </span>
        <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          Reviewer: {scribble.reviewer_username}
        </span>
      </div>
    </div>
  );
};

export default ScribbleCard;
