import { useState } from "react";
import { Send } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { toast } from "sonner";
import mandala from "@/assets/mandala.png";
import { apiJson } from "@/admin/api";
import { useTranslation } from "react-i18next";

export const PlanJourney = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", packageName: "Spiritual Nepal", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiJson("/api/enquiries", {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        packageName: form.packageName || undefined,
        message: form.message || undefined,
      });
      toast.success(t("form_success_title"), {
        description: t("form_success_desc"),
      });
      setForm({ name: "", phone: "", email: "", packageName: "Spiritual Nepal", message: "" });
    } catch (err: any) {
      toast.error(t("form_error_title"), { description: err?.message || t("form_error_desc") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="plan" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <img src={mandala} alt="" aria-hidden className="absolute -left-40 top-1/2 -translate-y-1/2 w-[500px] opacity-10 animate-spin-slow pointer-events-none" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader
              centered={false}
              eyebrow={t("plan_eyebrow")}
              title={<>{t("plan_title")}</>}
              subtitle={t("plan_subtitle")}
            />
            <Reveal delay={150}>
              <ul className="mt-8 space-y-3 text-muted-foreground">
                {[t("plan_bullet_1"), t("plan_bullet_2"), t("plan_bullet_3")].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full gradient-sunrise" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <form
              onSubmit={submit}
              className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-card to-muted/60 border border-border shadow-elegant"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("form_name_label")}</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-2 w-full px-0 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors text-foreground"
                    placeholder={t("form_name_placeholder")}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("form_phone_label")}</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-2 w-full px-0 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors text-foreground"
                    placeholder={t("form_phone_placeholder")}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("form_email_label")}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-2 w-full px-0 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors text-foreground"
                    placeholder={t("form_email_placeholder")}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("form_package_label")}</label>
                  <select
                    value={form.packageName}
                    onChange={(e) => setForm({ ...form, packageName: e.target.value })}
                    className="mt-2 w-full px-0 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors text-foreground"
                  >
                    <option>Spiritual Nepal</option>
                    <option>Pokhara Retreat</option>
                    <option>Grand Nepal Vacation</option>
                    <option>Vehicle Service Only</option>
                    <option>Custom Itinerary</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("form_message_label")}</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="mt-2 w-full px-0 py-3 bg-transparent border-b border-border focus:border-primary outline-none transition-colors text-foreground resize-none"
                    placeholder={t("form_message_placeholder")}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full gradient-sunrise text-primary-foreground font-medium shadow-glow hover:shadow-deep transition-all duration-500 hover:-translate-y-0.5"
              >
                {loading ? t("form_sending") : t("form_send_enquiry")} <Send size={16} />
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
