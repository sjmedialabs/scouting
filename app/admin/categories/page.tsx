"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash, Pencil,  } from "lucide-react";
import FileUpload from "@/components/file-upload";
import { FaRegEdit } from "react-icons/fa";
import { authFetch } from "@/lib/auth-fetch";

interface ServiceItem {
  title: string;
  slug: string;
}

interface SubCategory {
  title: string;
  slug: string;
  items: ServiceItem[];
}

interface MainCategory {
  _id?: string;
  title: string;
  slug: string;
  icon?: string | null;
  isMainCategory: boolean;
  children: SubCategory[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [newCategory, setNewCategory] = useState("");
const [editingId, setEditingId] = useState<string | null>(null);
const [editTitle, setEditTitle] = useState("");
const [editIcon, setEditIcon] = useState<string | null>(null);
// For editing subcategory
const [editingSub, setEditingSub] = useState<{ catId: string; index: number } | null>(null);
const [editSubTitle, setEditSubTitle] = useState("");

// For editing service items
const [editingItem, setEditingItem] = useState<{ catId: string; subIndex: number; itemIndex: number } | null>(null);
const [editItemTitle, setEditItemTitle] = useState("");

const [deleteTarget, setDeleteTarget] = useState<{
  catId: string
  subIndex: number
} | null>(null)

const [undoData, setUndoData] = useState<{
  catId: string
  sub: SubCategory
  index: number
} | null>(null)

const [collapsedSubs, setCollapsedSubs] = useState<string[]>([])


  // Fetch all categories from API
  const fetchCategories = async () => {
    try {
      const res = await authFetch("/api/service-categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create slug utility
  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/\s+/g, "-");

  // Add Main Category
  const addMainCategory = async () => {
    if (!newCategory.trim()) return;

    const newCat: MainCategory = {
      title: newCategory.trim(),
      slug: slugify(newCategory),
      isMainCategory: true,
      children: [],
    };

    const res = await authFetch("/api/service-categories", {
      method: "POST",
      body: JSON.stringify(newCat),
    });

    const result = await res.json();
    if (result.success) {
      setCategories((prev) => [...prev, result.data]);
      setNewCategory("");
    }
  };

  // Add Subcategory
  const addSubcategory = async (catId: string, title: string) => {
    const updatedCats = categories.map((cat) =>
      cat._id === catId
        ? {
            ...cat,
            children: [
              ...cat.children,
              { title, slug: slugify(title), items: [] },
            ],
          }
        : cat
    );

    setCategories(updatedCats);
    await updateCategory(catId, updatedCats.find((c) => c._id === catId)!);
  };

  // Add service item to subcategory
  const addServiceItem = async (catId: string, subIndex: number, title: string) => {
    const updatedCats = [...categories];
    updatedCats.forEach((cat) => {
      if (cat._id === catId) {
        cat.children[subIndex].items.push({
          title,
          slug: slugify(title),
        });
      }
    });

    setCategories(updatedCats);
    const updated = updatedCats.find((c) => c._id === catId)!;
    await updateCategory(catId, updated);
  };

  // Remove anything (main category, subcategory or service item)
  const removeCategory = async (catId: string) => {
  try {
    const res = await authFetch(`/api/service-categories/${catId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert("Failed to delete category");
      return;
    }

    setCategories((prev) => prev.filter((c) => c._id !== catId));
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};


const updateCategory = async (catId: string, data: Partial<MainCategory>) => {
  try {
    const res = await fetch(`/api/service-categories/${catId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      console.error("Update failed:", result.message || "Unknown error");
      return false;
    }

    return result.data; // Return updated category
  } catch (error) {
    console.error("Update error:", error);
    return false;
  }
};


  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-orangeButton my-custom-class h-1">Service Category Management</h1>
      <p className="text-gray-500 my-custom-class h-1">Manage categories → subcategories → service items.</p>

      {/* ADD MAIN CATEGORY */}
      <div className="bg-white p-4 rounded-2xl border shadow-md space-y-6">
        <div className="flex gap-3">
          <Input
          className="rounded-2xl border-gray-200 placeholder:text-gray-500"
            placeholder="Enter new category..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button className="flex items-center gap-2 rounded-full bg-orangeButton" onClick={addMainCategory}>
            <PlusCircle className="w-4 h-4" /> Add Category
          </Button>
        </div>
      </div>

      {/* DISPLAY CATEGORIES */}
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white p-6 border rounded-2xl shadow-md">
{/* MAIN CATEGORY HEADER */}
<div className="flex justify-between items-center">

  {/* ICON + UPLOAD */}
  <div className="flex flex-col items-center w-12">
    <img
      src={editingId === cat._id ? editIcon || "/images/placeholder.png" : cat.icon || "/images/placeholder.png"}
      className="w-10 h-10 object-cover rounded-full border mb-2"
    />

    {editingId === cat._id && (
      <FileUpload
        onChange={(url) => {
          setEditIcon(url); // store locally, don't update DB yet
        }}
      />
    )}
  </div>

  {/* TITLE OR INPUT */}
  <div className="flex-1 ml-4">
    {editingId === cat._id ? (
      <Input
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        className="text-lg font-semibold"
      />
    ) : (
      <h2 className="text-xl font-semibold text-orangeButton my-custom-class">{cat.title}</h2>
    )}
  </div>

  {/* ACTION BUTTONS */}
  <div className="flex items-center gap-3">

    {editingId === cat._id ? (
      <>
        {/* SAVE */}
        <Button
        className="rounded-full bg-orangeButton"
          size="sm"
          onClick={async () => {
            const updated = {
              ...cat,
              title: editTitle,
              slug: slugify(editTitle),
              icon: editIcon || cat.icon || null, // update icon at save time
            };

            await updateCategory(cat._id!, updated);

            setEditingId(null);
            setEditIcon(null);
            fetchCategories(); // refresh UI
          }}
        >
          Save
        </Button>

        {/* CANCEL */}
        <Button
        className="rounded-full bg-black text-white"
          size="sm"
          variant="outline"
          onClick={() => {
            setEditingId(null);
            setEditIcon(null);
          }}
        >
          Cancel
        </Button>
      </>
    ) : (
      <Pencil 
      className="w-5 h-5 cursor-pointer"
        onClick={() => {
          setEditingId(cat._id!);
          setEditTitle(cat.title);
          setEditIcon(cat.icon || null);
        }}
      
      />
    )}

    {/* DELETE */}
    <Trash
      className="w-5 h-5 cursor-pointer text-red-600"
      onClick={() => removeCategory(cat._id!)}
    />
  </div>
</div>
            {/* ADD SUBCATEGORY */}
            <AddInput
            
              placeholder="Add subcategory..."
              onAdd={(val) => addSubcategory(cat._id!, val)}
            />

{/* SUBCATEGORIES LIST */}
<div className="pl-6 mt-4 space-y-4">
  {cat.children.map((sub, subIndex) => (
     <div
        key={subIndex}
        className={`border p-4 rounded-2xl shadow-md bg-white transition-all duration-300 overflow-hidden ${
          collapsedSubs.includes(`${cat._id}-${subIndex}`)
            ? "max-h-12"
            : "max-h-[500px]"
        }`}
      >

      {/* SUBCATEGORY TITLE */}
      <div className="flex justify-between items-center">
        {editingSub?.catId === cat._id && editingSub?.index === subIndex ? (
          <Input
            value={editSubTitle}
            onChange={(e) => setEditSubTitle(e.target.value)}
            className="font-medium text-gray-700 w-64"
          />
        ) : (
          <h3 className="font-medium text-gray-700">{sub.title}</h3>
        )}
        {/* <button
          className="text-xs text-gray-400"
          onClick={() => {
            const key = `${cat._id}-${subIndex}`
            setCollapsedSubs(prev =>
              prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
            )
          }}
        >
          Toggle
        </button> */}


        
{/* SUBCATEGORY ACTION BUTTONS */}
<div className="flex items-center gap-2">
  {editingSub?.catId === cat._id && editingSub?.index === subIndex ? (
    <>
      <Button
        size="sm"
        onClick={async () => {
          const updated = { ...cat };
          updated.children[subIndex].title = editSubTitle;
          updated.children[subIndex].slug = slugify(editSubTitle);

          await updateCategory(cat._id!, updated);
          setEditingSub(null);
          fetchCategories();
        }}
      >
        Save
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={() => setEditingSub(null)}
      >
        Cancel
      </Button>
    </>
  ) : (
    <>
      <Pencil
        className="h-5 w-5"
        size="sm"
      
        onClick={() => {
          setEditingSub({ catId: cat._id!, index: subIndex });
          setEditSubTitle(sub.title);
        }}
      />

      {/* DELETE SUBCATEGORY */}
      <Trash
        className="w-5 h-5 text-red-600 cursor-pointer"
        onClick={() => {
          if (sub.items.length > 0) {
            alert("Cannot delete subcategory with service items.")
            return
          }

          setDeleteTarget({ catId: cat._id!, subIndex })
        }}
      />
    </>
  )}
</div>

      </div>

      {/* ADD SERVICE ITEM */}
      <AddInput
        placeholder="Add service item..."
        onAdd={(val) => addServiceItem(cat._id!, subIndex, val)}
      />

      {/* SERVICE ITEMS LIST */}
      <div className="flex flex-wrap gap-2 mt-3">
        {sub.items.map((item, itemIndex) => (
          <div key={itemIndex} className="flex items-center gap-2">

            {/* SERVICE ITEM TITLE / INPUT */}
            {editingItem?.catId === cat._id &&
             editingItem?.subIndex === subIndex &&
             editingItem?.itemIndex === itemIndex ? (
              <Input
                value={editItemTitle}
                onChange={(e) => setEditItemTitle(e.target.value)}
                className="h-8 w-48 border-gray-200 rounded-2xl"
              />
            ) : (
              <Badge className="bg-white text-black border px-3 py-2 rounded-xl shadow">
                {item.title}
              </Badge>    
            )}

            {/* SERVICE ITEM ACTION BUTTONS */}
            {editingItem?.catId === cat._id &&
            editingItem?.subIndex === subIndex &&
            editingItem?.itemIndex === itemIndex ? (
              <>
                <Button
                  size="sm"
                  className="rounded-full bg-orangeButton"
                  onClick={async () => {
                    const updated = { ...cat };
                    updated.children[subIndex].items[itemIndex].title =
                      editItemTitle;
                    updated.children[subIndex].items[itemIndex].slug =
                      slugify(editItemTitle);

                    await updateCategory(cat._id!, updated);
                    setEditingItem(null);
                    fetchCategories();
                  }}
                >
                  Save
                </Button>

                <Button
                className="bg-black text-white rounded-full hover:bg-gray-500"
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Pencil
              className="h-4 w-4 cursor-pointer"
               
                onClick={() => {
                  setEditingItem({
                    catId: cat._id!,
                    subIndex,
                    itemIndex,
                  });
                  setEditItemTitle(item.title);
                }}
              />
            )}

            {/* DELETE SERVICE ITEM */}
            <Trash
              className="w-4 h-4 text-red-600 cursor-pointer"
              onClick={async () => {
                const updated = { ...cat };
                updated.children[subIndex].items.splice(itemIndex, 1);

                await updateCategory(cat._id!, updated);
                fetchCategories();
              }}
            />
          </div>
        ))}
      </div>
    </div>
  ))}
</div>

          </div>
        ))}
      </div>
      {deleteTarget && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
      <h2 className="text-lg font-semibold mb-3">
        Delete subcategory?
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        This action can be undone for a few seconds.
      </p>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
          Cancel
        </Button>

        <Button
          className="bg-red-600 text-white"
          onClick={async () => {
            const { catId, subIndex } = deleteTarget

            const cat = categories.find(c => c._id === catId)!
            const removed = cat.children[subIndex]

            const updated = { ...cat }
            updated.children.splice(subIndex, 1)

            await updateCategory(catId, updated)
            fetchCategories()

            setUndoData({ catId, sub: removed, index: subIndex })
            setDeleteTarget(null)

            setTimeout(() => setUndoData(null), 5000)
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
)}

{undoData && (
  <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
    <span>Subcategory deleted</span>

    <Button
      size="sm"
      className="bg-orangeButton"
      onClick={async () => {
        const cat = categories.find(c => c._id === undoData.catId)!
        const updated = { ...cat }

        updated.children.splice(undoData.index, 0, undoData.sub)

        await updateCategory(undoData.catId, updated)
        fetchCategories()
        setUndoData(null)
      }}
    >
      Undo
    </Button>
  </div>
)}


    </div>
  );
}

// 🟦 Reusable Add Input Component
function AddInput({
  placeholder,
  onAdd,
}: {
  placeholder: string;
  onAdd: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="flex gap-3 mt-3 text-black">
      <Input
      className="border-gray-200 rounded-2xl placeholder:text-gray-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        className="flex items-center gap-2 rounded-full bg-orangeButton"
        onClick={() => {
          if (!value.trim()) return;
          onAdd(value);
          setValue("");
        }}
      >
        <PlusCircle className="w-4 h-4" /> Add
      </Button>
    </div>
  );
  
}


