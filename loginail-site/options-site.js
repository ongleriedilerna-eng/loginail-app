/* 06/11 (Marie) : options du site de la prothésiste — l'écriture du NOM (seulement le nom) et les paillettes au toucher.
   Utilisé par la page d'essai (idees-options.html) et par ses vrais sites (pret.html : &police=…&paillettes=…).
   05/11 : toutes les polices sont hébergées chez nous (polices-sites.css) : plus aucun appel à Google. */
(function(){
var base=((document.currentScript&&document.currentScript.src)||"").replace(/[^/]*$/,"");
/* [code, nom affiché, famille, taille (× la taille normale), source] */
var POLICES=[
 ["elegante","Élégante","Italiana",1,""],
 ["manuscrite","Manuscrite","'Great Vibes'",1.15,"Great+Vibes"],
 ["ronde","Ronde","'Bagel Fat One'",.8,"loc:BagelFatOne-400-latin"],
 ["retro","Rétro","'Abril Fatface'",.82,"Abril+Fatface"],
 ["calligraphie","Calligraphie","'Pinyon Script'",1.05,"Pinyon+Script"],
 ["parisienne","Parisienne","Parisienne",1.05,"Parisienne"],
 ["chic","Chic","'Playfair Display'",.88,"Playfair+Display:wght@500"],
 ["luxe","Luxe","Cinzel",.78,"Cinzel:wght@500"],
 ["surf","Années 60","Pacifico",.85,"Pacifico"],
 ["seventies","Seventies","Shrikhand",.82,"Shrikhand"],
 ["bulle","Bulle","'Rubik Bubbles'",.85,"Rubik+Bubbles"],
 ["bonbon","Bonbon","'Cherry Bomb One'",.85,"Cherry+Bomb+One"],
 ["y2k","Y2K","Monoton",.72,"Monoton"],
 ["gothique","Gothique","UnifrakturMaguntia",.95,"UnifrakturMaguntia"],
 ["feutre","Feutre","'Permanent Marker'",.85,"loc:PermanentMarker-400-latin"],
 ["moderne","Moderne","Jost",.9,""]];
var charge=false;
function polices(doc){doc=doc||document;if(doc.__polOpt)return;doc.__polOpt=1;
  var g=POLICES.filter(function(p){return p[4]&&p[4].indexOf("loc:")<0}).map(function(p){return "family="+p[4]}).join("&");
  var l=doc.createElement("link");l.rel="stylesheet";l.href=base+"polices-sites.css";doc.head.appendChild(l);
  var st=doc.createElement("style");st.textContent=POLICES.filter(function(p){return p[4].indexOf("loc:")==0}).map(function(p){return "@font-face{font-family:"+p[2]+";font-display:swap;src:url("+base+"polices/"+p[4].slice(4)+".woff2) format('woff2')}"}).join("")
    +".pail-o{position:fixed;pointer-events:none;z-index:9999;animation:pailO 1.1s cubic-bezier(.2,.7,.3,1) forwards;filter:drop-shadow(0 0 2px rgba(255,255,255,.6))}.pail-o svg{width:100%;height:100%;display:block}"
    +"@keyframes pailO{0%{transform:translate(0,0) scale(.2) rotate(0);opacity:0}15%{opacity:1}60%{opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(1) rotate(var(--r));opacity:0}}"
    +"@media (prefers-reduced-motion:reduce){.pail-o{display:none}}";doc.head.appendChild(st)}
function trouve(code){for(var i=0;i<POLICES.length;i++)if(POLICES[i][0]==code)return POLICES[i];return null}
/* change l'écriture du nom (et seulement du nom) */
function poseNom(el,code){if(!el)return;polices(el.ownerDocument);var p=trouve(code);
  if(el.__taille==null)el.__taille=parseFloat(el.ownerDocument.defaultView.getComputedStyle(el).fontSize)||48;
  if(!p){["font-family","font-size","letter-spacing","text-transform","font-weight"].forEach(function(k){el.style.removeProperty(k)});[].forEach.call(el.querySelectorAll("*"),function(c){c.style.removeProperty("font-family");c.style.removeProperty("font-weight")});return}
  var st=el.style;st.setProperty("font-family",p[2]+",serif","important");st.setProperty("font-size",Math.round(el.__taille*p[3])+"px","important");
  st.setProperty("letter-spacing","normal","important");st.setProperty("text-transform","none","important");st.setProperty("font-weight","400","important");
  /* les lettres du nom sont dans des <span> (animation) : certains templates leur imposent une police, on la remplace aussi */
  [].forEach.call(el.querySelectorAll("*"),function(c){c.style.setProperty("font-family","inherit","important");c.style.setProperty("font-weight","inherit","important")})}

/* les paillettes : chaque sorte a ses couleurs (dégradé) ; formes : fine étoile et petit point brillant */
var PAIL={
 or:{nom:"Dorées",d:["#FFFBEA","#F8E3A6","#EBC66E","#FFF1C8"]},   /* 06/11 : doré plus lumineux, champagne (Marie) */
 argent:{nom:"Argentées",d:["#FFFFFF","#DDE1E8","#A9B0BC"]},
 nacre:{nom:"Nacrées",d:["#FFFFFF","#F6D9EC","#CDE9F2","#E8F7E6"]},
 chrome:{nom:"Chrome",d:["#FFFFFF","#EEF2F7","#C3CCD8","#FFFFFF","#AEB9C8"]},   /* 06/11 : chrome miroir clair (le foncé n'était pas beau) */
 holo:{nom:"Holographiques",d:["#FFB3E6","#B3D4FF","#B9FFE0","#FFF3B0"]},
 rose:{nom:"Roses",d:["#FFE1EA","#F7A8C0","#E26E92"]},
 cuivre:{nom:"Cuivrées",d:["#FBE0C8","#E2A06A","#A8582E"]}};
var FORMES=["M10 0Q10.6 9.4 20 10Q10.6 10.6 10 20Q9.4 10.6 0 10Q9.4 9.4 10 0Z","M10 0Q10.6 9.4 20 10Q10.6 10.6 10 20Q9.4 10.6 0 10Q9.4 9.4 10 0Z","CERCLE"];   /* 06/11 : épuré, élégant (Marie) */
var n=0;
function svgPail(sorte){var P=PAIL[sorte]||PAIL.or,id="pg"+(n++),f=FORMES[Math.floor(Math.random()*FORMES.length)];
  var g='<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1">'+P.d.map(function(c,i){return '<stop offset="'+(i/(P.d.length-1))+'" stop-color="'+c+'"/>'}).join("")+'</linearGradient></defs>';
  var forme=f=="CERCLE"?'<circle cx="10" cy="10" r="3.2" fill="url(#'+id+')"/>':'<path d="'+f+'" fill="url(#'+id+')"/>';
  return '<svg viewBox="0 0 20 20">'+g+forme+'</svg>'}
function jet(doc,x,y,k,sorte){if(!sorte||sorte=="non")return;polices(doc);for(var i=0;i<k;i++){var p=doc.createElement("i");p.className="pail-o";
  var a=Math.random()*6.28,d=10+Math.random()*22,s=5+Math.random()*8;
  p.style.cssText="left:"+(x-s/2)+"px;top:"+(y-s/2)+"px;width:"+s+"px;height:"+s+"px;--dx:"+(Math.cos(a)*d)+"px;--dy:"+(Math.sin(a)*d+10)+"px;--r:"+(Math.random()*240-120)+"deg";
  p.innerHTML=svgPail(sorte);doc.body.appendChild(p);setTimeout(p.remove.bind(p),1000)}}
/* branche les paillettes sur une zone : touche = petite gerbe, glisser = traînée */
function paillettes(zone,sorte){var doc=zone.ownerDocument,der=0;zone.__pail=sorte;if(zone.__pailOk)return;zone.__pailOk=1;
  zone.addEventListener("pointerdown",function(e){jet(doc,e.clientX,e.clientY,5,zone.__pail)},true);
  zone.addEventListener("pointermove",function(e){var t=performance.now();if(t-der<70||!(e.buttons||e.pointerType=="touch"))return;der=t;jet(doc,e.clientX,e.clientY,1,zone.__pail)},true)}
window.LOGI_OPT={POLICES:POLICES,PAIL:PAIL,poseNom:poseNom,paillettes:paillettes,polices:polices};
})();
