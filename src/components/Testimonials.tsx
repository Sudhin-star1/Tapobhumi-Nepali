import { Quote, Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { useTranslation } from "react-i18next";

const reviews = [
  {
    name: "Aanya Krishnan",
    from: "Bengaluru, India",
    text: "Standing before the eternal flame at Muktinath, I cried. Not from cold — from feeling held by something ancient. Tapobhumi Nepali Darshan didn't sell us a tour; they walked beside us like family.",
  },
  {
    name: "Marc Lefèvre",
    from: "Lyon, France",
    text: "The sunrise from Sarangkot, the silence on Phewa Lake at dawn, the way our driver Raju knew every prayer flag's story — this trip rewired something in me. I'm already planning the return.",
  },
  {
    name: "Priya & Rohan",
    from: "Mumbai, India",
    text: "Honeymoon expectations were high. Reality somehow exceeded them. The Pokhara lakeside dinner at Majhikuna under fairy lights — that's the photograph that lives on our wall now.",
  },
  {
    name: "Yuki Tanaka",
    from: "Kyoto, Japan",
    text: "I came for mountains. I left with a teacher in Lumbini, a friend in Chitwan, and a quiet I'd been searching for since my twenties.",
  },
  {
    name: "James O'Connor",
    from: "Dublin, Ireland",
    text: "Honest pricing, immaculate jeeps, drivers who genuinely cared. Booked over WhatsApp in twenty minutes — the smoothest trip I've ever had in Asia.",
  },
];

export const Testimonials = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 md:py-32 bg-muted/40 relative overflow-hidden">
      <div className="container">
        <SectionHeader
          eyebrow={t("testimonials_eyebrow")}
          title={<>{t("testimonials_title")}</>}
        />

        <div className="mt-16 columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 80} className="break-inside-avoid">
              <figure className="relative p-7 rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-elegant transition-all duration-700">
                <Quote className="absolute top-5 right-5 text-primary/15" size={48} />
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="text-gold fill-gold" />
                  ))}
                </div>
                <blockquote className="font-serif text-lg leading-relaxed text-himalaya italic">
                  "{r.text}"
                </blockquote>
                <figcaption className="mt-5 pt-5 border-t border-border">
                  <div className="font-medium text-foreground">{r.name}</div>
                  <div className="text-xs text-muted-foreground tracking-wide">{r.from}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
