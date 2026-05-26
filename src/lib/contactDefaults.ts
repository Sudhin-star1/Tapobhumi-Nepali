/** Fallback contact values when /api/contact is loading or unavailable (matches server seed). */
export const DEFAULT_CONTACT = {
  phone: "9816142050",
  phoneSecondary: "9802852192",
  email: "tapobhumi@gmail.com",
  whatsapp: "9779802852192",
} as const;

export const PHONE_DISPLAY = {
  primary: "+977 9816142050",
  secondary: "+977 9802852192",
} as const;

const NEPAL_COUNTRY_CODE = "977";

export function whatsappNumber(contact?: { whatsapp?: string }) {
  const raw = contact?.whatsapp?.trim() || DEFAULT_CONTACT.whatsapp;
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return DEFAULT_CONTACT.whatsapp;
  if (digits.startsWith(NEPAL_COUNTRY_CODE)) return digits;
  if (digits.length === 10 && digits.startsWith("9")) return NEPAL_COUNTRY_CODE + digits;
  return digits;
}
