/* ===== 21/11 soir (Marie) — chargé EN DERNIER (après actualise.js) =====
   1 · Accueil : carte « Vérifie ton site » (prestations, horaires, adresse, acompte, le site en entier) tant qu'elle n'a pas dit « Tout est bon ».
   2 · La barre du bas : glisser le pouce à gauche / à droite = onglet voisin, avec une toute petite glissade.
   3 · Les vacances (et les créneaux bloqués) : plus de « Pas venue » ni « Déplacer le rendez-vous » → « Déplacer mes vacances », « Supprimer les vacances ? ».
   4 · La semaine qui change : le texte « Du … au … » et la journée arrivent du bon côté (le départ est dans suite.js).
   5 · Le calendrier du mois (Agenda) : des ronds sous chaque jour = ses places ; ronds pleins = déjà pris. */
(function () {
  const lit = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } };
  const ecrit = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const p2 = n => String(n).padStart(2, "0");
  const mn = t => +String(t).slice(0, 2) * 60 + +String(t).slice(3, 5);
  const hTxt = m => Math.floor(m / 60) + "h" + (m % 60 ? p2(m % 60) : "");
  const donnees = () => (S.site && S.site.donnees) || brouillon() || {};
  const horaires = () => donnees().horaires || [];
  const tous = () => { const m = new Map(); (S.tous || []).forEach(r => m.set(r.id, r)); S.rdv.forEach(r => m.set(r.id, r)); return [...m.values()]; };
  const jj = d => `${d.getDate()} ${MOIS[d.getMonth()]}`;
  const recharge = async () => { try { await chargeSemaine(); } catch (x) {} try { await chargeVisites(); } catch (x) {} };

  const st = document.createElement("style");
  st.textContent = `
#E .vt{margin-top:14px}
#E .vt-bar{height:4px;border-radius:2px;background:color-mix(in srgb,var(--v-fonce,#1E1C1B) 10%,transparent);overflow:hidden;margin:2px 0 6px}
#E .vt-bar i{display:block;height:100%;border-radius:2px;background:var(--v-acc,#1E1C1B);transition:width .45s cubic-bezier(.22,1,.36,1)}
#E .vt-n{display:block;font-size:11.5px;color:#776D64;margin-bottom:4px}
#E .vt-it{display:flex;align-items:center;gap:12px;width:100%;border:0;border-top:1px solid rgba(30,28,27,.06);background:none;padding:10px 0;font:inherit;font-size:14px;line-height:1.3;text-align:left;color:inherit;cursor:pointer;transition:transform .12s}
#E .vt-it:active{transform:scale(.98)}
#E .vt-it small{display:block;font-size:12px;color:#776D64;margin-top:1px}
#E .vt-c{flex:none;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:12px;color:transparent;box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--v-fonce,#1E1C1B) 30%,transparent);transition:background .25s,color .25s,box-shadow .25s,transform .25s}
#E .vt-it.fait .vt-c{background:var(--v-fonce,#1E1C1B);color:#fff;box-shadow:none}
#E .vt-it.fait>div{opacity:.5}
#E .vt-it.coche .vt-c{animation:vtPop .35s cubic-bezier(.34,1.56,.64,1)}
#E .vt-fl{margin-left:auto;opacity:.35;font-size:18px}
@keyframes vtPop{0%{transform:scale(.6)}100%{transform:scale(1)}}
#E .ong.o1{touch-action:none}
#E .vue.ong-d{animation:ongD .26s cubic-bezier(.22,1,.36,1)}
#E .vue.ong-g{animation:ongG .26s cubic-bezier(.22,1,.36,1)}
@keyframes ongD{from{transform:translateX(22px);opacity:.4}to{transform:none;opacity:1}}
@keyframes ongG{from{transform:translateX(-22px);opacity:.4}to{transform:none;opacity:1}}
#E .nav-sem.sa-d span,#E .pap.sa-d{animation:saD .34s cubic-bezier(.22,1,.36,1) both}
#E .nav-sem.sa-g span,#E .pap.sa-g{animation:saG .34s cubic-bezier(.22,1,.36,1) both}
#E .semaine.sa-d{animation:saD2 .34s cubic-bezier(.22,1,.36,1) both}
#E .semaine.sa-g{animation:saG2 .34s cubic-bezier(.22,1,.36,1) both}
@keyframes saD{from{transform:translateX(46px);opacity:0}to{transform:none;opacity:1}}
@keyframes saG{from{transform:translateX(-46px);opacity:0}to{transform:none;opacity:1}}
@keyframes saD2{from{transform:translateX(30%);opacity:0}to{transform:none;opacity:1}}
@keyframes saG2{from{transform:translateX(-30%);opacity:0}to{transform:none;opacity:1}}
#E .pap.sa-d,#E .pap.sa-g{animation-duration:.4s}
#E .cm-pts{display:flex;flex-wrap:wrap;justify-content:center;gap:2px;max-width:28px;margin-top:3px}
#E .cm-p{width:4px;height:4px;border-radius:50%;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--v-fonce,#1E1C1B) 45%,transparent)}
#E .cm-p.on{background:var(--v-acc,#1E1C1B);box-shadow:none}
#E .cm-j.sel .cm-p{box-shadow:inset 0 0 0 1px rgba(255,255,255,.65)}
#E .cm-j.sel .cm-p.on{background:#fff}
#E .cm-leg{display:flex;justify-content:center;gap:14px;margin-top:8px;font-size:11px;color:#776D64}
#E .cm-leg span{display:inline-flex;align-items:center;gap:5px}
#E .vc-conf{margin-top:12px}
@media (prefers-reduced-motion:reduce){#E .vue.ong-d,#E .vue.ong-g,#E .nav-sem span,#E .pap,#E .semaine{animation:none!important}}`;
  document.head.appendChild(st);

  /* ---------- 1 · « Vérifie ton site » ---------- */
  const vtCle = () => "loginail-verif-" + ((S.user && S.user.id) || "");
  const vtEtat = () => { try { return JSON.parse(lit(vtCle(), "{}")) || {}; } catch (e) { return {}; } };
  const vtFini = () => !!(S.user && S.user.user_metadata && S.user.user_metadata.verif_vue) || !!vtEtat().fin;
  const lienSite = () => { const s = S.site; if (!s || !s.slug) return ""; return ((/^https?:$/.test(location.protocol) && location.hostname !== "app.loginail.fr") ? "" : "https://loginail.fr/") + "loginail-creer/pret.html?public&appli=voir&s=" + encodeURIComponent(s.slug); };
  const VT = () => { const d = donnees(), pr = d.prestations || [], sansPrix = pr.filter(p => p.prix === "" || p.prix == null).length, h = horaires(), ouv = h.filter(x => x && x.d), h0 = ouv[0];
    const l = [["ms-presta", "Mes prestations et mes prix", pr.length ? pr.length + " prestation" + (pr.length > 1 ? "s" : "") + (sansPrix ? " · " + sansPrix + " sans prix" : "") : "À ajouter"],
      ["ms-horaires", "Mes horaires", ouv.length ? ouv.length + " jour" + (ouv.length > 1 ? "s" : "") + " ouvert" + (ouv.length > 1 ? "s" : "") + (h0 ? " · " + hTxt(mn(h0.d)) + " – " + hTxt(mn(h0.f)) : "") : "À remplir"],
      ["ms-adresse", "Mon adresse", [d.rue, d.ville].filter(Boolean).join(", ") || "À vérifier"],
      ["ms-bon", "Acompte et annulation", "Ce que tes clientes acceptent en réservant"]];
    if (lienSite()) l.push(["voir", "Mon site en entier", "Comme tes clientes le voient"]);
    return l; };
  let vtAnime = false;
  const carteVerif = () => { if (!S.user || !S.site || vtFini()) return ""; const fait = vtEtat().k || [], L = VT(), n = L.filter(x => fait.includes(x[0])).length, calme = vtAnime; vtAnime = true;
    return `<div class="v-bv vt${calme ? " calme" : ""}" role="region" aria-label="Vérifie ton site"><div class="v-bv-t">Vérifie ton <em>site</em> ✦</div>
      <p>Il s’est rempli tout seul. Tes clientes réservent avec ces infos : prends 2 minutes pour voir si tout est juste.</p>
      <div class="vt-bar"><i style="width:${Math.round(n / L.length * 100)}%"></i></div><small class="vt-n">${n} sur ${L.length} vérifié${n > 1 ? "s" : ""}</small>
      ${L.map(([k, t, s]) => `<button class="vt-it${fait.includes(k) ? " fait" : ""}" data-vt="${k}" ${k === "voir" ? `data-href="${esc(lienSite())}" data-neuf` : `data-a="${k}"`}><span class="vt-c">✓</span><div>${t}<small>${esc(s)}</small></div><span class="vt-fl">›</span></button>`).join("")}
      <button class="v-bv-ok" data-vt-fin>${n === L.length ? "Tout est bon ✓" : "Tout est bon, j’ai vérifié"}</button></div>`; };
  const acc0 = VUES.acc;
  VUES.acc = () => { const h = acc0(), c = carteVerif(); if (!c) return h;
    const f = document.createElement("div"); f.innerHTML = h; const bv = f.querySelector(".v-bv"), te = f.querySelector(".v-haut-acc .tete") || f.querySelector(".tete");
    if (bv) bv.insertAdjacentHTML("afterend", c); else if (te) te.insertAdjacentHTML("afterend", c); else f.insertAdjacentHTML("afterbegin", c);
    return f.innerHTML; };
  document.addEventListener("click", e => { const t = e.target.closest ? e.target : null; if (!t) return;
    const it = t.closest("[data-vt]"); if (it) { const et = vtEtat(), k = et.k || []; if (!k.includes(it.dataset.vt)) { k.push(it.dataset.vt); et.k = k; ecrit(vtCle(), JSON.stringify(et)); }
      it.classList.add("fait", "coche"); const c = it.closest(".vt"), tot = c.querySelectorAll(".vt-it").length, n = c.querySelectorAll(".vt-it.fait").length;
      c.querySelector(".vt-bar i").style.width = Math.round(n / tot * 100) + "%"; c.querySelector(".vt-n").textContent = `${n} sur ${tot} vérifié${n > 1 ? "s" : ""}`; if (n === tot) c.querySelector("[data-vt-fin]").textContent = "Tout est bon ✓";
      return; /* on laisse passer le toucher : la fiche (prestations, horaires…) s'ouvre comme d'habitude */ }
    const fin = t.closest("[data-vt-fin]"); if (!fin) return; e.stopPropagation(); e.preventDefault();
    const et = vtEtat(); et.fin = true; ecrit(vtCle(), JSON.stringify(et));
    if (S.user) { S.user.user_metadata = Object.assign({}, S.user.user_metadata, { verif_vue: true }); try { if (sb.auth && sb.auth.updateUser) sb.auth.updateUser({ data: { verif_vue: true } }).catch(() => {}); } catch (x) {} }
    const c = fin.closest(".vt"); if (!c) return; c.style.maxHeight = c.offsetHeight + "px"; c.offsetHeight; c.classList.add("parti"); setTimeout(() => c.remove(), 450); dit("Parfait ✓ Tu peux tout changer plus tard dans Mon site"); }, true);

  /* ---------- 2 · glisser le pouce sur la barre du bas ---------- */
  let nx = null, ny = 0, nt = 0, nBouge = false;
  const vueOn = () => E.querySelector(".vue.on");
  E.addEventListener("touchstart", e => { const o = e.target.closest && e.target.closest(".ong.o1"); nx = o && e.touches.length === 1 && !E.classList.contains("fe") ? e.touches[0].clientX : null; if (nx == null) return; ny = e.touches[0].clientY; nt = Date.now(); nBouge = false; }, { passive: true });
  E.addEventListener("touchmove", e => { if (nx == null) return; const dx = e.touches[0].clientX - nx, dy = e.touches[0].clientY - ny;
    if (!nBouge) { if (Math.abs(dx) < 8) return; if (Math.abs(dy) > Math.abs(dx)) { nx = null; return; } nBouge = true; }
    if (e.cancelable) e.preventDefault();
    const i = ONG.findIndex(o => o[0] === S.onglet), bout = (dx > 0 && i <= 0) || (dx < 0 && i >= ONG.length - 1), v = vueOn();
    if (v) { v.style.transition = "none"; v.style.transform = `translateX(${Math.max(-24, Math.min(24, dx * (bout ? .05 : .14)))}px)`; } }, { passive: false });
  const nFin = e => { if (nx == null) return; const bouge = nBouge, dx = e.changedTouches[0].clientX - nx, dt = Date.now() - nt; nx = null; nBouge = false; if (!bouge) return; window.__ongAvale = Date.now();
    const v = vueOn(), i = ONG.findIndex(o => o[0] === S.onglet), d = dx < 0 ? 1 : -1, j = i + d;
    const ok = e.type !== "touchcancel" && (Math.abs(dx) > 40 || (Math.abs(dx) > 16 && dt < 250)) && j >= 0 && j < ONG.length;
    if (!ok) { if (v) { v.style.transition = "transform .3s cubic-bezier(.22,1,.36,1)"; v.style.transform = ""; setTimeout(() => { v.style.transition = ""; }, 320); } return; }
    if (v) { v.style.transition = ""; v.style.transform = ""; }
    const b = E.querySelector(`.ong [data-go="${ONG[j][0]}"]`); if (b) b.click();
    const n = vueOn(); if (n) { n.classList.remove("ong-d", "ong-g"); void n.offsetWidth; n.classList.add(d > 0 ? "ong-d" : "ong-g"); setTimeout(() => n.classList.remove("ong-d", "ong-g"), 320); } };
  E.addEventListener("touchend", nFin, { passive: true }); E.addEventListener("touchcancel", nFin, { passive: true });
  /* le doigt a glissé sur la barre : on n'ouvre pas en plus l'onglet où il s'est posé */
  document.addEventListener("click", e => { if (e.isTrusted && Date.now() - (window.__ongAvale || 0) < 450 && e.target.closest && e.target.closest(".ong")) { e.stopPropagation(); e.preventDefault(); } }, true);

  /* ---------- 3 · les vacances et les créneaux bloqués ---------- */
  const MOTS = { "Vacances": ["mes vacances", "les vacances"], "Jour off": ["mon jour off", "le jour off"], "Formation": ["ma formation", "la formation"] };
  const motsDe = r => { const raison = String(r.titre || "").replace(/^Fermé · /, "") || "Fermé", m = MOTS[raison] || ["ces jours fermés", "ces jours fermés"]; return { raison, mon: m[0], le: m[1] }; };
  const estFerme = r => /^Fermé/.test(r.titre || "");
  const jour0 = x => { const d = new Date(x.debut); d.setHours(0, 0, 0, 0); return +d; };
  const groupe = r => { if (!estFerme(r)) return [r];
    const L = tous().filter(x => !x.cliente_id && x.titre === r.titre && x.statut !== "annule").sort((a, b) => a.debut.localeCompare(b.debut)), i = L.findIndex(x => x.id === r.id); if (i < 0) return [r];
    let a = i, b = i; while (a > 0 && jour0(L[a]) - jour0(L[a - 1]) <= 864e5 * 1.5) a--; while (b < L.length - 1 && jour0(L[b + 1]) - jour0(L[b]) <= 864e5 * 1.5) b++; return L.slice(a, b + 1); };
  const periodeTxt = G => { const a = new Date(G[0].debut), b = new Date(G[G.length - 1].debut); return G.length > 1 ? `Du ${a.getMonth() === b.getMonth() ? a.getDate() : jj(a)} au ${jj(b)}` : `Le ${JOURS[(a.getDay() + 6) % 7].toLowerCase()} ${jj(a)}`; };
  const iso = d => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
  let VC = null;
  const feuilleBloc = r => { VC = { r, G: groupe(r) };
    if (estFerme(r)) { const m = motsDe(r), G = VC.G, d = new Date(r.debut);
      return ouvre(`<h3>${esc(m.raison)}</h3><div class="sous">${periodeTxt(G)} · ton salon est fermé, personne ne peut réserver</div>
        <button class="btn clair" data-vc="deplacer" style="margin-top:16px">Déplacer ${m.mon}</button>
        <button class="btn" data-vc="suppr" style="margin-top:8px">Supprimer ${m.le}</button>
        ${G.length > 1 ? `<button class="lien-t" data-vc="un">Rouvrir seulement le ${JOURS[(d.getDay() + 6) % 7].toLowerCase()} ${jj(d)}</button>` : ""}<div class="vc-z"></div>`); }
    const a = new Date(r.debut), b = new Date(r.fin);
    ouvre(`<h3>Créneau bloqué</h3><div class="sous">${JOURS[(a.getDay() + 6) % 7]} ${jj(a)} · ${hm(a)} – ${hm(b)}${r.titre && r.titre !== "Bloqué" ? " · " + esc(r.titre) : ""}</div>
      <button class="btn clair" data-a="decaler" data-id="${r.id}" style="margin-top:16px">Déplacer ce créneau</button>
      <button class="btn" data-vc="suppr" style="margin-top:8px">Débloquer ce créneau</button><div class="vc-z"></div>`); };
  const confirme = (titre, sous, oui) => { const z = E.querySelector(".fc .vc-z"); if (!z) return;
    z.innerHTML = `<div class="an-conf vc-conf"><b>${titre}</b><span>${sous}</span><div class="an-bts"><button class="an-non" data-vc="non">Non</button><button class="an-oui" data-vc="${oui}">Oui, supprimer</button></div></div>`;
    z.scrollIntoView({ block: "nearest", behavior: "smooth" }); };
  const feuilleDeplacer = () => { const G = VC.G, m = motsDe(VC.r), a = new Date(G[0].debut), b = new Date(G[G.length - 1].debut);
    ouvre(`<h3>Déplacer ${m.mon}</h3><div class="sous">Choisis tes nouvelles dates. Les anciennes redeviennent libres.</div>
      <div class="lab2">Du</div><input class="champ su-champ" id="vc-du" type="date" value="${iso(a)}"><div class="lab2">Au</div><input class="champ su-champ" id="vc-au" type="date" value="${iso(b)}">
      <button class="btn" data-vc="dep-ok" style="margin-top:16px">Déplacer ${m.mon}</button>`); };
  document.addEventListener("click", async e => { const t = e.target.closest ? e.target : null; if (!t) return;
    /* toucher un bloc fermé / bloqué (agenda, accueil) : la fiche des vacances, pas celle d'un rendez-vous */
    const el = t.closest("[data-rdv]"); if (el && !t.closest(".fc")) { const r = tous().find(x => x.id === el.dataset.rdv); if (r && !r.cliente_id) { e.stopPropagation(); e.preventDefault(); feuilleBloc(r); return; } }
    const dc = t.closest('.fc [data-a="decaler"]'); if (dc && VC && VC.r.id === dc.dataset.id) setTimeout(() => { const h = E.querySelector(".fc h3"); if (h && /rendez-vous/.test(h.textContent)) h.textContent = "Déplacer ce créneau"; }, 30);
    const a = t.closest("[data-vc]"); if (!a || !VC) return; e.stopPropagation(); e.preventDefault(); const k = a.dataset.vc, m = motsDe(VC.r), G = VC.G;
    if (k === "non") { const z = E.querySelector(".fc .vc-z"); if (z) z.innerHTML = ""; return; }
    if (k === "deplacer") return feuilleDeplacer();
    if (k === "suppr") return estFerme(VC.r) ? confirme(`Supprimer ${m.le} ?`, `${periodeTxt(G)} : ces jours redeviennent ouverts, tes clientes pourront réserver.`, "suppr-ok") : confirme("Débloquer ce créneau ?", "Tes clientes pourront de nouveau réserver à cette heure-là.", "suppr-ok");
    if (k === "un") return confirme(`Rouvrir ce jour-là ?`, `Le reste de ${m.mon.replace(/^(mes|mon|ma) /, s => ({ "mes ": "tes ", "mon ": "ton ", "ma ": "ta " })[s])} ne bouge pas.`, "un-ok");
    if (k === "suppr-ok" || k === "un-ok") { const ids = k === "un-ok" ? [VC.r.id] : G.map(x => x.id); a.disabled = true;
      const { error } = await sb.from("rendez_vous").delete().in("id", ids); if (error) { a.disabled = false; return dit("Oups, ça n’a pas marché. Réessaie."); }
      if (S.tous) S.tous = S.tous.filter(x => !ids.includes(x.id)); await recharge(); ferme(); rendu();
      return dit(k === "un-ok" ? "Jour rouvert ✓" : estFerme(VC.r) ? (m.raison === "Vacances" ? "Vacances supprimées ✓" : "C’est rouvert ✓") : "Créneau débloqué ✓"); }
    if (k === "dep-ok") { const d = E.querySelector("#vc-du").value, f = E.querySelector("#vc-au").value; if (!d || !f || f < d) return dit("Vérifie les deux dates");
      const n = Math.round((new Date(f) - new Date(d)) / 864e5) + 1; if (n > 60) return dit("60 jours au maximum");
      const jours = []; for (let i = 0; i < n; i++) { const x = new Date(d + "T00:00:00"); x.setDate(x.getDate() + i); const y = new Date(x); y.setHours(23, 59, 0, 0); jours.push({ cliente_id: null, prestation_id: null, titre: VC.r.titre, debut: x.toISOString(), fin: y.toISOString(), prix: null }); }
      const pris = jours.filter(x => tous().some(r => r.cliente_id && r.statut !== "annule" && memeJour(new Date(r.debut), new Date(x.debut)))).length;
      if (pris) return dit(pris > 1 ? "Il y a déjà des rendez-vous ces jours-là : déplace-les d’abord" : "Il y a déjà un rendez-vous ce jour-là : déplace-le d’abord");
      a.disabled = true; const { error } = await sb.from("rendez_vous").insert(jours); if (error) { a.disabled = false; return dit("Oups, ça n’a pas marché. Réessaie."); }
      const ids = G.map(x => x.id); await sb.from("rendez_vous").delete().in("id", ids); if (S.tous) S.tous = S.tous.filter(x => !ids.includes(x.id));
      await recharge(); ferme(); rendu(); dit(m.raison === "Vacances" ? "Vacances déplacées ✓" : "C’est déplacé ✓"); } }, true);

  /* ---------- 4 · la nouvelle semaine arrive du bon côté (glisser, ou flèches ‹ ›) ---------- */
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest('.vue.on .nav-sem [data-a="sem"]'); if (b) window.__semArr = { t: Date.now(), d: +b.dataset.n > 0 ? 1 : -1, fleche: true }; }, true);
  const ag0 = VUES.ag;
  VUES.ag = () => { let h = ag0(); const a = window.__semArr; if (!a || Date.now() - a.t > 1500) return h; window.__semArr = null; const c = a.d > 0 ? "sa-d" : "sa-g";
    h = h.replace('class="nav-sem"', `class="nav-sem ${c}"`).replace(/class="pap/, `class="${c} pap`);
    if (a.fleche) h = h.replace('class="semaine"', `class="semaine ${c}"`);
    return h; };

  /* ---------- 5 · les ronds du calendrier : une place = un rond, plein = déjà pris ---------- */
  /* la durée HABITUELLE de ses prestations (la médiane) : avec la plus courte, une journée faisait 18 ronds vides */
  const dureeMin = () => { const l = prestasDispo().map(p => +p.duree).filter(x => x > 0).sort((a, b) => a - b); return Math.max(30, l.length ? l[Math.floor(l.length / 2)] : 60); };
  const places = (d, R) => { const h = horaires()[(d.getDay() + 6) % 7], d0 = new Date(d); d0.setHours(0, 0, 0, 0);
    const du = R.filter(r => r.statut !== "annule" && new Date(r.debut) < plusJours(d0, 1) && new Date(r.fin) > d0), pris = du.filter(r => r.cliente_id && memeJour(new Date(r.debut), d0)).length;
    if (!h || !h.d || !h.f) return { pris, libres: 0 };
    const debut = mn(h.d), finJ = mn(h.f), pd = h.pd ? mn(h.pd) : null, pf = h.pf ? mn(h.pf) : null, occ = du.map(r => [(new Date(r.debut) - d0) / 6e4, (new Date(r.fin) - d0) / 6e4, !r.cliente_id]);
    if (occ.some(z => z[2] && z[0] <= debut && z[1] >= finJ)) return { pris: 0, libres: 0 };   /* congés */
    const now = new Date(), auj = memeJour(d0, now), passe = d0 < new Date(now.getFullYear(), now.getMonth(), now.getDate()), D = dureeMin(), pas = Math.ceil(D / 30) * 30, deja = auj ? now.getHours() * 60 + now.getMinutes() : -1;
    let libres = 0, der = -1e9;
    if (!passe) for (let t = debut; t + D <= finJ; t += 30) { if (pd != null && pf != null && t < pf && t + D > pd) continue; if (t < deja) continue; if (occ.some(z => t < z[1] && t + D > z[0])) continue; if (t < der + pas) continue; libres++; der = t; }
    return { pris, libres }; };
  if (typeof calMois === "function") { const cal0 = calMois;
    calMois = function () { const h = cal0(), R = tous();
      const out = h.replace(/<button data-a="mois-j" data-d="([^"]+)" style="([^"]*)">(\d+)(?:<i[^>]*>auj\.<\/i>)?<\/button>/g, (m, d, sty, n) => { const p = places(new Date(d), R); let tot = p.pris + p.libres, on = p.pris;
        if (tot > 10) { on = Math.round(on / tot * 10); tot = 10; }
        const sel = /background:#1E1C1B/.test(sty), s2 = sty.replace(/display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1\.05/, "") + ";display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1";
        return `<button data-a="mois-j" data-d="${d}" class="cm-j${sel ? " sel" : ""}" style="${s2.replace("justify-content:center;line-height:1", "justify-content:flex-start;padding-top:9px;line-height:1")}">${n}<span class="cm-pts" aria-hidden="true">${Array.from({ length: tot }, (_, i) => `<i class="cm-p${i < on ? " on" : ""}"></i>`).join("")}</span></button>`; });
      return out.replace(/<\/div><\/div>\s*$/, `</div><div class="cm-leg"><span><i class="cm-p on"></i>pris</span><span><i class="cm-p"></i>libre</span></div></div>`); }; }
})();

/* ===== 22/11 (Marie, iPhone, fiche cliente) =====
   6 · les numéros toujours écrits « 06 12 34 56 78 » (à l'écran ; et la case Téléphone se range toute seule quand on la quitte)
   7 · Notes : écriture un peu plus grande, lignes plus aérées ; « Sa vie » : 6 questions puis « Voir les autres questions »
   8 · Oui / Non : une petite animation quand on choisit */
(function () {
  const joli = t => { const s = String(t).trim(), d = s.replace(/[\s.\-]/g, "");
    if (/^0\d{9}$/.test(d)) return d.replace(/(\d\d)(?=\d)/g, "$1 ");
    if (/^\+33\d{9}$/.test(d)) return "+33 " + d.slice(3, 4) + " " + d.slice(4).replace(/(\d\d)(?=\d)/g, "$1 ");
    return null; };
  const range = racine => { const w = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const v = n.nodeValue; if (v.length < 10 || v.length > 20 || !/\d{4}/.test(v)) continue; const j = joli(v); if (j && j !== v.trim()) n.nodeValue = v.replace(v.trim(), j); } };
  let rf = 0; new MutationObserver(() => { if (rf) return; rf = requestAnimationFrame(() => { rf = 0; range(E); }); }).observe(E, { childList: true, subtree: true, characterData: false });
  document.addEventListener("blur", e => { const i = e.target; if (i && i.tagName === "INPUT" && (i.type === "tel" || i.inputMode === "tel")) { const j = joli(i.value); if (j) i.value = j; } }, true);

  const st = document.createElement("style");
  st.textContent = `#E .fi-n .fi-lg{padding:9px 0;min-height:44px}
#E .fi-n .fi-qq{font-size:15.5px}#E .fi-n .fi-qq span{font-size:13px}
#E .fi-n .fi-k{font-size:13px;margin:20px 0 8px}
#E .fi-on button{font-size:13.5px;padding:7px 14px}
#E .fi-on button.fi-pop,#E .fi-ch button.fi-pop{animation:fiPop .34s cubic-bezier(.34,1.56,.64,1)}
#E .fi-lg.fi-pop .fi-ic2{animation:fiIc .4s ease}
@keyframes fiPop{0%{transform:scale(.78);opacity:.55}100%{transform:none;opacity:1}}
@keyframes fiIc{0%{transform:none}40%{transform:scale(1.18) rotate(-6deg)}100%{transform:none}}
#E .fi-plus{display:block;width:100%;border:0;background:none;padding:12px 0 4px;font:inherit;font-size:13.5px;color:#6B625C;text-decoration:underline;text-underline-offset:3px}
#E .fi-cache{display:none!important}
@media (prefers-reduced-motion:reduce){#E .fi-pop,#E .fi-pop .fi-ic2{animation:none!important}}`;
  document.head.appendChild(st);
  let DER = null, TOUT = false;
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest('[data-fi="rep"]'); if (b) { DER = { q: b.dataset.q, r: b.dataset.r, t: Date.now() };
      /* la fiche change la case sur place OU redessine tout : on cherche le bouton choisi pendant un court instant */
      const d = DER; let n = 0; const cherche = () => { const x = document.querySelector(`[data-fi="rep"][data-q="${CSS.escape(d.q)}"][data-r="${CSS.escape(d.r)}"]`);
        /* la fiche peut se redessiner 2 fois de suite : chaque nouveau bouton choisi reçoit l'animation (une seule fois) */
        if (x && !x.dataset.pop && (x.classList.contains("oui") || x.classList.contains("non"))) { x.dataset.pop = "1"; x.classList.add("fi-pop"); const lg = x.closest(".fi-lg"); if (lg) lg.classList.add("fi-pop"); }
        if (++n < 45) requestAnimationFrame(cherche); else DER = null; }; requestAnimationFrame(cherche); }
    const pl = e.target.closest && e.target.closest(".fi-plus"); if (pl) { e.stopPropagation(); e.preventDefault(); TOUT = true; pl.closest(".fi-carte").querySelectorAll(".fi-cache").forEach(x => x.classList.remove("fi-cache")); pl.remove(); } }, true);
  new MutationObserver(() => { const n = E.querySelector(".fc .fi-n"); if (!n || n.dataset.g2211) return; n.dataset.g2211 = "1";
    /* « Sa vie » : 6 questions, les autres derrière un lien (une question déjà répondue reste toujours visible) */
    const k = [...n.querySelectorAll(".fi-k")].find(x => /Sa vie/.test(x.textContent)), c = k && k.nextElementSibling;
    if (c && !TOUT) { const l = [...c.querySelectorAll(":scope>.fi-lg")], rep = x => !!x.querySelector(".oui,.non,.fi-qq span"), cach = l.slice(6).filter(x => !rep(x));
      if (cach.length) { cach.forEach(x => x.classList.add("fi-cache")); c.insertAdjacentHTML("beforeend", `<button class="fi-plus">Voir ${cach.length > 1 ? "les " + cach.length + " autres questions" : "l’autre question"}</button>`); } }
    if (DER && Date.now() - DER.t < 2000) { const b = n.querySelector(`[data-fi="rep"][data-q="${CSS.escape(DER.q)}"][data-r="${CSS.escape(DER.r)}"]`); if (b && (b.classList.contains("oui") || b.classList.contains("non"))) { b.classList.add("fi-pop"); const lg = b.closest(".fi-lg"); if (lg) lg.classList.add("fi-pop"); } DER = null; }
  }).observe(E, { childList: true, subtree: true });
})();
