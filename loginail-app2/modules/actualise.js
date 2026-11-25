/* 21/11 (Marie) : « quand je descends, ça ne fait pas comme si la page se chargeait »
   21/11 soir (retours sur l'iPhone) : comme Instagram — la PAGE descend avec le doigt (les 5 onglets), le haut qui apparaît reste ROSE
   (la couleur de l'en-tête), et une roue à petits traits : les traits apparaissent un par un quand on tire, puis la roue tourne.
   Quand elle revient dans l'appli (après un SMS…), tout se recharge tout seul, sans rien demander. */
{
  const N = 8, TRAITS = Array.from({ length: N }, (_, i) => `<i style="transform:rotate(${i * 360 / N}deg)"></i>`).join("");
  const st = document.createElement("style");
  /* 21/11 : c'est le CONTENU qui descend, le fond rose de la page reste en place (sinon on voyait un trait là où il s'arrêtait) */
  st.textContent = `#E .vue{overscroll-behavior-y:none}
  #E .vue.tire-x>*{translate:0 var(--tire,0px)}
  /* 25/11 (Marie : « le trait il reste pas comme le fond ») : avec « Afficher mon fond en haut », le fond ne descend pas avec la page,
     sinon il laissait une bande rose en haut ; il reste en place et le contenu glisse dessus */
  #E .vue.tire-x>.v-ban{translate:none}
  #E .vue.tire-r>*{transition:translate .42s cubic-bezier(.2,.9,.25,1)}
  .roue{position:absolute;left:50%;top:0;z-index:60;width:28px;height:28px;margin-left:-14px;pointer-events:none;opacity:0}
  .roue i{position:absolute;left:12.5px;top:0;width:3px;height:8.5px;border-radius:2px;background:var(--v-acc,#B5475E);transform-origin:1.5px 14px;opacity:0}
  .roue.tourne i{animation:roue-t .8s linear infinite}
  ${Array.from({ length: N }, (_, i) => `.roue.tourne i:nth-child(${i + 1}){animation-delay:${((i - N) * .8 / N).toFixed(2)}s}`).join("")}
  @keyframes roue-t{0%{opacity:.85}100%{opacity:.15}}`;
  document.head.appendChild(st);

  const SEUIL = 72, TENU = 64, PAGES = ["acc", "ag", "cl", "si", "re"];
  /* la hauteur de la barre de l'heure de l'iPhone (on ne met pas la roue dessous) */
  const HAUT = () => { const m = document.createElement("div"); m.style.cssText = "position:absolute;visibility:hidden;padding-top:env(safe-area-inset-top)"; E.appendChild(m); const h = parseFloat(getComputedStyle(m).paddingTop) || 0; m.remove(); return h; };
  let sh = 0, roue = null, vue = null, y0 = null, x0 = 0, dy = 0, tire = false, enCours = false, dernier = Date.now();
  const R = () => { if (!roue || !roue.isConnected) { roue = document.createElement("div"); roue.className = "roue"; roue.innerHTML = TRAITS; E.appendChild(roue); } return roue; };
  /* la page descend de « d » pixels ; la roue reste au milieu de la bande rose qui apparaît */
  const pose = (d, anime) => {
    if (!vue) return; vue.classList.add("tire-x"); vue.classList.toggle("tire-r", !!anime); vue.style.setProperty("--tire", d + "px");
    const r = R(), haut = vue.getBoundingClientRect().top - E.getBoundingClientRect().top;
    r.style.transition = anime ? "top .42s cubic-bezier(.2,.9,.25,1),opacity .25s" : "none";
    r.style.top = (haut + Math.max(sh - 14, (sh + d) / 2 - 14)) + "px";
  };
  const traits = p => { const r = R(), n = Math.round(p * N); r.style.opacity = p > .08 ? 1 : 0;
    [...r.children].forEach((t, i) => { t.style.opacity = i < n ? .8 : 0; }); };
  const relache = () => { const v = vue; pose(0, true); R().style.opacity = 0;
    setTimeout(() => { if (v && !tire) { v.classList.remove("tire-r", "tire-x"); v.style.removeProperty("--tire"); } R().classList.remove("tourne"); }, 450); };
  const enHaut = t => { for (let n = t; n && n !== E; n = n.parentElement) if (n.scrollTop > 0) return false; return true; };
  const libre = () => S.user && PAGES.includes(S.onglet) && !E.classList.contains("fe") && !E.querySelector(".feuille.on,.voile.on,.pont") && E.querySelector(".vue.on");

  /* recharge, puis redessine en gardant la place */
  async function actualise(silence) {
    if (enCours || !S.user) return; enCours = true;
    try {
      if ((S.onglet === "si" || S.onglet === "re") && !E.classList.contains("fe")) await chargeTout();   /* Mon site / Réglages : le site et le profil aussi */
      else { const [cl] = await Promise.all([sb.from("clientes").select("*").order("prenom"), chargeSemaine()]); if (cl && !cl.error && cl.data) S.clientes = cl.data; await chargeVisites(); await rafraichitSite(); }
      dernier = Date.now();
      const a = document.activeElement;   /* on ne redessine pas sous ses doigts : ni feuille ouverte, ni recherche en cours */
      if (libre() && !(a && a.matches && a.matches("input,textarea,select"))) { const v = E.querySelector(".vue.on"), y = v ? v.scrollTop : 0; rendu(); const v2 = E.querySelector(".vue.on"); if (v2) v2.scrollTop = y; }
    } catch (e) { if (!silence) dit("Pas de connexion, réessaie dans un instant"); }
    enCours = false;
  }
  window.actualiseAppli = actualise;

  E.addEventListener("touchstart", ev => {
    y0 = null; dy = 0; if (enCours || ev.touches.length > 1 || !libre()) return;
    if (ev.target.closest("input,textarea,select,.idx,.tris,.calm,iframe") || !enHaut(ev.target)) return;
    y0 = ev.touches[0].clientY; x0 = ev.touches[0].clientX; vue = E.querySelector(".vue.on"); sh = HAUT();
  }, { passive: true });
  E.addEventListener("touchmove", ev => {
    if (y0 == null) return; const d = ev.touches[0].clientY - y0, dx = Math.abs(ev.touches[0].clientX - x0);
    if (!tire && (d <= 2 || dx > d)) { if (d < -2 || dx > 8) y0 = null; return; }
    if (!tire && !enHaut(ev.target)) { y0 = null; return; }
    tire = true; if (ev.cancelable) ev.preventDefault();   /* c'est nous qui faisons descendre la page (pas de rebond de l'iPhone en plus) */
    /* comme un élastique : la page suit le doigt, de moins en moins vite */
    dy = Math.max(0, d) < 1 ? 0 : 140 * (1 - Math.exp(-Math.max(0, d) / 170));
    pose(dy, false); traits(Math.min(1, dy / SEUIL));
    if (dy >= SEUIL && !R().dataset.vib) { R().dataset.vib = 1; navigator.vibrate?.(8); } else if (dy < SEUIL) delete R().dataset.vib;
  }, { passive: false });
  const fin = async () => {
    if (y0 == null && !tire) return; y0 = null; const etait = tire; tire = false; delete R().dataset.vib; if (!etait) return;
    if (dy < SEUIL) { dy = 0; return relache(); }
    dy = 0; pose(TENU, true); traits(1); R().classList.add("tourne");   /* la page reste un peu descendue pendant que ça charge */
    const t0 = Date.now(); await actualise(false);
    setTimeout(() => { vue = E.querySelector(".vue.on") || vue; relache(); }, Math.max(0, 700 - (Date.now() - t0)));   /* au moins 0,7 s : on voit que ça a chargé */
  };
  E.addEventListener("touchend", fin, { passive: true });
  E.addEventListener("touchcancel", fin, { passive: true });

  /* retour dans l'appli : on recharge en silence (au plus une fois toutes les 20 s) */
  const retour = () => { if (!document.hidden && S.user && Date.now() - dernier > 20000) actualise(true); };
  document.addEventListener("visibilitychange", retour);
  window.addEventListener("focus", retour);
  try { window.Capacitor?.Plugins?.App?.addListener?.("appStateChange", s => { if (s && s.isActive) retour(); }); } catch (e) {}
}
