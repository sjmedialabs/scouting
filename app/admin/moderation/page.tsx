"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  DollarSign,
  Clock,
  Inbox,
} from "lucide-react";
import { authFetch } from "@/lib/auth-fetch";
import { Requirement } from "@/lib/types";
import { toast } from "@/lib/toast";
import { ToastDescription } from "@radix-ui/react-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/components/ui/textarea";

// --------------------
// TYPES
// --------------------
interface ReportItem {
  id: string;
  type: string;
  reason: string;
  status: "all" | "pending" | "resolved" | "dismissed";
  createdAt: string;
  reporter: string;
  itemId: string;
}

interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  budgetDescription: string;
  budgetMin: number;
  budgetMax: number;
  timeline: string;
  attachment?: string;
  allocatedToId?: string;
}

// --------------------
// MOCK DATA
// --------------------
const mockReportedContent: ReportItem[] = [
  {
    id: "1",
    type: "project",
    reason: "Spam content",
    status: "pending",
    createdAt: new Date().toISOString(),
    reporter: "john@example.com",
    itemId: "proj_1",
  },
];

const mockProject: Project = {
  _id: "proj_1",
  title: "Website Redesign for SaaS Platform",
  category: "Web Design",
  description:
    "Redesign the SaaS marketing website with a modern UI, improved UX, and conversion-focused layout.",
  budgetDescription: "Fixed budget based on milestones",
  budgetMin: 50000,
  budgetMax: 80000,
  timeline: "4–6 weeks",
  attachment: "project-brief.pdf",
  allocatedToId: "user_123",
};

// --------------------
// PAGE
// --------------------
export default function ModerationPage() {
  const [reports] = useState<ReportItem[]>(mockReportedContent);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [statusFilter, setStatusFilter] = useState("all");
  const [acceptingId, setAcceptingId] = useState<string | null>(null);


  const[resLoading,setResLoading]=useState(false);
  const[reqquirements,setRequirements]=useState<Requirement[]>([])
  const[filteredRequirements,setFilteredRequirements]=useState<Requirement[]>([]);

  const[showModel,setShowModel]=useState(false);
  const[rejectMsg,setRejectMsg]=useState("");
  const[sending,setSending]=useState(false);
  const[rejectId,setRejectId]=useState("")


  const uniqueTypes = Array.from(
    new Set(reports.map((report) => report.type)),
  );

  const clearFilters = () => {
  setSearch("");
  setTypeFilter("All types");
  setStatusFilter("all");
};


  const loadData=async ()=>{
     setResLoading(true);
     try{
      const res=await authFetch("/api/requirements");
      if(!res.ok) throw new Error();
      const data=await res.json();
      console.log("Fetched Requirements:::::::",data);
      const maapped=data.requirements.filter((eachItem)=>(eachItem.status==="UnderReview" || eachItem.status==="NotApproved" || eachItem.status==="Open"))
      setRequirements(maapped)
      setFilteredRequirements(maapped)


     }catch(error){
      console.log("Failed to fetch the requirements");
     }finally{
      setResLoading(false);
     }
  }
  useEffect(()=>{
    loadData()
  },[])

  const acceptHandel = async (recivedId: string) => {
  setAcceptingId(recivedId);

  try {
    const res = await authFetch(`/api/requirements/${recivedId}`, {
      method: "PUT",
      body: JSON.stringify({ status: "Open" }),
    });

    if (!res.ok) throw new Error();

    toast.success("Successfully approved the posted requirement");

    setRequirements((prev) =>
      prev.filter((eachItem) => eachItem._id !== recivedId)
    );
  } catch (error) {
    console.log("Failed to accept the requirement:::", error);
    toast.error("Failed to accept the requirement");
  } finally {
    setAcceptingId(null);
  }
};


  const handleReject=async()=>{
    setSending(true)
     try{
      const res=await authFetch(`/api/requirements/${rejectId}`,{
        method:"PUT",
        body:JSON.stringify({status:"NotApproved",notApprovedMsg:rejectMsg})
      })
      if(!res.ok)  throw new Error();
      setShowModel(false)
      toast.success("Successfully Rejected the posted requirement")
      setRequirements((prev)=>prev.filter((eachItem)=>eachItem._id!==rejectId))

    }catch(error){
        console.log("Failed to accept the requirement:::",error);
        toast.error("Failed to reject the requirement")
    }finally{
      setSending(false);
    }
  }

  useEffect(() => {
  let tempFiltered = [...reqquirements];

  if (search.trim()) {
    tempFiltered = tempFiltered.filter((eachItem) =>
      eachItem.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (statusFilter !== "all") {
    tempFiltered = tempFiltered.filter(
      (eachItem) => eachItem.status === statusFilter
    );
  }

  setFilteredRequirements(tempFiltered);
}, [search, statusFilter, reqquirements]);


if (resLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-orangeButton my-custom-class">
          Content Moderation
        </h1>
        <p className="text-gray-500 my-custom-class">
          Review and moderate reported content
        </p>
      </div>

      {/* FILTERS (UNCHANGED) */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-gray-200 rounded-lg h-8"
          />
        </div>

        {/* <select
          className="w-full lg:w-1/5 border rounded-lg px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option>All types</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select> */}

        <select
          className="w-full lg:w-1/5 border rounded-lg px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value={"all"}>All</option>
          <option value={"UnderReview"}>Pending</option>
          <option value={"Open"}>Accepted</option>
          <option value={"NotApproved"}>Rejected</option>
        </select>

        <Button
          className=" bg-black text-white rounded-full px-6"
          onClick={clearFilters}
        >
          Clear filter
        </Button>
      </div>

      
     {
      filteredRequirements.length!==0?
       <div>
        {/* LEFT */}
       {
        filteredRequirements.map((eachItem)=>(
            <div key={eachItem._id} className="rounded-2xl border border-[#e6e6e6] bg-white shadow-sm p-6 flex flex-col  mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="rounded-full bg-[#eef7fe] text-[#2c34a1]">
                  {eachItem.category}
                </Badge>

                {/* {mockProject.allocatedToId && (
                  <Badge className="rounded-full bg-green-100 text-green-700">
                    Allocated
                  </Badge>
                )} */}
              </div>

              <h3 className="text-xl font-semibold text-[#2c34a1]">
                {eachItem.title}
              </h3>

              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {eachItem.description}
              </p>
            
            <div className="flex flex-col-3 mt-3 gap-10  w-full">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-[#ff4d00]" />
                <span className="font-semibold">
                  ₹{eachItem.budgetMin.toLocaleString()} – ₹
                  {eachItem.budgetMax.toLocaleString()}
                </span>
              </div>

              {/* <div className="text-xs text-gray-500">
                {mockProject.budgetDescription}
              </div> */}

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-[#ff4d00]" />
                <span className="font-semibold">{eachItem.timeline}</span>
              </div>

              {eachItem.documentUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <Inbox className="h-4 w-4 text-[#ff4d00]" />
                  {/* <span className="text-blue-600 underline cursor-pointer">
                    document uploaded 
                  </span> */}
                  <a href={eachItem.documentUrl} target="_blank" className="text-blue-600 underline cursor-pointer">
                    uploaded document
                  </a>
                </div>
              )}
            </div>
          {
            eachItem.status==="UnderReview" && (
                <div className="flex-col-2 mt-3  w-full">
            <Button
              className="lg:ml-auto bg-orangeButton text-white rounded-full px-6 mr-3"
              onClick={() => acceptHandel(eachItem._id)}
              disabled={acceptingId === eachItem._id}
            >
              {acceptingId === eachItem._id ? "Accepting..." : "Accept"}
            </Button>


            <Button
              className="lg:ml-auto bg-black text-white rounded-full px-6"
              onClick={() => {
                setRejectId(eachItem._id);
                setShowModel(true);
              }}
              disabled={sending}
            >
              {sending ? "Rejecting..." : "Reject"}
            </Button>

            </div>
            )
          }
            </div>
        ))
       }
        
      </div>
      :
      <div className="text-center mt-10">
        <p className="text-gray-500 text-xl">No Requirements  in the UnderReview</p>
      </div>
     }

     {/*Not approving the reqquirement modal*/}
     {
      showModel && (
          <Dialog open={showModel} onOpenChange={setShowModel}>
          <DialogContent className=" md:max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#F4561C]">
                
              </DialogTitle>
            </DialogHeader> */}

            <form onSubmit={()=>handleReject()} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-[#000]  text-[14px] font-bold"
                >
                  Message
                </Label>
                <Textarea
                  id="title"
                  value={rejectMsg}
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                  onChange={(e) =>
                    setRejectMsg(e.target.value)
                  }
                  rows={4}
                  cols={20}
                  placeholder="e.g., Enter your reason for rejecting the requirement"
                  required
                >

                </Textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <DialogClose>
                  <Button className=" bg-[#000] hover:bg-[#000] active:bg-[#000] rounded-full">
                    Cancle
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="  bg-[#2C34A1] hover:bg-[#2C34A1] active:bg-[#2C34A1] rounded-full"
                  disabled={sending}
                >
                  {sending ? "Sending...." : "Send"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )
     }
    </div>
  );
}
