/* Tous les réglages du site sont ici. */
export const CONFIG = {
  nom: "Sakura Store",
  endpoint: "https://script.google.com/macros/s/AKfycbzcmKZ0jxH8IHyIMWiJLN6KVdCQ-u1AGQpTSqmQKFMswaH3JJsPbUrAbRxfxw8l3MAm4A/exec", // Google Apps Script (commandes + catalogue)
  associees: [
    { nom: "Associée 1", whatsapp: "+225 05 45 15 31 93" },
    { nom: "Associée 2", whatsapp: "+225 07 05 01 16 07" }
  ],
  livraison: "1 500 à 2 000 FCFA selon votre commune",
  paiement: "Paiement à la livraison (espèces)",
  communes: ["Abobo","Adjamé","Anyama","Attécoubé","Bingerville","Cocody","Koumassi","Marcory","Plateau","Port-Bouët","Songon","Treichville","Yopougon"],
  categories: { tous: "Tous", accessoires: "Accessoires", parfums: "Parfums", vetements: "Vêtements", autres: "Autres" }
};
