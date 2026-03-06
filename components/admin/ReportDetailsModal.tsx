"use client";

import { X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReportDetailsModalProps {
  open: boolean;
  onClose: () => void;
  report: {
    type: string;
    status: string;
    createdAt: string;
    id: string;
    reason: string;
    description: string;
  };
}

export default function ReportDetailsModal({
  open,
  onClose,
  report,
}: ReportDetailsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white  max-w-xl max-h-[90vh] overflow-y-scroll rounded-2xl shadow-xl relative p-4">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-xl font-semibold my-custom-class text-orangeButton">
              Report Details
            </h2>
            <p className="text-sm text-gray-500 my-custom-class">
              Review the reported content and take appropriate action
            </p>
          </div>

          <Badge className="bg-green-100 rounded-full text-green-700 px-3 py-1 mr-10">
            Open
          </Badge>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-25 border rounded-xl p-3">
            <span className="text-sm font-medium my-custom-class">Content Type</span>
            <Badge className="bg-blue-100 text-blue-700 rounded-full">
              {report.type}
            </Badge>
          </div>

          <div className="flex items-center gap-33 border rounded-xl p-3">
            <span className="text-sm font-medium my-custom-class">Status:</span>
            <Badge className="bg-yellow-100 text-yellow-700 rounded-full">
              {report.status}
            </Badge>
          </div>

          <div className="border rounded-xl p-3 text-sm">
            <span className="font-medium my-custom-class">Reported Date:</span>{" "}
            {new Date(report.createdAt).toLocaleDateString("en-IN")}
          </div>

          <div className="border rounded-xl p-3 text-sm">
            <span className="font-medium my-custom-class">Content ID:</span> {report.id}
          </div>
        </div>

        {/* Reason */}
        <div className="mt-4 border-t pt-3">
          <h4 className="font-semibold text-orangeButton my-custom-class">Reason</h4>
          <p className="text-gray-500 text-sm mt-1 my-custom-class">
            {report.reason}
          </p>
        </div>

        {/* Description */}
        <div className="mt-4 border-t pt-4">
          <h4 className="font-semibold text-orangeButton my-custom-class">Description</h4>
          <p className="text-gray-500 text-sm mt-1 my-custom-class">
            {report.description}
          </p>
        </div>

        {/* Notes */}
        <div className="mt-4 border-t pt-4">
          <h4 className="font-semibold text-orangeButton my-custom-class">
            Resolution Notes (Optional)
          </h4>
          <p className="text-gray-500 text-sm mt-1 my-custom-class">
            {report.description}
          </p>
          <Textarea
            placeholder="Add note about your decision....."
            className="mt-2 border-gray-200 rounded-xl placeholder:text-gray-500 placeholder:text-xs"
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button className="flex-1 bg-blueButton hover:bg-indigo-700 text-white rounded-full flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            Approve & Take actions
          </Button>

          <Button
            variant="outline"
            className="flex-1 rounded-full bg-black border-white text-white hover:bg-black hover:text-white flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Dismiss Report
          </Button>
        </div>
      </div>
    </div>
  );
}
