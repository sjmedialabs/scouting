"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, DollarSign, Calendar, Award } from "lucide-react"
import type { Provider } from "@/lib/types"

interface ProviderComparisonProps {
  providers: Provider[]
  isOpen: boolean
  onClose: () => void
  onSelectProvider: (providerId: string) => void
}

export function ProviderComparison({ providers, isOpen, onClose, onSelectProvider }: ProviderComparisonProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Providers</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <Card key={provider.id} className="relative">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{provider.companyName}</CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{provider.rating}</span>
                      <span className="text-xs text-muted-foreground">({provider.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{provider.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Founded {provider.foundedYear}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${provider.hourlyRate}/hour</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {provider.services.slice(0, 3).map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {provider.services.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{provider.services.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex gap-1">
                  {provider.verified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                  {provider.featured && <Badge className="text-xs">Featured</Badge>}
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      provider.subscriptionTier === "premium"
                        ? "border-purple-200 text-purple-700"
                        : provider.subscriptionTier === "standard"
                          ? "border-blue-200 text-blue-700"
                          : "border-gray-200 text-gray-700"
                    }`}
                  >
                    {provider.subscriptionTier}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">{provider.description}</p>

                <Button onClick={() => onSelectProvider(provider.id)} className="w-full" size="sm">
                  Select Provider
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close Comparison
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
