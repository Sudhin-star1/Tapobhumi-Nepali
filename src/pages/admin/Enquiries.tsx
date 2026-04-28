import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiJson } from "@/admin/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

type EnquiryStatus = "new" | "contacted";

type Enquiry = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  packageName?: string;
  message?: string;
  status: EnquiryStatus;
  createdAt: string;
};

function badgeClasses(status: EnquiryStatus) {
  return status === "new"
    ? "inline-flex items-center rounded-full bg-red-500/10 text-red-700 border border-red-500/20 px-2.5 py-1 text-xs font-medium"
    : "inline-flex items-center rounded-full bg-green-600/10 text-green-700 border border-green-600/20 px-2.5 py-1 text-xs font-medium";
}

export default function AdminEnquiries() {
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["enquiries"],
    queryFn: () => apiFetch<Enquiry[]>("/api/enquiries"),
  });

  const mark = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EnquiryStatus }) =>
      apiJson<Enquiry>(`/api/enquiries/${id}`, { status }, { method: "PATCH" }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["enquiries"] });
      toast({ title: "Updated" });
    },
    onError: (err: any) => toast({ title: "Update failed", description: err?.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/enquiries/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["enquiries"] });
      toast({ title: "Deleted" });
    },
    onError: (err: any) => toast({ title: "Delete failed", description: err?.message, variant: "destructive" }),
  });

  const rows = useMemo(() => q.data ?? [], [q.data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Enquiries</h1>
        <p className="text-sm text-muted-foreground">Website form submissions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Enquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {q.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-muted-foreground">No enquiries yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((e) => {
                  const pkg = e.packageName || "—";
                  const waText = encodeURIComponent(`Hello, regarding your enquiry for ${pkg}`);
                  const wa = `https://wa.me/${e.phone}?text=${waText}`;
                  return (
                    <TableRow key={e._id}>
                      <TableCell className="font-medium">{e.name}</TableCell>
                      <TableCell>{e.phone}</TableCell>
                      <TableCell className="text-muted-foreground">{pkg}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[360px] truncate">{e.message || "—"}</TableCell>
                      <TableCell>
                        <span className={badgeClasses(e.status)}>{e.status}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(e.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {e.status !== "contacted" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => mark.mutate({ id: e._id, status: "contacted" })}
                            disabled={mark.isPending}
                          >
                            Mark as Contacted
                          </Button>
                        )}
                        <Button asChild variant="outline" size="sm">
                          <a href={wa} target="_blank" rel="noopener noreferrer">
                            WhatsApp
                          </a>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => del.mutate(e._id)} disabled={del.isPending}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

