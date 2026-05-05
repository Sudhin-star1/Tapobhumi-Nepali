import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/admin/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

type Tour = { _id: string; name: string; route: string; description?: string; images: string[] };

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminTours() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tour | null>(null);
  const [name, setName] = useState("");
  const [route, setRoute] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const tours = useQuery({
    queryKey: ["tours"],
    queryFn: () => apiFetch<Tour[]>("/api/tours"),
  });

  const save = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("admin_token");
      const fd = new FormData();
      fd.append("name", name);
      fd.append("route", route);
      if (description) fd.append("description", description);
      if (files) {
        for (let i = 0; i < files.length; i++) {
          fd.append("images", files[i]);
        }
      }

      const res = await fetch(`${API_URL}/api/tours${editing ? `/${editing._id}` : ""}`, {
        method: editing ? "PUT" : "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Save failed");
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["tours"] });
      toast({ title: editing ? "Tour updated" : "Tour created" });
      setOpen(false);
      setEditing(null);
      setName("");
      setRoute("");
      setDescription("");
      setFiles(null);
    },
    onError: (err: any) => toast({ title: "Save failed", description: err?.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/tours/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["tours"] });
      toast({ title: "Tour deleted" });
    },
    onError: (err: any) => toast({ title: "Delete failed", description: err?.message, variant: "destructive" }),
  });

  const rows = tours.data ?? [];

  const removeImage = useMutation({
    mutationFn: async (url: string) => {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_URL}/api/tours/${editing?._id}/images/remove`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Remove failed");
      return data as Tour;
    },
    onSuccess: async (updated) => {
      setExistingImages(updated.images || []);
      await qc.invalidateQueries({ queryKey: ["tours"] });
      toast({ title: "Image removed" });
    },
    onError: (err: any) => toast({ title: "Remove failed", description: err?.message, variant: "destructive" }),
  });

  const reorderImages = useMutation({
    mutationFn: async (images: string[]) => {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_URL}/api/tours/${editing?._id}/images/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ images }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Reorder failed");
      return data as Tour;
    },
    onSuccess: async (updated) => {
      setExistingImages(updated.images || []);
      await qc.invalidateQueries({ queryKey: ["tours"] });
      toast({ title: "Order updated" });
    },
    onError: (err: any) => toast({ title: "Reorder failed", description: err?.message, variant: "destructive" }),
  });

  const move = (from: number, to: number) => {
    if (to < 0 || to >= existingImages.length) return;
    const next = [...existingImages];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setExistingImages(next);
    reorderImages.mutate(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Tours</h1>
          <p className="text-sm text-muted-foreground">Manage tour packages and routes.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditing(null);
                setName("");
                setRoute("");
                setDescription("");
                setFiles(null);
                setExistingImages([]);
              }}
            >
              Add Tour
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Tour" : "Add Tour"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Route</Label>
                <Input value={route} onChange={(e) => setRoute(e.target.value)} placeholder="Kathmandu → Pokhara → ..." />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Images (multiple)</Label>
                <Input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} />
              </div>

              {editing && existingImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Existing images</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {existingImages.map((url, idx) => (
                      <div key={url} className="border rounded-lg overflow-hidden bg-card">
                        <img src={url} alt="" className="w-full h-24 object-cover" />
                        <div className="p-2 flex items-center justify-between gap-2">
                          <div className="flex gap-1">
                            <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => move(idx, idx - 1)}>
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => move(idx, idx + 1)}>
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeImage.mutate(url)}
                            disabled={removeImage.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => save.mutate()} disabled={save.isPending}>
                {save.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tours</CardTitle>
        </CardHeader>
        <CardContent>
          {tours.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-muted-foreground">No tours yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="text-muted-foreground">{t.route}</TableCell>
                    <TableCell className="text-muted-foreground">{t.description || "—"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setEditing(t);
                          setName(t.name);
                          setRoute(t.route);
                          setDescription(t.description || "");
                          setFiles(null);
                          setExistingImages(t.images || []);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => del.mutate(t._id)} disabled={del.isPending}>
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

