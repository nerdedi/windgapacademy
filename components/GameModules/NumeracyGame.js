// Numeracy Game Module: Supermarket Simulator
// Drag and drop items, pay with correct money, animated Daisy explains, Winnie cheers
// Feedback on mistakes encourages perseverance
// All visuals are Australian currency

export function showNumeracyGame(container, userData = {}) {
  container.innerHTML = `
    <section id="supermarket-sim">
      <h2>🔢 Supermarket Simulator</h2>
      <canvas id="shop-map" width="600" height="400"></canvas>
      <div id="shopping-list">Milk, Apples, Bread</div>
      <div id="cart"></div>
      <div id="checkout"></div>
      <img src="assets/images/aud_notes.png" alt="Australian Currency" />
      <button onclick="window.route('dashboard')">Return to Dashboard</button>
    </section>
  `;
  startSupermarketSim();
}

function startSupermarketSim() {
  const canvas = document.getElementById('shop-map');
  const ctx = canvas.getContext('2d');
  let items = [
    { name: 'Milk', x: 100, y: 100, price: 2.5 },
    { name: 'Apples', x: 250, y: 100, price: 3.0 },
    { name: 'Bread', x: 400, y: 100, price: 2.0 }
  ];
  let cart = [];
  let dragging = null;

  function drawShop() {
    ctx.fillStyle = '#eaf6f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '18px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText('Supermarket', 250, 40);
    items.forEach(item => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(item.x, item.y, 80, 40);
      ctx.strokeRect(item.x, item.y, 80, 40);
      ctx.fillStyle = '#333';
      ctx.fillText(item.name, item.x + 10, item.y + 25);
      ctx.fillText(`$${item.price.toFixed(2)}`, item.x + 10, item.y + 38);
    });
  }

  function drawCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = '<strong>Cart:</strong> ' + cart.map(i => i.name).join(', ');
  }

  function drawCheckout() {
    const checkoutDiv = document.getElementById('checkout');
    let total = cart.reduce((sum, i) => sum + i.price, 0);
    checkoutDiv.innerHTML = `<strong>Total:</strong> $${total.toFixed(2)} <button id='pay-btn'>Pay</button>`;
    document.getElementById('pay-btn').onclick = () => {
      if (total === 7.5) {
        alert('Correct! Daisy: "Great shopping!" Winnie: "You paid the right amount!"');
      } else {
        alert('Try again! Andy: "Check your cart and total."');
      }
    };
  }

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    items.forEach(item => {
      if (mx > item.x && mx < item.x + 80 && my > item.y && my < item.y + 40) {
        dragging = item;
      }
    });
  });
  canvas.addEventListener('mouseup', (e) => {
    if (dragging) {
      cart.push(dragging);
      drawCart();
      drawCheckout();
      dragging = null;
    }
  });

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShop();
    requestAnimationFrame(gameLoop);
  }
  drawCart();
  drawCheckout();
  gameLoop();
}
