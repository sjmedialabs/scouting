import { Badge } from "@/components/ui/badge"
export default function FocusAreasCard({provider}) {
  console.log("Recieved props :::",provider)
  return (
    <div className="space-y-6">

      {/* Focus Areas */}
      <div className="shadow-md rounded-2xl border border-orange-100 bg-white p-5 space-y-1">
        <h3 className="text-[16px] font-semibold text-orangeButton h-5 my-custom-class">
          Focus Areas
        </h3>

        <p className="text-[12px] leading-[1.6] text-gray-600">
          {provider?.focusArea || "Focus area is not added till now"}
        </p>
      </div>

      {/* Industries */}
      <div className="shadow-md rounded-2xl border border-orange-100 bg-white p-5 space-y-1">
        <h3 className="text-[16px] font-semibold text-orangeButton h-5 my-custom-class">
          Industries
        </h3>

        {
          (provider?.industries || []).length!==0 ? 
          (
            <div>
              {
              provider?.industries.map((item)=>(
                <Badge  className="text-[12px] leading-[1.6] bg-[#F54A0C] min-w-[60px] h-[20px]">{item}</Badge>
              ))

              }
            </div>
              
            
          ) :<p className="text-[12px] leading-[1.6] text-gray-600">Not working on any industries</p>
        }
      </div>

      {/* Clients */}
      {/* <div className="shadow-md rounded-2xl border border-orange-100 bg-white p-5 space-y-1">
        <h3 className="text-[16px] font-semibold text-orangeButton h-5 my-custom-class">
          Clients
        </h3>

        <p className="text-[12px] leading-[1.6] text-gray-600">
          Cherubini, PEZ, Alexander, Scarce, Liquid Rubber
        </p>
      </div> */}

    </div>
  )
}
