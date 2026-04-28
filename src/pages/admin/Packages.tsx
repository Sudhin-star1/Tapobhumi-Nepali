import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch, apiJson } from "@/admin/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

type Itinerary = { day: number; title: string; description: string };
type Package = {
  _id: string;
  title: string;
  slug: string;
  duration: string;
  category: "trek" | "tour" | "spiritual";
  itinerary: Itinerary[];
  price?: number;
  images: string[];
  featured: boolean;
  createdAt: string;
};

const emptyDraft = {
  title: "",
  duration: "",
  category: "tour" as const,
  featured: false,
  price: "",
  itineraryJson: "[]",
  imagesCsv: "",
};

export default function AdminPackages() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [draft, setDraft] = useState({ ...emptyDraft });

  const packages = useQuery({
    queryKey: ["packages"],
    queryFn: () => apiFetch<Package[]>("/api/packages"),
  });

  const createOrUpdate = useMutation({
    mutationFn: async () => {
      const itinerary = JSON.parse(draft.itineraryJson || "[]") as Itinerary[];
      const images = draft.imagesCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: draft.title,
        duration: draft.duration,
        category: draft.category,
        featured: draft.featured,
        price: draft.price ? Number(draft.price) : undefined,
        itinerary,
        images,
      };

      if (editing) {
        return apiJson<Package>(`/api/packages/${editing._id}`, payload, { method: "PUT" });
      }
      return apiJson<Package>("/api/packages", payload);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["packages"] });
      toast({ title: editing ? "Package updated" : "Package created" });
      setOpen(false);
      setEditing(null);
      setDraft({ ...emptyDraft });
    },
    onError: (err: any) => toast({ title: "Save failed", description: err?.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/packages/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["packages"] });
      toast({ title: "Package deleted" });
    },
    onError: (err: any) => toast({ title: "Delete failed", description: err?.message, variant: "destructive" }),
  });

  const rows = useMemo(() => packages.data ?? [], [packages.data]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Packages</h1>
          <p className="text-sm text-muted-foreground">Create, edit, delete packages and toggle featured.</p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) {
              setEditing(null);
              setDraft({ ...emptyDraft });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditing(null);
                setDraft({ ...emptyDraft });
              }}
            >
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Package" : "Add Package"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input value={draft.duration} onChange={(e) => setDraft((d) => ({ ...d, duration: e.target.value }))} placeholder="6 Days · 5 Nights" />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value as any }))} placeholder="trek | tour | spiritual" />
              </div>
              <div className="space-y-2">
                <Label>Price (optional)</Label>
                <Input value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))} placeholder="e.g. 499" />
              </div>

              <div className="flex items-center gap-3 md:col-span-2">
                <Switch checked={draft.featured} onCheckedChange={(v) => setDraft((d) => ({ ...d, featured: v }))} />
                <Label>Featured</Label>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Images (comma-separated URLs)</Label>
                <Input value={draft.imagesCsv} onChange={(e) => setDraft((d) => ({ ...d, imagesCsv: e.target.value }))} placeholder="https://... , https://..." />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Itinerary JSON</Label>
                <Textarea
                  rows={8}
                  value={draft.itineraryJson}
                  onChange={(e) => setDraft((d) => ({ ...d, itineraryJson: e.target.value }))}
                  placeholder='[{"day":1,"title":"Day title","description":"..."}, ...]'
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => createOrUpdate.mutate()} disabled={createOrUpdate.isPending}>
                {createOrUpdate.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Packages</CardTitle>
        </CardHeader>
        <CardContent>
          {packages.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-muted-foreground">No packages yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>{p.duration}</TableCell>
                    <TableCell>{p.featured ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setEditing(p);
                          setDraft({
                            title: p.title,
                            duration: p.duration,
                            category: p.category,
                            featured: p.featured,
                            price: p.price ? String(p.price) : "",
                            itineraryJson: JSON.stringify(p.itinerary ?? [], null, 2),
                            imagesCsv: (p.images ?? []).join(", "),
                          });
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => del.mutate(p._id)} disabled={del.isPending}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

