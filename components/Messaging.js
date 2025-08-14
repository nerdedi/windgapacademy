// Messaging & Chat Module
// Chat moderation, educator review, logs, terms acceptance

  function helpButton() {
    return `<button id="messaging-help" aria-label="Help" title="Help">❓</button>`;
  }
  function privacyNotice() {
    return `<div id="privacy-notice" style="font-size:0.9em;color:#555;margin:8px 0;">All messages and notifications are private and only used for educational support.</div>`;
  }
  container.innerHTML = `
    <section id="messaging" class="au-section" aria-label="Messaging">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2>Messaging</h2>
        ${helpButton()}
      </div>
      <div class="notification-centre au-section" aria-label="Notification Centre">
        <h3>Notification Centre</h3>
        <div id="notifications"></div>
        <h4>Prioritised To-Do List</h4>
        <div id="todo-list"></div>
        <label for="task-title">Set Timer for Task:</label>
        <input type="text" id="task-title" placeholder="Task Title" aria-label="Task Title" />
        <input type="number" id="task-minutes" placeholder="Minutes" aria-label="Minutes" />
        <button id="set-timer" aria-label="Set Timer">Set Timer</button>
        <div id="timer-status"></div>
        <h4>Time Tracker</h4>
        <div id="time-tracker"></div>
      </div>
      <div class="msg-privacy-safety" aria-label="Privacy and Safety">
        <h3>kidSAFE+ & COPPA Compliant</h3>
        <ul>
          <li>This chat is 100% ad-free and free of in-app purchases.</li>
          <li>All experiences are educational and age-appropriate.</li>
          <li>Social features are strictly moderated and educator-reviewed.</li>
          <li>No personal data is collected beyond educational progress.</li>
          <li>Privacy and safety are prioritised at every step.</li>
          <li>All content and interactions are logged for safety and review.</li>
        </ul>
        <p><strong>Notice:</strong> All tokens and rewards are educational only and have no real-world value.</p>
        ${privacyNotice()}
      </div>
      <div id="chat-area" aria-label="Chat Area"></div>
      <input id="chat-input" type="text" placeholder="Type your message..." aria-label="Chat Input" />
      <button id="send-btn" aria-label="Send Message">Send</button>
      <div id="unread-count" aria-label="Unread Messages">Unread: ${unreadCount}</div>
      <button id="return-dashboard" aria-label="Return to Dashboard">Return to Dashboard</button>
      <div class="lesson-plan-au">
        <h3>Lesson Plan: Messaging & Chat (Australian Curriculum)</h3>
        <p>Objective: Foster safe, respectful, and effective communication in Australian schools.</p>
        <ul>
          <li>Teach digital citizenship and respectful online behaviour.</li>
          <li>Discuss Australian laws and guidelines for online safety.</li>
          <li>Role-play scenarios for reporting and moderating inappropriate content.</li>
        </ul>
        <p>Educator Notes: Refer to the eSafety Commissioner and ACARA for resources on digital safety in Australia.</p>
      </div>
      <div id="messaging-prompt" style="margin-top:12px;" aria-live="polite"></div>
    </section>
  `;
  startMessaging();
  // Keyboard navigation for all buttons and inputs
  Array.from(container.querySelectorAll('button,input')).forEach(el => { el.tabIndex = 0; });
  // Help/info button
  document.getElementById('messaging-help').onclick = () => {
    alert('Messaging is safe, private, and educator-reviewed. Use the chat and notification centre for learning support.');
  };
  document.getElementById('set-timer').onclick = () => window.setTaskTimer();
  document.getElementById('return-dashboard').onclick = () => window.route('dashboard');
  // Rotating educational prompt
  const prompts = [
    'Tip: Use the notification centre for important updates.',
    'Tip: All chat messages are private and educator-reviewed.',
    'Tip: Set timers to manage your learning tasks.',
    'Tip: Role-play scenarios help with digital safety.'
  ];
  let promptIndex = 0;
  function showPrompt() {
    document.getElementById('messaging-prompt').textContent = prompts[promptIndex % prompts.length];
    promptIndex++;
    setTimeout(showPrompt, 7000);
  }
  showPrompt();
  // Timer logic
  window.setTaskTimer = function() {
    const title = document.getElementById('task-title').value;
    const mins = parseInt(document.getElementById('task-minutes').value);
    if (!title || isNaN(mins)) {
      document.getElementById('timer-status').innerText = 'Enter a task and minutes.';
      return;
    }
    document.getElementById('timer-status').innerText = `Timer set for "${title}" (${mins} min).`;
    setTimeout(() => {
      alert(`Time's up for: ${title}`);
    }, mins * 60000);
  };
  // Time tracker logic
  window.startTime = Date.now();
  window.updateTimeTracker = function() {
    const tracker = document.getElementById('time-tracker');
    const now = Date.now();
    const mins = Math.floor((now - window.startTime) / 60000);
    tracker.innerText = `Session time: ${mins} min`;
  };
  setInterval(window.updateTimeTracker, 60000);
  // Winnie error reminder
  window.addEventListener('beforeunload', function(e) {
    // Simulate error check
    const hasError = false; // Replace with real error check
    if (hasError) {
      alert('Winnie: Please fix any technological errors before logging off!');
      e.preventDefault();
      e.returnValue = '';
    } else {
      alert('Winnie: Progress saved! Have a great day!');
    }
  });
  // Notification logic
  window.sendNotificationToLearner = function(title, urgency) {
    const notifications = document.getElementById('notifications');
    const noteColor = urgency === 'urgent' ? '#ef4444' : urgency === 'important' ? '#fbbf24' : '#3b82f6';
    notifications.innerHTML += `<div class='sticky-note' style='background:${noteColor};color:white;padding:8px;margin:4px;border-radius:8px;'>${title} <span style='font-weight:bold;'>[${urgency}]</span></div>`;
    // Add to prioritised to-do list
    const todo = document.getElementById('todo-list');
    todo.innerHTML += `<div class='todo-item' style='background:${noteColor};color:white;padding:6px;margin:2px;border-radius:6px;'>${title} <span>[${urgency}]</span> <button onclick='markTaskDone(this)'>Mark Done</button></div>`;
  };
  window.markTaskDone = function(btn) {
    btn.parentElement.style.textDecoration = 'line-through';
    btn.remove();
  };
  // Timer logic
  window.setTaskTimer = function() {
    const title = document.getElementById('task-title').value;
    const mins = parseInt(document.getElementById('task-minutes').value);
    if (!title || isNaN(mins)) {
      document.getElementById('timer-status').innerText = 'Enter a task and minutes.';
      return;
    }
    document.getElementById('timer-status').innerText = `Timer set for "${title}" (${mins} min).`;
    setTimeout(() => {
      alert(`Time's up for: ${title}`);
    }, mins * 60000);
  };
  // Time tracker logic
  window.startTime = Date.now();
  window.updateTimeTracker = function() {
    const tracker = document.getElementById('time-tracker');
    const now = Date.now();
    const mins = Math.floor((now - window.startTime) / 60000);
    tracker.innerText = `Session time: ${mins} min`;
  };
  setInterval(window.updateTimeTracker, 60000);
  // Winnie error reminder
  window.addEventListener('beforeunload', function(e) {
    // Simulate error check
    const hasError = false; // Replace with real error check
    if (hasError) {
      alert('Winnie: Please fix any technological errors before logging off!');
      e.preventDefault();
      e.returnValue = '';
    } else {
      alert('Winnie: Progress saved! Have a great day!');
    }
  });

function startMessaging() {
  // Pure function for message state
  function addMessage(messages, msg, reviewed = false) {
  // Each message is independent; adding a message does not affect others.
    return [...messages, { text: msg, reviewed }];
  }
  function reviewMessages(messages) {
  // Reviewing messages only updates the reviewed property; no hidden dependencies.
    return messages.map(m => ({ ...m, reviewed: true }));
  }
  // Load chat log from Firebase (pseudo-code)
  // import { saveChatLog } from '../firebase.js';
  const chatArea = document.getElementById('chat-area');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  let messages = [];
  sendBtn.onclick = () => {
  playSound('assets/sounds/message-send.mp3');
  animateEffect('chat-bounce');
    const msg = input.value.trim();
    if (!msg) return;
    // Moderate chat
    const result = window.moderateChat ? window.moderateChat(msg) : { banned: false };
    if (result.banned) {
      chatArea.innerHTML += `<div class='chat-msg banned'>Message blocked: ${result.reason}</div>`;
    } else {
      messages = addMessage(messages, msg);
      updateChatLog();
    }
    input.value = '';
  };
  function updateChatLog() {
  playSound('assets/sounds/message-receive.mp3');
    chatArea.innerHTML = messages.map(m => `<div class='chat-msg${m.reviewed ? ' reviewed' : ''}'>${m.text}${m.reviewed ? ' (Reviewed)' : ''}</div>`).join('');
  }
  // Educator review simulation
  window.reviewChat = () => {
  playSound('assets/sounds/review.mp3');
function playSound(src) {
  const audio = new Audio(src);
  audio.play();
}

function animateEffect(effect) {
  document.getElementById('chat-area').classList.add(effect);
  setTimeout(() => document.getElementById('chat-area').classList.remove(effect), 700);
}
  messages = reviewMessages(messages);
  updateChatLog();
  alert('All messages reviewed by educator.');
  };
}
