"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, ExternalLink, Lock } from "lucide-react";
import type { Provider, PortfolioItem, TestimonialItem } from "@/lib/types";
import { categories } from "@/lib/mock-data";
import { ImageUpload } from "../ui/image-upload";
import { authFetch } from "@/lib/auth-fetch";
import ServiceDropdown from "../select-category-filter";

interface CompanyProfileEditorProps {
  provider: Provider;
  onSave: (provider: Provider) => void;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateURL = (url: string): boolean => {
  if (!url) return true; // Optional field
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""));
};

const validateTagline = (tagline: string): boolean => {
  return tagline.length <= 50;
};

const employeeSizes = [
  "1-9",
  "10-49",
  "50-99",
  "100-249",
  "250-499",
  "500-999",
  "1000+",
];

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Russian",
  "Telugu"
];

export function CompanyProfileEditor({
  provider,
  onSave,
}: CompanyProfileEditorProps) {
  const [formData, setFormData] = useState({
    ...provider,
    companyName: provider.companyName || provider.name || "",
    logo: provider.logo || "",
    coverImage: provider.coverImage || "",
    location: provider.location || "",
    projectsCompleted: provider.projectsCompleted || "",
    minProjectSize: provider?.minProjectSize || 0,
    focusArea: provider.focusArea || "",
    hourlyRate: provider.hourlyRate || "",
    website: provider.website || "",
    salesEmail: provider.salesEmail || "",
    schedulingLink: provider.schedulingLink || "",
    adminContactPhone: provider.adminContactPhone || "",
    foundedYear: provider.foundedYear || new Date().getFullYear(),
    totalEmployees: provider.teamSize || "",
    tagline: provider.tagline || "",
    companyVideoLink: provider.companyVideoLink || "",
    languagesSpoken: provider.languagesSpoken || [],
    services: provider.services || [],
    technologies: provider.technologies || [],
    // awards: provider.awards || [],
    certifications: provider.certifications || [],
    industries: provider.industries || [],
    portfolio:
      provider.portfolio.map((item) => ({ ...item, id: item._id })) || [],
    testimonials: provider.testimonials || [],
    socialLinks: {
      linkedin: provider.socialLinks.linkedin || "",
      twitter: provider.socialLinks.twitter || "",
      facebook: provider.socialLinks.facebook || "",
      instagram: provider.socialLinks.instagram || "",
    },
  });

  const [newService, setNewService] = useState("");
  const [portfolioForm, setPortfolioForm] = useState<Partial<PortfolioItem>>(
    {},
  );
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [taglineCount, setTaglineCount] = useState(
    formData.tagline?.length || 0,
  );
  const [newTechnology, setNewTechnology] = useState("");
  const [newIndustry, setNewIndustry] = useState("");
  const [newAward, setNewAward] = useState("");
  const [newCertificate, setNewCertificate] = useState("");
  const [portfolioTechnology, setPortfolioTechnology] = useState("");
  const [editPortfolioId, setEditPortfolioId] = useState();
  const [testimonialForm, setTestimonialForm] = useState<
    Partial<TestimonialItem>
  >({});
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editTestimonialId, setEditTestimonialId] = useState<string | null>(
    null,
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const loadData = async () => {
    try {
      const response = await authFetch("/api/service-categories");
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    // console.log("Form Data ::::",formData);

    // Required field validations
    if (!formData.companyName?.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.website?.trim()) {
      newErrors.website = "Company website is required";
    } else if (!validateURL(formData.website)) {
      newErrors.website = "Please enter a valid URL";
    }

    if (!formData.salesEmail?.trim()) {
      newErrors.salesEmail = "Sales email is required";
    } else if (!validateEmail(formData.salesEmail)) {
      newErrors.salesEmail = "Please enter a valid email address";
    }

    if (!formData.foundedYear) {
      newErrors.foundedYear = "Founding year is required";
    } else if (
      formData.foundedYear < 1900 ||
      formData.foundedYear > new Date().getFullYear()
    ) {
      newErrors.foundedYear = "Please enter a valid year";
    }

    if (!formData.totalEmployees) {
      newErrors.totalEmployees = "Total employees is required";
    }

    if (!formData.tagline?.trim()) {
      newErrors.tagline = "Tagline is required";
    } else if (!validateTagline(formData.tagline)) {
      newErrors.tagline = "Tagline must be 50 characters or less";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Company description is required";
    }

    // Optional field validations
    if (formData.schedulingLink && !validateURL(formData.schedulingLink)) {
      newErrors.schedulingLink = "Please enter a valid URL";
    }

    if (
      formData.adminContactPhone &&
      !validatePhone(formData.adminContactPhone)
    ) {
      newErrors.adminContactPhone = "Please enter a valid phone number";
    }

    if (formData.companyVideoLink && !validateURL(formData.companyVideoLink)) {
      newErrors.companyVideoLink = "Please enter a valid URL";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Calling save Profile:::");

      const payload = {
        name: formData.companyName, // schema: name
        tagline: formData.tagline,
        description: formData.description,
        logo: formData.logo,
        coverImage: formData.coverImage,
        location: formData.location,
        website: formData.website,
        email: formData.email,
        salesEmail: formData.salesEmail,
        phone: formData.phone,
        adminContactPhone: formData.adminContactPhone,
        minProjectSize: formData.minProjectSize,
        focusArea: formData.focusArea,

        services: formData.services || [],
        technologies: formData.technologies || [],
        industries: formData.industries || [],

        foundedYear: formData.foundedYear,
        teamSize: formData.totalEmployees, // OR map to teamSize if needed
        portfolio: formData.portfolio || [],

        certifications: formData.certifications || [],
        // awards: formData.awards || [],

        projectsCompleted: parseInt(formData.projectsCompleted),
        hourlyRate: formData.hourlyRate,

        testimonials: formData.testimonials,

        socialLinks: {
          linkedin: formData.socialLinks.linkedin || "",
          twitter: formData.socialLinks.twitter || "",
          facebook: formData.socialLinks.facebook || "",
          instagram: formData.socialLinks.instagram || "",
        },
      };

      onSave(payload);
    }
  };

  const addService = () => {
    if (newService && !(formData.services || []).includes(newService)) {
      setFormData((prev) => ({
        ...prev,
        services: [...(prev.services || []), newService],
      }));
      setNewService("");
    }
  };

  const removeService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: (prev.services || []).filter((s) => s !== service),
    }));
  };

  const addTech = () => {
    if (
      newTechnology.trim() &&
      !(formData.technologies || []).includes(newTechnology)
    ) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTechnology],
      }));
      setNewTechnology("");
    }
  };

  const removeTech = (tech: string) => {
    console.log("Removing:", tech, formData.technologies);
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((item: string) => item !== tech),
    }));
  };

  const addPorfolioTech = () => {
    if (
      portfolioTechnology.trim() &&
      !(portfolioForm.technologies || []).includes(portfolioTechnology)
    ) {
      setPortfolioForm((prev) => ({
        ...prev,
        technologies: [...(prev.technologies || []), portfolioTechnology],
      }));
      setPortfolioTechnology("");
    }
  };

  const removePortfolioTech = (tech: string) => {
    setPortfolioForm((prev) => ({
      ...prev,
      technologies: (prev.technologies || []).filter((item) => item !== tech),
    }));
  };

  const addIndustry = () => {
    if (
      newIndustry.trim() &&
      !(formData.industries || []).includes(newIndustry)
    ) {
      setFormData((prev) => ({
        ...prev,
        industries: [...(prev.industries || []), newIndustry],
      }));
      setNewIndustry("");
    }
  };

  const removeIndustry = (industry: string) => {
    setFormData((prev) => ({
      ...prev,
      industries: prev.industries.filter((item: string) => item !== industry),
    }));
  };

  const addLanguage = (language: string) => {
    if (language && !(formData.languagesSpoken || []).includes(language)) {
      setFormData((prev) => ({
        ...prev,
        languagesSpoken: [...(prev.languagesSpoken || []), language],
      }));
      // setSelectedLanguage(language)
    }
  };

  const removeLanguage = (language: string) => {
    console.log("removing language is:::", language);
    setFormData((prev) => ({
      ...prev,
      languagesSpoken: (prev.languagesSpoken || []).filter(
        (l) => l !== language,
      ),
    }));
  };

  const addAward = () => {
    if (newAward.trim() && !(formData.awards || []).includes(newAward)) {
      setFormData((prev) => ({
        ...prev,
        awards: [...(prev.awards || []), newAward],
      }));
      setNewAward("");
    }
  };
  const removeAward = (award: string) => {
    setFormData((prev) => ({
      ...prev,
      awards: (prev.awards || []).filter((a: string) => a !== award),
    }));
  };

  const addCertificate = () => {
    if (
      newCertificate.trim() &&
      !(formData.certifications || []).includes(newCertificate)
    ) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertificate],
      }));
    }
    setNewCertificate("");
  };

  const removeCertification = (certificate: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter(
        (c: any) => c !== certificate,
      ),
    }));
  };

  const handleTaglineChange = (value: string) => {
    if (value.length <= 50) {
      setFormData((prev) => ({ ...prev, tagline: value }));
      setTaglineCount(value.length);
      if (errors.tagline) {
        setErrors((prev) => ({ ...prev, tagline: "" }));
      }
    }
  };

  const addPortfolioItem = () => {
    if (
      !editPortfolioId &&
      portfolioForm.title &&
      portfolioForm.description &&
      portfolioForm.category
    ) {
      const newItem: PortfolioItem = {
        id: Date.now().toString(),
        title: portfolioForm.title,
        description: portfolioForm.description,
        category: portfolioForm.category,
        image: portfolioForm.image,
        projectUrl: portfolioForm.projectUrl,
        completedAt: portfolioForm.completedAt || new Date(),
        technologies: portfolioForm.technologies || [],
      };

      setFormData((prev) => ({
        ...prev,
        portfolio: [...(prev.portfolio || []), newItem],
      }));

      setPortfolioForm({});
      setShowPortfolioForm(false);
    } else {
      const updated = formData.portfolio.map((item) => {
        if (item.id !== editPortfolioId) {
          return item;
        }

        return {
          ...item, // keeps required fields (id, completedAt, technologies)
          ...portfolioForm, // overrides only edited fields
        };
      });
      setFormData((prev) => ({ ...prev, portfolio: [...updated] }));
      setShowPortfolioForm(false);
      setPortfolioForm({});
    }
  };
  const editPortfolioItem = (id) => {
    const edititem = formData.portfolio.filter((item) => item.id === id);
    setPortfolioForm({ ...edititem[0] });
    setEditPortfolioId(id);
    setShowPortfolioForm(true);
  };

  const removePortfolioItem = (id: string) => {
    console.log("recied id to delete", id);
    setFormData((prev) => ({
      ...prev,
      portfolio: (prev.portfolio || []).filter((item) => item.id !== id),
    }));
  };
  const addOrUpdateTestimonial = () => {
    // ADD new testimonial
    if (!editTestimonialId) {
      if (
        testimonialForm.clientName &&
        testimonialForm.text &&
        testimonialForm.company &&
        testimonialForm.rating
      ) {
        const newItem: TestimonialItem = {
          id: Date.now().toString(),
          clientName: testimonialForm.clientName,
          text: testimonialForm.text,
          company: testimonialForm.company,
          rating: testimonialForm.rating,
          date: testimonialForm.date || new Date().toISOString().split("T")[0],
          avatar: testimonialForm.avatar || "",
        };

        setFormData((prev) => ({
          ...prev,
          testimonials: [...(prev.testimonials || []), newItem],
        }));

        setTestimonialForm({});
        setShowTestimonialForm(false);
      }
    }

    // UPDATE existing testimonial
    else {
      const updated = formData.testimonials.map((item) =>
        (item.id || item._id) === editTestimonialId
          ? { ...item, ...testimonialForm }
          : item,
      );

      setFormData((prev) => ({
        ...prev,
        testimonials: updated,
      }));

      setEditTestimonialId(null);
      setTestimonialForm({});
      setShowTestimonialForm(false);
    }
  };
  console.log("edit Testimonial Id is::::", editTestimonialId);
  const editTestimonialItem = (id: string) => {
    const item = formData.testimonials.find((t) => (t._id || t.id) === id);
    if (item) {
      setTestimonialForm({ ...item });
      setEditTestimonialId(id);
      setShowTestimonialForm(true);
    }
  };
  const removeTestimonialItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((item) => item.id !== id),
    }));
  };

  return (
    <div className="space-y-6 bg-[#ffffff]">
      {/* Company Information */}
      <div className="space-y-4">
        {/*comapny loago and coverimage */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
          {/*logo  */}
          <div className="space-y-2">
            <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
              Company Logo
            </Label>
            <ImageUpload
              value={formData.logo}
              onChange={(value) => setFormData({ ...formData, logo: value })}
              description="Upload your company logo (PNG, JPG) or provide a URL"
              previewClassName="w-24 h-24"
            />
          </div>

          {/*cover image */}

          <div className="space-y-2">
            <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
              Company Cover Image
            </Label>
            <ImageUpload
              value={formData.coverImage}
              onChange={(value) =>
                setFormData({ ...formData, coverImage: value })
              }
              description="Upload your company ccover image (PNG, JPG) or provide a URL"
              previewClassName="w-24 h-24"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="companyName"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Company Name
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  companyName: e.target.value,
                }));
                if (errors.companyName)
                  setErrors((prev) => ({ ...prev, companyName: "" }));
              }}
              className={`${errors.companyName ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
              placeholder="digiDZN"
            />
            {errors.companyName && (
              <p className="text-sm text-red-500">{errors.companyName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="website"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Company Website
            </Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, website: e.target.value }));
                if (errors.website)
                  setErrors((prev) => ({ ...prev, website: "" }));
              }}
              className={`${errors.website ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
              placeholder="https://digidzn.com/"
            />
            {errors.website && (
              <p className="text-sm text-red-500">{errors.website}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="salesEmail"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Sales Email
            </Label>
            <Input
              id="salesEmail"
              type="email"
              value={formData.salesEmail}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  salesEmail: e.target.value,
                }));
                if (errors.salesEmail)
                  setErrors((prev) => ({ ...prev, salesEmail: "" }));
              }}
              className={`${errors.salesEmail ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
              placeholder="value@digidzn.com"
            />
            {errors.salesEmail && (
              <p className="text-sm text-red-500">{errors.salesEmail}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="schedulingLink"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Scheduling Link
            </Label>
            <Input
              id="schedulingLink"
              value={formData.schedulingLink}
              onChange={(e) => {
                setFormData((prev) => ({ 
                  ...prev,
                  schedulingLink: e.target.value,
                }));
                if (errors.schedulingLink)
                  setErrors((prev) => ({ ...prev, schedulingLink: "" }));
              }}
              className={`${errors.schedulingLink ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
              placeholder="Scheduling Link"
            />
            {errors.schedulingLink && (
              <p className="text-sm text-red-500">{errors.schedulingLink}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="adminContactPhone"
              className="text-sm text-[#98A0B4] font-semibold font-inter"
            >
              Admin Contact Phone
            </Label>
            <Input
              id="adminContactPhone"
              type="tel"
              value={formData.adminContactPhone}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  adminContactPhone: e.target.value,
                }));
                if (errors.adminContactPhone)
                  setErrors((prev) => ({ ...prev, adminContactPhone: "" }));
              }}
              className={`${errors.adminContactPhone ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
              placeholder="Admin Contact Phone"
            />
            {errors.adminContactPhone && (
              <p className="text-sm text-red-500">{errors.adminContactPhone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="foundedYear"
              className="text-sm text-[#98A0B4] font-inter font-semibold"
            >
              Founding Year
            </Label>
            <Select
              value={formData.foundedYear?.toString() || ""}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  foundedYear: Number.parseInt(value),
                }));
                if (errors.foundedYear)
                  setErrors((prev) => ({ ...prev, foundedYear: "" }));
              }}
            >
              <SelectTrigger
                className={`${errors.foundedYear ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
              >
                <SelectValue placeholder="2022" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: new Date().getFullYear() - 1949 },
                  (_, i) => new Date().getFullYear() - i,
                ).map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.foundedYear && (
              <p className="text-sm text-red-500">{errors.foundedYear}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="totalEmployees"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Total Employees
            </Label>
            <Select
              value={formData.totalEmployees}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, totalEmployees: value }));
                if (errors.totalEmployees)
                  setErrors((prev) => ({ ...prev, totalEmployees: "" }));
              }}
            >
              <SelectTrigger
                className={`${errors.totalEmployees ? "border-red-500" : ""} border-[#D0D5DD] rounded-[6px] font-inter`}
              >
                <SelectValue placeholder="10 - 49" />
              </SelectTrigger>
              <SelectContent>
                {employeeSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.totalEmployees && (
              <p className="text-sm text-red-500">{errors.totalEmployees}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="tagline"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Tagline
            </Label>
            <div className="relative">
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => handleTaglineChange(e.target.value)}
                className={`${errors.tagline ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
                placeholder="We value your Needs"
                maxLength={50}
              />
              {/* <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                  {taglineCount} / 50
                </div> */}
            </div>
            {errors.tagline && (
              <p className="text-sm text-red-500">{errors.tagline}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="companyVideoLink"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Company Video Link
            </Label>
            <Input
              id="companyVideoLink"
              value={formData.companyVideoLink}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  companyVideoLink: e.target.value,
                }));
                if (errors.companyVideoLink)
                  setErrors((prev) => ({ ...prev, companyVideoLink: "" }));
              }}
              className={`${errors.companyVideoLink ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
              placeholder="Company Video Link"
            />
            {errors.companyVideoLink && (
              <p className="text-sm text-red-500">{errors.companyVideoLink}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="projects"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Projects Completed
            </Label>
            <div className="relative">
              <Input
                id="projects"
                type="number"
                min={1}
                value={formData.projectsCompleted}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    projectsCompleted: e.target.value,
                  }))
                }
                className={`${errors.tagline ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
                placeholder="Enter number of projects completed"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="location"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Location
            </Label>
            <div className="relative">
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                className={`${errors.tagline ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
                placeholder="Enter your company location"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="rate"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Hourly Rate
            </Label>
            <div className="relative">
              <Input
                id="rate"
                type="number"
                min={1}
                value={formData.hourlyRate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hourlyRate: e.target.value,
                  }))
                }
                className={`${errors.tagline ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
                placeholder="Enter starting proice per hour"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="insta"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Instagram Link
            </Label>
            <div className="relative">
              <Input
                id="insta"
                value={formData.socialLinks.instagram}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: {
                      ...prev.socialLinks,
                      instagram: e.target.value,
                    },
                  }))
                }
                className={`${errors.tagline ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
                placeholder="https://instagram.com/yourcompany"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="facebook"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Facebook link
            </Label>
            <div className="relative">
              <Input
                id="facebook"
                value={formData.socialLinks.facebook}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: {
                      ...prev.socialLinks,
                      facebook: e.target.value,
                    },
                  }))
                }
                className={`${errors.tagline ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
                placeholder="https://facebook.com/yourcompany"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="linkdin"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Linkdin Link
            </Label>
            <div className="relative">
              <Input
                id="linkdin"
                value={formData.socialLinks.linkedin}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: {
                      ...prev.socialLinks,
                      linkedin: e.target.value,
                    },
                  }))
                }
                className={`${errors.tagline ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="twiter"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Twitter Link
            </Label>
            <div className="relative">
              <Input
                id="twiter"
                value={formData.socialLinks.twitter}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: {
                      ...prev.socialLinks,
                      twitter: e.target.value,
                    },
                  }))
                }
                className={`${errors.tagline ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
                placeholder="https://twitter.com/yourcompany"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="languagesSpoken"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Languages Spoken
            </Label>

            <Select
              onValueChange={(value) => {
                addLanguage(value);
                // setSelectedLanguage("") //reset so placeholder shows
              }}
              value={selectedLanguage}
            >
              <SelectTrigger className="border-[#D0D5DD] rounded-[6px] font-inter mt-1">
                <SelectValue placeholder="Languages Spoken" />
              </SelectTrigger>
              <SelectContent>
                {languages
                  .filter(
                    (lang) => !(formData.languagesSpoken || []).includes(lang),
                  )
                  .map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mb-0">
              {(formData.languagesSpoken || []).map((language) => (
                <Badge
                  key={language}
                  variant="secondary"
                  onClick={() => removeLanguage(language)}
                  className="flex items-center gap-2 bg-[#1C96F4] rounded-[4px] font-inter"
                >
                  {language}
                  <X className="h-3 w-3 cursor-pointer" />
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="min-project-size"
              className="text-sm font-inter text-[#98A0B4] font-semibold"
            >
              Min Project Size
            </Label>
            <Input
              id="min-project-size"
              value={formData.minProjectSize}
              type="number"
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  minProjectSize: e.target.value,
                }));
              }}
              className={`placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
              placeholder="200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-sm font-inter text-[#98A0B4] font-semibold"
          >
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, description: e.target.value }));
              if (errors.description)
                setErrors((prev) => ({ ...prev, description: "" }));
            }}
            rows={6}
            className={`${errors.description ? "border-red-500" : ""} placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
            placeholder="about company"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="focus-area"
            className="text-sm font-inter text-[#98A0B4] font-semibold"
          >
            Focus Area
          </Label>
          <Textarea
            id="focus-area"
            value={formData.focusArea || ""}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, focusArea: e.target.value }));
            }}
            rows={6}
            className={` placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter`}
            placeholder="Focus areas about the company"
          />
        </div>
      </div>

      {/* Services Offered */}
      <div>
        <h1 className="font-inter text-xl text-[#000000] font-normal leading-6">
          Services Offered
        </h1>
        <p className="font-inter text-sm text-[#000000] font-normal mb-2 ">
          Manage Services you provide
        </p>
        <Card className="bg-[#fff] border-1 border-[#D0D5DD] rounded-[6px] font-inter shadow-none">
          <CardContent className="space-y-4 py-6">
            <div className="flex flex-wrap gap-2">
              {(formData.services || []).map((service) => (
                <Badge
                  key={service}
                  variant="secondary"
                  className="flex items-center gap-2 bg-[#1C96F4] font-inter"
                >
                  {service}
                  <div onClick={() => removeService(service)}>
                    <X className="h-3 w-3 cursor-pointer" />
                  </div>
                </Badge>
              ))}
            </div>

            {/* <div className="flex gap-2 w-[50%]">
            <Select value={newService} onValueChange={setNewService}>
              <SelectTrigger className="flex-1 placeholder:text-[#b2b2b2] mt-1 border-[#D0D5DD] rounded-[6px] h-[100px]">
                <SelectValue placeholder="Select a service to add" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((cat) => !(formData.services || []).includes(cat))
                  .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button onClick={addService}  className="bg-[#F54A0C] h-[36px] w-[70px] mt-1">
              <Plus className="h-4 w-4" />
            </Button>
          </div> */}
            {/* Step 1: Main Category */}
            <Select
              onValueChange={(title) => {
                const cat = categories.find((c) => c.title === title);
                setSelectedCategory(cat);
                setSelectedChild(null);
              }}
            >
              <SelectTrigger className="w-[50%] mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat.title}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Step 2: Sub Category */}
            {selectedCategory && (
              <Select
                onValueChange={(title) => {
                  const child = selectedCategory.children.find(
                    (c: any) => c.title === title,
                  );
                  setSelectedChild(child);
                }}
              >
                <SelectTrigger className="w-[50%] mt-1">
                  <SelectValue placeholder="Select sub category" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory.children.map((child: any) => (
                    <SelectItem key={child.title} value={child.title}>
                      {child.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Step 3: Service Items (Checkboxes) */}
            {selectedChild && (
              <div className="flex flex-col gap-2 mt-3">
                {selectedChild.items.map((item: any) => {
                  const checked = (formData.services || []).includes(
                    item.title,
                  );

                  return (
                    <label
                      key={item.title}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setFormData((prev) => ({
                            ...prev,
                            services: checked
                              ? prev.services.filter(
                                  (s: string) => s !== item.title,
                                )
                              : [...(prev.services || []), item.title],
                          }));
                        }}
                      />
                      {item.title}
                    </label>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/*Technologies offered */}

      <div>
        <h1 className="font-inter text-xl text-[#000000] font-normal leading-6">
          Technologies Offered
        </h1>
        <p className="font-inter text-sm text-[#000000] font-normal mb-2 ">
          Manage the Technologies you provide
        </p>
        <Card className="bg-[#fff] border-1 border-[#D0D5DD] rounded-[6px] font-inter shadow-none">
          <CardContent className="space-y-4 py-6">
            <div className="flex flex-wrap gap-2">
              {(formData.technologies || []).map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="flex items-center gap-2 bg-[#1C96F4] font-inter"
                >
                  {tech}
                  <div onClick={() => removeTech(tech)}>
                    <X className="h-3 w-3 cursor-pointer" />
                  </div>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2 w-[50%]">
              <Input
                type="text"
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                placeholder="Datsience..."
                className=" placeholder:text-[#b2b2b2] mt-1 border-[#D0D5DD] rounded-[6px]"
              />

              <Button
                onClick={addTech}
                className="bg-[#F54A0C] h-[36px] w-[70px] mt-1.5"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/*Industries working */}
      <div>
        <h1 className="font-inter text-xl text-[#000000] font-normal leading-6">
          Industries Working
        </h1>
        <p className="font-inter text-sm text-[#000000] font-normal mb-2 ">
          Manage the Industries you working
        </p>
        <Card className="bg-[#fff] border-1 border-[#D0D5DD] rounded-[6px] font-inter shadow-none">
          <CardContent className="space-y-4 py-6">
            <div className="flex flex-wrap gap-2">
              {(formData.industries || []).map((ind) => (
                <Badge
                  key={ind}
                  variant="secondary"
                  className="flex items-center gap-2 bg-[#1C96F4]"
                >
                  {ind}
                  <div onClick={() => removeIndustry(ind)}>
                    <X className="h-3 w-3 cursor-pointer" />
                  </div>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2 w-[50%]">
              <Input
                type="text"
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                placeholder="Consulting..."
                className=" placeholder:text-[#b2b2b2] mt-1 border-[#D0D5DD] rounded-[6px]"
              />

              <Button
                onClick={addIndustry}
                className="bg-[#F54A0C] h-[36px] w-[70px] mt-1.5"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/*Awards added */}
      {/* <div>
        <h1 className="font-inter text-xl text-[#000000] font-normal leading-6">
          Awards Recieved
        </h1>
        <p className="font-inter text-sm text-[#000000] font-normal mb-2 ">
          Manage the Awards you recieved
        </p>

        <Card className="bg-[#fff] border-1 border-[#D0D5DD] rounded-[6px] font-inter shadow-none">
          <CardContent className="space-y-4 py-6">
            <div className="flex flex-wrap gap-2">
              {(formData.awards || []).map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="flex items-center bg-[#1C96F4] gap-2"
                >
                  {item}
                  <div onClick={() => removeAward(item)}>
                    <X className="h-3 w-3 cursor-pointer" />
                  </div>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2 w-[50%]">
              <Input
                type="text"
                value={newAward}
                onChange={(e) => setNewAward(e.target.value)}
                placeholder="Best Company of the Year..."
                className=" placeholder:text-[#b2b2b2] mt-1 border-[#D0D5DD] rounded-[6px]"
              />

              <Button
                onClick={addAward}
                className="bg-[#F54A0C] h-[36px] w-[70px] mt-1.5"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/*Certifications added */}
      <div>
        <h1 className="font-inter text-xl text-[#000000] font-normal leading-6">
          Certification Recieved
        </h1>
        <p className="font-inter text-sm text-[#000000] font-normal mb-2 ">
          Manage the Certification you recieved
        </p>
        <Card className="bg-[#fff] border-1 border-[#D0D5DD] rounded-[6px] font-inter shadow-none">
          <CardContent className="space-y-4 py-6">
            <div className="flex flex-wrap gap-2">
              {(formData.certifications || []).map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="flex items-center bg-[#1C96F4] gap-2"
                >
                  {item}
                  <div onClick={() => removeCertification(item)}>
                    <X className="h-3 w-3 cursor-pointer" />
                  </div>
                </Badge>
              ))}
            </div>

            <div className="flex w-[50%] gap-2">
              <Input
                type="text"
                value={newCertificate}
                onChange={(e) => setNewCertificate(e.target.value)}
                placeholder="ISO..."
                className=" placeholder:text-[#b2b2b2] mt-1 border-[#D0D5DD] rounded-[6px]"
              />

              <Button
                onClick={addCertificate}
                className="bg-[#F54A0C] h-[36px] w-[70px] mt-1.5"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio */}
      <Card className="bg-[#fff] border-1 border-[#D0D5DD] rounded-[6px] font-inter shadow-none">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-inter text-xl text-[#000000] font-normal leading-6">
                Portfolio
              </CardTitle>
              <CardDescription className="font-inter text-sm text-[#000000] font-normal mb-2">
                Showcase your past projects
              </CardDescription>
            </div>
            <div className="flex flex-row gap-2">
              <Button
                onClick={() => setShowPortfolioForm(true)}
                className="bg-[#000] hover:bg-[#000] w-[120px] rounded-full text-[12px]"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
              {/* <Button onClick={addPortfolioItem} className="bg-[#39761E] hover:bg-[#39761E] w-[120px] rounded-full text-[12px]">{editPortfolioId?"Update":"Save Project"}</Button> */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showPortfolioForm && (
            <div className="pt-6 space-y-4">
              {/*project image */}
              <div className="space-y-2">
                <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                  Project Image
                </Label>
                <ImageUpload
                  value={portfolioForm.image}
                  onChange={(value) =>
                    setPortfolioForm((prev) => ({ ...prev, image: value }))
                  }
                  description="Upload your company ccover image (PNG, JPG) or provide a URL"
                  previewClassName="w-24 h-24"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                    Project Title
                  </Label>
                  <Input
                    value={portfolioForm.title || ""}
                    onChange={(e) =>
                      setPortfolioForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Project name"
                    className=" placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                    Category
                  </Label>
                  {/* <Select
                    value={portfolioForm.category ?? undefined}
                    onValueChange={(value) =>
                      setPortfolioForm((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="border-[#D0D5DD] rounded-[6px] font-inter">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.title ?? cat}
                          value={cat.title ?? cat}
                        >
                          {cat.title ?? cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                  <ServiceDropdown
                        value={portfolioForm.category ?? undefined}
                          onChange={(value) =>
                      setPortfolioForm((prev) => ({ ...prev, category: value }))
                    }
                          triggerClassName="border-[#D0D5DD] rounded-[6px] font-inter"
                        />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                  Description
                </Label>
                <Textarea
                  value={portfolioForm.description || ""}
                  onChange={(e) =>
                    setPortfolioForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the project and your role..."
                  rows={3}
                  className=" placeholder:text-[#b2b2b2] border-[#D0D5DD] border-1 rounded-[6px] font-inter"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                    Project URL
                  </Label>
                  <Input
                    value={portfolioForm.projectUrl || ""}
                    onChange={(e) =>
                      setPortfolioForm((prev) => ({
                        ...prev,
                        projectUrl: e.target.value,
                      }))
                    }
                    placeholder="https://project-url.com"
                    className=" placeholder:text-[#b2b2b2] border-[#D0D5DD] border-1 rounded-[6px] font-inter"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                    Completion Date
                  </Label>
                  <Input
                    type="date"
                    value={
                      portfolioForm.completedAt instanceof Date
                        ? portfolioForm.completedAt.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setPortfolioForm((prev) => ({
                        ...prev,
                        completedAt: e.target.value
                          ? new Date(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                </div>
              </div>

              {/*Technologies used in this project */}
              <div className="space-y-5 mt-4">
                <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                  Technologies Used
                </Label>
                <div className="flex flex-wrap gap-2">
                  {(portfolioForm.technologies || []).map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="flex items-center bg-[#1C96F4] gap-2"
                    >
                      {tech}
                      <div onClick={() => removePortfolioTech(tech)}>
                        <X className="h-3 w-3 cursor-pointer" />
                      </div>
                    </Badge>
                  ))}
                </div>

                <div className="flex w-[50%] gap-2 -mt-2">
                  <Input
                    type="text"
                    value={portfolioTechnology}
                    onChange={(e) => setPortfolioTechnology(e.target.value)}
                    placeholder="Datsience..."
                    className=" placeholder:text-[#b2b2b2] mt-1 border-[#D0D5DD] border-1 rounded-[6px] font-inter"
                  />

                  <Button
                    onClick={addPorfolioTech}
                    className="bg-[#F54A0C] h-[36px] w-[70px] mt-1.5"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={addPortfolioItem}
                  className="bg-[#FF0000] hover:bg-[#FF0000] rounded-full"
                >
                  {editPortfolioId ? "Update" : "Add Project"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPortfolioForm(false)}
                  className="bg-[#000] hover:bg-[#000] text-[#fff] rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {(formData.portfolio || []).map((item) => (
              <div
                key={item.id || item._id}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                  <img
                    src={
                      item.image ||
                      `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(item.title) || "/placeholder.svg"}`
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <Badge
                    variant="outline"
                    className="mb-2 bg-[#ebecee] rounded-2xl text-[12px] text-[#000]"
                  >
                    {item.category}
                  </Badge>
                  <h4 className="font-semibold text-md mb-1">{item.title}</h4>
                  <p className="text-sm text-[#b2b2b2] line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.technologies.map((tech, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs bg-[#d9e4f6] text-[#000] rounded-2xl"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  {/* {item.projectUrl && (
                          <a
                            href={item.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            View Project <ExternalLink className="h-3 w-3" />
                          </a>
                        )} */}
                  <div className="flex justify-between">
                    <Button
                      className="bg-[#F54A0C] h-[30px] w-[80px] rounded-xl"
                      onClick={() => removePortfolioItem(item.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      className="bg-[#39761E] h-[30px] w-[80px] rounded-xl"
                      onClick={() => editPortfolioItem(item.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/*Testimonials */}

      <Card className="bg-[#fff] border-1 border-[#D0D5DD] rounded-[6px] font-inter shadow-none">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-inter text-xl text-[#000000] font-normal leading-6">
                Testimonials
              </CardTitle>
              <CardDescription className="font-inter text-sm text-[#000000] font-normal mb-2">
                What your clients say about your work
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowTestimonialForm(true)}
              className="bg-[#000] hover:bg-[#000] min-w-[120px] rounded-full text-[12px]"
            >
              <Plus className="h-4 w-4 " />
              Add Testimonial
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {showTestimonialForm && (
            <div className="pt-6 space-y-4">
              {/* Avatar Image */}
              <div className="space-y-2">
                <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                  Client Avatar
                </Label>
                <ImageUpload
                  value={testimonialForm.avatar}
                  onChange={(value) =>
                    setTestimonialForm((prev) => ({ ...prev, avatar: value }))
                  }
                  description="Upload the client's avatar (PNG, JPG) or provide a URL"
                  previewClassName="w-24 h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Client Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                    Client Name
                  </Label>
                  <Input
                    value={testimonialForm.clientName || ""}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        clientName: e.target.value,
                      }))
                    }
                    placeholder="John Doe"
                    className="placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter"
                  />
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                    Company
                  </Label>
                  <Input
                    value={testimonialForm.company || ""}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    placeholder="ABC Pvt Ltd"
                    className="placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter"
                  />
                </div>
              </div>

              {/* Testimonial Text */}
              <div className="space-y-2">
                <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                  Feedback
                </Label>
                <Textarea
                  value={testimonialForm.text || ""}
                  onChange={(e) =>
                    setTestimonialForm((prev) => ({
                      ...prev,
                      text: e.target.value,
                    }))
                  }
                  placeholder="Share client's experience..."
                  rows={3}
                  className="placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Rating */}
                <div className="space-y-2">
                  <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                    Rating
                  </Label>
                  <Select
                    value={testimonialForm.rating || ""}
                    onValueChange={(value) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        rating: value,
                      }))
                    }
                  >
                    <SelectTrigger className="border-[#D0D5DD] rounded-[6px] font-inter">
                      <SelectValue placeholder="Select Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                    Date
                  </Label>
                  <Input
                    type="date"
                    value={testimonialForm.date || ""}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="placeholder:text-[#b2b2b2] border-[#D0D5DD] rounded-[6px] font-inter"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={addOrUpdateTestimonial}
                  className="bg-[#FF0000] hover:bg-[#FF0000] rounded-full"
                >
                  {editTestimonialId ? "Update" : "Add Testimonial"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTestimonialForm(false)}
                  className="bg-[#000] hover:bg-[#000] rounded-full text-[#fff]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Testimonials List */}
          <div className="grid md:grid-cols-2 gap-4">
            {(formData.testimonials || []).map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex justify-center items-center">
                  <img
                    src={
                      item.avatar ||
                      `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(
                        item.clientName,
                      )}`
                    }
                    alt={item.clientName}
                    className="w-24 h-24 rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="p-4">
                  <Badge
                    variant="outline"
                    className="mb-2 bg-[#ebecee] rounded-2xl text-[12px] text-[#000]"
                  >
                    ⭐ {item.rating}/5
                  </Badge>

                  <h4 className="font-semibold text-md mb-1">
                    {item.clientName}
                  </h4>
                  <p className="text-sm text-[#b2b2b2]">{item.company}</p>

                  <p className="text-sm text-[#b2b2b2] line-clamp-2 my-3">
                    {item.text}
                  </p>

                  <div className="flex justify-between">
                    <Button
                      className="bg-[#F54A0C]  h-[30px] w-[80px] rounded-xl"
                      onClick={() => removeTestimonialItem(item.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      className="bg-[#39761E] h-[30px] w-[80px] rounded-xl"
                      onClick={() => editTestimonialItem(item.id || item._id)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
