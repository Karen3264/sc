// app/signin/page.js
'use client'; // Marking this file as a client component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' for hooks in the app directory
import { useAuth } from '../context/authContext';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('karenvergeest@gmail.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle, authLoading, setAuthLoading} = useAuth();
  const router = useRouter();


  useEffect(()=>{
    setAuthLoading(false)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
    } catch (err) {
        
      setError('Failed to sign in');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
             {authLoading ? (
        <div className="text-center">
          <p className="text-xl font-bold text-gray-700">Loading...</p>
        </div>
      ) : (
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign In</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md text-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md">Sign In</button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-700">
          Dont have an account? <Link href="/signup" className="text-blue-600">Sign Up</Link>
        </p>
        <div className="text-center">
          <button onClick={signInWithGoogle} className="px-4 py-2 mt-4 text-white bg-red-600 rounded-md">
            Sign In with Google
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
