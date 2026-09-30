/* Commande : enregistrement (Netlify + Google Sheet) puis redirection WhatsApp. Seul mode : paiement à la livraison. */
import { CONFIG } from "./config.js";
import { $, money, esc, waUrl, orderId } from "./utils.js";
import { getCart, cartTotal, cartSummary, clearCart } from "./cart.js";

const form = () => `
  <p class="eyebrow">Dernière étape</p><h2>Finaliser ma commande</h2>
  <div class="recap"><pre>${esc(cartSummary())}</pre><p class="line"><span>Articles</span><strong>${money(cartTotal())}</strong></p>
  <p class="line"><span>Livraison (Zoliv Express)</span><strong>${money(CONFIG.fraisLivraison)}</strong></p>
  <p class="line grand"><span>Total à payer</span><strong>${money(cartTotal() + CONFIG.fraisLivraison)}</strong></p></div>
  <form id="order-form">
    <p hidden><input name="bot-field"></p>
    <label>Nom complet *<input name="nom" required autocomplete="name"></label>
    <label>Téléphone *<input name="telephone" required inputmode="tel" placeholder="+225 07 00 00 00 00"></label>
    <label>E-mail (facultatif)<input name="email" type="email"></label>
    <label>Commune *<select name="commune" required><option value="" disabled selected>Choisis ta commune</option>${CONFIG.communes.map((c) => `<option>${c}</option>`).join("")}</select></label>
    <label>Quartier / adresse précise *<textarea name="adresse" rows="2" required></textarea></label>
    <label>Note (facultatif)<textarea name="note" rows="2"></textarea></label>
    <fieldset><legend>Finaliser ma commande sur WhatsApp avec *</legend><div class="choices">
      ${CONFIG.associees.map((p, i) => `<label class="choice"><input type="radio" name="associee" value="${i}" ${i === 0 ? "checked" : ""}><span>💬 ${p.nom}</span></label>`).join("")}</div></fieldset>
    <p class="hint">💵 Paiement à la livraison uniquement.</p>
    <button class="button button-primary full" id="submit-order" type="submit">Envoyer ma commande</button>
  </form>`;

export function openCheckout() {
  if (!getCart().length) return;
  $("#checkout-content").innerHTML = form();
  $("#checkout-modal").hidden = false;
  $("#order-form").onsubmit = submit;
}

async function submit(e) {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  if (d["bot-field"]) return;
  if (d.telephone.replace(/\D/g, "").length < 8) { alert("Numéro de téléphone invalide."); return; }
  $("#submit-order").disabled = true; $("#submit-order").textContent = "Envoi en cours…";
  const person = CONFIG.associees[Number(d.associee)];
  const id = orderId(), recap = cartSummary(), total = cartTotal();
  const note = [d.note, `Finalisation WhatsApp avec ${person.nom}`].filter(Boolean).join(" | ");

  /* 1) Google Sheet + e-mails (les clés correspondent à google-apps-script.js) */
  fetch(CONFIG.endpoint, { method: "POST", mode: "no-cors", keepalive: true, body: JSON.stringify({
    orderId: id, nom: d.nom, telephone: d.telephone, email: d.email || "", commune: d.commune, adresse: d.adresse,
    delivery_mode: "🚚 Zoliv Express", delivery_fee: money(CONFIG.fraisLivraison), paiement: CONFIG.paiement,
    total: money(total), recapitulatif: recap, note })}).catch(() => {});

  /* 2) Netlify Forms (notification e-mail Netlify) */
  await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({
    "form-name": "commande", nom: d.nom, telephone: d.telephone, email: d.email || "", commune: d.commune, adresse: d.adresse, note: d.note || "",
    associee: person.nom, numero_commande: id, recapitulatif_commande: recap, total: money(total), mode_paiement: CONFIG.paiement, note_livraison: CONFIG.livraison }).toString() }).catch(() => {});

  /* 3) Redirection vers la conversation WhatsApp choisie */
  const msg = `Bonjour ${person.nom} ! Je viens de passer la commande ${id} sur ${CONFIG.nom}.\n\n${recap}\n\nTotal articles : ${money(total)}\nLivraison Zoliv Express : ${money(CONFIG.fraisLivraison)}\nTotal à payer : ${money(total + CONFIG.fraisLivraison)}\nNom : ${d.nom}\nCommune : ${d.commune}\nAdresse : ${d.adresse}\nPaiement : à la livraison.\n\nMerci de me confirmer la commande 🌸`;
  const url = waUrl(person, msg);
  clearCart();
  $("#checkout-content").innerHTML = `<div class="success"><div class="ok">✓</div><h2>Commande ${id} enregistrée</h2>
    <p>Nous t'ouvrons la conversation WhatsApp avec ${person.nom} pour finaliser.</p>
    <a class="button button-primary" href="${url}">Ouvrir WhatsApp</a></div>`;
  setTimeout(() => location.assign(url), 1500);
}
