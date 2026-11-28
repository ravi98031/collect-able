/* app.js
   START-UP: menu, ticker, hover/parallax effects and the first page load. Keep this file LAST.
   Keep the file names and the load order in index.html. */

document.getElementById("menuBtn").onclick = ()=>{ const l=document.getElementById("links"); const o=l.classList.toggle("open"); document.getElementById("menuBtn").setAttribute("aria-expanded",String(o)); };
document.addEventListener("click",e=>{ const l=document.getElementById("links"); if(l.classList.contains("open") && !e.target.closest("#links,#menuBtn")){ l.classList.remove("open"); document.getElementById("menuBtn").setAttribute("aria-expanded","false"); } });
document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ document.getElementById("links").classList.remove("open"); document.getElementById("menuBtn").setAttribute("aria-expanded","false"); } });
function buildTicker(){
  const d=new Date(DROP_AT), dd=String(d.getDate()).padStart(2,"0")+"."+String(d.getMonth()+1).padStart(2,"0");
  const items=[`Free shipping over ${inr(FREE_SHIP)}`,"7-day exchange",`${DROP_NAME} drops ${dd}`,"Delivery in 7–10 days","Built to be kept","Pay with UPI, cards and netbanking"];
  document.getElementById("ticker").innerHTML=[...items,...items].map(t=>`<span>${t}</span><span>✦</span>`).join("");
}
buildTicker();
document.addEventListener("click",e=>{
  const a=e.target.closest('a[href="#home"]');
  if(a && (location.hash===""||location.hash==="#home")){
    e.preventDefault(); window.scrollTo({top:0,behavior:"smooth"});
    document.getElementById("links").classList.remove("open"); document.getElementById("menuBtn").setAttribute("aria-expanded","false");
  }
});
(function(){
  const fx=document.querySelector(".bgfx"); if(!fx||matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const o=[...fx.querySelectorAll(".o1,.o2,.o3")], k=[[-80,-60],[100,-60],[-60,80]];
  window.addEventListener("pointermove",e=>{ if(e.pointerType!=="mouse") return; const x=e.clientX/innerWidth-.5, y=e.clientY/innerHeight-.5; o.forEach((el,i)=>el.style.transform=`translate(${x*k[i][0]}px,${y*k[i][1]}px)`); });
})();
window.addEventListener("hashchange", route);
/* Loads products and settings from the database (if set up), then shows the first page */
loadFromDatabase().then(()=>{ updateCount(); route(); });
