"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { authFetch } from "@/lib/auth-fetch"
import { Button } from "@/components/ui/button"
import { useMemo } from "react"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [counts, setCounts] = useState<any[]>([])
  const [editingJob, setEditingJob] = useState<any>(null)



  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    email: "",
    website: "",
    experience: "",
    salaryRange: "",
    department: "",
    employmentType: "",
  })

  const [responsibilities, setResponsibilities] = useState("")
  const [skills, setSkills] = useState("")

  useEffect(() => {
    authFetch("/api/careers")
      .then((res) => res.json())
      .then(setJobs)
  }, [])

  useEffect(() => {
  authFetch("/api/applications/count")
    .then(res => res.json())
    .then(setCounts)
}, [])

const getCount = (title: string) => {
  const found = counts.find((c) => c._id === title)
  return found ? found.count : 0
}

const deleteJob = async (id: string) => {
  await authFetch("/api/admin/careers/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })

  setJobs((prev) => prev.filter((j) => j._id !== id))
}


const openEdit = (job: any) => {
    setEditingJob(job)
    setFormData({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      email: job.email || "",
      website: job.website || "",
      experience: job.experience || "",
      salaryRange: job.salaryRange || "",
      department: job.department || "",
      employmentType: job.employmentType || "",
    })
    setResponsibilities(job.responsibilities || "")
    setSkills(job.skills || "")
    setOpenModal(true)
  }

  const modules = useMemo(() => ({
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link"],
    ["clean"],
  ],
}), [])

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
]




  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

   const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      email: "",
      website: "",
      experience: "",
      salaryRange: "",
      department: "",
      employmentType: "",
    })
    setResponsibilities("")
    setSkills("")
    setEditingJob(null)
  }

  const handleSubmit = async () => {
  try {
    setLoading(true)

    const payload = {
      ...formData,
      responsibilities,
      skills,
    }

    // EDIT MODE
    if (editingJob) {
      const res = await authFetch("/api/admin/careers/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingJob._id,
          data: payload,
        }),
      })

      const updatedJob = await res.json()

      setJobs((prev) =>
        prev.map((j) => (j._id === updatedJob._id ? updatedJob : j))
      )
    } else {
      const res = await authFetch("/api/admin/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const newJob = await res.json()
      setJobs([newJob, ...jobs])
    }

    resetForm()
    setOpenModal(false)
  } catch {
    alert("Failed to save job")
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="p-0 max-w-7xl">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="font-bold text-orangeButton text-3xl my-custom-class">
            Job Listing
          </h1>
          <p>Listed Jobs</p>
        </div>

      <Button
          onClick={() => {
            resetForm()
            setOpenModal(true)
          }}
          className="rounded-full bg-orange-600 hover:bg-orange-500"
        >
          Post Job
        </Button>
      </div>

      {/* JOB LIST */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job._id} className="p-6 rounded-2xl bg-white shadow-md">
            
            <div className="flex justify-between items-center">
            <Link href={`/admin/careers/${job.slug}`}>
              <div>
                <h2 className="font-semibold text-lg cursor-pointer">
                  {job.title}
                </h2>
            
            <div className="flex gap-4">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Department:</span> {job.department}
            </p>

            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Employment Type:</span> {job.employmentType}
            </p>

            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Location:</span> {job.location}
            </p>
          </div>


              <span className="inline-block mt-2 text-xs bg-green-400 text-white px-2 py-1 rounded-full">
                Applications: {getCount(job.title)}
              </span>
            </div>
            </Link>

            <div className="flex gap-2">
            <Button
            className="rounded-full bg-black text-white hover:bg-gray-800"
              variant="outline"
              onClick={() => openEdit(job)}
            >
              Edit
            </Button>

            <Button
            className="rounded-full bg-blueButton hover:bg-blue-500 hover:text-white"
              variant="destructive"
              onClick={() => deleteJob(job._id)}
            >
              Delete
            </Button>
          
              <Link href={`/admin/careers/${job.title}/applications`}>
                <Button className="rounded-full bg-orangeButton">Applications</Button>
              </Link>
            </div>
            </div>
            
          </Card>
        ))}
      </div>

      {/* POST JOB MODAL */}
      {openModal && (
          <div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
            onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpenModal(false)
            }
          }}
          >
            <div
              className="bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
            <CardHeader>
              <CardTitle className="text-2xl text-orangeButton">
                {editingJob ? "Edit Job" : "Post Job"}
              </CardTitle>

              <button
              onClick={() => setOpenModal(false)}
              className="absolute top-6 right-6 text-gray-500 cursor-pointer"
            >
              ✕
            </button>

            </CardHeader>

            <CardContent className="space-y-6">
              <Input 
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="Job Title" />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full  shadow-md border rounded-xl p-3"
                placeholder="Description"
              />

              <Input
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
               name="location" 
               value={formData.location} 
               onChange={handleChange} 
               placeholder="Location" 
               />
              <Input 
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Email" 
              />
              <Input 
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
              name="website" 
              value={formData.website} 
              onChange={handleChange} 
              placeholder="Website" 
              />

              <ReactQuill
                className="rounded-xl placeholder:text-gray-300 shadow-md border-gray-200"
                value={responsibilities}
                placeholder="Enter Key Responsibilities"
                onChange={setResponsibilities}
                modules={modules}
                formats={formats}
              />

              <ReactQuill
                className="rounded-xl shadow-md border-gray-200"
                value={skills}
                placeholder="Enter Requried Skills & Capabilities"
                onChange={setSkills}
                modules={modules}
                formats={formats}
              />


              <Input 
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
              name="experience" 
              value={formData.experience}
               onChange={handleChange} 
               placeholder="Experience" 
               />
              <Input 
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
              name="salaryRange" 
              value={formData.salaryRange} 
              onChange={handleChange} 
              placeholder="Salary" 
              />
              <Input 
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
              name="department" 
              value={formData.department} 
              onChange={handleChange} 
              placeholder="Department" 
              />
              <Input 
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
              name="employmentType" 
              value={formData.employmentType} 
              onChange={handleChange} 
              placeholder="Employment Type" 
              />
               
               <div className="flex gap-3">
              <Button 
              onClick={handleSubmit} 
              disabled={loading} 
              className="w-30 bg-orange-600 text-white rounded-full">
                {loading ? "Saving..." : editingJob ? "Update Job" : "Post Job"}
              </Button>

              <Button 
              className="w-30 bg-black text-white rounded-full"
              variant="outline" 
              onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
              </div>
            </CardContent>
          </div>
        </div>
      )}
    </div>
  )
}
