import PolicyContent from "./PolicyContent"

export default function PolicySection({
  index,
  section
}: {
  index: number
  section: any
}) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-4">
        {index}. {section.title}
      </h2>

      <div className="space-y-6">
        {section.subSections.map((sub: any, i: number) => (
          <div key={i}>
            <h3 className="font-semibold mb-2">{sub.subTitle}</h3>

            {sub.content.map((item: any, j: number) => (
              <PolicyContent key={j} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
