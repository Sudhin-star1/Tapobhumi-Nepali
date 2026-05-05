import heroImg from "@/assets/hero-himalaya.jpg";
import mandala from "@/assets/mandala.png";
import { ArrowDown, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/admin/api";
import { useTranslation } from "react-i18next";

export const Hero = () => {
  const { t } = useTranslation();
  const contact = useQuery({
    queryKey: ["public-contact-hero"],
    queryFn: () => apiFetch<{ whatsapp?: string }>("/api/contact"),
  });
  const whatsapp = contact.data?.whatsapp || "9816142050";

  return (
    <section id="top" className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Annapurna Himalayan range at sunrise with prayer flags"
          className="w-full h-full object-cover animate-ken-burns"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-himalaya/30 via-transparent to-himalaya/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-himalaya/40 via-transparent to-transparent" />
      </div>

      {/* Floating clouds */}
      <div className="absolute top-1/3 left-0 w-72 h-24 rounded-full bg-snow/30 blur-3xl animate-float" />
      <div className="absolute top-1/2 right-10 w-96 h-32 rounded-full bg-snow/20 blur-3xl animate-float-delayed" />

      {/* Mandala motif */}
      <img
        src={mandala}
        alt=""
        aria-hidden
        className="absolute -right-40 -bottom-40 w-[600px] opacity-20 animate-spin-slow pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 h-full container flex flex-col justify-center">
        <div className="max-w-3xl animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-12 bg-primary-glow" />
            <span className="text-snow/90 uppercase tracking-[0.4em] text-xs">{t("hero_kicker")}</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-snow leading-[1.05] text-balance">
            {t("hero_headline_1")}
            <br />
            <span className="italic font-light text-primary-glow">{t("hero_headline_2")}</span>
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl text-snow/90 font-light">
              {t("hero_headline_3")}
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-snow/85 max-w-2xl leading-relaxed font-light">
            {t("hero_description")}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#packages"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-sunrise text-primary-foreground font-medium tracking-wide shadow-glow hover:shadow-deep transition-all duration-500 hover:-translate-y-1"
            >
              {t("hero_cta_packages")}
              <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
            </a>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-snow/10 backdrop-blur-md border border-snow/40 text-snow font-medium tracking-wide hover:bg-snow/20 transition-all duration-500"
            >
              <MessageCircle size={18} />
              {t("hero_cta_whatsapp")}
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-snow/70">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-snow/60 to-transparent" />
        </div>
      </div>
    </section>
  );
};
