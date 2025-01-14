"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import Link from "next/link";
import Conditional from "../../components/Conditional";
import SignUpForm from "./SignUpForm";

export default function SignUp() {
  const { signUp, authLoading, setAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setAuthLoading(false);
  }, []);

  const handleSignUp = async (displayName, email, password) => {
    await signUp(email, password, displayName);
    router.push("/");
  };

  return (
    <Conditional>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Sign Up
        </h2>
        <SignUpForm onSubmit={handleSignUp} />
        <p className="text-sm text-center text-gray-700">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-600">
            Sign In
          </Link>
        </p>
      </div>
    </Conditional>
  );
}
