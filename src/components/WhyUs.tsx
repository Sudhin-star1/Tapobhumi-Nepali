import { Heart, Mountain, Users, Car } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useTranslation } from "react-i18next";

const reasons = [
  { icon: Heart, title: "Authentic Local", desc: "Born and raised in these valleys — we share Nepal as we live it, not as a brochure." },
  { icon: Mountain, title: "Spirit + Adventure", desc: "Sacred temples and snow-capped trails, woven into a single seamless journey." },
  { icon: Car, title: "Comfortable Transport", desc: "Modern fleet, courteous drivers — long roads that feel surprisingly short." },
  { icon: Users, title: "Trusted Guides", desc: "Licensed, multilingual storytellers who turn places into memories." },
];

export const WhyUs = () => {
  const { t } = useTranslation();
  return (
    <section id="why" className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/40">
      <div className="container">
        <SectionHeader
          eyebrow={t("why_eyebrow")}
          title={<>{t("why_title")}</>}
        />

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 100}>
              <div className="group relative h-full p-7 rounded-2xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-elegant transition-all duration-700 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[3rem] rounded-tr-2xl group-hover:bg-primary/10 transition-colors duration-700" />
                <div className="relative w-12 h-12 rounded-xl gradient-sunrise flex items-center justify-center shadow-glow mb-5">
                  <r.icon className="text-primary-foreground" size={22} />
                </div>
                <h3 className="font-serif text-2xl text-himalaya mb-2 relative">{r.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed relative">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
