"use client";

import { Badge } from "@/components/ui/badge";

export function RecentActivity({ users, reportedContent }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Recent User Activity</h3>

        {users.slice(0, 5).map((u: any) => (
          <div key={u.id} className="flex justify-between border-b py-2">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-gray-600">{u.email}</p>
            </div>
            <Badge>{u.status}</Badge>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Content Reports</h3>

        {reportedContent.slice(0, 5).map((r: any) => (
          <div key={r.id} className="flex justify-between border-b py-2">
            <div>
              <p className="font-medium">{r.reason}</p>
              <p className="text-sm text-gray-600">{r.type}</p>
            </div>
            <Badge>{r.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
