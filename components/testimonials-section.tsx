"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "CTO",
    company: "TechStart Inc.",
    content:
      "Spark transformed how we find and work with agencies. The quality of proposals we receive is exceptional, and the platform makes collaboration seamless.",
    rating: 5,
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    role: "Freelance Developer",
    company: "Independent",
    content:
      "As an agency, Spark has connected me with high-quality clients. The subscription model is fair and the tools help me showcase my work effectively.",
    rating: 5,
  },
  {
    id: "3",
    name: "Emily Watson",
    role: "Marketing Director",
    company: "GrowthCorp",
    content:
      "The review system and project management features make it easy to track progress and maintain quality standards. Highly recommended for B2B services.",
    rating: 4,
  },
  {
    id: "4",
    name: "David Kim",
    role: "Design Consultant",
    company: "Creative Solutions",
    content:
      "Spark's platform is intuitive and professional. The negotiation tools and milestone tracking have streamlined my client relationships significantly.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover how Spark is transforming B2B service relationships for both clients and agencies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-muted-foreground/30 mb-4" />

                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>

                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
