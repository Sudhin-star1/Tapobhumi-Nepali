import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/admin/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

type GalleryItem = { _id: string; title: string; imageUrl: string };

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminGallery() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const gallery = useQuery({
    queryKey: ["gallery"],
    queryFn: () => apiFetch<GalleryItem[]>("/api/gallery"),
  });

  const upload = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("Title is required");
      if (!image) throw new Error("Image is required");

      const token = localStorage.getItem("admin_token");
      const fd = new FormData();
      fd.append("title", title);
      fd.append("image", image);

      const res = await fetch(`${API_URL}/api/gallery`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Upload failed");
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["gallery"] });
      toast({ title: "Image uploaded" });
      setTitle("");
      setImage(null);
    },
    onError: (err: any) => toast({ title: "Upload failed", description: err?.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/gallery/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["gallery"] });
      toast({ title: "Image deleted" });
    },
    onError: (err: any) => toast({ title: "Delete failed", description: err?.message, variant: "destructive" }),
  });

  const rows = gallery.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Gallery</h1>
        <p className="text-sm text-muted-foreground">Upload and manage gallery images.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2 md:col-span-1">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Muktinath Temple" />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label>Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          </div>
          <div className="flex items-end md:col-span-1">
            <Button onClick={() => upload.mutate()} disabled={upload.isPending}>
              {upload.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Images</CardTitle>
        </CardHeader>
        <CardContent>
          {gallery.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-muted-foreground">No images yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rows.map((g) => (
                <div key={g._id} className="border rounded-xl overflow-hidden bg-card">
                  <img src={g.imageUrl} alt={g.title} className="w-full h-44 object-cover" />
                  <div className="p-3 flex items-center justify-between gap-2">
                    <div className="text-sm font-medium truncate">{g.title}</div>
                    <Button variant="destructive" size="sm" onClick={() => del.mutate(g._id)} disabled={del.isPending}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

