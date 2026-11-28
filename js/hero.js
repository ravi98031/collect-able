/* hero.js
   HERO IMAGE: lets the owner set a background photo for the top section.
   Keep the file names and the load order in index.html. */

/* ---------- hero background image (saved on this device) ---------- */
let heroImg = "";
try { heroImg = localStorage.getItem("collectable-hero") || ""; } catch(e){}
function setHeroFromFile(file){
  if(!file || !file.type.startsWith("image/")){ toast("Choose an image file"); return; }
  const r = new FileReader();
  r.onload = ()=>{
    const img = new Image();
    img.onload = ()=>{
      const max = 1800, k = Math.min(1, max/Math.max(img.width,img.height));
      const c = document.createElement("canvas"); c.width = Math.round(img.width*k); c.height = Math.round(img.height*k);
      c.getContext("2d").drawImage(img,0,0,c.width,c.height);
      heroImg = c.toDataURL("image/jpeg",0.82);
      try { localStorage.setItem("collectable-hero", heroImg); } catch(e){ toast("Image shown, but too big to remember after reload"); }
      route();
    };
    img.src = r.result;
  };
  r.readAsDataURL(file);
}
