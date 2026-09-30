/* Catalogue : chargement, cartes produits, fiche produit, filtres de la boutique. */
import { CONFIG } from "./config.js";
import { $, $$, money, esc } from "./utils.js";
import { addToCart } from "./cart.js";

export let products = [];

export async function loadProducts() {
  try {
    const d = await (await fetch(`${CONFIG.endpoint}?action=list`)).json();
    if (d.ok && d.products?.length) return (products = d.products);
  } catch { /* repli sur products.json */ }
  return (products = await (await fetch("products.json")).json());
}

/* Seules les photos en ligne (Cloudinary) sont affichées ; les anciens chemins images/... sont ignorés. */
const photo = (p) => (/^https?:\/\//.test(p.image || "") ? `<img src="${esc(p.image)}" alt="${esc(p.nom)}" loading="lazy">` : '<span class="ph">🌸</span>');

const card = (p) => `
  <article class="card">
    <button class="card-open" data-open="${esc(p.id)}"><div class="card-img">${photo(p)}
      ${p.nouveau ? '<span class="tag">Nouveau</span>' : ""}${p.disponibilite !== "en_stock" ? '<span class="tag sold">Épuisé</span>' : ""}</div>
      <h3>${esc(p.nom)}</h3><p class="cat">${esc(p.categorie)}</p></button>
    <div class="card-foot"><strong>${money(p.prix)}</strong><button class="btn-add" data-add="${esc(p.id)}" ${p.disponibilite !== "en_stock" ? "disabled" : ""}>+ Panier</button></div>
  </article>`;

export function renderGrid(el, list) {
  el.innerHTML = list.length ? list.map(card).join("") : '<p class="empty">Aucun article trouvé.</p>';
  $$("[data-open]", el).forEach((b) => b.onclick = () => openProduct(b.dataset.open));
  $$("[data-add]", el).forEach((b) => b.onclick = () => {
    const p = products.find((x) => x.id === b.dataset.add);
    addToCart(p);
  });
}

function openProduct(id) {
  const p = products.find((x) => x.id === id); if (!p) return;
  $("#modal-content").innerHTML = `<div class="detail">${photo(p)}<div>
    <p class="eyebrow">${esc(p.categorie)}</p><h2>${esc(p.nom)}</h2><p>${esc(p.description)}</p><strong class="price">${money(p.prix)}</strong>
    <label>Quantité<input id="p-qty" type="number" min="1" max="20" value="1"></label>
    <button class="button button-primary full" id="p-add" ${p.disponibilite !== "en_stock" ? "disabled" : ""}>Ajouter au panier</button></div></div>`;
  $("#product-modal").hidden = false;
  $("#p-add").onclick = () => { addToCart(p, Math.max(1, Math.min(20, Number($("#p-qty").value) || 1))); $("#product-modal").hidden = true; };
}

/* Page boutique : catégories, recherche, tri. */
export function initShop() {
  const s = { cat: new URLSearchParams(location.search).get("cat") || "tous", q: "", sort: "" };
  const draw = () => {
    $("#categories").innerHTML = Object.entries(CONFIG.categories).map(([k, l]) => `<button class="${s.cat === k ? "on" : ""}" data-cat="${k}">${l}</button>`).join("");
    $$("[data-cat]").forEach((b) => b.onclick = () => { s.cat = b.dataset.cat; draw(); });
    let list = products.filter((p) => (s.cat === "tous" || p.categorie === s.cat) && `${p.nom} ${p.description}`.toLowerCase().includes(s.q));
    if (s.sort) list.sort((a, b) => (s.sort === "asc" ? a.prix - b.prix : b.prix - a.prix));
    $("#count").textContent = `${list.length} article${list.length > 1 ? "s" : ""}`;
    renderGrid($("#product-grid"), list);
  };
  $("#search").oninput = (e) => { s.q = e.target.value.toLowerCase(); draw(); };
  $("#sort").onchange = (e) => { s.sort = e.target.value; draw(); };
  draw();
}
