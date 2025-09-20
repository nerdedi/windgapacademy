import { createLessonTemplate, DIFFICULTY_LEVELS } from "../lessonModel";

/**
 * Life Skills Lessons - All difficulty levels
 */

// Travel Training
const travelTrainingBeginner = createLessonTemplate({
  id: "life-skills-travel-training-beginner",
  title: "Introduction to Public Transport",
  description: "Learn the basics of using public transport safely and confidently.",
  category: "Life Skills",
  subcategory: "Travel Training",
  difficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
  duration: 45,
  learningObjectives: [
    "Identify different types of public transport",
    "Understand basic transport terminology",
    "Learn how to purchase tickets",
  ],
  content: [
    {
      type: "text",
      title: "Types of Public Transport",
      body: `
# Types of Public Transport

Public transport includes several different ways to travel around your community. Let's learn about the main types:

## Buses
- Travel on roads and have many stops
- You need to signal to the driver when you want to get off
- Usually have route numbers and signs showing their destination

## Trains
- Travel on railway tracks
- Stop at stations that have names
- Often faster than buses for longer journeys
- You may need to use stairs, elevators, or escalators at stations

## Trams/Light Rail
- Similar to trains but usually in city areas
- Often share the road with cars
- Have frequent stops

## Ferries
- Travel across water
- Connect places separated by rivers, harbors or bays
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/life-skills/transport-types.jpg",
      alt: "Different types of public transport: bus, train, tram, and ferry",
      caption: "The main types of public transport you might use",
    },
    {
      type: "text",
      title: "Transport Terminology",
      body: `
# Important Words to Know

When using public transport, you'll hear these important words:

## Fare
This is the price you pay for your journey.

## Ticket
What you buy to show you have paid for your journey.

## Concession
A special, cheaper price for students, seniors, or people with disabilities.

## Timetable
Shows when transport services arrive and depart.

## Route
The path that a bus, train or tram follows.

## Platform/Stop
Where you wait for your train, bus or tram.

## Terminus
The final stop on a route.
      `,
    },
    {
      type: "video",
      title: "How to Buy Transport Tickets",
      src: "https://example.com/videos/buying-tickets.mp4",
      transcript:
        "This video demonstrates how to purchase tickets from different machines and counters. It shows step-by-step instructions for using ticket machines, approaching ticket counters, and using transport cards.",
    },
  ],
  activities: [
    {
      type: "matching",
      title: "Match the Transport Terms",
      instructions: "Match each term with its correct definition.",
      items: [
        { term: "Fare", definition: "The price you pay for your journey" },
        { term: "Platform", definition: "Where you wait for your train" },
        { term: "Route", definition: "The path that a transport service follows" },
        { term: "Terminus", definition: "The final stop on a route" },
        { term: "Concession", definition: "A special, cheaper price for eligible people" },
      ],
    },
    {
      type: "sorting",
      title: "Ticket Buying Steps",
      instructions: "Put these steps for buying a ticket in the correct order.",
      items: [
        "Decide where you want to go",
        "Check the fare price",
        "Have your money or card ready",
        "Purchase your ticket",
        "Keep your ticket safe for your journey",
      ],
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Public Transport Quiz",
      questions: [
        {
          question: "Where would you wait for a train?",
          options: ["At a bus stop", "On a platform", "At a terminus", "In a ticket office"],
          correctAnswer: "On a platform",
        },
        {
          question: "What is a fare?",
          options: [
            "A type of train",
            "The price of your journey",
            "A transport timetable",
            "A bus route",
          ],
          correctAnswer: "The price of your journey",
        },
        {
          question: "Which of these is NOT a common type of public transport?",
          options: ["Bus", "Train", "Airplane", "Tram"],
          correctAnswer: "Airplane",
        },
        {
          question: "What should you do with your ticket during your journey?",
          options: [
            "Throw it away",
            "Give it to the driver",
            "Keep it safe",
            "Leave it on your seat",
          ],
          correctAnswer: "Keep it safe",
        },
      ],
    },
  ],
  resources: [
    { type: "pdf", title: "Public Transport Guide", url: "/resources/public-transport-guide.pdf" },
    { type: "link", title: "Local Transport Website", url: "https://example.com/local-transport" },
  ],
  accessibilityFeatures: {
    visualAids: true,
    screenReaderFriendly: true,
    highContrast: true,
    simplifiedLanguage: true,
  },
  neurodivergentConsiderations: {
    clearStructure: true,
    sensoryConsiderations:
      "Includes alternatives for those who may feel overwhelmed in busy transport settings",
    executiveFunctionSupport: "Step-by-step guides for ticket purchase processes",
  },
});

const travelTrainingIntermediate = createLessonTemplate({
  id: "life-skills-travel-training-intermediate",
  title: "Planning Your Journey",
  description:
    "Learn how to plan trips using public transport, read maps and timetables, and handle unexpected changes.",
  category: "Life Skills",
  subcategory: "Travel Training",
  difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
  duration: 60,
  learningObjectives: [
    "Read and understand transport maps and timetables",
    "Plan multi-stage journeys",
    "Handle unexpected changes to travel plans",
    "Use transport apps and websites",
  ],
  prerequisites: ["life-skills-travel-training-beginner"],
  content: [
    {
      type: "text",
      title: "Reading Transport Maps",
      body: `
# How to Read Transport Maps

Transport maps help you understand routes and plan your journey. Here's how to read them:

## Map Symbols
- Lines show routes (different colors for different routes)
- Dots or squares show stops or stations
- Larger dots may show interchange stations (where you can change to another route)
- Symbols may show facilities like toilets, accessible entrances, or bike storage

## Network Maps vs. Route Maps
- Network maps show the whole system
- Route maps show just one route in detail

## How to Use Maps
1. Find where you are starting from
2. Find your destination
3. Look for routes that connect these points
4. Check for any interchanges needed
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/life-skills/transport-map-example.jpg",
      alt: "Example of a public transport network map",
      caption: "An example transport network map with routes, stops and interchanges",
    },
    {
      type: "text",
      title: "Understanding Timetables",
      body: `
# Reading Timetables

Timetables tell you when services run. Here's how to read them:

## Parts of a Timetable
- Routes are usually shown at the top
- Times are listed down the page
- Days of the week may be in different columns
- Bold text or symbols may show important information

## How to Read a Timetable
1. Find the route you need
2. Look for the day you want to travel
3. Find your departure stop in the left column
4. Read across to find the time the service departs
5. Continue reading down to find when it arrives at your destination

## Special Services
- Some services only run at certain times (peak hours)
- Some may only run on certain days
- Look for notes or symbols that explain any restrictions
      `,
    },
    {
      type: "interactive",
      title: "Interactive Timetable Reader",
      src: "interactive-timetable-exercise",
      description:
        "Practice reading a sample timetable to find departure and arrival times for different journeys.",
    },
    {
      type: "text",
      title: "Planning Multi-Stage Journeys",
      body: `
# Planning Journeys with Connections

Many journeys require changing from one service to another. Here's how to plan them:

## Steps for Planning
1. Identify your starting point and destination
2. Find routes that can connect these places
3. Check if you need to change to another service
4. Look at the timetables for each part of your journey
5. Allow extra time for making connections
6. Check if your ticket covers the whole journey

## Tips for Connections
- Allow at least 10 minutes between services
- Check if the connection is in the same station or nearby
- If possible, have a backup plan in case you miss a connection
      `,
    },
    {
      type: "video",
      title: "Using Transport Apps",
      src: "https://example.com/videos/transport-apps.mp4",
      transcript:
        "This video demonstrates how to use transport planning apps on smartphones. It shows searching for routes, checking real-time arrivals, and setting up alerts for service changes.",
    },
    {
      type: "text",
      title: "Handling Unexpected Changes",
      body: `
# What to Do When Things Change

Sometimes transport doesn't run as planned. Here's what to do:

## Common Problems
- Delayed services
- Cancelled services
- Missed connections
- Service diversions (when routes change temporarily)

## Solutions
- Check information screens or announcements
- Ask staff for help
- Look for alternative routes
- Use transport apps for real-time updates
- Know who to contact for help (look for help points)

## Your Rights
- You may be entitled to a refund for serious delays
- Staff should provide information about alternatives
- Accessible transport should be available if regular services aren't
      `,
    },
  ],
  activities: [
    {
      type: "scenario",
      title: "Plan Your Journey",
      instructions: "Use the provided maps and timetables to plan a journey between two locations.",
      scenario:
        "You need to travel from Central Station to Westfield Shopping Centre on Saturday morning, arriving by 10:30 AM. Plan your journey using the transport information provided.",
      resources: ["network-map.jpg", "bus-timetable.pdf", "train-timetable.pdf"],
    },
    {
      type: "roleplay",
      title: "Handling Disruptions",
      instructions: "Practice what to do in different transport disruption scenarios.",
      scenarios: [
        "Your train is cancelled and the next one isn't for an hour.",
        "You've missed your connecting bus by 2 minutes.",
        "There's a temporary change to your usual bus route due to roadworks.",
      ],
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Journey Planning Quiz",
      questions: [
        {
          question: "What should you check before planning a multi-stage journey?",
          options: [
            "Only the departure time of your first service",
            "If your ticket covers all parts of your journey",
            "Only the final arrival time",
            "The weather forecast",
          ],
          correctAnswer: "If your ticket covers all parts of your journey",
        },
        {
          question: "How much extra time should you allow for connections?",
          options: [
            "At least 1 minute",
            "At least 5 minutes",
            "At least 10 minutes",
            "At least 1 hour",
          ],
          correctAnswer: "At least 10 minutes",
        },
        {
          question: "What do larger dots usually represent on a transport map?",
          options: ["End of lines", "Interchange stations", "Ticket offices", "Toilets"],
          correctAnswer: "Interchange stations",
        },
        {
          question: "What should you do if your service is cancelled?",
          options: [
            "Go home and try another day",
            "Wait in the same place until service resumes",
            "Check for alternative routes or services",
            "Call a taxi immediately",
          ],
          correctAnswer: "Check for alternative routes or services",
        },
      ],
    },
    {
      type: "file-upload",
      title: "Journey Plan Submission",
      instructions:
        "Create a journey plan for the scenario provided. Include start and end points, all services needed, times, and any connections. Submit your plan as a document or photo.",
      rubric: {
        Accuracy: "Plan includes correct routes and realistic times",
        Completeness: "All required information is included",
        Contingency: "Includes a backup plan for possible disruptions",
      },
    },
  ],
  resources: [
    {
      type: "pdf",
      title: "How to Read Transport Maps",
      url: "/resources/reading-transport-maps.pdf",
    },
    { type: "pdf", title: "Timetable Reading Guide", url: "/resources/timetable-guide.pdf" },
    { type: "link", title: "Journey Planner Website", url: "https://example.com/journey-planner" },
    { type: "app", title: "Recommended Transport App", url: "https://example.com/transport-app" },
  ],
  accessibilityFeatures: {
    visualAids: true,
    screenReaderFriendly: true,
    highContrast: true,
    simplifiedLanguage: true,
    textToSpeech: true,
  },
  neurodivergentConsiderations: {
    clearStructure: true,
    sensoryConsiderations:
      "Information presented in multiple formats for different learning styles",
    executiveFunctionSupport: "Step-by-step guides and checklists for journey planning",
    anxietySupport: "Strategies for handling unexpected changes and disruptions",
  },
});

const travelTrainingAdvanced = createLessonTemplate({
  id: "life-skills-travel-training-advanced",
  title: "Independent Travel Mastery",
  description:
    "Master complex journeys, travel safety, problem-solving, and confident independent travel.",
  category: "Life Skills",
  subcategory: "Travel Training",
  difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
  duration: 75,
  learningObjectives: [
    "Confidently navigate complex journeys",
    "Apply strategies for staying safe while traveling",
    "Solve unexpected travel problems independently",
    "Access and use travel assistance services when needed",
  ],
  prerequisites: ["life-skills-travel-training-intermediate"],
  content: [
    {
      type: "text",
      title: "Navigating Complex Travel Systems",
      body: `
# Mastering Complex Travel Systems

Now that you understand the basics of transport and journey planning, let's look at more complex travel situations:

## Intermodal Travel
Intermodal travel means using different types of transport in one journey. For example:
- Bus to train to ferry
- Cycling to a train station
- Using rideshare services to connect with public transport

## Travel Between Systems
When traveling between cities or regions:
- Different operators may run services
- Ticket systems may be different
- Information may be presented differently

## Navigation Tools
Advanced tools that can help:
- Multi-modal journey planners
- GPS and mapping apps
- Transport operator apps with real-time information
- Accessibility services information
      `,
    },
    {
      type: "video",
      title: "Complex Journey Navigation",
      src: "https://example.com/videos/complex-journey.mp4",
      transcript:
        "This video shows a person successfully navigating a complex journey involving multiple types of transport, using digital tools and asking for assistance when needed.",
    },
    {
      type: "text",
      title: "Travel Safety Strategies",
      body: `
# Staying Safe While Traveling

Your safety is important when traveling. Here are strategies to stay safe:

## Personal Safety
- Stay aware of your surroundings
- Keep valuables secure and out of sight
- Have your phone charged and accessible
- Know emergency numbers
- Trust your instincts if something feels wrong

## Safe Locations
- Stay in well-lit, populated areas
- Know the location of staff, help points, and security cameras
- Identify safe places to wait if needed

## Digital Safety
- Share your location with trusted people for important journeys
- Use official apps rather than following links
- Be careful when using public Wi-Fi

## Health and Comfort
- Carry water and any necessary medication
- Know how to find accessible toilets and rest areas
- Dress appropriately for weather and comfort
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/life-skills/travel-safety.jpg",
      alt: "Illustrations of travel safety tips",
      caption: "Key safety considerations when traveling",
    },
    {
      type: "text",
      title: "Advanced Problem-Solving",
      body: `
# Solving Travel Problems Independently

When problems arise, these strategies will help you solve them:

## The CALM Method
Follow these steps when facing a problem:

- **C**heck information sources (apps, displays, announcements)
- **A**ssess your options (alternative routes, waiting, other transport)
- **L**ocate help if needed (staff, help points, contact centers)
- **M**ake a decision and act confidently

## Common Scenarios and Solutions

### Major Disruptions
- Check official information channels
- Look for replacement services often provided
- Consider completely alternative routes
- In some cases, consider postponing your journey

### Getting Lost
- Don't panic - stay where you are for a moment
- Check maps (physical or on your phone)
- Ask staff or fellow travelers for directions
- If available, use GPS or mapping apps
- Call the transport information line for help

### Lost or Forgotten Items
- Contact the lost property office
- Provide clear descriptions and journey details
- Check if the operator has an online lost property system
      `,
    },
    {
      type: "interactive",
      title: "Problem-Solving Scenarios",
      src: "interactive-problem-solver",
      description:
        "Work through realistic problem scenarios and apply the CALM method to resolve them.",
    },
    {
      type: "text",
      title: "Accessing Assistance Services",
      body: `
# Using Travel Assistance When Needed

Everyone needs help sometimes. Knowing how to access assistance is important:

## Types of Assistance Available
- Passenger assistance services (for disabled travelers or those needing extra help)
- Customer service centers
- Travel assistance apps
- Community transport services
- Advocacy services

## How to Request Assistance
- For planned journeys: book assistance in advance (usually 24 hours)
- For immediate help: approach staff, use help points, or call assistance numbers
- Be clear about what help you need
- Have any relevant ID or documentation ready (e.g., disability concession cards)

## Your Rights
- Transport providers must make reasonable accommodations
- Staff should treat you with respect
- If assistance doesn't meet your needs, you have the right to give feedback or complain
      `,
    },
    {
      type: "video",
      title: "Requesting Travel Assistance",
      src: "https://example.com/videos/travel-assistance.mp4",
      transcript:
        "This video demonstrates how to request different types of travel assistance, including booking in advance, approaching staff, and using help points.",
    },
  ],
  activities: [
    {
      type: "project",
      title: "Independent Journey Plan",
      instructions:
        "Plan and undertake a complex journey in your local area, documenting each step and any challenges encountered.",
      steps: [
        "Choose a destination that requires at least one change of transport",
        "Research and document your route options",
        "Prepare contingency plans for possible disruptions",
        "Undertake the journey, documenting with photos or notes",
        "Reflect on what went well and any challenges faced",
      ],
    },
    {
      type: "role-play",
      title: "Travel Assistance Scenarios",
      instructions:
        "Practice requesting assistance in different scenarios with a partner or group.",
      scenarios: [
        "Requesting wheelchair assistance for a train journey",
        "Asking for help after missing the last service of the day",
        "Reporting a lost item on a bus",
        "Asking for directions when information screens are not working",
      ],
    },
  ],
  assessments: [
    {
      type: "case-study",
      title: "Complex Journey Analysis",
      instructions:
        "Read the case study and answer questions about how you would handle this travel situation.",
      caseStudy:
        "Sarah needs to travel from her home to a job interview in another part of the city. The journey involves a bus, train, and another bus. The interview is at 2:00 PM and it's essential she arrives on time. There are reports of possible delays on the train line due to maintenance work.",
      questions: [
        {
          question: "What should Sarah do to prepare for this journey?",
          type: "open-ended",
        },
        {
          question: "How should Sarah manage the risk of delays?",
          type: "open-ended",
        },
        {
          question: "What would you recommend Sarah do if her first bus doesn't arrive?",
          type: "open-ended",
        },
      ],
      rubric: {
        Thoroughness: "Response considers multiple aspects of preparation",
        "Problem-solving": "Shows ability to create backup plans and alternatives",
        "Resource awareness": "Demonstrates knowledge of information sources and assistance",
      },
    },
    {
      type: "multiple-choice",
      title: "Travel Mastery Assessment",
      questions: [
        {
          question: "Which is the best approach when you encounter a major transport disruption?",
          options: [
            "Immediately call a taxi regardless of cost",
            "Wait in the same place until normal service resumes",
            "Check official information channels for alternatives and updates",
            "Ask a stranger to drive you to your destination",
          ],
          correctAnswer: "Check official information channels for alternatives and updates",
        },
        {
          question: "When is it best to book passenger assistance for public transport?",
          options: [
            "Only if you absolutely cannot travel without it",
            "At least 24 hours in advance when possible",
            "Only after trying to travel independently first",
            "Just show up and demand assistance when needed",
          ],
          correctAnswer: "At least 24 hours in advance when possible",
        },
        {
          question:
            "Which of these is NOT typically a good source of official transport information during disruptions?",
          options: [
            "The transport operator's website or app",
            "Information displays at stations",
            "Staff at information points",
            "Social media comments from other passengers",
          ],
          correctAnswer: "Social media comments from other passengers",
        },
        {
          question: "What does the 'L' stand for in the CALM problem-solving method?",
          options: [
            "Look for signage",
            "Leave immediately",
            "Locate help if needed",
            "Learn from mistakes",
          ],
          correctAnswer: "Locate help if needed",
        },
      ],
    },
  ],
  resources: [
    { type: "pdf", title: "Travel Safety Guide", url: "/resources/travel-safety-guide.pdf" },
    {
      type: "pdf",
      title: "Passenger Assistance Information",
      url: "/resources/passenger-assistance.pdf",
    },
    { type: "link", title: "National Rail Assistance", url: "https://example.com/rail-assistance" },
    {
      type: "app",
      title: "Transport Accessibility App",
      url: "https://example.com/accessibility-app",
    },
  ],
  accessibilityFeatures: {
    visualAids: true,
    screenReaderFriendly: true,
    highContrast: true,
    simplifiedLanguage: true,
    textToSpeech: true,
  },
  neurodivergentConsiderations: {
    clearStructure: true,
    sensoryConsiderations:
      "Strategies provided for managing sensory overload in busy transport settings",
    executiveFunctionSupport: "CALM framework provides clear problem-solving structure",
    anxietySupport: "Multiple solutions offered for common problems to reduce travel anxiety",
  },
});

// Cooking Basics
const cookingBasicsBeginner = createLessonTemplate({
  id: "life-skills-cooking-basics-beginner",
  title: "Kitchen Safety and Simple Meals",
  description: "Learn essential kitchen safety rules and how to prepare simple, nutritious meals.",
  category: "Life Skills",
  subcategory: "Cooking Basics",
  difficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
  duration: 60,
  learningObjectives: [
    "Identify potential kitchen hazards and safety measures",
    "Understand basic cooking terminology and equipment",
    "Prepare a simple, nutritious meal with minimal steps",
  ],
  content: [
    {
      type: "text",
      title: "Kitchen Safety Fundamentals",
      body: `
# Kitchen Safety First

The kitchen can be a dangerous place if you're not careful. Let's learn the key safety rules:

## Fire Safety
- Never leave cooking food unattended
- Keep flammable items (paper towels, dishcloths) away from the stove
- Know how to use a fire extinguisher or fire blanket
- If a small fire starts in a pan, cover it with a lid if safe to do so

## Preventing Burns and Cuts
- Use oven mitts or pot holders when handling hot items
- Be careful of steam when opening lids or packages
- Turn pot handles inward so they don't extend over the edge of the stove
- Use knives carefully and always cut away from your body
- Keep knives sharp (dull knives are more dangerous)

## Electrical Safety
- Keep electrical appliances away from water
- Don't use appliances with frayed cords
- Unplug small appliances when not in use

## Food Safety
- Wash hands before cooking and after handling raw meat
- Use separate cutting boards for raw meat and other foods
- Cook food to safe temperatures
- Refrigerate leftovers promptly
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/life-skills/kitchen-safety.jpg",
      alt: "Illustrations of kitchen safety practices",
      caption: "Important kitchen safety rules to remember",
    },
    {
      type: "text",
      title: "Kitchen Equipment Basics",
      body: `
# Kitchen Tools and Equipment

Let's learn about common kitchen equipment you'll need:

## Essential Tools
- **Knives**: A chef's knife and a paring knife are most important
- **Cutting Board**: Use plastic for meat and wood for other foods
- **Measuring Cups and Spoons**: For accurate ingredient measurements
- **Mixing Bowls**: Different sizes for mixing ingredients
- **Pots and Pans**: A small and large pot, and a frying pan
- **Utensils**: Wooden spoon, spatula, tongs, ladle
- **Can Opener**: For opening canned foods
- **Colander**: For draining pasta or washing produce

## Kitchen Appliances
- **Stove/Oven**: For cooking most meals
- **Microwave**: Quick heating and simple cooking
- **Toaster**: For toast and some frozen items
- **Kettle**: For boiling water quickly
- **Blender**: For smoothies and pureeing
      `,
    },
    {
      type: "video",
      title: "Basic Cooking Methods",
      src: "https://example.com/videos/basic-cooking-methods.mp4",
      transcript:
        "This video demonstrates basic cooking methods like boiling, frying, and baking. It shows the equipment needed and basic techniques for each method.",
    },
    {
      type: "text",
      title: "Simple Meal Preparation",
      body: `
# Making a Simple Meal: Pasta with Vegetables

Let's learn how to make a simple, nutritious meal:

## Ingredients
- 2 cups pasta (any shape)
- 1 tablespoon olive oil
- 1 cup frozen mixed vegetables
- 1/4 cup grated cheese
- Salt and pepper to taste

## Equipment Needed
- Large pot for pasta
- Colander for draining
- Measuring cups
- Wooden spoon for stirring

## Step-by-Step Instructions

1. **Prepare**: Fill a large pot 3/4 full with water. Add a teaspoon of salt.

2. **Cook Pasta**: 
   - Place pot on stove and turn heat to high
   - When water boils, add pasta
   - Stir occasionally to prevent sticking
   - Cook according to package directions (usually 8-10 minutes)
   - Test a piece to see if it's soft but not mushy

3. **Add Vegetables**:
   - Add frozen vegetables to pasta water during the last 3 minutes of cooking
   - This saves time and dishes!

4. **Drain**:
   - Place colander in sink
   - Carefully pour pasta and vegetables into colander
   - Be careful of hot steam!

5. **Finish**:
   - Return pasta and vegetables to pot
   - Add olive oil and stir
   - Add cheese and stir until melted
   - Add salt and pepper to taste

6. **Serve**:
   - Spoon into bowls and enjoy!
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/life-skills/simple-pasta-meal.jpg",
      alt: "Simple pasta with vegetables meal",
      caption: "A simple, nutritious pasta meal you can make easily",
    },
  ],
  activities: [
    {
      type: "safety-audit",
      title: "Kitchen Safety Check",
      instructions: "Identify the safety hazards in the kitchen image.",
      image: "/assets/lessons/life-skills/kitchen-hazards.jpg",
      hazards: [
        { id: 1, description: "Pot handle facing outward" },
        { id: 2, description: "Towel too close to stove" },
        { id: 3, description: "Knife left with blade exposed" },
        { id: 4, description: "Water near electrical appliance" },
        { id: 5, description: "Raw meat next to ready-to-eat food" },
      ],
    },
    {
      type: "matching",
      title: "Kitchen Equipment Matching",
      instructions: "Match each kitchen tool with its correct use.",
      items: [
        { tool: "Colander", use: "Draining pasta or washing produce" },
        { tool: "Cutting board", use: "Providing a safe surface for cutting" },
        { tool: "Measuring cup", use: "Ensuring accurate ingredient amounts" },
        { tool: "Spatula", use: "Flipping and turning food while cooking" },
        { tool: "Whisk", use: "Beating eggs or mixing ingredients thoroughly" },
      ],
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Kitchen Safety Quiz",
      questions: [
        {
          question: "What should you do if a small fire starts in a pan?",
          options: [
            "Throw water on it",
            "Cover it with a lid if safe to do so",
            "Blow on it to put it out",
            "Leave it and run outside",
          ],
          correctAnswer: "Cover it with a lid if safe to do so",
        },
        {
          question: "Which way should pot handles face when cooking?",
          options: [
            "Pointing outward for easy grabbing",
            "Pointing inward so they don't extend over the edge",
            "Direction doesn't matter",
            "Pointing to the right side always",
          ],
          correctAnswer: "Pointing inward so they don't extend over the edge",
        },
        {
          question: "When should you wash your hands while cooking?",
          options: [
            "Only at the beginning",
            "Only if they look dirty",
            "Before cooking and after handling raw meat",
            "Only after cooking is complete",
          ],
          correctAnswer: "Before cooking and after handling raw meat",
        },
        {
          question: "Which item is essential for safely handling hot pots?",
          options: ["Aluminum foil", "Paper towel", "Oven mitts", "Plastic wrap"],
          correctAnswer: "Oven mitts",
        },
      ],
    },
    {
      type: "true-false",
      title: "Cooking Facts Check",
      questions: [
        {
          statement: "It's safe to leave cooking food unattended for short periods.",
          correctAnswer: false,
        },
        {
          statement: "A sharp knife is safer than a dull knife.",
          correctAnswer: true,
        },
        {
          statement: "It's fine to use electrical appliances near water.",
          correctAnswer: false,
        },
        {
          statement: "You should refrigerate leftovers promptly.",
          correctAnswer: true,
        },
        {
          statement: "Using the same cutting board for raw meat and vegetables is safe.",
          correctAnswer: false,
        },
      ],
    },
  ],
  resources: [
    {
      type: "pdf",
      title: "Kitchen Safety Checklist",
      url: "/resources/kitchen-safety-checklist.pdf",
    },
    { type: "pdf", title: "Simple Recipes Collection", url: "/resources/simple-recipes.pdf" },
    { type: "link", title: "Food Safety Website", url: "https://example.com/food-safety" },
  ],
  accessibilityFeatures: {
    visualAids: true,
    screenReaderFriendly: true,
    highContrast: true,
    simplifiedLanguage: true,
  },
  neurodivergentConsiderations: {
    clearStructure: true,
    sensoryConsiderations: "Tips provided for managing sensory challenges in the kitchen",
    executiveFunctionSupport: "Step-by-step instructions with clear sequencing",
    visualSupports: "Images provided for key concepts and procedures",
  },
});

// Export all Life Skills lessons
export const lifeSkillsLessons = [
  travelTrainingBeginner,
  travelTrainingIntermediate,
  travelTrainingAdvanced,
  cookingBasicsBeginner,
  // More life skills lessons would be added here
];
