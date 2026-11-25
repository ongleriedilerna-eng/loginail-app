/* ===== 05/11 (Marie) « Mon contenu » relié au VRAI site : prestations et prix, horaires, adresse, à propos. Ce qu'elle change dans l'appli change sur son site. ===== */
(function(){
  const lit=()=>{try{return JSON.parse(localStorage.getItem("loginail-brouillon"))||{}}catch(_){return {}}};
  const ecrit=b=>{try{localStorage.setItem("loginail-brouillon",JSON.stringify(b));return true}catch(_){return false}};
  const esc=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
  const JOURS=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
  const duree=m=>m<60?`${m} min`:`${Math.floor(m/60)} h${m%60?" "+String(m%60).padStart(2,"0"):""}`;
  const prix=p=>p==null||p===""?"Sur devis":`${String(p).replace(".",",")} €`;
  const st=document.createElement("style");st.textContent=`
.cs-h{display:grid;grid-template-columns:1fr auto;align-items:center;gap:6px 10px;padding:11px 14px;border-bottom:1px solid rgba(30,28,27,.07)}.cs-h:last-child{border-bottom:0}
.cs-h b{font-weight:400;font-size:14px}.cs-h .cs-hr{grid-column:1/-1;display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--gris)}
.cs-h .cs-hr input{flex:1;min-width:0;border:0;border-radius:10px;background:#F4F0EB;padding:8px 9px;font:inherit;font-size:14px;color:var(--noir)}
.cs-h.ferme .cs-hr{display:none}.cs-p{background:#fff;border-radius:16px;margin-top:12px;padding:12px 14px;text-align:left}.cs-p .r{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:14px}.cs-p .r span{display:block;font-size:12px;color:var(--gris);margin-top:2px}.cs-p .cs-hr{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--gris);margin-top:10px}.cs-p .cs-hr input{flex:1;min-width:0;border:0;border-radius:10px;background:#F4F0EB;padding:8px 9px;font:inherit;font-size:14px;color:var(--noir)}.cs-p:not(.on) .cs-hr{display:none}.cs-h .cs-f{font-size:12px;color:var(--gris)}
#E .cs-sec{text-align:left}#E .cs-sec .liste{margin-top:0!important}
#E .cs-st{margin:18px 2px 2px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#776D64}
#E .cs-sp{margin:0 2px 8px;font-size:12.5px;line-height:1.4;color:#776D64}
#E .ligne.cs-pl{gap:10px}#E .cs-em{flex:none;width:24px;font-size:18px;text-align:center}
#E .cs-pills{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
#E .cs-pill{position:relative;min-width:0;min-height:78px;padding:10px 4px 9px;border:1px solid rgba(30,28,27,.1);border-radius:16px;background:#fff;color:inherit;font:inherit;font-size:12.5px;line-height:1.2;cursor:pointer;transition:transform .12s;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center}#E .cs-pill .e{font-size:24px;line-height:1}#E .cs-pill .n{display:block;max-width:100%;overflow-wrap:anywhere}#E .cs-pill .p{position:absolute;top:5px;right:7px;font-size:13px;color:var(--v-acc,#9A5B62);opacity:.75}#E .cs-pill:active{transform:scale(.95)}
#E .cs-auto{margin:5px 2px 0;font-size:12px;line-height:1.3;text-align:left;color:var(--v-acc,#9A5B62)}#E .cs-auto:empty{display:none}
/* un petit plus : nom, prix, durée, « par ongle » (maquette) ; « C'est quoi ? » et les photos sont pour les prestations */
#E .fc:has(.cs-fam [data-cs-fam="plus"].on) :is([data-pf-texte],.pf-magie,.pf-phl),#E .fc:has(.cs-fam [data-cs-fam="plus"].on) .pf-lab:has(+[data-pf-texte]){display:none!important}
#E .fc:has(.cs-fam) .form{margin-top:10px!important}
#E .cs-fam{display:flex;gap:0;margin-top:8px;padding:3px;border:1px solid rgba(30,28,27,.12);border-radius:14px;background:#fff;height:42px;box-sizing:border-box}
#E .cs-fam button{flex:1;min-width:0;height:34px;border:0;border-radius:11px;background:none;color:inherit;font:inherit;font-size:13px;cursor:pointer;transition:background .2s,color .2s}
#E .cs-fam button.on{background:var(--v-fonce,#1E1C1B);color:#fff}
#E .cs-ongle{display:flex;align-items:center;gap:9px;width:100%;min-height:40px;margin:6px 0 0;padding:0 2px;border:0;background:none;color:inherit;font:inherit;font-size:13.5px;text-align:left;cursor:pointer}
#E .cs-ongle[hidden]{display:none}#E .cs-ongle small{font-size:12px;color:#776D64}
#E .cs-ongle i{flex:none;width:20px;height:20px;border-radius:6px;border:1.5px solid rgba(30,28,27,.35);box-sizing:border-box;display:grid;place-items:center}
#E .cs-ongle.on i{background:var(--v-fonce,#1E1C1B);border-color:transparent}#E .cs-ongle.on i::after{content:"✓";color:#fff;font-size:13px;font-style:normal}
.cs-sup{display:block;width:100%;margin-top:9px;border:0;background:none;color:#A04A4A;font:inherit;font-size:13px;text-decoration:underline;cursor:pointer}
/* 24/11 (Marie, version A) : le carré de l'emoji d'un petit plus — elle choisit le sien */
#E .cs-nl{display:flex;align-items:center;gap:10px}#E .cs-nl>label{flex:1;min-width:0}#E .cs-nl>label.cs-emo{flex:none}
#E .cs-emo{flex:none;position:relative;width:52px;height:52px;border-radius:14px;background:#fff;border:1.5px dashed rgba(201,107,138,.7);display:grid;place-items:center;font-size:27px;line-height:1;padding:0;color:inherit;cursor:pointer;transition:transform .15s}
#E .cs-emo:active{transform:scale(.92)}#E .cs-emo i{position:absolute;right:-5px;bottom:-5px;width:20px;height:20px;border-radius:50%;background:#C96B8A;color:#fff;font-size:11px;font-style:normal;display:grid;place-items:center;border:2px solid var(--creme,#FBF8F6)}
#E .cs-emo.pop{animation:csPop .35s ease-out}@keyframes csPop{0%{transform:scale(.6)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
#E .cs-emo-aide{display:block;font-size:12.5px;color:var(--v-acc,#9A5B62);font-weight:500;margin:7px 0 0 2px;cursor:pointer}#E .cs-emo-aide small{font-weight:400;color:#776D64;font-size:11.5px}
#E .cs-emo-in{position:absolute;inset:0;width:100%;height:100%;opacity:0;border:0;padding:0;margin:0;font-size:16px;color:transparent;caret-color:transparent;background:none;cursor:pointer}
#E .cs-emo:focus-within{border-style:solid;box-shadow:0 0 0 3px color-mix(in srgb,#C96B8A 22%,transparent)}
#E .fc:has([data-cs-fam="presta"].on) :is(.cs-emo,.cs-emo-aide){display:none}
#E .cs-ev{position:absolute;inset:0;background:rgba(20,18,17,.35);opacity:0;pointer-events:none;transition:opacity .2s;z-index:90}#E .cs-ev.on{opacity:1;pointer-events:auto}
#E .cs-ep{position:absolute;left:0;right:0;bottom:0;z-index:91;background:var(--creme,#FBF8F6);border-radius:26px 26px 0 0;padding:10px 16px calc(env(safe-area-inset-bottom) + 24px);transform:translateY(105%);transition:transform .28s cubic-bezier(.2,.9,.3,1)}
#E .cs-ep.on{transform:none}#E .cs-ep .poig{width:40px;height:5px;border-radius:3px;background:rgba(30,28,27,.2);margin:0 auto 10px}
#E .cs-ep h4{margin:0 0 4px;font-size:16px}#E .cs-ep p{margin:0 0 10px;font-size:12.5px;color:#776D64}
#E .cs-eg{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}
#E .cs-eg button{aspect-ratio:1;min-width:0;padding:0;border:0;border-radius:12px;background:#fff;font-size:22px;line-height:1;cursor:pointer;transition:transform .12s}
#E .cs-eg button:active{transform:scale(.85)}#E .cs-eg button.on{outline:2px solid #C96B8A}
#E .cs-em2{margin-top:12px;display:flex;gap:8px;align-items:center;background:#fff;border-radius:14px;padding:6px 6px 6px 12px;border:1px solid rgba(30,28,27,.12)}
#E .cs-em2 span{font-size:13px;flex:1}#E .cs-em2 input{width:64px;height:40px;border-radius:10px;border:1.5px dashed rgba(201,107,138,.7);text-align:center;font-size:24px;background:var(--creme,#FBF8F6);color:inherit}`;
  document.head.appendChild(st);
  /* --- Prestations et prix --- */
  /* 23/11 (Marie, D109-D110) : deux familles, « Prestations » et « Petits plus », et les petits plus « Déjà écrits pour toi » (il ne reste que le prix) */
  const LP=window.LOGI_PRESTA;
  const ligneP=(p,i)=>{const plus=LP.estPlus(p);return `<div class="ligne${plus?" cs-pl":""}" data-cs-p="${i}">${plus?`<span class="cs-em" aria-hidden="true">${LP.esc(LP.emo(p))}</span>`:""}<div class="t">${LP.esc(p.nom)}<span>${plus?LP.esc(LP.duree(+p.duree||10)+(LP.parOngle(p)?" · par ongle":"")):LP.esc(LP.meta({...p,duree:+p.duree||60}))}</span></div>${plus?`<em>${LP.type(p)==="devis"?"sur devis":(LP.type(p)==="des"?"dès ":"+")+LP.esc(String(p.prix).replace(".",","))+" €"}</em>`:""}<span class="fl">›</span></div>`};
  MSF["ms-presta"]=()=>{const l=lit().prestations||[],I=l.map((p,i)=>i),B=I.filter(i=>!LP.estPlus(l[i])),A=I.filter(i=>LP.estPlus(l[i])),deja=new Set(l.map(p=>LP.plat(p.nom)).concat(A.map(i=>(LP.pretDe(l[i].nom)||{}).nom).filter(Boolean).map(LP.plat))),prets=LP.PRETS.map((x,k)=>k).filter(k=>!deja.has(LP.plat(LP.PRETS[k].nom)));
    return croix+`<h3>Prestations et prix</h3><div class="sous">${l.length} prestation${l.length>1?"s":""} · la même liste pour ton agenda et ton site</div>
    <div class="cs-sec" data-cs-sec="presta"><div class="cs-st">Prestations</div><p class="cs-sp">Ce que la cliente réserve : les poses, les déposes, les soins.</p>
    <div class="liste">${B.map(i=>ligneP(l[i],i)).join("")||'<div class="ligne"><div class="t">Aucune prestation pour l’instant</div></div>'}</div></div>
    <div class="cs-sec" data-cs-sec="plus"><div class="cs-st">Petits plus</div><p class="cs-sp">Ce qui s’ajoute à une prestation : nail art, chrome, strass… Proposés juste après, dans « Et avec ça ? ».</p>
    ${A.length?`<div class="liste">${A.map(i=>ligneP(l[i],i)).join("")}</div>`:""}</div>
    ${prets.length?`<div class="cs-sec cs-prets" data-cs-sec="prets"><div class="cs-st">Déjà écrits pour toi</div><p class="cs-sp">Touche celui que tu fais : il ne reste que le prix à mettre.</p><div class="cs-pills">${prets.map(k=>`<button type="button" class="cs-pill" data-cs-pret="${k}" data-nom="${LP.esc(LP.PRETS[k].nom)}"><span class="p" aria-hidden="true">+</span><span class="e" aria-hidden="true">${LP.PRETS[k].emo}</span><span class="n">${LP.esc(LP.PRETS[k].nom)}</span></button>`).join("")}</div></div>`:""}
    <button class="btn" data-cs-p="-1" style="width:100%;margin-top:14px">Ajouter une prestation</button>`};
  /* la fiche : « Une prestation / Un petit plus » (rangé tout seul d'après le nom, elle peut changer) et « Prix par ongle » pour un petit plus */
  let FAM=null;   /* { choisi: elle a touché, ou la fiche existe déjà } */
  const famHtml=(p,i,pre)=>{const plus=LP.estPlus(p);FAM={choisi:i>=0||!!pre};
    return `<div class="cs-fam" role="group" aria-label="Famille"><button type="button" data-cs-fam="presta" class="${plus?"":"on"}" aria-pressed="${!plus}">Une prestation</button><button type="button" data-cs-fam="plus" class="${plus?"on":""}" aria-pressed="${plus}">Un petit plus</button></div><div class="cs-auto" data-cs-auto>${pre?"✓ Déjà rempli : mets juste ton prix":""}</div>
    <button type="button" class="cs-ongle${LP.parOngle(p)?" on":""}" data-cs-ongle aria-pressed="${LP.parOngle(p)}"${plus?"":" hidden"}><i aria-hidden="true"></i>Prix par ongle <small>(ex. 1 € × 3 ongles)</small></button>`};
  const metFam=(fc,f)=>{fc.querySelectorAll("[data-cs-fam]").forEach(b=>{const on=b.dataset.csFam===f;b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)});const o=fc.querySelector("[data-cs-ongle]");if(o)o.hidden=f!=="plus"};
  document.addEventListener("input",e=>{if(!e.target.matches||!e.target.matches("[data-cs-nom]")||!FAM||FAM.choisi)return;const fc=e.target.closest(".fc");if(!fc||!fc.querySelector("[data-cs-fam]"))return;
    const plus=LP.estPlusNom(e.target.value);metFam(fc,plus?"plus":"presta");const o=fc.querySelector("[data-cs-ongle]");if(o&&plus){const on=LP.parOngle({nom:e.target.value});o.classList.toggle("on",on);o.setAttribute("aria-pressed",on)}
    fc.querySelector("[data-cs-auto]").textContent=plus?"✓ Rangée toute seule dans les petits plus":""});
  /* 24/11 (Marie, version A) : l'emoji d'un petit plus, c'est elle qui le choisit. Tant qu'elle n'a pas choisi, il suit le nom (deviné) ; choisi, il reste. */
  let EMO={val:"✦",perso:false};
  const EMOS="💅 ✨ 🤍 🌸 🌷 💎 🪩 💖 🦋 🍒 🍓 🌈 ⭐ 🌙 🔥 🎀 🐚 🫧 🍂 🍭 🧸 🖌️ 💧 🌿 🍯 🤎 🖤 ❤️ 💜 💙 💚 💛 🧡 ✦ 📏".split(" ");
  const devine=nom=>{const e=LP.emo({nom});return e==="✦"?"💅":e};   /* 25/11 (Marie) : 💅 dans le carré tant qu'elle n'a rien choisi */
  const emoDe=v=>{const t=String(v||"");const seg=window.Intl&&Intl.Segmenter?[...new Intl.Segmenter().segment(t)].map(x=>x.segment):Array.from(t);return seg.find(x=>/\p{Extended_Pictographic}/u.test(x))||""};
  const carre=(fc,v,anime)=>{const c=fc&&fc.querySelector("[data-cs-emo]");if(!c)return;c.firstChild.nodeValue=v;if(anime){c.classList.remove("pop");void c.offsetWidth;c.classList.add("pop")}};
  const panneau=()=>{const E=document.getElementById("E");if(!E)return null;let v=E.querySelector(".cs-ev");if(!v){E.insertAdjacentHTML("beforeend",`<div class="cs-ev" data-cs-eferme></div><div class="cs-ep" role="dialog" aria-label="Choisir ton emoji"><div class="poig"></div><h4></h4><p>Il s’affiche dans ta liste et sur la réservation de tes clientes.</p><div class="cs-eg">${EMOS.map(x=>`<button type="button" data-cs-echoix="${x}">${x}</button>`).join("")}</div><div class="cs-em2"><span>😀 Le mien (clavier emoji de ton téléphone)</span><input data-cs-emien maxlength="16" placeholder="+" aria-label="Ton emoji" autocomplete="off"></div></div>`)}return E};
  const ouvreEmo=fc=>{const E=panneau();if(!E)return;const nom=(fc.querySelector("[data-cs-nom]")||{}).value||"";E.querySelector(".cs-ep h4").textContent=nom.trim()?`Ton emoji pour « ${nom.trim()} »`:"Ton emoji";E.querySelectorAll("[data-cs-echoix]").forEach(b=>b.classList.toggle("on",b.dataset.csEchoix===EMO.val));E.querySelector("[data-cs-emien]").value="";E.querySelector(".cs-ev").classList.add("on");E.querySelector(".cs-ep").classList.add("on")};
  const fermeEmo=()=>{const E=document.getElementById("E");if(!E)return;E.querySelectorAll(".cs-ev,.cs-ep").forEach(x=>x.classList.remove("on"));const m=E.querySelector("[data-cs-emien]");if(m)m.blur()};
  const choisitEmo=v=>{EMO={val:v,perso:true};carre(document.querySelector("#E .fc"),v,true);fermeEmo()};
  const pedit=(i,pre)=>{const p=i>=0?(lit().prestations||[])[i]||{}:(pre||{});
    EMO={val:p.emo||devine(p.nom),perso:i>=0&&!!p.emo&&p.emo!==devine(p.nom)};return croix+`<h3>${i>=0?LP.esc(p.nom):pre?LP.esc(pre.emo+" "+pre.nom):"Nouvelle prestation"}</h3><div class="form" style="margin-top:12px">
    <div class="cs-nl"><label class="cs-emo" data-cs-emo>${LP.esc(EMO.val)}<i aria-hidden="true">✎</i><input class="cs-emo-in" id="cs-emo-in" data-cs-emien autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-label="Ajouter mon emoji"></label><label><input data-cs-nom value="${esc(p.nom)}" aria-label="Nom" placeholder="Son nom, par exemple : Pose américaine"></label></div><label class="cs-emo-aide" for="cs-emo-in">Ajouter mon emoji <small>(touche 😀 sur ton clavier)</small></label>
    </div>${famHtml(p,i,pre)}${__prestaFiche.haut(p,i)}
    <div class="lab" style="margin-top:12px">Durée</div><div class="chips ch-dur" data-cs-dur>${dureesPour(p.duree).map(d=>`<button class="chip${d===(+p.duree||60)?" on":""}" data-cs-d="${d}">${duree(d)}</button>`).join("")}</div>
    ${__prestaFiche.bas(p)}
    <button class="btn" data-cs-ok="presta" data-i="${i}" style="width:100%;margin-top:10px">Enregistrer</button>
    ${i>=0?`<button class="cs-sup" data-cs-sup="${i}">Supprimer cette prestation</button>`:""}`};
  /* --- Horaires --- */
  MSF["ms-horaires"]=()=>{const h=lit().horaires||Array(7).fill(null),hp=h.find(x=>x&&x.pd&&x.pf);/* 21/11 (Marie) : « Je ferme le midi », une pause pour tous les jours ouverts */return croix+`<h3>Horaires</h3><div class="sous">Ils s’affichent sur ton site</div>
    <div class="cs-p${hp?" on":""}" data-cs-midi><div class="r"><div>Je ferme le midi<span>Pas de réservation pendant la pause</span></div><button class="sw${hp?" on":""}" data-cs-psw aria-label="Je ferme le midi"></button></div><div class="cs-hr">Pause de<input type="time" data-cs-pd value="${hp?hp.pd:"12:00"}">à<input type="time" data-cs-pf value="${hp?hp.pf:"14:00"}"></div></div>
    <div class="liste" style="margin-top:12px;padding:0">${JOURS.map((j,i)=>{const x=h[i];return `<div class="cs-h${x?"":" ferme"}" data-cs-j="${i}"><b>${j}</b><span style="display:flex;align-items:center;gap:8px">${x?"":'<span class="cs-f">Fermé</span>'}<button class="sw${x?" on":""}" data-cs-sw></button></span>
      <div class="cs-hr">De<input type="time" data-cs-de value="${x?x.d:"09:00"}">à<input type="time" data-cs-a value="${x?x.f:"18:00"}"></div></div>`}).join("")}</div>
    <button class="btn" data-cs-ok="horaires" style="width:100%;margin-top:14px">Enregistrer</button>`};
  /* --- Adresse --- */
  MSF["ms-adresse"]=()=>{const b=lit(),A=b.acces||{};return croix+`<h3>Adresse</h3><div class="sous">Elle s’affiche avec le plan sur ton site</div><div class="form" style="margin-top:12px">
    <label>Rue<input data-cs-k="rue" value="${esc(b.rue)}" placeholder="Par exemple : 12 rue des Lilas"></label>
    <label>Code postal<input data-cs-k="cp" value="${esc(b.cp)}" inputmode="numeric" placeholder="Par exemple : 20137"></label>
    <label>Ville<input data-cs-k="ville" value="${esc(b.ville)}" placeholder="Par exemple : Porto-Vecchio"></label>
    <label>Téléphone<input data-cs-k="telephone" value="${esc(b.telephone)}" inputmode="tel" placeholder="Pour que les clientes t’appellent"></label>
    <label>Comment me trouver <small>facultatif</small><input data-cs-a="etage" value="${esc(A.etage)}" placeholder="Par exemple : 1er étage, porte de droite"></label>
    <label>Se garer <small>facultatif</small><input data-cs-a="garer" value="${esc(A.garer)}" placeholder="Par exemple : parking gratuit devant"></label></div>
    <div class="liste" style="margin-top:12px"><div class="ligne"><div class="t">Cacher mon adresse exacte<span>Je travaille chez moi : la cliente la reçoit par SMS après sa réservation</span></div><button class="sw${b.adresseCachee?" on":""}" data-cs-cache></button></div></div>
    <button class="btn" data-cs-ok="adresse" style="width:100%;margin-top:14px">Enregistrer</button>`};
  /* --- À propos de moi --- */
  MSF["ms-apropos"]=()=>{const b=lit();return croix+`<h3>À propos de moi</h3><div class="sous">Quelques lignes, avec tes mots</div>
    <textarea class="msg" data-cs-txt style="height:170px" placeholder="Par exemple : Passionnée par les ongles, je vous accueille dans mon salon…">${esc(b.presentation)}</textarea>
    <button class="btn" data-cs-ok="apropos" style="width:100%;margin-top:12px">Enregistrer</button>`};
  /* --- après chaque enregistrement : la page Mon site et l'aperçu se mettent à jour --- */
  const toast=(e,t)=>{const z=e&&e.querySelector(".toast");if(!z)return;z.textContent=t;z.classList.add("on");clearTimeout(z._t);z._t=setTimeout(()=>z.classList.remove("on"),1900)};
  const apres=(e,t)=>{document.querySelectorAll('.vue[data-p="si"]').forEach(vu=>{const y=vu.scrollTop;vu.innerHTML=MS.rgk();vu.scrollTop=y});
    document.querySelectorAll(".ms2-apercu iframe").forEach(f=>{f.src="loginail-creer/pret.html?public&appli="+Date.now()});
    if(e)e.classList.remove("fe");toast(e,t)};
  document.addEventListener("input",e=>{const t=e.target;if(!t.matches)return;
    if(t.matches("[data-cs-nom]")&&!EMO.perso){EMO.val=devine(t.value);carre(t.closest(".fc"),EMO.val,false);return}
    if(t.matches("[data-cs-emien]")){const v=emoDe(t.value);t.value="";if(v)choisitEmo(v)}});
  document.addEventListener("click",ev=>{const t=ev.target;if(!t.closest)return;
    const c=t.closest("[data-cs-emo]");if(c){ev.stopPropagation();return}   /* 25/11 (Marie) : plus de grille de 35 emojis, le carré ouvre directement le clavier */
    const x=t.closest("[data-cs-echoix]");if(x){ev.stopPropagation();choisitEmo(x.dataset.csEchoix);return}
    if(t.closest("[data-cs-eferme]")){ev.stopPropagation();fermeEmo();return}
    if(t.closest(".cs-ep")){ev.stopPropagation();return}},true);
  /* 22/11 : la liste est unique : Réglages et l'Accueil se mettent à jour derrière la feuille */
  const majListe=()=>{if(S.onglet==="re"||S.onglet==="acc")rendu()};
  /* 22/11 (D80) : la fiche complète ; les photos partent d'abord, puis la liste est relue (elle a pu changer pendant l'envoi) */
  async function enregistrePresta(ok,fc,e){
    if(ok.disabled)return false;const nom=fc.querySelector("[data-cs-nom]").value.trim();if(!nom){toast(e,"Écris le nom de la prestation");return false}
    const i=+ok.dataset.i,ancien=i>=0?((lit().prestations||[])[i]||{}).nom:null,dd=fc.querySelector("[data-cs-d].on"),d=dd?+dd.dataset.csD:60;
    ok.disabled=true;ok.textContent="Un instant…";
    const r=await __prestaFiche.prepare(),rend=m=>{ok.disabled=false;ok.textContent="Enregistrer";dit(m)};
    if(r.erreur){rend(r.erreur);return false}
    const b=lit();b.prestations=b.prestations||[];
    if(i>=0&&(!b.prestations[i]||b.prestations[i].nom!==ancien)){r.annule();rend("Ta liste a changé : rouvre la prestation");return false}
    window.__listeUnique?.avant(b);
    const fam=(fc.querySelector("[data-cs-fam].on")||{}).dataset?.csFam,og=fc.querySelector("[data-cs-ongle]");
    const p=i>=0?b.prestations[i]:{};Object.assign(p,{nom,duree:d},r.champs);if(i<0)b.prestations.push(p);
    /* 23/11 (D109) : la famille, l'émoticône et « par ongle » sont enregistrés avec la prestation (le site des clientes les lit aussi) */
    if(fam==="plus"){p.famille="plus";p.emo=EMO.perso?EMO.val:devine(nom);p.parOngle=!!(og&&og.classList.contains("on"));if(LP.proposeTous(nom).includes(String(p.detail||"").trim()))p.detail=""}else if(fam){p.famille="presta";delete p.emo;delete p.parOngle}
    if(!ecrit(b)){r.annule();rend("Pas de place sur ton téléphone : rien n’est enregistré");return false}
    r.menage();apres(null,"");majListe();
    if(fc.contains(ok))fc.innerHTML=MSF["ms-presta"]();
    toast(e,"Prestation enregistrée ✓ · ton site est à jour");return true;
  }
  document.addEventListener("click",ev=>{const t=ev.target;const fc=t.closest(".fc"),e=t.closest(".ecran");
    const op=t.closest("[data-cs-p]");if(op&&fc){ev.stopPropagation();fc.innerHTML=pedit(+op.dataset.csP);return}
    const fm=t.closest("[data-cs-fam]");if(fm&&fc){ev.stopPropagation();if(FAM)FAM.choisi=true;metFam(fc,fm.dataset.csFam);const z=fc.querySelector("[data-cs-auto]");if(z)z.textContent="";return}
    const og=t.closest("[data-cs-ongle]");if(og){ev.stopPropagation();const on=!og.classList.contains("on");og.classList.toggle("on",on);og.setAttribute("aria-pressed",on);return}
    const pr=t.closest("[data-cs-pret]");if(pr&&fc){ev.stopPropagation();const x=LP.PRETS[+pr.dataset.csPret];
      fc.innerHTML=pedit(-1,{nom:x.nom,emo:x.emo,duree:x.duree,famille:"plus",parOngle:x.parOngle,typePrix:"fixe",prix:null});
      const f=fc.closest(".feuille");if(f)f.scrollTop=0;const px=fc.querySelector("[data-cs-prix]");if(px)px.focus({preventScroll:true});return}
    const d=t.closest("[data-cs-d]");if(d){ev.stopPropagation();d.parentElement.querySelectorAll("[data-cs-d]").forEach(x=>x.classList.toggle("on",x===d));return}
    const psw=t.closest("[data-cs-psw]");if(psw){ev.stopPropagation();const on=!psw.classList.contains("on");psw.classList.toggle("on",on);psw.closest(".cs-p").classList.toggle("on",on);return}
    const sw=t.closest("[data-cs-sw]");if(sw){ev.stopPropagation();const r=sw.closest(".cs-h");const on=!sw.classList.contains("on");sw.classList.toggle("on",on);r.classList.toggle("ferme",!on);
      const f=r.querySelector(".cs-f");if(on&&f)f.remove();if(!on&&!f)sw.insertAdjacentHTML("beforebegin",'<span class="cs-f">Fermé</span>');return}
    const ca=t.closest("[data-cs-cache]");if(ca){ev.stopPropagation();ca.classList.toggle("on");return}
    const sup=t.closest("[data-cs-sup]");if(sup){ev.stopPropagation();const b=lit();window.__listeUnique?.avant(b);const parti=(b.prestations||[]).splice(+sup.dataset.csSup,1)[0];if(!ecrit(b))return;if(parti)__prestaFiche.efface(parti.photosPresta);apres(null,"");majListe();if(fc)fc.innerHTML=MSF["ms-presta"]();toast(e,"Prestation supprimée");return}
    const ok=t.closest("[data-cs-ok]");if(!ok||!fc)return;ev.stopPropagation();const k=ok.dataset.csOk,b=lit();
    if(k==="presta"){ok.__envoi=enregistrePresta(ok,fc,e);return}   /* durees-rdv.js attend cette promesse */
    if(k==="horaires"){const P=fc.querySelector("[data-cs-midi]"),pOn=P&&P.classList.contains("on"),pd=pOn&&fc.querySelector("[data-cs-pd]").value,pf=pOn&&fc.querySelector("[data-cs-pf]").value,pause=pd&&pf&&pd<pf;
      b.horaires=[...fc.querySelectorAll("[data-cs-j]")].map(r=>{if(!r.querySelector("[data-cs-sw]").classList.contains("on"))return null;const x={d:r.querySelector("[data-cs-de]").value||"09:00",f:r.querySelector("[data-cs-a]").value||"18:00"};if(pause&&pd>x.d&&pf<x.f){x.pd=pd;x.pf=pf}return x})}
    if(k==="adresse"){fc.querySelectorAll("[data-cs-k]").forEach(i=>b[i.dataset.csK]=i.value.trim());b.acces=b.acces||{};fc.querySelectorAll("[data-cs-a]").forEach(i=>{const v=i.value.trim();if(v)b.acces[i.dataset.csA]=v;else delete b.acces[i.dataset.csA]});
      b.adresseCachee=fc.querySelector("[data-cs-cache]").classList.contains("on")}
    if(k==="apropos")b.presentation=fc.querySelector("[data-cs-txt]").value.trim();
    if(!ecrit(b))return;apres(e,"Enregistré ✓ · ton site est à jour")},true);
  /* les petits résumés sous chaque ligne de « Mon contenu » */
  const resume=()=>{const b=lit();const h=b.horaires||[];const ouv=h.filter(Boolean).length;
    const R={"ms-presta":(b.prestations||[]).length+" prestations","ms-horaires":ouv?ouv+" jours ouverts"+(h[0]?" · "+h[0].d+" – "+h[0].f:""):"À remplir","ms-adresse":b.adresseCachee?(b.ville||"")+" · adresse cachée":[b.rue,b.ville].filter(Boolean).join(", ")||"À remplir","ms-apropos":b.presentation?"Ton texte est en ligne":"À remplir"};
    document.querySelectorAll('.vue[data-p="si"] .ligne[data-a]').forEach(l=>{const r=R[l.dataset.a];if(r==null)return;const t=l.querySelector(".t");if(!t)return;let s=t.querySelector("span");if(!s){s=document.createElement("span");t.appendChild(s)}if(s.textContent!==r)s.textContent=r})};
  new MutationObserver(resume).observe(document.body,{childList:true,subtree:true});setTimeout(resume,700);
})();
