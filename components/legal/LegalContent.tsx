import LegalSection from "@/components/legal/LegalSection"

import { legalContent } from "../../lib/legalContent"


export default function LegalContent() {
  return (
    <section className="bg-white">
      <div className="w-full px-4 py-6 ml-0 sm:px-6 lg:px-12 xl:pl-28">
        
        <h1 className="text-3xl h-8 font-medium text-orangeButton">
          {legalContent.title}
        </h1>

        <p className="mt-1 text-2xl h-5 text-gray-600">
          {legalContent.subtitle}
        </p>

        <hr className="my-6" />

        <div className="space-y-10">
          {legalContent.sections.map((section, index) => (
            <LegalSection key={index} section={section} />
          ))}
        </div>

      </div>
    </section>
  )
}
