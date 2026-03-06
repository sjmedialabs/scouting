"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { headers } from "next/headers"
import { useEffect, useState } from "react"



export default async function AboutPage() {
  const [resLoading, setResLoading] = useState(false);
  const [cms, setCms] = useState<any>(null);

  async function getAboutData() {
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

    const REVALIDATE_TIME = Number(process.env.CMS_REVALIDATE_TIME) || 10;
    const options = { next: { revalidate: REVALIDATE_TIME } };

    try {
      setResLoading(true);

      const res = await fetch(`/api/cms`, options);
      const result = await res.json();

      return result?.success ? result.data : null;
    } catch (e) {
      console.error("[AboutPage] CMS Fetch Error:", e);
      return null;
    } finally {
      setResLoading(false);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const data = await getAboutData();
      setCms(data);
    }

    fetchData();
  }, []);

  if (resLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="bg-background">
       {/* Hero Section */}
        <div className="flex flex-col justify-center items-center"
            style={{
              backgroundImage: `url("${cms?.aboutBannerImage}")`,
              height: "400px",
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: "100%",
            }}
          >


        <div className="text-center mb-16">
          <h1 className="text-2xl md:text-4xl font-bold mb-6 text-[#F54A0C] font-sans">{cms?.aboutBannerTitle}</h1>
          <p className="text-sm md:text-xl font-light  text-balance text-[#c3bfbf] font-sans md:max-w-2xl">
           {cms?.aboutBannerSubtitle}
          </p>
        </div>
        </div>
         
        <div className="py-10 px-8 lg:px-30">
          <div className="max-w-7xl mx-auto">
              {/*section One*/}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center justify-center">
              <div className="">
                  <p className="text-[16px] font-normal text-gray-500 font-sans mb-5">{cms?.aboutDescription1}</p>
                  <p className="text-[16px] font-normal text-gray-500 font-sans mb-5">{cms?.aboutDescription2}</p>
                  {cms?.aboutPoints?.map((point : any, i : number) => (
                    <div className="flex justify-start items-center gap-1" key={i}>
                      <svg width="18" height="18" viewBox="0 0 15 15" fill=" #F54A0C" xmlns="http://www.w3.org/2000/svg"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill=" #F54A0C" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                      <p className="text-[12px] font-normal font-sans text-gray-500">{point}</p>
                    </div>
                  ))
                  }
              </div>
              <div className="text-center">
                <img src={cms?.aboutSideImage} alt="right-side-image" className="max-w-full"/>
              </div>
              <div>
                
              </div>
            </div>
            
            {/*section two */}
            <div className="grid lg:grid-cols-2 gap-10 mt-12 mb-12">
              {cms?.aboutVisionCard?.map((item: any, i: number) => (
              <Card className="mb-3" style={{backgroundColor:"#fff"}} key={i}>
              <CardContent className="px-3 md:px-6">
                <img src={item.icon} alt="Our Vission image" className="h-[50px] w-[50px] ml-5 mb-3"/>
                <h1 className="text-md font-sans md:text-lg font-normal text-[#F54A0C]">{item.title}</h1>
                <p className="text-[12px] font-sans md:text-sm font-normal text-gray-500 mb-5 leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
              </Card>
              ))}
              {/* <Card className="mb-3" style={{backgroundColor:"#fff"}}>
              <CardContent className="px-3 md:px-6">
                <img src={aboutPageData.sectionTwo.ourMission.imageUrl} alt="Our Vission image" className="h-[50px] w-[50px] ml-[20px] mb-3"/>
                <h1 className="text-md font-sans md:text-lg font-normal text-[#F54A0C]">{aboutPageData.sectionTwo.ourMission.title}</h1>
                <p className="text-[14px] font-sans  md:text-sm font-normal text-gray-500 mb-5 leading-relaxed">
                  {aboutPageData.sectionTwo.ourMission.description}
                </p>
              </CardContent>
              </Card> */}
            </div>
          </div>
        </div>

       {/*Stats -section */}
         
        <div className="py-16 px-6 lg:px-20" style={{ backgroundColor: "#F54A0C" }}>
          <div className="grid grid-cols-1 md:grid-cols-4 text-center divide-y md:divide-y-0 md:divide-x divide-[#ffffff33]">
            
            {cms?.aboutStats?.map((stat : any, index : number) => (
              <div key={index} className="flex flex-col items-center py-6">
                
                <img
                  src={stat.imageUrl}
                  className="h-15 w-15 mb-4"
                  alt={stat.text}
                />

                <div className="text-3xl font-sans font-bold text-white mb-1">
                  {stat.value}
                </div>

                <div className="text-white font-sans text-lg font-light">
                  {stat.text}
                </div>

              </div>
            ))}

          </div>
        </div>

        {/*Team section */}
        <div className="py-10 px-8 lg:px-30">
           <h5 className="text-md font-normal text-[#F54A0C] text-center">{cms?.aboutTeamTitle}</h5>
           <h5 className="text-2xl font-normal text-black text-center max-w-[300px] mx-auto">
{cms?.aboutTeamSubtitle}
</h5>

          <div className="flex  gap-10 justify-center items-start  mt-[30px]">
            {cms?.aboutTeam?.map((member: any, i: number) => (
            <div
              key={i}
              className="relative flex flex-col justify-end h-[400px] w-full max-w-[300px] min-w-[250px]  overflow-hidden"
              style={{
                backgroundImage: `url("${member.image}")`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              {/* Background grayscale */}
              <div className="absolute inset-0 bg-black/0 backdrop-grayscale"></div>

              {/* Colored box */}
              <div className="relative z-10 w-[80%] bg-[#F54A0C] pl-[30px] py-5 mb-5">
                <h5 className="text-md font-bold text-white">{member.name}</h5>
                <p className="text-[12px] font-normal text-white">{member.role}</p>
              </div>
            </div>
            ))}
          </div>


        </div>

        {/* team values sections */}
        
         <div className="bg-[#f7f7f7] py-16 px-4 mt-12">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h4 className="text-[#F54A0C] text-lg font-medium">
               Our Values
            </h4>
            <h2 className="text-3xl md:text-4xl font-normal text-gray-800">
              {cms?.aboutValuesTitle || "Collaborate & Succeed"} 
            </h2>
          </div>

          {/* Values Grid */}
          <div className="flex justify-center gap-10 max-w-6xl  mx-auto text-center">
            {cms?.aboutValues?.map((item : any, i : number) => (
              <div key={i} className="flex flex-col items-center">
                
                {/* Icon */}
                <img 
                  src={item.imageUrl ?? "/placeholder.png"} 
                  alt={item.title} 
                  className="h-12 w-10 mb-4"
                />

                {/* Title */}
                <h3 className="text-lg font-semibold text-[#F54A0C] mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className=" text-[12px] font-semibold text-[#b2b2b2] leading-relaxed max-w-[220px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>


        <div className="py-10 px-8 lg:px-30">
          
        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">{cms?.aboutBottomSectionTitle || "Ready to Join Spark?"}</h2>
          <p className="text-[#b2b2b2] text-sm mb-6">
            {cms?. aboutBottomSectionSubTitle || "Whether you're looking for services or offering them, we'd love to have you in our community."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg"  style={{borderRadius:"26px",fontSize:"14px",backgroundColor:" #F54A0C"}} asChild>
              <Link href="/register">Get Started Today</Link>
            </Button>
            <Button size="lg"  style={{borderRadius:"26px",fontSize:"14px",backgroundColor:" #000"}} asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
        </div>
    </div>
  )
}
