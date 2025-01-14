"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useStore } from "../../context/storeContext";
import { useRouter } from "next/navigation";
import DraftsList from "./DraftsList";

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
      <DraftsList drafts={drafts} onEdit={handleEdit} />
    </div>
  );
}
