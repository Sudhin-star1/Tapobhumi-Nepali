import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/admin/api";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useTranslation } from "react-i18next";

type GalleryItem = { _id: string; title: string; imageUrl: string };

const layout = [
  { span: "md:col-span-2 md:row-span-2", aspect: "aspect-square" },
  { span: "", aspect: "aspect-[4/5]" },
  { span: "", aspect: "aspect-[4/5]" },
  { span: "", aspect: "aspect-square" },
  { span: "", aspect: "aspect-square" },
  { span: "md:col-span-2", aspect: "aspect-[2/1]" },
  { span: "", aspect: "aspect-square" },
];

export const Gallery = () => {
  const { t } = useTranslation();
  const q = useQuery({
    queryKey: ["public-gallery"],
    queryFn: () => apiFetch<GalleryItem[]>("/api/gallery"),
  });

  const items = (q.data ?? []).slice(0, layout.length).map((g, idx) => ({
    src: g.imageUrl,
    label: g.title,
    span: layout[idx]?.span ?? "",
    aspect: layout[idx]?.aspect ?? "aspect-square",
  }));

  return (
    <section id="gallery" className="py-24 md:py-32 bg-background">
      <div className="container">
        <SectionHeader
          eyebrow={t("gallery_eyebrow")}
          title={<>{t("gallery_title")}</>}
          subtitle={t("gallery_subtitle")}
        />

        {q.isLoading ? (
          <div className="mt-12 text-sm text-muted-foreground">{t("gallery_loading")}</div>
        ) : items.length === 0 ? (
          <div className="mt-12 text-sm text-muted-foreground">{t("gallery_empty")}</div>
        ) : (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-auto">
            {items.map((it, i) => (
              <Reveal key={it.src} delay={i * 60} className={it.span}>
                <figure className={`group relative ${it.aspect} rounded-xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-700`}>
                  <img
                    src={it.src}
                    alt={it.label}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-himalaya/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <figcaption className="absolute bottom-4 left-4 right-4 text-snow font-serif text-lg italic translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {it.label}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
