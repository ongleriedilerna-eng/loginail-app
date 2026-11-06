/* 06/11 (Marie) : le menu du template Carré, version B : le nom et « Réserver » en haut, le menu s'ouvre en plein écran (très chic).
   Remplace la barre du bas (« Menu » + « Réserver ») sur ce template seulement. */
(() => {
  const css = document.createElement("style");
  css.textContent = `.ecran.mcb .dock,.ecran.mcb .dk-panel{display:none!important}
  .ecran.mcb .defile>:first-child{margin-top:44px}
  .ecran.mcb>.mcb-haut,.ecran.mcb>.mcb-plein{left:0!important;right:0!important;width:auto!important;margin:0!important;box-sizing:border-box!important;transform:none!important}
  .mcb-haut{position:absolute;left:0;right:0;top:0;z-index:40;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:var(--mcb-h,14px) max(28px,6%) 12px;pointer-events:none;transition:background .3s,box-shadow .3s}
  .mcb-haut.colle{background:var(--mcb-fond);box-shadow:0 8px 20px -18px rgba(0,0,0,.5)}
  .mcb-haut>*{pointer-events:auto}
  .mcb-nom{font-family:Italiana,serif;font-size:21px;color:var(--encre,#1E1C1B);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:0;transition:opacity .3s}
  .mcb-haut.colle .mcb-nom{opacity:1}
  .mcb-d{display:flex;gap:8px;align-items:center;flex:none}
  .mcb-res{height:36px;border-radius:18px;border:0;background:var(--encre,#1E1C1B);color:#F6F3EF;font:500 9.5px Jost,sans-serif;letter-spacing:.16em;text-transform:uppercase;padding:0 15px;cursor:pointer}
  .mcb-burg{width:36px;height:36px;border-radius:50%;border:1px solid color-mix(in srgb,var(--encre,#1E1C1B) 30%,transparent);background:var(--mcb-fond);display:grid;place-items:center;cursor:pointer;padding:0}
  .mcb-burg i{display:block;width:14px;height:1.5px;background:var(--encre,#1E1C1B);box-shadow:0 5px 0 var(--encre,#1E1C1B),0 -5px 0 var(--encre,#1E1C1B)}
  .mcb-plein{position:absolute;inset:0;z-index:60;background:var(--encre,#1E1C1B);color:#F6F3EF;padding:calc(var(--mcb-h,14px) + 60px) 28px 40px;display:flex;flex-direction:column;gap:4px;opacity:0;pointer-events:none;transition:opacity .35s}
  .mcb-plein.on{opacity:1;pointer-events:auto}
  .mcb-plein a{font-family:Italiana,serif;font-size:40px;line-height:1.15;color:#F6F3EF;text-decoration:none;border-bottom:1px solid rgba(246,243,239,.16);padding:10px 0;transform:translateY(10px);opacity:0;transition:transform .4s,opacity .4s}
  .mcb-plein.on a{transform:none;opacity:1}
  .mcb-plein.on a:nth-child(3){transition-delay:.05s}.mcb-plein.on a:nth-child(4){transition-delay:.1s}.mcb-plein.on a:nth-child(5){transition-delay:.15s}.mcb-plein.on a:nth-child(6){transition-delay:.2s}
  .mcb-x{position:absolute;top:var(--mcb-h,14px);right:18px;width:36px;height:36px;border-radius:50%;border:1px solid rgba(246,243,239,.4);background:none;color:#F6F3EF;font-size:19px;line-height:1;cursor:pointer}
  .mcb-plein .mcb-res2{margin-top:22px;height:50px;border-radius:25px;border:0;background:#F6F3EF;color:var(--encre,#1E1C1B);font:500 11px Jost,sans-serif;letter-spacing:.2em;text-transform:uppercase;cursor:pointer}
  .mcb-plein small{margin-top:auto;font-size:11px;letter-spacing:.22em;text-transform:uppercase;opacity:.7}`;
  document.head.append(css);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function pose(e) {
    if (!e.classList.contains("s3c") || e.querySelector(".mcb-haut")) return;
    const d = e.querySelector(".defile"); if (!d) return;
    e.classList.add("mcb");
    const iph = document.documentElement.classList.contains("iph") || !!document.querySelector(".tel .ile, .c-ile");
    e.style.setProperty("--mcb-h", iph ? "50px" : "calc(env(safe-area-inset-top,0px) + 14px)");
    const fond = getComputedStyle(d).backgroundColor && getComputedStyle(d).backgroundColor !== "rgba(0, 0, 0, 0)" ? getComputedStyle(d).backgroundColor : getComputedStyle(e).backgroundColor || "#F6F3EF";
    e.style.setProperty("--mcb-fond", fond);
    const nom = (typeof BR !== "undefined" && BR && BR.nom) || "";
    const liens = [...e.querySelectorAll(".dk-panel a[data-va]")].map(a => [a.dataset.va, a.textContent.trim()]);
    const ville = (typeof BR !== "undefined" && BR && BR.ville) || "";
    e.insertAdjacentHTML("beforeend", `<div class="mcb-haut"><span class="mcb-nom">${esc(nom)}</span><span class="mcb-d"><button class="mcb-res" data-res>Réserver</button><button class="mcb-burg" aria-label="Menu"><i></i></button></span></div>
      <div class="mcb-plein" aria-hidden="true"><button class="mcb-x" aria-label="Fermer">×</button>${liens.map(l => `<a href="#" data-mcb-va="${esc(l[0])}">${esc(l[1])}</a>`).join("")}
      <button class="mcb-res2" data-res>Réserver un créneau</button><small>${esc(ville)}${ville ? " · " : ""}sur rendez-vous</small></div>`);
    const haut = e.querySelector(".mcb-haut"), plein = e.querySelector(".mcb-plein");
    const ferme = () => { plein.classList.remove("on"); plein.setAttribute("aria-hidden", "true"); };
    haut.querySelector(".mcb-burg").onclick = () => { plein.classList.add("on"); plein.setAttribute("aria-hidden", "false"); };
    plein.querySelector(".mcb-x").onclick = ferme;
    plein.querySelectorAll("[data-mcb-va]").forEach(a => a.onclick = ev => { ev.preventDefault(); ferme(); const va = a.dataset.mcbVa, c = d.querySelector(`[data-s="${va}"]`);
      d.scrollTo({ top: va === "accueil" || !c ? 0 : c.closest(".sec").offsetTop - 70, behavior: "smooth" }); });
    plein.querySelector(".mcb-res2").addEventListener("click", ferme);
    const colle = () => haut.classList.toggle("colle", d.scrollTop > 120);
    d.addEventListener("scroll", colle, { passive: true }); colle();
  }
  const tout = () => document.querySelectorAll(".ecran.s3c").forEach(pose);
  new MutationObserver(tout).observe(document.body, { childList: true, subtree: true });
  setTimeout(tout, 300);
})();
