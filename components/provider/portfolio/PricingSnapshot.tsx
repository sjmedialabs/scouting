type PricingSnapshotProps = {
  provider: {
    minAmount?: number
    hourlyRate?: string
    costRating?: number
  }
}

export default function PricingSnapshot({ provider }: PricingSnapshotProps) {
  return (
    <div
      className="shadow-md border-orange-100 bg-white overflow-hidden rounded-2xl border p-6 space-y-4 px-6 py-5"
    >
      {/* Title */}
      <h3 className="text-[16px] font-semibold text-orangeButton my-custom-class mb-4">
        Pricing Snapshot
      </h3>

      {/* Content */}
      <div className="flex flex-col sm:flex-row justify-between gap-6">
        {/* Min project size */}
        <div className="flex flex-col gap-1 pl-3">
          <span className="text-[10px] font-semibold my-custom-class">
            Min. project size
          </span>
          <span className="text-[16px] text-center font-bold text-black my-custom-class">
            ${provider.minAmount ?? 0}+
          </span>
        </div>

        {/* Avg hourly rate */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold my-custom-class">
            Avg. hourly rate
          </span>
          <span className="text-[16px] font-bold text-center text-black my-custom-class">
            {provider.hourlyRate ?? "—"} / hr
          </span>
        </div>

        {/* Rating for cost */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold my-custom-class">
            Rating for cost
          </span>
          <span className="text-[16px] font-bold text-center text-black my-custom-class">
            {provider.costRating ?? 0} / 5
          </span>
        </div>
      </div>
    </div>
  )
}
