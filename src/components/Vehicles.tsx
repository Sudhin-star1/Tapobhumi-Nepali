import { Car, Mountain, MapPinned, ArrowRight, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/admin/api";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useTranslation } from "react-i18next";

const services = [
  {
    icon: Car,
    title: "Kathmandu ⇄ Pokhara",
    desc: "Private highway transfers in clean, air-conditioned sedans and SUVs. Comfort that lets the landscape do the talking.",
  },
  {
    icon: Mountain,
    title: "4WD Jeep · Mustang & Muktinath",
    desc: "Tough Scorpios and Boleros built for high-altitude pilgrim roads. Drivers who know every switchback by heart.",
  },
  {
    icon: MapPinned,
    title: "City Rides · Sedan & SUV",
    desc: "Hourly or daily city hire across Kathmandu, Pokhara and Chitwan — for sightseeing, errands or airport runs.",
  },
];

export const Vehicles = () => {
  const { t } = useTranslation();
  const contact = useQuery({
    queryKey: ["public-contact-vehicles"],
    queryFn: () => apiFetch<{ whatsapp?: string }>("/api/contact"),
  });
  const whatsapp = contact.data?.whatsapp || "9816142050";

  return (
    <section id="vehicles" className="py-24 md:py-32 bg-himalaya text-snow relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary-glow)),transparent_50%)]" />
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative">
        <SectionHeader
          light
          eyebrow={t("vehicles_eyebrow")}
          title={<>{t("vehicles_title")}</>}
          subtitle={t("vehicles_subtitle")}
        />

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 120}>
              <div className="group relative h-full p-8 rounded-2xl bg-snow/[0.04] border border-snow/10 backdrop-blur-sm hover:bg-snow/[0.08] hover:border-primary/40 transition-all duration-700 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl gradient-sunrise flex items-center justify-center shadow-glow mb-6 group-hover:scale-110 transition-transform duration-500">
                  <s.icon className="text-primary-foreground" size={26} />
                </div>
                <h3 className="font-serif text-2xl text-snow mb-3">{s.title}</h3>
                <p className="text-snow/70 leading-relaxed text-sm">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-gradient-to-r from-primary/15 to-secondary/10 border border-primary/20">
            <div className="flex items-center gap-4">
              <ShieldCheck className="text-primary-glow shrink-0" size={32} />
              <div>
                <div className="font-serif text-2xl">{t("vehicles_banner_title")}</div>
                <div className="text-snow/70 text-sm mt-1">{t("vehicles_banner_subtitle")}</div>
              </div>
            </div>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full gradient-sunrise text-primary-foreground font-medium shadow-glow hover:shadow-deep transition-all duration-500 whitespace-nowrap"
            >
              {t("vehicles_cta")} <ArrowRight size={16} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
