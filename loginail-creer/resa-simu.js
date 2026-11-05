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
  const euros = n => `${String(Math.round(n * 100) / 100).replace(".", ",")} €`;
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
  .rs .petit{margin:12px 4px 0;text-align:center;font:300 12.5px/1.5 Jost;color:#8a8076}
  .rs .ok{width:64px;height:64px;border-radius:50%;background:var(--rs);margin:16px auto 0;display:grid;place-items:center}
  .rs .ok::after{content:"";width:22px;height:11px;border-left:2px solid #F6F3EF;border-bottom:2px solid #F6F3EF;transform:rotate(-45deg) translate(2px,-3px)}`;
  document.head.append(css);
  tel.insertAdjacentHTML("beforeend", `<div class="rs" id="rs" style="--rs:${encre}"><div class="rv" data-rx></div><div class="rf" id="rf"></div></div>`);
  const rs = document.getElementById("rs"), rf = document.getElementById("rf");
  let R = {}, etape = 1, jourChoisi = null;
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

  function dessine() {
    document.documentElement.dataset.resa = String(etape);
    const tete = `<div class="poi"></div><button class="x" data-rx aria-label="Fermer">×</button>${etape > 1 && etape < 5 ? `<button class="ret" data-ret>‹ Retour</button>` : ""}${REEL ? "" : `<div class="simu">SIMULATION · RÉSERVATION</div>`}`;
    if (etape === 1) rf.innerHTML = tete + `<div class="kick">1 / 4</div><h2>Votre prestation</h2>` +
      BR.prestations.map((p, i) => `<button class="pr" data-p="${i}"><span>${esc(p.nom)}<small>${p.duree ? duree(p.duree) : ""}</small></span><b>${euros(p.prix)}</b></button>`).join("");
    if (etape === 2) { const P = prochains(); if (!jourChoisi) jourChoisi = P.find(x => creneaux(x, R.duree).length) || P[0];
      const c = creneaux(jourChoisi, R.duree);
      rf.innerHTML = tete + `<div class="kick">2 / 4</div><h2>Le jour et l’heure</h2><div class="jours">${P.map((x, k) => `<button class="jr ${x.date.getTime() === jourChoisi.date.getTime() ? "on" : ""}" data-j="${k}" ${creneaux(x, R.duree).length ? "" : "disabled"}>${JOURS[x.j].slice(0, 3)}<b>${x.date.getDate()}</b>${x.date.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "")}</button>`).join("")}</div>
        ${c.length ? `<div class="h">${c.map(t => `<button data-t="${t}">${hm(t)}</button>`).join("")}</div>` : `<div class="rien">Pas de créneau ce jour-là.</div>`}`;
      rf._P = P; }
    if (etape === 3) rf.innerHTML = tete + `<div class="kick">3 / 4</div><h2>Vos coordonnées</h2>
      <div class="recap"><div><span>${esc(R.nom)}</span><b>${euros(R.prix)}</b></div><div><span>${R.jourTxt}</span><b>${hm(R.heure)}</b></div></div>
      <div class="deux"><input class="champ" id="rp" placeholder="Prénom" autocomplete="given-name"><input class="champ" id="rn" placeholder="Nom" autocomplete="family-name"></div>
      <input class="champ" id="rt" type="tel" placeholder="Téléphone" autocomplete="tel"><input class="champ" id="re" type="email" placeholder="E-mail" autocomplete="email">
      <label><input type="checkbox" id="ranniv"><span>Je veux bien un petit SMS pour mon anniversaire 🎂 <small style="color:#8a8076">(une fois par an, facultatif)</small></span></label>
      <label><input type="checkbox" id="rc"><span>J’accepte les <a href="#" data-legp="cgv">conditions de réservation</a> du salon et sa <a href="#" data-legp="conf">politique de confidentialité</a>.</span></label>
      <button class="go" id="rgo" disabled>CONTINUER</button>`;
    if (etape === 4 && REEL) rf.innerHTML = tete + `<div class="kick">4 / 4</div><h2>On confirme ?</h2>
      <div class="recap"><div><span>${esc(R.nom)}</span><b>${euros(R.prix)}</b></div><div><span>Quand</span><b>${R.jourTxt} à ${hm(R.heure)}</b></div>${R.acompte ? `<div><span>Acompte</span><b>${euros(R.acompte)}</b></div>` : ""}</div>
      <button class="go" data-reel>CONFIRMER MA RÉSERVATION</button>
      ${R.acompte ? `<p class="petit">Le paiement de l’acompte en ligne arrive bientôt : le salon vous dira comment le régler.</p>` : ""}<p class="petit rerr" style="color:#A04A4A"></p>`;
    else if (etape === 4) rf.innerHTML = tete + `<div class="kick">4 / 4</div><h2>L’acompte</h2>
      <div class="recap"><div><span>${esc(R.nom)} · ${R.jourTxt} à ${hm(R.heure)}</span><b>${euros(R.prix)}</b></div><div><span>Acompte à payer maintenant</span><b>${euros(R.acompte)}</b></div><div><span>Le reste, au salon</span><b>${euros(R.prix - R.acompte)}</b></div></div>
      <button class="apay" data-paye><svg viewBox="0 0 17 20" style="width:17px;height:20px;vertical-align:-3px;margin-right:3px"><path fill="currentColor" d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9C3.6 4.8 2 5.8 1.1 7.4c-1.9 3.2-.5 8 1.3 10.6.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-2.9 1.4-3-.1 0-2.9-1.1-3-4.4zM11.5 2.9c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z"/></svg>Pay</button><div class="ou"><span>ou par carte</span></div>
      <input class="champ" placeholder="Numéro de carte" autocomplete="off"><div class="deux"><input class="champ" placeholder="MM / AA" autocomplete="off"><input class="champ" placeholder="CVC" autocomplete="off"></div>
      <button class="go" data-paye>PAYER L’ACOMPTE</button>
      <p class="petit">Simulation : aucun argent n’est pris. L’acompte est celui choisi par la prothésiste dans « Bon à savoir ».</p>`;
    if (etape === 5) rf.innerHTML = `<div class="poi"></div><button class="x" data-rx aria-label="Fermer">×</button>${REEL ? "" : `<div class="simu">SIMULATION · RÉSERVATION</div>`}<div class="ok"></div>
      <h2 style="margin-top:14px">C’est réservé !</h2>
      <div class="recap"><div><span>Prestation</span><b>${esc(R.nom)}</b></div><div><span>Quand</span><b>${R.jourTxt} à ${hm(R.heure)}</b></div><div><span>Où</span><b>${esc(BR.nom)}<br>${esc(BR.rue)}, ${esc(BR.cp)} ${esc(BR.ville)}</b></div>${REEL ? "" : `<div><span>Acompte payé</span><b>${euros(R.acompte)}</b></div>`}</div>
      ${REEL ? `<p class="petit">Le salon a bien reçu votre réservation.</p>` : `<p class="petit">Un SMS de confirmation vient de partir au ${esc(R.tel)}.</p>
      <button class="go" id="rsms">VOIR MES MESSAGES</button>`}`;
    rf.scrollTop = 0;
  }
  async function chargeOcc() { if (!REEL) return; const a = new Date(), b = new Date(); b.setDate(b.getDate() + 15);
    try { const l = await rpc("moments_pris", { s: window.LOGI_SLUG, de: cle(a), a: cle(b) }); OCC = {};
      (l || []).forEach(m => { const d = new Date(m.debut), f = new Date(m.fin), k = cle(d); (OCC[k] = OCC[k] || []).push([d.getHours() * 60 + d.getMinutes(), f.getHours() * 60 + f.getMinutes() + (cle(f) !== k ? 1440 : 0)]); }); } catch (e) {} }
  async function ouvre() { if (etape >= 5) { R = {}; etape = 1; jourChoisi = null; } await chargeOcc(); dessine(); rs.classList.add("on"); }
  /* « Réserver » sur son site ouvre la réservation (au lieu du message « étape 5 ») */
  document.addEventListener("click", ev => { if (ev.target.closest(".rs")) return; const b = ev.target.closest("[data-res]"); if (!b) return; ev.preventDefault(); ev.stopPropagation(); ouvre(); }, true);
  rf.addEventListener("click", ev => {
    const t = ev.target.closest("button"); if (!t) return;
    if (t.hasAttribute("data-rx")) return ferme();
    if (t.hasAttribute("data-ret")) { etape--; return dessine(); }
    if (t.dataset.p) { const p = BR.prestations[+t.dataset.p]; R = { i: +t.dataset.p, nom: p.nom, prix: p.prix || 0, duree: p.duree || 60, acompte: acompteDe(p.prix) }; jourChoisi = null; etape = 2; return dessine(); }
    if (t.dataset.j) { jourChoisi = rf._P[+t.dataset.j]; return dessine(); }
    if (t.dataset.t) { R.heure = +t.dataset.t; R.date = jourChoisi.date.toISOString(); R.jour = cle(jourChoisi.date); R.jourTxt = jourChoisi.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }); etape = 3; return dessine(); }
    if (t.id === "rgo") { R.prenom = rf.querySelector("#rp").value.trim(); R.nomC = rf.querySelector("#rn").value.trim(); R.tel = rf.querySelector("#rt").value.trim(); R.email = rf.querySelector("#re").value.trim(); R.okAnniv = !!rf.querySelector("#ranniv")?.checked; etape = 4; return dessine(); }
    if (t.hasAttribute("data-paye")) { t.textContent = t.classList.contains("go") ? "PAIEMENT ACCEPTÉ ✓" : "✓";
      setTimeout(() => { etape = 5; try { localStorage.setItem("loginail-resa", JSON.stringify({ ...R, salon: BR.nom, rue: BR.rue, cp: BR.cp, ville: BR.ville, placeId: BR.placeId }));
        const L = lis("loginail-resas") || []; L.push({ id: Date.now(), date: R.jour, heure: R.heure, duree: R.duree, prenom: R.prenom, nom: R.nomC, tel: R.tel, email: R.email, okAnniv: !!R.okAnniv, presta: R.nom, prix: R.prix, acompte: R.acompte, vu: false }); localStorage.setItem("loginail-resas", JSON.stringify(L)); } catch (e) {} dessine(); }, 900); return; }
    if (t.hasAttribute("data-reel")) { t.disabled = true; t.textContent = "UN INSTANT…"; const d = new Date(jourChoisi.date); d.setMinutes(R.heure);
      rpc("reserver", { s: window.LOGI_SLUG, p_presta: R.i, p_debut: d.toISOString(), p_prenom: R.prenom, p_nom: R.nomC, p_tel: R.tel, p_email: R.email, p_ok_anniv: !!R.okAnniv })
        .then(() => { etape = 5; dessine(); })
        .catch(async e => { const m = String(e.message || ""); const z = rf.querySelector(".rerr");
          if (/pris/.test(m)) { await chargeOcc(); etape = 2; dessine(); const k = rf.querySelector(".rien,.h"); if (k) k.insertAdjacentHTML("beforebegin", `<p class="petit" style="color:#A04A4A">Ce créneau vient d’être pris, choisissez-en un autre.</p>`); return; }
          if (z) z.textContent = "La réservation n’a pas marché. Réessayez, ou appelez le salon."; t.disabled = false; t.textContent = "CONFIRMER MA RÉSERVATION"; }); return; }
    if (t.id === "rsms") { location.href = "sms-simu.html"; }
  });
  rf.addEventListener("input", () => { const g = rf.querySelector("#rgo"); if (!g) return;
    g.disabled = !(rf.querySelector("#rp").value.trim() && rf.querySelector("#rt").value.trim().replace(/\D/g, "").length >= 10 && rf.querySelector("#rc").checked); });
  rf.addEventListener("change", () => rf.dispatchEvent(new Event("input")));
})();
