"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth-fetch";

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [dynamicNotifications, setDynamicNotifications] = useState<any[]>([]);
  const [resLoading, setResLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const loadData = async () => {
    setResLoading(true);
    setFailed(false);
    try {
      const response = await authFetch("/api/notifications");
      const data = await response.json();

      const notificationsData = (data.data || []).filter(
        (item: any) => item.isRead === false
      );

      setDynamicNotifications(notificationsData);
    } catch (err) {
      setFailed(true);
      console.error(err);
    } finally {
      setResLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkNotificationAsRead = async (
    notificationId: string,
    redirectionUrl: string
  ) => {
    try {
      const res = await authFetch(`/api/notifications/${notificationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setDynamicNotifications((prev) =>
          prev.filter((item) => item._id !== notificationId)
        );
      }
    } catch (error) {
      console.error(error);
    }

    router.push(redirectionUrl);
  };

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
                    <p className="text-sm font-medium text-gray-900 leading-snug">
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
                  className="rounded-xl text-sm font-medium bg-gray-100 text-black"
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
          <p className="text-gray-500 text-lg">No Notifications Yet</p>
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
}
