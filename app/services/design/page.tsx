import ServicePageLayout from "@/components/ServicePageLayout";

export default function DevelopmentPage() {
  const pageConfig ={
    title:"Design Services",
    subtitle:"Connect with talented designers and creative agencies for UI/UX design, branding, graphic design, and visual solutions that make your business stand out.",
    heroImage:"/Service_Details_Hero_Image.jpg",
    cta: {
      heading: "Need Professional Designing Services?",
      sub: "Connect with expert Design professionals for your branding needs.",
      buttonText: "Click here post a project",
    },

    stats: [
      { label: "Design Experts", value: "2,800+" },
      { label: "Projects Completed", value: "1,500+" },
      { label: "Average Rating", value: "4.9" },
      { label: "Avg Response Time", value: "24h" },
    ],

    providers: [
      {
        id: "1",
        verified: true,
        featured: true,
        name: "SJ Media Labs",
        cover: "/Creative_Design_Studio.jpg",
        rating: 4.9,
        desc: "Award-winning design studio creating exceptional user experiences and brand identities.",
        tags: ["UI/UX Design","Branding","Web Design"],
        location: "San Francisco, CA",
        projects: 99,
        response: "2 hours",
        rate: "$80-160/hour",
      },
      {
         id: "2",
        verified: true,
        featured: true,
        name: "Pixel Perfect Design",
        cover:"/TechCraft_Solutions.jpg",
        rating: 4.8,
        desc: "Creative design agency specializing in visual identity and print design solutions.",
        tags: ["Graphic Designing", "Print Design", "Logo Design"],
        location: "Portland, OR",
        projects: 49,
        response: "3 hours",
        rate: "$60-120/hour",
      },
    ],
  }

  return <ServicePageLayout {...pageConfig} />
}