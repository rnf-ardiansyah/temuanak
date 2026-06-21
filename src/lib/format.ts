/** Normalize Indonesian phone numbers to E.164 (+62...). */
export function normalizePhone(input: string): string {
  const digits = input.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("62")) return `+${digits}`;
  if (digits.startsWith("0")) return `+62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `+62${digits}`;
  return digits;
}

/** Indonesian phone validation: starts with +62/0/8, 9–14 digits after country code. */
export const phoneRegex = /^(?:\+62|62|0)8\d{7,12}$/;

export function waLink(phone: string, message = "") {
  const p = normalizePhone(phone).replace(/^\+/, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${p}${text}`;
}

export function telLink(phone: string) {
  return `tel:${normalizePhone(phone)}`;
}

export function publicQrUrl(token: string, origin?: string) {
  const o = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${o}/qr/${token}`;
}
