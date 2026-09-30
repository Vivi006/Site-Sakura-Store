export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const money = (v) => `${new Intl.NumberFormat("fr-FR").format(v)} FCFA`;
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const waUrl = (person, msg) => `https://wa.me/${person.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
export const orderId = () => { const d = new Date(), p = (n) => String(n).padStart(2, "0"); return `CMD-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`; };
