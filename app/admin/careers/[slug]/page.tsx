"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authFetch } from "@/lib/auth-fetch"

export default function AdminJobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    authFetch(`/api/careers/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setJob(data)
        setLoading(false)
      })
      .catch(() => {
        setJob(null)
        setLoading(false)
      })
  }, [slug])

  if (loading) return <p className="p-10">Loading...</p>

  if (!job) {
    return (
      <div className="p-0 text-red-500">
        Job not found
      </div>
    )
  }

  return (
    <section className="max-w-7xl mx-auto mt-0">
       <div className="flex items-center justify-between">
        <h1 className="text-4xl font-medium text-orangeButton mb-4">
            {job.title}
          </h1>

        {/* BACK BUTTON */}
            
                <Button
                    variant="outline"
                    className="bg-black text-white rounded-full"
                    onClick={() => router.push("/admin/careers")}
                >
                    ← Back
                </Button>
                </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <div className="ml-0 lg:col-span-2">

          <div className="flex flex-wrap gap-6 text-gray-500 text-sm mb-2">
            <span>{job.location}</span>
            <span>{job.email}</span>
            <span>{job.website}</span>
          </div>

          <p className="text-gray-400 leading-relaxed mb-4">
            {job.description}
          </p>

          <h2 className="text-xl font-semibold mb-2">
            Key Responsibilities
          </h2>

          <div
            className="space-y-6 text-gray-400 text-sm"
            dangerouslySetInnerHTML={{ __html: job.responsibilities }}
          />

          <h2 className="text-xl font-semibold mt-12 mb-4">
            Required Skills & Capabilities
          </h2>

          <div
            className="text-gray-400 text-sm"
            dangerouslySetInnerHTML={{ __html: job.skills }}
          />
        </div>

        <div className="lg:sticky h-fit">
          <div className="bg-[#eef1f6] rounded-3xl overflow-hidden">
            <div className="divide-y text-sm text-gray-500">
              <div className="p-6">
                <p className="font-bold">Date Posted</p>
                <p>{new Date(job.createdAt).toDateString()}</p>
              </div>
              <div className="p-6">
                <p className="font-bold">Experience</p>
                <p>{job.experience}</p>
              </div>
              <div className="p-6">
                <p className="font-bold">Salary Range</p>
                <p>{job.salaryRange}</p>
              </div>
              <div className="p-6">
                <p className="font-bold">Department</p>
                <p>{job.department}</p>
              </div>
              <div className="p-6">
                <p className="font-bold">Employment Type</p>
                <p>{job.employmentType}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
