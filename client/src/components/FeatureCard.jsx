
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function FeatureCard({ icon, title, description }) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
      <CardHeader className="pb-2">
        <div className="bg-jobconnect-primary/10 dark:bg-jobconnect-primary/20 text-jobconnect-primary p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </CardContent>
    </Card>
  );
}
