// Virtual World Component
// Immersive, inclusive, and interactive environment for all learners

function VirtualWorld() {
  // Placeholder React component for navigation
  return <div id="virtual-world-root">Virtual World Loaded</div>;
}

export default VirtualWorld;
container.innerHTML = [
  '<div class="lesson-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;background:url(\'/assets/backgrounds/lesson-bg.svg\') center/cover no-repeat;"></div>',
  '<section id="virtual-world" class="card shadow-xl p-8 rounded-2xl mx-auto my-16 max-w-2xl relative bg-white/80 backdrop-blur-lg">',
  '<h2 id="virtual-heading" class="text-3xl font-bold text-primary mb-6">🌏 Virtual World</h2>',
  '<button id="enter-world" class="btn-primary nav-btn">Enter World</button>',
  '<div id="world-area"></div>',
  '<div class="vw-description">',
  "<p>Welcome to a realistic, smooth-running virtual Sydney! Interact, learn, and play in digital spaces inspired by real Sydney locations. Represent yourself with an inclusive avatar and explore a world designed for creativity, collaboration, and neurodivergent empowerment.</p>",
  "<ul>",
  "<li><strong>Immersive & Interactive:</strong> Real-time movement, chat, and activities with other users.</li>",
  "<li><strong>Avatars:</strong> Customisable, accessible avatars for all abilities and identities, with smooth animations and realistic controls.</li>",
  "</ul>",
  '<div class="vw-cathedral">',
  '<img src="assets/images/cathedral_academy.png" alt="Cathedral Academy" class="cathedral-img" loading="lazy" />',
  "<p>Welcome to the grand Windgap Academy Clubhouse, set inside a magnificent cathedral-style building. Here, learners gather to play fun arcade games, explore, interact with AI avatars and certified learners, and take part in multiplayer challenges, races, and SIMS/Roblox-style activities.</p>",
  "<ul>",
  "<li><strong>Arcade Zone:</strong> Play classic and modern arcade games, earn educational tokens, and challenge friends.</li>",
  "<li><strong>AI Avatars & Certified Learners:</strong> Interact, collaborate, and learn with AI-powered avatars and other certified learners in a safe, moderated environment.</li>",
  "<li><strong>Multiplayer Games & Races:</strong> Join multiplayer games, team challenges, and exciting races across the cathedral and virtual Sydney.</li>",
  "<li><strong>SIMS/Roblox-Style Activities:</strong> Customise your avatar, build virtual spaces, complete tasks, and unlock new features.</li>",
  "<li><strong>Windgap Academy Store:</strong> Purchase avatar upgrades, game power-ups, clubhouse decorations, and more—everything is educational and relevant to gameplay, with no real-world transactions.</li>",
  "</ul>",
  '<div style="margin-top:16px;">',
  '<button onclick="window.route(\'avatar-builder\')" aria-label="Go to Avatar Builder">Avatar Builder</button>',
  '<button onclick="window.route(\'academy-store\')" aria-label="Go to Academy Store">Academy Store</button>',
  '<button onclick="window.route(\'game-modules\')" aria-label="Go to Arcade Zone">Arcade Zone</button>',
  "</div>",
  "<p>All activities are designed for fun, learning, and inclusion. The clubhouse is accessible, safe, and celebrates neurodiversity and creativity.</p>",
  '<div class="vw-entrance-animation">',
  '<img src="assets/images/cathedral_academy.png" alt="Cathedral Academy" class="cathedral-img" loading="lazy" />',
  '<div class="animated-doors"></div>',
  '<p class="entrance-welcome">Welcome! The grand doors open and you step into the magnificent Windgap Cathedral Clubhouse.</p>',
  "</div>",
  '<div class="vw-interactive-zones">',
  '<button onclick="enterArcade()">Enter Arcade Zone</button>',
  '<button onclick="startMultiplayerRace()">Start Multiplayer Race</button>',
  '<button onclick="interactWithAI()">Interact with AI Avatars</button>',
  '<button onclick="customiseClubhouse()">Customise Clubhouse</button>',
  "<button onclick=\"showRoom('common')\">Common Room</button>",
  "<button onclick=\"showRoom('hall')\">Great Hall</button>",
  "<button onclick=\"showRoom('dining')\">Dining Hall</button>",
  "<button onclick=\"showRoom('kitchen')\">Kitchen</button>",
  "<button onclick=\"showRoom('veggie')\">Vegetable Patch</button>",
  "<button onclick=\"showRoom('fruit')\">Fruit Orchard</button>",
  "<button onclick=\"showRoom('gym')\">Gym</button>",
  "<button onclick=\"showRoom('rec')\">Recreation Area</button>",
  "<button onclick=\"showRoom('dorm')\">Dorm Room</button>",
  "<button onclick=\"showRoom('home')\">Home Room</button>",
  "</div>",
  '<div id="vw-game-area"></div>',
  "</div>",
  "<button onclick=\"moveTo('botanic')\">Royal Botanic Garden</button>",
  "<button onclick=\"moveTo('zoo')\">Taronga Zoo</button>",
  "<button onclick=\"moveTo('harbour')\">Darling Harbour</button>",
  "<button onclick=\"moveTo('barangaroo')\">Barangaroo Reserve</button>",
  "<button onclick=\"moveTo('school')\">Virtual School</button>",
  "</div>",
  '<div id="vw-location-info"></div>',
  '<div class="vw-actions">',
  '<button onclick="customiseAvatar()">Customise Avatar</button>',
  "<button onclick=\"moveTo('cathedral')\">Cathedral Clubhouse</button>",
  "<button onclick=\"moveTo('arcade')\">Arcade Zone</button>",
  "<button onclick=\"moveTo('ai-avatars')\">AI Avatars</button>",
  "<button onclick=\"moveTo('multiplayer')\">Multiplayer Games</button>",
  "<button onclick=\"moveTo('races')\">Races</button>",
  "<button onclick=\"moveTo('sims')\">SIMS/Roblox Activities</button>",
  "<button onclick=\"moveTo('store')\">Academy Store</button>",
  '<button onclick="joinCommunity()">Join Community</button>',
  "<button onclick=\"window.route('dashboard')\">Return to Dashboard</button>",
  "</div>",
  '<div class="lesson-plan-au">',
  "<h3>Lesson Plan: Virtual World (Australian Curriculum, NSW Inclusive Education)</h3>",
  "<p>Objective: Foster creativity, collaboration, and inclusion in a digital environment. Empower neurodivergent and disabled learners to connect, express, and thrive.</p>",
  "<ul>",
  "<li>Encourage students to design their own virtual spaces and avatars, reflecting their identities and needs.</li>",
  "<li>Facilitate collaborative projects, social activities, and creative expression.</li>",
  "<li>Use reasonable adjustments and assistive technology to ensure full participation.</li>",
  "<li>Celebrate neurodiversity and difference as strengths.</li>",
  "</ul>",
  "<p>Educator Notes: Consult with students and families, use evidence-based inclusive practices, and reference NSW DoE and ACARA guidelines. Ensure every student is known, valued, and cared for.</p>",
  "</div>",
  "</section>",
].join("");
container.innerHTML = [
  '<div class="lesson-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;background:url(\'/assets/backgrounds/lesson-bg.svg\') center/cover no-repeat;"></div>',
  '<section id="virtual-world" class="card shadow-xl p-8 rounded-2xl mx-auto my-16 max-w-2xl relative bg-white/80 backdrop-blur-lg">',
  '<h2 id="virtual-heading" class="text-3xl font-bold text-primary mb-6">🌏 Virtual World</h2>',
  '<button id="enter-world" class="btn-primary nav-btn">Enter World</button>',
  '<div id="world-area"></div>',
  '<div class="vw-description">',
  "<p>Welcome to a realistic, smooth-running virtual Sydney! Interact, learn, and play in digital spaces inspired by real Sydney locations. Represent yourself with an inclusive avatar and explore a world designed for creativity, collaboration, and neurodivergent empowerment.</p>",
  "<ul>",
  "<li><strong>Immersive & Interactive:</strong> Real-time movement, chat, and activities with other users.</li>",
  "<li><strong>Avatars:</strong> Customisable, accessible avatars for all abilities and identities, with smooth animations and realistic controls.</li>",
  "</ul>",
  '<div class="vw-cathedral">',
  '<img src="assets/images/cathedral_academy.png" alt="Cathedral Academy" class="cathedral-img" loading="lazy" />',
  "<p>Welcome to the grand Windgap Academy Clubhouse, set inside a magnificent cathedral-style building. Here, learners gather to play fun arcade games, explore, interact with AI avatars and certified learners, and take part in multiplayer challenges, races, and SIMS/Roblox-style activities.</p>",
  "<ul>",
  "<li><strong>Arcade Zone:</strong> Play classic and modern arcade games, earn educational tokens, and challenge friends.</li>",
  "<li><strong>AI Avatars & Certified Learners:</strong> Interact, collaborate, and learn with AI-powered avatars and other certified learners in a safe, moderated environment.</li>",
  "<li><strong>Multiplayer Games & Races:</strong> Join multiplayer games, team challenges, and exciting races across the cathedral and virtual Sydney.</li>",
  "<li><strong>SIMS/Roblox-Style Activities:</strong> Customise your avatar, build virtual spaces, complete tasks, and unlock new features.</li>",
  "<li><strong>Windgap Academy Store:</strong> Purchase avatar upgrades, game power-ups, clubhouse decorations, and more—everything is educational and relevant to gameplay, with no real-world transactions.</li>",
  "</ul>",
  '<div style="margin-top:16px;">',
  '<button onclick="window.route(\'avatar-builder\')" aria-label="Go to Avatar Builder">Avatar Builder</button>',
  '<button onclick="window.route(\'academy-store\')" aria-label="Go to Academy Store">Academy Store</button>',
  '<button onclick="window.route(\'game-modules\')" aria-label="Go to Arcade Zone">Arcade Zone</button>',
  "</div>",
  "<p>All activities are designed for fun, learning, and inclusion. The clubhouse is accessible, safe, and celebrates neurodiversity and creativity.</p>",
  '<div class="vw-entrance-animation">',
  '<img src="assets/images/cathedral_academy.png" alt="Cathedral Academy" class="cathedral-img" loading="lazy" />',
  '<div class="animated-doors"></div>',
  '<p class="entrance-welcome">Welcome! The grand doors open and you step into the magnificent Windgap Cathedral Clubhouse.</p>',
  "</div>",
  '<div class="vw-interactive-zones">',
  '<button onclick="enterArcade()">Enter Arcade Zone</button>',
  '<button onclick="startMultiplayerRace()">Start Multiplayer Race</button>',
  '<button onclick="interactWithAI()">Interact with AI Avatars</button>',
  '<button onclick="customiseClubhouse()">Customise Clubhouse</button>',
  "<button onclick=\"showRoom('common')\">Common Room</button>",
  "<button onclick=\"showRoom('hall')\">Great Hall</button>",
  "<button onclick=\"showRoom('dining')\">Dining Hall</button>",
  "<button onclick=\"showRoom('kitchen')\">Kitchen</button>",
  "<button onclick=\"showRoom('veggie')\">Vegetable Patch</button>",
  "<button onclick=\"showRoom('fruit')\">Fruit Orchard</button>",
  "<button onclick=\"showRoom('gym')\">Gym</button>",
  "<button onclick=\"showRoom('rec')\">Recreation Area</button>",
  "<button onclick=\"showRoom('dorm')\">Dorm Room</button>",
  "<button onclick=\"showRoom('home')\">Home Room</button>",
  "</div>",
  '<div id="vw-game-area"></div>',
  "</div>",
  "<button onclick=\"moveTo('botanic')\">Royal Botanic Garden</button>",
  "<button onclick=\"moveTo('zoo')\">Taronga Zoo</button>",
  "<button onclick=\"moveTo('harbour')\">Darling Harbour</button>",
  "<button onclick=\"moveTo('barangaroo')\">Barangaroo Reserve</button>",
  "<button onclick=\"moveTo('school')\">Virtual School</button>",
  "</div>",
  '<div id="vw-location-info"></div>',
  '<div class="vw-actions">',
  '<button onclick="customiseAvatar()">Customise Avatar</button>',
  "<button onclick=\"moveTo('cathedral')\">Cathedral Clubhouse</button>",
  "<button onclick=\"moveTo('arcade')\">Arcade Zone</button>",
  "<button onclick=\"moveTo('ai-avatars')\">AI Avatars</button>",
  "<button onclick=\"moveTo('multiplayer')\">Multiplayer Games</button>",
  "<button onclick=\"moveTo('races')\">Races</button>",
  "<button onclick=\"moveTo('sims')\">SIMS/Roblox Activities</button>",
  "<button onclick=\"moveTo('store')\">Academy Store</button>",
  '<button onclick="joinCommunity()">Join Community</button>',
  "<button onclick=\"window.route('dashboard')\">Return to Dashboard</button>",
  "</div>",
  '<div id="avatar-builder-area"></div>',
  '<div class="lesson-plan-au">',
  "<h3>Lesson Plan: Virtual World (Australian Curriculum, NSW Inclusive Education)</h3>",
  "<p>Objective: Foster creativity, collaboration, and inclusion in a digital environment. Empower neurodivergent and disabled learners to connect, express, and thrive.</p>",
  "<ul>",
  "<li>Encourage students to design their own virtual spaces and avatars, reflecting their identities and needs.</li>",
  "<li>Facilitate collaborative projects, social activities, and creative expression.</li>",
  "<li>Use reasonable adjustments and assistive technology to ensure full participation.</li>",
  "<li>Celebrate neurodiversity and difference as strengths.</li>",
  "</ul>",
  "<p>Educator Notes: Consult with students and families, use evidence-based inclusive practices, and reference NSW DoE and ACARA guidelines. Ensure every student is known, valued, and cared for.</p>",
  "</div>",
  "</section>",
].join("");
// Avatar builder integration
window.customiseAvatar = function () {
  const area = document.getElementById("avatar-builder-area");
  import("./AvatarSystem.js").then((mod) => {
    new mod.AvatarSystem(area);
  });
};
// Animate heading and button
applyHeadingAnimation(document.getElementById("virtual-heading"));
applyButtonAnimation(document.getElementById("enter-world"));
// Accessibility
setAriaAttributes(document.getElementById("virtual-world"), {
  role: "region",
  label: "Virtual World",
});
// Removed stray HTML/JSX fragments. All initialization is above.
// Removed stray HTML/JSX fragments. All initialization is above.
// Simulated movement and location info
var rooms = {
  common: {
    name: "Common Room",
    desc: "A cosy space for socialising, relaxing, and group activities.",
  },
  hall: {
    name: "Great Hall",
    desc: "A grand hall for assemblies, celebrations, and large events.",
  },
  dining: {
    name: "Dining Hall",
    desc: "A welcoming dining area for meals, cooking games, and nutrition lessons.",
  },
  kitchen: {
    name: "Kitchen",
    desc: "A fully equipped kitchen for cooking activities, food games, and healthy eating lessons.",
  },
  veggie: {
    name: "Vegetable Patch",
    desc: "Grow and harvest veggies for cooking, science, and sustainability lessons.",
  },
  fruit: {
    name: "Fruit Orchard",
    desc: "Pick fresh fruit and learn about nutrition, biology, and healthy choices.",
  },
  gym: { name: "Gym", desc: "Exercise, play sports, and learn about health and wellbeing." },
  rec: {
    name: "Recreation Area",
    desc: "Play games, relax, and enjoy fun activities with friends.",
  },
  dorm: { name: "Dorm Room", desc: "Your personal space to rest, decorate, and reflect." },
  home: {
    name: "Home Room",
    desc: "Start your day, meet your mentor, and get ready for learning.",
  },
  library: {
    name: "Library",
    desc: "Read, research, and study in a quiet, resource-rich environment.",
  },
  art: { name: "Art Studio", desc: "Create, paint, and express yourself through art." },
  music: { name: "Music Room", desc: "Play instruments, sing, and explore music." },
  science: { name: "Science Lab", desc: "Experiment, discover, and learn about the world." },
  tech: { name: "Tech Lab", desc: "Build, code, and innovate with technology." },
  wellbeing: {
    name: "Wellbeing Centre",
    desc: "Relax, recharge, and access support for mental health and wellbeing.",
  },
  "student-council": {
    name: "Student Council Room",
    desc: "Meet Daisy and the student council to discuss school events and advocacy.",
  },
  "chancellor-office": {
    name: "Chancellor Andy's Office",
    desc: "Meet Andy, the Chancellor of Windgap Academy, for important decisions and leadership.",
  },
  "natalie-office": {
    name: "Natalie's Office",
    desc: "Meet Natalie, Head of Education, for help, advice, and support. She is neurodivergent and gives clever, witty tips for learning.",
  },
};
var info = {
  cathedral:
    "Cathedral Clubhouse: A grand, accessible academy building where learners gather for fun, learning, and community.",
  arcade:
    "Arcade Zone: Play educational arcade games, challenge friends, and earn tokens for achievements.",
  "ai-avatars":
    "AI Avatars: Interact with friendly AI avatars and certified learners, collaborate on projects, and learn together.",
  multiplayer:
    "Multiplayer Games: Join team challenges, races, and multiplayer activities designed for fun and learning.",
  races:
    "Races: Compete in exciting races across the clubhouse and virtual Sydney, celebrating effort and teamwork.",
  sims: "SIMS/Roblox Activities: Customise avatars, build virtual spaces, complete tasks, and unlock new features.",
  store:
    "Academy Store: Purchase avatar upgrades, game power-ups, and decorations—everything is educational and relevant to gameplay.",
  common: "Common Room: A cosy space for socialising, relaxing, and group activities.",
  hall: "Great Hall: A grand hall for assemblies, celebrations, and large events.",
  dining: "Dining Hall: A welcoming dining area for meals, cooking games, and nutrition lessons.",
  kitchen:
    "Kitchen: A fully equipped kitchen for cooking activities, food games, and healthy eating lessons.",
  veggie:
    "Vegetable Patch: Grow and harvest veggies for cooking, science, and sustainability lessons.",
  fruit: "Fruit Orchard: Pick fresh fruit and learn about nutrition, biology, and healthy choices.",
  gym: "Gym: Exercise, play sports, and learn about health and wellbeing.",
  rec: "Recreation Area: Play games, relax, and enjoy fun activities with friends.",
  dorm: "Dorm Room: Your personal space to rest, decorate, and reflect.",
  home: "Home Room: Start your day, meet your mentor, and get ready for learning.",
  bondi:
    "Bondi Beach: Enjoy the sun, sand, and social games. Accessible paths and sensory-friendly spaces for all.",
  opera:
    "Sydney Opera House: Attend virtual performances, music workshops, and creative events. Wheelchair access and Auslan interpreters available.",
  botanic:
    "Royal Botanic Garden: Mindfulness walks, nature exploration, and wellbeing activities. Quiet zones and visual supports for neurodivergent users.",
  zoo: "Taronga Zoo: Meet virtual animals, learn about biodiversity, and join conservation projects. Audio description and tactile activities included.",
  harbour:
    "Darling Harbour: Shop, dine, and explore interactive exhibits. All venues are accessible and inclusive.",
  barangaroo:
    "Barangaroo Reserve: Discover Indigenous culture, art, and community gatherings. Respect First Nations perspectives and connection to land.",
  school:
    "Virtual School: Collaborative learning, group projects, and inclusive classrooms. Reasonable adjustments and assistive technology for all.",
};
// Room teleportation logic
window.showRoom = function (room) {
  var gameArea = document.getElementById("vw-game-area");
  var r = rooms[room];
  if (r) {
    gameArea.innerHTML = "<h3>" + r.name + "</h3><p>" + r.desc + "</p>";
  }
};
// Location info logic
window.moveTo = function (location) {
  document.getElementById("vw-location-info").textContent = info[location] || "";
};
window.moveTo = function (location) {
  // ...existing code...
};
// Arcade Zone logic
window.enterArcade = function () {
  const gameArea = document.getElementById("vw-game-area");
  gameArea.innerHTML =
    "<h3>Arcade Zone</h3>" +
    "<p>Choose a game:</p>" +
    "<button onclick=\"playArcadeGame('math')\">Math Challenge</button>" +
    "<button onclick=\"playArcadeGame('memory')\">Memory Match</button>" +
    "<button onclick=\"playArcadeGame('reaction')\">Reaction Race</button>" +
    "<div id='arcade-game-content'></div>";
};
window.playArcadeGame = function (type) {
  const content = document.getElementById("arcade-game-content");
  if (type === "math") {
    content.innerHTML =
      "<p>Solve: 7 + 5 = ?</p><input id='math-input' type='number' /><button onclick=\"checkMathAnswer()\">Submit</button><div id='math-feedback'></div>";
  } else if (type === "memory") {
    content.innerHTML =
      "<p>Remember the sequence: Red, Blue, Green</p><input id='memory-input' type='text' placeholder='Type sequence...' /><button onclick=\"checkMemoryAnswer()\">Submit</button><div id='memory-feedback'></div>";
  } else if (type === "reaction") {
    content.innerHTML =
      "<p>Click as fast as you can!</p><button id='reaction-btn'>Click Me!</button><div id='reaction-feedback'></div>";
    var start = Date.now();
    document.getElementById("reaction-btn").onclick = function () {
      var time = Date.now() - start;
      document.getElementById("reaction-feedback").innerText = "Your time: " + time + " ms!";
    };
  }
};
window.checkMathAnswer = function () {
  const mathInput = document.getElementById("math-input");
  const mathFeedback = document.getElementById("math-feedback");
  const val = mathInput ? mathInput.value : "";
  if (mathFeedback) {
    mathFeedback.innerText = val == 12 ? "Correct!" : "Try again!";
  }
};
window.checkMemoryAnswer = function () {
  const memoryInput = document.getElementById("memory-input");
  const memoryFeedback = document.getElementById("memory-feedback");
  const val = memoryInput ? memoryInput.value.trim().toLowerCase() : "";
  if (memoryFeedback) {
    memoryFeedback.innerText = val === "red, blue, green" ? "Correct!" : "Try again!";
  }
};

// Multiplayer Race logic
window.startMultiplayerRace = function () {
  const gameArea = document.getElementById("vw-game-area");
  gameArea.innerHTML =
    "<h3>Multiplayer Race</h3>" +
    "<p>Race against AI avatars and other learners!</p>" +
    '<button onclick="runRace()">Start Race</button>' +
    "<div id='race-results'></div>";
};
window.runRace = function () {
  var results = document.getElementById("race-results");
  var racers = ["You", "Daisy (AI)", "Winnie (AI)", "Andy (AI)"];
  var times = [];
  for (var i = 0; i < racers.length; i++) {
    times.push(Math.floor(Math.random() * 2000 + 1000));
  }
  var sorted = [];
  for (var i = 0; i < racers.length; i++) {
    sorted.push({ name: racers[i], time: times[i] });
  }
  sorted.sort(function (a, b) {
    return a.time - b.time;
  });
  var ol = "<ol>";
  for (var i = 0; i < sorted.length; i++) {
    ol += "<li>" + sorted[i].name + ": " + sorted[i].time + " ms</li>";
  }
  ol += "</ol>";
  results.innerHTML = ol;
  if (sorted[0].name === "You") {
    results.innerHTML += "<p>Congratulations! You won the race!</p>";
  } else {
    results.innerHTML += "<p>" + sorted[0].name + " wins!</p>";
  }
};

// AI Avatar interaction logic
window.interactWithAI = function () {
  const gameArea = document.getElementById("vw-game-area");
  gameArea.innerHTML =
    "<h3>Academy Staff & Support</h3>" +
    "<p>Chat with:</p>" +
    "<button onclick=\"chatWithAI('Andy')\">Chancellor Andy</button>" +
    "<button onclick=\"chatWithAI('Natalie')\">Natalie (Head of Education)</button>" +
    "<button onclick=\"chatWithAI('Daisy')\">Daisy (Student President)</button>" +
    "<button onclick=\"chatWithAI('Winnie')\">Winnie (AI Mentor)</button>" +
    "<div id='ai-chat-content'></div>";
};
window.chatWithAI = function (name) {
  const content = document.getElementById("ai-chat-content");
  let responses = {
    Andy: "Welcome! I am Andy, Chancellor of Windgap Academy. I oversee all academy decisions and ensure every learner is supported. If you need help with leadership, advocacy, or big ideas, come see me in my office.",
    Natalie:
      "Hi! I'm Natalie, Head of Education. I'm neurodivergent, so if you ever feel stuck, confused, or need your work changed, come chat with me! I give the best tips for learning when your brain is a bit different—like, \"If you can't focus, try dancing while you study!\" Or, \"If you need a break, tell me and I'll make it happen!\" I'm a bit awkward, but super clever and always here for you.",
    Daisy:
      "Hey! I am Daisy, Student President and your advocate. I help learners understand concepts in simple ways, give demonstrations, tips, and make sure you always have a friend on your side. If you need support, come to the Student Council Room!",
    Winnie:
      "Hi! I am Winnie, your AI mentor. I can show you around, join a race, or help with any activity.",
  };
  content.innerHTML = "<p>" + responses[name] + "</p>";
  // Example: Link lessons/activities to rooms
  window.teleportToLessonRoom = function (lessonType) {
    const lessonRooms = {
      cooking: "kitchen",
      nutrition: "dining",
      gardening: "veggie",
      fruit: "fruit",
      exercise: "gym",
      art: "art",
      music: "music",
      science: "science",
      tech: "tech",
      wellbeing: "wellbeing",
      advocacy: "student-council",
      leadership: "chancellor-office",
      support: "natalie-office",
      study: "library",
      rest: "dorm",
      start: "home",
    };
    if (lessonRooms[lessonType]) {
      window.showRoom(lessonRooms[lessonType]);
    }
  };
};

// Clubhouse customisation logic
window.customiseClubhouse = function () {
  const gameArea = document.getElementById("vw-game-area");
  gameArea.innerHTML =
    "<h3>Customise Clubhouse</h3>" +
    "<p>Choose a decoration:</p>" +
    "<button onclick=\"addDecoration('Banner')\">Add Banner</button>" +
    "<button onclick=\"addDecoration('Plants')\">Add Plants</button>" +
    "<button onclick=\"addDecoration('Lights')\">Add Lights</button>" +
    "<div id='clubhouse-decor'></div>";
};
window.addDecoration = function (item) {
  const decor = document.getElementById("clubhouse-decor");
  decor.innerHTML = `<p>${item} added to the clubhouse!</p>`;

  // Avatar customisation logic
  window.customiseAvatar = function () {
    const gameArea = document.getElementById("vw-game-area");
    gameArea.innerHTML =
      "<h3>Customise Avatar</h3>" +
      "<p>Choose an outfit:</p>" +
      "<button onclick=\"changeAvatarOutfit('Casual')\">Casual</button>" +
      "<button onclick=\"changeAvatarOutfit('Sporty')\">Sporty</button>" +
      "<button onclick=\"changeAvatarOutfit('Formal')\">Formal</button>" +
      "<div id='avatar-outfit'></div>";
  };
  window.changeAvatarOutfit = function (style) {
    const outfit = document.getElementById("avatar-outfit");
    outfit.innerHTML = `<p>Avatar outfit changed to: ${style}</p>`;
    window.avatarOutfit = style;
  };
};
