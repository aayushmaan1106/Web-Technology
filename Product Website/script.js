// ShopEase - script.js
// Product data (used by the cart and the details popup)
const products = [
  {
    "id": 1,
    "name": "Wireless Headphones",
    "cat": "Electronics",
    "price": 2499,
    "desc": "Over-ear Bluetooth headphones with deep bass and 20 hours of battery life.",
    "img": "images/p1.svg"
  },
  {
    "id": 2,
    "name": "Smart Watch",
    "cat": "Electronics",
    "price": 3999,
    "desc": "Track steps, heart rate and notifications with a bright AMOLED display.",
    "img": "images/p2.svg"
  },
  {
    "id": 3,
    "name": "Bluetooth Speaker",
    "cat": "Electronics",
    "price": 1799,
    "desc": "Portable water-resistant speaker with clear sound and 12 hours of playtime.",
    "img": "images/p3.svg"
  },
  {
    "id": 4,
    "name": "Cotton T-Shirt",
    "cat": "Clothing",
    "price": 599,
    "desc": "Soft, breathable 100% cotton tee in a relaxed everyday fit.",
    "img": "images/p4.svg"
  },
  {
    "id": 5,
    "name": "Denim Jacket",
    "cat": "Clothing",
    "price": 1999,
    "desc": "Classic mid-wash denim jacket with sturdy stitching and two chest pockets.",
    "img": "images/p5.svg"
  },
  {
    "id": 6,
    "name": "Running Shoes",
    "cat": "Clothing",
    "price": 2299,
    "desc": "Lightweight shoes with a cushioned sole for daily runs and long walks.",
    "img": "images/p6.svg"
  },
  {
    "id": 7,
    "name": "Canvas Tote Bag",
    "cat": "Accessories",
    "price": 799,
    "desc": "Roomy canvas tote with an inner zip pocket, made for books and groceries.",
    "img": "images/p7.svg"
  },
  {
    "id": 8,
    "name": "Sunglasses",
    "cat": "Accessories",
    "price": 999,
    "desc": "UV400 polarised sunglasses with a lightweight frame that sits comfortably.",
    "img": "images/p8.svg"
  }
];

let cart = {};          // { productId: quantity }
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const money = (n) => "₹" + n.toLocaleString("en-IN");
const findProduct = (id) => products.find((p) => p.id === Number(id));

/* ---------- Storage helpers ---------- */
function loadCart() {
  try { cart = JSON.parse(localStorage.getItem("shopeaseCart")) || {}; } catch (e) { cart = {}; }
}
function saveCart() { localStorage.setItem("shopeaseCart", JSON.stringify(cart)); }

/* ---------- Toast message ---------- */
let toastTimer;
function showToast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- Feature 4 and 5: cart ---------- */
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  showToast(findProduct(id).name + " added to cart");
}
function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}
function removeItem(id) {
  delete cart[id];
  saveCart();
  renderCart();
}
function renderCart() {
  const box = $("#cartItems");
  let count = 0, total = 0, html = "";
  Object.keys(cart).forEach((id) => {
    const p = findProduct(id);
    if (!p) return;
    const qty = cart[id];
    count += qty;
    total += p.price * qty;
    html += `<div class="cart-row">
      <img src="${p.img}" alt="">
      <div><strong>${p.name}</strong><br><span>${money(p.price)} each</span>
        <div class="qty"><button type="button" data-act="minus" data-id="${id}" aria-label="Decrease quantity">−</button>
        <span>${qty}</span>
        <button type="button" data-act="plus" data-id="${id}" aria-label="Increase quantity">+</button></div></div>
      <div class="row-end"><strong>${money(p.price * qty)}</strong>
        <button type="button" class="link-btn" data-act="remove" data-id="${id}">Remove</button></div>
    </div>`;
  });
  box.innerHTML = html || '<p class="empty">Your cart is empty. Add a product to get started.</p>';
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);
}
function openCart(open) {
  $("#cartPanel").classList.toggle("open", open);
  $("#overlay").classList.toggle("show", open);
}

/* ---------- Feature 7: product details popup ---------- */
let modalId = null;
function openModal(id) {
  const p = findProduct(id);
  modalId = id;
  $("#mImg").src = p.img;
  $("#mImg").alt = p.name;
  $("#mCat").textContent = p.cat;
  $("#mName").textContent = p.name;
  $("#mPrice").textContent = money(p.price);
  $("#mDesc").textContent = p.desc;
  $("#modal").classList.add("show");
  $("#overlay").classList.add("show");
}
function closeModal() {
  $("#modal").classList.remove("show");
  $("#overlay").classList.remove("show");
}

/* ---------- Feature 8: dark mode ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  $("#themeBtn").textContent = theme === "dark" ? "☀️" : "🌙";
}

/* ---------- Features 2 and 3: search + category filter ---------- */
let activeFilter = "All";
function filterProducts() {
  const box = $("#searchBox");
  const term = box ? box.value.trim().toLowerCase() : "";
  let visible = 0;
  $$("#productGrid .card").forEach((card) => {
    const nameMatch = card.dataset.name.toLowerCase().includes(term);
    const catMatch = activeFilter === "All" || card.dataset.cat === activeFilter;
    const show = nameMatch && catMatch;
    card.hidden = !show;
    if (show) visible++;
  });
  $("#emptyMsg").hidden = visible > 0;
}

/* ---------- Feature 6: contact form validation ---------- */
function setError(input, message) {
  input.parentElement.querySelector(".err").textContent = message;
  input.classList.toggle("invalid", message !== "");
}
function validateForm() {
  let ok = true;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  ["fullName", "email", "phone", "subject", "message"].forEach((id) => {
    const input = document.getElementById(id);
    const value = input.value.trim();
    let msg = "";
    if (value === "") msg = "This field is required.";
    else if (id === "email" && !emailPattern.test(value)) msg = "Enter a valid email, like name@example.com.";
    else if (id === "phone" && !/^[0-9+\s-]{7,15}$/.test(value)) msg = "Enter a valid phone number (7 to 15 digits).";
    setError(input, msg);
    if (msg) ok = false;
  });
  return ok;
}

/* ---------- Setup ---------- */
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  renderCart();
  applyTheme(localStorage.getItem("shopeaseTheme") || "light");

  // Mobile menu
  $("#menuBtn").addEventListener("click", () => $("#mainNav").classList.toggle("open"));

  // Theme toggle
  $("#themeBtn").addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("shopeaseTheme", next);
    applyTheme(next);
  });

  // Cart panel
  $("#cartBtn").addEventListener("click", () => openCart(true));
  $("#closeCart").addEventListener("click", () => openCart(false));
  $("#clearCart").addEventListener("click", () => { cart = {}; saveCart(); renderCart(); });
  $("#cartItems").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]");
    if (!b) return;
    const id = b.dataset.id;
    if (b.dataset.act === "plus") changeQty(id, 1);
    if (b.dataset.act === "minus") changeQty(id, -1);
    if (b.dataset.act === "remove") removeItem(id);
  });

  // Overlay and modal
  $("#overlay").addEventListener("click", () => { closeModal(); openCart(false); });
  $("#closeModal").addEventListener("click", closeModal);
  $("#mAdd").addEventListener("click", () => { addToCart(modalId); closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); openCart(false); } });

  // Product cards (Add to Cart and View Details)
  $$(".card").forEach((card) => {
    card.querySelector(".add-btn").addEventListener("click", () => addToCart(card.dataset.id));
    card.querySelector(".view-btn").addEventListener("click", () => openModal(card.dataset.id));
  });

  // Feature 1: Shop Now
  const shop = $("#shopNow");
  if (shop) shop.addEventListener("click", () => $("#featured").scrollIntoView({ behavior: "smooth" }));

  // Features 2 and 3 (Products page)
  const search = $("#searchBox");
  if (search) {
    search.addEventListener("input", filterProducts);
    $$(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        activeFilter = chip.dataset.filter;
        $$(".chip").forEach((c) => c.classList.toggle("active", c === chip));
        filterProducts();
      });
    });
    const wanted = new URLSearchParams(location.search).get("cat");
    const match = wanted && document.querySelector(`.chip[data-filter="${wanted}"]`);
    if (match) match.click();
  }

  // Feature 6 (Contact page)
  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = $("#formMsg");
      if (validateForm()) {
        msg.textContent = "Thank you! Your message has been sent. We will reply within two working days.";
        msg.className = "form-msg ok";
        form.reset();
      } else {
        msg.textContent = "Please fix the highlighted fields and submit again.";
        msg.className = "form-msg bad";
      }
    });
    form.addEventListener("reset", () => {
      $$(".err").forEach((s) => (s.textContent = ""));
      $$("#contactForm input, #contactForm textarea").forEach((i) => i.classList.remove("invalid"));
      $("#formMsg").textContent = "";
    });
  }
});
