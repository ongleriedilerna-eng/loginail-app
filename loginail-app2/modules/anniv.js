/* ===== 06/11 (Marie) « SMS d'anniversaire » : elle écrit elle-même son message, il part le jour de l'anniversaire de chaque cliente ===== */
(function(){
  const DEF="Joyeux anniversaire {prénom} ! 🎂 Je vous souhaite une très belle journée. À très vite au salon !";
  const lit=()=>{try{return JSON.parse(localStorage.getItem("loginail-sms-anniv"))||{on:true,texte:DEF}}catch(_){return {on:true,texte:DEF}}};
  const ecrit=o=>{try{localStorage.setItem("loginail-sms-anniv",JSON.stringify(o))}catch(_){}};
  const ligne=()=>{const o=lit();return `<div class="ligne sa-ligne" data-a="ms-anniv"><div class="t">SMS d’anniversaire<span>${o.on?"Envoyé le jour de son anniversaire":"Désactivé"}</span></div><span class="fl">›</span></div>`};
  MSF["ms-anniv"]=()=>{const o=lit();return croix+`<h3>SMS d’anniversaire</h3><div class="sous">Le jour de son anniversaire, chaque cliente reçoit votre message</div>
    <div class="liste" style="margin-top:12px"><div class="ligne"><div class="t">Envoyer le SMS d’anniversaire</div><button class="sw${o.on?" on":""}" data-sa-on></button></div></div>
    <div class="lab" style="margin-top:12px">Mon message</div><textarea class="msg" data-sa-txt style="height:110px">${o.texte.replace(/</g,"&lt;")}</textarea>
    <div class="sous" style="margin-top:6px;font-size:11.5px">{prénom} est remplacé par le prénom de la cliente. Il faut sa date d’anniversaire dans sa fiche.</div>
    <div class="sous" style="margin-top:6px;font-size:11.5px">Il part seulement aux clientes qui ont dit oui (case « anniversaire » cochée en réservant, ou dans sa fiche), et seulement si elles sont venues au salon ces 12 derniers mois. « STOP » est ajouté tout seul à la fin.</div>
    <div class="lab" style="margin-top:12px">Aperçu</div><div class="blanche" data-sa-ap style="font-size:13.5px;line-height:1.5;padding:12px 14px">${o.texte.replace(/\{prénom\}/g,"Léa").replace(/</g,"&lt;")}<span style="color:#8a8076"> · Répondez STOP pour ne plus en recevoir</span></div>
    <button class="btn" data-sa-ok style="width:100%;margin-top:12px">Enregistrer</button>`};
  const ajoute=()=>document.querySelectorAll('.vue[data-p="re"]').forEach(v=>{if(v.querySelector(".sa-ligne"))return;const k=[...v.querySelectorAll(".k")].find(x=>/SMS à mes clientes/.test(x.textContent));if(!k)return;
    const l=k.nextElementSibling;if(l&&l.classList.contains("liste"))l.insertAdjacentHTML("beforeend",ligne())});
  document.addEventListener("click",ev=>{const sw=ev.target.closest("[data-sa-on]");if(sw){ev.stopPropagation();sw.classList.toggle("on");return}
    const ok=ev.target.closest("[data-sa-ok]");if(ok){ev.stopPropagation();const z=ok.parentElement;const t=(z.querySelector("[data-sa-txt]").value||"").trim()||DEF;ecrit({on:z.querySelector("[data-sa-on]").classList.contains("on"),texte:t});
      document.querySelectorAll(".sa-ligne").forEach(x=>x.outerHTML=ligne());try{dit("SMS d’anniversaire enregistré ✓")}catch(_){}const f=z.querySelector('[data-a="fermer"]')||[...z.querySelectorAll("button")].find(b=>b.textContent.trim()==="×");f&&f.click()}},true);
  document.addEventListener("input",ev=>{const t=ev.target.closest("[data-sa-txt]");if(!t)return;const ap=t.parentElement.querySelector("[data-sa-ap]");if(ap)ap.innerHTML=t.value.replace(/\{prénom\}/g,"Léa").replace(/</g,"&lt;")+'<span style="color:#8a8076"> · Répondez STOP pour ne plus en recevoir</span>'},true);
  new MutationObserver(ajoute).observe(document.body,{childList:true,subtree:true});setTimeout(ajoute,600);
})();
