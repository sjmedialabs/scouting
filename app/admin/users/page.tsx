"use client";

import { useEffect, useState } from "react";
import { UserManagement } from "@/components/admin/user-management";
import { AdminUser } from "@/lib/types";
import { authFetch } from "@/lib/auth-fetch";
import { User } from "@/lib/types";
import { toast } from "@/lib/toast";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await authFetch("/api/users?limit=100&page=1");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUserStatus =async (userId: string,status: boolean) => {
    console.log("Recieved USer ID::::::",userId,status)
    try{
       const res=await authFetch(`/api/users/${userId}`,{
        method:"PUT",
        body:JSON.stringify({isActive:status})
       })
       if(!res.ok){
          throw new Error 
       }
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive:status } : u)),
      );
      toast.success(`user is ${!status?"Activated":"InActivated"} successfully`)
       
    }catch(error){
       console.log("Faailed to update the status::::::",error)
       toast.error(`failed to ${!status?"Active":"InActive"} the user`)
    }
   
    console.log(`Updated user ${userId} status to ${status}`);
  };
  const handleSendMessage = (userId: string, message: string) => {
    console.log(`Sending message to user ${userId}:`, message);
    
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <UserManagement
      users={(users || []).filter((item)=>item.role!=="admin")}
      onUpdateUserStatus={handleUpdateUserStatus}
      onSendMessage={handleSendMessage}
    />
  );
}
