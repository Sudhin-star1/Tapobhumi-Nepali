import { Reveal } from "./Reveal";

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export const SectionHeader = ({ eyebrow, title, subtitle, centered = true, light = false }: Props) => {
  return (
    <Reveal>
      <div className={centered ? "text-center max-w-3xl mx-auto" : "max-w-3xl"}>
        {eyebrow && (
          <div className={`om-divider mb-5 ${centered ? "justify-center" : ""}`}>
            <span className="text-xs uppercase tracking-[0.4em] text-primary font-medium">
              {eyebrow}
            </span>
          </div>
        )}
        <h2
          className={`font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-balance ${
            light ? "text-snow" : "text-himalaya"
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`mt-5 text-lg leading-relaxed ${
              light ? "text-snow/80" : "text-muted-foreground"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </Reveal>
  );
};
