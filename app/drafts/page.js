"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useStore } from "../context/storeContext";
import { useRouter } from "next/navigation";

export default function Drafts() {
  const { user } = useAuth();
  const { getDrafts } = useStore();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchDrafts();
    }
  }, [user]);

  const fetchDrafts = async () => {
    try {
      const drafts = await getDrafts(user.uid);
      setDrafts(drafts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching drafts:", error);
      setLoading(false);
    }
  };

  const handleEdit = (draftId) => {
    router.push(`/edit?id=${draftId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Drafts</h1>
      {drafts.length === 0 ? (
        <p>You have no drafts.</p>
      ) : (
        <ul className="list-disc pl-5">
          {drafts.map((draft) => (
            <li key={draft.id} className="mb-2">
              <div className="flex justify-between items-center">
                <span>{draft.content.substring(0, 100)}...</span>
                <button
                  onClick={() => handleEdit(draft.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
