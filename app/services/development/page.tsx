import ServicePageLayout from "@/components/ServicePageLayout";

export default function DevelopmentPage() {
  const pageConfig ={
    title:"Mobile App Development",
    subtitle:"Find expert IT service providers for cloud solutions, cybersecurity,\u200B system integration, and technical consulting to transform your busines infrastructure.",
    heroImage:"/Service_Details_Hero_Image.jpg",
    cta: {
      heading: "Need Mobile App Services?",
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
        name: "CreativeDesign Studio",
        cover: "/Creative_Design_Studio.jpg",
        rating: 4.8,
        desc: "Looking for a modern e-commerce platform with payment integration.",
        tags: ["Video Editing","Mobile Development","Branding"],
        location: "San Francisco, CA",
        projects: 60,
        response: "2 hours",
        rate: "$75/hour",
      },
      {
         id: "2",
        verified: true,
        featured: false,
        name: "TechCraft Solutions",
        cover:"/TechCraft_Solutions.jpg",
        rating: 4.5,
        desc: "Tech partner for ambitious web & mobile applications.",
        tags: ["React Native", "Firebase", "Branding"],
        location: "San Francisco, CA",
        projects: 89,
        response: "3 hours",
        rate: "$70/hour",
      },
      {
        id: "3",
        verified: true,
        featured: true,
        name: "TechCraft Solutions",
        cover:"/TechCraft_Solutions.jpg",
        rating: 4.2,
        desc: "Tech partner for ambitious web & mobile applications.",
        tags: ["React Native", "Firebase", "Branding"],
        location: "San Francisco, CA",
        projects: 89,
        response: "3 hours",
        rate: "$75/hour",
      }
    ],
  }

  return <ServicePageLayout {...pageConfig} />
}