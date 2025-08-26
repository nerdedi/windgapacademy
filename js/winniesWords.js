  // Winnie voice lines (text and audio)
  const winnieVoiceLines = {
    welcome: {
      text: "Hi, I'm Winnie! Ready to play Winnie's Words? Let's learn and have fun together!",
      audio: "assets/winnie-voice/welcome.mp3"
    },
    correct: {
      text: "Great job! You found a letter! You're on a roll!",
      audio: "assets/winnie-voice/correct.mp3"
    },
    incorrect: {
      text: "Oops! That letter isn't in the phrase. Try again, superstar!",
      audio: "assets/winnie-voice/incorrect.mp3"
    },
    win: {
      text: "Congratulations! You solved the phrase! You're a language legend!",
      audio: "assets/winnie-voice/win.mp3"
    },
    lose: {
      text: "Better luck next time! Let's try again and keep learning!",
      audio: "assets/winnie-voice/lose.mp3"
    },
    bonus: {
      text: "Bonus Round! Double points if you guess the next phrase without missing a letter!",
      audio: "assets/winnie-voice/bonus.mp3"
    }
  };

  function playWinnieVoice(type) {
    const line = winnieVoiceLines[type];
    if (line && line.audio) {
      const sound = new Howl({ src: [line.audio], volume: 0.8 });
      sound.play();
    }
  }
// Winnie's Words - Language Module Game Show
// Hosted by Winnie, educator mascot at Windgap Academy

document.addEventListener('DOMContentLoaded', () => {
  // Game State
  const startGame = document.querySelector('.startBtn');
  const overlay = document.getElementById('overlay');
  const phrase = document.getElementById('phrase');
  const qwerty = document.getElementById('qwerty');
  const buttons = document.querySelectorAll('#qwerty button');
  const displayScore = document.querySelectorAll('#banner #score');
  const tries = document.querySelectorAll('#scoreboard li img');
  const hostArea = document.createElement('div');
  hostArea.id = 'host-area';
  // Mascot and speech bubble are now in HTML, update speech bubble dynamically

  // Phrases for language learning (idioms, vocabulary, etc.)
  const phrases = [
    'break the ice',
    'piece of cake',
    'hit the books',
    'under the weather',
    'once in a blue moon',
    'spill the beans',
    'back to square one',
    'let the cat out of the bag',
    'costs an arm and a leg',
    'the ball is in your court'
  ];

  // Game variables
  let letterFound = false;
  let letters;
  let losses = 0;
  let wins = 0;
  let missed = 0;
  let win = null;

  function setWinnieDialogue(type) {
      const speech = document.getElementById('winnie-speech');
      let text = winnieVoiceLines[type]?.text || type;
      if (speech) {
        speech.textContent = text;
        speech.classList.remove('animate-bounce-in');
        void speech.offsetWidth; // trigger reflow
        speech.classList.add('animate-bounce-in');
      }
      playWinnieVoice(type);
  }

  function addPhraseToDisplay() {
    phrase.innerHTML = '<ul></ul>';
    let random = Math.floor(Math.random() * phrases.length);
    let splitPhrase = phrases[random].split('');
    let word = 0;
    for (let i = 0; i < splitPhrase.length; i++) {
      let li = document.createElement('LI');
      if (splitPhrase[i] !== ' ') {
        li.appendChild(document.createTextNode(splitPhrase[i]));
        li.classList.add('letter');
        phrase.children[word].appendChild(li);
      } else {
        li.classList.add('space');
        phrase.appendChild(document.createElement('UL'));
        word++;
      }
    }
    letters = document.querySelectorAll('.letter');
    rollOut(letters.length, 'animate-in');
    setWinnieDialogue('welcome');
  }

  function checkLetter(playerLetter) {
    letterFound = false;
    // Defensive: ensure letters is a valid NodeList
    if (!letters || typeof letters.length === 'undefined') {
      letters = document.querySelectorAll('.letter');
    }
    for (let i = 0; i < letters.length; i++) {
      if (letters[i].innerHTML && letters[i].innerHTML.toLowerCase() === playerLetter.toLowerCase()) {
        letterFound = true;
        letters[i].classList.add('show');
      }
    }
    if (!letterFound) {
      if (tries && tries[missed]) {
        tries[missed].src = 'images/lostHeart.png';
      }
      missed++;
      setWinnieDialogue('incorrect');
    } else {
      setWinnieDialogue('correct');
    }
    return letterFound;
  }

  function checkWinState() {
    let found = document.querySelectorAll('.show');
    win = (found.length === letters.length) ? 'won' : (missed === 5) ? 'lost' : null;
    if (win === 'won') {
      setMessage(win);
      wins++;
      displayScore[0].innerHTML = `Wins: ` + wins;
      rollOut(letters.length, 'animate-out');
      setWinnieDialogue('win');
    } else if (win === 'lost') {
      setMessage(win);
      losses++;
      displayScore[1].innerHTML = `Losses: ` + losses;
      rollOut(letters.length, 'animate-out');
      setWinnieDialogue('lose');
    }
  }

  function setMessage(wonLost) {
    let message = document.querySelector('#overlay h2');
    setTimeout(function () {
      message.innerHTML = `You ${wonLost}! Play again?`;
      overlay.className = `${wonLost} slide-in-left`;
    }, 2000);
  }

  function rollOut(i, direction) {
    setTimeout(() => {
      if (i < 0) return;
      if (direction === 'animate-out') {
        letters[i - 1].className = letters[i - 1].className.replace(/(?:^|\s)animate-in(?!\S)/g, ' animate-out');
      } else {
        letters[i - 1].classList.add(direction);
      }
      if (i > 1) rollOut(i - 1, direction);
    }, 100);
  }

  function clearBoard() {
    let li = document.querySelectorAll('#phrase li');
    let ul = document.querySelectorAll('#phrase ul');
    missed = 0;
    let loopCap = Math.max(li.length, buttons.length);
    for (let i = 0; i < loopCap; i++) {
      if (tries[i]) tries[i].src = 'images/liveHeart.png';
      if (buttons[i]) {
        buttons[i].className = '';
        buttons[i].disabled = false;
      }
      if (li[i]) li[i].remove();
      if (ul[i]) ul[i].remove();
    }
    overlay.className = 'start slide-out-right';
  setWinnieDialogue('welcome');
  }

  function getCurrentPhrase() {
    let phraseText = '';
    document.querySelectorAll('#phrase .letter').forEach(l => phraseText += l.innerHTML);
    return phraseText;
  }

  // Add event listeners
  qwerty.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && win === null) {
      let clickedBtn = e.target;
      clickedBtn.disabled = true;
      clickedBtn.className = checkLetter(clickedBtn.innerHTML) ? 'correct' : 'wrong';
      checkWinState();
    }
  });

  startGame.addEventListener('click', () => {
    clearBoard();
    addPhraseToDisplay();
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && !document.querySelector('.letter')) {
      clearBoard();
      addPhraseToDisplay();
    }
    buttons.forEach(button => {
      if (e.key.toLowerCase() === button.innerHTML.toLowerCase() && win === null) {
        button.disabled = true;
        button.className = checkLetter(button.innerHTML) ? 'correct' : 'wrong';
        checkWinState();
      }
    });
  });

  // Game show features: random bonus round
  function bonusRound() {
    setWinnieDialogue('bonus');
    missed = 0;
    addPhraseToDisplay();
    // Implement bonus scoring logic as needed
  }

  // Add a button for bonus round
  const bonusBtn = document.createElement('button');
  bonusBtn.textContent = 'Bonus Round!';
  bonusBtn.className = 'startBtn';
  bonusBtn.onclick = bonusRound;
  document.getElementById('winnies-words').appendChild(bonusBtn);

  // Add sound effects (optional)
  // let winSound = new Audio('sounds/win.mp3');
  // let loseSound = new Audio('sounds/lose.mp3');
  // Play winSound/loseSound in setMessage()
});
