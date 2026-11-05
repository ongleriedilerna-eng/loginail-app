/* ===== 06/11 (Marie) « Mon appli à mes couleurs » : Oui → boutons et rendez-vous à la couleur de son site, son fond en bandeau en haut (jamais derrière l'agenda). Non → style Loginail. ===== */
(function(){
  const INK={noir:"#1E1C1B",choco:"#4A3226",marine:"#24344F",taupe:"#5E5149",greige:"#5F574F",sable:"#80633F",peche:"#7A5444",sauge:"#4F5A45",lin:"#6E6253",nude:"#8A6656",rose:"#9A5D6B",bleup:"#4F6F93",lilas:"#7B62A8",jaune:"#8C6D12",menthe:"#3D7A66",abricot:"#B05E3A",ciel:"#2F7BA0"};
  const site=()=>{try{return JSON.parse(localStorage.getItem("loginail-brouillon"))||{}}catch(_){return {}}};
  const oui=()=>{try{return localStorage.getItem("loginail-appli-couleurs")==="oui"}catch(_){return false}};
  const ban=()=>{try{return localStorage.getItem("loginail-appli-bandeau")!=="non"}catch(_){return true}};
  const st=document.createElement("style");st.textContent=`
.ecran.mc .pap .pr{box-shadow:inset 3px 0 0 var(--acc)}
.ecran.mc .pap .pr{background:color-mix(in srgb,var(--acc) 10%,#FFFFFF)!important}
.mc-ban{position:relative;height:74px;margin:-4px 0 14px;border-radius:18px;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06)}
.mc-ban .f100,.mc-ban .tuile{position:absolute!important;inset:0;width:100%!important;height:100%!important;border-radius:0!important}
.mc-ligne .t span{display:block}
.mc-ban-l[hidden]{display:none!important}`;
  document.head.appendChild(st);
  /* les boutons noirs de l'appli prennent la couleur (on recopie leurs règles avec --acc) */
  const SEL=[".btn",".noire",".coche.ok>i",".pil.noir",".pc.on",".jai input:checked",".mg button.on",".pts i.on",".semaine button.on",".sw.on",".seg button.on",".toast",".ong.o2 button.on",".ong.o3 button:before",".k-tot"];
  st.textContent+=SEL.map(s=>`.ecran.mc ${s}{background:var(--acc)!important}`).join("");
  let fondHTML="";
  const prepareFond=()=>{const b=site();if(!b.fond){fondHTML="";return}
    const go=()=>{try{const i=F100.idx[b.fond];if(i!=null){fondHTML='<div class="f100">'+F100.tuile(i)+'</div>';if(!document.getElementById("mcCss")){const c=document.createElement("style");c.id="mcCss";c.textContent=FONDS100.css;document.head.appendChild(c)}applique()}}catch(_){}};
    if(window.F100)go();else{addEventListener("f100",go,{once:true});if(!document.querySelector('script[src*="fonds-100.js"]')){const sc=document.createElement("script");sc.src="loginail-site/fonds-100.js";document.head.appendChild(sc)}}};
  const applique=()=>{const on=oui(),b=site(),acc=INK[b.couleur]||"#1E1C1B";
    document.querySelectorAll(".ecran").forEach(e=>{e.classList.toggle("mc",on);if(!e.dataset.acc0)e.dataset.acc0=e.style.getPropertyValue("--acc")||"#1E1C1B";e.style.setProperty("--acc",on?acc:e.dataset.acc0);
      const ag=e.querySelector('.vue[data-p="ag"]');if(!ag)return;let bd=ag.querySelector(":scope>.mc-ban");
      if(on&&ban()&&fondHTML){if(!bd){bd=document.createElement("div");bd.className="mc-ban";ag.prepend(bd)}if(bd.dataset.f!==b.fond){bd.innerHTML=fondHTML;bd.dataset.f=b.fond}}else if(bd)bd.remove()})};
  /* la ligne « Mon appli à mes couleurs » dans les Réglages */
  const ligne=()=>`<div class="ligne mc-ligne"><div class="t">Mon appli à mes couleurs<span>Les couleurs de mon site dans l’appli</span></div><button class="sw${oui()?" on":""}" data-mc></button></div>`
    +`<div class="ligne mc-ban-l"${oui()?"":' hidden'}><div class="t">Afficher mon fond en haut<span>Le fond de mon site au-dessus de l’agenda</span></div><button class="sw${ban()?" on":""}" data-mcb></button></div>`;
  const ajoute=()=>{document.querySelectorAll('.vue[data-p="re"]').forEach(v=>{if(v.querySelector(".mc-ligne"))return;const l=v.querySelector(".liste");if(!l)return;
    const bloc=document.createElement("div");bloc.innerHTML='<div class="k">Mon appli</div><div class="liste">'+ligne()+'</div>';l.parentNode.insertBefore(bloc,l.previousElementSibling&&l.previousElementSibling.classList.contains("k")?l.previousElementSibling:l)})};
  document.addEventListener("click",ev=>{const bb=ev.target.closest("[data-mcb]");if(bb){ev.stopPropagation();const on=!ban();try{localStorage.setItem("loginail-appli-bandeau",on?"oui":"non")}catch(_){}
    document.querySelectorAll("[data-mcb]").forEach(x=>x.classList.toggle("on",on));if(on)prepareFond();applique();return}
    const b=ev.target.closest("[data-mc]");if(!b)return;ev.stopPropagation();const on=!oui();try{localStorage.setItem("loginail-appli-couleurs",on?"oui":"non")}catch(_){}
    document.querySelectorAll("[data-mc]").forEach(x=>x.classList.toggle("on",on));document.querySelectorAll(".mc-ban-l").forEach(x=>x.hidden=!on);if(on)prepareFond();applique()},true);
  new MutationObserver(()=>{ajoute();if(oui())applique()}).observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>{ajoute();if(oui()){prepareFond();applique()}},600);
})();
