const products = [
  { id: 1, name: "Laptop", price: 10000000, img: "Laptop.png" },
  {
    id: 2,
    name: "Headphone",
    price: 8000000,
    img: "hp.png",
  },
  {
    id: 3,
    name: "Keyboard",
    price: 300000,
    img: "keyboard.png",
  },
  { id: 4, name: "Mouse", price: 100000, img: "mouse.png" },
  {
    id: 5,
    name: "Monitor",
    price: 20000000,
    img: "monitor.png",
  },
];

let cart = [];

const productList = document.getElementById("productList");
const cartList = document.getElementById("cartList");
const totalEl = document.getElementById("total");
const badge = document.getElementById("badge");
const checkoutBtn = document.getElementById("checkoutBtn");

// Render produk
function renderProducts() {
  productList.innerHTML = products
    .map(
      (p) => `
    <div class="card">
      <img src="${p.img}">
      <h4>${p.name}</h4>
      <p class="price">Rp ${p.price.toLocaleString()}</p>
      <button class="add" onclick="addToCart(${p.id})">Tambah ke Keranjang</button>
    </div>
  `,
    )
    .join("");
}

// Tambah ke cart
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const item = cart.find((c) => c.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
}

// Kurangi qty
function decrease(id) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;

  item.qty--;
  if (item.qty <= 0) {
    cart = cart.filter((c) => c.id !== id);
  }

  renderCart();
}

// Tambah qty
function increase(id) {
  const item = cart.find((c) => c.id === id);
  if (item) item.qty++;

  renderCart();
}

// Hapus item
function removeItem(id) {
  cart = cart.filter((c) => c.id !== id);
  renderCart();
}

// Render cart
function renderCart() {
  cartList.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;
    count += item.qty;

    cartList.innerHTML += `
      <div class="cart-item">
        <div>
          ${item.name}<br>
          Rp ${item.price.toLocaleString()}
        </div>

        <div class="qty">
          <button onclick="decrease(${item.id})">-</button>
          ${item.qty}
          <button onclick="increase(${item.id})">+</button>
        </div>

        <button class="remove" onclick="removeItem(${item.id})">X</button>
      </div>
    `;
  });

  totalEl.innerText = "Total: Rp " + total.toLocaleString();
  badge.innerText = count;
}

// Checkout
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }

  let summary = "=== ORDER ===\n";
  let total = 0;

  cart.forEach((item) => {
    summary += `${item.name} x${item.qty} = Rp ${(item.price * item.qty).toLocaleString()}\n`;
    total += item.price * item.qty;
  });

  summary += "\nTOTAL: Rp " + total.toLocaleString();

  alert(summary);

  cart = [];
  renderCart();
});

// init
renderProducts();
renderCart();
