/* ===== 12/11 (Marie) La fiche cliente en deux onglets : « Fiche » (prochain rendez-vous, visites, fidélité, historique) et « Notes »
   (ce que je sais / pas encore). Le formulaire (nom, téléphone…) passe derrière le petit crayon. + la fidélité dans les Réglages. =====
   Les notes sont rangées dans la colonne « notes » de la cliente : du texte simple, ou {v:1,t:"texte libre",s:[{q,r}]} quand il y a des « je sais ». */
(function () {
  const st = document.createElement("style");
  st.textContent = `.fi-haut{display:flex;align-items:flex-start;gap:8px;text-align:left;padding-right:46px}.fi-haut h3{margin:0;text-align:left;font-size:25px;line-height:1.1}.fi-haut small{display:block;margin-top:5px;font-size:12.5px;opacity:.6}
.fi-d{align-items:center;gap:12px}.fi-d .fi-g{flex:1;min-width:0}
.fi-d h3.fi-nom{font-size:30px;line-height:1.08;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fi-d h3.fi-nom.long{white-space:normal;overflow-wrap:anywhere}
.fi-d small{line-height:1.45;margin-top:4px}
.fi-carre{flex:none;display:grid;grid-template-columns:repeat(2,40px);gap:8px}.fi-carre .fi-rond{width:40px;height:40px;transition:transform .12s}.fi-carre .fi-rond:active{transform:scale(.92)}.fi-carre .fi-rond svg{width:17px;height:17px}
.fi-rond{flex:none;width:42px;height:42px;border-radius:50%;border:0;background:#fff;display:grid;place-items:center;padding:0}.fi-rond svg{width:18px;height:18px}
.fi-sw{display:flex;background:#fff;border-radius:999px;padding:4px;margin:16px 0 14px}.fi-sw button{flex:1;border:0;background:none;border-radius:999px;padding:11px 0;font:inherit;font-size:13.5px;font-weight:500;color:#8A847E}.fi-sw button.on{background:#1E1C1B;color:#fff}
.fi-k{margin:16px 0 8px;font-size:10.5px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#8A847E;text-align:left;display:flex;align-items:center;gap:8px}
.fi-noire{border-radius:20px;background:#1E1C1B;color:#fff;padding:14px 16px;text-align:left}.fi-noire small{display:block;font-size:10px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;opacity:.65;margin-bottom:5px}.fi-noire b{display:block;font-size:15.5px;font-weight:500;line-height:1.3}.fi-noire .fi-jour{font-size:20px;font-weight:400}.fi-noire .fi-h{display:block;font-size:14px;opacity:.75;margin-top:3px}.fi-bts{display:flex;gap:8px;margin-top:13px}.fi-bts button{flex:1;border:1px solid rgba(255,255,255,.45);background:none;color:#fff;border-radius:999px;padding:10px 0;font:inherit;font-size:13px;font-weight:500}.fi-bts button:first-child{background:#fff;color:#1E1C1B;border-color:#fff}
.fi-t3{display:grid;grid-template-columns:repeat(auto-fit,minmax(0,1fr));gap:8px;margin-top:10px;text-align:left}.fi-t3 div{background:#fff;border-radius:16px;padding:11px 12px}.fi-t3 small{display:block;font-size:9.5px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#8A847E;margin-bottom:4px}.fi-t3 b{font-size:17px;font-weight:500}.fi-t3 b em{font-style:normal;font-size:12px;font-weight:400;color:#8A847E}
.fi-carte{background:#fff;border-radius:20px;padding:4px 16px;text-align:left}.fi-lg{display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid rgba(30,28,27,.08);font-size:14px}.fi-lg:last-child{border-bottom:0}.fi-lg>div{flex:1;min-width:0}.fi-lg>div span{display:block;font-size:12px;color:#8A847E;margin-top:2px}.fi-lg em{font-style:normal;font-size:13.5px;white-space:nowrap}
.fi-q{flex:none;width:24px;height:24px;border-radius:50%;border:1px dashed rgba(30,28,27,.3);display:grid;place-items:center;font-size:11px;color:#8A847E}.fi-ic{flex:none;width:28px;height:28px;border-radius:9px;background:#EDE7E0;display:grid;place-items:center;font-size:13px}
.fi-b{flex:none;border:0;background:none;padding:6px 0 6px 8px;font:inherit;font-size:12.5px;font-weight:500;color:#1E1C1B}.fi-x{flex:none;border:0;background:none;padding:6px;font-size:15px;color:#8A847E}
.fi-in{flex:1;min-width:0;border:0;border-bottom:1px solid rgba(30,28,27,.25);background:none;font:inherit;font-size:16px;padding:6px 0;outline:none}
.fi-ecrire{display:block;width:100%;margin-top:10px;border:1px dashed rgba(30,28,27,.25);border-radius:16px;background:none;padding:13px 14px;font:inherit;font-size:13.5px;color:#8A847E;text-align:left}
.fi-lien{display:inline-block;margin-top:10px;border:0;background:none;padding:4px 0;font:inherit;font-size:13px;font-weight:500;text-decoration:underline;text-underline-offset:3px;color:#1E1C1B}
.fi-fid{background:#fff;border-radius:20px;padding:14px 16px;margin-top:10px;text-align:left}.fi-fid .ht{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px}.fi-fid .ht small{font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#8A847E}.fi-fid .ht b{font-size:13px;font-weight:400}
.fi-barre{height:10px;border-radius:5px;background:#EDE7E0;overflow:hidden}.fi-barre i{display:block;height:100%;border-radius:5px;background:#1E1C1B}.fi-fid p{margin:10px 0 0;font-size:12.5px;line-height:1.4;color:#6B625C}
.fi-aide{margin:8px 0 0;border-radius:14px;background:#EDE7E0;padding:11px 13px;font-size:12px;line-height:1.5;color:#6B625C;text-align:left}
.fi-pas{display:flex;align-items:center;gap:10px}.fi-pas button{width:30px;height:30px;border-radius:50%;border:0;background:#EDE7E0;font-size:16px;padding:0;color:#1E1C1B}.fi-pas b{font-size:15px;font-weight:500;min-width:22px;text-align:center}
.fi-puces{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 0}.fi-puces button{border:0;border-radius:999px;background:#fff;padding:9px 13px;font:inherit;font-size:12.5px;color:#1E1C1B}.fi-puces button.on{background:#1E1C1B;color:#fff}
/* 21/11 (D72) : les questions d'un doigt (Notes) et les petits carrés (Fiche) */
.fi-n .fi-lg{padding:4px 0;flex-wrap:wrap}.fi-n .fi-qq{line-height:1.25}.fi-n .fi-k{margin:14px 0 7px}
.fi-ic2{flex:none;width:32px;height:32px;border-radius:10px;background:var(--v-rose,#EDE7E0);display:grid;place-items:center;color:var(--v-fonce,#1E1C1B)}
.fi-ic2 svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.fi-lg>.fi-qq{flex:1;min-width:0}.fi-qq span{display:block;font-size:12px;color:#8A847E;margin-top:2px}
.fi-on{flex:none;display:flex;gap:3px;background:#F3EEE9;border-radius:999px;padding:2px}
.fi-on button,.fi-ch button{border:0;background:none;border-radius:999px;padding:5px 12px;line-height:1.2;font:inherit;font-size:12.5px;font-weight:500;color:#6B625C;transition:background .18s,color .18s,transform .12s}
.fi-on button:active,.fi-ch button:active{transform:scale(.94)}
.fi-on button.oui,.fi-ch button.oui{background:var(--v-fonce,#1E1C1B);color:#fff}.fi-on button.non{background:#fff;color:#1E1C1B;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.fi-lg>.fi-ch{flex:0 0 100%;display:flex;gap:5px;flex-wrap:wrap;padding:2px 0 4px 42px;animation:fi-deplie .22s cubic-bezier(.2,.8,.2,1) both}.fi-ch button{background:#F3EEE9;padding:7px 10px;font-size:12px}
@keyframes fi-deplie{from{opacity:0;transform:translateY(-6px)}}
.fi-li{flex:none;border:0;background:none;font:inherit;font-size:12.5px;font-weight:500;padding:6px 0 6px 8px;color:#1E1C1B;text-decoration:underline;text-underline-offset:3px}
.fi-sais{display:flex;align-items:center;justify-content:space-between}
.fi-ranger{border:0;background:#fff;border-radius:999px;padding:5px 12px;font:inherit;font-size:11.5px;font-weight:600;color:#1E1C1B;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.fi-cc{background:#fff;border-radius:20px;padding:14px 8px 10px;text-align:left}.fi-carres{display:grid;grid-template-columns:repeat(5,1fr);gap:12px 4px}
.fi-ca{min-width:0;display:flex;flex-direction:column;align-items:center;gap:5px;text-align:center;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;animation:fi-pop .26s cubic-bezier(.2,.9,.3,1.3) both}
.fi-ca b{font-size:10px;font-weight:500;line-height:1.15;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.fi-ca.non .fi-ic2{background:none;border:1px dashed rgba(30,28,27,.25)}.fi-ca.non svg{opacity:.35}.fi-ca.non b{color:#8A847E;font-weight:400}
.fi-carres.range .fi-ca{touch-action:none;cursor:grab}.fi-carres.range .fi-ca .fi-ic2{box-shadow:0 2px 6px rgba(30,28,27,.12);background:#fff;outline:1px solid rgba(30,28,27,.1)}
.fi-carres.range .fi-ca.tenu{opacity:.35}.fi-carres.range .fi-ca.tenu .fi-ic2{box-shadow:none;background:none;outline:1px dashed rgba(30,28,27,.35)}.fi-carres.range .fi-ca.tenu svg{opacity:0}
.fi-fant{position:fixed;z-index:9999;pointer-events:none;margin:0;animation:none;transform-origin:50% 40%}.fi-fant .fi-ic2{background:#fff;box-shadow:0 12px 26px rgba(30,28,27,.28)}.fi-fant b{background:rgba(246,242,238,.9);border-radius:6px;padding:0 3px}
.fi-bas{display:flex;justify-content:flex-end;margin-top:6px}.fi-rplus{width:26px;height:26px;border-radius:50%;border:0;background:var(--v-rose,#EDE7E0);font:inherit;font-size:16px;line-height:1;color:#1E1C1B;padding:0}
.fi-astuce{font-size:11.5px;color:#8A847E;margin:8px 2px 0;line-height:1.4;text-align:left}
@keyframes fi-pop{from{transform:scale(.6);opacity:0}}`;
  /* 23/11 (Marie) : « Prendre un rendez-vous » sur la fiche */
  st.textContent += `
.fi-prdv{width:100%;margin-top:10px;height:48px;border-radius:999px;border:1.5px solid #1E1C1B;background:#fff;color:#1E1C1B;font:inherit;font-size:14.5px;font-weight:500;display:flex;align-items:center;justify-content:center;gap:8px;transition:transform .12s,background .15s}
.fi-prdv:active{transform:scale(.97);background:#F3EEE8}
.fi-prdv svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
#E .md-pour{margin:3px 58px 0 24px;font-size:14px;color:#1E1C1B}#E .md-pour b{font-weight:600}`;
  document.head.appendChild(st);

  const IC = { tel: '<svg viewBox="0 0 24 24"><path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" fill="none" stroke="#1E1C1B" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    msg: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="#1E1C1B" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    insta: '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="#1E1C1B" stroke-width="1.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="#1E1C1B" stroke-width="1.6"/><circle cx="17.2" cy="6.8" r="1.1" fill="#1E1C1B"/></svg>',
    crayon: '<svg viewBox="0 0 24 24"><path d="M4 20l1-4L16 5l3 3L8 19z" fill="none" stroke="#1E1C1B" stroke-width="1.6" stroke-linejoin="round"/></svg>' };
  /* 21/11 (Marie, D72) : les questions de « Ce que je sais », pictos « traits fins » (série A), maquette site/idees/fiche-questions.html */
  const PI = {
    couple: '<path d="M12 20s-7-4.3-7-9.5A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.5C19 15.7 12 20 12 20z"/>',
    enfants: '<circle cx="12" cy="7.5" r="3"/><path d="M6.5 20c0-3.6 2.5-6.5 5.5-6.5s5.5 2.9 5.5 6.5"/><path d="M10.6 6.2c.7-.9 2.1-.9 2.8 0"/>',
    animal: '<path d="M8 17.5c0-2.6 1.8-4.8 4-4.8s4 2.2 4 4.8c0 1.5-1.2 2.3-2.4 2-1-.3-2.2-.3-3.2 0-1.2.3-2.4-.5-2.4-2z"/><ellipse cx="5.6" cy="11.2" rx="1.7" ry="2.1"/><ellipse cx="9.4" cy="6.9" rx="1.8" ry="2.3"/><ellipse cx="14.6" cy="6.9" rx="1.8" ry="2.3"/><ellipse cx="18.4" cy="11.2" rx="1.7" ry="2.1"/>',
    travail: '<rect x="4" y="8" width="16" height="11" rx="2.5"/><path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8M4 13h16"/>',
    vacances: '<circle cx="12" cy="12" r="3.6"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M6 18l1.4-1.4M16.6 7.4 18 6"/>',
    papote: '<path d="M4.5 6.5h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9l-3.5 3v-3h-1a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z"/><path d="M16.5 10h2a2 2 0 0 1 2 2v4.5a2 2 0 0 1-2 2h-.5v2.5l-3-2.5h-3"/>',
    autre: '<path d="M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8z"/>',
    forme: '<path d="M8 20V10.5C8 6.5 10 3.5 12 3.5s4 3 4 7V20z"/><path d="M10.5 9.5c.3-1.8 1-3 1.5-3"/>',
    longueur: '<path d="M12 3v18M8.5 6.5 12 3l3.5 3.5M8.5 17.5 12 21l3.5-3.5"/>',
    couleur: '<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"/>',
    nailart: '<path d="M16.5 4.5l3 3L9 18l-4 1 1-4z"/><path d="M14.5 6.5l3 3"/>',
    paillettes: '<path d="M9 4l1.2 3.6L14 9l-3.8 1.4L9 14l-1.2-3.6L4 9l3.8-1.4z"/><path d="M17 13l.7 2.1 2.3.9-2.3.8L17 19l-.7-2.2-2.3-.8 2.3-.9z"/>',
    retard: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>',
    photo: '<rect x="3.5" y="7" width="17" height="12" rx="3"/><circle cx="12" cy="13" r="3.2"/><path d="M9 7l1.2-2h3.6L15 7"/>',
    boisson: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16M9 3.5c-.6 1 .6 1.8 0 3M12.5 3.5c-.6 1 .6 1.8 0 3"/>',
    creneau: '<path d="M18.5 14.5A7 7 0 0 1 9.5 5.5a7 7 0 1 0 9 9z"/>',
    fete: '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M12 10v10M3.5 10h17M12 10c-1.5-3.5-5.5-4-5.5-1.8S10 10 12 10c1.5-3.5 5.5-4 5.5-1.8S14 10 12 10"/>',
    sport: '<path d="M6.5 8v8M17.5 8v8M4 10v4M20 10v4M6.5 12h11"/>',
    connue: '<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5 20 20"/>',
    passion: '<path d="M12 20.5c-3.6 0-6.2-2.4-6.2-5.7 0-3.6 3-5.3 3.6-8.6 2 1.3 3.1 3.1 3.1 4.7 1-.6 1.7-1.7 1.9-2.9 2.1 1.7 3.8 4.1 3.8 6.8 0 3.3-2.6 5.7-6.2 5.7z"/>',
    signe: '<path d="M12 3.5l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6L12 15.9l-5 2.8 1.2-5.6L4 9.3l5.6-.6z"/>',
    paiement: '<rect x="3.5" y="6" width="17" height="12" rx="2.5"/><path d="M3.5 10h17M7 14.5h3"/>' };
  const pic = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${PI[k] || PI.autre}</svg>`;
  /* [clé, question, type (on = Oui/Non, ch = choix, txt = écrit), réponses : pour « on » le mot du carré (oui, non)] */
  const GROUPES = [["Sa vie", [["travail", "Son métier ?", "txt"], ["couple", "En couple ?", "on", ["En couple", "Célibataire"]], ["enfants", "Des enfants ?", "on", ["Enfants", "Pas d’enfants"]],
      ["animal", "Un animal ?", "on", ["Animal", "Pas d’animal"]], ["sport", "Fait du sport ?", "on", ["Sportive", "Pas sportive"]], ["vacances", "Vacances bientôt ?", "on", ["Vacances", "Pas de vacances"]],
      ["fete", "Un grand jour bientôt ?", "ch", ["Mariage", "Anniversaire", "Soirée", "Voyage"]], ["papote", "Aime papoter ?", "on", ["Papote", "Aime le calme"]],
      ["passion", "Sa passion ?", "ch", ["Voyage", "Mode", "Cuisine", "Musique", "Séries", "Lecture"]],
      ["signe", "Son signe ?", "ch", ["Bélier", "Taureau", "Gémeaux", "Cancer", "Lion", "Vierge", "Balance", "Scorpion", "Sagittaire", "Capricorne", "Verseau", "Poissons"]]]],
    ["Son rendez-vous", [["boisson", "Elle boit quoi ?", "ch", ["Café", "Thé", "Eau", "Rien"]], ["retard", "Souvent en retard ?", "on", ["En retard", "À l’heure"]], ["paiement", "Elle paie comment ?", "ch", ["Carte", "Espèces", "Virement"]],
      ["photo", "D’accord pour les photos ?", "on", ["Photos OK", "Pas de photos"]], ["creneau", "Son moment préféré", "ch", ["Matin", "Midi", "Soir", "Samedi"]], ["connue", "Elle t’a connue comment ?", "ch", ["Instagram", "TikTok", "Google", "Une amie"]]]],
    ["Ses ongles", [["forme", "Sa forme préférée", "ch", ["Amande", "Carrée", "Ronde", "Ballerine", "Stiletto"]], ["longueur", "Sa longueur", "ch", ["Courts", "Moyens", "Longs"]], ["couleur", "Ses couleurs", "ch", ["Nude", "Rouge", "Pastel", "Foncé", "Flashy"]],
      ["nailart", "Aime le nail art ?", "on", ["Nail art", "Sobre"]], ["paillettes", "Aime les paillettes ?", "on", ["Paillettes", "Sans paillettes"]]]]];
  const QS = GROUPES.flatMap(g => g[1]), Qde = k => QS.find(q => q[0] === k), nbsp = t => esc(t).replace(/ \?/g, "&nbsp;?");
  const valide = (q, r) => q && r && (q[2] === "txt" || (q[2] === "on" ? r === "oui" || r === "non" : q[3].includes(r)));
  const motCarre = (q, r) => q[2] === "on" ? q[3][r === "oui" ? 0 : 1] : r;
  /* une idée pour lancer la conversation (gardée pour plus tard : window.__fiParler(cliente)) */
  const PARLER = { vacances: "Parle-lui de ses vacances.", enfants: "Demande-lui des nouvelles de ses enfants.", animal: "Demande-lui des nouvelles de son animal.", travail: "Demande-lui comment ça se passe au travail.",
    fete: "Demande-lui comment se prépare son grand jour.", sport: "Demande-lui où elle en est dans son sport.", passion: "Parle-lui de sa passion.", papote: "Demande-lui ce qu’elle a fait de beau ces derniers temps." };
  const JOURS3 = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
  const tel = t => String(t || "").replace(/[^\d+]/g, "");

  /* ---------- la fidélité (réglage du salon) ---------- */
  const FID0 = { on: false, n: 10, cadeau: "−10 €" }, CADEAUX = ["−10 €", "−20 %", "Nail art offert"];
  const litFid = () => { let o = null; try { o = (S.site && S.site.donnees && S.site.donnees.fidelite) || JSON.parse(localStorage.getItem("loginail-fidelite")); } catch (e) {} return Object.assign({}, FID0, o || {}); };
  const ecritFid = o => { try { localStorage.setItem("loginail-fidelite", JSON.stringify(o)); const b = JSON.parse(localStorage.getItem("loginail-brouillon") || "null"); if (b && S.site) { b.fidelite = o; S.site.donnees = Object.assign(S.site.donnees || {}, { fidelite: o }); localStorage.setItem("loginail-brouillon", JSON.stringify(b)); } } catch (e) {} };
  const etatFid = n => { const f = litFid(), k = n % f.n, pret = n > 0 && k === 0; return { f, fait: pret ? f.n : k, pret, reste: pret ? 0 : f.n - k }; };

  /* 13/11 (Marie, idée B) : les points en plus, ajoutés à la main depuis le rendez-vous (gardés avec ses notes) */
  window.__fid = { on: () => litFid().on, etat: c => etatFid((((S.vis || {})[c.id] || {}).n || 0) + litNotes(c).fp),
    plus: async c => { const o = litNotes(c); o.fp = (o.fp || 0) + 1; await ecritNotes(c.id, o); } };
  /* ---------- les notes ---------- */
  /* s = [{q, r}] : r = "oui" / "non" (Oui/Non), le choix, ou le texte (métier) ; {r} sans q = écrit à la main (ligne ✦).
     Les anciennes réponses écrites à la main sous une question (avant le 21/11 : « Oui, mariée ») deviennent des lignes ✦. */
  const litNotes = c => { const t = c.notes || ""; let o = null; if (t[0] === "{") try { o = JSON.parse(t); } catch (e) {} if (!o || !o.v) return { t, s: [], fp: 0, d: [] };
    const s = []; (o.s || []).forEach(x => { if (!x || !x.r) return; const q = x.q && Qde(x.q); if (q && valide(q, x.r)) { if (!s.some(y => y.q === x.q)) s.push({ q: x.q, r: x.r }); } else s.push({ r: String(x.r) }); });
    return { t: o.t || "", s, fp: +o.fp || 0, d: Array.isArray(o.d) ? o.d.filter(x => x && +x.m > 0) : [] }; };   /* 24/11 : d = ce qu'elle doit (modules/dettes.js) */
  window.__fiParler = c => { const s = litNotes(c).s, x = s.find(x => PARLER[x.q] && x.r !== "non"); return x ? PARLER[x.q] : "Demande-lui ce qu’elle a fait de beau ces derniers temps."; };

  /* ---------- l'ordre des carrés : rangé par elle, gardé dans son COMPTE (user_metadata.fiche_ordre), vaut pour toutes ses clientes ---------- */
  const ordCle = () => "loginail-fiche-ordre-" + ((S.user && S.user.id) || "");
  const litOrdre = () => { const m = S.user && S.user.user_metadata && S.user.user_metadata.fiche_ordre; if (Array.isArray(m)) return m; try { const l = JSON.parse(localStorage.getItem(ordCle()) || "null"); if (Array.isArray(l)) return l; } catch (e) {} return null; };
  const ecritOrdre = ord => { ord = ord.filter(k => Qde(k)).slice(0, 40); try { localStorage.setItem(ordCle(), JSON.stringify(ord)); } catch (e) {}
    if (S.user) { S.user.user_metadata = Object.assign({}, S.user.user_metadata, { fiche_ordre: ord });
      try { if (sb.auth && sb.auth.updateUser) sb.auth.updateUser({ data: { fiche_ordre: ord } }).then(r => { if (r && r.error) dit("Ordre pas enregistré, réessaie"); }).catch(() => {}); } catch (e) {} } };
  /* les carrés d'une cliente, dans son ordre (les « écrits à la main » à la suite) */
  const carres = c => { const s = litNotes(c).s, ord = litOrdre() || QS.map(q => q[0]), pos = k => { const i = ord.indexOf(k); return i < 0 ? 900 + QS.findIndex(q => q[0] === k) : i; };
    const a = s.filter(x => x.q).sort((x, y) => pos(x.q) - pos(y.q)).map(x => { const q = Qde(x.q); return { id: x.q, ic: x.q, non: q[2] === "on" && x.r === "non", t: motCarre(q, x.r), v: x.r }; });
    s.forEach((x, i) => { if (!x.q) a.push({ id: "L" + i, ic: "autre", t: x.r, v: x.r, libre: true }); }); return a; };
  async function ecritNotes(id, o) { const c0 = S.clientes.find(x => x.id === id), fp = o.fp != null ? o.fp : (c0 ? litNotes(c0).fp : 0), d = o.d || (c0 ? litNotes(c0).d : []); const notes = (o.s.length || fp || d.length) ? JSON.stringify(Object.assign({ v: 1, t: o.t, s: o.s, fp }, d.length ? { d } : {})) : (o.t || null); const c = S.clientes.find(x => x.id === id); if (c) c.notes = notes;
    const { error } = await sb.from("clientes").update({ notes }).eq("id", id); if (error) dit("Pas enregistré, réessaie"); return !error; }
  window.__notes = { lit: c => litNotes(c), ecrit: (id, o) => ecritNotes(id, o), montre: () => { if (ONG === "fiche" && E.classList.contains("fe") && $(".fi-sw", E)) montre(true); } };

  /* ---------- la fiche ---------- */
  let ID = null, ONG = "fiche", RDV = null, TOUT = false, SAISIE = null, OUV = null, RANGE = false, TOUS = false, DRAG = null, ORD = null, VUS = new Set();
  /* un nom long : l'écriture rapetisse (jusqu'à 23 px) ; s'il ne tient toujours pas, il passe sur 2 lignes plutôt que d'être coupé */
  const nomTient = () => { const n = document.querySelector(".fc .fi-nom"); if (!n) return; if (document.fonts && document.fonts.status !== "loaded") document.fonts.ready.then(() => { if (n.isConnected) nomTient(); }); let t = 30; n.style.fontSize = ""; n.classList.remove("long");
    while (n.scrollWidth > n.clientWidth + 1 && t > 23) { t--; n.style.fontSize = t + "px"; } if (n.scrollWidth > n.clientWidth + 1) n.classList.add("long"); };
  /* 22/11 (Marie, version D) : le nom sur UNE ligne à gauche (numéro et Insta en dessous), les ronds rangés en carré à droite (2 en haut, 2 en bas) */
  /* 22/11 : une cliente qui n'a que son Insta (prénom « @… », pas de nom) : « (@manon.nails) » comme dans la liste ; ce qui est enregistré ne change pas */
  const titreNom = c => String(c.prenom || "")[0] === "@" && !c.nom ? "(@" + String(c.instagram || c.prenom).replace(/^@/, "") + ")" : nomCli(c);
  const tete = c => `<div class="fi-haut fi-d"><div class="fi-g"><h3 class="fi-nom">${esc(titreNom(c))}</h3><small>${esc(c.telephone || "Pas de numéro")}${c.instagram && String(c.prenom || "")[0] !== "@" ? "<br>@" + esc(c.instagram) : ""}</small></div><div class="fi-carre">
    ${c.telephone ? `<button class="fi-rond" data-href="tel:${tel(c.telephone)}" aria-label="Appeler">${IC.tel}</button><button class="fi-rond" data-href="sms:${tel(c.telephone)}" aria-label="Envoyer un message">${IC.msg}</button>` : ""}
    ${c.instagram ? `<button class="fi-rond" data-href="https://www.instagram.com/${encodeURIComponent(c.instagram)}/" data-neuf aria-label="Son Instagram">${IC.insta}</button>` : ""}
    <button class="fi-rond" data-fi="modifier" aria-label="Modifier la fiche">${IC.crayon}</button></div></div>
    <div class="fi-sw"><button data-fi="ong" data-o="fiche" class="${ONG === "fiche" ? "on" : ""}">Fiche</button><button data-fi="ong" data-o="notes" class="${ONG === "notes" ? "on" : ""}">Notes</button></div>`;
  function pageFiche(c) { if (!RDV) return `<div class="sous" style="padding:30px 0">Un instant…</div>`;
    const now = new Date().toISOString(), ok = RDV.filter(r => r.statut !== "annule"), proch = ok.filter(r => r.fin >= now && r.statut === "prevu").sort((a, b) => a.debut.localeCompare(b.debut)), hist = ok.filter(r => r.fin < now || r.statut === "fini" || r.statut === "absente");
    const venues = hist.filter(r => r.statut !== "absente"), e = etatFid(venues.length + litNotes(c).fp), d = x => new Date(x), jj = x => `${JOURS3[d(x).getDay()]} ${jourCourt(x)}`;
    let h = "";
    /* 27/11 (Marie, version A) : plusieurs rendez-vous = cartes qu'on glisse + « Envoyer ses rendez-vous » (modules/fiche-plusieurs.js) */
    if (proch[0] && window.__prochFiche) h += window.__prochFiche(c, proch);
    else if (proch[0]) { const x = d(proch[0].debut), pn = (proch[0].prestations && proch[0].prestations.nom) || proch[0].titre;
      h += `<div class="fi-noire"><small>Prochain rendez-vous</small><b class="fi-jour">${JOURS[(x.getDay() + 6) % 7]} ${x.getDate()} ${MOIS[x.getMonth()]}</b><span class="fi-h">à ${x.getHours()}h${String(x.getMinutes()).padStart(2, "0")}${pn ? " · " + esc(pn) : ""}</span>
        <div class="fi-bts"><button data-a="decaler" data-id="${proch[0].id}">Déplacer</button><button data-rdv="${proch[0].id}">Voir</button></div></div>`; }
    else h += `<div class="fi-carte"><div class="fi-lg"><div>Pas de rendez-vous prévu<span>${venues.length ? "Sa dernière visite : " + jourCourt(venues[0].debut) : "Elle n’est pas encore venue"}</span></div></div></div>`;
    if (proch.length > 1 && !window.__prochFiche) h += `<div class="sous" style="text-align:left;margin:8px 2px 0">Et aussi : ${proch.slice(1, 3).map(r => jj(r.debut) + " à " + hm(d(r.debut))).join(" · ")}</div>`;
    h += `<button class="fi-prdv" data-fi="prdv"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14" rx="3"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4M12 12.5v5M9.5 15h5"/></svg>Prendre un rendez-vous</button>`;
    if (window.__suivantFiche) h += window.__suivantFiche(c, RDV);   /* 27/11 (Marie, version A) : « Le suivant » sous « Prendre un rendez-vous » (modules/le-suivant.js) */
    if (window.__detteFiche) h += window.__detteFiche(c);   /* 24/11 soir (Marie) : « Elle me doit » sous « Prendre un rendez-vous » */
    h += `<div class="fi-t3"><div><small>Visites</small><b>${venues.length}</b></div>${e.f.on ? `<div><small>Fidélité</small><b>${e.fait} <em>/ ${e.f.n}</em></b></div>` : ""}<div><small>Dernière</small><b>${venues.length ? jourCourt(venues[0].debut) : "—"}</b></div></div>`;
    if (window.__annulFiche) h += window.__annulFiche(c, RDV);   /* 24/11 : annulations au dernier moment (modules/annulations.js) */
    if (e.f.on) { const txt = e.pret ? `Bonjour ${c.prenom || ""}, votre carte de fidélité est complète : ${e.f.cadeau} à votre prochain rendez-vous ! ${S.profil.nom_salon || ""}`.trim() : `Bonjour ${c.prenom || ""}, vous en êtes à ${e.fait} visite${e.fait > 1 ? "s" : ""} sur ${e.f.n} sur votre carte de fidélité. Encore ${e.reste} avant votre cadeau : ${e.f.cadeau}. ${S.profil.nom_salon || ""}`.trim();
      h += `<div class="fi-fid"><div class="ht"><small>Carte de fidélité</small><b>${e.fait} visite${e.fait > 1 ? "s" : ""} sur ${e.f.n}</b></div><div class="fi-barre"><i style="width:${Math.round(e.fait / e.f.n * 100)}%"></i></div>
        <p>${e.pret ? "Sa carte est complète. Son cadeau : " + esc(e.f.cadeau) + "." : `Encore ${e.reste} visite${e.reste > 1 ? "s" : ""} avant son cadeau : ${esc(e.f.cadeau)}.`}</p>
        ${c.telephone ? `<button class="fi-lien" data-href="sms:${tel(c.telephone)}?&body=${encodeURIComponent(txt)}">Envoyer sa carte à ${esc(c.prenom || "la cliente")}</button>` : ""}</div>`; }
    h += `<div class="fi-k">Historique</div>`;
    h += hist.length ? `<div class="fi-carte">${(TOUT ? hist : hist.slice(0, 4)).map(r => `<div class="fi-lg" data-rdv="${r.id}"><div>${d(r.debut).getDate()} ${MOISC[d(r.debut).getMonth()]} ${d(r.debut).getFullYear()}<span>${esc((r.prestations && r.prestations.nom) || r.titre || "Rendez-vous")}${r.statut === "absente" ? " · absente" : ""}</span></div><em>${r.statut === "absente" ? "" : euros(r.prix)}</em></div>`).join("")}</div>${hist.length > 4 && !TOUT ? `<button class="fi-lien" data-fi="tout">Voir tout (${hist.length})</button>` : ""}`
      : `<div class="fi-carte"><div class="fi-lg"><div>Rien pour l’instant<span>Ses rendez-vous passés s’afficheront ici.</span></div></div></div>`;
    return h + `<div id="fi-sais">${blocSais(c)}</div>`; }
  /* « Ce que je sais » en petits carrés : 2 lignes de 5 (10 au plus, dans son ordre), « + » pour le reste ; Ranger = glisser */
  function blocSais(c) { let tout = carres(c); if (ORD) { const p = k => { const i = ORD.indexOf(k); return i < 0 ? 999 : i; }; tout = tout.slice().sort((x, y) => (x.libre ? 1000 : p(x.id)) - (y.libre ? 1000 : p(y.id))); }
    const vus = tout.slice(0, RANGE || TOUS ? tout.length : 10);
    const ca = vus.map(it => { const neuf = !VUS.has(it.id + "|" + it.v); VUS.add(it.id + "|" + it.v);
      return `<div class="fi-ca${it.non ? " non" : ""}${DRAG === it.id ? " tenu" : ""}" data-ca="${esc(it.id)}"${it.libre ? " data-libre" : ""} style="${neuf && !RANGE ? "" : "animation:none"}"><span class="fi-ic2">${pic(it.ic)}</span><b>${esc(it.t)}</b></div>`; }).join("");
    const titre = `<div class="fi-k fi-sais">Ce que je sais${ca && tout.some(x => !x.libre) ? `<button class="fi-ranger" data-fi="ranger">${RANGE ? "OK" : "Ranger"}</button>` : ""}</div>`;
    if (!ca) return titre + `<div class="fi-cc" style="font-size:12.5px;color:#8A847E;padding:14px">Rien pour l’instant : réponds dans Notes.</div>`;
    const rond = tout.length > 10 && !RANGE ? `<div class="fi-bas"><button class="fi-rplus" data-fi="tous" aria-label="${TOUS ? "Voir moins" : "Voir le reste"}">${TOUS ? "−" : "+"}</button></div>` : "";
    return titre + `<div class="fi-cc"><div class="fi-carres${RANGE ? " range" : ""}">${ca}</div>${rond}</div>${RANGE ? `<div class="fi-astuce">Fais glisser les carrés où tu veux. Ton ordre vaut pour toutes tes clientes.</div>` : ""}`; }
  /* redessine seulement les carrés (pendant qu'elle range : la feuille ne bouge pas) */
  const redessineSais = () => { const z = $("#fi-sais", E), c = S.clientes.find(x => x.id === ID); if (z && c) z.innerHTML = blocSais(c); };
  /* l'onglet Notes : seulement les questions, d'un doigt (D72) */
  function pageNotes(c) { const o = litNotes(c), v = k => (o.s.find(x => x.q === k) || {}).r;
    const champ = (k, ph, val, max) => `<input class="fi-in" id="fi-rep" placeholder="${ph}" maxlength="${max}" autocomplete="off" value="${esc(val || "")}"><button class="fi-b" data-fi="ok" data-q="${k}">OK</button>`;
    const ligne = q => { const [k, t, ty, rs] = q, r = v(k), ic = `<span class="fi-ic2">${pic(k)}</span>`;
      if (ty === "on") return `<div class="fi-lg">${ic}<div class="fi-qq">${nbsp(t)}</div><span class="fi-on"><button data-fi="rep" data-q="${k}" data-r="oui" class="${r === "oui" ? "oui" : ""}">Oui</button><button data-fi="rep" data-q="${k}" data-r="non" class="${r === "non" ? "non" : ""}">Non</button></span></div>`;
      if (ty === "txt") return SAISIE === k ? `<div class="fi-lg">${ic}${champ(k, "Par exemple : infirmière", r, 40)}</div>`
        : `<div class="fi-lg">${ic}<div class="fi-qq">${nbsp(t)}${r ? `<span>${esc(r)}</span>` : ""}</div><button class="fi-li" data-fi="sais" data-q="${k}">${r ? "Changer" : "Écrire"}</button></div>`;
      if (OUV !== k) return `<div class="fi-lg">${ic}<div class="fi-qq">${nbsp(t)}${r ? `<span>${esc(r)}</span>` : ""}</div><button class="fi-li" data-fi="ouv" data-q="${k}">${r ? "Changer" : "Choisir"}</button></div>`;
      return `<div class="fi-lg">${ic}<div class="fi-qq" data-fi="ouv" data-q="${k}">${nbsp(t)}</div><div class="fi-ch">${rs.map(x => `<button data-fi="rep" data-q="${k}" data-r="${esc(x)}" class="${r === x ? "oui" : ""}">${esc(x)}</button>`).join("")}</div></div>`; };
    let h = `<div class="fi-n">`;
    GROUPES.forEach(([t, qs], i) => { h += `<div class="fi-k"${i ? "" : ' style="margin-top:4px"'}>${t}</div><div class="fi-carte">${qs.map(ligne).join("")}</div>`; });
    const li = o.s.map((x, i) => [x, i]).filter(([x]) => !x.q);
    h += `<div class="fi-k">Autre chose</div>` + (li.length ? `<div class="fi-carte">${li.map(([x, i]) => `<div class="fi-lg"><span class="fi-ic2">${pic("autre")}</span><div class="fi-qq">${esc(x.r)}</div><button class="fi-x" data-fi="oter" data-i="${i}" aria-label="Enlever">×</button></div>`).join("")}</div>` : "");
    h += SAISIE === "+" ? `<div class="fi-carte" style="margin-top:10px"><div class="fi-lg">${champ("+", "Par exemple : aime les paillettes dorées", "", 40)}</div></div>` : `<button class="fi-ecrire" data-fi="sais" data-q="+">✎ Écrire autre chose à la main</button>`;
    h += `<div class="fi-k">Mes notes libres</div><textarea class="msg" id="fi-libre" placeholder="Tout ce que tu veux garder en tête">${esc(o.t)}</textarea></div>`;
    return h; }
  /* 21/11 (Marie) : le crayon puis « × » ramène à la fiche (Fiche / Notes), il ne ferme plus tout */
  let MODIF = false;
  document.addEventListener("click", e => { if (!MODIF || !E.classList.contains("fe")) return; const x = e.target.closest && e.target.closest('[data-a="fermer"], .voile'); if (!x) return;
    if (!$("#c-p", E)) { MODIF = false; return; } e.stopPropagation(); e.preventDefault(); const a = document.activeElement; if (a && a.blur) a.blur(); montre(); }, true);
  function montre(garde) { MODIF = false; const c = S.clientes.find(x => x.id === ID); if (!c) return ferme(); const z = $(".feuille", E), y = garde && z ? z.scrollTop : 0;
    ouvre(tete(c) + (ONG === "fiche" ? pageFiche(c) : pageNotes(c))); nomTient(); if (z && garde) z.scrollTop = y; const r = $("#fi-rep", E); if (r) r.focus(); }
  async function chargeRdv() { const id = ID; const { data } = await sb.from("rendez_vous").select("*, prestations(id,nom)").eq("cliente_id", id).order("debut", { ascending: false }); if (ID !== id) return; RDV = data || []; if (ONG === "fiche" && E.classList.contains("fe") && $(".fi-sw", E)) montre(true); }

  document.addEventListener("click", e => { const a = e.target.closest && e.target.closest(".fc [data-rdv], .fc [data-a='decaler']"); if (!a || !RDV) return; const id = a.dataset.rdv || a.dataset.id; if (S.rdv.some(x => x.id === id)) return;
    const r = RDV.find(x => x.id === id), c = S.clientes.find(x => x.id === ID); if (r) S.rdv.push(Object.assign({}, r, { clientes: c ? { id: c.id, prenom: c.prenom, nom: c.nom, telephone: c.telephone } : null })); }, true);
  /* 23/11 (Marie : « on cale ses rdv direct ») : depuis la fiche, « Prendre un rendez-vous » ouvre Mes dispos ;
     « Noter le RDV » ouvre le formulaire avec son nom déjà écrit (seulement si on vient bien de Mes dispos ouvert depuis sa fiche) */
  let POUR = null; const nouveau0 = feuilleNouveau;
  feuilleNouveau = function (m) { const p = POUR && E.querySelector(".fc .md-pour") && S.clientes.find(x => x.id === POUR); POUR = null; nouveau0(m);
    const i = p && $("#n-cli", E); if (i) { i.value = nomCli(p); i.dispatchEvent(new Event("change", { bubbles: true })); } };
  window.__ficheId = () => ID;   /* 24/11 : la fiche ouverte (modules/temps-plus.js) */
  const formulaire = feuilleCliente;   /* le formulaire d'origine (nom, téléphone, anniversaire) */
  feuilleCliente = function (id) { if (!id) return formulaire(id); ID = id; ONG = "fiche"; RDV = null; TOUT = false; SAISIE = null; OUV = null; RANGE = false; TOUS = false; DRAG = null; ORD = null; VUS = new Set(); montre(); chargeRdv(); };

  document.addEventListener("click", async e => { const a = e.target.closest && e.target.closest("[data-fi]"); if (!a) return; e.stopPropagation(); const k = a.dataset.fi, c = S.clientes.find(x => x.id === ID);
    if (k === "ong") { if (RANGE) finRange(); ONG = a.dataset.o; SAISIE = null; OUV = null; montre(); }
    else if (k === "prdv") { if (!c || !window.mesDispos) return; POUR = c.id; window.mesDispos(true);
      const t = $(".fc .md h3", E); if (t) t.insertAdjacentHTML("afterend", `<div class="md-pour">Pour <b>${esc(titreNom(c))}</b></div>`); }
    else if (k === "tout") { TOUT = true; montre(true); }
    else if (k === "ouv") { OUV = OUV === a.dataset.q ? null : a.dataset.q; SAISIE = null; montre(true); }
    /* Oui / Non / un choix ; retoucher la réponse déjà choisie l'efface (= « je ne sais pas ») */
    else if (k === "rep" && c) { const q = a.dataset.q, r = a.dataset.r, o = litNotes(c), x = o.s.find(y => y.q === q);
      if (x && x.r === r) { o.s = o.s.filter(y => y !== x); dit("Réponse effacée : tu ne sais pas"); } else if (x) x.r = r; else o.s.push({ q, r });
      if ((Qde(q) || [])[2] === "ch") OUV = null; ecritNotes(ID, o); montre(true); }
    else if (k === "tous") { TOUS = !TOUS; redessineSais(); }
    else if (k === "ranger") { if (RANGE) finRange(); else { RANGE = true; redessineSais(); } }
    else if (k === "modifier") { formulaire(ID); MODIF = true; const t = $("#c-no", E); if (t) { t.value = (c && c.notes) || ""; t.style.display = "none"; const l = t.previousElementSibling; if (l && l.classList.contains("lab2")) l.style.display = "none"; } }
    else if (k === "sais") { SAISIE = a.dataset.q; OUV = null; montre(true); }
    else if (k === "ok" && c) { const v = ($("#fi-rep", E).value || "").trim(), q = a.dataset.q, o = litNotes(c);
      if (q === "+") { if (!v) { SAISIE = null; return montre(true); } o.s.push({ r: v }); }
      else { const x = o.s.find(y => y.q === q); if (!v) { if (x) { o.s = o.s.filter(y => y !== x); dit("Réponse effacée : tu ne sais pas"); } } else if (x) x.r = v; else o.s.push({ q, r: v }); }
      SAISIE = null; ecritNotes(ID, o); montre(true); }
    else if (k === "oter" && c) { const o = litNotes(c); o.s.splice(+a.dataset.i, 1); await ecritNotes(ID, o); montre(true); }
    /* la fidélité, dans les Réglages */
    else if (k === "fid-on") { const f = litFid(); f.on = !f.on; ecritFid(f); rendu(); }
    else if (k === "fid-n") { const f = litFid(); f.n = Math.max(3, Math.min(20, f.n + +a.dataset.d)); ecritFid(f); rendu(); }
    else if (k === "fid-c") { const f = litFid(); f.cadeau = a.dataset.c; ecritFid(f); rendu(); }
  }, true);
  /* ---------- Ranger : appui long (ou bouton Ranger), on prend le carré, il suit le doigt, les autres glissent, il se pose ---------- */
  const lesCa = () => [...E.querySelectorAll("#fi-sais .fi-ca")], caDe = id => lesCa().find(x => x.dataset.ca === id);
  const idsVus = () => lesCa().map(x => x.dataset.ca);
  function finRange() { RANGE = false; if (ORD) { const vus = ORD.filter(k => Qde(k)), reste = QS.map(q => q[0]).filter(k => !vus.includes(k)), anc = litOrdre() || QS.map(q => q[0]);
      /* les questions sans réponse chez cette cliente gardent leur place d'avant, à la suite */
      ecritOrdre(vus.concat(anc.filter(k => reste.includes(k))).concat(reste.filter(k => !anc.includes(k)))); dit("C’est rangé ✓"); } ORD = null; redessineSais(); }
  function flip(fn) { const a = {}; lesCa().forEach(x => a[x.dataset.ca] = x.getBoundingClientRect()); fn();
    lesCa().forEach(x => { const o = a[x.dataset.ca]; if (!o || x.dataset.ca === DRAG) return; const n = x.getBoundingClientRect(), dx = o.left - n.left, dy = o.top - n.top; if (!dx && !dy) return;
      x.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" }); }); }
  let FANT = null, R0 = null, OX = 0, OY = 0, TX = 0, TY = 0, APPUI = null, PX = 0, PY = 0;
  function prend(id, x, y) { const ca = caDe(id); if (!ca) return; R0 = ca.getBoundingClientRect(); TX = 0; TY = 0; OX = x - R0.left; OY = y - R0.top; DRAG = id;
    FANT = ca.cloneNode(true); FANT.className = "fi-ca fi-fant" + (ca.classList.contains("non") ? " non" : ""); FANT.style.cssText = `left:${R0.left}px;top:${R0.top}px;width:${R0.width}px`; document.body.appendChild(FANT);
    FANT.animate([{ transform: "scale(1)" }, { transform: "scale(1.18) rotate(-3deg)" }], { duration: 160, easing: "cubic-bezier(.2,.8,.2,1.3)", fill: "forwards" });
    try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {} redessineSais(); mesure(); LX = x; LY = y; }
  /* 22/11 : les places sont mesurées une fois (carrés au repos), on vise la place la plus proche du doigt : plus d'« elementFromPoint » sur des carrés qui glissent */
  let SL = [], LX = 0, LY = 0;
  const mesure = () => { lesCa().forEach(x => x.getAnimations().forEach(a => a.cancel())); SL = lesCa().filter(x => !x.hasAttribute("data-libre")).map(x => { const r = x.getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height }; }); };
  function place(x, y) { if (!DRAG || !SL.length) return; let bi = -1, bd = 1e9;
    SL.forEach((s, i) => { const d = Math.hypot(x - (s.l + s.w / 2), y - (s.t + s.h / 2)); if (d < bd) { bd = d; bi = i; } });
    if (bi < 0 || bd > 1.3 * Math.max(SL[bi].w, SL[bi].h)) return;
    const ids = idsVus().filter(k => !k.startsWith("L")), cur = ids.indexOf(DRAG); if (cur < 0 || cur === bi) return;
    flip(() => { ORD = ids.filter(k => k !== DRAG); ORD.splice(bi, 0, DRAG); redessineSais(); }); }
  function bouge(x, y) { if (!FANT) return; LX = x; LY = y; FANT.getAnimations().forEach(a => a.cancel()); TX = x - OX - R0.left; TY = y - OY - R0.top; FANT.style.transform = `translate(${TX}px,${TY}px) scale(1.18) rotate(-3deg)`; place(x, y); }
  function pose() { const f = FANT, id = DRAG; FANT = null; if (!f) { DRAG = null; return; } place(LX, LY);
    const i = idsVus().filter(k => !k.startsWith("L")).indexOf(id), r = SL[i] ? { left: SL[i].l, top: SL[i].t } : R0;
    f.getAnimations().forEach(x => x.cancel()); f.style.transform = "none"; f.style.left = r.left + "px"; f.style.top = r.top + "px"; const dx = R0.left + TX - r.left, dy = R0.top + TY - r.top;
    f.animate([{ transform: `translate(${dx}px,${dy}px) scale(1.18) rotate(-3deg)` }, { transform: "none" }], { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" });
    setTimeout(() => { f.remove(); if (!FANT) { DRAG = null; redessineSais(); } }, 240); }
  const surCa = e => e.target.closest && e.target.closest("#fi-sais .fi-ca:not([data-libre])");
  /* les carrés ne doivent ni fermer la feuille (glisser vers le bas) ni lancer « tirer pour actualiser » */
  document.addEventListener("touchstart", e => { if (surCa(e) && (RANGE || ONG === "fiche")) e.stopPropagation(); }, { capture: true, passive: true });
  document.addEventListener("pointerdown", e => { const ca = surCa(e); if (!ca) return; PX = e.clientX; PY = e.clientY;
    if (!RANGE) { const id = ca.dataset.ca; clearTimeout(APPUI); APPUI = setTimeout(() => { APPUI = null; RANGE = true; redessineSais(); prend(id, PX, PY); }, 450); return; }
    e.preventDefault(); prend(ca.dataset.ca, e.clientX, e.clientY); });
  const bougeDoigt = (x, y, e) => { if (APPUI && Math.hypot(x - PX, y - PY) > 8) { clearTimeout(APPUI); APPUI = null; } if (FANT) { if (e.cancelable) e.preventDefault(); bouge(x, y); } };
  document.addEventListener("pointermove", e => bougeDoigt(e.clientX, e.clientY, e), { passive: false });
  document.addEventListener("touchmove", e => { const t = e.touches[0]; if (t) bougeDoigt(t.clientX, t.clientY, e); }, { passive: false });
  const lache = () => { clearTimeout(APPUI); APPUI = null; pose(); };
  document.addEventListener("pointerup", lache); document.addEventListener("touchend", lache); document.addEventListener("touchcancel", lache);
  /* si le navigateur « vole » le geste pendant qu'on tient un carré, on continue avec le doigt (touchmove) */
  document.addEventListener("pointercancel", e => { if (e.pointerType !== "touch") lache(); else { clearTimeout(APPUI); APPUI = null; } });
  document.addEventListener("contextmenu", e => { if (surCa(e)) e.preventDefault(); });
  document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.id === "fi-rep") { const b = e.target.parentElement.querySelector('[data-fi="ok"]'); if (b) b.click(); } });
  document.addEventListener("focusout", async e => { if (e.target.id !== "fi-libre") return; const c = S.clientes.find(x => x.id === ID); if (!c) return; const o = litNotes(c), v = e.target.value.trim(); if (v !== o.t) { o.t = v; await ecritNotes(ID, o); dit("C’est enregistré ✓"); } });
  document.addEventListener("change", e => { if (e.target.id !== "fi-cad") return; const f = litFid(), v = e.target.value.trim(); if (v) { f.cadeau = v.slice(0, 40); ecritFid(f); rendu(); } });

  /* ---------- les Réglages : la fidélité ---------- */
  const v0 = VUES.re;
  VUES.re = () => { const f = litFid(), repere = '<div class="k">SMS à mes clientes</div>';
    const bloc = `<div class="k">Fidélité</div><div class="liste"><div class="ligne"><div class="t">Carte de fidélité<span>${f.on ? "Une visite de plus à chaque rendez-vous passé" : "Désactivée"}</span></div><button class="sw${f.on ? " on" : ""}" data-fi="fid-on" aria-label="Carte de fidélité"></button></div>
      ${f.on ? `<div class="ligne"><div class="t">Cadeau après</div><span class="fi-pas"><button data-fi="fid-n" data-d="-1" aria-label="Moins">−</button><b>${f.n}</b><button data-fi="fid-n" data-d="1" aria-label="Plus">+</button></span><span style="font-size:13px;opacity:.6;margin-left:8px">visites</span></div>
      <div class="ligne" style="display:block"><div class="t">Le cadeau</div><div class="fi-puces">${CADEAUX.map(c => `<button data-fi="fid-c" data-c="${c}" class="${f.cadeau === c ? "on" : ""}">${c}</button>`).join("")}</div>
        <input class="fi-in" id="fi-cad" style="width:100%;margin-top:10px" placeholder="Ou écris le tien" value="${CADEAUX.includes(f.cadeau) ? "" : esc(f.cadeau)}" maxlength="40" autocomplete="off"></div>` : ""}</div>`;
    const h = v0(); return h.includes(repere) ? h.replace(repere, bloc + repere) : h + bloc; };
})();
