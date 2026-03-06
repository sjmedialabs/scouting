"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ContentPoliciesPage() {
  // Last saved version (mock – later comes from backend)
  const [savedPolicy, setSavedPolicy] = useState(
    ""
  );

  // Current editable text
  const [policyText, setPolicyText] = useState(savedPolicy);

  const handleSave = () => {
    setSavedPolicy(policyText);
    console.log("Saved content policy:", policyText);
    alert("Content policies saved successfully.");
  };

  const handleCancel = () => {
    setPolicyText(savedPolicy);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-orangeButton my-custom-class">
          Content Policies
        </h1>
        <p className="text-gray-500 text-base max-w-3xl my-custom-class">
          Define and manage the platform’s content guidelines. These policies
          help users understand what is allowed, restricted, or prohibited on
          the platform.
        </p>
      </div>

      {/* EDITOR CARD */}
      <Card className="rounded-2xl border shadow-lg bg-white">
        <CardContent className="p-6 space-y-2 pt-1">
          {/* Section Title */}
          <div>
            <h2 className="text-lg font-semibold text-orangeButton my-custom-class">
              Policy Description
            </h2>
            <p className="text-sm text-gray-500 my-custom-class">
              Write or update your platform’s content rules and moderation
              guidelines.
            </p>
          </div>

          {/* TEXT EDITOR */}
          <Textarea
            value={policyText}
            onChange={(e) => setPolicyText(e.target.value)}
            rows={14}
            placeholder="Start writing your content policies here..."
            className="resize-none rounded-xl border-gray-200 text-sm leading-relaxed placeholder:text-gray-500"
          />

          {/* ACTIONS */}
          <div className="flex justify-end gap-4">
            {/* <Button
              variant="outline"
              className="rounded-xl bg-[#ff0505] text-white"
              onClick={handleCancel}
              disabled={policyText === savedPolicy}
            >
              Cancel
            </Button> */}

            <Button
              className="rounded-xl bg-black text-white hover:bg-gray-900"
              onClick={handleSave}
              disabled={policyText.trim() === ""}
            >
              Save Policies
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
