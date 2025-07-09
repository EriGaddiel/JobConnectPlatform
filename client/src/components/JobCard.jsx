
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, DollarSign } from "lucide-react"; // Import icons
import { cn } from "@/lib/utils"; // Import cn utility

export function JobCard({ id, title, company, location, type, category, salary, posted, companyLogo, ...rest }) {
  // Fallbacks for key display elements
  const displayTitle = title || "Untitled Job";
  const displayCompany = company || "Unknown Company";
  const displayLocation = location || "Not specified";
  const displayType = type || rest.employmentType || "N/A";
  const displayCategory = category || "General";
  const displaySalary = salary || "Not Disclosed";
  const displayPosted = posted || "Recently";

  return (
    <Card className={cn("job-card hover:border-jobconnect-primary transition-all duration-300 h-full flex flex-col", rest.compact ? "p-3" : "p-0")}>
      <CardHeader className={cn("pb-2", rest.compact ? "pt-2 px-3" : "p-5")}>
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-2">
            <h3 className={cn("font-semibold hover:text-jobconnect-primary truncate", rest.compact ? "text-md" : "text-lg")} title={displayTitle}>
              <Link to={`/jobs/${id}`}>{displayTitle}</Link>
            </h3>
            <div className="flex items-center text-muted-foreground text-xs sm:text-sm mt-1">
              {companyLogo ? (
                <img src={companyLogo} alt={`${displayCompany} logo`} className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 object-contain rounded-sm"/>
              ) : (
                <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 flex-shrink-0" />
              )}
              <span className="truncate" title={displayCompany}>{displayCompany}</span>
            </div>
          </div>
          {displayCategory && !rest.compact && (
            <Badge variant={displayCategory === "Formal" ? "default" : "secondary"} className={cn("shrink-0 text-xs px-2 py-0.5", displayCategory === "Formal" ? "bg-jobconnect-formal" : "bg-jobconnect-informal")}>
              {displayCategory}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className={cn("pb-3 flex-grow", rest.compact ? "px-3 pt-1 text-xs" : "px-5 pt-0")}>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <Badge variant="outline" className="font-normal text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
            <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-muted-foreground" /> {displayType}
          </Badge>
          <Badge variant="outline" className="font-normal text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-muted-foreground" /> {displayLocation}
          </Badge>
          {displaySalary && displaySalary !== "Not Disclosed" && (
            <Badge variant="outline" className="font-normal text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-muted-foreground" />{displaySalary}
            </Badge>
          )}
        </div>
        {rest.compact && displayCategory && (
             <Badge variant={displayCategory === "Formal" ? "default" : "secondary"} className={cn("shrink-0 text-xs px-2 py-0.5 mb-2", displayCategory === "Formal" ? "bg-jobconnect-formal" : "bg-jobconnect-informal")}>
              {displayCategory}
            </Badge>
        )}
        {rest.description && !rest.compact && <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{rest.description}</p>}
      </CardContent>
      <CardFooter className={cn("pt-2 flex justify-between items-center", rest.compact ? "px-3 pb-3" : "p-5 pt-0")}>
        <div className="text-xs text-muted-foreground">
          Posted: {displayPosted}
        </div>
        <div className="flex gap-2">
          {/* Apply Now button commented out for general card, more suitable for detail page */}
          {/* <Button asChild size="sm" className={cn("px-3 py-1 h-auto", rest.compact && "text-xs px-2 py-0.5")}>
            <Link to={`/jobs/${id}/apply`}>Apply</Link>
          </Button> */}
          <Button asChild variant="outline" size="sm" className={cn("px-3 py-1 h-auto", rest.compact && "text-xs px-2 py-0.5")}>
            <Link to={`/jobs/${id}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
