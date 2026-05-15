/** Fallback contact values when /api/contact is loading or unavailable (matches server seed). */
export const DEFAULT_CONTACT = {
  phone: "9816142050",
  email: "tapobhumi@gmail.com",
  whatsapp: "9816142050",
} as const;

export function whatsappNumber(contact?: { whatsapp?: string }) {
  return contact?.whatsapp?.trim() || DEFAULT_CONTACT.whatsapp;
}
