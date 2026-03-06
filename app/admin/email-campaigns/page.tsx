"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Send } from "lucide-react";

export default function EmailCampaignsPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const sendEmail = () => {
    alert(`Email Campaign Sent:\nSubject: ${subject}\n\n${body}`);
    setSubject("");
    setBody("");
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Email Campaigns</h1>
      <p className="text-gray-500">Send promotional or system emails to users.</p>

      <div className="bg-white p-6 rounded-2xl border shadow space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          New Campaign
        </h2>

        <Input
          placeholder="Email Subject..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          className="w-full border rounded-xl p-4"
          rows={5}
          placeholder="Write your email content..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>

        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700" onClick={sendEmail}>
          <Send className="w-4 h-4" /> Send Email
        </Button>
      </div>
    </div>
  );
}
