import { createLessonTemplate, DIFFICULTY_LEVELS } from "../lessonModel";

/**
 * Employment Skills Lessons - All difficulty levels
 */

// Resume Writing
const resumeWritingBeginner = createLessonTemplate({
  id: "employment-skills-resume-writing-beginner",
  title: "Resume Basics: Your First Resume",
  description: "Learn the fundamentals of resume writing and create your first basic resume.",
  category: "Employment Skills",
  subcategory: "Resume Writing",
  difficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
  duration: 45,
  learningObjectives: [
    "Understand what a resume is and why it's important",
    "Identify the basic sections of a resume",
    "Create a simple resume with your information",
  ],
  content: [
    {
      type: "text",
      title: "What is a Resume?",
      body: `
# Understanding Resumes

## What is a Resume?
A resume (sometimes called a CV) is a document that shows your skills, experiences, and education. It helps employers learn about you when you apply for a job.

## Why is a Resume Important?
- It's often the first impression an employer has of you
- It helps employers see if you might be a good fit for a job
- It gives you a chance to highlight your strengths
- Most job applications require a resume

## When Do You Need a Resume?
- When applying for jobs or volunteer positions
- For some education or training applications
- When meeting with employment agencies
- At job fairs or networking events
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/employment-skills/resume-example.jpg",
      alt: "Example of a basic resume",
      caption: "A simple resume showing the standard sections",
    },
    {
      type: "text",
      title: "Basic Resume Sections",
      body: `
# Parts of a Resume

A basic resume has these important sections:

## 1. Contact Information
- Your full name
- Phone number
- Email address
- Home address (sometimes optional)

## 2. Resume Objective
- A short statement about what kind of job you want
- Usually 1-2 sentences

## 3. Skills
- List of abilities you have that would help in a job
- Can include technical skills, language skills, and soft skills
- Usually in bullet point format

## 4. Work Experience
- Jobs you've had before
- Include: job title, company name, dates worked, and your responsibilities
- List your most recent job first

## 5. Education
- Schools you've attended and courses you've completed
- Include: school name, program or degree, completion date
- Any special achievements or qualifications

## 6. References
- People who can talk about your skills and character
- Usually 2-3 people who know you well professionally
- Include their name, relationship to you, and contact information
      `,
    },
    {
      type: "video",
      title: "Creating Your First Resume",
      src: "https://example.com/videos/first-resume.mp4",
      transcript:
        "This video walks through the process of creating a basic resume. It shows how to organize information, choose what to include, and format the document clearly.",
    },
    {
      type: "text",
      title: "Resume Tips for Beginners",
      body: `
# Tips for a Good Resume

Follow these tips to make your resume better:

## Be Honest
- Only include true information
- Don't exaggerate your skills or experience

## Keep It Simple
- Use clear, simple language
- Avoid complicated words when simple ones work
- Use bullet points instead of long paragraphs

## Make It Neat
- Use a clean, professional font (like Arial or Calibri)
- Make sure spacing is consistent
- Check for spelling and grammar mistakes

## Focus on Relevant Information
- Include information related to the jobs you want
- You don't need to include every job or activity

## Length
- For most beginning jobs, one page is enough
- Only use a second page if you have lots of relevant experience

## Update Regularly
- Add new skills and experiences when you get them
- Review your resume before applying to each new job
      `,
    },
    {
      type: "interactive",
      title: "Resume Section Sorter",
      src: "resume-section-sorter",
      description: "Practice organizing information into the correct resume sections.",
    },
  ],
  activities: [
    {
      type: "fill-in-template",
      title: "Basic Resume Template",
      instructions: "Fill in the blank resume template with your own information.",
      template: {
        contactInfo: {
          name: "",
          phone: "",
          email: "",
          address: "",
        },
        objective: "",
        skills: ["", "", ""],
        experience: [
          {
            title: "",
            company: "",
            dates: "",
            duties: ["", ""],
          },
        ],
        education: [
          {
            school: "",
            program: "",
            completion: "",
          },
        ],
        references: [
          {
            name: "",
            relationship: "",
            contact: "",
          },
        ],
      },
    },
    {
      type: "skill-identification",
      title: "Identifying Your Skills",
      instructions:
        "Check all the skills you have from the list below, then add any others you think of.",
      skillCategories: [
        {
          category: "Technical Skills",
          skills: [
            "Using computers",
            "Data entry",
            "Social media",
            "Microsoft Office",
            "Email",
            "Photography",
            "Typing",
          ],
        },
        {
          category: "People Skills",
          skills: [
            "Customer service",
            "Teamwork",
            "Communication",
            "Listening",
            "Helping others",
            "Patience",
            "Teaching",
          ],
        },
        {
          category: "Other Useful Skills",
          skills: [
            "Organization",
            "Time management",
            "Problem solving",
            "Attention to detail",
            "Creativity",
            "Following instructions",
            "Adaptability",
          ],
        },
      ],
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Resume Basics Quiz",
      questions: [
        {
          question: "What is the main purpose of a resume?",
          options: [
            "To list every activity you've ever done",
            "To show employers your skills and experience",
            "To explain why you left previous jobs",
            "To list your personal hobbies",
          ],
          correctAnswer: "To show employers your skills and experience",
        },
        {
          question: "Which section should contain your name and contact details?",
          options: ["Objective", "Contact Information", "References", "Skills"],
          correctAnswer: "Contact Information",
        },
        {
          question: "What order should work experience be listed in?",
          options: [
            "Most recent job first",
            "Most important job first",
            "Longest job first",
            "Alphabetical by company name",
          ],
          correctAnswer: "Most recent job first",
        },
        {
          question: "How long should a beginner's resume typically be?",
          options: ["Half a page", "One page", "Two pages", "Three pages"],
          correctAnswer: "One page",
        },
      ],
    },
    {
      type: "file-upload",
      title: "Your First Resume",
      instructions: "Create your own resume using what you've learned and upload it for feedback.",
      rubric: {
        Completeness: "Includes all essential sections",
        Clarity: "Information is clear and well-organized",
        Accuracy: "Spelling and grammar are correct",
        Format: "Layout is neat and professional",
      },
    },
  ],
  resources: [
    { type: "pdf", title: "Resume Template", url: "/resources/resume-template.pdf" },
    { type: "pdf", title: "Skills List for Resumes", url: "/resources/skills-list.pdf" },
    { type: "link", title: "Resume Building Website", url: "https://example.com/resume-builder" },
  ],
  accessibilityFeatures: {
    visualAids: true,
    screenReaderFriendly: true,
    highContrast: true,
    simplifiedLanguage: true,
  },
  neurodivergentConsiderations: {
    clearStructure: true,
    executiveFunctionSupport: "Step-by-step instructions and templates",
    visualSupports: "Examples and visual models provided",
    alternativeFormats: "Multiple ways to practice and demonstrate learning",
  },
});

const resumeWritingIntermediate = createLessonTemplate({
  id: "employment-skills-resume-writing-intermediate",
  title: "Targeted Resumes for Job Success",
  description:
    "Learn how to customize your resume for specific jobs and highlight your relevant skills and experiences.",
  category: "Employment Skills",
  subcategory: "Resume Writing",
  difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
  duration: 60,
  learningObjectives: [
    "Tailor resumes for specific job applications",
    "Identify and highlight relevant transferable skills",
    "Create achievement-focused descriptions",
    "Format resumes professionally",
  ],
  prerequisites: ["employment-skills-resume-writing-beginner"],
  content: [
    {
      type: "text",
      title: "Tailoring Resumes for Specific Jobs",
      body: `
# Customizing Your Resume

One resume doesn't fit all jobs. Here's why and how to tailor your resume:

## Why Customize Your Resume?
- Shows employers you're interested in their specific job
- Highlights your most relevant skills and experiences
- Helps your resume pass application tracking systems (ATS)
- Makes your application stand out from others

## How to Customize Your Resume
1. **Analyze the Job Description**
   - Look for specific skills and requirements
   - Note key words and phrases used
   - Identify what the employer values most

2. **Adjust Your Resume Objective**
   - Mention the specific position you're applying for
   - Include 1-2 key qualifications that match the job

3. **Prioritize Relevant Skills**
   - Move your most relevant skills to the top of your skills section
   - Add any required skills that you have but didn't include before
   - Use similar language to what's in the job description

4. **Highlight Relevant Experience**
   - Emphasize duties and achievements that relate to the target job
   - Adjust descriptions to show relevant transferable skills
   - Consider changing the order of your bullet points
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/employment-skills/targeted-resume.jpg",
      alt: "Comparison of general resume and targeted resume",
      caption: "How a targeted resume highlights relevant information for a specific job",
    },
    {
      type: "text",
      title: "Transferable Skills Identification",
      body: `
# Identifying Your Transferable Skills

Transferable skills are abilities that are useful in many different jobs.

## Common Transferable Skills
- **Communication**: Explaining ideas, listening, writing clearly
- **Teamwork**: Collaborating, supporting others, sharing responsibilities
- **Problem-solving**: Finding solutions, troubleshooting, decision making
- **Organization**: Planning, managing time, keeping records
- **Adaptability**: Learning quickly, handling change, being flexible
- **Leadership**: Guiding others, taking initiative, motivating people

## Finding Your Transferable Skills
1. **Look at Past Activities**
   - Jobs (including volunteer work)
   - School and education experiences
   - Hobbies and personal projects
   - Family responsibilities

2. **Ask Yourself These Questions**
   - What problems have I solved?
   - What have people complimented me on?
   - What am I good at teaching others?
   - What tasks do I find easy that others find difficult?
   - What responsibilities have I been given?

3. **Connect Skills to Job Requirements**
   - Think about how each skill relates to the job you want
   - Consider specific examples of using these skills
   - Be ready to explain these connections in interviews
      `,
    },
    {
      type: "video",
      title: "Writing Achievement-Focused Bullet Points",
      src: "https://example.com/videos/achievement-bullets.mp4",
      transcript:
        "This video explains how to transform basic job duty descriptions into powerful achievement statements. It demonstrates the PAR method (Problem-Action-Result) and shows before and after examples of effective bullet points.",
    },
    {
      type: "text",
      title: "Achievement-Focused Descriptions",
      body: `
# Creating Powerful Work Descriptions

Strong resume descriptions focus on achievements, not just duties.

## Duty-Based vs. Achievement-Based

### Duty-Based (Basic)
"Answered phones and greeted customers"

### Achievement-Based (Better)
"Provided friendly customer service to 50+ daily callers, resolving basic issues without manager assistance"

## The PAR Method
Use the Problem-Action-Result method to create strong descriptions:

1. **Problem/Project**: What situation or task did you face?
2. **Action**: What did you specifically do?
3. **Result**: What positive outcome happened?

### Example:
- Problem: Store had disorganized inventory system
- Action: Created color-coded labeling system
- Result: Reduced time to find items by 30%

### Final Bullet Point:
"Created color-coded inventory labeling system that reduced item retrieval time by 30% and improved store organization"

## Adding Impact with Numbers
When possible, include numbers to show your impact:
- Quantities: "Assisted 20+ customers daily"
- Percentages: "Increased sales by 15%"
- Frequencies: "Processed weekly payroll for 25 employees"
- Time: "Reduced check-in time from 5 minutes to 2 minutes"
      `,
    },
    {
      type: "text",
      title: "Professional Resume Formatting",
      body: `
# Making Your Resume Look Professional

A well-formatted resume is easier to read and makes a good impression.

## Basic Formatting Principles
- **Consistency**: Use the same formatting for similar elements
- **White Space**: Leave enough space between sections to avoid crowding
- **Alignment**: Keep text aligned properly (usually left-aligned)
- **Font Choice**: Use professional fonts like Arial, Calibri, or Times New Roman
- **Font Size**: Use 10-12 point for main text, 14-16 point for headings

## Resume Layout Options

### Chronological Format
- Lists work history with most recent first
- Best for people with steady work history
- Highlights career progression

### Functional Format
- Emphasizes skills over work history
- Good for those with employment gaps or career changers
- Organized by skill categories rather than jobs

### Combination Format
- Includes both skills section and work history
- Offers flexibility to highlight most relevant information
- Works well for most situations

## Formatting Tips
- Use bold for section headings
- Use bullet points for lists of skills and achievements
- Keep margins between 0.5-1 inch
- Save your resume as a PDF to preserve formatting
- Name your file professionally (e.g., "JohnSmith_Resume.pdf")
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/employment-skills/resume-formats.jpg",
      alt: "Examples of different resume formats",
      caption: "Comparison of chronological, functional, and combination resume formats",
    },
  ],
  activities: [
    {
      type: "job-analysis",
      title: "Job Description Analysis",
      instructions:
        "Analyze the provided job descriptions and identify the key skills and requirements for each.",
      jobDescriptions: [
        {
          title: "Retail Sales Associate",
          description:
            "Looking for friendly, customer-focused team members to provide excellent service in a busy store environment. Responsibilities include assisting customers, operating cash registers, maintaining store displays, and processing inventory. Must have good communication skills, basic math ability, and be able to stand for extended periods. Previous retail experience preferred but not required. Must be available to work weekends and some evenings.",
        },
        {
          title: "Office Assistant",
          description:
            "Small business seeking an organized office assistant to help with daily operations. Duties include answering phones, scheduling appointments, filing documents, data entry, and greeting visitors. The ideal candidate will have excellent organizational skills, proficiency with Microsoft Office, strong attention to detail, and professional phone manner. Experience in a similar role is a plus. Hours are Monday-Friday, 9am-5pm.",
        },
      ],
    },
    {
      type: "transformation-exercise",
      title: "Transform Duty Statements to Achievements",
      instructions:
        "Rewrite these basic duty statements as achievement-focused bullet points using the PAR method.",
      statements: [
        "Cleaned tables and washed dishes",
        "Helped customers with questions",
        "Filed paperwork and answered phones",
        "Stocked shelves with products",
        "Worked on a team project",
      ],
    },
    {
      type: "resume-tailoring",
      title: "Resume Customization Exercise",
      instructions:
        "Take your basic resume and customize it for one of the job descriptions from the earlier activity. Submit both versions to see the differences.",
      rubric: {
        Relevance: "Resume highlights skills and experiences relevant to the target job",
        Language: "Uses similar terminology to the job description",
        Focus: "Prioritizes information most important to the employer",
        Clarity: "Maintains clear, professional presentation",
      },
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Targeted Resume Quiz",
      questions: [
        {
          question: "Why should you customize your resume for each job application?",
          options: [
            "To make your resume longer and more impressive",
            "To highlight your most relevant skills and experiences for that specific job",
            "To hide employment gaps more effectively",
            "Because all employers require completely different resumes",
          ],
          correctAnswer:
            "To highlight your most relevant skills and experiences for that specific job",
        },
        {
          question: "What is a transferable skill?",
          options: [
            "A skill that only applies to one specific job",
            "A skill that you transfer from your resume to your cover letter",
            "A skill that is useful in many different types of jobs",
            "A skill that you want to develop but don't have yet",
          ],
          correctAnswer: "A skill that is useful in many different types of jobs",
        },
        {
          question: "Which of these is an example of an achievement-focused statement?",
          options: [
            "Responsible for customer service",
            "Duties included cleaning and organizing",
            "Worked as a cashier for two years",
            "Implemented a new filing system that reduced document retrieval time by 25%",
          ],
          correctAnswer:
            "Implemented a new filing system that reduced document retrieval time by 25%",
        },
        {
          question: "What does the 'R' stand for in the PAR method?",
          options: ["Requirement", "Resume", "Responsibility", "Result"],
          correctAnswer: "Result",
        },
        {
          question: "Which resume format emphasizes skills over chronological work history?",
          options: [
            "Chronological format",
            "Functional format",
            "Standard format",
            "Sequential format",
          ],
          correctAnswer: "Functional format",
        },
      ],
    },
    {
      type: "matching",
      title: "Match the Resume Element to its Purpose",
      items: [
        {
          element: "Targeted objective statement",
          purpose: "Shows interest in the specific position",
        },
        {
          element: "Achievement-focused bullet points",
          purpose: "Demonstrates the value you brought to previous roles",
        },
        {
          element: "Quantified accomplishments",
          purpose: "Provides measurable evidence of your contributions",
        },
        {
          element: "Consistent formatting",
          purpose: "Makes your resume look professional and easy to read",
        },
        {
          element: "Keywords from the job description",
          purpose: "Helps your resume pass applicant tracking systems",
        },
      ],
    },
    {
      type: "file-upload",
      title: "Targeted Resume Submission",
      instructions:
        "Create a targeted resume for a job you're interested in applying for. Include the job description and your tailored resume.",
      rubric: {
        Customization: "Resume is clearly tailored to the specific job",
        "Achievement Focus": "Work descriptions emphasize accomplishments, not just duties",
        Relevance: "Most relevant skills and experiences are highlighted",
        Professionalism: "Formatting is consistent and professional",
        Clarity: "Information is clear, concise, and error-free",
      },
    },
  ],
  resources: [
    {
      type: "pdf",
      title: "Transferable Skills Worksheet",
      url: "/resources/transferable-skills.pdf",
    },
    { type: "pdf", title: "Resume Format Guide", url: "/resources/resume-formats.pdf" },
    {
      type: "pdf",
      title: "Achievement Statement Formula",
      url: "/resources/achievement-statements.pdf",
    },
    {
      type: "link",
      title: "Job Description Analyzer Tool",
      url: "https://example.com/job-analyzer",
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
    executiveFunctionSupport: "Templates and formulas for creating achievement statements",
    visualSupports: "Examples and visual models provided",
    alternativeFormats: "Multiple ways to practice and demonstrate learning",
  },
});

// Interview Practice
const interviewPracticeBeginner = createLessonTemplate({
  id: "employment-skills-interview-practice-beginner",
  title: "Interview Basics: Preparing for Success",
  description:
    "Learn the fundamentals of job interviews and how to prepare for your first interview.",
  category: "Employment Skills",
  subcategory: "Interview Practice",
  difficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
  duration: 50,
  learningObjectives: [
    "Understand the purpose of job interviews",
    "Learn basic interview preparation steps",
    "Practice answering common interview questions",
    "Develop appropriate interview behavior and etiquette",
  ],
  content: [
    {
      type: "text",
      title: "Understanding Interviews",
      body: `
# What is a Job Interview?

A job interview is a meeting between you and an employer to discuss a job opportunity.

## Purpose of Interviews
- For employers to learn more about your skills and experience
- To determine if you're a good fit for the job and company
- For you to learn more about the job and if you would like working there
- To discuss the job details, including responsibilities and pay

## Types of Interviews
- **One-on-one**: Meeting with one interviewer (most common)
- **Panel**: Meeting with multiple interviewers at once
- **Phone**: Interview conducted over the phone
- **Video**: Interview using video calling (like Zoom or Skype)
- **Group**: Multiple candidates interviewed together

## Interview Stages
1. **Introduction**: Meeting and greeting
2. **Questions from interviewer**: About your experience and skills
3. **Your questions**: Your chance to ask about the job
4. **Conclusion**: Wrap-up and next steps information
      `,
    },
    {
      type: "video",
      title: "The Interview Process",
      src: "https://example.com/videos/interview-basics.mp4",
      transcript:
        "This video walks through what happens in a typical job interview from arrival to departure. It shows proper greetings, answering questions, and concluding the interview professionally.",
    },
    {
      type: "text",
      title: "Interview Preparation",
      body: `
# How to Prepare for an Interview

Good preparation helps you feel confident and do your best.

## Before the Interview

### Research the Company
- Visit their website
- Learn what products or services they offer
- Understand their mission and values
- Look for recent news about the company

### Understand the Job
- Read the job description carefully
- Make a list of the skills and qualities they want
- Think about how your experience matches these requirements

### Prepare Your Documents
- Bring several copies of your resume
- Bring a list of references if you have them
- Bring a notepad and pen for taking notes
- Consider bringing examples of your work if relevant

### Plan Your Journey
- Know exactly where the interview is located
- Plan how you will get there
- Allow extra time for unexpected delays
- If possible, do a practice trip before the interview day

### Choose Appropriate Clothes
- Dress neatly and professionally
- Choose clothes slightly more formal than the job requires
- Make sure clothes are clean and wrinkle-free
- Keep jewelry and accessories simple
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/employment-skills/interview-preparation.jpg",
      alt: "Visual checklist for interview preparation",
      caption: "Important steps to prepare for a job interview",
    },
    {
      type: "text",
      title: "Common Interview Questions",
      body: `
# Answering Common Interview Questions

Here are questions that interviewers often ask and tips for answering them:

## "Tell me about yourself."
- Give a brief overview of your background and experience
- Focus on information relevant to the job
- Keep your answer to 1-2 minutes
- End with why you're interested in this position

**Example:** "I've been interested in customer service since my first job at a grocery store. I really enjoyed helping customers find what they needed and solving problems. After that, I worked at a call center for a year where I developed my phone communication skills. I'm looking for a position like this one where I can continue using my customer service skills in a retail environment."

## "Why do you want to work here?"
- Show you've researched the company
- Mention specific things that appeal to you
- Connect the job to your skills and goals

**Example:** "I've always enjoyed shopping at this store because of the friendly staff and quality products. I know your company values customer satisfaction, which matches my own approach to work. I think my experience in retail and passion for helping people would make me a good fit for your team."

## "What are your strengths?"
- Choose strengths relevant to the job
- Give specific examples of using these strengths
- Be honest but confident

**Example:** "One of my strengths is reliability. In my last job, I had perfect attendance for six months and was never late. Another strength is my attention to detail. When I worked in the stockroom, I noticed when inventory counts were off and helped fix several errors."

## "What are your weaknesses?"
- Choose a real weakness that isn't critical to the job
- Explain how you're working to improve
- Show self-awareness and willingness to grow

**Example:** "Sometimes I get nervous speaking in front of large groups. I've been working on this by volunteering to present more often in my current role. I've definitely improved and feel more comfortable now, though I'm still working on it."

## "Tell me about a challenge you faced and how you handled it."
- Choose a relevant work or life challenge
- Describe the situation briefly
- Focus on the actions you took
- Share the positive outcome

**Example:** "At my previous job, we had a sudden rush of customers one day when two staff members called in sick. I offered to stay two hours past my shift and took on greeting customers while also helping at checkout. By prioritizing tasks and staying calm, we managed to serve all customers without excessive wait times. My manager thanked me for stepping up during a difficult situation."
      `,
    },
    {
      type: "audio",
      title: "Sample Interview Question and Answer",
      src: "https://example.com/audio/interview-sample.mp3",
      transcript:
        "This audio clip demonstrates good answers to common interview questions, with commentary on why the responses are effective.",
    },
    {
      type: "text",
      title: "Interview Etiquette",
      body: `
# Professional Behavior During Interviews

How you behave during an interview is just as important as what you say.

## Making a Good First Impression
- Arrive 10-15 minutes early
- Turn off your phone completely
- Be polite to everyone you meet, including receptionists
- Offer a firm handshake and smile when meeting the interviewer
- Wait to be invited to sit down

## Body Language Tips
- Maintain appropriate eye contact
- Sit up straight with feet on the floor
- Avoid fidgeting or playing with objects
- Nod occasionally to show you're listening
- Keep a pleasant, interested facial expression

## Communication Skills
- Speak clearly and at a moderate pace
- Listen carefully to questions before answering
- It's okay to pause briefly to think about your answer
- If you don't understand a question, politely ask for clarification
- Say "I don't know" if you truly don't know something, but explain how you would find out

## End of Interview
- Thank the interviewer for their time
- Ask when you might hear back about the position
- Express your continued interest in the job
- Shake hands before leaving
- Send a thank-you email within 24 hours
      `,
    },
  ],
  activities: [
    {
      type: "research-practice",
      title: "Company Research Exercise",
      instructions:
        "Choose a company you're interested in and complete the research worksheet about them.",
      worksheet: {
        companyName: "",
        products: "",
        services: "",
        location: "",
        missionStatement: "",
        values: "",
        recentNews: "",
        whyInterested: "",
      },
    },
    {
      type: "question-practice",
      title: "Common Question Preparation",
      instructions:
        "Practice answering these common interview questions. Record or write your answers.",
      questions: [
        "Tell me about yourself.",
        "Why do you want this job?",
        "What are your greatest strengths?",
        "What is a weakness you have?",
        "Tell me about a time you worked as part of a team.",
        "Why should we hire you?",
      ],
    },
    {
      type: "role-play",
      title: "Interview Greeting Practice",
      instructions:
        "With a partner, practice introducing yourself professionally in an interview setting.",
      scenarioSteps: [
        "Knock on the door or enter when invited",
        "Introduce yourself with a smile and confident voice",
        "Shake hands appropriately",
        "Wait to be seated until invited",
        "Respond to initial small talk professionally",
      ],
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Interview Basics Quiz",
      questions: [
        {
          question: "What is the main purpose of a job interview?",
          options: [
            "To negotiate your salary",
            "To determine if you and the job are a good match",
            "To make friends with the interviewer",
            "To practice your public speaking skills",
          ],
          correctAnswer: "To determine if you and the job are a good match",
        },
        {
          question: "How early should you arrive for an interview?",
          options: ["Just on time", "5 minutes early", "10-15 minutes early", "An hour early"],
          correctAnswer: "10-15 minutes early",
        },
        {
          question: "What should you bring to an interview?",
          options: [
            "Just yourself",
            "Copies of your resume, notepad, and pen",
            "Food and drinks",
            "Friends for support",
          ],
          correctAnswer: "Copies of your resume, notepad, and pen",
        },
        {
          question: "What should you do if you don't understand an interview question?",
          options: [
            "Pretend you understand and answer anyway",
            "Skip the question and talk about something else",
            "Politely ask for clarification",
            "Say you'll email the answer later",
          ],
          correctAnswer: "Politely ask for clarification",
        },
        {
          question: "What should you do after an interview?",
          options: [
            "Call the employer every day until you hear back",
            "Send a thank-you email within 24 hours",
            "Immediately ask about salary if you didn't discuss it",
            "Nothing, just wait to hear back",
          ],
          correctAnswer: "Send a thank-you email within 24 hours",
        },
      ],
    },
    {
      type: "scenario-response",
      title: "Interview Scenario Response",
      instructions:
        "Read the scenario and write or record how you would respond in this situation.",
      scenario:
        "You arrive at a job interview and discover there's a group of three people who will be interviewing you instead of just one person, which is what you expected. You feel nervous about this change. How do you handle this situation professionally?",
      rubric: {
        Adaptability: "Shows ability to adjust to unexpected situations",
        Professionalism: "Maintains professional behavior despite challenges",
        Communication: "Communicates effectively under pressure",
        Attitude: "Demonstrates a positive attitude",
      },
    },
    {
      type: "mock-interview",
      title: "Basic Mock Interview",
      instructions:
        "Participate in a short mock interview where you'll practice your introduction and answers to 3-5 basic questions.",
      rubric: {
        "First Impression": "Professional greeting and body language",
        "Question Responses": "Clear, relevant answers to questions",
        Communication: "Speaks clearly and maintains appropriate eye contact",
        "Overall Presentation": "Projects confidence and professionalism",
      },
    },
  ],
  resources: [
    {
      type: "pdf",
      title: "Interview Preparation Checklist",
      url: "/resources/interview-checklist.pdf",
    },
    {
      type: "pdf",
      title: "Common Interview Questions Guide",
      url: "/resources/common-questions.pdf",
    },
    {
      type: "link",
      title: "Professional Dress Guide",
      url: "https://example.com/interview-attire",
    },
    { type: "link", title: "Company Research Tips", url: "https://example.com/company-research" },
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
    executiveFunctionSupport: "Checklists and step-by-step guides",
    visualSupports: "Visual examples of appropriate interview behavior",
    socialScripts: "Sample scripts for common interview interactions",
    anxietySupport: "Preparation strategies to reduce interview anxiety",
  },
});

// Export all Employment Skills lessons
export const employmentSkillsLessons = [
  resumeWritingBeginner,
  resumeWritingIntermediate,
  interviewPracticeBeginner,
  // More employment skills lessons would be added here
];
