import { createLessonTemplate, DIFFICULTY_LEVELS } from "../lessonModel";

/**
 * Numeracy Lessons - All difficulty levels
 */

// Recognising Numbers
const recognisingNumbersBeginner = createLessonTemplate({
  id: "numeracy-recognising-numbers-beginner",
  title: "Recognizing Numbers in Everyday Life",
  description: "Learn to identify, read, and understand numbers in daily situations.",
  category: "Numeracy",
  subcategory: "Recognising Numbers",
  difficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
  duration: 45,
  learningObjectives: [
    "Identify numbers from 0-100",
    "Recognize numbers in everyday contexts",
    "Understand the meaning of numbers in different situations",
    "Count forwards and backwards",
  ],
  content: [
    {
      type: "text",
      title: "Numbers Around Us",
      body: `
# Numbers in Our Daily Lives

Numbers are everywhere around us and help us in many ways.

## Where We See Numbers
- **Clocks and time**: Hours and minutes
- **Money**: Prices and change
- **Phones**: Phone numbers, time, notifications
- **Measurements**: Weight, distance, temperature
- **Addresses**: House numbers, postal codes
- **Transportation**: Bus/train numbers, platforms, departure times
- **Shopping**: Prices, discounts, quantities
- **Cooking**: Measurements, cooking times, temperatures

## Why Numbers Matter
- Help us keep track of time
- Allow us to handle money
- Help us find locations
- Help us communicate important information
- Allow us to measure and compare things
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/numeracy/numbers-everyday-life.jpg",
      alt: "Examples of numbers in everyday situations",
      caption: "Numbers appear everywhere in our daily lives",
    },
    {
      type: "text",
      title: "Understanding Digits 0-9",
      body: `
# The Building Blocks of Numbers

All numbers are made up of the digits 0-9. Let's look at each one:

## Digit 0 (Zero)
- Represents nothing or an empty set
- Placeholder in larger numbers
- Examples: 0 items, 10 dollars, 30 minutes

## Digit 1 (One)
- Represents a single item
- Examples: 1 person, 1 dollar, 1 hour

## Digit 2 (Two)
- Represents a pair of items
- Examples: 2 shoes, 2 weeks, 2 dollars

## Digit 3 (Three)
- Examples: 3 meals a day, 3 colors in a traffic light

## Digit 4 (Four)
- Examples: 4 seasons, 4 wheels on a car

## Digit 5 (Five)
- Examples: 5 fingers on a hand, 5 days in a work week

## Digit 6 (Six)
- Examples: 6 sides on a cube, 6 eggs in half a dozen

## Digit 7 (Seven)
- Examples: 7 days in a week

## Digit 8 (Eight)
- Examples: 8 slices in a pizza

## Digit 9 (Nine)
- Examples: 9 players on a baseball team
      `,
    },
    {
      type: "video",
      title: "Counting Objects",
      src: "https://example.com/videos/counting-basics.mp4",
      transcript:
        "This video demonstrates counting objects one by one, showing the connection between number symbols and quantities. It covers counting from 1 to 20 with everyday objects like coins, buttons, and fruit.",
    },
    {
      type: "text",
      title: "Two-Digit Numbers",
      body: `
# Understanding Larger Numbers

When we combine digits, we can create larger numbers.

## Tens and Ones
- Two-digit numbers have a "tens" place and a "ones" place
- For example, in the number 42:
  - 4 is in the tens place (meaning 4 groups of 10, or 40)
  - 2 is in the ones place
  - Together they make forty-two (40 + 2 = 42)

## Important Number Groups

### Numbers 10-19
- Often called "teens"
- Special names like eleven, twelve, thirteen, etc.
- Examples: 10 fingers, 12 months in a year, 15-minute break

### Numbers 20, 30, 40, etc.
- Called "multiples of 10"
- Twenty, thirty, forty, etc.
- Examples: 20 dollars, 30 days in a month, 60 minutes in an hour

### Numbers 21-99
- Combination of tens and ones
- Examples: 25 cents in a quarter, 50 states in the US, 65 speed limit
      `,
    },
    {
      type: "interactive",
      title: "Number Recognition Practice",
      src: "number-recognition-game",
      description:
        "Practice identifying numbers in different formats and contexts with this interactive exercise.",
    },
    {
      type: "text",
      title: "Counting Forward and Backward",
      body: `
# Practicing Counting

Counting helps us understand the order and relationship between numbers.

## Counting Forward
- Start with 1 and add 1 each time
- Counting pattern: 1, 2, 3, 4, 5...
- Helps with addition and "how many" questions

## Counting Backward
- Start with a number and subtract 1 each time
- Example: 10, 9, 8, 7...
- Useful for countdown situations and subtraction

## Skip Counting
- Counting by 2s: 2, 4, 6, 8, 10...
- Counting by 5s: 5, 10, 15, 20...
- Counting by 10s: 10, 20, 30, 40...
- Helps recognize patterns and prepare for multiplication

## Practical Applications
- Counting money
- Following recipes
- Keeping score in games
- Counting items when shopping
- Setting timers
      `,
    },
    {
      type: "audio",
      title: "Counting Rhymes",
      src: "https://example.com/audio/counting-rhymes.mp3",
      transcript:
        "A collection of simple counting rhymes to help remember number sequences. Includes counting forward from 1-20, counting backward from 10-1, and skip counting by 2s, 5s, and 10s.",
    },
  ],
  activities: [
    {
      type: "number-hunt",
      title: "Number Scavenger Hunt",
      instructions:
        "Find examples of numbers in your everyday environment. Take photos or note where you found each number.",
      categories: [
        {
          name: "Single Digits (0-9)",
          find: 3,
          examples: "Phone buttons, page numbers, remote control",
        },
        {
          name: "Teen Numbers (10-19)",
          find: 2,
          examples: "Clock times, prices, speed limits",
        },
        {
          name: "Larger Numbers (20-100)",
          find: 2,
          examples: "Price tags, house numbers, product quantities",
        },
      ],
    },
    {
      type: "matching",
      title: "Number Matching Game",
      instructions: "Match each number with its written word and a picture showing that quantity.",
      pairs: [
        { number: "5", word: "five", image: "five-fingers.jpg" },
        { number: "10", word: "ten", image: "ten-dots.jpg" },
        { number: "15", word: "fifteen", image: "fifteen-objects.jpg" },
        { number: "20", word: "twenty", image: "twenty-items.jpg" },
        { number: "25", word: "twenty-five", image: "quarter-coin.jpg" },
        { number: "50", word: "fifty", image: "half-dollar.jpg" },
      ],
    },
    {
      type: "counting-practice",
      title: "Counting Challenge",
      instructions: "Practice counting forward and backward with these exercises.",
      exercises: [
        "Count forward from 1 to 30",
        "Count backward from 20 to 1",
        "Count by 2s from 2 to 20",
        "Count by 5s from 5 to 50",
        "Count by 10s from 10 to 100",
      ],
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Number Recognition Quiz",
      questions: [
        {
          question: "Which number is shown? [Image of number 23]",
          options: ["32", "23", "Twenty", "Three"],
          correctAnswer: "23",
        },
        {
          question: "How would you write the number 'forty-five' using digits?",
          options: ["54", "45", "4-5", "Forty Five"],
          correctAnswer: "45",
        },
        {
          question: "What number comes after 39?",
          options: ["38", "40", "49", "31"],
          correctAnswer: "40",
        },
        {
          question: "What number comes before 20?",
          options: ["19", "21", "10", "25"],
          correctAnswer: "19",
        },
        {
          question: "If you count by 5s, which number would NOT be included?",
          options: ["10", "15", "20", "22"],
          correctAnswer: "22",
        },
      ],
    },
    {
      type: "practical-application",
      title: "Real-World Number Use",
      instructions: "Complete these real-world tasks using your number recognition skills.",
      tasks: [
        {
          scenario:
            "You need to catch bus number 42. Which bus should you board? [Image showing buses 24, 42, and 44]",
          correctAnswer: "The middle bus (42)",
        },
        {
          scenario:
            "Your friend lives at house number 27. Which house is it? [Image showing houses 25, 27, and 72]",
          correctAnswer: "The middle house (27)",
        },
        {
          scenario:
            "You need to microwave your food for 30 seconds. What numbers should you press? [Image of microwave keypad]",
          correctAnswer: "3 followed by 0",
        },
        {
          scenario: "You have a $10 bill. Can you buy an item that costs $15? [Yes/No]",
          correctAnswer: "No",
        },
      ],
    },
  ],
  resources: [
    {
      type: "pdf",
      title: "Number Recognition Practice Sheets",
      url: "/resources/number-recognition-sheets.pdf",
    },
    { type: "pdf", title: "Everyday Numbers Guide", url: "/resources/everyday-numbers.pdf" },
    {
      type: "link",
      title: "Interactive Counting Games",
      url: "https://example.com/counting-games",
    },
    {
      type: "video",
      title: "Numbers in Daily Life",
      url: "https://example.com/videos/daily-numbers",
    },
  ],
  accessibilityFeatures: {
    visualAids: true,
    screenReaderFriendly: true,
    highContrast: true,
    simplifiedLanguage: true,
    handson: true,
  },
  neurodivergentConsiderations: {
    clearStructure: true,
    concreteExamples: "Real-world examples for each concept",
    multisensoryApproach: "Visual, auditory, and hands-on activities",
    relevance: "Connections to everyday situations to demonstrate importance",
    repetitionAndPractice: "Multiple opportunities to practice skills",
  },
});

// Money & Budgeting
const moneyBudgetingBeginner = createLessonTemplate({
  id: "numeracy-money-budgeting-beginner",
  title: "Understanding Money Basics",
  description:
    "Learn to identify coins and notes, understand their values, and make simple transactions.",
  category: "Numeracy",
  subcategory: "Money & Budgeting",
  difficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
  duration: 50,
  learningObjectives: [
    "Identify different coins and notes and their values",
    "Count money and make simple calculations",
    "Understand the concept of price and making purchases",
    "Make simple change calculations",
  ],
  content: [
    {
      type: "text",
      title: "Introduction to Money",
      body: `
# Understanding Money

Money is what we use to buy things we need and want.

## What is Money?
- A system for exchanging goods and services
- Comes in physical form (cash) and digital form (bank accounts, cards)
- Has different values depending on the coin or note
- Used for buying, saving, and exchanging

## Why Understanding Money Matters
- Helps you make purchases independently
- Ensures you pay the right amount
- Helps you check you receive correct change
- Builds confidence in daily transactions
- Supports better financial decisions
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/numeracy/currency-overview.jpg",
      alt: "Common coins and notes with their values",
      caption: "Different denominations of currency and their values",
    },
    {
      type: "text",
      title: "Identifying Coins and Notes",
      body: `
# Recognizing Currency

Let's learn about different coins and notes and how to identify them.

## Coins
Each coin has distinct features that help you recognize it:

### 1¢ (Penny)
- Smallest value
- Copper color
- Shows Abraham Lincoln

### 5¢ (Nickel)
- Silver color
- Shows Thomas Jefferson
- Larger than penny, smaller than quarter

### 10¢ (Dime)
- Silver color
- Smallest size (despite being worth more than a penny)
- Shows Franklin D. Roosevelt

### 25¢ (Quarter)
- Silver color
- Largest common coin
- Shows George Washington

### Other Coins
- 50¢ piece (half dollar)
- $1 coin

## Notes (Bills)
Bills come in different denominations (values):

### $1 Bill
- George Washington portrait
- Smallest denomination of paper money

### $5 Bill
- Abraham Lincoln portrait
- Has purple security features

### $10 Bill
- Alexander Hamilton portrait
- Has orange security features

### $20 Bill
- Andrew Jackson portrait
- Most common bill from ATMs
- Has green security features

### Larger Bills
- $50 bill (Ulysses S. Grant)
- $100 bill (Benjamin Franklin)
      `,
    },
    {
      type: "video",
      title: "Identifying Money",
      src: "https://example.com/videos/identifying-currency.mp4",
      transcript:
        "This video shows close-up views of each coin and bill, highlighting the distinguishing features of each denomination. It demonstrates how to identify currency by size, color, portrait, and security features.",
    },
    {
      type: "text",
      title: "Counting Money",
      body: `
# How to Count Money

Counting money accurately is an important skill.

## Basic Money Counting

### Counting Coins
1. **Sort coins by type** - Group pennies, nickels, dimes, and quarters
2. **Count each group** - Count how many of each type you have
3. **Multiply by value** - Multiply the count by the value of each coin
   - Pennies: count × 1¢
   - Nickels: count × 5¢
   - Dimes: count × 10¢
   - Quarters: count × 25¢
4. **Add all values** - Add up the total from each group

### Counting Bills
1. **Sort bills by denomination** - Group $1, $5, $10, $20 bills
2. **Count each group** - Count how many of each type you have
3. **Multiply by value** - Multiply the count by the value of each bill
4. **Add all values** - Add up the total from each group

### Counting Mixed Money
1. Count bills first (higher value)
2. Count coins next
3. Add both totals together

## Shortcuts for Counting

### Counting by 5s (Nickels)
5, 10, 15, 20, 25, 30...

### Counting by 10s (Dimes)
10, 20, 30, 40, 50...

### Counting by 25s (Quarters)
25, 50, 75, 100, 125...

### Dollar Combinations
- 4 quarters = $1
- 10 dimes = $1
- 20 nickels = $1
- 100 pennies = $1
      `,
    },
    {
      type: "interactive",
      title: "Money Counting Practice",
      src: "money-counting-exercise",
      description:
        "Practice counting different combinations of coins and bills with this interactive exercise.",
    },
    {
      type: "text",
      title: "Understanding Prices",
      body: `
# Making Purchases and Understanding Prices

When we buy things, we need to understand prices and how to pay.

## Reading Price Tags
- Prices are shown with a dollar sign ($)
- Usually written with a decimal point
- The numbers after the decimal are cents
- Example: $3.49 means 3 dollars and 49 cents

## Price Comparisons
- Higher number = More expensive
- Lower number = Less expensive
- Example: $5.99 is more than $4.99

## Making Simple Purchases
1. Check the price of the item
2. Prepare at least that amount of money
3. Give the money to the cashier
4. Receive change if you gave more than the exact price

## Calculating Change
Change is the money you get back when you pay more than the exact price.

To calculate change:
1. Start with the amount you paid
2. Subtract the price of the item
3. The difference is your change

Example:
- Item costs $3.25
- You pay with $5.00
- Change will be $5.00 - $3.25 = $1.75
      `,
    },
    {
      type: "video",
      title: "Making a Purchase",
      src: "https://example.com/videos/making-purchases.mp4",
      transcript:
        "This video shows several examples of making purchases. It demonstrates checking prices, counting out money to pay, and verifying change received. The narrator explains each step of the transaction process.",
    },
  ],
  activities: [
    {
      type: "coin-identification",
      title: "Coin Sorting Activity",
      instructions: "Sort the following coins by type and determine the total value.",
      scenario:
        "You have 5 pennies, 3 nickels, 4 dimes, and 2 quarters. Sort them by type and calculate the total value.",
      solution: {
        pennies: "5 × 1¢ = 5¢",
        nickels: "3 × 5¢ = 15¢",
        dimes: "4 × 10¢ = 40¢",
        quarters: "2 × 25¢ = 50¢",
        total: "5¢ + 15¢ + 40¢ + 50¢ = 110¢ or $1.10",
      },
    },
    {
      type: "price-matching",
      title: "Price Matching Game",
      instructions:
        "Match each item with its correct price tag and prepare the exact amount needed to purchase it.",
      items: [
        { item: "Bottle of water", price: "$1.50" },
        { item: "Sandwich", price: "$4.75" },
        { item: "Notebook", price: "$2.25" },
        { item: "Bus ticket", price: "$3.00" },
        { item: "Coffee", price: "$2.50" },
      ],
    },
    {
      type: "change-calculation",
      title: "Change Calculator",
      instructions: "Calculate the change you should receive for each purchase.",
      scenarios: [
        {
          purchase: "Snack costs $1.75, paid with $2.00",
          change: "$0.25",
        },
        {
          purchase: "Magazine costs $4.50, paid with $5.00",
          change: "$0.50",
        },
        {
          purchase: "Lunch costs $7.25, paid with $10.00",
          change: "$2.75",
        },
      ],
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Money Basics Quiz",
      questions: [
        {
          question: "How many quarters make $1.00?",
          options: ["2", "4", "5", "10"],
          correctAnswer: "4",
        },
        {
          question: "Which coin is worth 10¢?",
          options: ["Nickel", "Dime", "Penny", "Quarter"],
          correctAnswer: "Dime",
        },
        {
          question: "How much is 3 quarters and 2 dimes worth?",
          options: ["$0.70", "$0.95", "$1.05", "$1.20"],
          correctAnswer: "$0.95",
        },
        {
          question:
            "If something costs $4.75 and you pay with a $5 bill, how much change should you get?",
          options: ["$0.15", "$0.25", "$0.35", "$1.25"],
          correctAnswer: "$0.25",
        },
        {
          question: "Which is worth more: 10 dimes or 4 quarters?",
          options: ["10 dimes", "4 quarters", "They are equal", "Cannot be determined"],
          correctAnswer: "They are equal",
        },
      ],
    },
    {
      type: "practical-task",
      title: "Shopping Simulation",
      instructions: "Complete these shopping tasks using the provided money.",
      tasks: [
        {
          scenario: "You have $5.00. Can you buy an item that costs $5.50?",
          correctAnswer: "No, I need $0.50 more",
        },
        {
          scenario:
            "You want to buy an item that costs $3.75. Show the exact coins you could use to pay for it.",
          options: [
            "3 $1 bills and 3 quarters",
            "2 $1 bills, 1 $5 bill",
            "3 quarters and 3 $1 bills",
          ],
          correctAnswer: "3 quarters and 3 $1 bills",
        },
        {
          scenario:
            "You buy a drink for $1.25 and pay with $2.00. How much change should you receive, and what coins might make up that change?",
          correctAnswer: "$0.75 (3 quarters or 2 quarters and 5 dimes, etc.)",
        },
      ],
      rubric: {
        Accuracy: "Correctly calculates amounts and change",
        "Money Recognition": "Accurately identifies appropriate coins and bills",
        "Problem Solving": "Finds efficient ways to make exact amounts",
      },
    },
  ],
  resources: [
    {
      type: "pdf",
      title: "Coin and Bill Identification Guide",
      url: "/resources/currency-guide.pdf",
    },
    { type: "pdf", title: "Money Counting Worksheets", url: "/resources/money-counting.pdf" },
    {
      type: "link",
      title: "Interactive Money Practice",
      url: "https://example.com/money-practice",
    },
    {
      type: "video",
      title: "Making Change Tutorial",
      url: "https://example.com/videos/making-change",
    },
  ],
  accessibilityFeatures: {
    visualAids: true,
    screenReaderFriendly: true,
    highContrast: true,
    simplifiedLanguage: true,
    handson: true,
  },
  neurodivergentConsiderations: {
    clearStructure: true,
    concreteExamples: "Real-world examples of money use",
    multisensoryApproach: "Visual, tactile, and interactive money activities",
    executiveFunctionSupport: "Step-by-step procedures for handling money",
    realWorldApplication: "Practical scenarios relevant to daily life",
  },
});

// Export all Numeracy lessons
export const numeracyLessons = [
  recognisingNumbersBeginner,
  moneyBudgetingBeginner,
  // More numeracy lessons would be added here
];
