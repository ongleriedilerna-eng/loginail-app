/* ===== 12/11 nuit (Marie) : l'assistante Loginail (bulle « ? » en haut de l'accueil) + petites finitions d'écran =====
   L'assistante répond par le serveur (fonction « assistante », à mettre en place) ; tant qu'elle n'y est pas, et dans le salon d'essai,
   elle répond avec les réponses toutes prêtes ci-dessous (gratuites). */
(function () {
  const st = document.createElement("style");
  st.textContent = `
/* les boutons du bas des feuilles ne sont plus coupés (barre de l'iPhone) */
.feuille{padding-bottom:calc(env(safe-area-inset-bottom) + 70px)!important}
label.btn{display:flex!important;align-items:center;justify-content:center}
/* prénom et nom sur la même ligne */
.form .duo2{display:grid;grid-template-columns:1fr 1fr;gap:10px}.form .duo2 label{min-width:0}.form .duo2 input{width:100%;box-sizing:border-box}
/* l'assistante */
.ai-b{width:46px;height:46px;border-radius:50%;border:0;background:#fff;display:grid;place-items:center;padding:0;font:500 19px/1 Jost,sans-serif;color:#1E1C1B;box-shadow:0 6px 16px -10px rgba(0,0,0,.35)}
.ai-fil{display:flex;flex-direction:column;gap:8px;margin-top:14px;text-align:left}
.ai-m{max-width:86%;border-radius:18px;padding:11px 14px;font-size:14px;line-height:1.5;white-space:pre-line}
.ai-m.elle{align-self:flex-end;background:#1E1C1B;color:#fff;border-bottom-right-radius:6px}
.ai-m.lui{align-self:flex-start;background:#fff;border-bottom-left-radius:6px}
.ai-m.att{opacity:.6}
.ai-sug{display:flex;flex-direction:column;gap:6px;margin-top:12px}.ai-sug button{border:0;border-radius:14px;background:#fff;padding:11px 14px;font:inherit;font-size:13.5px;text-align:left;color:#1E1C1B}
.ai-z{display:flex;gap:8px;margin-top:14px}.ai-z input{flex:1;min-width:0;border:0;border-radius:999px;background:#fff;padding:13px 16px;font:inherit;font-size:16px;outline:none}
.ai-z button{flex:none;width:48px;height:48px;border-radius:50%;border:0;background:#1E1C1B;color:#fff;font-size:18px;padding:0}`;
  document.head.appendChild(st);

  /* prénom et nom sur une ligne, dans la fiche « Nouvelle cliente » */
  new MutationObserver(() => { const p = document.querySelector('.fc #c-p'), n = document.querySelector('.fc #c-n'); if (!p || !n || p.closest(".duo2")) return;
    const lp = p.closest("label"), ln = n.closest("label"); if (!lp || !ln) return; const d = document.createElement("div"); d.className = "duo2"; lp.parentNode.insertBefore(d, lp); d.appendChild(lp); d.appendChild(ln); }).observe(document.body, { childList: true, subtree: true });

  /* les réponses toutes prêtes (aussi utilisées si le serveur ne répond pas) */
  const FAQ = [
    [/importer|r[ée]cup[ée]rer|mes clientes|contacts|fichier|planity|excel/i, "Pour récupérer tes clientes : Réglages › Importer mes clientes.\n\nDepuis ton iPhone : ouvre Contacts, reste appuyée sur une liste, puis « Exporter » et « Enregistrer dans Fichiers ». Reviens dans Loginail et choisis ce fichier.\n\nDepuis une autre appli de réservation : demande-lui l’export de tes clientes. Elle doit te le donner, ce sont tes données."],
    [/vacances|cong[ée]|fermer|ferm[ée]/i, "Pour fermer ton salon (vacances, formation) : Agenda › le rond barré en haut › choisis du… au…. Ces jours-là, plus personne ne peut réserver."],
    [/bloquer|pause|cr[ée]neau/i, "Pour bloquer un créneau : Agenda › touche l’heure › « Bloquer ce créneau ». Choisis la durée, ou « Autre… » pour l’heure de fin que tu veux."],
    [/d[ée]caler|d[ée]placer|changer.*heure/i, "Pour décaler un rendez-vous : touche-le › « Décaler », choisis le jour et l’heure. Dans l’agenda, tu peux aussi rester appuyée dessus et le faire glisser."],
    [/fid[ée]lit[ée]/i, "La carte de fidélité s’allume dans Réglages › Carte de fidélité. Choisis le nombre de visites et le cadeau. Chaque rendez-vous terminé compte une visite."],
    [/sms|rappel/i, "La veille au soir, chaque cliente qui a rendez-vous reçoit un SMS de rappel. Il faut son numéro de portable dans sa fiche. Réglages › Rappel la veille pour voir le message."],
    [/site|couleur|fond|charm|photo/i, "Pour changer ton site : onglet Mon site › « Personnaliser mon site » (en-tête, fond, typographie, charms). Tes photos, prix, horaires et adresse sont juste en dessous."],
    [/prix|prestation|tarif/i, "Tes prestations et tes prix : Réglages › Mes prestations. Touche une prestation pour la changer, ou ajoutes-en une."],
  ];
  const repLocale = q => (FAQ.find(f => f[0].test(q)) || [0, "Je n’ai pas encore la réponse à cette question. Écris-nous : Réglages › Besoin d’aide ?, on te répond vite."])[1];
  /* les questions toutes prêtes (Marie pourra en ajouter : une ligne = [la question, la réponse]) */
  const QR = [
    ["Comment récupérer mes clientes ?", FAQ[0][1]],
    ["Comment fermer mon salon pour les vacances ?", FAQ[1][1]],
    ["Comment bloquer un créneau ?", FAQ[2][1]],
    ["Comment décaler un rendez-vous ?", FAQ[3][1]],
    ["Comment ajouter un rendez-vous ?", "Agenda › le « + » en haut, ou touche directement l’heure voulue › « Nouveau rendez-vous ». Choisis la cliente (ou « + Nouvelle cliente »), la prestation, puis Enregistrer."],
    ["Comment ajouter une cliente ?", "Clientes › « Ajouter une cliente ». Seul le prénom est obligatoire. Tu peux aussi la créer directement en prenant un rendez-vous."],
    ["Comment marche la carte de fidélité ?", FAQ[4][1]],
    ["Comment marche le SMS de rappel ?", FAQ[5][1]],
    ["Comment changer mon site ?", FAQ[6][1]],
    ["Comment changer mes prix ?", FAQ[7][1]],
    ["Comment relancer une cliente qui ne revient pas ?", "Clientes › « À relancer » : ce sont les clientes pas revenues depuis 6 semaines. « Lui écrire » ouvre tes Messages avec un texte tout prêt. Tu peux changer ce texte dans Réglages › Mon message de relance."],
    ["Comment voir ce que j’ai gagné ?", "Réglages › Mon bilan : ce mois-ci, cette semaine, ce qui est encore prévu, tes nouvelles clientes."],
  ];
  let FIL = [];
  const dessine = () => { const z = document.querySelector(".fc .ai-fil"); if (!z) return; z.innerHTML = FIL.map(m => `<div class="ai-m ${m.role === "user" ? "elle" : "lui"}">${esc(m.content)}</div>`).join("");
    const f = document.querySelector(".feuille"); if (f && FIL.length) f.scrollTop = f.scrollHeight; };
  const liste = () => { const deja = new Set(FIL.filter(m => m.role === "user").map(m => m.content));
    return `<div class="ai-sug">${FIL.length ? '<div class="lab2" style="margin:6px 0 2px">Une autre question ?</div>' : ""}${QR.filter(x => !deja.has(x[0])).map(x => `<button data-ai="sug">${x[0]}</button>`).join("")}
      <button data-ai="autre" style="background:none;text-decoration:underline;text-underline-offset:3px;color:#6B625C;text-align:center">Ma question n’est pas là</button></div>`; };
  const feuilleAide = () => { ouvre(`<h3>L’assistante Loginail</h3><div class="sous">Bonjour ! Touche ta question, je t’explique.</div><div class="ai-fil"></div><div class="ai-l">${liste()}</div>`); dessine(); };
  function demande(q) { const r = QR.find(x => x[0] === q); if (!r) return; FIL.push({ role: "user", content: q }, { role: "assistant", content: r[1] }); dessine();
    const l = document.querySelector(".fc .ai-l"); if (l) l.innerHTML = liste(); const f = document.querySelector(".feuille"), m = document.querySelectorAll(".fc .ai-m"); if (f && m.length > 1) f.scrollTop = m[m.length - 2].offsetTop - 20; }
  const acc0 = VUES.acc;
  VUES.acc = () => { const h = acc0(), i = h.indexOf("</h1></div>"); if (i < 0) return h; const j = i + "</h1></div>".length;
    return h.slice(0, j) + `<button class="ai-b" data-ai="ouvrir" aria-label="L’assistante Loginail"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M9.2 9.3a2.9 2.9 0 1 1 4.1 2.6c-.8.4-1.3 1.1-1.3 2v.6"/><circle cx="12" cy="17.6" r=".6" fill="currentColor" stroke="none"/></svg></button>` + h.slice(j); };
  document.addEventListener("click", e => { const a = e.target.closest && e.target.closest("[data-ai]"); if (!a) return; e.stopPropagation(); const k = a.dataset.ai;
    if (k === "ouvrir") feuilleAide(); else if (k === "sug") demande(a.textContent.trim());
    else if (k === "autre") window.open("https://wa.me/33745266189?text=" + encodeURIComponent("Bonjour Loginail, j’ai une question : "), "_blank", "noopener"); }, true);
})();

/* ===== 13/11 (Marie) : Clientes — importer par l'icône du haut ; les lettres A-Z posées à part, comme sur l'iPhone ===== */
(function () {
  const IMP = `<button class="ai-b" data-s5="plusieurs" aria-label="Importer mes clientes"><svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.6" cy="8.4" r="2.1" opacity=".55"/><path d="M1.8 17c.4-2.2 1.8-3.5 3.8-3.5" opacity=".55"/><circle cx="16.6" cy="8.4" r="2.1" opacity=".55"/><path d="M20.6 17c-.3-1.6-1.1-2.7-2.3-3.2" opacity=".55"/><circle cx="11" cy="7.6" r="2.7"/><path d="M6 19c.5-3 2.4-4.8 5-4.8s4.5 1.8 5 4.8"/><path d="M19.3 17.2v4.6M17 19.5h4.6"/></svg></button>`;
  const cl0 = VUES.cl;
  VUES.cl = () => { let h = cl0().replace(/<button class="s5-plus" data-s5="plusieurs">[^<]*<\/button>/, ""); const i = h.indexOf("</h1></div>");
    if (i >= 0) h = h.slice(0, i + 11) + IMP + h.slice(i + 11);
    return h.replace("Elles s’ajoutent toutes seules quand elles réservent sur ton site.</span>", "Elles s’ajoutent toutes seules quand elles réservent sur ton site.</span><button class=\"btn clair\" data-s5=\"plusieurs\" style=\"margin-top:12px\">Importer mes clientes</button>"); };

  /* les lettres : à droite, au milieu, posées sur l'écran (pas dans la liste qui défile) ; on glisse le doigt dessus */
  const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");
  const st = document.createElement("style");
  st.textContent = `.idx2{position:absolute;right:2px;top:50%;transform:translateY(-50%);z-index:12;display:flex;flex-direction:column;align-items:center;padding:8px 4px;touch-action:none;-webkit-user-select:none;user-select:none}
.idx2[hidden]{display:none}.idx2 span{font-size:10.5px;font-weight:600;line-height:15px;width:16px;text-align:center;color:rgba(30,28,27,.28)}.idx2 span.a{color:#1E1C1B}
.idx2-b{position:absolute;left:50%;top:44%;z-index:13;width:64px;height:64px;margin:-32px;border-radius:18px;background:rgba(30,28,27,.75);color:#fff;display:grid;place-items:center;font:500 28px Jost,sans-serif;pointer-events:none;opacity:0;transition:opacity .15s}.idx2-b.on{opacity:1}`;
  document.head.appendChild(st);
  let IX = null, BU = null, der = "";
  const lettre = c => { const l = (String(c.prenom || "").replace(/^@+/, "") || "#").normalize("NFD").replace(/[\u0300-\u036f]/g, "")[0].toUpperCase(); return /[A-Z]/.test(l) ? l : "#"; };
  const pose = () => { if (!E.querySelector(".ong")) return; if (!IX || !IX.isConnected) { IX = document.createElement("div"); IX.className = "idx2"; IX.innerHTML = L.map(l => `<span data-l="${l}">${l}</span>`).join(""); E.appendChild(IX); BU = document.createElement("div"); BU.className = "idx2-b"; E.appendChild(BU); branche(); }
    const on = S.onglet === "cl" && S.tri === "az" && !S.cherche.trim() && S.clientes.length > 8; IX.hidden = !on; if (!on) return;
    const pres = new Set(S.clientes.map(lettre)); IX.querySelectorAll("span").forEach(x => x.classList.toggle("a", pres.has(x.dataset.l))); };
  const va = y => { const r = IX.getBoundingClientRect(), i = Math.max(0, Math.min(L.length - 1, Math.floor((y - r.top - 8) / ((r.height - 16) / L.length)))), l = L[i]; if (l === der) return; der = l;
    const cib = [...E.querySelectorAll('.vue.on [id^="L-"]')], k = l === "#" ? "0" : l, el = cib.find(z => (z.id.slice(2) === "0" ? "[" : z.id.slice(2)) >= (l === "#" ? "[" : l)) || cib[cib.length - 1]; if (!el) return;
    const vu = E.querySelector(".vue.on"); vu.scrollTop += el.getBoundingClientRect().top - vu.getBoundingClientRect().top - 140; BU.textContent = l; BU.classList.add("on"); navigator.vibrate?.(3); };
  const fin = () => { der = ""; BU && BU.classList.remove("on"); };
  function branche() {
    IX.addEventListener("touchstart", e => { e.preventDefault(); va(e.touches[0].clientY); }, { passive: false });
    IX.addEventListener("touchmove", e => { e.preventDefault(); va(e.touches[0].clientY); }, { passive: false });
    IX.addEventListener("touchend", fin); IX.addEventListener("touchcancel", fin);
    let bas = false; IX.addEventListener("mousedown", e => { bas = true; va(e.clientY); e.preventDefault(); }); document.addEventListener("mousemove", e => { if (bas) va(e.clientY); }); document.addEventListener("mouseup", () => { if (bas) { bas = false; fin(); } }); }
  const r0 = rendu; rendu = function () { r0.apply(this, arguments); try { pose(); } catch (e) {} };
})();

/* ===== 13/11 (Marie) : supprimer une cliente (dans sa fiche, avec le crayon)
   22/11 (Marie) : « Supprimer … ? Non / Oui » s'affiche au milieu de l'écran (plus en bas de la fiche, où il fallait descendre). ===== */
(function () {
  const ID = () => { const b = document.querySelector('.fc [data-a="cli-ok"]'); return b && b.dataset.id; };
  const st = document.createElement("style");
  st.textContent = `.sup-fond{position:fixed;inset:0;z-index:320;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(30,20,22,.4);touch-action:none;cursor:pointer;animation:supFond .18s ease both}
.sup-boite{box-sizing:border-box;cursor:default;width:100%;max-width:340px;max-height:100%;overflow:auto;border-radius:24px;background:#fff;padding:22px 18px 18px;text-align:center;font:300 14px/1.5 Jost,sans-serif;color:#6B625C;animation:supBoite .22s cubic-bezier(.2,.85,.25,1) both}
.sup-boite b{display:block;margin-bottom:6px;font-weight:500;font-size:17px;line-height:1.3;color:#1E1C1B;overflow-wrap:anywhere}
.sup-boite p{margin:0}.sup-boite p+p{margin-top:6px;color:#A33A2E;font-weight:500}
.sup-bts{display:flex;gap:8px;margin-top:18px}.sup-bts button{flex:1;min-height:48px;border:0;border-radius:99px;padding:13px 4px;white-space:nowrap;font:400 15px/1.2 Jost,sans-serif;background:#F3EEE9;color:#1E1C1B;cursor:pointer}
.sup-bts [data-sup="oui"]{background:#A33A2E;color:#fff}.sup-bts button[disabled]{opacity:.6}
@keyframes supFond{from{opacity:0}}@keyframes supBoite{from{opacity:0;transform:scale(.94)}}
@media (prefers-reduced-motion:reduce){.sup-fond,.sup-boite{animation:none}}`;
  document.head.appendChild(st);
  const range = () => document.querySelectorAll(".sup-fond").forEach(x => x.remove());
  /* iPhone : toucher le fond ne donne pas toujours de « clic » → on écoute le doigt qui se lève */
  document.addEventListener("touchend", e => { const t = e.target; if (!t.classList || !t.classList.contains("sup-fond")) return;
    e.preventDefault(); e.stopPropagation(); if (!t.querySelector("[disabled]")) range(); }, { capture: true, passive: false });
  new MutationObserver(() => { const b = document.querySelector('.fc [data-a="cli-ok"]'); if (!b || !b.dataset.id || document.querySelector(".fc [data-sup]")) return;
    b.insertAdjacentHTML("afterend", `<button class="lien-t" data-sup="1" style="display:block;margin:14px auto 0;color:#A33A2E">Supprimer cette cliente</button>`); }).observe(document.body, { childList: true, subtree: true });
  document.addEventListener("click", async e => { const t = e.target; if (!t.closest) return;
    const fond = t.closest(".sup-fond"), a = t.closest("[data-sup]"); if (!a && !fond) return; e.stopPropagation();
    if (fond && fond.querySelector("[disabled]")) return;                                /* suppression en cours */
    if (!a) { if (t === fond) range(); return; }                                         /* toucher à côté = Non */
    if (a.dataset.sup === "non") return range();
    const id = fond ? fond.dataset.id : ID(), c = S.clientes.find(x => x.id === id); if (!c) return range();
    if (a.dataset.sup === "1") { const n = (S.tous || []).filter(r => r.cliente_id === id && r.statut === "prevu" && new Date(r.debut) > new Date()).length;
      const act = document.activeElement; if (act && act.blur) act.blur();                /* clavier rangé : la question est bien au milieu */
      range();
      document.body.insertAdjacentHTML("beforeend", `<div class="sup-fond" data-id="${esc(id)}"><div class="sup-boite" role="alertdialog" aria-modal="true" aria-labelledby="sup-titre"><b id="sup-titre">Supprimer ${esc(nomCli(c))}&nbsp;?</b><p>Sa fiche et ses notes seront effacées pour toujours.</p>${n ? `<p>${n > 1 ? `Ses ${n} rendez-vous à venir seront annulés` : "Son rendez-vous à venir sera annulé"}, <span style="white-space:nowrap">sans e-mail&nbsp;:</span> préviens-la.</p>` : ""}
        <div class="sup-bts"><button data-sup="non">Non</button><button data-sup="oui">Oui, supprimer</button></div></div></div>`);
      return; }
    a.disabled = true; const maint = new Date().toISOString();
    await sb.from("rendez_vous").update({ statut: "annule" }).eq("cliente_id", id).eq("statut", "prevu").gte("debut", maint);
    const { error } = await sb.from("clientes").delete().eq("id", id); if (error) { range(); return dit("Oups, ça n’a pas marché. Réessaie."); }
    S.clientes = S.clientes.filter(x => x.id !== id); range(); ferme(); await chargeSemaine(); chargeVisites(); rendu(); dit("Cliente supprimée"); }, true);
})();
