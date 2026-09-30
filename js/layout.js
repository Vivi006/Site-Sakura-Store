/* Éléments communs à toutes les pages : en-tête, pied de page, panier, fenêtres. */
import { CONFIG } from "./config.js";
import { waUrl } from "./utils.js";

const logo = "images/logo-sakura.png";
const hello = (p) => waUrl(p, `Bonjour ${p.nom}, j'aimerais avoir un renseignement sur Sakura Store.`);

export function mountLayout() {
  const page = location.pathname.endsWith("boutique.html") ? "boutique" : "accueil";
  const tab = (id, href, label) => `<a href="${href}"${page === id ? ' class="on"' : ""}>${label}</a>`;
  document.body.insertAdjacentHTML("afterbegin", `
  <header class="site-header">
    <a class="brand" href="index.html"><img src="${logo}" alt="Logo ${CONFIG.nom}"><span>${CONFIG.nom}</span></a>
    <nav aria-label="Navigation">${tab("accueil", "index.html", "Accueil")}${tab("boutique", "boutique.html", "Boutique")}<a href="index.html#contact">Contact</a></nav>
    <button class="cart-button" id="open-cart" aria-label="Ouvrir le panier">🛍️ <b id="cart-count">0</b></button>
  </header>`);
  document.body.insertAdjacentHTML("beforeend", `
  <footer class="site-footer"><small>© ${new Date().getFullYear()} ${CONFIG.nom}</small></footer>
  <div class="overlay" id="product-modal" hidden><div class="modal"><button class="close" data-close aria-label="Fermer">×</button><div id="modal-content"></div></div></div>
  <aside class="drawer" id="cart-drawer" aria-hidden="true">
    <div class="drawer-head"><h2>Mon panier</h2><button class="close" id="close-cart" aria-label="Fermer">×</button></div>
    <div id="cart-items"></div>
    <div class="drawer-foot"><p class="line"><span>Articles</span><strong id="cart-total">0 FCFA</strong></p>
      <p class="hint">Livraison : ${CONFIG.livraison}. Paiement à la livraison.</p>
      <button class="button button-primary full" id="checkout-button">Commander</button></div>
  </aside>
  <div class="overlay" id="checkout-modal" hidden><div class="modal"><button class="close" data-close aria-label="Fermer">×</button><div id="checkout-content"></div></div></div>`);
}

export const contactCards = () => CONFIG.associees.map((p) => `
  <article class="person"><span class="petal-ico">🌸</span><h3>${p.nom}</h3><p>${p.whatsapp}</p>
  <a class="button button-primary" href="${hello(p)}" target="_blank" rel="noopener">Écrire sur WhatsApp</a></article>`).join("");
