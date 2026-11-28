/* ===== 22/11 (Marie : « b la grille jadore », point 8, D92) =====
   Flèche sur « Agenda » → Jour / Semaine / Mois. Maquette : maquettes/agenda-vues-2211/b.html.
   22/11 (Marie : « il n'y a que le prénom ») : chaque case de la semaine dit l'heure, le prénom et la pose.
   Pour que ça tienne, les heures chargées sont plus hautes que les heures vides (voir repartit) ; on ne descend que si la semaine est trop pleine.
   La semaine et le mois n'ont pas de .pap : glisser la journée et déplacer un rendez-vous restent des gestes du mode Jour. */
(function () {
  const CLE = "loginail-agenda-vue", MODES = [["jour", "Jour"], ["semaine", "Semaine"], ["mois", "Mois"]];
  let mode = localStorage.getItem(CLE); if (!MODES.some(m => m[0] === mode)) mode = "jour";
  let moisVu = null, jourVu = "", entre = "", occupe = false, avale = 0;
  /* 27/11 (Marie choisit A) : en Semaine, le mois en grand entre les flèches, les dates dessous */
  { const s2 = document.createElement("style");
    s2.textContent = `#E .nav-sem.av-ng span{text-align:center;line-height:1.1}
#E .nav-sem.av-ng b{display:block;font:400 30px/1.05 Italiana,'Cormorant Garamond',Georgia,serif;color:var(--v-acc,#B5475E);letter-spacing:.01em}
#E .nav-sem.av-ng small{display:block;margin-top:2px;font-size:13px;font-weight:500;color:var(--v-fonce,#1E1C1B)}
#E .vue[data-p="ag"] .nav-sem>span{cursor:pointer;-webkit-user-select:none;user-select:none;transition:opacity .12s}
#E .vue[data-p="ag"] .nav-sem>span:active{opacity:.55}
#E .vue[data-p="ag"] .nav-sem.av-ng>span>b::after,#E .vue[data-p="ag"] .nav-sem:not(.av-ng)>span::after{content:"";display:inline-block;width:11px;height:11px;margin-left:5px;vertical-align:middle;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'%3E%3Cpath d='M2 5l5 5 5-5' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'%3E%3Cpath d='M2 5l5 5 5-5' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat}
#E .vue[data-p="ag"] .nav-sem.av-ng>span>b::after{width:12px;height:12px;margin-left:6px;vertical-align:.12em}
#E .av-voile{position:absolute;inset:0;z-index:78;background:rgba(246,238,236,.6);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);animation:av-voile .2s ease-out both}
#E .av-verre{position:absolute;z-index:79;box-sizing:border-box;padding:14px 12px 12px;border-radius:28px;background:#FFFDFC;-webkit-backdrop-filter:blur(22px) saturate(1.4);backdrop-filter:blur(22px) saturate(1.4);border:1px solid rgba(255,255,255,.95);box-shadow:0 30px 60px -28px rgba(80,30,40,.45);transform-origin:50% 0;animation:av-verre .22s cubic-bezier(.2,.9,.25,1) both}
#E .av-verre-an{display:flex;align-items:center;justify-content:space-between;margin:0 2px 6px}
#E .av-verre-an b{font:500 15px Jost,sans-serif;letter-spacing:.08em}
#E .av-verre-an button{width:40px;height:40px;padding:0;border:0;border-radius:50%;background:rgba(30,28,27,.05);color:var(--v-fonce,#1E1C1B);font-size:18px;cursor:pointer}
#E .av-verre-an button:disabled{opacity:.25;cursor:default}
#E .av-verre-g{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}
#E .av-verre-g button{position:relative;min-width:0;height:60px;padding:0 2px;border:0;border-radius:20px;background:none;color:var(--v-fonce,#1E1C1B);font:500 12.5px/1 Jost,sans-serif;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;cursor:pointer;transition:background .15s,transform .1s}
#E .av-verre-g button:active{transform:scale(.95)}
#E .av-verre-g button small{display:block;height:12px;margin-top:7px;font:400 10.5px/12px Jost,sans-serif;letter-spacing:.02em;text-transform:none;color:#7A716B}
#E .av-verre-g button.passe{color:#B9B0AA}
#E .av-verre-g button.on{background:var(--v-h2,#F6E1E5);color:var(--v-acc,#B5475E)}
#E .av-verre-g button.on small{color:var(--v-acc,#B5475E)}
#E .av-verre-g button.auj:not(.on):after{content:"";position:absolute;left:50%;top:9px;width:5px;height:5px;margin-left:-2.5px;border-radius:50%;background:var(--v-acc,#B5475E)}
@media (max-width:350px){#E .av-verre-g button{font-size:11px;letter-spacing:.1em}}
@media (max-height:700px){#E .av-verre-g button{height:50px}#E .av-verre-g button small{margin-top:5px}#E .av-verre{padding-top:10px}}
@keyframes av-voile{from{opacity:0}}
@keyframes av-verre{from{opacity:0;transform:translateY(-8px) scale(.96)}}
@media (prefers-reduced-motion:reduce){#E .av-voile,#E .av-verre{animation:none}}`;
    document.head.appendChild(s2); }

  const st = document.createElement("style");
  st.textContent = `#E .av-titre{display:inline-grid;grid-template-columns:auto auto;align-items:center;justify-items:start;column-gap:5px;text-align:left;min-height:44px;margin:0;padding:0;border:0;background:none;color:inherit;font:inherit;cursor:pointer}
#E .av-titre svg{flex:none;width:13px;height:13px;transition:transform .2s}
#E .av-titre[aria-expanded=true] svg{transform:rotate(180deg)}
#E .av-titre small.av-mode{grid-column:1/-1;display:block;margin-top:1px;font:400 12px/15px Jost,sans-serif;color:var(--gris)}
#E .av-tete .v-ronds{margin-bottom:11px}
#E .av-tete .su-auj2{padding:0 11px!important;font-size:13px!important}
#E .av-tete .su-auj2 svg{display:none}
#E .av-menu{position:absolute;z-index:60;min-width:214px;padding:6px;border-radius:18px;background:#fff;box-shadow:0 18px 40px -14px rgba(0,0,0,.42);transform-origin:top left;animation:av-menu .17s ease-out both}
#E .av-menu small{display:block;padding:8px 14px 4px;font-size:12px;color:#7A716B}
#E .av-menu button{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:50px;padding:0 14px;border:0;border-radius:12px;background:none;color:inherit;font:inherit;font-size:16px;cursor:pointer}
#E .av-menu button.on{background:rgba(30,28,27,.06)}
#E .av-cache{display:none!important}
#E .av-z{box-sizing:border-box;overflow:hidden;border:1px solid rgba(30,28,27,.07);border-radius:22px;background:#fff;touch-action:pan-y;-webkit-user-select:none;user-select:none}
#E .av-z.av-arrive{animation:av-arrive .2s ease-out both}
#E .av-z.av-g1{animation:av-g1 .22s ease-out both}
#E .av-z.av-g-1{animation:av-g-1 .22s ease-out both}
#E .av-g{display:grid;grid-template-columns:26px repeat(7,minmax(0,1fr));grid-template-rows:44px minmax(0,1fr);padding:0 3px 5px 0}
#E .av-g .av-tj{height:44px;min-width:0;padding:4px 0;border:0;background:none;color:inherit;font:inherit;font-size:10.5px;line-height:1.15;cursor:pointer}
#E .av-g.defile{overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none;padding-bottom:84px}
#E .av-g.defile::-webkit-scrollbar{display:none}
#E .av-g.defile>.av-tj,#E .av-g.defile>em{position:sticky;top:0;z-index:3;background:#fff}
#E .av-tj b{display:block;font-weight:500;font-size:14px}
#E .av-tj.auj b{color:var(--v-acc,#B5475E)}
#E .av-col,#E .av-hh{position:relative;min-width:0}
#E .av-col{border-left:1px solid rgba(30,28,27,.07);cursor:pointer}
#E .av-col.ferme{background:#F4F1EE}
#E .av-hh i{position:absolute;right:3px;font:400 10px Jost,sans-serif;color:#7A716B;transform:translateY(-50%)}
#E .av-col u{position:absolute;left:0;right:0;height:1px;background:rgba(30,28,27,.05);pointer-events:none}
#E .av-col s{position:absolute;left:0;right:0;height:2px;background:var(--v-acc,#B5475E);pointer-events:none;z-index:2}
#E .av-b{position:absolute;box-sizing:border-box;min-height:12px;margin:0;overflow:hidden;display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;padding:1px 1px 0 2px;border:0;border-radius:6px;background:var(--v-h1,#EFCFD3);color:inherit;font:400 9px/10px Jost,sans-serif;text-align:left;cursor:pointer}
#E .av-b>span{display:block;flex:none;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;letter-spacing:-.01em}
#E .av-b>.av-h{text-overflow:clip}
#E .av-b>.av-n{font-weight:500;font-size:9.6px}
#E .av-b>.av-p{font-size:8.8px}
#E .av-b.bloc{background:#E6E0DA}
#E .av-b.fini{background:var(--v-h2,#F8EBED);color:#51474A}
#E .av-b.bloc.fini{background:#EEEAE6}
#E .av-b.etroit{padding:1px 0 0 1px}
#E .av-b.abs{background:repeating-linear-gradient(135deg,#F1ECE6 0 5px,#E9E2DA 5px 10px)}
#E .av-m{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));grid-auto-rows:minmax(0,1fr);padding:8px}
#E .av-m>small{display:grid;place-items:center;font-size:11px;color:#7A716B}
#E .av-m button{min-width:0;padding:0;border:0;border-radius:12px;background:none;color:inherit;font:inherit;font-size:15px;line-height:1.1;cursor:pointer}
#E .av-m button.auj{color:var(--v-acc,#B5475E);font-weight:500}
#E .av-m button i{display:block;height:13px;font-style:normal;font-size:10.5px;white-space:nowrap;color:var(--v-acc,#B5475E)}
#E .av-jours{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:14px}
#E .av-jours button{min-height:60px;border:0;border-radius:16px;background:#fff;color:inherit;font:inherit;font-size:12.5px;cursor:pointer}
#E .av-jours b{display:block;font-size:19px;font-weight:500}
@media (max-width:350px){#E .v-avecban .av-tete>div:first-child{padding-left:9px;padding-right:9px}#E .av-tete{gap:6px}#E .av-tete h1{font-size:25px}#E .av-tete .su-auj2{padding:0 8px!important;font-size:12px!important;height:36px}#E .av-tete .v-ronds{gap:4px}#E .av-tete .v-rondb{width:36px;height:36px;min-width:36px}#E .av-g{grid-template-columns:18px repeat(7,minmax(0,1fr));padding-right:1px}#E .av-hh i{right:2px;font-size:9px}#E .av-b{padding:1px 0 0 1px;font-size:8px;line-height:9px}#E .av-b>.av-n{font-size:8.4px}#E .av-b>.av-p{font-size:7.8px}}
@keyframes av-menu{from{opacity:.2;transform:translateY(-4px)}}
@keyframes av-arrive{from{opacity:.2;transform:translateY(-4px)}}
@keyframes av-g1{from{opacity:.2;transform:translateX(34px)}}
@keyframes av-g-1{from{opacity:.2;transform:translateX(-34px)}}
@media (prefers-reduced-motion:reduce){#E .av-menu,#E .av-z{animation:none!important;transition:none!important}}`;
  document.head.appendChild(st);

  const min = d => d.getHours() * 60 + d.getMinutes();
  /* 25/11 (Marie) : en semaine, le prénom + la 1re lettre du nom (« Léa D. »), pour ne pas confondre deux Léa */
  const qui = r => (r.clientes ? (r.clientes.prenom ? r.clientes.prenom + ((r.clientes.nom || "").trim() ? " " + r.clientes.nom.trim()[0].toUpperCase() + "." : "") : nomCli(r.clientes)) : r.titre) || "Bloqué";
  const iso = d => esc(d.toISOString());

  /* la case est étroite : le mot qui compte passe en premier (« Pose gel - Remplissage » → « Rempli. gel ») */
  const pose = t => String(t).split(" + ").map(p => p
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/^pose\s+(.+?)\s*[-–—:]\s*(remplissage|première pose)$/i, "$2 $1")
    .replace(/première pose/i, "1re pose")
    .replace(/remplissage/i, "Rempli.")
    .replace(/^beauté des /i, "Beauté ")
    .replace(/semi[\s-]+permanente?/i, "Semi")
    .trim()).join(" + ");

  /* ---------- la semaine ---------- */
  function grille() {
    const J = [0, 1, 2, 3, 4, 5, 6].map(i => plusJours(S.lundi, i)), HOR = ((brouillon() || (S.site && S.site.donnees) || {}).horaires) || [];
    let [A, B] = heuresAgenda().map(x => x * 60);
    if (localStorage.getItem("loginail-agenda-horaires") === "oui") {
      const h = HOR.filter(x => x && x.d && x.f), mn = t => +t.slice(0, 2) * 60 + +t.slice(3, 5);
      if (h.length) { A = Math.floor(Math.min(...h.map(x => mn(x.d))) / 60) * 60; B = Math.ceil(Math.max(...h.map(x => mn(x.f))) / 60) * 60; }
    }
    const R7 = J.map(j => S.rdv.filter(r => r.statut !== "annule" && memeJour(new Date(r.debut), j)).map(r => {
      const d = new Date(r.debut), f = new Date(r.fin), entier = f - d > 20 * 36e5;
      return { r, entier, a: min(d), b: memeJour(d, f) ? min(f) : 1440 };
    }).sort((x, y) => x.a - y.a || y.b - x.b));
    /* un congé d'une journée n'étire pas la grille de 0 h à 24 h */
    R7.flat().forEach(x => { if (!x.entier) { A = Math.min(A, Math.floor(x.a / 60) * 60); B = Math.max(B, Math.ceil(x.b / 60) * 60); } });
    R7.forEach(l => {
      let groupe = [], fin = -1;
      const clot = () => { const n = Math.max(1, ...groupe.map(x => x.col + 1)); groupe.forEach(x => { x.n = n; }); groupe = []; };
      l.forEach(x => {
        if (x.entier) { x.a = A; x.b = B; }
        if (x.a >= fin) clot();
        let c = 0; while (groupe.some(y => y.col === c && y.b > x.a)) c++;
        x.col = c; groupe.push(x); fin = Math.max(fin, x.b);
      });
      clot();
    });
    const pc = m => ((Math.max(A, Math.min(B, m)) - A) / (B - A) * 100).toFixed(3) + "%", H = [], now = new Date(), mn0 = min(now);
    for (let m = A + 60; m < B; m += 60) H.push(m);
    const traits = H.map(m => `<u data-m="${m}" style="top:${pc(m)}"></u>`).join("");
    return `<div class="av-z av-g${entre}" data-av-z data-debut="${A}" data-fin="${B}"><em></em>${J.map((j, i) => `<button class="av-tj${memeJour(j, now) ? " auj" : ""}" data-av-j="${iso(j)}" aria-label="${JOURS[i]} ${j.getDate()} : ouvrir la journée">${COURT[i].toLowerCase()}.<b>${j.getDate()}</b></button>`).join("")}<div class="av-hh">${H.map(m => `<i data-m="${m}" style="top:${pc(m)}">${m / 60}</i>`).join("")}</div>${J.map((j, i) => `<div class="av-col${HOR[i] === null ? " ferme" : ""}" data-av-j="${iso(j)}">${traits}${memeJour(j, now) && mn0 > A && mn0 < B ? `<s data-m="${mn0}" style="top:${pc(mn0)}"></s>` : ""}${R7[i].map(x => {
      const nom = String(qui(x.r)), quoi = x.r.cliente_id ? titreRdv(x.r) : "", deb = new Date(x.r.debut), cl = (x.r.cliente_id ? "" : " bloc") + (x.r.statut === "fini" ? " fini" : x.r.statut === "absente" ? " abs" : "") + (x.n > 1 ? " etroit" : "");
      return `<button class="av-b${cl}" data-rdv="${esc(x.r.id)}" data-de="${Math.max(A, x.a)}" data-a-min="${Math.min(B, x.b)}"${x.entier ? " data-entier" : ""} aria-label="${esc(`${nom}, ${hm(deb)} – ${hm(new Date(x.r.fin))}${quoi ? ", " + quoi : ""}`)}" style="top:${pc(x.a)};height:calc(${((Math.min(B, x.b) - Math.max(A, x.a)) / (B - A) * 100).toFixed(3)}% - 1px);left:calc(${(x.col / x.n * 100).toFixed(2)}% + 1px);width:calc(${(100 / x.n).toFixed(2)}% - 2px)">${x.entier ? "" : `<span class="av-h">${hm(deb)}</span>`}<span class="av-n${x.r.cliente_id ? "" : " av-p"}">${esc(nom)}</span>${quoi ? `<span class="av-p">${esc(pose(quoi))}</span>` : ""}</button>`; }).join("")}</div>`).join("")}</div>`;
  }

  /* ---------- le mois ---------- */
  const LU = {};   /* au-delà de 1 000 rendez-vous, le serveur ne rend pas tout : on lit le mois affiché */
  async function litMois(m) {
    const k = m.getTime(); if (LU[k] && Date.now() - LU[k].t < 60000) return;
    LU[k] = { t: Date.now(), l: LU[k] ? LU[k].l : null };
    try {
      const { data, error } = await sb.from("rendez_vous").select("id,cliente_id,debut,statut").gte("debut", m.toISOString()).lt("debut", new Date(m.getFullYear(), m.getMonth() + 1, 1).toISOString());
      if (error) throw error;
      LU[k].l = data || []; if (mode === "mois" && S.onglet === "ag") rendu();
    } catch (e) { console.error(e); }
  }
  function leMois() {
    if (!moisVu) moisVu = new Date(S.jour.getFullYear(), S.jour.getMonth(), 1);
    return moisVu;
  }
  function calendrier() {
    const m = leMois(), tous = S.tous || [], trop = tous.length >= 1000;
    if (trop) litMois(m);
    const par = new Map(), N = {}, now = new Date();
    ((trop && LU[m.getTime()] && LU[m.getTime()].l) || tous).concat(S.rdv).forEach(r => par.set(r.id, r));
    par.forEach(r => { if (!r.cliente_id || r.statut === "annule") return; const d = new Date(r.debut); if (d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear()) N[d.getDate()] = (N[d.getDate()] || 0) + 1; });
    let h = ["L", "M", "M", "J", "V", "S", "D"].map(x => `<small>${x}</small>`).join("") + "<span></span>".repeat((m.getDay() + 6) % 7);
    const n = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= n; i++) { const d = new Date(m.getFullYear(), m.getMonth(), i); h += `<button data-av-j="${iso(d)}"${memeJour(d, now) ? ' class="auj"' : ""}>${i}<i>${N[i] ? N[i] + " rdv" : ""}</i></button>`; }
    return `<div class="av-z av-m${entre}" data-av-z>${h}</div>`;
  }

  /* ---------- l'écran ---------- */
  const ag0 = VUES.ag;
  VUES.ag = () => {
    const h0 = ag0(), cle = S.jour.toDateString();
    if (cle !== jourVu) { jourVu = cle; moisVu = null; }   /* Aujourd'hui, ou une date choisie : le mois suit */
    const f = document.createElement("div"); f.innerHTML = h0;
    const t = f.querySelector(".tete"), h1 = t && t.querySelector("h1"); if (!h1) return h0;
    t.classList.add("av-tete");
    /* 22/11 (Marie) : en tout petit sous « Agenda », la vue où elle est */
    h1.innerHTML = '<button class="av-titre" data-av="menu" aria-haspopup="menu" aria-expanded="false"><span>Agenda</span><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' + `<small class="av-mode">${MODES.find(m => m[0] === mode)[1]}</small></button>`;
    const ns = f.querySelector(".nav-sem>span"); if (ns) { ns.setAttribute("role", "button"); ns.setAttribute("aria-haspopup", "dialog"); ns.title = "Choisir un mois"; }   /* 28/11 : toucher = tous les mois */
    const pap = f.querySelector(".pap"); if (mode === "jour" || !pap) return f.innerHTML;
    f.querySelector(".semaine")?.classList.add("av-cache");
    f.querySelector(".nav-sem .v-ferme")?.remove();   /* en semaine et en mois, ça ne parle pas d'un seul jour */
    const k = [...f.querySelectorAll(".k")].find(x => /rendez-vous/.test(x.textContent)), nav = f.querySelector(".nav-sem");
    if (mode === "semaine") {
      const fin = plusJours(S.lundi, 7), n = S.rdv.filter(r => r.cliente_id && r.statut !== "annule" && new Date(r.debut) >= S.lundi && new Date(r.debut) < fin).length;
      /* 27/11 (Marie : « j'avais pas capté que c'est la semaine de décembre », « il faut écrire le mois en grand, pas ma semaine ») :
         le mois de la semaine (celui du jeudi : 30 nov. → 6 déc. = décembre) écrit en grand entre les flèches, les dates dessous. */
      const L = S.lundi, F = plusJours(L, 6), J = plusJours(L, 3), nomM = MOIS[J.getMonth()].replace(/^./, c => c.toUpperCase());
      const dates = L.getMonth() === F.getMonth() ? `${L.getDate()} – ${F.getDate()} ${MOISC[F.getMonth()]}` : `${L.getDate()} ${MOISC[L.getMonth()]} – ${F.getDate()} ${MOISC[F.getMonth()]}`;
      const sm = t.querySelector("small"); if (sm && !sm.classList.contains("av-mode")) sm.textContent = nomM + " " + J.getFullYear();
      if (k) k.textContent = n ? `${n} rendez-vous cette semaine` : "Aucun rendez-vous cette semaine";
      if (nav) { nav.classList.add("av-ng"); nav.querySelector("span").innerHTML = `<b>${nomM}</b><small>${dates}</small>`; }
      pap.outerHTML = grille();
    } else {
      pap.outerHTML = calendrier();
      const m = leMois();
      /* 24/11 (Marie) : le petit titre au-dessus d'« Agenda » suit le mois affiché (il restait sur « Novembre 2026 » en décembre) */
      const sm = t.querySelector("small"); if (sm) sm.textContent = MOIS[m.getMonth()].replace(/^./, c => c.toUpperCase()) + " " + m.getFullYear();
      if (k) k.textContent = "Touche un jour pour l’ouvrir";
      if (nav) {
        nav.querySelector("span").textContent = MOIS[m.getMonth()].replace(/^./, c => c.toUpperCase()) + " " + m.getFullYear();
        nav.querySelectorAll("button").forEach((b, i) => { b.removeAttribute("data-a"); b.dataset.avMois = i ? 1 : -1; b.setAttribute("aria-label", i ? "Mois d’après" : "Mois d’avant"); });
      }
    }
    entre = "";
    return f.innerHTML;
  };

  /* Chaque minute reçoit au moins ce qu'il faut à ses rendez-vous pour leurs lignes ; le reste de la place se partage entre toutes.
     L'échelle est la même dans les 7 colonnes : deux rendez-vous à la même heure restent face à face. */
  /* au dixième de point : scrollWidth arrondit, et « 10:00 » finissait en « 10:… » */
  const mesure = document.createRange();
  const tropLarge = t => { mesure.selectNodeContents(t); return mesure.getBoundingClientRect().width > t.getBoundingClientRect().width + .02; };
  const vu = { semaine: 0, haut: 0 };
  document.addEventListener("scroll", e => {
    const z = e.target;
    if (z.classList && z.classList.contains("av-g")) { vu.semaine = +S.lundi; vu.haut = z.scrollTop; }
  }, true);
  function repartit(z, dispo) {
    const cases = [...z.querySelectorAll(".av-b")], cle = [dispo, z.clientWidth].join();
    if (z.dataset.cale === cle) return;
    z.dataset.cale = cle;
    const A = +z.dataset.debut, B = +z.dataset.fin, n = B - A, AUTOUR = 51;   /* les dates (44) + le bas (5) + les bords (2) */
    const lg = cases.length ? parseFloat(getComputedStyle(cases[0]).lineHeight) : 10, faut = new Array(n).fill(11 / 60);   /* 11 par heure : le chiffre de l'heure se lit */
    cases.forEach(c => {
      const a = +c.dataset.de - A, b = +c.dataset.aMin - A;
      if (c.hasAttribute("data-entier") || b <= a) return;
      const parMin = (c.children.length * lg + 3) / (b - a);
      for (let i = a; i < b; i++) faut[i] = Math.max(faut[i], parMin);
    });
    const mini = faut.reduce((s, v) => s + v, 0), place = Math.max(dispo - AUTOUR, mini), total = c => faut.reduce((s, v) => s + Math.max(v, c), 0);
    let bas = 0, haut = place / n;
    for (let i = 0; i < 24; i++) { const c = (bas + haut) / 2; if (total(c) > place) haut = c; else bas = c; }
    const Y = [0]; faut.forEach(v => Y.push(Y[Y.length - 1] + Math.max(v, bas)));
    const y = m => Y[Math.max(0, Math.min(n, Math.round(m) - A))];
    /* l'écran Agenda ne descend pas : si la semaine est trop pleine, c'est la grille qui défile, sous ses dates */
    const deborde = mini > dispo - AUTOUR + .5;
    z.style.height = dispo + "px";
    z.classList.toggle("defile", deborde);
    z.style.gridTemplateRows = deborde ? `44px ${Math.ceil(place)}px` : "";
    z.querySelectorAll("[data-m]").forEach(t => { t.style.top = y(+t.dataset.m) + "px"; });
    cases.forEach(c => {
      const a = y(+c.dataset.de), h = y(+c.dataset.aMin) - a - 1;
      c.style.top = a + "px"; c.style.height = h + "px";
      const p = c.querySelector(".av-p");
      if (p) {
        const lignes = Math.max(1, Math.floor((h - 1) / lg + .01) - c.children.length + 1);
        p.style.maxHeight = lignes * lg + "px"; p.style.whiteSpace = lignes > 1 ? "normal" : "nowrap";
      }   /* jamais une ligne coupée en deux */
      [...c.children].forEach(t => {   /* un mot trop large rapetisse un peu, puis finit par « … » */
        t.style.fontSize = "";
        let f = parseFloat(getComputedStyle(t).fontSize); const petit = !c.classList.contains("etroit") ? 7 : t.classList.contains("av-h") ? 5.8 : 6.4;
        while (f > petit && tropLarge(t)) { f = Math.max(petit, f - .3); t.style.fontSize = f + "px"; }
      });
    });
    if (deborde && vu.semaine === +S.lundi) z.scrollTop = vu.haut;   /* l'écran se redessine : elle reste où elle était */
  }
  if (document.fonts) document.fonts.addEventListener("loadingdone", () => { E.querySelectorAll("[data-cale]").forEach(z => z.removeAttribute("data-cale")); cale(); });

  /* la zone prend la place qui reste au-dessus de la barre du bas */
  function cale() {
    const z = E.querySelector(".vue.on [data-av-z]"); if (!z) return;
    const e = E.getBoundingClientRect(), ech = e.width / E.offsetWidth || 1, o = E.querySelector(".ong"), ro = o && o.getBoundingClientRect();
    let haut = 0; for (let x = z; x && x !== E; x = x.offsetParent) haut += x.offsetTop;   /* sans l'animation d'arrivée */
    const bas = ro && ro.height ? (ro.top - e.top) / ech : E.offsetHeight, dispo = Math.max(180, Math.round(bas - haut - 12)), v = dispo + "px";
    if (z.hasAttribute("data-debut")) return repartit(z, dispo);
    if (z.style.height !== v) z.style.height = v;
  }
  new MutationObserver(() => {
    cale();
    if (E.querySelector(".av-menu") && (S.onglet !== "ag" || E.classList.contains("fe"))) menu(false);
  }).observe(E, { childList: true, subtree: true });
  addEventListener("resize", () => { menu(false); cale(); });

  function menu(on) {
    E.querySelector(".av-menu")?.remove();
    const b = E.querySelector(".vue.on .av-titre"); if (!b) return;
    b.setAttribute("aria-expanded", !!on); if (!on) return;
    const r = b.getBoundingClientRect(), e = E.getBoundingClientRect(), ech = e.width / E.offsetWidth || 1;
    E.insertAdjacentHTML("beforeend", `<div class="av-menu" role="menu" style="left:${(r.left - e.left) / ech}px;top:${(r.bottom - e.top) / ech + 2}px"><small>Afficher</small>${MODES.map(([k, t]) => `<button data-av="${k}" class="${mode === k ? "on" : ""}" role="menuitemradio" aria-checked="${mode === k}">${t}<span>${mode === k ? "✓" : ""}</span></button>`).join("")}</div>`);
  }
  const passe = m => { mode = m; try { localStorage.setItem(CLE, m); } catch (e) {} };

  /* une autre semaine, une autre date : si le réseau manque, on reste où on était */
  async function va(jour, apres) {
    if (occupe) return;
    occupe = true;
    const avant = { jour: S.jour, lundi: S.lundi, mode }, lundi = lundiDe(jour);
    S.jour = jour; S.lundi = lundi;
    try { if (+lundi !== +avant.lundi) await chargeSemaine(); if (apres) apres(); }
    catch (e) { console.error(e); S.jour = avant.jour; S.lundi = avant.lundi; passe(avant.mode); dit("Pas de réseau : réessaie dans un instant"); }
    occupe = false; rendu();
  }
  function tourne(d) {
    entre = " av-g" + d;
    if (mode === "mois") { const m = leMois(); moisVu = new Date(m.getFullYear(), m.getMonth() + d, 1); return rendu(); }
    va(plusJours(S.jour, 7 * d));
  }

  /* 28/11 (Marie : « je suis le 23/29 novembre et je dois aller jusqu'en février, ça fait loin ») :
     toucher le mois écrit au milieu (« ‹ Novembre › », ou les dates en Jour et en Mois) ouvre tous les mois ; un mois touché = on y est.
     2 touches au lieu de 10. Maquette : maquettes/agenda-sauter-mois-2811. */
  const NOM_M = d => MOIS[d.getMonth()].replace(/^./, c => c.toUpperCase());
  function moisRegarde() {
    if (mode === "mois") return leMois();
    if (mode === "semaine") { const J = plusJours(S.lundi, 3); return new Date(J.getFullYear(), J.getMonth(), 1); }   /* le mois du jeudi, comme le titre */
    return new Date(S.jour.getFullYear(), S.jour.getMonth(), 1);
  }
  /* 28/11 (Marie choisit « le verre », écriture 2 · Majuscules ; maquette maquettes/agenda-sauter-mois-2811/ecriture) :
     un panneau de verre sous le mois, l'année entière d'un coup d'œil, ‹ › pour changer d'année, le nombre de rendez-vous sous chaque mois. */
  let anP = 0;
  function rdvParMois(an) {
    const par = new Map(), N = {};
    (S.tous || []).concat(S.rdv || []).forEach(r => par.set(r.id, r));
    par.forEach(r => { if (!r.cliente_id || r.statut === "annule") return; const d = new Date(r.debut); if (d.getFullYear() === an) N[d.getMonth()] = (N[d.getMonth()] || 0) + 1; });
    return N;
  }
  function panneau(ouvrir) {
    E.querySelectorAll(".av-verre,.av-voile").forEach(x => x.remove());
    const nav = E.querySelector('.vue.on[data-p="ag"] .nav-sem'); if (!ouvrir || !nav) return;
    if (ouvrir === true) anP = moisRegarde().getFullYear();
    const auj = new Date(), vu = moisRegarde(), N = rdvParMois(anP), A = auj.getFullYear();
    const r = nav.getBoundingClientRect(), e = E.getBoundingClientRect(), ech = e.width / E.offsetWidth || 1;
    const g = MOIS.map((x, m) => {
      const passe = anP < A || (anP === A && m < auj.getMonth()), on = anP === vu.getFullYear() && m === vu.getMonth(), ce = anP === A && m === auj.getMonth();
      return `<button data-av-aller="${anP}-${m}" class="${passe ? "passe" : ""}${on ? " on" : ""}${ce ? " auj" : ""}"${on ? ' aria-current="true"' : ""}>${esc(x)}<small>${N[m] ? N[m] + " rdv" : ""}</small></button>`;
    }).join("");
    E.insertAdjacentHTML("beforeend", `<div class="av-voile" data-av-voile></div><div class="av-verre" role="dialog" aria-label="Choisir un mois" style="left:${(r.left - e.left) / ech}px;width:${r.width / ech}px;top:${(r.bottom - e.top) / ech + 4}px"><div class="av-verre-an"><button data-av-an="-1" aria-label="Année d’avant"${anP <= A - 1 ? " disabled" : ""}>‹</button><b>${anP}</b><button data-av-an="1" aria-label="Année d’après"${anP >= A + 2 ? " disabled" : ""}>›</button></div><div class="av-verre-g">${g}</div></div>`);
  }
  addEventListener("scroll", () => { if (E.querySelector(".av-verre")) panneau(false); }, true);
  addEventListener("resize", () => panneau(false));
  addEventListener("keydown", e => { if (e.key === "Escape" && E.querySelector(".av-verre")) panneau(false); });
  function allerAuMois(an, mo) {
    const auj = new Date(), ici = an === auj.getFullYear() && mo === auj.getMonth();
    entre = " av-arrive";
    if (mode === "mois") { moisVu = new Date(an, mo, 1); return rendu(); }
    /* ce mois-ci : on revient à aujourd'hui. Sinon le 1er du mois ; en Semaine, si le 1er tombe un vendredi, samedi ou dimanche,
       sa semaine porterait le nom du mois d'avant : on prend le lundi d'après (le titre dit bien le mois choisi). */
    let j = ici ? auj : new Date(an, mo, 1);
    if (!ici && mode === "semaine" && [5, 6, 0].includes(j.getDay())) j = plusJours(lundiDe(j), 7);
    S.papY = null; va(j);
  }

  /* 22/11 (Marie : « j'appuie à 15 h, ça me remet sur Jour ») : l'heure touchée dans une colonne de la semaine.
     Les heures n'ont pas toutes la même hauteur (repartit) : on lit la place réelle des traits. Le chiffre est à cheval
     sur son trait, donc toucher juste au-dessus compte pour cette heure. Si l'heure commence par un rendez-vous, on propose sa fin. */
  function minuteTouchee(col, y, jour) {
    let m = +col.parentElement.dataset.debut;
    col.querySelectorAll("u[data-m]").forEach(u => { if (u.getBoundingClientRect().top <= y + 5) m = +u.dataset.m; });
    S.rdv.filter(r => r.statut !== "annule" && memeJour(new Date(r.debut), jour))
      .map(r => [min(new Date(r.debut)), memeJour(new Date(r.fin), jour) ? min(new Date(r.fin)) : 1440])
      .sort((a, b) => a[0] - b[0]).forEach(([a, b]) => { if (a <= m && b > m && b < 1440) m = b; });
    return m;
  }

  /* Sur téléphone, le toucher est « aimanté » par le bouton voisin, jusqu'à 14 px : une heure vide ouvrait la date (donc le Jour)
     ou le rendez-vous d'à côté. On garde le point réel du doigt ; à 3 px ou moins d'un rendez-vous, c'est bien lui qu'elle visait. */
  let doigt = null;
  addEventListener("touchstart", e => { const p = e.touches.length === 1 && e.touches[0]; doigt = p ? { x: p.clientX, y: p.clientY, t: Date.now() } : null; }, { capture: true, passive: true });
  function colonneTouchee(e) {
    const p = doigt && Date.now() - doigt.t < 1000 ? doigt : null; doigt = null;
    const cible = e.target, vise = cible.closest(".av-b,.av-tj");
    if (p && cible.closest('.av-g,[data-a="nouveau"]')) {   /* le « + » flottant aimante aussi */
      const vrai = document.elementFromPoint(p.x, p.y), col = vrai && !vrai.closest(".av-b") && vrai.closest(".av-col");
      if (col) {
        if (vise && vise.classList.contains("av-b")) { const r = vise.getBoundingClientRect(); if (Math.hypot(Math.max(0, r.left - p.x, p.x - r.right), Math.max(0, r.top - p.y, p.y - r.bottom)) <= 3) return null; }
        return { col, y: p.y };
      }
    }
    const col = !vise && cible.closest(".av-col");
    return col ? { col, y: e.clientY } : null;
  }

  addEventListener("click", e => {
    const t = e.target; if (!t.closest) return;
    const ouvert = E.querySelector(".av-menu");
    if (ouvert && !t.closest(".av-menu")) { e.preventDefault(); e.stopPropagation(); return menu(false); }
    if (E.querySelector(".av-verre") && !t.closest(".av-verre,[data-av-voile]")) panneau(false);   /* un autre onglet, un autre bouton : le verre se range */
    if (S.onglet !== "ag") return;
    if (Date.now() - avale < 400 && t.closest("[data-av-z],.nav-sem")) { e.preventDefault(); e.stopPropagation(); return; }
    const stop = () => { e.preventDefault(); e.stopPropagation(); };
    const a = t.closest("[data-av]");
    if (a) {
      stop();
      if (a.dataset.av === "menu") return menu(!ouvert);
      menu(false); passe(a.dataset.av); moisVu = null; entre = " av-arrive"; return rendu();
    }
    if (t.closest("[data-av-choisi]")) {
      stop(); S.jour = new Date(t.closest("[data-av-choisi]").dataset.avChoisi); return feuilleNouveau(null);
    }
    const m = t.closest("[data-av-mois]"); if (m) { stop(); return tourne(+m.dataset.avMois); }
    const al = t.closest("[data-av-aller]");
    if (al) { stop(); panneau(false); const [an, mo] = al.dataset.avAller.split("-").map(Number); return allerAuMois(an, mo); }
    const y = t.closest("[data-av-an]"); if (y) { stop(); if (!y.disabled) { anP += +y.dataset.avAn; panneau("annee"); } return; }
    if (t.closest("[data-av-voile]")) { stop(); return panneau(false); }
    if (t.closest(".av-verre")) { stop(); return; }
    if (t.closest('.vue.on[data-p="ag"] .nav-sem>span')) { stop(); return panneau(!E.querySelector(".av-verre")); }
    /* une heure vide de la semaine : on ajoute, sans quitter la semaine (la date en haut ouvre toujours la journée) */
    const touche = colonneTouchee(e);
    if (touche) {
      stop(); if (occupe) return;
      const jour = new Date(touche.col.dataset.avJ), m = minuteTouchee(touche.col, touche.y, jour);
      S.jour = jour; S.papY = null;
      return window.__feuilleCreneau ? window.__feuilleCreneau(m) : feuilleNouveau(m);
    }
    if (mode !== "jour" && !E.classList.contains("fe") && t.closest('[data-a="nouveau"]')) {
      /* le « + » ne devine pas le jour : il serait parti sur le dernier jour regardé */
      stop();
      if (mode === "mois") return dit("Touche d’abord le jour");
      return ouvre(`<h3>Quel jour ?</h3><div class="sous">Pour ton nouveau rendez-vous</div><div class="av-jours">${[0, 1, 2, 3, 4, 5, 6].map(i => { const d = plusJours(S.lundi, i); return `<button data-av-choisi="${iso(d)}">${COURT[i].toLowerCase()}.<b>${d.getDate()}</b></button>`; }).join("")}</div>`);
    }
    if (t.closest("[data-rdv]")) return;
    const j = t.closest("[data-av-j]");
    if (j) { stop(); S.papY = null; va(new Date(j.dataset.avJ), () => passe("jour")); }
  }, true);
  addEventListener("keydown", e => { if (e.key === "Escape" && E.querySelector(".av-menu")) menu(false); });

  /* glisser dans la grille ou sur « Du … au … » : la semaine (ou le mois) d'après, d'avant */
  let G = null;
  document.addEventListener("touchstart", e => {
    G = null;
    if (mode === "jour" || S.onglet !== "ag" || occupe || E.classList.contains("fe") || S.moisOuvert || e.touches.length !== 1 || !e.target.closest) return;
    if (!e.target.closest('.vue.on[data-p="ag"] [data-av-z],.vue.on[data-p="ag"] .nav-sem')) return;
    if (e.target.closest(".nav-sem")) e.stopPropagation();   /* sinon le glissé de la bande des jours (cachée ici) le prend */
    G = { x: e.touches[0].clientX, y: e.touches[0].clientY, dx: 0, t: Date.now(), z: E.querySelector(".vue.on [data-av-z]"), on: false };
  }, { capture: true, passive: true });
  document.addEventListener("touchmove", e => {
    if (!G) return;
    const dx = e.touches[0].clientX - G.x, dy = e.touches[0].clientY - G.y;
    if (!G.on) { if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return; if (Math.abs(dy) >= Math.abs(dx)) { G = null; return; } G.on = true; }
    if (e.cancelable) e.preventDefault();
    e.stopPropagation(); G.dx = dx;
    if (G.z) { G.z.style.animation = "none"; G.z.style.transition = "none"; G.z.style.transform = `translateX(${dx}px)`; G.z.style.opacity = Math.max(.35, 1 - Math.abs(dx) / 420); }
  }, { capture: true, passive: false });
  const lache = e => {
    if (!G) return;
    const g = G; G = null; if (!g.on) return;
    avale = Date.now();
    const oui = e.type !== "touchcancel" && (Math.abs(g.dx) > 55 || (Math.abs(g.dx) > 18 && Date.now() - g.t < 250));
    if (g.z) { g.z.style.transition = "transform .2s ease-out,opacity .2s"; g.z.style.transform = oui ? `translateX(${g.dx < 0 ? -60 : 60}px)` : ""; g.z.style.opacity = oui ? ".25" : ""; }
    if (oui) tourne(g.dx < 0 ? 1 : -1);
  };
  document.addEventListener("touchend", lache, true);
  document.addEventListener("touchcancel", lache, true);
})();
