"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import {
  FileText,
  MessageSquare,
  Users,
  Award,
  DollarSign,
  Calendar,
  Eye,
  Edit,
} from "lucide-react";
import type { Proposal } from "@/lib/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { setTimeout } from "timers/promises";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth-fetch";

const ProposalsPage = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const router = useRouter();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null,
  );
  console.log("prioposals::::::::::::",proposals)
  const [errors, setErrors] = useState<{
    cost: boolean;
    timeline: boolean;
    approach: boolean;
    form: boolean;
  }>({
    cost: false,
    timeline: false,
    approach: false,
    form: false,
  });

  const validateForm = () => {
    const hasCostError = !cost.trim() || Number(cost) <= 0;
    const hasTimelineError = !timeline.trim();
    const hasApproachError = !approach.trim();

    const hasError = hasCostError || hasTimelineError || hasApproachError;

    setErrors({
      cost: hasCostError,
      timeline: hasTimelineError,
      approach: hasApproachError,
      form: hasError,
    });

    return !hasError;
  };

  const [cost, setCost] = useState("");
  const [timeline, setTimeline] = useState("");
  const [approach, setApproach] = useState("");
  const [milestones, setMilestones] = useState([""]);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formResponse, setFormResponse] = useState("");
  const [success, setSuccess] = useState(false);

  const [stats, setStats] = useState({
    submissions: 0,
    lastWeekSubmissions: 0,
    clientResponse: 0,
    clientResponsePercentage: 0,
    clientViewed: 0,
    clientViewedPercentage: 0,
    activeConversations: 0,
    activeConversationsPercentage: 0,
    shortlisted: 0,
    shortlistedPercentage: 0,
    accepted: 0,
    acceptedPercentage: 0,
    totalValue: 0,
  });

  const getStatusBadgeClass = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-[#F3D5B5] text-[#8A4B08]";
      case "shortlisted":
        return "bg-[#2F80ED] text-white";
      case "accepted":
        return "bg-[#27AE60] text-white";
      case "rejected":
        return "bg-[#EB5757] text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const loadData = async () => {
    setLoading(true);
    setFailed(false);

    try {
      const res = await authFetch("/api/proposals");
      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      const list = data.proposals || [];

      let submissionCount = list.length;
      let countClientResponse = 0;
      let acceptedCount = 0;
      let totalValue = 0;
      let lastWeekSubmissionCount = 0;
      let shortlistedCount = 0;
      let clientViewedCount = 0;
      let activeConversationCount = 0;

      const now = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);

      list.forEach((p: any) => {
        if (p.status?.toLowerCase() !== "pending") countClientResponse++;
        if (p.status?.toLowerCase() === "accepted") {
          acceptedCount++;
          totalValue += p.proposedBudget || 0;
        }
        if (p.status?.toLowerCase() === "shortlisted") shortlistedCount++;
        if (p.clientViewed) clientViewedCount++;
        if (p.conversationStarted) activeConversationCount++;

        const created = new Date(p.createdAt);
        if (created >= lastWeek && created <= now) lastWeekSubmissionCount++;
      });

      const pct = (v: number) =>
        submissionCount > 0 ? Math.round((v / submissionCount) * 100) : 0;

      setStats({
        submissions: submissionCount,
        lastWeekSubmissions: lastWeekSubmissionCount,
        clientResponse: countClientResponse,
        clientResponsePercentage: pct(countClientResponse),
        clientViewed: clientViewedCount,
        clientViewedPercentage: pct(clientViewedCount),
        activeConversations: activeConversationCount,
        activeConversationsPercentage: pct(activeConversationCount),
        shortlisted: shortlistedCount,
        shortlistedPercentage: pct(shortlistedCount),
        accepted: acceptedCount,
        acceptedPercentage: pct(acceptedCount),
        totalValue,
      });

      setProposals(list);
    } catch (err) {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  const handleUpdateProposal = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccess(false);

    try {
      // const tempmilestons=milestones.map((eachItem)=>({title:eachItem}))

      const payload = {
        proposedBudget: cost,
        proposedTimeline: timeline,
        proposalDescription: approach,
        coverLetter: coverLetter,
        milestones: milestones.map((eachItem) => ({ title: eachItem })),
      };

      console.log("Payload to send:::::::", payload);
      const res = await authFetch(`/api/proposals/${selectedProposal?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("update response proposal:::", res);
      if (res.ok) {
        setSuccess(true);
        setErrors({
          cost: false,
          timeline: false,
          approach: false,
          form: false,
        });

        setShowEditDialog(false);
        toast.success("Successfully updated the proposal details");
        loadData();
      } else {
        setFormResponse("failed to update the proposal please try again");
      }

      // setTimeout(() => {
      //   router.push("/agency/dashboard/project-inquiries")
      // }, 4500)
    } catch {
      setErrors({
        cost: false,
        timeline: false,
        approach: false,
        form: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEditProposal = (proposalId: string) => {
    const proposalToEdit = proposals.find((p) => p.id === proposalId);
    console.log("Proposal to edit::::", proposalToEdit);
    if (proposalToEdit) {
      setSelectedProposal(proposalToEdit);
      setCost(proposalToEdit.proposedBudget.toString() || "");
      setTimeline(proposalToEdit.proposedTimeline || "");
      setApproach(proposalToEdit?.proposalDescription || "");
      setMilestones(
        proposalToEdit.milestones && proposalToEdit.milestones.length > 0
          ? proposalToEdit.milestones.map((m) => m.title)
          : [""],
      );
      setCoverLetter(proposalToEdit.coverLetter || "");
      setShowEditDialog(true);
      setSuccess(false);
      setErrors({
        cost: false,
        timeline: false,
        approach: false,
        form: false,
      });
    } else {
      console.error("Proposal not found");
    }
  };
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-[20px] font-semibold text-orangeButton my-custom-class">
          My Proposals
        </h1>
        <p className="text-[13px] text-gray-500 my-custom-class">
          Track all proposals you've submitted to clients
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Submissions */}
        <div className="relative rounded-2xl bg-white pr-14 p-4 shadow-md border border-gray-100">
          <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#eef7fe]">
            <FileText className="h-4 w-4 text-orangeButton" />
          </div>

          <p className="text-[12px] font-semibold h-8 leading-[1.3] my-custom-class">
            Total Submissions
          </p>

          <h3 className="mt-2 text-[22px] h-6 font-semibold my-custom-class">
            {stats.submissions}
          </h3>

          <p className="mt-1 text-[10px] my-custom-class">
            +{stats.lastWeekSubmissions} from last week
          </p>
        </div>

        {/* Client Responses */}
        <div className="relative rounded-2xl bg-white pr-12 p-5 shadow-md border border-gray-100">
          <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#eef7fe]">
            <MessageSquare className="h-4 w-4 text-orangeButton" />
          </div>

          <p className="text-[12px] font-semibold h-8 leading-[1.3] my-custom-class">
            Client Responses
          </p>

          <h3 className="mt-2 text-[22px] h-6 font-semibold my-custom-class">
            {stats.clientResponse}
          </h3>

          <p className="mt-1 text-[10px] my-custom-class">
            {stats.clientResponsePercentage}% response rate
          </p>
        </div>

        {/* Conversations */}
        <div className="relative rounded-2xl bg-white pr-12 p-5 shadow-md border border-gray-100">
          <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#eef7fe]">
            <Users className="h-4 w-4 text-orangeButton" />
          </div>

          <p className="text-[12px] font-semibold h-8 leading-[1.3] my-custom-class">
            Conversations
          </p>

          <h3 className="mt-2 text-[22px] h-6 font-semibold my-custom-class">
            {stats.activeConversations}
          </h3>

          <p className="mt-1 text-[10px] my-custom-class">
            {stats.activeConversationsPercentage}% conversion rate
          </p>
        </div>

        {/* Accepted */}
        <div className="relative rounded-2xl bg-white pr-10 p-5 shadow-md border border-gray-100">
          <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#eef7fe]">
            <Award className="h-4 w-4 text-orangeButton" />
          </div>

          <p className="text-[12px] font-semibold h-8 leading-[1.3] my-custom-class">
            Accepted
          </p>

          <h3 className="mt-2 text-[22px] h-6 font-semibold my-custom-class">
            {stats.accepted}
          </h3>

          <p className="mt-1 text-[10px] my-custom-class">
            {stats.acceptedPercentage}% acceptance rate
          </p>
        </div>

        {/* Total Value */}
        <div className="relative rounded-2xl bg-white p-5 shadow-md border border-gray-100">
          <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#eef7fe]">
            <DollarSign className="h-4 w-4 text-orangeButton" />
          </div>

          <p className="text-[12px] font-semibold h-8 leading-[1.3] my-custom-class">
            Total Value
          </p>

          <h3 className="mt-2 text-[22px] h-6 font-semibold my-custom-class">
            $
            {stats.totalValue > 1000
              ? `${(stats.totalValue / 1000).toFixed(0)}K`
              : stats.totalValue}
          </h3>

          <p className="mt-1 text-[10px] my-custom-class">
            Proposed project value
          </p>
        </div>
      </div>

      {/* FUNNEL */}
      <Card className="rounded-2xl border border-gray-200 bg-white">
        <CardHeader className="pb-6">
          <CardTitle className="text-[15px] h-4 font-semibold">
            Proposal to Conversation Funnel
          </CardTitle>
          <CardDescription className="text-[13px] h-1 text-gray-500">
            Track how your proposals convert into client conversations
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {[
            ["Proposals Submitted", stats.submissions, 100, "bg-blue-500"],
            [
              "Client Viewed",
              stats.clientViewed,
              stats.clientViewedPercentage,
              "bg-indigo-500",
            ],
            [
              "Client Responded",
              stats.clientResponse,
              stats.clientResponsePercentage,
              "bg-purple-500",
            ],
            [
              "Active Conversations",
              stats.activeConversations,
              stats.activeConversationsPercentage,
              "bg-violet-500",
            ],
            [
              "Shortlisted",
              stats.shortlisted,
              stats.shortlistedPercentage,
              "bg-pink-500",
            ],
            [
              "Accepted",
              stats.accepted,
              stats.acceptedPercentage,
              "bg-green-500",
            ],
          ].map(([label, count, pct, color], i) => (
            <div key={i} className="space-y-2">
              {/* Label + Value Row */}
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold my-custom-class h-1 text-gray-900">
                  {label}
                </span>
                <span className="text-[12px] text-gray-500">
                  {count} ({pct}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-[8px] w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PROPOSALS LIST */}
      <Card className="rounded-2xl pt-2border bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-[15px] h-3 font-semibold">
            All Proposals
          </CardTitle>
          <CardDescription className="text-[13px] h-2 text-gray-500">
            View and manage your submitted proposals
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {proposals.length === 0 ? (
            <p className="text-center text-gray-500 text-[14px] py-6">
              No Proposals yet
            </p>
          ) : (
            proposals.map((proposal) => (
              <Card
                key={proposal.id}
                className="rounded-2xl border p-1 border-gray-200 bg-white shadow-sm"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    {/* LEFT */}
                    <div>
                      <h3 className="text-[20px] font-semibold text-[#2C34A1]">
                        {proposal.requirement?.title ?? "Untitled Requirement"}
                      </h3>

                      <p className="text-[11px] text-gray-500">
                        {proposal.client?.name ?? "Unknown Client"}
                        {proposal.client?.companyName
                          ? ` • ${proposal.client.companyName}`
                          : ""}
                      </p>

                      <div className="flex flex-wrap items-center gap-8 mt-2">
                        {/* Budget */}
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-full bg-[#F4561C] flex items-center justify-center shrink-0">
                            <DollarSign className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-[13px] font-semibold text-black">
                            {proposal.proposedBudget
                              ? `$${proposal.proposedBudget.toLocaleString()}`
                              : "N/A"}
                          </span>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-full bg-[#F4561C] flex items-center justify-center shrink-0">
                            <Calendar className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-[13px] font-semibold text-black">
                            {proposal.proposedTimeline ?? "N/A"}
                          </span>
                        </div>

                        {/* Submitted Date */}
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-full bg-[#F4561C] flex items-center justify-center shrink-0">
                            <FileText className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-[13px] font-semibold text-black">
                            Submitted{" "}
                            {proposal.createdAt
                              ? new Date(
                                  proposal.createdAt,
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-2 text-[11px]">
                        {proposal.clientViewed && (
                          <span className="text-blue-600 flex items-center gap-1">
                            <Eye className="h-4 w-4" /> Viewed
                          </span>
                        )}

                        {proposal.clientResponded && (
                          <span className="text-green-600 flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" /> Responded
                          </span>
                        )}

                        {proposal.conversationStarted && (
                          <span className="text-violet-600 flex items-center gap-1">
                            <Users className="h-4 w-4" /> Active conversation
                          </span>
                        )}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-row md:flex-col gap-2 items-start md:items-end">
                      {proposal.requirement?.category && (
                        <Badge className="text-[11px] px-3 py-2 rounded-full bg-[#e0e0e0] text-black">
                          {proposal.requirement.category}
                        </Badge>
                      )}

                      <Badge
                        className={`text-[11px] px-4 py-2 rounded-full font-medium capitalize ${getStatusBadgeClass(
                          proposal.status,
                        )}`}
                      >
                        {proposal.status ?? "pending"}
                      </Badge>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-3 mt-3">
                    {/* View Details – ALWAYS */}
                    <Button
                      className="h-10 px-6 rounded-full bg-[#2C34A1] text-white hover:bg-[#232A8F]"
                      onClick={() =>
                        router.push(
                          `/agency/dashboard/proposals/${proposal.id}`,
                        )
                      }
                    >
                      View Details →
                    </Button>

                    {/* Conditional Second Button */}
                    {proposal.hasConversation ? (
                      <Button className="h-10 px-6 rounded-full bg-black text-white hover:bg-black/90">
                        View Conversation →
                      </Button>
                    ) : proposal.status === "pending" ? (
                      <Button
                        className="h-10 px-6 rounded-full bg-black text-white hover:bg-black/90"
                        onClick={() => handleEditProposal(proposal.id)}
                      >
                        Edit Proposal →
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {showEditDialog && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className=" md:max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#F4561C]">
                Edit Proposal
              </DialogTitle>
            </DialogHeader>

            {/* COST + TIMELINE */}
            <div className="grid grid-cols-1 h-18 md:grid-cols-2 gap-10">
              {/* Proposed Cost */}
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-[#98A0B4]">
                  Proposed cost ($)
                </label>

                <Input
                  value={cost}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/^\d*$/.test(value)) return;
                    setCost(value);
                    if (errors.cost || errors.form) {
                      setErrors({ ...errors, cost: false, form: false });
                    }
                  }}
                  placeholder="Enter Proposed Cost"
                  className={`h-10 rounded-xl placeholder:text-[12px] placeholder:text-[#98A0B4]
                  ${errors.cost ? "border-red-500" : "border-gray-200"}
                  `}
                />
              </div>

              {/* Estimated Timeline */}
              <div className="space-y-2">
                <label className="text-[15px] font-bold text-[#98A0B4]">
                  Estimated Timeline
                </label>

                <Input
                  value={timeline}
                  onChange={(e) => {
                    setTimeline(e.target.value);
                    if (errors.timeline || errors.form) {
                      setErrors({ ...errors, timeline: false, form: false });
                    }
                  }}
                  placeholder="Enter Estimated Timeline"
                  className={`
                  h-10 rounded-xl text-[16px] placeholder:text-[12px] placeholder:text-[#98A0B4]
                  ${errors.timeline ? "border-red-500" : "border-gray-200"}
                `}
                />
              </div>
            </div>

            {/* WORK APPROACH */}
            <div className="space-y-3 h-20">
              <label className="text-[14px] font-bold text-[#98A0B4]">
                Work Approach
              </label>

              <Textarea
                value={approach}
                onChange={(e) => {
                  setApproach(e.target.value);
                  if (errors.approach || errors.form) {
                    setErrors({ ...errors, approach: false, form: false });
                  }
                }}
                rows={6}
                placeholder="Describe your methodology, Technologies you will use, and how you will approach this project...."
                className={`rounded-xl text-[16px] leading-[1.6] placeholder:text-[12px] placeholder:text-[#98A0B4]
                  ${errors.approach ? "border-red-500" : "border-gray-200"}
              `}
              />
            </div>

            <div className="space-y-3 mt-5 h-22">
              <label className="text-[14px] font-bold text-[#98A0B4]">
                Cover Letter
              </label>

              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
                placeholder="Describe your methodology, Technologies you will use, and how you will approach this project...."
                className="rounded-xl border-gray-200 text-[16px] leading-[1.6] placeholder:text-[12px] placeholder:text-[#98A0B4]"
              />
            </div>

            {/* MILESTONES */}
            <div className="space-y-4 mt-5">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-bold text-[#98A0B4]">
                  Project milestones
                </label>

                <Button
                  type="button"
                  className="h-8 rounded-lg bg-black px-4 text-[14px] font-medium text-white flex items-center gap-2 hover:bg-black/80"
                  onClick={() => setMilestones([...milestones, ""])}
                >
                  + Add Milestone
                </Button>
              </div>

              {milestones.map((milestone, index) => (
                <div key={index} className="relative">
                  <Input
                    value={milestone}
                    onChange={(e) => {
                      const updated = [...milestones];
                      updated[index] = e.target.value;
                      setMilestones(updated);
                    }}
                    placeholder={`Milestone -${index + 1}`}
                    className="h-10 border border-gray-200 rounded-xl text-[16px] placeholder:text-[#98A0B4]"
                  />

                  {/* Remove button */}
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setMilestones(milestones.filter((_, i) => i !== index))
                      }
                      className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-red-500
                    text-sm font-medium
                  "
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* PROPOSAL TIPS */}

            <div>
              <Button
                className="h-12 rounded-full hover:bg-orange-400 bg-orangeButton px-8 text-white flex items-center justify-center gap-2"
                disabled={isSubmitting}
                onClick={handleUpdateProposal}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Proposal"
                )}
              </Button>

              {errors.form && (
                <p className="text-[14px] font-medium text-red-500">
                  Please enter the required fields
                </p>
              )}
              {formResponse && (
                <p className="text-[14px] font-medium text-red-500">
                  {formResponse}
                </p>
              )}

              {success && (
                <p className="text-green-600 font-medium">
                  Proposal updated successfully
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProposalsPage;
