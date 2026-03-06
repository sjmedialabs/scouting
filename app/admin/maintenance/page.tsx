"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  const [maintenance, setMaintenance] = useState(false);

  const save = () => {
    alert("Maintenance mode is now: " + (maintenance ? "ON" : "OFF"));
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Maintenance Mode</h1>
      <p className="text-gray-500">Enable or disable platform maintenance mode.</p>

      <div className="bg-white p-6 rounded-2xl border shadow flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-600" />
            Platform Maintenance
          </h2>
          <p className="text-gray-500 text-sm">Users cannot access the platform while maintenance is active.</p>
        </div>

        <Switch checked={maintenance} onCheckedChange={setMaintenance} />
      </div>

      <Button className="bg-blue-600 hover:bg-blue-700" onClick={save}>
        Save Settings
      </Button>
    </div>
  );
}
