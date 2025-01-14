import { useState } from "react";

export default function SignInForm({ onSubmit, onGoogleSignIn }) {
  const [email, setEmail] = useState("ara@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(email, password);
    } catch (err) {
      setError("Failed to sign in");
    }
  };

  return (
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
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md text-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md"
        >
          Sign In
        </button>
      </div>
      <div className="text-center">
        <button
          type="button"
          onClick={onGoogleSignIn}
          className="px-4 py-2 mt-4 text-white bg-red-600 rounded-md"
        >
          Sign In with Google
        </button>
      </div>
    </form>
  );
}
