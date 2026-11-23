/* ===== 22/11 (Marie, points 2 à 6 de ses retours, docs/RETOURS-APPLI-2211.md) =====
   2 · durées : « 3 h et + », puis − / + par 15 minutes
   3 · Réglages : « Mes horaires » (le même écran que Mon site), et juste dessous « agenda = horaires ? »
   4 · sinon, ses heures d'agenda à elle (retenues sur ce téléphone, comme le réglage) : le site ne change pas
   5 + 6 · Nouveau rendez-vous : 3 prestations par ligne sur 2 lignes, celles que la cliente fait d'habitude en premier
   Le point 7 (Bloquer) est dans suite.js. */
(function () {
  const st = document.createElement("style");
  st.textContent = `#E .du-plus{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px;padding:5px;border-radius:18px;background:#fff;animation:du-plus .18s ease-out both}
#E .du-plus[hidden]{display:none}
#E .du-plus{margin-top:6px!important;padding:4px 6px 4px 12px!important;background:var(--v-rose,#F5E6E4);border-radius:14px;font-size:13px}
#E .du-plus>span{flex:1;color:#5d4a4d}
#E .du-plus select{height:32px;min-width:58px;padding:0 6px;border:1.5px solid var(--v-fonce,#1E1C1B);border-radius:10px;background:#fff;color:inherit;font:inherit;font-size:16px;text-align:center;text-align-last:center;-webkit-appearance:none;appearance:none;cursor:pointer}
#E .fc .chips.ch-dur .chip.du-long:not(.on){font-size:19px!important;border-style:dashed!important;color:#8a2f50}
@keyframes du-plus{from{opacity:0;transform:translateY(-4px)}}
#E .ag-h{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;cursor:default}
#E .ag-h .t{flex:1 1 130px;min-width:0}
#E .ag-h .ag-sel{display:flex;align-items:center;gap:6px;padding:8px 0}
#E .ag-h select{height:44px;min-width:64px;padding:0 8px;border:1px solid rgba(30,28,27,.14);border-radius:14px;background:#fff;color:inherit;font:inherit;font-size:16px;text-align:center;text-align-last:center;-webkit-appearance:none;appearance:none;cursor:pointer}
#E .fc .chips.n-glisse.n-six{display:grid!important;grid-template-columns:none!important;grid-template-rows:repeat(var(--rangs,2),minmax(64px,auto));grid-auto-columns:calc((100% - 14px)/3);gap:7px;scroll-snap-type:x mandatory;-webkit-mask:none;mask:none}
#E .fc .chips.n-glisse.n-six.n-suite{-webkit-mask:linear-gradient(90deg,#000 calc(100% - 18px),transparent);mask:linear-gradient(90deg,#000 calc(100% - 18px),transparent)}
#E .fc .chips.n-glisse.n-six .chip{width:100%!important;min-width:0;max-width:none;height:100%;min-height:64px;padding:8px 9px;scroll-snap-align:none;font-size:13px;line-height:1.15;overflow-wrap:break-word}
#E .fc .chips.n-glisse.n-six .chip.n-bord{scroll-snap-align:start}
#E .fc .chips.n-glisse.n-six .chip.n-long{font-size:11.5px}
#E .fc .chips.n-glisse.n-six.n-bouge .chip{animation:n-six .18s ease-out both}
@keyframes n-six{from{opacity:.2;transform:translateX(6px)}}
@media (prefers-reduced-motion:reduce){#E .du-plus,#E .fc .chips.n-glisse.n-six .chip{animation:none!important}}`;
  document.head.appendChild(st);

  /* ---------- 2 · la pastille « + » (23/11, Marie, D108 : remplace « 3 h et + ») ----------
     15 min → 2 h 30 en pastilles, puis « + » : « Autre durée [h] [min] » (minutes de 5 en 5), de 15 min à 10 h.
     Une durée déjà enregistrée hors de la liste (1 h 15, 3 h 30…) s'affiche dans le « + ». */
  const LONG = 180, MAXI = 600, MINI = 5, LISTE = [15, 30, 45, 60, 90, 120, 150], val = c => +(c.dataset.csD || c.dataset.nd || 0);
  const pastilleLongue = g => [...g.querySelectorAll(".chip")].find(c => c.classList.contains("du-long"));

  function reglette(g) {
    const c = pastilleLongue(g), z = g.nextElementSibling; if (!c || !z || !z.classList.contains("du-plus")) return;
    const v = val(c), on = c.classList.contains("on"); z.hidden = !on;
    c.textContent = on ? duree(v) : "+"; c.setAttribute("aria-label", on ? "Autre durée : " + duree(v) : "Autre durée");
    z.querySelector("[data-du-h]").value = Math.floor(v / 60); z.querySelector("[data-du-m]").value = v % 60;
  }
  function poseDurees(g) {
    if (g.dataset.long) return; g.dataset.long = "1";
    const L = [...g.querySelectorAll(".chip")].filter(c => !LISTE.includes(val(c))); if (!L.length) return;
    const garde = L.find(c => c.classList.contains("on")) || L.find(c => val(c) === LONG) || L[0];
    L.forEach(c => { if (c !== garde) c.remove(); });
    g.appendChild(garde); garde.classList.add("du-long");
    let h = ""; for (let x = 0; x <= MAXI / 60; x++) h += `<option value="${x}">${x} h</option>`;
    g.insertAdjacentHTML("afterend", `<div class="du-plus" hidden><span>Autre durée</span><select data-du-h aria-label="Heures">${h}</select><select data-du-m aria-label="Minutes">${Array.from({ length: 12 }, (_, k) => k * 5).map(m => `<option value="${m}">${String(m).padStart(2, "0")} min</option>`).join("")}</select></div>`);
    reglette(g);
  }
  addEventListener("click", e => {
    if (!e.target.closest) return;
    const c = e.target.closest(".chips.ch-dur .chip"); if (c) { const g = c.parentElement; setTimeout(() => reglette(g)); return; }
  }, true);
  document.addEventListener("change", e => {
    if (!e.target.matches || !e.target.matches("[data-du-h],[data-du-m]")) return;
    const z = e.target.parentElement, g = z.previousElementSibling, p = g && pastilleLongue(g); if (!p) return;
    const v = Math.min(MAXI, Math.max(MINI, +z.querySelector("[data-du-h]").value * 60 + +z.querySelector("[data-du-m]").value));
    if (p.dataset.csD) p.dataset.csD = v; else p.dataset.nd = v;
    p.click();   /* l'écran refait son calcul comme si elle l'avait touchée (aperçu « Ta cliente verra ») */
    reglette(g);
  });

  /* ---------- 3 et 4 · Réglages ---------- */
  const options = (de, a, v) => { let h = ""; for (let x = de; x <= a; x++) h += `<option value="${x}"${x === v ? " selected" : ""}>${x} h</option>`; return h; };
  const resume = () => {
    const h = ((brouillon() || (S.site && S.site.donnees) || {}).horaires || []).filter(x => x && x.d);
    if (!h.length) return "À remplir";
    const court = t => +t.slice(0, 2) + "h" + (t.slice(3, 5) === "00" ? "" : t.slice(3, 5)), memes = h.every(x => x.d === h[0].d && x.f === h[0].f);
    return `${h.length} jour${h.length > 1 ? "s" : ""} ouvert${h.length > 1 ? "s" : ""}${memes ? ` · ${court(h[0].d)} – ${court(h[0].f)}` : ""}`;
  };
  const re0 = VUES.re;
  VUES.re = () => {
    const f = document.createElement("div"); f.innerHTML = re0();
    const pr = f.querySelector('.ligne[data-a="prestas"]'); if (!pr) return f.innerHTML;
    pr.insertAdjacentHTML("afterend", `<div class="ligne" data-rt="horaires"><span class="s5-ic"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg></span><div class="t">Mes horaires<span>${esc(resume())}</span></div><span class="fl">›</span></div>`);
    const mes = pr.nextElementSibling, sw = f.querySelector('[data-su="ag-hor"]'), suit = sw && sw.closest(".ligne");
    if (suit) {
      mes.after(suit);
      if (!sw.classList.contains("on")) {
        const [de, a] = heuresAgenda();
        suit.insertAdjacentHTML("afterend", `<div class="ligne ag-h"><div class="t">Mes heures à moi<span>Ton site ne change pas</span></div><div class="ag-sel"><select data-ag="de" aria-label="Début de mon agenda">${options(5, 12, de)}</select>à<select data-ag="a" aria-label="Fin de mon agenda">${options(14, 23, a)}</select></div></div>`);
      }
    }
    return f.innerHTML;
  };
  document.addEventListener("click", e => {
    if (!e.target.closest) return;
    if (e.target.closest('[data-rt="horaires"]')) { e.stopPropagation(); e.preventDefault(); return ouvre(MSF["ms-horaires"]()); }
    if (e.target.closest('[data-cs-ok="horaires"]')) setTimeout(() => { if (S.onglet === "re" || S.onglet === "ag") rendu(); });   /* le résumé et l'agenda suivent tout de suite */
  }, true);
  document.addEventListener("change", e => {
    if (!e.target.matches || !e.target.matches("[data-ag]")) return;
    const z = e.target.closest(".ag-h"), de = z.querySelector('[data-ag="de"]').value, a = z.querySelector('[data-ag="a"]').value;
    localStorage.setItem("loginail-agenda-heures", de + "-" + a);
    rendu(); dit(`Ton agenda va de ${de} h à ${a} h`);
  });

  /* ---------- 5 + 6 · Nouveau rendez-vous ---------- */
  let tour = 0;
  async function habitudes(id) {
    let l = S.tous || [];
    /* le serveur rend 1 000 lignes au plus : au-delà, on demande juste celles de cette cliente */
    if (l.length >= 1000) { try { const { data, error } = await sb.from("rendez_vous").select("id,cliente_id,prestation_id,titre,debut,statut").eq("cliente_id", id); if (!error && data) l = data; } catch (e) { console.error(e); } }
    const m = new Map(); l.concat(S.rdv || []).forEach(r => { if (r.cliente_id === id && r.statut !== "annule" && r.statut !== "absente") m.set(r.id, r); });
    const P = prestasDispo(), score = P.map(() => ({ n: 0, der: "" }));
    const noms = P.map((p, i) => [String(p.nom).trim(), i]).sort((a, b) => b[0].length - a[0].length);   /* le plus long d'abord */
    m.forEach(r => {
      let reste = ` + ${String(r.titre || S.prestations.find(p => p.id === r.prestation_id)?.nom || "").trim()} + `;
      noms.forEach(([nom, i]) => {
        if (!nom || !reste.includes(` + ${nom} + `)) return;
        reste = reste.replace(` + ${nom} + `, " + "); score[i].n++;
        if (r.debut > score[i].der) score[i].der = r.debut;
      });
    });
    return score;
  }
  function range(c, score) {
    const L = [...c.querySelectorAll("[data-np]")], avant = L.map(b => b.dataset.np).join();
    const s = b => (score && score[+b.dataset.np]) || { n: 0, der: "" };
    L.sort((a, b) => s(b).n - s(a).n || s(b).der.localeCompare(s(a).der) || +a.dataset.np - +b.dataset.np);
    const bouge = L.map(b => b.dataset.np).join() !== avant, n = L.length;
    L.forEach((b, i) => {
      if (bouge) c.appendChild(b);
      const col = Math.floor(i / 6) * 3 + i % 3;   /* on lit en lignes : 1 2 3 puis 4 5 6, la suite en glissant */
      b.style.gridArea = `${Math.floor(i % 6 / 3) + 1} / ${col + 1}`;
      b.classList.toggle("n-bord", i % 6 === 0);
    });
    c.style.setProperty("--rangs", n > 3 ? 2 : 1); c.classList.toggle("n-suite", n > 6);
    const habit = !!score && score.some(x => x.n), lab = c.previousElementSibling, petit = lab && lab.querySelector("small");
    const mot = habit ? "ses habitudes en premier" : n > 6 ? "une ou plusieurs · glisse pour la suite" : "une ou plusieurs";
    if (petit && petit.textContent !== mot) petit.textContent = mot;
    if (bouge) { c.classList.remove("n-bouge"); void c.offsetWidth; c.classList.add("n-bouge"); c.scrollLeft = 0; }
  }
  async function pourCliente() {
    const c = E.querySelector(".fc .chips.n-six"), i = E.querySelector("#n-cli"); if (!c || !i) return;
    const q = i.value.trim().toLowerCase(), cli = q && S.clientes.find(x => nomCli(x).toLowerCase() === q), n = ++tour, id = cli ? String(cli.id) : "";
    if ((c.dataset.cliente || "") === id) return;
    c.dataset.cliente = id;
    const score = cli ? await habitudes(cli.id) : null;
    if (n === tour && c.isConnected) range(c, score); else if (c.dataset.cliente === id) delete c.dataset.cliente;
  }
  function poseSix(c) {
    if (c.classList.contains("n-six") || !c.querySelector("[data-np]")) return;
    c.classList.add("n-six");
    c.querySelectorAll("[data-np]").forEach(b => { if (String(b.firstChild?.textContent || "").split(/[\s-]+/).some(m => m.length > 11)) b.classList.add("n-long"); });
    range(c, null); pourCliente();
  }
  ["input", "change"].forEach(t => document.addEventListener(t, e => { if (e.target.id === "n-cli") pourCliente(); }));

  new MutationObserver(() => {
    E.querySelectorAll(".fc .chips.ch-dur:not([data-long])").forEach(poseDurees);
    E.querySelectorAll(".fc .chips.n-glisse:not(.n-six)").forEach(poseSix);
  }).observe(E, { childList: true, subtree: true });
})();
