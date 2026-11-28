/* behaviour.js
   BEHAVIOUR: buttons and forms on each page (filters, quantity, checkout, login) and the page router.
   Keep the file names and the load order in index.html. */

/* ---------- view behaviour ---------- */
let shopState = {cat:"all", size:"", price:"", sort:"feat"};

function bindShop(){
  const grid = document.getElementById("shopGrid");
  const render = ()=>{
    let list = PRODUCTS.filter(p=>
      (shopState.cat==="all"||p.cat===shopState.cat) &&
      (!shopState.size||p.sizes.includes(shopState.size)) &&
      (!shopState.price||(()=>{const [a,b]=shopState.price.split("-").map(Number);return p.price>=a&&p.price<=b})()));
    if(shopState.sort==="low") list.sort((a,b)=>a.price-b.price);
    if(shopState.sort==="high") list.sort((a,b)=>b.price-a.price);
    if(shopState.sort==="az") list.sort((a,b)=>a.name.localeCompare(b.name));
    grid.innerHTML = list.length ? list.map(card).join("") : `<div class="empty" style="grid-column:1/-1">Nothing matches those filters. <button class="chip" id="clearF">Clear filters</button></div>`;
    document.getElementById("countLine").textContent = `Showing ${list.length} of ${PRODUCTS.length}`;
    document.querySelectorAll("#filters .chip").forEach(c=>c.classList.toggle("on", c.dataset.f===shopState.cat));
    const cl = document.getElementById("clearF"); if(cl) cl.onclick=()=>{shopState={cat:"all",size:"",price:"",sort:shopState.sort};syncSel();render();};
  };
  const syncSel = ()=>{ sizeSel.value=shopState.size; priceSel.value=shopState.price; sortSel.value=shopState.sort; };
  document.getElementById("filters").onclick = e=>{ const b=e.target.closest(".chip"); if(!b) return; shopState.cat=b.dataset.f; render(); };
  const sizeSel=document.getElementById("sizeSel"), priceSel=document.getElementById("priceSel"), sortSel=document.getElementById("sortSel");
  sizeSel.onchange=()=>{shopState.size=sizeSel.value;render();};
  priceSel.onchange=()=>{shopState.price=priceSel.value;render();};
  sortSel.onchange=()=>{shopState.sort=sortSel.value;render();};
  syncSel(); render();
}

function bindProduct(id){
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  let size = p.sizes.length===1 ? p.sizes[0] : null, qty = 0;
  const err = document.getElementById("sizeErr");
  const picked = document.getElementById("sizePicked");
  if(size) picked.textContent = "· " + size;
  document.getElementById("sizes").onclick = e=>{
    const b=e.target.closest(".size"); if(!b) return;
    size=b.dataset.s; err.hidden=true; picked.textContent="· "+size;
    document.querySelectorAll("#sizes .size").forEach(x=>x.classList.toggle("on",x===b));
  };
  const qv=document.getElementById("qVal");
  const qm=document.getElementById("qMinus"), qp=document.getElementById("qPlus");
  const syncQ=()=>{ qv.textContent=qty; qm.style.opacity=qty<=0?".4":"1"; qp.style.opacity=qty>=10?".4":"1"; if(qty>0 && err.textContent.startsWith("Quantity")) err.hidden=true; };
  qm.onclick=()=>{ qty=Math.max(0,qty-1); syncQ(); };
  qp.onclick=()=>{ qty=Math.min(10,qty+1); syncQ(); };
  syncQ();
  const need=()=>{ if(!size){ err.hidden=false; err.textContent="Please pick a size first"; const z=document.getElementById("sizes"); z.classList.remove("shake"); void z.offsetWidth; z.classList.add("shake"); z.scrollIntoView({block:"center",behavior:"smooth"}); return false; } if(qty<1){ err.hidden=false; err.textContent="Quantity is 0. Press + to add items"; return false; } return true; };
  const add=document.getElementById("addBtn"), buy=document.getElementById("buyBtn");
  if(add) add.onclick=()=>{
    if(!need()) return;
    addToCart(p.id,size,qty);
    add.textContent="Added to cart ✓"; add.classList.add("added"); clearTimeout(add._t);
    add._t=setTimeout(()=>{ add.textContent="Add to cart"; add.classList.remove("added"); },1800);
    let n=document.getElementById("addedNote");
    if(!n){ n=document.createElement("p"); n.id="addedNote"; n.className="note ok"; n.style.marginTop="12px"; document.querySelector(".buy-row").after(n); }
    n.innerHTML='Added to your cart. <a class="red" href="#cart">View cart</a>';
  };
  if(buy) buy.onclick=()=>{ if(need()){ addToCart(p.id,size,qty); location.hash="#cart"; } };
  const nb=document.getElementById("notifyBtn");
  if(nb) nb.onclick=(e)=>{ e.preventDefault(); location.hash="#drop"; setTimeout(()=>{const f=document.getElementById("newsEmail"); if(f){f.scrollIntoView({block:"center"}); f.focus();}},60); };
}

function renderCart(){
  const body = document.getElementById("cartBody"); if(!body) return;
  const lines = cart.map(l=>({...l, p:PRODUCTS.find(p=>p.id===l.id)})).filter(l=>l.p);
  if(!lines.length){
    body.innerHTML = `<div class="empty"><h3 style="color:var(--bone);margin-bottom:10px">Your cart is empty</h3><p>Pick something worth keeping.</p><a class="btn red" style="margin-top:20px" href="#shop">Start shopping</a></div>`;
    return;
  }
  const sub = lines.reduce((s,l)=>s+l.p.price*l.qty,0);
  const ship = sub>FREE_SHIP?0:SHIP_FEE;
  const left = Math.max(0, FREE_SHIP + 1 - sub);
  body.innerHTML = `<div class="cart-layout">
    <div>${lines.map((l,i)=>`<div class="line">
      <a class="thumb bg-${l.p.bg}" href="#p-${l.p.id}">${artFor(l.p)}</a>
      <div class="meta"><span class="mono">${catOf(l.p.cat).name} · ${l.size}</span><div style="font-weight:600;margin-top:2px">${l.p.name}</div><div class="price" style="margin-top:4px">${inr(l.p.price)}</div></div>
      <div class="act"><div class="qty"><button data-q="-1" data-i="${i}" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="1" data-i="${i}" aria-label="Increase">+</button></div><button class="rm" data-rm="${i}">Remove</button></div>
    </div>`).join("")}</div>
    <aside class="summary">
      <h3>Order summary</h3>
      <div style="margin:14px 0 6px;font-size:13px;color:var(--mute)">${ship===0?`<span class="ok">You've unlocked free shipping</span>`:`Add ${inr(left)} more for free shipping`}</div>
      <div class="progress"><i style="width:${Math.min(100,Math.round(sub/FREE_SHIP*100))}%"></i></div>
      <div class="sum-row"><span>Subtotal</span><span>${inr(sub)}</span></div>
      <div class="sum-row"><span>Shipping</span><span>${ship?inr(ship):"Free"}</span></div>
      <div class="sum-row total"><span>Total</span><span>${inr(sub+ship)}</span></div>
      <p class="note">Inclusive of all taxes · Delivery in 7–10 days</p>
      <form class="form-grid" id="checkoutForm" novalidate>
        <label class="full">Full name<input id="coName" autocomplete="name"></label>
        <label>Phone<input id="coPhone" inputmode="numeric" autocomplete="tel" placeholder="10-digit mobile"></label>
        <label>Email<input id="coEmail" type="email" autocomplete="email"></label>
        <label class="full">Address<textarea id="coAddr" rows="2" autocomplete="street-address"></textarea></label>
        <label>City<input id="coCity" autocomplete="address-level2"></label>
        <label>PIN code<input id="coPin" inputmode="numeric" autocomplete="postal-code"></label>
        <p class="err full" id="coErr" hidden></p>
        <button class="btn red full" type="submit">Pay ${inr(sub+ship)} with Razorpay</button>
      </form>
      <div id="payNote"></div>
    </aside>
  </div>`;
  body.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{ const l=cart[+b.dataset.i]; const n=l.qty+ +b.dataset.q; if(n<1){ cart.splice(+b.dataset.i,1); } else { l.qty=Math.min(10,n); } saveCart(); renderCart(); });
  body.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{ cart.splice(+b.dataset.rm,1); saveCart(); renderCart(); });
  document.getElementById("checkoutForm").onsubmit = e=>{
    e.preventDefault();
    const v = id=>document.getElementById(id).value.trim();
    const err = document.getElementById("coErr");
    let msg = "";
    if(!v("coName")) msg="Enter your full name.";
    else if(!/^[6-9]\d{9}$/.test(v("coPhone"))) msg="Enter a valid 10-digit mobile number.";
    else if(!/^\S+@\S+\.\S+$/.test(v("coEmail"))) msg="Enter a valid email address.";
    else if(!v("coAddr")||!v("coCity")) msg="Enter your delivery address and city.";
    else if(!/^\d{6}$/.test(v("coPin"))) msg="Enter a 6-digit PIN code.";
    if(msg){ err.textContent=msg; err.hidden=false; return; }
    err.hidden=true;
    recordOrder(lines, sub+ship, v("coName"));
    document.getElementById("payNote").innerHTML = `<div class="pay-note"><b>Razorpay opens here on the live site.</b><br><span style="color:var(--mute)">This preview can't take real payments. In the React project, this button opens Razorpay checkout for ${inr(sub+ship)} with UPI, cards and netbanking.</span></div>`;
  };
}

function fitHero(){
  const h=document.querySelector(".hero-word"), c=document.querySelector(".hero-cta");
  if(!h||!c) return;
  h.style.fontSize="100px";
  const base=h.getBoundingClientRect().width; if(!base) return;
  const cr=c.getBoundingClientRect(); let right=cr.left;
  [...c.children].forEach(b=>{ right=Math.max(right,b.getBoundingClientRect().right); });
  const target=(right-cr.left)+24;
  h.style.fontSize=Math.max(24,Math.min(116,100*target/base))+"px";
}
window.addEventListener("resize",fitHero);
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fitHero);

function bindHome(){
  const lo=document.getElementById("logoutBtn"); if(lo) lo.onclick=()=>{ setUser(null); toast("Logged out"); route(); };
  const cats=document.getElementById("cats"); if(!cats) return;
  document.querySelectorAll("[data-scroll]").forEach(b=>b.onclick=()=>cats.scrollBy({left:+b.dataset.scroll*Math.max(240,cats.clientWidth*0.7),behavior:"smooth"}));
  let down=false,sx=0,sl=0,moved=false;
  cats.addEventListener("pointerdown",e=>{ if(e.pointerType!=="mouse") return; down=true;moved=false;sx=e.clientX;sl=cats.scrollLeft; });
  window.addEventListener("pointermove",e=>{ if(!down) return; const dx=e.clientX-sx; if(Math.abs(dx)>4){moved=true;cats.classList.add("drag");} cats.scrollLeft=sl-dx; });
  window.addEventListener("pointerup",()=>{ down=false; cats.classList.remove("drag"); });
  cats.addEventListener("click",e=>{ if(moved){ e.preventDefault(); e.stopPropagation(); moved=false; } },true);
  cats.querySelectorAll("a").forEach(a=>a.draggable=false);
}

function bindSignup(){
  const f=document.getElementById("signupForm"); if(!f) return;
  clearOnInput(f);
  if(pending){ suEmail.value=pending.email; suUser.value=pending.username; suPhone.value=pending.phone; }
  f.onsubmit=async e=>{
    e.preventDefault();
    const email=suEmail.value.trim().toLowerCase(), un=suUser.value.trim().toLowerCase(), pw=suPass.value, pw2=suPass2.value, ph=suPhone.value.trim();
    let bad=false; const fail=(id,m)=>{fieldErr(id,m);bad=true;};
    if(!/^\S+@\S+\.\S+$/.test(email)) fail("suEmail","Enter a valid email ID.");
    else if(accounts.some(a=>a.email===email)) fail("suEmail","An account with this email already exists. Log in instead.");
    if(!/^[a-z0-9_.]{3,20}$/.test(un)) fail("suUser","Use 3–20 letters, numbers, dots or underscores.");
    else if(accounts.some(a=>a.username===un)) fail("suUser","That username is taken. Try another.");
    if(pw.length<8||!/[a-z]/i.test(pw)||!/\d/.test(pw)) fail("suPass","Use at least 8 characters, with a letter and a number.");
    if(pw2!==pw) fail("suPass2","Passwords don't match.");
    if(!/^[6-9]\d{9}$/.test(ph)) fail("suPhone","Enter a valid 10-digit mobile number.");
    else if(accounts.some(a=>a.phone===ph)) fail("suPhone","This number is already registered.");
    if(bad) return;
    pending={email,username:un,phone:ph,pass:await hash(pw),emailCode:newCode(),phoneCode:newCode()};
    location.hash="#verify";
  };
}
function bindVerify(){
  const f=document.getElementById("verifyForm"); if(!f||!pending) return;
  clearOnInput(f);
  startResend("resendEmail"); startResend("resendPhone");
  resendEmail.onclick=()=>{ pending.emailCode=newCode(); demoEmail.textContent=pending.emailCode; toast("New email code sent"); startResend("resendEmail"); };
  resendPhone.onclick=()=>{ pending.phoneCode=newCode(); demoPhone.textContent=pending.phoneCode; toast("New mobile code sent"); startResend("resendPhone"); };
  f.onsubmit=e=>{
    e.preventDefault();
    let bad=false;
    if(vEmail.value.trim()!==pending.emailCode){ fieldErr("vEmail", /^\d{6}$/.test(vEmail.value.trim())?"That email code isn't right.":"Enter the 6-digit email code."); bad=true; }
    if(vPhone.value.trim()!==pending.phoneCode){ fieldErr("vPhone", /^\d{6}$/.test(vPhone.value.trim())?"That mobile code isn't right.":"Enter the 6-digit mobile code."); bad=true; }
    if(bad) return;
    const acct={email:pending.email,username:pending.username,phone:pending.phone,pass:pending.pass,created:Date.now()};
    accounts.push(acct); saveAccounts(); pending=null;
    setUser({email:acct.email,username:acct.username,phone:acct.phone});
    location.hash="#home"; toast("Account created. Welcome to Collectable");
  };
}
function bindLogin(){
  const pf=document.getElementById("pwForm"); if(!pf) return;
  const of=document.getElementById("otpForm");
  clearOnInput(pf); clearOnInput(of);
  tabPw.onclick=()=>{ tabPw.classList.add("on"); tabOtp.classList.remove("on"); pf.hidden=false; of.hidden=true; };
  tabOtp.onclick=()=>{ tabOtp.classList.add("on"); tabPw.classList.remove("on"); pf.hidden=true; of.hidden=false; };
  pf.onsubmit=async e=>{
    e.preventDefault();
    if(!liId.value.trim()) return fieldErr("liId","Enter your email or mobile number.");
    if(!liPass.value) return fieldErr("liPass","Enter your password.");
    const a=findAcct(liId.value);
    if(!a||a.pass!==await hash(liPass.value)) return fieldErr("liPass","Those details don't match an account.");
    setUser({email:a.email,username:a.username,phone:a.phone}); location.hash="#home"; toast("Logged in");
  };
  const send=()=>{
    const v=loId.value.trim().toLowerCase(), isPhone=/^(\+?91)?[6-9]\d{9}$/.test(v.replace(/\s/g,""));
    if(!isPhone && !/^\S+@\S+\.\S+$/.test(v)) { fieldErr("loId","Enter a valid email or 10-digit mobile number."); return false; }
    const a=findAcct(v.replace(/\s/g,""));
    if(!a){ fieldErr("loId","No account found. Sign up first."); return false; }
    loginOtp={acct:a,code:newCode(),via:isPhone?"mobile":"email"};
    loDemo.innerHTML=`Preview mode: no real ${loginOtp.via==="mobile"?"SMS":"email"} is sent. Your code is <b>${loginOtp.code}</b>`;
    loCodeWrap.hidden=false; otpSubmit.textContent="Verify and log in"; startResend("loResend"); loCode.focus();
    return true;
  };
  loResend.onclick=()=>{ if(send()) toast("New code sent"); };
  of.onsubmit=e=>{
    e.preventDefault();
    if(loCodeWrap.hidden||!loginOtp){ send(); return; }
    if(loCode.value.trim()!==loginOtp.code) return fieldErr("loCode","That code isn't right.");
    const a=loginOtp.acct; loginOtp=null;
    setUser({email:a.email,username:a.username,phone:a.phone}); location.hash="#home"; toast("Logged in");
  };
  loId.addEventListener("input",()=>{ loCodeWrap.hidden=true; otpSubmit.textContent="Send code"; loginOtp=null; });
}

function bindProfile(){
  const f=document.getElementById("nameForm");
  if(f) f.onsubmit=e=>{
    e.preventDefault();
    const n=document.getElementById("pfName").value.trim();
    if(!n){ toast("Enter your name first"); return; }
    const a=accounts.find(x=>x.email===user.email); if(a){ a.name=n; saveAccounts(); }
    setUser({...user,name:n}); toast("Name saved"); route();
  };
  const lo=document.getElementById("profLogout");
  if(lo) lo.onclick=()=>{ setUser(null); toast("Logged out"); location.hash="#home"; };
}

function bindInner(){
  const f=document.getElementById("innerForm"); if(!f) return;
  const m=document.getElementById("icMsg");
  f.onsubmit=e=>{
    e.preventDefault();
    const em=document.getElementById("icEmail").value.trim().toLowerCase();
    if(!/^\S+@\S+\.\S+$/.test(em)){ m.className="note err"; m.textContent="Enter a valid email address."; return; }
    let list=[]; try{ list=JSON.parse(localStorage.getItem("collectable-inner-circle")||"[]"); if(!Array.isArray(list)) list=[]; }catch(err){ list=[]; }
    const had=list.includes(em);
    if(!had){ list.push(em); try{ localStorage.setItem("collectable-inner-circle",JSON.stringify(list)); }catch(err){} }
    m.className="note ok"; m.textContent=had?"You're already in the inner circle.":"You're in. We'll email you the moment the drop goes live.";
  };
}

function bindCommon(){
  document.querySelectorAll("[data-cat]").forEach(a=>a.addEventListener("click",()=>{ shopState.cat=a.dataset.cat; }));
  const nf=document.getElementById("newsForm");
  if(nf) nf.onsubmit=e=>{
    e.preventDefault();
    const em=document.getElementById("newsEmail").value.trim(), m=document.getElementById("newsMsg");
    if(!/^\S+@\S+\.\S+$/.test(em)){ m.className="note err"; m.textContent="Enter a valid email address."; return; }
    m.className="note ok"; m.textContent="You're on the list. Watch your inbox before 25 December.";
    nf.reset();
  };
  const cf=document.getElementById("contactForm");
  if(cf) cf.onsubmit=e=>{
    e.preventDefault();
    const n=document.getElementById("cName").value.trim(), o=document.getElementById("cOrder").value.trim(), msg=document.getElementById("cMsg").value.trim(), out=document.getElementById("contactMsg");
    if(!msg){ out.className="note err"; out.textContent="Write a message first."; return; }
    const text = `Hi Collectable, I'm ${n||"a customer"}.${o?` Order: ${o}.`:""} ${msg}`;
    const url = `https://wa.me/91${WHATSAPP}?text=${encodeURIComponent(text)}`;
    out.className="note"; out.innerHTML=`<a class="red" href="${url}" target="_blank" rel="noopener">Open WhatsApp with your message</a>`;
  };
  document.querySelectorAll("[data-copy]").forEach(b=>b.onclick=async()=>{
    try{ await navigator.clipboard.writeText(b.dataset.copy); b.textContent="Copied"; }
    catch(e){ const t=b.parentElement.querySelector("b"); const r=document.createRange(); r.selectNodeContents(t); const s=getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent="Selected"; }
    setTimeout(()=>b.textContent="Copy",1600);
  });
}

function route(){
  const h = (location.hash||"#home").slice(1) || "home";
  const app = document.getElementById("app");
  let key = h, arg;
  if(h.startsWith("p-")){ key="product"; arg=h.slice(2); }
  if(!views[key]) key="home";
  if(user && (key==="signup"||key==="login"||key==="verify")) key="home";
  if(!user && key==="profile") key="login";
  app.innerHTML = `<section class="view">${views[key](arg)}</section>`;
  if(key==="shop") bindShop();
  if(key==="product") bindProduct(arg);
  if(key==="cart") renderCart();
  if(key==="home"){ bindHome(); fitHero(); }
  if(key==="signup") bindSignup();
  if(key==="verify") bindVerify();
  if(key==="login") bindLogin();
  if(key==="profile") bindProfile();
  if(key==="inner") bindInner();
  updateProfileUI();
  bindCommon();
  tickCountdowns();
  document.querySelectorAll("[data-nav]").forEach(a=>a.classList.toggle("on", a.dataset.nav===key));
  document.getElementById("links").classList.remove("open");
  document.getElementById("menuBtn").setAttribute("aria-expanded","false");
  window.scrollTo(0,0);
}
