
"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
const ClientSpendingPage=()=>{
    return(
        <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Spending Insights</h1>
              <p className="text-muted-foreground">Track your project spending and budget utilization</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>Detailed spending analytics and budget tracking features</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This page will provide comprehensive insights into your project spending, budget allocation, and cost
                  trends.
                </p>
              </CardContent>
            </Card>
          </div>
    )
}
export default ClientSpendingPage