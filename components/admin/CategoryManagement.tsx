
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CategoryManagement({ categories, onAdd, onRemove }: any) {
  const [newCategory, setNewCategory] = useState("");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Category Management</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Add category"
          className="border px-4 py-2 rounded-xl w-full"
        />
        <Button onClick={() => { onAdd(newCategory); setNewCategory(""); }}>
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((cat: string) => (
          <Badge key={cat} className="flex gap-2 items-center bg-gray-100 text-gray-700">
            {cat}
            <button className="text-red-600" onClick={() => onRemove(cat)}>
              ×
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
