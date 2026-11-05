/* ===== 06/11 (Marie) : « Photo de mon salon » et « Ma photo » (facultatif) — vraie photo, réduite, enregistrée dans son site ===== */
(function(){
  const lit=()=>{try{return JSON.parse(localStorage.getItem("loginail-brouillon"))||{}}catch(_){return {}}};
  const ecrit=b=>{try{localStorage.setItem("loginail-brouillon",JSON.stringify(b));return true}catch(_){return false}};
  const salonUrl=b=>b.salon!=null&&b.photos&&b.photos[b.salon]?b.photos[b.salon].url:"";
  const st=document.createElement("style");st.textContent=`.ph2{position:relative;margin:14px 0 4px;border-radius:18px;overflow:hidden;background:#EFEAE4;aspect-ratio:4/3;display:grid;place-items:center;color:#8a8076;font-size:13px}
.ph2.rond{width:150px;height:150px;aspect-ratio:auto;border-radius:50%;margin:16px auto 6px}.ph2 img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.ph2 svg{width:46px;height:46px;fill:none;stroke:currentColor;stroke-width:1.2}`;document.head.appendChild(st);
  const icS='<svg viewBox="0 0 24 24"><path d="M3 20h18M5 20V9l7-5 7 5v11M9.5 20v-6h5v6"/></svg>',icP='<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.5"/><path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5"/></svg>';
  const feuille=(type)=>{const b=lit(),u=type==="salon"?salonUrl(b):(b.quiPhoto||"");
    return croix+`<h3>${type==="salon"?"Photo de mon salon":"Ma photo"}</h3><div class="sous">Facultatif · ${type==="salon"?"elle s’affiche dans « Le salon » sur votre site":"elle s’affiche dans « À propos de moi »"}</div>
    <div class="ph2${type==="moi"?" rond":""}">${u?`<img src="${u}" alt="">`:(type==="salon"?icS:icP)}</div>
    <input type="file" accept="image/*" hidden data-ph2-in="${type}">
    <button class="btn" data-ph2="${type}" style="width:100%;margin-top:12px">${u?"Changer la photo":"Choisir une photo"}</button>
    ${u?`<button class="btn clair" data-ph2-x="${type}" style="width:100%;margin-top:9px">Retirer la photo</button>`:`<button class="btn clair" data-a="fermer" style="width:100%;margin-top:9px">Plus tard</button>`}`};
  MSF["ms-salon"]=()=>feuille("salon");MSF["ms-photo"]=()=>feuille("moi");
  /* réduire la photo (pour que ça reste léger) */
  const reduit=(file,max,cb)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext("2d").drawImage(im,0,0,c.width,c.height);cb(c.toDataURL("image/jpeg",.82))};im.src=r.result};r.readAsDataURL(file)};
  const enregistre=(type,url)=>{const b=lit();b.photos=b.photos||[];
    if(type==="salon"){if(url){if(b.salon!=null&&b.photos[b.salon])b.photos[b.salon]={url,auteurs:[]};else{b.photos.push({url,auteurs:[]});b.salon=b.photos.length-1}}
      else if(b.salon!=null){b.photos.splice(b.salon,1);if(b.principale!=null&&b.principale>b.salon)b.principale--;b.salon=null}}
    else b.quiPhoto=url||null;
    if(!ecrit(b)){try{dit("Photo trop lourde, essayez-en une autre")}catch(_){}return}
    try{dit(url?"Photo enregistrée ✓":"Photo retirée")}catch(_){}
    document.querySelectorAll('.vue[data-p="si"]').forEach(vu=>{const y=vu.scrollTop;vu.innerHTML=MS.rgk();vu.scrollTop=y});
    document.querySelectorAll(".ph2").forEach(z=>{const f=z.closest("[class]");});
    const op=document.querySelector(".ph2");if(op){const box=op.parentElement;box.innerHTML=feuille(type)}};
  document.addEventListener("click",ev=>{const c=ev.target.closest("[data-ph2]");if(c){ev.stopPropagation();const i=c.parentElement.querySelector(`[data-ph2-in="${c.dataset.ph2}"]`);i&&i.click();return}
    const x=ev.target.closest("[data-ph2-x]");if(x){ev.stopPropagation();enregistre(x.dataset.ph2X,"")}},true);
  document.addEventListener("change",ev=>{const i=ev.target.closest("[data-ph2-in]");if(!i||!i.files[0])return;const t=i.dataset.ph2In;reduit(i.files[0],t==="salon"?1200:600,u=>enregistre(t,u))},true);
})();
