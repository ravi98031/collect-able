/* cart.js
   CART + ORDERS + PROFILE: cart saving, order history, add to cart, pop-up message.
   Keep the file names and the load order in index.html. */

/* ---------- cart (saved on this device) ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("collectable-cart") || "[]"); if(!Array.isArray(cart)) cart = []; } catch(e){ cart = []; }
function saveCart(){ try{ localStorage.setItem("collectable-cart", JSON.stringify(cart)); }catch(e){} updateCount(); }
function updateCount(){ const c=document.getElementById("cartCount"); c.textContent = cart.reduce((s,l)=>s+l.qty,0); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }

/* ---------- profile + purchase history (saved on this device) ---------- */
function updateProfileUI(){
  const pn=document.getElementById("profName"), pl=document.querySelector("#navProfile span");
  const label = user ? (user.name||user.username) : "";
  if(pn) pn.textContent = label;
  if(pl) pl.textContent = label || "Profile";
}
function getOrders(){
  try{ const all=JSON.parse(localStorage.getItem("collectable-orders")||"{}"); return (user && Array.isArray(all[user.email])) ? all[user.email] : []; }catch(e){ return []; }
}
function recordOrder(lines,total,name){
  if(!user) return;
  const items=lines.map(l=>({name:l.p.name,size:l.size,qty:l.qty,price:l.p.price}));
  const sig=JSON.stringify([items,total]);
  try{
    const all=JSON.parse(localStorage.getItem("collectable-orders")||"{}");
    const list=Array.isArray(all[user.email])?all[user.email]:[];
    if(!(list[0]&&list[0].sig===sig)) list.unshift({id:"CL"+String(Date.now()).slice(-7),date:Date.now(),items,total,sig,status:"Awaiting payment (preview)"});
    all[user.email]=list; localStorage.setItem("collectable-orders",JSON.stringify(all));
  }catch(e){}
  const a=accounts.find(x=>x.email===user.email);
  if(a&&!a.name&&name){ a.name=name; saveAccounts(); setUser({...user,name}); }
}
function addToCart(id,size,qty){
  const ex = cart.find(l=>l.id===id && l.size===size);
  if(ex) ex.qty += qty; else cart.push({id,size,qty});
  saveCart(); toast("Added to cart");
}
let toastT;
function toast(msg){ const t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove("show"),2200); }
