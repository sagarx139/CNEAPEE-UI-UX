console.log("CNEAPEE JS connected ✅");

const products = [
    { id: 1, name: "Men's Formal Shirt", price: 2499 },
    { id: 2, name: "Women's A-Line Dress", price: 3299 },
    { id: 3, name: "Kids' Printed T-Shirt", price: 1199 },
    { id: 4, name: "Men's Chinos", price: 2799 },
    { id: 5, name: "Women's Casual Top", price: 1999 },
    { id: 6, name: "Kids' Jeans", price: 1499 },
];

let cneapeeCart = [];

function addToCart(productId) {
    const product = products.find((p) => p.id === productId);
    if (product) {
        cneapeeCart.push(product);
        updateCartCount();
        updateCartSummary();
        console.log(cneapeeCart); // Testing
    }
}

function updateCartCount() {
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) {
        cartCountEl.textContent = cneapeeCart.length;
    }
}

function updateCartSummary() {
    const cartSummaryEl = document.getElementById("cart-summary");
    if (cartSummaryEl) {
        const totalPrice = cneapeeCart.reduce((acc, product) => acc + product.price, 0);
        cartSummaryEl.innerHTML = `
            <h3>Cart Summary</h3>
            <p>Total items: ${cneapeeCart.length}</p>
            <p>Total price: ₹${totalPrice}</p>
        `;
    }
}
