"use client"

import HelpCenter from "@/components/help-center/HelpCenter"
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function HelpCenterPage() {
  const [cms, setCms] = useState<any>(null);
   const router = useRouter();
  const [loading, setLoading] = useState(false);
   useEffect(() => {
    const fetchCMS = async () => {
      const res = await fetch("/api/cms");
      const data = await res.json();
      setCms(data.data);
    };
    fetchCMS();
  }, []);

  console.log("Help-center-cms")
  return (
    <>
    
     <section className="bg-white">
          <div className="w-full px-6 py-10 ml-3 xl:pl-28">
    
            {/* Page Header */}
            <h1 className="text-center text-2xl font-medium text-orangeButton mb-10">
             {cms?.helpCenter?.title || " How can we help you?"}
            </h1>
    
            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
    
              {/* LEFT SIDEBAR */} 
               <aside className="space-y-6 text-sm text-gray-700">

                    <div>
                      <h3 className="font-semibold text-xl text-gray-900 mb-2">About Scout</h3>
                      <hr />
                    </div>

                    <div>
                      <h3 className="font-semibold text-xl text-gray-900 mb-3">
                        {cms?.helpCenter?.leftSideTitle || "For Service Provider"}
                      </h3>

                      <ul className="space-y-2">

                        {
                          cms?.helpCenter?.leftSidePoints.length!==0 &&(
                            <div>
                              {
                                cms?.helpCenter?.leftSidePoints.map((item:any,index)=>(
                                  <li key={index} className="mb-4">
                                      <Link href={`${item.urlToRedirect}`} className="font-medium hover:underline">
                                       {item.title}
                                      </Link>
                                  </li>
                                ))
                              }
                            </div>
                          )
                        }
                      </ul>
                    </div>

                    <hr />

                    <div>
                      <h3 className="font-semibold text-xl text-gray-900 mt-6">
                        For Buyers
                      </h3>
                    </div>

                </aside>
    
              {/* RIGHT CONTENT */}
              <div className="lg:col-span-3">
                <div className="space-y-2 text-gray-700">

                    <h2 className="text-2xl  text-gray-900">
                      {cms?.helpCenter?.rightSideTitle || "How Does Scout Rank Companies?"}
                    </h2>

                    <p className="text-gray-500 mb-5">
                     {cms?.helpCenter?.rightSideDescription || ` We use a proprietary ranking algorithm to compare companies against
                      their competitors in particular industries, focus areas, and locations.
                      We base our rankings on 5 main criteria.`}
                    </p>

                    <div
                        className="mb-6 [&_ol]:list-decimal [&_ol]:ml-6
                                  [&_ul]:list-disc [&_ul]:ml-0"
                        dangerouslySetInnerHTML={{
                          __html: cms?.helpCenter?.rightSideDescription2 || "",
                        }}
                      />




                    

                  </div>
              </div>
    
            </div>
          </div>
        </section>
     
    </>
  )
}

 