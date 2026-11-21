/* ===== 21/11 (Marie) : tout en bas de l'Accueil, sous « Partager mes dispos » :
   les clientes du jour qui n'ont PAS de numéro → « Pense à lui demander son numéro ». Un toucher ouvre sa fiche (crayon pour l'ajouter).
   Plus rien quand tout le monde a son numéro. ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `
#E .num-c{margin:14px 0 8px;padding:14px 14px 6px;border-radius:18px;background:color-mix(in srgb,var(--v-rose,#F5E6E4) 75%,#fff);border:1px solid color-mix(in srgb,var(--v-acc,#B5475E) 22%,transparent)}
#E .num-c h4{margin:0 0 2px;font:500 15px Jost,sans-serif;color:var(--v-encre,#1E1C1B)}
#E .num-c p{margin:0 0 8px;font-size:12.5px;color:var(--gris,#8A847E)}
#E .num-l{display:flex;align-items:center;gap:10px;padding:10px 0;border-top:1px solid color-mix(in srgb,var(--v-acc,#B5475E) 14%,transparent);cursor:pointer}
#E .num-l:active{opacity:.6}
#E .num-l .h{font-size:12.5px;color:var(--gris,#8A847E);width:42px;flex:none}
#E .num-l .n{flex:1;min-width:0;font-size:14.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#E .num-l .b{flex:none;font-size:12.5px;font-weight:500;color:var(--v-acc,#B5475E)}`;
  document.head.appendChild(st);
  const acc0 = VUES.acc;
  VUES.acc = () => { const h = acc0();
    try { const maint = new Date(), vu = {}, l = [];
      (S.rdv || []).filter(r => r.cliente_id && r.statut !== "annule" && memeJour(new Date(r.debut), maint))
        .sort((a, b) => new Date(a.debut) - new Date(b.debut))
        .forEach(r => { if (vu[r.cliente_id]) return; vu[r.cliente_id] = 1;
          const c = (S.clientes || []).find(x => x.id === r.cliente_id) || r.clientes;
          if (!c || (c.telephone || "").replace(/\D/g, "").length >= 6) return;
          l.push({ id: r.cliente_id, nom: nomCli(c) || "Cliente", h: hm(new Date(r.debut)) }); });
      if (!l.length) return h;
      const un = l.length === 1;
      return h + `<div class="num-c"><h4>Pense à ${un ? "lui" : "leur"} demander ${un ? "son" : "leur"} numéro</h4><p>Sans numéro, pas de rappel SMS avant le rendez-vous.</p>`
        + l.map(x => `<div class="num-l" data-cli="${x.id}"><span class="h">${x.h}</span><span class="n">${esc(x.nom)}</span><span class="b">Ajouter ›</span></div>`).join("") + `</div>`;
    } catch (e) { return h; } };
})();
