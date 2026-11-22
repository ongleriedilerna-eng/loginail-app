/* ===== 19/11 (Marie, version A) : la LISTE D'ATTENTE dans l'Agenda.
   Sous le jour choisi, une pastille « 3 en attente ce jour-là » (seulement s'il y a des clientes en attente).
   On la touche : la fiche « En attente » avec, pour chaque cliente, sa prestation, quand elle s'est inscrite, SMS et Appeler.
   Lecture seule (sql/23 : la pro lit sa liste ; les e-mails « une place s'est libérée » partent tout seuls, fonction « attente »).
   RGPD : prénom, téléphone, e-mail seulement ; tout s'efface quand le jour est passé. ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `
.at-pil{display:inline-flex;width:max-content;align-self:flex-start;justify-self:start;align-items:center;gap:7px;margin:-2px 0 12px;padding:7px 12px 7px 9px;border-radius:999px;background:var(--v-rose,#FBEAEE);color:var(--v-acc,#B5475E);font:500 12.5px Jost,sans-serif;border:0;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .12s}
.at-pil:active{transform:scale(.96)}
.at-pil i{font-style:normal;display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 5px;box-sizing:border-box;border-radius:999px;background:var(--v-acc,#B5475E);color:#fff;font-size:11px;font-weight:600}
.at-pil b{font-weight:400;opacity:.7;margin-left:2px}
.at-carte{background:#fff;border-radius:20px;padding:2px 14px;margin-top:14px;text-align:left}
.at-l{display:flex;align-items:center;gap:11px;padding:12px 0;border-bottom:1px solid rgba(30,28,27,.08)}
.at-l:last-child{border-bottom:0}
.at-av{width:34px;height:34px;border-radius:50%;background:var(--v-rose,#FBEAEE);color:var(--v-acc,#B5475E);display:grid;place-items:center;font:400 15px "Cormorant Garamond",serif;flex:none}
.at-tx{flex:1;min-width:0}.at-tx b{display:block;font-weight:500;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.at-tx span{display:block;font-size:12px;color:#776D64;line-height:1.4}
.at-bt{width:36px;height:36px;border-radius:50%;border:0;background:#2A1B1E;color:#fff;display:grid;place-items:center;flex:none;text-decoration:none}
.at-bt.cl{background:#F3EEEA;color:#2A1B1E}
.at-bt svg{width:16px;height:16px}
.at-ac{background:#fff;border-radius:20px;padding:4px 16px;margin-bottom:6px;text-align:left}.at-ac .at-l{cursor:pointer;-webkit-tap-highlight-color:transparent}.at-ac .at-l:active{opacity:.6}.at-ac i{font-style:normal;display:inline-grid;place-items:center;min-width:22px;height:22px;padding:0 6px;box-sizing:border-box;border-radius:999px;background:var(--v-acc,#B5475E);color:#fff;font:600 11.5px Jost,sans-serif;flex:none}.at-ac .fl{color:var(--v-acc,#B5475E);font-size:18px}
.at-p{border-bottom:1px solid rgba(30,28,27,.08)}.at-p:last-child{border-bottom:0}.at-p .at-l{border-bottom:0}
.at-p [data-at="perso"]{cursor:pointer;-webkit-tap-highlight-color:transparent}
.at-fl{color:var(--v-acc,#B5475E);font-size:18px;transition:transform .18s;flex:none}.at-p.at-ouv .at-fl{transform:rotate(90deg)}
.at-act{display:grid;grid-template-rows:0fr;transition:grid-template-rows .2s cubic-bezier(.2,.8,.2,1)}.at-act>div{overflow:hidden;display:flex;gap:10px;padding:0 0 0 45px}
.at-p.at-ouv .at-act{grid-template-rows:1fr}.at-p.at-ouv .at-act>div{padding-bottom:12px}
.at-b2{flex:1;height:40px;border-radius:20px;background:#2A1B1E;color:#fff;display:flex;align-items:center;justify-content:center;gap:7px;font:500 13.5px Jost,sans-serif;text-decoration:none}.at-b2.cl{background:#F3EEEA;color:#2A1B1E}.at-b2 svg{width:15px;height:15px}.at-b2:active{transform:scale(.97)}
@media (prefers-reduced-motion:reduce){.at-act,.at-fl{transition:none}}
.at-note{display:flex;gap:8px;align-items:flex-start;font-size:12px;color:#776D64;margin:14px 4px 0;line-height:1.45;text-align:left}`;
  document.head.appendChild(st);

  const TEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';
  const SMS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  const ymd = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const num = t => String(t || "").replace(/[^\d+]/g, "");
  const duree = m => { m = +m || 0; if (!m) return ""; const h = Math.floor(m / 60), r = m % 60; return h ? h + " h" + (r ? " " + String(r).padStart(2, "0") : "") : r + " min"; };
  const inscrite = iso => { const d = new Date(iso), n = new Date(); if (isNaN(d)) return "";
    const j = Math.round((new Date(n.getFullYear(), n.getMonth(), n.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5);
    if (j <= 0) return d.getHours() < 12 ? "inscrite ce matin" : "inscrite aujourd’hui"; if (j === 1) return "inscrite hier"; return `inscrite il y a ${j} jours`; };

  /* la liste : relue à l'ouverture de l'Agenda (au plus toutes les 30 s) et quand l'appli revient au premier plan */
  let ATT = [], lu = 0, enCours = false;
  const charge = async (force) => { if (enCours || typeof sb === "undefined" || !sb || !S.user || (!force && Date.now() - lu < 30000)) return; enCours = true;
    try { const { data, error } = await sb.from("liste_attente").select("id,jour,prenom,telephone,email,presta,duree,cree_le").gte("jour", ymd(new Date())).order("cree_le");
      if (error) throw error; const avant = JSON.stringify(ATT); ATT = data || []; lu = Date.now();
      if (JSON.stringify(ATT) !== avant && (S.onglet === "ag" || S.onglet === "acc") && S.pret && !E.classList.contains("fe")) rendu(); }
    catch (e) { console.warn("liste d'attente", e); } finally { enCours = false; } };
  const duJour = d => ATT.filter(a => a.jour === ymd(d));
  document.addEventListener("loginail-pret", () => charge(true));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) charge(true); });

  /* la pastille, juste sous « Jeudi 19 · 1 rendez-vous · 45 € » */
  const ag0 = VUES.ag;
  VUES.ag = () => { const h = ag0(); charge(); const l = duJour(S.jour); if (!l.length) return h;
    const pil = `<button class="at-pil" data-at="voir" aria-label="${l.length} cliente${l.length > 1 ? "s" : ""} en liste d’attente ce jour-là"><i>${l.length}</i>en attente ce jour-là<b>›</b></button>`;
    return h.replace(/(<div class="k"[^>]*>[^<]*rendez-vous[^<]*<\/div>)/, "$1" + pil); };

  const fiche = (j = S.jour) => { const l = duJour(j), salon = (S.profil && S.profil.nom_salon) || "votre prothésiste";
    const quand = `${JOURS[(j.getDay() + 6) % 7]} ${j.getDate()} ${MOIS[j.getMonth()]}`;
    if (!l.length) return ouvre(`<h3>En attente</h3><div class="sous">${quand}<br>Plus personne n’attend ce jour-là.</div>`);
    ouvre(`<h3>En attente</h3><div class="sous">${quand}<br>Elles reçoivent un e-mail si un rendez-vous est annulé.</div>
      <div class="at-carte">${l.map(a => { const t = num(a.telephone), txt = encodeURIComponent(`Bonjour ${a.prenom}, c’est ${salon}. Une place s’est libérée ${quand.toLowerCase()} pour votre ${(a.presta || "rendez-vous").toLowerCase()}. Elle vous intéresse ?`);
        return `<div class="at-p"><div class="at-l" ${t ? 'data-at="perso" role="button" aria-expanded="false"' : ""}><div class="at-av">${esc((a.prenom || "?").trim().charAt(0).toUpperCase())}</div><div class="at-tx"><b>${esc(a.prenom || "")}</b><span>${esc([a.presta, duree(a.duree)].filter(Boolean).join(" · "))}${a.cree_le ? " · " + inscrite(a.cree_le) : ""}</span></div>${t ? '<span class="at-fl">›</span>' : ""}</div>${t ? `<div class="at-act"><div><a class="at-b2 cl" href="sms:${t}?&body=${txt}">${SMS}Proposer la place</a><a class="at-b2" href="tel:${t}">${TEL}Appeler</a></div></div>` : ""}</div>`; }).join("")}</div>`); };
  /* 19/11 (Marie) : sur l'Accueil aussi, une carte « En attente d'une place » (seulement s'il y a quelqu'un), jour par jour ; on touche un jour → la même fiche */
  const deDate = s => { const [a, m, d] = s.split("-").map(Number); return new Date(a, m - 1, d); };
  const acc0 = VUES.acc;
  VUES.acc = () => { const h = acc0(); charge(); if (!ATT.length) return h;
    const jours = [...new Set(ATT.map(a => a.jour))].sort().slice(0, 5), auj = new Date(), dem = new Date(auj.getFullYear(), auj.getMonth(), auj.getDate() + 1);
    const nom = d => memeJour(d, auj) ? "Aujourd’hui" : memeJour(d, dem) ? "Demain" : `${JOURS[(d.getDay() + 6) % 7]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
    const carte = `<div class="k">En attente d’une place</div><div class="at-ac">${jours.map(j => { const l = ATT.filter(a => a.jour === j), d = deDate(j);
      return `<div class="at-l" data-at="voir" data-j="${j}" role="button" aria-label="${l.length} en attente ${nom(d)}"><i>${l.length}</i><div class="at-tx"><b>${nom(d)}</b><span>${esc(l.map(a => a.prenom).join(", "))}</span></div><span class="fl">›</span></div>`; }).join("")}</div>`;
    for (const rep of ['<div class="k">Toute la journée', '<div class="k">Anniversaires', '<div class="k">Ma caisse']) if (h.includes(rep)) return h.replace(rep, carte + rep);
    return h + carte; };
  document.addEventListener("click", e => { const p = e.target.closest && e.target.closest('[data-at="perso"]'); if (!p) return; e.stopPropagation(); e.preventDefault();
    const bloc = p.parentElement, ouv = !bloc.classList.contains("at-ouv"); bloc.parentElement.querySelectorAll(".at-p.at-ouv").forEach(x => { x.classList.remove("at-ouv"); x.firstElementChild.setAttribute("aria-expanded", "false"); });
    if (ouv) { bloc.classList.add("at-ouv"); p.setAttribute("aria-expanded", "true"); } }, true);
  document.addEventListener("click", e => { const t = e.target, b = t.closest && t.closest('[data-at="voir"]'); if (!b) return; e.stopPropagation(); e.preventDefault(); fiche(b.dataset.j ? deDate(b.dataset.j) : S.jour); charge(true); }, true);
})();
