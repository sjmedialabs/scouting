"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"
import Link from "next/link"
import { subscriptionPlans } from "@/lib/subscription-plans"
import { useState, useEffect } from "react"

interface CmsPlan {
  _id: string
  title: string
  pricePerMonth: number
  pricePerYear?: number
  yearlySubscription?: boolean
  description?: string
  features: string[]
  isActive: boolean
  slug?: string
}


export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [cmsFeatures, setCmsFeatures] = useState<Record<string, string[]>>({})
  const[subscriptions, setSubscriptions]= useState<CmsPlan[]>([])

  const[loading,setLoading]=useState(false);
  const[failed,setFailed]=useState(false);

  useEffect(() => {
    const fetchCmsFeatures = async () => {
      
      setLoading(true);
      setFailed(false);
      try {
        const res = await fetch("/api/subscription")

        if(res.ok){
           const data: CmsPlan[] = await res.json();
            console.log("Fetched CMS subscription plans:", data);

            // show only active plans
            const activePlans = data.filter((plan) => plan.isActive);

setSubscriptions(activePlans);

        const featureMap: Record<string, string[]> = {}

        data.forEach((plan) => {
          // map CMS plan → frontend plan id
          const key =
            plan.slug ||
            plan.title?.toLowerCase() ||
            plan._id

          featureMap[key] = plan.features || []
        })

        setCmsFeatures(featureMap)
          setFailed(false);
        }
       
      } catch (error) {
        console.error("Failed to fetch CMS features", error)
        setFailed(true);
      }finally{
        setLoading(false);
      }
    }

    fetchCmsFeatures()
  }, [])

  const getDisplayPrice = (plan: any) => {
  if (!isAnnual) {
    return {
      price: plan.price,
      label: "month",
    }
  }

  // yearly pricing (CMS or fallback)
  const yearlyPrice = Math.round(plan.price * 12 * 0.85) // 15% discount fallback

  return {
    price: yearlyPrice,
    label: "year",
  }
}
  
  return (
    <div className="bg-background">
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-1xl font-thin text-orange-400 mb-1">
              Choose Your Plan
            </p>
            <p className="text-xl text-muted-foreground text-balance text-center max-w-xl mx-auto leading-tight">
              Select the perfect plan for your business needs.<br/> Upgrade or downgrade at any time.
            </p>
          </div>



         {/* Monthly and Annually Toggle*/} 
        <div
        className="mt-2 mb-10 flex items-center justify-center gap-3 sm:flex-row sm:gap-4">
           <span
              className={`text-lg font-bold transition-colors  ${
                isAnnual ? "text-slate-500" : "text-slate-900"
              }`}
              style={{ fontFamily: "sans-serif" }}
            >
              Monthly
            </span>

          <button
          onClick={() => setIsAnnual(!isAnnual)}
          className="relative inline-flex h-10 w-20 items-center 
          rounded-full bg-slate-700 shadow-inner transition-colors 
          focus:outline-none shrink-0">

            <div
                className={`absolute left-1 top-1 h-8 w-8 rounded-full
                   bg-white shadow transition-transform duration-300 
                   ease-in-out ${
                  isAnnual ? "translate-x-10" : "translate-x-0"
                }`}
              />
          </button>    

          <span
              className={`text-lg font-bold transition-color ${
                isAnnual ? "text-slate-900" : "text-slate-500"
              }`}
              style={{ fontFamily: "sans-serif" }}
            >
              Annually{" "}
              <span className="text-orange-500"
              style={{ fontFamily: "sans-serif" }}
              >(save 15%)</span>
            </span>
          </div>
  
          {/* Pricing Cards */}
          {
            !loading && !failed && subscriptions.length > 0 && (
              <div className="grid md:grid-cols-3 gap-8 mb-12">
            {subscriptions.map((plan) => {
              const selected = selectedId === plan._id
              const {price, label } = getDisplayPrice(plan)
              // const isFeatured = plan._id === "standard" || plan.popular

              return (
                <Card
                  key={plan._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedId(plan._id)}                  
                  onKeyDown={(e) => 
                    (e.key === "Enter" || e.key === " ") && 
                    setSelectedId(plan._id)}
                  className={[
                   "group relative cursor-pointer transition-all duration-500 ease-out",
                   "border border-slate-50 bg-neutral-10 shadow-[0_1px_3px_rgb(0,0,0,0.03)]",
                  "hover:-translate-y-1 hover:shadow-xl hover:bg-white",
                  selected ? "bg-zinc-50 ring-1 ring-zinc-200 border-slate-300" : "",
                  + "flex flex-col justify-between h-full",
                 ].join(" ")}
                >
                  {/* {{false && plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}} */}

                <div>
                  <CardHeader className="text-left pb-4">
                    <CardTitle className="text-3xl font-semibold tracking-tight text-zinc-900"
                    style={{ fontFamily: 'sans-serif'}}>
                      {plan.title}
                      </CardTitle>

                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-4xl font-semibold tracking-tight text-zinc-900"
                      style={{ fontFamily: "sans-serif" }}
                      >
                        ${isAnnual? plan.pricePerYear: plan.pricePerMonth}
                      </span>
                      <span className="text-[14px] text-zinc-900 font-medium"
                      style={{ fontFamily: "sans-serif" }}
                      >/{label}
                      </span>
                    </div>

                    <CardDescription className="mt-1 text-[15px] text-zinc-400 leading-relaxed"
                    style={{ fontFamily: "sans-serif" }}
                    >
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-4 mb-8">
                      { (plan.features || []).map(
                          (feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                           <span className="grid place-items-center h-7 w-7 rounded-full bg-blue-100 flex-shrink-0">
                             <span className="text-orange-500 text-[16px] font-extrabold leading-none translate-y-[1px]">
                                🗸
                             </span>
                           </span>
                          <span className="text-[16px] text-zinc-700 leading-relaxed"
                          style={{ fontFamily: "sans-serif" }}
                          >{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>     

                  <div className="px-6 pb-6 mt-auto">
                    <Button
                      onClick={() => setSelectedId(plan._id)}
                      className={[
                      "w-full h-12 text-base font-medium transition-colors duration-300 ease-out",
                      "border border-orange-200 text-orange-600 bg-[#feefe8]",
                      "hover:bg-[#ff4d1d] hover:text-white hover:border-[#ff4d1d]",
                      "group-hover:bg-[#ff4d1d] group-hover:text-white group-hover:border-[#ff4d1d]",
                      "focus:outline-none focus:ring-0 active:outline-none active:ring-0",
                      "focus-visible:outline-none focus-visible:ring-0",
                      "active:bg-orange-50 active:text-orange-600 active:border-orange-300",
                      selected ? "bg-[#ff4d1d]/10 border-[#ff4d1d]/30 ring-1 ring-[#ff4d1d]/20" : "",
                      ].join(" ")}
                      variant="outline"
                      asChild
                    >
                      <Link href={`/agency/dashboard/account/subscriptions/${plan._id}?billing=${isAnnual ? "yearly" : "monthly"}`}
                      >
                        {plan.id === "basic" 
                        ? "Get Started Free" 
                        : `Choose ${plan.title}`}
                      </Link>
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
            )
          }

          {
            loading && (
              <div className="mt-40 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )
          }

          
          {/* FAQ Section */}
          {/*
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I change my plan anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll
                    prorate any billing adjustments.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What happens if I exceed my plan limits?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You'll receive notifications when approaching your limits. Once exceeded, you'll need to upgrade
                    your plan to continue using premium features.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a free trial?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our Basic plan is free forever. For Standard and Premium plans, we offer a 14-day free trial so you
                    can explore all features before committing.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are
                    processed securely through our payment partners.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div> 
          */}
        </div>
      </div>
    </div>
  )
}

