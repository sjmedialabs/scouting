"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/auth-fetch";
import {
  User,
  Activity,
  LogIn,
  Edit3,
  UploadCloud,
  Trash2,
  Filter,
} from "lucide-react";

// ------------------------------
// MOCK USER ACTIVITY LOGS
// (Replace with API later)
// ------------------------------
const mockActivity = [
  {
    id: "act-001",
    user: "John Doe",
    email: "john@example.com",
    type: "login",
    message: "User logged in",
    time: "2 mins ago",
    icon: LogIn,
  },
  {
    id: "act-002",
    user: "Sarah Williams",
    email: "sarah@example.com",
    type: "update",
    message: "Updated profile information",
    time: "10 mins ago",
    icon: Edit3,
  },
  {
    id: "act-003",
    user: "Michael Brown",
    email: "michael@example.com",
    type: "upload",
    message: "Uploaded project documents",
    time: "25 mins ago",
    icon: UploadCloud,
  },
  {
    id: "act-004",
    user: "Anita Sharma",
    email: "anita@example.com",
    type: "delete",
    message: "Deleted requirement post",
    time: "1 hour ago",
    icon: Trash2,
  },
];

export default function UserActivityPage() {
  const [activity, setActivity] = useState(mockActivity);
  const [filter, setFilter] = useState("all");

  /*
  -------------------------------------------------
  OPTIONAL: Fetch user activity logs from API
  -------------------------------------------------
  useEffect(() => {
    async function loadActivity() {
      const res = await authFetch("/api/admin/user-activity");
      const data = await res.json();
      setActivity(data);
    }
    loadActivity();
  }, []);
  */

  const filterActivity = (type: string) => {
    setFilter(type);

    if (type === "all") {
      setActivity(mockActivity);
      return;
    }

    setActivity(mockActivity.filter((a) => a.type === type));
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold">User Activity</h1>
        <p className="text-gray-500">
          Track recent user actions and platform interactions.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow border flex gap-3 items-center">
        <Filter className="w-5 h-5 text-gray-600" />
        <span className="text-gray-700 font-medium">Filter by:</span>

        <div className="flex gap-2 flex-wrap">
          {["all", "login", "update", "upload", "delete"].map((t) => (
            <Button
              key={t}
              variant={filter === t ? "default" : "outline"}
              size="sm"
              onClick={() => filterActivity(t)}
            >
              {t.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-6">
        {activity.map((item) => (
          <div
            key={item.id}
            className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-xl transition"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left Section */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-blue-700" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{item.user}</h3>
                  <p className="text-gray-500 text-sm">{item.email}</p>

                  <p className="mt-2 text-gray-700">{item.message}</p>

                  <p className="text-sm text-gray-400 mt-1">{item.time}</p>
                </div>
              </div>

              {/* Activity Type Badge */}
              <Badge
                className={
                  item.type === "login"
                    ? "bg-green-100 text-green-700"
                    : item.type === "update"
                      ? "bg-blue-100 text-blue-700"
                      : item.type === "upload"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-red-100 text-red-700"
                }
              >
                {item.type.toUpperCase()}
              </Badge>
            </div>
          </div>
        ))}

        {activity.length === 0 && (
          <p className="text-gray-500 text-center mt-10 text-lg">
            No activity found for selected filter.
          </p>
        )}
      </div>
    </div>
  );
}
