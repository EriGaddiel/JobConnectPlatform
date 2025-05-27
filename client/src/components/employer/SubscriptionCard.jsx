
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function SubscriptionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>Your current plan and usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Business Plan</h3>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Active
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mb-4">Unlimited job postings, premium support, featured listings</p>
          <div className="flex items-center justify-between text-sm">
            <span>Renewal on Jun 22, 2025</span>
            <span className="font-medium">$99/month</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Job Postings</span>
              <span className="text-sm font-medium">3/Unlimited</span>
            </div>
            <Progress value={30} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Featured Listings</span>
              <span className="text-sm font-medium">1/3 used</span>
            </div>
            <Progress value={33} className="h-2" />
          </div>
        </div>
        
        <Button className="w-full mt-8" asChild>
          <Link to="/employer/billing">Manage Subscription</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
