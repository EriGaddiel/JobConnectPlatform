
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "@/components/StarRating"; // Assuming this component handles rating=0 or undefined gracefully

export function TestimonialCard({ name, role, rating, content, avatarSrc }) {
  const displayName = name || "Anonymous User";
  const displayRole = role || "Valued User";
  const displayContent = content || "This user had a great experience with JobConnect!";
  const fallbackInitial = displayName?.charAt(0)?.toUpperCase() || "A";

  return (
    <Card className="h-full flex flex-col border-0 shadow-lg bg-card"> {/* Ensure bg-card for theming */}
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={avatarSrc || undefined} /> {/* Pass undefined if empty for default behavior */}
            <AvatarFallback>{fallbackInitial}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-lg text-foreground">{displayName}</h4>
            <p className="text-sm text-muted-foreground">{displayRole}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {typeof rating === 'number' && rating > 0 && <StarRating rating={rating} />}
        <p className="text-muted-foreground mt-4">{displayContent}</p>
      </CardContent>
    </Card>
  );
}
