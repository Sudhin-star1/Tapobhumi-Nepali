import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Phone } from "lucide-react";

import { apiFetch } from "@/admin/api";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type Expert = {
  _id: string;
  name: string;
  phone: string;
  image?: string;
  role?: string;
};

function normalizePhoneForWa(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export const ContactWithExpert = () => {
  const { t } = useTranslation();
  const q = useQuery({
    queryKey: ["public-experts"],
    queryFn: () => apiFetch<Expert[]>("/api/experts"),
  });

  const experts = (q.data ?? []).slice(0, 2);
  const waText = encodeURIComponent("Hello, I want to know more about your trekking packages.");

  return (
    <section id="experts" className="py-24 md:py-32 bg-background">
      <div className="container">
        <SectionHeader
          eyebrow="Direct Support"
          title={<> {t("contact_expert")} </>}
          subtitle="Talk to a real human. Get the right route, season advice, and pricing — fast."
        />

        {q.isLoading ? (
          <div className="mt-12 text-sm text-muted-foreground">{t("contact_expert_loading")}</div>
        ) : experts.length === 0 ? (
          <div className="mt-12 text-sm text-muted-foreground">{t("contact_expert_empty")}</div>
        ) : (
          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {experts.map((e, i) => {
              const wa = `https://wa.me/${normalizePhoneForWa(e.phone)}?text=${waText}`;
              return (
                <Reveal key={e._id} delay={i * 120}>
                  <div className="group p-7 rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-elegant transition-all duration-700 hover:-translate-y-1">
                    <div className="flex items-center gap-5">
                      {e.image ? (
                        <img src={e.image} alt={e.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-muted ring-2 ring-primary/10" />
                      )}
                      <div className="flex-1">
                        <div className="font-serif text-2xl text-himalaya">{e.name}</div>
                        <div className="text-sm text-muted-foreground">{e.role || "Travel Expert"}</div>
                        <div className="mt-2 inline-flex items-center gap-2 text-sm text-foreground/80">
                          <Phone className="h-4 w-4 text-primary" />
                          <span className="font-medium">{e.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button asChild className="w-full bg-[hsl(130,60%,42%)] hover:bg-[hsl(130,60%,38%)] text-white shadow-soft">
                        <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          {t("whatsapp")}
                        </a>
                      </Button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

