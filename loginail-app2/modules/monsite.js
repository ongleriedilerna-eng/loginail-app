/* ===== 06/11 (Marie) « Mon site » v2 : son VRAI site en petit en haut, et tout se change depuis l'appli (univers, forme, couleur, fond, écriture, paillettes, charms) ===== */
(function(){
  /* 06/11 : mode DÉMO (?demo, page d'accueil) : on essaie tout, le site change en direct, RIEN n'est enregistré chez la visiteuse */
  const DEMO=/[?&]demo/.test(location.search);
  let MEM={nom:"Dilerna",style:1,couleur:"rose",mode:"jour",fond:"Rose coquette",police:"bonbon",paillettes:"nacre",charms:["ceriseruban","fraiseperle","noeudgelee","fleurgelee"],univers:"Mignon"};
  if(DEMO)document.documentElement.classList.add("demo-ms");
  const lit=()=>{if(DEMO)return JSON.parse(JSON.stringify(MEM));try{return JSON.parse(localStorage.getItem("loginail-brouillon"))||{}}catch(_){return {}}};
  const ecrit=b=>{if(DEMO){MEM=b;return}try{localStorage.setItem("loginail-brouillon",JSON.stringify(b))}catch(_){}};
  const UNIV=[["Gothique","style=1&couleur=noir&mode=nuit&fond=&police=gothique&paillettes=argent&charm=araignee,croixgothique,lunegothique,vitrail,clegothique,chauvesouris"],
   ["Bohème","style=2&couleur=peche&mode=jour&fond=Soleils sur terracotta&police=seventies&paillettes=or&charm=soleilvisage,lunesoleil,coeursoleil,soleil,papillondore"],
   ["Y2K","style=2&couleur=lilas&mode=jour&fond=Reflets disco&police=y2k&paillettes=holo&charm=coeurlilas,planete,oursonlilas,etoilelilas,martien,coeurchrome"],
   ["Mignon","style=1&couleur=rose&mode=jour&fond=Rose coquette&police=bonbon&paillettes=nacre&charm=ceriseruban,fraiseperle,noeudgelee,fleurgelee"],
   ["Clean","style=1&couleur=lin&mode=jour&fond=&police=chic&paillettes=nacre&charm="],
   ["Baddie","style=1&couleur=noir&mode=nuit&fond=Zèbre&police=retro&paillettes=or&charm=levres,coeurleopard,coeurzebre,cerisesbordeaux"]];
  const COUL=[["noir","#1E1C1B"],["choco","#4A3226"],["marine","#24344F"],["taupe","#5E5149"],["greige","#BDB3A8"],["sable","#C9A97E"],["peche","#E2C3AF"],["sauge","#9EA791"],["lin","#CFC4B3"],["nude","#D9B8A9"],["rose","#EBC3CC"],["bleup","#B9CCE0"],["lilas","#D5C8EC"],["jaune","#F3E3A0"],["menthe","#BFE3D4"],["abricot","#F6C9AE"],["ciel","#BCDDEE"],["rosep","#F4C6D3"],["poudre","#E9C9C4"],["framboise","#D9668A"],["lavande","#CDBDF0"],["pechep","#F9CDB3"],["corail","#F2A08F"],["cerise","#C8243A"],["bordeaux","#7A1F33"],["prune","#6E3A62"],["terracotta","#C66B4A"],["caramel","#C68A4E"],["vanille","#F4E6BE"],["olive","#8A8B4A"],["emeraude","#1F7A55"],["turquoise","#5BC2C0"],["perle","#D6D6DA"],["verttendre","#D3DEC6"],["vertdeau","#CFE6DC"],["glycine","#C9B3D6"],["lilaspoudre","#DCC8DA"],["nacre","#EED6D4"],["cremedoree","#E9D9B5"],["miel","#E3C38A"],["feuillage","#B9BC94"],["mousse","#B7C7AA"]];
  const FORMES=[[1,"Amande"],[2,"Stiletto"],[3,"Carré"],[6,"Carré arrondi"],[4,"Ovale"],[5,"Coffin"]];
  const forme=b=>b.arrondi?6:b.coffin?5:b.epure?4:(b.style||1);
  const POLF={elegante:"Italiana",manuscrite:"'Great Vibes'",ronde:"'Bagel Fat One'",retro:"'Abril Fatface'",calligraphie:"'Pinyon Script'",parisienne:"Parisienne",chic:"'Playfair Display'",luxe:"Cinzel",surf:"Pacifico",seventies:"Shrikhand",bulle:"'Rubik Bubbles'",bonbon:"'Cherry Bomb One'",y2k:"Monoton",gothique:"UnifrakturMaguntia",feutre:"'Permanent Marker'",moderne:"Jost",relief:"'Bungee Shade'",pixel:"Silkscreen",artdeco:"Fascinate",graffiti:"'Sedgwick Ave Display'",fondue:"'Climate Crisis'",cinema:"Limelight",feminine:"'Yeseva One'",pinup:"'Lily Script One'",couture:"Gloock",arrondie:"Righteous",douce:"Corben",gala:"Playball"};
  const POL=[["elegante","Élégante"],["manuscrite","Manuscrite"],["ronde","Ronde"],["retro","Rétro"],["chic","Chic"],["luxe","Luxe"],["seventies","Seventies"],["y2k","Y2K"],["bonbon","Bonbon"],["gothique","Gothique"],["relief","Relief"],["pixel","Pixel"],["artdeco","Art déco"],["graffiti","Graffiti"],["fondue","Fondue"],["cinema","Cinéma"],["feminine","Féminine"],["pinup","Pin-up"],["couture","Couture"],["arrondie","Arrondie"],["douce","Douce"],["gala","Gala"]];
  const PAIL=[["non","Sans"],["or","Dorées"],["argent","Argentées"],["nacre","Nacrées"],["holo","Holographiques"],["rose","Roses"]];
  const NOMF={1:"Amande",2:"Stiletto",3:"Carré",4:"Ovale",5:"Coffin",6:"Carré arrondi"};
  const url=()=>{if(!DEMO)return "loginail-creer/pret.html?public&appli="+Date.now();const b=lit(),q=new URLSearchParams({style:b.style||1,couleur:b.couleur||"noir",mode:b.mode||"jour",fond:b.fond||"",police:b.police||"elegante",paillettes:b.paillettes||"non",charm:(b.charms||[]).join(",")});
    return "loginail-creer/pret.html?public&exemple=dilerna&"+q.toString()+(b.epure?"&epure=1":"")+(b.coffin?"&coffin=1":"")+(b.arrondi?"&arrondi=1":"")+(b.vif?"&vif="+b.vif:"")+"&t="+Date.now()};
  const st=document.createElement("style");st.textContent=`
.ms2-apercu{position:relative;height:230px;border-radius:20px;overflow:hidden;background:#EAE5DF;margin:0 0 10px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06)}
.ms2-apercu iframe{position:absolute;left:0;top:0;width:390px;height:844px;border:0;transform-origin:0 0;pointer-events:none}
.ms2-apercu{background-size:cover;background-position:center;cursor:pointer}
.ms2-apercu iframe{display:none!important}
.ms2-apercu:after{content:"";position:absolute;inset:0;background:rgba(20,18,17,.42);pointer-events:none}
.ms2-apercu .ms2-nom{position:absolute;left:16px;right:16px;top:50%;transform:translateY(-58%);z-index:2;color:#fff;font-size:44px;line-height:1.05;text-align:center;text-shadow:0 2px 18px rgba(0,0,0,.35);overflow:hidden;text-overflow:ellipsis}
/* 09/11 (Marie) : le nom du salon, bien encadré */
.ms2-apercu .ms2-nom{left:50%!important;right:auto!important;transform:translate(-50%,-58%)!important;width:calc(100% - 44px);font-size:38px!important;padding:18px 14px 16px;border:1.5px solid rgba(255,255,255,.9);border-radius:16px;box-shadow:0 0 0 5px rgba(255,255,255,.16),0 0 0 6.5px rgba(255,255,255,.55);background:rgba(20,18,17,.18);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
/* 15/11 (Marie) : le carré ressemble au haut de SON site (plus de cadre) */
.ms2-apercu{height:auto!important;aspect-ratio:auto;background:#F6F3EF!important;background-image:none!important;padding:0;box-shadow:0 14px 30px -22px rgba(0,0,0,.45),inset 0 0 0 1px rgba(0,0,0,.06)!important}
.ms2-apercu:after{display:none!important}
.ms2-apercu .ms2-nom{display:none!important}
.ms2-apercu .ms2-photo{position:relative;height:178px;background:#ddd center/cover}
.ms2-nom2{position:absolute;left:16px;right:16px;top:139px;font-size:40px;line-height:.95;text-transform:uppercase;letter-spacing:.01em;z-index:2;pointer-events:none}
.ms2-nom2 span{display:block;position:absolute;left:0;right:0;top:0}
.ms2-nom2 .cl{color:#fff;clip-path:inset(0 0 calc(100% - 39px) 0);text-shadow:0 2px 14px rgba(0,0,0,.25)}
.ms2-nom2 .fc{color:#1E1C1B;clip-path:inset(39px 0 0 0)}
.ms2-info{padding:14px 16px 14px;margin-top:0;position:relative}
.ms2-info small{display:block;font-size:9.5px;letter-spacing:.24em;text-transform:uppercase;color:#8a8079;margin-top:30px}
.ms2-info em{display:block;font-style:normal;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#1E1C1B;margin-top:10px}
.ms2-apercu .ms2-en{position:absolute;left:0;right:0;bottom:16px;z-index:2;text-align:center;color:rgba(255,255,255,.9);font-size:10px;letter-spacing:.24em;text-transform:uppercase}
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
  const PAGE=()=>{const b=lit();return tete("Modifier mon site","En ligne")
    +`<div class="ms2-apercu" data-ms2="voir"><iframe tabindex="-1" title="Mon site"></iframe><div class="ms2-photo" style="background-image:url('${String((((b.photos||[])[b.salon!=null?b.salon:(b.principale||0)])||{}).url||"").replace(/^\.\.\//,"").replace(/'/g,"%27")}')"></div><div class="ms2-nom2" style="font-family:${POLF[b.police||"elegante"]||"Italiana"},serif"><span class="cl">${String(b.nom||"Mon salon").replace(/</g,"&lt;")}</span><span class="fc">${String(b.nom||"Mon salon").replace(/</g,"&lt;")}</span></div><div class="ms2-info"><small>Prothésiste ongulaire${b.ville?" · "+String(b.ville).replace(/</g,"&lt;"):""}</small><em>Voir mon site en grand ›</em></div></div><button class="btn" data-ms2="nouveau" data-v="perso" style="width:100%;margin:0 0 6px">Personnaliser mon site</button>`
    +'<div class="k">Mon style</div><div class="liste">'+`<div class="ligne" data-ms2="nouveau" data-v="style"><div class="t">Changer de style<span>Des sites à glisser : gardez vos coups de cœur</span></div><span class="fl">›</span></div>`+`<div class="ligne" data-ms2="nouveau" data-v="perso"><div class="t">Personnaliser<span>La forme, le fond, les couleurs, l’écriture · ${resume(b)}${b.fond?" · "+b.fond:""}</span></div><span class="fl">›</span></div>`+`<div class="ligne" data-ms2="nouveau" data-v="charms"><div class="t">Mes charms<span>${(b.stickers||[]).length?(b.stickers.length+" charms posés"):"Posez-les où vous voulez sur votre site"}</span></div><span class="fl">›</span></div></div>`
    +(DEMO?'<div class="k">Et aussi</div><div class="liste"><div class="ligne"><div class="t">Vos prix, vos photos, vos horaires, votre adresse…<span>Tout se change ici, en 2 secondes</span></div></div></div>':'')
    +(DEMO?'':'<div class="k">Mon contenu</div><div class="liste">'
    +[["Prestations et prix",(b.prestations||[]).length+" prestations","ms-presta"],["Photos de mes ongles",(b.photos||[]).filter((p,i)=>i!==b.salon).length+" photos","ms-photos"],["Photo de mon salon",(b.salon!=null&&b.photos&&b.photos[b.salon]?"Ajoutée":"Facultatif"),"ms-salon"],["Horaires","","ms-horaires"],["Adresse","","ms-adresse"],["À propos de moi","","ms-apropos"],["Ma photo",(b.quiPhoto?"Ajoutée":"Facultatif · dans « À propos de moi »"),"ms-photo"],["Bon à savoir","Acompte, retard, annulation","ms-bon"]].map(l=>`<div class="ligne" data-a="${l[2]}"><div class="t">${l[0]}${l[1]?`<span>${l[1]}</span>`:""}</div><span class="fl">›</span></div>`).join("")+'</div>'
    +'<div class="k">Faire connaître mon site</div><div class="liste">'
    +[["QR code à imprimer","Pour le salon, les cartes de visite","qr"],["Lien pour ma bio Instagram","","bio"],["Aperçu quand je partage le lien","Ce que voient les gens sur WhatsApp","apercu"]].map(l=>`<div class="ligne" data-a="${l[2]}"><div class="t">${l[0]}${l[1]?`<span>${l[1]}</span>`:""}</div><span class="fl">›</span></div>`).join("")+'</div>')};
  /* DÉMO : on touche, le site change au-dessus, tout de suite. Les univers forts en premier. */
  const ORDRE=[0,2,3,5,1,4];
  const PAGED=()=>{const b=lit();return tete("Mon site","En ligne")
    +`<div class="ms2-apercu" data-ms2="voir"><iframe tabindex="-1" title="Mon site"></iframe><span class="ms2-direct">● En direct</span></div>`
    +`<div class="ms2-d-aide">👇 Touchez, votre site change tout de suite</div>`
    +`<div class="lab">Partir d’un univers</div><div class="ms2-p ms2-univ">${ORDRE.map(i=>`<button data-ms2="univ" data-v="${i}" data-u="${UNIV[i][0]}"${UNIV[i][0]===b.univers?' class="on"':""}>${UNIV[i][0]}</button>`).join("")}</div>`
    +`<div class="lab">La forme</div><div class="ms2-p">${FORMES.map(f=>`<button data-ms2="style" data-v="${f[0]}"${f[0]===forme(b)?' class="on"':""}>${f[1]}</button>`).join("")}</div>`
    +`<div class="lab">Couleur</div><div class="ms2-dots">${COUL.slice(0,9).map(c=>`<button data-ms2="couleur" data-v="${c[0]}" style="background:${c[1]}"${c[0]===b.couleur?' class="on"':""}></button>`).join("")}</div>`
    +`<div class="ms2-dots">${COUL.slice(9).concat([]).map(c=>`<button data-ms2="couleur" data-v="${c[0]}" style="background:${c[1]}"${c[0]===b.couleur?' class="on"':""}></button>`).join("")}</div>`
    +`<div class="lab">Couleur des boutons</div><div class="ms2-dots">${[["fuchsia","#E5197E"],["orange","#FF5A14"],["electrique","#2747FF"],["cerise","#E3122C"],["violet","#8B2CF5"],["vert","#22A845"],["turquoise","#00A3A8"],["rosep","#F6C1D1"],["lilasp","#D7C6F2"],["bleup","#BDD7F2"],["mentep","#BFE8D6"],["pechep","#F9CDB3"],["jaunep","#F7E39A"],["noirb","#1E1C1B"],["chocob","#5A3A28"],["caramelb","#A8703A"],["terracottab","#BE5A38"],["bordeauxb","#7A1F33"],["framboiseb","#C8326A"],["pruneb","#6E3A62"],["sapinb","#2F5A45"],["sauged","#5E7454"],["marineb","#24344F"],["bleuroib","#2F57E8"],["moutardeb","#B8861A"],["sableb","#E6D6BC"],["nudeb","#E9C9BB"],["poudreb","#EBC9C6"],["lavandeb","#D4C6F0"],["vertdeaub","#C9E4D8"],["beurreb","#F5E6A8"],["corailb","#F4B3A3"],["perleb","#E0E0E5"],["vertdouxb","#C8DDBF"]].map(c=>`<button data-ms2="vif" data-v="${c[0]}" style="background:${c[1]}"${c[0]===b.vif?' class="on"':""}></button>`).join("")}</div>`
    +`<div class="lab">Clair ou foncé</div><div class="ms2-p"><button data-ms2="mode" data-v="jour"${b.mode!=="nuit"?' class="on"':""}>Clair</button><button data-ms2="mode" data-v="nuit"${b.mode==="nuit"?' class="on"':""}>Foncé</button></div>`
    +`<div class="lab">L’écriture du nom</div><div class="ms2-p">${POL.map(p=>`<button data-ms2="police" data-v="${p[0]}" style="font-family:${POLF[p[0]]},serif"${p[0]===(b.police||"elegante")?' class="on"':""}>${p[1]}</button>`).join("")}</div>`
    +`<div class="lab">Paillettes</div><div class="ms2-p">${PAIL.map(p=>`<button data-ms2="paillettes" data-v="${p[0]}"${p[0]===(b.paillettes||"non")?' class="on"':""}>${p[1]}</button>`).join("")}</div>`
    +`<div class="lab">Charms</div><div class="ms2-p"><button data-ms2="charmsoui" data-v="1"${(b.charms||[]).length?' class="on"':""}>Avec charms</button><button data-ms2="charmsoui" data-v="0"${(b.charms||[]).length?"":' class="on"'}>Sans charms</button></div>`
    +`<div class="ms2-d-fin">Et aussi vos prix, vos photos, vos horaires… tout se change ici, en 2 secondes.</div>`};
  if(DEMO){st.textContent+=`html.demo-ms .ms2-apercu{height:300px;background:#EAE5DF!important;cursor:pointer}
html.demo-ms .ms2-apercu iframe{display:block!important}html.demo-ms .ms2-apercu:after{display:none}
.ms2-direct{position:absolute;left:10px;top:10px;z-index:2;background:rgba(30,28,27,.78);color:#fff;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;border-radius:99px;padding:5px 9px}
.ms2-direct{animation:ms2Clign 2s ease-in-out infinite}@keyframes ms2Clign{50%{opacity:.6}}
.ms2-d-aide{text-align:center;font-size:12px;color:#6B625C;margin:2px 0 10px}
html.demo-ms .vue[data-p="si"] .lab{margin:12px 2px 6px;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#8a8076}
html.demo-ms .ms2-dots{grid-template-columns:repeat(9,1fr);margin-bottom:4px}
.ms2-univ button{font-weight:500;padding:10px 15px}
.ms2-univ button[data-u="Gothique"]{background:#1E1C1B;color:#F6F3EF;font-family:UnifrakturMaguntia,serif;font-size:15px}
.ms2-univ button[data-u="Y2K"]{background:linear-gradient(120deg,#D5C8EC,#BCDDEE,#F3C8E8);font-family:Monoton,sans-serif;font-weight:400;letter-spacing:.06em}
.ms2-univ button[data-u="Mignon"]{background:#F7D6DE;color:#B4405E;font-family:'Cherry Bomb One',sans-serif}
.ms2-univ button[data-u="Baddie"]{background:#111;color:#E9C46A;font-family:'Abril Fatface',serif;letter-spacing:.04em}
.ms2-univ button.on{box-shadow:0 0 0 2px #fff,0 0 0 4px #1E1C1B!important}
.ms2-d-fin{margin:16px 4px 26px;padding:12px 14px;border-radius:14px;background:#fff;font-size:12.5px;color:#6B625C;text-align:center}`}
  const PAGE0=PAGE;const PAGEX=DEMO?PAGED:PAGE0;
  MS.rgk=PAGEX;
  document.querySelectorAll('.ecran[data-v="rgk"] .vue[data-p="si"]').forEach(vu=>vu.innerHTML=PAGEX());
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
    o.innerHTML=`<iframe title="Mon site en grand" src="${DEMO?url():`loginail-creer/pret.html?${modif?"appli=1":"public&appli=2"}&t=${Date.now()}`}"></iframe><button class="ms2-x" aria-label="Fermer">×</button>`;e.appendChild(o);
    const f=o.querySelector("iframe");f.onload=()=>{try{if(tab){const bt=f.contentDocument.querySelector('[data-tab="'+tab+'"]');bt&&setTimeout(()=>bt.click(),600)}}catch(_){}};
    o.querySelector(".ms2-x").onclick=()=>ferme(e)};
  /* 09/11 : les pages de loginail.fr (cartes à glisser, personnalisation, présentoir) s'ouvrent par-dessus l'appli ; on leur passe le site, elles le renvoient modifié */
  const SITE=location.hostname==="app.loginail.fr"?"https://loginail.fr/":"../",SITEO=location.hostname==="app.loginail.fr"?"https://loginail.fr":location.origin;
  const ouvre=(e,v)=>{let o=e.querySelector(".ms2-grand");if(o)o.remove();o=document.createElement("div");o.className="ms2-grand";
    o.innerHTML=`<iframe title="Mon site" src="${SITE}appli-pont.html?p=${v}&t=${Date.now()}"></iframe><button class="ms2-x" aria-label="Fermer">×</button>`;e.appendChild(o);
    o.querySelector(".ms2-x").onclick=()=>ferme(e)};
  addEventListener("message",m=>{if(m.origin!==SITEO||!m.data||typeof m.data!=="object")return;
    if(m.data.loginail==="pret"){const f=[...document.querySelectorAll(".ms2-grand iframe")].find(x=>x.contentWindow===m.source);if(f)f.contentWindow.postMessage({loginail:"brouillon",br:lit()},SITEO)}
    if(m.data.loginail==="enregistre"&&m.data.br){ecrit(Object.assign(lit(),m.data.br));document.querySelectorAll(".ecran").forEach(ferme);try{dit("Mon site est à jour ✓")}catch(_){}}});
  const ferme=e=>{const o=e.querySelector(".ms2-grand");if(o)o.remove();if(DEMO)return;rafraichit();document.querySelectorAll('.vue[data-p="si"]').forEach(vu=>{const y=vu.scrollTop;vu.innerHTML=PAGE();vu.scrollTop=y})};
  addEventListener("message",m=>{if(m.data==="loginail-site-enregistre"){document.querySelectorAll(".ecran").forEach(ferme);try{dit("Mon site est à jour ✓")}catch(_){}}});
  st.textContent+=`.ms2-grand{position:absolute;inset:0;z-index:95;background:#F6F3EF;animation:monte .3s both}.ms2-grand iframe{width:100%;height:100%;border:0;display:block}
.ms2-x{position:absolute;top:14px;right:14px;z-index:2;width:38px;height:38px;border-radius:50%;border:0;background:rgba(30,28,27,.82);color:#fff;font-size:22px;line-height:38px;padding:0;cursor:pointer}`;
  document.addEventListener("click",ev=>{const nv=ev.target.closest('[data-ms2="nouveau"]');if(nv&&!DEMO){ev.stopPropagation();ouvre(nv.closest(".ecran"),nv.dataset.v);return}
    const gg=ev.target.closest('[data-ms2="grand"],[data-ms2="voir"]');if(gg){ev.stopPropagation();grand(gg.closest(".ecran"),gg.dataset.ms2==="grand",gg.dataset.v);return}
    const x=ev.target.closest("[data-ms2]");if(!x)return;ev.stopPropagation();const k=x.dataset.ms2,v=x.dataset.v,b=lit();
    if(k==="univ"){const u=UNIV[+v],q=new URLSearchParams(u[1]);b.style=+q.get("style");b.epure=false;b.coffin=false;b.arrondi=false;b.couleur=q.get("couleur");b.mode=q.get("mode");b.fond=q.get("fond")||"";b.police=q.get("police");b.paillettes=q.get("paillettes");b.charms=(q.get("charm")||"").split(",").filter(Boolean);b.univers=u[0];b._charmsU=b.charms.slice()}
    else if(k==="style"){const f=+v;b.style=f>3?1:f;b.epure=f===4;b.coffin=f===5;b.arrondi=f===6}else if(k==="charmsoui"){if(v==="1"){b.charms=(b._charmsU&&b._charmsU.length?b._charmsU:["etoileargent","perle","noeudperle"]).slice()}else{if(b.charms&&b.charms.length)b._charmsU=b.charms.slice();b.charms=[]}}
    else b[k]=v;
    if(k==="couleur")b.vif="";if(k==="vif"&&b.vif===x.dataset.v&&x.classList.contains("on")){b.vif=""}
    if(k!=="univ"&&k!=="charmsoui")b.univers="";
    ecrit(b);const g=x.parentElement;g.querySelectorAll("[data-ms2]").forEach(y=>y.classList.toggle("on",y===x));
    rafraichit();
    if(DEMO)try{parent.postMessage({loginailSite:url()},"*")}catch(_){}   /* page d'accueil : le 2e écran (le site) change aussi */
    /* la page Mon site en dessous se met à jour */
    if(!DEMO)document.querySelectorAll('.vue[data-p="si"]').forEach(vu=>{const y=vu.scrollTop;vu.innerHTML=PAGE();vu.scrollTop=y});
    if(k==="univ"){document.querySelectorAll('[data-ms2]').forEach(y=>{const kk=y.dataset.ms2,vv=y.dataset.v;const on=kk==="univ"?vv===v:kk==="style"?+vv===forme(b):kk==="couleur"?vv===b.couleur:kk==="mode"?vv===(b.mode||"jour"):kk==="fond"?vv===(b.fond||""):kk==="police"?vv===b.police:kk==="paillettes"?vv===b.paillettes:kk==="charmsoui"?(vv==="1")===!!(b.charms||[]).length:y.classList.contains("on");y.classList.toggle("on",on)})}
  },true);
})();
