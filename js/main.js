import { $, $$ } from "./utils.js";
import { mountLayout, contactCards } from "./layout.js";
import { initCart, closeCart, reconcile } from "./cart.js";
import { loadProducts, initShop, renderGrid, products } from "./catalog.js";
import { openCheckout } from "./checkout.js";

mountLayout();
initCart();
$("#checkout-button").onclick = () => { closeCart(); openCheckout(); };
$$(".overlay").forEach((o) => o.addEventListener("click", (e) => { if (e.target === o || e.target.dataset.close !== undefined) o.hidden = true; }));
const people = $("#people"); if (people) people.innerHTML = contactCards();

await loadProducts();
reconcile(products);
if ($("#product-grid")) initShop();
