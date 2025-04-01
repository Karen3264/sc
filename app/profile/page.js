"use client";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import Conditional from "../../components/Conditional";

export default function Profile() {
  const { user, deleteAccount, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await deleteAccount();
      } catch (error) {
        console.error("Error deleting account:", error);
        setError("Failed to delete account. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Conditional>
      <div className="max-w-4xl mx-auto p-8 space-y-6 bg-white rounded-md shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Profile</h2>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <p className="text-xl text-gray-900">{user.displayName}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-xl text-gray-900">{user.email}</p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 space-y-4">
          <button
            onClick={signOut}
            className="w-full px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg font-medium"
          >
            Sign Out
          </button>
          
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="w-full px-4 py-3 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
          >
            {isDeleting ? "Deleting Account..." : "Delete Account"}
          </button>
          {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
        </div>
      </div>
    </Conditional>
  );
}