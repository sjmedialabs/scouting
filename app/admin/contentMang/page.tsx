"use client";

import { useEffect, useState,useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/file-upload";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { authFetch } from "@/lib/auth-fetch";
import { ImageUpload } from "@/components/ui/image-upload";
import { Label } from "recharts";
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"
import PrivacyPolicy from "@/components/privacy-policy/PrivacyPolicy";


export default function ContentManagementPage() {
  const [cms, setCMS] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const modules = useMemo(() => ({
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link"],
    ["clean"],
  ],
}), [])

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
]

  // Load existing CMS data
  useEffect(() => {
    async function load() {
      const res = await authFetch("/api/cms");
      const data = await res.json();
      setCMS(data.data || {});
    }
    load();
  }, []);

  const updateField = (field: string, value: any) => {
    setCMS((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateNested = (group: string, field: string, value: any) => {
    setCMS((prev: any) => ({
      ...prev,
      [group]: { ...prev[group], [field]: value },
    }));
  };

  const handleAdd = (field: string, item: any) => {
    setCMS((prev: any) => ({
      ...prev,
      [field]: [...prev[field], item],
    }));
  };

  const handleRemove = (field: string, index: number) => {
    setCMS((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleHelpCenterAdd = (field: string, item: any) => {
    setCMS((prev: any) => ({
      ...prev,
      helpCenter:{
        ...prev?.helpCenter,
        leftSidePoints:[...(prev?.helpCenter?.leftSidePoints || []),item]
      }
    }));
  };
  const handleHelpCenterRemove = (field: string, index: number) => {
    setCMS((prev: any) => ({
      ...prev,
     
      helpCenter:{
        ...prev?.helpCenter,
        leftSidePoints:prev.helpCenter.leftSidePoints.filter((_: any, i: number) => i !== index),
      }
    }));
  };

  const handlePrivacyPolicyAdd = (field: string, item: any) => {
    setCMS((prev: any) => ({
      ...prev,
      privacyPolicy:{
        ...prev?.privacyPolicy,
        descriptionPoints:[...(prev?.privacyPolicy?.descriptionPoints || []),item]
      }
    }));
  };

  const handlePrivacyPolicyRemove = (field: string, index: number) => {
    setCMS((prev: any) => ({
      ...prev,
     
      privacyPolicy:{
        ...prev?.privacyPolicy,
        descriptionPoints:prev.privacyPolicy.descriptionPoints.filter((_: any, i: number) => i !== index),
      }
    }));
  };

  const handleTermServicesAdd = (field: string, item: any) => {
    setCMS((prev: any) => ({
      ...prev,
      termServices:{
        ...prev?.termServices,
        descriptionPoints:[...(prev?.termServices?.descriptionPoints || []),item]
      }
    }));
  };

  const handleTermServicesRemove = (field: string, index: number) => {
    setCMS((prev: any) => ({
      ...prev,
     
      termServices:{
        ...prev?.termServices,
        descriptionPoints:prev.termServices.descriptionPoints.filter((_: any, i: number) => i !== index),
      }
    }));
  };
  console.log("CMS------------",cms)


  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    console.log("Saving CMS data:", cms);
    const res = await authFetch("/api/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cms),
    });

    const data = await res.json();
    setMessage(data.success ? "Saved Successfully!" : data.error);
    console.log("CMS save response:", data);
    setLoading(false);
  };

  const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone); // Indian 10-digit mobile
};


  if (!cms) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h1 className="text-2xl font-bold my-custom-class text-orangeButton">CMS Management</h1>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid grid-cols-6 mb-6 border rounded-xl shadow-lg">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="help-center">Help-Center</TabsTrigger>
          <TabsTrigger value="privacy-policy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="term-services">Terms and Services</TabsTrigger>
        </TabsList>

        {/* ─────────────────────────────── HOME TAB ─────────────────────────────── */}
        <TabsContent value="home" className="space-y-6">
          {/* HERO SECTION */}
          <section className="space-y-4 border p-4 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold my-custom-class text-orangeButton">Hero Section</h2>

            {/* <FileUpload
              value={cms.homeBannerImg}
              onChange={(url) => updateField("homeBannerImg", url)}
              accept="image/*"
            /> */}
            <ImageUpload
                value={cms.homeBannerImg}
                onChange={(url) => updateField("homeBannerImg", url)}
                description="Upload homepage banner  (PNG, JPG) or provide a URL"
                previewClassName="w-100 h-24"
              />

            <Input
              placeholder="Home Banner Title"
              className="border-gray-200 rounded-xl placeholder:text-gray-300"
              value={cms.homeBannerTitle}
              onChange={(e) => updateField("homeBannerTitle", e.target.value)}
            />

            {/* <Input
              placeholder="Home Banner Subtitle"
              className="border-gray-200 rounded-xl placeholder:text-gray-300"
              value={cms.homeBannerSubtitle}
              onChange={(e) =>
                updateField("homeBannerSubtitle", e.target.value)
              }
            /> */}
          </section>

          {/* HOME WORK SECTION */}
          <section className="space-y-4 border p-4 rounded-xl shadow-lg">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold my-custom-class text-orangeButton">How Spark Works</h2>
              <Button
              className="rounded-full"
                onClick={() =>
                  handleAdd("homeWorkSection", {
                    title: "",
                    description: "",
                    image: "",
                  })
                }
              >
                + Add Step
              </Button>
            </div>

            {cms.homeWorkSection?.map((item: any, index: number) => (
              <div key={index} className="border p-3 rounded-xl space-y-2">
                

                {/* <FileUpload
                  value={item.image}
                  onChange={(url) => {
                    const updated = [...cms.homeWorkSection];
                    updated[index].image = url;
                    updateField("homeWorkSection", updated);
                  }}
                  accept="image/*"
                /> */}
                 <ImageUpload
                  value={item.image}
                  onChange={(url) => {
                        const updated = [...cms.homeWorkSection];
                        updated[index].image = url;
                        updateField("homeWorkSection", updated);
                      }}
                    description="Upload Image (PNG, JPG) or provide a URL"
                    previewClassName="w-100 h-24"
              />

                <Input
                  placeholder="Title"
                  className="border-gray-200 rounded-xl placeholder:text-gray-200"
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...cms.homeWorkSection];
                    updated[index].title = e.target.value;
                    updateField("homeWorkSection", updated);
                  }}
                />

                <Textarea
                className="border-gray-200 rounded-xl placeholder:text-gray-200"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...cms.homeWorkSection];
                    updated[index].description = e.target.value;
                    updateField("homeWorkSection", updated);
                  }}
                />

                <Button
                className="rounded-full"
                  variant="destructive"
                  onClick={() => handleRemove("homeWorkSection", index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </section>

          {/* HOME SERVICE CATEGORIES */}
          <section className="space-y-4 border p-4 rounded-xl shadow-lg">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Home Service Section</h2>
              {/* <Button onClick={() => handleAdd("homeServicesCategories", "")}>
                + Add Category
              </Button> */}
            </div>
            <label className="text-md text-gray-600 ">Title</label>
            <Input
              placeholder="Home Services Title"
              className="border-gray-200 rounded-xl placeholder:text-gray-300"
              value={cms.homeServiceTitle}
              onChange={(e) =>
                updateField("homeServiceTitle", e.target.value)
              }
            />
            <label className="text-md text-gray-600 ">Sub-Title</label>
            <Input
              placeholder="Home Services Title"
              className="border-gray-200 rounded-xl placeholder:text-gray-300"
              value={cms.homeServiceSubTitle}
              onChange={(e) =>
                updateField("homeServiceSubTitle", e.target.value)
              }
            />

            {/* {cms.homeServicesCategories?.map((cat: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={cat}
                  onChange={(e) => {
                    const updated = [...cms.homeServicesCategories];
                    updated[index] = e.target.value;
                    updateField("homeServicesCategories", updated);
                  }}
                />
                <Button
                  variant="destructive"
                  onClick={() => handleRemove("homeServicesCategories", index)}
                >
                  Remove
                </Button>
              </div>
            ))} */}
          </section>

          {/*Recent Requirments */}
            <section className="space-y-4 border p-4 rounded-xl shadow-lg">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Recent Requirements Section</h2>
              
            </div>
            <label className="text-md text-gray-600 ">Title</label>
            <Input
              placeholder="Recent Requirement Title"
              className="border-gray-200 rounded-xl placeholder:text-gray-300"
              value={cms.recentRequirementTitle}
              onChange={(e) =>
                updateField("recentRequirementTitle", e.target.value)
              }
            />
            <label className="text-md text-gray-600 ">Sub-Title</label>
            <Input
              placeholder="Recent Requirement Title"
              className="border-gray-200 rounded-xl placeholder:text-gray-300"
              value={cms.recentRequirementSubTitle}
              onChange={(e) =>
                updateField("recentRequirementSubTitle", e.target.value)
              }
            />

            
          </section>

          {/*Top Providers Sction */}
             <section className="space-y-4 border p-4 rounded-xl shadow-lg">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Top Providers Section</h2>
              
            </div>
            <label className="text-md text-gray-600 ">Title</label>
            <Input
              placeholder="Top providers section title"
              className="border-gray-200 rounded-xl placeholder:text-gray-300"
              value={cms.topProvidersTitle}
              onChange={(e) =>
                updateField("topProvidersTitle", e.target.value)
              }
            />
            <label className="text-md text-gray-600 ">Sub-Title</label>
            <Input
              placeholder="Top providers section sub-title"
              className="border-gray-200 rounded-xl placeholder:text-gray-300"
              value={cms.topProvidersSubTitle}
              onChange={(e) =>
                updateField("topProvidersSubTitle", e.target.value)
              }
            />

            
          </section>

          {/* GET STARTED */}
          <section className="space-y-4 border p-4 rounded">
            <h2 className="text-xl font-semibold">Get Started Section</h2>

            <Input
              placeholder="Title"
              value={cms.getStartedTitle}
              onChange={(e) => updateField("getStartedTitle", e.target.value)}
              className="border-gray-200 rounded-xl placeholder:text-gray-300"
            />

            <Input
              placeholder="Subtitle"
              value={cms.getStartedSubtitle}
              onChange={(e) =>
                updateField("getStartedSubtitle", e.target.value)
              }
              className="border-gray-200 rounded-xl placeholder:text-gray-300"
            />
          </section>
        </TabsContent>

        {/* ─────────────────────────────── ABOUT TAB ─────────────────────────────── */}
        <TabsContent value="about" className="space-y-6">
          <section className="border p-4 rounded space-y-4">
            <h2 className="text-xl font-semibold">About Banner</h2>

            {/* <FileUpload
              value={cms.aboutBannerImage}
              onChange={(url) => updateField("aboutBannerImage", url)}
            /> */}

             <ImageUpload
                value={cms.aboutBannerImage}
                onChange={(url) => updateField("aboutBannerImage", url)}
                description="Upload aboutpage banner  (PNG, JPG) or provide a URL"
                previewClassName="w-100 h-24"
              />
             <label className="text-md text-gray-600 ">Title</label>
            <Input
              placeholder="About Banner Title"
              value={cms.aboutBannerTitle}
              onChange={(e) => updateField("aboutBannerTitle", e.target.value)}
               className="border-gray-200 rounded-xl placeholder:text-gray-300"
            />
 
             <label className="text-md text-gray-600 ">Sub-Title</label>
            <Input
              placeholder="About Banner Subtitle"
              value={cms.aboutBannerSubtitle}
              onChange={(e) =>
                updateField("aboutBannerSubtitle", e.target.value)
              }
               className="border-gray-200 rounded-xl placeholder:text-gray-300"
            />
          </section>

          {/* ABOUT DESCRIPTION */}
          <section className="border p-4 rounded space-y-4">
            <h2 className="text-xl font-semibold">About Second Section</h2>
          
             <label className="text-md text-gray-600 ">Description 1</label>
            <Textarea
              placeholder="Description 1"
              value={cms.aboutDescription1}
              onChange={(e) => updateField("aboutDescription1", e.target.value)}
              className="border-gray-200 rounded-xl placeholder:text-gray-300"
            />

             <label className="text-md text-gray-600 ">Description 2</label>
            <Textarea
              placeholder="Description 2"
              value={cms.aboutDescription2}
              onChange={(e) => updateField("aboutDescription2", e.target.value)}
              className="border-gray-200 rounded-xl placeholder:text-gray-300"
            />

            
             <div className="flex justify-between">
              <h2 className="text-xl font-semibold">About Points</h2>
              <Button onClick={() => handleAdd("aboutPoints", "")}>
                + Add
              </Button>
            </div>

            {/*About side image */}

            {cms.aboutPoints?.map((point: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={point}
                  onChange={(e) => {
                    const updated = [...cms.aboutPoints];
                    updated[index] = e.target.value;
                    updateField("aboutPoints", updated);

                  }}
                  placeholder="Enter your point description"
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />
                <Button
                  variant="destructive"
                  onClick={() => handleRemove("aboutPoints", index)}
                >
                  Remove
                </Button>
              </div>
            ))}
             
          {/*About points */}
           <div>
            <h2 className="text-xl font-semibold">About Side Image</h2>

            {/* <FileUpload
              value={cms.aboutSideImage}
              onChange={(url) => updateField("aboutSideImage", url)}
            /> */}
            <ImageUpload
                value={cms.aboutSideImage}
                onChange={(url) => updateField("aboutSideImage", url)}
                description="Upload aboutpage second section side image  (PNG, JPG) or provide a URL"
                previewClassName="w-24 h-24"
              />
           </div>
          
          </section>

          {/* ABOUT POINTS */}
          {/* <section className="border p-4 rounded space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">About Points</h2>
              <Button onClick={() => handleAdd("aboutPoints", "")}>
                + Add
              </Button>
            </div>

            {cms.aboutPoints?.map((point: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={point}
                  onChange={(e) => {
                    const updated = [...cms.aboutPoints];
                    updated[index] = e.target.value;
                    updateField("aboutPoints", updated);
                  }}
                />
                <Button
                  variant="destructive"
                  onClick={() => handleRemove("aboutPoints", index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </section> */}
          {/* ABOUT SIDE IMAGE */}
          {/* <section className="border p-4 rounded space-y-4">
            <h2 className="text-xl font-semibold">About Side Image</h2>

            <FileUpload
              value={cms.aboutSideImage}
              onChange={(url) => updateField("aboutSideImage", url)}
            />
          </section> */}
          {/* ABOUT VISION / MISSION */}
          <section className="border p-4 rounded space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Vision & Mission Cards</h2>
              <Button
                onClick={() =>
                  handleAdd("aboutVisionCard", {
                    icon: "",
                    title: "",
                    description: "",
                  })
                }
              >
                + Add Card
              </Button>
            </div>

            {cms.aboutVisionCard?.map((item: any, index: number) => (
              <div key={index} className="border p-3 rounded space-y-3">
                {/* <FileUpload
                  value={item.icon}
                  onChange={(url) => {
                    const updated = [...cms.aboutVisionCard];
                    updated[index].icon = url;
                    updateField("aboutVisionCard", updated);
                  }}
                /> */}
                <ImageUpload
               value={item.icon}
                onChange={(url) => {
                    const updated = [...cms.aboutVisionCard];
                    updated[index].icon = url;
                    updateField("aboutVisionCard", updated);
                  }}
                description="Upload Icon image  (PNG, JPG) or provide a URL"
                previewClassName="w-24 h-24"
              />


                <label className="text-md text-gray-600 ">Title</label>
                <Input
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...cms.aboutVisionCard];
                    updated[index].title = e.target.value;
                    updateField("aboutVisionCard", updated);
                  }}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />

                 <label className="text-md text-gray-600 ">Description</label>
                <Textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...cms.aboutVisionCard];
                    updated[index].description = e.target.value;
                    updateField("aboutVisionCard", updated);
                  }}
                   className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />

                <Button
                  variant="destructive"
                  onClick={() => handleRemove("aboutVisionCard", index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </section>
          {/* ABOUT STATS */}
          <section className="border p-4 rounded space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">About Stats</h2>
              <Button
                onClick={() => handleAdd("aboutStats", { value: "", text: "" })}
              >
                + Add Stat
              </Button>
            </div>

            {cms.aboutStats?.map((stat: any, index: number) => (
              <div key={index} className="border p-3 rounded space-y-3">
                <Input
                  placeholder="Value (ex: 50,000+)"
                  value={stat.value}
                  onChange={(e) => {
                    const updated = [...cms.aboutStats];
                    updated[index].value = e.target.value;
                    updateField("aboutStats", updated);
                  }}
                   className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />

                <Input
                  placeholder="Label (ex: Active Users)"
                  value={stat.text}
                  onChange={(e) => {
                    const updated = [...cms.aboutStats];
                    updated[index].text = e.target.value;
                    updateField("aboutStats", updated);
                  }}
                   className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />
                {/* <FileUpload
                  value={stat.imageUrl}
                  onChange={(url) => {
                    const updated = [...cms.aboutStats];
                    updated[index].imageUrl = url;
                    updateField("aboutStats", updated);
                  }}
                /> */}
                <ImageUpload
              value={stat.imageUrl}
                onChange={(url) => {
                    const updated = [...cms.aboutStats];
                    updated[index].imageUrl = url;
                    updateField("aboutStats", updated);
                  }}
                description="Upload Icon image  (PNG, JPG) or provide a URL"
                previewClassName="w-24 h-24"
              />
                <Button
                  variant="destructive"
                  onClick={() => handleRemove("aboutStats", index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </section>

         {/*About Team Values */}
         

           <section className="border p-4 rounded space-y-4">
            <h2 className="text-xl font-semibold">Team Section</h2>

            <Input
              placeholder="Team Title"
              value={cms.aboutTeamTitle}
              onChange={(e) => updateField("aboutTeamTitle", e.target.value)}
              className="border-gray-200 rounded-xl placeholder:text-gray-300"
            />

            <Input
              placeholder="Team Subtitle"
              value={cms.aboutTeamSubtitle}
              onChange={(e) => updateField("aboutTeamSubtitle", e.target.value)}
              className="border-gray-200 rounded-xl placeholder:text-gray-300"
            />


            {/*Team List */}

            <div>
              <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Team Members</h2>
              <Button
                onClick={() =>
                  handleAdd("aboutTeam", {
                    image: "",
                    name: "",
                    role: "",
                  })
                }
              >
                + Add Member
              </Button>
            </div>

            {cms.aboutTeam?.map((member: any, index: number) => (
              <div key={index} className="border p-4 rounded space-y-3">
                {/* <FileUpload
                  value={member.image}
                  onChange={(url) => {
                    const updated = [...cms.aboutTeam];
                    updated[index].image = url;
                    updateField("aboutTeam", updated);
                  }}
                /> */}
                 <ImageUpload
                value={member.image}
                onChange={(url) => {
                    const updated = [...cms.aboutTeam];
                    updated[index].image = url;
                    updateField("aboutTeam", updated);
                  }}
                description="Upload aboutpage banner  (PNG, JPG) or provide a URL"
                previewClassName="w-24 h-24"
              />

                <Input
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => {
                    const updated = [...cms.aboutTeam];
                    updated[index].name = e.target.value;
                    updateField("aboutTeam", updated);
                  }}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />

                <Input
                  placeholder="Role"
                  value={member.role}
                  onChange={(e) => {
                    const updated = [...cms.aboutTeam];
                    updated[index].role = e.target.value;
                    updateField("aboutTeam", updated);
                  }}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />

                <Button
                  variant="destructive"
                  onClick={() => handleRemove("aboutTeam", index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            </div>
             
          </section>

        

          {/* VALUES SECTION TITLE */}
          <section className="border p-4 rounded space-y-4">
            <h2 className="text-xl font-semibold">Values Section Title</h2>

            <Input
              placeholder="Values Title"
              value={cms.aboutValuesTitle}
              onChange={(e) => updateField("aboutValuesTitle", e.target.value)}
              className="border-gray-200 rounded-xl placeholder:text-gray-300"
            />

            {/*About values */}
            <div>
              <div className="flex justify-between">
              <h2 className="text-xl font-semibold">About Values</h2>
              <Button
                onClick={() =>
                  handleAdd("aboutValues", { title: "", description: "" })
                }
              >
                + Add Value
              </Button>
            </div>

            {cms.aboutValues?.map((value: any, index: number) => (
              <div key={index} className="border p-3 rounded space-y-3">
                <Input
                  placeholder="Title"
                  value={value.title}
                  onChange={(e) => {
                    const updated = [...cms.aboutValues];
                    updated[index].title = e.target.value;
                    updateField("aboutValues", updated);
                  }}
                   className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />

                <Textarea
                  placeholder="Description"
                  value={value.description}
                  onChange={(e) => {
                    const updated = [...cms.aboutValues];
                    updated[index].description = e.target.value;
                    updateField("aboutValues", updated);
                  }}
                   className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />
                {/* <FileUpload
                  value={value.imageUrl}
                  onChange={(url) => {
                    const updated = [...cms.aboutValues];
                    updated[index].imageUrl = url;
                    updateField("aboutValues", updated);
                  }}
                /> */}
                <ImageUpload
              value={value.imageUrl}
                onChange={(url) => {
                    const updated = [...cms.aboutValues];
                    updated[index].imageUrl = url;
                    updateField("aboutValues", updated);
                  }}
                description="Upload Icon image  (PNG, JPG) or provide a URL"
                previewClassName="w-24 h-24"
              />
                <Button
                  variant="destructive"
                  onClick={() => handleRemove("aboutValues", index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            </div>
          </section>
          {/* ABOUT BOTTOM SECTION */}
          <section className="border p-4 rounded space-y-4">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold">About Bottom Section</h2>
              <div>
                <label className="text-md text-gray-600">Title</label>
                <Input
                  placeholder="Title"
                  value={cms.aboutBottomSectionTitle}
                  onChange={(e) => updateField("aboutBottomSectionTitle", e.target.value)}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300 mb-2"
                />
                <label className="text-md text-gray-600 ">Sub-Title</label>
                <Input
                  placeholder="Subtitle"
                  value={cms.aboutBottomSectionSubTitle}
                  onChange={(e) => updateField("aboutBottomSectionSubTitle", e.target.value)}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />
              </div>
            </div>
          </section>
        </TabsContent>

       

        {/* ─────────────────────────────── CONTACT TAB ─────────────────────────────── */}
        <TabsContent value="contact" className="space-y-6">
          <section className="space-y-4 border p-4 rounded">
            <h2 className="text-xl font-semibold">Contact Details</h2>

           <Input
              type="email"
              placeholder="Email"
              value={cms.contact?.email}
              onChange={(e) => updateNested("contact", "email", e.target.value)}
              onBlur={(e) => {
                if (e.target.value && !isValidEmail(e.target.value)) {
                  alert("Please enter a valid email address");
                }
              }}
              className="border-gray-200 rounded-xl placeholder:text-gray-400"
            />


            <Input
              type="email"
              placeholder="Info Email"
              value={cms.contact?.infoEmail}
              onChange={(e) => updateNested("contact", "infoEmail", e.target.value)}
              onBlur={(e) => {
                if (e.target.value && !isValidEmail(e.target.value)) {
                  alert("Please enter a valid info email");
                }
              }}
              className="border-gray-200 rounded-xl placeholder:text-gray-400"
            />


           <Input
            type="email"
            placeholder="Support Email"
            value={cms.contact?.supportEmail}
            onChange={(e) => updateNested("contact", "supportEmail", e.target.value)}
            onBlur={(e) => {
              if (e.target.value && !isValidEmail(e.target.value)) {
                alert("Please enter a valid support email");
              }
            }}
            className="border-gray-200 rounded-xl placeholder:text-gray-400"
          />



            <Input
              type="tel"
              placeholder="Phone"
              value={cms.contact?.phone}
              onChange={(e) => updateNested("contact", "phone", e.target.value)}
              onBlur={(e) => {
                if (e.target.value && !isValidPhone(e.target.value)) {
                  alert("Please enter a valid 10-digit mobile number");
                }
              }}
              className="border-gray-200 rounded-xl placeholder:text-gray-400"
            />

           <Input
            type="tel"
            placeholder="Phone number 2"
            value={cms.contact?.phone2}
            onChange={(e) => updateNested("contact", "phone2", e.target.value)}
            onBlur={(e) => {
              if (e.target.value && !isValidPhone(e.target.value)) {
                alert("Please enter a valid 10-digit mobile number");
              }
            }}
            className="border-gray-200 rounded-xl placeholder:text-gray-400"
          />


            <Textarea
              placeholder="Address"
              value={cms.contact?.address}
              onChange={(e) =>
                updateNested("contact", "address", e.target.value)
              }
              className="border-gray-200 rounded-xl placeholder:text-gray-400"
            />

            <Input
              placeholder="Map URL"
              value={cms.contact?.locationMapUrl}
              onChange={(e) =>
                updateNested("contact", "locationMapUrl", e.target.value)
              }
              className="border-gray-200 rounded-xl placeholder:text-gray-400"
            />

            <Input
              placeholder="Facebook URL"
              value={cms.contact?.facebookUrl}
              onChange={(e) =>
                updateNested("contact", "facebookUrl", e.target.value)
              }
              className="border-gray-200 rounded-xl placeholder:text-gray-400"
            />

            <Input
              placeholder="LinkedIn URL"
              value={cms.contact?.linkedinUrl}
              onChange={(e) =>
                updateNested("contact", "linkedinUrl", e.target.value)
              }
              className="border-gray-200 rounded-xl placeholder:text-gray-400"
            />

            <Input
              placeholder="Twitter URL"
              value={cms.contact?.twitterUrl}
              onChange={(e) =>
                updateNested("contact", "twitterUrl", e.target.value)
              }
              className="border-gray-200 rounded-xl placeholder:text-gray-400"
            />

            <Input
              placeholder="Youtube URL"
              value={cms.contact?.youtubeUrl}
              onChange={(e) =>
                updateNested("contact", "youtubeUrl", e.target.value)
              }
              className="border-gray-200 rounded-xl placeholder:text-gray-400"
            />
            <Input
              placeholder="Footer Copy right message"
              value={cms.contact?.footerCopyRightMsg}
              onChange={(e) =>
                updateNested("contact", "footerCopyRightMsg", e.target.value)
              }
              className="border-gray-200 rounded-xl placeholder:text-gray-400"
            />
          </section>
        </TabsContent>

        {/*---------------------------------------Help center Tab */}
        <TabsContent value="help-center" className="space-y-6">
            <section className="border p-4 rounded space-y-4">
                <h2 className="text-xl font-semibold">Help Center</h2>

                <label className="text-md text-gray-600 ">Title</label>
                <Input
                  placeholder="Help Center Title"
                  value={cms?.helpCenter?.title}
                   onChange={(e) => updateNested("helpCenter", "title", e.target.value)}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />
              
            </section>
            <section className="border p-4 rounded space-y-4">
                <h2 className="text-xl font-semibold">Left Side Section</h2>

                <label className="text-md text-gray-600 ">Title</label>
                <Input
                  placeholder="Help Center Title"
                  value={cms?.helpCenter?. leftSideTitle}
                   onChange={(e) => updateNested("helpCenter", "leftSideTitle", e.target.value)}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />

                {/*Points array */}

                 <section className="border p-4 rounded space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Left side points</h2>
              <Button
                onClick={() =>
                  handleHelpCenterAdd("helpCenter", {
                    title: "",
                    urlToRedirect: "",
                  })
                }
              >
                + Add Card
              </Button>
            </div>

            {cms?.helpCenter?.leftSidePoints?.map((item: any, index: number) => (
              <div key={index} className="border p-3 rounded space-y-3">

                <label className="text-md text-gray-600 ">Title</label>
                <Input
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...cms?.helpCenter.leftSidePoints];
                    updated[index].title = e.target.value;
                    updateNested("helpCenter","leftSidePoints", updated);
                  }}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />

                 <label className="text-md text-gray-600 ">URL</label>
                <Input
                  placeholder="/login"
                  value={item.urlToRedirect}
                  onChange={(e) => {
                    const updated = [...cms?.helpCenter.leftSidePoints];
                    updated[index].urlToRedirect = e.target.value;
                    updateNested("helpCenter","leftSidePoints", updated);
                  }}
                   className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />

                <Button
                  variant="destructive"
                  onClick={() => handleHelpCenterRemove("helpCenter", index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </section>
              
            </section>
             <section className="border p-4 rounded space-y-4">
                <h2 className="text-xl font-semibold">Right Side Section</h2>
                <label className="text-md text-gray-600 ">Title</label>
                <Input
                  placeholder="Help Center Title"
                  value={cms?.helpCenter?.rightSideTitle}
                   onChange={(e) => updateNested("helpCenter", "rightSideTitle", e.target.value)}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />
                <label className="text-md text-gray-600 ">Decription</label>
                <Input
                  placeholder="We use a proprietary ranking"
                  value={cms?.helpCenter?.rightSideDescription}
                   onChange={(e) => updateNested("helpCenter", "rightSideDescription", e.target.value)}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />

                 <label className="text-md text-gray-600 ">Decription 2</label>
                 <ReactQuill
                    className="rounded-xl placeholder:text-gray-300 shadow-md border-gray-200"
                    value={cms?.helpCenter.rightSideDescription2}
                    placeholder="Enter your description"
                    onChange={(value) =>
                      updateNested("helpCenter", "rightSideDescription2", value)
                    }
                    modules={modules}
                    formats={formats}
                  />


              </section>
            
        </TabsContent>

        {/*--------------------------------Privacy Policy----------------------------- */}
        <TabsContent value="privacy-policy" className="space-y-6">
         <section className="border p-4 rounded space-y-4">
                <h2 className="text-xl font-semibold">Privacy Policy</h2>
                <label className="text-md text-gray-600 ">Title</label>
                <Input
                  placeholder="Privacy Policy Title"
                  value={cms?.privacyPolicy?.title}
                   onChange={(e) => updateNested("privacyPolicy", "title", e.target.value)}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />
                <label className="text-md text-gray-600 ">Sub Title</label>
                <Input
                  placeholder="Privacy Policy SubTitle"
                  value={cms?.privacyPolicy?.subTitle}
                   onChange={(e) => updateNested("privacyPolicy", "subTitle", e.target.value)}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />
          </section>
          {/*privacy policay description pooints */}
          <section className="border p-4 rounded space-y-4">
            
             <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Privacy Policy Section Two</h2>
              <Button
                onClick={() =>
                  handlePrivacyPolicyAdd("privacyPolicy", {
                    title: "",
                    description: "",
                  })
                }
              >
                + Add Card
              </Button>
            </div>

            {cms?.privacyPolicy?.descriptionPoints?.map((item: any, index: number) => (
              <div key={index} className="border p-3 rounded space-y-3">

                <label className="text-md text-gray-600 ">Title</label>
                <Input
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...cms?.privacyPolicy.descriptionPoints];
                    updated[index].title = e.target.value;
                    updateNested("privacyPolicy","descriptionPoints", updated);
                  }}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />

                 <label className="text-md text-gray-600 ">Description</label>
                {/* <Input
                  placeholder="we have some privacy policies"
                  value={item.urlToRedirect}
                  onChange={(e) => {
                    const updated = [...cms?.helpCenter.leftSidePoints];
                    updated[index].urlToRedirect = e.target.value;
                    updateNested("helpCenter","leftSidePoints", updated);
                  }}
                   className="border-gray-200 rounded-xl placeholder:text-gray-300"
                /> */}

                <ReactQuill
                    className="rounded-xl placeholder:text-gray-300 shadow-md border-gray-200"
                     value={item.description}
                    placeholder="Enter your description"
                    onChange={(value) => {
                    const updated = [...cms?.privacyPolicy.descriptionPoints];
                    updated[index].description =value;
                    updateNested("privacyPolicy","descriptionPoints", updated);
                  }}
                    modules={modules}
                    formats={formats}
                  />


                <Button
                  variant="destructive"
                  onClick={() => handlePrivacyPolicyRemove("privacyPolicy", index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </section>
        </TabsContent>

        {/*----------------------------------Term and services */}

        <TabsContent value="term-services" className="space-y-6">
           <section className="border p-4 rounded space-y-4">
                <h2 className="text-xl font-semibold">Terms & Services</h2>
                <label className="text-md text-gray-600 ">Title</label>
                <Input
                  placeholder="Term Service Title"
                  value={cms?.termServices?.title}
                   onChange={(e) => updateNested("termServices", "title", e.target.value)}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />
                <label className="text-md text-gray-600 ">Sub Title</label>
                <Input
                  placeholder="Term Services SubTitle"
                  value={cms?.termServices?.subTitle}
                   onChange={(e) => updateNested("termServices", "subTitle", e.target.value)}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />
          </section>
          {/*terms and services description pooints */}
          <section className="border p-4 rounded space-y-4">
            
             <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Term Services Section Two</h2>
              <Button
                onClick={() =>
                  handleTermServicesAdd("termServices", {
                    title: "",
                    description: "",
                  })
                }
              >
                + Add Card
              </Button>
            </div>

            {cms?.termServices?.descriptionPoints?.map((item: any, index: number) => (
              <div key={index} className="border p-3 rounded space-y-3">

                <label className="text-md text-gray-600 ">Title</label>
                <Input
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...cms?.termServices.descriptionPoints];
                    updated[index].title = e.target.value;
                    updateNested("termServices","descriptionPoints", updated);
                  }}
                  className="border-gray-200 rounded-xl placeholder:text-gray-300"
                />

                 <label className="text-md text-gray-600 ">Description</label>
                

                <ReactQuill
                    className="rounded-xl placeholder:text-gray-300 shadow-md border-gray-200"
                     value={item.description}
                    placeholder="Enter your description"
                    onChange={(value) => {
                    const updated = [...cms?.termServices.descriptionPoints];
                    updated[index].description =value;
                    updateNested("termServices","descriptionPoints", updated);
                  }}
                    modules={modules}
                    formats={formats}
                  />


                <Button
                  variant="destructive"
                  onClick={() => handleTermServicesRemove("termServices", index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </section>
        </TabsContent>


      </Tabs>

      <Button className="w-full mt-3" onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>

      {message && <p className="text-center text-sm mt-4">{message}</p>}
    </div>
  );
}
