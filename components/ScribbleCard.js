import React, { useState, useEffect } from "react";

const ScribbleCard = ({ scribble }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      //setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="px-8 py-6">
        <div className="font-bold text-2xl mb-4">{scribble.title}</div>
        <p className="text-gray-700 text-lg whitespace-pre-wrap leading-relaxed">{scribble.content}</p>
      </div>
      <div className="px-8 py-4 bg-gray-50 flex flex-wrap gap-3">
        <span className="bg-white rounded-full px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
          Rating: {scribble.rating}
        </span>
        <span className="bg-white rounded-full px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
          Rank: {scribble.rank}
        </span>
        <span className="bg-white rounded-full px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
          Reviewer: {scribble.reviewer_username}
        </span>
      </div>
    </div>
  );
};

export default ScribbleCard;
