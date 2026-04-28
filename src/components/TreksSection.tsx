import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/admin/api";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { ImageCarousel } from "./ImageCarousel";
import { useTranslation } from "react-i18next";

type Trek = { _id: string; name: string; description?: string; images: string[] };

export const TreksSection = () => {
  const { t } = useTranslation();
  const q = useQuery({
    queryKey: ["public-treks"],
    queryFn: () => apiFetch<Trek[]>("/api/treks"),
  });

  const rows = q.data ?? [];

  return (
    <section id="treks" className="py-24 md:py-32 bg-background">
      <div className="container">
        <SectionHeader
          eyebrow={t("treks_eyebrow")}
          title={<>{t("treks_title")}</>}
          subtitle={t("treks_subtitle")}
        />

        {q.isLoading ? (
          <div className="mt-12 text-sm text-muted-foreground">{t("treks_loading")}</div>
        ) : rows.length === 0 ? (
          <div className="mt-12 text-sm text-muted-foreground">{t("treks_empty")}</div>
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
                    <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.description || "—"}</div>
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

