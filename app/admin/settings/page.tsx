"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Shield,
  Bell,
  Moon,
  Sun,
  Database,
  Plus,
  Wrench,
} from "lucide-react";

export default function SettingsPage() {
  const [categories, setCategories] = useState([
    "Website Development",
    "UI/UX design",
    "Digital Marketing",
    "Content Writing",
    "SEO Services",
  ]);
  const [autoApprove, setAutoApprove] = useState(false);
  const [reviewModeration, setReviewModeration] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailSender, setEmailSender] = useState("no-reply@platform.com");
  const [retentionDays, setRetentionDays] = useState(365);
  const [theme, setTheme] = useState("system");

  /*
  --------------------------------------------------
  OPTIONAL: Load from backend API
  --------------------------------------------------
  useEffect(() => {
    async function loadSettings() {
      const res = await authFetch("/api/admin/settings");
      const data = await res.json();

      setAutoApprove(data.autoApprove);
      setReviewModeration(data.reviewModeration);
      setMaintenanceMode(data.maintenanceMode);
      setEmailSender(data.emailSender);
      setRetentionDays(data.retentionDays);
      setTheme(data.theme);
    }
    loadSettings();
  }, []);
  */

  const saveSettings = () => {
    console.log("Saving settings:", {
      autoApprove,
      reviewModeration,
      maintenanceMode,
      emailSender,
      retentionDays,
      theme,
    });

    // Future API:
    // await authFetch("/api/admin/settings", { method: "POST", body: JSON.stringify(settings) });
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-orangeButton my-custom-class">
          Platform Settings
        </h1>
        <p className="text-gray-500 my-custom-class">
          Platform management and oversight
        </p>
      </div>

      {/* CATEGORY MANAGEMENT */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 pt-3 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-orangeButton my-custom-class">
            Category Management
          </h2>
          <p className="text-gray-500 text-sm my-custom-class">
            Manage service categories available on the platform
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Add New Category"
            className="flex-1 rounded-xl placeholder:text-gray-400 border-gray-200 my-custom-class"
          />
          <Button className="bg-orangeButton hover:bg-orange-600 flex items-center gap-2 rounded-xl">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1"
            >
              {cat}
              <span className="cursor-pointer text-white">×</span>
            </span>
          ))}
        </div>
      </div>

      {/* PLATFORM SETTINGS */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-orangeButton my-custom-class">
            Platform Settings
          </h2>
          <p className="text-gray-500 text-sm my-custom-class">
            Manage service categories available on the platform
          </p>
        </div>

        {/* Auto approve */}
        <SettingItem
          title="Auto-approve new providers"
          description="Automatically approve new service provider registrations"
        />

        {/* Review moderation */}
        <SettingItem
          title="Review moderation"
          description="Require admin approval for all reviews"
        />

        {/* Subscription management */}
        <SettingItem
          title="Subscription management"
          description="Manage subscription tiers and pricing"
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   SETTING ITEM ROW
--------------------------------------------------------- */
function SettingItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between border rounded-2xl p-4">
      <div>
        <h3 className="font-bold text-sm text-gray-900 my-custom-class">{title}</h3>
        <p className="text-sm text-gray-500 my-custom-class">{description}</p>
      </div>

      <Button className="bg-orangeButton hover:bg-orange-600 rounded-xl px-6">
        Configure
      </Button>
    </div>
  );
}

