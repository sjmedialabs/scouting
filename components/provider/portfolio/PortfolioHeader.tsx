export default function PortfolioHeader() {
  return (
    <div className="space-y-2 h-15">
      {/* Title */}
      <h1 className="text-[24px] h-6 font-bold text-orangeButton my-custom-class"
      >
        Portfolio
      </h1>

      {/* Subtitle */}
      <p className="text-[18px] text-gray-500 my-custom-class">
        Showcase your work and achievements
      </p>

      {/* Divider */}
      <div className="pt-1">
        <div className="h-px w-full bg-gray-200" />
      </div>
    </div>
  )
}
