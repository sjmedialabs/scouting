"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AlertTriangle, Search, Check, X,Calendar, Eye} from "lucide-react";

import { mockReportedContent } from "@/lib/mock-data";
import { authFetch } from "@/lib/auth-fetch";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Report type interface
interface ReportItem {
  id: string;
  type: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
  reporter: string;
  itemId: string;
}

export default function ModerationPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [search, setSearch] = useState("");
  const[resLoading,setResLoading]=useState(false);
  const[failed,setFailed]=useState(false)

  const[open,setOpen]=useState(false);
  const[selectedReport,setSelectedReport]=useState();


   async function loadReports() {
    setResLoading(true);
    setFailed(false);
      try{
        const res = await authFetch("/api/reported-content");
        if(!res.ok) throw new Error();
        const data = await res.json();

        setReports(data.reports);
      }catch(error){
           console.log("Failed to fetch the reports::::",error)
           setFailed(false);
      }finally{
        setResLoading(false)
      }
    }
  
  
  useEffect(() => {
    loadReports();
  }, []);
  

  const resolveReport = (id: string, action: "approve" | "reject") => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: action === "approve" ? "resolved" : "dismissed",
            }
          : r,
      ),
    );

    console.log(
      `Report ${id} ${action === "approve" ? "approved" : "rejected"}`,
    );
  };

  const filteredReports = reports.filter(
    (r) =>
      r.reason.toLowerCase().includes(search.toLowerCase()) ||
      r.reportedBy?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  if (resLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-orangeButton my-custom-class">
          Reported Content
        </h1>
        <p className="text-gray-500 my-custom-class">
          Platform management and oversight
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow border flex gap-3 items-center">
        <Search className="w-4 h-4 ml-2 text-gray-500 absolute" />
        <Input
          placeholder="Search reports by type, reason, reporter..."
          className="w-full pl-8 placeholder:pl-2 placeholder:text-500 border shadow relative placeholder:text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border shadow-lg overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-red-100">
            <tr className="text-left">
              {/* <th className="px-6 py-4 font-semibold text-black my-custom-class">Type</th> */}
              <th className="px-6 py-4 font-semibold text-black my-custom-class">Reason</th>
              <th className="px-6 py-4 font-semibold text-black my-custom-class">Status</th>
              <th className="px-6 py-4 font-semibold text-black my-custom-class">Role</th>
              <th className="px-6 py-4 font-semibold text-black my-custom-class">
                Reported Date
              </th>
              <th className="px-6 py-4 font-semibold text-black text-center my-custom-class">
                Actions
              </th>
            </tr>
          </thead>

          
            {
              filteredReports.length!==0
              ?
               <tbody>
                      {filteredReports.map((report) => (
                    <tr
                      key={report._id}
                      className="border-b border-red-100 hover:bg-gray-50 transition"
                    >
                      {/* Type */}
                      {/* <td className="px-6 py-4">
                        <Badge className="bg-[#dbd9f0] text-[#4a37d6] my-custom-class rounded-md px-3 py-1">
                          {report.type}
                        </Badge>
                      </td> */}

                      {/* Reason */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-black my-custom-class">
                          {report.reason}
                        </p>
                        <p className="text-sm text-gray-500 my-custom-class">
                          Reported by {report.reportedBy.name}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className="inline-flex px-4 py-1 my-custom-class text-sm font-medium bg-yellow-200 text-yellow-800 rounded-sm">
                          {report.status}
                        </span>
                      </td>

                      {/*Role */}

                      <td className="px-6 py-4">
                        <Badge className="bg-green-50 text-green-500 rounded-full">{report.reportedBy.role}</Badge>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-black my-custom-class flex gap-2 items-center">
                        <Calendar className="w-4 h-4 text-gray-900" />
                        <span>
                        {new Date(report.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-6 text-black">
                          <button onClick={()=>{
                            setOpen(true)
                            setSelectedReport(report)
                            }}
                            className="cursor-pointer"
                            >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              resolveReport(report.id, "approve")
                            }
                            className="hover:text-green-600"
                          >
                            <Check className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() =>
                              resolveReport(report.id, "reject")
                            }
                            className="hover:text-red-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
               </tbody>
              :
              <tbody className="text-center">
                <p className="text-gray-500 text-xl">No Reports for now</p>
              </tbody>
              
            }
          
        </table>

        {filteredReports.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            No reports found.
          </p>
        )}
      </div>

      {/*view modal*/}

       {
        open && (
          <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#F54A0C]">Report Content</DialogTitle>
        </DialogHeader>

        {/* Reason dropdown */}
        <div className="rounded-md border border-[#D0D5DD] px-3 py-2 text-sm bg-gray-50">
          {selectedReport?.reason}
        </div>

        {/* Description */}
        <div className="rounded-md border border-[#D0D5DD] px-3 py-2 text-sm bg-gray-50 whitespace-pre-wrap">
          {selectedReport?.description}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={()=>setOpen(false)}
            
          >
            Cancel
          </Button>
         
        </DialogFooter>
      </DialogContent>
    </Dialog>
        )
       }
    </div>
  );
}
