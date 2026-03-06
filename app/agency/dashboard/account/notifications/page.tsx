"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth-fetch";

/* ----------------------------------
   BACKEND / CMS READY DATA
---------------------------------- */

const notifications = [
  {
    id: 1,
    type: "user",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
    message:
      "Woohoo! Kian Jhonson hired you for Social Media Marketing Campaign project",
    time: "1 year ago",
    action: "View proposals",
  },
  {
    id: 2,
    type: "system",
    message:
      'Congratulations! You have successfully purchased the "Economy Plan" package. You can now post a service and get orders',
    time: "1 year ago",
    action: "Post a task",
  },
  {
    id: 3,
    type: "system",
    message:
      '"" has cancelled the order of Logo design and unique brand Identity and has left some comments for you.',
    time: "2 years ago",
    action: "View activity",
  },
  {
    id: 4,
    type: "user",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
    message:
      'You have received a note from "Kian Jhonson" on the task "Logo design and unique brand Identity"',
    time: "2 years ago",
    action: "View order details",
  },
  {
    id: 5,
    type: "user",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
    message:
      'You have received a note from "Kian Jhonson" on the task "Logo design and unique brand Identity"',
    time: "2 years ago",
    action: "View order details",
  },
];

/* ----------------------------------
   PAGE
---------------------------------- */

export default function NotificationsPage() {
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
        (item: any) => item.isRead === false,
      );
      console.log("Fetched notifications data:", notificationsData);
      setDynamicNotifications(notificationsData);
    } catch (err) {
      setFailed(true);
      console.log("Error loading notifications data:", err);
    } finally {
      setResLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleMarkNotificationAsRead = async (
    notificationId: string,
    redirectionUrl: string,
  ) => {
    try {
      const res = await authFetch(`/api/notifications/${notificationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response of the mark as read::", res);
      if (res.ok) {
        setDynamicNotifications((prev) =>
          prev.filter((eachItem) => eachItem._id !== notificationId),
        );
      }
    } catch (error) {
      console.log("Failed to update the status of the notification::", error);
    }
    router.push(redirectionUrl);
  };
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-orangeButton my-custom-class">
          Notifications
        </h1>
        <p className="text-lg text-gray-500">
          Configure your notification settings
        </p>
      </div>

      {/* Notifications Card */}
      {!resLoading && !failed && dynamicNotifications.length !== 0 ? (
        <Card className="rounded-xl bg-[#f7f7f7]">
          <CardHeader>
            <CardTitle className="text-xl my-custom-class font-semibold">
              Notifications
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {dynamicNotifications.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-4 bg-white rounded-xl px-4 py-4"
              >
                {/* Left */}
                <div className="flex items-start gap-3">
                  {/* {item.type === "user" ? (
                  <img
                    src={item.image}
                    alt="avatar"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full border flex items-center justify-center">
                    <Bell className="h-4 w-4 text-gray-400" />
                  </div>

                )} */}
                  <img
                    src={item.image}
                    alt="avatar"
                    className="h-8 w-8 rounded-full object-cover"
                  />

                  <div>
                    <p className="text-sm font-medium leading-snug">
                      {item.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <Button
                  variant="secondary"
                  className="rounded-xl text-sm text-black font-medium bg-[#f7f7f7]"
                  onClick={() =>
                    handleMarkNotificationAsRead(item._id, item.linkUrl)
                  }
                >
                  {"view"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <div className="text-center">
          {!resLoading && !failed && dynamicNotifications.length === 0 && (
            <p className="text-gray-500 text-xl">No Notifications Yet</p>
          )}
        </div>
      )}
      {resLoading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
