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
        console.log(cneapeeCart); // For debugging
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
            <ul>
                ${cneapeeCart.map(item => `<li>${item.name} - ₹${item.price}</li>`).join('')}
            </ul>
            <p>Total items: ${cneapeeCart.length}</p>
            <p>Total price: ₹${totalPrice}</p>
        `;
    }
}

// Example: Attach addToCart to buttons (call this after DOM is loaded)
document.addEventListener('DOMContentLoaded', () => {
    products.forEach(product => {
        const btn = document.getElementById(`add-to-cart-${product.id}`);
        if (btn) {
            btn.addEventListener('click', () => {
                addToCart(product.id);
                updateCartCount();
                updateCartSummary();
            });
        }
    });
    updateCartCount();
    updateCartSummary();
});

const loginContainer = document.getElementById('login-container');
const chatPopup = document.getElementById('chat-popup');
const chatContainer = document.getElementById('chat-container');
const loginBtn = document.getElementById('login-btn');
const closeLogin = document.getElementById('close-login');
const closePopup = document.getElementById('close-popup');
const startChatBtn = document.getElementById('start-chat-btn');
const userSelect = document.getElementById('user-select');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatWith = document.getElementById('chat-with');

let currentUser = null;
let targetUser = null;

// Login Logic
loginBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        // Simulate login (replace with real API call)
        if (authenticateUser(username, password)) { // Dummy function
            currentUser = username;
            loginContainer.classList.add('hidden');
            chatPopup.classList.remove('hidden');
        } else {
            alert('Invalid credentials!');
        }
    } else {
        alert('Please enter username and password!');
    }
});

closeLogin.addEventListener('click', () => {
    loginContainer.classList.add('hidden');
});

closePopup.addEventListener('click', () => {
    chatPopup.classList.add('hidden');
});

startChatBtn.addEventListener('click', () => {
    const selectedUser = userSelect.value;
    const initialMessage = document.getElementById('chat-input-popup').value;
    if (selectedUser && initialMessage && currentUser) {
        targetUser = selectedUser;
        chatWith.textContent = targetUser;
        chatPopup.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        connectWebSocket(initialMessage);
    } else {
        alert('Select a user and enter a message!');
    }
});

// Dummy authentication (replace with real backend)
function authenticateUser(username, password) {
    // Simulated valid users: person1/password123, person2/password456
    const validUsers = { 'person1': 'password123', 'person2': 'password456' };
    return validUsers[username] === password;
}

function connectWebSocket(initialMessage) {
    const socket = new WebSocket('wss://your-websocket-server.com'); // Replace with your URL

    function encryptMessage(message, key) {
        return btoa(message); // Base64 for demo, use CryptoJS for real encryption
    }

    function decryptMessage(encrypted, key) {
        return atob(encrypted); // Base64 for demo
    }

    socket.onopen = () => {
        if (initialMessage) {
            const encryptedMsg = encryptMessage(initialMessage, 'your-secret-key');
            socket.send(JSON.stringify({ from: currentUser, to: targetUser, content: encryptedMsg }));
            addMessage(`You: ${initialMessage}`, true);
        }
        console.log('Connected to WebSocket');
    };

    sendBtn.addEventListener('click', () => {
        const message = chatInput.value;
        if (message && currentUser) {
            const encryptedMsg = encryptMessage(message, 'your-secret-key');
            socket.send(JSON.stringify({ from: currentUser, to: targetUser, content: encryptedMsg }));
            chatInput.value = '';
            addMessage(`You: ${message}`, true);
        }
    });

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.to === currentUser) {
            const decryptedMsg = decryptMessage(data.content, 'your-secret-key');
            addMessage(`${data.from}: ${decryptedMsg}`, false);
        }
    };
}

function addMessage(text, isSent) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `p-2 mb-2 rounded ${isSent ? 'bg-blue-600 self-end' : 'bg-gray-700'}`;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}