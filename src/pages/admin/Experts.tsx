import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/admin/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

type Expert = { _id: string; name: string; phone: string; role?: string; image?: string };

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminExperts() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Expert | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const experts = useQuery({
    queryKey: ["experts"],
    queryFn: () => apiFetch<Expert[]>("/api/experts"),
  });

  const save = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("admin_token");
      const fd = new FormData();
      fd.append("name", name);
      fd.append("phone", phone);
      if (role) fd.append("role", role);
      if (image) fd.append("image", image);

      const res = await fetch(`${API_URL}/api/experts${editing ? `/${editing._id}` : ""}`, {
        method: editing ? "PUT" : "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Save failed");
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["experts"] });
      toast({ title: editing ? "Expert updated" : "Expert created" });
      setOpen(false);
      setEditing(null);
      setName("");
      setPhone("");
      setRole("");
      setImage(null);
    },
    onError: (err: any) => toast({ title: "Save failed", description: err?.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/experts/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["experts"] });
      toast({ title: "Expert deleted" });
    },
    onError: (err: any) => toast({ title: "Delete failed", description: err?.message, variant: "destructive" }),
  });

  const rows = experts.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Experts</h1>
          <p className="text-sm text-muted-foreground">Manage “Contact with Expert” section.</p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) {
              setEditing(null);
              setName("");
              setPhone("");
              setRole("");
              setImage(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditing(null);
                setName("");
                setPhone("");
                setRole("");
                setImage(null);
              }}
            >
              Add Expert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Expert" : "Add Expert"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+977..." />
              </div>
              <div className="space-y-2">
                <Label>Role (optional)</Label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Travel Expert" />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
              </div>
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
          <CardTitle>All Experts</CardTitle>
        </CardHeader>
        <CardContent>
          {experts.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-muted-foreground">No experts yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((e) => (
                  <TableRow key={e._id}>
                    <TableCell>
                      {e.image ? <img src={e.image} alt={e.name} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-muted" />}
                    </TableCell>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell className="text-muted-foreground">{e.role || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{e.phone}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setEditing(e);
                          setName(e.name);
                          setPhone(e.phone);
                          setRole(e.role || "");
                          setImage(null);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => del.mutate(e._id)} disabled={del.isPending}>
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

