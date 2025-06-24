
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const TestQuestionManager = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Manager</CardTitle>
        <CardDescription>
          Create and manage benchmark test questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">Question management interface coming next...</p>
      </CardContent>
    </Card>
  );
};
