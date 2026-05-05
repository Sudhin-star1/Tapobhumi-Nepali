import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/admin/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: () => apiFetch<{ ok: boolean }>("/api/health"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview & quick status.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Status</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          {health.isLoading ? "Checking..." : health.data?.ok ? "Connected" : "Not connected"}
        </CardContent>
      </Card>
    </div>
  );
}

