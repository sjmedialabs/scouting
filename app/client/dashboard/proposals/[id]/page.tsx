"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { Proposal } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BsArrowLeft } from "react-icons/bs";


export default function ProposalViewDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user, loading } = useAuth()

  const [resLoading, setResLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  const [proposal, setProposal] = useState<Proposal | null>(null)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace("/login")
      return
    }

    const loadProposal = async () => {
      setResLoading(true)
      setFailed(false)

      try {
        const res = await fetch(`/api/proposals/${id}`)
        if (!res.ok) throw new Error("Failed")

        const data = await res.json()
        setProposal(data.proposals[0])
      } catch (err) {
        setFailed(true)
      } finally {
        setResLoading(false)
      }
    }

    loadProposal()
  }, [id, user, loading, router])

  if (resLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (failed || !proposal) {
    return <div className="p-6">Proposal not found</div>
  }
  const fieldClass =
  "h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-[16px] text-gray-900 flex items-center"

const textareaClass =
  "rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[16px] text-gray-900 leading-[1.6] whitespace-pre-wrap"


  return (
    <div className="space-y-8">

      {/* HEADER */}
      {/* <Card className="rounded-[36px] border border-gray-300 bg-white">
        <CardContent className="px-12 py-6 space-y-4">
          <p className="text-[20px] font-extrabold text-black">
            Proposal Details
          </p>

          <h1 className="text-[28px] font-extrabold text-orange-600">
            {proposal.requirement?.title}
          </h1>

          <p className="text-sm text-gray-500">
            Category: {proposal.requirement?.category}
          </p>
        </CardContent>
      </Card> */}
      <Card className="rounded-[36px] border border-gray-300 bg-white">
        <CardContent className="px-12 py-0 space-y-6">

          {/* Heading */}
          <div className="space-y-3 flex justify-between">
            {/* <p className="text-[20px] font-extrabold text-black h-2">
              Submitting Proposal For
            </p> */}

            <h1 className="text-[28px] font-extrabold text-orange-600 h-8">
              {proposal.requirement.title}
            </h1>
            <Button className="bg-[#000] rounded-full w-[100px] hover:bg-[#000] cursor-pointer " onClick={()=>router.push('/client/dashboard/proposals')} >
              <BsArrowLeft color="#fff" height={8} width={8}/>
              Back
            </Button>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center  h-3 gap-8 text-[16px]">
            {/* Category */}
            <span className="rounded-md leading-none bg-gray-100 px-3 py-1 text-[14px] font-medium text-gray-500">
              {proposal.requirement.category}
            </span>

            {/* Budget */}
            <span className="text-gray-900">
              <span className="font-semibold">Budget:</span>{" "}
              <span className="text-gray-500">
                ${proposal.requirement.budgetMin} – ${proposal.requirement.budgetMax}
              </span>
            </span>

            {/* Timeline */}
            <span className="text-gray-900">
              <span className="font-semibold">Timeline:</span>{" "}
              <span className="text-gray-500">{proposal.requirement.timeline}</span>
            </span>
          </div>

          {/* Description */}
          <p className="max-w-full text-[14px] leading-5 text-gray-500">
            {proposal.requirement.description}
          </p>

        </CardContent>
      </Card>

      {/* PROPOSAL DETAILS */}
      <Card className="rounded-[36px] border border-gray-300 bg-white">
  <CardContent className="px-12 py-10 space-y-10">

    <div className="flex justify-end">
      <Badge className="rounded-full bg-green-500 text-sm h-[30px]">{proposal.status}</Badge>
    </div>

    {/* COST & TIMELINE */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="space-y-2">
        <label className="text-[14px] font-bold text-[#98A0B4]">
          Proposed Cost ($)
        </label>
        <div className={fieldClass}>
          ${proposal.proposedBudget}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[14px] font-bold text-[#98A0B4]">
          Estimated Timeline
        </label>
        <div className={fieldClass}>
          {proposal.proposedTimeline}
        </div>
      </div>
    </div>

    {/* WORK APPROACH */}
    <div className="space-y-3">
      <label className="text-[14px] font-bold text-[#98A0B4]">
        Work Approach
      </label>
      <div className={`${textareaClass} min-h-[140px]`}>
        {proposal.proposalDescription}
      </div>
    </div>

    {/* COVER LETTER */}
    <div className="space-y-3">
      <label className="text-[14px] font-bold text-[#98A0B4]">
        Cover Letter
      </label>
      <div className={`${textareaClass} min-h-[140px]`}>
        {proposal.coverLetter}
      </div>
    </div>

    {/* MILESTONES */}
    <div className="space-y-4">
      <label className="text-[14px] font-bold text-[#98A0B4]">
        Project Milestones
      </label>

      {proposal.milestones.map((milestone, index) => (
        <div key={index} className={`${fieldClass} ${milestone.completed?"line-through":""}`}>
          {milestone.title}
        </div>
      ))}
    </div>

  </CardContent>
</Card>

    </div>
  )
}
