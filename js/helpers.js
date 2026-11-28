/* helpers.js
   HELPERS: product artwork drawing, price format (inr), drop lock check.
   Keep the file names and the load order in index.html. */

/* ---------- product art ---------- */
function art(kind, color, print, accent){
  const c = color || "#111", a = accent || "#ff2b38";
  const light = isLight(c);
  const ink = light ? "#b8101a" : "#f3eee8";
  const stroke = light ? "#0003" : "#ffffff22";
  const p = print ? `<text x="100" y="${kind==="hoodie"||kind==="jacket"?112:102}" text-anchor="middle" font-family="Unbounded,Arial Black,sans-serif" font-weight="900" font-size="${print.length>4?13:print.length>2?20:30}" fill="${ink}">${print}</text>` : "";
  const S = `stroke="${stroke}" stroke-width="1.5"`;
  switch(kind){
    case "tee": return `<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M70 28 Q100 44 130 28 L168 46 L184 82 L156 94 L148 80 L148 176 Q100 182 52 176 L52 80 L44 94 L16 82 L32 46 Z" fill="${c}" ${S}/><path d="M80 30 Q100 46 120 30" fill="none" stroke="${stroke}" stroke-width="3"/>${p}</svg>`;
    case "crew": return `<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M72 30 Q100 44 128 30 L162 44 L182 140 L162 146 L148 88 L148 172 Q100 178 52 172 L52 88 L38 146 L18 140 L38 44 Z" fill="${c}" ${S}/><path d="M52 164 Q100 170 148 164" stroke="${stroke}" stroke-width="4" fill="none"/><path d="M80 32 Q100 46 120 32" fill="none" stroke="${stroke}" stroke-width="4"/>${p}</svg>`;
    case "hoodie": return `<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M66 46 Q70 14 100 12 Q130 14 134 46 L164 56 L184 146 L164 152 L150 96 L150 176 Q100 182 50 176 L50 96 L36 152 L16 146 L36 56 Z" fill="${c}" ${S}/><path d="M74 48 Q100 72 126 48 Q122 26 100 24 Q78 26 74 48Z" fill="#00000040"/><path d="M92 62 L90 92 M108 62 L110 92" stroke="${stroke}" stroke-width="2"/><rect x="70" y="128" width="60" height="30" rx="6" fill="#0000002a"/>${p}</svg>`;
    case "jacket": return `<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M70 26 L100 40 L130 26 L164 40 L186 150 L164 156 L150 92 L150 176 L50 176 L50 92 L36 156 L14 150 L36 40 Z" fill="${c}" ${S}/><path d="M70 26 L100 54 L130 26 L122 20 L100 30 L78 20Z" fill="${light?"#b8101a":"#ff2b38"}"/><path d="M100 54 L100 176" stroke="#ffffff55" stroke-width="2" stroke-dasharray="4 3"/><path d="M50 166 L150 166" stroke="${light?"#b8101a":"#f3eee8"}" stroke-width="4"/>${print?p:`<circle cx="76" cy="84" r="11" fill="none" stroke="${ink}" stroke-width="3"/>`}</svg>`;
    case "pant": return `<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M58 18 L142 18 L148 40 L160 184 L112 184 L100 70 L88 184 L40 184 L52 40 Z" fill="${c}" ${S}/><rect x="58" y="18" width="84" height="12" fill="#00000035"/><rect x="40" y="92" width="22" height="30" rx="3" fill="#00000030" stroke="${stroke}"/><rect x="138" y="92" width="22" height="30" rx="3" fill="#00000030" stroke="${stroke}"/><path d="M44 176 L84 176 M116 176 L156 176" stroke="${a}" stroke-width="3"/></svg>`;
    case "cap": return `<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M40 120 Q40 50 100 48 Q160 50 160 120 Z" fill="${c}" ${S}/><path d="M100 48 L100 120 M70 56 Q60 90 62 120 M130 56 Q140 90 138 120" stroke="${stroke}" stroke-width="2" fill="none"/><path d="M36 118 Q100 112 164 118 Q190 124 184 138 Q120 132 36 130 Z" fill="${c}" ${S}/><circle cx="100" cy="48" r="5" fill="${c}" ${S}/><text x="100" y="98" text-anchor="middle" font-family="Unbounded,Arial Black,sans-serif" font-weight="900" font-size="26" fill="${isLight(c)?"#b8101a":(c.startsWith("#b")||c.startsWith("#a")?"#f3eee8":"#ff2b38")}">C</text></svg>`;
    case "shoe": return `<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M20 128 Q24 88 56 84 L88 70 Q104 92 130 96 L170 104 Q188 110 186 132 L186 142 L20 142 Z" fill="${c}" ${S}/><path d="M18 140 L188 140 L186 158 Q100 164 20 158 Z" fill="#f3eee8" stroke="#0002"/><path d="M18 150 L188 150" stroke="${a}" stroke-width="4"/><path d="M60 112 Q100 102 140 120" stroke="${a}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M74 82 L84 96 M86 78 L96 92 M98 76 L108 90" stroke="#0005" stroke-width="3"/></svg>`;
    case "beanie": return `<svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="40" r="16" fill="${c}" ${S}/><path d="M44 130 Q44 54 100 52 Q156 54 156 130 Z" fill="${c}" ${S}/><rect x="38" y="122" width="124" height="40" rx="8" fill="${c}" ${S}/>${[52,68,84,100,116,132,148].map(x=>`<path d="M${x} 126 L${x} 158" stroke="#00000040" stroke-width="3"/>`).join("")}<rect x="86" y="132" width="28" height="18" rx="2" fill="#f3eee8"/><text x="100" y="145" text-anchor="middle" font-family="Unbounded,sans-serif" font-weight="900" font-size="10" fill="#b8101a">C</text></svg>`;
    case "wallet": return `<svg viewBox="0 0 200 200" aria-hidden="true"><rect x="40" y="60" width="110" height="80" rx="10" fill="${c}" stroke="#ffffff30" stroke-width="1.5"/><path d="M40 100 L150 100" stroke="#ffffff22"/><circle cx="138" cy="100" r="5" fill="#cfcacc"/>${[0,1,2,3,4,5,6].map(i=>`<ellipse cx="${146+i*6}" cy="${108+i*10}" rx="5" ry="3.5" fill="none" stroke="#cfcacc" stroke-width="2.4"/>`).join("")}<text x="80" y="88" text-anchor="middle" font-family="Unbounded,sans-serif" font-weight="900" font-size="18" fill="#ff2b38">C</text></svg>`;
  }
  return "";
}
function isLight(hex){const n=parseInt(hex.slice(1),16);const r=n>>16,g=(n>>8)&255,b=n&255;return (r*299+g*587+b*114)/1000>150}
const catOf = id => CATS.find(c=>c.id===id);
const artFor = (p) => p.image ? `<img class="pimg" src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : art(p.art || catOf(p.cat).art, p.color, p.print);
const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
const isDropLocked = p => p.drop && Date.now() < DROP_AT;
