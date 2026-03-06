"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { authFetch } from "@/lib/auth-fetch"

export default function ApplicationsPage() {
  const params = useParams()
  const slug = params.slug as string

  const [apps, setApps] = useState<any[]>([])

  useEffect(() => {
    if (!slug) return

    authFetch(`/api/applications/${slug}`)
      .then((res) => res.json())
      .then(setApps)
  }, [slug])

  const updateStatus = async (id: string, status: string) => {
    await authFetch("/api/applications/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })

    setApps((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status } : a))
    )
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold text-orangeButton mb-6">
        Applications
      </h1>

      <div className="space-y-4">
        {apps.map((app) => (
          <Card key={app._id} className="p-6 rounded-2xl bg-white shadow-md">
            <div className="flex justify-between items-start">

              {/* LEFT */}
              <div className="space-y-1">
                <h2 className="font-semibold text-lg text-orangeButton">
                  {app.firstName} {app.lastName}
                </h2>

                <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">Email:</span> {app.email}
                    </p>

                    <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">Phone:</span> {app.phone}
                    </p>

                    <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">Qualification:</span> {app.qualification}
                    </p>

                    <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">Experience:</span> {app.experience}
                    </p>


                {/* Resume Section */}
                 <div className="mt-3">
                <p className="font-medium">Resume</p>

                <div className="flex items-center gap-3 mt-2">
                    <FileText className="text-orange-600" size={28} />

                    <div className="flex gap-2">
                    <a href={app.resumeUrl} target="_blank">
                        <Button
                        className="rounded-full bg-gray-400" variant="outline">Preview</Button>
                    </a>

                    <a href={app.resumeUrl} download>
                        <Button
                        className="rounded-full bg-gray-400" variant="outline">Download</Button>
                    </a>
                    </div>
                </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col items-end gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    app.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : app.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-300 text-gray-700"
                  }`}
                >
                  {app.status}
                </span>

                <div className="flex gap-2">
                  <Button
                    onClick={() => updateStatus(app._id, "accepted")}
                    className="bg-orange-600 hover:bg-orange-500 text-white rounded-full"
                  >
                    Accept
                  </Button>

                  <Button
                    onClick={() => updateStatus(app._id, "rejected")}
                    className="bg-blueButton hover:bg-blue-200 text-white rounded-full"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
