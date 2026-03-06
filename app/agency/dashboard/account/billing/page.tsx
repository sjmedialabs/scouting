"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useState,useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ImageUpload } from "@/components/ui/image-upload"
import { authFetch } from "@/lib/auth-fetch"


const billingContact = {
  name: "Jhon Williams",
  email: "Jhon@gmail.com", 
  altEmail: "billing@gmail.com",
  phone: "+91-1234567890",
  avatar:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
}

const planDetails = {
  name: "Professional",
  price: "$9.99 / month",
}

const cardDetails = {
  brand: "VISA",
  last4: "5673",
}

const billingHistory = [
  { invoice: "#1023", date: "May 15, 2022", status: "Paid", amount: "$9.99" },
  { invoice: "#1016", date: "Nov 28, 2020", status: "Paid", amount: "$9.99" },
  { invoice: "#1022", date: "Nov 13, 2018", status: "Paid", amount: "$9.99" },
  { invoice: "#1019", date: "Mar 9, 2013", status: "Paid", amount: "$9.99" },
  { invoice: "#1018", date: "Nov 2, 2011", status: "Paid", amount: "$49.99" },
  { invoice: "#1020", date: "Dec 20, 2009", status: "Paid", amount: "$9.99" },
  { invoice: "#1017", date: "Nov 22, 2008", status: "Paid", amount: "$9.99" },
  { invoice: "#1021", date: "Apr 16, 2007", status: "Cancelled", amount: "$19.99" },
]



export default function BillingPage() {
  const router=useRouter();
   const { user, loading } = useAuth()

   const[resLoading,setResLoading]=useState(false);
   const[failed,setFailed]=useState(false);

   const[userDetails,setUserDetails]=useState({}); 
   const[subscriptionDetails,setSubscriptionDetails]=useState({});
   const[paymentDetails,setPaymentDetails]=useState([]);

   const[isExpired,setIsExpired]=useState(false);
   const[freeTrailProposalCount,setFreeTrailProposalCount]=useState(0);
   

   const[formData,setFormData]=useState({
    name:"",
    phone:"",
    avtar:""
   })
   const[showModel,setShowModel]=useState(false)
   const[errorStatus,setErrorStatus]=useState({
    status:"success",
    msg:""
   })
   const[sending,setSending]=useState(false);

  
   const loadData=async()=>{
      setResLoading(true);
      setFailed(false);
      try{
        const res=await authFetch(`/api/users/${user?.id}`)
        const paymentRes=await authFetch(`/api/payment/${user?.id}`)
        const freeTrailRes=await authFetch("/api/free-trail-config")
        if(!res.ok || !paymentRes.ok || !freeTrailRes.ok) throw new Error()
        const data =await res.json();
        const paymentData=await paymentRes.json();
        const freeTrailData=await freeTrailRes.json();
        console.log("Fetched User Detaisl in Billing Cycyle:::",data);
        console.log("Payment details in the billing cycle:::",paymentData)
        setUserDetails(data.user);

         const isExpired = data.user?.subscriptionStartDate
          ? new Date(data.user.subscriptionEndDate) < new Date()
          : (data.user?.proposalCount || 0) >= freeTrailData.proposalLimit

        setIsExpired(isExpired)

        
        setSubscriptionDetails(data.subscription);
        setPaymentDetails(paymentData.payments)
       
        setFormData({name:data.user?.name || "",
          phone:data.user?.phone || "",
          avtar:data.user?.avatar || ""
        })
      }catch(error){
        console.log("Failed to fetch the userdetails or the paymentDetails::",error)
        setFailed(true)
      }finally{
        setResLoading(false)
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

    const handleSubmit = async (e) => {
      e.preventDefault()
      setSending(false)

      setErrorStatus({ status: "success", msg: "" })

      //Name validation
      if (!formData.name.trim()) {
        setErrorStatus({
          status: "failed",
          msg: "Name is required",
        })
        return
      }

      // Mobile validation
      if (!formData.phone.trim()) {
        setErrorStatus({
          status: "failed",
          msg: "Mobile number is required",
        })
        return
      }

      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(formData.phone)) {
        setErrorStatus({
          status: "failed",
          msg: "Enter a valid 10-digit mobile number",
        })
        return
      }

      try {
        const response = await authFetch(`/api/users/${user?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            avatar: formData.avtar,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setErrorStatus({
            status: "failed",
            msg: data?.message || "Update failed",
          })
          return
        }

        // Success
        setErrorStatus({
          status: "success",
          msg: "Profile updated successfully",
        })

        setShowModel(false)
        await loadData();
      } catch (error) {
        setErrorStatus({
          status: "failed",
          msg: "Something went wrong. Please try again.",
        })
      }finally{
        setSending(false)
      }
}
const formatDate=(dateString: string)=> {
  const date = new Date(dateString)

  return date.toLocaleDateString("en-US", {
    month: "short", // Jan, Feb, Mar
    day: "2-digit",
    year: "numeric",
  })
}



   if(resLoading || loading){
        return(
             <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
        )
    }
    
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-orangeButton my-custom-class">
          Billing & Subscription
        </h1>
        <p className="text-lg text-gray-500">
          Manage your subscription and billing details
        </p>
      </div>

      {/* Top Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Details */}
        <Card className="rounded-xl bg-white py-2">
          <CardHeader className="flex mt-0 flex-row items-start justify-between">
            <div>
              <CardTitle className="text-orangeButton h-6 my-custom-class text-lg">
                Contact Details:
              </CardTitle>
              <p className="text-xs text-gray-500">
                Who should we contact if necessary?
              </p>
            </div>
            <Button className="rounded-xl" variant="outline" size="sm" onClick={()=>setShowModel(true)}>
              Update/Edit
            </Button>
          </CardHeader>

          <CardContent className="flex gap-4 items-center">
            <img
              src={userDetails?.avatar || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200"}
              alt="avatar"
              className="h-20 w-20 rounded-full object-cover"
            />
            <div className="space-y-1">
              <p className="font-semibold">{userDetails.name}</p>
              <p className="text-sm text-gray-500">
                Email: {userDetails.email}
              </p>
              {/* <p className="text-sm text-gray-500">
                Alt : {billingContact.altEmail}
              </p> */}
              <p className="text-sm text-gray-500">
                {userDetails?.phone || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Plan + Card */}
        <div className="space-y-2">
          {isExpired&&<span className="text-red-500 text-sm">{`Your plan is expired take a new plan (or) renew plan`}</span>}
          <Card className="rounded-2xl bg-white py-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="h-10">
                <CardTitle className="text-orangeButton h-6 my-custom-class text-lg">
                  Plan: {subscriptionDetails?.title} 
                </CardTitle>
                <p className="text-xs text-gray-500 leading-tight">
                  Take your portfolio to next level with more features
                </p>
              </div>
              <Button className="rounded-xl" variant="outline" size="sm" onClick={()=>router.push("/agency/dashboard/account/subscriptions")}>
                Upgrade Plan
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600 font-medium">
                {`$${subscriptionDetails?.price || 0} / ${subscriptionDetails?.billingCycle || "Monthly"}`}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-white py-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Card Details</CardTitle>
              <Button className="rounded-xl" variant="outline" size="sm">
                Update
              </Button>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="border text-blueButton rounded-xl px-2 py-1 font-semibold">
                {cardDetails.brand}
              </div>
              <div>
                <p className="text-sm">
                  {cardDetails.brand} ending in
                </p>
                <p className="text-sm text-gray-500">
                  ********{cardDetails.last4}
                </p>
              </div>
              <span className="ml-auto text-blue-600 text-xs">
                Primary Card
              </span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h2 className="text-xl font-semibold text-orangeButton my-custom-class">
          Billing History
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Summery on the payment history for the subscription plan on the Applications
        </p>

        <Card className="rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">Invoice</th>
                  <th className="text-left px-4 py-3">Billing Date</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  {/* <th className="px-4 py-3 text-right">Plan</th> */}
                </tr>
              </thead>
              {
                (paymentDetails || []).length>0?
                (<tbody>
                {paymentDetails.map((row) => (
                  <tr
                    key={row._id}
                    className="border-t last:border-b"
                  >
                    <td className="px-4 py-3">
                      Invoice {row.razorpayPaymentId}
                    </td>
                    <td className="px-4 py-3">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          row.status === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }
                      >
                        ● {row.status === "success"?row.status:"failed"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">${row.amount}</td>
                    {/* <td className="px-4 py-3 text-right">
                 <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4 text-gray-500" />
                      </Button> 
                    </td> */}
                  </tr>
                ))}
              </tbody>)
                :
                (
                  <tbody>
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-xl text-center text-gray-500"
                      >
                        No payments done up to now
                      </td>
                    </tr>
                  </tbody>

                )
              }
            </table>
          </CardContent>
        </Card>
      </div>
      
      {/*Edit Modal */}

       {showModel && (
                    <Dialog open={showModel} onOpenChange={setShowModel}>
                     <DialogContent className=" md:max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#F4561C]">
                      Update Your Personal Details 
                    </DialogTitle>
                  </DialogHeader>
      
                  <form onSubmit={handleSubmit} className="space-y-6">
                             {/*Avtar Image*/}
                             <div className="space-y-2">
                                <ImageUpload
                                label="Profile Image"
                                value={formData.avtar}
                                onChange={(value) => setFormData({ ...formData, avtar: value })}
                                description="Upload your Profile image (PNG, JPG) or provide a URL"
                                previewClassName="w-24 h-24"
                                />
                             </div>

                             {/*name */}

                              <div className="space-y-2">
                                <Label htmlFor="nameUser" className="text-[#000]  text-[14px] font-bold">Name</Label>
                                <Input
                                  id="nameUser" 
                                  value={formData.name}
                                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                                
                                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                  placeholder="e.g.,John Doe"
                                  required
                                />
                              </div>

                              {/*phone */}
                              <div className="space-y-2">
                                  <Label htmlFor="phone" className="text-[#000]  text-[14px] font-bold">Phone</Label>
                                  <Input
                                    id="phone"
                                    
                                    value={formData.phone}
                                    className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                    placeholder="8765907656"
                                    
                                  />
                                </div>
                                {
                                  errorStatus.status!=="success" &&(
                                    <p className="text-sm text-red-400">{errorStatus.msg}</p>
                                  )
                                }
                    
                              <div className="flex gap-4 pt-4">
                                <DialogClose>
                                   <Button  className=" bg-[#000] hover:bg-[#000] active:bg-[#000] rounded-full">
                                    Cancle
                                  </Button>
                                </DialogClose>
                                <Button type="submit" 
                                className="  bg-[#2C34A1] hover:bg-[#2C34A1] active:bg-[#2C34A1] rounded-full" 
                                disabled={sending}>
                                  {`${sending?"Updating":"Update"}`}
                                </Button>
                                
                                
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                     
        )}
    </div>
  )
}
