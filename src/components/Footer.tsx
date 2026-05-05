import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import mandala from "@/assets/mandala.png";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/admin/api";

type ContactInfo = {
  phone?: string;
  email?: string;
  whatsapp?: string;
  socialLinks?: Record<string, string>;
};

export const Footer = () => {
  const q = useQuery({
    queryKey: ["public-contact"],
    queryFn: () => apiFetch<ContactInfo>("/api/contact"),
  });

  const phone = q.data?.phone || "+977 980 000 0000";
  const email = q.data?.email || "hello@example.com";
  const whatsapp = q.data?.whatsapp || "9779800000000";
  const socials = q.data?.socialLinks || {};

  return (
    <footer className="relative bg-himalaya text-snow overflow-hidden">
      <img src={mandala} alt="" aria-hidden className="absolute -right-40 -bottom-40 w-[500px] opacity-[0.06] animate-spin-slow pointer-events-none" />

      <div className="container py-20 relative">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full gradient-sunrise flex items-center justify-center shadow-glow">
                <span className="font-serif text-xl text-primary-foreground">ॐ</span>
              </div>
              <div>
                <div className="font-serif text-2xl">Tapobhumi Nepali Darshan</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-snow/60">Treks · Tours · Nepal</div>
              </div>
            </div>
            <p className="text-snow/70 max-w-md leading-relaxed font-light">
              A small Nepal-based team of guides, drivers and dreamers — quietly turning travel into pilgrimage since 2014.
            </p>

            <div className="flex gap-3 mt-6">
              {[
                { Icon: Instagram, href: socials.instagram },
                { Icon: Facebook, href: socials.facebook },
                { Icon: Youtube, href: socials.youtube },
              ]
                .filter((s) => !!s.href)
                .map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-snow/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-500"
                  >
                    <Icon size={16} />
                  </a>
                ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-5 text-primary-glow">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-snow/70">
              {["Experiences", "Packages", "Vehicles", "Gallery", "Plan Journey"].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase().replace(" ", "")}`} className="hover:text-primary-glow transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-5 text-primary-glow">Contact</h4>
            <ul className="space-y-3 text-sm text-snow/70">
              <li className="flex items-start gap-2.5"><MapPin size={15} className="mt-0.5 text-primary-glow shrink-0" /> Thamel, Kathmandu, Nepal</li>
              <li className="flex items-start gap-2.5"><Phone size={15} className="mt-0.5 text-primary-glow shrink-0" /> {phone}</li>
              <li className="flex items-start gap-2.5"><Mail size={15} className="mt-0.5 text-primary-glow shrink-0" /> {email}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-snow/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-snow/50">
          <div>© {new Date().getFullYear()} Tapobhumi Nepali Darshan. Crafted with reverence in Kathmandu.</div>
          <div className="font-serif italic text-snow/70">"The mountain doesn't move. We do." 🏔️</div>
        </div>
      </div>
    </footer>
  );
};
