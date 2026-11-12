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
  const SUG = ["Comment récupérer mes clientes ?", "Comment fermer mon salon pour les vacances ?", "Comment décaler un rendez-vous ?", "Comment marche la carte de fidélité ?"];
  let FIL = [];
  const dessine = () => { const z = document.querySelector(".fc .ai-fil"); if (!z) return; z.innerHTML = FIL.map(m => `<div class="ai-m ${m.role === "user" ? "elle" : "lui"}${m.att ? " att" : ""}">${esc(m.content)}</div>`).join("");
    const f = document.querySelector(".feuille"); if (f) f.scrollTop = f.scrollHeight; };
  const feuilleAide = () => { ouvre(`<h3>L’assistante Loginail</h3><div class="sous">Bonjour ! Posez-moi vos questions sur l’appli, je vous explique.</div>
      <div class="ai-fil"></div>${FIL.length ? "" : `<div class="ai-sug">${SUG.map(s => `<button data-ai="sug">${s}</button>`).join("")}</div>`}
      <div class="ai-z"><input id="ai-q" placeholder="Votre question" maxlength="300" autocomplete="off"><button data-ai="envoi" aria-label="Envoyer">›</button></div>`); dessine(); };
  async function demande(q) { q = (q || "").trim(); if (!q) return; const s = document.querySelector(".fc .ai-sug"); if (s) s.remove();
    FIL.push({ role: "user", content: q }); FIL.push({ role: "assistant", content: "…", att: true }); dessine(); const i = document.querySelector("#ai-q"); if (i) i.value = "";
    let rep = ""; try { const r = sb.functions ? await sb.functions.invoke("assistante", { body: { messages: FIL.filter(m => !m.att).slice(-8).map(m => ({ role: m.role, content: m.content })) } }) : null; rep = r && r.data && r.data.reponse; } catch (e) {}
    FIL.pop(); FIL.push({ role: "assistant", content: rep || repLocale(q) }); dessine(); }

  const acc0 = VUES.acc;
  VUES.acc = () => { const h = acc0(), i = h.indexOf("</h1></div>"); if (i < 0) return h; const j = i + "</h1></div>".length;
    return h.slice(0, j) + `<button class="ai-b" data-ai="ouvrir" aria-label="Aide : poser une question">?</button>` + h.slice(j); };
  document.addEventListener("click", e => { const a = e.target.closest && e.target.closest("[data-ai]"); if (!a) return; e.stopPropagation(); const k = a.dataset.ai;
    if (k === "ouvrir") feuilleAide(); else if (k === "sug") demande(a.textContent); else if (k === "envoi") demande((document.querySelector("#ai-q") || {}).value); }, true);
  document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.id === "ai-q") demande(e.target.value); });
})();
