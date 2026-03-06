"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, X } from "lucide-react"
import type { Notification } from "@/lib/types"
import { useRouter } from "next/navigation"

interface NotificationsWidgetProps {
  notifications: Notification[]
  onMarkAsRead: (notificationId: string,redirectingUr:String) => void
  onDismiss: (notificationId: string) => void
}

export function NotificationsWidget({ notifications, onMarkAsRead, onDismiss }: NotificationsWidgetProps) {
  const router=useRouter();
  const [showAll, setShowAll] = useState(false)

  const unreadNotifications = notifications.filter((n) => !n.read)
  const displayNotifications = showAll ? notifications : notifications.slice(0, 5)

  const getNotificationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "shortlisted":
        return "bg-green-100 text-green-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "revision_requested":
        return "bg-yellow-100 text-yellow-800"
      case "new_requirement":
        return "bg-[#D1D6FF] text-[#5B1F6C]"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="bg-white rounded-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 h-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadNotifications.length > 0 && (
              <Badge variant="destructive" className="text-xs rounded-full">
                {unreadNotifications.length}
              </Badge>
            )}
          </div>
          {notifications.length > 5 && (
            <Button variant="ghost" size="sm" className="cursor-pointer hover:bg-gray-200 hover:text-black hover:rounded-full " onClick={() => router.push("/agency/dashboard/account/notifications")}>
              {showAll ? "Show Less" : "Show All"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {displayNotifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No notifications</p>
        ) : (
          <div className="space-y-1">
            {displayNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-3 rounded-2xl bg-white border ${notification.read ? "bg-background" : "bg-muted/50"}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getNotificationColor(notification.type)} variant="secondary">
                        {notification.type.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(notification._id,notification.linkUrl)}>
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    {/* <Button variant="ghost" size="sm" onClick={() => onDismiss(notification._id)}>
                      <X className="h-3 w-3" />
                    </Button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
