import { useEffect, useState } from "react";
import { BotMessageSquare, Volume2, VolumeX, ArrowUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/admin/api";

type ContactInfo = { whatsapp?: string };

export const FloatingActions = () => {
  const [showTop, setShowTop] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const contact = useQuery({
    queryKey: ["public-contact-mini"],
    queryFn: () => apiFetch<ContactInfo>("/api/contact"),
  });

  const whatsapp = contact.data?.whatsapp || "9779800000000";

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleSound = () => {
    if (!audio) {
      // Tibetan singing bowl ambient (royalty free CDN)
      const a = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_4548f1d2f8.mp3?filename=tibetan-bowl-72252.mp3");
      a.loop = true;
      a.volume = 0.25;
      a.play().catch(() => {});
      setAudio(a);
      setPlaying(true);
    } else {
      if (playing) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
      setPlaying(!playing);
    }
  };

  return (
    <>
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Enquiry"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <span className="absolute inset-0 rounded-full animate-pulse-ring" />
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(130,60%,42%)] text-snow shadow-deep hover:scale-110 transition-transform duration-500">
          <BotMessageSquare size={24} />
        </span>
      </a>

      {/* Sound toggle */}
      <button
        onClick={toggleSound}
        aria-label={playing ? "Mute ambient" : "Play ambient Himalayan sound"}
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-card/90 backdrop-blur-md border border-border text-himalaya shadow-soft hover:shadow-elegant hover:scale-110 transition-all duration-500"
      >
        {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-24 right-6 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-card/90 backdrop-blur-md border border-border text-himalaya shadow-soft hover:shadow-elegant hover:scale-110 transition-all duration-500 animate-fade-in"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
};
