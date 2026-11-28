/* database.js
   Loads products and settings from Supabase when supabase-config.js is filled in.
   If it is empty or unreachable, the site keeps using js/products.js and js/config.js. */
function rowToProduct(r){
  return {id:r.id, name:r.name, cat:r.cat, price:Number(r.price), color:r.color||"#2a2a2d", print:r.print||"", bg:r.bg||0,
    drop:!!r.is_drop, tag:r.tag||undefined, sizes:(r.sizes&&r.sizes.length)?r.sizes:ONE, desc:r.descr||"", art:r.art||undefined, image:r.image||undefined};
}
function applySettings(s){
  if(s.drop_name) DROP_NAME=s.drop_name;
  if(s.drop_at && !isNaN(new Date(s.drop_at))) DROP_AT=new Date(s.drop_at).getTime();
  if(s.free_ship) FREE_SHIP=Number(s.free_ship);
  if(s.ship_fee) SHIP_FEE=Number(s.ship_fee);
  if(s.whatsapp) WHATSAPP=s.whatsapp;
  if(s.instagram) INSTA=s.instagram;
  if(s.email) EMAIL=s.email;
}
async function loadFromDatabase(){
  const c=window.SUPABASE_CONFIG;
  if(!c || !c.url || !c.anonKey) return;
  const h={apikey:c.anonKey, Authorization:"Bearer "+c.anonKey};
  try{
    const [pr,st]=await Promise.all([
      fetch(c.url+"/rest/v1/products?select=*&active=eq.true&order=sort.asc,created_at.asc",{headers:h}),
      fetch(c.url+"/rest/v1/settings?select=*",{headers:h})]);
    if(st.ok){ const s={}; (await st.json()).forEach(r=>s[r.key]=r.value); applySettings(s); }
    if(pr.ok){ const rows=await pr.json(); if(rows.length){ PRODUCTS.length=0; rows.forEach(r=>PRODUCTS.push(rowToProduct(r))); } }
  }catch(e){ console.warn("Database not reachable, using built-in data", e); }
  buildTicker();
}
