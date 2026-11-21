/* 21/11 (Marie) : « quand je descends, ça ne fait pas comme si la page se chargeait »
   1) Tirer vers le bas en haut de l'Accueil, de l'Agenda ou des Clientes : un rond apparaît, suit le doigt, tourne, et la page se recharge.
   2) Quand elle revient dans l'appli (après un SMS, une autre appli…), tout se recharge tout seul, sans rien demander. */
{
  const st = document.createElement("style");
  st.textContent = `.tire{position:absolute;left:50%;top:calc(10px + env(safe-area-inset-top));z-index:60;width:40px;height:40px;margin-left:-20px;border-radius:50%;background:#fff;
    box-shadow:0 6px 18px -6px rgba(30,28,27,.35);display:grid;place-items:center;pointer-events:none;opacity:0;transform:translateY(-60px) scale(.6)}
  .tire svg{width:22px;height:22px;display:block}
  .tire circle{fill:none;stroke:var(--noir,#1E1C1B);stroke-width:2.4;stroke-linecap:round;stroke-dasharray:50.3;stroke-dashoffset:50.3}
  .tire.lache{transition:transform .28s cubic-bezier(.2,.9,.3,1.2),opacity .2s}
  .tire.tourne svg{animation:tire-t .7s linear infinite}
  .tire.tourne circle{stroke-dashoffset:14;transition:stroke-dashoffset .2s}
  @keyframes tire-t{to{transform:rotate(360deg)}}
  @media (prefers-reduced-motion:reduce){.tire.tourne svg{animation-duration:1.6s}}`;
  document.head.appendChild(st);

  const SEUIL = 70, MAX = 110, PAGES = ["acc", "ag", "cl"];
  let rond = null, y0 = null, x0 = 0, dy = 0, enCours = false, dernier = Date.now();
  const R = () => { if (!rond || !rond.isConnected) { rond = document.createElement("div"); rond.className = "tire"; rond.innerHTML = '<svg viewBox="0 0 22 22"><circle cx="11" cy="11" r="8" transform="rotate(-90 11 11)"/></svg>'; E.appendChild(rond); } return rond; };
  const place = d => { const r = R(), p = Math.min(1, d / SEUIL), y = Math.min(d, MAX) * .7 - 10;
    r.style.opacity = Math.min(1, p * 1.4); r.style.transform = `translateY(${y}px) scale(${.6 + .4 * p})`;
    const c = r.querySelector("circle"); c.style.strokeDashoffset = 50.3 * (1 - p * .85); r.querySelector("svg").style.transform = `rotate(${p * 270}deg)`; };
  const cache = () => { const r = R(); r.classList.add("lache"); r.classList.remove("tourne"); r.style.opacity = 0; r.style.transform = "translateY(-60px) scale(.6)";
    r.querySelector("circle").style.strokeDashoffset = ""; r.querySelector("svg").style.transform = ""; };
  /* tout ce qui défile au-dessus du doigt doit être tout en haut */
  const enHaut = t => { for (let n = t; n && n !== E; n = n.parentElement) if (n.scrollTop > 0) return false; return true; };
  const libre = () => S.user && PAGES.includes(S.onglet) && !E.classList.contains("fe") && !E.querySelector(".feuille.on,.voile.on,.pont") && E.querySelector(".vue.on");

  /* recharge les rendez-vous, les clientes et leurs visites, puis redessine en gardant la place */
  async function actualise(silence) {
    if (enCours || !S.user) return; enCours = true;
    try {
      const [cl] = await Promise.all([sb.from("clientes").select("*").order("prenom"), chargeSemaine()]);
      if (cl && !cl.error && cl.data) S.clientes = cl.data;
      await chargeVisites(); dernier = Date.now();
      /* on ne redessine pas sous ses doigts : ni feuille ouverte, ni recherche en cours */
      const a = document.activeElement;
      if (libre() && !(a && a.matches && a.matches("input,textarea,select"))) { const vu = E.querySelector(".vue.on"), y = vu ? vu.scrollTop : 0; rendu(); const v2 = E.querySelector(".vue.on"); if (v2) v2.scrollTop = y; }
    } catch (e) { if (!silence) dit("Pas de connexion, réessaie dans un instant"); }
    enCours = false;
  }
  window.actualiseAppli = actualise;

  E.addEventListener("touchstart", ev => {
    y0 = null; dy = 0; if (enCours || ev.touches.length > 1 || !libre()) return;
    if (ev.target.closest("input,textarea,select,.idx,.tris,.calm") || !enHaut(ev.target)) return;
    y0 = ev.touches[0].clientY; x0 = ev.touches[0].clientX; R().classList.remove("lache");
  }, { passive: true });
  E.addEventListener("touchmove", ev => {
    if (y0 == null) return; const d = ev.touches[0].clientY - y0, dx = Math.abs(ev.touches[0].clientX - x0);
    if (d <= 0 || (dy === 0 && dx > d) || !enHaut(ev.target)) { if (dy) cache(); y0 = null; dy = 0; return; }
    /* le rond suit le doigt, de moins en moins vite (comme un élastique) */
    dy = d < SEUIL ? d : SEUIL + (d - SEUIL) * .4; place(dy);
    if (dy >= SEUIL && !R().dataset.vib) { R().dataset.vib = 1; navigator.vibrate?.(8); } else if (dy < SEUIL) delete R().dataset.vib;
  }, { passive: true });
  const fin = async () => {
    if (y0 == null) return; y0 = null; const r = R(); delete r.dataset.vib; r.classList.add("lache");
    if (dy < SEUIL) { dy = 0; return cache(); }
    dy = 0; r.classList.add("tourne"); r.style.opacity = 1; r.style.transform = "translateY(38px) scale(1)"; r.querySelector("circle").style.strokeDashoffset = "";
    const t0 = Date.now(); await actualise(false);
    /* on laisse le rond tourner au moins 0,6 s : sinon on ne voit pas que ça a chargé */
    setTimeout(cache, Math.max(0, 600 - (Date.now() - t0)));
  };
  E.addEventListener("touchend", fin, { passive: true });
  E.addEventListener("touchcancel", fin, { passive: true });

  /* retour dans l'appli : on recharge en silence (au plus une fois toutes les 20 s) */
  const retour = () => { if (!document.hidden && S.user && Date.now() - dernier > 20000) actualise(true); };
  document.addEventListener("visibilitychange", retour);
  window.addEventListener("focus", retour);
  /* sur l'iPhone (Capacitor), l'appli prévient aussi quand elle revient au premier plan */
  try { window.Capacitor?.Plugins?.App?.addListener?.("appStateChange", s => { if (s && s.isActive) retour(); }); } catch (e) {}
}
