// Literacy Game Module: Platformer
// Daisy explains rules, Winnie cheers, Andy motivates
// Levels increase in difficulty, feedback is motivational and independence-focused
// Visual effects: parallax backgrounds, animated coins, smooth transitions
// Learner Level shown instead of Score

export function showLiteracyGame(container, userData = {}) {
  container.innerHTML = `
    <section id="literacy-game" aria-label="Literacy Platformer">
      <h2>📚 Literacy Platformer</h2>
      <canvas id="literacy-platformer" width="800" height="400" aria-label="Platformer Game" tabindex="0"></canvas>
      <div id="literacy-feedback" aria-live="polite"></div>
      <div id="learner-level">Learner Level: ${userData.level || 1}</div>
  <button id="literacy-return" class="nav-btn" aria-label="Return to Dashboard">Return to Dashboard</button>
    </section>
  `;
  document.getElementById('literacy-return').onclick = function() { window.route('dashboard'); };
  startLiteracyPlatformer(userData);
}

function startLiteracyPlatformer() {
  const canvas = document.getElementById('literacy-platformer');
  const ctx = canvas.getContext('2d');
  let player = { x: 50, y: 350, vy: 0, jumping: false };
  let coins = [{ x: 200, y: 350 }, { x: 400, y: 350 }, { x: 600, y: 350 }];
  let score = 0;
  let level = 1;
  let progress = [];
  let completed = false;

  function drawBackground() {
    ctx.fillStyle = '#eaf6f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#b2d8d8';
    ctx.fillRect(0, 380, canvas.width, 20);
    // Parallax clouds
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(100, 80, 40, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(300, 60, 30, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(600, 100, 50, 0, 2 * Math.PI); ctx.fill();
  }

  function drawPlayer() {
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(player.x, player.y, 40, 40);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText('Daisy', player.x + 2, player.y + 25);
  }

  function drawCoins() {
    coins.forEach((coin) => {
      ctx.fillStyle = '#ffd700';
      ctx.beginPath(); ctx.arc(coin.x, coin.y, 10, 0, 2 * Math.PI); ctx.fill();
    });
  }

  function update() {
    if (player.jumping) {
      player.vy += 1.5;
      player.y += player.vy;
      if (player.y >= 350) {
        player.y = 350;
        player.jumping = false;
        player.vy = 0;
      }
    }
    coins.forEach((coin, idx) => {
      if (Math.abs(player.x - coin.x) < 30 && Math.abs(player.y - coin.y) < 30) {
        coins.splice(idx, 1);
        score++;
        document.getElementById('literacy-feedback').innerText = `Great job! Coin collected. Total: ${score}`;
  document.getElementById('literacy-feedback').innerHTML = `<span style='color:#22c55e;font-weight:600;'>Great job! Coin collected. Total: ${score}</span>`;
        progress.push({ action: 'coin', x: player.x, y: player.y, level });
        if (score === 3) {
          level++;
          document.getElementById('learner-level').innerText = `Learner Level: ${level}`;
          document.getElementById('literacy-feedback').innerText = 'Level up! Daisy: "You did it!" Winnie: "Keep going!" Andy: "Awesome effort!"';
          document.getElementById('literacy-feedback').innerHTML = `<span style='color:#3b82f6;font-weight:600;'>Level up! Daisy: "You did it!" Winnie: "Keep going!" Andy: "Awesome effort!"</span>`;
          progress.push({ action: 'levelup', level });
          // Reset coins for next level
          coins.push({ x: 200, y: 350 }, { x: 400, y: 350 }, { x: 600, y: 350 });
          score = 0;
          if (level > 3 && !completed) {
            completed = true;
            setTimeout(() => {
              document.getElementById('literacy-feedback').innerText = 'Game complete! Well done.';
              document.getElementById('literacy-feedback').innerHTML = `<span style='color:#3b82f6;font-weight:600;'>Game complete! Well done.</span>`;
              progress.push({ action: 'complete', level });
              if (userData && userData.userId) {
                import('../../firebase.js').then(mod => {
                  mod.saveLessonPlan('literacy-game', userData.userId, JSON.stringify(progress));
                });
              }
            }, 1200);
          }
        }
      }
    });
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayer();
    drawCoins();
    update();
    requestAnimationFrame(gameLoop);
  }

  canvas.setAttribute('tabindex', '0');
  canvas.focus();
  canvas.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !player.jumping) {
      player.jumping = true;
      player.vy = -18;
      document.getElementById('literacy-feedback').innerText = 'Jump!';
  document.getElementById('literacy-feedback').innerHTML = `<span style='color:#fbbf24;font-weight:600;'>Jump!</span>`;
      progress.push({ action: 'jump', x: player.x, y: player.y, level });
    }
    if (e.code === 'ArrowRight') {
      player.x += 20;
      progress.push({ action: 'moveRight', x: player.x, y: player.y, level });
    }
    if (e.code === 'ArrowLeft') {
      player.x -= 20;
      progress.push({ action: 'moveLeft', x: player.x, y: player.y, level });
    }
  });
  gameLoop();
}
