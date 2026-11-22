/* ===== 22/11 (Marie) : rester appuyée sur une cliente de la liste (dans tous les tris) → petit menu Épingler · Modifier · Supprimer.
   Les clientes épinglées s'affichent en haut de la liste, dans « Épinglées » (elles restent aussi à leur place).
   L'épingle est gardée dans le compte (comme l'ordre des carrés de la fiche) : même liste sur tous ses appareils. ===== */
(function () {
  /* 22/11 (Marie : « Oui, corrige ») : l'enregistrement dans le compte ne partait jamais (window.sb n'existe pas, sb est un const).
     - le téléphone garde les CHANGEMENTS pas encore envoyés ({ id: épinglée ou non }), jamais une liste entière qui écraserait celle d'un autre téléphone ;
     - avant d'écrire, on relit le compte et on y applique ces changements ;
     - les épingles d'avant la correction, jamais envoyées, montent toutes seules à la 1re ouverture ;
     - 50 au plus dans le compte : cette liste voyage dans chaque demande au serveur, trop longue elle bloquerait l'appli. */
  const MAX = 50, MEM = {};
  const demo = () => !!window.SB_DEMO;
  const cle = () => "loginail-epingle-" + ((S.user && S.user.id) || "x"), cleA = () => cle() + "-attente";
  const prend = k => { if (k in MEM) return MEM[k]; try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } };
  const garde = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); delete MEM[k]; } catch (e) { MEM[k] = v; } };
  const duTel = () => { const l = prend(cle()); return Array.isArray(l) ? l : []; };
  const duCompte = u => { const l = u && u.user_metadata && u.user_metadata.clientes_epinglees; return Array.isArray(l) ? l : []; };
  const attente = () => { const a = prend(cleA()); return a ? a : Object.fromEntries(duTel().slice().reverse().map(id => [id, true])); };
  const applique = (l, a) => Object.keys(a).filter(id => a[id] && !l.includes(id)).reverse().concat(l.filter(id => a[id] !== false));
  const lit = () => !S.user ? [] : demo() ? duTel() : applique(duCompte(S.user), attente());

  let enCours = false, encore = false;
  async function accorde() {
    if (!S.user || demo()) return;
    if (enCours) { encore = true; return; }
    enCours = true;
    const qui = S.user.id, pareil = () => !!S.user && S.user.id === qui;
    try {
      const { data, error } = await sb.auth.getUser();
      if (error || !data || !data.user || data.user.id !== qui || !pareil()) return;
      const base = duCompte(data.user), envoi = attente(), tout = applique(base, envoi);
      /* trop d'épingles : celles qui dépassent restent dans ce téléphone */
      let place = Math.max(0, MAX - base.filter(id => envoi[id] !== false).length);
      const pris = {};
      Object.keys(envoi).reverse().forEach(id => { if (envoi[id] === false || base.includes(id)) pris[id] = envoi[id]; else if (place > 0) { place--; pris[id] = true; } });
      const l = tout.filter(id => base.includes(id) || pris[id]);
      if (l.join() !== base.join()) {
        const r = await sb.auth.updateUser({ data: { clientes_epinglees: l } });
        if (r.error) return;
      }
      if (!pareil()) return;
      const avant = lit().join(), reste = attente();   /* elle a pu épingler pendant l'envoi */
      Object.keys(pris).forEach(id => { if (reste[id] === pris[id]) delete reste[id]; });
      S.user.user_metadata = Object.assign({}, S.user.user_metadata, { clientes_epinglees: l });
      garde(cleA(), reste); garde(cle(), applique(l, reste));
      if (lit().join() !== avant && S.onglet === "cl" && !E.classList.contains("fe") && !document.querySelector(".ep-menu")) rendu();
    } catch (e) { console.warn(e); }   /* sans réseau : ça repartira à la prochaine ouverture */
    finally { enCours = false; if (encore) { encore = false; accorde(); } }
  }
  const change = (id, on) => {
    if (demo()) { const l = duTel().filter(x => x !== id); garde(cle(), on ? [id].concat(l) : l); return; }
    const a = attente(); delete a[id]; a[id] = on;
    garde(cleA(), a); garde(cle(), applique(duCompte(S.user), a));
    accorde();
  };
  document.addEventListener("loginail-pret", accorde);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && S.pret) accorde(); });
  addEventListener("online", () => { if (S.pret) accorde(); });
  const PIN = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4h6l-1 5 3 3v2H7v-2l3-3z"/><path d="M12 14v6"/></svg>';
  const IC = { crayon: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-4L16 5l3 3L8 19z"/></svg>',
    poubelle: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13"/></svg>' };

  const st = document.createElement("style");
  st.textContent = `.ep-groupe{margin-top:14px}.ep-titre{display:flex;align-items:center;gap:6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8A817A;margin:0 4px 6px}
.ep-titre svg{width:13px;height:13px}
.cli .ep-mark{display:inline-flex;vertical-align:-2px;margin-left:5px;opacity:.45}.cli .ep-mark svg{width:13px;height:13px}
.cli.ep-tenu{transform:scale(.97);background:rgba(30,28,27,.05)!important;transition:transform .2s ease,background .2s}
.ep-voile{position:fixed;inset:0;z-index:300;background:rgba(30,20,22,.18);animation:epv .18s ease both}@keyframes epv{from{opacity:0}}
.ep-menu{position:fixed;z-index:301;left:22px;right:22px;max-width:280px;background:#fff;border-radius:18px;padding:6px;box-shadow:0 22px 50px -18px rgba(0,0,0,.45);animation:epm .2s cubic-bezier(.2,.85,.25,1) both;transform-origin:top left}
@keyframes epm{from{opacity:0;transform:scale(.92)}}
.ep-menu .ep-nom{font-size:12.5px;color:#8A817A;padding:8px 12px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ep-menu button{display:flex;align-items:center;gap:11px;width:100%;border:0;background:none;padding:12px;border-radius:12px;font:inherit;font-size:15px;color:#1E1C1B;text-align:left}
.ep-menu button:active{background:#F4EFEA}.ep-menu button.rouge{color:#A33A2E}`;
  document.head.appendChild(st);

  /* 1 · la liste : « Épinglées » en haut (pas pendant une recherche) et une petite épingle à côté du nom */
  const cl0 = VUES.cl;
  VUES.cl = () => { const h = cl0(), l = lit(); if (!l.length) return h;
    const t = document.createElement("template"); t.innerHTML = h; const f = t.content;
    f.querySelectorAll(".cli[data-cli]").forEach(r => { if (l.includes(r.dataset.cli)) { const b = r.querySelector(".t b"); if (b && !b.querySelector(".ep-mark")) b.insertAdjacentHTML("beforeend", `<span class="ep-mark">${PIN}</span>`); } });
    const premier = f.querySelector(".v-groupe, .v-liste, .carte");
    if (!S.cherche.trim() && premier) { const lignes = l.map(id => f.querySelector(`.cli[data-cli="${id}"]`)).filter(Boolean);
      if (lignes.length) { const g = document.createElement("div"); g.className = "ep-groupe"; g.innerHTML = `<div class="v-lettre">Épinglées</div><div class="liste v-liste"></div>`;
        lignes.forEach(r => { const c = r.cloneNode(true); c.removeAttribute("id"); g.lastChild.appendChild(c); });
        (premier.closest(".v-groupe") || premier).before(g); } }
    const d = document.createElement("div"); d.appendChild(f); return d.innerHTML; };

  /* 2 · l'appui long */
  let T = null, X0 = 0, Y0 = 0, LIGNE = null, BLOQUE = 0;
  const stop = () => { clearTimeout(T); T = null; if (LIGNE) LIGNE.classList.remove("ep-tenu"); };
  const debut = (el, x, y) => { stop(); LIGNE = el; X0 = x; Y0 = y; el.classList.add("ep-tenu");
    T = setTimeout(() => { T = null; el.classList.remove("ep-tenu"); BLOQUE = Date.now(); try { navigator.vibrate && navigator.vibrate(12); } catch (e) {} menu(el); }, 480); };
  const ligne = t => t && t.closest && t.closest('.vue[data-p="cl"] .cli[data-cli]');
  document.addEventListener("touchstart", e => { const el = ligne(e.target); if (!el || e.touches.length > 1) return; debut(el, e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  document.addEventListener("touchmove", e => { if (T && (Math.abs(e.touches[0].clientX - X0) > 8 || Math.abs(e.touches[0].clientY - Y0) > 8)) stop(); }, { passive: true });
  document.addEventListener("touchend", () => { if (T) stop(); }, { passive: true });
  document.addEventListener("touchcancel", stop, { passive: true });
  document.addEventListener("mousedown", e => { if (e.button) return; const el = ligne(e.target); if (el) debut(el, e.clientX, e.clientY); });
  document.addEventListener("mousemove", e => { if (T && (Math.abs(e.clientX - X0) > 8 || Math.abs(e.clientY - Y0) > 8)) stop(); });
  document.addEventListener("mouseup", () => { if (T) stop(); });
  document.addEventListener("contextmenu", e => { if (ligne(e.target)) e.preventDefault(); });
  /* le doigt qui se lève après l'appui long ne doit pas ouvrir la fiche */
  document.addEventListener("click", e => { if (BLOQUE && Date.now() - BLOQUE < 700 && !(e.target.closest && e.target.closest(".ep-menu"))) { e.stopPropagation(); e.preventDefault(); BLOQUE = 0; } }, true);

  const ferme = () => document.querySelectorAll(".ep-voile,.ep-menu").forEach(x => x.remove());
  function menu(el) { ferme(); const id = el.dataset.cli, c = S.clientes.find(x => x.id === id); if (!c) return; const on = lit().includes(id), r = el.getBoundingClientRect();
    document.body.insertAdjacentHTML("beforeend", `<div class="ep-voile"></div><div class="ep-menu" role="menu"><div class="ep-nom">${esc(nomCli(c) || "Cliente")}</div>
      <button data-ep="pin" data-id="${id}">${PIN}${on ? "Désépingler" : "Épingler en haut"}</button><button data-ep="modif" data-id="${id}">${IC.crayon}Modifier</button><button data-ep="suppr" data-id="${id}" class="rouge">${IC.poubelle}Supprimer</button></div>`);
    const m = document.querySelector(".ep-menu"), h = m.offsetHeight, bas = r.bottom + 8 + h < innerHeight - 90;
    m.style.top = Math.max(60, Math.min(bas ? r.bottom + 8 : r.top - h - 8, innerHeight - h - 90)) + "px"; m.style.left = Math.max(16, Math.min(r.left + 8, innerWidth - m.offsetWidth - 16)) + "px"; if (!bas) m.style.transformOrigin = "bottom left"; }
  document.addEventListener("click", e => { const t = e.target; if (!t.closest) return;
    if (t.closest(".ep-voile")) { e.stopPropagation(); ferme(); return; }
    const b = t.closest("[data-ep]"); if (!b) return; e.stopPropagation(); const id = b.dataset.id, k = b.dataset.ep; ferme();
    if (k === "pin") { const l = lit(), on = l.includes(id); if (!on && l.length >= MAX) return dit(MAX + " épingles au plus : enlèves-en une d’abord"); change(id, !on); rendu(); dit(on ? "Cliente désépinglée" : "Épinglée en haut de ta liste ✓"); }
    else if (k === "modif" || k === "suppr") { feuilleCliente(id); setTimeout(() => { const m = document.querySelector('.fc [data-fi="modifier"]'); if (m) m.click();
      if (k === "suppr") setTimeout(() => { const s = document.querySelector('.fc [data-sup="1"]'); if (s) s.click(); }, 80); }, 60); } }, true);
})();
