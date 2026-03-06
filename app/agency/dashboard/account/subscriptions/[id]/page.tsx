"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getSubscriptionPlan } from "@/lib/subscription-plans"
import { IoIosCheckmarkCircle } from "react-icons/io"
import { useState,useEffect } from "react"
import { useParams, useSearchParams,useRouter } from "next/navigation"
import { features } from "process"
import { useAuth } from "@/contexts/auth-context"
import { authFetch } from "@/lib/auth-fetch"



interface SubscribePageProps {
  params: {
    plan: string
  }
}


export default function SubscribePage({params}:SubscribePageProps) {
  
   const router=useRouter();
    const { user, loading } = useAuth()

  const searchParams = useSearchParams()
  // const params = useParams()

  //  const id = params.id as string
  const billing = searchParams.get("billing") // "yearly"

  
  console.log("Billing:", billing)

  const[selectedPlan,setSelectedPlan]=useState();
  const[userDetails,setUserDetails]=useState({});
  const[subscriptionDetails,setSubscriptionDetails]=useState({});
  const[remainingAmount,setRemaianingAMount]=useState(0);
  const[payableAmount,setPaymableAmount]=useState(0);

  const[resLoading,setResLoading]=useState(false);
  const[failed,setFailed]=useState(false);

  const[showMoreFeatures,setShowMoreFeatures]=useState(false);
  const [paymentRequestStatus,setPaymentRequestStatus]=useState(false)

   //it returns the total amount of the after dedudction the remainng amount
  const calculateUpgradeAmount=(
    currentPrice: number,
    billingCycle: "Monthly" | "Yearly",
    startDate: string | Date,
    endDate: string | Date,
    newPlanPrice: number,
  )=>{
    console.log("Entered")
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
  
    if (now >= end) {
      return newPlanPrice // subscription expired
    }
  
    const totalDays =
      billingCycle === "Yearly" ? 365 : 30
      
  
    const remainingDays = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
    console.log("end time is:::::",end.getTime())
  
    const perDayCost = currentPrice / totalDays
    const unusedAmount = perDayCost * remainingDays
    setRemaianingAMount(unusedAmount)
  
    const payableAmount = Math.max(
      Math.round(newPlanPrice - unusedAmount),
      0
    )
    setPaymableAmount(payableAmount)
  
    return payableAmount
  }
  

  const  loadData=async()=>{
    setResLoading(true);
    setFailed(false);
    try{
      const response = await fetch(`/api/subscription/${params.id}`);
      //user details which have the subscription ammount to use substract from th intial amount
      const res=await authFetch(`/api/users/${user?.id}`)
      if(!response.ok || !res.ok){
        throw new Error('Failed to fetch subscription plan data');
      }else{
        const data = await response.json();
         const userDetails =await res.json();
        console.log("Fetched subscription details:", userDetails);
        
         setUserDetails(userDetails.user);
        setSubscriptionDetails(userDetails.subscription);
        
          setSelectedPlan(data.data);
        setFailed(false);
       
      }
    }catch(error){
      console.error("Error fetching subscription plan data:", error);
      setFailed(true);
    }finally{
      setResLoading(false);
    }
  }
   useEffect(() => {
       if (!loading && (!user || user.role !== "agency")) {
         router.push("/login")
       }
       if(user && user.role === "agency"){
          loadData()
       }
     }, [user, loading, router])
   useEffect(() => {
    console.log(subscriptionDetails?.price)
  if (
    !subscriptionDetails?.price ||
    !subscriptionDetails?.billingCycle ||
    !userDetails?.subscriptionEndDate ||
    !userDetails?.subscriptionStartDate
  ) {
    return
  }
console.log("calling")
  const newPlanPrice =
    billing === "yearly"
      ? selectedPlan.pricePerYear
      : selectedPlan.pricePerMonth

  const payable = calculateUpgradeAmount(
    subscriptionDetails.price,
    subscriptionDetails.billingCycle,
    userDetails.subscriptionStartDate,
    userDetails.subscriptionEndDate,
    newPlanPrice
  )

  console.log("Payable amount:", payable)
}, [subscriptionDetails, selectedPlan, billing,userDetails])


  if(resLoading){
     return(
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
        )
  }
  // 
  console.log("Remaing aamount is:::",remainingAmount,)
  const loadRazorpay = () =>
  new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    document.body.appendChild(script)
  })

const handlePayment = async () => {
  setPaymentRequestStatus(true)
  await loadRazorpay()

  const orderRes = await fetch("/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      planId: params.id,
      amount: payableAmount>0?payableAmount:billing==="yearly"?selectedPlan.pricePerYear:selectedPlan.pricePerMonth|| 0,
    }),
  })

  if(!orderRes.ok){
    alert("FAiled to intialize the payment please try again");
    setPaymentRequestStatus(false);
  }

  const order = await orderRes.json()
  setPaymentRequestStatus(false)

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: "INR",
    order_id: order.id,

    handler: async (response: any) => {
      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...response,
          planId: params.id,
          billingCycle:billing?.charAt(0).toUpperCase() + (billing?.slice(1).toLowerCase() || "")
        }),
      })

      const data = await verifyRes.json()

      if (data.success) {
        alert("Payment successful 🎉")
        router.push("/agency/dashboard/")
      } else {
        alert("Payment verification failed")
      }
    },
  }

  new (window as any).Razorpay(options).open()
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
      {
        !resLoading && !failed && selectedPlan && (
            <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-orange-500 text-sm font-medium mb-2">
              Subscribe to {selectedPlan.title}
            </p>
            <h1 className="text-2xl sm:text-2xl font-medium">
              Complet your subscription to unlock all {selectedPlan.title} features
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
                      ${billing==="yearly"?selectedPlan.pricePerYear:selectedPlan.pricePerMonth}/{billing==="yearly"?"yearly":"monthly"}
                    </p>
                    <Link
                      href="/agency/dashboard/account/subscriptions"
                    >
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
                    {(selectedPlan.features || []).slice(0,2).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-startgap-3 text-sm text-zinc-700"
                      >
                        <IoIosCheckmarkCircle 
                          className="h-4 w-5 text-orangeButton shrink-0 mt-px" 
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {
                      (selectedPlan.features || []).length > 2 && !showMoreFeatures && (
                       <li className="text-sm text-zinc-700 underline cursor-pointer" onClick={()=>setShowMoreFeatures(true)}>
                        + {(selectedPlan.features || []).length-2} more features
                      </li>
                      )
                    }
                    {/*{remainingCount > 0 && (
                      <li className="text-sm text-zinc-700 underline cursor-pointer">
                        + {remainingCount} more features
                      </li>
                    )} */}

                    {
                      showMoreFeatures && (selectedPlan.features || []).slice(2).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-startgap-3 text-sm text-zinc-700"
                      >
                        <IoIosCheckmarkCircle 
                          className="h-4 w-5 text-orangeButton shrink-0 mt-px" 
                        />
                        <span>{feature}</span>
                      </li>
                    ))
                    }

                    {
                      showMoreFeatures && (selectedPlan.features || []).length > 2 && (
                        <li className="text-sm text-zinc-700 underline cursor-pointer" onClick={()=>setShowMoreFeatures(false)}>hide</li>
                      )
                    }

                  </ul>
                </div>

                {/* Total*/}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between font-extrabold text-zinc-900">
                    <span>Price Plan</span>
                    <span>
                      ${billing==="yearly"?selectedPlan.pricePerYear:selectedPlan.pricePerMonth}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-extrabold text-zinc-900">
                    <span>Previous Plan Amount</span>
                    <span>
                      ${remainingAmount || 0}
                    </span>
                  </div>
                   <div className="flex items-center justify-between font-extrabold text-zinc-900">
                    <span>Total</span>
                    <span>
                      ${payableAmount>0?payableAmount:billing==="yearly"?selectedPlan.pricePerYear:selectedPlan.pricePerMonth}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-5000 mt-0">
                    {(selectedPlan.trialDays ?? 14)}-day free trial · Cancel anytime
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  {/* Proceed to pay */}
                  <button
                      type="button"
                      disabled={paymentRequestStatus}
                      onClick={handlePayment}
                      className={`
                        h-9 px-8 rounded-full
                        text-[10px] font-medium
                        transition-all duration-200

                        ${
                          paymentRequestStatus
                            ? "bg-orangeButton/20 cursor-not-allowed " 
                            : "bg-orangeButton text-white hover:bg-orange-600 cursor-pointer"
                        }
                      `}
                    >
                      {paymentRequestStatus ? "Proceeding to pay..." : "Proceed to pay"}
                    </button>


                  {/* Cancel / Exit */}
                  <Link href="/agency/dashboard/account/subscriptions">
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
              href="/agency/dashboard/account/subscriptions"
              className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Pricing
            </Link>
          </div>
        </div>
        )
      }
      </div>
    </div>
  )
}
