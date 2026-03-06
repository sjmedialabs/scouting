"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, UserCheck, UserX, Eye, Mail, Calendar, TriangleAlert, Users } from "lucide-react"
import type { AdminUser } from "@/lib/types"
import { User } from "@/lib/types"
import { authFetch } from "@/lib/auth-fetch"
import { toast } from "@/lib/toast";

interface UserManagementProps {
  users: User[]
  onUpdateUserStatus: (userId: string, status: boolean) => void
  onSendMessage: (userId: string, message: string) => void
}

export function UserManagement({ users, onUpdateUserStatus, onSendMessage }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [messageDialog, setMessageDialog] = useState<{ open: boolean; userId: string }>({ open: false, userId: "" })
  const [message, setMessage] = useState("")

  const[sendingStatus,setSendingStatus]=useState(false);
  const[sendMssgFailed,setSendMssgFailed]=useState({
    status:"success",
    msg:""
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.isActive === (statusFilter==="active"?true:false)

    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status:boolean) => {
    switch (status) {
      case true:
        return "bg-green-100 text-green-800"
      case false:
        return "bg-red-100 text-red-800"
      
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "client":
        return "bg-blue-100 text-blue-800"
      case "agency":
        return "bg-purple-100 text-purple-800"
      case "admin":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSendMessage = async() => {
    // onSendMessage(messageDialog.userId, message)
    console.log("Message to send:::",messageDialog.userId, message)
    const userToSendMail=users.find((eachItem)=>eachItem._id===messageDialog.userId)
    setSendingStatus(true);
    try{
      const res=await authFetch("/api/send-mail",{
        method:"POST",
        body:JSON.stringify({email:userToSendMail?.email,message})
      })
      if(!res.ok){
        throw new Error()
      }

     setMessageDialog({ open: false, userId: "" })
     setMessage("")
     toast.success("Successfully delivered the msg to subscriber through email")


    }catch(error){
        console.log("Failed to sen dthe email:::",error)
        setSendMssgFailed({
          status:"failed",
          msg:"Failed to send the msg please try after some time"
        })
    }finally{
       setSendingStatus(false)
    }
   
  }

  return (
    <div className="space-y-6">
      <section>
        <div className="py-4 mb-6 flex items-center justify-between">
          <div>
          <h1 className="text-4xl font-bold text-orangeButton">User Management</h1>
          <p className="text-gray-500 text-xl">Manage platform users and their access</p>
          </div>
                  <div className="flex flex-row justify-center items-center gap-4">
          <Button className="bg-orangeButton rounded-full text-white mt-4 hover:bg-orange-600 flex items-center gap-2">
           <TriangleAlert className="h-4 w-4" /> Reports 
          </Button>
          <Button className="bg-[#278DEC] rounded-full text-white mt-4 hover:bg-blue-800 flex items-center gap-2">
            <Users className="h-4 w-4" /> Pending
          </Button>
        </div>
        </div>
        <div>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative rounded-2xl border border-gray-200 h-12">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-full border-none rounded-2xl"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="rounded-2xl border border-gray-200 h-12 min-h-12 py-0 flex items-center">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
                <SelectItem value="agency">Agencies</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="rounded-2xl border border-gray-200 h-12 min-h-12 py-0 flex items-center">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">InActive</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setRoleFilter("all")
                setStatusFilter("all")
              }}
              className="rounded-full h-12 bg-[#F4F4F4]"
            >
              Clear Filters
            </Button>
          </div>

          {/* Users Table */}
          <div className="border p-4 rounded-2xl">
            <Table>
              <TableHeader className="font-bold">
                <TableRow className="font-extrabold">
                  <TableHead className="font-extrabold">User</TableHead>
                  <TableHead className="font-extrabold">Role</TableHead>
                  <TableHead className="font-extrabold">Status</TableHead>
                  <TableHead className="font-extrabold">Subscription</TableHead>
                  <TableHead className="font-extrabold">Joined</TableHead>
                  <TableHead className="font-extrabold">Last Login</TableHead>
                  <TableHead className="font-extrabold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-neutral-600">{user.email}</div>
                        {user.companyName && <div className="text-xs text-muted-foreground">{user.companyName}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)} variant="secondary">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.isActive)} variant="secondary">
                        {user.isActive?"Active":"InActive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user?.subscriptionPlanId?.title ? (
                        <Badge variant="outline">{user.subscriptionPlanId.title}</Badge>
                      ) : (
                        <span className="text-muted-foreground">Free Trail</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? (
                        <div className="flex flex-row gap-1 items-center text-sm">
                        <Calendar className="h-3 w-3" />
                        <div className="text-sm">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "-"}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {/* <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                          <Eye className="h-4 w-4" />
                        </Button> */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMessageDialog({ open: true, userId: user._id })}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        {user.isActive ? (
                          <Button variant="ghost" size="sm" onClick={() => onUpdateUserStatus(user._id, false)}>
                            <UserX className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => onUpdateUserStatus(user._id, true)}>
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl rounded-4xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-orangeButton">User Details</DialogTitle>
            <DialogDescription>Detailed information about {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2">
                <div className="flex flex-row gap-2 border-r border-gray-200 items-center pb-8">
                  <label className="text-sm font-medium">Name :</label>
                  <p className="text-xs">{selectedUser.name}</p>
                </div>
                <div className="flex flex-row gap-2 items-center pb-8 pl-4">
                  <label className="text-sm font-medium">Email :</label>
                  <p className="text-xs">{selectedUser.email}</p>
                </div>
                <div className="flex flex-row gap-2 border-r border-gray-200 items-center pb-8">
                  <label className="text-sm font-medium">Role :</label>
                  <Badge className={getRoleColor(selectedUser.role)} variant="secondary">
                    {selectedUser.role}
                  </Badge>
                </div>
                <div className="flex flex-row gap-2 items-center pb-8 pl-4">
                  <label className="text-sm font-medium">Status :</label>
                  <Badge className={getStatusColor(selectedUser.isActive)} variant="secondary">
                    {selectedUser.isActive?"Active":"InActive"}
                  </Badge>
                </div>
                {selectedUser.companyName && (
                  <div>
                    <label className="text-sm font-medium">Company</label>
                    <p className="text-sm">{selectedUser.companyName}</p>
                  </div>
                )}
                {selectedUser.subscriptionTier && (
                  <div>
                    <label className="text-sm font-medium">Subscription</label>
                    <Badge variant="outline">{selectedUser.subscriptionTier}</Badge>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialog.open} onOpenChange={(open) => setMessageDialog({ open, userId: "" })}>
        <DialogContent className="max-w-2xl rounded-4xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-orangeButton">Send Message</DialogTitle>
            <DialogDescription>Send a message to the user</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              style={{backgroundColor: "#ECECEC", borderRadius: "10px"}}
              rows={6}
            />
            {
              sendMssgFailed.status!=="success"&&(
                <p className="text-sm text-red-500">{sendMssgFailed.msg}</p>
              )
            }
            <div className="flex gap-2">
              <Button onClick={handleSendMessage} className={`rounded-full ${sendingStatus?"bg-[#ee4242] cursor-not-allowed":"bg-[#FF0000] cursor-pointer`"} text-white`} disabled={sendingStatus}>{sendingStatus?"Sending...":"Send Message"}</Button>
              <Button className="rounded-full" onClick={() => setMessageDialog({ open: false, userId: "" })}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
