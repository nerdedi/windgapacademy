// Virtual currency and in-app store
export function showVirtualCurrency(container, userData = {}) {
  container.innerHTML = `
    <section id='virtual-currency' aria-label='Virtual Currency'>
      <h2>💸 Virtual Currency</h2>
      <div>Balance: ${userData.coins || 0} coins</div>
      <button id='open-store'>Open Store</button>
      <div id='currency-feedback' aria-live='polite'></div>
    </section>
  `;
  document.getElementById("open-store").onclick = function() {
    document.getElementById("currency-feedback").innerText = "Store opened!";
  };
}
