import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/admin/api";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const contact = useQuery({
    queryKey: ["public-contact-navbar"],
    queryFn: () => apiFetch<{ whatsapp?: string }>("/api/contact"),
  });
  const whatsapp = contact.data?.whatsapp || "9816142050";

  const links = [
    { href: "#experiences", label: t("nav_experiences") },
    { href: "#packages", label: t("nav_packages") },
    { href: "#vehicles", label: t("nav_vehicles") },
    { href: "#gallery", label: t("nav_gallery") },
    { href: "#why", label: t("nav_why_us") },
    { href: "#plan", label: t("nav_plan_journey") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/85 backdrop-blur-xl shadow-soft border-b border-border/60"
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-20">
        <a href="#top" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full gradient-sunrise flex items-center justify-center shadow-glow">
            <span className="font-serif text-xl text-primary-foreground">ॐ</span>
          </div>
          <div className="leading-tight">
            <div className={cn("font-serif text-xl tracking-wide", scrolled ? "text-himalaya" : "text-snow drop-shadow")}>
              Tapobhumi Nepali Darshan
            </div>
            <div className={cn("text-[10px] uppercase tracking-[0.25em]", scrolled ? "text-muted-foreground" : "text-snow/80")}>
              Treks · Tours · Nepal
            </div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm tracking-wide transition-colors relative group",
                scrolled ? "text-foreground hover:text-primary" : "text-snow/95 hover:text-primary-glow"
              )}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <div className={cn("inline-flex rounded-full border border-border/60 p-1", scrolled ? "bg-card/60" : "bg-snow/10")}>
            <button
              type="button"
              onClick={() => i18n.changeLanguage("en")}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full transition-colors",
                i18n.language === "en"
                  ? "bg-primary text-primary-foreground"
                  : scrolled
                    ? "text-foreground hover:bg-muted"
                    : "text-snow hover:bg-snow/10"
              )}
            >
              {t("language_en")}
            </button>
            <button
              type="button"
              onClick={() => i18n.changeLanguage("hi")}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full transition-colors",
                i18n.language === "hi"
                  ? "bg-primary text-primary-foreground"
                  : scrolled
                    ? "text-foreground hover:bg-muted"
                    : "text-snow hover:bg-snow/10"
              )}
            >
              {t("language_hi")}
            </button>
          </div>

          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-sunrise text-primary-foreground text-sm font-medium shadow-glow hover:shadow-deep transition-all duration-500 hover:-translate-y-0.5"
          >
            {t("book_now")}
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={cn("lg:hidden p-2 rounded-md", scrolled ? "text-foreground" : "text-snow")}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border animate-fade-in">
          <nav className="container py-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => i18n.changeLanguage("en")}
                className={cn(
                  "px-3 py-2 rounded-full text-sm border",
                  i18n.language === "en" ? "bg-primary text-primary-foreground border-primary" : "bg-transparent border-border"
                )}
              >
                {t("language_en")}
              </button>
              <button
                type="button"
                onClick={() => i18n.changeLanguage("hi")}
                className={cn(
                  "px-3 py-2 rounded-full text-sm border",
                  i18n.language === "hi" ? "bg-primary text-primary-foreground border-primary" : "bg-transparent border-border"
                )}
              >
                {t("language_hi")}
              </button>
            </div>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                {l.label}
              </a>
            ))}
            <a
              href={`https://wa.me/${whatsapp}`}
              className="mt-2 inline-flex justify-center items-center gap-2 px-5 py-3 rounded-full gradient-sunrise text-primary-foreground font-medium"
            >
              {t("whatsapp")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
