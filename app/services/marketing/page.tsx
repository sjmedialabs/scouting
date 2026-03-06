import ServicePageLayout from "@/components/ServicePageLayout";

export default function DevelopmentPage() {
  const pageConfig ={
    title:"Marketing Services",
    subtitle:"Partner with top marketing agencies and specialists for digital marketing, brand development, SEO, social media, and growth strategies that drive results.",
    heroImage:"/Service_Details_Hero_Image.jpg",
    cta: {
      heading: "Need Professional Marketing Services?",
      sub: "Connect with certified Marketing professionals for your business needs.",
      buttonText: "Click here post a project",
    },

    stats: [
      { label: "Marketing Experts", value: "3,200+" },
      { label: "Campaigns Launched", value: "1,800+" },
      { label: "Average Rating", value: "4.8" },
      { label: "Avg Response Time", value: "36h" },
    ],

    providers: [
      {
        id: "1",
        verified: true,
        featured: true,
        name: "Digital Growth Agency",
        cover: "/Creative_Design_Studio.jpg",
        rating: 4.8,
        desc: "Full-service digital marketing agency driving growth through data-driven strategies.",
        tags: ["SEO","PPC","Content Marketing"],
        location: "New York, NY",
        projects: 249,
        response: "2 hours",
        rate: "$100-200/hour",
      },
      {
         id: "1",
        verified: true,
        featured: true,
        name: "Brand Boost Marketing",
        cover:"/TechCraft_Solutions.jpg",
        rating: 4.9,
        desc: "Creative Marketing team specializing in brand development and social media growth.",
        tags: ["Social Media", "Brand Strategy", "Influncer Marketing"],
        location: "Los Angeles, CA",
        projects: 49,
        response: "3 hours",
        rate: "$70-150/hour",
      },
    ],
  }

  return <ServicePageLayout {...pageConfig} />
}