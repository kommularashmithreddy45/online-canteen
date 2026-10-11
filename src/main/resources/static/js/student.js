const DEFAULT_MENU = [
    { id: 1, name: "Crispy Samosa (2 pcs)", category: "Snacks", price: 30.0, description: "Fresh spiced potato filling with tamarind chutney", emoji: "🥟", available: true },
    { id: 2, name: "Masala Dosa", category: "Meals", price: 70.0, description: "Crisp golden crepe with spiced potato filling & coconut chutney", emoji: "🥞", available: true },
    { id: 3, name: "Cold Coffee", category: "Beverages", price: 50.0, description: "Thick creamy chilled coffee with chocolate drizzle", emoji: "🧋", available: true },
    { id: 4, name: "Veg Cheese Burger", category: "Snacks", price: 65.0, description: "Crispy veggie patty with molten cheese & house sauce", emoji: "🍔", available: true },
    { id: 5, name: "Paneer Kathi Roll", category: "Snacks", price: 80.0, description: "Spiced paneer cubes rolled in crisp flaky paratha", emoji: "🌯", available: true },
    { id: 6, name: "Special Thali", category: "Meals", price: 110.0, description: "2 Rotis, Paneer Sabzi, Dal, Jeera Rice, Gulab Jamun", emoji: "🍱", available: true },
    { id: 7, name: "Kulhad Masala Chai", category: "Beverages", price: 20.0, description: "Cardamom-ginger infused piping hot tea in earthen cup", emoji: "☕", available: true },
    { id: 8, name: "Veg Hakka Noodles", category: "Meals", price: 75.0, description: "Wok-tossed noodles with bell peppers and crunchies", emoji: "🍜", available: true }
];

let allMenuItems = [];
let cart = {}; // { itemId: { item, qty } }
let currentCategory = "All";
let isBackendLive = false;

// Verify student session
const user = getUser();
if (!user || user.role !== "STUDENT") {
    window.location.href = "index.html";
}

const greetingEl = document.getElementById("studentGreeting");
if (greetingEl && user) {
    greetingEl.innerText = `👋 ${user.fullName} (${user.collegeId})`;
}

// Fetch Menu with auto-fallback
async function fetchMenu() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(`${API_BASE}/menu`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
            allMenuItems = await res.json();
            isBackendLive = true;
            updateConnectionStatus(true);
        } else {
            throw new Error("Backend response error");
        }
    } catch (err) {
        console.log("Using local menu fallback");
        allMenuItems = DEFAULT_MENU;
        isBackendLive = false;
        updateConnectionStatus(false);
    }
    renderMenu();
}

function updateConnectionStatus(isLive) {
    let badge = document.getElementById("connectionStatusBadge");
    if (!badge) {
        badge = document.createElement("div");
        badge.id = "connectionStatusBadge";
        badge.style.cssText = "font-size:0.75rem; padding:4px 10px; border-radius:12px; margin-left:10px; font-weight:bold;";
        const brandBadge = document.querySelector(".brand-badge");
        if (brandBadge) brandBadge.appendChild(badge);
    }
    if (isLive) {
        badge.style.background = "#e8f5e9";
        badge.style.color = "#0c831f";
        badge.innerText = "🟢 Spring Boot Live";
    } else {
        badge.style.background = "#fff3cd";
        badge.style.color = "#856404";
        badge.innerText = "🟡 Standalone Mode";
    }
}

function renderMenu() {
    const grid = document.getElementById("menuGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const filtered = currentCategory === "All" 
        ? allMenuItems 
        : allMenuItems.filter(item => item.category === currentCategory);

    filtered.forEach(item => {
        const qty = cart[item.id] ? cart[item.id].qty : 0;
        const card = document.createElement("div");
        card.className = "food-card";
        card.innerHTML = `
            <div class="food-emoji">${item.emoji || '🍴'}</div>
            <div class="food-title">${item.name}</div>
            <div class="food-desc">${item.description || ''}</div>
            <div class="food-bottom">
                <div class="food-price">₹${item.price}</div>
                <div id="btn-container-${item.id}">
                    ${qty === 0 
                        ? `<button class="btn-add" onclick="addToCart(${item.id})">+ ADD</button>`
                        : `<div class="qty-control">
                               <button onclick="updateQty(${item.id}, -1)">-</button>
                               <span>${qty}</span>
                               <button onclick="updateQty(${item.id}, 1)">+</button>
                           </div>`
                    }
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll(".category-scroller .cat-chip").forEach(c => c.classList.remove("active"));
    if (window.event && window.event.target) {
        window.event.target.classList.add("active");
    }
    renderMenu();
}

function addToCart(itemId) {
    const item = allMenuItems.find(i => i.id === itemId);
    if (!item) return;
    cart[itemId] = { item, qty: 1 };
    renderMenu();
    updateCartBar();
}

function updateQty(itemId, delta) {
    if (!cart[itemId]) return;
    cart[itemId].qty += delta;
    if (cart[itemId].qty <= 0) {
        delete cart[itemId];
    }
    renderMenu();
    updateCartBar();
    renderCartModalItems();
}

function updateCartBar() {
    const cartBar = document.getElementById("cartBar");
    const countSpan = document.getElementById("cartCount");
    const totalSpan = document.getElementById("cartTotal");

    const items = Object.values(cart);
    const totalCount = items.reduce((sum, entry) => sum + entry.qty, 0);
    const totalPrice = items.reduce((sum, entry) => sum + (entry.item.price * entry.qty), 0);

    if (totalCount > 0) {
        cartBar.style.display = "flex";
        countSpan.innerText = `${totalCount} ITEM${totalCount > 1 ? 'S' : ''}`;
        totalSpan.innerText = `₹${totalPrice}`;
    } else {
        cartBar.style.display = "none";
        closeCartModal();
    }
}

function openCartModal() {
    document.getElementById("cartModal").classList.add("active");
    renderCartModalItems();
}

function closeCartModal() {
    document.getElementById("cartModal").classList.remove("active");
}

function renderCartModalItems() {
    const container = document.getElementById("cartItemsContainer");
    if (!container) return;
    container.innerHTML = "";
    const items = Object.values(cart);
    let total = 0;

    items.forEach(({ item, qty }) => {
        const itemTotal = item.price * qty;
        total += itemTotal;
        const row = document.createElement("div");
        row.className = "bill-item";
        row.innerHTML = `
            <span>${item.name} × ${qty}</span>
            <span><b>₹${itemTotal}</b></span>
        `;
        container.appendChild(row);
    });

    document.getElementById("modalTotal").innerText = `₹${total}`;
}

// Submit Order (supports live backend + local demo persistence)
async function submitOrder() {
    const itemsPayload = Object.values(cart).map(({ item, qty }) => ({
        menuItemId: item.id,
        quantity: qty
    }));

    if (itemsPayload.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const btn = document.getElementById("placeOrderBtn");
    btn.innerText = "Placing Order...";
    btn.disabled = true;

    if (isBackendLive) {
        try {
            const res = await fetch(`${API_BASE}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    collegeId: user.collegeId,
                    items: itemsPayload
                })
            });

            if (res.ok) {
                cart = {};
                updateCartBar();
                closeCartModal();
                alert("Order placed successfully! Check status in 'My Orders'.");
                switchView("orders");
                return;
            }
        } catch (err) {
            console.log("Backend failed, saving locally instead");
        }
    }

    // Local / Offline demo mode order saving
    const savedOrders = JSON.parse(localStorage.getItem("canteen_orders") || "[]");
    let total = 0;
    const formattedItems = Object.values(cart).map(({ item, qty }) => {
        const sub = item.price * qty;
        total += sub;
        return {
            id: Date.now() + Math.random(),
            itemName: item.name,
            price: item.price,
            quantity: qty,
            subtotal: sub
        };
    });

    const newOrder = {
        id: savedOrders.length + 101,
        collegeId: user.collegeId,
        studentName: user.fullName,
        totalAmount: total,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        items: formattedItems
    };

    savedOrders.unshift(newOrder);
    localStorage.setItem("canteen_orders", JSON.stringify(savedOrders));

    cart = {};
    updateCartBar();
    closeCartModal();
    alert(`Order #${newOrder.id} placed successfully! Token generated.`);
    switchView("orders");

    btn.innerText = "Place Order & Get Token";
    btn.disabled = false;
}

// Load Orders (supports live backend + local demo persistence)
async function loadMyOrders() {
    const list = document.getElementById("myOrdersList");
    if (!list) return;

    let orders = [];

    if (isBackendLive) {
        try {
            const res = await fetch(`${API_BASE}/orders/student/${user.collegeId}`);
            if (res.ok) {
                orders = await res.json();
            }
        } catch (err) {
            console.error("Live fetch failed, loading local orders");
        }
    }

    // Fallback to local storage orders if empty or offline
    if (orders.length === 0) {
        const allLocal = JSON.parse(localStorage.getItem("canteen_orders") || "[]");
        orders = allLocal.filter(o => o.collegeId === user.collegeId);
    }

    if (orders.length === 0) {
        list.innerHTML = `<p style="color: gray; text-align: center; margin-top: 30px;">No active orders found.</p>`;
        return;
    }

    list.innerHTML = orders.map(ord => {
        const time = new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const itemsSummary = (ord.items || []).map(it => `${it.itemName} (${it.quantity})`).join(", ");
        return `
            <div class="order-card">
                <div class="order-card-header">
                    <b>Order #${ord.id} • ${time}</b>
                    <span class="status-badge status-${ord.status}">${ord.status}</span>
                </div>
                <div style="font-size: 0.85rem; color: #555; margin-bottom: 8px;">${itemsSummary}</div>
                <div style="font-weight: 800; color: var(--zepto-purple);">Total: ₹${ord.totalAmount}</div>
            </div>
        `;
    }).join("");
}

function switchView(view) {
    if (view === "menu") {
        document.getElementById("menuSection").style.display = "block";
        document.getElementById("categoryBar").style.display = "flex";
        document.getElementById("ordersSection").style.display = "none";
        document.getElementById("tabMenuBtn").classList.add("active");
        document.getElementById("tabOrdersBtn").classList.remove("active");
    } else {
        document.getElementById("menuSection").style.display = "none";
        document.getElementById("categoryBar").style.display = "none";
        document.getElementById("ordersSection").style.display = "block";
        document.getElementById("tabMenuBtn").classList.remove("active");
        document.getElementById("tabOrdersBtn").classList.add("active");
        loadMyOrders();
    }
}

// Auto-refresh orders every 3 seconds for live updates
setInterval(() => {
    const ordersSec = document.getElementById("ordersSection");
    if (ordersSec && ordersSec.style.display === "block") {
        loadMyOrders();
    }
}, 3000);

// Multi-tab sync in standalone mode
window.addEventListener("storage", (e) => {
    if (e.key === "canteen_orders") {
        loadMyOrders();
    }
});

fetchMenu();
