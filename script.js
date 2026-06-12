// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTS DATA
// ═══════════════════════════════════════════════════════════════════════════════

const products = [
  {
    id: 1,
    sku: "BK-001",
    name: "Ланцюг для бензопили 0.325\" x 1.3 мм",
    category: "Ланцюги",
    emoji: "⛓️",
    desc: "Оригінальний ланцюг для бензопил. Довговічність 50+ годин роботи.",
    price: 450
  },
  {
    id: 2,
    sku: "BK-002",
    name: "Фільтр паливний для бензокос",
    category: "Фільтри",
    emoji: "🔧",
    desc: "Залізний фільтр. Захист від забруднення пального.",
    price: 120
  },
  {
    id: 3,
    sku: "BK-003",
    name: "Масло синтетичне для двигуна 2л",
    category: "Масло",
    emoji: "🛢️",
    desc: "Высокоякісне синтетичне масло. Термостійкість до 120°C.",
    price: 280
  },
  {
    id: 4,
    sku: "BK-004",
    name: "Свічка запалювання",
    category: "Запалювання",
    emoji: "✨",
    desc: "Оригінальна свічка L7T. Гарантія якості.",
    price: 85
  },
  {
    id: 5,
    sku: "BK-005",
    name: "Леза для тріммера (10шт)",
    category: "Ліски та ліза",
    emoji: "🌾",
    desc: "Комплект з 10 пластикових ліз. Легка заміна.",
    price: 150
  },
  {
    id: 6,
    sku: "BK-006",
    name: "Карбюратор для бензопили",
    category: "Карбюратори",
    emoji: "⚙️",
    desc: "Універсальний карбюратор з регулюванням.",
    price: 520
  },
  {
    id: 7,
    sku: "BK-007",
    name: "Повітряний фільтр для тріммера",
    category: "Фільтри",
    emoji: "💨",
    desc: "Поролоновий фільтр. Легко чистити.",
    price: 95
  },
  {
    id: 8,
    sku: "BK-008",
    name: "Бензо-масло мішанка 1л",
    category: "Масло",
    emoji: "🛢️",
    desc: "Готова суміш 1:50 для 2-тактних двигунів.",
    price: 180
  },
  {
    id: 9,
    sku: "BK-009",
    name: "Стартер для бензокос",
    category: "Запалювання",
    emoji: "🔌",
    desc: "Автоматичний стартер. Легкий запуск.",
    price: 310
  },
  {
    id: 10,
    sku: "BK-010",
    name: "Ланцюг для бензопили 0.404\"",
    category: "Ланцюги",
    emoji: "⛓️",
    desc: "Проф. ланцюг 0.404\" x 1.6мм. Для важких робіт.",
    price: 680
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// CART STATE & RENDER CART
// ═══════════════════════════════════════════════════════════════════════════════

let cart = [];

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`✓ ${product.name} додано в кошик`, 'ok');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function updateQty(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    updateCartUI();
  }
}

function updateCartUI() {
  const cartBadge = document.getElementById('cartBadge');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartFilled = document.getElementById('cartFilled');
  const cartList = document.getElementById('cartList');

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartBadge.textContent = totalQty;

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartFilled.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartFilled.style.display = 'block';

    cartList.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-icon">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-sku">${item.sku}</div>
          <div class="qty-row">
            <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
            <div class="qty-val">${item.qty}</div>
            <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <div class="cart-item-price">${(item.price * item.qty).toLocaleString('uk-UA')} ₴</div>
        <button class="btn-remove" onclick="removeFromCart(${item.id})">✕</button>
      </div>
    `).join('');

    const summaryQty = document.getElementById('summaryQty');
    const summaryTotal = document.getElementById('summaryTotal');
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    summaryQty.textContent = `${totalQty} шт.`;
    summaryTotal.textContent = `${totalPrice.toLocaleString('uk-UA')} ₴`;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CART DRAWER
// ═══════════════════════════════════════════════════════════════════════════════

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTS GRID RENDER
// ═══════════════════════════════════════════════════════════════════════════════

let filteredProducts = [...products];

function renderProducts(items) {
  const grid = document.getElementById('productsGrid');

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <div>Товари не знайдені. Спробуйте інший пошук.</div>
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(product => `
    <div class="product-card">
      <div class="product-thumb">
        ${product.emoji}
        <div class="product-cat-tag">${product.category}</div>
      </div>
      <div class="product-body">
        <div class="product-sku">${product.sku}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="product-footer">
          <div class="product-price">
            ${product.price.toLocaleString('uk-UA')}
            <span class="product-price-unit">₴</span>
          </div>
          <button class="btn-add" onclick="addToCart(${product.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Додати
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILTERS & SEARCH
// ═══════════════════════════════════════════════════════════════════════════════

function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const priceMin = parseInt(document.getElementById('priceMin').value) || 0;
  const priceMax = parseInt(document.getElementById('priceMax').value) || Infinity;

  const activeCat = Array.from(document.querySelectorAll('.filter-btn.active'))
    .map(btn => btn.textContent.trim());

  filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm) || 
                        product.sku.toLowerCase().includes(searchTerm);
    const matchPrice = product.price >= priceMin && product.price <= priceMax;
    const matchCat = activeCat.length === 0 || activeCat.includes(product.category);

    return matchSearch && matchPrice && matchCat;
  });

  renderProducts(filteredProducts);

  const count = document.getElementById('productCountLabel');
  count.textContent = filteredProducts.length > 0 ? `(${filteredProducts.length})` : '(0)';
}

function toggleCategoryFilter(category) {
  const buttons = document.querySelectorAll('.filter-btn');
  let hasActive = false;

  buttons.forEach(btn => {
    if (btn.textContent.trim() === category) {
      btn.classList.toggle('active');
    }
    if (btn.classList.contains('active')) hasActive = true;
  });

  applyFilters();
}

// ═══════════════════════════════════════════════════════════════════════════════
// INIT: Render category filters and products
// ═══════════════════════════════════════════════════════════════════════════════

function init() {
  // Create category filter buttons
  const categories = [...new Set(products.map(p => p.category))];
  const catFiltersContainer = document.getElementById('catFilters');

  catFiltersContainer.innerHTML = categories.map(cat => 
    `<button class="filter-btn" onclick="toggleCategoryFilter('${cat}')">${cat}</button>`
  ).join('');

  // Render all products
  renderProducts(products);

  // Update count
  document.getElementById('productCountLabel').textContent = `(${products.length})`;

  // Init cart
  updateCartUI();
}

// Run on page load
document.addEventListener('DOMContentLoaded', init);

// ═══════════════════════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function showToast(message, type = 'default') {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKOUT
// ═══════════════════════════════════════════════════════════════════════════════

function checkout() {
  if (cart.length === 0) {
    showToast('Кошик порожній', 'fail');
    return;
  }

  // Get form values
  const name = document.getElementById('customerName')?.value.trim();
  const phone = document.getElementById('customerPhone')?.value.trim();
  const city = document.getElementById('customerCity')?.value;
  const dept = document.getElementById('customerDept')?.value.trim();

  // Validate
  if (!name || !phone || !city || !dept) {
    showToast('Заповніть усі поля', 'fail');
    return;
  }

  // Honeypot check
  const honeypot = document.getElementById('honeypot')?.value;
  if (honeypot) {
    // Silently fail bot submission
    showToast('✓ Замовлення обробляється...', 'ok');
    return;
  }

  // Simulate order submission
  showToast('✓ Замовлення розміщено!', 'ok');

  // Show success modal
  const modal = document.querySelector('.modal-bg');
  const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  document.querySelector('.modal-order').textContent = orderNumber;
  modal.classList.add('open');

  // Reset cart
  setTimeout(() => {
    cart = [];
    updateCartUI();
    closeCart();
    modal.classList.remove('open');
    
    // Reset form
    document.getElementById('checkoutForm')?.reset();
  }, 3000);
}

// OK button in modal
function closeModal() {
  document.querySelector('.modal-bg').classList.remove('open');
}
