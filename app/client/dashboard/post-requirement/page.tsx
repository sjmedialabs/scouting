"use client";
import {
  mockRequirements,
  mockProposals,
  mockProviders,
} from "@/lib/mock-data";
import type {
  Requirement,
  Proposal,
  Provider,
  Notification,
} from "@/lib/types";
import { PostRequirementForm } from "@/components/seeker/post-requirement-form";
import { authFetch } from "@/lib/auth-fetch"
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/lib/toast";
import { error } from "console";

const PostRequirementPage = () => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [requirements, setRequirements] =
    useState<Requirement[]>(mockRequirements);
  const [sending, setSending] = useState(false);
  const handlePostRequirement = async (newRequirement: any) => {
    setSending(true);
    try {
      console.log("Recieved Requirememt to the backend:::", newRequirement);
      // Prepare payload for API
      const payload = {
        title: newRequirement.title,
        image: newRequirement.image,
        category: newRequirement.category,
        budgetMin: newRequirement.budgetMin,
        budgetMax: newRequirement.budgetMax,
        timeline: newRequirement.timeline,
        description: newRequirement.description,
        documentUrl: newRequirement.documentUrl,
      };

      // API CALL
      const res = await authFetch("/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Requirement created on main parent:", data);
      if (!res.ok) {
        toast.error("Failed to post the requirement");
      }
      toast.success("Requirement Posted successfully");
    } catch (error) {
      console.error("Error posting requirement:", error);
      toast.error("Failed to post the requirement");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[#fff]">
      <div className="container max-w-7xl py-8 px-4">
        <PostRequirementForm
          onSubmit={handlePostRequirement}
          sendingStatus={sending}
        />
      </div>
    </div>
  );
};
export default PostRequirementPage;
