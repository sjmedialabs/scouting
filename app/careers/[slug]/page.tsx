"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import ApplyJobModal from "@/components/ApplyJobModal"

export default function JobDetailsPage({
  params,
}: {
  params: { slug: string }
}) {
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch(`/api/careers/${params.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(setJob)
      .catch(() => setJob(null))
      .finally(() => setLoading(false))
  }, [params.slug])

  if (loading) return <p className="p-10">Loading...</p>
  if (!job) return notFound()

  return (
    <>
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT CONTENT */}
        <div className=" ml-6 lg:col-span-2">
          {/* Title */}
          <h1 className="text-4xl font-medium text-orangeButton mb-4">
            {job.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap gap-6 text-gray-500 text-sm mb-2">
            <span>{job.location}</span>
            <span>{job.email}</span>
            <span>{job.website}</span>
          </div>

          {/* Description */}
          <p className="text-gray-400 leading-relaxed mb-4">
            {job.description}
          </p>

          {/* Responsibilities */}
          <h2 className="text-xl font-semibold mb-2">
            Key Responsibilities
          </h2>

          <div
            className="space-y-6 text-gray-400 text-sm"
            dangerouslySetInnerHTML={{ __html: job.responsibilities }}
          />

          {/* Skills */}
          <h2 className="text-xl font-semibold mt-12 mb-4">
            Required Skills & Capabilities
          </h2>

          <div
            className="list-disc pl-5 space-y-2 text-gray-400 text-sm"
            dangerouslySetInnerHTML={{ __html: job.skills }}
          />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:sticky h-fit">
          <div className="bg-[#eef1f6] rounded-3xl overflow-hidden">
            <div className="divide-y text-sm text-gray-500 space-y-0">
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
                <p className="font-Bold">Employment Type</p>
                <p>{job.employmentType}</p>
              </div>
            </div>

            {/* CTA */}
            <button 
            onClick={() => setOpen(true)}
            className="w-full bg-orange-600 hover:bg-orange-500 transition text-white text-lg py-6">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* APPLY MODAL */}
      <ApplyJobModal
        isOpen={open}
        onClose={() => setOpen(false)}
        jobTitle={job.title}
      />
    </>
  )
}
