"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockAdminUsers } from "@/lib/mock-data";
import { Shield, UserCheck, UserMinus } from "lucide-react";

const ROLE_OPTIONS = [
  "super-admin",
  "admin",
  "moderator",
  "provider",
  "seeker",
];
interface RoleManagement {
  userId: string;
  newRole: string;
}
export default function RoleManagementPage() {
  const [users, setUsers] = useState(mockAdminUsers);
  const [loading, setLoading] = useState(false);

  /*
  --------------------------------------------------
  OPTIONAL: Load user roles from backend
  --------------------------------------------------
  useEffect(() => {
    async function loadRoles() {
      const res = await authFetch("/api/admin/roles");
      const data = await res.json();
      setUsers(data);
    }
    loadRoles();
  }, []);
  */

  const updateRole = async (userId: string, newRole: any) => {
    setLoading(true);

    // Update locally
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    );

    console.log(`Role updated for ${userId}: ${newRole}`);

    /*
    --------------------------------------------------
    OPTIONAL: Save role update to backend
    --------------------------------------------------
    await authFetch("/api/admin/roles/update", {
      method: "POST",
      body: JSON.stringify({ userId, role: newRole }),
    });
    */

    setLoading(false);
  };

  const revokeRole = async (userId: string) => {
    setLoading(true);

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: "seeker" } : u)),
    );

    console.log(`Role revoked for ${userId}`);

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Role Management</h1>
        <p className="text-gray-500">
          Assign roles and manage user permissions.
        </p>
      </div>

      {/* User Roles Table */}
      <div className="bg-white rounded-2xl p-6 shadow border">
        <h2 className="text-xl font-semibold mb-4">Manage Roles</h2>

        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-4"
            >
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>

                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
              </div>

              {/* Role Dropdown + Actions */}
              <div className="flex items-center gap-4 mt-3 md:mt-0">
                {/* Current Role */}
                <Badge className="bg-purple-100 text-purple-600 px-3 py-1">
                  {user.role || "seeker"}
                </Badge>

                {/* Role Selector */}
                <select
                  className="border rounded-lg px-3 py-2 text-sm bg-white"
                  value={user.role}
                  onChange={(e) => updateRole(user.id, e.target.value)}
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role.toUpperCase()}
                    </option>
                  ))}
                </select>

                {/* Revoke Role */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => revokeRole(user.id)}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <UserMinus className="w-4 h-4" />
                  Revoke
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Definitions Section */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-2">Role Definitions</h2>
        <p className="text-gray-500 mb-4">
          Permission levels for each type of role.
        </p>

        <ul className="space-y-2 text-gray-700">
          <li>
            <strong>Super Admin</strong> — Full system access, billing,
            platform-wide control.
          </li>
          <li>
            <strong>Admin</strong> — Manage users, categories, moderation,
            settings.
          </li>
          <li>
            <strong>Moderator</strong> — Handles content moderation only.
          </li>
          <li>
            <strong>Provider</strong> — Businesses offering services.
          </li>
          <li>
            <strong>Seeker</strong> — Businesses seeking services.
          </li>
        </ul>
      </div>
    </div>
  );
}
