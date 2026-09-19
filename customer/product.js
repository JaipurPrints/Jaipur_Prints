import { SITE, CATEGORIES, PRODUCTS } from "./data.js";

const id = new URLSearchParams(location.search).get("id") || "BS-101";
const p = productById(id) || PRODUCTS[0];
let qty = 1;
let currentImage = 0;

const $ = (id) => document.getElementById(id);

function render() {
  $("crumbName").textContent = p.name;
  document.title = `${p.name} | ${SITE.brand}`;

  const images = Array.isArray(p.images) && p.images.length ? p.images : ["../assets/jaipur-prints-logo.jpg"];
  const safeIndex = Math.min(currentImage, images.length - 1);
  currentImage = safeIndex;

  $("productArea").innerHTML = `
    <div class="gallery">
      <div class="thumbs">
        ${images.map((im, i) => `
          <button type="button" class="${i === currentImage ? "selected" : ""}" data-action="image" data-index="${i}">
            <img src="${im}" alt="${p.name} image ${i + 1}" onerror="this.src='../assets/jaipur-prints-logo.jpg'">
          </button>`).join("")}
      </div>
      <div class="main-photo">
        <img id="mainImg" src="${images[currentImage]}" alt="${p.name}" onerror="this.src='../assets/jaipur-prints-logo.jpg'">
        <button type="button" class="zoom" data-action="zoom" aria-label="Zoom product image">＋</button>
      </div>
    </div>

    <div class="info">
      <div class="topline">
        <span class="eyebrow">${categoryName(p.cat)}</span>
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
      </div>
      <h1>${p.name}</h1>
      <div class="id">PRODUCT ID · ${p.id}</div>
      <div class="price">${money(p.price)}</div>
      <p class="desc">${p.desc || ""}</p>

      <div class="specs">
        <div><small>FABRIC</small><b>${p.fabric || "—"}</b></div>
        <div><small>SIZE</small><b>${p.size || "—"}</b></div>
        <div><small>AVAILABILITY</small><b class="available">● ${p.availability || "Available"}</b></div>
      </div>

      <div class="quantity">
        <span>Quantity</span>
        <div>
          <button type="button" data-action="qty" data-change="-1">−</button>
          <b>${qty}</b>
          <button type="button" data-action="qty" data-change="1">+</button>
        </div>
      </div>

      <a class="order" href="${waLink(p, qty)}" target="_blank" rel="noopener noreferrer">
        Order on WhatsApp <span>↗</span>
      </a>

      <button type="button" class="share" id="shareProductBtn">
        ↗ Share product
      </button>
      <p class="order-note">Product details are pre-filled in WhatsApp.</p>
    </div>`;

  $("relatedGrid").innerHTML = PRODUCTS
    .filter(x => x.cat === p.cat && x.id !== p.id)
    .slice(0, 3)
    .map(x => `
      <a class="related-card" href="product.html?id=${encodeURIComponent(x.id)}">
        <img src="${(x.images && x.images[0]) || "../assets/jaipur-prints-logo.jpg"}" alt="${x.name}" onerror="this.src='../assets/jaipur-prints-logo.jpg'">
        <div><span>${x.id}</span><b>${x.name}</b><strong>${money(x.price)}</strong></div>
      </a>`).join("");

  renderTab("description");
  $("shareProductBtn").addEventListener("click", shareProduct);
}

function setImage(i) {
  currentImage = Number(i) || 0;
  render();
}

function zoom() {
  const img = $("mainImg");
  if (img) img.classList.toggle("zoomed");
}

function changeQty(d) {
  qty = Math.max(1, qty + Number(d));
  render();
}

async function copyProductLink() {
  const url = location.href;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
    } else {
      const area = document.createElement("textarea");
      area.value = url;
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.focus();
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    alert("Product link copied! You can now share it with anyone.");
  } catch (error) {
    console.error("Copy failed:", error);
    alert("Copy was blocked by the browser. Please copy the product link from the address bar.");
  }
}

async function shareProduct() {
  const shareData = {
    title: p.name,
    text: `${p.name} · ${money(p.price)} | Jaipur Prints`,
    url: location.href
  };

  try {
    if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
      await navigator.share(shareData);
      return;
    }
  } catch (error) {
    // User cancelled native share; don't show an error.
    if (error && error.name === "AbortError") return;
  }

  await copyProductLink();
}

function renderTab(t) {
  document.querySelectorAll(".tab").forEach(b =>
    b.classList.toggle("active", b.dataset.tab === t)
  );
  $("tabContent").innerHTML =
    t === "description" ? (p.desc || "") :
    t === "care" ? `Fabric: ${p.fabric || "—"}. Size: ${p.size || "—"}. Confirm care instructions and variants with us on WhatsApp.` :
    `Select quantity and tap Order on WhatsApp. Product name, ID, category, price and quantity will be included.`;
}

document.querySelectorAll(".tab").forEach(b =>
  b.addEventListener("click", () => renderTab(b.dataset.tab))
);

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "image") setImage(button.dataset.index);
  if (action === "zoom") zoom();
  if (action === "qty") changeQty(button.dataset.change);
});

// Product page is an ES module, so expose only the menu helper needed by the HTML.
window.toggleMenu = () => $("mobile")?.classList.toggle("open");

topWa.href = waBase();
footerWa.href = waBase();
render();
