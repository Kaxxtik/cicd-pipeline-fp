
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JenkinsPipelineModule } from "@/components/dashboard/modules/JenkinsPipelineModule";

const Pipelines = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Pipeline Management</h1>
        <p className="text-muted-foreground">Monitor and manage your CI/CD pipelines</p>
        
        <div className="grid gap-6">
          <JenkinsPipelineModule />
          
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">Detailed pipeline analytics coming soon...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pipelines;
