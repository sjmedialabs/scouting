import ServicePageLayout from "@/components/ServicePageLayout";

export default function DevelopmentPage() {
  const pageConfig ={
    title:"IT Services",
    subtitle:"Find expert IT service providers for cloud solutions, cybersecurity,\u200B system integration, and technical consulting to transform your busines infrastructure.",
    heroImage:"/Service_Details_Hero_Image.jpg",
    cta: {
      heading: "Need IT Services?",
      sub: "Connect with certified IT professionals for your technology needs.",
      buttonText: "Click here post a project",
    },

    stats: [
      { label: "IT Experts", value: "1,800+" },
      { label: "Projects Delivered", value: "950+" },
      { label: "Average Rating", value: "4.7" },
      { label: "Avg Response Time", value: "24h" },
    ],

    providers: [
      {
        id: "1",
        verified: true,
        featured: true,
        name: "CloudTech Solutions",
        cover: "/Creative_Design_Studio.jpg",
        rating: 3.2,
        desc: "Enterprise IT solutions provider specializing in cloud infrastructure and security.",
        tags: ["Cloud Migration","DevOps","Cybersecurity"],
        location: "Seattle, WA",
        projects: 499,
        response: "2 hours",
        rate: "$75-160/hour",
      },
      {
         id: "2",
        verified: true,
        featured: true,
        name: "DataFlow Systems",
        cover:"/TechCraft_Solutions.jpg",
        rating: 4.7,
        desc: "IT consulting firm focused on data management and system optimization.",
        tags: ["Data Analytics", "System Integration", "IT Consulting"],
        location: "Chicago, IL",
        projects: 99,
        response: "3 hours",
        rate: "$70-120/hour",
      },
    ],
  }

  return <ServicePageLayout {...pageConfig} />
}