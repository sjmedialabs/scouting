"use client"

import { useState } from "react"

type ApplyJobModalProps = {
  isOpen: boolean
  onClose: () => void
  jobTitle: string
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

const initialFormState = {
  firstName: "",
  lastName: "",
  phone: "",
  altPhone: "",
  email: "",
  gender: "",
  qualification: "",
  passedOutYear: "",
  experience: "",
  resume: null as File | null,
  coverLetter: null as File | null,
}

export default function ApplyJobModal({
  isOpen,
  onClose,
  jobTitle,
}: ApplyJobModalProps) {
  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  /* ---------------- RESET FORM ---------------- */
  const resetForm = () => {
    setForm(initialFormState)
    setErrors({})
    setLoading(false)
    setSuccess(false)
  }

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e: any) => {
    const { name, value, files } = e.target

    if (files && files.length > 0) {
      const file = files[0]

      if (file.type !== "application/pdf") {
        setErrors((p) => ({ ...p, [name]: "Only PDF files are allowed" }))
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        setErrors((p) => ({
          ...p,
          [name]: "File size must be less than 2 MB",
        }))
        return
      }

      setErrors((p) => ({ ...p, [name]: "" }))
      setForm({ ...form, [name]: file })
      return
    }

    setForm({ ...form, [name]: value })
    setErrors((p) => ({ ...p, [name]: "" }))
  }

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e: Record<string, string> = {}

    if (!form.firstName) e.firstName = "First name is required"
    if (!form.lastName) e.lastName = "Last name is required"
    if (!form.phone) e.phone = "Phone number is required"
    if (!form.email) e.email = "Email is required"
    if (!form.gender) e.gender = "Gender is required"
    if (!form.qualification) e.qualification = "Qualification is required"
    if (!form.passedOutYear) e.passedOutYear = "Passed out year is required"
    if (!form.experience) e.experience = "Experience is required"
    if (!form.resume) e.resume = "Resume is required"

    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: any) => {
  e.preventDefault()
  if (!validate()) return

  setLoading(true)

  let resumeUrl = ""
  let coverLetterUrl = ""

  if (form.resume) {
    const fd = new FormData()
    fd.append("file", form.resume)

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    })

    const uploadData = await uploadRes.json()
    resumeUrl = uploadData.url
  }

  if (form.coverLetter) {
    const fd = new FormData()
    fd.append("file", form.coverLetter)

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    })

    const uploadData = await uploadRes.json()
    coverLetterUrl = uploadData.url
  }

  await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobTitle,
      ...form,
      resumeUrl,
      coverLetterUrl,
    }),
  })

  setLoading(false)
  setSuccess(true)

  setTimeout(() => {
    resetForm()
    onClose()
  }, 1500)
}



  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-3xl w-full max-w-3xl p-8 relative max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={() => {
            resetForm()
            onClose()
          }}
          className="absolute top-4 right-4 text-gray-500 text-xl"
          disabled={loading}
        >
          ✕
        </button>

        <h2 className="text-3xl font-semibold mb-4">
          Apply for {jobTitle}
        </h2>

        {success ? (
          <div className="bg-green-100 text-green-700 p-6 rounded-xl text-center text-lg">
            ✅ Application submitted successfully!
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* First Name */}
            <div>
              <label className="text-sm font-medium">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm font-medium">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">{errors.lastName}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>

            {/* Alt Phone */}
            <div>
              <label className="text-sm font-medium">
                Alternate Phone <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                name="altPhone"
                value={form.altPhone}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm font-medium">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs">{errors.gender}</p>
              )}
            </div>

            {/* Qualification */}
            <div>
              <label className="text-sm font-medium">
                Qualification <span className="text-red-500">*</span>
              </label>
              <input
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
              {errors.qualification && (
                <p className="text-red-500 text-xs">{errors.qualification}</p>
              )}
            </div>

            {/* Passed Out Year */}
            <div>
              <label className="text-sm font-medium">
                Passed Out Year <span className="text-red-500">*</span>
              </label>
              <input
                name="passedOutYear"
                value={form.passedOutYear}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
              {errors.passedOutYear && (
                <p className="text-red-500 text-xs">{errors.passedOutYear}</p>
              )}
            </div>

            {/* Experience */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">
                Experience <span className="text-red-500">*</span>
              </label>
              <input
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
              {errors.experience && (
                <p className="text-red-500 text-xs">{errors.experience}</p>
              )}
            </div>

            {/* Resume */}
            <div>
              <label className="text-sm font-medium">
                Resume (PDF) <span className="text-red-500">*</span>
              </label>
              <div className="bg-gray-100 border rounded-xl px-4 py-3">
                <input
                  type="file"
                  accept="application/pdf"
                  name="resume"
                  onChange={handleChange}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                PDF only • Max size 2MB
              </p>
              {form.resume && (
                <p className="text-sm mt-1">{form.resume.name}</p>
              )}
              {errors.resume && (
                <p className="text-red-500 text-xs">{errors.resume}</p>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <label className="text-sm font-medium">
                Cover Letter (PDF) <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="bg-gray-100 border rounded-xl px-4 py-3">
                <input
                  type="file"
                  accept="application/pdf"
                  name="coverLetter"
                  onChange={handleChange}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                PDF only • Max size 2MB
              </p>
              {form.coverLetter && (
                <p className="text-sm mt-1">{form.coverLetter.name}</p>
              )}
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-full text-lg text-white transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-500"
                }`}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
