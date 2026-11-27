/* ===== 27/11 (Marie, version A de maquettes/fiche-plusieurs-rdv-2711) : la fiche cliente quand elle a PLUSIEURS rendez-vous =====
   Marie : « quand elles ont plusieurs rdv de pris, faudrait un petit plus en haut du rectangle, et ça défile les rdv… les trois ronds et un trait ».
   - La carte noire « Prochain rendez-vous » devient une rangée de cartes qu'on GLISSE (une par rendez-vous prévu, « Ensuite » pour les suivantes) ;
     on voit le bord de la suivante ; « +2 » en haut à droite (= combien il en reste après celle-ci ; le toucher fait glisser à la suivante) ;
     dessous, des points : celui qu'on regarde s'allonge en trait. Chaque carte garde « Déplacer » et « Voir ». Remplace la ligne grise « Et aussi ».
   - « Envoyer ses rendez-vous » (« son rendez-vous » s'il n'y en a qu'un) : COPIE le message (au « vous », D67) ; le bouton devient vert
     « Copié ! Colle-le dans son SMS ou son Insta » et montre le message copié, 3,5 s.
   Pour tous les salons, les 3 styles. Rien sur le serveur. Branché dans fiche.js par window.__prochFiche(c, proch). */
(function () {
  const st = document.createElement("style");
  st.textContent = `
.fp-car{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin:0 -24px;padding:0 24px;scroll-padding:0 24px;overscroll-behavior-x:contain}
.fp-car::-webkit-scrollbar{display:none}
.fp-car>.fi-noire{flex:0 0 calc(100% - 22px);scroll-snap-align:start;scroll-snap-stop:always;position:relative}
.fp-plus{position:absolute;top:11px;right:11px;z-index:2;height:28px;min-width:40px;padding:0 10px;border:0;border-radius:999px;background:rgba(255,255,255,.16);color:#fff;font:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:transform .12s,background .15s}
.fp-plus:active{transform:scale(.9);background:rgba(255,255,255,.28)}
.fp-pts{display:flex;justify-content:center;gap:6px;margin:11px 0 1px}
.fp-pts i{width:7px;height:7px;border-radius:99px;background:var(--noir,#1E1C1B);opacity:.2;transition:width .25s cubic-bezier(.2,.8,.2,1),opacity .25s}
.fp-pts i.on{width:20px;opacity:.85}
.fp-env{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:10px;height:46px;border:0;border-radius:999px;background:#fff;box-shadow:0 0 0 1px rgba(30,28,27,.1);font:inherit;font-size:15px;color:#1E1C1B;cursor:pointer;transition:background .2s,color .2s,transform .12s;padding:0 14px}
.fp-env:active{transform:scale(.97)}
.fp-env svg{flex:none;width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.fp-env.ok{background:#2F7D5B;color:#fff;box-shadow:none}
.fp-ap{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s cubic-bezier(.2,.8,.2,1)}
.fp-ap>div{overflow:hidden}
.fp-ap.on{grid-template-rows:1fr}
.fp-bulle{margin-top:9px;background:#fff;border-radius:16px 16px 16px 4px;padding:11px 13px;font-size:13.5px;line-height:1.45;white-space:pre-line;text-align:left;box-shadow:0 0 0 1px rgba(30,28,27,.08)}
.fp-bulle small{display:block;font-size:12px;opacity:.6;margin-bottom:4px}
@media (prefers-reduced-motion:reduce){.fp-pts i,.fp-ap{transition:none}}`;
  document.head.appendChild(st);

  const IC_COP = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';
  const IC_OK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const JL = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
  const jn = x => x.getDate() === 1 ? "1er" : x.getDate();   /* « 1er janvier », pas « 1 janvier » */
  const hh = x => `${x.getHours()}h${String(x.getMinutes()).padStart(2, "0")}`;
  const presta = r => (r.prestations && r.prestations.nom) || r.titre || "";
  let TXT = "";

  /* le message pour la cliente (au « vous ») */
  function message(c, proch) {
    const an = new Date().getFullYear(), prenom = String(c.prenom || "").trim(), salon = String((S.profil && S.profil.nom_salon) || "").trim();
    const ligne = r => { const x = new Date(r.debut), p = presta(r);
      return `${JL[(x.getDay() + 6) % 7]} ${jn(x)} ${MOIS[x.getMonth()]}${x.getFullYear() !== an ? " " + x.getFullYear() : ""} à ${hh(x)}${p ? " (" + p + ")" : ""}`; };
    const bonjour = prenom && prenom[0] !== "@" ? `Bonjour ${prenom},` : "Bonjour,", chez = salon ? " chez " + salon : "";
    if (proch.length === 1) return `${bonjour} votre prochain rendez-vous${chez} : ${ligne(proch[0])}.\nÀ bientôt !`;
    return `${bonjour} voici vos prochains rendez-vous${chez} :\n${proch.map(r => "• " + ligne(r)).join("\n")}\nÀ bientôt !`;
  }

  window.__prochFiche = (c, proch) => {
    if (!proch || !proch.length) return "";
    const n = proch.length;
    const carte = (r, i) => { const x = new Date(r.debut), p = presta(r), reste = n - 1 - i;
      return `<div class="fi-noire">${reste > 0 ? `<button class="fp-plus" data-fp-va="${i + 1}" aria-label="Voir le rendez-vous d'après (encore ${reste})">+${reste}</button>` : ""}<small>${i ? "Ensuite" : "Prochain rendez-vous"}</small><b class="fi-jour">${JOURS[(x.getDay() + 6) % 7]} ${jn(x)} ${MOIS[x.getMonth()]}${x.getFullYear() !== new Date().getFullYear() ? " " + x.getFullYear() : ""}</b><span class="fi-h">à ${hh(x)}${p ? " · " + esc(p) : ""}</span>
        <div class="fi-bts"><button data-a="decaler" data-id="${r.id}">Déplacer</button><button data-rdv="${r.id}">Voir</button></div></div>`; };
    TXT = message(c, proch);
    let h = n > 1 ? `<div class="fp-car" aria-label="Ses ${n} rendez-vous prévus">${proch.map(carte).join("")}</div><div class="fp-pts" aria-hidden="true">${proch.map((_, i) => `<i${i ? "" : ' class="on"'}></i>`).join("")}</div>` : carte(proch[0], 0);
    h += `<button class="fp-env" data-fp-env>${IC_COP}<span>Envoyer ${n > 1 ? "ses rendez-vous" : "son rendez-vous"}</span></button><div class="fp-ap"><div><div class="fp-bulle"></div></div></div>`;
    return h;
  };

  /* les points suivent la carte regardée */
  const cartePos = car => { const k = car.firstElementChild; return k ? Math.round(car.scrollLeft / (k.offsetWidth + 10)) : 0; };
  document.addEventListener("scroll", e => { const car = e.target; if (!car.classList || !car.classList.contains("fp-car")) return;
    const i = cartePos(car), pts = car.nextElementSibling; if (pts) [...pts.children].forEach((p, k) => p.classList.toggle("on", k === i)); }, true);

  function copie(t) {
    try { if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).then(() => true, () => vieux(t)); } catch (e) {}
    return Promise.resolve(vieux(t));
  }
  function vieux(t) { try { const a = document.createElement("textarea"); a.value = t; a.setAttribute("readonly", ""); a.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(a); a.select(); a.setSelectionRange(0, t.length); const ok = document.execCommand("copy"); a.remove(); return ok; } catch (e) { return false; } }

  let minu = null;
  addEventListener("click", e => {
    const t = e.target; if (!t || !t.closest) return;
    const va = t.closest("[data-fp-va]");
    if (va) { e.preventDefault(); e.stopPropagation(); const car = va.closest(".fp-car"), k = car && car.children[+va.dataset.fpVa];
      if (k) car.scrollTo({ left: k.offsetLeft - car.firstElementChild.offsetLeft, behavior: "smooth" }); return; }
    const b = t.closest("[data-fp-env]"); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const txt = TXT, ap = b.nextElementSibling;
    copie(txt).then(ok => {
      if (!ok) { dit("Je n’arrive pas à copier le message"); return; }
      const avant = b.dataset.fpAvant || b.innerHTML; b.dataset.fpAvant = avant;
      b.classList.add("ok"); b.innerHTML = IC_OK + "<span>Copié ! Colle-le dans son SMS ou son Insta</span>";
      if (ap) { ap.querySelector(".fp-bulle").innerHTML = "<small>Ce qui est copié :</small>" + esc(txt); ap.classList.add("on"); }
      clearTimeout(minu); minu = setTimeout(() => { if (!b.isConnected) return; b.classList.remove("ok"); b.innerHTML = avant; if (ap) ap.classList.remove("on"); }, 3500);
    });
  }, true);
})();
