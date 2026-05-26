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

export function whatsappNumber(contact?: { whatsapp?: string }) {
  const raw = contact?.whatsapp?.trim() || DEFAULT_CONTACT.whatsapp;
  return raw.replace(/[^\d]/g, "");
}
