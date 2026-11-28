/* config.js
   SETTINGS: drop name/date, shipping rules, contact details (WhatsApp, Instagram, email), categories and size lists.
   Keep the file names and the load order in index.html. */

let DROP_NAME = "Winter Arc";
let DROP_AT = new Date("2026-12-25T00:00:00+05:30").getTime();
let FREE_SHIP = 1499, SHIP_FEE = 99;
let WHATSAPP = "9803122754", INSTA = "clips_4_csh", EMAIL = "ravimehta27754@gmail.com";

const CATS = [
  {id:"tees", name:"T-shirts", art:"tee"},
  {id:"oversized", name:"Oversized tees", art:"tee"},
  {id:"hoodies", name:"Hoodies", art:"hoodie"},
  {id:"sweatshirts", name:"Sweatshirts", art:"crew"},
  {id:"bottoms", name:"Cargos and joggers", art:"pant"},
  {id:"jackets", name:"Jackets", art:"jacket"},
  {id:"caps", name:"Caps", art:"cap"},
  {id:"sneakers", name:"Sneakers", art:"shoe"},
  {id:"accessories", name:"Accessories", art:"beanie"}
];
const APPAREL = ["S","M","L","XL","XXL"];
const SHOES = ["UK 6","UK 7","UK 8","UK 9","UK 10","UK 11"];
const ONE = ["One size"];
