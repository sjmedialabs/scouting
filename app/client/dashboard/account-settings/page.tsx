import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Settings } from "lucide-react"
const clientAccountSettings=()=>{
    return(
     <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold capitalize"></h1>
              <p className="text-muted-foreground">This section is coming soon</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Feature under development</p>
                </div>
              </CardContent>
            </Card>
        </div>
    )
}
export default clientAccountSettings