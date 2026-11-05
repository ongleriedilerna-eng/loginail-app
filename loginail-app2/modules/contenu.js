/* ===== 05/11 (Marie) « Mon contenu » relié au VRAI site : prestations et prix, horaires, adresse, à propos. Ce qu'elle change dans l'appli change sur son site. ===== */
(function(){
  const lit=()=>{try{return JSON.parse(localStorage.getItem("loginail-brouillon"))||{}}catch(_){return {}}};
  const ecrit=b=>{try{localStorage.setItem("loginail-brouillon",JSON.stringify(b));return true}catch(_){return false}};
  const esc=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
  const JOURS=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
  const DUR=[[30,"30 min"],[45,"45 min"],[60,"1 h"],[90,"1 h 30"],[120,"2 h"],[150,"2 h 30"],[180,"3 h"]];
  const duree=m=>m<60?`${m} min`:`${Math.floor(m/60)} h${m%60?" "+String(m%60).padStart(2,"0"):""}`;
  const prix=p=>p==null||p===""?"Sur devis":`${String(p).replace(".",",")} €`;
  const st=document.createElement("style");st.textContent=`
.cs-h{display:grid;grid-template-columns:1fr auto;align-items:center;gap:6px 10px;padding:11px 14px;border-bottom:1px solid rgba(30,28,27,.07)}.cs-h:last-child{border-bottom:0}
.cs-h b{font-weight:400;font-size:14px}.cs-h .cs-hr{grid-column:1/-1;display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--gris)}
.cs-h .cs-hr input{flex:1;min-width:0;border:0;border-radius:10px;background:#F4F0EB;padding:8px 9px;font:inherit;font-size:14px;color:var(--noir)}
.cs-h.ferme .cs-hr{display:none}.cs-h .cs-f{font-size:12px;color:var(--gris)}
.cs-sup{display:block;width:100%;margin-top:9px;border:0;background:none;color:#A04A4A;font:inherit;font-size:13px;text-decoration:underline;cursor:pointer}`;
  document.head.appendChild(st);
  /* --- Prestations et prix --- */
  MSF["ms-presta"]=()=>{const l=lit().prestations||[];return croix+`<h3>Prestations et prix</h3><div class="sous">${l.length} prestation${l.length>1?"s":""} · touchez pour modifier</div>
    <div class="liste" style="margin-top:12px">${l.map((p,i)=>`<div class="ligne" data-cs-p="${i}"><div class="t">${esc(p.nom)}${p.duree?`<span>${duree(p.duree)}</span>`:""}</div><em>${prix(p.prix)}</em><span class="fl">›</span></div>`).join("")||'<div class="ligne"><div class="t">Aucune prestation pour l’instant</div></div>'}</div>
    <button class="btn" data-cs-p="-1" style="width:100%;margin-top:14px">Ajouter une prestation</button>`};
  const pedit=i=>{const p=i>=0?(lit().prestations||[])[i]||{}:{};return croix+`<h3>${i>=0?esc(p.nom):"Nouvelle prestation"}</h3><div class="form" style="margin-top:12px">
    <label>Nom<input data-cs-nom value="${esc(p.nom)}" placeholder="Par exemple : Pose américaine"></label>
    <label>Prix en €<input data-cs-prix value="${p.prix==null?"":String(p.prix).replace(".",",")}" placeholder="Par exemple : 55" inputmode="decimal"></label></div>
    <div class="lab" style="margin-top:12px">Durée</div><div class="chips" data-cs-dur>${DUR.map(d=>`<button class="chip${d[0]===p.duree?" on":""}" data-cs-d="${d[0]}">${d[1]}</button>`).join("")}</div>
    <div class="sous" style="margin-top:12px;font-size:11.5px">Sans prix, elle s’affiche « Sur devis » sur votre site.</div>
    <button class="btn" data-cs-ok="presta" data-i="${i}" style="width:100%;margin-top:10px">Enregistrer</button>
    ${i>=0?`<button class="cs-sup" data-cs-sup="${i}">Supprimer cette prestation</button>`:""}`};
  /* --- Horaires --- */
  MSF["ms-horaires"]=()=>{const h=lit().horaires||Array(7).fill(null);return croix+`<h3>Horaires</h3><div class="sous">Ils s’affichent sur votre site</div>
    <div class="liste" style="margin-top:12px;padding:0">${JOURS.map((j,i)=>{const x=h[i];return `<div class="cs-h${x?"":" ferme"}" data-cs-j="${i}"><b>${j}</b><span style="display:flex;align-items:center;gap:8px">${x?"":'<span class="cs-f">Fermé</span>'}<button class="sw${x?" on":""}" data-cs-sw></button></span>
      <div class="cs-hr">De<input type="time" data-cs-de value="${x?x.d:"09:00"}">à<input type="time" data-cs-a value="${x?x.f:"18:00"}"></div></div>`}).join("")}</div>
    <button class="btn" data-cs-ok="horaires" style="width:100%;margin-top:14px">Enregistrer</button>`};
  /* --- Adresse --- */
  MSF["ms-adresse"]=()=>{const b=lit(),A=b.acces||{};return croix+`<h3>Adresse</h3><div class="sous">Elle s’affiche avec le plan sur votre site</div><div class="form" style="margin-top:12px">
    <label>Rue<input data-cs-k="rue" value="${esc(b.rue)}" placeholder="Par exemple : 12 rue des Lilas"></label>
    <label>Code postal<input data-cs-k="cp" value="${esc(b.cp)}" inputmode="numeric" placeholder="Par exemple : 20137"></label>
    <label>Ville<input data-cs-k="ville" value="${esc(b.ville)}" placeholder="Par exemple : Porto-Vecchio"></label>
    <label>Téléphone<input data-cs-k="telephone" value="${esc(b.telephone)}" inputmode="tel" placeholder="Pour que les clientes vous appellent"></label>
    <label>Comment me trouver <small>facultatif</small><input data-cs-a="etage" value="${esc(A.etage)}" placeholder="Par exemple : 1er étage, porte de droite"></label>
    <label>Se garer <small>facultatif</small><input data-cs-a="garer" value="${esc(A.garer)}" placeholder="Par exemple : parking gratuit devant"></label></div>
    <div class="liste" style="margin-top:12px"><div class="ligne"><div class="t">Cacher mon adresse exacte<span>Je travaille chez moi : la cliente la reçoit par SMS après sa réservation</span></div><button class="sw${b.adresseCachee?" on":""}" data-cs-cache></button></div></div>
    <button class="btn" data-cs-ok="adresse" style="width:100%;margin-top:14px">Enregistrer</button>`};
  /* --- À propos de moi --- */
  MSF["ms-apropos"]=()=>{const b=lit();return croix+`<h3>À propos de moi</h3><div class="sous">Quelques lignes, avec vos mots</div>
    <textarea class="msg" data-cs-txt style="height:170px" placeholder="Par exemple : Passionnée par les ongles, je vous accueille dans mon salon…">${esc(b.presentation)}</textarea>
    <button class="btn" data-cs-ok="apropos" style="width:100%;margin-top:12px">Enregistrer</button>`};
  /* --- après chaque enregistrement : la page Mon site et l'aperçu se mettent à jour --- */
  const toast=(e,t)=>{const z=e&&e.querySelector(".toast");if(!z)return;z.textContent=t;z.classList.add("on");clearTimeout(z._t);z._t=setTimeout(()=>z.classList.remove("on"),1900)};
  const apres=(e,t)=>{document.querySelectorAll('.vue[data-p="si"]').forEach(vu=>{const y=vu.scrollTop;vu.innerHTML=MS.rgk();vu.scrollTop=y});
    document.querySelectorAll(".ms2-apercu iframe").forEach(f=>{f.src="loginail-creer/pret.html?public&appli="+Date.now()});
    if(e)e.classList.remove("fe");toast(e,t)};
  document.addEventListener("click",ev=>{const t=ev.target;const fc=t.closest(".fc"),e=t.closest(".ecran");
    const op=t.closest("[data-cs-p]");if(op&&fc){ev.stopPropagation();fc.innerHTML=pedit(+op.dataset.csP);return}
    const d=t.closest("[data-cs-d]");if(d){ev.stopPropagation();d.parentElement.querySelectorAll("[data-cs-d]").forEach(x=>x.classList.toggle("on",x===d&&!x.classList.contains("on")));return}
    const sw=t.closest("[data-cs-sw]");if(sw){ev.stopPropagation();const r=sw.closest(".cs-h");const on=!sw.classList.contains("on");sw.classList.toggle("on",on);r.classList.toggle("ferme",!on);
      const f=r.querySelector(".cs-f");if(on&&f)f.remove();if(!on&&!f)sw.insertAdjacentHTML("beforebegin",'<span class="cs-f">Fermé</span>');return}
    const ca=t.closest("[data-cs-cache]");if(ca){ev.stopPropagation();ca.classList.toggle("on");return}
    const sup=t.closest("[data-cs-sup]");if(sup){ev.stopPropagation();const b=lit();(b.prestations||[]).splice(+sup.dataset.csSup,1);if(!ecrit(b))return;apres(null,"");if(fc)fc.innerHTML=MSF["ms-presta"]();toast(e,"Prestation supprimée");return}
    const ok=t.closest("[data-cs-ok]");if(!ok||!fc)return;ev.stopPropagation();const k=ok.dataset.csOk,b=lit();
    if(k==="presta"){const nom=fc.querySelector("[data-cs-nom]").value.trim();if(!nom){toast(e,"Écrivez le nom de la prestation");return}
      const px=fc.querySelector("[data-cs-prix]").value.replace(",",".").replace(/[^\d.]/g,"");const dd=fc.querySelector("[data-cs-d].on");const i=+ok.dataset.i;
      b.prestations=b.prestations||[];const p=i>=0?b.prestations[i]||{}:{};Object.assign(p,{nom,prix:px===""?null:+px,duree:dd?+dd.dataset.csD:null});if(i<0)b.prestations.push(p);else b.prestations[i]=p;
      if(!ecrit(b))return;apres(null,"");fc.innerHTML=MSF["ms-presta"]();toast(e,"Prestation enregistrée ✓ · votre site est à jour");return}
    if(k==="horaires"){b.horaires=[...fc.querySelectorAll("[data-cs-j]")].map(r=>r.querySelector("[data-cs-sw]").classList.contains("on")?{d:r.querySelector("[data-cs-de]").value||"09:00",f:r.querySelector("[data-cs-a]").value||"18:00"}:null)}
    if(k==="adresse"){fc.querySelectorAll("[data-cs-k]").forEach(i=>b[i.dataset.csK]=i.value.trim());b.acces=b.acces||{};fc.querySelectorAll("[data-cs-a]").forEach(i=>{const v=i.value.trim();if(v)b.acces[i.dataset.csA]=v;else delete b.acces[i.dataset.csA]});
      b.adresseCachee=fc.querySelector("[data-cs-cache]").classList.contains("on")}
    if(k==="apropos")b.presentation=fc.querySelector("[data-cs-txt]").value.trim();
    if(!ecrit(b))return;apres(e,"Enregistré ✓ · votre site est à jour")},true);
  /* les petits résumés sous chaque ligne de « Mon contenu » */
  const resume=()=>{const b=lit();const h=b.horaires||[];const ouv=h.filter(Boolean).length;
    const R={"ms-presta":(b.prestations||[]).length+" prestations","ms-horaires":ouv?ouv+" jours ouverts"+(h[0]?" · "+h[0].d+" – "+h[0].f:""):"À remplir","ms-adresse":b.adresseCachee?(b.ville||"")+" · adresse cachée":[b.rue,b.ville].filter(Boolean).join(", ")||"À remplir","ms-apropos":b.presentation?"Votre texte est en ligne":"À remplir"};
    document.querySelectorAll('.vue[data-p="si"] .ligne[data-a]').forEach(l=>{const r=R[l.dataset.a];if(r==null)return;const t=l.querySelector(".t");if(!t)return;let s=t.querySelector("span");if(!s){s=document.createElement("span");t.appendChild(s)}if(s.textContent!==r)s.textContent=r})};
  new MutationObserver(resume).observe(document.body,{childList:true,subtree:true});setTimeout(resume,700);
})();
