
import { ArchetypeTestingInterface } from "@/components/testing/ArchetypeTestingInterface";
import { AdminGate } from "@/components/AdminGate";

const ArchetypeTesting = () => {
  return (
    <AdminGate>
      <div className="min-h-screen bg-zen-paper">
        <ArchetypeTestingInterface />
      </div>
    </AdminGate>
  );
};

export default ArchetypeTesting;
