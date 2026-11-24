/* ===== « SMS d'anniversaire » (réécrit le 12/11, modifiable le 24/11 à la demande de Marie) : l'écran dit exactement ce que fait le serveur
   (fonction « sms », action « anniversaires ») : une fois par an, seulement aux clientes qui ont dit oui (case dans leur fiche ou cochée en réservant),
   jamais le dimanche. Le texte : celui de la pro (profils.msg_anniv, sql/39) ou, s'il est vide, celui de Loginail. ===== */
(function(){
  const DEF="Joyeux anniversaire {prénom} ! Très belle journée de la part de {salon}.";
  const salon=()=>{try{return (S.profil&&S.profil.nom_salon)||"ton salon"}catch(_){return "ton salon"}};
  const rempli=m=>m.replace(/\{pr[ée]nom\}/gi,"Léa").replace(/\{salon\}/gi,salon()).replace(/[\p{Extended_Pictographic}‍️]/gu,"").replace(/\s+/g," ").trim();   /* les émojis ne passent pas en SMS : le serveur les enlève */
  /* comme le serveur : l'expéditeur est « Loginail », donc sans le nom du salon dans le texte, on l'ajoute à la fin */
  const signe=ex=>{const s=salon();return ex&&!ex.toLowerCase().includes(s.toLowerCase())&&[...(ex+" - "+s)].length<=160?ex+" - "+s:ex};
  const compte=t=>{const r=rempli(t),n=[...r].length,ex=signe(r);return {ex,n:n>160?n:[...ex].length,trop:n>160}};
  /* 24/11 (Marie, maquette anniv-resa) : un interrupteur pour tout couper (profils.anniv_off, sql/41) ; la fonction sms le respecte */
  const coupe=()=>!!(S.profil&&S.profil.anniv_off);
  { const st=document.createElement("style");st.textContent=`#E .an-msg{transition:opacity .25s}#E .an-msg.off{opacity:.35;pointer-events:none}
#E .an-carte{display:flex;align-items:center;gap:12px;width:100%;margin:0 0 4px;padding:13px 14px;border:0;border-radius:20px;background:#fff;color:inherit;font:inherit;text-align:left;cursor:pointer}
#E .an-carte .g{flex:none;width:44px;height:44px;border-radius:50%;background:var(--v-rose,#F5E6E4);display:grid;place-items:center;font-size:22px}
#E .an-carte>div{flex:1;min-width:0}#E .an-carte b{display:block;font-weight:500;font-size:15.5px;overflow-wrap:anywhere}#E .an-carte small{display:block;font-size:13px;color:#776D64;margin-top:2px}
#E .an-carte .fl{flex:none;color:#B5AEA8}`;document.head.appendChild(st); }
  window.__annivCoupe=coupe;
  const ligne=()=>`<div class="ligne sa-ligne" data-a="ms-anniv"><div class="t">SMS d’anniversaire<span>${coupe()?"Coupés":"Aux clientes qui ont dit oui"}</span></div><span class="fl">›</span></div>`;
  MSF["ms-anniv"]=(val)=>{let n=0;try{n=S.clientes.filter(c=>c.ok_sms_anniv&&c.anniversaire).length}catch(_){}
    const m=typeof val==="string"?val:((S.profil&&S.profil.msg_anniv)||DEF),c=compte(m);
    return croix+`<h3>SMS d’anniversaire</h3><div class="sous">Le jour de son anniversaire, la cliente reçoit ce message de ta part.</div>
    <div class="liste" style="margin-top:12px"><div class="ligne"><div class="t">Envoyer les SMS d’anniversaire<span>${coupe()?"Personne ne reçoit de SMS d’anniversaire":"Seulement aux clientes qui ont dit oui, jamais le dimanche"}</span></div><button class="sw${coupe()?"":" on"}" data-an="sw" aria-label="Envoyer les SMS d’anniversaire"></button></div></div>
    <div class="an-msg${coupe()?" off":""}"><div class="lab2">Ton message</div><textarea class="rp-t" id="an-m" maxlength="200">${esc(m)}</textarea>
    <div class="rp-tags">${["{prénom}","{salon}"].map(t=>`<button type="button" data-an="tag" data-t="${t}">+ ${t==="{salon}"?"nom du salon":"prénom"}</button>`).join("")}</div>
    <div class="sous" style="font-size:12px;text-align:left;margin-top:6px">Les mots entre { } changent tout seuls : le prénom de chaque cliente, le nom de ton salon. Les émojis ne passent pas dans un SMS : ils sont enlevés.</div>
    <div class="lab2">Exemple : ce que reçoit Léa</div><div class="rp-apercu" id="an-ap">${esc(c.ex)}</div><div class="rp-n${c.trop?" trop":""}" id="an-n">${c.n} / 160 caractères${c.trop?" · trop long : raccourcis":""}</div>
    <button class="btn" data-an="ok" style="margin-top:14px"${c.trop||!m.trim()?" disabled":""}>Enregistrer</button>
    <button class="lien-t" data-an="def" style="display:block;margin:10px auto 0">Remettre le message de Loginail</button>
    <div class="sous" style="margin-top:14px;font-size:12px;text-align:left">Il part seulement aux clientes qui ont dit oui : coche « Lui envoyer un SMS pour son anniversaire » dans sa fiche (le crayon), et note sa date d’anniversaire. La loi l’impose : sans son accord, pas de SMS.</div>
    <div class="sous" style="margin-top:8px;font-size:12px;text-align:left">Aujourd’hui : ${n} cliente${n>1?"s":""} ${n>1?"le recevront":"le recevra"}. Une seule fois par an, jamais le dimanche.</div></div>`};
  const maj=()=>{const t=E.querySelector("#an-m");if(!t)return;const c=compte(t.value),ok=E.querySelector('[data-an="ok"]'),nn=E.querySelector("#an-n");
    E.querySelector("#an-ap").textContent=c.ex;nn.textContent=c.n+" / 160 caractères"+(c.trop?" · trop long : raccourcis":"");nn.classList.toggle("trop",c.trop);if(ok)ok.disabled=c.trop||!t.value.trim()};
  document.addEventListener("input",e=>{if(e.target.id==="an-m")maj()});
  document.addEventListener("click",async e=>{const t=e.target;if(!t.closest)return;const b=t.closest("[data-an]");if(!b)return;e.stopPropagation();e.preventDefault();
    if(b.dataset.an==="tag"){const ta=E.querySelector("#an-m");const i=ta.selectionStart??ta.value.length;ta.value=ta.value.slice(0,i)+b.dataset.t+ta.value.slice(ta.selectionEnd??i);ta.focus();maj();return}
    if(b.dataset.an==="def"){ouvre(MSF["ms-anniv"](DEF));return}
    if(b.dataset.an==="sw"){const off=!coupe(),v=(E.querySelector("#an-m")||{}).value;b.disabled=true;
      const {data,error}=await sb.from("profils").update({anniv_off:off}).eq("id",S.user.id).select().single();
      if(error){b.disabled=false;return dit(/anniv_off/.test(error.message||"")?"Pas encore disponible : réessaie après la mise à jour":"Oups, ça n’a pas marché. Réessaie.")}
      S.profil=data||Object.assign(S.profil||{},{anniv_off:off});const f=E.querySelector(".feuille"),y=f?f.scrollTop:0;ouvre(MSF["ms-anniv"](v));if(f)f.scrollTop=y;rendu();dit(off?"SMS d’anniversaire coupés":"SMS d’anniversaire activés ✓");return}
    if(b.dataset.an==="ok"){const v=E.querySelector("#an-m").value.replace(/\s+/g," ").trim();b.disabled=true;
      const {data,error}=await sb.from("profils").update({msg_anniv:v===DEF?null:v}).eq("id",S.user.id).select().single();
      if(error){b.disabled=false;return dit("Oups, ça n’a pas marché. Réessaie.")}S.profil=data;ferme();dit("Ton message d’anniversaire est enregistré ✓")}},true);
  const ajoute=()=>document.querySelectorAll('.vue[data-p="re"]').forEach(v=>{if(v.querySelector(".sa-ligne"))return;const k=[...v.querySelectorAll(".k")].find(x=>/SMS à mes clientes/.test(x.textContent));if(!k)return;
    const l=k.nextElementSibling;if(l&&l.classList.contains("liste"))l.insertAdjacentHTML("beforeend",ligne())});
  new MutationObserver(ajoute).observe(document.body,{childList:true,subtree:true});setTimeout(ajoute,600);
})();
