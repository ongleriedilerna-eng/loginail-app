/* ===== 25/11 (Marie, D119, maquettes/retours-2411/premier-jour.html, téléphone A) : le premier jour d'une nouvelle prothésiste =====
   Remplace, tant qu'elle n'a pas touché « C'est bon, c'est mon salon », la carte « Bienvenue chez toi » et l'ancien « Pour bien démarrer » :
   · la date du jour comme tous les jours (Marie, 25/11 : « tu mets quand même la date d'aujourd'hui, comme si on était dans le truc »), puis « Pour bien démarrer, choisis tes réglages ↓ » sur UNE ligne ;
   · « Mon salon, à ma façon » + « Tu pourras toujours tout modifier dans Réglages » ; 7 réglages en Oui / Non qui agissent pour de vrai ;
   · « Ensuite » : les 3 premiers pas ; « Ma caisse » et « Partager mes dispos » cachés tant qu'ils ne sont pas faits.
   Même mémoire que l'ancien carré de bienvenue (user_metadata.bienvenue_vue) : une pro qui l'avait déjà fermé ne voit rien de nouveau. */
(function () {
  const st = document.createElement("style");
  st.textContent = `#E .pj{text-align:left}
#E .pj-l1{margin:2px 2px 4px;white-space:nowrap;font-size:clamp(14px,4.4vw,16.5px);color:#4F4643}
#E .pj-l1 b{font-weight:400;color:var(--v-acc,#B5475E)}
#E .pj .k{margin-top:16px}
#E .pj-mod{margin:-2px 2px 10px;font-size:13px;color:#4F4643}
#E .pj-rg{border-radius:20px;background:#fff}
#E .pj-rg>div{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:11px 14px;border-bottom:1px solid #F1ECE7}
#E .pj-rg>div:last-child{border:0}
#E .pj-ic{flex:none;width:34px;height:34px;border-radius:11px;background:var(--v-rose,#F5E6E4);display:grid;place-items:center;font-size:16px}
#E .pj-t{flex:1;min-width:0}#E .pj-t b{display:block;font-weight:400;font-size:14.5px;line-height:1.25}#E .pj-t small{display:block;font-size:12px;color:#776D64;margin-top:2px;line-height:1.3}
#E .pj-on{flex:none;display:flex;padding:3px;border-radius:99px;background:#F1ECE7}
#E .pj-on button{height:30px;padding:0 12px;border:0;border-radius:99px;background:none;font:inherit;font-size:13px;color:#6B625C;cursor:pointer;transition:background .15s,color .15s}
#E .pj-on button.on{background:var(--v-fonce,#1E1C1B);color:#fff}
#E .pj-on button.on.non{background:#fff;color:var(--v-fonce,#1E1C1B);box-shadow:0 1px 3px rgba(0,0,0,.12)}
#E .pj-ch{flex-basis:100%;display:flex;flex-wrap:wrap;gap:6px;margin:0 0 2px 46px}
#E .pj-ch button{height:32px;padding:0 12px;border-radius:99px;border:1px solid rgba(30,28,27,.14);background:#fff;font:inherit;font-size:12.5px;color:inherit;white-space:nowrap;cursor:pointer}
#E .pj-ch button.on{background:var(--v-fonce,#1E1C1B);color:#fff;border-color:transparent}
#E .pj-fr{flex-basis:100%;margin:0 0 2px 46px}#E .pj-fr-t{font-size:12.5px;color:#776D64}#E .pj-fr-t b{color:var(--v-acc,#9A5B62);font-weight:500}
#E .pj-fr-r{display:grid;grid-template-columns:repeat(6,26px);gap:7px;margin-top:7px}
#E .pj-fr-r button{width:26px;height:26px;padding:0;border-radius:50%;border:1.5px dashed color-mix(in srgb,var(--v-acc,#9A5B62) 45%,transparent);background:#fff;font-size:11px;color:#fff;display:grid;place-items:center;cursor:pointer;transition:background .15s,transform .12s}
#E .pj-fr-r button:active{transform:scale(.88)}#E .pj-fr-r button.plein{border:0;background:color-mix(in srgb,var(--v-acc,#9A5B62) 60%,#fff)}#E .pj-fr-r button.cad{background:var(--v-acc,#9A5B62);font-size:13px}
#E .pj-et{border-radius:20px;background:#fff}
#E .pj-et>button{display:flex;align-items:center;gap:12px;width:100%;padding:12px 14px;border:0;border-bottom:1px solid #F1ECE7;background:none;font:inherit;font-size:14.5px;color:inherit;text-align:left;cursor:pointer}
#E .pj-et>button:last-child{border-bottom:0}
#E .pj-et .c{flex:none;width:24px;height:24px;border-radius:50%;border:1.5px solid rgba(30,28,27,.25);display:grid;place-items:center;font-size:13px;color:transparent}
#E .pj-et .fait{opacity:.5;cursor:default}#E .pj-et .fait .c{background:var(--v-fonce,#1E1C1B);border-color:transparent;color:#fff}
#E .pj-et span:not(.c){flex:1}#E .pj-et i{font-style:normal;color:#B5AEA8}
#E .pj-ok{display:block;width:100%;margin-top:16px}
@media (prefers-reduced-motion:reduce){#E .pj-on button,#E .pj-fr-r button{transition:none}}`;
  document.head.appendChild(st);

  const uid = () => (S.user && S.user.id) || "";
  const vu = () => !!(S.user && S.user.user_metadata && S.user.user_metadata.bienvenue_vue) || (() => { try { return localStorage.getItem("loginail-bienvenue-" + uid()) === "vue"; } catch (e) { return false; } })();
  const br = () => (typeof brouillon === "function" && brouillon()) || {};
  const ecritBr = f => { const b = br(); f(b); localStorage.setItem("loginail-brouillon", JSON.stringify(b)); if (S.site) S.site.donnees = Object.assign({}, S.site.donnees, b); };   /* l'appli envoie au site toute seule */
  const regles = () => Object.assign({ acompte: true, montant: "15 €", frais: "Rien" }, br().regles || (S.site && S.site.donnees && S.site.donnees.regles) || {});
  const FID0 = { on: false, n: 10, cadeau: "−10 €" };
  const fid = () => { let o = null; try { o = (S.site && S.site.donnees && S.site.donnees.fidelite) || JSON.parse(localStorage.getItem("loginail-fidelite")); } catch (e) {} return Object.assign({}, FID0, o || {}); };
  const ecritFid = o => { try { localStorage.setItem("loginail-fidelite", JSON.stringify(o)); } catch (e) {} if (br().nom || S.site) ecritBr(b => { b.fidelite = o; }); };
  const resaOn = () => !(window.__resaCoupee && window.__resaCoupee());
  const MONTANTS = ["10 €", "15 €", "20 €", "30 %"], FRAIS = ["10 €", "15 €", "20 €", "25 €", "30 €"], CADEAUX = ["−10 €", "−20 %", "Nail art offert"];

  /* les 7 réglages : [clé, icône, titre, est-ce oui ?, phrase] */
  const L = () => { const r = regles(), f = fid(), p = S.profil || {};
    return [
      S.site ? ["resa", "🗓️", "Réservation en ligne", resaOn(), resaOn() ? "Tes clientes réservent sur ton site, jour et nuit" : "Coupée · ton site montre comment te contacter"] : null,
      ["acompte", "💳", "Acompte à la réservation", !!r.acompte, r.acompte ? `${r.montant}, déduit du prix le jour J` : "Pas d’acompte"],
      ["rappel", "💬", "Rappel SMS la veille", !p.rappel_off, !p.rappel_off ? "Envoyé tout seul vers 18 h · moins de lapins" : "Pas de rappel"],
      ["fid", "💖", "Carte de fidélité", !!f.on, f.on ? `Cadeau ${f.cadeau} toutes les ${f.n} visites` : "Pas de carte"],
      ["anniv", "🎂", "SMS d’anniversaire", !p.anniv_off, !p.anniv_off ? "Aux clientes qui ont dit oui" : "Pas de SMS d’anniversaire"],
      ["hor", "🕘", "Mon agenda suit mes horaires", localStorage.getItem("loginail-agenda-horaires") === "oui", localStorage.getItem("loginail-agenda-horaires") === "oui" ? "Il montre tes heures d’ouverture" : "Il montre toute la journée"],
      ["frais", "⏳", "Frais si elle annule trop tard", /\d/.test(r.frais || ""), /\d/.test(r.frais || "") ? `${r.frais} si elle annule tard ou ne vient pas` : "Pas de frais"],
    ].filter(Boolean); };
  const choix = k => { const r = regles(), f = fid();
    if (k === "acompte") return `<div class="pj-ch">${MONTANTS.map(m => `<button data-pjc="montant" data-v="${m}" class="${r.montant === m ? "on" : ""}">${m}</button>`).join("")}</div>`;
    if (k === "frais") return `<div class="pj-ch">${FRAIS.map(m => `<button data-pjc="frais" data-v="${m}" class="${r.frais === m ? "on" : ""}">${m}</button>`).join("")}</div>`;
    if (k === "fid") return `<div class="pj-fr"><div class="pj-fr-t">Un cadeau à la <b>${f.n}<sup>e</sup> visite</b> · touche un rond</div><div class="pj-fr-r">${Array.from({ length: 12 }, (_, i) => i + 1).map(n => `<button data-pjf="${n}" class="${n <= f.n ? "plein" : ""}${n === f.n ? " cad" : ""}" aria-label="Cadeau à la ${n}e visite">${n === f.n ? "🎁" : n <= f.n ? "✓" : ""}</button>`).join("")}</div></div>
      <div class="pj-ch">${CADEAUX.map(m => `<button data-pjc="cadeau" data-v="${m}" class="${f.cadeau === m ? "on" : ""}">${m}</button>`).join("")}</div>`;
    return ""; };
  const pas = () => [["Vérifier mes prestations et mes prix", prestasDispo().length > 0, 'data-a="prestas"'], ["Ajouter ma première cliente", S.clientes.length > 0, 'data-a="cli-nouv"'],
    ["Noter mon premier rendez-vous", ((S.tous || []).concat(S.rdv || [])).some(r => r.cliente_id), 'data-a="nouveau"']];

  function carte() {
    const P = pas(), fait = P.filter(x => x[1]).length;
    return `<div class="pj"><div class="pj-l1">Pour bien démarrer, <b>choisis tes réglages</b> ↓</div>
      <div class="k">Mon salon, à ma façon</div><div class="pj-mod">Tu pourras toujours tout modifier dans Réglages.</div>
      <div class="pj-rg">${L().map(([k, ic, t, on, d]) => `<div><span class="pj-ic" aria-hidden="true">${ic}</span><span class="pj-t"><b>${t}</b><small>${esc(d)}</small></span>
        <span class="pj-on" role="group" aria-label="${t}"><button data-pjs="${k}" data-o="1" class="${on ? "on" : ""}" aria-pressed="${on}">Oui</button><button data-pjs="${k}" data-o="0" class="${on ? "" : "on non"}" aria-pressed="${!on}">Non</button></span>${on ? choix(k) : ""}</div>`).join("")}</div>
      <div class="k">Ensuite · ${fait} sur ${P.length}</div>
      <div class="pj-et">${P.map(([t, ok, a]) => `<button ${ok ? 'class="fait" disabled' : a}><span class="c">✓</span><span>${t}</span>${ok ? "" : "<i>›</i>"}</button>`).join("")}</div>
      <button class="btn pj-ok" data-pjok>C’est bon, c’est mon salon</button></div>`;
  }
  const pasFaits = () => pas().every(x => x[1]);

  const acc0 = VUES.acc;
  VUES.acc = () => {
    const h = acc0(); if (!S.user || vu()) return h;
    const f = document.createElement("div"); f.innerHTML = h;
    f.querySelectorAll(".v-bv").forEach(x => x.remove());   /* l'ancien carré de bienvenue */
    const ancien = [...f.querySelectorAll(".k")].find(k => /Pour bien démarrer/.test(k.textContent));   /* l'ancien « Pour bien démarrer » */
    if (ancien) { const c = ancien.nextElementSibling; if (c && c.classList.contains("su-carte")) c.remove(); ancien.remove(); }
    if (!pasFaits()) {   /* un premier jour simple */
      const ca = [...f.querySelectorAll(".k")].find(k => /Ma caisse/.test(k.textContent)); if (ca) { const n = ca.nextElementSibling; if (n) n.remove(); ca.remove(); }
      f.querySelectorAll(".dsp-ouvre").forEach(x => x.remove());
    }
    const t = f.querySelector(".tete"); const z = document.createElement("div"); z.innerHTML = carte();
    if (t) t.after(z.firstElementChild); else f.prepend(z.firstElementChild);
    return f.innerHTML;
  };

  let occupe = false;
  addEventListener("click", async e => {
    const t = e.target; if (!t.closest || !t.closest(".pj")) return;
    const s = t.closest("[data-pjs]"), c = t.closest("[data-pjc]"), fr = t.closest("[data-pjf]"), ok = t.closest("[data-pjok]");
    if (!s && !c && !fr && !ok) return;   /* les 3 premiers pas : app2.js s'en occupe */
    e.stopPropagation(); e.preventDefault();
    if (ok) {
      try { localStorage.setItem("loginail-bienvenue-" + uid(), "vue"); } catch (x) {}
      if (S.user) { S.user.user_metadata = Object.assign({}, S.user.user_metadata, { bienvenue_vue: true }); try { sb.auth.updateUser({ data: { bienvenue_vue: true } }).catch(() => {}); } catch (x) {} }
      rendu(); return dit("Ton salon est réglé ✓ · tout reste dans Réglages");
    }
    if (fr) { const o = fid(); o.n = Math.max(3, +fr.dataset.pjf); ecritFid(o); rendu(); return dit(`Cadeau à la ${o.n}e visite ✓`); }
    if (c) { const k = c.dataset.pjc, v = c.dataset.v;
      if (k === "cadeau") { const o = fid(); o.cadeau = v; ecritFid(o); }
      else ecritBr(b => { b.regles = Object.assign({}, regles(), { [k]: v }); });
      rendu(); return dit("C’est noté ✓"); }
    const k = s.dataset.pjs, oui = s.dataset.o === "1", av = L().find(x => x[0] === k); if (!av || av[3] === oui || occupe) return;
    occupe = true;
    try {
      if (k === "resa") { const b = document.createElement("button"); b.dataset.a = "resa-sw"; b.hidden = true; E.appendChild(b); b.click(); b.remove(); return; }   /* resa-coupee.js : Non → « comment te contacter ? » */
      if (k === "acompte") ecritBr(b => { b.regles = Object.assign({}, regles(), { acompte: oui }); });
      if (k === "frais") ecritBr(b => { b.regles = Object.assign({}, regles(), { frais: oui ? "25 €" : "Rien" }); });
      if (k === "fid") { const o = fid(); o.on = oui; ecritFid(o); }
      if (k === "hor") localStorage.setItem("loginail-agenda-horaires", oui ? "oui" : "non");
      if (k === "rappel" || k === "anniv") {
        const col = k === "rappel" ? "rappel_off" : "anniv_off";
        const { data, error } = await sb.from("profils").update({ [col]: !oui }).eq("id", S.user.id).select().single();
        if (error) { console.error(error); return dit(new RegExp(col).test(error.message || "") ? "Pas encore disponible : réessaie après la mise à jour" : "Oups, ça n’a pas marché. Réessaie."); }
        S.profil = data || Object.assign(S.profil || {}, { [col]: !oui });
      }
      rendu(); dit(oui ? "Oui ✓" : "Non, c’est noté");
    } finally { occupe = false; }
  }, true);
})();
