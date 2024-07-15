"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../context/storeContext";
import Conditional from "../components/Conditional";
import { useAuth } from "../context/authContext";

export default function EditScribble() {
  const { signUp, authLoading, setAuthLoading } = useAuth();

  useEffect(() => {
    setAuthLoading(false);
  });

  const router = useRouter();
  const { saveScribble, publishScribble } = useStore();
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  const handleSaveDraft = async () => {
    await saveScribble(text, Date.now());
    setStatus("Draft saved");
  };

  const handlePublish = async () => {
    await publishScribble(text, "published");
    setStatus("Scribble published");
    router.push("/"); // Redirect to home or any other page
  };

  return (
    <Conditional>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-black">Edit Scribble</h1>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
          rows="10"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your scribble here..."
        ></textarea>
        <div className="flex justify-between">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Save as Draft
          </button>
          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Publish
          </button>
        </div>
        {status && <p className="mt-4 text-green-500">{status}</p>}
      </div>
    </Conditional>
  );
}
