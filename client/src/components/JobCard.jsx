
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";

export function JobCard({ id, title, company, location, type, category, salary, posted }) {
  return (
    <Card className="job-card hover:border-jobconnect-primary transition-all duration-300 h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold hover:text-jobconnect-primary">
              <Link to={`/jobs/${id}`}>{title}</Link>
            </h3>
            <p className="text-muted-foreground text-sm">{company}</p>
          </div>
          <Badge variant={category === "Formal" ? "default" : "secondary"} className={category === "Formal" ? "bg-jobconnect-formal" : "bg-jobconnect-informal"}>
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-foreground">
            {type}
          </Badge>
          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-foreground">
            {location}
          </Badge>
          {salary && (
            <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-foreground">
              {salary}
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Posted {posted}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button asChild variant="outline" size="sm">
          <Link to={`/jobs/${id}`}>View Details</Link>
        </Button>
        <Button asChild size="sm">
          <Link to={`/jobs/${id}/apply`}>Apply Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
