/* views.js
   PAGES: the content of every page (home, shop, product, cart, drop, lookbook, about, FAQ, contact, profile...).
   Keep the file names and the load order in index.html. */

/* ---------- views ---------- */
const views = {
inner(){
  return `<div class="wrap"><div class="auth">
    <span class="mono red">Inner circle</span>
    <h1 style="margin-top:8px">Get the drop first</h1>
    <p class="sub">Join with your email and we'll tell you the moment ${DROP_NAME} goes live on 25.12.2026.</p>
    <form id="innerForm" novalidate>
      <div class="field"><label for="icEmail">Gmail / Email ID</label><input id="icEmail" type="email" autocomplete="email" placeholder="you@gmail.com" value="${user?esc(user.email):""}"></div>
      <button class="btn red" type="submit">Join the inner circle</button>
    </form>
    <p class="note" id="icMsg" style="margin-top:14px"></p>
    <p class="alt">Want an account for faster checkout? <a href="#signup">Sign up</a></p>
  </div></div>`;
},
profile(){
  const a=accounts.find(x=>x.email===user.email)||{};
  const nm=a.name||user.name||"";
  const fmt=t=>new Date(t).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
  const since=a.created?fmt(a.created):"-";
  const orders=getOrders();
  return `<div class="wrap">
    <div class="prof-head"><div class="avatar">${esc((nm||user.username||"?").charAt(0))}</div><div><span class="mono red">Your profile</span><h2 style="font-size:clamp(24px,4vw,40px);margin-top:6px">${esc(nm||user.username)}</h2></div></div>
    <div class="details">
      <div><span class="mono">Username</span><b>${esc(user.username)}</b></div>
      <div><span class="mono">Real name</span><b>${nm?esc(nm):"Not added yet"}</b></div>
      <div><span class="mono">Email</span><b>${esc(user.email)}</b></div>
      <div><span class="mono">Mobile</span><b>+91 ${esc(user.phone)}</b></div>
      <div><span class="mono">Member since</span><b>${since}</b></div>
    </div>
    <form class="prof-form" id="nameForm"><input id="pfName" placeholder="Your real name" autocomplete="name" value="${esc(nm)}"><button class="btn red" type="submit">${nm?"Update name":"Save name"}</button></form>
    <div class="sec-head"><h2 style="font-size:clamp(22px,3.4vw,36px)">Purchase history</h2></div>
    ${orders.length ? orders.map(o=>`<div class="order"><div class="order-top"><b>Order ${esc(o.id)}</b><span class="mono" style="color:var(--mute)">${fmt(o.date)}</span></div><ul>${o.items.map(i=>`<li>${esc(i.name)} · ${esc(i.size)} × ${i.qty} · ${inr(i.price*i.qty)}</li>`).join("")}</ul><div class="order-top" style="margin-top:12px"><span class="mono red">${esc(o.status)}</span><b>${inr(o.total)}</b></div></div>`).join("") : `<div class="empty">No purchases yet. <a class="red" href="#shop">Start shopping</a></div>`}
    <div style="margin-top:28px"><button class="btn ghost" id="profLogout">Log out</button></div>
  </div>`;
},

signup(){
  if(user) return views.home();
  return `<div class="wrap"><div class="auth">
    <span class="mono red">Join the club</span>
    <h1 style="margin-top:8px">Sign up</h1>
    <p class="sub">Create your account to check out faster and get drop alerts.</p>
    <form id="signupForm" novalidate>
      <div class="field"><label for="suEmail">Email ID</label><input id="suEmail" type="email" autocomplete="email" placeholder="you@gmail.com"><p class="err" id="suEmailErr" hidden></p></div>
      <div class="field"><label for="suUser">Username</label><input id="suUser" autocomplete="username" placeholder="ravi_27"><p class="err" id="suUserErr" hidden></p></div>
      <div class="field"><label for="suPass">Create password</label><input id="suPass" type="password" autocomplete="new-password"><span class="pw-rules">At least 8 characters, with a letter and a number</span><p class="err" id="suPassErr" hidden></p></div>
      <div class="field"><label for="suPass2">Confirm password</label><input id="suPass2" type="password" autocomplete="new-password"><p class="err" id="suPass2Err" hidden></p></div>
      <div class="field"><label for="suPhone">Mobile number</label><div class="phone"><span>+91</span><input id="suPhone" inputmode="numeric" autocomplete="tel-national" placeholder="10-digit mobile" maxlength="10"></div><p class="err" id="suPhoneErr" hidden></p></div>
      <button class="btn red" type="submit">Continue</button>
    </form>
    <p class="alt">Already have an account? <a href="#login">Log in</a></p>
  </div></div>`;
},

verify(){
  if(!pending) return `<div class="wrap"><div class="auth"><h1>Verify</h1><p class="sub">Start by filling in the sign-up form.</p><a class="btn red" href="#signup">Go to sign up</a></div></div>`;
  return `<div class="wrap"><div class="auth">
    <span class="mono red">Almost there</span>
    <h1 style="margin-top:8px">Verify your account</h1>
    <p class="sub">Enter the 6-digit codes we sent to your email and mobile.</p>
    <div class="demo">Preview mode: no real email or SMS is sent. Email code <b id="demoEmail">${pending.emailCode}</b> · Mobile code <b id="demoPhone">${pending.phoneCode}</b></div>
    <form id="verifyForm" novalidate>
      <div class="field"><label for="vEmail">Email code · ${esc(pending.email)}</label><input id="vEmail" class="otp" inputmode="numeric" maxlength="6" autocomplete="one-time-code"><div class="otp-row"><p class="err" id="vEmailErr" hidden></p><span></span><button type="button" class="link-btn" id="resendEmail">Resend code</button></div></div>
      <div class="field"><label for="vPhone">Mobile code · +91 ${esc(pending.phone)}</label><input id="vPhone" class="otp" inputmode="numeric" maxlength="6" autocomplete="one-time-code"><div class="otp-row"><p class="err" id="vPhoneErr" hidden></p><span></span><button type="button" class="link-btn" id="resendPhone">Resend code</button></div></div>
      <button class="btn red" type="submit">Verify and create account</button>
    </form>
    <p class="alt">Wrong details? <a href="#signup" id="editDetails">Go back and edit</a></p>
  </div></div>`;
},

login(){
  if(user) return views.home();
  return `<div class="wrap"><div class="auth">
    <span class="mono red">Welcome back</span>
    <h1 style="margin-top:8px">Log in</h1>
    <p class="sub">Use your password or a one-time code.</p>
    <div class="tabs" role="tablist"><button id="tabPw" class="on" role="tab">With password</button><button id="tabOtp" role="tab">With OTP</button></div>
    <form id="pwForm" novalidate>
      <div class="field"><label for="liId">Email or mobile number</label><input id="liId" autocomplete="username"><p class="err" id="liIdErr" hidden></p></div>
      <div class="field"><label for="liPass">Password</label><input id="liPass" type="password" autocomplete="current-password"><p class="err" id="liPassErr" hidden></p></div>
      <button class="btn red" type="submit">Log in</button>
    </form>
    <form id="otpForm" novalidate hidden>
      <div class="field"><label for="loId">Email or mobile number</label><input id="loId" autocomplete="username"><p class="err" id="loIdErr" hidden></p></div>
      <div id="loCodeWrap" hidden>
        <div class="demo" id="loDemo"></div>
        <div class="field"><label for="loCode">6-digit code</label><input id="loCode" class="otp" inputmode="numeric" maxlength="6" autocomplete="one-time-code"><div class="otp-row"><p class="err" id="loCodeErr" hidden></p><span></span><button type="button" class="link-btn" id="loResend">Resend code</button></div></div>
      </div>
      <button class="btn red" type="submit" id="otpSubmit">Send code</button>
    </form>
    <p class="alt">New here? <a href="#signup">Create an account</a></p>
  </div></div>`;
},

home(){
  const featured = PRODUCTS.filter(p=>!p.drop).slice(0,8);
  const dropItems = PRODUCTS.filter(p=>p.drop);
  return `
  <div class="hero${heroImg?" has-img":""}">
    <div class="hero-img" id="heroImg"${heroImg?` style="background-image:url('${heroImg}')"`:""}></div>
    <div class="grid-bg"></div>
    <div class="hero-tools wrap">
      ${user
        ? `<span class="tool-btn" style="cursor:default">Hi, ${esc(user.username)}</span><button class="tool-btn" id="logoutBtn">Log out</button>`
        : `<a class="tool-btn" href="#login">Log in</a><a class="tool-btn red-btn" href="#signup">Sign up</a>`}
    </div>
    <div class="wrap hero-inner">
      <div>
        <span class="sticker">New season · ${DROP_NAME}</span>
        <h1 class="hero-word" style="margin-top:18px"><span class="w-red">Collect</span><span class="w-white">able</span></h1>
        <div class="hero-tag"><span class="sticker bone">Built to be kept</span></div>
        <div class="hero-cta"><a class="btn red" href="#shop">Shop now</a><a class="btn ghost" href="#drop">See the drop</a></div>
      </div>
      <div class="drop-card">
        <div class="art">${art("jacket","#0f0e10")}</div>
        <div><span class="mono red">Drops 25.12.2026 · 00:00 IST</span>
        <h3 style="margin-top:6px">${DROP_NAME}</h3>
        ${countdownHTML("hero")}
        ${user ? `<a class="btn red inner-btn" href="#profile">You're in the inner circle</a>` : `<a class="btn red inner-btn" href="#inner">Sign up to the inner circle</a>`}</div>
      </div>
    </div>
  </div>
  <div class="wrap">
    <div class="sec">
      <div class="sec-head"><div><span class="mono">Browse</span><h2>Shop by category</h2></div><div class="cat-arrows"><button class="arrow" data-scroll="-1" aria-label="Scroll categories left">←</button><button class="arrow" data-scroll="1" aria-label="Scroll categories right">→</button></div></div>
      <div class="cats" id="cats">${CATS.map(c=>`<a class="cat" href="#shop" data-cat="${c.id}"><i>${art(c.art,"#f3eee8","")}</i>${c.name}</a>`).join("")}</div>
    </div>
    <div class="sec">
      <div class="sec-head"><div><span class="mono">Fresh off the press</span><h2>New in</h2></div><a class="btn ghost" href="#shop">View all</a></div>
      <div class="pgrid">${featured.map(card).join("")}</div>
    </div>
    <div class="sec" id="dropBanner">
      <div class="banner">
        <div class="ghostword">Arc</div>
        <div style="position:relative">
          <span class="mono">The next drop</span>
          <h2 style="margin-top:10px">${DROP_NAME}</h2>
          <p style="margin-top:14px;max-width:40ch">Three pieces built for cold nights: a cropped puffer, a red zip hoodie and a heavyweight tee. Limited units, no restocks.</p>
          <a class="btn" style="margin-top:22px" href="#drop">Preview the drop</a>
        </div>
        <div style="position:relative">${countdownHTML("banner")}<p class="mono" style="margin-top:12px">25 December 2026 · Midnight IST</p></div>
      </div>
    </div>
    <div class="sec">
      <div class="sec-head"><div><span class="mono">Campaign</span><h2>Lookbook</h2></div><a class="btn ghost" href="#lookbook">Open lookbook</a></div>
      <div class="pgrid">${dropItems.map(card).join("")}</div>
    </div>
    ${igSection()}
    ${newsletter()}
  </div>`;
},

shop(){
  return `<div class="wrap">
    <div class="page-head"><span class="mono red">${PRODUCTS.length} pieces</span><h1><span class="chrome">Shop</span> all</h1><p>Tees, hoodies, cargos, outerwear and more. Free shipping on orders over ${inr(FREE_SHIP)}.</p></div>
    <div class="filters" id="filters">
      <button class="chip" data-f="all">All</button>
      ${CATS.map(c=>`<button class="chip" data-f="${c.id}">${c.name}</button>`).join("")}
    </div>
    <div class="filters">
      <label class="mono" for="sizeSel" style="color:var(--mute)">Size</label>
      <select id="sizeSel"><option value="">Any</option>${[...APPAREL,...SHOES,"One size"].map(s=>`<option>${s}</option>`).join("")}</select>
      <label class="mono" for="priceSel" style="color:var(--mute)">Price</label>
      <select id="priceSel"><option value="">Any</option><option value="0-1999">Under ₹2,000</option><option value="2000-2499">₹2,000–2,499</option><option value="2500-9999">₹2,500 and up</option></select>
      <span class="spacer"></span>
      <select id="sortSel" aria-label="Sort"><option value="feat">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="az">Name A–Z</option></select>
    </div>
    <div class="count-line" id="countLine"></div>
    <div class="pgrid" id="shopGrid"></div>
  </div>`;
},

product(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return `<div class="wrap"><div class="page-head"><h1>Not found</h1><p>That product isn't here. <a href="#shop">Back to shop</a></p></div></div>`;
  const locked = isDropLocked(p);
  const related = PRODUCTS.filter(x=>x.cat===p.cat && x.id!==p.id).concat(PRODUCTS.filter(x=>x.cat!==p.cat)).slice(0,4);
  const k = p.art || catOf(p.cat).art;
  return `<div class="wrap">
    <div class="crumb"><a href="#home">Home</a> / <a href="#shop">Shop</a> / ${catOf(p.cat).name}</div>
    <div class="pd">
      <div>
        <div class="pd-art bg-${p.bg}">${artFor(p)}</div>
        <div class="pd-thumbs">${[0,1,2,3].map(i=>`<div class="bg-${(p.bg+i)%4}">${art(k,p.color,i===2?"":p.print)}</div>`).join("")}</div>
      </div>
      <div class="pd-info">
        ${p.drop?`<span class="sticker">${DROP_NAME} drop</span>`:p.tag?`<span class="sticker ${p.tag==="New"?"bone":""}">${p.tag}</span>`:""}
        <h1 style="margin-top:14px">${p.name}</h1>
        <span class="price">${inr(p.price)}</span>
        <span class="tax">Inclusive of all taxes</span>
        <p class="desc">${p.desc}</p>
        <div class="opt-label"><span>Size <span id="sizePicked" class="red"></span></span>${p.sizes!==ONE?`<a href="#size-guide">Size guide</a>`:""}</div>
        <div class="sizes" id="sizes">${p.sizes.map(s=>`<button class="size ${p.sizes.length===1?"on":""}" data-s="${s}">${s}</button>`).join("")}</div>
        <p class="err" id="sizeErr" hidden>Pick a size first</p>
        <div class="opt-label"><span>Quantity</span></div>
        <div class="qty"><button id="qMinus" aria-label="Decrease">−</button><span id="qVal">0</span><button id="qPlus" aria-label="Increase">+</button></div>
        <div class="buy-row">
          ${locked
            ? `<button class="btn red" disabled>Drops 25 Dec</button><a class="btn ghost" href="#home" id="notifyBtn">Get notified</a>`
            : `<button class="btn red" id="addBtn">Add to cart</button><button class="btn ghost" id="buyBtn">Buy now</button>`}
        </div>
        ${locked?`<div style="margin-top:16px">${countdownHTML("pd")}</div>`:""}
        <div class="perks">
          <div><b>Free shipping</b>On orders over ${inr(FREE_SHIP)}</div>
          <div><b>7-day exchange</b>Easy size swaps</div>
          <div><b>7–10 days</b>Delivery across India</div>
        </div>
        <div style="margin-top:20px">
          <details open><summary>Details and fit</summary><div class="body">${p.desc} Model is 5'11" and wears size L. Machine wash cold, inside out. Do not tumble dry.</div></details>
          <details><summary>Shipping</summary><div class="body">Delivered in 7 to 10 working days across India. Shipping is free on orders over ${inr(FREE_SHIP)}; below that it's a flat ${inr(SHIP_FEE)}.</div></details>
          <details><summary>Exchanges</summary><div class="body">Exchange within 7 days of delivery for a different size. Items must be unworn with tags attached. Message us on WhatsApp to start an exchange.</div></details>
        </div>
      </div>
    </div>
    <div class="sec"><div class="sec-head"><div><span class="mono">Pairs well with</span><h2>You might like</h2></div></div><div class="pgrid">${related.map(card).join("")}</div></div>
  </div>`;
},

cart(){
  return `<div class="wrap"><div class="page-head"><h1><span class="chrome">Your</span> cart</h1></div><div id="cartBody"></div></div>`;
},

drop(){
  const items = PRODUCTS.filter(p=>p.drop);
  return `<div class="wrap">
    <div class="page-head"><span class="mono red">Drop 01 · 25.12.2026</span><h1><span class="chrome">Winter</span> <span style="color:transparent;-webkit-text-stroke:2px var(--blood-hi)">Arc</span></h1>
      <p>Built for the cold months and the long nights. Three pieces, limited units, no restocks. Unlocks at midnight IST on 25 December.</p>
      <div style="max-width:520px;margin-top:24px">${countdownHTML("droppage")}</div>
    </div>
    <div class="pgrid">${items.map(card).join("")}</div>
    ${newsletter()}
  </div>`;
},

lookbook(){
  const looks = [
    {t:"Cold nights", s:"Collector Puffer · Night Run Jogger", k:"jacket", c:"#0f0e10", bg:1},
    {t:"Red alert", s:"Red Alert Zip Hoodie", k:"hoodie", c:"#c4111b", bg:0},
    {t:"Concrete", s:"Concrete Cargo Pant", k:"pant", c:"#3b3a33", bg:2},
    {t:"Kept", s:"Kept Oversized Tee", k:"tee", c:"#b8101a", bg:3, pr:"KEPT"},
    {t:"Run it", s:"Kept Runner Sneaker", k:"shoe", c:"#ece6dd", bg:0},
    {t:"Built to be kept", s:"Winter Arc · 25.12.2026", k:"tee", c:"#0e0d0f", bg:1, pr:"ARC"}
  ];
  return `<div class="wrap">
    <div class="page-head"><span class="mono red">Campaign · FW26</span><h1><span class="chrome">Look</span>book</h1><p>Six looks from the Winter Arc campaign, shot around Ludhiana after dark.</p></div>
    <div class="looks">${looks.map((l,i)=>`<div class="look bg-${l.bg}"><div class="lk-art">${art(l.k,l.c,l.pr)}</div><div class="lk-top"><span class="mono">Look ${String(i+1).padStart(2,"0")}</span></div><div class="lk-bot"><h3>${l.t}</h3><p class="mono" style="margin-top:8px;color:var(--mute)">${l.s}</p></div></div>`).join("")}</div>
    <div style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn red" href="#shop">Shop the looks</a><a class="btn ghost" href="#drop">Winter Arc drop</a></div>
  </div>`;
},

"size-guide"(){
  const tops = [["S",40,27,19],["M",42,28,20],["L",44,29,21],["XL",46,30,22],["XXL",48,31,23]];
  const over = [["S",44,28,22],["M",46,29,23],["L",48,30,24],["XL",50,31,25],["XXL",52,32,26]];
  const bot = [["S",28,"30–32",40],["M",30,"32–34",41],["L",32,"34–36",42],["XL",34,"36–38",42],["XXL",36,"38–40",43]];
  const t = (h,rows)=>`<div class="tbl-wrap"><table><thead><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  return `<div class="wrap">
    <div class="page-head"><span class="mono red">Measurements in inches</span><h1><span class="chrome">Size</span> guide</h1><p>Sizes run from S to XXL. Measure a piece you already own and lay it flat. Between sizes? Go up one for a looser fit. Wrong size? Exchange it within 7 days.</p></div>
    <h3 style="margin-bottom:12px">T-shirts, sweatshirts and hoodies (regular fit)</h3>
    ${t(["Size","Chest","Length","Shoulder"],tops)}
    <h3 style="margin-bottom:12px">Oversized tees</h3>
    ${t(["Size","Chest","Length","Shoulder"],over)}
    <h3 style="margin-bottom:12px">Cargos and joggers</h3>
    ${t(["Size","Waist","Hip","Length"],bot)}
    <h3 style="margin-bottom:12px">Sneakers</h3>
    ${t(["UK","EU","US","Foot length (cm)"],[["6",40,7,24.5],["7",41,8,25.4],["8",42,9,26.2],["9",43,10,27.1],["10",44,11,27.9],["11",45,12,28.8]])}
  </div>`;
},

about(){
  return `<div class="wrap">
    <div class="page-head"><span class="mono red">Our story</span><h1><span class="chrome">About</span> us</h1></div>
    <div class="split">
      <p class="big-quote">Clothes you <span class="red">keep</span>, not clothes you replace.</p>
      <div class="prose">
        <p>Collectable started with a simple idea: streetwear should feel like something worth holding on to. Every drop is made in small runs, so the piece you buy is one most people around you won't have.</p>
        <p>We design out of Punjab and produce with partners across India, using heavyweight cottons, proper prints and fits that sit right. When a drop sells out, we don't restock it. That's what makes it collectable.</p>
        <p>Built to be kept.</p>
      </div>
    </div>
    <div class="stats">
      <div><b>240+</b><span>GSM cotton on every tee</span></div>
      <div><b>0</b><span>Restocks on sold-out drops</span></div>
      <div><b>7 days</b><span>Easy size exchange</span></div>
    </div>
    ${igSection()}
  </div>`;
},

faq(){
  const q = [
    ["How long does delivery take?", "Orders are delivered in 7 to 10 working days across India. You'll get a tracking link on WhatsApp and email once it ships."],
    ["Is shipping free?", `Yes, on every order over ${inr(FREE_SHIP)}. Below that, shipping is a flat ${inr(SHIP_FEE)}.`],
    ["What's your exchange policy?", "You can exchange for a different size within 7 days of delivery. The item has to be unworn, unwashed and have its tags on. Message us on WhatsApp with your order number to start."],
    ["Do you offer refunds?", "We offer exchanges, not refunds. If an item arrives damaged or wrong, contact us within 48 hours with a photo and we'll replace it."],
    ["Which sizes do you carry?", "Apparel comes in S, M, L, XL and XXL. Sneakers come in UK 6 to 11. Check the size guide for exact measurements."],
    ["How do I pay?", "Checkout runs on Razorpay, so you can pay with UPI, debit or credit card, netbanking or wallets."],
    ["Do you offer cash on delivery?", "Not right now. All orders are prepaid through Razorpay."],
    ["When does Winter Arc drop?", "25 December 2026 at midnight IST. Join the newsletter to get early access."],
    ["Will sold-out items come back?", "No. Drops are limited runs and we don't restock them."]
  ];
  return `<div class="wrap">
    <div class="page-head"><span class="mono red">Help</span><h1><span class="chrome">FAQ</span></h1><p>Can't find your answer? Message us on WhatsApp at ${WHATSAPP}.</p></div>
    <div style="max-width:820px">${q.map((x,i)=>`<details ${i===0?"open":""}><summary>${x[0]}</summary><div class="body">${x[1]}</div></details>`).join("")}</div>
  </div>`;
},

contact(){
  const ico = {
    wa:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z"/><path d="M9 9.5c.5 2 2.5 4 4.5 4.5l1-1.2 2 1-.5 1.7c-3.5.5-8-4-7.5-7.5L10 7.5l1 2z"/></svg>`,
    ig:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#fff"/></svg>`,
    em:`<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`
  };
  return `<div class="wrap">
    <div class="page-head"><span class="mono red">Talk to us</span><h1><span class="chrome">Contact</span></h1><p>We reply on WhatsApp within a few hours, Monday to Saturday.</p></div>
    <div class="split">
      <div class="contact-cards">
        <div class="cc"><div class="ico">${ico.wa}</div><div class="txt"><span class="mono">WhatsApp</span><b>+91 ${WHATSAPP}</b></div><a class="copy" href="https://wa.me/91${WHATSAPP}" target="_blank" rel="noopener">Chat</a></div>
        <div class="cc"><div class="ico">${ico.ig}</div><div class="txt"><span class="mono">Instagram</span><b>@${INSTA}</b></div><a class="copy" href="https://instagram.com/${INSTA}" target="_blank" rel="noopener">Open</a></div>
        <div class="cc"><div class="ico">${ico.em}</div><div class="txt"><span class="mono">Email</span><b>${EMAIL}</b></div><button class="copy" data-copy="${EMAIL}">Copy</button></div>
      </div>
      <form class="contact-form" id="contactForm" novalidate>
        <input id="cName" placeholder="Your name" aria-label="Your name">
        <input id="cOrder" placeholder="Order number (optional)" aria-label="Order number">
        <textarea id="cMsg" rows="5" placeholder="How can we help?" aria-label="Message"></textarea>
        <button class="btn red" type="submit">Send on WhatsApp</button>
        <p class="note" id="contactMsg">Opens WhatsApp with your message filled in.</p>
      </form>
    </div>
  </div>`;
}
};
