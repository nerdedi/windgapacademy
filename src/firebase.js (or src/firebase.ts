{}<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8" />
  <title>Windgap Academy</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" />
  <style>
    body {
      font-family: 'Open Sans', sans-serif;
      background: #edf4f7;
      color: #003052;
      text-align: center;
      margin: 0;
      padding: 0;
      transition: font-size 0.3s;
    }

    header {
      background-color: #0075a2;
      color: white;
      padding: 20px;
    }

    .logo {
      height: 50px;
      vertical-align: middle;
      margin-right: 10px;
    }

    .module {
      display: inline-block;
      margin: 15px;
      padding: 20px;
      width: 200px;
      height: 180px;
      background-color: #ffffff;
      border: 2px solid #0075a2;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
    }

    .module:hover {
      background-color: #d7eff7;
    }

    .label {
      font-size: 18px;
      margin-top: 10px;
    }

    .accessibility {
      position: fixed;
      top: 10px;
      right: 10px;
      text-align: right;
    }

    .accessibility button {
      margin: 3px;
      padding: 6px 10px;
      background-color: #004d73;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }

    .dyslexia-font {
      font-family: 'Comic Sans MS', cursive, sans-serif !important;
    }

    .easy-read {
      background-color: #fff9c4 !important;
      color: #000 !important;
    }

    footer {
      margin-top: 40px;
      padding: 10px;
      color: #666;
    }
  </style>
</head>
<body>
  <header>
    <img src="https://www.windgap.org.au/wp-content/uploads/2021/11/Windgap_Logo_White.png" class="logo" alt="Windgap Logo" />
    <h1>Windgap Academy</h1>
  </header>

  <div class="accessibility">
    <button onclick="increaseFont()">A+</button>
    <button onclick="toggleDyslexiaFont()">Dyslexia Font</button>
    <button onclick="toggleEasyRead()">Easy Read Mode</button>
  </div>

  <h2>Select a Module</h2>

  <div class="module" onclick="startModule('supermarket.html')">
    <div>🛒</div>
    <div class="label">Supermarket Simulator</div>
  </div>

  <div class="module" onclick="startModule('travel.html')">
    <div>🚌</div>
    <div class="label">Travel Training</div>
  </div>

  <div class="module" onclick="startModule('money.html')">
    <div>💰</div>
    <div class="label">Money Management</div>
  </div>

  <div class="module" onclick="startModule('calmspace.html')">
    <div>🌿</div>
    <div class="label">Calm Space</div>
  </div>

  <div class="module" onclick="window.location.href='login.html'">
    <div>🔐</div>
    <div class="label">Login (Educator / Learner)</div>
  </div>

  <footer>
    <p>&copy; 2025 Windgap Academy | All rights reserved</p>
  </footer>

  <script>
    function startModule(file) {
      window.location.href = file;
    }

    function increaseFont() {
      document.body.style.fontSize = 'larger';
    }

    function toggleDyslexiaFont() {
      document.body.classList.toggle('dyslexia-font');
    }

    function toggleEasyRead() {
      document.body.classList.toggle('easy-read');
    }
  </script>
</body>
</html>
<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8" />
  <title>Supermarket Simulator – Windgap Academy</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #f1f9f8;
      color: #003052;
      text-align: center;
      margin: 0;
    }

    h1 {
      background-color: #0075a2;
      color: white;
      padding: 20px;
    }

    .item {
      display: inline-block;
      border: 2px solid #0075a2;
      border-radius: 10px;
      margin: 10px;
      padding: 10px;
      width: 180px;
      background-color: #ffffff;
    }

    .item img {
      width: 100px;
      height: 100px;
    }

    .item button {
      margin-top: 10px;
      padding: 6px 12px;
      background: #0075a2;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    #cart, #summary {
      margin: 20px auto;
      padding: 10px;
      width: 80%;
      background-color: #e3f2f1;
      border-radius: 10px;
    }

    .money {
      font-size: 18px;
      margin-top: 20px;
    }

    #payButton {
      padding: 10px 20px;
      background-color: green;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>Supermarket Simulator</h1>
  <h3>Shopping List:</h3>
  <p id="list">Milk, Apples, Bread</p>

  <div id="store">
    <div class="item">
      <img src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png" alt="Milk" />
      <p>Milk – $2.50</p>
      <button onclick="addItem('Milk', 2.5)">Add to Cart</button>
    </div>

    <div class="item">
      <img src="https://cdn-icons-png.flaticon.com/512/415/415682.png" alt="Apples" />
      <p>Apples – $3.00</p>
      <button onclick="addItem('Apples', 3.0)">Add to Cart</button>
    </div>

    <div class="item">
      <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="Bread" />
      <p>Bread – $2.00</p>
      <button onclick="addItem('Bread', 2.0)">Add to Cart</button>
    </div>

    <div class="item">
      <img src="https://cdn-icons-png.flaticon.com/512/1046/1046866.png" alt="Soda" />
      <p>Soda – $2.00</p>
      <button onclick="addItem('Soda', 2.0)">Add to Cart</button>
    </div>
  </div>

  <div id="cart">
    <h3>Your Cart:</h3>
    <ul id="cartItems"></ul>
    <p>Total: $<span id="total">0.00</span></p>
    <div class="money">
      <p>Pay using correct money (AUD):</p>
      <button onclick="pay()">Pay Now</button>
    </div>
  </div>

  <div id="summary" style="display:none;">
    <h3>Payment Successful!</h3>
    <p>Well done, you bought healthy items from your list!</p>
    <button onclick="location.reload()">Play Again</button>
  </div>

  <script>
    let total = 0;
    const cart = [];

    function addItem(name, price) {
      cart.push({ name, price });
      total += price;
      updateCart();
    }

    function updateCart() {
      const list = document.getElementById("cartItems");
      list.innerHTML = "";
      cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} – $${item.price.toFixed(2)}`;
        list.appendChild(li);
      });
      document.getElementById("total").textContent = total.toFixed(2);
    }

    function pay() {
      document.getElementById("cart").style.display = "none";
      document.getElementById("summary").style.display = "block";
    }
  </script>
</body>
</html>

<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8" />
  <title>Supermarket Simulator – Windgap Academy</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #f1f9f8;
      color: #003052;
      text-align: center;
      margin: 0;
    }

    h1 {
      background-color: #0075a2;
      color: white;
      padding: 20px;
    }

    .item {
      display: inline-block;
      border: 2px solid #0075a2;
      border-radius: 10px;
      margin: 10px;
      padding: 10px;
      width: 180px;
      background-color: #ffffff;
    }

    .item img {
      width: 100px;
      height: 100px;
    }

    .item button {
      margin-top: 10px;
      padding: 6px 12px;
      background: #0075a2;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    #cart, #summary {
      margin: 20px auto;
      padding: 10px;
      width: 80%;
      background-color: #e3f2f1;
      border-radius: 10px;
    }

    .money {
      font-size: 18px;
      margin-top: 20px;
    }

    #payButton {
      padding: 10px 20px;
      background-color: green;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>Supermarket Simulator</h1>
  <h3>Shopping List:</h3>
  <p id="list">Milk, Apples, Bread</p>

  <div id="store">
    <div class="item">
      <img src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png" alt="Milk" />
      <p>Milk – $2.50</p>
      <button onclick="addItem('Milk', 2.5)">Add to Cart</button>
    </div>

    <div class="item">
      <img src="https://cdn-icons-png.flaticon.com/512/415/415682.png" alt="Apples" />
      <p>Apples – $3.00</p>
      <button onclick="addItem('Apples', 3.0)">Add to Cart</button>
    </div>

    <div class="item">
      <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="Bread" />
      <p>Bread – $2.00</p>
      <button onclick="addItem('Bread', 2.0)">Add to Cart</button>
    </div>

    <div class="item">
      <img src="https://cdn-icons-png.flaticon.com/512/1046/1046866.png" alt="Soda" />
      <p>Soda – $2.00</p>
      <button onclick="addItem('Soda', 2.0)">Add to Cart</button>
    </div>
  </div>

  <div id="cart">
    <h3>Your Cart:</h3>
    <ul id="cartItems"></ul>
    <p>Total: $<span id="total">0.00</span></p>
    <div class="money">
      <p>Pay using correct money (AUD):</p>
      <button onclick="pay()">Pay Now</button>
    </div>
  </div>

  <div id="summary" style="display:none;">
    <h3>Payment Successful!</h3>
    <p>Well done, you bought healthy items from your list!</p>
    <button onclick="location.reload()">Play Again</button>
  </div>

  <script>
    let total = 0;
    const cart = [];

    function addItem(name, price) {
      cart.push({ name, price });
      total += price;
      updateCart();
    }

    function updateCart() {
      const list = document.getElementById("cartItems");
      list.innerHTML = "";
      cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} – $${item.price.toFixed(2)}`;
        list.appendChild(li);
      });
      document.getElementById("total").textContent = total.toFixed(2);
    }

    function pay() {
      document.getElementById("cart").style.display = "none";
      document.getElementById("summary").style.display = "block";
    }
  </script>
</body>
</html>


<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8" />
  <title>Travel Training – Windgap Academy</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #f0f8ff;
      color: #003052;
      text-align: center;
      margin: 0;
    }

    h1 {
      background-color: #0075a2;
      color: white;
      padding: 20px;
    }

    .section {
      margin: 30px;
    }

    button {
      padding: 10px 20px;
      margin: 10px;
      font-size: 16px;
      background-color: #0075a2;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    button:hover {
      background-color: #005f86;
    }

    .map {
      max-width: 90%;
      margin-top: 20px;
    }

    .result {
      margin-top: 20px;
      font-size: 18px;
      padding: 15px;
      background-color: #e3f2f1;
      border-radius: 10px;
      display: none;
    }
  </style>
</head>
<body>
  <h1>Travel Training – Catch the Bus</h1>

  <div class="section" id="step1">
    <h3>Step 1: Top Up Your Opal Card</h3>
    <p>Your balance: $<span id="balance">0.00</span></p>
    <button onclick="topUp()">Top Up $10</button>
  </div>

  <div class="section" id="step2" style="display:none;">
    <h3>Step 2: Choose Your Bus</h3>
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Sydney_Bus_Map.png/800px-Sydney_Bus_Map.png" class="map" alt="Sydney Bus Map" />
    <p>Pick the bus that goes to the library:</p>
    <button onclick="chooseBus('400')">Bus 400</button>
    <button onclick="chooseBus('120')">Bus 120</button>
    <button onclick="chooseBus('245')">Bus 245</button>
  </div>

  <div class="section" id="step3" style="display:none;">
    <h3>Step 3: Walk to Your Final Destination</h3>
    <p>Now you're off the bus, follow these directions:</p>
    <ol>
      <li>Exit at Sydney Central stop.</li>
      <li>Turn left onto George Street.</li>
      <li>Walk 300m to the library entrance.</li>
    </ol>
    <button onclick="finish()">Finish Travel</button>
  </div>

  <div class="result" id="result">
    <h3>Travel Complete!</h3>
    <p>Well done navigating public transport and walking directions!</p>
    <button onclick="location.reload()">Play Again</button>
  </div>

  <script>
    let balance = 0;

    function topUp() {
      balance += 10;
      document.getElementById('balance').textContent = balance.toFixed(2);
      document.getElementById('step2').style.display = 'block';
    }

    function chooseBus(busNumber) {
      if (busNumber === '120') {
        alert('Correct bus! Heading to the library...');
        document.getElementById('step3').style.display = 'block';
      } else {
        alert('Oops! Wrong bus. Try another.');
      }
    }

    function finish() {
      document.getElementById('step1').style.display = 'none';
      document.getElementById('step2').style.display = 'none';
      document.getElementById('step3').style.display = 'none';
      document.getElementById('result').style.display = 'block';
    }
  </script>
</body>
</html>
<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8" />
  <title>Money Management – Windgap Academy</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #fffef2;
      color: #003052;
      text-align: center;
      margin: 0;
    }

    h1 {
      background-color: #0075a2;
      color: white;
      padding: 20px;
    }

    .task {
      margin: 30px auto;
      padding: 20px;
      width: 80%;
      max-width: 500px;
      background-color: #f9f9e5;
      border-radius: 10px;
      border: 2px solid #ccc;
    }

    img {
      width: 80px;
      margin: 10px;
    }

    input[type="number"] {
      padding: 6px;
      width: 100px;
      font-size: 16px;
    }

    button {
      padding: 8px 16px;
      background-color: #0075a2;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }

    .result {
      font-size: 18px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <h1>Money Management</h1>

  <div class="task">
    <h3>Give the correct change!</h3>
    <p>A customer buys a sandwich for <strong>$4.50</strong> and pays with a <strong>$10 note</strong>.</p>
    <p>How much change should you give?</p>

    <input type="number" step="0.05" id="userInput" placeholder="e.g. 5.50" />
    <button onclick="checkAnswer()">Submit</button>

    <div class="result" id="feedback"></div>
  </div>

  <div>
    <h3>Visual Money (AUD)</h3>
    <img src="https://www.rba.gov.au/education/resources/banknotes/images/new-10-2020.png" alt="10 dollar note" />
    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Australian_50c_coin.png" alt="50c coin" />
    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Australian_2_dollar_coin.png" alt="$2 coin" />
    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2b/Australian_1_dollar_coin.png" alt="$1 coin" />
  </div>

  <script>
    function checkAnswer() {
      const input = parseFloat(document.getElementById('userInput').value);
      const correct = 5.5;
      const feedback = document.getElementById('feedback');

      if (isNaN(input)) {
        feedback.textContent = "Please enter a number.";
        feedback.style.color = "#b00020";
      } else if (Math.abs(input - correct) < 0.01) {
        feedback.textContent = "✅ That's correct! Great job.";
        feedback.style.color = "green";
      } else {
        feedback.textContent = `❌ Not quite. The correct change is $${correct.toFixed(2)}. Try again!`;
        feedback.style.color = "#b00020";
      }
    }
  </script>
</body>
</html>
<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <title>Calm Space – Windgap Academy</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      background: linear-gradient(to bottom, #dbeaf2, #f0fff4);
      font-family: 'Segoe UI', sans-serif;
      color: #003052;
      text-align: center;
      padding: 0;
      margin: 0;
    }

    h1 {
      background-color: #0075a2;
      color: white;
      padding: 20px;
    }

    .content {
      padding: 20px;
    }

    .breathing {
      font-size: 24px;
      margin-top: 20px;
    }

    .music-controls {
      margin: 20px;
    }

    .calm-image {
      width: 200px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <h1>Calm Space</h1>
  <div class="content">
    <p class="breathing" id="breathingText">Breathe In...</p>
    <img class="calm-image" src="https://cdn.pixabay.com/photo/2017/02/08/12/35/beach-2049065_960_720.jpg" alt="Calm Beach">

    <div class="music-controls">
      <p>Calming Music:</p>
      <audio controls autoplay loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" type="audio/mp3">
        Your browser does not support the audio element.
      </audio>
    </div>
  </div>

  <script>
    const text = document.getElementById("breathingText");
    const steps = ["Breathe In...", "Hold...", "Breathe Out...", "Hold..."];
    let i = 0;
    setInterval(() => {
      text.textContent = steps[i % steps.length];
      i++;
    }, 4000);
  </script>
</body>
</html>
<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <title>Login – Windgap Academy</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #f4fafe;
      text-align: center;
      margin: 0;
    }

    h1 {
      background-color: #0075a2;
      color: white;
      padding: 20px;
    }

    .login-box {
      background: white;
      padding: 30px;
      margin: 50px auto;
      width: 90%;
      max-width: 400px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    input {
      padding: 10px;
      width: 90%;
      margin: 10px 0;
      border-radius: 5px;
      border: 1px solid #ccc;
    }

    button {
      padding: 10px 20px;
      background: #0075a2;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    #msg {
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <h1>Login</h1>
  <div class="login-box">
    <input type="text" id="username" placeholder="Username (e.g. jsmith)" /><br>
    <input type="password" id="password" placeholder="Password (e.g. johns)" /><br>
    <button onclick="login()">Login</button>
    <p id="msg"></p>
  </div>

  <script>
    function login() {
      const user = document.getElementById("username").value;
      const pass = document.getElementById("password").value;

      if (user && pass) {
        sessionStorage.setItem("user", user);
        document.getElementById("msg").textContent = "Logging in...";
        setTimeout(() => window.location.href = "index.html", 1000);
      } else {
        document.getElementById("msg").textContent = "Please enter both fields.";
      }
    }
  </script>
</body>
</html>
// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHKxpp6tYRPJKih8Iu9OIrFcNc1pHRjaI",
  authDomain: "windgap-academy.firebaseapp.com",
  projectId: "windgap-academy",
  storageBucket: "windgap-academy.appspot.com",
  messagingSenderId: "438303886042",
  appId: "1:438303886042:web:19b166df519870baa433e3",
  measurementId: "G-FXR0TX8S6X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
// report.js
import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

export function generateReport(data) {
  const doc = new jsPDF();

  const date = new Date().toLocaleDateString("en-AU");
  const user = data.username || "Unnamed Learner";

  doc.setFontSize(16);
  doc.text("Windgap Academy – Learning Progress Report", 10, 20);

  doc.setFontSize(12);
  doc.text(`Learner: ${user}`, 10, 30);
  doc.text(`Date: ${date}`, 150, 30);

  doc.text("Learning Goals:", 10, 40);
  data.goals.forEach((goal, i) => {
    doc.text(`• ${goal}`, 14, 48 + i * 7);
  });

  const y = 48 + data.goals.length * 7 + 10;
  doc.text("Progress Summary:", 10, y);
  data.completed.forEach((mod, i) => {
    doc.text(`✔ ${mod}`, 14, y + 8 + i * 7);
  });

  const z = y + 8 + data.completed.length * 7 + 10;
  doc.text("Development Areas:", 10, z);
  data.remaining.forEach((mod, i) => {
    doc.text(`⏳ ${mod}`, 14, z + 8 + i * 7);
  });

  const r = z + 8 + data.remaining.length * 7 + 10;
  doc.text("Recommendations:", 10, r);
  doc.text(
    "• Continue support under Core – Group & Centre Activities.",
    14,
    r + 7
  );
  doc.text(
    "• Build social and functional life skills under Capacity Building.",
    14,
    r + 14
  );

  doc.save(`NDIS_Report_${user}_${date}.pdf`);
}
// educator.js

// Simulate database (replace with Firestore in production)
let assignments = {};

export function assignTask(username, task) {
  if (!assignments[username]) assignments[username] = [];
  assignments[username].push(task);
  alert(`Task "${task}" assigned to ${username}`);
}

export function uploadFile(username, fileName) {
  if (!assignments[username]) assignments[username] = [];
  assignments[username].push(`File uploaded: ${fileName}`);
  alert(`File "${fileName}" uploaded to ${username}`);
}

export function listTasks(username) {
  return assignments[username] || [];
}
