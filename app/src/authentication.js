"use client";

import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./services/firebase/config"; // Siguroha nga husto ang folder path padulong sa config.js gikan ani nga file

export default function Authentication({ role, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);

    try {
      await signInWithPopup(auth, provider);
      onSuccess();
    } catch (error) {
      console.error("Google Auth Error:", error);
      alert("Napakyas ang pag-login gamit ang Google: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-pink-50 p-6 sm:p-8 rounded-3xl shadow-xl w-full border-4 border-pink-300 text-center">
      <h2 className="text-2xl font-black text-black mb-2 uppercase tracking-wide">
        🔐 {role.toUpperCase()} Access
      </h2>
      <p className="text-sm text-neutral-800 font-bold mb-6">
        Kinahanglan mo-verify gamit ang Google para makasulod sa dashboard.
      </p>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-black font-black py-3.5 px-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="text-lg">🌐</span>
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>

      <button
        onClick={onCancel}
        className="text-xs font-black text-red-600 block mx-auto hover:underline mt-6"
      >
        ◀ Balik sa Pagpili og Role
      </button>
    </div>
  );
}