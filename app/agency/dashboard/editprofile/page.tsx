"use client";

import { CompanyProfileEditor } from "@/components/provider/company-profile-editor";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { authFetch } from "@/lib/auth-fetch";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const EditProfile = () => {
  const router=useRouter();
  const { user, loading } = useAuth();

  const [provider, setProvider] = useState({
    id: "1",
    name: "Jane Smith",
    email: "jane@sparkdev.com",
    subscriptionTier: "standard",
    isVerified: true,
    isFeatured: true,
    profileCompletion: 85,
    totalProjects: 47,
    activeProjects: 8,
    completedProjects: 39,
    totalEarnings: 125000,
    monthlyEarnings: 12500,
    rating: 4.9,
    responseTime: "2 hours",
    successRate: 98,
    minimumBudget: 500,
    hourlyRate: { min: 25, max: 150 },
  });
  const [userDetails, setUserDetails] = useState({});
  const [providerDetails, setProviderDetails] = useState({});
  const [responseLoading, setResponseLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  console.log("fetched user Details are from the edit profie is:::::",user)

  const loadData = async () => {
    setResponseLoading(true);
    setFailed(false);
    try {
      const response = await authFetch(`/api/providers/${user?.id}`);
      const data = await response.json();

      setProviderDetails(data.provider);
    } catch (error) {
      console.log("Failed to get the data::", error);
      setFailed(true);
    } finally {
      setResponseLoading(false);
    }
  };
  console.log("Provider Details::::", providerDetails);

 

  const handleSaveProfile = async (recievedData: any) => {
    console.log("Recieved Form Data to handle save profile:::", recievedData);

    try {
      const response = await authFetch(`/api/providers/${user?.id}`, {
        method: "PUT",
        body: JSON.stringify(recievedData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Successfully updated the profile details");
      }
      console.log("Update api response::::", data);
    } catch (error) {
      console.log("Failed to save the data please try again:::", error);
      toast.error("Failed to update the details");
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

  if (responseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (failed) {
    return (
      <div className="flex flex-col justify-center items-center text-center">
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#F4561C] my-custom-class mb-0">
          Edit Profile
        </h1>
        <p className="text-[#656565] font-normal my-custom-class text-lg">
          Manage your company information and profile details
        </p>
        <hr className="w-full mt-5 border-1 border-[#707070]" />
      </div>

      {providerDetails && (
        <CompanyProfileEditor
          provider={providerDetails}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
};

export default EditProfile;
