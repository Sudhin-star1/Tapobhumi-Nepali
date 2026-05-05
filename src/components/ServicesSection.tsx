import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/admin/api";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useTranslation } from "react-i18next";

type Service = { _id: string; title: string; description: string; icon?: string };

export const ServicesSection = () => {
  const { t } = useTranslation();
  const q = useQuery({
    queryKey: ["public-services"],
    queryFn: () => apiFetch<Service[]>("/api/services"),
  });

  const rows = q.data ?? [];

  return (
    <section id="services" className="py-24 md:py-32 bg-background">
      <div className="container">
        <SectionHeader
          eyebrow={t("services_eyebrow")}
          title={<>{t("services_title")}</>}
          subtitle={t("services_subtitle")}
        />

        {q.isLoading ? (
          <div className="mt-12 text-sm text-muted-foreground">{t("services_loading")}</div>
        ) : rows.length === 0 ? (
          <div className="mt-12 text-sm text-muted-foreground">{t("services_empty")}</div>
        ) : (
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rows.map((s, i) => (
              <Reveal key={s._id} delay={i * 80}>
                <div className="p-7 rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-elegant transition-all duration-700 hover:-translate-y-1">
                  <div className="font-serif text-2xl text-himalaya">{s.title}</div>
                  <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

