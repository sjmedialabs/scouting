"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { mockRequirements } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Proposal, Requirement } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";
import { authFetch } from "@/lib/auth-fetch";
import { BsArrowLeft } from "react-icons/bs";


export default function SubmitProposalPage() {
  const { user, loading } = useAuth();
  
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);

  const [resLoading, setResLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [requirement, setRequirement] = useState<Requirement[]>([]);
  //if alreadybthe agency provided the proposal for this project dont show the form
  const [showForm, setShowForm] = useState(true);

  const loadData = async () => {
    setResLoading(true);
    setFailed(false);
    try {
      const res = await authFetch(`/api/requirements/${id}`);
      const proposalRes = await authFetch("/api/proposals");
      if (res.ok && proposalRes.ok) {
        const data = await res.json();
        const proposalData = await proposalRes.json();

        setFailed(false);
        setRequirement(data.requirements[0]);
        console.log("proposals data:::::", proposalData.proposals);
       const proposalsCount=(proposalData.proposals || []).filter((eachItem)=>id===eachItem.requirement.id && eachItem.agency.userId===user?.id)
       console.log("The propossaal count is::::",proposalsCount)
        setShowForm(proposalsCount.length === 0)

        // setProposals(proposalData.proposals.filter((eachItem)=>id===eachItem.requirement.id && eachItem.agencyId===user?.id))
      }
    } catch (error) {
      console.log("Failed to fetch project details::::", error);
      setFailed(true);
    } finally {
      setResLoading(false);
    }
  };

  // useEffect(()=>{
  //   loadData();
  // },[])

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [formResponse, setFormResponse] = useState("");
  // console.log("proposals are:::::::",proposals);

  const buildPayload = () => ({
    requirementId: requirement.id,
    proposedCost: Number(cost),
    estimatedTimeline: timeline,
    workApproach: approach,
    coverLetter: coverLetter,
    milestones: milestones.filter((m) => m.trim() !== ""),
  });

  console.log("Form status:::::", showForm);

  const handleSubmitProposal = async () => {
    if (!validateForm()) return;

    if(!((milestones ||  []).length>=2)){
      alert("Atleast two milestones will required for the proposal")
      return
    }

    setIsSubmitting(true);
    setSuccess(false);

    try {
      // const tempmilestons=milestones.map((eachItem)=>({title:eachItem}))

      const payload = {
        requirementId: requirement._id,
        clientId: requirement.clientId,
        proposedBudget: cost,
        proposedTimeline: timeline,
        proposalDescription: approach,
        coverLetter: coverLetter,
        milestones: milestones.map((eachItem) => ({ title: eachItem })),
      };

      console.log("Payload to send:::::::", payload);
      const res = await authFetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("Post form response:::", res);
      if (res.ok) {
        setSuccess(true);
        setErrors({
          cost: false,
          timeline: false,
          approach: false,
          form: false,
        });
         // window.location.reload()
      setTimeout(() => {
        router.push("/agency/dashboard/project-inquiries");
        // router.refresh()
      }, 2000);
      } else if (res.status === 409) {
        setFormResponse("You already submitted the proposal for this project");
      } else {
        setFormResponse("failed to submit the proposal please try again");
      }

     
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

  // const requirement = mockRequirements.find((r) => r.id === id)

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

  useEffect(() => {
    if (loading) return; // ⛔ wait until auth finishes

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "agency") {
      router.replace("/login");
    }
    if (user && !loading && user.role === "agency") {
      loadData();
    }
  }, [user, loading, router]);

  console.log("fetched User Details are:::", user);

  if (failed) {
    return <div className="p-6">Project not found</div>;
  }

  if (resLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* PROJECT SUMMARY */}
      <Card className="rounded-[36px] border border-gray-300 bg-white">
        <CardContent className="px-12 py-0 space-y-6">
          {/* Heading */}
          <div className="space-y-3 flex justify-between">
            <div>
              <p className="text-[20px] font-extrabold text-black ">
                 Submitting Proposal For
              </p>

                <h1 className="text-[28px] font-extrabold text-orange-600 ">
                  {requirement.title}
                </h1>
            </div>
            <div>
               <Button className="bg-[#000] rounded-full hover:bg-[#000] text-[#fff] w-[100px]" onClick={()=>router.push("/agency/dashboard/project-inquiries/")}>
                  <BsArrowLeft color="#fff"  height={4} width={4}/>
                   Back
               </Button>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center  h-3 gap-8 text-[16px]">
            {/* Category */}
            <span className="rounded-md leading-none bg-gray-100 px-3 py-1 text-[14px] font-medium text-gray-500">
              {requirement.category}
            </span>

            {/* Budget */}
            <span className="text-gray-900">
              <span className="font-semibold">Budget:</span>{" "}
              <span className="text-gray-500">
                ${requirement.budgetMin} – ${requirement.budgetMax}
              </span>
            </span>

            {/* Timeline */}
            <span className="text-gray-900">
              <span className="font-semibold">Timeline:</span>{" "}
              <span className="text-gray-500">{requirement.timeline}</span>
            </span>
          </div>

          {/* Description */}
          <p className="max-w-full text-[14px] leading-5 text-gray-500">
            {requirement.description}
          </p>
        </CardContent>
      </Card>

      {/* PROPOSAL FORM */}
      {showForm ? (
        <Card className="rounded-[36px] border border-gray-300 bg-white">
          <CardContent className="px-12 py-10 space-y-10">
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

                <p className="text-[12px] text-gray-300">
                  Client budget: ${requirement.budgetMin} – $
                  {requirement.budgetMax}
                </p>
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

                <p className="text-[12px] text-gray-300">
                  Client expectation: {requirement.timeline}
                </p>
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

            <div className="space-y-3 h-22">
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
            <div className="space-y-4">
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
            <div className="space-y-3 pt-1">
              <p className="text-[14px] font-bold text-[#98A0B4]">
                Proposal Tips
              </p>

              <ul className="list-disc pl-5 space-y-2 text-[14px] leading-[1.6] text-gray-500">
                <li>Be specific about your approach and methodology</li>
                <li>Highlight relevant experience and past projects</li>
                <li>Break down your timeline into clear milestones</li>
                <li>Explain why your pricing provides good value</li>
              </ul>
            </div>

            <div>
              <Button
                className="h-12 rounded-full hover:bg-orange-400 bg-orangeButton px-8 text-white flex items-center justify-center gap-2"
                disabled={isSubmitting}
                onClick={handleSubmitProposal}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Proposal"
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
                  Proposal submitted successfully
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          <p className="text-center mt-5 text-2xl">
            You submitted the proposal already for this requirement
          </p>
        </div>
      )}
    </div>
  );
}
