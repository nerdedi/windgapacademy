// Numeracy Game Module: Supermarket Simulator
// Drag and drop items, pay with correct money, animated Daisy explains, Winnie cheers
// Feedback on mistakes encourages perseverance
// All visuals are Australian currency

export function showNumeracyGame(container, userData = {}) {
  container.innerHTML = `
    <section id="supermarket-sim" aria-label="Supermarket Simulator">
      <h2>🔢 Supermarket Simulator</h2>
      <canvas id="shop-map" width="600" height="400" aria-label="Shop Map" tabindex="0"></canvas>
      <div id="shopping-list" aria-live="polite">Milk, Apples, Bread</div>
      <div id="cart" aria-live="polite"></div>
      <div id="checkout" aria-live="polite"></div>
  <img src="assets/images/aud_notes.png" alt="Australian Currency" loading="lazy" />
      <button id="numeracy-return" class="nav-btn" aria-label="Return to Dashboard">Return to Dashboard</button>
    </section>
  `;
  document.getElementById('numeracy-return').onclick = function() { window.route('dashboard'); };
  startSupermarketSim(userData);
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
  let progress = [];
  let completed = false;

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
  progress.push({ action: 'cartUpdate', cart: cart.map(i => i.name) });
  }

  function drawCheckout() {
    const checkoutDiv = document.getElementById('checkout');
    let total = cart.reduce((sum, i) => sum + i.price, 0);
  checkoutDiv.innerHTML = `<strong>Total:</strong> $${total.toFixed(2)} <button id='pay-btn' class='nav-btn' aria-label='Pay'>Pay</button>`;
    document.getElementById('pay-btn').onclick = () => {
      if (total === 7.5) {
        progress.push({ action: 'pay', total, correct: true });
        checkoutDiv.innerHTML += `<div style='color:#22c55e;font-weight:600;margin-top:8px;'>Correct! Daisy: "Great shopping!" Winnie: "You paid the right amount!"</div>`;
        if (!completed) {
          completed = true;
          setTimeout(() => {
            checkoutDiv.innerHTML += `<div style='color:#3b82f6;font-weight:600;margin-top:8px;'>Game complete! Well done.</div>`;
            progress.push({ action: 'complete' });
            if (userData && userData.userId) {
              import('../../firebase.js').then(mod => {
                mod.saveLessonPlan('numeracy-game', userData.userId, JSON.stringify(progress));
              });
            }
          }, 1200);
        }
      } else {
        progress.push({ action: 'pay', total, correct: false });
        checkoutDiv.innerHTML += `<div style='color:#ef4444;font-weight:600;margin-top:8px;'>Try again! Andy: "Check your cart and total."</div>`;
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
