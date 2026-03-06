"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Megaphone } from "lucide-react";

export default function AnnouncementsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const publish = () => {
    alert(`Announcement published:\n${title}\n${body}`);
    setTitle("");
    setBody("");
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Announcements</h1>
      <p className="text-gray-500">Create updates visible to all users.</p>

      <div className="bg-white p-6 rounded-2xl border shadow space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-purple-600" />
          New Announcement
        </h2>

        <Input
          placeholder="Announcement title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border rounded-xl p-4"
          rows={4}
          placeholder="Write your announcement..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>

        <Button className="bg-blue-600 hover:bg-blue-700" onClick={publish}>
          Publish Announcement
        </Button>
      </div>
    </div>
  );
}
