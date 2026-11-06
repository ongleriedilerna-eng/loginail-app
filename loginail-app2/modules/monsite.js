/* ===== 06/11 (Marie) « Mon site » v2 : son VRAI site en petit en haut, et tout se change depuis l'appli (univers, forme, couleur, fond, écriture, paillettes, charms) ===== */
(function(){
  const lit=()=>{try{return JSON.parse(localStorage.getItem("loginail-brouillon"))||{}}catch(_){return {}}};
  const ecrit=b=>{try{localStorage.setItem("loginail-brouillon",JSON.stringify(b))}catch(_){}};
  const UNIV=[["Gothique","style=1&couleur=noir&mode=nuit&fond=&police=gothique&paillettes=argent&charm=araignee,croixgothique,lunegothique,vitrail,clegothique,chauvesouris"],
   ["Bohème","style=2&couleur=peche&mode=jour&fond=Soleils sur terracotta&police=seventies&paillettes=or&charm=soleilvisage,lunesoleil,coeursoleil,soleil,papillondore"],
   ["Y2K","style=2&couleur=lilas&mode=jour&fond=Reflets disco&police=y2k&paillettes=holo&charm=coeurlilas,planete,oursonlilas,etoilelilas,martien,coeurchrome"],
   ["Mignon","style=1&couleur=rose&mode=jour&fond=Rose coquette&police=bonbon&paillettes=nacre&charm=ceriseruban,fraiseperle,noeudgelee,fleurgelee"],
   ["Clean","style=1&couleur=lin&mode=jour&fond=&police=chic&paillettes=nacre&charm="],
   ["Baddie","style=1&couleur=noir&mode=nuit&fond=Zèbre&police=retro&paillettes=or&charm=levres,coeurleopard,coeurzebre,cerisesbordeaux"]];
  const COUL=[["noir","#1E1C1B"],["choco","#4A3226"],["marine","#24344F"],["taupe","#5E5149"],["greige","#BDB3A8"],["sable","#C9A97E"],["peche","#E2C3AF"],["sauge","#9EA791"],["lin","#CFC4B3"],["nude","#D9B8A9"],["rose","#EBC3CC"],["bleup","#B9CCE0"],["lilas","#D5C8EC"],["jaune","#F3E3A0"],["menthe","#BFE3D4"],["abricot","#F6C9AE"],["ciel","#BCDDEE"]];
  const FORMES=[[1,"Amande"],[2,"Stiletto"],[3,"Carré"],[4,"Ovale"],[5,"Coffin"]];
  const forme=b=>b.coffin?5:b.epure?4:(b.style||1);
  const POL=[["elegante","Élégante"],["manuscrite","Manuscrite"],["ronde","Ronde"],["retro","Rétro"],["chic","Chic"],["luxe","Luxe"],["seventies","Seventies"],["y2k","Y2K"],["bonbon","Bonbon"],["gothique","Gothique"]];
  const PAIL=[["non","Sans"],["or","Dorées"],["argent","Argentées"],["nacre","Nacrées"],["holo","Holographiques"],["rose","Roses"]];
  const NOMF={1:"Amande",2:"Stiletto",3:"Carré",4:"Ovale",5:"Coffin"};
  const url=()=>"loginail-creer/pret.html?public&appli="+Date.now();
  const st=document.createElement("style");st.textContent=`
.ms2-apercu{position:relative;height:230px;border-radius:20px;overflow:hidden;background:#EAE5DF;margin:0 0 10px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06)}
.ms2-apercu iframe{position:absolute;left:0;top:0;width:390px;height:844px;border:0;transform-origin:0 0;pointer-events:none}
.ms2-apercu .ms2-en{position:absolute;left:10px;bottom:10px;padding:7px 12px;border-radius:99px;background:rgba(30,28,27,.78);color:#fff;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase}
.ms2-p{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:2px 1px 6px}.ms2-p::-webkit-scrollbar{display:none}
.ms2-p button{flex:none;border:0;border-radius:99px;padding:9px 13px;background:#fff;font-size:13px;box-shadow:0 0 0 1px rgba(30,28,27,.1);cursor:pointer}
.ms2-p button.on{background:var(--acc,#1E1C1B);color:#fff;box-shadow:none}
.ms2-dots{display:grid;grid-template-columns:repeat(9,1fr);gap:8px;padding:4px 2px}
.ms2-dots button{aspect-ratio:1;border-radius:50%;border:0;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)}
.ms2-dots button.on{box-shadow:0 0 0 2px #fff,0 0 0 4px #1E1C1B}
.ms2-ronds{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:4px 2px}
.ms2-ronds button{aspect-ratio:1;border-radius:50%;overflow:hidden;border:0;padding:0;position:relative;background:#fff;box-shadow:0 0 0 1px rgba(30,28,27,.14);cursor:pointer;font-size:9px;color:#6B625C}
.ms2-ronds button.on{box-shadow:0 0 0 2px #fff,0 0 0 4px #1E1C1B}
.ms2-ronds .rond-f{position:absolute;inset:0;width:auto;height:auto;border-radius:50%;overflow:hidden}`;
  document.head.appendChild(st);
  const resume=b=>[b.univers||NOMF[forme(b)],(COUL.find(c=>c[0]===b.couleur)||["noir"])[0].replace("bleup","bleu pastel"),b.mode==="nuit"?"foncé":"clair"].join(" · ");
  /* la page « Mon site » */
  const PAGE=()=>{const b=lit();return tete("Mon site","En ligne")
    +`<div class="ms2-apercu" data-ms2="voir"><iframe tabindex="-1" title="Mon site"></iframe><span class="ms2-en">Mon site en direct · voir en grand</span></div><button class="btn" data-ms2="grand" style="width:100%;margin:0 0 6px">Modifier mon site</button>`
    +'<div class="k">Mon style</div><div class="liste">'
    +`<div class="ligne" data-ms2="grand"><div class="t">Style, couleur et fond<span>${resume(b)}${b.fond?" · "+b.fond:""}</span></div><span class="fl">›</span></div>`
    +`<div class="ligne" data-ms2="grand" data-v="4"><div class="t">Écriture, paillettes et charms<span>${(POL.find(p=>p[0]===b.police)||["","Élégante"])[1]} · ${(PAIL.find(p=>p[0]===(b.paillettes||"non"))||["","Sans"])[1]} · ${(b.charms||[]).length?(b.charms.length+" charms"):"sans charms"}</span></div><span class="fl">›</span></div></div>`
    +'<div class="k">Mon contenu</div><div class="liste">'
    +[["Prestations et prix",(b.prestations||[]).length+" prestations","ms-presta"],["Photos de mes ongles",(b.photos||[]).filter((p,i)=>i!==b.salon).length+" photos","ms-photos"],["Photo de mon salon",(b.salon!=null&&b.photos&&b.photos[b.salon]?"Ajoutée":"Facultatif"),"ms-salon"],["Horaires","","ms-horaires"],["Adresse","","ms-adresse"],["À propos de moi","","ms-apropos"],["Ma photo",(b.quiPhoto?"Ajoutée":"Facultatif · dans « À propos de moi »"),"ms-photo"],["Bon à savoir","Acompte, retard, annulation","ms-bon"]].map(l=>`<div class="ligne" data-a="${l[2]}"><div class="t">${l[0]}${l[1]?`<span>${l[1]}</span>`:""}</div><span class="fl">›</span></div>`).join("")+'</div>'
    +'<div class="k">Faire connaître mon site</div><div class="liste">'
    +[["QR code à imprimer","Pour le salon, les cartes de visite","qr"],["Lien pour ma bio Instagram","","bio"],["Aperçu quand je partage le lien","Ce que voient les gens sur WhatsApp","apercu"]].map(l=>`<div class="ligne" data-a="${l[2]}"><div class="t">${l[0]}${l[1]?`<span>${l[1]}</span>`:""}</div><span class="fl">›</span></div>`).join("")+'</div>'};
  MS.rgk=PAGE;
  document.querySelectorAll('.ecran[data-v="rgk"] .vue[data-p="si"]').forEach(vu=>vu.innerHTML=PAGE());
  /* feuille 1 : univers, forme, couleur, clair/foncé, fond */
  const ronds=b=>{setTimeout(()=>__ajusteRonds(),60);setTimeout(()=>__ajusteRonds(),400);if(!window.F100)return '<div class="sous">Chargement des fonds…</div>';const D=FONDS100;const l=F100.liste("Tous");
    return `<div class="ms2-ronds"><button data-ms2="fond" data-v=""${b.fond?"":' class="on"'}>Aucun</button>${l.map(i=>`<button data-ms2="fond" data-v="${D.f[i][0].replace(/"/g,"&quot;")}"${D.f[i][0]===b.fond?' class="on"':""}>${F100.rond(i)}</button>`).join("")}</div>`};
  MSF["ms-style2"]=()=>{const b=lit();chargeF();return croix+`<h3>Style, couleur et fond</h3><div class="sous">Chaque choix change votre site tout de suite</div>
    <div class="lab" style="margin-top:12px">Partir d’un univers</div><div class="ms2-p">${UNIV.map((u,i)=>`<button data-ms2="univ" data-v="${i}"${u[0]===b.univers?' class="on"':""}>${u[0]}</button>`).join("")}</div>
    <div class="lab" style="margin-top:10px">La forme du site</div><div class="ms2-p">${FORMES.map(f=>`<button data-ms2="style" data-v="${f[0]}"${f[0]===forme(b)?' class="on"':""}>${f[1]}</button>`).join("")}</div>
    <div class="lab" style="margin-top:10px">Couleur</div><div class="ms2-dots">${COUL.map(c=>`<button data-ms2="couleur" data-v="${c[0]}" style="background:${c[1]}"${c[0]===b.couleur?' class="on"':""}></button>`).join("")}</div>
    <div class="lab" style="margin-top:10px">Clair ou foncé</div><div class="ms2-p"><button data-ms2="mode" data-v="jour"${b.mode!=="nuit"?' class="on"':""}>Clair</button><button data-ms2="mode" data-v="nuit"${b.mode==="nuit"?' class="on"':""}>Foncé</button></div>
    <div class="lab" style="margin-top:10px">Fond</div><div class="ms2-fonds">${ronds(b)}</div>`};
  /* feuille 2 : écriture, paillettes, charms */
  MSF["ms-details2"]=()=>{const b=lit();return croix+`<h3>Écriture, paillettes et charms</h3><div class="sous">Les petits détails qui font votre style</div>
    <div class="lab" style="margin-top:12px">L’écriture du nom</div><div class="ms2-p">${POL.map(p=>`<button data-ms2="police" data-v="${p[0]}"${p[0]===(b.police||"elegante")?' class="on"':""}>${p[1]}</button>`).join("")}</div>
    <div class="lab" style="margin-top:10px">Paillettes au toucher</div><div class="ms2-p">${PAIL.map(p=>`<button data-ms2="paillettes" data-v="${p[0]}"${p[0]===(b.paillettes||"non")?' class="on"':""}>${p[1]}</button>`).join("")}</div>
    <div class="lab" style="margin-top:10px">Charms</div><div class="ms2-p"><button data-ms2="charmsoui" data-v="1"${(b.charms||[]).length?' class="on"':""}>Avec charms</button><button data-ms2="charmsoui" data-v="0"${(b.charms||[]).length?"":' class="on"'}>Sans charms</button></div>
    <div class="sous" style="margin-top:6px;font-size:11.5px">Les charms de votre univers. Bientôt : les choisir un par un.</div>`};
  let fCharge=0;const chargeF=()=>{if(window.F100||fCharge)return;fCharge=1;addEventListener("f100",()=>{document.querySelectorAll(".ms2-fonds").forEach(z=>z.innerHTML=ronds(lit()));
    if(!document.getElementById("mcCss")){const c=document.createElement("style");c.id="mcCss";c.textContent=FONDS100.css;document.head.appendChild(c)}},{once:true});
    if(!document.querySelector('script[src*="fonds-100.js"]')){const sc=document.createElement("script");sc.src="loginail-site/fonds-100.js";document.head.appendChild(sc)}};
  /* l'aperçu en direct */
  const rafraichit=()=>{document.querySelectorAll(".ms2-apercu iframe").forEach(f=>{const z=f.parentElement.clientWidth/390;f.style.transform=`scale(${z})`;
    f.onload=()=>{try{const d=f.contentDocument,s2=d.createElement("style");s2.textContent=".pret,.langues,.bandeau{display:none!important}";d.head.appendChild(s2)}catch(_){}};f.src=url()})};
  const RO=new ResizeObserver(en=>en.forEach(x=>{const f=x.target.querySelector("iframe");if(f&&x.contentRect.width)f.style.transform=`scale(${x.contentRect.width/390})`}));
  new MutationObserver(()=>document.querySelectorAll(".ms2-apercu").forEach(a=>{if(!a._ro){a._ro=1;RO.observe(a)}})).observe(document.body,{childList:true,subtree:true});
  let dern=0;new MutationObserver(()=>{document.querySelectorAll(".ms2-apercu iframe").forEach(f=>{if(!f.src||f.src==="about:blank"){const z=f.parentElement.clientWidth/390;f.style.transform=`scale(${z})`;f.src=url();
    f.onload=()=>{try{const d=f.contentDocument,s2=d.createElement("style");s2.textContent=".pret,.langues,.bandeau{display:none!important}";d.head.appendChild(s2)}catch(_){}}}})}).observe(document.body,{childList:true,subtree:true});
  /* les choix */
  /* le site en GRAND par-dessus l'appli : pour voir (public) ou pour modifier (avec le panneau en bas) */
  const grand=(e,modif,tab)=>{let o=e.querySelector(".ms2-grand");if(o)o.remove();o=document.createElement("div");o.className="ms2-grand";
    o.innerHTML=`<iframe title="Mon site en grand" src="loginail-creer/pret.html?${modif?"appli=1":"public&appli=2"}&t=${Date.now()}"></iframe><button class="ms2-x" aria-label="Fermer">×</button>`;e.appendChild(o);
    const f=o.querySelector("iframe");f.onload=()=>{try{if(tab){const bt=f.contentDocument.querySelector('[data-tab="'+tab+'"]');bt&&setTimeout(()=>bt.click(),600)}}catch(_){}};
    o.querySelector(".ms2-x").onclick=()=>ferme(e)};
  const ferme=e=>{const o=e.querySelector(".ms2-grand");if(o)o.remove();rafraichit();document.querySelectorAll('.vue[data-p="si"]').forEach(vu=>{const y=vu.scrollTop;vu.innerHTML=PAGE();vu.scrollTop=y})};
  addEventListener("message",m=>{if(m.data==="loginail-site-enregistre"){document.querySelectorAll(".ecran").forEach(ferme);try{dit("Mon site est à jour ✓")}catch(_){}}});
  st.textContent+=`.ms2-grand{position:absolute;inset:0;z-index:95;background:#F6F3EF;animation:monte .3s both}.ms2-grand iframe{width:100%;height:100%;border:0;display:block}
.ms2-x{position:absolute;top:14px;right:14px;z-index:2;width:38px;height:38px;border-radius:50%;border:0;background:rgba(30,28,27,.82);color:#fff;font-size:22px;line-height:38px;padding:0;cursor:pointer}`;
  document.addEventListener("click",ev=>{const gg=ev.target.closest('[data-ms2="grand"],[data-ms2="voir"]');if(gg){ev.stopPropagation();grand(gg.closest(".ecran"),gg.dataset.ms2==="grand",gg.dataset.v);return}
    const x=ev.target.closest("[data-ms2]");if(!x)return;ev.stopPropagation();const k=x.dataset.ms2,v=x.dataset.v,b=lit();
    if(k==="univ"){const u=UNIV[+v],q=new URLSearchParams(u[1]);b.style=+q.get("style");b.epure=false;b.coffin=false;b.couleur=q.get("couleur");b.mode=q.get("mode");b.fond=q.get("fond")||"";b.police=q.get("police");b.paillettes=q.get("paillettes");b.charms=(q.get("charm")||"").split(",").filter(Boolean);b.univers=u[0];b._charmsU=b.charms.slice()}
    else if(k==="style"){const f=+v;b.style=f>3?1:f;b.epure=f===4;b.coffin=f===5}else if(k==="charmsoui"){if(v==="1"){b.charms=(b._charmsU&&b._charmsU.length?b._charmsU:["etoileargent","perle","noeudperle"]).slice()}else{if(b.charms&&b.charms.length)b._charmsU=b.charms.slice();b.charms=[]}}
    else b[k]=v;
    if(k!=="univ"&&k!=="charmsoui")b.univers="";
    ecrit(b);const g=x.parentElement;g.querySelectorAll("[data-ms2]").forEach(y=>y.classList.toggle("on",y===x));
    rafraichit();
    /* la page Mon site en dessous se met à jour */
    document.querySelectorAll('.vue[data-p="si"]').forEach(vu=>{const y=vu.scrollTop;vu.innerHTML=PAGE();vu.scrollTop=y});
    if(k==="univ"){document.querySelectorAll('[data-ms2]').forEach(y=>{const kk=y.dataset.ms2,vv=y.dataset.v;const on=kk==="univ"?vv===v:kk==="style"?+vv===forme(b):kk==="couleur"?vv===b.couleur:kk==="mode"?vv===(b.mode||"jour"):kk==="fond"?vv===(b.fond||""):kk==="police"?vv===b.police:kk==="paillettes"?vv===b.paillettes:kk==="charmsoui"?(vv==="1")===!!(b.charms||[]).length:y.classList.contains("on");y.classList.toggle("on",on)})}
  },true);
})();
