/** Canonical WhatsApp number used everywhere except the Footer phone list and Experts section. */
export const PRIMARY_WHATSAPP = "9779802852192";

/** Fallback contact values when /api/contact is loading or unavailable. */
export const DEFAULT_CONTACT = {
  phone: "9816142050",
  phoneSecondary: "9802852192",
  email: "tapobhumi@gmail.com",
  whatsapp: PRIMARY_WHATSAPP,
} as const;

export const PHONE_DISPLAY = {
  primary: "+977 9816142050",
  secondary: "+977 9802852192",
} as const;

/**
 * Returns the canonical business WhatsApp number for the floating bot, CTAs, hero,
 * navbar, vehicles and packages buttons. Admin-managed values are intentionally ignored
 * here so that every redirect lands on +977 9802852192.
 */
export function whatsappNumber(_contact?: { whatsapp?: string }) {
  return PRIMARY_WHATSAPP;
}
