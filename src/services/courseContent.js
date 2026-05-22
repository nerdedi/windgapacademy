/**
 * courseContent.js
 * Full multi-unit, multi-lesson instructional content for all Windgap Academy courses.
 * Structure: courseId → { units: [ { id, title, icon, summary, lessons: [ { id, title, content, activity, quiz? } ] } ] }
 */

// ─────────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────────
function mcq(prompt, options, correct) {
  return { type: "mcq", prompt, options, correct };
}
function ordering(prompt, steps, correctOrder) {
  return { type: "ordering", prompt, steps, correctOrder };
}
function checklist(prompt, items) {
  return { type: "checklist", prompt, items };
}
function fillBlank(prompt, answer) {
  return { type: "fill-blank", prompt, answer };
}
function scenario(prompt, options, correct, rationale) {
  return { type: "scenario", prompt, options, correct, rationale };
}

// ─────────────────────────────────────────────────────────────────
//  LIFE SKILLS COURSES
// ─────────────────────────────────────────────────────────────────

const communicationAskingForHelp = {
  units: [
    {
      id: "unit-1",
      title: "Unit 1 – Why Asking for Help Matters",
      icon: "💡",
      summary:
        "Explore why seeking help is a sign of strength, identify situations where help is needed, and understand the benefits of asking early.",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Asking for Help is a Strength",
          content: {
            introduction:
              "Many people think that asking for help is a sign of weakness. In fact, the opposite is true. Recognising when you need support and knowing how to ask for it are key life skills that everyone benefits from.",
            keyPoints: [
              "Everyone needs help at some point — it is completely normal.",
              "Asking for help early prevents small problems from becoming big ones.",
              "People who ask for help learn faster and feel less stressed.",
              "It shows self-awareness and responsibility.",
            ],
            explanation:
              "Think about a time you were stuck on something — a task at work, a form to fill out, or finding your way somewhere new. If you asked for help, you probably solved it quickly. If you didn't, it may have taken much longer or caused frustration. Asking for help is part of being an effective, independent adult.",
            example:
              "Matilda started a new job at a café. When she was unsure how to use the coffee machine, she asked her supervisor to show her. Her supervisor was happy to help, and Matilda felt confident after that.",
            tip: "Scaffold: It can help to write down your question before you ask it, so you feel prepared.",
          },
          activity: mcq(
            "Why is asking for help considered a strength?",
            [
              "It means you cannot do anything yourself",
              "It shows you are self-aware and want to learn",
              "It makes other people feel sorry for you",
              "It is only for people who are struggling",
            ],
            1,
          ),
        },
        {
          id: "lesson-1-2",
          title: "Recognising When You Need Help",
          content: {
            introduction:
              "Before you can ask for help, you need to recognise when you actually need it. This lesson will help you identify the signs that support would be useful.",
            keyPoints: [
              "Signs you may need help: feeling confused, making repeated mistakes, feeling overwhelmed, not knowing the next step.",
              'It is okay to say "I\'m not sure" or "I don\'t understand."',
              "Waiting too long to ask can make things harder.",
              "Trust your instincts — if something feels unclear, it probably needs clarification.",
            ],
            explanation:
              "There are many situations in daily life where support is needed: understanding a letter from the doctor, navigating a new bus route, completing paperwork, or learning a new skill at work. Recognising these moments is the first step.",
            example:
              "James received a letter about his NDIS review. He didn't understand some of the words. Instead of ignoring it, he recognised he needed help and called his support coordinator.",
            tip: "Make a short list of things that confuse you or make you feel stressed. These are areas where asking for help would be useful.",
          },
          activity: checklist("Tick each situation where asking for help would be appropriate:", [
            "You receive an official letter you don't understand",
            "You feel confident and know exactly what to do",
            "You are late for an appointment and don't know the bus route",
            "You feel overwhelmed by a new task at work",
            "You need to fill out a form but don't know what information is required",
          ]),
        },
        {
          id: "lesson-1-3",
          title: "The Benefits of Asking Early",
          content: {
            introduction:
              "The sooner you ask for help, the better. This lesson explains why early asking leads to better outcomes and less stress.",
            keyPoints: [
              "Early asking saves time and reduces mistakes.",
              "Waiting can turn a small misunderstanding into a big problem.",
              "Support workers, educators, and community members want to help you.",
              "Most people appreciate being asked early rather than late.",
            ],
            explanation:
              "When you wait to ask for help, problems can grow. For example, if you are unsure about a medication dosage and don't ask your pharmacist, you may take the wrong amount. If you ask early, you get the right information straight away. Early asking shows responsibility and helps you stay safe.",
            example:
              "Before her supermarket trip, Sarah realised she wasn't sure if she had enough money. She asked her support worker to help her check her account before leaving. This meant she didn't run short at the checkout.",
            tip: "If you feel nervous about asking, remember: the person you are asking is usually glad to help.",
          },
          activity: scenario(
            "You have started a new volunteer role and your supervisor gives you instructions you don't fully understand. What do you do?",
            [
              "Nod and hope you figure it out as you go",
              "Politely ask your supervisor to explain the steps again",
              "Leave without saying anything",
              "Wait until you make a mistake before asking",
            ],
            1,
            "Asking for clarification early helps you start the task correctly and shows initiative.",
          ),
        },
      ],
      quiz: [
        mcq(
          "Which of the following shows someone recognising they need help?",
          [
            "Ignoring a confusing letter",
            "Saying 'I'm not sure how to do this, can you show me?'",
            "Pretending to understand instructions",
            "Giving up on a task",
          ],
          1,
        ),
        mcq(
          "What is one benefit of asking for help early?",
          [
            "It makes you look inexperienced",
            "It wastes other people's time",
            "It prevents small problems from becoming big ones",
            "It means you never have to try things yourself",
          ],
          2,
        ),
        mcq(
          "Which word best describes asking for help?",
          ["Weak", "Embarrassing", "Responsible", "Unnecessary"],
          2,
        ),
      ],
    },
    {
      id: "unit-2",
      title: "Unit 2 – How to Ask for Help",
      icon: "🗣️",
      summary:
        "Learn polite phrases, the right tone and body language, and how to ask for help in different settings like home, community, and work.",
      lessons: [
        {
          id: "lesson-2-1",
          title: "Polite Phrases for Asking",
          content: {
            introduction:
              "The words you choose matter. Using polite, clear language makes it easier for people to understand what you need and feel happy to help.",
            keyPoints: [
              "Start with 'Excuse me' or 'Sorry to bother you' to show respect.",
              "Be specific about what you need help with.",
              "Use 'please' and 'thank you'.",
              "Keep your request short and clear.",
            ],
            explanation:
              'Here are some useful phrases:\n• "Excuse me, could you help me with this please?"\n• "I\'m not sure how to do this — could you show me?"\n• "I don\'t understand this part. Could you explain it differently?"\n• "Thank you so much for your help."\n\nThese phrases are polite and respectful. They make it easy for the other person to say yes.',
            example:
              "At the pharmacy, Liam wasn't sure which medicine to get. He said: \"Excuse me, I have a prescription but I'm not sure which product to pick up. Could you help me please?\" The pharmacist was happy to assist.",
            tip: "Practice these phrases out loud before you need them. Rehearsing helps you feel confident in the moment.",
          },
          activity: fillBlank(
            "Complete this sentence: 'Excuse me, could you _____ me with this form please?'",
            "help",
          ),
        },
        {
          id: "lesson-2-2",
          title: "Body Language and Tone",
          content: {
            introduction:
              "Communication is not just about words. Your body language and tone of voice also send a message. This lesson explores how to communicate in a way that is calm, clear, and approachable.",
            keyPoints: [
              "Make eye contact to show you are engaged (if comfortable).",
              "Stand or sit in a relaxed, open posture.",
              "Use a calm, clear tone of voice — not too quiet or too loud.",
              "Smile when appropriate — it makes conversations easier.",
            ],
            explanation:
              "When you approach someone for help, your non-verbal communication matters. If you seem tense, rushed, or avoid eye contact, it can make the interaction more awkward. Taking a breath, speaking calmly, and being open in your posture helps the other person feel comfortable and willing to assist.",
            example:
              "Amy needed help finding a product at the supermarket. She walked up to a staff member, made brief eye contact, smiled, and said 'Excuse me, could you help me find the pasta please?' Her calm tone and friendly manner meant the staff member was happy to walk her there.",
            tip: "If eye contact is difficult for you, it's okay to look at the person's forehead or chin — this still looks engaged.",
          },
          activity: mcq(
            "Which body language is most helpful when asking for help?",
            [
              "Arms crossed, looking away",
              "Relaxed posture, gentle eye contact, calm voice",
              "Rushing past someone and muttering your question",
              "Shouting to get attention quickly",
            ],
            1,
          ),
        },
        {
          id: "lesson-2-3",
          title: "Asking in Different Settings",
          content: {
            introduction:
              "You may need to ask for help in many different places — at home, in shops, at appointments, or at work. Each setting has slightly different expectations, but the core skills are the same.",
            keyPoints: [
              "At home: you can be informal and direct with family or support workers.",
              "In shops or services: be polite, patient, and specific.",
              "At appointments (doctor, Centrelink): bring a list of your questions.",
              "At work: ask your supervisor or a trusted colleague.",
            ],
            explanation:
              "Context matters. Asking your sister for help with laundry is different from asking your GP to explain a diagnosis. Adjust your language and approach based on the relationship and the setting, but always stay respectful and clear.",
            example:
              "Before his Centrelink appointment, Marcus wrote down three questions he wanted to ask: about his payment schedule, his income reporting, and how to update his address. At the appointment, he referred to his list and got clear answers to all three.",
            tip: "Writing down your questions before an appointment helps you remember everything you wanted to ask.",
          },
          activity: ordering(
            "Put these steps in order for asking for help at a doctor's appointment:",
            [
              "Write down your questions before you go",
              "Arrive on time and check in at reception",
              "When called in, greet the doctor calmly",
              "Ask your first question and listen carefully",
              "Thank the doctor and confirm any follow-up steps",
            ],
            [0, 1, 2, 3, 4],
          ),
        },
      ],
      quiz: [
        mcq(
          "Which phrase is the most polite way to ask for help?",
          [
            "Oi, help me!",
            "Excuse me, could you help me with this please?",
            "You need to help me now.",
            "I guess I need some help, whatever.",
          ],
          1,
        ),
        mcq(
          "What should you do before a medical appointment to make sure you get help with everything you need?",
          [
            "Hope you remember everything",
            "Ask someone else to go instead",
            "Write down your questions beforehand",
            "Wait for the doctor to guess what you need",
          ],
          2,
        ),
      ],
    },
    {
      id: "unit-3",
      title: "Unit 3 – Handling Responses & Staying Safe",
      icon: "🛡️",
      summary:
        "Learn how to handle situations when help is refused, find the right person to ask, and know when to escalate for safety.",
      lessons: [
        {
          id: "lesson-3-1",
          title: "When Help is Refused or Unavailable",
          content: {
            introduction:
              "Sometimes the person you ask may not be able to help. This doesn't mean the situation is hopeless — it means you need to find another way.",
            keyPoints: [
              "Not everyone can help every time — that's okay.",
              "Ask if they can direct you to someone who can help.",
              "Try a different person or a different service.",
              "Keep a list of key contacts for important situations.",
            ],
            explanation:
              "If a shop staff member says they don't know, you can ask: \"Could you tell me who would know?\" If a phone line is busy, try calling again or look online. Having a plan B means you won't be stuck.",
            example:
              "Priya asked a bus driver which stop to get off at, but the driver said they were too busy. Priya then asked another passenger, who was happy to point out the stop.",
            tip: "Keep a small card with important phone numbers: your support worker, GP, family member, and local council.",
          },
          activity: scenario(
            "You ask a supermarket staff member to help you find something and they say 'I don't know, sorry.' What do you do next?",
            [
              "Give up and leave the shop",
              "Get angry at the staff member",
              "Ask if they can direct you to someone who does know",
              "Wait and hope someone comes to you",
            ],
            2,
            "Redirecting your request is a smart strategy when the first person can't help.",
          ),
        },
        {
          id: "lesson-3-2",
          title: "Finding the Right Person to Ask",
          content: {
            introduction:
              "Choosing the right person to ask is just as important as how you ask. This lesson helps you identify who to approach in different situations.",
            keyPoints: [
              "In shops: look for staff uniforms or name badges.",
              "In hospitals or clinics: reception staff, nurses, or your GP.",
              "For NDIS or benefits: your support coordinator or Centrelink.",
              "For legal or official matters: a community legal centre or NDIS LAC.",
            ],
            explanation:
              "Each professional has a specific role. Your GP can advise on health, your support worker on daily living, and a financial counsellor on money matters. Matching your question to the right person means you get better, faster help.",
            example:
              "When Daniel received a confusing NDIS plan, he didn't ask his GP — instead he called his Local Area Coordinator (LAC) who explained the plan and what supports he was entitled to.",
            tip: "Create a 'Who to Ask' reference list for common situations you face.",
          },
          activity: checklist("Match each situation with the correct person to ask:", [
            "Health question → Ask your GP or pharmacist",
            "NDIS plan confusion → Ask your Support Coordinator or LAC",
            "Money or debt concern → Contact a financial counsellor",
            "Finding a product in a shop → Ask a shop staff member",
            "Legal rights → Contact a community legal centre",
          ]),
        },
        {
          id: "lesson-3-3",
          title: "Knowing When It's Urgent",
          content: {
            introduction:
              "Some situations require immediate help. This lesson teaches you to recognise an urgent situation and know what to do.",
            keyPoints: [
              "Call 000 for life-threatening emergencies (fire, serious injury, crime).",
              "Call your GP or after-hours health line for urgent medical questions.",
              "Contact your support worker if you feel unsafe or overwhelmed.",
              "Do not wait if you or someone else is in danger.",
            ],
            explanation:
              "In an emergency, staying calm is key. Know that 000 is free and available 24/7. The operator will ask: Police, Fire, or Ambulance? Stay on the line and answer clearly. Practice knowing your home address so you can give it quickly.",
            example:
              "When Lena smelled smoke in her kitchen, she remembered not to panic. She checked the source (it was toast burning), turned off the toaster, and opened the window. Had the fire been bigger, she was ready to call 000.",
            tip: "Practice saying your address out loud so you can give it confidently in an emergency.",
          },
          activity: mcq(
            "What number do you call in a life-threatening emergency in Australia?",
            ["111", "112", "000", "999"],
            2,
          ),
        },
      ],
      quiz: [
        mcq(
          "If the first person you ask for help can't help you, what should you do?",
          [
            "Give up",
            "Shout at them",
            "Ask if they can direct you to someone who can help",
            "Pretend you didn't need help",
          ],
          2,
        ),
        mcq(
          "Who is the best person to ask about your NDIS plan?",
          [
            "A random person on the street",
            "Your Local Area Coordinator or Support Coordinator",
            "Your hairdresser",
            "The checkout operator at the supermarket",
          ],
          1,
        ),
        mcq(
          "When should you call 000?",
          [
            "When you want to know the weather",
            "When you have a life-threatening emergency",
            "When a shop is out of your favourite product",
            "When you feel a bit tired",
          ],
          1,
        ),
      ],
    },
  ],
};

const cookingBasics = {
  units: [
    {
      id: "unit-1",
      title: "Unit 1 – Kitchen Safety & Hygiene",
      icon: "🧼",
      summary:
        "Learn how to keep yourself and your kitchen clean and safe before you start cooking.",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Washing Hands and Food Safety",
          content: {
            introduction:
              "Food safety starts before you touch any ingredients. Clean hands and surfaces prevent illness.",
            keyPoints: [
              "Wash hands for at least 20 seconds with soap and warm water before cooking.",
              "Wash hands after touching raw meat, poultry, or fish.",
              "Keep raw and cooked foods separate to avoid cross-contamination.",
              "Check use-by dates on all ingredients before using them.",
            ],
            explanation:
              "Foodborne illness (food poisoning) can be prevented with simple hygiene habits. Always wash hands before and after handling food, especially raw proteins. Use separate chopping boards for meat and vegetables where possible.",
            example:
              "Before making scrambled eggs, Jamie washed her hands, wiped down the bench, and checked the use-by date on the eggs and milk. This took two minutes and kept her meal safe.",
            tip: "Sing 'Happy Birthday' twice in your head while washing hands — that's roughly 20 seconds.",
          },
          activity: ordering(
            "Put these handwashing steps in the correct order:",
            [
              "Wet hands with warm water",
              "Apply soap",
              "Scrub all surfaces for 20 seconds",
              "Rinse thoroughly",
              "Dry with clean towel",
            ],
            [0, 1, 2, 3, 4],
          ),
        },
        {
          id: "lesson-1-2",
          title: "Using Kitchen Equipment Safely",
          content: {
            introduction:
              "Kitchens contain sharp and hot equipment. Knowing how to use them safely prevents cuts and burns.",
            keyPoints: [
              "Always cut away from your body when using knives.",
              "Use oven mitts when handling hot pots, pans, and baking trays.",
              "Never leave the stove unattended while cooking.",
              "Keep handles of pots and pans turned inward so they can't be knocked.",
            ],
            explanation:
              "Knives, ovens, and stovetops are essential kitchen tools but require care. Hold the knife firmly with fingers curled under (the 'claw' grip) to protect fingertips. When removing items from a hot oven, stand to the side and open the door slowly to release steam first.",
            example:
              "When boiling pasta, Nick made sure the pot handle was turned to the side, not sticking out where it could be bumped. He also stayed nearby and set a timer on his phone.",
            tip: "If a knife falls, step back — never try to catch it.",
          },
          activity: checklist("Before you start cooking, tick each safety check:", [
            "Hands are washed",
            "Bench/chopping board is clean",
            "Oven mitts are nearby if using the oven",
            "Pot handles are turned inward",
            "Knives are in safe reach but away from the edge",
          ]),
        },
      ],
      quiz: [
        mcq(
          "How long should you wash your hands before cooking?",
          ["5 seconds", "10 seconds", "20 seconds", "1 minute"],
          2,
        ),
        mcq(
          "What should you do when removing something from a hot oven?",
          [
            "Grab it quickly with bare hands",
            "Use oven mitts and stand to the side",
            "Use a tea towel folded once",
            "Ask someone else to do it",
          ],
          1,
        ),
      ],
    },
    {
      id: "unit-2",
      title: "Unit 2 – Following Recipes",
      icon: "📋",
      summary:
        "Read and follow simple recipes step-by-step, measure ingredients correctly, and understand cooking terms.",
      lessons: [
        {
          id: "lesson-2-1",
          title: "Reading a Recipe",
          content: {
            introduction:
              "A recipe is a set of instructions for making a dish. Knowing how to read and follow a recipe gives you the skills to cook many different meals.",
            keyPoints: [
              "Recipes list ingredients (what you need) and method (what to do).",
              "Read the whole recipe before you start cooking.",
              "Gather all ingredients and equipment first (this is called 'mise en place').",
              "Follow steps in order — skipping steps can ruin the dish.",
            ],
            explanation:
              "When you read a recipe, look for: ingredients list (with measurements), method steps in numbered order, cooking time and temperature, and serving size. Understanding each part means fewer surprises mid-cook.",
            example:
              "Before making tomato pasta, Sophie read the recipe twice, then collected all her ingredients: pasta, tin tomatoes, garlic, olive oil, and salt. She also got out a pot, a frying pan, a wooden spoon, and a colander before she started.",
            tip: "Highlight any steps that need timing (e.g. 'simmer for 10 minutes') before you begin.",
          },
          activity: mcq(
            "What should you do BEFORE you start cooking from a recipe?",
            [
              "Start cooking immediately",
              "Read the full recipe and gather all ingredients",
              "Buy more food just in case",
              "Ask someone to cook it for you",
            ],
            1,
          ),
        },
        {
          id: "lesson-2-2",
          title: "Measuring Ingredients",
          content: {
            introduction:
              "Measuring ingredients correctly makes a big difference, especially in baking. This lesson covers basic measuring skills.",
            keyPoints: [
              "Use measuring cups for dry and liquid ingredients.",
              "Level off dry ingredients with a flat edge for accuracy.",
              "Use a tablespoon (tbsp) for larger amounts and teaspoon (tsp) for smaller.",
              "For liquids, read the measurement at eye level.",
            ],
            explanation:
              "In recipes, 1 cup = 250 ml, 1 tablespoon = 20 ml, 1 teaspoon = 5 ml. Getting these right matters in baking where ratios affect the final result. In everyday cooking, you have more flexibility.",
            example:
              "Making banana bread, Callum carefully measured 2 cups of flour by scooping and levelling with a knife. He measured 1 tsp of baking powder precisely so the bread would rise correctly.",
            tip: "Keep a set of measuring cups and spoons in an easy-to-reach spot so you use them consistently.",
          },
          activity: mcq(
            "How many millilitres is 1 tablespoon?",
            ["5 ml", "10 ml", "20 ml", "50 ml"],
            2,
          ),
        },
        {
          id: "lesson-2-3",
          title: "Simple Meals to Make",
          content: {
            introduction:
              "With basic cooking skills, you can make healthy, affordable meals every day. This lesson covers three beginner-friendly recipes.",
            keyPoints: [
              "Scrambled eggs: whisk eggs, cook on low heat in butter, stir gently.",
              "Toast with toppings: toast bread, add avocado, peanut butter, or baked beans.",
              "Pasta with sauce: boil pasta, heat a jarred or homemade sauce, combine.",
            ],
            explanation:
              "These three meals require minimal equipment and ingredients, can be made in under 20 minutes, and provide good nutrition. Once you've mastered these, you can build to more complex recipes.",
            example:
              "For breakfast, Tom made scrambled eggs: he cracked 2 eggs into a bowl, added a splash of milk, whisked it, poured it into a lightly buttered pan on low heat, and stirred slowly until just set. He served it on toast.",
            tip: "Scrambled eggs are done when they are just slightly wet-looking — they continue cooking after you take them off the heat.",
          },
          activity: ordering(
            "Put the steps for making pasta in the correct order:",
            [
              "Boil a pot of water",
              "Add pasta to boiling water",
              "Cook for 10 minutes",
              "Drain pasta in colander",
              "Add sauce and serve",
            ],
            [0, 1, 2, 3, 4],
          ),
        },
      ],
      quiz: [
        mcq(
          "What is 'mise en place'?",
          [
            "A French dessert",
            "Gathering all ingredients and equipment before cooking",
            "A type of cutting technique",
            "Cleaning up after cooking",
          ],
          1,
        ),
        mcq("How many millilitres is 1 cup?", ["100 ml", "150 ml", "200 ml", "250 ml"], 3),
        mcq(
          "When are scrambled eggs done?",
          [
            "When they are completely dry and firm",
            "When they are just slightly wet-looking",
            "When they start to burn",
            "After 20 minutes of cooking",
          ],
          1,
        ),
      ],
    },
    {
      id: "unit-3",
      title: "Unit 3 – Planning Meals & Eating Well",
      icon: "🥗",
      summary:
        "Plan simple, affordable, nutritious meals for the week using a grocery list and budget.",
      lessons: [
        {
          id: "lesson-3-1",
          title: "Planning a Weekly Menu",
          content: {
            introduction:
              "Planning meals in advance saves money, reduces waste, and means you always have something to eat. This lesson shows you how to create a simple weekly meal plan.",
            keyPoints: [
              "Think of 3–5 dinners you want to cook this week.",
              "Check what you already have before shopping.",
              "Write a shopping list from your plan.",
              "Plan for leftovers — cook once, eat twice.",
            ],
            explanation:
              "A weekly menu plan removes the daily question of 'what's for dinner?' It also helps you buy only what you need and reduces food waste. Start with simple meals and build up your recipe repertoire over time.",
            example:
              "On Sunday, Brianna wrote out five dinners for the week: pasta, fried rice, chicken and vegetables, baked beans on toast, and soup. She checked her pantry, then wrote a shopping list for only the items she needed.",
            tip: "Keep a list on the fridge of meals you enjoy making. Pick from the list each week.",
          },
          activity: checklist("Before writing your shopping list, tick each step:", [
            "Check your fridge and pantry for what you already have",
            "Choose 3–5 meals for the week",
            "Write down every ingredient each meal needs",
            "Cross off ingredients you already have",
            "Organise your list by supermarket section",
          ]),
        },
      ],
      quiz: [
        mcq(
          "What is the main benefit of meal planning?",
          [
            "It makes cooking take longer",
            "It saves money and reduces food waste",
            "It means you never need to shop",
            "It only works for expert cooks",
          ],
          1,
        ),
      ],
    },
  ],
};

const shoppingMoneyHandling = {
  units: [
    {
      id: "unit-1",
      title: "Unit 1 – Understanding Money",
      icon: "💵",
      summary:
        "Identify Australian coins and notes, understand their values, and practise basic counting.",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Australian Coins and Notes",
          content: {
            introduction:
              "Australia uses dollars and cents. Knowing the value of each coin and note is the foundation of all money skills.",
            keyPoints: [
              "Coins: 5c, 10c, 20c, 50c, $1, $2",
              "Notes: $5, $10, $20, $50, $100",
              "100 cents = 1 dollar",
              "Notes are larger in value and used for bigger purchases.",
            ],
            explanation:
              "Each Australian coin has a distinct size and colour. The $2 coin is actually smaller than the $1 coin — many people find this surprising. Notes are distinguished by colour: $5 is pink/purple, $10 is blue, $20 is red, $50 is yellow, $100 is green.",
            example:
              "At the canteen, Lucy paid for her $3.50 lunch with a $5 note and received a $1 coin and a 50c coin as change.",
            tip: "Sort your coins by value and keep them in a coin purse — it makes counting easier at the counter.",
          },
          activity: mcq(
            "How many cents are in $2.50?",
            ["200 cents", "205 cents", "250 cents", "252 cents"],
            2,
          ),
        },
        {
          id: "lesson-1-2",
          title: "Counting Change",
          content: {
            introduction:
              "Being able to count change helps you check you've received the correct amount after a purchase.",
            keyPoints: [
              "Change = amount paid − price of item.",
              "Count up from the price to the amount you paid.",
              "Always check your change before leaving the counter.",
              "If you think the change is wrong, politely let the cashier know.",
            ],
            explanation:
              "If you pay $10 for an item that costs $6.40, your change is $3.60. Count it: $6.40 → $6.50 (10c) → $7.00 (50c) → $8.00 ($1) → $10.00 ($2) = $3.60 change.",
            example:
              "Teo bought a drink for $2.80 and paid with a $5 note. The cashier gave him $2.20 change. He counted: $2.80 → $3.00 (20c) → $5.00 ($2) = $2.20. Correct!",
            tip: "Count change before you leave the counter — once you walk away it's harder to check.",
          },
          activity: fillBlank(
            "You buy something for $4.60 and pay with a $10 note. Your change is $___.",
            "5.40",
          ),
        },
      ],
      quiz: [
        mcq("How many cents are in $1?", ["10 cents", "50 cents", "100 cents", "1000 cents"], 2),
        mcq(
          "You pay $20 for an item costing $13.75. How much change should you receive?",
          ["$6.25", "$7.25", "$6.75", "$5.25"],
          0,
        ),
      ],
    },
    {
      id: "unit-2",
      title: "Unit 2 – Shopping Smart",
      icon: "🛒",
      summary: "Create a shopping list, compare prices, and stick to a budget.",
      lessons: [
        {
          id: "lesson-2-1",
          title: "Making a Shopping List",
          content: {
            introduction:
              "A shopping list keeps you focused, saves time, and helps you spend only what you planned to.",
            keyPoints: [
              "Write your list before you go to the shop.",
              "Organise by category: fruit & veg, dairy, bread, tinned goods.",
              "Check what you already have at home before writing the list.",
              "Stick to the list to avoid impulse buys.",
            ],
            explanation:
              "Without a list, it's easy to forget what you need and buy things you don't. A well-organised list also speeds up your shopping trip.",
            example:
              "Before going to Aldi, Hannah wrote: 2x bread, milk, eggs, apples, pasta, tinned tomatoes, chicken breast. She organised it by section and got through the shop in 15 minutes.",
            tip: "Keep a notepad or app on your phone to add items as you run out of them during the week.",
          },
          activity: ordering(
            "Put these shopping preparation steps in order:",
            [
              "Check your pantry and fridge",
              "Plan your meals for the week",
              "Write your shopping list",
              "Organise the list by shop section",
              "Go shopping",
            ],
            [0, 1, 2, 3, 4],
          ),
        },
        {
          id: "lesson-2-2",
          title: "Comparing Prices and Value",
          content: {
            introduction:
              "Unit price (cost per 100g or per litre) helps you find the best value — even when package sizes differ.",
            keyPoints: [
              "Unit price tells you the cost per standard amount (e.g., per 100g).",
              "A bigger package is not always better value.",
              "Look for weekly specials and compare brands.",
              "Generic/home brands are usually cheaper and often similar quality.",
            ],
            explanation:
              "The shelf label in most supermarkets shows the unit price in small text. Comparing unit prices is the most accurate way to find value. For example, 500g cereal at $4.00 = 80c/100g; 750g at $5.00 = 67c/100g — the larger pack is cheaper per 100g.",
            example:
              "At Coles, Rosa compared two yoghurts: 500g tub at $4.50 (= 90c/100g) vs 1kg tub at $7.00 (= 70c/100g). She bought the 1kg tub because the unit price was lower.",
            tip: "Check the unit price on the shelf label — it's usually displayed in smaller text below the main price.",
          },
          activity: mcq(
            "Which is better value: 400g for $3.20 or 600g for $4.50?",
            [
              "400g for $3.20 (80c/100g)",
              "600g for $4.50 (75c/100g)",
              "They are exactly the same value",
              "You can't tell without more information",
            ],
            1,
          ),
        },
        {
          id: "lesson-2-3",
          title: "Sticking to a Budget",
          content: {
            introduction:
              "A grocery budget helps you manage your money and avoid overspending. This lesson gives practical strategies for shopping within your means.",
            keyPoints: [
              "Set a realistic weekly grocery budget before you shop.",
              "Use a calculator or mental maths to track spending as you go.",
              "Swap expensive items for budget alternatives.",
              "Avoid shopping when hungry — it leads to impulse buying.",
            ],
            explanation:
              "If your grocery budget is $80 per week, keep a running total as you shop. Round up each item (e.g. $3.49 → $4) to stay safely under budget. If you're approaching the limit, swap branded items for generics or skip non-essentials.",
            example:
              "Alex had a $60 budget. He used his phone calculator to track: bread $3, milk $2, eggs $4, vegetables $12, rice $2, chicken $10, pasta $2, sauce $2 = $37 total — well within budget.",
            tip: "Eat before you shop — studies show hungry shoppers spend 17% more.",
          },
          activity: mcq(
            "Why is it a good idea to avoid shopping when you are hungry?",
            [
              "It makes you forget your list",
              "You tend to buy more unnecessary items",
              "The shop will be more crowded",
              "You will walk faster and miss items",
            ],
            1,
          ),
        },
      ],
      quiz: [
        mcq(
          "What does 'unit price' help you do?",
          [
            "Decide which brand tastes better",
            "Compare value between different sized products",
            "Know how much change you'll get",
            "Find where items are in the shop",
          ],
          1,
        ),
        mcq(
          "What is a practical way to track your spending while shopping?",
          [
            "Memorise every price",
            "Use a calculator or phone to keep a running total",
            "Just guess and hope for the best",
            "Ask the cashier to tell you",
          ],
          1,
        ),
        mcq(
          "Before writing your shopping list, you should:",
          [
            "Buy what looks good in the shop",
            "Check what you already have at home",
            "Buy the most expensive brands",
            "Ask a friend what to buy",
          ],
          1,
        ),
      ],
    },
  ],
};

const workplaceBehaviour = {
  units: [
    {
      id: "unit-1",
      title: "Unit 1 – Professional Conduct",
      icon: "🤝",
      summary:
        "Understand what is expected in a workplace: punctuality, presentation, and respectful communication.",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Punctuality and Reliability",
          content: {
            introduction:
              "Being on time is one of the most important things your employer will notice. It shows respect for your role, your colleagues, and your customers.",
            keyPoints: [
              "Aim to arrive 5–10 minutes before your shift starts.",
              "If you are going to be late, call or message your supervisor as early as possible.",
              "Consistent lateness can lead to a formal warning or losing your job.",
              "Set alarms and plan your travel time with extra time for delays.",
            ],
            explanation:
              "Reliability means your employer can count on you. If you say you will do something, do it. If you cannot attend, communicate clearly and promptly. These habits build trust over time and open doors to more responsibility and pay rises.",
            example:
              "Kai started a packing job at 8am. He set two alarms — one at 6:30am and one at 6:45am — and left home at 7:20am, knowing the bus journey was 30 minutes. He arrived at 7:52am, signed in, and was ready to start at 8am.",
            tip: "Add 15 extra minutes to your estimated travel time for unexpected delays.",
          },
          activity: scenario(
            "You wake up late and realise you will be 20 minutes late to your shift. What do you do?",
            [
              "Say nothing and arrive late hoping no one notices",
              "Call your supervisor right away to let them know",
              "Skip the shift entirely",
              "Wait until you get there to explain",
            ],
            1,
            "Communicating early shows professionalism and gives your employer time to make adjustments.",
          ),
        },
        {
          id: "lesson-1-2",
          title: "Workplace Presentation",
          content: {
            introduction:
              "How you present yourself at work affects how colleagues, supervisors, and customers see you. This lesson covers dress standards and personal hygiene in a workplace setting.",
            keyPoints: [
              "Follow any uniform or dress code requirements.",
              "Clothes should be clean, tidy, and appropriate for the role.",
              "Good personal hygiene is essential (daily shower, clean teeth, deodorant).",
              "Remove excessive jewellery or fragrances if working in a food or health setting.",
            ],
            explanation:
              "First impressions matter. Presenting well shows you take your role seriously. If you're unsure about the dress code, ask your supervisor before your first day.",
            example:
              "Before her first shift at the bakery, Mei checked her contract — it said 'clean dark trousers and a black top.' She prepared her outfit the night before to avoid a rush in the morning.",
            tip: "Lay out your work clothes the night before so you have one less thing to think about in the morning.",
          },
          activity: checklist("Tick each item that is part of good workplace presentation:", [
            "Wearing clean and appropriate clothing",
            "Showering daily and using deodorant",
            "Arriving with your hair tidy",
            "Wearing strong perfume in a food service role",
            "Following the workplace dress code",
          ]),
        },
        {
          id: "lesson-1-3",
          title: "Respectful Communication at Work",
          content: {
            introduction:
              "Workplaces rely on respectful, clear communication. Knowing how to talk to colleagues and supervisors appropriately builds good relationships.",
            keyPoints: [
              "Use a polite, professional tone — avoid slang with supervisors.",
              "Listen carefully when given instructions.",
              "Ask for clarification if you don't understand.",
              "Give constructive, respectful feedback if asked.",
            ],
            explanation:
              "Different workplaces have different communication styles. A café may be more relaxed than a legal office. Observe how experienced staff communicate and follow their lead. In all cases, be respectful, patient, and honest.",
            example:
              "When Sam's manager gave him a new task, he listened carefully and then said: 'Just to check I've understood correctly — you'd like me to restock the shelves and then update the inventory spreadsheet?' The manager confirmed, and Sam completed the task correctly.",
            tip: "Repeating back instructions ('Just to check...') is a professional technique used even by senior staff.",
          },
          activity: mcq(
            "Your supervisor gives you a task but you don't fully understand one of the steps. What should you do?",
            [
              "Guess and hope for the best",
              "Ignore the step you don't understand",
              "Politely ask for clarification",
              "Ask a friend outside work instead",
            ],
            2,
          ),
        },
      ],
      quiz: [
        mcq(
          "Why is punctuality important at work?",
          [
            "It means you don't have to work hard",
            "It shows respect and builds trust with your employer",
            "It guarantees a pay rise",
            "It is only important on your first day",
          ],
          1,
        ),
        mcq(
          "If you are going to be late to work, what should you do?",
          [
            "Hope no one notices",
            "Call or message your supervisor as soon as possible",
            "Send a message after your shift",
            "Ask a colleague to cover for you without telling the supervisor",
          ],
          1,
        ),
      ],
    },
    {
      id: "unit-2",
      title: "Unit 2 – Workplace Rights & Responsibilities",
      icon: "⚖️",
      summary:
        "Learn your rights as an employee, understand workplace policies, and know how to handle conflict.",
      lessons: [
        {
          id: "lesson-2-1",
          title: "Your Rights as an Employee",
          content: {
            introduction:
              "Every worker in Australia has legal rights. Knowing these rights helps you advocate for fair treatment.",
            keyPoints: [
              "You are entitled to the National Minimum Wage.",
              "You have the right to a safe workplace (Work Health and Safety laws).",
              "You cannot be discriminated against due to disability, gender, race, or religion.",
              "You are entitled to breaks as set out in your award or enterprise agreement.",
            ],
            explanation:
              "The Fair Work Act 2009 governs employment in Australia. The Fair Work Ombudsman (fairwork.gov.au) provides free advice on your rights, pay rates, and how to resolve disputes.",
            example:
              "When Aiden was asked to work through his lunch break without pay, he checked the Fair Work website and found his award required a 30-minute unpaid break for a 6-hour shift. He politely raised this with his supervisor, who apologised and scheduled the break.",
            tip: "Save the Fair Work Ombudsman hotline: 13 13 94. It's free, confidential, and in many languages.",
          },
          activity: mcq(
            "What does the Fair Work Ombudsman do?",
            [
              "Writes workplace rosters",
              "Provides advice on workplace rights and pay",
              "Manages superannuation",
              "Trains new employees",
            ],
            1,
          ),
        },
        {
          id: "lesson-2-2",
          title: "Handling Workplace Conflict",
          content: {
            introduction:
              "Conflict at work is normal. Knowing how to handle it constructively protects your wellbeing and your job.",
            keyPoints: [
              "Address issues calmly and privately with the person involved.",
              "If direct conversation doesn't work, speak to your supervisor.",
              "Use 'I' statements: 'I felt uncomfortable when...' rather than 'You always...'",
              "Keep records of important interactions (dates, what was said).",
            ],
            explanation:
              "Most workplace conflicts can be resolved through calm, honest conversation. If informal resolution doesn't work, your workplace should have a formal grievance process. Your union (if you have one) or a community legal centre can also advise you.",
            example:
              "When a colleague kept taking credit for Priya's work in team meetings, she spoke to him privately and said: 'I've noticed the last two meetings my contributions weren't acknowledged. Can we agree to be clearer about who did what going forward?' He agreed and the issue stopped.",
            tip: "Keep a work diary — brief notes on what happened and when. This can be valuable if a formal complaint is ever needed.",
          },
          activity: mcq(
            "Which approach best handles workplace conflict?",
            [
              "Ignore it and hope it stops",
              "Shout at the colleague in front of everyone",
              "Speak calmly and privately with the person involved",
              "Quit the job immediately",
            ],
            2,
          ),
        },
      ],
      quiz: [
        mcq(
          "What is the Fair Work Act?",
          [
            "A guide to making fair food",
            "The law governing employment rights in Australia",
            "A training manual for new staff",
            "A list of suggested workplace rules",
          ],
          1,
        ),
        mcq(
          "Which is an example of a 'I' statement in conflict resolution?",
          [
            "You always make my work harder",
            "I felt frustrated when my work was not acknowledged",
            "You never listen to me",
            "You are wrong about this",
          ],
          1,
        ),
      ],
    },
    {
      id: "unit-3",
      title: "Unit 3 – Teamwork & Workplace Culture",
      icon: "👥",
      summary:
        "Contribute positively to team tasks, understand workplace culture, and build good working relationships.",
      lessons: [
        {
          id: "lesson-3-1",
          title: "Being a Good Team Member",
          content: {
            introduction:
              "Most workplaces involve teamwork. Being a reliable, supportive team member makes your workplace better for everyone.",
            keyPoints: [
              "Do your share of the work without being asked twice.",
              "Support colleagues when they need help.",
              "Share information that the team needs to succeed.",
              "Celebrate team wins — acknowledge others' contributions.",
            ],
            explanation:
              "Good team members communicate clearly, meet commitments, and put the group goal ahead of personal interests. When one person underperforms, it affects everyone. Conversely, a strong contributor lifts the whole team.",
            example:
              "During a busy lunch rush at the café, Zara saw her colleague struggling with a large order. Without being asked, she stepped in to help package the order. They finished together and the customer left happy.",
            tip: "Ask 'What can I do to help?' before a busy period — it builds goodwill and shows initiative.",
          },
          activity: scenario(
            "A team member is clearly struggling with their workload. You have finished your own tasks. What do you do?",
            [
              "Sit back and wait for your next task",
              "Point out their mistake to the supervisor",
              "Ask if there's anything you can do to help",
              "Do their work without telling them",
            ],
            2,
            "Offering help proactively shows teamwork and strengthens workplace relationships.",
          ),
        },
      ],
      quiz: [
        mcq(
          "What does being a good team member involve?",
          [
            "Only doing exactly what you're told",
            "Supporting colleagues and sharing responsibility",
            "Taking credit for others' work",
            "Avoiding teamwork whenever possible",
          ],
          1,
        ),
      ],
    },
  ],
};

const interviewPractice = {
  units: [
    {
      id: "unit-1",
      title: "Unit 1 – Preparing for an Interview",
      icon: "📚",
      summary:
        "Research the employer, understand the role, prepare answers to common questions, and plan your presentation.",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Researching the Employer",
          content: {
            introduction:
              "Going into an interview knowing about the company shows initiative and genuine interest. Employers notice when candidates have done their research.",
            keyPoints: [
              "Visit the company's website — read the 'About Us' section.",
              "Understand what the company does and who their customers are.",
              "Know the job description well — match your skills to it.",
              "Find out the company's values or mission statement.",
            ],
            explanation:
              "When an interviewer asks 'Why do you want to work here?', a candidate who answers with specific knowledge of the company stands out. It shows enthusiasm, preparation, and professionalism.",
            example:
              "Before her café interview, Emma visited the café's website and Instagram. She noted they specialised in gluten-free products and had won a local 'best coffee' award. In the interview she said: 'I was impressed by your commitment to inclusive menu options — that aligns with my values.'",
            tip: "Write down 2–3 interesting facts about the company before the interview.",
          },
          activity: checklist("Tick each preparation step before your interview:", [
            "Read the company website thoroughly",
            "Understand the job description and requirements",
            "Prepare 2–3 questions to ask the interviewer",
            "Know the company's mission or values",
            "Research the industry to understand the company's context",
          ]),
        },
        {
          id: "lesson-1-2",
          title: "Answering Common Questions",
          content: {
            introduction:
              "Many interview questions follow predictable patterns. Preparing answers in advance builds your confidence and helps you respond clearly.",
            keyPoints: [
              "'Tell me about yourself' — 2–3 sentence summary of your background and goal.",
              "'What are your strengths?' — give one concrete example for each strength.",
              "'Why do you want this job?' — link your skills and interests to the role.",
              "'What is your greatest weakness?' — name one real weakness and how you are working on it.",
            ],
            explanation:
              "The STAR method helps answer 'tell me about a time when...' questions:\n• Situation: describe the context\n• Task: what was your role?\n• Action: what did YOU do?\n• Result: what happened as a result?\n\nThis structure gives a complete, confident answer.",
            example:
              "Question: 'Tell me about a time you handled a difficult customer.' Answer: 'At my last job [S], I was at the front desk when a customer became very upset about a mistake on their order [T]. I calmly listened, apologised, and offered a replacement [A]. The customer thanked me and came back the following week [R].'",
            tip: "Practise the STAR method on 3–5 work or life examples before your interview.",
          },
          activity: ordering(
            "Put the STAR method steps in order:",
            [
              "Describe the Situation",
              "Explain the Task/role",
              "Describe the Action you took",
              "Share the Result",
            ],
            [0, 1, 2, 3],
          ),
        },
      ],
      quiz: [
        mcq(
          "What does the 'A' in the STAR method stand for?",
          ["About", "Action", "Assessment", "Aim"],
          1,
        ),
        mcq(
          "Why is researching a company before an interview important?",
          [
            "It is required by law",
            "It shows initiative and genuine interest",
            "It gives you something to talk about for an hour",
            "It replaces experience",
          ],
          1,
        ),
      ],
    },
    {
      id: "unit-2",
      title: "Unit 2 – Interview Day",
      icon: "🎤",
      summary:
        "Manage nerves, present yourself professionally, ask good questions, and follow up after the interview.",
      lessons: [
        {
          id: "lesson-2-1",
          title: "Managing Interview Nerves",
          content: {
            introduction:
              "Almost everyone feels nervous before an interview. These techniques help you channel that energy positively.",
            keyPoints: [
              "Deep breathing: breathe in for 4 counts, hold for 4, out for 6.",
              "Arrive early — rushing increases anxiety.",
              "Remember: the interviewer wants you to succeed.",
              "Power posing for 2 minutes before you go in can increase confidence.",
            ],
            explanation:
              "Nervousness is a physical response to a challenge — it means you care. Techniques like slow breathing reduce cortisol (the stress hormone). Arriving early gives you time to settle, use the bathroom, and review your notes.",
            example:
              "Before his interview, Marcus sat in his car for 10 minutes, did slow breathing, and reviewed his key examples. By the time he walked in, he felt calm and ready.",
            tip: "Prepare what you will wear, where you will park, and your route the day before. Remove every possible morning stressor.",
          },
          activity: mcq(
            "Which technique best helps manage interview nerves?",
            [
              "Arriving exactly on time to avoid waiting",
              "Breathing deeply and arriving early",
              "Drinking several coffees to stay alert",
              "Reviewing notes for the first time in the waiting room",
            ],
            1,
          ),
        },
        {
          id: "lesson-2-2",
          title: "Asking Good Questions",
          content: {
            introduction:
              "At the end of most interviews, you will be asked 'Do you have any questions for us?' Having thoughtful questions prepared shows genuine engagement.",
            keyPoints: [
              "Ask about the team you'd be working with.",
              "Ask about training and development opportunities.",
              "Ask what success looks like in the role.",
              "Avoid asking about salary in a first interview (unless prompted).",
            ],
            explanation:
              "Asking questions turns the interview into a two-way conversation. It signals that you are evaluating the role as much as they are evaluating you — a sign of confidence and self-awareness.",
            example:
              "Sam asked: 'What does success look like in this role in the first three months?' The interviewer was impressed and gave a detailed answer that helped Sam know exactly what to focus on if he got the job.",
            tip: "Prepare 3 questions — in case one gets answered during the interview, you'll still have two ready.",
          },
          activity: mcq(
            "Which question is most appropriate to ask at the end of a first interview?",
            [
              "What is the highest salary I can earn here?",
              "Can I have Fridays off?",
              "What does success look like in this role?",
              "How quickly will I get promoted?",
            ],
            2,
          ),
        },
      ],
      quiz: [
        mcq(
          "Why should you arrive early to an interview?",
          [
            "To prove you are keen",
            "To give yourself time to settle and reduce anxiety",
            "To look at other candidates",
            "To make the interviewer feel late",
          ],
          1,
        ),
        mcq(
          "Which question is most appropriate to ask an interviewer?",
          [
            "What is your turnover rate?",
            "What are the training opportunities available?",
            "Why did the last person leave?",
            "Do you do random drug tests?",
          ],
          1,
        ),
      ],
    },
  ],
};

const travelTraining = {
  units: [
    {
      id: "unit-1",
      title: "Unit 1 – Planning Your Journey",
      icon: "🗺️",
      summary:
        "Plan a bus or train journey, read timetables and maps, and identify the correct stops.",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Reading a Timetable",
          content: {
            introduction:
              "A timetable shows when transport services depart and arrive. Being able to read one means you can travel independently and on time.",
            keyPoints: [
              "Timetables show departure times in columns by stop.",
              "Bold times usually indicate peak service.",
              "Check if the service runs on weekends or public holidays.",
              "Allow extra time — aim for the service one before you need.",
            ],
            explanation:
              "Most timetables read left to right (time columns) and top to bottom (stops). Find your starting stop on the left side, then find your destination stop below it. The column with both times tells you which service to catch.",
            example:
              "Leonie needed to get to her appointment at 9:30am. She found the bus timetable online and identified the 8:52am service that arrived at her stop at 9:10am — giving her plenty of time.",
            tip: "Screenshot or print the relevant section of the timetable to take with you.",
          },
          activity: mcq(
            "You need to arrive by 10am. You find services at 9:15, 9:40, and 10:05am. Which should you catch?",
            [
              "9:15am — gives the most buffer time",
              "9:40am — arrives closest to 10am",
              "10:05am — you'll only be a few minutes late",
              "Any of them — it doesn't matter",
            ],
            0,
          ),
        },
        {
          id: "lesson-1-2",
          title: "Using a Transit Map",
          content: {
            introduction:
              "Transit maps show routes, stops, and connections. Learning to read them helps you navigate public transport with confidence.",
            keyPoints: [
              "Each coloured line represents a different route.",
              "Circles on the map are stops; larger circles may indicate interchanges.",
              "An interchange is where you can change from one route to another.",
              "The 'You Are Here' marker helps you find your current position.",
            ],
            explanation:
              "Start by finding your current location on the map. Then find your destination. Trace the route or routes needed to get there. If you need to change routes, identify the interchange stop.",
            example:
              "Omar needed to get from the city to the hospital. On the map, he saw he could take the Red Line to Central Station, then transfer to the Blue Line for two more stops to get off at Hospital Road.",
            tip: "Download the Transit app or Google Maps — they show live departure times and route instructions step by step.",
          },
          activity: ordering(
            "Put these steps for planning a transit journey in order:",
            [
              "Open a transit map or app",
              "Find your current location",
              "Find your destination",
              "Identify which route(s) to take",
              "Check departure times and platform",
            ],
            [0, 1, 2, 3, 4],
          ),
        },
      ],
      quiz: [
        mcq(
          "What is an interchange on a transit map?",
          [
            "A point where you can buy a ticket",
            "A stop where you can transfer to another route",
            "The starting stop of a route",
            "A toilet facility",
          ],
          1,
        ),
        mcq(
          "If you need to arrive at 2pm, which service should you aim for?",
          [
            "The one that arrives at exactly 2pm",
            "A service that arrives 10–15 minutes early",
            "The last service of the day",
            "The fastest service regardless of arrival time",
          ],
          1,
        ),
      ],
    },
    {
      id: "unit-2",
      title: "Unit 2 – Using Public Transport Safely",
      icon: "🚌",
      summary:
        "Purchase and validate tickets, travel safely, handle unexpected situations, and know who to contact.",
      lessons: [
        {
          id: "lesson-2-1",
          title: "Tickets and Opal/Myki Cards",
          content: {
            introduction:
              "Most Australian cities use tap-on/tap-off travel cards. This lesson covers how to use them correctly.",
            keyPoints: [
              "Top up your card at machines, newsagencies, or online.",
              "Tap on when you board and tap off when you exit.",
              "Travelling without tapping on is fare evasion — you can be fined.",
              "Check your balance before you travel to avoid issues.",
            ],
            explanation:
              "Cards like Opal (Sydney) or Myki (Melbourne) store credit. Each journey costs a set amount that is deducted from your balance. If your balance runs out mid-journey, you may be unable to tap off or could receive a penalty.",
            example:
              "Before her morning commute, Anna checked her Myki balance on the app — it was only $1.20. She topped it up by $20 using the app before leaving home.",
            tip: "Set up automatic top-up on your travel card so it never runs out.",
          },
          activity: mcq(
            "What happens if you tap on but forget to tap off?",
            [
              "Nothing — the journey is free",
              "You may be charged the maximum fare for the route",
              "Your card is automatically cancelled",
              "A fine is mailed to your home address",
            ],
            1,
          ),
        },
        {
          id: "lesson-2-2",
          title: "Staying Safe on Public Transport",
          content: {
            introduction:
              "Public transport is generally safe. These strategies help you travel with confidence.",
            keyPoints: [
              "Sit near other passengers or the driver if you feel unsafe.",
              "Keep your bag in front of you in crowded areas.",
              "Do not share personal information with strangers.",
              "If you feel threatened, press the emergency button or tell the driver.",
            ],
            explanation:
              "Most public transport incidents are minor and can be avoided with basic awareness. Trust your instincts — if something feels wrong, move to a busier part of the vehicle or platform.",
            example:
              "When a stranger started asking Tara personal questions on the train, she politely ended the conversation, moved to a different carriage, and sat near another passenger.",
            tip: "Save the transport authority's security line in your phone before you travel.",
          },
          activity: scenario(
            "You are on a bus late at night and someone is making you uncomfortable. What do you do?",
            [
              "Continue the conversation to be polite",
              "Move to a seat near the driver or other passengers",
              "Get off at the next stop regardless of where you are",
              "Ignore them and hope they stop",
            ],
            1,
            "Moving to a safer part of the vehicle is the best first response to feeling uncomfortable.",
          ),
        },
      ],
      quiz: [
        mcq(
          "Why is it important to tap off when exiting public transport?",
          [
            "It turns off the vehicle",
            "To avoid being charged the maximum fare",
            "So the driver knows how many passengers are on board",
            "To get a receipt",
          ],
          1,
        ),
        mcq(
          "If you feel unsafe on public transport, you should:",
          [
            "Share personal details to build trust with the person",
            "Move near the driver or other passengers",
            "Get off immediately at the next stop without checking where you are",
            "Pretend to be asleep",
          ],
          1,
        ),
      ],
    },
  ],
};

const resumeWriting = {
  units: [
    {
      id: "unit-1",
      title: "Unit 1 – Your Skills and Experience",
      icon: "🌟",
      summary:
        "Identify your skills, strengths, and work/life experience to form the basis of your resume.",
      lessons: [
        {
          id: "lesson-1-1",
          title: "What Are Transferable Skills?",
          content: {
            introduction:
              "Transferable skills are abilities that apply across many different jobs — even if you have no formal work experience, you likely have many of them.",
            keyPoints: [
              "Communication: writing emails, talking to customers, presenting ideas.",
              "Organisation: managing your time, keeping track of tasks, planning ahead.",
              "Problem-solving: finding solutions, adapting when things go wrong.",
              "Teamwork: working well with others, supporting colleagues.",
            ],
            explanation:
              "If you have volunteered, cared for a family member, managed a household, or participated in community groups, you have developed real and valuable skills. These are worth including on your resume.",
            example:
              "Fatima had never had a paid job, but she had volunteered at a community garden for two years. She listed: 'Volunteer Coordinator – coordinated weekly rosters for 8 volunteers, communicated with local council, organised equipment storage.'",
            tip: "Think about every role where you had responsibility for people, tasks, or resources — paid or unpaid.",
          },
          activity: checklist("Tick every transferable skill you have developed:", [
            "Communication (spoken or written)",
            "Organisation and planning",
            "Problem-solving",
            "Teamwork",
            "Customer service",
            "Time management",
            "Computer skills",
          ]),
        },
        {
          id: "lesson-1-2",
          title: "Writing About Your Experience",
          content: {
            introduction:
              "Each entry in your resume should describe what you did and what impact it had. Strong action verbs make your experience stand out.",
            keyPoints: [
              "Start each bullet point with an action verb: managed, organised, assisted, created.",
              "Be specific: 'served 30+ customers daily' not 'helped customers'.",
              "Focus on results where possible: 'reduced wait times by 20%'.",
              "Keep bullet points to 1–2 lines each.",
            ],
            explanation:
              "Compare these two descriptions:\nWeak: 'Helped in a kitchen'\nStrong: 'Prepared ingredients and assisted with cooking for up to 40 meals per service in a community kitchen setting'\n\nThe second gives the employer a clear picture of what you can do.",
            example:
              "Jordan's volunteer work became: 'Community Kitchen Volunteer (2022–2024) – Prepared and served meals for 30–50 community members weekly; maintained food safety standards; supported team coordination during high-volume service.'",
            tip: "Use the format: [Action verb] + [what you did] + [scale or result].",
          },
          activity: fillBlank(
            "Rewrite this resume bullet point using an action verb and a specific detail: 'Did some work with customers.' Your improved version starts with: '_____ customers with...'",
            "assisted",
          ),
        },
      ],
      quiz: [
        mcq(
          "What are transferable skills?",
          [
            "Skills specific to one job only",
            "Abilities that apply across many different jobs",
            "Computer programming skills",
            "Skills you learn in a formal TAFE course",
          ],
          1,
        ),
        mcq(
          "Which resume bullet point is stronger?",
          [
            "Helped customers",
            "Assisted 20+ customers daily with product inquiries and complaint resolution",
            "Was a customer service person",
            "Good with customers",
          ],
          1,
        ),
      ],
    },
    {
      id: "unit-2",
      title: "Unit 2 – Structuring Your Resume",
      icon: "📄",
      summary:
        "Learn the standard resume format, write a strong personal summary, and tailor your resume to a specific job.",
      lessons: [
        {
          id: "lesson-2-1",
          title: "Resume Structure",
          content: {
            introduction:
              "A clear, well-structured resume is easier for employers to read and makes a better first impression.",
            keyPoints: [
              "Sections: Personal details, Career Summary, Work Experience, Education, Skills, References.",
              "Keep to 1–2 pages maximum.",
              "Use clear headings and consistent formatting.",
              "List work experience most recent first (reverse chronological order).",
            ],
            explanation:
              "The order of your resume sections signals your priorities. Most Australian employers expect: contact details at the top, then a short career summary, then experience (most recent first), then qualifications, skills, and references available on request.",
            example:
              "Ben's one-page resume had: his name and phone/email at the top, a 3-sentence career summary, his two previous jobs (most recent first with bullet points), his Certificate II in Hospitality, and 'References available on request' at the bottom.",
            tip: "Use PDF format when sending your resume by email — it preserves your formatting.",
          },
          activity: ordering(
            "Arrange these resume sections in the most common order:",
            [
              "Contact details",
              "Career summary",
              "Work experience (most recent first)",
              "Education and qualifications",
              "Key skills",
              "References",
            ],
            [0, 1, 2, 3, 4, 5],
          ),
        },
        {
          id: "lesson-2-2",
          title: "Tailoring Your Resume",
          content: {
            introduction:
              "A resume tailored to a specific job is far more effective than a generic one. This lesson shows you how to customise quickly and effectively.",
            keyPoints: [
              "Read the job ad carefully and note key words and phrases.",
              "Mirror the language from the ad in your resume.",
              "Highlight experience most relevant to this specific role.",
              "Adjust your career summary for each application.",
            ],
            explanation:
              "Many employers use Applicant Tracking Systems (ATS) that scan for keywords from the job ad. If your resume doesn't include these words, it may be filtered out before a human reads it.",
            example:
              "The job ad for a retail assistant said 'strong customer service skills, cash handling experience, and ability to work in a team.' Rosa made sure those exact phrases appeared in her career summary and experience sections.",
            tip: "Keep a 'master resume' with all your experience, then copy and tailor it for each new application.",
          },
          activity: mcq(
            "Why should you tailor your resume for each job application?",
            [
              "It takes less time than writing a general resume",
              "Employers use keyword scanning and tailored resumes are more likely to be read",
              "All employers want the same skills",
              "Tailoring makes your resume longer",
            ],
            1,
          ),
        },
      ],
      quiz: [
        mcq(
          "In which order should work experience be listed on a resume?",
          ["Alphabetical by employer name", "Most recent first", "Oldest first", "By industry"],
          1,
        ),
        mcq(
          "What is one reason tailoring your resume matters?",
          [
            "It helps you avoid writing too much",
            "Employers may use keyword scanning software",
            "It means you don't need references",
            "It replaces a cover letter",
          ],
          1,
        ),
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────
//  CONTENT MAP — maps courseId → units content
// ─────────────────────────────────────────────────────────────────
const CONTENT_MAP = {
  "communication-asking-for-help": communicationAskingForHelp,
  "cooking-basics": cookingBasics,
  "shopping-money-handling": shoppingMoneyHandling,
  "workplace-behaviour": workplaceBehaviour,
  "interview-practice": interviewPractice,
  "travel-training": travelTraining,
  "resume-writing": resumeWriting,
};

/**
 * Get full unit/lesson content for a course
 * @param {string} courseId
 * @returns {{ units: Array } | null}
 */
export function getCourseContent(courseId) {
  return CONTENT_MAP[courseId] || null;
}

/**
 * Get a specific unit from a course
 */
export function getCourseUnit(courseId, unitId) {
  const content = getCourseContent(courseId);
  if (!content) return null;
  return content.units.find((u) => u.id === unitId) || null;
}

/**
 * Get a specific lesson from a course unit
 */
export function getCourseLesson(courseId, unitId, lessonId) {
  const unit = getCourseUnit(courseId, unitId);
  if (!unit) return null;
  return unit.lessons.find((l) => l.id === lessonId) || null;
}

export default { getCourseContent, getCourseUnit, getCourseLesson };
