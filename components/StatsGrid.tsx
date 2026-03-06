import React from "react"

interface Start {
    label: string
    value: string
}

const stats: Start[] = [
  { label: "...", value: "..." }
]




export default function StatsGrid({ stats }: { stats: Start[] }) {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col sm:h-40  items-center justify-center rounded-[28px]
                         border border-[#d8dce2] bg-[#f0f3fa] shadow-[0_1px_0_rgba(0,0,0,0.02)]
                         h-[150px] md:h-[170px] text-center"
            >
              <div
                className="text-[36px] sm:text-[34px] md:text-[40px] font-semibold leading-none text-[#F15927]"
                style={{ fontFamily: "CabinetGrotesk2" }}
              >
                {s.value}
              </div>
              <div
                className="mt-3 text-[18px] md:text-[20px] font-extrabold text-[#0E0E0E]"
                style={{ fontFamily: "CabinetGrotesk2" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}