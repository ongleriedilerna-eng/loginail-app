/* 05/11 (Marie) OBLIGATOIRE : les vraies pages légales du site de chaque prothésiste.
   Mentions légales · Confidentialité · Conditions de réservation · Cookies — remplies toutes seules avec ses infos (appli → « Mes infos légales » et « Bon à savoir »).
   Textes à faire relire par un juriste avant la mise en ligne. */
(() => {
  if (typeof BR === "undefined" || !BR) return;
  const tel = document.querySelector(".tel"); if (!tel) return;
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const L = BR.legal || {}, R = Object.assign({ acompte: true, montant: "15 €", retard: "10 min", annulation: "48 h avant", autre: "" }, BR.regles || {});
  const vide = t => `<span class="lg-vide">${t} (à compléter)</span>`;
  const nomPro = L.nomComplet ? esc(L.nomComplet) : vide("Prénom et nom");
  const salon = esc(L.entreprise || BR.nom || "");
  const adresse = esc(L.adresse || [BR.rue, [BR.cp, BR.ville].filter(Boolean).join(" ")].filter(Boolean).join(", ")) || vide("Adresse");
  const contact = [BR.telephone && `Téléphone : ${esc(BR.telephone)}`, (L.email || BR.email) && `E-mail : ${esc(L.email || BR.email)}`].filter(Boolean).join("<br>") || vide("Téléphone ou e-mail");
  const siret = /^\d{14}$/.test(L.siret || "") ? L.siret.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, "$1 $2 $3 $4") : vide("SIRET");
  const med = L.mediateur ? `${esc(L.mediateur)}${L.mediateurSite ? ` — ${esc(L.mediateurSite)}` : ""}` : vide("Nom et site du médiateur");
  const ann = R.annulation.replace(" avant", "");
  const PAGES = {
    ml: ["Mentions légales", `
      <h4>Qui édite ce site</h4><p>${salon ? `<b>${salon}</b><br>` : ""}${nomPro}, entrepreneure individuelle<br>${adresse}<br>${contact}<br>SIRET : ${siret}${L.tvaNon === false ? "" : "<br>TVA non applicable, article 293 B du CGI."}</p>
      <p>Directrice de la publication : ${nomPro}</p>
      <h4>Création et hébergement</h4><p>Ce site est créé avec <b>Loginail</b>, un service de Marie Leandri, entrepreneure individuelle, SIREN 954 000 253, Porto-Vecchio — contact@loginail.fr. Hébergement : ${vide("hébergeur de Loginail")}.</p>
      <h4>Photos, textes et avis</h4><p>Les photos et les textes de ce site appartiennent à ${salon || "la prothésiste"}. Toute copie est interdite sans son accord.</p>
      <p>Les avis affichés viennent de Google. Ils sont écrits par des clientes sur Google et ne sont pas vérifiés par le salon.</p>
      <h4>Signaler un contenu</h4><p>Un contenu vous semble illégal ? Écrivez à contact@loginail.fr avec l’adresse de la page. Nous répondons rapidement.</p>`],
    conf: ["Confidentialité", `
      <p><b>En bref :</b> vos informations servent seulement à gérer vos rendez-vous. Elles ne sont jamais vendues.</p>
      <h4>Qui est responsable</h4><p>${nomPro}${salon ? ` (${salon})` : ""}, ${adresse}.</p>
      <h4>Ce que nous gardons</h4><p>Quand vous réservez : votre prénom, votre nom, votre téléphone, votre e-mail, la prestation, la date et l’heure, et l’acompte payé.</p>
      <h4>Pourquoi</h4><p>Pour réserver votre rendez-vous, vous envoyer la confirmation et le rappel la veille, et faire votre ticket de caisse. C’est nécessaire pour la réservation que vous demandez.</p>
      <p>Le petit SMS d’anniversaire n’est envoyé que si vous avez dit oui, et seulement si vous êtes venue au salon ces 12 derniers mois. Vous pouvez dire stop à tout moment. Aucune publicité n’est envoyée.</p>
      <h4>Combien de temps</h4><p>Trois ans après votre dernier rendez-vous, puis tout est effacé. Les tickets de caisse sont gardés le temps exigé par la loi.</p>
      <h4>Qui les voit</h4><p>Seulement ${salon || "la prothésiste"}. Le site et l’agenda sont gérés par Loginail, qui les garde pour elle et ne les utilise pas pour autre chose. Si vous payez un acompte en ligne, le paiement passe par Stripe : le salon ne voit jamais votre numéro de carte.</p>
      <h4>Vos droits</h4><p>Vous pouvez voir, corriger ou effacer vos informations en contactant le salon (${contact}). En cas de désaccord, vous pouvez vous adresser à la CNIL (cnil.fr).</p>`],
    cgv: ["Conditions de réservation", `
      <h4>Les prix</h4><p>Les prix affichés sont en euros, toutes taxes comprises${L.tvaNon === false ? "" : " (TVA non applicable, article 293 B du CGI)"}. Le prix payé est celui affiché au moment de la réservation.</p>
      <h4>La réservation</h4><p>Vous choisissez une prestation, un jour et une heure, puis vous donnez vos coordonnées. Vous recevez une confirmation par SMS.</p>
      ${R.acompte ? `<h4>L’acompte</h4><p>Un acompte de <b>${esc(R.montant)}</b> est demandé pour réserver. Il est déduit du prix le jour du rendez-vous. Le reste se paie au salon.</p>` : `<h4>Le paiement</h4><p>Tout se paie au salon, le jour du rendez-vous.</p>`}
      <h4>Annuler ou déplacer</h4><p>Vous pouvez annuler ou déplacer gratuitement jusqu’à <b>${esc(ann)}</b> avant le rendez-vous${R.acompte ? ", et l’acompte vous est rendu" : ""}. Après, ou si vous ne venez pas${R.acompte ? ", l’acompte est gardé" : ", le salon peut refuser une prochaine réservation en ligne"}.</p>
      <h4>Les retards</h4><p>Un retard de <b>${esc(R.retard)}</b> est accepté. Au-delà, la prestation peut être raccourcie ou le rendez-vous déplacé.</p>
      ${R.autre ? `<h4>Bon à savoir</h4><p>${esc(R.autre)}</p>` : ""}
      <h4>Le droit de rétractation</h4><p>Quand vous réservez en ligne, la loi vous donne 14 jours pour changer d’avis. Si votre rendez-vous a lieu avant la fin de ces 14 jours, vous demandez que la prestation soit faite avant. Si vous changez d’avis, il faut nous le dire avant le rendez-vous.</p>
      <h4>Le ticket</h4><p>À partir de 25 €, vous recevez une note (ticket) : par QR code ou par e-mail.</p>
      <h4>Un souci ?</h4><p>Contactez d’abord le salon (${contact}). ${L.mediateur ? `Si vous n’êtes pas d’accord avec sa réponse, vous pouvez faire appel gratuitement au médiateur de la consommation : ${med}.` : ""}</p>`],
    ck: ["Cookies", `
      <p>Ce site ne dépose <b>aucun cookie de publicité</b> et ne mesure pas l’audience.</p>
      <p>La carte pour venir au salon vient d’OpenFreeMap. Pour l’afficher, votre téléphone se connecte à leur service (qui reçoit son adresse internet), sans aucun cookie.</p>`]
  };
  const css = document.createElement("style");
  css.textContent = `.lg{position:absolute;left:11px;right:11px;top:11px;bottom:11px;border-radius:53px;overflow:hidden;z-index:97;pointer-events:none;font-family:Jost,sans-serif;color:#1E1C1B}
  html.public .lg,html:not(.iph) .lg{inset:0;border-radius:0}
  .lg .lv{position:absolute;inset:0;background:rgba(20,18,17,.42);opacity:0;transition:opacity .35s}
  .lg .lf{position:absolute;left:0;right:0;bottom:0;max-height:92%;overflow-y:auto;scrollbar-width:none;background:#F6F3EF;border-radius:30px 30px 0 0;padding:14px 24px 34px;transform:translateY(105%);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
  .lg.on{pointer-events:auto}.lg.on .lv{opacity:1}.lg.on .lf{transform:none}
  .lg .poi{width:40px;height:5px;border-radius:3px;background:rgba(30,28,27,.2);margin:0 auto 10px}
  .lg .x{position:absolute;top:14px;right:16px;width:36px;height:36px;border:0;border-radius:50%;background:rgba(30,28,27,.06);font:300 22px/1 Jost;cursor:pointer;color:#1E1C1B}
  .lg h3{margin:8px 0 14px;font:400 13px Jost;letter-spacing:.24em;text-transform:uppercase;text-align:center}
  .lg h4{margin:18px 0 4px;font:500 11px Jost;letter-spacing:.16em;text-transform:uppercase;color:#6B625C}
  .lg p{margin:0 0 8px;font:300 14px/1.6 Jost}.lg b{font-weight:500}
  .lg .lg-vide{color:#A04A4A;border-bottom:1px dashed currentColor}
  .lg .maj{margin-top:18px;font:300 11.5px Jost;color:#8a8076;text-align:center}
  .rs label a{color:inherit;text-decoration:underline}`;
  document.head.append(css);
  tel.insertAdjacentHTML("beforeend", `<div class="lg" id="lgp"><div class="lv" data-lgx></div><div class="lf"></div></div>`);
  const lg = document.getElementById("lgp"), lf = lg.querySelector(".lf");
  const ouvre = k => { const p = PAGES[k]; if (!p) return; lf.innerHTML = `<div class="poi"></div><button class="x" data-lgx aria-label="Fermer">×</button><h3>${p[0]}</h3>${p[1]}<div class="maj">${salon || ""} · mis à jour automatiquement</div>`; lf.scrollTop = 0; lg.classList.add("on"); };
  lg.addEventListener("click", e => { if (e.target.closest("[data-lgx]")) lg.classList.remove("on"); });
  if (typeof glisse === "function") glisse(lf, () => lf, (dx, dy) => { if (dy > 90 && lf.scrollTop <= 0) lg.classList.remove("on"); }, false, e => !e.target.closest("button,a"));
  /* les liens en bas du site + ceux de la réservation */
  document.addEventListener("click", e => { const a = e.target.closest("[data-leg],[data-legp]"); if (!a) return; const k = a.dataset.legp || a.dataset.leg;
    if (k === "vitrine") { e.preventDefault(); e.stopPropagation(); window.open("https://loginail.fr", "_blank", "noopener"); return; }
    if (!PAGES[k]) return;
    e.preventDefault(); e.stopPropagation(); ouvre(k); }, true);
  window.LOGI_LEGAL = { ouvre };
})();
