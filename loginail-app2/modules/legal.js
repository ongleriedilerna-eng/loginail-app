/* ===== 05/11 (Marie) OBLIGATOIRE : « Mes infos légales » et « Bon à savoir » enregistrés pour de vrai → ils remplissent tout seuls
   les mentions légales, la confidentialité et les conditions de réservation de son site. ===== */
(function(){
  const lit=()=>{try{return JSON.parse(localStorage.getItem("loginail-brouillon"))||{}}catch(_){return {}}};
  const ecrit=b=>{try{localStorage.setItem("loginail-brouillon",JSON.stringify(b));return true}catch(_){return false}};
  const esc=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
  const REG0={acompte:true,montant:"15 €",retard:"10 min",annulation:"48 h avant",autre:""};
  const regles=b=>Object.assign({},REG0,b.regles||{});
  const manque=b=>{const L=b.legal||{};const m=[];if(!L.nomComplet)m.push("votre nom");if(!/^\d{14}$/.test((L.siret||"").replace(/\s/g,"")))m.push("votre SIRET");return m};
  const puces=(k,l,v)=>`<div class="chips" data-lg-ch="${k}">${l.map(x=>`<button class="chip${x===v?" on":""}" data-lg-c>${x}</button>`).join("")}</div>`;
  MSF["ms-legal"]=()=>{const b=lit(),L=b.legal||{};const adr=L.adresse||[b.rue,[b.cp,b.ville].filter(Boolean).join(" ")].filter(Boolean).join(", ");
    return croix+`<h3>Mes infos légales</h3><div class="sous">Elles remplissent toutes seules les pages légales de votre site</div><div class="form" style="margin-top:12px">
    <label>Prénom et nom<input data-lg="nomComplet" value="${esc(L.nomComplet)}" placeholder="Prénom Nom"></label>
    <label>Nom commercial <small>facultatif</small><input data-lg="entreprise" value="${esc(L.entreprise||b.nom)}" placeholder="Votre onglerie"></label>
    <label>SIRET<input data-lg="siret" value="${esc(L.siret)}" placeholder="14 chiffres" inputmode="numeric"></label>
    <label>Adresse de l’entreprise<input data-lg="adresse" value="${esc(adr)}" placeholder="Rue, code postal, ville"></label>
    <label>E-mail de contact<input data-lg="email" value="${esc(L.email||b.email)}" placeholder="vous@exemple.fr" inputmode="email"></label></div>
    <div class="liste" style="margin-top:10px"><div class="ligne"><div class="t">TVA non applicable<span>Article 293 B du CGI, pour la micro-entreprise</span></div><button class="sw${L.tvaNon===false?"":" on"}" data-lg-sw="tvaNon"></button></div></div>
    <div class="lab" style="margin-top:14px">Mon médiateur de la consommation <small>facultatif pour enregistrer</small></div>
    <div class="sous" style="text-align:left;margin:2px 0 8px;font-size:12px;line-height:1.5">Obligatoire pour toute pro qui travaille avec des particuliers, même sans site internet. Beaucoup l’oublient ! Si vous en avez un, écrivez son nom et son site. Sinon, laissez vide : vous pouvez quand même enregistrer.</div>
    <div class="form"><label>Nom du médiateur<input data-lg="mediateur" value="${esc(L.mediateur)}" placeholder="Nom du médiateur"></label><label>Son site<input data-lg="mediateurSite" value="${esc(L.mediateurSite)}" placeholder="www.exemple.fr"></label></div>
    <button class="btn" data-lg-ok="legal" style="width:100%;margin-top:14px">Enregistrer</button>`};
  MSF["ms-bon"]=()=>{const r=regles(lit());return croix+`<h3>Bon à savoir</h3><div class="sous">Vos règles, montrées à la cliente avant qu’elle réserve</div>
    <div class="liste" style="margin-top:12px"><div class="ligne"><div class="t">Acompte à la réservation<span>Déduit du prix le jour du rendez-vous</span></div><button class="sw${r.acompte?" on":""}" data-lg-sw="acompte"></button></div></div>
    <div class="lab" style="margin-top:12px">Montant de l’acompte</div>${puces("montant",["10 €","15 €","20 €","30 %"],r.montant)}
    <div class="lab" style="margin-top:12px">Retard accepté</div>${puces("retard",["5 min","10 min","15 min"],r.retard)}
    <div class="lab" style="margin-top:12px">Annulation gratuite jusqu’à</div>${puces("annulation",["24 h avant","48 h avant","72 h avant"],r.annulation)}
    <div class="lab" style="margin-top:12px">Autre chose à dire <small>facultatif</small></div><textarea class="msg" data-lg-txt style="height:80px" placeholder="Par exemple : venez sans vernis">${esc(r.autre)}</textarea>
    <div class="sous" style="margin-top:10px;font-size:11.5px">Obligatoire : ces règles sont dans vos conditions de réservation, que la cliente accepte avant de réserver.</div>
    <button class="btn" data-lg-ok="regles" style="width:100%;margin-top:6px">Enregistrer</button>`};
  const toast=(e,t)=>{const z=e&&e.querySelector(".toast");if(!z)return;z.textContent=t;z.classList.add("on");clearTimeout(z._t);z._t=setTimeout(()=>z.classList.remove("on"),2200)};
  document.addEventListener("click",ev=>{const t=ev.target;
    const c=t.closest("[data-lg-c]");if(c){ev.stopPropagation();c.parentElement.querySelectorAll("[data-lg-c]").forEach(x=>x.classList.toggle("on",x===c));return}
    const sw=t.closest("[data-lg-sw]");if(sw){ev.stopPropagation();sw.classList.toggle("on");return}
    const ok=t.closest("[data-lg-ok]");if(!ok)return;ev.stopPropagation();const fc=ok.closest(".fc"),e=ok.closest(".ecran"),b=lit();
    if(ok.dataset.lgOk==="legal"){const L=b.legal||{};fc.querySelectorAll("[data-lg]").forEach(i=>L[i.dataset.lg]=i.value.trim());L.siret=L.siret.replace(/\s/g,"");L.tvaNon=fc.querySelector('[data-lg-sw="tvaNon"]').classList.contains("on");
      if(L.siret&&!/^\d{14}$/.test(L.siret)){toast(e,"Le SIRET a 14 chiffres");return}b.legal=L}
    else{const r=regles(b);r.acompte=fc.querySelector('[data-lg-sw="acompte"]').classList.contains("on");fc.querySelectorAll("[data-lg-ch]").forEach(g=>{const o=g.querySelector(".on");if(o)r[g.dataset.lgCh]=o.textContent});r.autre=fc.querySelector("[data-lg-txt]").value.trim();b.regles=r}
    if(!ecrit(b))return;e.classList.remove("fe");const m=manque(b);toast(e,ok.dataset.lgOk==="legal"&&m.length?"Enregistré · il manque encore "+m.join(", "):"Enregistré ✓ · votre site est à jour");
    document.querySelectorAll(".ms2-apercu iframe").forEach(f=>{f.src="loginail-creer/pret.html?public&appli="+Date.now()})},true);
  /* dans « Mon site » : la partie « Obligatoire » (avec ce qui manque) */
  const bloc=()=>{const b=lit(),m=manque(b),r=regles(b);
    return `<div class="lg-bloc"><div class="k">Obligatoire</div><div class="liste"><div class="ligne" data-a="ms-legal"><div class="t">Mes infos légales<span${m.length?' style="color:#A04A4A"':""}>${m.length?"Il manque "+m.join(", "):!(b.legal||{}).mediateur?"Complet ✓ · petit rappel : votre médiateur, quand vous pourrez":"Complet ✓"}</span></div><span class="fl">›</span></div>
    <div class="ligne" data-a="ms-bon"><div class="t">Bon à savoir<span>${r.acompte?"Acompte "+r.montant:"Sans acompte"} · annulation ${r.annulation}</span></div><span class="fl">›</span></div></div></div>`};
  const pose=()=>document.querySelectorAll('.vue[data-p="si"]').forEach(vu=>{const ks=[...vu.querySelectorAll(".k")];const k=ks.find(x=>/Mon contenu/.test(x.textContent));if(!k)return;
    /* « Bon à savoir » passe dans « Obligatoire » */
    const vieux=k.nextElementSibling&&k.nextElementSibling.querySelector('.ligne[data-a="ms-bon"]');if(vieux)vieux.remove();
    const html=bloc(),ex=vu.querySelector(".lg-bloc");if(ex){if(ex._h!==html){ex.outerHTML=html;vu.querySelector(".lg-bloc")._h=html}return}
    const l=k.nextElementSibling;if(l){l.insertAdjacentHTML("afterend",html);vu.querySelector(".lg-bloc")._h=html}});
  new MutationObserver(pose).observe(document.body,{childList:true,subtree:true});setTimeout(pose,700);
})();
