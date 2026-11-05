/* 06/11 : les ronds de fonds = le fond entier (170×220) réduit à la taille du rond, centré */
window.__ajusteRonds=z=>{(z||document).querySelectorAll(".rond-f").forEach(r=>{const w=r.clientWidth||r.parentElement.clientWidth;if(!w)return;const f=r.querySelector(".f100");if(!f)return;const k=w/170;
  f.style.cssText="position:absolute;left:0;top:"+(-(220*k-w)/2)+"px;width:170px;height:220px;transform:scale("+k+");transform-origin:0 0";const t=f.querySelector(".tuile");if(t)t.style.cssText+=";width:170px!important;height:220px!important;border-radius:0!important"})};
