/* ===== 12/11 (Marie) La fiche cliente en deux onglets : « Fiche » (prochain rendez-vous, visites, fidélité, historique) et « Notes »
   (ce que je sais / pas encore). Le formulaire (nom, téléphone…) passe derrière le petit crayon. + la fidélité dans les Réglages. =====
   Les notes sont rangées dans la colonne « notes » de la cliente : du texte simple, ou {v:1,t:"texte libre",s:[{q,r}]} quand il y a des « je sais ». */
(function () {
  const st = document.createElement("style");
  st.textContent = `.fi-haut{display:flex;align-items:flex-start;gap:8px;text-align:left;padding-right:46px}.fi-haut h3{margin:0;text-align:left;font-size:25px;line-height:1.1}.fi-haut small{display:block;margin-top:5px;font-size:12.5px;opacity:.6}
.fi-rond{flex:none;width:42px;height:42px;border-radius:50%;border:0;background:#fff;display:grid;place-items:center;padding:0}.fi-rond svg{width:18px;height:18px}
.fi-sw{display:flex;background:#fff;border-radius:999px;padding:4px;margin:16px 0 14px}.fi-sw button{flex:1;border:0;background:none;border-radius:999px;padding:11px 0;font:inherit;font-size:13.5px;font-weight:500;color:#8A847E}.fi-sw button.on{background:#1E1C1B;color:#fff}
.fi-k{margin:16px 0 8px;font-size:10.5px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#8A847E;text-align:left;display:flex;align-items:center;gap:8px}
.fi-noire{border-radius:20px;background:#1E1C1B;color:#fff;padding:14px 16px;text-align:left}.fi-noire small{display:block;font-size:10px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;opacity:.65;margin-bottom:5px}.fi-noire b{display:block;font-size:15.5px;font-weight:500;line-height:1.3}.fi-noire i{display:block;font-style:normal;font-size:12.5px;opacity:.7;margin-top:8px}
.fi-t3{display:grid;grid-template-columns:repeat(auto-fit,minmax(0,1fr));gap:8px;margin-top:10px;text-align:left}.fi-t3 div{background:#fff;border-radius:16px;padding:11px 12px}.fi-t3 small{display:block;font-size:9.5px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#8A847E;margin-bottom:4px}.fi-t3 b{font-size:17px;font-weight:500}.fi-t3 b em{font-style:normal;font-size:12px;font-weight:400;color:#8A847E}
.fi-carte{background:#fff;border-radius:20px;padding:4px 16px;text-align:left}.fi-lg{display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid rgba(30,28,27,.08);font-size:14px}.fi-lg:last-child{border-bottom:0}.fi-lg>div{flex:1;min-width:0}.fi-lg>div span{display:block;font-size:12px;color:#8A847E;margin-top:2px}.fi-lg em{font-style:normal;font-size:13.5px;white-space:nowrap}
.fi-q{flex:none;width:24px;height:24px;border-radius:50%;border:1px dashed rgba(30,28,27,.3);display:grid;place-items:center;font-size:11px;color:#8A847E}.fi-ic{flex:none;width:28px;height:28px;border-radius:9px;background:#EDE7E0;display:grid;place-items:center;font-size:13px}
.fi-b{flex:none;border:0;background:none;padding:6px 0 6px 8px;font:inherit;font-size:12.5px;font-weight:500;color:#1E1C1B}.fi-x{flex:none;border:0;background:none;padding:6px;font-size:15px;color:#8A847E}
.fi-in{flex:1;min-width:0;border:0;border-bottom:1px solid rgba(30,28,27,.25);background:none;font:inherit;font-size:16px;padding:6px 0;outline:none}
.fi-plus{display:block;width:100%;margin-top:10px;border:1px dashed rgba(30,28,27,.25);border-radius:16px;background:none;padding:13px 14px;font:inherit;font-size:13.5px;color:#8A847E;text-align:left}
.fi-lien{display:inline-block;margin-top:10px;border:0;background:none;padding:4px 0;font:inherit;font-size:13px;font-weight:500;text-decoration:underline;text-underline-offset:3px;color:#1E1C1B}
.fi-fid{background:#fff;border-radius:20px;padding:14px 16px;margin-top:10px;text-align:left}.fi-fid .ht{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px}.fi-fid .ht small{font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#8A847E}.fi-fid .ht b{font-size:13px;font-weight:400}
.fi-barre{height:10px;border-radius:5px;background:#EDE7E0;overflow:hidden}.fi-barre i{display:block;height:100%;border-radius:5px;background:#1E1C1B}.fi-fid p{margin:10px 0 0;font-size:12.5px;line-height:1.4;color:#6B625C}
.fi-aide{margin:8px 0 0;border-radius:14px;background:#EDE7E0;padding:11px 13px;font-size:12px;line-height:1.5;color:#6B625C;text-align:left}
.fi-pas{display:flex;align-items:center;gap:10px}.fi-pas button{width:30px;height:30px;border-radius:50%;border:0;background:#EDE7E0;font-size:16px;padding:0;color:#1E1C1B}.fi-pas b{font-size:15px;font-weight:500;min-width:22px;text-align:center}
.fi-puces{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 0}.fi-puces button{border:0;border-radius:999px;background:#fff;padding:9px 13px;font:inherit;font-size:12.5px;color:#1E1C1B}.fi-puces button.on{background:#1E1C1B;color:#fff}`;
  document.head.appendChild(st);

  const IC = { tel: '<svg viewBox="0 0 24 24"><path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" fill="none" stroke="#1E1C1B" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    msg: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="#1E1C1B" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    crayon: '<svg viewBox="0 0 24 24"><path d="M4 20l1-4L16 5l3 3L8 19z" fill="none" stroke="#1E1C1B" stroke-width="1.6" stroke-linejoin="round"/></svg>' };
  const QUESTIONS = [["couple", "Elle est en couple ?", "♡"], ["enfants", "Elle a des enfants ?", "☺"], ["animal", "Elle a un animal ?", "❀"], ["travail", "Elle travaille dans quoi ?", "✎"], ["vacances", "Elle part en vacances ?", "✈"], ["papote", "Elle aime papoter ?", "☕"]];
  const PARLER = { vacances: "Parlez-lui de ses vacances.", enfants: "Demandez-lui des nouvelles de ses enfants.", animal: "Demandez-lui des nouvelles de son animal.", travail: "Demandez-lui comment ça se passe au travail." };
  const JOURS3 = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
  const tel = t => String(t || "").replace(/[^\d+]/g, "");

  /* ---------- la fidélité (réglage du salon) ---------- */
  const FID0 = { on: false, n: 10, cadeau: "−10 €" }, CADEAUX = ["−10 €", "−20 %", "Nail art offert"];
  const litFid = () => { let o = null; try { o = (S.site && S.site.donnees && S.site.donnees.fidelite) || JSON.parse(localStorage.getItem("loginail-fidelite")); } catch (e) {} return Object.assign({}, FID0, o || {}); };
  const ecritFid = o => { try { localStorage.setItem("loginail-fidelite", JSON.stringify(o)); const b = JSON.parse(localStorage.getItem("loginail-brouillon") || "null"); if (b && S.site) { b.fidelite = o; S.site.donnees = Object.assign(S.site.donnees || {}, { fidelite: o }); localStorage.setItem("loginail-brouillon", JSON.stringify(b)); } } catch (e) {} };
  const etatFid = n => { const f = litFid(), k = n % f.n, pret = n > 0 && k === 0; return { f, fait: pret ? f.n : k, pret, reste: pret ? 0 : f.n - k }; };

  /* ---------- les notes ---------- */
  const litNotes = c => { const t = c.notes || ""; if (t[0] === "{") try { const o = JSON.parse(t); if (o && o.v) return { t: o.t || "", s: o.s || [] }; } catch (e) {} return { t, s: [] }; };
  async function ecritNotes(id, o) { const notes = o.s.length ? JSON.stringify({ v: 1, t: o.t, s: o.s }) : (o.t || null); const c = S.clientes.find(x => x.id === id); if (c) c.notes = notes;
    const { error } = await sb.from("clientes").update({ notes }).eq("id", id); if (error) dit("Pas enregistré, réessayez"); }

  /* ---------- la fiche ---------- */
  let ID = null, ONG = "fiche", RDV = null, TOUT = false, AIDE = false, SAISIE = null;
  const tete = c => `<div class="fi-haut"><div style="flex:1;min-width:0"><h3>${esc(nomCli(c))}</h3><small>${esc(c.telephone || "Pas de numéro")}</small></div>
    ${c.telephone ? `<button class="fi-rond" data-href="tel:${tel(c.telephone)}" aria-label="Appeler">${IC.tel}</button><button class="fi-rond" data-href="sms:${tel(c.telephone)}" aria-label="Envoyer un message">${IC.msg}</button>` : ""}
    <button class="fi-rond" data-fi="modifier" aria-label="Modifier la fiche">${IC.crayon}</button></div>
    <div class="fi-sw"><button data-fi="ong" data-o="fiche" class="${ONG === "fiche" ? "on" : ""}">Fiche</button><button data-fi="ong" data-o="notes" class="${ONG === "notes" ? "on" : ""}">Notes</button></div>`;
  function pageFiche(c) { if (!RDV) return `<div class="sous" style="padding:30px 0">Un instant…</div>`;
    const now = new Date().toISOString(), ok = RDV.filter(r => r.statut !== "annule"), proch = ok.filter(r => r.fin >= now && r.statut === "prevu").sort((a, b) => a.debut.localeCompare(b.debut)), hist = ok.filter(r => r.fin < now);
    const venues = hist.filter(r => r.statut !== "absente"), e = etatFid(venues.length), d = x => new Date(x), jj = x => `${JOURS3[d(x).getDay()]} ${jourCourt(x)}`;
    let h = "";
    if (proch[0]) h += `<div class="fi-noire" data-rdv="${proch[0].id}"><small>Prochain rendez-vous</small><b>${jj(proch[0].debut)} · ${hm(d(proch[0].debut))}${proch[0].prestations || proch[0].titre ? " · " + esc((proch[0].prestations && proch[0].prestations.nom) || proch[0].titre) : ""}</b><i>Voir le rendez-vous ›</i></div>`;
    else h += `<div class="fi-carte"><div class="fi-lg"><div>Pas de rendez-vous prévu<span>${venues.length ? "Sa dernière visite : " + jourCourt(venues[0].debut) : "Elle n’est pas encore venue"}</span></div></div></div>`;
    if (proch.length > 1) h += `<div class="sous" style="text-align:left;margin:8px 2px 0">Et aussi : ${proch.slice(1, 3).map(r => jj(r.debut) + " à " + hm(d(r.debut))).join(" · ")}</div>`;
    h += `<div class="fi-t3"><div><small>Visites</small><b>${venues.length}</b></div>${e.f.on ? `<div><small>Fidélité</small><b>${e.fait} <em>/ ${e.f.n}</em></b></div>` : ""}<div><small>Dernière</small><b>${venues.length ? jourCourt(venues[0].debut) : "—"}</b></div></div>`;
    if (e.f.on) { const txt = e.pret ? `Bonjour ${c.prenom || ""}, votre carte de fidélité est complète : ${e.f.cadeau} à votre prochain rendez-vous ! ${S.profil.nom_salon || ""}`.trim() : `Bonjour ${c.prenom || ""}, vous en êtes à ${e.fait} visite${e.fait > 1 ? "s" : ""} sur ${e.f.n} sur votre carte de fidélité. Encore ${e.reste} avant votre cadeau : ${e.f.cadeau}. ${S.profil.nom_salon || ""}`.trim();
      h += `<div class="fi-fid"><div class="ht"><small>Carte de fidélité</small><b>${e.fait} visite${e.fait > 1 ? "s" : ""} sur ${e.f.n}</b></div><div class="fi-barre"><i style="width:${Math.round(e.fait / e.f.n * 100)}%"></i></div>
        <p>${e.pret ? "Sa carte est complète. Son cadeau : " + esc(e.f.cadeau) + "." : `Encore ${e.reste} visite${e.reste > 1 ? "s" : ""} avant son cadeau : ${esc(e.f.cadeau)}.`}</p>
        ${c.telephone ? `<button class="fi-lien" data-href="sms:${tel(c.telephone)}?&body=${encodeURIComponent(txt)}">Envoyer sa carte à ${esc(c.prenom || "la cliente")}</button>` : ""}</div>`; }
    h += `<div class="fi-k">Historique</div>`;
    h += hist.length ? `<div class="fi-carte">${(TOUT ? hist : hist.slice(0, 4)).map(r => `<div class="fi-lg" data-rdv="${r.id}"><div>${d(r.debut).getDate()} ${MOISC[d(r.debut).getMonth()]} ${d(r.debut).getFullYear()}<span>${esc((r.prestations && r.prestations.nom) || r.titre || "Rendez-vous")}${r.statut === "absente" ? " · absente" : ""}</span></div><em>${r.statut === "absente" ? "" : euros(r.prix)}</em></div>`).join("")}</div>${hist.length > 4 && !TOUT ? `<button class="fi-lien" data-fi="tout">Voir tout (${hist.length})</button>` : ""}`
      : `<div class="fi-carte"><div class="fi-lg"><div>Rien pour l’instant<span>Ses rendez-vous passés s’afficheront ici.</span></div></div></div>`;
    return h; }
  function pageNotes(c) { const o = litNotes(c), su = k => o.s.find(x => x.q === k), parle = (o.s.map(x => PARLER[x.q]).filter(Boolean)[0]) || "Demandez-lui ce qu’elle a fait de beau ces derniers temps.";
    const reste = QUESTIONS.filter(q => !su(q[0]));
    const champ = (k, ph) => `<input class="fi-in" id="fi-rep" placeholder="${ph}" maxlength="80" autocomplete="off"><button class="fi-b" data-fi="ok" data-q="${k}">OK</button>`;
    let h = `<div class="fi-noire"><small>De quoi lui parler</small><b style="font-weight:400">${parle}</b></div>`;
    h += `<div class="fi-k">Ce que je sais <button class="fi-q" data-fi="aide" aria-label="À propos de ces notes" style="background:none;width:20px;height:20px;font-size:10px;padding:0">?</button></div>`;
    if (AIDE) h += `<div class="fi-aide">Ces notes ne sont vues que par vous. Notez seulement ce qui vous aide à bien la recevoir, jamais rien sur sa santé. Si elle le demande, vous devez pouvoir lui montrer ou effacer ce qui est écrit sur elle.</div>`;
    h += o.s.length ? `<div class="fi-carte">${o.s.map((x, i) => `<div class="fi-lg"><span class="fi-ic">${(QUESTIONS.find(q => q[0] === x.q) || [0, 0, "✦"])[2]}</span><div>${esc(x.r)}</div><button class="fi-x" data-fi="oter" data-i="${i}" aria-label="Enlever">×</button></div>`).join("")}</div>` : `<div class="sous" style="text-align:left;margin:0 2px">Rien pour l’instant. Répondez aux questions du dessous quand vous le savez.</div>`;
    if (reste.length) h += `<div class="fi-k">Pas encore</div><div class="fi-carte">${reste.map(q => `<div class="fi-lg"><span class="fi-q">?</span>${SAISIE === q[0] ? champ(q[0], "Votre réponse") : `<div>${q[1]}</div><button class="fi-b" data-fi="sais" data-q="${q[0]}">Je sais</button>`}</div>`).join("")}</div>`;
    h += SAISIE === "+" ? `<div class="fi-carte" style="margin-top:10px"><div class="fi-lg">${champ("+", "Par exemple : aime les formes amande")}</div></div>` : `<button class="fi-plus" data-fi="sais" data-q="+">+ Autre chose que je sais</button>`;
    h += `<div class="fi-k">Mes notes libres</div><textarea class="msg" id="fi-libre" placeholder="Tout ce que vous voulez garder en tête">${esc(o.t)}</textarea>`;
    return h; }
  function montre(garde) { const c = S.clientes.find(x => x.id === ID); if (!c) return ferme(); const z = $(".feuille", E), y = garde && z ? z.scrollTop : 0;
    ouvre(tete(c) + (ONG === "fiche" ? pageFiche(c) : pageNotes(c))); if (z && garde) z.scrollTop = y; const r = $("#fi-rep", E); if (r) r.focus(); }
  async function chargeRdv() { const id = ID; const { data } = await sb.from("rendez_vous").select("*, prestations(id,nom)").eq("cliente_id", id).order("debut", { ascending: false }); if (ID !== id) return; RDV = data || []; if (ONG === "fiche" && E.classList.contains("fe") && $(".fi-sw", E)) montre(true); }

  const formulaire = feuilleCliente;   /* le formulaire d'origine (nom, téléphone, anniversaire) */
  feuilleCliente = function (id) { if (!id) return formulaire(id); ID = id; ONG = "fiche"; RDV = null; TOUT = false; AIDE = false; SAISIE = null; montre(); chargeRdv(); };

  document.addEventListener("click", async e => { const a = e.target.closest && e.target.closest("[data-fi]"); if (!a) return; e.stopPropagation(); const k = a.dataset.fi, c = S.clientes.find(x => x.id === ID);
    if (k === "ong") { ONG = a.dataset.o; SAISIE = null; montre(); }
    else if (k === "tout") { TOUT = true; montre(true); }
    else if (k === "aide") { AIDE = !AIDE; montre(true); }
    else if (k === "modifier") { formulaire(ID); const t = $("#c-no", E); if (t) { t.value = (c && c.notes) || ""; t.style.display = "none"; const l = t.previousElementSibling; if (l && l.classList.contains("lab2")) l.style.display = "none"; } }
    else if (k === "sais") { SAISIE = a.dataset.q; montre(true); }
    else if (k === "ok" && c) { const v = ($("#fi-rep", E).value || "").trim(); if (!v) return dit("Écrivez votre réponse"); const o = litNotes(c); o.s = o.s.filter(x => a.dataset.q === "+" || x.q !== a.dataset.q); o.s.push(a.dataset.q === "+" ? { r: v } : { q: a.dataset.q, r: v }); SAISIE = null; await ecritNotes(ID, o); montre(true); }
    else if (k === "oter" && c) { const o = litNotes(c); o.s.splice(+a.dataset.i, 1); await ecritNotes(ID, o); montre(true); }
    /* la fidélité, dans les Réglages */
    else if (k === "fid-on") { const f = litFid(); f.on = !f.on; ecritFid(f); rendu(); }
    else if (k === "fid-n") { const f = litFid(); f.n = Math.max(3, Math.min(20, f.n + +a.dataset.d)); ecritFid(f); rendu(); }
    else if (k === "fid-c") { const f = litFid(); f.cadeau = a.dataset.c; ecritFid(f); rendu(); }
  }, true);
  document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.id === "fi-rep") { const b = e.target.parentElement.querySelector('[data-fi="ok"]'); if (b) b.click(); } });
  document.addEventListener("focusout", async e => { if (e.target.id !== "fi-libre") return; const c = S.clientes.find(x => x.id === ID); if (!c) return; const o = litNotes(c), v = e.target.value.trim(); if (v !== o.t) { o.t = v; await ecritNotes(ID, o); dit("C’est enregistré ✓"); } });
  document.addEventListener("change", e => { if (e.target.id !== "fi-cad") return; const f = litFid(), v = e.target.value.trim(); if (v) { f.cadeau = v.slice(0, 40); ecritFid(f); rendu(); } });

  /* ---------- les Réglages : la fidélité ---------- */
  const v0 = VUES.re;
  VUES.re = () => { const f = litFid(), repere = '<div class="k">SMS à mes clientes</div>';
    const bloc = `<div class="k">Fidélité</div><div class="liste"><div class="ligne"><div class="t">Carte de fidélité<span>${f.on ? "Une visite de plus à chaque rendez-vous passé" : "Désactivée"}</span></div><button class="sw${f.on ? " on" : ""}" data-fi="fid-on" aria-label="Carte de fidélité"></button></div>
      ${f.on ? `<div class="ligne"><div class="t">Cadeau après</div><span class="fi-pas"><button data-fi="fid-n" data-d="-1" aria-label="Moins">−</button><b>${f.n}</b><button data-fi="fid-n" data-d="1" aria-label="Plus">+</button></span><span style="font-size:13px;opacity:.6;margin-left:8px">visites</span></div>
      <div class="ligne" style="display:block"><div class="t">Le cadeau</div><div class="fi-puces">${CADEAUX.map(c => `<button data-fi="fid-c" data-c="${c}" class="${f.cadeau === c ? "on" : ""}">${c}</button>`).join("")}</div>
        <input class="fi-in" id="fi-cad" style="width:100%;margin-top:10px" placeholder="Ou écrivez le vôtre" value="${CADEAUX.includes(f.cadeau) ? "" : esc(f.cadeau)}" maxlength="40" autocomplete="off"></div>` : ""}</div>`;
    const h = v0(); return h.includes(repere) ? h.replace(repere, bloc + repere) : h + bloc; };
})();
