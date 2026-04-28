import { ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/admin/api";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useTranslation } from "react-i18next";

type ApiPackage = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  images: string[];
  featured: boolean;
};

export const Experiences = () => {
  const { t } = useTranslation();
  const q = useQuery({
    queryKey: ["public-featured-packages-cards"],
    queryFn: () => apiFetch<ApiPackage[]>("/api/packages?featured=true"),
  });

  const items = (q.data ?? []).slice(0, 3).map((p) => ({
    img: p.images?.[0] || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=60",
    tag: (p.category || "Journey").toString(),
    title: p.title,
    subtitle: t("experiences_card_subtitle"),
    desc: t("experiences_card_desc"),
    href: `#pkg-${p.slug || p._id}`,
  }));

  return (
    <section id="experiences" className="py-24 md:py-32 bg-background relative">
      <div className="container">
        <SectionHeader
          eyebrow={t("experiences_eyebrow")}
          title={<>{t("experiences_title")}</>}
          subtitle={t("experiences_subtitle")}
        />

        {q.isLoading ? (
          <div className="mt-12 text-sm text-muted-foreground">{t("experiences_loading")}</div>
        ) : items.length === 0 ? (
          <div className="mt-12 text-sm text-muted-foreground">{t("experiences_empty")}</div>
        ) : (
          <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-8">
            {items.map((it, i) => (
              <Reveal key={it.title} delay={i * 120}>
                <a
                  href={it.href}
                  className="group relative block aspect-[4/5] rounded-2xl overflow-hidden shadow-elegant hover:shadow-deep transition-all duration-700"
                >
                  <img
                    src={it.img}
                    alt={it.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-himalaya/95 via-himalaya/30 to-transparent" />

                  <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-snow/15 backdrop-blur-md border border-snow/30 text-snow text-[10px] uppercase tracking-[0.25em]">
                    {it.tag}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-7 text-snow">
                    <h3 className="font-serif text-3xl leading-tight">
                      {it.title}
                      <span className="block italic font-light text-primary-glow text-2xl">
                        {it.subtitle}
                      </span>
                    </h3>
                    <p className="mt-3 text-snow/80 text-sm leading-relaxed max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-700">
                      {it.desc}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary-glow">
                      {t("experiences_card_cta")}
                      <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
