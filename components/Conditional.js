"use client";
import { useAuth } from "../context/authContext";
import Spinner from "./Spinner";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Conditional({ children }) {
  const { authLoading, user } = useAuth();
  const router = useRouter();
  const currentRoute = usePathname();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spinner />
      </div>
    );
  }

  if (user != -1 || currentRoute == "/signin" || currentRoute == "/signup") {
    // Check if user is reviewing and we're on the review page
    console.log(user);
    console.log("YEET");
    if (user.isReviewing && currentRoute != "/review" && currentRoute != "/profile") {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      
      // If the current review page is not the assigned scribble
      if (1==1) {
        return (
          <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto p-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">You have a scribble to review</h2>
                <p className="text-gray-600 mb-6">Please review your assigned scribble before viewing others.</p>
                <Link 
                  href={`/review?id=${user.assignedScribble}`}
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Assigned Review
                </Link>
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="min-h-screen bg-white">
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold text-black">
        You are not signed in.
      </h1>
      <button
        onClick={() => router.push("/signin")}
        className="px-4 py-2 mt-4 text-white bg-red-600 rounded-md"
      >
        Sign In
      </button>
    </div>
  );
}
// {isAuthenticated ||
