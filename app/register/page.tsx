"use client";

import { useState,useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [role, setRole] = useState<"agency" | "client">("client");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  console.log("Query paraameter is:::::",type)

const handleSubmit = async () => {
  if (loading) return
  setError("")
  setLoading(true)

  try {
    const user = await register(
      email,
      password,
      name,
      role,
      role === "agency" ? companyName : undefined
    )

    if (user.role === "client") {
      router.replace("/client/dashboard")
    }

    if (user.role === "agency") {
      router.replace("/agency/dashboard")
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : "Registration failed")
  } finally {
    setLoading(false)
  }
}

 useEffect(()=>{
    if(type){
    type==="provider"?setRole("agency"):setRole("client")
  }
 },[])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      {/* Modal Card */}
      <div className="relative w-full max-w-3xl h-[97vh] overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="grid h-full grid-cols-1 lg:grid-cols-12">

          {/* LEFT SECTION */}
          <div
            className="relative hidden lg:flex lg:col-span-6 h-full flex-col justify-between p-10 text-white bg-cover"
            style={{
              backgroundImage: "url('/images/Login-Image.png')",
              backgroundPosition: "left bottom"
            }}
          >
            <div className="relative z-10 max-w-sm">
              <h2 className="text-2xl font-extrabold leading-tight">
                Built to Accelerate <br /> Business Success
              </h2>

              <ul className="mt-2 space-y-2 text-[10px] text-white">
                <li>owering Smarter Business Connections</li>
                <li>700+ Categories. One Trusted Platform.</li>
                <li>Quality Work. Accelerated Results.</li>
                <li>Your Gateway to Global Talent & Businesses</li>
              </ul>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="lg:col-span-6 h-full overflow-y-auto p-8 sm:p-10">
            <h3 className="text-lg font-semibold text-center">Create Account</h3>
            <p className="mt-0.1 text-[10px] text-gray-400 text-center">
              Join Spark to connect with agencies or offer your services
            </p>

            {/* Account Type */}
            <div className="mt-2">
              <label className="text-xs font-bold text-gray-700">
                Account Type
              </label>
              <div className="mt-2 flex gap-6 text-[10px] text-gray-400">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={role === "agency"}
                    onChange={() => setRole("agency")}
                  />
                  Agency
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={role === "client"}
                    onChange={() => setRole("client")}
                  />
                  Client
                </label>
              </div>
            </div>

            {/* Inputs */}
            <div className="mt-1 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600">Full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Your Name"
                  className="mt-0.1 w-full rounded-xl border border-gray-200 bg-[#f6f9fe] px-4 py-2 text-[10px]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter E-Mail"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-[#f6f9fe] px-4 py-2 text-[10px]"
                />
              </div>

              <div>
  <label className="text-xs font-bold text-gray-600">Password</label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter Password"
      className="mt-1 w-full rounded-xl border border-gray-200 bg-[#f6f9fe] px-4 py-2 pr-10 text-[10px]"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  </div>
</div>


              <div>
                <label className="text-xs font-bold text-gray-600">
                  Company Name {role === "agency" ? "(Required)" : "(Optional)"}
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your Company Name"
                  required={role === "agency"}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-[#f6f9fe] px-4 py-2 text-[10px]"
                />
              </div>
            </div>

            {error && (
              <p className="mt-2 text-center text-[10px] text-red-500">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 cursor-pointer w-full rounded-xl bg-black py-2 text-xs font-medium text-white hover:bg-gray-900 transition"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Footer */}
            <p className="mt-1 text-center text-xs text-black">
              Already have an account?
              <span
                onClick={() => router.push("/login")}
                className="ml-1 cursor-pointer underline hover:text-blue-400 font-medium text-black"
              >
                Sign in here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
