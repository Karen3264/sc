'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContext';
import Link from 'next/link';
import Conditional from '../components/Conditional';

export default function SignUp() {
  const [displayName, setdisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, authLoading, setAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setAuthLoading(false)
  },[])


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password, displayName);
      router.push('/');
    } catch (err) {
      setError('Failed to sign up');
    }
  };

  return (
  
    <Conditional>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="username"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md text-gray-700"
              value={displayName}
              onChange={(e) => setdisplayName(e.target.value)}
              required
            />
          </div>
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
            <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md">Sign Up</button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-700">
          Already have an account? <Link href="/signin" className="text-blue-600">Sign In</Link>
        </p>
      </div>
    </Conditional>
   
  );
}
