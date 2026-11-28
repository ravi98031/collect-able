/* components.js
   SHARED PIECES: countdown, product card, newsletter box, Instagram section.
   Keep the file names and the load order in index.html. */

/* ---------- shared pieces ---------- */
function countdownHTML(id){ return `<div class="count" data-count="${id}"><div><b>00</b><span>Days</span></div><div><b>00</b><span>Hrs</span></div><div><b>00</b><span>Min</span></div><div><b>00</b><span>Sec</span></div></div>`; }
function tickCountdowns(){
  let d = Math.max(0, DROP_AT - Date.now());
  const parts = [Math.floor(d/864e5), Math.floor(d/36e5)%24, Math.floor(d/6e4)%60, Math.floor(d/1e3)%60];
  document.querySelectorAll("[data-count]").forEach(el=>{
    el.querySelectorAll("b").forEach((b,i)=> b.textContent = String(parts[i]).padStart(2,"0"));
  });
}
setInterval(tickCountdowns, 1000);

function card(p){
  const badges = [];
  if(p.drop) badges.push(`<span class="sticker">${isDropLocked(p)?"Drops 25 Dec":DROP_NAME}</span>`);
  else if(p.tag) badges.push(`<span class="sticker ${p.tag==="New"?"bone":""}">${p.tag}</span>`);
  return `<a class="card" href="#p-${p.id}">
    <div class="art bg-${p.bg}">${artFor(p)}<div class="badges">${badges.join("")}</div></div>
    <div class="info"><span class="mono">${catOf(p.cat).name}</span>
      <div class="row"><span class="name">${p.name}</span><span class="price">${inr(p.price)}</span></div>
    </div></a>`;
}
function newsletter(){
  return `<div class="sec"><div class="news">
    <div><span class="sticker">Inner circle</span><h2 style="margin-top:14px">Get drops first</h2><p class="note" style="font-size:15px">Early access to every drop, restock alerts and members-only codes. No spam.</p></div>
    <div><form id="newsForm" novalidate><input id="newsEmail" type="email" placeholder="you@gmail.com" aria-label="Email address"><button class="btn red" type="submit">Join</button></form><p class="note" id="newsMsg"></p></div>
  </div></div>`;
}
function igSection(){
  const items = PRODUCTS.length ? [3,4,8,11,14,1].map(i=>PRODUCTS[i]||PRODUCTS[i%PRODUCTS.length]) : [];
  return `<div class="sec"><div class="sec-head"><div><span class="mono">On the gram</span><h2>@${INSTA}</h2></div><a class="btn ghost" href="https://instagram.com/${INSTA}" target="_blank" rel="noopener">Follow us</a></div>
  <div class="ig">${items.map((p,i)=>`<a href="https://instagram.com/${INSTA}" target="_blank" rel="noopener" class="bg-${(i+1)%4}" aria-label="Open Instagram">${artFor(p)}<span class="tag">#collectable</span></a>`).join("")}</div></div>`;
}
