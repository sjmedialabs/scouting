"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getSubscriptionPlan } from "@/lib/subscription-plans";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { features } from "process";
import { authFetch } from "@/lib/auth-fetch";

interface SubscribePageProps {
  params: {
    plan: string;
  };
}

export default function SubscribePage({ params }: SubscribePageProps) {
  const router = useRouter();

  const searchParams = useSearchParams();
  // const params = useParams()

  //  const id = params.id as string
  const billing = searchParams.get("billing"); // "yearly"

  console.log("Billing:", billing);

  const [selectedPlan, setSelectedPlan] = useState();

  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const [showMoreFeatures, setShowMoreFeatures] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch(`/api/subscription/${params.plan}`);
      if (!response.ok) {
        throw new Error("Failed to fetch subscription plan data");
      } else {
        const data = await response.json();
        console.log("Fetched subscription plan data:", data);
        setSelectedPlan(data.data);
        setFailed(false);
      }
    } catch (error) {
      console.error("Error fetching subscription plan data:", error);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // if (!selectedPlan) {
  //   return(
  //     <div className="py-20 text-center">
  //       <p className="text-lg font-medium">
  //         Plan Not Found
  //         </p>
  //         <Link href="/pricing" className="text-orange-500 underline">
  //         Back to Pricing
  //         </Link>
  //     </div>
  //   )
  // }

  // const visibleFeatures = selectedPlan.features.slice(0, 5)
  // const remainingCount = selectedPlan.features.length - visibleFeatures.length

  return (
    <div className="bg-background min-h-screen">
      <div className="px-4 py-10">
        {!loading && !failed && selectedPlan && (
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <p className="text-orange-500 text-sm font-medium mb-2">
                Subscribe to {selectedPlan.title}
              </p>
              <h1 className="text-2xl sm:text-2xl font-medium">
                Complet your subscription to unlock all {selectedPlan.title}{" "}
                features
              </h1>
            </div>

            {/* Order Summary Card*/}
            <div className="flex justify-center">
              <Card className="w-full max-w-md rounded-2xl shadow-md border border-slate-200 bg-white">
                <CardContent className="p-5 pt-2 space-y-6">
                  <div className="flex items-center h-0 justify-between">
                    <h2 className="text-orangeButton font-extrabold text-lg">
                      Order Summary
                    </h2>
                  </div>

                  {/* Plan Row */}
                  <div className="flex items-center pt-7 justify-between border-b pb-4">
                    {/* Left */}
                    <p className="font-extrabold text-zinc-900">
                      {selectedPlan.title} Plan
                    </p>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                      <p className="font-extrabold text-zinc-900">
                        $
                        {billing === "yearly"
                          ? selectedPlan.pricePerYear
                          : selectedPlan.pricePerMonth}
                        /{billing === "yearly" ? "yearly" : "monthly"}
                      </p>
                      <Link href="/pricing">
                        <button
                          type="button"
                          className="h-7 px-3 rounded-full text-xs font-medium
                                  border border-zinc-300 bg-zinc-700
                                  hover:bg-zinc-600 text-white
                                  transition-colors"
                        >
                          Change
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <p className="font-extrabold text-md mb-3">
                      What's included:
                    </p>
                    <ul className="space-y-3">
                      {(selectedPlan.features || [])
                        .slice(0, 2)
                        .map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-startgap-3 text-sm text-zinc-700"
                          >
                            <IoIosCheckmarkCircle className="h-4 w-5 text-orangeButton shrink-0 mt-px" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      {(selectedPlan.features || []).length > 2 &&
                        !showMoreFeatures && (
                          <li
                            className="text-sm text-zinc-700 underline cursor-pointer"
                            onClick={() => setShowMoreFeatures(true)}
                          >
                            + {(selectedPlan.features || []).length - 2} more
                            features
                          </li>
                        )}
                      {/*{remainingCount > 0 && (
                      <li className="text-sm text-zinc-700 underline cursor-pointer">
                        + {remainingCount} more features
                      </li>
                    )} */}

                      {showMoreFeatures &&
                        (selectedPlan.features || [])
                          .slice(2)
                          .map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-startgap-3 text-sm text-zinc-700"
                            >
                              <IoIosCheckmarkCircle className="h-4 w-5 text-orangeButton shrink-0 mt-px" />
                              <span>{feature}</span>
                            </li>
                          ))}

                      {showMoreFeatures &&
                        (selectedPlan.features || []).length > 2 && (
                          <li
                            className="text-sm text-zinc-700 underline cursor-pointer"
                            onClick={() => setShowMoreFeatures(false)}
                          >
                            hide
                          </li>
                        )}
                    </ul>
                  </div>

                  {/* Total*/}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between font-extrabold text-zinc-900">
                      <span>Total</span>
                      <span>
                        $
                        {billing === "yearly"
                          ? selectedPlan.pricePerYear
                          : selectedPlan.pricePerMonth}
                        /{billing === "yearly" ? "yearly" : "monthly"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-5000 mt-0">
                      {selectedPlan.trialDays ?? 14}-day free trial · Cancel
                      anytime
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    {/* Proceed to pay */}
                    <button
                      type="button"
                      className="h-9 px-8 rounded-full
                              bg-orangeButton text-white text-[10px] font-medium
                              hover:bg-orange-600
                              transition-colors"
                      onClick={() => {
                        // BACKEND CHECKOUT HOOK (to be implemented)
                        router.push("/register");
                      }}
                    >
                      Proceed to pay
                    </button>

                    {/* Cancel / Exit */}
                    <Link href="/pricing">
                      <button
                        type="button"
                        className="h-9 px-8 rounded-full
                                bg-zinc-700 text-white text-[10px] font-medium
                                hover:bg-zinc-800
                                transition-colors"
                      >
                        Cancel/Exit
                      </button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Back Link */}
            <div className="mt-8 text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Pricing
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
