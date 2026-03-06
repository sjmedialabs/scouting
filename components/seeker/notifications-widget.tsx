"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, X, MessageSquare, FileText, Star } from "lucide-react"
import type { Notification } from "@/lib/types"
import { RxCross2 } from "react-icons/rx";

import { timeAgo } from "../times-ago"

interface NotificationsWidgetProps {
  notifications: Notification[]
  onMarkAsRead: (notificationId: string) => void
  onDismiss: (notificationId: string) => void
}

export function NotificationsWidget({ notifications, onMarkAsRead, onDismiss }: NotificationsWidgetProps) {
  const [showAll, setShowAll] = useState(false)

  const unreadNotifications = notifications.filter((n) => !n.read)
  const[showNotification,setShowNotification]=useState(true)
  const displayNotifications = showAll ? notifications : notifications.slice(0, 5)

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "proposal_received":
        return "bg-blue-100 text-blue-800"
      case "proposal_accepted":
        return "bg-green-100 text-green-800"
      case "proposal_rejected":
        return "bg-red-100 text-red-800"
      case "project_completed":
        return "bg-purple-100 text-purple-800"
      case "message_received":
        return "bg-orange-100 text-orange-800"
      case "review_requested":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "proposal_received":
        return <FileText className="h-4 w-4" />
      case "message_received":
        return <MessageSquare className="h-4 w-4" />
      case "review_requested":
        return <Star className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <Card className={`bg-[#fff] rounded-2xl ${showNotification?"block":"hidden"}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* <Bell className="h-5 w-5" /> */}
            <CardTitle className="text-xl my-custom-class text-[#000] font-bold">Notifications</CardTitle>
            {/* {unreadNotifications.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadNotifications.length}
              </Badge>
            )} */}
          </div>
          <div className="flex justify-center items-center bg-[#F4F9FD] h-10 w-10 rounded-xl cursor-pointer">
            <RxCross2 className="h-5 w-5 text-[#000]" onClick={() =>setShowNotification((prev)=>!prev)} />
          </div>
          {notifications.length > 5 && (
            <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)}>
              {showAll ? "Show Less" : "Show All"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {displayNotifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No notifications</p>
        ) : (
          <div className="space-y-3">
            {displayNotifications.map((notification) => (
              <div
                key={notification._id}
                // className={`p-3 rounded-lg border ${notification.read ? "bg-background" : "bg-muted/50"}`}
                className="border-t border-[#E3E3E3] px-4 py-4 cursor-pointer" onClick={()=>onMarkAsRead(notification._id)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex gap-3 flex-1">
                    {/* <div className="mt-1">{getNotificationIcon(notification.type)}</div> */}
                    <img src={notification.image || "/notificationprofile.png"} className="h-10 w-10 rounded-full object-cover items-center" alt="profile"/>
                    <div className="flex-1">
                      {/* <div className="flex items-center gap-2 mb-1">
                        <Badge className={getNotificationColor(notification.type)} variant="secondary">
                          {notification.type.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {notification.createdAt.toLocaleDateString()}
                        </span>
                      </div> */}
                      <h4 className="font-bold text-[#000] text-sm my-custom-class">{notification.title}</h4>
                      <p className="text-xs text-[#656565] my-custom-class mt-1">{notification.message}</p>
                      <p className="text-xs text-[#6B6B6B] my-custom-class font-bold mt-1">{timeAgo(notification.createdAt)}</p>
                    </div>
                  </div>
                  {/* <div className="flex gap-1">
                    {!notification.read && (
                      <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(notification.id)}>
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => onDismiss(notification.id)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
