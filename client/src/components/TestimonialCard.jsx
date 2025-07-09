
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "@/components/StarRating";

export function TestimonialCard({ name, role, rating, content, avatarSrc }) {
  return (
    <Card className="h-full flex flex-col border-0 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-lg">{name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <StarRating rating={rating} />
        <p className="text-gray-600 dark:text-gray-300 mt-4">{content}</p>
      </CardContent>
    </Card>
  );
}
