
import { AdminGate } from "@/components/AdminGate";
import { LearningDashboard } from "@/components/LearningDashboard";

const LearningAnalytics = () => {
  return (
    <AdminGate>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Learning Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor system learning progress and performance metrics
            </p>
          </div>
          
          <LearningDashboard />
        </div>
      </div>
    </AdminGate>
  );
};

export default LearningAnalytics;
