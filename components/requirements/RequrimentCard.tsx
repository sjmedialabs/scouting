import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign } from "lucide-react"

interface Requirement {
  id: string
  title: string
  category: string
  budget: string
  timeline: string
  description: string
  postedDate: string
  proposals: number
  status: string
}

export function RequirementCard({ req }: { req: Requirement }) {
  return (
    <Card className="rounded-2xl bg-[#f6fbfe] border-0">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <Badge className="bg-[#EAF0FF] text-[#2C34A1]">{req.category}</Badge>
            <Badge variant="outline">{req.status}</Badge>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {req.postedDate}
          </div>
        </div>

        <CardTitle className="text-lg mt-2">{req.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {req.description}
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{req.budget}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{req.timeline}</span>
          </div>
          <div className="text-muted-foreground">
            {req.proposals} proposals received
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full">
            View Details
          </Button>
          <Button className="rounded-full bg-[#2C34A1] hover:bg-[#2C34A1]">
            Submit Proposal
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}