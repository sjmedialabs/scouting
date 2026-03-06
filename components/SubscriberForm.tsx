"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

type SubscriberFormProps = {
  initialData?: {
    company: string;
    email: string;
    plan: string;
    status: string;
    users: string;
  };
  mode: "add" | "edit";
  onSubmit: (data: any) => void;
  onCancel?: () => void;
};

export default function SubscriberForm({
  initialData,
  mode,
  onSubmit,
  onCancel,
}: SubscriberFormProps) {
  const [form, setForm] = useState({
    company: "",
    email: "",
    plan: "",
    status: "",
    users: "",
  });

  const [error, setError] = useState("");

  // ✅ Pre-fill for edit
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.company ||
      !form.email ||
      !form.plan ||
      !form.status ||
      !form.users
    ) {
      setError("All fields are required.");
      return;
    }

    setError("");
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 rounded-xl bg-red-100 text-red-700 px-4 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
        className="border-gray-200 rounded-xl"
          value={form.company}
          onChange={(e) => handleChange("company", e.target.value)}
          placeholder="Company Name"
        />

        <Input
        className="border-gray-200 rounded-xl"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Email address"
        />

        <Select value={form.plan} onValueChange={(v) => handleChange("plan", v)}>
          <SelectTrigger
          className="border-gray-200 rounded-xl">
            <SelectValue placeholder="Select Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enterprise">Enterprise</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
          </SelectContent>
        </Select>

        <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
          <SelectTrigger
          className="border-gray-200 rounded-xl">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        <Input
        className="border-gray-200 rounded-xl"
          type="number"
          value={form.users}
          onChange={(e) => handleChange("users", e.target.value)}
          placeholder="No. of users"
        />
      </div>

      <div className="flex gap-4 mt-8">
        <Button type="submit" className="bg-orange-600 rounded-full">
          {mode === "add" ? "Add Subscriber" : "Save Changes"}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="bg-black text-white rounded-full"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
