"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Reply } from "lucide-react";

const mockTickets = [
  { id: "t1", user: "Amit", message: "Need help with subscription", status: "open" },
  { id: "t2", user: "Neha", message: "Payment failed", status: "resolved" },
];

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState(mockTickets);

  const resolve = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "resolved" } : t))
    );
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Support Tickets</h1>
      <p className="text-gray-500">Respond to user support requests.</p>

      <div className="space-y-4">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="bg-white p-6 rounded-2xl border shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{t.user}</h3>
              <p>{t.message}</p>
              <Badge
                className={
                  t.status === "open"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }
              >
                {t.status}
              </Badge>
            </div>

            {t.status === "open" && (
              <Button
                className="flex items-center gap-2"
                onClick={() => resolve(t.id)}
              >
                <Reply className="w-4 h-4" /> Resolve
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
