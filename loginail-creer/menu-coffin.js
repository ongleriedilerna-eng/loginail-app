/* 06/11 (Marie) : 5e template « Coffin » (base Amande + .cof) : comme une appli — grande photo arrondie en bas,
   et une barre d'onglets en bas toujours visible (Accueil · Prix · À propos · Réserver). Activé par &coffin=1 ou BR.coffin. */
(() => {
  const actif = () => { try { return new URLSearchParams(location.search).get("coffin") === "1" || (typeof BR !== "undefined" && BR && BR.coffin); } catch (e) { return false; } };
  if (!actif()) return;
  const css = document.createElement("style");
  css.textContent = `.ecran.cof .burger,.ecran.cof .menu,.ecran.cof .voileM,.ecran.cof .hpill,.ecran.cof .cta,.ecran.cof .dock,.ecran.cof .resbar,.ecran.cof .barre-nav,.ecran.cof .fab{display:none!important}
  .ecran.cof .hero{border-radius:0 0 34px 34px;overflow:hidden;min-height:78%;box-shadow:0 18px 40px -26px rgba(0,0,0,.55)}
  .ecran.cof .hero .haut{letter-spacing:.32em}
  .ecran.cof .defile{padding-bottom:110px}
  .ecran.cof .sec{margin-left:14px;margin-right:14px;border-radius:26px}
  .cof-barre{position:absolute;left:14px;right:14px;bottom:var(--cof-b,16px);z-index:45;height:62px;border-radius:31px;background:color-mix(in srgb,var(--cof-fond,#F6F3EF) 92%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 12px 30px -14px rgba(0,0,0,.4);display:flex;align-items:center;padding:6px;gap:2px}
  .cof-barre a{flex:1;height:50px;border-radius:25px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font:400 9.5px Jost,sans-serif;letter-spacing:.06em;color:color-mix(in srgb,var(--encre,#1E1C1B) 55%,transparent);text-decoration:none;cursor:pointer}
  .cof-barre a.on{color:var(--encre,#1E1C1B)}
  .cof-barre svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.5}
  .cof-barre a.res{flex:1.35;background:var(--encre,#1E1C1B);color:#F6F3EF;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:500}`;
  document.head.append(css);
  const I = { accueil: '<svg viewBox="0 0 24 24"><path d="M4 11l8-6.5 8 6.5V20H4z"/></svg>', presta: '<svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h9"/></svg>',
    apropos: '<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.5"/><path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5"/></svg>', horaires: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/></svg>' };
  const NOM = { accueil: "Accueil", presta: "Prix", apropos: "À propos", horaires: "Infos" };
  function pose(e) {
    if (e.querySelector(".cof-barre")) return;
    const d = e.querySelector(".defile"); if (!d || !d.querySelector(".hero")) return;
    e.classList.add("cof");
    e.style.setProperty("--cof-fond", getComputedStyle(d).backgroundColor || "#F6F3EF");
    e.style.setProperty("--cof-b", document.querySelector(".tel .ile, .c-ile") || document.documentElement.classList.contains("iph") ? "26px" : "calc(env(safe-area-inset-bottom,0px) + 14px)");
    const ids = ["accueil", "presta", "apropos", "horaires"].filter(v => v === "accueil" || d.querySelector(`[data-s="${v}"]`)).slice(0, 3);
    e.insertAdjacentHTML("beforeend", `<nav class="cof-barre">${ids.map((v, i) => `<a data-cof="${v}"${i ? "" : ' class="on"'}>${I[v]}<span>${NOM[v]}</span></a>`).join("")}<a class="res" data-res>Réserver</a></nav>`);
    const barre = e.querySelector(".cof-barre");
    barre.querySelectorAll("[data-cof]").forEach(a => a.onclick = ev => { ev.preventDefault(); const v = a.dataset.cof, c = d.querySelector(`[data-s="${v}"]`);
      d.scrollTo({ top: v === "accueil" || !c ? 0 : (c.closest(".sec") || c).offsetTop - 30, behavior: "smooth" }); });
    /* l'onglet allumé suit la partie qu'on regarde */
    const suit = () => { let on = "accueil"; ids.forEach(v => { const c = d.querySelector(`[data-s="${v}"]`); if (v !== "accueil" && c && (c.closest(".sec") || c).offsetTop - 140 <= d.scrollTop) on = v; });
      barre.querySelectorAll("[data-cof]").forEach(a => a.classList.toggle("on", a.dataset.cof === on)); };
    d.addEventListener("scroll", suit, { passive: true });
  }
  const tout = () => document.querySelectorAll(".ecran").forEach(pose);
  new MutationObserver(tout).observe(document.body, { childList: true, subtree: true });
  setTimeout(tout, 300);
})();
