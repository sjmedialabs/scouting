"use client";

import type React from "react";
import { authFetch } from "@/lib/auth-fetch";
import { useState, useEffect } from "react";
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
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "@/lib/toast";
import { MdVerified } from "react-icons/md";
import { LuCircleX } from "react-icons/lu";
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
import { ImageUpload } from "@/components/ui/image-upload";
const ClientProfilePage = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [responseLoading, setResponseLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { user, loading } = useCurrentUser();
  const [profileData, setProfileData] = useState({});
  console.log("userDeatails:::", user);
  const requiredFields = [
    "name",
    "email",
    "phoneNumber",
    "companyName",
    "position",
    "industry",
    "bio",
  ];
  const loadData = async (userId: String) => {
    setResponseLoading(true);
    setFailed(false);
    try {
      const response = await authFetch(`/api/seeker/${userId}`);
      if (!response.ok) {
        throw new Error("Failed response");
      }
      const data = await response.json();
      console.log("getting data:::", data);
      setProfileData(data.data);
      setFailed(false);
    } catch (error) {
      console.log("Failed to get the details", error);
      setFailed(true);
    } finally {
      setResponseLoading(false);
    }
  };
  useEffect(() => {
    if (!loading && user) {
      // setUserDetails(user);
      loadData(user.userId);
    }
  }, [user, loading]);
  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^[6-9]\d{9}$/.test(phone); // Indian phone numbers
  };

  const handleSaveProfile = async () => {
    // In a real app, this would make an API call to update the profile
    try {
      for (const field of requiredFields) {
        if (!profileData[field]?.trim()) {
          toast.error(`${field.replace(/([A-Z])/g, " $1")} is required`);
          return;
        }
      }

      // 🔹 Email validation
      if (!isValidEmail(profileData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      // 🔹 Phone validation
      if (!isValidPhone(profileData.phoneNumber)) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }

      const response = await authFetch(`/api/seeker/${user.userId}`, {
        method: "PUT",
        body: JSON.stringify(profileData),
        credentials: "include",
      });

      if (response.ok) {
        toast.success("User details updated successfully");
        setIsEditingProfile(false);
      }
    } catch (error) {
      console.log("failed to save::", error);
      toast.error("failed to update try again");
    }
    // Show success message or toast
  };

  const handleCancelEdit = () => {
    // Reset to original data if needed
    setIsEditingProfile(false);
  };

  if (loading || responseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  // if(failed){
  //     return(
  //       <div className="flex flex-col justify-center items-center text-center">
  //         <h1 className="text-center font-semibold">Failed  to Retrive the data</h1>
  //         <Button onClick={loadData} className="h-[40px] mt-2 w-[90px] bg-[#2C34A1] text-[#fff]">Reload</Button>
  //       </div>
  //     )
  // }

  return (
    <div className="space-y-8 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#707070] pb-[30px] gap-4">
        {/* Left section */}
        <div className="w-full">
          <h1 className="text-3xl font-bold my-custom-class text-[#F54A0C] tracking-tight">
            Profile
          </h1>
          <p className="text-[#656565] text-xl my-custom-class font-normal">
            Manage your client profile information
          </p>
        </div>

        {/* Right section */}
        <div className="flex gap-2 w-full md:w-auto justify-start md:justify-end">
          {isEditingProfile ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="h-[40px] w-[100px] rounded-3xl bg-[#E8E8E8]"
              >
                <LuCircleX className="h-4 w-4 mr-1" />
                Cancel
              </Button>

              <Button
                onClick={handleSaveProfile}
                className="h-[40px] w-[140px] rounded-3xl bg-[#000]"
              >
                <Save className="h-4 w-4 mr-1" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditingProfile(true)}
              className="h-[40px] w-[140px] rounded-3xl bg-[#000]"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <Card className="lg:col-span-1 bg-[#fff] rounded-[24px] ">
          <CardHeader>
            <CardTitle className="mt-2 text-center text-[#F54A0C] -mb-5 font-bold text-[18px] my-custom-class">
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-0">
            <div className="flex flex-col items-center text-center">
              {isEditingProfile ? (
                <div className="space-y-2 m-5 items-center">
                  <ImageUpload
                    label="Profile Image"
                    value={profileData.image}
                    onChange={(value) =>
                      setProfileData({ ...profileData, image: value })
                    }
                    description="Upload your Profile image (PNG, JPG) or provide a URL"
                    previewClassName="w-24 h-24"
                  />
                </div>
              ) : (
                <div className="h-[110px] w-[110px] rounded-full overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center bg-gray-100">
                  <img
                    src={profileData.image || "/defaultProfile.png"}
                    alt={profileData.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-2xl font-bold my-custom-class text-[#F54A0C]">
                {profileData.name}
              </h3>
              <p className="text-[14px]   text-[#656565] my-custom-class font-normal">
                {profileData.position}
              </p>
              <p className="text-[14px]   text-[#656565] my-custom-class font-normal">
                {profileData.companyName}
              </p>
              <div className="flex gap-2 mt-3 my-custom-class">
                <Badge className="bg-[#39A935] text-[#fff] h-[30px] w-[90px] font-light rounded-3xl">
                  Active User
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-[#2C34A1] h-[30px] w-[90px] font-light rounded-3xl"
                >
                  <MdVerified color="#fff" height={16} width={16} />
                  Verified
                </Badge>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#E6E6E6] mt-6">
              <div className="flex items-center gap-2 text-sm pb-3 px-6 border-b border-[#E6E6E6]">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.location}</span>
              </div>
              <div className="flex items-center gap-2 pb-3 text-sm px-6 border-b border-[#E6E6E6]">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {profileData.joinedDate}</span>
              </div>
              <div className="flex items-center gap-2 pb-3 text-sm px-6">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.companySize}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2 bg-[#fff] rounded-[24px]">
          <CardHeader>
            <CardTitle className="mt-2  text-[#F54A0C]  font-semibold text-[18px] my-custom-class">
              Profile Details
            </CardTitle>
            <CardDescription className="text-[14px] font-normal text-[#656565] mt-0 my-custom-class">
              {isEditingProfile
                ? "Edit your profile information"
                : "Your profile information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-[#000000] font-bold text-[16px] mb-0 my-custom-class ml-1 -mb-0.5"
                >
                  Full Name
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="name"
                    className="border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1] placeholder:text-[#656565]"
                    placeholder="John Doe"
                    value={profileData.name}
                    onChange={(e) =>
                      handleProfileUpdate("name", e.target.value)
                    }
                  />
                ) : (
                  <div className="min-h-[40px] border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1]">
                    {" "}
                    <p className="text-sm py-2 my-custom-class ml-[18px]">
                      {profileData.name}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[#000000] font-bold text-[16px] mb-0 my-custom-class ml-1 -mb-0.5"
                >
                  Email Address
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="email"
                    className="border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1] placeholder:text-[#656565]"
                    placeholder="john@gmail.com"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      handleProfileUpdate("email", e.target.value)
                    }
                  />
                ) : (
                  <div className="min-h-[40px] border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1]">
                    {" "}
                    <p className="text-sm py-2 my-custom-class ml-[18px]">
                      {profileData.email}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-[#000000] font-bold text-[16px] mb-0 my-custom-class ml-1 -mb-0.5"
                >
                  Phone Number
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="phone"
                    className="border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1] placeholder:text-[#656565]"
                    placeholder="8877990054"
                    value={profileData.phoneNumber}
                    onChange={(e) =>
                      handleProfileUpdate("phoneNumber", e.target.value)
                    }
                  />
                ) : (
                  <div className="min-h-[40px] border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1]">
                    {" "}
                    <p className="text-sm py-2 my-custom-class ml-[18px]">
                      {profileData.phoneNumber}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="company"
                  className="text-[#000000] font-bold text-[16px] mb-0 my-custom-class ml-1 -mb-0.5"
                >
                  Company
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="company"
                    className="border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1] placeholder:text-[#656565]"
                    placeholder="Soft Tech Inc"
                    value={profileData.companyName}
                    onChange={(e) =>
                      handleProfileUpdate("companyName", e.target.value)
                    }
                  />
                ) : (
                  <div className="min-h-[40px] border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1]">
                    {" "}
                    <p className="text-sm py-2 my-custom-class ml-[18px]">
                      {profileData.companyName}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="position"
                  className="text-[#000000] font-bold text-[16px] mb-0 my-custom-class ml-1 -mb-0.5"
                >
                  Position
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="position"
                    className="border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1] placeholder:text-[#656565]"
                    placeholder="Cheif Execute Officer"
                    value={profileData.position}
                    onChange={(e) =>
                      handleProfileUpdate("position", e.target.value)
                    }
                  />
                ) : (
                  <div className="min-h-[40px] border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1]">
                    {" "}
                    <p className="text-sm py-2 my-custom-class ml-[18px]">
                      {profileData.position}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="industry"
                  className="text-[#000000] font-bold text-[16px] mb-0 my-custom-class ml-1 -mb-0.5"
                >
                  Industry
                </Label>
                {isEditingProfile ? (
                  <Select
                    value={profileData.industry}
                    onValueChange={(value) =>
                      handleProfileUpdate("industry", value)
                    }
                  >
                    <SelectTrigger className="border-2 rounded-[8px] min-h-[40px] border-[#EEDCDC] bg-[#F1F1F1] placeholder:text-[#656565]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="min-h-[40px] border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1]">
                    {" "}
                    <p className="text-sm py-2 my-custom-class ml-[18px]">
                      {profileData.industry}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-[#000000] font-bold text-[16px] mb-0 my-custom-class ml-1 -mb-0.5"
                >
                  Location
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="location"
                    className="border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1] placeholder:text-[#656565]"
                    placeholder="Hyderaabad, India"
                    value={profileData.location}
                    onChange={(e) =>
                      handleProfileUpdate("location", e.target.value)
                    }
                  />
                ) : (
                  <div className="min-h-[40px] border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1]">
                    {" "}
                    <p className="text-sm py-2 my-custom-class ml-[18px]">
                      {profileData.location}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="website"
                  className="text-[#000000] font-bold text-[16px] mb-0 my-custom-class ml-1 -mb-0.5"
                >
                  Website
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="website"
                    className="border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1] placeholder:text-[#656565]"
                    placeholder="htts://media.com"
                    value={profileData.website}
                    onChange={(e) =>
                      handleProfileUpdate("website", e.target.value)
                    }
                  />
                ) : (
                  <div className="min-h-[40px] border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1]">
                    {" "}
                    <p className="text-sm py-2 my-custom-class ml-[18px]">
                      {profileData.website}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="text-[#F54A0C] font-bold text-[16px] mb-0 my-custom-class ml-1 -mb-0.5"
              >
                Bio
              </Label>
              {isEditingProfile ? (
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  className="border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1] placeholder:text-[#656565]"
                  placeholder="about your company"
                  onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                  rows={4}
                  placeholder="Tell us about yourself and your company..."
                />
              ) : (
                <p className="text-sm py-2 leading-relaxed text-[#656565] my-custom-class ml-2">
                  {profileData.bio}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="timezone"
                  className="text-[#000000] font-bold text-[16px] mb-0 my-custom-class ml-1 -mb-0.5"
                >
                  Timezone
                </Label>
                {isEditingProfile ? (
                  <Select
                    value={profileData.timeZone}
                    onValueChange={(value) =>
                      handleProfileUpdate("timeZone", value)
                    }
                  >
                    <SelectTrigger className="border-2 rounded-[8px] min-h-[40px] border-[#EEDCDC] bg-[#F1F1F1] placeholder:text-[#656565]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time (PT)
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time (MT)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time (CT)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        Eastern Time (ET)
                      </SelectItem>
                      <SelectItem value="Europe/London">GMT</SelectItem>
                      <SelectItem value="Europe/Paris">CET</SelectItem>
                      <SelectItem value="Asia/Tokyo">JST</SelectItem>
                      <SelectItem value="Asia/Kolkata">
                        Indian Standard Time (IST)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="min-h-[40px] border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1]">
                    {" "}
                    <p className="text-sm py-2 my-custom-class ml-[18px]">
                      {profileData.timeZone}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="communication"
                  className="text-[#000000] font-bold text-[16px] mb-0 my-custom-class ml-1 -mb-0.5"
                >
                  Preferred Communication
                </Label>
                {isEditingProfile ? (
                  <Select
                    value={profileData.preferredCommunication}
                    onValueChange={(value) =>
                      handleProfileUpdate("preferredCommunication", value)
                    }
                  >
                    <SelectTrigger className="border-2 rounded-[8px] min-h-[40px] border-[#EEDCDC] bg-[#F1F1F1] placeholder:text-[#656565]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="chat">Chat</SelectItem>
                      <SelectItem value="video">Video Call</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="min-h-[40px] border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1]">
                    {" "}
                    <p className="text-sm py-2 my-custom-class ml-[18px]">
                      {profileData.preferredCommunication}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="budget"
                  className="text-[#000000] font-bold text-[16px] mb-0 my-custom-class ml-1 -mb-0.5"
                >
                  Typical Project Budget
                </Label>
                {isEditingProfile ? (
                  <Select
                    value={profileData.typicalProjectBudget}
                    onValueChange={(value) =>
                      handleProfileUpdate("typicalProjectBudget", value)
                    }
                  >
                    <SelectTrigger className="border-2 rounded-[8px] min-h-[40px] border-[#EEDCDC] bg-[#F1F1F1] placeholder:text-[#656565]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$1,000 - $5,000">
                        $1,000 - $5,000
                      </SelectItem>
                      <SelectItem value="$5,000 - $10,000">
                        $5,000 - $10,000
                      </SelectItem>
                      <SelectItem value="$10,000 - $50,000">
                        $10,000 - $50,000
                      </SelectItem>
                      <SelectItem value="$50,000 - $100,000">
                        $50,000 - $100,000
                      </SelectItem>
                      <SelectItem value="$100,000+">$100,000+</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="min-h-[40px] border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1]">
                    {" "}
                    <p className="text-sm py-2 my-custom-class ml-[18px]">
                      {profileData.typicalProjectBudget}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="companySize"
                  className="text-[#000000] font-bold text-[16px] mb-0 my-custom-class ml-1 -mb-0.5"
                >
                  Company Size
                </Label>
                {isEditingProfile ? (
                  <Select
                    value={profileData.companySize}
                    onValueChange={(value) =>
                      handleProfileUpdate("companySize", value)
                    }
                  >
                    <SelectTrigger className="border-2 rounded-[8px] min-h-[40px] border-[#EEDCDC] bg-[#F1F1F1] placeholder:text-[#656565]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10 employees">
                        1-10 employees
                      </SelectItem>
                      <SelectItem value="11-50 employees">
                        11-50 employees
                      </SelectItem>
                      <SelectItem value="51-200 employees">
                        51-200 employees
                      </SelectItem>
                      <SelectItem value="201-500 employees">
                        201-500 employees
                      </SelectItem>
                      <SelectItem value="500+ employees">
                        500+ employees
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="min-h-[40px] border-2 rounded-[8px] border-[#EEDCDC] bg-[#F1F1F1]">
                    {" "}
                    <p className="text-sm py-2 my-custom-class ml-[18px]">
                      {profileData.companySize}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default ClientProfilePage;
