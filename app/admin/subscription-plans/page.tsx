"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Edit, Check, X, CreditCard, PlusCircle, Loader2 } from "lucide-react";
import { ISubscription } from "@/lib/types";
import { authFetch } from "@/lib/auth-fetch";
import { AuthGuard } from "@/components/auth-guard";
import { toast } from "@/lib/toast";

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<ISubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const[freeTrailProposalCount,setFreeTrailProposalCount]=useState(0);
  const[freeTrailSending,setFreeTrailSending]=useState(false);


  const [newPlan, setNewPlan] = useState({
    title: "",
    pricePerMonth: "",
    pricePerYear: "",
    description: "",
    features: "",
    yearlySubscription: false,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await authFetch("/api/subscription");
      const freeTrailRes=await authFetch("/api/free-trail-config")
      
      if (res.ok && freeTrailRes.ok) {
        const data = await res.json();
        const freeTrailData=await freeTrailRes.json();

        console.log("Free Trail Plans Data::::",freeTrailData);
        setPlans(data);
        setFreeTrailProposalCount(freeTrailData.proposalLimit);
      }
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // ADD NEW PLAN
  // ------------------------------
  const addPlan = async () => {
    if (!newPlan.title || !newPlan.pricePerMonth) return;

    const newData = {
      title: newPlan.title,
      pricePerMonth: parseFloat(newPlan.pricePerMonth),
      pricePerYear:
        parseFloat(newPlan.pricePerYear) ||
        parseFloat(newPlan.pricePerMonth) * 12,
      description: newPlan.description,
      features: newPlan.features.split(",").map((f) => f.trim()),
      yearlySubscription: newPlan.yearlySubscription,
      isActive: true,
    };

    const res = await authFetch("/api/subscription", {
      method: "POST",
      body: JSON.stringify(newData),
    });

    if (res.ok) {
      const created = await res.json();
      setPlans((prev) => [...prev, created]);
      setNewPlan({
        title: "",
        pricePerMonth: "",
        pricePerYear: "",
        description: "",
        features: "",
        yearlySubscription: false,
      });
    }
  };

  // ------------------------------
  // EDIT PLAN
  // ------------------------------
  const saveEdit = async (id: string, updated: Partial<ISubscription>) => {
    const res = await authFetch(`/api/subscription/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      const result = await res.json();
      // Map API response (id) back to frontend interface (_id)
      const updatedPlan = { ...result.data, _id: result.data.id };
      setPlans((prev) => prev.map((p) => (p._id === id ? updatedPlan : p)));
      setEditingId(null);
    }
  };

  const togglePlanStatus = async (plan: ISubscription) => {
    await saveEdit(plan._id, { isActive: !plan.isActive });
  };

  // free trail plan updation
  
  const freeTrailProposalCountUpdate=async()=>{
    setFreeTrailSending(true)
    try{
      const res=await authFetch("/api/free-trail-config",{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({proposalLimit:freeTrailProposalCount})
      })
      if(res.ok){
        toast.success("Updated the Free trail proposal count")
      }

    }catch(error){
      console.log("Failed to update the free trail proposal count::::",error)
      toast.error("Failed to update please try again")
    }finally{
      setFreeTrailSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold my-custom-class text-orangeButton">
          Subscription Plans
        </h1>
        <p className="text-gray-500 text-lg my-custom-class">
          Select the perfect plan for your business needs. Upgrade or downgrade
          at any time.
        </p>
      </div>

      {/*Free Plan */}

       <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
        <h2 className="text-xl font-semibold flex my-custom-class items-center gap-2">
          Update Free Trail Proposal Count
        </h2>
           <Input
            className="border-gray-300 rounded-2xl placeholder:text-gray-500"
            type="number"
            min={1}
            placeholder="Number of free proposals"
            value={freeTrailProposalCount}
            onChange={(e) => setFreeTrailProposalCount(parseInt(e.target.value))}
          />

          <Button
          className={`${freeTrailSending?"bg-orange-400 cursor-not-allowed":"bg-orangeButton cursor-pointer"} rounded-2xl h-8 hover:bg-orange-600`} disabled={freeTrailSending}
          onClick={freeTrailProposalCountUpdate}
        >
           {`${freeTrailSending?"Updating...":"Update"}`}
        </Button>
        </div>

      {/* ADD PLAN */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
        <h2 className="text-xl font-semibold flex my-custom-class items-center gap-2">
          Add New Plan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            className="border-gray-300 rounded-2xl placeholder:text-gray-500"
            placeholder="Enter Plan Title"
            value={newPlan.title}
            onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
          />
          <Input
            className="border-gray-300 rounded-2xl placeholder:text-gray-500"
            placeholder="Price / Month"
            type="number"
            value={newPlan.pricePerMonth}
            onChange={(e) =>
              setNewPlan({ ...newPlan, pricePerMonth: e.target.value })
            }
          />
          <Input
            className="border-gray-300 rounded-2xl placeholder:text-gray-500"
            placeholder="Price / Year"
            type="number"
            value={newPlan.pricePerYear}
            onChange={(e) =>
              setNewPlan({ ...newPlan, pricePerYear: e.target.value })
            }
          />
          <Input
            className="border-gray-300 rounded-2xl placeholder:text-gray-500"
            placeholder="Features (comma separated)"
            value={newPlan.features}
            onChange={(e) =>
              setNewPlan({ ...newPlan, features: e.target.value })
            }
          />
        </div>

        <div className="mb-4">
          <Input
            className="border-gray-300 rounded-2xl placeholder:text-gray-500"
            placeholder="Enter plan description"
            value={newPlan.description}
            onChange={(e) =>
              setNewPlan({ ...newPlan, description: e.target.value })
            }
          />
        </div>

        <Button
          className="bg-orangeButton rounded-2xl h-8 hover:bg-orange-600"
          onClick={addPlan}
        >
          Add Plan
        </Button>
      </div>

      {/* PLANS */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orangeButton" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const isPopular = index === 1;

            return (
              <div
                key={plan._id}
                className={`relative bg-[#fafafa] border rounded-2xl p-8 flex flex-col h-full ${
                  isPopular ? "border-gray-900 shadow-xl" : ""
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 bg-gray-900 my-custom-class text-white text-xs px-3 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-white text-white" />
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-center my-custom-class">
                  {editingId === plan._id ? (
                    <Input
                      value={plan.title}
                      onChange={(e) =>
                        setPlans((prev) =>
                          prev.map((p) =>
                            p._id === plan._id
                              ? { ...p, title: e.target.value }
                              : p,
                          ),
                        )
                      }
                      className="text-center"
                    />
                  ) : (
                    plan.title
                  )}
                </h3>

                <div className="text-center mt-4 my-custom-class">
                  {editingId === plan._id ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={plan.pricePerMonth}
                        onChange={(e) =>
                          setPlans((prev) =>
                            prev.map((p) =>
                              p._id === plan._id
                                ? {
                                    ...p,
                                    pricePerMonth: Number(e.target.value),
                                  }
                                : p,
                            ),
                          )
                        }
                      />
                      <Input
                        type="number"
                        value={plan.pricePerYear}
                        onChange={(e) =>
                          setPlans((prev) =>
                            prev.map((p) =>
                              p._id === plan._id
                                ? {
                                    ...p,
                                    pricePerYear: Number(e.target.value),
                                  }
                                : p,
                            ),
                          )
                        }
                      />
                    </div>
                  ) : (
                    <p className="text-3xl font-bold">
                      ${plan.pricePerMonth}
                      <span className="text-sm text-gray-500 font-medium">
                        /monthly
                      </span>
                    </p>
                  )}
                </div>

                <div className="text-center mt-2">
                  {editingId === plan._id ? (
                    <Input
                      value={plan.description || ""}
                      onChange={(e) =>
                        setPlans((prev) =>
                          prev.map((p) =>
                            p._id === plan._id
                              ? { ...p, description: e.target.value }
                              : p,
                          ),
                        )
                      }
                      placeholder="Enter plan description"
                      className="text-center border-gray-300 rounded-xl"
                    />
                  ) : (
                    <p className="text-gray-500 text-sm">
                      {plan.description || "Perfect for growing businesses"}
                    </p>
                  )}
                </div>

                <div className="mt-6 space-y-2 flex-1">
                  {editingId === plan._id ? (
                    <Input
                      value={plan.features.join(", ")}
                      onChange={(e) =>
                        setPlans((prev) =>
                          prev.map((p) =>
                            p._id === plan._id
                              ? {
                                  ...p,
                                  features: e.target.value
                                    .split(",")
                                    .map((f) => f.trim()),
                                }
                              : p,
                          ),
                        )
                      }
                    />
                  ) : (
                    plan.features.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-500 my-custom-class"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                        {f}
                      </div>
                    ))
                  )}
                </div>

                {/* <Button
                  className={cn(
                    "mt-6",
                    isPopular
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-white border hover:bg-gray-50"
                  )}
                >
                  {plan.title === "Basic"
                    ? "Get Started Free"
                    : `Choose ${plan.title}`}
                </Button> */}

                <div className="mt-auto pt-6 flex items-center gap-3">
                  {editingId === plan._id ? (
                    <>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => saveEdit(plan._id, plan)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setEditingId(plan._id)}
                      className="flex items-center gap-2 rounded-2xl"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  )}

                  <Button
                    onClick={() => togglePlanStatus(plan)}
                    className={
                      plan.isActive
                        ? "bg-red-100 text-red-700 hover:bg-red-200 rounded-2xl"
                        : "bg-green-100 text-green-700 hover:bg-green-200 rounded-2xl"
                    }
                  >
                    {plan.isActive ? "Disable" : "Activate"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
