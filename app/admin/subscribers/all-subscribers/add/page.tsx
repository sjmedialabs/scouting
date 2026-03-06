"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authFetch } from "@/lib/auth-fetch";

export default function AddSubscriberPage() {

   const [form, setForm] = useState({
    company: "",
    email: "",
    plan: "",
    status: "",
    users: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await authFetch("/api/admin/create-agency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
     
      body: JSON.stringify({
        company: form.company,
        email: form.email,
      }),
    });

    if (!res.ok) throw new Error();

    setSuccess(true);
    setError("");
  } catch {
    setError("Failed to add subscriber");
  }
};


  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-2 py-0">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-orangeButton h-8 my-custom-class">
          Add New Subscriber
        </h1>
        <p className="text-gray-500 text-xl mt-1 my-custom-class">
          Enter below information
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="mb-6 rounded-xl bg-green-100 text-green-700 px-4 py-3">
          Subscriber added successfully!
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-100 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Name */}
        <div className="space-y-2">
          <label className="text-sm  my-custom-class font-bold text-gray-400">
            Company Name
          </label>
          <Input 
          onChange={(e) => handleChange("company", e.target.value)}
          className="placeholder:text-gray-500 border-gray-300 rounded-xl my-custom-class placeholder:text-xs" 
          placeholder="Enter Company Name" />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-bold my-custom-class text-gray-400">
            Email address
          </label>
          <Input 
          onChange={(e) => handleChange("email", e.target.value)}
          className="placeholder:text-gray-500 border-gray-300 rounded-xl my-custom-class placeholder:text-xs" 
          placeholder="Enter email address" 
          type="email"
          />
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-4 mt-10">
        <Button 
        type="submit"
        className="bg-orange-600 hover:bg-orange-500 text-white px-6 rounded-full">
          Add Subscriber
        </Button>

        <Button
          type="button"
          variant="outline"
          className="bg-black text-white hover:bg-black/70 px-8 rounded-full"
          onClick={() =>
              setForm({
                company: "",
                email: "",
                plan: "",
                status: "",
                users: "",
              })
            }
        >
          Cancel
        </Button>
      </div>
      </form>
    </div>
  );
}
