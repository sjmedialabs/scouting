// type ServiceLine = {
//   name: string
//   percentage: number
//   color?: "blue" | "green" | "purple" | "mint"
// }

type ServiceLinesProps = {
  provider: {
    services?: string[]
  }
}

export default function ServiceLines({ provider }: ServiceLinesProps) {
  const services = provider.services ?? []

  if (services.length === 0) return null

  const colors =[
    "bg-[#cfe2ff]",
    "bg-[#d7f7ee]",
    "bg-[#efe4fb]",
    "bg-[#d1f9e3]",
  ]

  const percentage = Math.floor(100 / services.length)

  return (
    <div className="shadow-md border-orange-100 bg-white overflow-hidden rounded-2xl border p-6 space-y-4">
      <h3 className="text-[16px] font-semibold text-orangeButton my-custom-class">
        Service Lines
      </h3>

      <div className="flex flex-wrap gap-3">
        {services.map((service, index) => (
          <div
            key={service}
            className={`
              ${colors[index % colors.length]}
              flex items-center justify-between
              rounded-xl px-4 py-2
              min-w-[260px]
            `}
          >
            <span className="text-[12px] font-semibold text-gray-800 my-custom-class">
              {service}
            </span>

            <span className="text-[12px] font-semibold text-black my-custom-class">
              {percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
