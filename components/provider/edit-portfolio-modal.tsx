"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus } from "lucide-react"
import type { Provider, PortfolioItem } from "@/lib/types"

interface EditPortfolioModalProps {
  provider: Provider
  isOpen: boolean
  onClose: () => void
  onSave: (updatedProvider: Provider) => void
}

export function EditPortfolioModal({ provider, isOpen, onClose, onSave }: EditPortfolioModalProps) {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([...provider.portfolio])
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    imageUrl: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedProvider: Provider = {
      ...provider,
      portfolio: portfolio,
    }
    onSave(updatedProvider)
    onClose()
  }

  const addPortfolioItem = () => {
    if (newItem.title.trim() && newItem.description.trim()) {
      const portfolioItem: PortfolioItem = {
        id: Date.now().toString(),
        title: newItem.title,
        description: newItem.description,
        imageUrl: newItem.imageUrl || "/portfolio-project.png",
      }
      setPortfolio((prev) => [...prev, portfolioItem])
      setNewItem({ title: "", description: "", imageUrl: "" })
    }
  }

  const removePortfolioItem = (id: string) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id))
  }

  const updatePortfolioItem = (id: string, field: keyof PortfolioItem, value: string) => {
    setPortfolio((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Portfolio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Portfolio Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolio.map((item) => (
                  <Card key={item.id} className="relative">
                    <button
                      type="button"
                      onClick={() => removePortfolioItem(item.id)}
                      className="absolute top-2 right-2 z-10 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <CardContent className="pt-6 space-y-3">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Input
                        value={item.title}
                        onChange={(e) => updatePortfolioItem(item.id, "title", e.target.value)}
                        placeholder="Project title..."
                      />
                      <Textarea
                        value={item.description}
                        onChange={(e) => updatePortfolioItem(item.id, "description", e.target.value)}
                        placeholder="Project description..."
                        className="min-h-[60px]"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add New Portfolio Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newTitle">Project Title</Label>
                  <Input
                    id="newTitle"
                    value={newItem.title}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter project title..."
                  />
                </div>
                <div>
                  <Label htmlFor="newImageUrl">Image URL (optional)</Label>
                  <Input
                    id="newImageUrl"
                    value={newItem.imageUrl}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="newDescription">Project Description</Label>
                <Textarea
                  id="newDescription"
                  value={newItem.description}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the project, technologies used, and outcomes..."
                  className="min-h-[80px]"
                />
              </div>

              <Button type="button" onClick={addPortfolioItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Portfolio Item
              </Button>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Save Portfolio
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
