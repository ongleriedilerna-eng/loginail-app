/* ===== 22/11 (Marie) : la pilule « Nouvelle » =====
   Une cliente dont la fiche vient d'être créée par une réservation sur le site (en_ligne_a_voir, mis par le serveur :
   serveur/sql/28-cliente-nouvelle-en-ligne.sql). Dans la liste : pilule rose « Nouvelle », « A réservé en ligne · date »,
   anneau rose autour des initiales, et un point rose sur l'onglet Clientes. Tout s'éteint dès que la pro ouvre la fiche.
   Une cliente déjà connue (même numéro) qui réserve en ligne n'a pas la pilule : ce n'est pas une nouvelle. */
(function () {
  const st = document.createElement("style");
  st.textContent = `.cli .nv{display:inline-block;margin-left:7px;padding:2px 9px;border-radius:99px;background:#E8A3B4;color:#fff;font-size:10.5px;font-weight:500;font-style:normal;letter-spacing:.02em;line-height:1.5;vertical-align:2px;white-space:nowrap}
.cli.neuve .av{box-shadow:0 0 0 2px #fff,0 0 0 3.5px #E8A3B4}
.cli.neuve .t span.enl{color:#C0647C}
.ong button[data-go="cl"]{position:relative}
.ong button[data-go="cl"].pt-nv::after{content:"";position:absolute;top:2px;left:calc(50% + 7px);width:9px;height:9px;border-radius:50%;background:#E8A3B4;box-shadow:0 0 0 2px #fff}`;
  document.head.appendChild(st);

  const a_voir = id => { const c = (S.clientes || []).find(x => x.id === id); return !!(c && c.en_ligne_a_voir); };
  const pose = () => {
    const ong = E.querySelector('.ong button[data-go="cl"]');
    if (ong) { const on = (S.clientes || []).some(c => c.en_ligne_a_voir); if (ong.classList.contains("pt-nv") !== on) ong.classList.toggle("pt-nv", on); }
    E.querySelectorAll(".vue.on .cli[data-cli]").forEach(l => {
      if (l.dataset.nv || !a_voir(l.dataset.cli)) return; l.dataset.nv = "1";
      l.classList.add("neuve");
      const b = l.querySelector(".t b"); if (b) b.insertAdjacentHTML("beforeend", '<em class="nv">Nouvelle</em>');
      const s = l.querySelector(".t span"), w = (S.vis || {})[l.dataset.cli];
      if (s) { s.dataset.avant = s.textContent; s.textContent ="A réservé en ligne" + (w && w.proch ? " · " + jourCourt(w.proch) : ""); s.classList.add("enl"); }
    });
  };
  new MutationObserver(pose).observe(E, { childList: true, subtree: true });

  /* la pro ouvre sa fiche (depuis la liste ou depuis un rendez-vous) : l'étiquette s'éteint */
  document.addEventListener("click", e => {
    const t = e.target.closest && e.target.closest("[data-cli]"); if (!t) return;
    const c = (S.clientes || []).find(x => x.id === t.dataset.cli); if (!c || !c.en_ligne_a_voir) return;
    c.en_ligne_a_voir = false;
    try { sb.from("clientes").update({ en_ligne_a_voir: false }).eq("id", c.id).then(() => {}, () => {}); } catch (x) {}
    E.querySelectorAll(`.cli[data-cli="${c.id}"]`).forEach(l => { l.classList.remove("neuve"); l.querySelectorAll(".nv").forEach(x => x.remove()); const s = l.querySelector(".t span.enl"); if (s) { s.textContent = s.dataset.avant || ""; s.classList.remove("enl"); } });
    setTimeout(pose, 0);
  }, true);
})();
