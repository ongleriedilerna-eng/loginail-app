/* ===== 26/11 (Marie : « À déclarer à l'URSSAF ce mois […] ok on fait ça », version A, maquette maquettes/urssaf-2611/) =====
   · Accueil : une carte rose « À déclarer à l'URSSAF » SEULEMENT les derniers jours avant la date limite (à partir du 20),
     jusqu'à ce qu'elle touche « J'ai déclaré ✓ ». · « Mon bilan » : toujours, en bas.
   · Montant = ce qu'elle a ENCAISSÉ dans l'appli (tickets, acompte compris) ; si elle n'utilise pas la caisse : les prix des rendez-vous faits.
     Les rendez-vous faits sans ticket sont montrés à part (« si elle t'a payée, ajoute-la »), jamais ajoutés tout seuls.
   · Tous les mois (limite : dernier jour du mois suivant) ou tous les 3 mois (30 avril, 31 juillet, 31 octobre, 31 janvier) : son choix, gardé dans le téléphone.
   · La loi : déclarer même à 0 €. Pas de calcul des cotisations (taux à vérifier avant).
   · Essai : ?urssaf-jour=2026-11-25 fait comme si on était ce jour-là. */
(function () {
  const AUJ = () => { const q = new URLSearchParams(location.search).get("urssaf-jour"); return q && /^\d{4}-\d\d-\d\d$/.test(q) ? new Date(q + "T12:00:00") : new Date(); };
  const MOISM = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const uid = () => (S.user && S.user.id) || "x";
  const lit = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } };
  const ecrit = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const RYTHME = () => lit("loginail-urssaf-rythme-" + uid(), "mois") === "trim" ? "trim" : "mois";
  const eu = v => (Math.round(v * 100) % 100 ? (+v).toFixed(2).replace(".", ",") : String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")) + " €";
  const jourM = d => `${d.getDate()} ${MOISM[d.getMonth()]}`;
  const Maj = s => s.charAt(0).toUpperCase() + s.slice(1);

  /* la période à déclarer (finie) et celle en cours */
  function finie(r, d) {
    const y = d.getFullYear(), m = d.getMonth();
    if (r === "mois") return { de: new Date(y, m - 1, 1), a: new Date(y, m, 1), limite: new Date(y, m + 1, 0), fenetre: d.getDate() >= 20 };
    const q = Math.floor(m / 3);
    return { de: new Date(y, (q - 1) * 3, 1), a: new Date(y, q * 3, 1), limite: new Date(y, q * 3 + 1, 0), fenetre: m % 3 === 0 && d.getDate() >= 20 };
  }
  function enCours(r, d) {
    const y = d.getFullYear(), m = d.getMonth();
    if (r === "mois") return { de: new Date(y, m, 1), a: new Date(y, m + 1, 1), limite: new Date(y, m + 2, 0), enCours: true };
    const q = Math.floor(m / 3);
    return { de: new Date(y, q * 3, 1), a: new Date(y, q * 3 + 3, 1), limite: new Date(y, q * 3 + 4, 0), enCours: true };
  }
  const nomP = p => { const f = new Date(p.a - 1); return p.de.getMonth() === f.getMonth() ? `${Maj(MOISM[p.de.getMonth()])} ${p.de.getFullYear()}` : `${Maj(MOISM[p.de.getMonth()])} – ${MOISM[f.getMonth()]} ${f.getFullYear()}`; };
  const cleFait = (r, p) => `loginail-urssaf-fait-${uid()}-${r}-${p.de.getFullYear()}-${p.de.getMonth() + 1}`;
  const fait = (r, p) => lit(cleFait(r, p), "") === "1";
  /* ce qu'on montre : la période finie tant qu'elle n'est pas déclarée, sinon celle en cours */
  const laPeriode = () => { const r = RYTHME(), d = AUJ(), f = finie(r, d), mois = r === "mois";
    return (mois ? !fait(r, f) : f.fenetre && !fait(r, f)) ? Object.assign(f, { r }) : Object.assign(enCours(r, d), { r }); };

  /* le montant : tickets de la période + rendez-vous faits sans ticket (à part) */
  const CACHE = {};
  const prix = r => { const v = typeof prixDe === "function" ? prixDe(r.prix) : parseFloat(String(r.prix || "").replace(",", ".")); return v > 0 ? +v : 0; };
  async function montant(p) {
    const k = p.r + "|" + +p.de + "|" + (typeof CAISSE === "function" && CAISSE() ? 1 : 0) + "|" + (S.tickets || []).length + "|" + (S.rdv || []).length;   /* un nouveau ticket = on recompte */
    if (CACHE[k] && Date.now() - CACHE[k].t < 120000) return CACHE[k];
    const de = p.de.toISOString(), a = p.a.toISOString(), now = AUJ();
    const [t, rv] = await Promise.all([
      sb.from("tickets").select("total,cree_le,rendez_vous_id").gte("cree_le", de).lt("cree_le", a),
      sb.from("rendez_vous").select("id,prix,statut,cliente_id,debut,fin").gte("debut", de).lt("debut", a)]);
    if ((t && t.error) || (rv && rv.error)) throw (t.error || rv.error);
    const T = (t && t.data) || [], vus = new Set(T.map(x => x.rendez_vous_id)), caisse = typeof CAISSE === "function" ? CAISSE() : true;
    const faits = ((rv && rv.data) || []).filter(r => r.cliente_id && r.statut !== "annule" && r.statut !== "absente" && new Date(r.fin) <= now);
    const sansT = faits.filter(r => !vus.has(r.id));
    const v = caisse ? { total: T.reduce((s, x) => s + (+x.total || 0), 0), horsCaisse: sansT.reduce((s, r) => s + prix(r), 0), nHors: sansT.length, caisse }
      : { total: faits.reduce((s, r) => s + prix(r), 0), horsCaisse: 0, nHors: 0, caisse };
    return (CACHE[k] = Object.assign(v, { t: Date.now() }));
  }

  const IC = '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>';
  const carte = (p, rappel) => `<button class="urs${rappel ? " rappel" : ""}" data-urs="ouvre"><span class="ic">${IC}</span><span class="t"><b>À déclarer à l’URSSAF</b><small>${p.enCours ? nomP(p) + ", pour l’instant" : nomP(p) + " · avant le " + jourM(p.limite)}</small></span><em data-urs-m>…</em></button>`;
  const remplit = async () => { const p = laPeriode(); try { const v = await montant(p); E.querySelectorAll("[data-urs-m]").forEach(x => { x.textContent = eu(v.total); }); } catch (e) { console.warn("urssaf", e); E.querySelectorAll("[data-urs-m]").forEach(x => { x.textContent = ""; }); } };

  /* ---------- 1 · l'Accueil : seulement avant la date limite ---------- */
  const acc0 = VUES.acc;
  VUES.acc = () => { const h = acc0(); if (!S.user) return h;
    const p = laPeriode(); if (p.enCours || !finie(p.r, AUJ()).fenetre) return h;
    const f = document.createElement("div"); f.innerHTML = h; const haut = f.querySelector(".v-haut");
    if (haut) haut.insertAdjacentHTML("afterend", carte(p, true)); else f.insertAdjacentHTML("afterbegin", carte(p, true));
    setTimeout(remplit, 0); return f.innerHTML; };

  /* ---------- 2 · « Mon bilan » : toujours, en bas ---------- */
  new MutationObserver(() => { const h = E.querySelector(".fc h3"); if (!h || h.textContent.trim() !== "Mon bilan" || E.querySelector(".fc .urs")) return;
    h.parentElement.insertAdjacentHTML("beforeend", `<div class="urs-k">Pour l’URSSAF</div>${carte(laPeriode(), false)}`); remplit(); }).observe(E, { childList: true, subtree: true });

  /* ---------- 3 · le détail ---------- */
  async function detail() {
    const p = laPeriode(), r = p.r;
    ouvre(`<div class="urs-f"><h3>À déclarer à l’URSSAF</h3><div class="sous" style="text-align:center">${nomP(p)}</div>
      <div class="urs-bas" role="tablist">${[["mois", "Tous les mois"], ["trim", "Tous les 3 mois"]].map(([k, t]) => `<button role="tab" data-urs="rythme" data-r="${k}" class="${k === r ? "on" : ""}" aria-selected="${k === r}">${t}</button>`).join("")}</div>
      <div class="urs-gros" data-urs-g>…</div><div class="sous" style="text-align:center">${p.enCours ? "pour l’instant (la période n’est pas finie)" : "ton chiffre d’affaires à déclarer"}</div>
      <div data-urs-l></div>
      <div class="urs-info">📅 <b>À déclarer avant le ${jourM(p.limite)}</b>, même si c’est 0 € (la loi le demande). Sur autoentrepreneur.urssaf.fr.<br>Ce montant vient de <b>ce que tu as noté dans l’appli</b> : si une cliente t’a payée sans que tu l’encaisses ici, ajoute-la.</div>
      ${p.enCours ? "" : '<button class="btn" data-urs="fait" style="width:100%;margin-top:14px">J’ai déclaré ✓</button>'}
      <button class="urs-lien" data-urs="site">Ouvrir le site de l’URSSAF</button></div>`);
    try { const v = await montant(p); const g = E.querySelector(".fc [data-urs-g]"); if (!g) return; g.textContent = eu(v.total);
      E.querySelector(".fc [data-urs-l]").innerHTML = v.caisse
        ? `<div class="urs-lig"><span>Encaissé dans l’appli</span><b>${eu(v.total)}</b></div>${v.nHors ? `<div class="urs-lig"><span>${v.nHors} rendez-vous fait${v.nHors > 1 ? "s" : ""}, pas encaissé${v.nHors > 1 ? "s" : ""} ici</span><b>${eu(v.horsCaisse)}</b></div>` : ""}`
        : `<div class="urs-lig"><span>D’après les prix de tes rendez-vous faits</span><b>${eu(v.total)}</b></div>`;
    } catch (e) { console.warn("urssaf", e); const g = E.querySelector(".fc [data-urs-g]"); if (g) g.textContent = "—"; dit("Pas de réseau : réessaie dans un instant"); }
  }
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-urs]"); if (!b) return; e.preventDefault(); e.stopPropagation(); const k = b.dataset.urs;
    if (k === "ouvre") return detail();
    if (k === "rythme") { if (b.dataset.r === RYTHME()) return; ecrit("loginail-urssaf-rythme-" + uid(), b.dataset.r); rendu(); return detail(); }
    if (k === "fait") { const p = laPeriode(); ecrit(cleFait(p.r, p), "1"); ferme(); rendu(); return dit("Noté ✓ Je te le rappellerai la prochaine fois"); }
    if (k === "site") window.open("https://www.autoentrepreneur.urssaf.fr", "_blank", "noopener"); }, true);

  const st = document.createElement("style");
  st.textContent = `#E .urs{display:flex;align-items:center;gap:12px;width:100%;margin:12px 0 4px;padding:13px 14px;border:0;border-radius:18px;background:#fff;box-shadow:0 0 0 1px rgba(30,28,27,.05);font:inherit;text-align:left;color:inherit;cursor:pointer;transition:transform .12s}
#E .urs:active{transform:scale(.98)}
#E .urs .ic{flex:none;width:38px;height:38px;border-radius:12px;background:var(--v-rose,#F5E6E4);color:var(--v-acc,#B5475E);display:grid;place-items:center}
#E .urs .t{flex:1;min-width:0}#E .urs .t b{display:block;font-weight:500;font-size:15px}#E .urs .t small{display:block;font-size:12.5px;color:var(--gris,#776D64);margin-top:1px}
#E .urs em{flex:none;font-style:normal;font:500 21px 'Cormorant Garamond',Georgia,serif;font-variant-numeric:lining-nums;color:var(--v-acc,#B5475E);white-space:nowrap}
#E .urs.rappel{background:#F7E9EC;box-shadow:none;animation:urs-in .3s ease-out}#E .urs.rappel .ic{background:#fff}
#E .urs-k{font-size:13px;color:var(--gris,#8A817A);margin:18px 2px 0}
#E .urs-bas{display:flex;background:color-mix(in srgb,var(--v-rose,#F5E6E4) 70%,#E9E2DC);border-radius:99px;padding:3px;margin:12px 0 4px}
#E .urs-bas button{flex:1;height:36px;border:0;border-radius:99px;background:none;font:inherit;font-size:13.5px;color:var(--gris);cursor:pointer;transition:background .2s,color .2s}
#E .urs-bas button.on{background:#fff;color:var(--v-fonce,#1E1C1B);box-shadow:0 2px 8px -4px rgba(0,0,0,.3)}
#E .urs-gros{font:500 46px/1 'Cormorant Garamond',Georgia,serif;font-variant-numeric:lining-nums;text-align:center;margin:16px 0 4px}
#E .urs-lig{display:flex;justify-content:space-between;gap:10px;font-size:14px;padding:9px 2px;border-bottom:1px solid var(--v-trait,#EFE9E4)}#E .urs-lig span{color:var(--gris)}#E .urs-lig b{font-weight:500;white-space:nowrap}
#E .urs-info{background:#fff;border-radius:14px;padding:11px 13px;font-size:13px;color:#4F4643;line-height:1.45;margin-top:12px}#E .urs-info b{font-weight:500}
#E .urs-lien{display:block;width:100%;min-height:44px;margin-top:6px;border:0;background:none;font:inherit;font-size:13.5px;color:var(--gris);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
@keyframes urs-in{from{opacity:0;transform:translateY(-4px)}}
@media (prefers-reduced-motion:reduce){#E .urs.rappel{animation:none}}`;
  document.head.appendChild(st);
})();
