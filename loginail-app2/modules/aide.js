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
    [/importer|r[ée]cup[ée]rer|mes clientes|contacts|fichier|planity|excel/i, "Pour récupérer vos clientes : Réglages › Importer mes clientes.\n\nDepuis votre iPhone : ouvrez Contacts, restez appuyée sur une liste, puis « Exporter » et « Enregistrer dans Fichiers ». Revenez dans Loginail et choisissez ce fichier.\n\nDepuis une autre appli de réservation : demandez-lui l’export de vos clientes. Elle doit vous le donner, ce sont vos données."],
    [/vacances|cong[ée]|fermer|ferm[ée]/i, "Pour fermer votre salon (vacances, formation) : Agenda › le rond barré en haut › choisissez du… au…. Ces jours-là, plus personne ne peut réserver."],
    [/bloquer|pause|cr[ée]neau/i, "Pour bloquer un créneau : Agenda › touchez l’heure › « Bloquer ce créneau ». Choisissez la durée, ou « Autre… » pour l’heure de fin que vous voulez."],
    [/d[ée]caler|d[ée]placer|changer.*heure/i, "Pour décaler un rendez-vous : touchez-le › « Décaler », choisissez le jour et l’heure. Dans l’agenda, vous pouvez aussi rester appuyée dessus et le faire glisser."],
    [/fid[ée]lit[ée]/i, "La carte de fidélité s’allume dans Réglages › Carte de fidélité. Choisissez le nombre de visites et le cadeau. Chaque rendez-vous terminé compte une visite."],
    [/sms|rappel/i, "La veille au soir, chaque cliente qui a rendez-vous reçoit un SMS de rappel. Il faut son numéro de portable dans sa fiche. Réglages › Rappel la veille pour voir le message."],
    [/site|couleur|fond|charm|photo/i, "Pour changer votre site : onglet Mon site › « Personnaliser mon site » (style, couleurs, fond, charms). Vos photos, prix, horaires et adresse sont juste en dessous."],
    [/prix|prestation|tarif/i, "Vos prestations et vos prix : Réglages › Mes prestations. Touchez une prestation pour la changer, ou ajoutez-en une."],
  ];
  const repLocale = q => (FAQ.find(f => f[0].test(q)) || [0, "Je n’ai pas encore la réponse à cette question. Écrivez-nous : Réglages › Besoin d’aide ?, on vous répond vite."])[1];
  /* les questions toutes prêtes (Marie pourra en ajouter : une ligne = [la question, la réponse]) */
  const QR = [
    ["Comment récupérer mes clientes ?", FAQ[0][1]],
    ["Comment fermer mon salon pour les vacances ?", FAQ[1][1]],
    ["Comment bloquer un créneau ?", FAQ[2][1]],
    ["Comment décaler un rendez-vous ?", FAQ[3][1]],
    ["Comment ajouter un rendez-vous ?", "Agenda › le « + » en haut, ou touchez directement l’heure voulue › « Nouveau rendez-vous ». Choisissez la cliente (ou « + Nouvelle cliente »), la prestation, puis Enregistrer."],
    ["Comment ajouter une cliente ?", "Clientes › « Ajouter une cliente ». Seul le prénom est obligatoire. Vous pouvez aussi la créer directement en prenant un rendez-vous."],
    ["Comment marche la carte de fidélité ?", FAQ[4][1]],
    ["Comment marche le SMS de rappel ?", FAQ[5][1]],
    ["Comment changer mon site ?", FAQ[6][1]],
    ["Comment changer mes prix ?", FAQ[7][1]],
    ["Comment relancer une cliente qui ne revient pas ?", "Clientes › « À relancer » : ce sont les clientes pas revenues depuis 6 semaines. « Lui écrire » ouvre vos Messages avec un texte tout prêt. Vous pouvez changer ce texte dans Réglages › Mon message de relance."],
    ["Comment voir ce que j’ai gagné ?", "Réglages › Mon bilan : ce mois-ci, cette semaine, ce qui est encore prévu, vos nouvelles clientes."],
  ];
  let FIL = [];
  const dessine = () => { const z = document.querySelector(".fc .ai-fil"); if (!z) return; z.innerHTML = FIL.map(m => `<div class="ai-m ${m.role === "user" ? "elle" : "lui"}">${esc(m.content)}</div>`).join("");
    const f = document.querySelector(".feuille"); if (f && FIL.length) f.scrollTop = f.scrollHeight; };
  const liste = () => { const deja = new Set(FIL.filter(m => m.role === "user").map(m => m.content));
    return `<div class="ai-sug">${FIL.length ? '<div class="lab2" style="margin:6px 0 2px">Une autre question ?</div>' : ""}${QR.filter(x => !deja.has(x[0])).map(x => `<button data-ai="sug">${x[0]}</button>`).join("")}
      <button data-ai="autre" style="background:none;text-decoration:underline;text-underline-offset:3px;color:#6B625C;text-align:center">Ma question n’est pas là</button></div>`; };
  const feuilleAide = () => { ouvre(`<h3>L’assistante Loginail</h3><div class="sous">Bonjour ! Touchez votre question, je vous explique.</div><div class="ai-fil"></div><div class="ai-l">${liste()}</div>`); dessine(); };
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
    return h.replace("Elles s’ajoutent toutes seules quand elles réservent sur votre site.</span>", "Elles s’ajoutent toutes seules quand elles réservent sur votre site.</span><button class=\"btn clair\" data-s5=\"plusieurs\" style=\"margin-top:12px\">Importer mes clientes</button>"); };

  /* les lettres : à droite, au milieu, posées sur l'écran (pas dans la liste qui défile) ; on glisse le doigt dessus */
  const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");
  const st = document.createElement("style");
  st.textContent = `.idx2{position:absolute;right:2px;top:50%;transform:translateY(-50%);z-index:12;display:flex;flex-direction:column;align-items:center;padding:8px 4px;touch-action:none;-webkit-user-select:none;user-select:none}
.idx2[hidden]{display:none}.idx2 span{font-size:10.5px;font-weight:600;line-height:15px;width:16px;text-align:center;color:rgba(30,28,27,.28)}.idx2 span.a{color:#1E1C1B}
.idx2-b{position:absolute;left:50%;top:44%;z-index:13;width:64px;height:64px;margin:-32px;border-radius:18px;background:rgba(30,28,27,.75);color:#fff;display:grid;place-items:center;font:500 28px Jost,sans-serif;pointer-events:none;opacity:0;transition:opacity .15s}.idx2-b.on{opacity:1}`;
  document.head.appendChild(st);
  let IX = null, BU = null, der = "";
  const lettre = c => { const l = String(c.prenom || "#").normalize("NFD").replace(/[\u0300-\u036f]/g, "")[0].toUpperCase(); return /[A-Z]/.test(l) ? l : "#"; };
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

/* ===== 13/11 (Marie) : supprimer une cliente (dans sa fiche, avec le crayon) ===== */
(function () {
  const ID = () => { const b = document.querySelector('.fc [data-a="cli-ok"]'); return b && b.dataset.id; };
  new MutationObserver(() => { const b = document.querySelector('.fc [data-a="cli-ok"]'); if (!b || !b.dataset.id || document.querySelector(".fc [data-sup]")) return;
    b.insertAdjacentHTML("afterend", `<button class="lien-t" data-sup="1" style="display:block;margin:14px auto 0;color:#A33A2E">Supprimer cette cliente</button>`); }).observe(document.body, { childList: true, subtree: true });
  document.addEventListener("click", async e => { const a = e.target.closest && e.target.closest("[data-sup]"); if (!a) return; e.stopPropagation(); const id = ID(), c = S.clientes.find(x => x.id === id); if (!c) return;
    if (a.dataset.sup === "1") { const n = (S.tous || []).filter(r => r.cliente_id === id && r.statut === "prevu" && new Date(r.debut) > new Date()).length;
      a.outerHTML = `<div class="blanche" style="margin-top:14px;padding:14px 16px;text-align:center;font-size:14px;line-height:1.5"><b style="font-weight:500">Supprimer ${esc(nomCli(c))} ?</b><br>Sa fiche et ses notes seront effacées pour toujours.${n ? `<br>Ses ${n > 1 ? n + " rendez-vous à venir seront annulés" : "rendez-vous à venir sera annulé"}.` : ""}
        <div style="display:flex;gap:8px;margin-top:12px"><button class="btn clair" data-sup="non" style="flex:1;margin:0">Non</button><button class="btn" data-sup="oui" style="flex:1;margin:0;background:#A33A2E">Oui, supprimer</button></div></div>`; return; }
    if (a.dataset.sup === "non") { feuilleCliente(id); return; }
    a.disabled = true; const maint = new Date().toISOString();
    await sb.from("rendez_vous").update({ statut: "annule" }).eq("cliente_id", id).eq("statut", "prevu").gte("debut", maint);
    const { error } = await sb.from("clientes").delete().eq("id", id); if (error) { a.disabled = false; return dit("Oups, ça n’a pas marché. Réessayez."); }
    S.clientes = S.clientes.filter(x => x.id !== id); await chargeSemaine(); chargeVisites(); ferme(); rendu(); dit("Cliente supprimée"); }, true);
})();
