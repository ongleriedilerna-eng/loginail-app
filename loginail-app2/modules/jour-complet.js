/* ===== 24/11 (Marie : « j'ai 5 clientes, je veux pas qu'il y en ait une de plus ») : Fermer ma journée + Clientes par jour, au maximum =====
   Maquette qui fait foi : maquettes/retours-2411/fermer-3.html (pas de bloc noir : une ligne douce sous la date).
   Serveur : serveur/sql/40-jour-complet.sql. Une journée fermée = un « verrou » (rendez-vous sans cliente sur toute la journée,
   titre « 🔒 Journée fermée » posé ici, ou « 🔒 Complet » posé par le serveur quand le maximum est atteint).
   Le site le voit comme « tout est pris ». Ici, le verrou est retiré de S.rdv / S.tous (rangé dans VER) : il ne se dessine pas
   et ne gêne jamais la pro, qui peut toujours ajouter quelqu'un à la main. */
(function () {
  const FERME = "🔒 Journée fermée", COMPLET = "🔒 Complet";
  const estVerrou = r => r && !r.cliente_id && (r.titre === FERME || r.titre === COMPLET);
  window.__estVerrou = estVerrou;
  let VER = [];   /* les verrous connus (semaine affichée + tout ce que chargeVisites a lu) */
  const JRS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const CAD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

  const st = document.createElement("style");
  st.textContent = `#E .jc{display:flex;align-items:center;gap:10px;margin:0 0 10px;padding:9px 14px;border-radius:16px;background:rgba(255,255,255,.72);font-size:13.5px;color:#4F4643;text-align:left}
#E .jc>span{flex:1;min-width:0}
#E .jc .pts{flex:none;display:flex;gap:4px}#E .jc .pts i{width:8px;height:8px;border-radius:50%;background:#E6DCD6}#E .jc .pts i.on{background:#C98A97}
#E .jc button{flex:none;border:0;background:none;padding:6px 0;font:inherit;font-size:13px;color:#9A5B62;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
#E .jc.ferme{background:#F3ECEA}#E .jc.ferme svg{flex:none;width:15px;height:15px;color:#9A5B62}
#E .jc.pop{animation:jc-in .25s ease-out}
#E .pap.jc-ferme .pl{background-image:repeating-linear-gradient(135deg,rgba(30,28,27,.045) 0 6px,transparent 6px 12px)}
#E .av-col.jc-ferme{background-image:repeating-linear-gradient(135deg,rgba(30,28,27,.05) 0 5px,transparent 5px 10px)}
#E .jc-l{margin:12px 0 0;padding:0;list-style:none;border-radius:16px;background:#fff;text-align:left}
#E .jc-l li{display:flex;gap:10px;padding:10px 14px;font-size:13.5px;line-height:1.35;border-bottom:1px solid #F1ECE7}#E .jc-l li:last-child{border:0}
#E .jc-re{margin-top:12px;border-radius:18px;background:#fff;text-align:left}
#E .jc-re>div,#E .jc-re>button{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;padding:12px 14px;border:0;border-bottom:1px solid #F1ECE7;background:none;font:inherit;font-size:14.5px;color:inherit;text-align:left}
#E .jc-re>:last-child{border-bottom:0}
#E .jc-re small{display:block;font-size:12px;color:#776D64;margin-top:1px}
#E .jc-pas{flex:none;display:flex;align-items:center;gap:10px}
#E .jc-pas button{width:36px;height:36px;border-radius:50%;border:1px solid #E9DFD9;background:#fff;font:inherit;font-size:18px;line-height:1;color:inherit;cursor:pointer}
#E .jc-pas b{min-width:28px;text-align:center;font-weight:500;font-size:16px}
#E .jc-sw{flex:none;width:46px;height:28px;border-radius:99px;background:#D9D0C9;position:relative;transition:background .2s}
#E .jc-sw::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:transform .2s}
#E .jc-sw.on{background:var(--v-fonce,#1E1C1B)}#E .jc-sw.on::after{transform:translateX(18px)}
#E .jc-note{margin:12px 4px 0;font-size:12.5px;line-height:1.4;color:#776D64;text-align:center}
@keyframes jc-in{from{opacity:0;transform:translateY(-3px)}}
@media (prefers-reduced-motion:reduce){#E .jc.pop,#E .jc-sw,#E .jc-sw::after{animation:none;transition:none}}`;
  document.head.appendChild(st);

  /* ---------- les verrous ne sont pas des rendez-vous ---------- */
  const trie = () => {
    const vus = new Map(VER.map(r => [r.id, r]));
    ["rdv", "tous"].forEach(k => { if (!Array.isArray(S[k])) return; S[k] = S[k].filter(r => { if (estVerrou(r)) { if (r.statut !== "annule") vus.set(r.id, r); return false; } return true; }); });
    VER = [...vus.values()];
  };
  const cs0 = chargeSemaine; chargeSemaine = async function () { const de = S.lundi, a = plusJours(S.lundi, 7); const r = await cs0.apply(this, arguments);
    VER = VER.filter(v => new Date(v.debut) < de || new Date(v.debut) >= a); trie(); return r; };
  const cv0 = chargeVisites; chargeVisites = async function () { const r = await cv0.apply(this, arguments); trie(); return r; };
  trie();

  /* ---------- l'état d'un jour ---------- */
  const debutJ = j => { const d = new Date(j); d.setHours(0, 0, 0, 0); return d; };
  const verrouDe = (j, t) => VER.find(r => r.titre === t && memeJour(new Date(r.debut), j));
  const maxi = () => { const m = S.profil && S.profil.max_clientes; return Array.isArray(m) && m.length === 7 ? m : null; };
  const maxDe = j => { const m = maxi(); return m ? m[(j.getDay() + 6) % 7] ?? null : null; };
  const nbDe = j => (S.rdv || []).filter(r => r.cliente_id && r.statut !== "annule" && memeJour(new Date(r.debut), j)).length;
  const horaireFerme = j => { const h = ((S.site && S.site.donnees && S.site.donnees.horaires) || (typeof brouillon === "function" && (brouillon() || {}).horaires) || []); return Array.isArray(h) && h.length === 7 && h[(j.getDay() + 6) % 7] === null; };
  function etat(j) {
    const n = nbDe(j), max = maxDe(j);
    if (verrouDe(j, FERME)) return { k: "ferme", n, max };
    if ((max != null && n >= max) || verrouDe(j, COMPLET)) return { k: "complet", n, max };
    return { k: "ouvert", n, max };
  }
  window.__jourComplet = j => etat(j).k !== "ouvert";

  /* ---------- la ligne douce sous la date (mode Jour) et les colonnes hachurées (mode Semaine) ---------- */
  let anime = "";
  const ag0 = VUES.ag;
  VUES.ag = () => {
    const h = ag0(), f = document.createElement("div"); f.innerHTML = h;
    const pap = f.querySelector(".pap"), auj = debutJ(new Date());
    if (pap) {
      const j = debutJ(S.jour), e = etat(j);
      if (e.k !== "ouvert") pap.classList.add("jc-ferme");
      anime = "";
    }
    f.querySelectorAll(".av-col[data-av-j]").forEach(c => { if (etat(new Date(c.dataset.avJ)).k !== "ouvert") c.classList.add("jc-ferme"); });
    return f.innerHTML;
  };

  /* ---------- 24/11 soir (Marie : « ça prend trop de place… un petit rond à côté du + ») : le cadenas à gauche du « + » ----------
     Ouvert = rond blanc, cadenas ouvert ; fermée ou complète = rond foncé, cadenas fermé. Toucher = la question (fermer / rouvrir / le maximum). */
  const st2 = document.createElement("style");
  st2.textContent = `#E .jc-rond{position:absolute;z-index:69;right:calc(max(20px,calc((100% - 560px)/2 + 20px)) + 52px);bottom:calc(max(24px,env(safe-area-inset-bottom)) + 78px);width:42px;height:42px;border-radius:50%;border:0;padding:0;background:#fff;color:var(--v-fonce,#1E1C1B);display:grid;place-items:center;box-shadow:0 6px 16px -8px rgba(0,0,0,.35);cursor:pointer;transition:background .2s,color .2s,transform .12s}
#E .jc-rond:active{transform:scale(.94)}#E .jc-rond[hidden]{display:none}
#E .jc-rond svg{width:19px;height:19px}
#E .jc-rond.ferme{background:var(--v-fonce,#1E1C1B);color:#fff}
#E .jc-rond:before{content:"";position:absolute;inset:-5px;border-radius:50%}
@media (max-width:350px){#E .jc-rond{width:36px;height:36px;right:calc(max(20px,calc((100% - 560px)/2 + 20px)) + 46px)}#E .jc-rond svg{width:17px;height:17px}#E .jc-rond:before{inset:-6px}}
#E .jc-etat{margin-top:12px;padding:12px 14px;border-radius:16px;background:#fff;font-size:14px;line-height:1.45;text-align:left;color:#4F4643}
#E .jc-etat .pts{display:flex;gap:4px;margin-bottom:6px}#E .jc-etat .pts i{width:9px;height:9px;border-radius:50%;background:#E6DCD6}#E .jc-etat .pts i.on{background:#C98A97}
#E .jc-lien{display:block;margin:12px auto 0;border:0;background:none;font:inherit;font-size:13px;color:#6B625C;text-decoration:underline;text-underline-offset:3px;cursor:pointer}`;
  document.head.appendChild(st2);
  const CAD_O = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 7.6-1.7"/></svg>';
  const CAD_F = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  let ROND = null;
  const majRond = () => {
    if (!E.querySelector(".ong")) return;
    if (!ROND || !ROND.isConnected) { ROND = document.createElement("button"); ROND.className = "jc-rond"; ROND.dataset.jc = "rond"; E.appendChild(ROND); }
    const j = debutJ(S.jour), auj = debutJ(new Date()), jourVue = S.onglet === "ag" && !!E.querySelector(".vue.on .pap"), e = jourVue ? etat(j) : null;
    ROND.hidden = !jourVue || j < auj || (e.k === "ouvert" && horaireFerme(j));
    if (ROND.hidden) return;
    const f = e.k !== "ouvert";
    ROND.classList.toggle("ferme", f); ROND.innerHTML = f ? CAD_F : CAD_O;
    ROND.setAttribute("aria-label", f ? (e.k === "ferme" ? "Journée fermée" : "Journée complète") : "Fermer ma journée");
  };
  const rr0 = rendu; rendu = function () { const v = rr0.apply(this, arguments); try { majRond(); } catch (x) { console.error(x); } return v; };
  addEventListener("resize", () => { try { majRond(); } catch (x) {} });
  setTimeout(() => { try { majRond(); } catch (x) {} }, 800);
  const pts = e => e.max != null && e.max <= 12 ? `<div class="pts" aria-hidden="true">${Array.from({ length: e.max }, (_, i) => `<i class="${i < e.n ? "on" : ""}"></i>`).join("")}</div>` : "";
  const cl = n => `${n} cliente${n > 1 ? "s" : ""}`;

  /* ---------- Fermer / Rouvrir ---------- */
  let occupe = false;
  async function fermer(j) {
    const deb = debutJ(j), fin = plusJours(deb, 1);
    const { data, error } = await sb.from("rendez_vous").insert({ cliente_id: null, titre: FERME, debut: deb.toISOString(), fin: fin.toISOString(), prix: null }).select().single();
    if (error) throw error;
    if (data) VER.push(data);
  }
  async function rouvrir(j) {
    const l = VER.filter(r => r.titre === FERME && memeJour(new Date(r.debut), j));
    for (const r of l) { const { error } = await sb.from("rendez_vous").delete().eq("id", r.id); if (error) throw error; }
    VER = VER.filter(r => !l.includes(r));
  }

  /* ---------- Réglages › Réservation en ligne › Clientes par jour, au maximum ---------- */
  let R = null;   /* { max, parJour, jours[7] } pendant qu'elle règle */
  const resume = () => { const m = maxi(); if (!m || m.every(x => x == null)) return "Pas de limite";
    if (m.every(x => x === m[0])) return `${m[0]} par jour au plus`;
    return m.map((x, i) => x == null ? null : `${x} le ${JRS[i].toLowerCase()}`).filter(Boolean).join(", "); };
  const re0 = VUES.re;
  VUES.re = () => {
    const h = re0(); if (!S.site) return h;
    const f = document.createElement("div"); f.innerHTML = h;
    const sw = f.querySelector('[data-a="resa-sw"]'), l = sw && sw.closest(".ligne"); if (!l) return h;
    l.insertAdjacentHTML("afterend", `<div class="ligne" data-jc="reglage"><div class="t">Clientes par jour, au maximum<span>${esc(resume())}</span></div><span class="fl">›</span></div>`);
    return f.innerHTML;
  };
  const val = v => v == null ? "∞" : v;
  const pas = (v, d) => { v = v == null ? (d > 0 ? 1 : null) : v + d; return v == null || v < 1 ? null : Math.min(30, v); };
  function reglage() {
    if (!R) { const m = maxi(), tous = !m || m.every(x => x === m[0]); R = { max: m ? m.find(x => x != null) ?? null : null, parJour: !tous, jours: m ? m.slice() : Array(7).fill(null) }; if (tous && m) R.max = m[0]; }
    ouvre(`<h3>Clientes par jour</h3><div class="sous">Au-delà, ton site affiche « complet »</div>
      <div class="jc-re"><div><span>Au maximum<small>∞ = pas de limite</small></span>${R.parJour ? "" : `<span class="jc-pas"><button data-jc="m" data-d="-1" aria-label="Moins">−</button><b>${val(R.max)}</b><button data-jc="m" data-d="1" aria-label="Plus">+</button></span>`}</div>
      <button data-jc="pj"><span>Jour par jour<small>Par exemple : 5 le samedi, sans limite en semaine</small></span><i class="jc-sw${R.parJour ? " on" : ""}"></i></button>
      ${R.parJour ? JRS.map((j, i) => `<div><span>${j}</span><span class="jc-pas"><button data-jc="j" data-i="${i}" data-d="-1" aria-label="Moins">−</button><b>${val(R.jours[i])}</b><button data-jc="j" data-i="${i}" data-d="1" aria-label="Plus">+</button></span></div>`).join("") : ""}</div>
      <button class="btn" data-jc="ok" style="margin-top:16px;width:100%">Enregistrer</button>
      <div class="jc-note">Tes clientes déjà inscrites gardent leur rendez-vous ; toi, tu peux toujours en ajouter à la main.</div>`);
  }
  async function enregistre(b) {
    const m = R.parJour ? R.jours.slice() : Array(7).fill(R.max), v = m.every(x => x == null) ? null : m;
    b.disabled = true; b.textContent = "Un instant…";
    const { data, error } = await sb.from("profils").update({ max_clientes: v }).eq("id", S.user.id).select().single();
    if (error) { console.error(error); b.disabled = false; b.textContent = "Enregistrer"; return dit(/max_clientes/.test(error.message || "") ? "Pas encore disponible : réessaie après la mise à jour" : "Oups, ça n’a pas marché. Réessaie."); }
    S.profil = data || Object.assign(S.profil || {}, { max_clientes: v });
    try { await sb.rpc("jc_recalcule"); } catch (e) { console.warn(e); }   /* les verrous « Complet » de ses prochains jours */
    try { await chargeSemaine(); } catch (e) { console.error(e); }
    R = null; ferme(); rendu(); dit(v ? "C’est enregistré ✓" : "Plus de limite ✓");
  }

  document.addEventListener("click", async e => {
    const a = e.target.closest && e.target.closest("[data-jc]"); if (!a) return;
    e.stopPropagation(); e.preventDefault();
    const k = a.dataset.jc;
    if (k === "reglage") { R = null; return reglage(); }
    if (k === "m") { R.max = pas(R.max, +a.dataset.d); return reglage(); }
    if (k === "j") { R.jours[+a.dataset.i] = pas(R.jours[+a.dataset.i], +a.dataset.d); return reglage(); }
    if (k === "pj") { R.parJour = !R.parJour; if (R.parJour && R.jours.every(x => x == null) && R.max != null) R.jours = Array(7).fill(R.max); return reglage(); }
    if (k === "ok") return enregistre(a);
    const j = debutJ(S.jour), nom = `${JRS[(j.getDay() + 6) % 7].toLowerCase()} ${j.getDate()}`;
    if (k === "rond") { const e = etat(j), Nom = nom.charAt(0).toUpperCase() + nom.slice(1);
      if (e.k === "ferme") return ouvre(`<h3>${esc(Nom)} est fermé</h3><div class="sous">Ton site ne prend plus personne ce jour-là</div><div class="jc-etat">${pts(e)}${cl(e.n)}${e.max != null ? " sur " + e.max : ""}. Toi, tu peux toujours ajouter quelqu’un.</div>
        <button class="btn" data-jc="rouvre" style="margin-top:16px;width:100%">Rouvrir ma journée</button><button class="btn clair" data-a="fermer" style="margin-top:8px;width:100%">Laisser fermée</button>`);
      if (e.k === "complet") return ouvre(`<h3>${esc(Nom)} est complet</h3><div class="sous">Tu as atteint ton maximum</div><div class="jc-etat">${pts(e)}Ta journée contient ${cl(e.n)}${e.max != null ? " sur " + e.max : ""} : ton site ne prend plus personne. Toi, tu peux toujours ajouter quelqu’un.</div>
        <button class="btn" data-jc="reglage" style="margin-top:16px;width:100%">Changer mon maximum</button><button class="btn clair" data-a="fermer" style="margin-top:8px;width:100%">C’est bon</button>`);
      return ouvre(`<h3>Fermer ${esc(nom)} ?</h3><div class="sous">${e.max != null ? `Ta journée contient ${cl(e.n)} sur ${e.max}` : e.n ? `Ta journée contient ${cl(e.n)}` : "Personne pour l’instant"}</div>
        <div class="jc-etat">${pts(e)}Si tu la fermes, ${e.n ? (e.n > 1 ? "tes clientes gardent leur rendez-vous" : "ta cliente garde son rendez-vous") + ", " : ""}ton site ne prend plus personne ce jour-là. Toi, tu peux toujours ajouter quelqu’un.</div>
        <button class="btn" data-jc="ferme-ok" style="margin-top:16px;width:100%">Fermer ma journée</button><button class="btn clair" data-a="fermer" style="margin-top:8px;width:100%">Laisser ouverte</button>
        <button class="jc-lien" data-jc="reglage">${e.max != null ? "Changer mon maximum de clientes" : "Mettre un maximum de clientes par jour"}</button>`); }
    if (k === "ferme") { const n = nbDe(j);
      return ouvre(`<h3>Fermer ${esc(nom)} ?</h3><div class="sous">${n ? `Tu as ${n} cliente${n > 1 ? "s" : ""}` : "Personne pour l’instant"}</div>
        <ul class="jc-l">${n ? `<li><span>✓</span>Elle${n > 1 ? "s gardent leur" : " garde son"} rendez-vous</li>` : ""}<li><span>🔒</span>Ton site ne prend plus personne ce jour-là</li><li><span>＋</span>Toi, tu peux toujours ajouter quelqu’un</li></ul>
        <button class="btn" data-jc="ferme-ok" style="margin-top:16px;width:100%">Fermer ma journée</button><button class="btn clair" data-a="fermer" style="margin-top:8px;width:100%">Laisser ouverte</button>`); }
    if (occupe) return;
    if (k === "ferme-ok" || k === "rouvre") {
      occupe = true; a.disabled = true;
      try { if (k === "ferme-ok") await fermer(j); else await rouvrir(j); anime = j.toDateString() + (k === "rouvre" ? "ouvert" : "ferme"); }
      catch (err) { console.error(err); a.disabled = false; occupe = false; return dit("Oups, ça n’a pas marché. Réessaie."); }
      occupe = false;
      ferme();
      try { await chargeSemaine(); } catch (err) { console.error(err); }
      rendu(); dit(k === "ferme-ok" ? `${nom.charAt(0).toUpperCase() + nom.slice(1)} fermé ✓` : `${nom.charAt(0).toUpperCase() + nom.slice(1)} rouvert ✓`);
    }
  }, true);
})();
