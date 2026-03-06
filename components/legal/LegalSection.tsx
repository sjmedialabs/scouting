export default function LegalSection({ section }: { section: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">
        {section.title}
      </h2>

      {section.blocks.map((block: any, index: number) => {
        if (block.type === "text") {
          return (
            <p key={index} className="text-gray-500 leading-relaxed">
              {block.value}
            </p>
          )
        }

        if (block.type === "listTitle") {
          return (
            <p key={index} className="font-semibold text-gray-600">
              {block.value}
            </p>
          )
        }

        if (block.type === "list") {
          return (
            <ul
              key={index}
              className="list-disc pl-6 space-y-2 text-gray-500"
            >
              {block.value.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )
        }

        return null
      })}
    </div>
  )
}
