"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authFetch } from "@/lib/auth-fetch";


export default function SetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Something went wrong")
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    setTimeout(() => router.push("/login"), 2000)
  }

  if (!token) {
    return <p className="p-10 text-red-600">Invalid or missing token</p>
  }

  return (
    <div className="max-w-md mx-auto mt-24 space-y-6">
      <h1 className="text-2xl font-bold">Set Your Password</h1>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">Password set successfully!</p>}

      {!success && (
        <>
          <Input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Setting..." : "Set Password"}
          </Button>
        </>
      )}
    </div>
  )
}
