import ServicePageLayout from "@/components/ServicePageLayout";

export default function DevelopmentPage() {
  const pageConfig ={
    title:"Business Services",
    subtitle:"Find expert business consultants and service providers for strategy, operations, financial planning, market research, and business development solutions.",
    heroImage:"/Service_Details_Hero_Image.jpg",
    cta: {
      heading: "Need to grow your Business?",
      sub: "Connect with expert Business professionals for your branding needs.",
      buttonText: "Click here post a project",
    },

    stats: [
      { label: "Business Experts", value: "1,500+" },
      { label: "Projects Delivered", value: "800+" },
      { label: "Average Rating", value: "4.7" },
      { label: "Avg Response Time", value: "12h" },
    ],

    providers: [
      {
        id: "1",
        verified: true,
        featured: false,
        name: "Strategic Business Solutions",
        cover: "/Creative_Design_Studio.jpg",
        rating: 4.2,
        desc: "Management consulting firm helping businesses optimize operations and drive growth.",
        tags: ["Business Strategy","Operations","Financial Planing"],
        location: "Boston, MA",
        projects: 499,
        response: "2 hours",
        rate: "$150-300/hour",
      },
      {
         id: "2",
        verified: true,
        featured: true,
        name: "Growth Partners LLC",
        cover:"/TechCraft_Solutions.jpg",
        rating: 4.7,
        desc: "Business consulting specialists focused on market expansion and operational efficiency.",
        tags: ["Marketing Research", "Business Development"],
        location: "Denver, CO",
        projects: 99,
        response: "3 hours",
        rate: "$100-200/hour",    
      },
    ],
  }

  return <ServicePageLayout {...pageConfig} />
}