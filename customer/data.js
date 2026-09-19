const DEMO_SITE={brand:"Jaipur Prints",tagline:"HAND BLOCK PRINTED COTTON",whatsapp:"919876543210"};
const DEMO_CATEGORIES=[
{id:"bedsheet",name:"Bedsheet",sub:"Cotton & printed",tone:"bedsheet"},
{id:"bedcover",name:"Bedcover",sub:"Elegant layers",tone:"bedcover"},
{id:"towel",name:"Towel",sub:"Soft & absorbent",tone:"towel"},
{id:"totebag",name:"Tote Bag",sub:"Reusable carry",tone:"tote"}];
const DEMO_PRODUCTS=[
{id:"BS-101",name:"Jaipuri Cotton Bedsheet",cat:"bedsheet",price:699,badge:"Bestseller",desc:"Soft cotton bedsheet with a traditional printed finish.",fabric:"Cotton",size:"Double",availability:"Available",images:["https://images.unsplash.com/photo-1584100936595-c0654b55a3d2?auto=format&fit=crop&w=1100&q=90"]},
{id:"BS-102",name:"Floral Comfort Bedsheet",cat:"bedsheet",price:799,badge:"New",desc:"Comfortable everyday bedsheet with an elegant floral look.",fabric:"Cotton",size:"Double",availability:"Available",images:["https://images.unsplash.com/photo-1616628182505-1c7f6d6b8a8d?auto=format&fit=crop&w=1100&q=90"]},
{id:"BS-103",name:"Premium Printed Bedsheet",cat:"bedsheet",price:899,badge:"Featured",desc:"Premium printed design made for a polished bedroom.",fabric:"Cotton",size:"King",availability:"Available",images:["https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1100&q=90"]},
{id:"BS-104",name:"Classic Cotton Bedsheet",cat:"bedsheet",price:749,badge:"",desc:"Easy-care cotton bedding for everyday comfort.",fabric:"Cotton",size:"Double",availability:"Available",images:["https://images.unsplash.com/photo-1583845112203-454c7e47e86f?auto=format&fit=crop&w=1100&q=90"]},
{id:"BS-105",name:"Printed King Bedsheet",cat:"bedsheet",price:999,badge:"New",desc:"A generous king-size style with a refined print.",fabric:"Cotton",size:"King",availability:"Available",images:["https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1100&q=90"]},
{id:"BC-101",name:"Signature Bedcover",cat:"bedcover",price:799,badge:"Bestseller",desc:"A versatile bedcover that adds a refined layer to your room.",fabric:"Cotton Blend",size:"Double",availability:"Available",images:["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1100&q=90"]},
{id:"BC-102",name:"Printed Cotton Bedcover",cat:"bedcover",price:949,badge:"New",desc:"Lightweight cotton bedcover with an understated print.",fabric:"Cotton",size:"King",availability:"Available",images:["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1100&q=90"]},
{id:"BC-103",name:"Soft Layer Bedcover",cat:"bedcover",price:849,badge:"",desc:"A soft decorative layer for a calm bedroom setting.",fabric:"Cotton Blend",size:"Double",availability:"Available",images:["https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1100&q=90"]},
{id:"TW-101",name:"Everyday Cotton Towel",cat:"towel",price:299,badge:"Bestseller",desc:"Soft and absorbent cotton towel for everyday use.",fabric:"Cotton",size:"Bath",availability:"Available",images:["https://images.unsplash.com/photo-1600369671236-e74521d4b0ad?auto=format&fit=crop&w=1100&q=90"]},
{id:"TW-102",name:"Premium Towel Set",cat:"towel",price:499,badge:"New",desc:"A practical towel set with a soft comfortable feel.",fabric:"Cotton",size:"Set of 2",availability:"Available",images:["https://images.unsplash.com/photo-1583845112203-454c7e47e86f?auto=format&fit=crop&w=1100&q=90"]},
{id:"TW-103",name:"Classic Hand Towel",cat:"towel",price:199,badge:"",desc:"Compact everyday hand towel with a soft finish.",fabric:"Cotton",size:"Hand",availability:"Available",images:["https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?auto=format&fit=crop&w=1100&q=90"]},
{id:"TB-101",name:"Printed Everyday Tote",cat:"totebag",price:249,badge:"New",desc:"Reusable tote bag for daily shopping and essentials.",fabric:"Canvas",size:"Standard",availability:"Available",images:["https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1100&q=90"]},
{id:"TB-102",name:"Canvas Carry Tote",cat:"totebag",price:299,badge:"",desc:"Simple sturdy tote for everyday carrying.",fabric:"Canvas",size:"Standard",availability:"Available",images:["https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1100&q=90"]}];

import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { firebaseConfig } from "../firebase-config.js";

export let SITE = DEMO_SITE;
export let CATEGORIES = DEMO_CATEGORIES;
export let PRODUCTS = DEMO_PRODUCTS;

const hasFirebaseConfig = () => firebaseConfig?.apiKey && !firebaseConfig.apiKey.startsWith("PASTE_") && firebaseConfig?.projectId && !firebaseConfig.projectId.startsWith("YOUR_");

if (hasFirebaseConfig()) {
  try {
    const app = initializeApp(firebaseConfig, "customerCatalog");
    const db = getFirestore(app);
    const [ps, cs, ss] = await Promise.all([
      getDocs(collection(db, "products")),
      getDocs(collection(db, "categories")),
      getDoc(doc(db, "settings", "site"))
    ]);
    const liveCategories = cs.docs.map(d => ({ id:d.id, ...d.data(), sub:d.data().sub || d.data().description || "" }));
    const liveProducts = ps.docs.map(d => {
      const x={id:d.id,...d.data()};
      const cat=liveCategories.find(c=>c.name===x.category || c.id===x.category);
      const rawImages=Array.isArray(x.images)?x.images.filter(Boolean):[];
      const images=rawImages.length?rawImages:(x.imageUrl?[x.imageUrl]:[]);
      return {...x,cat:cat?.id || String(x.category||"").toLowerCase().trim().replace(/\s+/g,"-"),desc:x.description||x.desc||"",images};
    });
    CATEGORIES=liveCategories.length?liveCategories:DEMO_CATEGORIES;
    PRODUCTS=liveProducts.length?liveProducts:DEMO_PRODUCTS;
    const settings=ss.exists()?ss.data():{};
    SITE={...DEMO_SITE,...settings,brand:settings.brandName||DEMO_SITE.brand};
  } catch(e) {
    console.error("Firebase catalog unavailable:",e);
  }
}

window.SITE=SITE; window.CATEGORIES=CATEGORIES; window.PRODUCTS=PRODUCTS;
window.money=n=>"₹"+Number(n||0).toLocaleString("en-IN");
window.categoryName=id=>(CATEGORIES.find(c=>c.id===id)||{}).name||id;
window.productById=id=>PRODUCTS.find(p=>p.id===id);
window.waBase=()=>{const raw=String(SITE.whatsapp||DEMO_SITE.whatsapp).replace(/\D/g,"");return `https://wa.me/${raw||DEMO_SITE.whatsapp}`};
window.waLink=(p,qty=1)=>`${window.waBase()}?text=${encodeURIComponent(`Hello, I am interested in this product.\n\nProduct: ${p.name}\nProduct ID: ${p.id}\nCategory: ${window.categoryName(p.cat)}\nPrice: ${window.money(p.price)}\nQuantity: ${qty}`)}`;
