"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { PostRequirementForm } from "@/components/seeker/post-requirement-form";
import { RequirementList } from "@/components/seeker/requirement-list";
import { ProposalList } from "@/components/seeker/proposal-list";
import { RequirementDetailsModal } from "@/components/seeker/requirement-details-modal";
import { NegotiationChat } from "@/components/negotiation-chat";
import { FiltersPanel } from "@/components/filters-panel";
import { ProviderProfileModal } from "@/components/provider-profile-modal";
import { ProjectSubmissionForm } from "@/components/project-submission-form";
import { ReviewSubmissionForm } from "@/components/review-submission-form";
import { ProviderComparison } from "@/components/provider-comparison";
import { NotificationsWidget } from "@/components/seeker/notifications-widget";
import {
  Plus,
  FileText,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Eye,
  Home,
  User,
  Briefcase,
  BarChart3,
  Settings,
  CreditCard,
  Bell,
  Shield,
  GitCompare,
  ChevronDown,
  ChevronRight,
  Edit,
  Save,
  X,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  MoreHorizontal,
  Trash2,
  DollarSign,
  Target,
  Heart,
  SeparatorVertical as Separator,
} from "lucide-react";
import {
  mockRequirements,
  mockProposals,
  mockProviders,
} from "@/lib/mock-data";
import type {
  Requirement,
  Proposal,
  Provider,
  Notification,
} from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiCurrencyDollar } from "react-icons/hi2";
import { GoTag } from "react-icons/go";
import { CiCalendar } from "react-icons/ci";
import { FaArrowRightLong } from "react-icons/fa6";
import PdfUpload from "@/components/pdfUpload";
import { categories } from "@/lib/mock-data";
import { toast } from "@/lib/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authFetch } from "@/lib/auth-fetch";
import ServiceDropdown from "@/components/select-category-filter";

const ProjectsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  // const [projects, setProjects] = useState([
  //   {
  //     id: "1",
  //     title: "E-commerce Website Development",
  //     description: "Modern responsive e-commerce platform with payment integration",
  //     budget: "$15,000 - $25,000",
  //     status: "In Progress",
  //     createdAt: "2024-01-15",
  //     proposalsCount: 12,
  //     category: "Web Development",
  //   },
  //   {
  //     id: "2",
  //     title: "Mobile App UI/UX Design",
  //     description: "Complete mobile app design for iOS and Android platforms",
  //     budget: "$8,000 - $12,000",
  //     status: "Planning",
  //     createdAt: "2024-01-20",
  //     proposalsCount: 8,
  //     category: "Design",
  //   },
  //   {
  //     id: "3",
  //     title: "Digital Marketing Campaign",
  //     description: "Comprehensive digital marketing strategy and execution",
  //     budget: "$5,000 - $10,000",
  //     status: "Completed",
  //     createdAt: "2024-01-10",
  //     proposalsCount: 15,
  //     category: "Marketing",
  //   },
  // ])

  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    category: "",
    budgetMin: "",
    budgetMax: "",
    documentUrl: "",
    timeline: "",
  });

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
  title: "",
  content: "",
  rating: "",
  qualityRating: "",
  costRating: "",
  scheduleRating: "",
  willingToReferRating: "",
  projectStartDate: "",
  projectEndDate: "",
});

  const [reviewSubmissionProjectId, setReviewSubmissionProjectId] = useState<
    string | null
  >(null);

  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [filteredRequirements, setFilteredRequirements] = useState<
    Requirement[]
  >([]);
  const [responseLoading, setResponseLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  //for sending the form staus
  const [sending, setSending] = useState(false);


  

  const loadData = async (userId: string) => {
    setResponseLoading(true);
    try {
      const response = await authFetch(`/api/requirements/${userId}`, {credentials: "include" });
      const data = await response.json();
      setRequirements(data.requirements);
      setFilteredRequirements(data.requirements);

       

      setFailed(false);
    } catch (error) {
      setFailed(true);
      console.log("Failed to fetch the  data");
    } finally {
      setResponseLoading(false);
    }
  };
  useEffect(() => {
    if (!loading && (!user || user.role !== "client")) {
      router.push("/login");
    }
    if (!loading && user) {
      loadData(user.id);
    }
  }, [user, loading, router]);

  const handleCreateProject = () => {
    if (
      newProject.title &&
      newProject.description &&
      newProject.budget &&
      newProject.category
    ) {
      const project = {
        id: Date.now().toString(),
        ...newProject,
        status: "Planning",
        createdAt: new Date().toISOString().split("T")[0],
        proposalsCount: 0,
      };
      setProjects([...projects, project]);
      setNewProject({ title: "", description: "", budget: "", category: "" });
      setShowCreateProject(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.category ||
      !formData.description.trim() ||
      !formData.budgetMin ||
      !formData.budgetMax
    ) {
      toast.error("All Fields are required except document");
      return;
    }
    if (Number(formData.budgetMin) > Number(formData.budgetMax)) {
      toast.error("Minimum budget should be greater than the Maximum budget");
      return;
    }

    //Build correct payload for API
    const payload = {
      title: formData.title.trim(),
      image: formData.image,
      category: formData.category,
      description: formData.description.trim(),
      budgetMin: Number(formData.budgetMin),
      budgetMax: Number(formData.budgetMax),
      documentUrl: formData.documentUrl,
      timeline: formData.timeline.trim(),
    };
    try {
      setSending(true);
      // API CALL
      if (editingProject) {
        if(editingProject.status==="NotApproved"){
          payload.status = "UnderReview";
        }
        const res = await authFetch(`/api/requirements/${editingProject._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include" 
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error("Failed to update the project");
        }
        toast.success("Updated the project successfully");
        setEditingProject(null);
        setFormData({
          title: "",
          image: "",
          description: "",
          category: "",
          budgetMin: "",
          budgetMax: "",
          documentUrl: "",
          timeline: "",
        });
        setShowCreateProject(false);
        setRequirements((prev) => [
          ...prev.filter((item) => item._id !== data.requirement._id),
          data.requirement,
        ]);
      } else {
        const res = await authFetch("/api/requirements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include" 
        });

        const data = await res.json();
        console.log("Requirement created:::", data);
        if (!res.ok) {
          toast.error("Failed to post the requirement");
        }
        toast.success("Requirement Posted successfully");

        setRequirements((prev) => [data.requirement, ...prev]);

        setFormData({
          title: "",
          image: "",
          description: "",
          category: "",
          budgetMin: "",
          budgetMax: "",
          documentUrl: "",
          timeline: "",
        });
        setShowCreateProject(false);
      }
    } catch (error) {
      console.error("Error posting requirement:", error);
      toast.error("Failed to post the requirement");
    } finally {
      setSending(false);
    }

    // console.log("Requirement submitted:", formData)
  };
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectTemp = requirements.find(
      (req) => req._id === reviewSubmissionProjectId,
    );
    if (!projectTemp) {
      toast.error("Invalid Project for review submission");
    }
    if (
  !reviewForm.content.trim() ||
  Number(reviewForm.rating) <= 0 ||
  Number(reviewForm.costRating) <= 0 ||
  Number(reviewForm.qualityRating) <= 0 ||
  Number(reviewForm.scheduleRating) <= 0 ||
  Number(reviewForm.willingToReferRating) <= 0 ||
  !reviewForm.projectStartDate ||
  !reviewForm.projectEndDate
) {
  toast.error("All fields are required for review submission");
  return;
}

    //Build correct payload for API
    const payload = {
      content: reviewForm.content.trim(),
      rating: reviewForm.rating,
      costRating: reviewForm.costRating,
      qualityRating: reviewForm.qualityRating,
      scheduleRating: reviewForm.scheduleRating,
      willingToReferRating: reviewForm.willingToReferRating,
      projectStartDate: reviewForm.projectStartDate,
      projectEndDate: reviewForm.projectEndDate,
      providerId: projectTemp?.allocatedToId,
      projectId: projectTemp?._id,
    };
    try {
      // API CALL
      setSending(true);
      const res = await authFetch(`/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include" 
      });
      if (res.ok) {
        toast.success("Review submitted successfully");
        setShowReviewModal(false);
        setReviewForm({
          title: "",
          content: "",
          rating: "",
          qualityRating: "",
          costRating: "",
          scheduleRating: "",
          willingToReferRating: "",
          projectStartDate: "",
          projectEndDate: "",
        });

        window.location.reload();
      } else {
        toast.error("Failed to submit the review");
      }
    } catch (error) {
      console.log("Failed to submit the review");
      toast.error("Failed to submit the review");
    } finally {
      setSending(false);
    }

    console.log("Review submitted payload:", payload);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    if (project.status.toLowerCase() === "allocated") {
      toast.error("You cannot edit the project which is allocated to agency");
    } else {
      setFormData({
        title: project.title.trim(),
        image: project.image,
        category: project.category,
        description: project.description.trim(),
        budgetMin: Number(project.budgetMin),
        budgetMax: Number(project.budgetMax),
        documentUrl: project.documentUrl,
        timeline: project.timeline.trim(),
      });
      setShowCreateProject(true);
    }
  };
  console.log("Clicked Project for the edit:::", formData);
  const handleUpdateProject = () => {
    if (
      editingProject &&
      newProject.title &&
      newProject.description &&
      newProject.budget &&
      newProject.category
    ) {
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id ? { ...p, ...newProject } : p,
        ),
      );
      setEditingProject(null);
      setNewProject({ title: "", description: "", budget: "", category: "" });
      setShowCreateProject(false);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId));
  };
  const getBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "notapproved":
        return "bg-red-500 text-[#fff]"
      case "underreview":
        return "bg-blue-500 text-[#fff]"
      case "open":
        return "bg-[#CFEED2] text-[#39761E]";
      case "shortlisted":
        return "bg-[#D2E4FF] text-[#1E82C1]";
      case "allocated":
        return "bg-[#1C96F4] text-[#fff]";
      case "negotiation":
        return "bg-[#FCF6E3] text-[#AF905D]";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  console.log("Fetched Requirements:::", requirements);

  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredRequirements(requirements);
    } else {
      setFilteredRequirements(
        requirements.filter(
          (req) => req.status.toLowerCase() === filterStatus.toLowerCase(),
        ),
      );
    }
  }, [requirements, filterStatus]);

  if (loading || responseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (failed) {
    return (
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
    );
  }
  return (
    <div className="space-y-6 p-3 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center ">
        <div>
          <h1 className="text-3xl font-bold text-[#F4561C] my-custom-class leading-6">
            Projects
          </h1>
          <p className="text-lg text-[#656565] font-normal my-custom-class mt-0">
            Manage your projects and track progress
          </p>
        </div>
        <Button
          onClick={() => setShowCreateProject(true)}
          className="bg-[#000] text-xs mt-2 md:mt-0 rounded-full "
        >
          <Plus className="h-4 w-4" />
          Add New Project
        </Button>
      </div>

      <div className="grid gap-6 border-1 px-8 py-7 bg-[#FAFAFA] border-[#E6E2E2] bg-[#fff] rounded-3xl">
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
            
            rounded-full

            shadow-none
            focus:outline-none focus:ring-0 focus:ring-offset-0
            focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0
            focus:border-[#b2b2b2]
            placeholder:text-[#b2b2b2]
            px-6
            w-[180px]
            h-12
            text-sm
            md:text-base
          "
          >
            <SelectValue placeholder="Rating" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="underreview">UnderReview</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="negotation">Negotiation</SelectItem>
            <SelectItem value="allocated">Allocated</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
             <SelectItem value="notapproved">NotApproved</SelectItem>
          </SelectContent>
        </Select>
        {(filteredRequirements || []).length !== 0 &&
          filteredRequirements.map((project) => (
            <Card
              key={project._id}
              className="border-1 px-0 border-[#CFCACA] rounded-2xl"
            >
              <CardContent className="px-4 md:px-6 py-0">
                <div className="flex justify-between items-start mb-3">
                  <Badge className="bg-[#F54A0C] text-xs rounded-full">
                    {project.proposals} proposals recieved
                  </Badge>
                  <Badge
                    className={`text-xs rounded-full ${getBgColor(project.status)}`}
                    // variant={
                    //   project.status === "Completed"
                    //     ? "default"
                    //     : project.status === "In Progress"
                    //       ? "secondary"
                    //       : "outline"
                    // }
                  >
                    {project.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-[#2C34A1]">
                      {project.title}
                    </h3>
                    <p className="text-md text-[#898383] font-normal mb-3">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm flex-wrap text-muted-foreground">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <HiCurrencyDollar color="#F54A0C" className="h-8 w-8" />
                        <span className="text-[14px] font-bold text-[#000]">{`$ ${project.budgetMin} - $ ${project.budgetMax}`}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 ">
                        <div className="bg-[#F54A0C] rounded-[50%] flex justify-center items-center h-6 w-6">
                          <GoTag color="#fff" className="h-4 w-4" />
                        </div>
                        <span className="text-[14px] font-bold text-[#000]">
                          {project.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 ">
                        <div className="bg-[#F54A0C] rounded-[50%] flex justify-center items-center h-6 w-6">
                          <CiCalendar
                            color="#ffffff"
                            className="h-4 w-4 font-bold"
                          />
                        </div>
                        <span className="text-[14px] font-bold text-[#000]">
                          Created :{" "}
                          {
                            new Date(project.createdAt)
                              .toISOString()
                              .split("T")[0]
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditProject(project)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteProject(project.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu> */}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  {
                   project.status.toLowerCase() !== "closed" &&
                    project.status.toLowerCase() !== "completed" && 
                    project.status.toLowerCase()!="underreview" && (
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/client/dashboard/projects/${project._id}`)
                    }
                    className="bg-[#2C34A1] text-xs rounded-full text-[#fff]  hover:bg-[#2C34A1] h-[40px]"
                  >
                    View Proposals
                    <FaArrowRightLong className="h-1 w-1" color="#fff" />
                  </Button>
                    )
                  }
                  {project.status.toLowerCase() !== "allocated" &&
                    project.status.toLowerCase() !== "closed" &&
                    project.status.toLowerCase() !== "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProject(project)}
                        className="bg-[#000] text-sm rounded-full text-[#fff]  hover:bg-[#000] w-[100px] h-[40px]"
                      >
                        Edit
                      </Button>
                    )}
                  {(project.status.toLowerCase() === "closed" ||
                    project.status.toLowerCase() === "completed") &&
                    !project?.isReviewed && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReviewSubmissionProjectId(project._id);
                          setShowReviewModal(true);
                        }}
                        className="bg-[#00C951] text-sm rounded-full text-[#fff]  hover:bg-[#00C951] w-[140px]  h-[40px]"
                      >
                        Submit Review
                      </Button>
                    )}
                </div>
                
                {
              (project.status==="NotApproved") && (
                <p className="teext-md text-red-500 mt-5">{project?.notApprovedMsg}</p>
              )
              }
              </CardContent>
            </Card>
          ))}
      </div>

      {showCreateProject && (
        <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
          <DialogContent className=" md:max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#F4561C]">
                Create New Project
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-[#000]  text-[14px] font-bold"
                >
                  Project Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., E-commerce Website Development"
                  required
                />
              </div>

              {/* Select Category */}

              {/* <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-[#000]  text-[14px] font-bold"
                >
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger
                    className=" border-2 border-[#D0D5DD] rounded-[8px] data-[placeholder]:text-[#98A0B4] text-[#000]
                            "
                  >
                    <SelectValue
                      placeholder="Select a category"
                      style={{ color: "#98A0B4" }}
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

               <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-[#000]  text-[14px] font-bold"
                    ></Label>

                    <ServiceDropdown
                    value={formData.category}
                      onChange={(value)=> setFormData((prev) => ({ ...prev, category: value }))}
                      triggerClassName="border-2 border-[#D0D5DD] rounded-[8px] data-[placeholder]:text-[#98A0B4] text-[#000]"
                       triggerSpanClassName = "p-5"
                    />
               </div>

              

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-[#000]  text-[14px] font-bold"
                >
                  Project Description
                </Label>
                <Textarea
                  id="description"
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Provide detailed information about your project requirements, goals, and expectations..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="budgetMin"
                    className="text-[#000]  text-[14px] font-bold"
                  >
                    Budget Range (Min)
                  </Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    value={formData.budgetMin}
                    className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        budgetMin: e.target.value,
                      }))
                    }
                    placeholder="1000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="budgetMax"
                    className="text-[#000]  text-[14px] font-bold"
                  >
                    Budget Range (Max)
                  </Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    value={formData.budgetMax}
                    className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        budgetMax: e.target.value,
                      }))
                    }
                    placeholder="5000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="timeline"
                  className="text-[#000]  text-[14px] font-bold"
                >
                  Expected Timeline
                </Label>
                <Input
                  id="timeline"
                  value={formData.timeline}
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      timeline: e.target.value,
                    }))
                  }
                  placeholder="e.g., 3 months, 8 weeks"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#000]  text-[14px] font-bold">
                  Project Attachment (optional)
                </Label>
                <PdfUpload
                  maxSizeMB={10}
                  onUploadSuccess={(url) =>
                    setFormData((prev) => ({
                      ...prev,
                      documentUrl: url,
                    }))
                  }
                />
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
                  {editingProject ? "Update" : "Post  Project"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/*Reviews Modal */}
      {showReviewModal && (
        <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
          <DialogContent className="md:max-w-xl rounded-2xl h-[90vh] flex flex-col p-0">
            {/* ✅ FIXED HEADER */}
            <DialogHeader className="px-6 py-4 border-b shrink-0">
              <DialogTitle className="text-xl font-bold text-[#F4561C]">
                Submit Project Review
              </DialogTitle>
            </DialogHeader>

            {/* ✅ SCROLLABLE FORM FIELDS */}
            <form
              onSubmit={handleReviewSubmit}
              className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
            >
              {/* Title */}
              {/* <div className="space-y-2">
                <Label className="text-[#000] text-[14px] font-bold">
                  Title
                </Label>
                <Input
                  value={reviewForm.title}
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="e.g., E-commerce Website Development"
                  required
                />
              </div> */}

              {/* Summary */}
              <div className="space-y-2">
                <Label className="text-[#000] text-[14px] font-bold">
                  Review Summary
                </Label>
                <Textarea
                  value={reviewForm.content}
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Write your detailed review here..."
                  required
                />
              </div>

              {/* Ratings (unchanged UI) */}
              {[
                { label: "Rating 0/5", key: "rating" },
                { label: "Cost Rating 0/5", key: "costRating" },
                { label: "Quality Rating 0/5", key: "qualityRating" },
                {
                  label: "Willing To Refer Rating 0/5",
                  key: "willingToReferRating",
                },
                { label: "Schedule Rating 0/5", key: "scheduleRating" },
              ].map((item) => (
                <div className="space-y-2" key={item.key}>
                  <Label className="text-[#000] text-[14px] font-bold">
                    {item.label}
                  </Label>
                  <Input
                    type="number"
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={reviewForm[item.key] ?? ""}
                    className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-gray-400"
                     onChange={(e) => {
                          const value = e.target.value;

                          // Allow empty input
                          if (value === "") {
                            setReviewForm((prev) => ({
                              ...prev,
                              [item.key]: "",
                            }));
                            return;
                          }

                          let numberValue = parseFloat(value);

                          if (isNaN(numberValue)) return;
                          if (numberValue > 5) numberValue = 5;
                          if (numberValue < 0.1) numberValue = 0.1;

                          setReviewForm((prev) => ({
                            ...prev,
                            [item.key]: numberValue,
                          }));
                        }}
                      placeholder="Enter your rating"

                    required
                  />
                </div>
              ))}

              {/* ✅ Start Date – Calendar Popover */}
              <div className="space-y-2">
                <Label
                  htmlFor="startDate"
                  className="text-[#000] text-[14px] font-bold"
                >
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={reviewForm.projectStartDate}
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      projectStartDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              {/* ✅ End Date – Calendar Popover */}
              <div className="space-y-2">
                <Label
                  htmlFor="endDate"
                  className="text-[#000] text-[14px] font-bold"
                >
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={reviewForm.projectEndDate}
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      projectEndDate: e.target.value,
                    }))
                  }
                  min={reviewForm.projectStartDate} // prevents selecting earlier date
                  required
                />
              </div>
            </form>

            {/* ✅ FIXED FOOTER */}
            <div className="px-6 py-4 border-t flex gap-5 shrink-0">
              <Button
                type="submit"
                disabled={sending}
                onClick={handleReviewSubmit}
                className="bg-[#2C34A1] rounded-full"
              >
                {sending ? "Submitting..." : "Submit Review"}
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
export default ProjectsPage;
