/* admin.js - the admin panel: login, products, photos, settings. Talks to Supabase with plain web requests. */
(function(){
const C=window.SUPABASE_CONFIG||{}, $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let session=null; try{ session=JSON.parse(sessionStorage.getItem("adm")||"null"); }catch(e){}
let rows=[], imgUrl="", editingId=null;
const SETTINGS=["drop_name","drop_at","free_ship","ship_fee","whatsapp","instagram","email"];

function toast(m,bad){ const t=$("#toast"); t.textContent=m; t.className="toast show"+(bad?" bad":""); clearTimeout(toast.t); toast.t=setTimeout(()=>t.className="toast",3000); }
function show(id){ ["setup","login","app"].forEach(x=>$("#"+x).hidden=x!==id); $("#logout").hidden=id!=="app"; }
function logout(){ session=null; sessionStorage.removeItem("adm"); $("#who").textContent=""; show("login"); }

async function api(path,opt){
  opt=opt||{};
  const r=await fetch(C.url+path,{...opt,headers:{apikey:C.anonKey,Authorization:"Bearer "+session.token,"Content-Type":"application/json",Prefer:"return=representation",...(opt.headers||{})}});
  if(r.status===401){ logout(); throw new Error("Session expired. Please log in again."); }
  const t=await r.text(); if(!r.ok) throw new Error(t||("Error "+r.status));
  return t?JSON.parse(t):null;
}
async function login(email,pw){
  const r=await fetch(C.url+"/auth/v1/token?grant_type=password",{method:"POST",headers:{apikey:C.anonKey,"Content-Type":"application/json"},body:JSON.stringify({email,password:pw})});
  const j=await r.json(); if(!r.ok) throw new Error(j.error_description||j.msg||"Login failed");
  session={token:j.access_token,email:j.user.email}; sessionStorage.setItem("adm",JSON.stringify(session));
}
async function enter(){
  try{
    const a=await api("/rest/v1/admins?select=email");
    if(!a||!a.length){ logout(); toast("This account is not an admin. Add its email in the admins table.",true); return; }
  }catch(e){ logout(); toast(e.message,true); return; }
  $("#who").textContent=session.email; show("app"); await loadProducts(); await loadSettings();
}

/* ---------- products ---------- */
async function loadProducts(){ rows=await api("/rest/v1/products?select=*&order=sort.asc,created_at.asc"); renderList(); }
function renderList(){
  if(!rows.length){ $("#list").innerHTML='<p>No products in the database yet. Press "Import my current products" to copy the ones from your site, or add one.</p>'; return; }
  $("#list").innerHTML='<div style="overflow-x:auto"><table><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Shown</th><th></th></tr>'+rows.map(p=>
    `<tr class="${p.active?"":"off"}"><td>${p.image?`<img class="th" src="${esc(p.image)}" alt="">`:'<div class="th"></div>'}</td><td>${esc(p.name)}${p.is_drop?" (drop)":""}</td><td>${esc(p.cat)}</td><td>₹${Number(p.price).toLocaleString("en-IN")}</td><td>${p.active?"Yes":"Hidden"}</td>
    <td class="acts"><button class="btn sm" data-a="edit" data-id="${esc(p.id)}">Edit</button><button class="btn sm" data-a="tog" data-id="${esc(p.id)}">${p.active?"Hide":"Show"}</button><button class="btn sm red" data-a="del" data-id="${esc(p.id)}">Delete</button></td></tr>`).join("")+"</table></div>";
}
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function openForm(p){
  editingId=p?p.id:null; imgUrl=p&&p.image||"";
  $("#formTitle").textContent=p?"Edit product":"Add product";
  $("#f-cat").innerHTML=CATS.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("");
  const v=(k,x)=>{ $("#f-"+k).value=x; };
  v("name",p?p.name:""); v("id",p?p.id:""); $("#f-id").readOnly=!!p; v("cat",p?p.cat:CATS[0].id); v("price",p?p.price:"");
  v("sizes",p?(p.sizes||[]).join(", "):APPAREL.join(", ")); v("preset",""); v("color",p&&p.color||"#2a2a2d"); v("print",p&&p.print||"");
  v("bg",p?p.bg:0); v("tag",p&&p.tag||""); v("sort",p?p.sort:0); v("desc",p&&p.descr||"");
  $("#f-drop").checked=!!(p&&p.is_drop); $("#f-active").checked=p?p.active:true; $("#f-file").value="";
  $("#prev").innerHTML=imgUrl?`<img src="${esc(imgUrl)}" alt="">`:"";
  $("#form").hidden=false; $("#form").scrollIntoView({behavior:"smooth"});
}
function shrink(file){ /* resize big photos to about 1200px so the site stays fast */
  return new Promise((res,rej)=>{ const im=new Image(), u=URL.createObjectURL(file);
    im.onload=()=>{ const k=Math.min(1,1200/Math.max(im.width,im.height)), c=document.createElement("canvas"); c.width=Math.round(im.width*k); c.height=Math.round(im.height*k);
      c.getContext("2d").drawImage(im,0,0,c.width,c.height); c.toBlob(b=>b?res(b):rej(new Error("Could not read the photo")),"image/jpeg",.85); URL.revokeObjectURL(u); };
    im.onerror=()=>rej(new Error("Could not read the photo")); im.src=u; });
}
async function upload(file){
  const blob=await shrink(file), name=(slug($("#f-id").value||$("#f-name").value)||"photo")+"-"+Date.now()+".jpg";
  const r=await fetch(C.url+"/storage/v1/object/product-images/"+name,{method:"POST",headers:{apikey:C.anonKey,Authorization:"Bearer "+session.token,"Content-Type":"image/jpeg","x-upsert":"true"},body:blob});
  if(!r.ok) throw new Error("Photo upload failed: "+await r.text());
  return C.url+"/storage/v1/object/public/product-images/"+name;
}

/* ---------- settings ---------- */
async function loadSettings(){
  const d={drop_name:DROP_NAME,drop_at:new Date(DROP_AT+5.5*3600e3).toISOString().slice(0,16),free_ship:FREE_SHIP,ship_fee:SHIP_FEE,whatsapp:WHATSAPP,instagram:INSTA,email:EMAIL};
  (await api("/rest/v1/settings?select=*")).forEach(r=>{ d[r.key]=r.key==="drop_at"?String(r.value).slice(0,16):r.value; });
  SETTINGS.forEach(k=>$("#s-"+k).value=d[k]);
}

/* ---------- wiring ---------- */
if(!C.url||!C.anonKey){ show("setup"); }
else{
  show("login"); if(session) enter();
  $("#loginForm").onsubmit=async e=>{ e.preventDefault(); try{ await login($("#em").value.trim(),$("#pw").value); await enter(); }catch(err){ toast(err.message,true); } };
  $("#logout").onclick=logout;
  document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{
    document.querySelectorAll(".tabs button").forEach(x=>x.classList.toggle("on",x===b));
    ["products","settings","help"].forEach(t=>$("#t-"+t).hidden=t!==b.dataset.t); });
  $("#addBtn").onclick=()=>openForm(null);
  $("#cancel").onclick=()=>$("#form").hidden=true;
  $("#f-name").oninput=()=>{ if(!editingId) $("#f-id").value=slug($("#f-name").value); };
  $("#f-preset").onchange=e=>{ const m={apparel:APPAREL,shoes:SHOES,one:ONE}[e.target.value]; if(m) $("#f-sizes").value=m.join(", "); };
  $("#f-file").onchange=async e=>{ const f=e.target.files[0]; if(!f) return; try{ toast("Uploading photo..."); imgUrl=await upload(f); $("#prev").innerHTML=`<img src="${esc(imgUrl)}" alt="">`; toast("Photo uploaded. Press Save product."); }catch(err){ toast(err.message,true); } };
  $("#list").onclick=async e=>{
    const b=e.target.closest("button"); if(!b) return; const p=rows.find(x=>x.id===b.dataset.id); if(!p) return;
    try{
      if(b.dataset.a==="edit") openForm(p);
      if(b.dataset.a==="tog"){ await api("/rest/v1/products?id=eq."+encodeURIComponent(p.id),{method:"PATCH",body:JSON.stringify({active:!p.active})}); await loadProducts(); toast(p.active?"Hidden from the website":"Now showing"); }
      if(b.dataset.a==="del" && confirm("Delete "+p.name+" for good?")){ await api("/rest/v1/products?id=eq."+encodeURIComponent(p.id),{method:"DELETE"}); await loadProducts(); toast("Deleted"); }
    }catch(err){ toast(err.message,true); }
  };
  $("#form").onsubmit=async e=>{ e.preventDefault();
    const sizes=$("#f-sizes").value.split(",").map(s=>s.trim()).filter(Boolean);
    const row={id:$("#f-id").value.trim(),name:$("#f-name").value.trim(),cat:$("#f-cat").value,price:Number($("#f-price").value),sizes,color:$("#f-color").value,print:$("#f-print").value.trim(),bg:Number($("#f-bg").value),tag:$("#f-tag").value.trim()||null,is_drop:$("#f-drop").checked,descr:$("#f-desc").value.trim(),image:imgUrl||null,sort:Number($("#f-sort").value)||0,active:$("#f-active").checked};
    try{ await api("/rest/v1/products",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=representation"},body:JSON.stringify(row)}); $("#form").hidden=true; await loadProducts(); toast("Product saved. It is live on the website."); }catch(err){ toast(err.message,true); } };
  $("#importBtn").onclick=async()=>{
    if(!confirm("Copy the products from your site files into the database? Products with the same ID are overwritten.")) return;
    const data=PRODUCTS.map((p,i)=>({id:p.id,name:p.name,cat:p.cat,price:p.price,sizes:p.sizes,color:p.color||null,print:p.print||null,bg:p.bg||0,tag:p.tag||null,is_drop:!!p.drop,descr:p.desc||"",art:p.art||null,sort:i,active:true}));
    try{ await api("/rest/v1/products",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=representation"},body:JSON.stringify(data)}); await loadProducts(); toast("Imported "+data.length+" products"); }catch(err){ toast(err.message,true); } };
  $("#t-settings").onsubmit=async e=>{ e.preventDefault();
    const data=SETTINGS.map(k=>({key:k,value:k==="drop_at"?$("#s-"+k).value+":00+05:30":String($("#s-"+k).value).trim()}));
    try{ await api("/rest/v1/settings",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=representation"},body:JSON.stringify(data)}); toast("Settings saved. They are live on the website."); }catch(err){ toast(err.message,true); } };
}
})();
