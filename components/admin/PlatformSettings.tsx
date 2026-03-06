"use client";

import { Button } from "@/components/ui/button";

export function PlatformSettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Platform Settings</h2>

      <div className="space-y-4">
        <div className="p-4 bg-white rounded-xl border shadow-sm flex justify-between">
          <div>
            <h3 className="font-semibold">Auto Approve Providers</h3>
            <p className="text-sm text-gray-600">Automatically approve new providers</p>
          </div>
          <Button variant="outline">Configure</Button>
        </div>

        <div className="p-4 bg-white rounded-xl border shadow-sm flex justify-between">
          <div>
            <h3 className="font-semibold">Review Moderation</h3>
            <p className="text-sm text-gray-600">Admin review required for user reviews</p>
          </div>
          <Button variant="outline">Configure</Button>
        </div>
      </div>
    </div>
  );
}
