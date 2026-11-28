/* products.js
   PRODUCTS: every product (name, price, category, sizes, colour). Add or edit products here.
   Keep the file names and the load order in index.html. */

const PRODUCTS = [
  {id:"winter-arc-oversized-tee", name:"Winter Arc Oversized Tee", cat:"oversized", price:1699, color:"#0e0d0f", print:"ARC", bg:1, drop:true, sizes:APPAREL, desc:"Heavyweight 240 GSM cotton, dropped shoulders and a boxy cut. Puff-printed Winter Arc graphic across the back."},
  {id:"blood-moon-boxy-tee", name:"Blood Moon Boxy Tee", cat:"tees", price:1599, color:"#ece6dd", print:"C", bg:0, tag:"New", sizes:APPAREL, desc:"220 GSM combed cotton in bone white with a blood red moon screen print on the chest."},
  {id:"static-noise-tee", name:"Static Noise Tee", cat:"tees", price:1549, color:"#2a2a2d", print:"///", bg:2, sizes:APPAREL, desc:"Washed charcoal tee with a distorted static print that cracks a little more with every wash."},
  {id:"kept-oversized-tee", name:"Kept Oversized Tee", cat:"oversized", price:1799, color:"#b8101a", print:"KEPT", bg:3, tag:"Bestseller", sizes:APPAREL, desc:"Our signature oversized fit in blood red, with a chrome-effect KEPT print on the back."},
  {id:"keep-it-hoodie", name:"Keep It Hoodie", cat:"hoodies", price:2499, color:"#111013", print:"C", bg:0, tag:"Bestseller", sizes:APPAREL, desc:"400 GSM brushed fleece, double-layer hood, kangaroo pocket and a tonal logo on the chest."},
  {id:"red-alert-zip-hoodie", name:"Red Alert Zip Hoodie", cat:"hoodies", price:2799, color:"#c4111b", print:"", bg:1, drop:true, sizes:APPAREL, desc:"Full-zip hoodie in blood red with metal hardware. Part of the Winter Arc drop."},
  {id:"archive-crew", name:"Archive Crew Sweatshirt", cat:"sweatshirts", price:2199, color:"#5d595c", print:"ARCHIVE", bg:2, sizes:APPAREL, desc:"Grey marl crewneck with ribbed cuffs and an embroidered ARCHIVE wordmark."},
  {id:"y2k-crew", name:"Chrome Heart Crew", cat:"sweatshirts", price:2299, color:"#151316", print:"C", bg:3, tag:"New", sizes:APPAREL, desc:"Black crewneck with a chrome-effect heart graphic. Relaxed fit, 360 GSM."},
  {id:"concrete-cargo", name:"Concrete Cargo Pant", cat:"bottoms", price:2599, color:"#3b3a33", bg:2, tag:"Bestseller", sizes:APPAREL, desc:"Six-pocket cargo in washed concrete grey, with adjustable toggles at the hem."},
  {id:"night-run-jogger", name:"Night Run Jogger", cat:"bottoms", price:1999, color:"#121114", bg:0, sizes:APPAREL, desc:"Tapered fleece jogger with a reflective side stripe and zip pockets."},
  {id:"collector-puffer", name:"Collector Puffer Jacket", cat:"jackets", price:2999, color:"#0f0e10", bg:1, drop:true, sizes:APPAREL, desc:"Boxy cropped puffer with a high collar and a red lining. The headline piece of Winter Arc."},
  {id:"varsity-arc", name:"Varsity Arc Jacket", cat:"jackets", price:2899, color:"#a50e17", bg:3, tag:"Low stock", sizes:APPAREL, desc:"Wool-blend varsity jacket with a bone trim and a chenille C patch."},
  {id:"logo-cap", name:"Logo 6-Panel Cap", cat:"caps", price:1500, color:"#0f0e10", bg:0, sizes:ONE, desc:"Structured six-panel cap with a 3D-embroidered C and an adjustable metal clasp."},
  {id:"red-cap", name:"Blood Red Dad Cap", cat:"caps", price:1500, color:"#b40f18", bg:2, tag:"New", sizes:ONE, desc:"Unstructured washed-cotton cap with a curved brim and tonal embroidery."},
  {id:"kept-runner", name:"Kept Runner Sneaker", cat:"sneakers", price:2999, color:"#ece6dd", bg:3, tag:"New", sizes:SHOES, desc:"Chunky Y2K runner with a bone upper, red accents and a cushioned midsole."},
  {id:"chain-wallet", name:"Chain Wallet Set", cat:"accessories", price:1599, color:"#1a181b", bg:2, art:"wallet", sizes:ONE, desc:"Bifold vegan leather wallet with a detachable silver chain."},
  {id:"ribbed-beanie", name:"Ribbed Beanie", cat:"accessories", price:1500, color:"#b40f18", bg:1, sizes:ONE, desc:"Chunky rib-knit beanie with a woven Collectable label. Fits most heads."}
];
