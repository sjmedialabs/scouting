"use cclient"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const REPORT_REASONS = [
  "Spam",
  "Harassment",
  "Fake Profile",
  "Inappropriate Content",
  "Scam",
  "Other",
];

export default function ReportContentModal({
  open,
  onClose,
  reportedTo,
}: {
  open: boolean;
  onClose: () => void;
  reportedTo: string;
}) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const maxChars = 200;

  const handleSubmit = async () => {
    if (!reason || !description.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/reported-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason,
          description,
          reportedTo,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit report");
      }

      onClose();
      setReason("");
      setDescription("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#F54A0C]">Report Content</DialogTitle>
        </DialogHeader>

        {/* Reason dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Reason</label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="border-[#D0D5DD] border-1">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {REPORT_REASONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={description}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) {
                setDescription(e.target.value);
              }
            }}
            className="border-[#D0D5DD] border-1 placeholder:text-gray-300"
            placeholder="Describe the issue (max 200 characters)"
          />
          <p className="text-xs text-muted-foreground text-right">
            {description.length}/{maxChars}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!reason || !description || loading}
          >
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
