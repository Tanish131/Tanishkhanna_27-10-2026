
let products = [
    { id: 1, name: "Leather Tote Bag", category: "Bags", price: 6499, image: "👜" },
    { id: 2, name: "Office Briefcase", category: "Bags", price: 8999, image: "💼" },
    { id: 3, name: "Leather Backpack", category: "Bags", price: 5499, image: "🎒" },
    { id: 4, name: "Formal Oxford Shoes", category: "Shoes", price: 4999, image: "👞" },
    { id: 5, name: "Casual Sneakers", category: "Shoes", price: 3499, image: "👟" },
    { id: 6, name: "Leather Boots", category: "Shoes", price: 6999, image: "🥾" },
    { id: 7, name: "Bifold Wallet", category: "Wallets", price: 1299, image: "👛" },
    { id: 8, name: "Card Holder", category: "Wallets", price: 799, image: "💳" },
    { id: 9, name: "Coin Pouch", category: "Wallets", price: 599, image: "👝" },
    { id: 10, name: "Leather Watch", category: "Accessories", price: 2999, image: "⌚" },
    { id: 11, name: "Sunglasses", category: "Accessories", price: 1499, image: "🕶️" },
    { id: 12, name: "Leather Gloves", category: "Accessories", price: 999, image: "🧤" }
];

let cart = [];
let discountPercent = 0;

let coupons = {
    "SAVE10": 10,
    "SAVE20": 20
};

function formatPrice(amount) {
    return "₹" + Math.round(amount).toLocaleString("en-IN");
}

function showProducts() {
    let searchText = document.getElementById("search").value.toLowerCase().trim();
    let category = document.getElementById("category").value;
    let maxPrice = Number(document.getElementById("max-price").value);
    let sortBy = document.getElementById("sort").value;

    document.getElementById("price-value").innerText = formatPrice(maxPrice);

    let filtered = products.filter(function(product) {
        let matchSearch = product.name.toLowerCase().includes(searchText);
        let matchCategory = category === "All" || product.category === category;
        let matchPrice = product.price <= maxPrice;

        return matchSearch && matchCategory && matchPrice;
    });

    if (sortBy === "low") {
        filtered.sort(function(a, b) {
            return a.price - b.price;
        });
    } else if (sortBy === "high") {
        filtered.sort(function(a, b) {
            return b.price - a.price;
        });
    } else if (sortBy === "name") {
        filtered.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
    }

    let html = "";

    for (let i = 0; i < filtered.length; i++) {
        let product = filtered[i];

        html += `
            <div class="product-card">
                <div class="product-image">${product.image}</div>
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    }

    if (filtered.length === 0) {
        html = `<p class="no-products">No products found. Try changing your filters.</p>`;
    }

    document.getElementById("product-list").innerHTML = html;
}

function clearFilters() {
    document.getElementById("search").value = "";
    document.getElementById("category").value = "All";
    document.getElementById("max-price").value = 10000;
    document.getElementById("sort").value = "default";

    showProducts();
}

function addToCart(id) {
    let item = cart.find(function(cartItem) {
        return cartItem.id === id;
    });

    if (item) {
        item.quantity++;
    } else {
        let product = products.find(function(p) {
            return p.id === id;
        });

        if (!product) return;

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    showCart();
}

function removeFromCart(id) {
    cart = cart.filter(function(cartItem) {
        return cartItem.id !== id;
    });

    showCart();
}

function changeQuantity(id, change) {
    let item = cart.find(function(cartItem) {
        return cartItem.id === id;
    });

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        showCart();
    }
}

function showCart() {
    let html = "";
    let subtotal = 0;
    let totalItems = 0;

    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];

        subtotal += item.price * item.quantity;
        totalItems += item.quantity;

        html += `
            <div class="cart-item">
                <div class="cart-item-image">${item.image}</div>

                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}</p>
                </div>

                <div class="quantity">
                    <button onclick="changeQuantity(${item.id}, -1)" aria-label="Decrease quantity">-</button>
                    <b>${item.quantity}</b>
                    <button onclick="changeQuantity(${item.id}, 1)" aria-label="Increase quantity">+</button>
                </div>

                <button class="remove-btn" onclick="removeFromCart(${item.id})" aria-label="Remove ${item.name}">✖</button>
            </div>
        `;
    }

    if (cart.length === 0) {
        html = `<p class="empty-cart">Your cart is empty.</p>`;
    }

    let discount = subtotal * discountPercent / 100;
    let shipping = subtotal > 0 && subtotal < 2999 ? 149 : 0;
    let total = subtotal - discount + shipping;

    document.getElementById("cart-items").innerHTML = html;
    document.getElementById("cart-count").innerText = totalItems;
    document.getElementById("subtotal").innerText = formatPrice(subtotal);
    document.getElementById("discount").innerText = "- " + formatPrice(discount);
    document.getElementById("shipping").innerText = shipping === 0 ? "Free" : formatPrice(shipping);
    document.getElementById("total").innerText = formatPrice(total);
    document.getElementById("checkout-total").innerText = formatPrice(total);
}

function applyCoupon() {
    let code = document.getElementById("coupon-code").value.toUpperCase().trim();
    let message = document.getElementById("coupon-message");

    if (code === "") {
        message.innerText = "Please enter a coupon code.";
        message.style.color = "#b42318";
        return;
    }

    if (coupons[code]) {
        discountPercent = coupons[code];
        message.innerText = code + " applied! You get " + discountPercent + "% off.";
        message.style.color = "#237a45";
    } else {
        discountPercent = 0;
        message.innerText = "Invalid coupon code.";
        message.style.color = "#b42318";
    }

    showCart();
}

function openCart() {
    document.getElementById("cart").classList.add("open");
    document.getElementById("overlay").classList.add("show");
}

function closeCart() {
    document.getElementById("cart").classList.remove("open");
    document.getElementById("overlay").classList.remove("show");
}

function openCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add a product first.");
        return;
    }

    closeCart();

    document.getElementById("checkout-message").innerText = "";
    document.getElementById("order-btn").style.display = "block";
    document.getElementById("cancel-btn").innerText = "Cancel";
    document.getElementById("checkout").style.display = "flex";
}

function closeCheckout() {
    document.getElementById("checkout").style.display = "none";
}

function placeOrder() {
    let name = document.getElementById("cust-name").value.trim();
    let email = document.getElementById("cust-email").value.trim();
    let phone = document.getElementById("cust-phone").value.trim();
    let address = document.getElementById("cust-address").value.trim();
    let payment = document.getElementById("payment").value;
    let message = document.getElementById("checkout-message");

    if (name === "" || email === "" || phone === "" || address === "") {
        message.innerText = "Please fill all the fields.";
        message.style.color = "#b42318";
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        message.innerText = "Please enter a valid email address.";
        message.style.color = "#b42318";
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        message.innerText = "Phone number must be 10 digits.";
        message.style.color = "#b42318";
        return;
    }

    message.innerText = "Thank you, " + name + "! Your order has been placed. Payment: " + payment + ".";
    message.style.color = "#237a45";

    document.getElementById("order-btn").style.display = "none";
    document.getElementById("cancel-btn").innerText = "Close";

    cart = [];
    discountPercent = 0;

    document.getElementById("coupon-code").value = "";
    document.getElementById("coupon-message").innerText = "Try SAVE10 or SAVE20";
    document.getElementById("coupon-message").style.color = "var(--muted)";

    showCart();
}

showProducts();
showCart();
