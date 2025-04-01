"use client";
import { useAuth } from "../context/authContext";
import Spinner from "./Spinner";
import { useRouter, usePathname } from "next/navigation";

export default function Conditional({ children }) {
  const { authLoading, user } = useAuth();
  const router = useRouter();
  const currentRoute = usePathname();
  if (authLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-white">
          <Spinner />
        </div>
      </>
    );
  }
  return (
    <div className="w-full">
      {user != -1 || currentRoute == "/signin" || currentRoute == "/signup" ? (
        <>
          <div className="min-h-screen bg-gray-100 py-8">
            {children}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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
      )}
    </div>
  );
}
// {isAuthenticated ||
