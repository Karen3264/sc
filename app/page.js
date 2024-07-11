// app/page.js
'use client'; // Marking this file as a client component

import { useAuth } from './context/authContext';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' for hooks in the app directory

export default function Home() {
  const { isAuthenticated, signOut } = useAuth();
  const router = useRouter();



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        {isAuthenticated ? (
          <>
            <h1 className="text-4xl font-bold text-black">Welcome, you are signed in!</h1>
            <button onClick={signOut} className="px-4 py-2 mt-4 text-white bg-red-600 rounded-md">
              Sign Out
            </button>
          </>
        ) : (<>
          <h1 className="text-4xl font-bold  text-black">You are not signed in.</h1>
          <button onClick={()=>  router.push('/signin')} className="px-4 py-2 mt-4 text-white bg-red-600 rounded-md">
              Sign In
            </button>

          </>
          
        )}
      </div>
    </div>
  );
}

