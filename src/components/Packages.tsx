import { useMemo, useState } from "react";
import { MessageCircle, MapPin, Calendar, Users, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { apiFetch } from "@/admin/api";
import { useTranslation } from "react-i18next";

interface Day {
  day: string;
  title: string;
  detail: string;
}

interface Pkg {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  duration: string;
  route: string;
  image: string;
  highlight?: string;
  inclusions: string[];
  days: Day[];
}

type ApiPackage = {
  _id: string;
  title: string;
  slug: string;
  duration: string;
  category: string;
  itinerary: { day: number; title: string; description: string }[];
  images: string[];
  featured: boolean;
};

type ContactInfo = { whatsapp?: string };

const PackageCard = ({ pkg, flipped, whatsapp }: { pkg: Pkg; flipped: boolean; whatsapp: string }) => {
  const [active, setActive] = useState(0);
  const { t } = useTranslation();

  const whatsappText = encodeURIComponent(`I am interested in ${pkg.title}`);

  return (
    <div id={pkg.id} className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      {/* Image */}
      <Reveal className={flipped ? "lg:order-2" : ""}>
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-elegant group">
          <img
            src={pkg.image}
            alt={pkg.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-himalaya/70 to-transparent" />

          <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
            <div className="font-serif italic text-7xl text-snow/90 leading-none drop-shadow-lg">
              {pkg.number}
            </div>
            {pkg.highlight && (
              <div className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-medium tracking-wide shadow-glow">
                {pkg.highlight}
              </div>
            )}
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
            {pkg.inclusions.map((inc) => (
              <span
                key={inc}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-snow/15 backdrop-blur-md border border-snow/30 text-snow text-xs"
              >
                <Check size={12} /> {inc}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Content */}
      <Reveal delay={150}>
        <div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {pkg.duration}</span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> {pkg.route}</span>
          </div>

          <h3 className="font-serif text-4xl md:text-5xl text-himalaya leading-tight">
            {pkg.title}
            <span className="block italic font-light text-primary text-3xl md:text-4xl mt-1">
              {pkg.subtitle}
            </span>
          </h3>

          {/* Timeline */}
          <div className="mt-8 relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent" />
            <ul className="space-y-1">
              {pkg.days.map((d, i) => {
                const isActive = i === active;
                return (
                  <li key={i}>
                    <button
                      onClick={() => setActive(i)}
                      className="w-full text-left flex gap-4 p-3 rounded-xl hover:bg-muted/60 transition-colors"
                    >
                      <span
                        className={`relative mt-1.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                          isActive
                            ? "gradient-sunrise shadow-glow scale-110"
                            : "bg-muted border border-border"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isActive ? "bg-snow" : "bg-primary/40"}`} />
                      </span>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3">
                          <span className={`text-xs uppercase tracking-[0.2em] ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                            {d.day}
                          </span>
                          <span className={`font-serif text-lg ${isActive ? "text-himalaya" : "text-foreground/70"}`}>
                            {d.title}
                          </span>
                        </div>
                        <div
                          className={`text-sm text-muted-foreground leading-relaxed overflow-hidden transition-all duration-500 ${
                            isActive ? "max-h-32 mt-2 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          {d.detail}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#plan"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full gradient-sunrise text-primary-foreground font-medium shadow-glow hover:shadow-deep transition-all duration-500 hover:-translate-y-0.5"
            >
              <Users size={16} /> {t("packages_book_journey")}
            </a>
            <a
              href={`https://wa.me/${whatsapp}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-earth/40 text-earth font-medium hover:bg-earth hover:text-snow transition-all duration-500"
            >
              <MessageCircle size={16} /> {t("packages_whatsapp")}
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
};

export const Packages = () => {
  const { t } = useTranslation();
  const contact = useQuery({
    queryKey: ["public-contact-whatsapp"],
    queryFn: () => apiFetch<ContactInfo>("/api/contact"),
  });
  const whatsapp = contact.data?.whatsapp || "9779800000000";

  const q = useQuery({
    queryKey: ["public-featured-packages"],
    queryFn: () => apiFetch<ApiPackage[]>("/api/packages?featured=true"),
  });

  const packages: Pkg[] = useMemo(() => {
    const rows = q.data ?? [];
    const roman = ["I", "II", "III", "IV", "V", "VI"];
    return rows.map((p, idx) => ({
      id: `pkg-${p.slug || p._id}`,
      number: roman[idx] || String(idx + 1),
      title: p.title,
      subtitle: p.category?.toUpperCase?.() ? p.category.toUpperCase() : "Journey",
      duration: p.duration,
      route: "Custom Route",
      image: p.images?.[0] || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=60",
      inclusions: ["Custom itinerary", "Local support"],
      days: (p.itinerary ?? []).map((d) => ({ day: `Day ${d.day}`, title: d.title, detail: d.description })),
    }));
  }, [q.data]);

  return (
    <section id="packages" className="py-24 md:py-32 bg-muted/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.08),transparent_60%)]" />
      <div className="container relative">
        <SectionHeader
          eyebrow={t("packages_eyebrow")}
          title={<>{t("packages_title")}</>}
          subtitle={t("packages_subtitle")}
        />

        {q.isLoading ? (
          <div className="mt-12 text-sm text-muted-foreground">{t("packages_loading")}</div>
        ) : packages.length === 0 ? (
          <div className="mt-12 text-sm text-muted-foreground">{t("packages_empty")}</div>
        ) : (
          <div className="mt-20 space-y-28">
            {packages.map((p, i) => (
              <div key={p.id} className="relative">
                <PackageCard pkg={p} whatsapp={whatsapp} flipped={i % 2 === 1} />
                <div className="sr-only">
                  {/* keep stable layout */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
