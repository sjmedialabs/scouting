export default function HelpContent() {
  return (
    <div className="space-y-2 text-gray-700">

      <h2 className="text-2xl  text-gray-900">
        How Does Scout Rank Companies?
      </h2>

      <p className="text-gray-500">
        We use a proprietary ranking algorithm to compare companies against
        their competitors in particular industries, focus areas, and locations.
        We base our rankings on 5 main criteria.
      </p>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">
          Company Ranking Criteria
        </h3>

        <ol className="list-decimal pl-5 space-y-1 text-gray-500">
          <li>Number, quality, and recency of client reviews</li>
          <li>Work experience</li>
          <li>Market Presence and Industry Recognition</li>
          <li>Services offered</li>
          <li>
            Presence in a location (only on location-specific directories)
          </li>
          <li>
            Client reviews, work experience, and market presence make up a company’s
        Ability to Deliver.
          </li>
        </ol>
      </div>

      <p className="text-gray-500">
        The services offered, or the main services a company specializes in
        providing to clients, contribute to a company’s Focus Score.
      </p>

    </div>
  )
}
