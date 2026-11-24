/* ===== 05/11 (Marie) OBLIGATOIRE : « Mes infos légales » et « Bon à savoir » enregistrés pour de vrai → ils remplissent tout seuls
   les mentions légales, la confidentialité et les conditions de réservation de son site. ===== */
(function(){
  /* 22/11 : téléphone sans brouillon complet → on part du site rangé dans le compte, sinon « Enregistrer » le remplacerait par les seules infos légales */
  const lit=()=>{let b={};try{b=JSON.parse(localStorage.getItem("loginail-brouillon"))||{}}catch(_){}
    const d=typeof S==="object"&&S.site&&S.site.donnees;return d&&!b.nom?Object.assign(JSON.parse(JSON.stringify(d)),b):b};
  const ecrit=b=>{try{localStorage.setItem("loginail-brouillon",JSON.stringify(b));return true}catch(_){return false}};
  const esc=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
  const REG0={acompte:true,montant:"15 €",retard:"10 min",annulation:"48 h avant",frais:"Rien",autre:""};
  const regles=b=>Object.assign({},REG0,b.regles||{});
  const manque=b=>{const L=b.legal||{};const m=[];if(!L.nomComplet)m.push("ton nom");if(!/^\d{14}$/.test((L.siret||"").replace(/\s/g,"")))m.push("ton SIRET");return m};
  window.__legalManque=()=>manque(lit());   /* pour le rappel de l'Accueil (rappel-legal.js) */
  const puces=(k,l,v)=>`<div class="chips" data-lg-ch="${k}">${l.map(x=>`<button class="chip${x===v?" on":""}" data-lg-c>${x}</button>`).join("")}</div>`;
  /* 22/11 (Marie) : « y a des filles qui ont plus de 15 euros » → montant libre, en euros ou en %. Nombres entiers : c'est ce que le site et reserver() lisent tous les deux */
  const MONTANTS=["10 €","15 €","20 €","30 %"];
  const choixMontant=v=>{const autre=!MONTANTS.includes(v),n=autre?parseInt(v,10)||"":"",pc=autre&&/%/.test(v);
    return `<div class="chips" data-lg-ch="montant">${MONTANTS.map(x=>`<button class="chip${x===v?" on":""}" data-lg-c>${x}</button>`).join("")}<button class="chip${autre?" on":""}" data-lg-c data-lg-autre>Autre montant</button></div>
    <div data-lg-libre${autre?"":" hidden"}><div style="display:flex;gap:8px;align-items:center;margin-top:8px"><input class="champ" data-lg-mt value="${n}" inputmode="numeric" maxlength="3" placeholder="50" aria-label="Ton montant d’acompte" style="width:96px;margin:0;font-size:16px"><div class="chips" data-lg-unite>${["€","%"].map(u=>`<button class="chip${(u==="%")===pc?" on":""}" data-lg-c style="min-width:46px;min-height:44px;justify-content:center;align-items:center">${u}</button>`).join("")}</div></div>
    <div class="sous" style="text-align:left;margin-top:6px;font-size:11.5px">Si une prestation coûte moins cher, l’acompte s’arrête à son prix.</div></div>`};
  const litMontant=fc=>{const a=fc.querySelector("[data-lg-autre].on");if(!a)return{ok:true};
    const v=fc.querySelector("[data-lg-mt]").value.trim().replace(/[ €%]+$/,""),u=fc.querySelector("[data-lg-unite] .on").textContent;
    if(!/^[0-9]+$/.test(v))return{ok:false,dit:"Écris ton montant en chiffres ronds"};
    if(u==="%"&&(+v<1||+v>90))return{ok:false,dit:"Choisis entre 1 et 90 %"};
    if(+v<1||+v>999)return{ok:false,dit:"Choisis entre 1 et 999 €"};
    return{ok:true,val:+v+" "+u}};
  MSF["ms-legal"]=()=>{const b=lit(),L=b.legal||{};const adr=L.adresse||[b.rue,[b.cp,b.ville].filter(Boolean).join(" ")].filter(Boolean).join(", ");
    return croix+`<h3>Mes infos légales</h3><div class="sous">Elles remplissent toutes seules les pages légales de ton site</div>
    ${L.mediateur?"":'<div class="lg-med">Pense aussi à ton <b>médiateur de la consommation</b>, la loi en demande un. Pas encore choisi ? Pas de souci, enregistre déjà le reste.</div>'}<div class="form" style="margin-top:12px">
    <label>Prénom et nom<input data-lg="nomComplet" value="${esc(L.nomComplet)}" placeholder="Prénom Nom"></label>
    <label>Nom commercial <small>facultatif</small><input data-lg="entreprise" value="${esc(L.entreprise||b.nom)}" placeholder="Ton onglerie"></label>
    <label>SIRET<input data-lg="siret" value="${esc(L.siret)}" placeholder="14 chiffres" inputmode="numeric"></label>
    <label>Adresse de l’entreprise<input data-lg="adresse" value="${esc(adr)}" placeholder="Rue, code postal, ville"></label>
    <label>E-mail de contact<input data-lg="email" value="${esc(L.email||b.email)}" placeholder="toi@exemple.fr" inputmode="email"></label></div>
    <div class="liste" style="margin-top:10px"><div class="ligne"><div class="t">TVA non applicable<span>Article 293 B du CGI, pour la micro-entreprise</span></div><button class="sw${L.tvaNon===false?"":" on"}" data-lg-sw="tvaNon"></button></div></div>
    <div class="lab" style="margin-top:14px">Mon médiateur de la consommation</div>
    <div class="sous" style="text-align:left;margin:2px 0 8px;font-size:12px;line-height:1.5">C’est lui qui aide si un souci avec une cliente ne se règle pas entre vous. Note son nom et son site ici, quand tu l’as choisi.</div>
    <div class="form"><label>Nom du médiateur<input data-lg="mediateur" value="${esc(L.mediateur)}" placeholder="Nom du médiateur"></label><label>Son site<input data-lg="mediateurSite" value="${esc(L.mediateurSite)}" placeholder="www.exemple.fr"></label></div>
    <button class="btn" data-lg-ok="legal" style="width:100%;margin-top:14px">Enregistrer</button>`};
  MSF["ms-bon"]=()=>{const r=regles(lit());return croix+`<h3>Bon à savoir</h3><div class="sous">Tes règles, montrées à la cliente avant qu’elle réserve</div>
    <div class="liste" style="margin-top:12px"><div class="ligne"><div class="t">Acompte à la réservation<span>Déduit du prix le jour du rendez-vous</span></div><button class="sw${r.acompte?" on":""}" data-lg-sw="acompte"></button></div></div>
    <div class="lab" style="margin-top:12px">Montant de l’acompte</div>${choixMontant(r.montant)}
    <div class="lab" style="margin-top:12px">Retard accepté</div>${puces("retard",["5 min","10 min","15 min"],r.retard)}
    <div class="lab" style="margin-top:12px">Annulation gratuite jusqu’à</div>${puces("annulation",["24 h avant","48 h avant","72 h avant"],r.annulation)}
    <div class="lab" style="margin-top:12px">Si elle annule plus tard, ou ne vient pas</div>${puces("frais",["Rien","10 €","15 €","20 €","25 €","30 €"],r.frais)}
    <div class="sous" style="text-align:left;margin-top:6px;font-size:11.5px">Ces frais s’affichent sur ton site avant qu’elle réserve (obligatoire). Quand elle annule trop tard, l’appli te propose de les noter dans « À récupérer ».</div>
    <div class="lab" style="margin-top:12px">Autre chose à dire <small>facultatif</small></div><textarea class="msg" data-lg-txt style="height:80px" placeholder="Par exemple : venez sans vernis">${esc(r.autre)}</textarea>
    <div class="sous" style="margin-top:10px;font-size:11.5px">Obligatoire : ces règles sont dans tes conditions de réservation, que la cliente accepte avant de réserver.</div>
    <button class="btn" data-lg-ok="regles" style="width:100%;margin-top:6px">Enregistrer</button>`};
  const toast=(e,t)=>{const z=e&&e.querySelector(".toast");if(!z)return;z.textContent=t;z.classList.add("on");clearTimeout(z._t);z._t=setTimeout(()=>z.classList.remove("on"),2200)};
  document.addEventListener("click",ev=>{const t=ev.target;
    const c=t.closest("[data-lg-c]");if(c){ev.stopPropagation();c.parentElement.querySelectorAll("[data-lg-c]").forEach(x=>x.classList.toggle("on",x===c));
      if(c.parentElement.dataset.lgCh==="montant"){const z=c.parentElement.nextElementSibling,a=c.hasAttribute("data-lg-autre");z.hidden=!a;if(a)z.querySelector("input").focus()}return}
    const sw=t.closest("[data-lg-sw]");if(sw){ev.stopPropagation();sw.classList.toggle("on");return}
    const ok=t.closest("[data-lg-ok]");if(!ok)return;ev.stopPropagation();const fc=ok.closest(".fc"),e=ok.closest(".ecran"),b=lit();
    if(ok.dataset.lgOk==="legal"){const L=b.legal||{};fc.querySelectorAll("[data-lg]").forEach(i=>L[i.dataset.lg]=i.value.trim());L.siret=L.siret.replace(/\s/g,"");L.tvaNon=fc.querySelector('[data-lg-sw="tvaNon"]').classList.contains("on");
      if(L.siret&&!/^\d{14}$/.test(L.siret)){toast(e,"Le SIRET a 14 chiffres");return}b.legal=L}
    else{const r=regles(b),avant=r.montant,M=litMontant(fc);r.acompte=fc.querySelector('[data-lg-sw="acompte"]').classList.contains("on");
      if(r.acompte&&!M.ok){toast(e,M.dit);return}fc.querySelectorAll("[data-lg-ch]").forEach(g=>{const o=g.querySelector(".on");if(o)r[g.dataset.lgCh]=o.textContent});if(!M.ok)r.montant=avant;else if(M.val)r.montant=M.val;r.autre=fc.querySelector("[data-lg-txt]").value.trim();b.regles=r}
    if(!ecrit(b))return;e.classList.remove("fe");if(typeof S==="object"&&S.onglet==="acc")rendu();const m=manque(b);toast(e,ok.dataset.lgOk==="legal"&&m.length?"Enregistré · il manque encore "+m.join(", "):"Enregistré ✓ · ton site est à jour");
    document.querySelectorAll(".ms2-apercu iframe").forEach(f=>{f.src="loginail-creer/pret.html?public&appli="+Date.now()})},true);
  /* dans « Mon site » : la partie « Obligatoire » (avec ce qui manque) */
  const bloc=()=>{const b=lit(),m=manque(b),r=regles(b);
    return `<div class="lg-bloc"><div class="k">Obligatoire</div><div class="liste"><div class="ligne" data-a="ms-legal"><div class="t">Mes infos légales<span${m.length?' style="color:#A04A4A"':""}>${m.length?"Il manque "+m.join(", "):!(b.legal||{}).mediateur?"Nom et SIRET ✓ · pense à ton médiateur":"Complet ✓"}</span></div><span class="fl">›</span></div>
    <div class="ligne" data-a="ms-bon"><div class="t">Bon à savoir<span>${r.acompte?"Acompte "+r.montant:"Sans acompte"} · annulation ${r.annulation}${r.frais&&r.frais!=="Rien"?" · frais "+r.frais:""}</span></div><span class="fl">›</span></div></div></div>`};
  const pose=()=>document.querySelectorAll('.vue[data-p="si"]').forEach(vu=>{const ks=[...vu.querySelectorAll(".k")];const k=ks.find(x=>/Mon contenu/.test(x.textContent));if(!k)return;
    /* « Bon à savoir » passe dans « Obligatoire » */
    const vieux=k.nextElementSibling&&k.nextElementSibling.querySelector('.ligne[data-a="ms-bon"]');if(vieux)vieux.remove();
    const html=bloc(),ex=vu.querySelector(".lg-bloc");if(ex){if(ex._h!==html){ex.outerHTML=html;vu.querySelector(".lg-bloc")._h=html}return}
    const l=k.nextElementSibling;if(l){l.insertAdjacentHTML("afterend",html);vu.querySelector(".lg-bloc")._h=html}});
  new MutationObserver(pose).observe(document.body,{childList:true,subtree:true});setTimeout(pose,700);
})();
