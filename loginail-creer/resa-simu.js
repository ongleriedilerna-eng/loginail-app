/* Simulation : la cliente réserve sur le site de sa prothésiste (pret.html?public, page « Simulation de A à Z »).
   1 la prestation → 2 le jour et l'heure (selon ses horaires) → 3 ses coordonnées → 4 l'acompte (faux paiement) → 5 c'est réservé.
   La vraie réservation en ligne viendra après ; ici rien n'est enregistré ni payé. */
(() => {
  let simu = false; try { simu = localStorage.getItem("loginail-simu") === "1"; } catch (e) {}
  /* 05/11 : depuis l'appli (« Voir mon site »), on peut réserver comme une cliente et le rendez-vous arrive dans l'agenda */
  if (/[?&]appli=2(&|$)/.test(location.search)) simu = true;
  /* 05/11 : le VRAI site (?s=…) : la réservation va dans le coffre de la prothésiste */
  const REEL = !!window.LOGI_SLUG; if (REEL) simu = true;
  const COFFRE = "https://scfhaombuptmrlkdhcsl.supabase.co/rest/v1/rpc/", CLE = "sb_publishable_lYx1ZH0k3EFrUhZ3v0W8gw_yhGPOhbq";
  const rpc = (f, corps) => fetch(COFFRE + f, { method: "POST", headers: { apikey: CLE, "Content-Type": "application/json" }, body: JSON.stringify(corps) })
    .then(async r => { const j = await r.json().catch(() => null); if (!r.ok) throw new Error((j && j.message) || "erreur"); return j; });
  let OCC = {};
  if (!simu || !location.search.includes("public") || typeof BR === "undefined" || !BR) return;
  const tel = document.querySelector(".tel"); if (!tel) return;
  const encre = (typeof INKJ !== "undefined" && INKJ[BR.couleur]) || "#1E1C1B";
  const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
  /* 22/11 (sql/31) : le serveur reçoit ce que la cliente a VU (nom, prix, durée), pas seulement une place dans la liste */
  const vue = i => { const p = BR.prestations[i]; return { nom: p.nom ?? null, prix: p.prix ?? null, duree: p.duree ?? null }; };
  /* 22/11 : sans prix = « Sur devis », comme sur le site (avant : « 0 € ») */
  const euros = n => n == null || n === "" ? "Sur devis" : `${String(Math.round(n * 100) / 100).replace(".", ",")} €`;
  const prixDe = p => p.prix == null || p.prix === "" ? null : p.prix;
  const K = window.LOGI_PRESTA;   /* 22/11 (D80) : texte, « à partir de », photos (prestations-detail.js) */
  const choisir = (p, i) => ({ i, p, nom: p.nom, prix: prixDe(p), duree: +p.duree || 60, acompte: acompteDe(p.prix) });
  const duree = m => m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? " " + String(m % 60).padStart(2, "0") : ""}`;
  /* l'acompte choisi par la prothésiste (appli → « Bon à savoir ») */
  const acompteDe = prix => { const g = Object.assign({ acompte: true, montant: "15 €" }, BR.regles || {}); if (!g.acompte || !prix) return 0;
    const n = parseFloat(g.montant); return /%/.test(g.montant) ? Math.ceil(prix * n / 100) : Math.min(n, prix); };
  const cle = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const lis = k => { try { return JSON.parse(localStorage.getItem(k)) || null; } catch (e) { return null; } };
  /* les moments déjà pris : l'agenda de l'appli + les réservations déjà faites */
  const pris = date => { const k = cle(date); if (REEL) return OCC[k] || []; const o = (lis("loginail-occupe") || {})[k] || []; return o.concat((lis("loginail-resas") || []).filter(r => r.date === k).map(r => [r.heure, r.heure + (r.duree || 60)])); };
  const minutes = s => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
  const hm = n => `${Math.floor(n / 60)}h${String(n % 60).padStart(2, "0")}`;
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const css = document.createElement("style");
  css.textContent = `
  .rs{position:absolute;left:11px;right:11px;top:11px;bottom:11px;border-radius:53px;overflow:hidden;z-index:95;pointer-events:none;font-family:Jost,sans-serif;color:#1E1C1B}
  html.public .rs,html:not(.iph) .rs{inset:0;border-radius:0}
  .rs .rv{position:absolute;inset:0;background:rgba(20,18,17,.42);opacity:0;transition:opacity .4s}
  .rs .rf{position:absolute;left:0;right:0;bottom:0;max-height:90%;overflow-y:auto;scrollbar-width:none;background:#F6F3EF;border-radius:30px 30px 0 0;padding:12px 22px 28px;transform:translateY(105%);transition:transform .5s cubic-bezier(.2,.8,.2,1)}
  .rs.on{pointer-events:auto}.rs.on .rv{opacity:1}.rs.on .rf{transform:none}
  .rs .poi{width:40px;height:5px;border-radius:3px;background:rgba(30,28,27,.2);margin:0 auto 10px}
  .rs .x{position:absolute;top:14px;right:16px;width:36px;height:36px;border:0;border-radius:50%;background:rgba(30,28,27,.06);font:300 22px/1 Jost;cursor:pointer;color:#1E1C1B}
  .rs .ret{position:absolute;top:14px;left:16px;height:36px;border:0;background:none;font:300 14px Jost;cursor:pointer;color:#6B625C}
  .rs .simu{margin:4px auto 6px;width:max-content;font:400 10px Jost;letter-spacing:.2em;color:#6B625C;border:1px dashed rgba(30,28,27,.35);border-radius:999px;padding:6px 12px}
  .rs .kick{font:400 11px Jost;letter-spacing:.26em;color:#6B625C;margin-top:10px;text-align:center}
  .rs h2{margin:6px 0 14px;font:200 28px/1.15 Jost;text-align:center}
  .rs .pr{width:100%;display:flex;justify-content:space-between;align-items:center;gap:12px;text-align:left;border:0;background:#fff;border-radius:18px;padding:16px 18px;margin-top:8px;cursor:pointer;font:300 15.5px Jost;color:#1E1C1B}
  .rs .pr small{display:block;font:300 12.5px Jost;color:#6B625C;margin-top:3px}
  .rs .pr b{font-weight:400;white-space:nowrap}
  .rs .jours{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:4px 2px 10px;margin:0 -22px;padding-left:22px;padding-right:22px}
  .rs .jr{flex:none;width:58px;border:1px solid rgba(30,28,27,.18);background:#fff;border-radius:16px;padding:9px 0;text-align:center;cursor:pointer;font:300 12px Jost;color:#1E1C1B}
  .rs .jr b{display:block;font:300 21px Jost;margin:2px 0}
  .rs .jr:disabled{opacity:.35;cursor:default;background:none}
  .rs .jr.on{background:var(--rs);border-color:var(--rs);color:#F6F3EF}
  .rs .h{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px}
  .rs .h button{border:1px solid rgba(30,28,27,.18);background:#fff;border-radius:999px;padding:11px 0;font:300 14px Jost;cursor:pointer;color:#1E1C1B}
  .rs .h button:hover{border-color:var(--rs)}
  .rs .rien{font:300 14px Jost;color:#6B625C;text-align:center;padding:18px 0}
  .rs .pr.prd-r{display:block}
  .rs .prd-r .prd-n{display:block;font-weight:400;overflow-wrap:anywhere}
  .rs .prd-r>b{display:block;margin-top:3px;white-space:normal}
  .rs .prd-r .prd-m{font-weight:300}
  .rs .prd-r .prd-x{color:#5d554e;opacity:1}
  /* 22/11 (Marie, D80) : à la place de « Simulation », le rendez-vous qu'elle est en train de prendre */
  .rs .rdv{margin:50px 0 0;padding:12px 16px;border-radius:18px;background:#fff;box-shadow:inset 0 0 0 1.5px var(--rs);text-align:center;color:#1E1C1B;overflow-wrap:anywhere}
  .rs .rdv em{display:block;margin-bottom:5px;font:normal 400 10.5px Jost;letter-spacing:.2em;color:var(--rs)}
  .rs .rdv b{display:block;font:500 16.5px/1.3 Jost}
  .rs .rdv span{display:block;margin-top:3px;font:400 13px/1.35 Jost;color:#5d554e}
  .rs .rdv .rdv-q{font-size:14.5px;color:#1E1C1B}
  .rs .rdv+.kick{margin-top:14px}
  .rs .petit.prix-note{margin:0 4px 4px;font-weight:400;color:#5d554e}
  .rs .recap+.petit.prix-note{margin-top:10px}
  .rs .champ{width:100%;margin-top:10px;border:1px solid rgba(30,28,27,.25);border-radius:999px;padding:14px 18px;background:#fff;font:300 16px Jost;color:#1E1C1B;outline:none}
  .rs .deux{display:flex;gap:10px}
  .rs .recap{background:#FBF9F6;border-radius:20px;padding:6px 18px;margin-top:4px}
  .rs .recap div{display:flex;justify-content:space-between;gap:12px;padding:11px 0;font:300 14.5px Jost}.rs .recap div+div{border-top:1px solid rgba(30,28,27,.1)}
  .rs .recap b{font-weight:400;text-align:right}
  .rs label{display:flex;gap:12px;align-items:flex-start;margin-top:14px;font:300 13.5px/1.5 Jost;color:#5d554e;cursor:pointer}
  .rs label input{appearance:none;-webkit-appearance:none;flex:none;width:22px;height:22px;border:1.4px solid #1E1C1B;border-radius:7px;margin:0;display:grid;place-items:center;cursor:pointer}
  .rs label input:checked{background:#1E1C1B}
  .rs label input:checked::after{content:"";width:9px;height:5px;border-left:1.6px solid #F6F3EF;border-bottom:1.6px solid #F6F3EF;transform:rotate(-45deg) translate(1px,-1px)}
  .rs .go{width:100%;margin-top:16px;border:0;border-radius:999px;padding:17px;background:var(--rs);color:#F6F3EF;font:500 13px Jost;letter-spacing:.18em;cursor:pointer}
  .rs .go:disabled{opacity:.35;cursor:default}
  .rs .apay{width:100%;margin-top:16px;border:0;border-radius:999px;padding:15px;background:#000;color:#fff;font:500 19px -apple-system,system-ui,sans-serif;cursor:pointer}
  .rs .ou{display:flex;align-items:center;gap:12px;margin:14px 0 0;font:300 12.5px Jost;color:#8a8076}.rs .ou::before,.rs .ou::after{content:"";flex:1;height:1px;background:rgba(30,28,27,.15)}
  .rs .chg{margin:0 0 6px;padding:14px 16px;border-radius:18px;background:#F6E4E2;color:#7E2F2F;text-align:center;font:400 14px/1.45 Jost;overflow-wrap:anywhere}
  .rs .chg b{display:block;margin-bottom:3px;font:500 15.5px/1.35 Jost}
  .rs .petit{margin:12px 4px 0;text-align:center;font:300 12.5px/1.5 Jost;color:#8a8076}
  .rs .jr.plein{background:none;border-style:dashed}.rs .jr.plein small{display:block;font:300 9.5px Jost;letter-spacing:.04em;color:#8a8076;margin-top:1px}
  .rs .jr.plein.on{background:#fff;border-style:solid;border-color:var(--rs);color:#1E1C1B}
  .rs .att{display:block;width:100%;margin:16px 0 0;border:0;background:none;font:300 13.5px/1.5 Jost;color:#5d554e;text-align:center;cursor:pointer}
  .rs .att u{text-decoration-color:rgba(30,28,27,.35);text-underline-offset:3px}
  .rs .complet{background:#fff;border-radius:20px;padding:18px 18px 4px;margin-top:8px;text-align:center;font:300 14.5px/1.5 Jost;color:#5d554e}
  .rs .complet b{display:block;font:300 18px Jost;color:#1E1C1B;margin-bottom:4px}
  .rs .place{background:#fff;border-radius:20px;padding:14px 18px;margin:4px 0 6px;text-align:center;font:300 14px/1.45 Jost;color:#5d554e;box-shadow:inset 0 0 0 1.5px var(--rs)}
  .rs .place small{display:block;font:400 10.5px Jost;letter-spacing:.22em;color:var(--rs);margin-bottom:4px}
  .rs .place b{display:block;font:300 20px/1.25 Jost;color:#1E1C1B;margin-bottom:2px}
  .rs .ok{width:64px;height:64px;border-radius:50%;background:var(--rs);margin:16px auto 0;display:grid;place-items:center}
  .rs .ok::after{content:"";width:22px;height:11px;border-left:2px solid #F6F3EF;border-bottom:2px solid #F6F3EF;transform:rotate(-45deg) translate(2px,-3px)}`;
  document.head.append(css);
  tel.insertAdjacentHTML("beforeend", `<div class="rs" id="rs" style="--rs:${encre}"><div class="rv" data-rx></div><div class="rf" id="rf"></div></div>`);
  const rs = document.getElementById("rs"), rf = document.getElementById("rf");
  let R = {}, etape = 1, jourChoisi = null, att = 0;   /* att : 0 = non, 1 = formulaire liste d'attente, 2 = « C'est noté » */
  let jourVoulu = (location.search.match(/[?&]resa=(\d{4}-\d{2}-\d{2})/) || [])[1] || "";
  /* 19/11 (Marie) : depuis l'e-mail « Une place s'est libérée », on arrive DIRECTEMENT sur le jour et la place libérée,
     prestation déjà choisie (&p=nom), seulement les heures de la place (&de=540&a=1020, minutes) + « Voir tous les horaires » */
  const QS = new URLSearchParams(location.search);
  let prestaVoulue = QS.get("p") || "";
  let place = jourVoulu && /^\d+$/.test(QS.get("de") || "") && /^\d+$/.test(QS.get("a") || "") ? { cle: jourVoulu, d: +QS.get("de"), f: +QS.get("a"), tout: false } : null;
  const ferme = () => { rs.classList.remove("on"); document.documentElement.dataset.resa = etape >= 5 ? "5" : ""; };
  rs.querySelector("[data-rx]").onclick = ferme;
  if (typeof glisse === "function") glisse(rf, () => rf, (dx, dy) => { if (dy > 90) ferme(); }, false, e => !e.target.closest("input,button,a,label"));

  /* les 14 prochains jours, avec ses horaires */
  const prochains = () => { const t = []; const d = new Date(); d.setHours(0, 0, 0, 0);
    for (let k = 0; k < 14; k++) { const x = new Date(d); x.setDate(d.getDate() + k); const j = (x.getDay() + 6) % 7; t.push({ date: x, j, h: BR.horaires?.[j] || null }); } return t; };
  const creneaux = (jour, dur) => { if (!jour.h) return [];
    const debut = minutes(jour.h.d), fin = minutes(jour.h.f), pd = jour.h.pd && minutes(jour.h.pd), pf = jour.h.pf && minutes(jour.h.pf);
    const maintenant = new Date(), auj = jour.date.toDateString() === maintenant.toDateString(), deja = maintenant.getHours() * 60 + maintenant.getMinutes() + 60;
    const P = pris(jour.date);
    const r = []; for (let t = debut; t + dur <= fin; t += 30) { if (pd && t < pf && t + dur > pd) continue; if (auj && t < deja) continue; if (P.some(z => t < z[1] && t + dur > z[0])) continue; r.push(t); } return r; };

  /* un jour où le salon est ouvert (et, pour aujourd'hui, pas déjà fini dans moins d'une heure) */
  const ouvertJ = x => { if (!x.h) return false; const m = new Date(); return x.date.toDateString() !== m.toDateString() || m.getHours() * 60 + m.getMinutes() + 60 < minutes(x.h.f); };
  function dessine() {
    document.documentElement.dataset.resa = String(etape);
    const tete = `<div class="poi"></div><button class="x" data-rx aria-label="Fermer">×</button>${etape > 1 && etape < 5 ? `<button class="ret" data-ret>‹ Retour</button>` : ""}`;
    /* son rendez-vous reste en haut : la prestation, puis le jour, puis l'heure */
    const quand = q => q ? `<span class="rdv-q">${esc(q.charAt(0).toUpperCase() + q.slice(1))}</span>` : "";
    const carte = q => R.p ? `<div class="rdv"><em>VOTRE PRESTATION</em><b>${esc(R.nom)}</b>${quand(q)}<span>${esc(K.meta({ ...R.p, duree: R.duree }))}</span></div>` : "";
    const avant = R.p && K.note(R.p) ? `<p class="petit prix-note">${K.note(R.p)}</p>` : "";
    /* venue en touchant sa prestation : il ne lui reste que 3 pas */
    const pas = k => R.direct ? `${k - 1} / 3` : `${k} / 4`;
    if (etape === 1) rf.innerHTML = tete + `<div class="kick">1 / 4</div><h2>Votre prestation</h2>` +
      BR.prestations.map((p, i) => `<button class="pr prd-r" data-p="${i}"><span class="prd-n">${esc(p.nom)}</span><b>${K.metaHtml(p)}</b>${K.corps(p)}</button>`).join("");
    if (etape === 2 && att) { const jt = jourChoisi.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
      rf.innerHTML = att === 2 ? `<div class="poi"></div><button class="x" data-rx aria-label="Fermer">×</button><div class="ok"></div>
        <h2 style="margin-top:14px">C’est noté !</h2><p class="petit" style="font-size:14px;color:#5d554e">Si une place se libère ${esc(jt)}, vous recevez un e-mail tout de suite.<br>La première qui réserve a la place.</p>
        <button class="go" data-att-fin>J’AI COMPRIS</button>`
      : tete.replace(/<button class="ret" data-ret>/, '<button class="ret" data-att-ret>') + carte(jt) + `<div class="kick">LISTE D’ATTENTE</div><h2>Prévenez-moi</h2>
        <div class="deux"><input class="champ" id="ap" placeholder="Prénom" autocomplete="given-name"><input class="champ" id="at" type="tel" placeholder="Téléphone" autocomplete="tel"></div>
        <input class="champ" id="ae" type="email" placeholder="E-mail" autocomplete="email">
        <button class="go" id="ago" disabled>ME PRÉVENIR</button>
        <p class="petit">Vous recevez un e-mail si une place se libère ce jour-là. Vos coordonnées sont effacées après ce jour.</p><p class="petit aerr" style="color:#A04A4A"></p>`;
      rf.scrollTop = 0; return; }
    if (etape === 2) { const P = prochains();
      /* 18/11 : « &resa=2026-11-24 » (lien de l'e-mail de la liste d'attente) → ce jour-là directement */
      if (!jourChoisi && jourVoulu) { jourChoisi = P.find(x => cle(x.date) === jourVoulu && ouvertJ(x)) || null; jourVoulu = ""; }
      if (!jourChoisi) jourChoisi = P.find(x => creneaux(x, R.duree).length) || P.find(ouvertJ) || P[0];
      const ici = place && !place.tout && cle(jourChoisi.date) === place.cle;
      const c = creneaux(jourChoisi, R.duree).filter(t => !ici || (t >= place.d && t + R.duree <= place.f));
      const jt = jourChoisi.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
      /* 18/11 (liste d'attente) : un jour complet n'est plus grisé, on peut le toucher pour demander à être prévenue ; seul un jour fermé reste grisé */
      rf.innerHTML = tete + carte() + `<div class="kick">${pas(2)}</div><h2>Le jour et l’heure</h2><div class="jours">${P.map((x, k) => { const n = creneaux(x, R.duree).length, o = ouvertJ(x);
          return `<button class="jr ${x.date.getTime() === jourChoisi.date.getTime() ? "on" : ""}${o && !n ? " plein" : ""}" data-j="${k}" ${o ? "" : "disabled"}>${JOURS[x.j].slice(0, 3)}<b>${x.date.getDate()}</b>${o && !n ? "<small>complet</small>" : x.date.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "")}</button>`; }).join("")}</div>
        ${ici ? `<div class="place"><small>UNE PLACE S’EST LIBÉRÉE</small><b>${esc(jt.charAt(0).toUpperCase() + jt.slice(1))}</b>${c.length ? `entre ${hm(place.d)} et ${hm(place.f)} · choisissez votre heure` : "elle vient d’être prise, désolée"}</div>` : ""}
        ${c.length ? `<div class="h">${c.map(t => `<button data-t="${t}">${hm(t)}</button>`).join("")}</div>${ici ? `<button class="att" data-tout><u>Voir tous les horaires</u></button>` : `<button class="att" data-att>Aucun horaire ne vous va ? <u>Prévenez-moi si une place se libère</u></button>`}`
          : ici ? `<button class="att" data-tout><u>Voir tous les horaires</u></button>`
          : ouvertJ(jourChoisi) ? `<div class="complet"><b>Ce jour est complet</b>Laissez vos coordonnées : si une place se libère, vous êtes prévenue par e-mail.<button class="go" data-att style="margin:14px 0">PRÉVENEZ-MOI</button></div>`
          : `<div class="rien">Pas de créneau ce jour-là.</div>`}`;
      rf._P = P; }
    if (etape === 3) rf.innerHTML = tete + carte(`${R.jourTxt} à ${hm(R.heure)}`) + `<div class="kick">${pas(3)}</div><h2>Vos coordonnées</h2>${avant}
      <div class="deux"><input class="champ" id="rp" placeholder="Prénom" autocomplete="given-name"><input class="champ" id="rn" placeholder="Nom" autocomplete="family-name"></div>
      <input class="champ" id="rt" type="tel" placeholder="Téléphone" autocomplete="tel"><input class="champ" id="re" type="email" placeholder="E-mail" autocomplete="email">
      <label><input type="checkbox" id="ranniv"><span>Je veux bien un petit SMS pour mon anniversaire 🎂 <small style="color:#8a8076">(une fois par an, facultatif)</small></span></label>
      <label><input type="checkbox" id="rc"><span>J’accepte les <a href="#" data-legp="cgv">conditions de réservation</a> du salon et sa <a href="#" data-legp="conf">politique de confidentialité</a>.</span></label>
      <button class="go" id="rgo" disabled>CONTINUER</button>`;
    if (etape === 4 && REEL) rf.innerHTML = tete + carte(`${R.jourTxt} à ${hm(R.heure)}`) + `<div class="kick">${pas(4)}</div><h2>On confirme ?</h2>
      ${R.acompte ? `<div class="recap"><div><span>Acompte</span><b>${euros(R.acompte)}</b></div></div>` : ""}${avant}
      <button class="go" data-reel>CONFIRMER MA RÉSERVATION</button>
      ${R.acompte ? `<p class="petit">Le salon vous dira comment régler l’acompte.</p>` : ""}<p class="petit rerr" style="color:#A04A4A"></p>`;
    else if (etape === 4 && !R.acompte) rf.innerHTML = tete + carte(`${R.jourTxt} à ${hm(R.heure)}`) + `<div class="kick">${pas(4)}</div><h2>On confirme ?</h2>${avant}
      <button class="go" data-paye>CONFIRMER MA RÉSERVATION</button>`;
    else if (etape === 4) rf.innerHTML = tete + carte(`${R.jourTxt} à ${hm(R.heure)}`) + `<div class="kick">${pas(4)}</div><h2>L’acompte</h2>
      <div class="recap"><div><span>Acompte à payer maintenant</span><b>${euros(R.acompte)}</b></div><div><span>Le reste, au salon</span><b>${K.type(R.p) === "fixe" ? euros(R.prix - R.acompte) : "selon le prix final"}</b></div></div>${avant}
      <button class="apay" data-paye><svg viewBox="0 0 17 20" style="width:17px;height:20px;vertical-align:-3px;margin-right:3px"><path fill="currentColor" d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9C3.6 4.8 2 5.8 1.1 7.4c-1.9 3.2-.5 8 1.3 10.6.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-2.9 1.4-3-.1 0-2.9-1.1-3-4.4zM11.5 2.9c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z"/></svg>Pay</button><div class="ou"><span>ou par carte</span></div>
      <input class="champ" placeholder="Numéro de carte" autocomplete="off"><div class="deux"><input class="champ" placeholder="MM / AA" autocomplete="off"><input class="champ" placeholder="CVC" autocomplete="off"></div>
      <button class="go" data-paye>PAYER L’ACOMPTE</button>
      <p class="petit">Simulation : aucun argent n’est pris. L’acompte est celui choisi par la prothésiste dans « Bon à savoir ».</p>`;
    if (etape === 5) rf.innerHTML = `<div class="poi"></div><button class="x" data-rx aria-label="Fermer">×</button><div class="ok"></div>
      <h2 style="margin-top:14px">C’est réservé !</h2>
      <div class="recap"><div><span>Prestation</span><b>${esc(R.nom)}</b></div><div><span>Quand</span><b>${R.jourTxt} à ${hm(R.heure)}</b></div><div><span>Où</span><b>${esc(BR.nom)}<br>${esc(BR.rue)}, ${esc(BR.cp)} ${esc(BR.ville)}</b></div>${REEL ? "" : `<div><span>Acompte payé</span><b>${euros(R.acompte)}</b></div>`}</div>
      ${REEL ? `<p class="petit">Le salon a bien reçu votre réservation.${R.email ? ` Un e-mail de confirmation part à ${esc(R.email)} : il contient aussi le lien pour annuler, si besoin.` : ""}</p>` : `<p class="petit">Ceci est un exemple : aucun rendez-vous n’est réservé.</p>
      <button class="go" id="rsms">VOIR MES MESSAGES</button>`}`;
    rf.scrollTop = 0;
  }
  async function chargeOcc() { if (!REEL) return; const a = new Date(), b = new Date(); b.setDate(b.getDate() + 15);
    try { const l = await rpc("moments_pris", { s: window.LOGI_SLUG, de: cle(a), a: cle(b) }); OCC = {};
      (l || []).forEach(m => { const d = new Date(m.debut), f = new Date(m.fin), k = cle(d); (OCC[k] = OCC[k] || []).push([d.getHours() * 60 + d.getMinutes(), f.getHours() * 60 + f.getMinutes() + (cle(f) !== k ? 1440 : 0)]); }); } catch (e) {} }
  /* la prestation touchée n'est plus là, ou a changé : rien n'est enregistré, on lui remontre la liste à jour */
  async function prestaChangee() {
    const nom = R.nom;
    let aJour = false;
    try { const b = await rpc("lire_site", { s: window.LOGI_SLUG }); if (b && Array.isArray(b.prestations)) { BR.prestations = b.prestations; aJour = true; } } catch (e) {}
    R = {}; att = 0; jourChoisi = null; etape = 1; dessine();
    rf.querySelector("h2").insertAdjacentHTML("afterend", `<div class="chg" role="alert"><b>« ${esc(nom)} » vient d’être modifiée ou retirée par le salon.</b>Rien n’a été enregistré. ${aJour ? "Choisissez dans la liste à jour." : "Rechargez la page pour voir la liste à jour."}</div>`);
  }
  async function ouvre(ligne) { if (etape >= 5 || att === 2) { R = {}; etape = 1; jourChoisi = null; } att = 0;
    /* 22/11 (Marie) : « tu me remets pas tout ça » — elle a touché sa prestation, on ne lui remontre pas la liste */
    const i = ligne ? indexDe(ligne) : -1;
    if (i >= 0) { R = choisir(BR.prestations[i], i); R.direct = true; jourChoisi = null; etape = 2; }
    else if (R.direct && etape === 2) { R = {}; etape = 1; jourChoisi = null; }   /* « Réserver » tout court : elle n'a rien choisi */
    await chargeOcc();
    /* 19/11 : lien de l'e-mail → sa prestation est déjà choisie, on ouvre sur « Le jour et l'heure » */
    if (prestaVoulue) { const i = BR.prestations.findIndex(p => String(p.nom).trim() === prestaVoulue.trim()); prestaVoulue = "";
      if (i >= 0) { const p = BR.prestations[i]; R = choisir(p, i); jourChoisi = null; etape = 2; } }
    dessine(); rs.classList.add("on"); }
  /* la place de la ligne touchée ; le nom fait foi si la liste a été relue entre-temps */
  function indexDe(ligne) {
    const nom = ligne.dataset.pn, i = +ligne.dataset.pi, l = BR.prestations || [];
    if (l[i] && String(l[i].nom ?? "") === nom) return i;
    const k = l.map((p, n) => String(p.nom ?? "") === nom ? n : -1).filter(n => n >= 0);
    return k.length === 1 ? k[0] : -1;
  }
  /* 18/11 : en arrivant par le lien « Réserver cette place » de l'e-mail, la réservation s'ouvre toute seule */
  if (jourVoulu) setTimeout(() => ouvre(), 600);
  /* « Réserver » sur son site ouvre la réservation (au lieu du message « étape 5 ») */
  document.addEventListener("click", ev => { if (ev.target.closest(".rs")) return; const b = ev.target.closest("[data-res]"); if (!b) return; ev.preventDefault(); ev.stopPropagation(); ouvre(b.closest("[data-pi]")); }, true);
  rf.addEventListener("click", ev => {
    const t = ev.target.closest("button"); if (!t) return;
    if (t.hasAttribute("data-rx")) return ferme();
    if (t.hasAttribute("data-ret")) {
      if (R.direct && etape === 2) { R = {}; etape = 1; jourChoisi = null; return ferme(); }   /* retour = le site, là où elle a touché */
      etape--; return dessine(); }
    /* 18/11 · liste d'attente */
    if (t.hasAttribute("data-att")) { att = 1; return dessine(); }
    if (t.hasAttribute("data-tout")) { if (place) place.tout = true; return dessine(); }
    if (t.hasAttribute("data-att-ret")) { att = 0; return dessine(); }
    if (t.hasAttribute("data-att-fin")) { att = 0; R = {}; etape = 1; jourChoisi = null; return ferme(); }
    if (t.id === "ago") { const p = rf.querySelector("#ap").value.trim(), tl = rf.querySelector("#at").value.trim(), em = rf.querySelector("#ae").value.trim(), z = rf.querySelector(".aerr");
      if (!REEL) { att = 2; return dessine(); }
      t.disabled = true; t.textContent = "UN INSTANT…";
      rpc("attendre", { s: window.LOGI_SLUG, p_jour: cle(jourChoisi.date), p_presta: R.i, p_prenom: p, p_tel: tl, p_email: em, p_choisie: vue(R.i) })
        .then(() => { att = 2; dessine(); })
        .catch(e => { const m = String(e.message || ""); if (m === "prestation_changee") return prestaChangee();
          t.disabled = false; t.textContent = "ME PRÉVENIR";
          if (z) z.textContent = m === "email" ? "Vérifiez votre e-mail." : m === "coordonnees" ? "Vérifiez votre prénom et votre téléphone." : /^(trop|plein)$/.test(m) ? "La liste d’attente est pleine pour l’instant. Appelez le salon." : "Ça n’a pas marché. Réessayez, ou appelez le salon."; });
      return; }
    if (t.dataset.p) { const p = BR.prestations[+t.dataset.p]; R = choisir(p, +t.dataset.p); jourChoisi = null; etape = 2; return dessine(); }
    if (t.dataset.j) { jourChoisi = rf._P[+t.dataset.j]; return dessine(); }
    if (t.dataset.t) { R.heure = +t.dataset.t; R.date = jourChoisi.date.toISOString(); R.jour = cle(jourChoisi.date); R.jourTxt = jourChoisi.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }); etape = 3; return dessine(); }
    if (t.id === "rgo") { R.prenom = rf.querySelector("#rp").value.trim(); R.nomC = rf.querySelector("#rn").value.trim(); R.tel = rf.querySelector("#rt").value.trim(); R.email = rf.querySelector("#re").value.trim(); R.okAnniv = !!rf.querySelector("#ranniv")?.checked; etape = 4; return dessine(); }
    if (t.hasAttribute("data-paye")) { t.textContent = t.classList.contains("go") ? "PAIEMENT ACCEPTÉ ✓" : "✓";
      setTimeout(() => { etape = 5; try { localStorage.setItem("loginail-resa", JSON.stringify({ ...R, salon: BR.nom, rue: BR.rue, cp: BR.cp, ville: BR.ville, placeId: BR.placeId }));
        const L = lis("loginail-resas") || []; L.push({ id: Date.now(), date: R.jour, heure: R.heure, duree: R.duree, prenom: R.prenom, nom: R.nomC, tel: R.tel, email: R.email, okAnniv: !!R.okAnniv, presta: R.nom, prix: R.prix, acompte: R.acompte, vu: false }); localStorage.setItem("loginail-resas", JSON.stringify(L)); } catch (e) {} dessine(); }, 900); return; }
    if (t.hasAttribute("data-reel")) { t.disabled = true; t.textContent = "UN INSTANT…"; const d = new Date(jourChoisi.date); d.setMinutes(R.heure);
      rpc("reserver", { s: window.LOGI_SLUG, p_presta: R.i, p_debut: d.toISOString(), p_prenom: R.prenom, p_nom: R.nomC, p_tel: R.tel, p_email: R.email, p_ok_anniv: !!R.okAnniv, p_choisie: vue(R.i) })
        .then(() => { etape = 5; dessine(); })
        .catch(async e => { const m = String(e.message || ""); const z = rf.querySelector(".rerr");
          if (m === "prestation_changee") return prestaChangee();
          if (/pris/.test(m)) { await chargeOcc(); etape = 2; dessine(); const k = rf.querySelector(".rien,.h"); if (k) k.insertAdjacentHTML("beforebegin", `<p class="petit" style="color:#A04A4A">Ce créneau vient d’être pris, choisissez-en un autre.</p>`); return; }
          if (z) z.textContent = "La réservation n’a pas marché. Réessayez, ou appelez le salon."; t.disabled = false; t.textContent = "CONFIRMER MA RÉSERVATION"; }); return; }
    if (t.id === "rsms") { location.href = "sms-simu.html"; }
  });
  rf.addEventListener("input", () => { const a = rf.querySelector("#ago");
    if (a) a.disabled = !(rf.querySelector("#ap").value.trim() && rf.querySelector("#at").value.replace(/\D/g, "").length >= 10 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rf.querySelector("#ae").value.trim()));
    const g = rf.querySelector("#rgo"); if (!g) return;
    g.disabled = !(rf.querySelector("#rp").value.trim() && rf.querySelector("#rt").value.trim().replace(/\D/g, "").length >= 10 && rf.querySelector("#rc").checked); });
  rf.addEventListener("change", () => rf.dispatchEvent(new Event("input")));
})();
