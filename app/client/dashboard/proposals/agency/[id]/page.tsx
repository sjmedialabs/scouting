"use client";

import { MdDisabledByDefault } from "react-icons/md";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const AgencyPortfolioPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [providerDetails, setProviderDetails] = useState({});
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch(`/api/providers/${id}`, {
        credentials: "include",
      });
      const data = await response.json();
      setProviderDetails(data.provider);
      setReviews(data.reviews);
      setFailed(false);
    } catch (error) {
      console.log("Failed to get the data error:::", error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
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
  console.log("Fetched ProviderDetails:::", providerDetails);

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="font-bold text-2xl text-[#F54A0C] my-custom-class">
            {providerDetails?.name || " S J Media Labs "} - Portfolio
          </h1>
          <p className="text-[#656565] text-md mt-0 my-custom-class">
            View previous work and projects completed by this agency
          </p>
        </div>
        <Button
          className="bg-[#000] text-xs text-[#fff] rounded-full my-custom-class hover:bg-[#000] active:bg-[#000]"
          onClick={() => router.push("/client/dashboard/proposals")}
        >
          <FaArrowLeftLong color="#fff" className="h-4 w-4" />
          Back To Proposals
        </Button>
      </div>
      {providerDetails?.portfolio.length === 0 && (
        <h1 className="text-xl text-[#656565] text-center mt-15">
          No Portfolio items
        </h1>
      )}
      {providerDetails?.portfolio.length !== 0 && (
        <div className="flex justify-start flex-wrap gap-5">
          {(providerDetails?.portfolio || []).map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                <img
                  src={
                    item.image ||
                    `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(item.title) || "/placeholder.svg"}`
                  }
                  alt={item.title}
                  className="w-full h-full max-w-[300px] object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <Badge
                  variant="outline"
                  className="mb-2 bg-[#ebecee] rounded-2xl text-[12px] text-[#000]"
                >
                  {item.category}
                </Badge>
                <h4 className="font-semibold text-md mb-1">{item.title}</h4>
                <p className="text-sm text-[#b2b2b2] line-clamp-2 mb-3">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.technologies.slice(0, 3).map((tech, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs bg-[#d9e4f6] text-[#000] rounded-2xl"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
                {/* {item.projectUrl && (
                                    <a
                                        href={item.projectUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                    >
                                        View Project <ExternalLink className="h-3 w-3" />
                                    </a>
                                    )} */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AgencyPortfolioPage;
