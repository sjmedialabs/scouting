"use client";

import EditSubscriberModal from "@/components/EditSubscriberModal";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Pencil, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Plus } from "lucide-react";

/* ---------------- TYPES ---------------- */

type Subscriber = {
  id: string;
  company: string;
  email: string;
  role: "client" | "agency";
  plan: string;
  status: "Active" | "Inactive";
  users: number;
  revenue: number;
  joined: string;
  billingCycle?: "Monthly" | "Yearly";
};



export default function AllSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState<"all" | "client" | "agency">("all");

 const toggleStatus = async (sub: Subscriber) => {
  // const sub = subscribers[index];
  console.log("recived sub::::",sub)
  const newIsActive = sub.status === "Active" ? false : true;

  try {
    const res = await fetch(`/api/users/${sub.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        isActive: newIsActive,
      }),
    });

    if (!res.ok) throw new Error("Update failed");

    // Update UI after DB success
    setSubscribers((prev) =>
      prev.map((s, i) =>
        s.id === sub.id
          ? { ...s, status: newIsActive ? "Active" : "Inactive" }
          : s
      )
    );
  } catch (error) {
    alert("Failed to update user status");
  }
};



  useEffect(() => {
  async function loadSubscribers() {
    try {
      setLoading(true)

      const roleQuery = role !== "all" ? `&role=${role}` : ""

      const res = await fetch(
        `/api/users?limit=50&page=1${roleQuery}`,
        { credentials: "include" } 
      );

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      console.log ("RAW USER FROM API:" , data.users[0])

      // Convert backend users → table format
      const formatted = data.users
  .filter((u: any) => u.role !== "admin")
  .map((u: any) => {
    let plan = "—";
    let revenue = 0;

    if (u.role === "agency") {
      if (u.subscriptionPlanId) {
        plan = u.subscriptionPlanId.title;

        // ✅ Dynamic Monthly Revenue (MRR)
        revenue =
          u.billingCycle === "Yearly"
            ? Math.round(u.subscriptionPlanId.pricePerYear / 12)
            : u.subscriptionPlanId.pricePerMonth;
      } else {
        plan = "Trial";
        revenue = 0;
      }
    }

    return {
      id: u._id,
      company: u.company || u.name,
      email: u.email,
      role: u.role,
      plan,
      status: u.isActive ? "Active" : "Inactive",
      users: 1,
      revenue,
      joined: u.createdAt.split("T")[0],
      billingCycle: u.billingCycle,
    };
  });


      setSubscribers(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  loadSubscribers();
}, [role]);



  const filtered = subscribers.filter((s) => {
  const matchesSearch =
    s.company.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    status === "all" || s.status.toLowerCase() === status;

  const matchesRole =
    role === "all" || s.role === role;

  return matchesSearch && matchesStatus && matchesRole;
});



  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 space-y-4">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold my-custom-class text-orangeButton">
            Subscribers
          </h1>
          <p className="text-gray-500 my-custom-class text-xl">
            Manage and monitor your customer subscriptions
          </p>
        </div>

        <Link href="/admin/subscribers/all-subscribers/add">
          <Button className="bg-black text-white rounded-3xl my-custom-class flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Subscriber
          </Button>
        </Link>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row  gap-4">
        <div className="border rounded-xl w-100">
          <Input
            placeholder="Search Subscribers"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:max-w-sm my-custom-class placeholder:text-gray-500"
          />
        </div>
        <div className="rounded-xl border">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="md:w-48 my-custom-class">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="my-custom-class">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              {/* <SelectItem value="suspended">Suspended</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border">
          <Select value={role} onValueChange={(v) => setRole(v as any)}>
            <SelectTrigger className="md:w-48 my-custom-class">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="client">Clients</SelectItem>
              <SelectItem value="agency">Agencies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-md">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="text-left text-sm font-semibold border-b">
              <th className="p-4 my-custom-class">Company</th>
              <th className="p-4 my-custom-class">Plan</th>
              <th className="p-4 my-custom-class">Status</th>
              <th className="p-4 my-custom-class">Users</th>
              <th className="p-4 my-custom-class">Monthly Revenue</th>
              <th className="p-4 my-custom-class">Join Date</th>
              <th className="p-4 my-custom-class">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((sub, i) => (
              <tr
                key={i}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  <div className="font-bold text-sm h-4 my-custom-class">
                    {sub.company}
                  </div>
                  <div className="text-sm text-gray-500">{sub.email}</div>
                </td>

                <td className="p-4">
                  <Badge
                    className={
                      sub.plan === "Trial"
                        ? "bg-yellow-100 text-yellow-700 rounded-2xl"
                        : sub.plan === "—"
                        ? "bg-gray-50 text-gray-400 rounded-2xl"
                        : sub.plan === "Pro"
                        ? "bg-pink-100 text-pink-600 rounded-2xl"
                        : "bg-blue-100 text-blue-600 rounded-2xl"
                    }
                  >
                    {sub.plan}
                  </Badge>

                </td>

                <td className="p-4">
                  <Badge
                    className={
                      sub.status === "Active"
                        ? "bg-green-100 text-green-600 rounded-2xl"
                        : sub.status === "Inactive"
                          ? "bg-gray-200 text-gray-600 rounded-2xl"
                          : "bg-red-200 text-red-600 rounded-2xl"
                    }
                  >
                    {sub.status}
                  </Badge>
                </td>

                <td className="p-4 text-gray-500 text-sm">
                  {sub.users.toString().padStart(2, "0")}
                </td>

                <td className="p-4 text-sm">${sub.revenue.toLocaleString()}</td>

                <td className="p-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {sub.joined}
                </td>

                <td className="p-4">
                  <div className="flex items-center justify-center gap-3">
                    {/* <EditSubscriberModal subscriber={sub} /> */}
                    <UserX
                    onClick={() => toggleStatus(sub)}
                    className={`h-4 w-4 cursor-pointer ${
                      sub.status === "Active"
                        ? "text-red-600 hover:text-red-800"
                        : "text-green-600 hover:text-green-800"
                    }`}
                  />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
