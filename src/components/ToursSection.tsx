import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/admin/api";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { ImageCarousel } from "./ImageCarousel";
import { useTranslation } from "react-i18next";

type Tour = { _id: string; name: string; route: string; description?: string; images: string[] };

export const ToursSection = () => {
  const { t } = useTranslation();
  const q = useQuery({
    queryKey: ["public-tours"],
    queryFn: () => apiFetch<Tour[]>("/api/tours"),
  });

  const rows = q.data ?? [];

  return (
    <section id="tours" className="py-24 md:py-32 bg-muted/40">
      <div className="container">
        <SectionHeader
          eyebrow={t("tours_eyebrow")}
          title={<>{t("tours_title")}</>}
          subtitle={t("tours_subtitle")}
        />

        {q.isLoading ? (
          <div className="mt-12 text-sm text-muted-foreground">{t("tours_loading")}</div>
        ) : rows.length === 0 ? (
          <div className="mt-12 text-sm text-muted-foreground">{t("tours_empty")}</div>
        ) : (
          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {rows.map((t, i) => (
              <Reveal key={t._id} delay={i * 80}>
                <div className="group rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-elegant transition-all duration-700 hover:-translate-y-1 overflow-hidden">
                  <div className="aspect-[16/10] bg-muted">
                    <ImageCarousel images={t.images || []} alt={t.name} />
                  </div>
                  <div className="p-7">
                    <div className="font-serif text-2xl text-himalaya">{t.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">{t.route}</div>
                    <div className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.description || "—"}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

