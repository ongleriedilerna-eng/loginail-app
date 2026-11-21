/* ===== 21/11 (Marie) : la PAUSE DU MIDI dans l'agenda.
   Si elle ferme le midi (Mon site › Horaires › « Je ferme le midi » : horaires[jour].pd / .pf, comme sur son site),
   une bande grise rayée « Pause du midi · 12:00 – 14:00 » dans la journée. Elle ne bloque rien : la pro peut quand même
   toucher l'heure et noter un rendez-vous (c'est elle qui décide). Le site, « Mes dispos » et « Encore libre » ne proposent pas la pause. ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `.v-pause{position:absolute;left:56px;right:12px;border-radius:12px;background:repeating-linear-gradient(135deg,#F3EEEA 0 8px,#FBF8F5 8px 16px);display:flex;align-items:center;justify-content:center;font:500 12.5px Jost,sans-serif;color:#8A847E;z-index:1;pointer-events:none;overflow:hidden;white-space:nowrap}`;
  document.head.appendChild(st);
  const mn = t => +String(t).slice(0, 2) * 60 + +String(t).slice(3, 5);
  const hm = m => Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0");
  const ag0 = VUES.ag;
  VUES.ag = () => { const h = ag0();
    try { const hor = ((S.site && S.site.donnees && S.site.donnees.horaires) || (brouillon() || {}).horaires || [])[(S.jour.getDay() + 6) % 7];
      if (!hor || !hor.pd || !hor.pf) return h;
      const a = Math.max(mn(hor.pd), OUV), b = Math.min(mn(hor.pf), FERM); if (b - a < 15) return h;
      /* même échelle que les heures (--plh : une demi-heure, entre 20 et 30 px selon la place) */
      const bande = `<div class="v-pause" aria-hidden="true" style="top:calc(${((a - OUV) / 30).toFixed(3)} * var(--plh, ${R}px));height:calc(${((b - a) / 30).toFixed(3)} * var(--plh, ${R}px))">Pause du midi · ${hm(mn(hor.pd))} – ${hm(mn(hor.pf))}</div>`;
      return h.replace(/(<div class="pap"[^>]*>)/, "$1" + bande); } catch (e) { return h; } };
})();
