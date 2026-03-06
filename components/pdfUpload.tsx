"use client";

import { useState } from "react";

interface PdfUploadProps {
  maxSizeMB?: number;
  onUploadSuccess: (fileUrl: string) => void;
}

export default function PdfUpload({
  maxSizeMB = 5,
  onUploadSuccess,
}: PdfUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setFileUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setFileUrl(data.url);

      // ✅ send URL to parent
      onUploadSuccess(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (!selectedFile) return;

    // Validate PDF
    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    // Validate size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size should not exceed ${maxSizeMB} MB`);
      return;
    }

    setFileName(selectedFile.name);

    // 🚀 AUTO UPLOAD
    uploadFile(selectedFile);
  };

  // ✅ NEW REMOVE FUNCTION
  const handleRemove = () => {
    setFileName(null);
    setFileUrl(null);
    setError(null);

    // inform parent that file is removed
    onUploadSuccess("");
  };

  return (
    <div className="border border-[#D0D5DD] rounded-lg p-6 text-center space-y-4">
      <p className="text-sm text-gray-500">
        Upload Project Brief, wireframes, or reference materials (PDF)
      </p>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
        id="pdf-upload"
      />

      <label
        htmlFor="pdf-upload"
        className="inline-block px-4 py-2 bg-[#D1E9FC] text-[#000] text-[12px] rounded-xl border-[#D0D5DD] font-semibold cursor-pointer"
      >
        Choose File
      </label>

      {fileName && (
        <div className="space-y-2">
          <p className="text-sm text-gray-700">{fileName}</p>

          {/* ✅ Remove Button */}
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm text-red-600 underline cursor-pointer"
          >
            Remove File
          </button>
        </div>
      )}

      {loading && (
        <p className="text-sm text-blue-600 animate-pulse">Uploading...</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {fileUrl && !loading && (
        <p className="text-sm text-green-600">
          Uploaded Successfully:{" "}
          <a href={fileUrl} target="_blank" className="underline">
            View File
          </a>
        </p>
      )}
    </div>
  );
}
