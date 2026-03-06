import PolicySection from "./PolicySection"

const policyData = {
  title: "Privacy Policy",
  subtitle: "Principles of data protection",
  updatedAt: "Last updated: Jan 2026",
  sections: [
    {
      title: "The Information We Collect",
      
      subSections: [
        {
          subTitle: "Information about you",
          content: [
            {
              type: "text",
              value:
                "We collect information that you provide directly when using our services."
            }
          ]
        },
        {
          subTitle: "Information from third parties",
          content: [
            {
              type: "list",
              value: [
                "Marketing partners",
                "Analytics providers",
                "Public sources"
              ]
            }
          ]
        }
      ]
    },
  ]
}

export default function PrivacyPolicy() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6 ml-0 sm:px-6 lg:px-8 xl:pl-28">
        
        {/* Header */}
        <h1 className="text-3xl h-6 text-orangeButton">
          {policyData.title}
        </h1>

        <p className="mt-2 h-5 text-2xl">
          {policyData.subtitle}
        </p>

        <p className="mt-2 text-xs text-gray-400">
          {policyData.updatedAt}
        </p>

        <hr className="my-6" />

        {/* Sections */}
        <div className="space-y-6">
          {policyData.sections.map((section, index) => (
            <PolicySection
              key={index}
              index={index + 1}
              section={section}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
