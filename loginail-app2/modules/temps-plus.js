/* ===== 24/11 (Marie, D114) « Le temps qu'il lui faut » sur la fiche cliente : Normal / + 15 / + 30 / + 45 min.
   Ambre prend 1 h 30 pour un remplissage d'1 h : on le met une fois, ses rendez-vous s'allongent tout seuls.
   · rangé dans clientes.minutes_en_plus (sql/38) ; tant que la colonne n'existe pas sur le serveur, rien n'est cassé : un petit message ;
   · en changeant, ses prochains rendez-vous prévus s'allongent (ou raccourcissent) d'autant, sauf s'ils déborderaient sur un autre ;
   · un rendez-vous posé dans l'appli pour elle prend le temps en plus (app2.js, « nouveau-ok ») ; « Modifier » le compte dans « prévu » (rdv.js) ;
   · sur le site, sa réservation est allongée par le serveur (sql/38, déclencheur) ; elle voit toujours la durée de la prestation. =====*/
(function () {
  const st = document.createElement("style");
  st.textContent = `.tpl-ch{display:flex;gap:6px;background:#fff;border-radius:999px;padding:4px}
.tpl-ch button{flex:1 1 0;min-width:0;height:40px;border:0;border-radius:999px;background:none;font:inherit;font-size:13.5px;color:#1E1C1B;white-space:nowrap;transition:background .18s,color .18s}
.tpl-ch button.on{background:#1E1C1B;color:#fff}
.tpl-note{margin:7px 4px 0;font-size:12.5px;line-height:1.4;color:#8A847E;text-align:left}`;
  document.head.appendChild(st);
  const PLUS = [0, 15, 30, 45];
  window.plusCliente = c => Math.max(0, Math.min(120, +(c && c.minutes_en_plus) || 0));
  const laCliente = () => { const id = window.__ficheId && __ficheId(); return id && S.clientes.find(x => x.id === id); };
  const bloc = c => { const v = plusCliente(c), p = esc(c.prenom || "elle");
    return `<div class="fi-k">Le temps qu’il lui faut</div><div class="tpl-ch">${PLUS.map(m => `<button data-tp="${m}" class="${v === m ? "on" : ""}">${m ? "+ " + m + " min" : "Normal"}</button>`).join("")}</div>
      <div class="tpl-note">${v ? `Ses rendez-vous durent ${v} min de plus, aussi quand ${p} réserve sur ton site (elle voit toujours la durée habituelle).` : "Elle prend plus de temps ? Mets-le une fois : ses rendez-vous s’allongent tout seuls."}</div>`; };
  const pose = () => { const t = document.querySelector(".fc .fi-t3"), c = laCliente(); if (!t || !c) return;
    let z = document.getElementById("tpl"); if (!z) { t.insertAdjacentHTML("afterend", '<div id="tpl"></div>'); z = document.getElementById("tpl"); }
    z.innerHTML = bloc(c); };
  new MutationObserver(() => { const t = document.querySelector(".fc .fi-t3"); if (t && !document.getElementById("tpl")) pose(); }).observe(document.body, { childList: true, subtree: true });

  document.addEventListener("click", async e => { const b = e.target.closest && e.target.closest("[data-tp]"); if (!b) return; e.stopPropagation();
    const c = laCliente(); if (!c) return; const nv = +b.dataset.tp, av = plusCliente(c); if (nv === av) return;
    c.minutes_en_plus = nv; pose();   /* tout de suite à l'écran */
    const { error } = await sb.from("clientes").update({ minutes_en_plus: nv }).eq("id", c.id);
    if (error) { c.minutes_en_plus = av; pose(); return dit(/minutes_en_plus/.test(error.message || "") ? "Ce réglage arrive avec la prochaine mise à jour" : "Oups, ça n’a pas marché. Réessaie."); }
    /* ses prochains rendez-vous prévus : allongés (ou raccourcis) d'autant, jamais sur un autre rendez-vous */
    const { data } = await sb.from("rendez_vous").select("id,debut,fin,titre").eq("cliente_id", c.id).eq("statut", "prevu").gte("debut", new Date().toISOString());
    /* jamais plus court que ses prestations (un rendez-vous qu'on n'avait pas pu allonger ne raccourcit pas) */
    const base = r => (r.titre || "").split(" + ").reduce((s, n) => { const p = prestasDispo().find(x => x.nom === n.replace(/ ×\d+$/, "")); return s + (p ? +p.duree || 60 : 0); }, 0);
    let ok = 0, non = 0;
    for (const r of data || []) { const d = new Date(r.debut), f = new Date(Math.max(+d + 15 * 60000, +d + base(r) * 60000, +new Date(r.fin) + (nv - av) * 60000));
      if (+f === +new Date(r.fin)) continue;
      if (nv > av) { const { data: x } = await sb.from("rendez_vous").select("id").neq("id", r.id).neq("statut", "annule").gte("debut", r.fin).lt("debut", f.toISOString()).limit(1); if (x && x.length) { non++; continue; } }
      const { error: e2 } = await sb.from("rendez_vous").update({ fin: f.toISOString() }).eq("id", r.id); if (!e2) ok++; }
    if (ok) { await chargeSemaine(); rendu(); }
    dit(non ? `${ok ? ok + " rendez-vous allongé" + (ok > 1 ? "s" : "") + " · " : ""}${non} déborderai${non > 1 ? "en" : ""}t sur une autre cliente : à allonger à la main` : ok ? `C’est noté ✓ · ${ok} rendez-vous ${nv > av ? "allongé" : "raccourci"}${ok > 1 ? "s" : ""}` : "C’est noté ✓"); }, true);
})();
