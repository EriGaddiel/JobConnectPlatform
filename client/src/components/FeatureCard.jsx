
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function FeatureCard({ icon, title, description }) {
  const displayTitle = title || "Feature Title";
  const displayDescription = description || "Detailed description of this amazing feature.";

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
      <CardHeader className="pb-2">
        {icon && ( // Conditionally render icon container if icon is provided
          <div className="bg-jobconnect-primary/10 dark:bg-jobconnect-primary/20 text-jobconnect-primary p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-semibold">{displayTitle}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{displayDescription}</p> {/* Use muted-foreground */}
      </CardContent>
    </Card>
  );
}
