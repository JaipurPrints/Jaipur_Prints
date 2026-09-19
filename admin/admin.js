import {auth,db} from "./firebase.js";
import {onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {collection,doc,getDocs,addDoc,setDoc,deleteDoc,getDoc,query,orderBy} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let products=[],categories=[],editing=null;
const $=x=>document.getElementById(x);
onAuthStateChanged(auth,u=>{if(!u)location.href="index.html";else{$("userEmail").textContent=u.email;load()}});
async function load(){try{let [ps,cs]=await Promise.all([getDocs(collection(db,"products")),getDocs(collection(db,"categories"))]);products=ps.docs.map(d=>({id:d.id,...d.data()}));categories=cs.docs.map(d=>({id:d.id,...d.data()}));render()}catch(e){toast("Firebase data could not be loaded. Check config/rules.")}}
function render(){total.textContent=products.length;cats.textContent=categories.length;available.textContent=products.filter(p=>p.status==="Available").length;out.textContent=products.filter(p=>p.status==="Out of stock").length;filter.innerHTML='<option value="all">All categories</option>'+categories.map(c=>`<option>${c.name}</option>`).join("");renderProducts();renderCategories();loadSettings()}
function renderProducts(){let q=search.value.toLowerCase(),f=filter.value;let list=products.filter(p=>(!q||(p.name+" "+p.id).toLowerCase().includes(q))&&(f==="all"||p.category===f));productRows.innerHTML=list.map(p=>`<tr><td><div class="prod">${p.imageUrl?`<img src="${p.imageUrl}">`:""}<b>${p.name}</b></div></td><td>${p.id}</td><td>${p.category||"-"}</td><td>₹${Number(p.price||0).toLocaleString("en-IN")}</td><td><span class="status ${p.status==="Available"?"ok":"bad"}">${p.status||"Available"}</span></td><td><button onclick="editProduct('${p._docId||p.id}')">Edit</button><button class="danger" onclick="removeProduct('${p._docId||p.id}')">Delete</button></td></tr>`).join("")}
function renderCategories(){categoryCards.innerHTML=categories.map(c=>`<div class="cat"><div><b>${c.name}</b><small>${c.description||""}</small></div><strong>${products.filter(p=>p.category===c.name).length}</strong><span><button onclick="editCategory('${c.id}')">Edit</button><button class="danger" onclick="removeCategory('${c.id}')">Delete</button></span></div>`).join("")}
function fillCats(){$("fCategory").innerHTML=categories.map(c=>`<option>${c.name}</option>`).join("")}
function openProduct(p=null){editing=p?{type:"product",id:p._docId||p.id}:null;fillCats();$("modalTitle").textContent=p?"Edit Product":"Add Product";$("fName").value=p?.name||"";$("fId").value=p?.id||"";$("fId").disabled=!!p;$("fCategory").value=p?.category||categories[0]?.name||"";$("fPrice").value=p?.price||"";$("fFabric").value=p?.fabric||"";$("fSize").value=p?.size||"";$("fStatus").value=p?.status||"Available";$("fBadge").value=p?.badge||"";$("fDesc").value=p?.description||"";$("fImageUrl").value=p?.imageUrl||p?.images?.[0]||"";modal.classList.add("open")}
window.editProduct=id=>openProduct(products.find(p=>(p._docId||p.id)===id));
window.removeProduct=async id=>{if(confirm("Delete this product?")){await deleteDoc(doc(db,"products",id));await load();toast("Product deleted")}};
$("entityForm").onsubmit=async e=>{e.preventDefault();let id=$("fId").value.trim(),data={name:$("fName").value.trim(),id,category:$("fCategory").value,price:Number($("fPrice").value),fabric:$("fFabric").value.trim(),size:$("fSize").value.trim(),status:$("fStatus").value,badge:$("fBadge").value,description:$("fDesc").value.trim(),updatedAt:new Date().toISOString()};try{let imageUrl=$("fImageUrl").value.trim();let imageFile=$("fImageFile").files?.[0];if(imageFile){data.imageUrl=await fileToDataUrl(imageFile)}else if(imageUrl){data.imageUrl=imageUrl}if(editing)await setDoc(doc(db,"products",editing.id),data,{merge:true});else{let d=doc(db,"products",id);await setDoc(d,data)}close();await load();toast(editing?"Product updated":"Product added")}catch(x){console.error(x);toast(`Save failed: ${x?.code||x?.message||"unknown error"}`)}};
async function fileToDataUrl(file){
  if(!file) return "";
  return await new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const max=900, scale=Math.min(1,max/Math.max(img.width,img.height));
        const c=document.createElement("canvas");
        c.width=Math.max(1,Math.round(img.width*scale)); c.height=Math.max(1,Math.round(img.height*scale));
        c.getContext("2d").drawImage(img,0,0,c.width,c.height);
        const data=c.toDataURL("image/webp",0.72);
        if(data.length>850000) reject(new Error("Image is too large after compression. Please choose a smaller image."));
        else resolve(data);
      };
      img.onerror=()=>reject(new Error("Could not read image"));
      img.src=reader.result;
    };
    reader.onerror=()=>reject(reader.error||new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function close(){$("modal").classList.remove("open");editing=null;$('fImageFile').value=""}
$("addProduct").onclick=()=>openProduct();$("close").onclick=$("cancel").onclick=close;search.oninput=renderProducts;filter.onchange=renderProducts;
$("addCategory").onclick=()=>{let n=prompt("Category name?");if(!n)return;let s=prompt("Short description?")||"";let id=n.toLowerCase().trim().replace(/\s+/g,"-");setDoc(doc(db,"categories",id),{name:n,description:s,createdAt:new Date().toISOString()}).then(()=>{load();toast("Category added")})};
window.editCategory=async id=>{let c=categories.find(x=>x.id===id),n=prompt("Category name",c.name);if(!n)return;let s=prompt("Short description",c.description||"")||"";await setDoc(doc(db,"categories",id),{name:n,description:s},{merge:true});load();toast("Category updated")};
window.removeCategory=async id=>{if(confirm("Delete this category? Products assigned to it will remain, but category itself will be removed.")){await deleteDoc(doc(db,"categories",id));load();toast("Category deleted")}};
async function loadSettings(){let s=(await getDoc(doc(db,"settings","site"))).data()||{};brand.value=s.brandName||"Jaipur Prints";tagline.value=s.tagline||"";whatsapp.value=s.whatsapp||"";about.value=s.about||""}
settingsForm.onsubmit=async e=>{e.preventDefault();await setDoc(doc(db,"settings","site"),{brandName:brand.value,tagline:tagline.value,whatsapp:whatsapp.value.replace(/\D/g,""),about:about.value},{merge:true});toast("Settings saved")};
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));$(b.dataset.view+"View").classList.add("active");viewName.textContent=b.textContent.trim()});
logout.onclick=()=>signOut(auth);menu.onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
function toast(x){$("toast").textContent=x;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1800)}
