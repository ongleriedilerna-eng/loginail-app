/* ===== 25/11 soir (Marie, version B de maquettes/idee-reviennent-2511.html) : « Elles devraient revenir » sur l'Accueil =====
   Sous « Prochaine cliente », une ligne qui glisse de côté : les clientes qui devraient revenir d'ici 7 jours ou qui sont en retard,
   d'après LEUR rythme (celle qui vient toutes les 3 semaines…). Le rond autour de l'initiale se remplit jusqu'au jour prévu, rouge si c'est dépassé.
   Toucher une cliente → son rythme + « Rendez-vous » (Mes dispos pour elle, comme sur sa fiche) et « Lui écrire » (Messages, avec MON message de relance).
   Mêmes règles que l'Ajout rapide (ajout-rapide.js) : pas celles qui ont déjà un rendez-vous, au moins 2 visites, pas celles oubliées depuis plus de 4 mois.
   Aucun message ne part tout seul. On ne lit que ce que l'appli a déjà (S.tous, S.rdv, S.clientes). Pour tous les salons, les 3 styles. */
(function () {
  const J = 864e5, AVANCE = 7, MAX = 12, ROUGE = "#C2413B";
  const st = document.createElement("style");
  st.textContent = `#E .rv2-k{display:flex;justify-content:space-between;align-items:baseline;margin:22px 2px 10px}
#E .rv2-k b{font-weight:400;font-size:15px}#E .rv2-k small{font-size:12.5px;color:#776D64}
#E .rv2-l{display:flex;gap:8px;overflow-x:auto;margin:0 -20px;padding:2px 20px 8px;scrollbar-width:none;scroll-snap-type:x proximity;scroll-padding:0 20px;overscroll-behavior-x:contain}
#E .rv2-l::-webkit-scrollbar{display:none}
#E .rv2-p{flex:none;scroll-snap-align:start;width:96px;padding:10px 6px 11px;border-radius:26px;background:#fff;border:1.5px solid transparent;font:inherit;color:inherit;cursor:pointer;text-align:center;box-shadow:0 8px 20px -16px rgba(120,40,55,.6);transition:border-color .18s,transform .12s}
#E .rv2-p:active{transform:scale(.96)}
#E .rv2-p.on{border-color:var(--v-fonce,#1E1C1B)}
#E .rv2-rd{display:block;position:relative;width:50px;height:50px;margin:0 auto 6px}
#E .rv2-rd svg{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}
#E .rv2-rd circle{fill:none;stroke-width:3.5}#E .rv2-rd .f{stroke:#F1E4E6}#E .rv2-rd .v{stroke:var(--v-acc,#B5475E);stroke-linecap:round}
#E .rv2-p.retard .v{stroke:${ROUGE}}
#E .rv2-av{position:absolute;inset:6px;border-radius:50%;display:grid;place-items:center;background:var(--v-rose,#F5E6E4);color:var(--v-acc,#B5475E);font-size:17px;font-weight:500}
#E .rv2-p b{display:block;font-weight:400;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#E .rv2-p small{display:block;font-size:11.5px;color:var(--v-acc,#B5475E);margin-top:1px;white-space:nowrap}
#E .rv2-p.retard small{color:${ROUGE}}
#E .rv2-o{display:grid;grid-template-rows:0fr;transition:grid-template-rows .24s cubic-bezier(.2,.8,.2,1)}#E .rv2-o>div{overflow:hidden}#E .rv2-o.on{grid-template-rows:1fr}
#E .rv2-c{margin:6px 0 16px;background:#fff;border-radius:20px;padding:14px 16px;text-align:left}
#E .rv2-c p{margin:0;font-size:14px;line-height:1.35}#E .rv2-c p b{font-weight:500}
#E .rv2-c .q{font-size:12.5px;color:#776D64;margin:3px 0 12px}#E .rv2-c .q em{font-style:normal;color:var(--v-acc,#B5475E)}#E .rv2-c .q em.r{color:${ROUGE}}
#E .rv2-b{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#E .rv2-b button{height:44px;border-radius:14px;border:0;background:var(--v-rose,#F5E6E4);color:var(--v-fonce,#1E1C1B);font:inherit;font-size:14px;cursor:pointer;transition:transform .12s}
#E .rv2-b button:active{transform:scale(.97)}#E .rv2-b .plein{background:var(--v-fonce,#1E1C1B);color:#fff}
@media (prefers-reduced-motion:reduce){#E .rv2-o,#E .rv2-p,#E .rv2-b button{transition:none}}`;
  document.head.appendChild(st);

  const MC = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const date = d => `${d.getDate() === 1 ? "1er" : d.getDate()} ${MC[d.getMonth()]}`;
  const rythme = j => j % 7 === 0 && j <= 70 ? (j === 7 ? "toutes les semaines" : `toutes les ${j / 7} semaines`) : j >= 28 && j <= 32 ? "tous les mois" : `tous les ${j} jours`;
  const court = x => x.reste < 0 ? `${-x.reste} j de retard` : x.reste === 0 ? "aujourd’hui" : `dans ${x.reste} j`;
  const MSG0 = "Bonjour {prénom}, ça fait un moment ! Envie de refaire vos ongles ? {lien}À très vite, {salon}";
  const texte = c => { let m = MSG0; try { m = localStorage.getItem("loginail-msg-relance") || (S.site && S.site.donnees && S.site.donnees.msgRelance) || MSG0; } catch (e) {}
    const l = S.site && S.site.en_ligne && S.site.slug ? lienDuSite(S.site) : "";
    return m.replace(/\{prénom\}/g, c.prenom || "").replace(/\{salon\}/g, (S.profil && (S.profil.nom_salon || S.profil.prenom)) || "").replace(/\{lien\}/g, l ? "Vous pouvez réserver ici : " + l + " " : "").replace(/\s+/g, " ").trim(); };

  function liste() {
    const now = new Date(), auj = new Date(now.toDateString()), tout = new Map(), par = new Map(), out = [];
    (S.tous || []).concat(S.rdv || []).forEach(r => tout.set(r.id, r));
    tout.forEach(r => { if (!r.cliente_id || r.statut === "annule") return; (par.get(r.cliente_id) || par.set(r.cliente_id, []).get(r.cliente_id)).push(r); });
    par.forEach((l, id) => {
      if (l.some(r => r.statut === "prevu" && new Date(r.fin) > now)) return;   /* elle a déjà son rendez-vous */
      const v = l.filter(r => r.statut !== "absente" && new Date(r.debut) < now).sort((a, b) => a.debut.localeCompare(b.debut));
      if (v.length < 2) return;
      const c = (S.clientes || []).find(x => x.id === id); if (!c) return;
      const ec = v.slice(1).map((r, i) => Math.round((new Date(r.debut) - new Date(v[i].debut)) / J)).filter(x => x >= 5).slice(-4).sort((a, b) => a - b);
      if (!ec.length) return;
      const ry = ec[Math.floor(ec.length / 2)], der = v[v.length - 1], d0 = new Date(new Date(der.debut).toDateString()), dep = Math.round((auj - d0) / J);
      if (dep > Math.max(120, ry * 2.5)) return;   /* oubliée : c'est « À relancer » (Clientes) */
      const reste = ry - dep; if (reste > AVANCE) return;
      out.push({ c, ry, dep, reste, attendu: new Date(+d0 + ry * J), der });
    });
    return out.sort((a, b) => a.reste - b.reste || a.c.prenom.localeCompare(b.c.prenom)).slice(0, MAX);
  }

  let OUV = null, L = [];
  const carte = x => { const c = x.c, t = String(c.telephone || "").replace(/[^\d+]/g, ""), quoi = esc(x.der.titre || (x.der.prestations && x.der.prestations.nom) || "");
    return `<div class="rv2-c"><p><b>${esc(nomCli(c))}</b> · ${rythme(x.ry)}</p><p class="q">${x.reste < 0 ? `Elle aurait dû revenir le <em class="r">${date(x.attendu)}</em>` : x.reste === 0 ? `Elle devrait revenir <em>aujourd’hui</em>` : `Elle devrait revenir vers le <em>${date(x.attendu)}</em>`}${quoi ? " · " + quoi : ""}</p>
      <div class="rv2-b"><button data-rv2="rdv" data-id="${esc(c.id)}">Rendez-vous</button>${t ? `<button class="plein" data-href="sms:${esc(t)}?&body=${encodeURIComponent(texte(c))}">Lui écrire</button>` : `<button class="plein" data-rv2="fiche" data-id="${esc(c.id)}">Pas de numéro · sa fiche</button>`}</div></div>`; };
  const bloc = () => { L = liste(); if (!L.length) return ""; if (!L.some(x => x.c.id === OUV)) OUV = null;
    const P = 2 * Math.PI * 23, o = L.find(x => x.c.id === OUV);
    return `<div class="rv2-k"><b>Elles devraient revenir</b><small>${L.length} cliente${L.length > 1 ? "s" : ""}</small></div>
      <div class="rv2-l" role="list">${L.map(x => { const pc = Math.max(.06, Math.min(1, x.dep / x.ry)), nom = x.c.prenom + (String(x.c.nom || "").trim() ? " " + x.c.nom.trim()[0].toUpperCase() + "." : "");
        return `<button class="rv2-p${x.reste < 0 ? " retard" : ""}${x.c.id === OUV ? " on" : ""}" data-rv2="p" data-id="${esc(x.c.id)}" role="listitem" aria-expanded="${x.c.id === OUV}" aria-label="${esc(nomCli(x.c))}, ${court(x)}"><span class="rv2-rd"><svg viewBox="0 0 50 50" aria-hidden="true"><circle class="f" cx="25" cy="25" r="23"/><circle class="v" cx="25" cy="25" r="23" stroke-dasharray="${(P * pc).toFixed(1)} ${P.toFixed(1)}"/></svg><span class="rv2-av">${esc((x.c.prenom || "?")[0].toUpperCase())}</span></span><b>${esc(nom)}</b><small>${court(x)}</small></button>`; }).join("")}</div>
      <div class="rv2-o${o ? " on" : ""}"><div>${o ? carte(o) : ""}</div></div>`; };

  const acc0 = VUES.acc;
  VUES.acc = () => { const h = acc0(); let b = ""; try { b = bloc(); } catch (e) {} if (!b) return h;
    const f = document.createElement("div"); f.innerHTML = h; const haut = f.querySelector(".v-haut-acc"); if (!haut) return h;
    const l0 = E.querySelector(".vue.on .rv2-l"), x0 = l0 ? l0.scrollLeft : 0;   /* l'accueil se redessine chaque minute : la ligne garde sa place */
    haut.insertAdjacentHTML("afterend", b);
    if (x0) setTimeout(() => { const l = E.querySelector(".vue.on .rv2-l"); if (l) l.scrollLeft = x0; }, 0);
    return f.innerHTML; };

  document.addEventListener("click", e => { const a = e.target.closest && e.target.closest("[data-rv2]"); if (!a) return; e.stopPropagation(); const k = a.dataset.rv2, id = a.dataset.id;
    if (k === "p") { const z = a.closest(".vue"), o = z && z.querySelector(".rv2-o"); OUV = OUV === id ? null : id;
      z.querySelectorAll(".rv2-p").forEach(p => { const on = p.dataset.id === OUV; p.classList.toggle("on", on); p.setAttribute("aria-expanded", on); });
      if (!o) return; const x = L.find(y => y.c.id === OUV);
      if (x) { o.firstElementChild.innerHTML = carte(x); o.classList.add("on"); } else o.classList.remove("on"); }
    else if (k === "fiche") feuilleCliente(id);
    else if (k === "rdv") { feuilleCliente(id); setTimeout(() => { const b = E.querySelector('.fc [data-fi="prdv"]'); if (b) b.click(); }, 80); }   /* comme « Prendre un rendez-vous » sur sa fiche */
  }, true);
})();
