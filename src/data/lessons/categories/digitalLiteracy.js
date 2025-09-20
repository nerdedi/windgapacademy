import { createLessonTemplate, DIFFICULTY_LEVELS } from "../lessonModel";

/**
 * Digital Literacy Lessons - All difficulty levels
 */

// Using Email
const usingEmailBeginner = createLessonTemplate({
  id: "digital-literacy-using-email-beginner",
  title: "Email Basics: Getting Started with Email",
  description:
    "Learn the fundamentals of email: what it is, how to set up an account, and send your first emails.",
  category: "Digital Literacy",
  subcategory: "Using Email",
  difficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
  duration: 45,
  learningObjectives: [
    "Understand what email is and how it works",
    "Create a new email account",
    "Send and receive basic emails",
    "Recognize the parts of an email interface",
  ],
  content: [
    {
      type: "text",
      title: "What is Email?",
      body: `
# Understanding Email

## What is Email?
Email (short for "electronic mail") is a way to send and receive messages through the internet. Think of it like sending a letter, but it arrives instantly and doesn't need a stamp!

## Why Email is Important
- It's a standard way to communicate online
- Many services require an email address to sign up
- It's used for both personal and work communication
- You can send messages to anyone with an email address, anywhere in the world

## How Email Works
- Every email account has a unique address (like yourname@gmail.com)
- When you send an email, it travels through the internet to the recipient's email service
- Emails can include text, images, and file attachments
- You can access your email from any device with internet connection

## Common Email Services
- Gmail (from Google)
- Outlook (from Microsoft)
- Yahoo Mail
- iCloud Mail (for Apple users)
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/digital-literacy/email-explained.jpg",
      alt: "Diagram explaining how email works",
      caption: "How email travels from sender to recipient",
    },
    {
      type: "text",
      title: "Creating an Email Account",
      body: `
# Setting Up Your Email Account

To use email, you first need to create an account with an email service. Let's learn how to set up a Gmail account, which is one of the most popular free email services.

## Steps to Create a Gmail Account

1. **Go to Gmail**
   - Open your web browser
   - Type "gmail.com" in the address bar
   - Click "Create an account" or "Sign up"

2. **Enter Your Information**
   - First and last name
   - Choose a username (this will be your email address: username@gmail.com)
   - Create a strong password (mix of letters, numbers, and symbols)
   - Enter your birthday and gender
   - Provide a recovery phone number or email (optional but recommended)

3. **Verify Your Account**
   - Google may send a code to your phone or recovery email
   - Enter the code to verify it's really you

4. **Accept Terms of Service**
   - Read the privacy policy and terms
   - Click "I agree" to continue

5. **Complete Setup**
   - You'll be taken to your new Gmail inbox
   - Your email address will be username@gmail.com

## Tips for Choosing a Username
- Use your name or a variation of it (e.g., john.smith, jsmith)
- Avoid using personal information like birth year or address
- Keep it professional if you'll use it for job applications
- Make it easy to remember and spell
- If your first choice is taken, try adding numbers or your profession
      `,
    },
    {
      type: "video",
      title: "Creating a Gmail Account",
      src: "https://example.com/videos/gmail-account-setup.mp4",
      transcript:
        "This video walks through the steps of setting up a new Gmail account. It shows the signup page, how to choose a username and password, and the initial inbox view once setup is complete.",
    },
    {
      type: "text",
      title: "Parts of an Email Interface",
      body: `
# Understanding the Email Interface

Once you've created your account, you'll see the email interface. Here are the main parts:

## Inbox View
- **Inbox**: Main folder where new emails arrive
- **Sent**: Folder containing emails you've sent
- **Drafts**: Emails you've started but haven't sent
- **Spam**: Folder for suspicious emails filtered automatically
- **Trash**: Deleted emails stay here temporarily

## Email List
- Shows emails with sender name, subject, and preview
- Unread emails are usually in bold or highlighted
- Click an email to open and read it

## Compose Button
- Usually a prominent button (+ or "Compose" or "New")
- Click to start writing a new email

## Search Bar
- Type keywords to find specific emails
- Can search by sender, subject, or content

## Settings Menu
- Usually shown as a gear icon
- Allows you to customize your email experience
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/digital-literacy/email-interface.jpg",
      alt: "Labeled diagram of email interface parts",
      caption: "Main components of a typical email interface",
    },
    {
      type: "text",
      title: "Sending Your First Email",
      body: `
# How to Send an Email

Sending an email involves a few simple steps:

## Composing a New Email
1. Click the "Compose" or "New" button
2. A new message window will open

## Adding Recipients
- **To field**: Enter the email address of your main recipient(s)
- **Cc field**: Carbon copy - for people who need to see the email but aren't the main recipients
- **Bcc field**: Blind carbon copy - recipients won't see who else was included here

## Writing Your Message
- **Subject line**: Brief description of what your email is about
- **Message body**: The main content of your email
- Start with a greeting (e.g., "Hello," or "Dear [Name],")
- Write your message clearly
- End with a closing (e.g., "Thanks," or "Best regards,")
- Add your name at the end

## Sending the Email
- Review your message for spelling and clarity
- Check that recipient addresses are correct
- Click the "Send" button

## Email Etiquette Basics
- Use a clear, specific subject line
- Keep messages concise and to the point
- Be polite and professional
- Avoid writing in ALL CAPS (it looks like shouting)
- Proofread before sending
      `,
    },
    {
      type: "interactive",
      title: "Email Composition Practice",
      src: "email-composer-simulation",
      description:
        "Practice writing an email with proper format and etiquette in this simulated email composer.",
    },
    {
      type: "text",
      title: "Receiving and Reading Emails",
      body: `
# Checking and Reading Your Emails

Now let's learn how to receive and read emails:

## Checking for New Emails
- New emails appear in your inbox
- Some services show a number next to "Inbox" indicating unread messages
- You may get notifications on your device when new emails arrive
- Click "Refresh" or pull down to check for new messages

## Opening and Reading Emails
- Click on an email in your inbox to open and read it
- The full message will display, along with any attachments
- You can see when it was sent and who it's from

## Replying to Emails
- Click "Reply" to respond to the sender
- Click "Reply all" to respond to everyone in the email
- The subject line will automatically include "Re:" to show it's a reply
- The original message is usually included below your response

## Forwarding Emails
- Click "Forward" to send the email to someone else
- Add the new recipient's email address
- You can add your own message before the forwarded content
- The subject line will include "Fwd:" to show it's a forwarded message

## Managing Your Inbox
- Delete emails you no longer need
- Archive important emails you want to keep but don't need in your inbox
- Mark important emails with a star or flag
- Use folders or labels to organize emails by topic
      `,
    },
  ],
  activities: [
    {
      type: "guided-practice",
      title: "Create Your Email Account",
      instructions:
        "Follow the steps to create your own email account. If you already have one, you can skip this activity.",
      steps: [
        "Go to gmail.com or another email provider",
        "Click 'Create account' or 'Sign up'",
        "Fill in your personal information",
        "Choose a username and password",
        "Complete the verification process",
        "Log in to your new account",
      ],
    },
    {
      type: "email-composition",
      title: "Send Your First Email",
      instructions:
        "Compose and send an email to your instructor or a friend. Include all the necessary elements of a proper email.",
      template: {
        to: "[Recipient's email address]",
        subject: "My First Email Practice",
        greeting: "Hello [Name],",
        body: "I am practicing sending emails as part of my digital literacy course. This is my first practice email.\n\nI am learning about:\n- Creating an email account\n- Composing messages\n- Sending and receiving emails\n\nThank you for helping me practice!",
        closing: "Best regards,\n[Your Name]",
      },
    },
    {
      type: "interface-identification",
      title: "Email Interface Scavenger Hunt",
      instructions:
        "Find each of these elements in your email interface and take a screenshot or note where they are located.",
      elements: [
        "Compose button",
        "Inbox folder",
        "Sent folder",
        "Search bar",
        "Settings menu",
        "Unread message",
        "Reply button (after opening an email)",
      ],
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Email Basics Quiz",
      questions: [
        {
          question: "What is an email address made up of?",
          options: [
            "First name and phone number",
            "Username, @ symbol, and domain name",
            "Home address and zip code",
            "First and last name only",
          ],
          correctAnswer: "Username, @ symbol, and domain name",
        },
        {
          question: "Where do new emails appear?",
          options: [
            "In the Sent folder",
            "In the Drafts folder",
            "In the Inbox",
            "In the Trash folder",
          ],
          correctAnswer: "In the Inbox",
        },
        {
          question: "What should you include in the subject line of an email?",
          options: [
            "Your full name",
            "The entire message",
            "A brief description of what the email is about",
            "Your email address",
          ],
          correctAnswer: "A brief description of what the email is about",
        },
        {
          question: "What does 'Cc' stand for in email?",
          options: ["Carbon copy", "Current contact", "Copy content", "Create carbon"],
          correctAnswer: "Carbon copy",
        },
        {
          question: "What should you do before sending an important email?",
          options: [
            "Delete all your other emails",
            "Change your password",
            "Review it for spelling and clarity",
            "Print it out",
          ],
          correctAnswer: "Review it for spelling and clarity",
        },
      ],
    },
    {
      type: "practical-task",
      title: "Email Composition Assessment",
      instructions:
        "Compose an email based on the scenario below. Include all necessary parts of an email.",
      scenario:
        "You need to email your instructor to inform them that you'll miss next week's class due to a doctor's appointment. Ask if there will be any assignments you need to complete before the following class.",
      rubric: {
        Format: "Includes proper recipient, subject, greeting, body, and closing",
        Content: "Clearly communicates the reason for absence and asks about assignments",
        Language: "Uses polite, clear language appropriate for communicating with an instructor",
        Technical: "Properly uses email features like To field and Subject line",
      },
    },
  ],
  resources: [
    { type: "pdf", title: "Email Etiquette Guide", url: "/resources/email-etiquette.pdf" },
    { type: "pdf", title: "Email Security Tips", url: "/resources/email-security.pdf" },
    { type: "link", title: "Gmail Help Center", url: "https://support.google.com/mail" },
    {
      type: "video",
      title: "Email Basics Tutorial",
      url: "https://example.com/videos/email-tutorial",
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
    executiveFunctionSupport: "Step-by-step instructions for each process",
    visualSupports: "Screenshots and labeled images of interface elements",
    socialScripts: "Templates for common email scenarios",
  },
});

const usingEmailIntermediate = createLessonTemplate({
  id: "digital-literacy-using-email-intermediate",
  title: "Email Management and Organization",
  description:
    "Master email organization, attachments, and effective communication techniques for personal and professional use.",
  category: "Digital Literacy",
  subcategory: "Using Email",
  difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
  duration: 60,
  learningObjectives: [
    "Organize emails effectively using folders, labels, and filters",
    "Send and receive file attachments safely",
    "Write clear, professional emails for different situations",
    "Manage email notifications and settings",
  ],
  prerequisites: ["digital-literacy-using-email-beginner"],
  content: [
    {
      type: "text",
      title: "Email Organization Strategies",
      body: `
# Keeping Your Inbox Organized

A well-organized inbox helps you find important messages and reduces stress. Here's how to organize your emails:

## Using Folders or Labels
- **Folders/Labels**: Categories for sorting emails
- **How to Create**:
  - Gmail: Click the three dots (more options) > Create new label
  - Outlook: Right-click in the folder pane > Create New Folder
- **Useful Categories**:
  - Work/School
  - Personal
  - Bills/Financial
  - Receipts
  - Important Documents
  - Projects (with specific project names)

## Manual Organization
- **Move emails** to appropriate folders after reading
- **Archive** emails you want to keep but don't need in your inbox
- **Delete** emails you no longer need

## Automatic Filters
Filters automatically process incoming emails based on rules you set:
- **What They Do**:
  - Automatically move emails to specific folders
  - Mark emails as important
  - Forward certain emails
  - Automatically delete unwanted emails
- **How to Set Up**:
  - Gmail: Settings > Filters and Blocked Addresses > Create a new filter
  - Outlook: Settings > Rules > Add a new rule
- **Common Filter Criteria**:
  - From specific senders
  - Contains certain words in subject or body
  - Has attachments
  - Sent to specific addresses

## Search Techniques
- Use the search bar to find specific emails
- Advanced search operators:
  - from: (sender)
  - to: (recipient)
  - subject: (words in subject line)
  - has:attachment (emails with attachments)
  - after: or before: (date)
      `,
    },
    {
      type: "video",
      title: "Setting Up Email Filters",
      src: "https://example.com/videos/email-filters.mp4",
      transcript:
        "This video demonstrates how to create effective email filters in Gmail and Outlook. It shows how to automatically sort incoming emails, create rules based on senders or keywords, and manage existing filters.",
    },
    {
      type: "text",
      title: "Working with Attachments",
      body: `
# Sending and Receiving Attachments

Attachments let you share files through email. Here's how to use them effectively:

## Sending Attachments
1. **Start a new email** or reply to an existing one
2. **Find the attachment button**:
   - Usually a paperclip icon
   - Sometimes labeled "Attach" or "Add files"
3. **Select the file** from your device
4. **Wait for upload** to complete (you'll see a progress indicator)
5. **Complete your email** and send as usual

## Types of Files You Can Attach
- Documents (Word, PDF, Excel, etc.)
- Images (photos, screenshots, etc.)
- Videos (small files only)
- Audio files
- Presentations
- Compressed files (ZIP)

## Attachment Size Limits
- Most email services limit attachments to 25MB total
- For larger files, consider:
  - Breaking into multiple emails
  - Using cloud storage links (Google Drive, Dropbox, etc.)
  - Using file compression (ZIP files)

## Receiving Attachments
1. **Attachments appear** at the bottom of the email or as icons within it
2. **Options for handling**:
   - View online (preview in browser)
   - Download to your device
   - Save to cloud storage
3. **Safety considerations**:
   - Only open attachments from trusted sources
   - Be cautious with executable files (.exe, .bat, etc.)
   - Use virus scanning software when in doubt
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/digital-literacy/email-attachments.jpg",
      alt: "Diagram showing how to send and receive email attachments",
      caption: "How to work with email attachments",
    },
    {
      type: "text",
      title: "Professional Email Communication",
      body: `
# Writing Effective Professional Emails

Email is often used in work and formal situations. Here's how to write professional emails:

## Professional Email Structure
1. **Clear subject line** that summarizes the purpose
2. **Professional greeting**:
   - "Dear [Name]," for formal emails
   - "Hello [Name]," for semi-formal emails
   - "Hi [Team/Department]," for group emails
3. **Concise introduction** stating your purpose
4. **Well-organized body** with short paragraphs
5. **Clear conclusion** with any requested actions
6. **Professional signature** with your contact information

## Email Signatures
A professional signature typically includes:
- Full name
- Position/Title (if applicable)
- Company/Organization (if applicable)
- Contact information (phone, address if needed)
- Optional: social media links, company logo, legal disclaimers

To set up a signature:
- Gmail: Settings > General > Signature
- Outlook: Settings > Mail > Compose and reply > Email signature

## Email Tone and Etiquette
- Be **polite and respectful**
- Use **appropriate formality** for your audience
- **Keep it concise** - busy professionals appreciate brevity
- **Avoid emotional language** or excessive punctuation
- **Proofread carefully** for errors
- **Respond in a timely manner** (24-48 hours for business)
- **Use proper capitalization and punctuation** (no all caps or all lowercase)

## Email Templates for Common Situations

### Request Template
Example:
\`\`\`
Subject: Request for [Specific Item/Information]

Dear [Name],

I hope this email finds you well. I am writing to request [specific request].

[Brief explanation of why you need this and how it will be used]

If possible, I would appreciate receiving this by [date]. Please let me know if you need any additional information from me.

Thank you for your assistance.

Best regards,
[Your Name]
[Your Contact Information]
\`\`\`

### Follow-up Template
\`\`\`
Subject: Follow-up: [Previous Topic/Meeting]

Hello [Name],

I'm writing to follow up on [specific topic/meeting/conversation] from [date].

[Brief reminder of what was discussed and any actions that were agreed upon]

[Question about progress or next steps]

Thank you for your time.

Regards,
[Your Name]
[Your Contact Information]
\`\`\`
      `,
    },
    {
      type: "interactive",
      title: "Email Tone Adjuster",
      src: "email-tone-practice",
      description:
        "Practice adjusting email language for different levels of formality and professional situations.",
    },
    {
      type: "text",
      title: "Email Settings and Notifications",
      body: `
# Managing Email Settings

Customizing your email settings helps you work more efficiently:

## Notification Settings
Control when and how you're notified about new emails:
- **Desktop notifications**
- **Mobile push notifications**
- **Email frequency** (instant, digest, or manual check)
- **Sound alerts**

To adjust:
- Gmail: Settings > General > Desktop Notifications
- Outlook: Settings > Mail > Notifications

## Email Appearance
Customize how your inbox looks:
- **Display density** (comfortable, cozy, or compact)
- **Reading pane** location (right, bottom, or off)
- **Conversation view** (grouped or individual emails)
- **Theme or color scheme**

## Automatic Responses
Set up automatic replies when you're unavailable:
- **Vacation responder/Out of office**:
  - Gmail: Settings > General > Vacation responder
  - Outlook: Settings > Mail > Automatic replies
- **Templates/Canned responses** for frequent messages:
  - Gmail: Enable templates in Advanced settings
  - Outlook: Create Quick Parts

## Email Privacy and Security
Important settings to protect your account:
- **Two-factor authentication** (highly recommended)
- **Recovery options** (phone number, alternate email)
- **App passwords** for third-party applications
- **Connected devices** management

To access security settings:
- Gmail: Click your profile picture > Manage your Google Account > Security
- Outlook: Settings > View all Outlook settings > Security and privacy
      `,
    },
    {
      type: "video",
      title: "Customizing Email Settings",
      src: "https://example.com/videos/email-settings.mp4",
      transcript:
        "This video shows how to customize important email settings in Gmail and Outlook. It covers notification preferences, inbox organization options, signature setup, and basic security features.",
    },
  ],
  activities: [
    {
      type: "organizational-exercise",
      title: "Email Organization System",
      instructions:
        "Create a personal organization system for your email with at least 5 folders or labels. Take screenshots showing your folder structure.",
      steps: [
        "Identify the main categories of emails you receive",
        "Create appropriate folders or labels for each category",
        "Create at least one filter to automatically sort incoming emails",
        "Move at least 10 existing emails into your new folders",
        "Document your system with screenshots and brief explanations",
      ],
    },
    {
      type: "attachment-practice",
      title: "Attachment Exercise",
      instructions: "Practice sending and receiving attachments with these tasks.",
      tasks: [
        "Create a simple document or take a photo",
        "Send an email to yourself with the file attached",
        "When you receive it, download the attachment to a different folder",
        "Send another email with multiple attachments",
        "Try using cloud storage (Google Drive, OneDrive, etc.) to share a larger file via email link",
      ],
    },
    {
      type: "email-composition",
      title: "Professional Email Practice",
      instructions: "Write professional emails for each of these scenarios.",
      scenarios: [
        "Request information about a job opening you saw advertised",
        "Follow up after a meeting with a potential employer",
        "Thank someone for their help with a project",
        "Apologize for missing a scheduled appointment",
      ],
      rubric: {
        Structure: "Includes all necessary elements of a professional email",
        Tone: "Uses appropriate level of formality for the situation",
        Clarity: "Communicates purpose clearly and concisely",
        Professionalism: "Free from errors and presents a professional image",
      },
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Email Management Quiz",
      questions: [
        {
          question: "What is the best way to handle large files you need to send via email?",
          options: [
            "Always compress them into a ZIP file",
            "Send them as multiple attachments in the same email",
            "Use cloud storage links if the files exceed attachment limits",
            "Break the file into parts and send multiple emails",
          ],
          correctAnswer: "Use cloud storage links if the files exceed attachment limits",
        },
        {
          question: "Which of these is a good practice for email organization?",
          options: [
            "Keep all emails in your inbox for easy access",
            "Delete everything after reading it",
            "Use filters to automatically sort incoming messages",
            "Create a new folder for every single contact",
          ],
          correctAnswer: "Use filters to automatically sort incoming messages",
        },
        {
          question: "What should you include in a professional email signature?",
          options: [
            "Your full life story and personal philosophy",
            "Jokes and inspirational quotes",
            "Political opinions and personal beliefs",
            "Your name, position, and professional contact information",
          ],
          correctAnswer: "Your name, position, and professional contact information",
        },
        {
          question: "When is it appropriate to use 'Reply All'?",
          options: [
            "For every email you receive with multiple recipients",
            "When everyone on the recipient list needs to see your response",
            "When you want to show everyone how quickly you respond",
            "When you're angry and want everyone to know",
          ],
          correctAnswer: "When everyone on the recipient list needs to see your response",
        },
        {
          question: "What is two-factor authentication for email?",
          options: [
            "Having two different email addresses",
            "Needing both a password and a verification code to access your account",
            "Setting up two different signatures",
            "Having to type your password twice",
          ],
          correctAnswer: "Needing both a password and a verification code to access your account",
        },
      ],
    },
    {
      type: "practical-assessment",
      title: "Email Management Demonstration",
      instructions:
        "Demonstrate your email management skills by completing these tasks and documenting them with screenshots.",
      tasks: [
        "Create a filter that automatically labels emails from a specific sender",
        "Set up a professional email signature",
        "Send an email with an attachment and proper professional formatting",
        "Organize 10 emails into appropriate folders",
        "Show how to search for emails with specific criteria",
      ],
      rubric: {
        "Technical Skills": "Correctly completes all technical tasks",
        Organization: "Creates logical and efficient organization system",
        "Professional Communication": "Demonstrates proper email formatting and language",
        "Attention to Detail": "Follows instructions precisely and thoroughly",
      },
    },
  ],
  resources: [
    {
      type: "pdf",
      title: "Advanced Email Organization Guide",
      url: "/resources/email-organization.pdf",
    },
    { type: "pdf", title: "Professional Email Templates", url: "/resources/email-templates.pdf" },
    {
      type: "link",
      title: "Email Security Best Practices",
      url: "https://example.com/email-security",
    },
    {
      type: "video",
      title: "Email Productivity Tips",
      url: "https://example.com/videos/email-productivity",
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
    executiveFunctionSupport: "Templates and systems for email organization",
    visualSupports: "Visual guides for complex processes",
    anxietySupport: "Templates for handling challenging email situations",
  },
});

// Online Safety
const onlineSafetyBeginner = createLessonTemplate({
  id: "digital-literacy-online-safety-beginner",
  title: "Staying Safe Online: The Basics",
  description:
    "Learn fundamental online safety practices to protect your personal information and avoid common internet threats.",
  category: "Digital Literacy",
  subcategory: "Online Safety",
  difficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
  duration: 50,
  learningObjectives: [
    "Identify common online threats and scams",
    "Create and manage strong passwords",
    "Recognize phishing attempts",
    "Understand basic privacy settings on websites and apps",
  ],
  content: [
    {
      type: "text",
      title: "Understanding Online Threats",
      body: `
# Common Online Threats

The internet offers many benefits, but also comes with risks. Let's learn about common threats:

## Malware
- **What it is**: Malicious software designed to damage or gain unauthorized access to your device
- **Types**:
  - Viruses: Programs that spread and can corrupt files
  - Spyware: Secretly monitors your activities
  - Ransomware: Locks your files until you pay a ransom
- **How it spreads**:
  - Downloading unsafe files
  - Clicking suspicious links
  - Visiting unsafe websites
  - Opening infected email attachments

## Phishing
- **What it is**: Attempts to trick you into revealing personal information
- **How it works**:
  - Fake emails, messages, or websites that look legitimate
  - Often claim to be from banks, government, or well-known companies
  - Creates a sense of urgency or fear to make you act quickly
  - Asks for personal information like passwords or bank details

## Scams
- **What they are**: Dishonest schemes to get your money or information
- **Common types**:
  - Fake online stores
  - Prize or lottery scams ("You've won!")
  - Tech support scams ("Your computer has a virus")
  - Romance scams (fake romantic interest)
  - Charity scams (especially after disasters)

## Identity Theft
- **What it is**: Someone pretending to be you to access your accounts or resources
- **How it happens**:
  - Stealing your personal information
  - Using your information to open accounts or make purchases
  - Accessing your existing accounts
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/digital-literacy/online-threats.jpg",
      alt: "Visual examples of common online threats",
      caption: "Examples of common online threats: phishing email, fake website, scam message",
    },
    {
      type: "text",
      title: "Password Security",
      body: `
# Creating and Managing Strong Passwords

Passwords are your first line of defense against unauthorized access.

## What Makes a Strong Password
- **Length**: At least 12 characters
- **Complexity**: Mix of:
  - Uppercase letters (A, B, C)
  - Lowercase letters (a, b, c)
  - Numbers (1, 2, 3)
  - Special characters (!, @, #, $)
- **Uniqueness**: Different for each account
- **Unpredictability**: Avoid obvious information (your name, birthday)

## Examples
- **Weak**: password123, yourname, birthdates
- **Strong**: Tr4v3l*Map!2023, C@t5L0v3F1sh!

## Creating Memorable Strong Passwords
1. **Passphrase method**:
   - Start with a phrase you'll remember: "I love to walk in the park"
   - Convert to initials: "iltwtp"
   - Add complexity: "iLtW1tp!"

2. **Word combination method**:
   - Combine random words: "elephant banana telescope"
   - Add complexity: "3lephant_B@nana_T3lescope"

## Password Management
- **Don't reuse passwords** across different accounts
- **Change passwords** periodically (especially for important accounts)
- **Never share** passwords with others
- **Don't write passwords** on sticky notes near your computer
- Consider using a **password manager** (a secure tool that stores all your passwords)

## Two-Factor Authentication (2FA)
- Adds an extra layer of security beyond just passwords
- Requires something you know (password) AND something you have (like your phone)
- Usually sends a code via text message or app
- Enable this whenever available, especially for important accounts
      `,
    },
    {
      type: "video",
      title: "Creating Strong Passwords",
      src: "https://example.com/videos/password-creation.mp4",
      transcript:
        "This video demonstrates techniques for creating strong, memorable passwords. It shows the passphrase method, word combination technique, and how to test password strength. It also explains why using personal information in passwords is dangerous.",
    },
    {
      type: "text",
      title: "Recognizing Phishing",
      body: `
# How to Spot Phishing Attempts

Phishing is one of the most common online threats. Here's how to identify it:

## Red Flags in Emails and Messages
- **Sender address**: Slight misspellings (amazon-support@amazn.com)
- **Urgent language**: "Act now!" "Immediate action required!"
- **Generic greeting**: "Dear Customer" instead of your name
- **Grammatical errors**: Professional companies proofread their communications
- **Suspicious links**: Hover (don't click) to see where they really go
- **Requests for personal information**: Legitimate organizations rarely ask for passwords or full card numbers by email
- **Unexpected attachments**: Be very cautious about opening these

## Example Phishing Scenarios

### Banking Phishing
"Dear Customer, Your account has been compromised. Click here immediately to verify your identity and prevent account closure. You will need to provide your full account number and password."

**Red flags**: Generic greeting, creates urgency, asks for sensitive information

### Package Delivery Phishing
"Your package could not be delivered due to incomplete address information. Click here within 24 hours to confirm your address and payment details to receive your package."

**Red flags**: Unexpected package, urgent timeframe, requests payment information

### Account Problem Phishing
"We've detected unusual activity on your account. Your account has been limited until you verify your information. Click here to restore full access."

**Red flags**: Creates fear, urgency, vague about what the "unusual activity" was

## What to Do If You Suspect Phishing
- **Don't click** any links or download attachments
- **Don't reply** or call phone numbers in the message
- **Contact the company directly** using their official website or phone number (not from the email)
- **Report the phishing attempt** to the organization being impersonated
- **Delete the message**
      `,
    },
    {
      type: "interactive",
      title: "Phishing Identification Practice",
      src: "phishing-examples-quiz",
      description:
        "Practice identifying phishing attempts with these interactive examples. Can you spot all the red flags?",
    },
    {
      type: "text",
      title: "Privacy Settings",
      body: `
# Managing Privacy Settings

Most websites and apps collect information about you. Here's how to control your privacy:

## Important Privacy Settings to Check

### Social Media Privacy
- **Profile visibility**: Who can see your profile?
- **Post visibility**: Who can see what you share?
- **Friend/connection settings**: Who can send you requests?
- **Tagging settings**: Do you want to review tags before they appear?
- **Location sharing**: Are you sharing your location unnecessarily?

### Browser Privacy
- **Cookies**: Small files websites use to remember information about you
- **Browsing history**: Record of websites you've visited
- **Autofill data**: Saved information like addresses and payment details
- **Private browsing mode**: Doesn't save history (but isn't completely private)

### App Permissions
- **Location**: Does this app really need to know where you are?
- **Camera/Microphone**: Can the app access these when needed, always, or never?
- **Contacts**: Does the app need access to your address book?
- **Storage**: Can the app access files on your device?

## Steps to Review Privacy Settings

1. **Social Media**:
   - Find "Settings" or "Privacy" in the menu
   - Review each category of settings
   - Set to the most private option you're comfortable with

2. **Web Browsers**:
   - Look for "Settings" then "Privacy" or "Security"
   - Consider clearing cookies and history periodically
   - Review saved passwords and autofill information

3. **Smartphone Apps**:
   - Check Settings > Apps > [App Name] > Permissions
   - Only grant permissions that make sense for the app's function
   - Review periodically as apps update

## General Privacy Tips
- **Read privacy policies** for important services
- **Limit personal information** you share online
- **Use privacy-focused alternatives** when available
- **Regularly review** who has access to your information
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/digital-literacy/privacy-settings.jpg",
      alt: "Examples of privacy settings on different platforms",
      caption: "Common privacy settings on social media, browsers, and smartphone apps",
    },
  ],
  activities: [
    {
      type: "password-creation",
      title: "Strong Password Workshop",
      instructions:
        "Create three strong passwords using different methods. Don't share these with anyone or use them for your actual accounts!",
      methods: [
        {
          name: "Passphrase Method",
          steps: [
            "Think of a memorable phrase",
            "Convert to initials or abbreviations",
            "Add numbers and special characters",
            "Ensure it's at least 12 characters",
          ],
        },
        {
          name: "Random Word Method",
          steps: [
            "Choose 3-4 unrelated words",
            "Add numbers between or within words",
            "Add special characters",
            "Mix uppercase and lowercase",
          ],
        },
        {
          name: "Pattern Method",
          steps: [
            "Think of a pattern on the keyboard",
            "Add variations with shift key",
            "Insert numbers meaningfully",
            "Make sure it's not an obvious pattern",
          ],
        },
      ],
    },
    {
      type: "phishing-detection",
      title: "Spot the Phishing",
      instructions:
        "Review these email examples and identify which are legitimate and which are phishing attempts. List the red flags for each phishing example.",
      examples: [
        {
          from: "amazon-order@amazon.com",
          subject: "Your Amazon Order #302-5729841",
          body: "Hello John, Thank you for your recent order. Your package has been shipped and will arrive on Tuesday, March 15. To track your package, sign in to your account at amazon.com. Thank you for shopping with Amazon.",
        },
        {
          from: "customer-service@amaz0n-support.com",
          subject: "URGENT: Problem with your recent Amazon Order",
          body: "Dear Valued Customer, We noticed a problem with your recent order payment. Your account has been temporarily suspended. To reactivate your account, please confirm your payment details immediately by clicking here: [VERIFY ACCOUNT]. Failure to verify within 24 hours will result in order cancellation.",
        },
        {
          from: "support@yourbank.com",
          subject: "Security Alert - Action Required",
          body: "Dear Sir/Madam, Our security system has detected unusual activity on your account. Your access has been limited. To restore full access, please verify your information by providing your full account number, username, password and security questions at this secure link: http://yourbank-secure-verify.com",
        },
      ],
    },
    {
      type: "privacy-review",
      title: "Privacy Settings Check-Up",
      instructions:
        "Review the privacy settings on your devices and accounts. Complete the checklist below.",
      checklist: [
        "Review and adjust privacy settings on one social media account",
        "Check app permissions on your smartphone",
        "Review browser privacy settings",
        "Clear cookies and browsing history",
        "Check who can see your posts or profile information",
        "Review location sharing settings",
      ],
      reflection:
        "Write a brief reflection on what you discovered during this check-up. Were there any settings that surprised you? Did you make any changes?",
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Online Safety Basics Quiz",
      questions: [
        {
          question: "Which of these is a sign of a phishing attempt?",
          options: [
            "An email addressed to you by name from a company you do business with",
            "A message saying you need to verify your information by clicking a link",
            "An email with the company's actual logo and correct contact information",
            "A receipt for a purchase you recently made",
          ],
          correctAnswer: "A message saying you need to verify your information by clicking a link",
        },
        {
          question: "What makes a password strong?",
          options: [
            "Using your name and birthday so it's easy to remember",
            "Using the same password for all accounts for consistency",
            "Using a mix of uppercase, lowercase, numbers, and special characters",
            "Using a simple word and adding '123' at the end",
          ],
          correctAnswer: "Using a mix of uppercase, lowercase, numbers, and special characters",
        },
        {
          question: "What is two-factor authentication?",
          options: [
            "Having two different passwords for the same account",
            "Using both a password and a security code sent to your device",
            "Changing your password twice a year",
            "Having two people approve all account changes",
          ],
          correctAnswer: "Using both a password and a security code sent to your device",
        },
        {
          question:
            "What should you do if you receive a suspicious email claiming to be from your bank?",
          options: [
            "Click the link to see if it looks legitimate",
            "Reply to the email asking if it's real",
            "Call the phone number provided in the email",
            "Contact your bank directly using their official website or phone number",
          ],
          correctAnswer: "Contact your bank directly using their official website or phone number",
        },
        {
          question: "Which of these app permissions should you be most cautious about granting?",
          options: [
            "A weather app requesting location access",
            "A photo editing app requesting access to your photos",
            "A messaging app requesting access to your entire contact list and location at all times",
            "A navigation app requesting location access while using the app",
          ],
          correctAnswer:
            "A messaging app requesting access to your entire contact list and location at all times",
        },
      ],
    },
    {
      type: "scenario-response",
      title: "Online Safety Scenarios",
      instructions: "Read each scenario and write how you would respond.",
      scenarios: [
        {
          situation:
            "You receive an email saying your Netflix account has been suspended and you need to update your payment information immediately by clicking a link.",
          prompt: "What would you do in this situation and why?",
        },
        {
          situation:
            "You're creating an account on a new shopping website, and you need to create a password.",
          prompt:
            "Describe the process you would use to create a secure password. Don't share the actual password you would create.",
        },
        {
          situation:
            "You receive a friend request on social media from someone with the same name and profile picture as a friend you already have.",
          prompt:
            "How would you determine if this is legitimate or suspicious, and what actions would you take?",
        },
      ],
      rubric: {
        "Threat Recognition": "Correctly identifies potential threats",
        "Response Strategy": "Proposes appropriate and safe actions",
        "Security Awareness": "Demonstrates understanding of security principles",
        Reasoning: "Explains decision-making process clearly",
      },
    },
  ],
  resources: [
    {
      type: "pdf",
      title: "Online Safety Checklist",
      url: "/resources/online-safety-checklist.pdf",
    },
    { type: "pdf", title: "Phishing Examples Guide", url: "/resources/phishing-examples.pdf" },
    {
      type: "link",
      title: "Password Strength Checker",
      url: "https://example.com/password-checker",
    },
    { type: "link", title: "Report Phishing Attempts", url: "https://example.com/report-phishing" },
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
    executiveFunctionSupport: "Step-by-step guides and checklists",
    visualSupports: "Visual examples of threats and safety measures",
    anxietySupport: "Clear instructions on what to do when encountering potential threats",
  },
});

// Export all Digital Literacy lessons
export const digitalLiteracyLessons = [
  usingEmailBeginner,
  usingEmailIntermediate,
  onlineSafetyBeginner,
  // More digital literacy lessons would be added here
];
