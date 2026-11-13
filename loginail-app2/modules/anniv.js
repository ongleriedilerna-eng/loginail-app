/* ===== « SMS d'anniversaire » (réécrit le 12/11) : l'écran dit exactement ce que fait le serveur (fonction « sms », action « anniversaires ») :
   un texte fixe, une fois par an, seulement aux clientes qui ont dit oui (case dans leur fiche ou cochée en réservant), jamais le dimanche. ===== */
(function(){
  const salon=()=>{try{return (S.profil&&S.profil.nom_salon)||"votre salon"}catch(_){return "votre salon"}};
  const ligne=()=>`<div class="ligne sa-ligne" data-a="ms-anniv"><div class="t">SMS d’anniversaire<span>Aux clientes qui ont dit oui</span></div><span class="fl">›</span></div>`;
  MSF["ms-anniv"]=()=>{let n=0;try{n=S.clientes.filter(c=>c.ok_sms_anniv&&c.anniversaire).length}catch(_){}
    return croix+`<h3>SMS d’anniversaire</h3><div class="sous">Le jour de son anniversaire, la cliente reçoit ce message de votre part.</div>
    <div class="lab" style="margin-top:14px">Le message</div><div class="blanche" style="font-size:13.5px;line-height:1.5;padding:12px 14px;text-align:left">Joyeux anniversaire Léa ! Très belle journée de la part de ${String(salon()).replace(/</g,"&lt;")}.</div><div class="sous" style="margin-top:6px;font-size:12px;text-align:left">« Léa » est un exemple : chaque cliente reçoit le message avec <b>son propre prénom</b>.</div>
    <div class="sous" style="margin-top:10px;font-size:12px;text-align:left">Il part seulement aux clientes qui ont dit oui : cochez « Lui envoyer un SMS pour son anniversaire » dans sa fiche (le crayon), et notez sa date d’anniversaire. La loi l’impose : sans son accord, pas de SMS.</div>
    <div class="sous" style="margin-top:8px;font-size:12px;text-align:left">Aujourd’hui : ${n} cliente${n>1?"s":""} ${n>1?"le recevront":"le recevra"}. Une seule fois par an, jamais le dimanche.</div>`};
  const ajoute=()=>document.querySelectorAll('.vue[data-p="re"]').forEach(v=>{if(v.querySelector(".sa-ligne"))return;const k=[...v.querySelectorAll(".k")].find(x=>/SMS à mes clientes/.test(x.textContent));if(!k)return;
    const l=k.nextElementSibling;if(l&&l.classList.contains("liste"))l.insertAdjacentHTML("beforeend",ligne())});
  new MutationObserver(ajoute).observe(document.body,{childList:true,subtree:true});setTimeout(ajoute,600);
})();
