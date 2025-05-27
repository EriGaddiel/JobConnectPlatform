
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function PerformanceAnalytics() {
  const data = [
    { name: "Web Developer", applications: 45, views: 234 },
    { name: "UI Designer", applications: 32, views: 187 },
    { name: "Content Writer", applications: 28, views: 156 },
    { name: "Marketing", applications: 19, views: 89 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Performance Analytics</CardTitle>
        <CardDescription>Views and applications for your job postings</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="views" fill="#8884d8" name="Views" />
            <Bar dataKey="applications" fill="#82ca9d" name="Applications" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
