"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import Link from "next/link";
import Conditional from "../../components/Conditional";
import SignInForm from "./SignInForm";

export default function SignIn() {
  const { signIn, signInWithGoogle, setAuthLoading } = useAuth();

  useEffect(() => {
    setAuthLoading(false);
  }, []);

  return (
    <Conditional>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Sign In
        </h2>
        <SignInForm onSubmit={signIn} onGoogleSignIn={signInWithGoogle} />
        <p className="text-sm text-center text-gray-700">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600">
            Sign Up
          </Link>
        </p>
      </div>
    </Conditional>
  );
}
