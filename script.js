
let products = [];
let cart = [];

// Fetch products from a public API
async function loadProducts() {
    const productBox = document.getElementById("products");

    try {
        const response = await fetch(
            "https://dummyjson.com/products/category/groceries?limit=12"
        );

        if (!response.ok) {
            throw new Error("Unable to fetch products");
        }

        const data = await response.json();
        products = data.products;

        displayProducts();
    } catch (error) {
        productBox.innerHTML =
            "<p>Products could not load. Please check your internet and refresh.</p>";
        console.log(error);
    }
}

// Display products using map()
function displayProducts() {
    const productBox = document.getElementById("products");

    productBox.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.thumbnail}"
                 alt="${product.title}"
                 onerror="this.style.display='none'">

            <h3>${product.title}</h3>

            <p>₹${(product.price * 85).toFixed(2)}</p>

            <button class="add-btn"
                onclick="addToCart(${product.id})">
                🛒 Add to Cart
            </button>
        </div>
    `).join("");
}

// Add products to cart
function addToCart(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.title,
            price: product.price * 85,
            quantity: 1
        });
    }

    displayCart();
}

// Display cart and calculate total using reduce()
function displayCart() {
    const cartBox = document.getElementById("cart-items");

    document.getElementById("cart-count").textContent =
        cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cart.length === 0) {
        cartBox.innerHTML =
            '<p class="empty">Your cart is empty. Add some products!</p>';
    } else {
        cartBox.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toFixed(2)} × ${item.quantity}</p>
                </div>

                <strong>₹${(item.price * item.quantity).toFixed(2)}</strong>

                <button class="remove-btn"
                    onclick="removeFromCart(${item.id})">
                    ❌ Remove
                </button>
            </div>
        `).join("");
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    document.getElementById("total-price").textContent =
        total.toFixed(2);
}

// Remove product using filter()
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    displayCart();
}

// Clear entire cart
function clearCart() {
    cart = [];
    displayCart();
}

// Load products when the page opens
loadProducts();

