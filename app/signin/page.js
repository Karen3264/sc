// app/signin/page.js
'use client'; // Marking this file as a client component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' for hooks in the app directory
import { useAuth } from '../context/authContext';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('k@dd');
  const [password, setPassword] = useState('tq');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Perform sign-in logic (e.g., Firebase auth)
      signIn();
      router.push('/');
    } catch (err) {
      setError('Failed to sign in');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
          Don't have an account? <Link href="/signup" className="text-blue-600">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
