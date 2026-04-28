import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { apiFetch, apiJson } from "@/admin/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

type ContactInfo = {
  phone?: string;
  email?: string;
  whatsapp?: string;
  socialLinks?: Record<string, string>;
};

export default function AdminContact() {
  const contact = useQuery({
    queryKey: ["contact"],
    queryFn: () => apiFetch<ContactInfo>("/api/contact"),
  });

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [socialJson, setSocialJson] = useState("{}");

  useEffect(() => {
    if (!contact.data) return;
    setPhone(contact.data.phone || "");
    setEmail(contact.data.email || "");
    setWhatsapp(contact.data.whatsapp || "");
    setSocialJson(JSON.stringify(contact.data.socialLinks || {}, null, 2));
  }, [contact.data]);

  const save = useMutation({
    mutationFn: async () => {
      const socialLinks = JSON.parse(socialJson || "{}");
      return apiJson<ContactInfo>("/api/contact", { phone, email, whatsapp, socialLinks }, { method: "PUT" });
    },
    onSuccess: () => toast({ title: "Contact info updated" }),
    onError: (err: any) => toast({ title: "Save failed", description: err?.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Contact Info</h1>
        <p className="text-sm text-muted-foreground">Used by footer and WhatsApp “Book Now”.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp (digits)</Label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="97798..." />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Social Links JSON</Label>
            <Textarea rows={6} value={socialJson} onChange={(e) => setSocialJson(e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Button onClick={() => save.mutate()} disabled={save.isPending || contact.isLoading}>
              {save.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

