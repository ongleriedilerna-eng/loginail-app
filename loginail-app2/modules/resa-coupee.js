/* ===== 24/11 (Marie : « quand elles activent pas leur résa en ligne… faut qu'elles puissent dire non et qu'on leur demande : vous voulez être contactée sur quoi ? ») =====
   Maquette qui fait foi : maquettes/retours-2411/anniv-resa.html (téléphones 2 et 3).
   Avant : couper « Réservation en ligne » mettait sites.en_ligne à faux → le site entier disparaissait (« Site introuvable »).
   Maintenant : le site reste en ligne ; on range dans le site resaCoupee = { on: true, m: ["appel","sms","whatsapp","insta"] }.
   Le site remplace « Réserver » par « Prendre rendez-vous », qui ouvre seulement ce qu'elle a coché.
   Le serveur refuse toute réservation en ligne tant que c'est coupé (sql/41, resa_coupee_avant). */
(function () {
  const MOYENS = [["appel", "📞", "Appel"], ["sms", "💬", "SMS"], ["whatsapp", "🟢", "WhatsApp"], ["insta", "📷", "Instagram"]];
  const st = document.createElement("style");
  st.textContent = `#E .rc-ch{display:flex;flex-direction:column;gap:8px;margin-top:14px}
#E .rc-ch button{display:flex;align-items:center;gap:12px;width:100%;padding:12px 14px;border-radius:16px;background:#fff;border:1px solid transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:border-color .2s}
#E .rc-ch button.on{border-color:var(--v-fonce,#1E1C1B)}
#E .rc-ch button[disabled]{opacity:.45;cursor:default}
#E .rc-ch .c{flex:none;width:22px;height:22px;border-radius:7px;border:1.5px solid rgba(30,28,27,.3);display:grid;place-items:center;font-size:13px;font-style:normal;color:transparent}
#E .rc-ch button.on .c{background:var(--v-fonce,#1E1C1B);border-color:transparent;color:#fff}
#E .rc-ch .ic{flex:none;font-size:18px}
#E .rc-ch .t{flex:1;min-width:0}#E .rc-ch b{display:block;font-weight:500;font-size:14.5px}#E .rc-ch small{display:block;font-size:12.5px;color:#776D64;overflow-wrap:anywhere}
#E .rc-l[data-rc]{cursor:pointer}`;
  document.head.appendChild(st);

  const br = () => brouillon() || {};
  const etat = () => { const r = br().resaCoupee || (S.site && S.site.donnees && S.site.donnees.resaCoupee); return r && r.on ? r : null; };
  const coupee = () => !!(S.site && (S.site.en_ligne === false || etat()));
  const coord = () => { const b = br(), tel = b.telephone || (S.profil && S.profil.telephone) || "", ig = String(b.insta || "").trim();
    return { appel: tel, sms: tel, whatsapp: tel, insta: ig ? (ig[0] === "@" ? ig : "@" + ig) : "" }; };
  const resume = r => (r && r.m || []).map(k => (MOYENS.find(x => x[0] === k) || [])[2]).filter(Boolean).join(", ") || "rien de coché";
  window.__resaCoupee = coupee;

  /* ---------- Réglages : la ligne dit la vérité, et « Comment te contacter » apparaît quand c'est coupé ---------- */
  const re0 = VUES.re;
  VUES.re = () => {
    const h = re0(); if (!S.site) return h;
    const f = document.createElement("div"); f.innerHTML = h;
    const sw = f.querySelector('[data-a="resa-sw"]'), l = sw && sw.closest(".ligne"); if (!l) return h;
    const off = coupee();
    sw.classList.toggle("on", !off);
    const sp = l.querySelector(".t span"); if (sp) sp.textContent = off ? (S.site.en_ligne === false ? "Coupée · ton site est caché : rallume pour le remontrer" : "Coupée · ton site reste visible") : "Tes clientes réservent sur ton site";
    if (off && etat()) l.insertAdjacentHTML("afterend", `<div class="ligne rc-l" data-rc="moyens"><div class="t">Comment te contacter<span>${esc(resume(etat()))}</span></div><span class="fl">›</span></div>`);
    return f.innerHTML;
  };

  /* ---------- la question ---------- */
  let CH = null, AVANT = null;
  function feuille() {
    const c = coord(), on = !coupee();
    ouvre(`<h3>Tes clientes te contactent comment ?</h3><div class="sous">Ton site reste visible. Le bouton « Réserver » devient « Prendre rendez-vous » et ouvre ce que tu coches.</div>
      <div class="rc-ch">${MOYENS.map(([k, ic, n]) => { const v = c[k]; return `<button data-rc="m" data-k="${k}" class="${CH.includes(k) && v ? "on" : ""}"${v ? "" : " disabled"}><i class="c">✓</i><span class="ic">${ic}</span><span class="t"><b>${n}</b><small>${v ? esc(v) : k === "insta" ? "Ajoute ton Instagram dans Mon salon" : "Ajoute ton numéro dans Mon salon"}</small></span></button>`; }).join("")}</div>
      <button class="btn" data-rc="ok" style="margin-top:16px;width:100%"${CH.some(k => c[k]) ? "" : " disabled"}>${on ? "Couper la réservation en ligne" : "Enregistrer"}</button>
      ${on ? '<button class="btn clair" data-a="fermer" style="margin-top:8px;width:100%">Laisser ouverte</button>' : ""}`);
  }
  async function enLigne() {
    if (!S.site || S.site.en_ligne !== false) return true;
    const { data, error } = await sb.from("sites").update({ en_ligne: true }).eq("pro_id", S.user.id).select("slug,en_ligne,maj,donnees").single();
    if (error) { console.error(error); dit("Oups, ça n’a pas marché. Réessaie."); return false; }
    S.site = Object.assign(S.site, data); return true;
  }
  const ecrit = r => { const b = br(); if (r) b.resaCoupee = r; else delete b.resaCoupee; localStorage.setItem("loginail-brouillon", JSON.stringify(b));
    if (S.site) { S.site.donnees = Object.assign({}, S.site.donnees); if (r) S.site.donnees.resaCoupee = r; else delete S.site.donnees.resaCoupee; } };

  /* sur window, avant app2.js : l'interrupteur ne cache plus jamais le site */
  addEventListener("click", async e => {
    const t = e.target; if (!t.closest) return;
    const sw = t.closest('[data-a="resa-sw"]'), a = t.closest("[data-rc]");
    if (!sw && !a) return;
    e.stopPropagation(); e.preventDefault();
    if (sw) {
      if (!S.site) return;
      if (!coupee()) { const c = coord(); CH = (etat() || AVANT || {}).m || ["appel", "insta"].filter(k => c[k]); if (!CH.length) CH = ["appel"]; return feuille(); }
      /* rallumer : le site revient (s'il était caché) et on reprend les réservations */
      sw.disabled = true;
      if (!(await enLigne())) { sw.disabled = false; return; }
      AVANT = etat(); ecrit(null); rendu(); return dit("Réservation en ligne ouverte ✓");
    }
    const k = a.dataset.rc;
    if (k === "moyens") { CH = (etat() || {}).m || ["appel"]; return feuille(); }
    if (k === "m") { if (a.disabled) return; const m = a.dataset.k; CH = CH.includes(m) ? CH.filter(x => x !== m) : CH.concat(m); return feuille(); }
    if (k === "ok") {
      const c = coord(), m = CH.filter(x => c[x]); if (!m.length) return;
      const avant = coupee(); a.disabled = true;
      if (!(await enLigne())) { a.disabled = false; return; }
      ecrit({ on: true, m }); ferme(); rendu();
      return dit(avant ? "C’est enregistré ✓" : "Réservation coupée · ton site reste visible");
    }
  }, true);
})();
