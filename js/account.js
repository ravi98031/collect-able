/* account.js
   ACCOUNTS: sign up, log in, OTP codes (preview mode, saved in the browser only).
   Keep the file names and the load order in index.html. */

/* ---------- accounts (preview only: saved on this device, codes shown on screen) ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let accounts = [], user = null, pending = null, loginOtp = null;
try { accounts = JSON.parse(localStorage.getItem("collectable-accounts") || "[]"); if(!Array.isArray(accounts)) accounts = []; } catch(e){ accounts = []; }
try { user = JSON.parse(localStorage.getItem("collectable-user") || "null"); } catch(e){ user = null; }
function saveAccounts(){ try{ localStorage.setItem("collectable-accounts", JSON.stringify(accounts)); }catch(e){} }
function setUser(u){ if(u&&!u.name){ const a=accounts.find(x=>x.email===u.email); if(a&&a.name) u.name=a.name; } user = u; updateProfileUI(); try{ u ? localStorage.setItem("collectable-user", JSON.stringify(u)) : localStorage.removeItem("collectable-user"); }catch(e){} }
const newCode = () => String(Math.floor(100000 + Math.random()*900000));
async function hash(pw){
  try { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("collectable:"+pw)); return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join(""); }
  catch(e){ return "plain:"+pw; }
}
const findAcct = id => { const v = id.trim().toLowerCase(); return accounts.find(a => a.email===v || a.phone===v.replace(/^\+?91/,"") || a.username===v); };
function fieldErr(id,msg){ const e=document.getElementById(id+"Err"); if(e){ e.textContent=msg||""; e.hidden=!msg; } }
function clearOnInput(form){ form.querySelectorAll("input").forEach(i=>i.addEventListener("input",()=>fieldErr(i.id,""))); }
let resendTimers = {};
function startResend(btnId){
  const b = document.getElementById(btnId); if(!b) return;
  let t = 30; b.disabled = true; b.textContent = `Resend in ${t}s`;
  clearInterval(resendTimers[btnId]);
  resendTimers[btnId] = setInterval(()=>{ t--; const el=document.getElementById(btnId); if(!el){ clearInterval(resendTimers[btnId]); return; } if(t<=0){ clearInterval(resendTimers[btnId]); el.disabled=false; el.textContent="Resend code"; } else el.textContent=`Resend in ${t}s`; },1000);
}
