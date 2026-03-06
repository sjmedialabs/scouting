import Link from "next/link"

export default function HelpSidebar() {
  return (
    <aside className="space-y-6 text-sm text-gray-700">

      <div>
        <h3 className="font-semibold text-xl text-gray-900 mb-2">About Scout</h3>
        <hr />
      </div>

      <div>
        <h3 className="font-semibold text-xl text-gray-900 mb-3">
          For Service Provider
        </h3>

        <ul className="space-y-2">
          <li 
           className="text-blue-600 font-medium">
            How Scout Evaluates Companies
          </li>
          <li>
            <Link href="/login" className="font-medium hover:underline">
              How Scout Evaluates Companies
            </Link>
          </li>
          <li>
            <Link href="/search" className="font-medium hover:underline">
            Find a Service Provider
            </Link>
            </li>
          <li>
            <Link href="/login" className="font-medium hover:underline">
            Leave a Review
            </Link>
          </li>
          <li>
            <Link href="/login" className="font-medium hover:underline">
            Review Verification & Publishing
            </Link>
          </li>
          <li>
            <Link href="/login" className="font-medium hover:underline">
            Edit or Update a Review
            </Link>
          </li>
          <li>
            <Link href="/contact" className="font-medium hover:underline">
            Messaging Center
            </Link>
          </li>
          <li>
            <Link href="/pricing" className="font-medium hover:underline">
            Package Services
            </Link>
          </li>
          <li>
            <Link href="/about" className="font-medium hover:underline">
            Scout Network
            </Link>
          </li>
        </ul>
      </div>

      <hr />

      <div>
        <h3 className="font-semibold text-xl text-gray-900 mt-6">
          For Buyers
        </h3>
      </div>

    </aside>
  )
}
