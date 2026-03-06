"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Star, Verified, DollarSign, Calendar, MessageSquare, ThumbsUp, ThumbsDown, Edit } from "lucide-react"
import type { Proposal } from "@/lib/types"
import { HiCurrencyDollar } from "react-icons/hi2"
import RatingStars from "../rating-star"

interface ProposalListProps {
  proposals: Proposal[]
  maxVisible?: number
  onShortlist: (proposalId: string) => void
  onAccept: (proposalId: string) => void
  onReject: (proposalId: string) => void
  onRequestRevision: (proposalId: string, feedback: string) => void
}

export function ProposalList({
  proposals,
  maxVisible = 10,
  onShortlist,
  onAccept,
  onReject,
  onRequestRevision,
}: ProposalListProps) {
  const [visibleProposals, setVisibleProposals] = useState(proposals.filter((item:any)=>(item.status!=="rejected")))
  const [rejectedCount, setRejectedCount] = useState(0)
  const [revisionDialog, setRevisionDialog] = useState<{ open: boolean; proposalId: string }>({
    open: false,
    proposalId: "",
  })
  const [revisionFeedback, setRevisionFeedback] = useState("")
  const [negotiationDialog, setNegotiationDialog] = useState<{ open: boolean; proposalId: string }>({
    open: false,
    proposalId: "",
  })
  useEffect(()=>{

  },[])

  const handleReject = (proposalId: string) => {
    onReject(proposalId)
    setRejectedCount((prev) => prev + 1)

    // Show next proposal if available
    const remainingProposals = proposals.filter((p) => !visibleProposals.find((vp) => vp.id === p.id))
    if (remainingProposals.length > 0) {
      setVisibleProposals((prev) => [...prev.filter((p) => p.id !== proposalId), remainingProposals[0]])
    } else {
      setVisibleProposals((prev) => prev.filter((p) => p.id !== proposalId))
    }
  }

  const handleAccept = (proposalId: string) => {
    onAccept(proposalId)
    setNegotiationDialog({ open: true, proposalId })
  }

  const handleRequestRevision = () => {
    onRequestRevision(revisionDialog.proposalId, revisionFeedback)
    setRevisionDialog({ open: false, proposalId: "" })
    setRevisionFeedback("")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mt-0">
        <h3 className="text-lg font-semibold my-custom-class tracking-tight">Proposals Received</h3>
        <div className="text-sm text-muted-foreground">
          Showing {visibleProposals.length} of {proposals.length} proposals
          {(proposals.length-visibleProposals.length) > 0 && ` (${proposals.length-visibleProposals.length} rejected)`}
        </div>
      </div>
 
      {visibleProposals.map((proposal) => (
       <Card
          key={proposal.id}
          className="flex lg:flex-row  gap-6 bg-[#F5F5F5] border border-[#DAD7D7] rounded-[22px] p-4 hover:shadow-md transition-shadow"
        >
          {/* Left Image */}
          <div className="lg:max-h-[300px] lg:max-w-[300px] rounded-[18px] overflow-hidden shrink-0">
            <img
              src={proposal.agency.coverImage || "/proposal.jpg"}
              alt={proposal.agency.name}
              className="h-full w-full"
            />
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start">
              <div>
                <h3 className="text-xl font-bold ">
                  {proposal.agency.name}
                </h3>
                <p className="text-sm text-[#939191] font-normal">
                  {proposal.agency.name}
                </p>

                {/* Price & Timeline */}
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <HiCurrencyDollar color="#F54A0C" className="h-6 w-6"/>
                    <span className="text-[14px] font-bold text-[#616161]">$ {proposal.proposedBudget}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <img src="/chat-operational-2.png" alt="chat" className="h-6 w-6"/>
                    <span className="text-[14px] font-bold text-[#616161]"> {proposal.proposedTimeline}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 text-sm font-medium">
                <RatingStars rating={proposal.agency.rating} reviews={proposal.agency.reviewCount}/>
                <span className="text-sm font-bold text-[#000] mt-1">{`${proposal.agency.rating || 0} (${proposal.agency.reviewCount || 0})`} </span>
              </div>
            </div>

            {/* Work Approach */}
            <p className="text-sm text-[#939191] font-normal mt-3">
              {proposal?.proposalDescription|| "we will complete your project in a specific way"}
            </p>

            {/* Milestones */}
            <div className="mt-3">
              <h4 className="text-lg font-bold text-[#616161]">Milestones</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {proposal.milestones.map((milestone, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 items-center border-2  rounded-full bg-[#EDEDED] h-[30px] border-[#DEDEDE] text-xs text-[#000] "
                  >
                    {milestone?.title || milestone}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-4">
               
               {
                (proposal.status!=="shortlisted" && proposal.status!=="negotation" && proposal.status!=="accepted") && (<Button
                size="sm"
                className="rounded-full bg-[#2C34A1] hover:bg-[#2C34A1] text-sm"
                onClick={() => onShortlist(proposal.id)}
              >
                Shortlist →
              </Button>)
               }

              {
                (proposal.status!=="accepted" && proposal.status!=="rejected") && (
                  <Button
                size="sm"
                className="rounded-full bg-[#39A935] hover:bg-[#39A935] text-sm"
                onClick={() => handleAccept(proposal.id)}
              >
                Accept
              </Button>

                )
              }
              {
                (proposal.status!=="negotation" && proposal.status!=="accepted") && (
                   <Button
                size="sm"
                className="rounded-full bg-[#F5A30C] hover:bg-[#F5A30C] text-sm"
                onClick={() =>
                  setRevisionDialog({ open: true, proposalId: proposal.id })
                }
              >
                Request Revision
              </Button>
                )
              }

              {(proposal.status!=="rejected" &&  proposal.status!=="accepted") && (
                <Button
                size="sm"
                className="rounded-full bg-[#FF0000] hover:bg-[#FF0000]"
                onClick={() => handleReject(proposal.id)}
              >
                Reject
              </Button>
              )}
            </div>
          </div>
        </Card>

      ))}
      {
        visibleProposals.length===0 && (
          <div className="mt-10">
          <p className="text-center  text-[#616161] text-2xl">No  proposals recieved yet.</p>
          </div>
        )
      }

      {/* Revision Request Dialog */}
      <Dialog open={revisionDialog.open} onOpenChange={(open) => setRevisionDialog({ open, proposalId: "" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Proposal Revision</DialogTitle>
            <DialogDescription>Provide feedback to help the provider improve their proposal</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              placeholder="Please explain what changes you'd like to see in the proposal..."
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={handleRequestRevision}>Send Revision Request</Button>
              <Button variant="outline" onClick={() => setRevisionDialog({ open: false, proposalId: "" })}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Negotiation Chat Dialog */}
      <Dialog open={negotiationDialog.open} onOpenChange={(open) => setNegotiationDialog({ open, proposalId: "" })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Negotiation Chat</DialogTitle>
            <DialogDescription>Start negotiating project details with the provider</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">System Message</div>
              <p className="text-sm">
                🎉 Congratulations! You've accepted this proposal. You can now negotiate the final terms, timeline, and
                project details with the provider. Once both parties agree, the project will begin.
              </p>
            </div>
            <div className="h-64 border rounded-lg p-4 bg-background">
              <div className="text-center text-muted-foreground text-sm">
                Chat interface would be implemented here with real-time messaging
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Start Project</Button>
              <Button variant="outline" onClick={() => setNegotiationDialog({ open: false, proposalId: "" })}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
