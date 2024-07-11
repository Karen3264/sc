"use client";
import { useAuth } from "../context/authContext";
import Spinner from "./Spinner";
import { useRouter, usePathname } from "next/navigation";

export default function Conditional({ children }) {
  const { authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const currentRoute = usePathname();
  if (authLoading || isAuthenticated == -1) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-white">
          <Spinner />
        </div>
      </>
    );
  }
  return (
    <div className="text-center">
      {isAuthenticated ||
      currentRoute == "/signin" ||
      currentRoute == "/signup" ? (
        <>
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {children}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <h1 className="text-4xl font-bold  text-black ">
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
