"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import ClientSidebar from "@/components/seeker/side-bar";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const loadUserDetails=async()=>{
  //   try{
  //      const res=await authFetch(`/api/users/${user?.id}`)
  //      const data=await res.json();

  //   }catch(error){
  //     console.log(error)
  //   }
  // }

  const { user, loading } = useAuth();
  const router = useRouter();
  console.log("Fetched user details for the side bar is:::", user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDetais, setUserDetails] = useState();
  const tempuser = { name: "Client User" }; // replace with real user

  useEffect(() => {
    if (!loading && (!user || user.role !== "client")) {
      router.push("/login");
    }
    // if(user && !loading){
    //   loadUserDetails()
    // }
  }, [user, loading, router]);

  return (
    <>
      {!loading && user && (
        <div className="flex h-screen w-full overflow-hidden">
          <ClientSidebar
            user={user}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="flex-1 flex flex-col">
            {/* Top bar (mobile) */}
            <header className="lg:hidden flex items-center gap-3 p-4 border-b border-border">
              <button onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold">Client Dashboard</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-6 bg-background">
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
