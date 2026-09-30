/* Panier : données (localStorage) + tiroir d'affichage. */
import { $, $$, money, esc } from "./utils.js";

const KEY = "sakura-store-cart";
let cart = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } })();

export const getCart = () => cart;
export const cartTotal = () => cart.reduce((t, i) => t + i.prix * i.quantite, 0);
export const cartSummary = () => cart.map((i) => `• ${i.nom}${i.taille ? ` (taille ${i.taille})` : ""} x${i.quantite} = ${money(i.prix * i.quantite)}`).join("\n");
export const openCart = () => { $("#cart-drawer").classList.add("open"); $("#cart-drawer").setAttribute("aria-hidden", "false"); };
export const closeCart = () => { $("#cart-drawer").classList.remove("open"); $("#cart-drawer").setAttribute("aria-hidden", "true"); };

function save() { localStorage.setItem(KEY, JSON.stringify(cart)); render(); }
export function clearCart() { cart = []; save(); }

export function addToCart(p, quantite = 1, taille = "") {
  if (!p || p.disponibilite !== "en_stock") return;
  const line = cart.find((i) => i.id === p.id && i.taille === taille);
  line ? (line.quantite += quantite) : cart.push({ id: p.id, nom: p.nom, prix: p.prix, quantite, taille });
  save(); openCart();
}
/* Retire du panier les produits devenus indisponibles. */
export function reconcile(products) {
  cart = cart.filter((i) => products.some((p) => p.id === i.id && p.disponibilite === "en_stock"));
  save();
}
function render() {
  $("#cart-count").textContent = cart.reduce((t, i) => t + i.quantite, 0);
  $("#cart-total").textContent = money(cartTotal());
  $("#cart-items").innerHTML = cart.length ? cart.map((i, n) => `
    <div class="cart-line"><div><strong>${esc(i.nom)}</strong><small>${i.taille ? `Taille ${esc(i.taille)} · ` : ""}${money(i.prix)}</small></div>
    <div class="qty"><button data-q="${n}:-1" aria-label="Moins">−</button><span>${i.quantite}</span><button data-q="${n}:1" aria-label="Plus">+</button></div></div>`).join("") : '<p class="empty">Ton panier est vide 🌸</p>';
  $$("[data-q]").forEach((b) => b.onclick = () => { const [n, d] = b.dataset.q.split(":").map(Number); cart[n].quantite += d; if (cart[n].quantite < 1) cart.splice(n, 1); save(); });
}
export function initCart() {
  $("#open-cart").onclick = openCart; $("#close-cart").onclick = closeCart; render();
}
