"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, X } from "lucide-react"

interface Message {
  id: string
  sender: "client" | "agency"
  content: string
  timestamp: Date
}

interface NegotiationChatProps {
  isOpen: boolean
  onClose: () => void
  proposalId: string
  providerName: string
}

export function NegotiationChat({ isOpen, onClose, proposalId, providerName }: NegotiationChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "agency",
      content: "Thank you for accepting my proposal! I'm excited to work on this project with you.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "2",
      sender: "client",
      content: "Great! I'd like to discuss the timeline in more detail. Can we adjust the delivery date?",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: "client", // In real app, this would be determined by current user role
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[500px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex justify-between items-center">
            <DialogTitle>Negotiation Chat</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Discussing proposal with {providerName}</p>
        </DialogHeader>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === "client" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "agency" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{providerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === "client" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {message.sender === "client" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 flex gap-2 p-4 border-t">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
