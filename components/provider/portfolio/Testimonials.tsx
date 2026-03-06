"use client"

type Testimonial = {
  clientName: string
  company: string
  rating: number
  text: string
}

export default function Testimonials({
  testimonials = [],
}: {
  testimonials?: Testimonial[]
}) {
  if (!testimonials.length) return null

  return (
    <div className="shadow-md rounded-2xl border border-orange-100 bg-white p-6 space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-[16px] font-semibold h-5 text-orangeButton my-custom-class">
          What Clients Are Saying
        </h3>
        <p className="text-[12px] text-gray-500 my-custom-class">
          Trusted by leaders from various industries
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col"
          >

            {/* Rating */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-[14px] ${
                    i < item.rating ? "text-[#E0AA12]" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Review text */}
            <p className="text-[12px] leading-normal italic text-gray-500 my-custom-class">

              “{item.text}”
            </p>

         
            <div className="mt-auto pt-3">
              <p className="text-[12px] font-semibold text-gray-900 my-custom-class">
                {item.clientName}
              </p>
              <p className="text-[11px] text-gray-500 my-custom-class">
                {item.company}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
