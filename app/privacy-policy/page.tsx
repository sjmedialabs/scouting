"use client"
import PrivacyPolicy from "../../components/privacy-policy/PrivacyPolicy"
import { useState,useEffect } from "react"
import Link from "next/link";
import { useRouter } from "next/navigation";



export default function PrivacyPolicyPage() {
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

  console.log("privacyPolicy-cms",cms)
  return (
     <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 ml-0 sm:px-6 lg:px-8 xl:pl-28">
            
            {/* Header */}
            <h1 className="text-3xl h-6 text-orangeButton">
              {cms?.privacyPolicy?.title || ""}
            </h1>
    
            <p className="mt-2 h-5 text-2xl">
              {cms?.privacyPolicy?.subTitle || ""}
            </p>
    
            {/* <p className="mt-2 text-xs text-gray-400">
              {p}
            </p> */}
    
            <hr className="my-6" />
    
            {/* Sections */}
            <div className="space-y-6">
              {
                (cms?.privacyPolicy?.descriptionPoints || []).length!==0 && (
                  <div>
                    {
                      (cms?.privacyPolicy?.descriptionPoints || []).map((item,index)=>(
                        <div key={index}>
                          <div className="flex gap-2" >
                             <span className="font-semibold text-lg text-[#000] -mt-0.5">{index+1}.</span>
                             <h1 className="font-extrabold text-md text-[#000]">{item.title}</h1>
                          </div>
                         
                          <div
                        className="mb-6 [&_ol]:list-decimal [&_ol]:ml-6
                                  [&_ul]:list-disc [&_ul]:ml-0 ml-6 text-[#656565]"
                        dangerouslySetInnerHTML={{
                          __html: item.description || "",
                        }}
                      />
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
          </div>
      </section>
  )
}
