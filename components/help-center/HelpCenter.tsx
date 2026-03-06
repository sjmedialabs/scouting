import HelpSidebar from "@/components/help-center/HelpSidebar"
import HelpContent from "@/components/help-center/HelpContent"


export default function HelpCenter() {
  return (
    <section className="bg-white">
      <div className="w-full px-6 py-10 ml-3 xl:pl-28">

        {/* Page Header */}
        <h1 className="text-center text-2xl font-medium text-orangeButton mb-10">
          How can we help you?
        </h1>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">

          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-1">
            <HelpSidebar />
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-3">
            <HelpContent />
          </div>

        </div>
      </div>
    </section>
  )
}

