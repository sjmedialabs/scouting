"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all the fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password Dosen't Match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid or expired link");
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Reset link is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border p-6 shadow">
        <h2 className="text-lg font-semibold text-center">Reset Password</h2>

        {!success ? (
          <>
            <p className="mt-2 text-sm text gray-500 text-center">
              Enter your password below
            </p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="mt-4 w-full rounded-lg border px-4 py-2 text-sm"
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="mt-3 w-full rounded-lg border px-4 py-2 text-sm"
            />

            {error && (
              <p className="mt-2 text-xs text-red-500 text-center">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-full rounded-lg bg-black py-2 text-sm text-white"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        ) : (
          <>
            <div className="mt-6 flex flex-col items-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L16 7"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-600">
                Password Reset Successful
              </p>

              <p className="mt-1 text-xs text-grey-500">
                Redirecting to Login...
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
