"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/auth-fetch";

interface FileUploadProps {
  value?: string; // URL of uploaded file
  onChange: (url: string) => void;
  accept?: string;
  placeholder?: string;
  multiple?: boolean;
  className?: string;
}

export default function FileUpload({
  value,
  onChange,
  accept = "image/*",
  placeholder = "Choose file or drag and drop",
  multiple = false,
  className = "",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Check 4:3 ratio and alert if not
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = img.width / img.height;
      // if (Math.abs(ratio - 4 / 3) > 0.05) {
      //   alert("Note: Image is not 4:3 ratio. It may not display optimally.");
      // }
    };

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await authFetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.url) throw new Error("Upload failed");
      onChange(data.url);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const displayUrl = value || preview;

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
          ${uploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={uploading}
        />

        {displayUrl ? (
          <div className="space-y-2">
            <img
              src={displayUrl}
              alt="Preview"
              className="max-w-full max-h-32 mx-auto rounded"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-600">File selected</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600">{placeholder}</p>
            <p className="text-xs text-gray-500 mt-1">
              {accept === "image/*"
                ? "PNG, JPG, GIF up to 10MB"
                : "Select a file"}
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
            <div className="text-sm text-gray-600">Uploading...</div>
          </div>
        )}
      </div>
    </div>
  );
}
