"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Calendar,
  MessageSquare,
  Eye,
  Edit,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/lib/toast";
import { authFetch } from "@/lib/auth-fetch";

const ProjectsPage = () => {
  const [projectTab, setProjectTab] = useState<
    "active" | "completed" | "invitations"
  >("active");

  const [dynamicActiveProjects, setDynamicActiveProjects] = useState<any[]>([]);
  const [dynamicCompletedProjects, setDynamicCompletedProjects] = useState<
    any[]
  >([]);
  const { user, loading } = useAuth();
  const router = useRouter();

  const [resLoading, setResLoading] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [milestonesDraft, setMilestonesDraft] = useState<any[]>([]);
  const [updating, setUpdating] = useState(false);

  const updateProgress = async () => {
    if (!selectedProject) return;

    try {
      setUpdating(true);

      console.log("----milestonesDraft---", milestonesDraft);

      const completedPercentage = calculateProgress(milestonesDraft || []);
      // Build payload dynamically
      const payload: any = {
        milestones: milestonesDraft,
      };

      // Only send status if project is 100% completed
      if (completedPercentage === 100) {
        payload.status = "completed";
      }

      console.log("----completedPercentage---", completedPercentage);

      const res = await authFetch(`/api/proposals/${selectedProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update progress");

      await loadData(); // refresh projects
      setIsProgressModalOpen(false);
      setSelectedProject(null);
      if (completedPercentage === 100) {
        toast.success("Project Completed successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const calculateProgress = (milestones = []) => {
    if (!milestones.length) return 0;

    const completedCount = milestones.filter(
      (milestone) => milestone.completed === true,
    ).length;

    return Math.round((completedCount / milestones.length) * 100);
  };

  const loadData = async () => {
    // Fetch data or perform any necessary actions on component mount
    setResLoading(true);
    setFailed(false);
    try {
      const response = await authFetch("/api/proposals");
      if (!response.ok) {
        setFailed(true);
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const filteredProjects = data.proposals.filter(
        (req: any) => req.status.toLowerCase() === "accepted",
      );
      console.log("Filtered Projects:", filteredProjects);

      setDynamicActiveProjects(filteredProjects);

      const filyteredCompletedProjects = data.proposals.filter(
        (req: any) => req.status.toLowerCase() === "completed",
      );

      setDynamicCompletedProjects(filyteredCompletedProjects);

      console.log("Filtered Completed Projects:", filyteredCompletedProjects);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setResLoading(false);
    }
  };
  useEffect(() => {
    if (!loading && (!user || user.role !== "agency")) {
      router.push("/login");
    }
    if (user && user.role === "agency") {
      loadData();
    }
  }, [user, loading, router]);


  const handleMessageClient=(recievedProject)=>{
    router.push(`/agency/dashboard/messages?clientId=${recievedProject?.clientId}&agencyId=${recievedProject?.agencyId}`)
  }
  /* =================  ACTIVE PROJECTS ================= */
  const projects = [
    {
      id: "1",
      title: "E-commerce Website Development",
      client: "Sarah Johnson",
      company: "Fashion Forward LLC",
      budget: 8500,
      dueDate: "2024-03-25",
      progress: 65,
      status: "Active",
      milestones: [
        { name: "Requirements Analysis", completed: true },
        { name: "UI/UX Design", completed: true },
        { name: "Frontend Development", completed: true },
        { name: "Backend Integration", completed: false },
        { name: "Testing & Launch", completed: false },
      ],
    },
    {
      id: "2",
      title: "Digital Marketing Campaign",
      client: "Jennifer Davis",
      company: "CloudSync Solutions",
      budget: 2500,
      dueDate: "2024-03-15",
      progress: 40,
      status: "Active",
      milestones: [
        { name: "Strategy Development", completed: true },
        { name: "Content Creation", completed: false },
        { name: "Campaign Launch", completed: false },
        { name: "Performance Analysis", completed: false },
      ],
    },
    {
      id: "3",
      title: "Mobile App UI/UX Design",
      client: "Mike Chen",
      company: "FitLife Technologies",
      budget: 3500,
      dueDate: "2024-03-01",
      progress: 80,
      status: "Active",
      milestones: [
        { name: "User Research", completed: true },
        { name: "Wireframes", completed: true },
        { name: "UI Design", completed: true },
        { name: "Prototyping", completed: false },
        { name: "Final Delivery", completed: false },
      ],
    },
  ];

  /* ================= COMPLETED PROJECTS ================= */
  const completedProjects = [
    {
      id: "c1",
      title: "E-commerce Website Development",
      client: "Sarah Johnson",
      company: "Fashion Forward LLC",
      budget: 8500,
      completedDate: "2024-03-15",
      milestones: [
        "Requirements Analysis",
        "UI/UX Design",
        "Frontend Development",
        "Backend Integration",
        "Testing & Launch",
      ],
    },
  ];

  /* ================= PROJECT INVITATIONS ================= */
  const invitations = [
    {
      id: "i1",
      title: "Enterprise CRM System Development",
      client: "Robert Martinez",
      company: "TechCorp Industries",
      budgetMin: 50000,
      budgetMax: 75000,
      respondBy: "2024-02-20",
      invitedOn: "2024-02-10",
      category: "Web Development",
      description:
        "We're looking for an experienced agency to develop a custom CRM system with advanced analytics and reporting capabilities.",
      skills: [
        "React/Node.js",
        "Database Design",
        "API Integration",
        "Cloud Deployment",
      ],
      reason:
        "Your portfolio in enterprise solutions and 4.9 rating impressed us",
    },
  ];

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
        <h1 className="text-[26px] font-bold text-orangeButton h-8 my-custom-class">
          My Projects
        </h1>
        <p className="text-gray-500 text-[18px] my-custom-class">
          Manage your active projects and direct invitations
        </p>
      </div>

      {/* TABS */}
      <div className="inline-flex bg-[#e6edf5] rounded-full p-1 gap-1">
        {["active", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setProjectTab(tab as any)}
            className={`px-4 py-2 text-sm rounded-full transition ${
              projectTab === tab
                ? "bg-orangeButton text-white my-custom-class"
                : "text-gray-700 my-custom-class"
            }`}
          >
            {tab === "active"
              ? "Active Projects"
              : tab === "completed"
                ? "Completed Projects"
                : "Project invitations"}
          </button>
        ))}
      </div>

      {/* ACTIVE PROJECTS */}
      {projectTab === "active" && (
        <div>
          {dynamicActiveProjects.length !== 0 ? (
            <div className="space-y-5">
              {dynamicActiveProjects.map((project) => (
                <Card
                  key={project.id}
                  className="rounded-[28px] border border-gray-200 bg-white"
                >
                  <CardContent className="p-6 space-y-4">
                    {/* TOP */}
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                      <div>
                        <h3 className="text-[20px] font-extrabold text-blueButton">
                          {project.requirement.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {project.client.name} • {project.client.companyName}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 mt-4">
                          {/* Budget */}
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded-full bg-orangeButton flex items-center justify-center">
                              <DollarSign className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-[13px] font-semibold text-black">
                              ${project.proposedBudget.toLocaleString()}
                            </span>
                          </div>

                          {/* Due Date */}
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded-full bg-orangeButton flex items-center justify-center">
                              <Calendar className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-[13px] font-semibold text-black">
                              {/* Due {new Date(project).toLocaleDateString("en-GB")} */}
                              {project.proposedTimeline}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Badge className="bg-green-500 text-white px-4 py-1 rounded-full h-fit">
                        {project.status === "accepted" ? "Active" : "Pending"}
                      </Badge>
                    </div>

                    {/* PROGRESS */}
                    <div>
                      <div className="flex justify-between h-5 text-sm mb-1">
                        <span></span>
                        <span>
                          {calculateProgress(project.milestones) || 0}% Complete
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${calculateProgress(project.milestones) || 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* MILESTONES */}
                    <div>
                      <h4 className="font-bold mb-2">Milestones</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.milestones.map((m, i) => (
                          <span
                            key={i}
                            className={`px-4 py-1 rounded-full text-sm border ${
                              m?.completed
                                ? "bg-gray-100 text-gray-400"
                                : "bg-white text-gray-900"
                            }`}
                          >
                            {m.title}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-3">
                      <Button className="rounded-full bg-[#2C34A1]" onClick={()=>handleMessageClient(project)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message Client
                      </Button>

                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() =>
                          router.push(
                            `/agency/dashboard/proposals/${project.id}`,
                          )
                        }
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View details
                      </Button>

                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          setSelectedProject(project);
                          setMilestonesDraft(
                            project.milestones.map((m: any) => ({
                              ...m,
                              completed: m.completed ?? false, // backward-safe
                            })),
                          );
                          setIsProgressModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Update progress
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {isProgressModalOpen && selectedProject && (
                <Dialog
                  open={isProgressModalOpen}
                  onOpenChange={setIsProgressModalOpen}
                >
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Update Project Progress</DialogTitle>
                    </DialogHeader>

                    {/* Milestones */}
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {milestonesDraft.map((m, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 border rounded-xl p-3"
                        >
                          <Checkbox
                            checked={m.completed}
                            onCheckedChange={(checked) => {
                              const updated = [...milestonesDraft];

                              // If user is trying to CHECK the milestone
                              if (checked) {
                                // If not first milestone
                                if (index > 0 && !updated[index - 1].completed) {
                                  alert("Please complete the previous milestone first.");
                                  return; // ❌ Prevent checking
                                }
                              }

                              // Allow unchecking anytime (optional behavior)
                              updated[index].completed = Boolean(checked);
                              setMilestonesDraft(updated);
                            }}
                            className="border-1 border-[#000] cursor-pointer"
                          />

                          <span
                            className={`text-sm  ${
                              m.completed ? "line-through text-gray-400" : ""
                            }`}
                          >
                            {m.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsProgressModalOpen(false)}
                      >
                        Cancel
                      </Button>

                      <Button
                        className="bg-[#2C34A1]"
                        disabled={updating}
                        onClick={updateProgress}
                      >
                        {updating ? "Updating..." : "Update Progress"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ) : (
            <div>
              <p className="text-gray-500 text-center text-[30px] my-15">
                No Active Projects
              </p>
            </div>
          )}{" "}
        </div>
      )}

      {/* ================= COMPLETED PROJECTS ================= */}
      {projectTab === "completed" && (
        <div>
          {dynamicCompletedProjects.length !== 0 ? (
            <div className="space-y-5">
              {dynamicCompletedProjects.map((project) => (
                <Card
                  key={project.id}
                  className="rounded-[28px] border border-gray-200 bg-white"
                >
                  <CardContent className="p-6 space-y-4">
                    {/* TOP */}
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                      <div>
                        <h3 className="text-[20px] font-extrabold text-blueButton">
                          {project.requirement.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {project.client.name} • {project.client.companyName}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 mt-4">
                          {/* Budget */}
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded-full bg-orangeButton flex items-center justify-center">
                              <DollarSign className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-[13px] font-semibold text-black">
                              ${project.proposedBudget.toLocaleString()}
                            </span>
                          </div>

                          {/* Due Date */}
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded-full bg-orangeButton flex items-center justify-center">
                              <Calendar className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-[13px] font-semibold text-black">
                              {/* Due {new Date(project).toLocaleDateString("en-GB")} */}
                              {project.proposedTimeline}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Badge className="bg-green-500 text-white px-4 py-1 rounded-full h-fit">
                        {project.status}
                      </Badge>
                    </div>

                    {/* PROGRESS */}
                    <div>
                      <div className="flex justify-between h-5 text-sm mb-1">
                        <span></span>
                        <span>
                          {calculateProgress(project.milestones) || 0}% Complete
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${calculateProgress(project.milestones) || 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* MILESTONES */}
                    <div>
                      <h4 className="font-bold mb-2">Milestones</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.milestones.map((m, i) => (
                          <span
                            key={i}
                            className={`px-4 py-1 rounded-full text-sm border ${
                              m?.completed
                                ? "bg-gray-100 text-gray-400"
                                : "bg-white text-gray-900"
                            }`}
                          >
                            {m.title}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-3">
                      <Button className="rounded-full bg-[#2C34A1]" onClick={()=>handleMessageClient(project)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message Client
                      </Button>

                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() =>
                          router.push(
                            `/agency/dashboard/proposals/${project.id}`,
                          )
                        }
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View details
                      </Button>

                      {/* <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                    setSelectedProject(project)
                    setMilestonesDraft(
                      project.milestones.map((m: any) => ({
                        ...m,
                        completed: m.completed ?? false, // backward-safe
                      }))
                    )
                    setIsProgressModalOpen(true)
                  }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update progress
                  </Button> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-gray-500 text-center text-[30px] my-15">
                {" "}
                No Completed Projects{" "}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================= PROJECT INVITATIONS ================= */}
      {/* {projectTab === "invitations" && (
        <div className="space-y-6">
          <div className="bg-[#eaf6ff] rounded-3xl p-5">
            <h3 className="text-[20px] font-medium text-blueButton">
              Direct Project Invitations
            </h3>
            <p className="text-blueButton text-sm">
              You have received {invitations.length} direct invitations from clients who are interested in working with your agency. Review the project details and respond to invitations that match your expertise..
            </p>
          </div>

          {invitations.map((inv) => (
            <Card key={inv.id} className="rounded-[28px] border bg-white">
              <CardContent className="p-6 pt-0 space-y-5">
                <div className="flex gap-4">
                  <Badge className="bg-[#b3deff] text-blueButton rounded-full">
                    ✉ Direct Invitation
                  </Badge>
                  <Badge 
                  className="rounded-full text-black"
                  variant="outline">{inv.category}</Badge>
                </div>

                <h3 className="text-[22px] h-2 font-extrabold text-blueButton">
                  {inv.title}
                </h3>
                <p className="text-gray-500">
                  {inv.client} • {inv.company}
                </p>

                <div className="flex flex-wrap gap-6 h-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-orangeButton" />
                    ${inv.budgetMin.toLocaleString()} – $
                    {inv.budgetMax.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-orangeButton" />
                    Respond by{" "}
                    {new Date(inv.respondBy).toLocaleDateString("en-GB")}
                  </div>
                </div>

                <div className="h-10">
                  <h4 className="font-bold text-[22px]">Project Description</h4>
                  <p className="text-gray-600 text-[12px]">{inv.description}</p>
                </div>

                <div>
                  <h4 className="font-bold mb-2 text-[22px]">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {inv.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-4 py-1 rounded-full border text-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#eaf4ff] rounded-xl p-4">
                  <h4 className="font-bold text-blueButton">
                    Why you were invited
                  </h4>
                  <p className="text-blueButton">{inv.reason}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-full bg-[#2C34A1]">
                    <MessageSquare className="h-3 w-3" />
                    Submit Proposal
                  </Button>
                  <Button variant="outline" className="rounded-full">
                     <Eye className="h-4 w-4" />
                    View full details
                  </Button>
                  <Button className="rounded-full bg-red-500 text-white">
                    <X className="h-4 w-4" />
                    Decline
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default ProjectsPage;
