export default function PolicyContent({ item }: { item: any }) {
  if (item.type === "text") {
    return <p className="text-gray-700">{item.value}</p>
  }

  if (item.type === "list") {
    return (
      <ul className="list-disc pl-6 text-gray-700">
        {item.value.map((v: string, i: number) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
    )
  }

  return null
}
