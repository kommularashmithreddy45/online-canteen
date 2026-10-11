// Session verification
const user = getUser();
if (!user || user.role !== "OWNER") {
    window.location.href = "index.html";
}

let isBackendLive = false;

async function loadOwnerOrders() {
    let orders = [];

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(`${API_BASE}/orders`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
            orders = await res.json();
            isBackendLive = true;
            updateConnectionBadge(true);
        } else {
            throw new Error();
        }
    } catch (err) {
        // Fallback to local storage orders
        orders = JSON.parse(localStorage.getItem("canteen_orders") || "[]");
        isBackendLive = false;
        updateConnectionBadge(false);
    }

    // Summary metrics
    const activeCount = orders.filter(o => o.status === "PENDING" || o.status === "PREPARING").length;
    const statActive = document.getElementById("statActive");
    const statTotal = document.getElementById("statTotal");
    if (statActive) statActive.innerText = activeCount;
    if (statTotal) statTotal.innerText = orders.length;

    const container = document.getElementById("ownerOrdersContainer");
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = "<p style='color:gray; text-align:center; padding: 30px;'>No orders received yet today. Open the student view to place an order!</p>";
        return;
    }

    container.innerHTML = orders.map(ord => {
        const time = new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const itemsHtml = (ord.items || []).map(it => `
            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; padding: 2px 0;">
                <span>• <b>${it.itemName}</b> × ${it.quantity}</span>
                <span>₹${it.subtotal}</span>
            </div>
        `).join("");

        return `
            <div class="order-card">
                <div class="order-card-header">
                    <div>
                        <span style="font-weight: 800; font-size: 1.05rem;">Order #${ord.id}</span>
                        <span style="color: gray; margin-left: 6px;">(${ord.studentName} - ${ord.collegeId})</span>
                    </div>
                    <span class="status-badge status-${ord.status}">${ord.status}</span>
                </div>

                <div style="background: #fafafa; padding: 8px 12px; border-radius: 8px; margin: 8px 0;">
                    ${itemsHtml}
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.8rem; color: gray;">Placed at: ${time}</span>
                    <span style="font-weight: 800; color: var(--zepto-purple);">Bill: ₹${ord.totalAmount}</span>
                </div>

                <!-- Action buttons based on status -->
                <div class="order-actions">
                    ${ord.status === 'PENDING' 
                        ? `<button class="action-btn btn-prep" onclick="updateOrderStatus(${ord.id}, 'PREPARING')">🍳 Start Preparing</button>` 
                        : ''
                    }
                    ${ord.status === 'PREPARING' 
                        ? `<button class="action-btn btn-ready" onclick="updateOrderStatus(${ord.id}, 'READY')">🔔 Mark Ready for Pickup</button>` 
                        : ''
                    }
                    ${ord.status === 'READY' 
                        ? `<button class="action-btn btn-done" onclick="updateOrderStatus(${ord.id}, 'COMPLETED')">✅ Mark Completed</button>` 
                        : ''
                    }
                    ${ord.status === 'COMPLETED'
                        ? `<span style="font-size:0.8rem; color:gray; padding: 4px;">Order Fulfilled</span>`
                        : ''
                    }
                </div>
            </div>
        `;
    }).join("");
}

async function updateOrderStatus(orderId, status) {
    if (isBackendLive) {
        try {
            const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                loadOwnerOrders();
                return;
            }
        } catch (err) {
            console.error("Backend error updating status", err);
        }
    }

    // LocalStorage fallback update
    const orders = JSON.parse(localStorage.getItem("canteen_orders") || "[]");
    const target = orders.find(o => o.id === orderId);
    if (target) {
        target.status = status;
        localStorage.setItem("canteen_orders", JSON.stringify(orders));
        loadOwnerOrders();
    }
}

function updateConnectionBadge(isLive) {
    let badge = document.getElementById("ownerConnectionBadge");
    if (!badge) {
        badge = document.createElement("div");
        badge.id = "ownerConnectionBadge";
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

// Multi-tab sync in standalone mode
window.addEventListener("storage", (e) => {
    if (e.key === "canteen_orders") {
        loadOwnerOrders();
    }
});

// Initial load + poll every 3 seconds for real-time kitchen updates
loadOwnerOrders();
setInterval(loadOwnerOrders, 3000);
