/* Loginail · la vraie appli, version 2 (06/11) : le design de la démo + les vraies données du coffre.
   Étape 1 : connexion, accueil, agenda façon papier, fiche rendez-vous, nouveau rendez-vous, clientes, mon site, réglages. */
const sb = supabase.createClient("https://scfhaombuptmrlkdhcsl.supabase.co", "sb_publishable_lYx1ZH0k3EFrUhZ3v0W8gw_yhGPOhbq", { auth: { persistSession: true, detectSessionInUrl: true } });
const E = document.getElementById("E");
const $ = (q, z) => (z || document).querySelector(q);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"], COURT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const hm = d => String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
const euros = n => n == null ? "" : String(Math.round(n * 100) / 100).replace(".", ",") + " €";
const duree = m => m < 60 ? m + " min" : Math.floor(m / 60) + " h" + (m % 60 ? " " + String(m % 60).padStart(2, "0") : "");
const plusJours = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const lundiDe = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x; };
const memeJour = (a, b) => a.toDateString() === b.toDateString();
const nomCli = c => c ? [c.prenom, c.nom].filter(Boolean).join(" ") : "";
const I = {
  acc: '<svg viewBox="0 0 24 24"><path d="M4 11l8-6.5 8 6.5V20H4z"/></svg>',
  ag: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  cl: '<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.5"/><path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5"/></svg>',
  si: '<svg viewBox="0 0 24 24"><rect x="6" y="2.8" width="12" height="18.4" rx="3"/><path d="M10.5 18h3"/></svg>',
  re: '<svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>',
  lo: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg>',
  tel: '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  msg: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z"/></svg>' };
const ONG = [["acc", "Accueil"], ["ag", "Agenda"], ["cl", "Clientes"], ["si", "Mon site"], ["re", "Réglages"]];
const S = { user: null, profil: {}, prestations: [], clientes: [], rdv: [], site: null, onglet: "acc", lundi: lundiDe(new Date()), jour: new Date(), cherche: "" };
const OUV = 8 * 60, FERM = 20 * 60, R = 30;
/* les modules « Mon site » de la démo (style, contenu, photos, légal…) s'appuient sur ces trois-là */
const MSF = {}, MS = {}, croix = "";
/* tout ce que ces modules enregistrent (dans le brouillon du téléphone) part aussi dans le coffre */
const _setItem = Storage.prototype.setItem;
Storage.prototype.setItem = function (k, v) { _setItem.call(this, k, v); if (this === localStorage && k === "loginail-brouillon" && !window.__pasSync) pousseSite(); };
/* les changements faits dans le site ouvert en grand (même appareil) partent aussi dans le coffre */
addEventListener("storage", e => { if (e.key === "loginail-brouillon") pousseSite(); });
addEventListener("message", m => { if (m.data === "loginail-site-enregistre") pousseSite(); });
let _tp; const pousseSite = () => { clearTimeout(_tp); _tp = setTimeout(async () => { if (!S.user || !S.site) return; const d = brouillon(); if (!d) return;
  delete d.univers; delete d.exempleFictif; delete d._charmsU;
  const { error } = await sb.from("sites").update({ donnees: d, maj: new Date().toISOString() }).eq("pro_id", S.user.id);
  if (error) { console.error(error); dit("Pas enregistré en ligne, réessayez"); } else S.site.donnees = d; }, 700); }; /* l'agenda papier : 8 h → 20 h, 30 px par demi-heure */

/* ---------- le squelette (comme la démo) ---------- */
function squelette() {
  E.innerHTML = ONG.map(o => `<div class="vue" data-p="${o[0]}"></div>`).join("")
    + `<nav class="ong o1">${ONG.map(o => `<button data-go="${o[0]}">${I[o[0]]}<span>${o[1]}</span></button>`).join("")}</nav>`
    + '<div class="voile" data-a="fermer"></div><div class="feuille"><div class="poig"></div><div class="fc"></div></div><div class="toast"></div>';
}
const dit = t => { const z = $(".toast", E); if (!z) return; z.textContent = t; z.classList.add("on"); clearTimeout(z._t); z._t = setTimeout(() => z.classList.remove("on"), 2200); };
const ouvre = h => { $(".fc", E).innerHTML = '<button class="fe-x" data-a="fermer" aria-label="Fermer">×</button>' + h; E.classList.add("fe"); $(".feuille", E).scrollTop = 0; };
const ferme = () => E.classList.remove("fe");
const oups = e => { console.error(e); dit("Oups, ça n’a pas marché. Réessayez."); };
const tete = (t, s, d) => `<div class="tete"><div><small>${s || ""}</small><h1>${t}</h1></div>${d || ""}</div>`;

/* ---------- connexion (code ou lien par e-mail, sans mot de passe) ---------- */
function ecranConnexion(envoye) {
  E.innerHTML = `<div class="vue on"><div class="cx"><div class="marque">LOGINAIL</div>
    ${envoye ? `<h1>Regardez vos e-mails.</h1><div class="ok">Nous venons d’envoyer un e-mail à <b>${esc(envoye)}</b>. Le code est dans son titre.</div>
      <input id="cx-code" inputmode="numeric" autocomplete="one-time-code" maxlength="8" placeholder="Le code" style="text-align:center;letter-spacing:.3em;font-size:20px" data-mail="${esc(envoye)}">
      <button class="btn" data-a="cx-code">Me connecter</button><button class="lien-t" data-a="cx-retour">Changer d’adresse</button>`
    : `<h1>Votre espace pro.</h1><p>Entrez votre adresse e-mail : nous vous envoyons un code pour vous connecter, sans mot de passe.</p>
      <input id="cx-mail" type="email" inputmode="email" autocomplete="email" placeholder="votre@adresse.fr"><button class="btn" data-a="cx-envoi">Recevoir mon code</button>`}
    </div></div><div class="toast"></div>`;
}

/* ---------- les données ---------- */
async function chargeTout() {
  const [p, pr, cl, st] = await Promise.all([
    sb.from("profils").select("*").eq("id", S.user.id).maybeSingle(),
    sb.from("prestations").select("*").order("ordre").order("cree_le"),
    sb.from("clientes").select("*").order("prenom"),
    sb.from("sites").select("slug,en_ligne,maj,donnees").maybeSingle()]);
  if (p.error || pr.error || cl.error) throw p.error || pr.error || cl.error;
  S.profil = p.data || {}; S.prestations = pr.data || []; S.clientes = cl.data || []; S.site = st.data || null;
  if (S.site && S.site.donnees && S.site.donnees.nom) { window.__pasSync = 1; localStorage.setItem("loginail-brouillon", JSON.stringify(S.site.donnees)); window.__pasSync = 0; }
  await chargeSemaine();
}
async function chargeSemaine() {
  const de = S.lundi, a = plusJours(S.lundi, 7);
  const { data, error } = await sb.from("rendez_vous").select("*, clientes(id,prenom,nom,telephone), prestations(id,nom)")
    .gte("debut", de.toISOString()).lt("debut", a.toISOString()).order("debut");
  if (error) throw error; S.rdv = data || [];
  const d0 = new Date(); d0.setDate(1); d0.setMonth(d0.getMonth() - 1); d0.setHours(0, 0, 0, 0);
  const t = await sb.from("tickets").select("*").gte("cree_le", d0.toISOString()).order("cree_le", { ascending: false });
  S.tickets = t.data || [];
}
/* ce qu'on propose quand on ajoute un rendez-vous : les prestations de l'appli, sinon celles du site */
const prestasDispo = () => S.prestations.length ? S.prestations.map(p => ({ id: p.id, nom: p.nom, duree: p.duree_min, prix: p.prix }))
  : ((S.site && S.site.donnees && S.site.donnees.prestations) || []).map(p => ({ id: null, nom: p.nom, duree: p.duree || 60, prix: p.prix }));
const titreRdv = r => r.prestations?.nom || (r.clientes ? r.titre : "") || "";
const nomRdv = r => r.clientes ? nomCli(r.clientes) : (r.titre || "Bloqué");

/* ---------- les pages ---------- */
function vueAccueil() {
  const maint = new Date(), auj = S.rdv.filter(r => memeJour(new Date(r.debut), maint) && r.statut !== "annule");
  const proch = auj.find(r => new Date(r.fin) > maint && r.statut === "prevu");
  const nouv = S.rdv.filter(r => r.source === "en_ligne" && new Date(r.cree_le) > plusJours(maint, -1)).length;
  let h = tete("Bonjour" + (S.profil.prenom ? " " + esc(S.profil.prenom) : ""), `${JOURS[(maint.getDay() + 6) % 7]} ${maint.getDate()} ${MOIS[maint.getMonth()]}`);
  if (nouv) h += `<div class="nouv" data-go="ag"><i></i><span><b>Depuis hier :</b> ${nouv} réservation${nouv > 1 ? "s" : ""} en ligne</span><span class="fl">›</span></div>`;
  if (proch) { const d = new Date(proch.debut), mn = Math.round((d - maint) / 60000);
    h += `<div class="noire prochain" data-rdv="${proch.id}"><small>Prochain rendez-vous</small><div class="l1"><b>${hm(d)}</b><span>${mn > 0 ? "dans " + (mn >= 60 ? duree(mn) : mn + " min") : "en cours"}</span></div><div class="nom">${esc(nomRdv(proch))}</div><div class="pr">${esc(titreRdv(proch))}${proch.prix ? " · " + euros(proch.prix) : ""}</div>
      <div class="bts">${proch.clientes?.telephone ? `<button data-href="tel:${esc(proch.clientes.telephone.replace(/\s/g, ""))}">Appeler</button><button data-href="sms:${esc(proch.clientes.telephone.replace(/\s/g, ""))}">Message</button>` : ""}</div></div>`; }
  h += `<div class="k">Aujourd’hui · ${auj.length} rendez-vous <a data-go="ag">Agenda</a></div>`;
  h += auj.length ? `<div class="carte">${auj.map(ligneRdv).join("")}</div>`
    : `<div class="blanche vide2"><div class="t"><b>Pas de rendez-vous aujourd’hui</b><span>Les réservations de votre site arrivent ici toutes seules.</span></div><button class="pil noir" data-a="nouveau">Ajouter</button></div>`;
  return h;
}
const ligneRdv = r => { const d = new Date(r.debut), st = { fini: "fini", absente: "pas venue" }[r.statut];
  return `<div class="rdv" data-rdv="${r.id}"><div class="h">${hm(d)}</div><div class="t"><b>${esc(nomRdv(r))}${r.source === "en_ligne" ? '<em class="en-ligne">En ligne</em>' : ""}</b><span>${esc(titreRdv(r))}${r.prix ? " · " + euros(r.prix) : ""}</span></div>${st ? `<em style="font-style:normal;font-size:12px;color:var(--gris)">${st}</em>` : r.acompte ? '<div class="ac"><i></i>acompte</div>' : ""}</div>`; };

function vueAgenda() {
  const L = S.lundi, F = plusJours(L, 6), j = S.jour;
  let h = tete("Agenda", `${MOIS[j.getMonth()]} ${j.getFullYear()}`);
  h += `<div class="nav-sem"><button data-a="sem" data-n="-7" aria-label="Semaine d’avant">‹</button><span>Du ${L.getDate()} ${MOIS[L.getMonth()]} au ${F.getDate()} ${MOIS[F.getMonth()]}</span><button data-a="sem" data-n="7" aria-label="Semaine d’après">›</button></div>`;
  h += '<div class="semaine">' + [0, 1, 2, 3, 4, 5, 6].map(i => { const d = plusJours(L, i), n = S.rdv.filter(r => memeJour(new Date(r.debut), d) && r.statut !== "annule").length;
    return `<button class="${n ? "plein" : ""}${memeJour(d, j) ? " on" : ""}" data-jour="${d.toISOString()}"><small>${COURT[i]}</small><b>${d.getDate()}</b><i></i></button>`; }).join("") + "</div>";
  const duJour = S.rdv.filter(r => memeJour(new Date(r.debut), j));
  h += `<div class="k">${JOURS[(j.getDay() + 6) % 7]} ${j.getDate()} ${MOIS[j.getMonth()]} · ${duJour.filter(r => r.statut !== "annule").length} rendez-vous</div>`;
  let g = '<div class="pap">';
  for (let m = OUV; m < FERM; m += 30) g += `<div class="pl${m % 60 ? "" : " plein"}" data-a="creneau" data-m="${m}">${m % 60 ? "" : `<span>${m / 60}h</span>`}</div>`;
  duJour.forEach(r => { const d = new Date(r.debut), f = new Date(r.fin), m0 = d.getHours() * 60 + d.getMinutes(), m1 = f.getHours() * 60 + f.getMinutes();
    const top = Math.max(0, (m0 - OUV) / 30 * R), haut = Math.max(R, (Math.min(m1, FERM) - Math.max(m0, OUV)) / 30 * R);
    g += `<div class="pr${r.source === "en_ligne" ? " ligne-en" : ""}${r.statut === "annule" ? " barre" : ""}" data-rdv="${r.id}" style="top:${top}px;height:${haut}px"><b><strong>${hm(d)} – ${hm(f)}</strong> ${esc(nomRdv(r))}${r.source === "en_ligne" ? '<em class="en-ligne">En ligne</em>' : ""}</b><span>${esc(titreRdv(r))}${r.acompte ? " · acompte " + euros(r.acompte) : ""}</span></div>`; });
  h += g + "</div>";
  h += `<button class="btn" data-a="nouveau" style="width:100%;margin-top:16px">Nouveau rendez-vous</button>`;
  return h;
}
function vueClientes() {
  const q = S.cherche.trim().toLowerCase(), L = S.clientes.filter(c => !q || nomCli(c).toLowerCase().includes(q) || (c.telephone || "").replace(/\s/g, "").includes(q.replace(/\s/g, "")));
  return tete("Clientes", `${S.clientes.length} cliente${S.clientes.length > 1 ? "s" : ""}`)
    + `<label class="cherche">${I.lo}<input id="cherche" value="${esc(S.cherche)}" placeholder="Chercher une cliente" style="border:0;background:none;font:inherit;font-size:14px;flex:1;outline:none"></label>`
    + `<button class="btn" data-a="cli-nouv" style="width:100%;margin-top:10px">Ajouter une cliente</button>`
    + `<div class="k">Toutes mes clientes</div>` + (L.length ? `<div class="carte">${L.map(c => `<div class="cli" data-cli="${c.id}"><div class="av">${esc((c.prenom || "?")[0])}${esc((c.nom || "")[0] || "")}</div><div class="t"><b>${esc(nomCli(c))}</b><span>${esc(c.telephone || "Pas de numéro")}</span></div><em>›</em></div>`).join("")}</div>`
      : `<div class="blanche vide"><b>${q ? "Personne avec ce nom" : "Pas encore de clientes"}</b><span>${q ? "Essayez un autre nom." : "Elles s’ajoutent toutes seules quand elles réservent sur votre site."}</span></div>`);
}
function vueSite() {
  if (MS.rgk) return MS.rgk().replace(/<div class="tete">.*?<\/div><\/div>/, tete("Mon site", S.site?.en_ligne ? "En ligne · " + esc(S.site.slug) : "Pas encore en ligne"))
    + `<div class="k">Mettre en ligne</div><div class="liste"><div class="ligne" data-a="site"><div class="t">Mon adresse<span>${S.site ? esc(S.site.slug) : "Pas encore en ligne"}</span></div><span class="fl">›</span></div></div>`;
  const s = S.site, b = brouillon();
  return tete("Mon site", s?.en_ligne ? "En ligne" : "Pas encore en ligne")
    + `<div class="noire siteb"><small>Mon site</small><div class="adr">${s ? esc(s.slug) : "Pas encore d’adresse"}</div><div class="enl"><i></i>${s?.en_ligne ? "En ligne · réservations ouvertes" : "Hors ligne"}</div>
      <div class="bts">${s?.en_ligne ? `<button class="plein" data-href="${location.hostname === "app.loginail.fr" ? "https://loginail.fr/" : ""}loginail-creer/pret.html?public&s=${esc(s.slug)}" data-neuf>Voir mon site</button>` : ""}<button data-a="site">${s?.en_ligne ? "Mettre à jour" : "Mettre en ligne"}</button></div></div>`
    + (b ? `<div class="k">Mon style</div><div class="liste">${[["style", "Changer de style", "Des sites à glisser : gardez vos coups de cœur"], ["perso", "Personnaliser", "La forme, le fond, les couleurs, l’écriture"], ["charms", "Mes charms", (b.stickers || []).length ? b.stickers.length + " charm" + (b.stickers.length > 1 ? "s" : "") + " posé" + (b.stickers.length > 1 ? "s" : "") : "Posez-les où vous voulez sur votre site"]].map(l => `<div class="ligne" data-pont="${l[0]}"><div class="t">${l[1]}<span>${l[2]}</span></div><span class="fl">›</span></div>`).join("")}</div>` : "")
    + (b ? "" : `<div class="blanche vide" style="margin-top:12px"><b>Créez d’abord votre site</b><span>Sur loginail.fr, en 3 étapes : il apparaîtra ici.</span></div>`);
}
function vueReglages() {
  const L = (t, sous, a, fin) => `<div class="ligne"${a ? ` data-a="${a}"` : ""}><div class="t">${t}${sous ? `<span>${sous}</span>` : ""}</div>${fin ?? (a ? '<span class="fl">›</span>' : "")}</div>`;
  const regles = (S.site && S.site.donnees && S.site.donnees.regles) || {};
  return tete("Réglages", S.user.email)
    + `<div class="k">Mon salon</div><div class="liste">${L("Mon salon", esc([S.profil.prenom, S.profil.nom_salon, S.profil.ville].filter(Boolean).join(" · ") || "Prénom, nom du salon, téléphone"), "salon")}
      ${L("Mes prestations", S.prestations.length ? S.prestations.length + " prestation" + (S.prestations.length > 1 ? "s" : "") : "À ajouter", "prestas")}</div>`
    + `<div class="k">Mes réservations</div><div class="liste">${L("Réservation en ligne", S.site ? (S.site.en_ligne ? "Vos clientes réservent sur votre site" : "Fermée : votre site s’affiche, sans réservation") : "Mettez d’abord votre site en ligne", S.site ? null : "site", S.site ? `<button class="sw${S.site.en_ligne ? " on" : ""}" data-a="resa-sw" aria-label="Réservation en ligne"></button>` : undefined)}
      ${L("Acompte, retard, annulation", (regles.acompte === false ? "Sans acompte" : "Acompte " + (regles.montant || "15 €")) + " · annulation " + (regles.annulation || "48 h avant"), "ms-bon")}</div>`
    + `<div class="k">SMS à mes clientes</div><div class="liste">${L("Confirmation et rappel la veille", "Arrivent avec le service SMS (bientôt)")}</div>`
    + `<div class="k">Ma caisse</div><div class="liste">${L("Ma caisse", CAISSE() ? "Encaissé ce mois-ci : " + (euros(totalMois()) || "0 €") : "Pas utilisée", "caisse")}</div>`
    + `<div class="k">Mes données</div><div class="liste">${L("Télécharger mes données", "Clientes, rendez-vous, tickets, site", "export")}${L("Supprimer mon compte", "Tout est effacé, pour toujours", "suppr")}</div>`
    + `<div class="k">Aide et infos</div><div class="liste">${L("Besoin d’aide ?", "Écrire à l’équipe Loginail", "aide")}${L("Mentions légales", "", "lien", "")}${L("Confidentialité", "", "lien2", "")}</div>`
    + `<div class="k">Mon compte</div><div class="liste">${L("Se déconnecter", "", "deco", "")}</div>`;
}
async function exporteDonnees() {
  const t = ["profils", "prestations", "clientes", "rendez_vous", "tickets", "sites"], out = { exporte_le: new Date().toISOString(), compte: S.user.email };
  for (const n of t) { const { data, error } = await sb.from(n).select("*"); if (error) return oups(error); out[n] = data; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: "application/json" }));
  a.download = "mes-donnees-loginail-" + new Date().toISOString().slice(0, 10) + ".json"; a.click(); dit("Vos données sont téléchargées ✓");
}
function feuilleSuppr() {
  ouvre(`<h3>Supprimer mon compte</h3><div class="sous">Votre site, vos clientes, vos rendez-vous et vos tickets seront effacés <b>pour toujours</b>. Pensez à télécharger vos données avant.</div>
    <button class="btn clair" data-a="export">Télécharger mes données d’abord</button>
    <div class="lab2" style="margin-top:16px">Pour confirmer, écrivez SUPPRIMER</div><input class="champ" id="suppr-ok" autocomplete="off" autocapitalize="characters">
    <button class="btn" data-a="suppr-ok" style="background:#A04A4A">Supprimer définitivement</button>
    <div class="sous" style="margin-top:12px;font-size:12px">Votre abonnement s’arrête aussi. Les tickets déjà donnés à vos clientes ne seront plus consultables.</div>`);
}
const VUES = { acc: vueAccueil, ag: vueAgenda, cl: vueClientes, si: vueSite, re: vueReglages };
function rendu() {
  E.querySelectorAll(".vue").forEach(v => { const on = v.dataset.p === S.onglet; v.classList.toggle("on", on); if (on) v.innerHTML = VUES[v.dataset.p](); });
  E.querySelectorAll("[data-go]").forEach(b => b.classList.toggle("on", b.dataset.go === S.onglet && !!b.closest(".ong")));
}

/* ---------- les feuilles ---------- */
function feuilleRdv(id) {
  const r = S.rdv.find(x => x.id === id); if (!r) return; const d = new Date(r.debut), f = new Date(r.fin), t = r.clientes?.telephone?.replace(/\s/g, "");
  ouvre(`<div class="fiche-t"><div><h3 style="text-align:left;margin:0">${esc(nomRdv(r))}</h3><div class="sous" style="text-align:left;margin:2px 0 0">${[hm(d) + " – " + hm(f), esc(titreRdv(r)), r.prix ? euros(r.prix) : ""].filter(Boolean).join(" · ")}</div></div>
    ${t ? `<div class="ronds"><button data-href="tel:${esc(t)}" aria-label="Appeler">${I.tel}</button><button data-href="sms:${esc(t)}" aria-label="Message">${I.msg}</button></div>` : ""}</div>
    ${r.source === "en_ligne" ? `<div class="sous" style="text-align:left;margin:10px 0 0">Réservé en ligne${r.acompte ? " · acompte de " + euros(r.acompte) + (r.acompte_paye ? " payé" : " (paiement en ligne bientôt)") : ""}</div>` : ""}
    ${CAISSE() && r.cliente_id && r.statut !== "annule" && r.statut !== "absente" ? (ticketDe(r) ? `<div class="sous" style="text-align:left;margin:12px 0 0">Encaissé ✓ · ticket n° ${esc(ticketDe(r).numero)}</div><button class="btn clair" data-a="qr-voir" data-t="${ticketDe(r).id}" style="margin-top:10px">Revoir son ticket</button>`
      : `<button class="btn" data-a="encaisser" data-id="${r.id}" style="margin-top:16px">Encaisser · ${euros(resteDe(r))}</button>`) : ""}
    ${r.statut === "prevu" ? `<button class="btn${CAISSE() && r.cliente_id ? " clair" : ""}" data-a="statut" data-s="fini" data-id="${r.id}" style="margin-top:${CAISSE() && r.cliente_id ? 8 : 16}px">C’est fini</button>
    <div class="petits"><button data-a="statut" data-s="absente" data-id="${r.id}">Pas venue</button><button data-a="statut" data-s="annule" data-id="${r.id}">Annuler le rendez-vous</button></div>`
    : `<div class="sous" style="margin-top:14px">${{ fini: "Rendez-vous fini", absente: "Pas venue", annule: "Annulé" }[r.statut]}</div><div class="petits"><button data-a="statut" data-s="prevu" data-id="${r.id}">Remettre comme prévu</button></div>`}`);
}
let N = {};
function feuilleNouveau(m) {
  const j = new Date(S.jour); j.setHours(0, 0, 0, 0); N = { jour: j, m: m ?? 9 * 60, cli: null, presta: null };
  const P = prestasDispo();
  ouvre(`<h3>Nouveau rendez-vous</h3><div class="sous">${JOURS[(j.getDay() + 6) % 7]} ${j.getDate()} ${MOIS[j.getMonth()]}</div>
    <div class="lab2">Heure</div><input class="champ" id="n-h" type="time" value="${String(Math.floor(N.m / 60)).padStart(2, "0")}:${String(N.m % 60).padStart(2, "0")}" step="900">
    <div class="lab2">Cliente</div><input class="champ" id="n-cli" list="n-cl" placeholder="Prénom et nom" autocomplete="off"><datalist id="n-cl">${S.clientes.map(c => `<option value="${esc(nomCli(c))}">`).join("")}</datalist>
    <div class="lab2">Prestation</div><div class="chips">${P.map((p, i) => `<button class="chip" data-np="${i}">${esc(p.nom)}<span>${duree(p.duree || 60)}</span></button>`).join("") || '<span class="sous">Ajoutez vos prestations dans Réglages</span>'}</div>
    <button class="btn" data-a="nouveau-ok" style="margin-top:16px">Enregistrer</button>`);
}
function feuilleCliente(id) {
  const c = id ? S.clientes.find(x => x.id === id) || {} : {};
  ouvre(`<h3>${id ? esc(nomCli(c)) : "Nouvelle cliente"}</h3><div class="form" style="margin-top:12px">
    <label>Prénom<input id="c-p" value="${esc(c.prenom)}" autocomplete="off"></label><label>Nom<input id="c-n" value="${esc(c.nom)}" autocomplete="off"></label>
    <label>Téléphone<input id="c-t" value="${esc(c.telephone)}" inputmode="tel"></label><label>E-mail<input id="c-e" value="${esc(c.email)}" inputmode="email"></label>
    <label>Anniversaire <small>facultatif</small><input id="c-a" type="date" value="${esc(c.anniversaire || "")}"></label></div>
    <div class="lab2">Notes</div><textarea class="msg" id="c-no" placeholder="Par exemple : aime les formes amande">${esc(c.notes)}</textarea>
    <button class="btn" data-a="cli-ok" data-id="${id || ""}">${id ? "Enregistrer" : "Ajouter"}</button>`);
}
const brouillon = () => { try { return JSON.parse(localStorage.getItem("loginail-brouillon")) || null; } catch (e) { return null; } };
const enSlug = t => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
function feuilleSite() {
  const b = brouillon(), slug = S.site?.slug || enSlug(b?.nom || S.profil.nom_salon);
  ouvre(`<h3>Mon site sur internet</h3><div class="sous">Les réservations arrivent toutes seules dans votre agenda.</div>
    <div class="lab2">Son adresse</div><input class="champ" id="site-slug" value="${esc(slug)}" autocapitalize="off" autocomplete="off">
    <div class="sous" style="text-align:left;font-size:12px">Seulement des lettres, des chiffres et des tirets.</div>
    <button class="btn" data-a="site-ok"${b ? "" : " disabled"}>${S.site?.en_ligne ? "Mettre à jour mon site" : "Mettre mon site en ligne"}</button>`);
}
function feuilleSalon() {
  const p = S.profil;
  ouvre(`<h3>Mon salon</h3><div class="form" style="margin-top:12px"><label>Mon prénom<input id="s-p" value="${esc(p.prenom)}"></label><label>Nom du salon<input id="s-s" value="${esc(p.nom_salon)}"></label>
    <label>Téléphone<input id="s-t" value="${esc(p.telephone)}" inputmode="tel"></label><label>Ville<input id="s-v" value="${esc(p.ville)}"></label></div><button class="btn" data-a="salon-ok">Enregistrer</button>`);
}
function feuillePrestas() {
  ouvre(`<h3>Mes prestations</h3><div class="liste" style="margin-top:12px">${S.prestations.map(p => `<div class="ligne" data-a="presta" data-id="${p.id}"><div class="t">${esc(p.nom)}<span>${duree(p.duree_min)}</span></div><em>${euros(p.prix)}</em><span class="fl">›</span></div>`).join("") || '<div class="ligne"><div class="t">Aucune prestation</div></div>'}</div>
    <button class="btn" data-a="presta" data-id="">Ajouter une prestation</button>`);
}
function feuillePresta(id) {
  const p = id ? S.prestations.find(x => x.id === id) || {} : { duree_min: 60 };
  ouvre(`<h3>${id ? esc(p.nom) : "Nouvelle prestation"}</h3><div class="form" style="margin-top:12px"><label>Nom<input id="p-n" value="${esc(p.nom)}"></label><label>Prix en €<input id="p-p" value="${p.prix ?? ""}" inputmode="decimal"></label></div>
    <div class="lab2">Durée</div><div class="chips">${[30, 45, 60, 90, 120, 150, 180].map(d => `<button class="chip${d === p.duree_min ? " on" : ""}" data-nd="${d}">${duree(d)}</button>`).join("")}</div>
    <button class="btn" data-a="presta-ok" data-id="${id || ""}" style="margin-top:14px">Enregistrer</button>${id ? `<div class="petits"><button data-a="presta-suppr" data-id="${id}">Supprimer</button></div>` : ""}`);
}

/* ---------- la caisse (06/11) : encaisser, le ticket (QR code ou e-mail), ma caisse, le livre des recettes ---------- */
const TICKET_URL = id => location.origin + "/loginail-creer/ticket.html?t=" + id;   /* plus tard : https://loginail.fr/ticket?t=… */
const MOYENS = [["virement", "Par virement"], ["especes", "En espèces"], ["carte", "Par carte"]];
const NOM_MOYEN = { especes: "espèces", carte: "carte", virement: "virement", en_ligne: "en ligne" };
const CAISSE = () => S.profil.caisse_active !== false;
const ticketDe = r => (S.tickets || []).find(t => t.rendez_vous_id === r.id);
const resteDe = r => Math.max(0, (+r.prix || 0) - (r.acompte_paye ? +r.acompte || 0 : 0));
const duMois = () => { const m = new Date(); return (S.tickets || []).filter(t => { const d = new Date(t.cree_le); return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear(); }); };
const totalMois = () => duMois().reduce((a, t) => a + (+t.total || 0), 0);
const legal = () => { const D = (S.site && S.site.donnees) || {}, L = D.legal || {};
  return { salon: L.entreprise || D.nom || S.profil.nom_salon || "", nomComplet: L.nomComplet || "", adresse: L.adresse || [D.rue, [D.cp, D.ville].filter(Boolean).join(" ")].filter(Boolean).join(", "), siret: L.siret || "", tvaNon: L.tvaNon !== false }; };
let K = {};
function feuilleEncaisser(id) {
  const r = S.rdv.find(x => x.id === id); if (!r) return; K = { r, moyen: "especes", envoi: "qr" };
  const reste = resteDe(r), d = new Date(r.debut), lg = legal();
  ouvre(`<h3>Encaisser</h3><div class="sous">${esc(nomRdv(r))} · ${esc(titreRdv(r))} · reste ${euros(reste)}</div>
    <div class="lab2" style="text-align:center">Elle paie</div><div class="pc-g" style="justify-content:center">${MOYENS.map(m => `<button class="chip${m[0] === "especes" ? " on" : ""}" data-km="${m[0]}">${m[1]}</button>`).join("")}</div>
    <div class="lab2">Son ticket <button data-a="voir-ticket" style="float:right;border:0;background:none;font:inherit;font-size:11px;letter-spacing:0;text-transform:none;text-decoration:underline;cursor:pointer;color:var(--noir)">Voir son ticket ›</button></div>
    <div class="nt-papier" id="k-pap" hidden><div class="nt-h"><div><b>${esc(lg.salon)}</b><span>${esc(lg.adresse)}</span></div><div class="nt-n">Ticket n° (à l’encaissement)<span>${d.toLocaleDateString("fr-FR")}</span></div></div>
      <div class="nt-cl">Pour : ${esc(nomRdv(r))}</div><div class="nt-l"><span>${esc(titreRdv(r) || "Prestation")} · 1</span><b>${euros(+r.prix || 0)}</b></div><div class="nt-l nt-t"><span>Total</span><b>${euros(+r.prix || 0)}</b></div>
      ${r.acompte_paye && +r.acompte ? `<div class="nt-l nt-g"><span>Acompte déjà payé</span><b>− ${euros(+r.acompte)}</b></div>` : ""}<div class="nt-l nt-g"><span>Payé au salon</span><b>${euros(reste)}</b></div>
      <div class="nt-pied">${lg.tvaNon ? "TVA non applicable, art. 293 B du CGI · " : ""}${lg.siret ? "SIRET " + esc(lg.siret) : '<span style="color:#A04A4A">SIRET à compléter dans Mon site</span>'}</div></div>
    <div class="lab2">Envoyer le ticket de caisse</div><div class="k-env" style="grid-template-columns:1fr 1fr"><button data-ke="email"><b>Par e-mail</b><span>Gratuit</span></button><button class="on" data-ke="qr"><b>QR code</b><span>Conseillé · gratuit</span></button></div>
    <button class="btn" data-a="encaisser-ok" style="margin-top:16px">Encaisser</button>`);
}
async function encaisser() {
  const r = K.r, reste = resteDe(r), lg = legal(), d = new Date(r.debut);
  const { data: numero, error: e1 } = await sb.rpc("prochain_numero"); if (e1) return oups(e1);
  const details = Object.assign(lg, { cliente: nomRdv(r), date_presta: d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }), lignes: [{ nom: titreRdv(r) || "Prestation", prix: +r.prix || 0, qte: 1 }] });
  const { data: t, error } = await sb.from("tickets").insert({ rendez_vous_id: r.id, numero, total: +r.prix || 0, acompte_deduit: r.acompte_paye ? +r.acompte || 0 : 0, paye_au_salon: reste, moyen: K.moyen, envoye_par: K.envoi, details }).select().single();
  if (error) return oups(error);
  if (r.statut === "prevu") await sb.from("rendez_vous").update({ statut: "fini" }).eq("id", r.id);
  await chargeSemaine(); rendu();
  if (K.envoi === "qr") return montreQR(t);
  const mail = S.clientes.find(c => c.id === r.cliente_id)?.email || "";
  const corps = `Bonjour ${r.clientes?.prenom || ""},\n\nVoici votre ticket n° ${t.numero} :\n${TICKET_URL(t.id)}\n\nMerci et à bientôt !\n${lg.salon}`;
  location.href = `mailto:${encodeURIComponent(mail)}?subject=${encodeURIComponent("Votre ticket · " + lg.salon)}&body=${encodeURIComponent(corps)}`;
  ferme(); dit("Encaissé ✓ · votre e-mail s’ouvre");
}
function montreQR(t) {
  let svg = ""; try { const q = qrcode(0, "M"); q.addData(TICKET_URL(t.id)); q.make(); svg = q.createSvgTag({ cellSize: 6, margin: 2, scalable: true }); } catch (e) {}
  ouvre(`<h3>Son ticket, si elle le veut</h3><div class="sous">Elle scanne avec l’appareil photo de son téléphone et garde son ticket.<br>Elle n’en veut pas ? Pas de souci, touchez « C’est bon ».</div>
    <div style="width:220px;margin:6px auto 18px;background:#fff;border-radius:18px;padding:12px">${svg}</div>
    <button class="btn" data-a="fermer">C’est bon, encaissé ✓</button>`);
}
function feuilleCaisse() {
  const m = new Date(), L = duMois();
  const par = k => L.filter(t => t.moyen === k).reduce((a, t) => a + (+t.paye_au_salon || 0), 0), enl = L.reduce((a, t) => a + (+t.acompte_deduit || 0), 0);
  const auj = L.filter(t => memeJour(new Date(t.cree_le), m));
  ouvre(`<h3>Ma caisse</h3><div class="sous">${MOIS[m.getMonth()]} ${m.getFullYear()}</div>
    <div class="liste"><div class="ligne"><div class="t">Utiliser la caisse<span>Facultatif · vous l’arrêtez quand vous voulez</span></div><button class="sw${CAISSE() ? " on" : ""}" data-a="caisse-sw"></button></div></div>
    <div class="noire" style="text-align:center;margin-top:12px"><small>Encaissé ce mois-ci</small><div style="font-weight:300;font-size:40px;margin:8px 0 2px">${euros(totalMois()) || "0 €"}</div><small>${L.length} ticket${L.length > 1 ? "s" : ""}</small></div>
    <div class="liste" style="margin-top:10px">${[["especes", "Espèces"], ["carte", "Carte"], ["virement", "Virement"]].map(x => `<div class="ligne"><div class="t">${x[1]}</div><em>${euros(par(x[0])) || "0 €"}</em></div>`).join("")}<div class="ligne"><div class="t">Acomptes en ligne</div><em>${euros(enl) || "0 €"}</em></div></div>
    <div class="liste" style="margin-top:10px"><div class="ligne"><div class="t">À déclarer à l’URSSAF<span>Le total du mois, prêt pour votre déclaration</span></div><em>${euros(totalMois()) || "0 €"}</em></div></div>
    <button class="btn" data-a="livre" style="margin-top:12px">Télécharger mon livre des recettes</button>
    <div class="k">Aujourd’hui</div>${auj.length ? `<div class="liste">${auj.map(t => `<div class="ligne" data-a="qr-voir" data-t="${t.id}"><div class="t">${esc(t.details?.cliente || "")}<span>${esc((t.details?.lignes || [])[0]?.nom || "")} · ${NOM_MOYEN[t.moyen] || ""}</span></div><em>${euros(t.total)}</em><span class="fl">›</span></div>`).join("")}</div>` : '<div class="blanche vide"><b>Rien encaissé aujourd’hui</b><span>Les tickets apparaissent ici.</span></div>'}`);
}
function livreDesRecettes() {
  const m = new Date(), L = duMois().slice().reverse();
  const q = v => '"' + String(v ?? "").replace(/"/g, '""') + '"', n = v => String(Math.round((+v || 0) * 100) / 100).replace(".", ",");
  const lignes = [["Date", "Ticket", "Cliente", "Prestation", "Montant", "Mode de règlement"].map(q).join(";")]
    .concat(L.map(t => [new Date(t.cree_le).toLocaleDateString("fr-FR"), t.numero, t.details?.cliente, (t.details?.lignes || []).map(l => l.nom).join(" + "), n(t.total), (NOM_MOYEN[t.moyen] || "") + (+t.acompte_deduit ? " (dont acompte en ligne " + n(t.acompte_deduit) + ")" : "")].map(q).join(";")));
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + lignes.join("\r\n")], { type: "text/csv;charset=utf-8" }));
  a.download = `livre-des-recettes-${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}.csv`; a.click(); dit("Livre des recettes téléchargé ✓");
}

/* ---------- Photos de mes ongles (réalisations) : ajouter, enlever ---------- */
MSF["ms-photos"] = () => { const b = brouillon() || {}, L = (b.photos || []).map((p, i) => [p, i]).filter(x => x[1] !== b.salon);
  return `<h3>Photos de mes ongles</h3><div class="sous">Elles s’affichent dans « Réalisations » sur votre site</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">${L.map(([p, i]) => `<div style="position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;background:#EFEAE4"><img src="${esc(p.url.startsWith("..") ? p.url.slice(1) : p.url)}" alt="" style="width:100%;height:100%;object-fit:cover"><button data-a="ph-x" data-i="${i}" aria-label="Enlever" style="position:absolute;top:4px;right:4px;width:26px;height:26px;border-radius:50%;border:0;background:rgba(30,28,27,.75);color:#fff;font-size:15px;line-height:26px;padding:0;cursor:pointer">×</button></div>`).join("")}</div>
    <input type="file" accept="image/*" multiple hidden id="ph-in"><button class="btn" data-a="ph-ajout" style="margin-top:14px">Ajouter des photos</button>`; };
E.addEventListener("change", ev => { if (ev.target.id !== "ph-in") return; const fs = [...ev.target.files].slice(0, 12); let n = fs.length; if (!n) return; dit("Un instant…");
  fs.forEach(f => { const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, 900 / Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
    const b = brouillon() || {}; b.photos = b.photos || []; b.photos.push({ url: c.toDataURL("image/jpeg", .8), auteurs: [] }); localStorage.setItem("loginail-brouillon", JSON.stringify(b));
    if (--n === 0) { ouvre(MSF["ms-photos"]()); dit("Photos ajoutées ✓"); rendu(); } }; im.src = r.result; }; r.readAsDataURL(f); }); });

/* ---------- les gestes ---------- */
E.addEventListener("input", ev => { if (ev.target.id === "cherche") { S.cherche = ev.target.value; const pos = ev.target.selectionStart; rendu(); const i = $("#cherche", E); if (i) { i.focus(); i.setSelectionRange(pos, pos); } } });
E.addEventListener("click", async ev => {
  const t = ev.target;
  const hr = t.closest("[data-href]"); if (hr) { if (hr.hasAttribute("data-neuf")) window.open(hr.dataset.href, "_blank", "noopener"); else location.href = hr.dataset.href; return; }
  const go = t.closest("[data-go]"); if (go) { S.onglet = go.dataset.go; ferme(); rendu(); E.querySelector(".vue.on").scrollTop = 0; return; }
  const jr = t.closest("[data-jour]"); if (jr) { S.jour = new Date(jr.dataset.jour); rendu(); return; }
  const rd = t.closest("[data-rdv]"); if (rd) return feuilleRdv(rd.dataset.rdv);
  const cl = t.closest("[data-cli]"); if (cl) return feuilleCliente(cl.dataset.cli);
  const np = t.closest("[data-np]"); if (np) { np.parentElement.querySelectorAll(".chip").forEach(b => b.classList.toggle("on", b === np)); N.presta = prestasDispo()[+np.dataset.np]; return; }
  const nd = t.closest("[data-nd]"); if (nd) { nd.parentElement.querySelectorAll(".chip").forEach(b => b.classList.toggle("on", b === nd)); return; }
  const km = t.closest("[data-km]"); if (km) { km.parentElement.querySelectorAll(".chip").forEach(b => b.classList.toggle("on", b === km)); K.moyen = km.dataset.km; return; }
  const ke = t.closest("[data-ke]"); if (ke) { ke.parentElement.querySelectorAll("button").forEach(b => b.classList.toggle("on", b === ke)); K.envoi = ke.dataset.ke; return; }
  const a = t.closest("[data-a]"); if (!a) return; const k = a.dataset.a;
  try {
    if (k.startsWith("ms-") && MSF[k]) return ouvre(MSF[k](a));
    if (k === "fermer") ferme();
    else if (k === "cx-envoi") { const m = $("#cx-mail", E).value.trim(); if (!/^\S+@\S+\.\S+$/.test(m)) return dit("Vérifiez votre adresse e-mail");
      a.disabled = true; a.textContent = "Envoi…"; const { error } = await sb.auth.signInWithOtp({ email: m, options: { emailRedirectTo: location.origin + location.pathname } });
      if (error) { a.disabled = false; a.textContent = "Recevoir mon code"; return dit(error.status === 429 ? "Attendez une minute avant de redemander" : "Oups, réessayez"); } ecranConnexion(m); }
    else if (k === "cx-retour") ecranConnexion();
    else if (k === "cx-code") { const c = $("#cx-code", E), code = c.value.replace(/\D/g, ""); if (code.length < 6) return dit("Tapez les chiffres du code");
      a.disabled = true; a.textContent = "Un instant…"; const { data, error } = await sb.auth.verifyOtp({ email: c.dataset.mail, token: code, type: "email" });
      if (error) { a.disabled = false; a.textContent = "Me connecter"; return dit("Code incorrect ou expiré"); } if (data.session) demarre(data.session); }
    else if (k === "sem") { S.lundi = plusJours(S.lundi, +a.dataset.n); S.jour = plusJours(S.jour, +a.dataset.n); await chargeSemaine(); rendu(); }
    else if (k === "creneau") feuilleNouveau(+a.dataset.m);
    else if (k === "nouveau") feuilleNouveau(null);
    else if (k === "nouveau-ok") { const [hh, mm] = ($("#n-h", E).value || "09:00").split(":").map(Number), deb = new Date(N.jour); deb.setHours(hh, mm, 0, 0);
      const p = N.presta, fin = new Date(deb.getTime() + (p?.duree || 60) * 60000), saisie = $("#n-cli", E).value.trim();
      let cli = S.clientes.find(c => nomCli(c).toLowerCase() === saisie.toLowerCase());
      if (!cli && saisie) { const mots = saisie.split(/\s+/), prenom = mots.shift(); const { data, error } = await sb.from("clientes").insert({ prenom, nom: mots.join(" ") || null }).select().single(); if (error) return oups(error); cli = data; S.clientes.push(data); }
      if (S.rdv.some(r => r.statut !== "annule" && new Date(r.debut) < fin && new Date(r.fin) > deb)) return dit("Ce créneau est déjà pris");
      const { error } = await sb.from("rendez_vous").insert({ cliente_id: cli?.id || null, prestation_id: p?.id || null, titre: cli ? (p?.nom || null) : (saisie || "Bloqué"), debut: deb.toISOString(), fin: fin.toISOString(), prix: p?.prix ?? null });
      if (error) return oups(error); ferme(); await chargeSemaine(); rendu(); dit("Rendez-vous enregistré ✓"); }
    else if (k === "statut") { const { error } = await sb.from("rendez_vous").update({ statut: a.dataset.s }).eq("id", a.dataset.id); if (error) return oups(error);
      ferme(); await chargeSemaine(); rendu(); dit({ fini: "C’est noté ✓", absente: "Marquée pas venue", annule: "Rendez-vous annulé", prevu: "Remis comme prévu" }[a.dataset.s]); }
    else if (k === "cli-nouv") feuilleCliente(null);
    else if (k === "cli-ok") { const v = { prenom: $("#c-p", E).value.trim(), nom: $("#c-n", E).value.trim() || null, telephone: $("#c-t", E).value.trim() || null, email: $("#c-e", E).value.trim() || null, anniversaire: $("#c-a", E).value || null, notes: $("#c-no", E).value.trim() || null };
      if (!v.prenom) return dit("Écrivez au moins le prénom"); const id = a.dataset.id;
      const { error } = id ? await sb.from("clientes").update(v).eq("id", id) : await sb.from("clientes").insert(v); if (error) return oups(error);
      const { data } = await sb.from("clientes").select("*").order("prenom"); S.clientes = data || []; ferme(); rendu(); dit("C’est enregistré ✓"); }
    else if (k === "site") feuilleSite();
    else if (k === "site-ok") { const b = brouillon(), slug = enSlug($("#site-slug", E).value); if (!b) return dit("Créez d’abord votre site"); if (slug.length < 3) return dit("Au moins 3 lettres");
      const d = Object.assign({}, b); delete d.univers; delete d.exempleFictif; delete d._charmsU;
      const { data, error } = await sb.from("sites").upsert({ pro_id: S.user.id, slug, donnees: d, en_ligne: true, maj: new Date().toISOString() }).select().single();
      if (error) return /duplicate|unique/i.test(error.message) ? dit("Cette adresse est déjà prise") : oups(error); S.site = data; ferme(); rendu(); dit("Votre site est en ligne ✓"); }
    else if (k === "salon") feuilleSalon();
    else if (k === "salon-ok") { const v = { prenom: $("#s-p", E).value.trim() || null, nom_salon: $("#s-s", E).value.trim() || null, telephone: $("#s-t", E).value.trim() || null, ville: $("#s-v", E).value.trim() || null };
      const { data, error } = await sb.from("profils").update(v).eq("id", S.user.id).select().single(); if (error) return oups(error); S.profil = data; ferme(); rendu(); dit("C’est enregistré ✓"); }
    else if (k === "prestas") feuillePrestas();
    else if (k === "presta") feuillePresta(a.dataset.id || null);
    else if (k === "presta-ok") { const nom = $("#p-n", E).value.trim(); if (!nom) return dit("Écrivez le nom"); const d = $(".chip.on[data-nd]", E);
      const v = { nom, prix: parseFloat(($("#p-p", E).value || "0").replace(",", ".")) || 0, duree_min: d ? +d.dataset.nd : 60 }, id = a.dataset.id;
      const { error } = id ? await sb.from("prestations").update(v).eq("id", id) : await sb.from("prestations").insert(v); if (error) return oups(error);
      const { data } = await sb.from("prestations").select("*").order("ordre").order("cree_le"); S.prestations = data || []; feuillePrestas(); rendu(); dit("C’est enregistré ✓"); }
    else if (k === "presta-suppr") { const { error } = await sb.from("prestations").delete().eq("id", a.dataset.id); if (error) return oups(error);
      S.prestations = S.prestations.filter(p => p.id !== a.dataset.id); feuillePrestas(); rendu(); }
    else if (k === "encaisser") feuilleEncaisser(a.dataset.id);
    else if (k === "voir-ticket") { const p = $("#k-pap", E); p.hidden = !p.hidden; a.textContent = p.hidden ? "Voir son ticket ›" : "Cacher le ticket ‹"; }
    else if (k === "encaisser-ok") { a.disabled = true; a.textContent = "Un instant…"; await encaisser(); }
    else if (k === "qr-voir") { const t = (S.tickets || []).find(x => x.id === a.dataset.t); if (t) montreQR(t); }
    else if (k === "caisse") feuilleCaisse();
    else if (k === "caisse-sw") { const on = !CAISSE(); const { data, error } = await sb.from("profils").update({ caisse_active: on }).eq("id", S.user.id).select().single(); if (error) return oups(error); S.profil = data; feuilleCaisse(); rendu(); dit(on ? "Caisse activée" : "Caisse arrêtée · vos tickets sont gardés"); }
    else if (k === "livre") livreDesRecettes();
    else if (k === "ph-ajout") $("#ph-in", E).click();
    else if (k === "ph-x") { const b = brouillon() || {}, i = +a.dataset.i; b.photos.splice(i, 1); if (b.salon != null && b.salon > i) b.salon--; if (b.principale != null && b.principale >= b.photos.length) b.principale = 0;
      localStorage.setItem("loginail-brouillon", JSON.stringify(b)); ouvre(MSF["ms-photos"]()); rendu(); dit("Photo enlevée"); }
    else if (k === "resa-sw") { const on = !S.site.en_ligne; const { data, error } = await sb.from("sites").update({ en_ligne: on }).eq("pro_id", S.user.id).select("slug,en_ligne,maj,donnees").single();
      if (error) return oups(error); S.site = data; rendu(); dit(on ? "Réservation en ligne ouverte ✓" : "Réservation en ligne fermée"); }
    else if (k === "export") await exporteDonnees();
    else if (k === "suppr") feuilleSuppr();
    else if (k === "suppr-ok") { if (($("#suppr-ok", E).value || "").trim().toUpperCase() !== "SUPPRIMER") return dit("Écrivez SUPPRIMER pour confirmer");
      a.disabled = true; a.textContent = "Suppression…"; const { error } = await sb.rpc("supprimer_mon_compte"); if (error) { a.disabled = false; a.textContent = "Supprimer définitivement"; return oups(error); }
      try { localStorage.removeItem("loginail-brouillon"); } catch (e) {} await sb.auth.signOut(); S.user = null; ecranConnexion(); }
    else if (k === "aide") location.href = "mailto:contact@loginail.fr?subject=" + encodeURIComponent("Aide Loginail");
    else if (k === "lien") window.open("https://loginail.fr/mentions-legales.html", "_blank", "noopener");
    else if (k === "lien2") window.open("https://loginail.fr/confidentialite.html", "_blank", "noopener");
    else if (k === "deco") { await sb.auth.signOut(); S.user = null; ecranConnexion(); }
  } catch (e) { oups(e); }
});

/* ---------- démarrage ---------- */
async function demarre(session) {
  if (!session) { S.user = null; ecranConnexion(); return; }
  if (S.user?.id === session.user.id && E.querySelector(".ong")) return;
  S.user = session.user; E.innerHTML = '<div class="charge">LOGINAIL</div>';
  try { await chargeTout(); squelette(); rendu(); } catch (e) { console.error(e); E.innerHTML = '<div class="charge">Connexion impossible</div>'; }
}
sb.auth.onAuthStateChange((_e, s) => setTimeout(() => demarre(s), 0));
sb.auth.getSession().then(({ data }) => demarre(data.session));
/* une réservation arrive pendant que l'appli est ouverte : on recharge toutes les minutes */
setInterval(async () => { if (!S.user || document.hidden || E.classList.contains("fe") || S.onglet === "cl") return; try { await chargeSemaine(); rendu(); } catch (e) {} }, 60000);

/* ---------- 09/11 (Marie) : « Mon site » → les pages de loginail.fr (cartes à glisser, personnalisation, présentoir des charms), par-dessus l'appli.
   On leur passe son site ; elles le renvoient modifié ; on l'enregistre (et il part en ligne tout seul). ---------- */
{ const SITE = location.hostname === "app.loginail.fr" ? "https://loginail.fr/" : "../", SITEO = location.hostname === "app.loginail.fr" ? "https://loginail.fr" : location.origin;
  const st = document.createElement("style");
  st.textContent = `.pont{position:fixed;inset:0;z-index:200;background:#F6F3EF;animation:monte .3s both}.pont iframe{width:100%;height:100%;border:0;display:block}
  .pont-x{position:absolute;top:calc(12px + env(safe-area-inset-top));right:12px;z-index:2;width:38px;height:38px;border-radius:50%;border:0;background:rgba(30,28,27,.82);color:#fff;font-size:22px;line-height:38px;padding:0;cursor:pointer}`;
  document.head.appendChild(st);
  const ferme = () => { document.querySelectorAll(".pont").forEach(o => o.remove()); };
  document.addEventListener("click", e => { const l = e.target.closest("[data-pont]"); if (!l) return; e.stopPropagation(); ferme();
    const o = document.createElement("div"); o.className = "pont"; o.innerHTML = `<iframe title="Mon site" src="${SITE}appli-pont.html?p=${l.dataset.pont}&t=${Date.now()}"></iframe><button class="pont-x" aria-label="Fermer">×</button>`;
    document.body.appendChild(o); o.querySelector(".pont-x").onclick = ferme; }, true);
  addEventListener("message", m => { if (m.origin !== SITEO || !m.data || typeof m.data !== "object") return;
    if (m.data.loginail === "pret") { const f = document.querySelector(".pont iframe"); if (f && f.contentWindow === m.source) f.contentWindow.postMessage({ loginail: "brouillon", br: brouillon() || {} }, SITEO); }
    if (m.data.loginail === "enregistre" && m.data.br) { const b = Object.assign(brouillon() || {}, m.data.br); localStorage.setItem("loginail-brouillon", JSON.stringify(b)); ferme(); try { rendu(); } catch (x) {} dit("Mon site est à jour ✓"); } });
}
