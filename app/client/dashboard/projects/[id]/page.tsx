"use client";

import { Button } from "@/components/ui/button";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { Content } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import RatingStars from "@/components/rating-star";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Requirement,
  Proposal,
  Provider,
  Notification,
} from "@/lib/types";
import { authFetch } from "@/lib/auth-fetch";
import { BsArrowLeft } from "react-icons/bs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
const ProjectDetailPage = () => {
  const [projectDetails, setProjectDetails] = useState();
  const [filterStatus, setFilterStatus] = useState("all");
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const[acceptedProposal,setAcceptedProposal]=useState({});
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const params = useParams();
  const id = params.id as string;
  // negotation modal and message
  const[showNegotationModal,setShowNegotationModal]=useState(false);
  const[negotationMessage,setNegotationMessage]=useState("");
  const[sending,setSending]=useState(false);
  const[conversationId,setConversationId]=useState("");
  const[selectedProposalId,setSelectedProposalId]=useState('')
  const[errorMsg,setErrorMsg]=useState({
    status:"success",
    msg:""
  })

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await authFetch(`/api/proposals/${id}`, {
        credentials: "include",
      });
      const project = await authFetch(`/api/requirements/${id}`, {
        credentials: "include",
      });
      if (response.status === 404) {
        // No proposals case
        setProposals([]);
        setFilteredProposals([]);
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch proposals");
      }
      const data = await response.json();
      const projectData=await project.json()
      console.log("ProjectData are is:::::",projectData)
      setProjectDetails(projectData.requirements[0]);
      setProposals(data.proposals);
      setFilteredProposals(data.proposals);
      if(projectData.requirements[0].status==="Allocated" || projectData.requirements[0].status==="Closed"){
        const AcceptedProposal=(data.proposals || []).find((eachItem)=>eachItem.status==="accepted" || eachItem.status.toLowerCase()==="completed")
        console.log("Accepted Proposal is:::::::",AcceptedProposal)
        setAcceptedProposal(AcceptedProposal);
      }
      setFailed(false);
    } catch (error) {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const getBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-[#39A935] text-[#fff]";
      case "shortlisted":
        return "bg-[#1C96F4] text-[#fff]";
      case "negotiation":
        return "bg-[#FCF6E3] text-[#AF905D]";
      case "rejected":
        return "bg-[#FF0000] text-[#fff]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleShortlist = async (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, status: "shortlisted" as const } : p,
      ),
    );
    console.log("recievd id::::", proposalId);
    try {
      const response = await authFetch(`/api/proposals/${proposalId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "shortlisted" }),
        credentials: "include",
      });
      console.log(
        "Shortlist action response::::",
        await response.json,
        proposalId,
      );
    } catch (error) {
      console.log("failed to update the  status", error);
      alert("Staus failed to shortlist the proposal");
    }
  };
 const handleAccept = async (proposalId: string) => {
     console.log("Entered to accept fun:::", proposalId);
     try {
       const response = await authFetch(`/api/proposals/${proposalId}`, {
         method: "PUT",
         body: JSON.stringify({ status: "accepted" }),
         credentials: "include" 
       });
       console.log(
         "Shortlist action response::::",
         await response.json,
         proposalId,
       );
       if(!response.ok) throw new Error()
       
       //create a conversation between the agency and client and send the message
        //chat concersation start api
             const conRes=await authFetch(`/api/chat/conversation`,{
               method:"POST",
               headers:{
                 "Content-Type":"application/json"
               },
               body:JSON.stringify({proposalId})
   
             })
             const convData=await conRes.json();
 
             const negotatiteProposal=(proposals || []).find((eachItem:any)=>eachItem.id===proposalId)
             
             const messRes=await authFetch(`/api/chat/message`,{
               method:"POST",
               headers:{
                 "Content-Type":"application/json"
               },
               body:JSON.stringify({
                 conversationId:convData.conversationId,
                 senderType:"SEEKER",
                 receiverId:negotatiteProposal?.agency?.userId,
                 content:`Congratulations your proposal is accepted for the ${negotatiteProposal?.requirement.title} and project is allocated to you please stay in touch`,
                 messageType:"TEXT"
 
               })})
 
       setProposals((prev) =>
         prev.map((p) =>
           p.id === proposalId ? { ...p, status: "accepted" as const } : p,
         ),
       );
     } catch (error) {
       console.log("failed to update the  status", error);
       alert("Staus failed to shortlist the proposal");
     }
   };
  const handleReject = async (proposalId: string) => {
    try {
      const response = await authFetch(`/api/proposals/${proposalId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "rejected" }),
        credentials: "include",
      });
      console.log(
        "Shortlist action response::::",
        await response.json,
        proposalId,
      );
      setProposals((prev) =>
        prev.map((p) =>
          p.id === proposalId ? { ...p, status: "rejected" as const } : p,
        ),
      );
    } catch (error) {
      console.log("failed to update the  status", error);
      alert("Staus failed to shortlist the proposal");
    }
  };
  const handlNegotation=async(proposalId:string)=>{
           console.log("Entered to accept fun:::",proposalId)
          // const negotatiteProposal=proposals.find((eachItem:any)=>eachItem.id===proposalId)
           try{
             const  response=await authFetch(`/api/proposals/${proposalId}`,{
              method:"PUT",
              body:JSON.stringify({status:"negotation"})})
  
              console.log("negotation action response::::",await response.json,proposalId)
              setProposals((prev) => prev.map((p) => (p.id === proposalId ? { ...p, status: "negotation" as const } : p)))
              //chat concersation start api
              const conRes=await authFetch(`/api/chat/conversation`,{
                method:"POST",
                headers:{
                  "Content-Type":"application/json"
                },
                body:JSON.stringify({proposalId})
     
              })
              const convData=await conRes.json();
              setConversationId(convData.conversationId)
              
              setSelectedProposalId(proposalId)
              setShowNegotationModal(true)
              
              console.log("Conversation Started")
          }catch(error){
            console.log("failed to update the  status",error)
            alert("Staus failed to shortlist the proposal")
          }
  }
  const handleSendMessage=async()=>{
    if(!negotationMessage.trim()) {
      setErrorMsg({
        status:"failed",
      msg:"Required"          
    })
    }
      setSending(true);
      const negotatiteProposal=proposals.find((eachItem:any)=>eachItem.id===selectedProposalId)
      try{
          //send message to the agency in the chat
        const messRes=await authFetch(`/api/chat/message`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            conversationId:conversationId,
            senderType:"SEEKER",
            receiverId:negotatiteProposal?.agency?.userId,
            content:negotationMessage,
            messageType:"TEXT"

          })

        })
        if(messRes.ok){
          setNegotationMessage("");
          setShowNegotationModal(false);

        }
      }catch(error){
          console.log("Failed to send the message")
          setErrorMsg({
          status:"failed",
          msg:"Failed to send the message"
          })
      }finally{
        setSending(false)
      }
  }

  // if (loading) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  //       </div>
  //     )
  //   }
  // if(failed){
  //         return(
  //         <div className="flex flex-col justify-center items-center text-center min-h-100">
  //             <h1 className="text-center font-semibold">Failed  to Retrive the data</h1>
  //             <Button onClick={loadData} className="h-[40px] mt-2 w-[90px] bg-[#2C34A1] text-[#fff]">Reload</Button>
  //         </div>
  //         )
  // }
  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredProposals(proposals);
    } else {
      setFilteredProposals(
        proposals.filter(
          (req) => req.status.toLowerCase() === filterStatus.toLowerCase(),
        ),
      );
    }
  }, [proposals, filterStatus]);
  console.log("Project Details is ::::::::::",projectDetails);
  console.log("Proposals for this project:::::::::",proposals);
  const fieldClass =
  "h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-[16px] text-gray-900 flex items-center"

const textareaClass =
  "rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[16px] text-gray-900 leading-[1.6] whitespace-pre-wrap"


  return (
    <div className="space-6 p-5">
      
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {failed && (
        <div className="flex flex-col justify-center items-center text-center min-h-100">
          <h1 className="text-center font-semibold">
            Failed to Retrive the data
          </h1>
          <Button
            onClick={loadData}
            className="h-[40px] mt-2 w-[90px] bg-[#2C34A1] text-[#fff]"
          >
            Reload
          </Button>
        </div>
      )}
      {
       ( (projectDetails || {}).status!=="Allocated"  && (projectDetails || {}).status!=="Closed") &&(
          <div>
            {/*header */}
              <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-[#F4561C] my-custom-class">
                  Project Details
                  {proposals.length > 0 && (
                    <span className="text-[24px] font-normal text-[#656565]">
                      {" "}
                      for {proposals[0].requirement.title}
                    </span>
                  )}
                </h1>
                <p className="text-lg font-normal text-[#656565] my-custom-class ">
                  Review and manage proposals received for this project
                </p>
              </div>
              <div>
                <Button
                  className="bg-[#000] rounded-full"
                  onClick={() => router.push("/client/dashboard/projects")}
                >
                  <FaArrowLeftLong className="h-4 w-4" color="#fff" /> Back to
                  Projects
                </Button>
              </div>
              </div>
            {(proposals || []).length > 0 && (
                <Card className="mt-6 p-3  bg-[#fff] py-5 rounded-[22px]">
                  <CardContent>
                    <Select
                      onValueChange={(value) => setFilterStatus(value)}
                      value={filterStatus}
                    >
                      <SelectTrigger
                        className="
                                        mt-1
                                        border-0
                                        border-2
                                        border-[#b2b2b2]
                                        mb-4
                                        
                                        rounded-full

                                        shadow-none
                                        focus:outline-none focus:ring-0 focus:ring-offset-0
                                        focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0
                                        focus:border-[#b2b2b2]
                                        placeholder:text-[#b2b2b2]
                                        px-6
                                        w-[150px]
                                        h-12
                                        text-sm
                                        md:text-base
                                      "
                      >
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="negotation">Negotiation</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="withdrawn">Withdrawn</SelectItem>
                      </SelectContent>
                    </Select>
                    {filteredProposals.length > 0 ? (
                      (filteredProposals || []).map((proposal) => (
                        <Card
                          key={proposal.id}
                          className="py-0 px-0 rounded-[22px] mb-3"
                        >
                          <CardContent className="px-5 py-6">
                            <div className="flex flex-col lg:flex-row lg:justify-start gap-4">
                              {/* Left Image */}
                              <div className="max-h-[300px] max-w-100 lg:max-h-[100%] lg:max-w-[300px] rounded-[18px] overflow-hidden shrink-0">
                                <img
                                  src={proposal.agency.coverImage || "/proposal.jpg"}
                                  alt={proposal.agency.name}
                                  className="h-full w-full"
                                />
                              </div>

                              {/* Right Content */}
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge
                                        variant="outline"
                                        className="text-xs border-[#DEDEDE] bg-[#EDEDED] rounded-full h-[30px] px-3"
                                      >
                                        {proposal?.requirement?.title ||
                                          "Unknown Project"}
                                      </Badge>
                                    </div>

                                    <h3 className="text-2xl font-bold text-[#000] mb-0">
                                      {proposal.agency.name}
                                    </h3>

                                    <p className="text-sm ml-1 -mt-1 text-[#939191] font-normal">
                                      {proposal.agency.name}
                                    </p>

                                    {/* Rating */}
                                    <div className="flex items-center mt-0 gap-1 text-sm font-medium">
                                      <RatingStars
                                        rating={proposal.agency.rating}
                                        reviews={proposal.agency.reviewCount}
                                      />
                                      <span className="text-sm font-bold text-[#000] mt-1">
                                        {`${proposal.agency.rating || 0} (${proposal.agency.reviewCount || 0})`}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="text-right mb-0">
                                    <div className="text-2xl font-bold text-[#39A935]">
                                      ${proposal.proposedBudget.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-[#A0A0A0] -mt-1">
                                      {proposal.proposedTimeline}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  {
                                    proposal?.coverLetter &&(
                                      <div>
                                    <h4 className="font-bold text-xl text-[#616161] mb-0">
                                      Cover Letter
                                    </h4>
                                    <p className="text-[#939191] font-normal text-sm">
                                      {proposal?.coverLetter}
                                    </p>
                                  </div>
                                    )
                                  }

                                  <div className="mb-4">
                                    <h4 className="font-bold text-xl text-[#616161] mb-0">
                                      Proposal Description
                                    </h4>
                                    <p className="text-[#939191] font-normal text-sm">
                                      {proposal.proposalDescription}
                                    </p>
                                  </div>

                                  <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-[#DDDDDD] border-t-2">
                                    <div className="flex items-center mt-2 mb-3 gap-2">
                                      <span className="text-sm text-[#000000] font-noormal">
                                        Submitted on :{" "}
                                        {new Date(
                                          proposal.updatedAt,
                                        ).toLocaleDateString()}
                                      </span>

                                      <Badge
                                        className={`border-[#DEDEDE] bg-[#EDEDED] rounded-full text-xs text-[#000] ${getBgColor(
                                          proposal.status,
                                        )}`}
                                      >
                                        {proposal.status.charAt(0).toUpperCase() +
                                          proposal.status.slice(1)}
                                      </Badge>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                      {/* Shortlist */}                        
                                        {
                                          (proposal.status!=="shortlisted"  && proposal.status!=="accepted" && proposal.status!=="rejected") && (
                                            <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleShortlist(proposal.id)}
                                          className="bg-[#E6E8EC] rounded-full text-xs font-bold hover:bg-[#E6E8EC] hover:text-[#000] active:bg-[#E6E8EC] active:text-[#000]"
                                        >
                                          Shortlist
                                        </Button>
                                          )
                                        }
                                      

                                      {/* Accept */}
                                      {proposal.status !== "accepted" &&
                                        proposal.status !== "rejected" && (
                                          <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleAccept(proposal.id)}
                                            className="bg-[#39A935] rounded-full text-xs font-bold hover:bg-[#39A935] active:bg-[#39A935]"
                                          >
                                            Accept
                                          </Button>
                                        )}
                                      {/*negotation */}
                                        {proposal.status !== "accepted" &&
                                        proposal.status !== "rejected" && 
                                        proposal.status!=="shortlisted" &&
                                        proposal.status!=="negotation" &&
                                        proposal.status !== "completed" &&(
                                          <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => handlNegotation(proposal.id)}
                                            className="bg-[#F5A30C] rounded-full text-xs font-bold hover:bg-[#F5A30C] active:bg-[#F5A30C]"
                                          >
                                            Negotation
                                          </Button>
                                        )}

                                      {/* Reject */}
                                      {proposal.status !== "accepted" &&
                                        proposal.status !== "rejected" && (
                                          <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleReject(proposal.id)}
                                            className="bg-[#FF0000] rounded-full text-xs font-bold hover:bg-[#FF0000] active:bg-[#FF0000]"
                                          >
                                            Reject
                                          </Button>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <h2 className="text-2xl text-center mt-10 font-semibold text-[#656565]">
                        No Proposals Found
                      </h2>
                    )}
                  </CardContent>
                </Card>
              )}
          </div>
        )
      }
      {
        (  (projectDetails || {}).status === "Allocated" || (projectDetails || {}).status==="Closed") && (
            <div className="space-y-8">

                          {/* HEADER */}
                          <Card className="rounded-[36px] border border-gray-300 bg-white">
                            <CardContent className="px-12 py-0 space-y-6">

                              {/* Heading */}
                              <div className="space-y-3 flex justify-between">
                                <h1 className="text-[28px] font-extrabold text-orange-600 h-8">
                                  {acceptedProposal.requirement.title}
                                </h1>

                                <Button
                                  className="bg-[#000] rounded-full w-[100px] hover:bg-[#000] cursor-pointer"
                                  onClick={() => router.push("/client/dashboard/projects")}
                                >
                                  <BsArrowLeft color="#fff" height={8} width={8} />
                                  Back
                                </Button>
                              </div>

                              {/* Meta row */}
                              <div className="flex flex-wrap items-center h-3 gap-8 text-[16px]">
                                <span className="rounded-md leading-none bg-gray-100 px-3 py-1 text-[14px] font-medium text-gray-500">
                                  {acceptedProposal.requirement.category}
                                </span>

                                <span className="text-gray-900">
                                  <span className="font-semibold">Budget:</span>{" "}
                                  <span className="text-gray-500">
                                    ${acceptedProposal.requirement.budgetMin} – $
                                    {acceptedProposal.requirement.budgetMax}
                                  </span>
                                </span>

                                <span className="text-gray-900">
                                  <span className="font-semibold">Timeline:</span>{" "}
                                  <span className="text-gray-500">
                                    {acceptedProposal.requirement.timeline}
                                  </span>
                                </span>
                              </div>

                              {/* Description */}
                              <p className="max-w-full text-[14px] leading-5 text-gray-500">
                                {acceptedProposal.requirement.description}
                              </p>

                            </CardContent>
                          </Card>

                          {/* PROPOSAL DETAILS */}
                          <Card className="rounded-[36px] border border-gray-300 bg-white">
                            <CardContent className="px-12 py-10 space-y-10">

                              <div className="flex justify-end">
                                <Badge className="rounded-full bg-green-500 text-sm h-[30px]">
                                  {acceptedProposal.status}
                                </Badge>
                              </div>

                              {/* COST & TIMELINE */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-2">
                                  <label className="text-[14px] font-bold text-[#98A0B4]">
                                    Proposed Cost ($)
                                  </label>
                                  <div className={fieldClass}>
                                    ${acceptedProposal.proposedBudget}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[14px] font-bold text-[#98A0B4]">
                                    Estimated Timeline
                                  </label>
                                  <div className={fieldClass}>
                                    {acceptedProposal.proposedTimeline}
                                  </div>
                                </div>
                              </div>

                              {/* WORK APPROACH */}
                              <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#98A0B4]">
                                  Work Approach
                                </label>
                                <div className={`${textareaClass} min-h-[140px]`}>
                                  {acceptedProposal.proposalDescription}
                                </div>
                              </div>

                              {/* COVER LETTER */}
                             {
                              acceptedProposal?.coverLetter &&(
                                 <div className="space-y-3">
                                <label className="text-[14px] font-bold text-[#98A0B4]">
                                  Cover Letter
                                </label>
                                <div className={`${textareaClass} min-h-[140px]`}>
                                  {acceptedProposal?.coverLetter}
                                </div>
                              </div>
                              )
                             }

                              {/* MILESTONES */}
                              <div className="space-y-4">
                                <label className="text-[14px] font-bold text-[#98A0B4]">
                                  Project Milestones
                                </label>

                                {acceptedProposal.milestones.map((milestone, index) => (
                                  <div
                                    key={index}
                                    className={`${fieldClass} ${
                                      milestone.completed ? "line-through" : ""
                                    }`}
                                  >
                                    {milestone.title}
                                  </div>
                                ))}
                              </div>

                            </CardContent>
                          </Card>

            </div>
          )
      }

      
      {(proposals || []).length === 0 && !failed && !loading && (
        <Card className="mt-6 p-3  bg-[#fff] py-5 rounded-[22px]">
          <CardContent className="p-10 text-center">
            <h2 className="text-2xl font-semibold text-[#656565]">
              No Proposals Received Yet
            </h2>
          </CardContent>
        </Card>
      )}

      {/*Negotaatiion Modal */}

           {showNegotationModal && (
              <Dialog open={showNegotationModal} onOpenChange={setShowNegotationModal}>
              <DialogContent className="md:max-w-xl rounded-2xl  flex flex-col p-0">

                {/* ✅ FIXED HEADER */}
                <DialogHeader className="px-6 py-4 border-b shrink-0">
                  <DialogTitle className="text-xl font-bold text-[#F4561C]">
                   Send Message to Agency
                  </DialogTitle>
                </DialogHeader>

                {/* ✅ SCROLLABLE FORM FIELDS */}
              
                 <div className="mt-3 p-4 w-full">
                  <p className="text-md text-gray-400">Message</p>
                  <textarea
                  value={negotationMessage}
                  onChange={(e)=>setNegotationMessage(e.target.value)}
                  className="border-1 border-gray-500 p-3 w-100 rounded-md"
                  rows={6}
                  cols={30}
                  placeholder="Enter Your Message"
                  >

                  </textarea>
                  {
                    errorMsg.status==="failed" &&(
                      <p className="text-sm text-red-400">{errorMsg.msg}</p>

                    )
                  }
                 </div>

                {/* ✅ FIXED FOOTER */}
                <div className="px-6 py-4 border-t flex gap-5 shrink-0">
                  <Button type="submit" disabled={sending} onClick={handleSendMessage} className="bg-[#2C34A1] rounded-full">
                    {sending ? "Sending..." : "Send"}
                  </Button>
                  <DialogClose asChild>
                    <Button className="bg-[#000] rounded-full">Cancel</Button>
                  </DialogClose>
                </div>

              </DialogContent>
            </Dialog>

            )}
    </div>
  );
};
export default ProjectDetailPage;
