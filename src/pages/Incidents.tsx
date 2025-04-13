
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { IncidentManagement } from "@/components/incidents/IncidentManagement";

const Incidents = () => {
  return (
    <DashboardLayout>
      <IncidentManagement />
    </DashboardLayout>
  );
};

export default Incidents;
