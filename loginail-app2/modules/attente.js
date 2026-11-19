/* ===== 19/11 (Marie, version A) : la LISTE D'ATTENTE dans l'Agenda.
   Sous le jour choisi, une pastille « 3 en attente ce jour-là » (seulement s'il y a des clientes en attente).
   On la touche : la fiche « En attente » avec, pour chaque cliente, sa prestation, quand elle s'est inscrite, SMS et Appeler.
   Lecture seule (sql/23 : la pro lit sa liste ; les e-mails « une place s'est libérée » partent tout seuls, fonction « attente »).
   RGPD : prénom, téléphone, e-mail seulement ; tout s'efface quand le jour est passé. ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `
.at-pil{display:inline-flex;width:max-content;align-self:flex-start;justify-self:start;align-items:center;gap:7px;margin:-2px 0 12px;padding:7px 12px 7px 9px;border-radius:999px;background:#FBEAEE;color:#B5475E;font:500 12.5px Jost,sans-serif;border:0;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .12s}
.at-pil:active{transform:scale(.96)}
.at-pil i{font-style:normal;display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 5px;box-sizing:border-box;border-radius:999px;background:#B5475E;color:#fff;font-size:11px;font-weight:600}
.at-pil b{font-weight:400;opacity:.7;margin-left:2px}
.at-carte{background:#fff;border-radius:20px;padding:2px 14px;margin-top:14px;text-align:left}
.at-l{display:flex;align-items:center;gap:11px;padding:12px 0;border-bottom:1px solid rgba(30,28,27,.08)}
.at-l:last-child{border-bottom:0}
.at-av{width:34px;height:34px;border-radius:50%;background:#FBEAEE;color:#B5475E;display:grid;place-items:center;font:400 15px "Cormorant Garamond",serif;flex:none}
.at-tx{flex:1;min-width:0}.at-tx b{display:block;font-weight:500;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.at-tx span{display:block;font-size:12px;color:#776D64;line-height:1.4}
.at-bt{width:36px;height:36px;border-radius:50%;border:0;background:#2A1B1E;color:#fff;display:grid;place-items:center;flex:none;text-decoration:none}
.at-bt.cl{background:#F3EEEA;color:#2A1B1E}
.at-bt svg{width:16px;height:16px}
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
      if (JSON.stringify(ATT) !== avant && S.onglet === "ag" && S.pret && !E.classList.contains("fe")) rendu(); }
    catch (e) { console.warn("liste d'attente", e); } finally { enCours = false; } };
  const duJour = d => ATT.filter(a => a.jour === ymd(d));
  document.addEventListener("loginail-pret", () => charge(true));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) charge(true); });

  /* la pastille, juste sous « Jeudi 19 · 1 rendez-vous · 45 € » */
  const ag0 = VUES.ag;
  VUES.ag = () => { const h = ag0(); charge(); const l = duJour(S.jour); if (!l.length) return h;
    const pil = `<button class="at-pil" data-at="voir" aria-label="${l.length} cliente${l.length > 1 ? "s" : ""} en liste d’attente ce jour-là"><i>${l.length}</i>en attente ce jour-là<b>›</b></button>`;
    return h.replace(/(<div class="k"[^>]*>[^<]*rendez-vous[^<]*<\/div>)/, "$1" + pil); };

  const fiche = () => { const j = S.jour, l = duJour(j), salon = (S.profil && S.profil.nom_salon) || "votre prothésiste";
    const quand = `${JOURS[(j.getDay() + 6) % 7]} ${j.getDate()} ${MOIS[j.getMonth()]}`;
    if (!l.length) return ouvre(`<h3>En attente</h3><div class="sous">${quand}<br>Plus personne n’attend ce jour-là.</div>`);
    ouvre(`<h3>En attente</h3><div class="sous">${quand}<br>Si une place se libère, elles reçoivent un e-mail tout seul.<br>La première qui réserve a la place.</div>
      <div class="at-carte">${l.map(a => { const t = num(a.telephone), txt = encodeURIComponent(`Bonjour ${a.prenom}, c’est ${salon}. Une place s’est libérée ${quand.toLowerCase()} pour votre ${(a.presta || "rendez-vous").toLowerCase()}. Elle vous intéresse ?`);
        return `<div class="at-l"><div class="at-av">${esc((a.prenom || "?").trim().charAt(0).toUpperCase())}</div><div class="at-tx"><b>${esc(a.prenom || "")}</b><span>${esc([a.presta, duree(a.duree)].filter(Boolean).join(" · "))}${a.cree_le ? " · " + inscrite(a.cree_le) : ""}</span></div>${t ? `<a class="at-bt cl" href="sms:${t}?&body=${txt}" aria-label="Écrire un SMS à ${esc(a.prenom || "")}">${SMS}</a><a class="at-bt" href="tel:${t}" aria-label="Appeler ${esc(a.prenom || "")}">${TEL}</a>` : ""}</div>`; }).join("")}</div>
      <div class="at-note">✦ <span>Vous ne voyez que le prénom, le téléphone et l’e-mail. Tout s’efface tout seul une fois le jour passé.</span></div>`); };
  document.addEventListener("click", e => { const t = e.target; if (!t.closest || !t.closest('[data-at="voir"]')) return; e.stopPropagation(); e.preventDefault(); fiche(); charge(true); }, true);
})();
