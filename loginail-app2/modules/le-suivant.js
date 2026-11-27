/* ===== 27/11 (Marie, version A de maquettes/reprendre-rdv-2711) : « Le suivant » sur la fiche cliente =====
   Sous « Prendre un rendez-vous », quand elle a déjà un rendez-vous prévu : un bouton rose qui montre DÉJÀ le rendez-vous d'après
   (« Le suivant : mar. 12 janv. · 9h30 »), calculé sur SON rythme (2, 3, 4 semaines… d'après ses visites ; 3 semaines si on ne sait pas encore),
   à la même heure, seulement si c'est libre (horaires du site, pause, congés, jours fériés, autres rendez-vous).
   Un toucher ouvre le choix : 2 / 3 / 4 / 5 semaines et 3 créneaux libres, « Noter » l'enregistre tout de suite
   (même prestation, même durée, même prix que son dernier rendez-vous prévu, comme « Son prochain rendez-vous ? » de suite.js).
   Pour tous les salons, les 3 styles. Rien à changer sur le serveur. Branché dans fiche.js par window.__suivantFiche(c, RDV). */
(function () {
  const st = document.createElement("style");
  st.textContent = `
.sv-b{width:100%;margin-top:8px;border:0;border-radius:22px;background:var(--v-rose,#F5E6E4);color:#1E1C1B;font:inherit;text-align:left;padding:11px 14px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:transform .12s}
.sv-b:active{transform:scale(.97)}
.sv-ic{flex:none;width:38px;height:38px;border-radius:50%;background:#fff;color:var(--v-acc,#B5475E);display:grid;place-items:center}
.sv-ic svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.sv-b>span:nth-child(2){flex:1;min-width:0}
.sv-b b{display:block;font-size:15px;font-weight:500;line-height:1.25}
.sv-b small{display:block;font-size:12.5px;color:var(--v-acc,#B5475E);margin-top:2px;line-height:1.3}
.sv-fl{flex:none;font-size:18px;color:#8A847E;transition:transform .24s cubic-bezier(.2,.8,.2,1)}.sv-b.on .sv-fl{transform:rotate(90deg)}
.sv-o{display:grid;grid-template-rows:0fr;transition:grid-template-rows .24s cubic-bezier(.2,.8,.2,1)}.sv-o>div{overflow:hidden}.sv-o.on{grid-template-rows:1fr}
.sv-p{background:#fff;border-radius:20px;padding:14px 14px 6px;margin-top:8px;text-align:left}
.sv-q{font-size:12.5px;color:#8A847E;margin:0 0 12px}
.sv-pu{display:flex;gap:6px}.sv-pu button{flex:1;min-width:0;border:0;border-radius:999px;padding:9px 0;background:#F3EEE8;color:#1E1C1B;font:inherit;font-size:13px;cursor:pointer;position:relative;transition:background .15s,color .15s}
.sv-pu button.on{background:#1E1C1B;color:#fff}
.sv-pu button i{position:absolute;left:50%;top:-9px;transform:translateX(-50%);font-style:normal;font-size:8.5px;letter-spacing:.06em;text-transform:uppercase;background:var(--v-acc,#B5475E);color:#fff;border-radius:6px;padding:1px 5px;white-space:nowrap}
.sv-l{display:flex;align-items:center;gap:10px;padding:11px 2px}.sv-l+.sv-l{border-top:1px solid rgba(30,28,27,.08)}
.sv-l>div{flex:1;min-width:0;font-size:14.5px}.sv-l>div span{display:block;font-size:12.5px;color:#8A847E;margin-top:1px}.sv-l>div span.v{color:var(--v-acc,#B5475E)}
.sv-l button{flex:none;border:0;border-radius:999px;padding:9px 16px;background:#1E1C1B;color:#fff;font:inherit;font-size:13px;cursor:pointer;transition:transform .12s,opacity .15s}
.sv-l button:active{transform:scale(.95)}.sv-l button:disabled{opacity:.5}
@media (prefers-reduced-motion:reduce){.sv-o,.sv-b,.sv-fl,.sv-l button{transition:none}}`;
  document.head.appendChild(st);

  const IC = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12a7 7 0 1 1-2.05-4.95M19 4.5V8h-3.5"/></svg>';
  const J3 = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], M3 = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const JL = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const p2 = n => String(n).padStart(2, "0"), hh = d => d.getHours() + "h" + p2(d.getMinutes());
  const court = d => `${J3[d.getDay()]} ${d.getDate() === 1 ? "1er" : d.getDate()} ${M3[d.getMonth()]}`;
  const jourPlus = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const memeJ = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  /* ses horaires (ceux de son site, comme suite.js) : null = fermé ce jour-là ; [début, fin, début pause, fin pause] en minutes */
  const brou = () => { try { return JSON.parse(localStorage.getItem("loginail-brouillon")) || {}; } catch (e) { return {}; } };
  const ouvert = d => { const h = (brou().horaires || [])[(d.getDay() + 6) % 7], m = t => +t.slice(0, 2) * 60 + +t.slice(3, 5);
    return h === null ? null : h && h.d && h.f ? [m(h.d), m(h.f)].concat(h.pd && h.pf ? [m(h.pd), m(h.pf)] : []) : [9 * 60, 18 * 60]; };
  const tousRdv = () => { const m = new Map(); (S.tous || []).concat(S.rdv || []).forEach(r => m.set(r.id, r)); return [...m.values()].filter(r => r.statut !== "annule"); };
  const libre = (deb, fin) => !tousRdv().some(r => new Date(r.debut) < fin && new Date(r.fin) > deb);

  /* son rythme en semaines : l'écart du milieu entre ses 4 derniers rendez-vous (venue ou prévue), 3 si on ne sait pas encore */
  function rythme(rdvs) { const l = (rdvs || []).filter(r => r.statut !== "annule" && r.statut !== "absente").map(r => new Date(r.debut)).sort((a, b) => a - b);
    const ec = l.slice(1).map((d, i) => Math.round((d - l[i]) / 864e5)).filter(j => j >= 5).slice(-4).sort((a, b) => a - b);
    if (!ec.length) return { sem: 3, sur: false };
    return { sem: Math.max(1, Math.min(8, Math.round(ec[Math.floor(ec.length / 2)] / 7))), sur: true }; }

  /* jusqu'à 3 créneaux libres : le même jour de la semaine à la même heure d'abord, puis d'autres heures ce jour-là, puis les jours d'après */
  function creneaux(base, sem) { const d0 = new Date(base.debut), dur = new Date(base.fin) - d0, mn = d0.getHours() * 60 + d0.getMinutes(), out = [];
    for (let j = 0; j < 7 && out.length < 3; j++) { const jour = jourPlus(d0, sem * 7 + j), o = ouvert(jour); if (!o) continue;
      if (window.jourFerie && window.jourFerie(jour)) continue;
      const essais = [mn, mn - 30, mn + 30, mn - 60, mn + 60, mn - 120, mn + 120, o[0]];
      for (const m of essais) { if (out.length >= 3) break; const f = m + dur / 60000;
        if (m < o[0] || f > o[1]) continue; if (o[2] != null && m < o[3] && f > o[2]) continue;   /* pas sur sa pause */
        const deb = new Date(jour); deb.setHours(0, m, 0, 0); const fin = new Date(+deb + dur);
        if (libre(deb, fin) && !out.some(x => +x === +deb)) out.push(deb); } }
    return out; }

  let ETAT = { id: null, ouvert: false, sem: null }, BASE = null, RY = null;
  function bloc(c, rdvs) {
    const now = new Date().toISOString(), proch = (rdvs || []).filter(r => r.statut === "prevu" && r.fin >= now).sort((a, b) => a.debut.localeCompare(b.debut));
    if (!proch.length) return "";
    if (ETAT.id !== c.id) ETAT = { id: c.id, ouvert: false, sem: null };
    BASE = proch[proch.length - 1]; RY = rythme(rdvs);   /* on compte depuis son DERNIER rendez-vous prévu */
    const sem = ETAT.sem || RY.sem, d0 = new Date(BASE.debut), cs = creneaux(BASE, sem), c1 = cs[0];
    const pareil = x => x.getDay() === d0.getDay() && x.getHours() === d0.getHours() && x.getMinutes() === d0.getMinutes();
    const pourquoi = x => { if (pareil(x)) return ""; const ideal = jourPlus(d0, sem * 7); return memeJ(x, ideal) ? `${hh(d0)} est déjà pris` : `le ${JL[d0.getDay()]} est complet`; };
    const sous = `${sem} semaine${sem > 1 ? "s" : ""} après le ${d0.getDate() === 1 ? "1er" : d0.getDate()} ${M3[d0.getMonth()]}${sem === RY.sem && RY.sur ? " · son rythme" : ""}`;
    const titre = c1 ? `Le suivant : ${court(c1)} · ${hh(c1)}` : `Le suivant dans ${sem} semaine${sem > 1 ? "s" : ""}`;
    const s2 = c1 ? (pourquoi(c1) ? " · " + pourquoi(c1) : "") : " · rien de libre, touche pour changer";
    const ch = [...new Set([2, 3, 4, 5, RY.sem, sem])].sort((a, b) => a - b).slice(0, 6);
    return `<div id="sv-bloc"><button class="sv-b${ETAT.ouvert ? " on" : ""}" data-sv="ouvre" aria-expanded="${ETAT.ouvert}"><span class="sv-ic">${IC}</span><span><b>${titre}</b><small>${sous}${s2}</small></span><span class="sv-fl">›</span></button>
      <div class="sv-o${ETAT.ouvert ? " on" : ""}"><div><div class="sv-p"><p class="sv-q">Dans combien de semaines ?</p>
        <div class="sv-pu">${ch.map(n => `<button data-sv="sem" data-n="${n}" class="${n === sem ? "on" : ""}">${n} sem.${n === RY.sem && RY.sur ? "<i>son rythme</i>" : ""}</button>`).join("")}</div>
        <div style="margin-top:6px">${cs.length ? cs.map(x => { const p = pourquoi(x); return `<div class="sv-l"><div>${court(x)} à ${hh(x)}<span class="${p ? "" : "v"}">${p || "même jour, même heure"}</span></div><button data-sv="note" data-d="${x.toISOString()}">Noter</button></div>`; }).join("")
          : `<div class="sv-l"><div>Rien de libre cette semaine-là<span>Choisis une autre semaine, ou « Prendre un rendez-vous ».</span></div></div>`}</div></div></div></div></div>`; }
  window.__suivantFiche = (c, rdvs) => { try { return bloc(c, rdvs); } catch (e) { console.error(e); return ""; } };

  /* redessine seulement le bloc (la fiche ne bouge pas) ; le rideau s'ouvre ou se ferme en douceur */
  let RDVS = null;
  const redessine = () => { const z = document.getElementById("sv-bloc"), c = S.clientes.find(x => x.id === ETAT.id); if (!z || !c || !RDVS) return;
    const t = document.createElement("div"); t.innerHTML = bloc(c, RDVS); const n = t.firstElementChild; if (!n) return;
    const o = z.querySelector(".sv-o"), on = ETAT.ouvert;
    if (o && o.classList.contains("on") !== on) { n.querySelector(".sv-o").classList.toggle("on", !on); n.querySelector(".sv-b").classList.toggle("on", !on); z.replaceWith(n);
      requestAnimationFrame(() => { n.querySelector(".sv-o").classList.toggle("on", on); n.querySelector(".sv-b").classList.toggle("on", on); }); }
    else z.replaceWith(n); };
  const w0 = window.__suivantFiche; window.__suivantFiche = (c, rdvs) => { RDVS = rdvs; return w0(c, rdvs); };

  document.addEventListener("click", async e => { const a = e.target.closest && e.target.closest("[data-sv]"); if (!a) return; e.stopPropagation(); const k = a.dataset.sv;
    if (k === "ouvre") { ETAT.ouvert = !ETAT.ouvert; redessine(); }
    else if (k === "sem") { ETAT.sem = +a.dataset.n; redessine(); }
    else if (k === "note" && BASE) { const r = BASE, deb = new Date(a.dataset.d), fin = new Date(+deb + (new Date(r.fin) - new Date(r.debut))), id = ETAT.id;
      E.querySelectorAll('[data-sv="note"]').forEach(b => b.disabled = true); a.textContent = "…";
      /* on revérifie au dernier moment (une réservation en ligne a pu arriver entre-temps) */
      const { data: g } = await sb.from("rendez_vous").select("id").neq("statut", "annule").lt("debut", fin.toISOString()).gt("fin", deb.toISOString()).limit(1);
      if (g && g.length) { dit("Ce créneau vient d’être pris : choisis-en un autre"); if (window.chargeVisites) await chargeVisites(); return redessine(); }
      const { error } = await sb.from("rendez_vous").insert({ cliente_id: r.cliente_id, prestation_id: r.prestation_id || null, titre: r.titre || null, debut: deb.toISOString(), fin: fin.toISOString(), prix: r.prix ?? null });
      if (error) { E.querySelectorAll('[data-sv="note"]').forEach(b => b.disabled = false); a.textContent = "Noter"; return dit("Oups, ça n’a pas marché. Réessaie."); }
      ETAT = { id: null, ouvert: false, sem: null };
      try { await chargeSemaine(); await chargeVisites(); } catch (x) {}
      if (E.classList.contains("fe") && window.__ficheId && window.__ficheId() === id) feuilleCliente(id);   /* la fiche se recharge : « Et aussi : … » */
      rendu(); dit(`Rendez-vous noté ✓ · ${court(deb)} à ${hh(deb)}`); }
  }, true);
})();
