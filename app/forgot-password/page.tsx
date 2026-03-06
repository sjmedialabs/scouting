"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth-fetch";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const data = await res.json();
      if (data.resetUrl) {
        router.push(data.resetUrl);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("Unable to send reset link. Try again.");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border p-6 shadow">
        <h2 className="text-lg font-semibold text-center">Forgot Password</h2>

        {!success ? (
          <>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Enter your registered email. We’ll send a reset link.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-4 w-full rounded-lg border px-4 py-2 text-sm"
            />

            {error && (
              <p className="mt-2 text-xs text-red-500 text-center">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-full rounded-lg bg-black py-2 text-sm text-white"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p
              onClick={() => router.push("/login")}
              className="mt-4 cursor-pointer text-center text-xs underline"
            >
              Back to login
            </p>
          </>
        ) : (
          <>
            <p className="mt-6 text-sm text-center text-green-600">
              If this email exists, a reset link has been sent.
            </p>

            <button
              onClick={() => router.push("/login")}
              className="mt-6 w-full rounded-lg bg-black py-2 text-sm text-white"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
