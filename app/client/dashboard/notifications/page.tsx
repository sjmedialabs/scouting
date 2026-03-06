"use client";

import { useState,useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { authFetch } from "@/lib/auth-fetch";
import { useRouter } from "next/navigation";

const ClientNotificationsPage = () => {
  
  const router=useRouter();
 const [resLoading, setResLoading] = useState(false);
const [failed, setFailed] = useState(false);
const [dynamicNotifications, setDynamicNotifications] = useState<any[]>([]);

 const fetchNotifications = async () => {
    try {
      setResLoading(true);
      setFailed(false);

      const res = await authFetch("/api/notifications");

      if (!res.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await res.json();

      // assuming API response shape: { data: [...] }
      setDynamicNotifications((data?.data || []).filter((eachItem)=>!eachItem.isRead));
    } catch (error) {
      console.error("Notification fetch error:", error);
      setFailed(true);
    } finally {
      setResLoading(false);
    }
  };

useEffect(() => {
 

  fetchNotifications();
}, []);


  const handleMarkNotificationAsRead = async (
  id: string,
  linkUrl?: string
) => {
  try {
    // optimistic UI update (instant feedback)
    setDynamicNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );

    const res = await authFetch(`/api/notifications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isRead: true }),
    });

    if (!res.ok) {
      throw new Error("Failed to mark notification as read");
    }

    // optional redirect
    if (linkUrl) {
      // window.location.href = linkUrl;
      router.push(linkUrl)
    }
  } catch (error) {
    console.error("Mark as read failed:", error);

    // rollback if API fails
    setDynamicNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, isRead: false } : n
      )
    );
  }
};


   if (resLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-orangeButton my-custom-class">
          System Notifications
        </h1>
        <p className="text-gray-500 text-base">
          Platform management and oversight
        </p>
      </div>

      {/* NOTIFICATIONS LIST */}
      {!resLoading && !failed && dynamicNotifications.length > 0 && (
        <Card className="rounded-2xl bg-[#f7f7f7] border">
          <CardContent className="p-6 space-y-4">
            {dynamicNotifications.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl px-5 py-4 shadow-sm"
              >
                {/* LEFT */}
                <div className="flex items-start gap-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt="avatar"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <Bell className="h-4 w-4 text-gray-400" />
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <Button
                  variant="secondary"
                  className="rounded-xl bg-gray-100 text-black"
                  onClick={() =>
                    handleMarkNotificationAsRead(item._id, item.linkUrl)
                  }
                >
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* EMPTY STATE */}
      {!resLoading && !failed && dynamicNotifications.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            No Notifications Yet
          </p>
        </div>
      )}

      {/* LOADING */}
      {resLoading && (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
    </div>
  );
};

export default ClientNotificationsPage;
