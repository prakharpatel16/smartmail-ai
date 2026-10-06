# SmartMail AI — Product Requirements Document (PRD)

## 1. Product Overview

**SmartMail AI** is a MERN-based intelligent email assistant that integrates with Gmail and uses Artificial Intelligence to help users understand, write, improve, prioritize, and safely respond to emails.

The application focuses on practical AI-assisted email workflows while keeping the user in control of reviewing and sending messages.

## 2. Product Goals

- Reduce the time required to understand emails and long threads.
- Generate contextual replies quickly.
- Help users write new emails using natural-language instructions.
- Improve email clarity, grammar, professionalism, and tone.
- Identify high-priority emails automatically.
- Detect meeting-related information in emails.
- Allow users to ask natural-language questions about their inbox using RAG.
- Detect potential phishing and suspicious emails.
- Provide a pre-send AI quality and safety check.
- Maintain strong user-level data isolation.
- Provide scalable asynchronous processing for email and AI workloads.

## 3. Target Users

- Students
- Software developers
- Working professionals
- Recruiters
- Business users
- Users managing large Gmail inboxes

## 4. Core Features

### 4.1 AI Email Summary

The AI summarizes an individual email or an entire email conversation/thread into a concise and readable format.

#### Functional Requirements

- User can select **Summarize Email** from the email details page.
- AI receives sender, recipients, subject, email body, and relevant thread context.
- Generate a concise summary.
- Extract the main points.
- Identify important requests or actions.
- Identify deadlines or dates when present.
- Support long email threads.
- Allow the user to regenerate the summary.

#### Example

```text
AI Summary

• Client approved the proposed design.
• Backend API needs to be completed by Friday.
• Final review meeting is scheduled for Monday.
• John will provide the remaining requirements.
```

### 4.2 AI Reply Generator

Generates a contextual reply to an existing email using the current email and relevant conversation history.

#### Supported Tones

- Professional
- Friendly
- Formal
- Concise

#### Functional Requirements

- User clicks **Generate Reply**.
- System retrieves the current email.
- System retrieves relevant conversation/thread context.
- AI generates a contextual reply.
- User can select the desired tone.
- User can regenerate the response.
- Generated response is placed inside the reply editor.
- User can manually edit the response.
- User can save it as a draft.
- User can send it after reviewing.

#### Important Constraint

The AI must **never automatically send an email**. The final sending action must always require explicit user interaction.

### 4.3 AI Email Writer

Allows users to create a new email using a natural-language instruction.

#### Example

```text
Write a professional email asking my professor for
an extension on the assignment because of a technical issue.
```

AI generates:

```text
Subject:
Request for Assignment Extension

Body:
Dear Professor,

I am writing to request a short extension for the assignment
 due to a technical issue that affected my work.

I would be grateful if you could allow me some additional time
to complete and submit the assignment.

Thank you for your consideration.

Best regards,
Prakhar
```

#### Functional Requirements

- User provides a natural-language instruction.
- User can optionally provide context.
- AI generates subject and body.
- User can select tone.
- User can regenerate.
- User can edit the generated email.
- User can save as draft.
- User can send after reviewing.

### 4.4 AI Email Rewriter

Improves an existing email while preserving the user's original meaning and intent.

#### Rewrite Modes

- Improve Grammar
- Make Professional
- Make Concise
- Make Friendly
- Make Formal
- Improve Clarity

#### Functional Requirements

- User enters or selects existing email text.
- User chooses a rewrite mode.
- AI generates an improved version.
- Original text remains available.
- User can compare original and rewritten versions.
- User can regenerate the result.
- User can accept or reject the rewrite.
- User can manually edit the final version.

#### Important Constraint

The AI should preserve original intent, important facts, names, dates, numbers, and requests. It should not introduce unsupported information.

### 4.5 AI Priority Detection

Automatically determines the priority of incoming emails.

#### Priority Levels

```text
CRITICAL
HIGH
MEDIUM
LOW
```

#### Detection Signals

AI may analyze:

- Urgent language
- Deadlines
- Required actions
- Important senders
- Meeting requests
- Financial notices
- Work-related requests
- Time-sensitive information
- Explicit response requirements

#### Example

```text
Priority: HIGH

Reason:
The sender requested a response before 5 PM today.
```

#### Functional Requirements

- Priority can be generated during email processing.
- Priority is stored with the email.
- Priority is visible in the inbox.
- Priority is visible on the email details page.
- User can manually override AI-generated priority.

### 4.6 AI Meeting Detection

Detects whether an email contains information about a meeting, interview, appointment, or scheduled event.

#### Information to Extract

Where available:

- Meeting detected
- Meeting title
- Date
- Time
- Time zone
- Location
- Meeting link
- Participants

#### Example

```text
Meeting Detected: YES

Title: Project Review
Date: October 15, 2026
Time: 3:00 PM
Time Zone: IST
Location: Google Meet
Meeting Link: Available
```

#### Functional Requirements

- Meeting detection runs during AI email processing.
- Meeting indicator appears on applicable emails.
- Extracted information is displayed on the email details page.
- User can view meeting information.
- Version 1 will not automatically create calendar events.

### 4.7 RAG Chat — Ask My Inbox

Ask My Inbox is the flagship AI feature. It allows users to ask natural-language questions about their own email history.

#### Example Questions

```text
What important emails did I receive this week?

Summarize my conversation with Rahul.

What tasks were assigned to me?

Which emails mention an interview?

What meetings were discussed recently?

Find emails related to the project deadline.

What did the client say about the new requirements?
```

### 4.8 RAG Architecture

The system will implement a custom Retrieval-Augmented Generation pipeline.

```text
User Question
      ↓
Generate Query Embedding
      ↓
MongoDB Atlas Vector Search
      ↓
Retrieve Relevant Emails
      ↓
Validate User Ownership
      ↓
Build Context
      ↓
LLM
      ↓
Generate Answer
```

#### RAG Components

1. Query processing
2. Embedding generation
3. Vector search
4. Relevant email retrieval
5. Context construction
6. LLM generation
7. Source/reference generation

#### Important Architecture Decision

**LangChain and LangGraph will NOT be used.**

The RAG system will be implemented manually using:

- Embedding API
- MongoDB Atlas Vector Search
- Custom retrieval logic
- Custom context construction
- Gemini/OpenAI API

This keeps the architecture simple and makes the complete RAG pipeline easier to understand and explain during interviews.

### 4.9 RAG Data Isolation

User email data is private. Every vector search must include the authenticated user's identifier.

```text
Vector Search
      +
userId filter
      ↓
Only authenticated user's emails
```

The system must never retrieve another user's email.

### 4.10 AI Phishing Detection

Analyzes emails for signs of phishing or suspicious communication.

#### Detection Signals

- Suspicious sender patterns
- Urgent requests
- Password requests
- Credential requests
- Financial information requests
- Suspicious links
- Domain mismatches
- Impersonation indicators
- Suspicious attachments
- Social-engineering language
- Requests to bypass normal procedures

#### Risk Levels

```text
SAFE
SUSPICIOUS
HIGH RISK
```

#### Example

```text
Phishing Risk: HIGH

Possible indicators:

• Urgent request for account verification.
• Sender domain appears suspicious.
• Email requests sensitive information.
• Link destination may not match the claimed organization.
```

#### Functional Requirements

- Phishing analysis can run during AI email processing.
- User can manually request analysis.
- Risk level is displayed in the email.
- Warning details are displayed.
- User can review reasons for the warning.

#### Important Safety Constraint

Phishing detection is an AI-assisted security warning. It is **not a guaranteed security verdict**. Users should independently verify sensitive requests.

### 4.11 AI Check

AI Check is a pre-send assistant that reviews an email before the user sends it. It combines multiple quality and safety checks into a single workflow.

#### 4.11.1 Grammar Check

Detect:

- Grammar mistakes
- Spelling mistakes
- Sentence problems
- Punctuation issues

#### 4.11.2 Tone Check

Analyze whether the email sounds:

- Professional
- Friendly
- Formal
- Too casual
- Aggressive
- Unclear

#### 4.11.3 Clarity Check

Detect:

- Confusing sentences
- Ambiguous statements
- Missing context
- Poor structure
- Unclear requests

#### 4.11.4 Recipient Check

Checks whether recipients appear consistent with the email content.

Example:

```text
Warning:

The email mentions "Professor Sharma",
but Professor Sharma is not included in the recipients.
```

This is a suggestion and not a definitive identity check.

#### 4.11.5 Missing Attachment Check

Detect statements such as:

```text
Attached is...
Please find the attached...
I've attached...
The document is attached...
```

If the email refers to an attachment but no attachment is detected:

```text
Possible missing attachment.

Your email mentions an attachment,
but no attachment was added.
```

#### 4.11.6 Sensitive Information Check

Warn when the email appears to contain:

- Passwords
- API keys
- Authentication tokens
- Credit card information
- Bank information
- Sensitive personal information

Sensitive content must not be unnecessarily stored in application logs.

#### 4.11.7 Professionalism Check

Checks whether the email is appropriate for the selected communication context.

Example:

```text
Professionalism: NEEDS REVIEW

The message contains informal language.
Consider using a more professional tone.
```

#### AI Check Result

```text
========================================
              AI CHECK
========================================

Grammar                ✓ Good
Tone                   ⚠ Too Casual
Clarity                ✓ Good
Recipient              ✓ No Issue
Attachment             ⚠ Possible Missing Attachment
Sensitive Information  ✓ No Obvious Issue
Professionalism        ⚠ Needs Review

----------------------------------------

Overall:
Review Recommended
========================================
```

The user can then:

```text
[Apply Suggestions] [Ignore] [Edit Email]
```

AI Check must never automatically send the email.

# 5. Supporting Email Features

## Gmail Integration

Gmail will be the initial email provider.

### Supported Features

- Gmail OAuth 2.0
- Inbox synchronization
- Sent emails
- Drafts
- Email details
- Email threads
- Search
- Compose
- Reply
- Send
- Mark read/unread
- Star
- Labels

Outlook/Microsoft Graph can be added in a later version.

# 6. Authentication

The application can support:

- Google OAuth 2.0
- JWT-based application authentication
- HTTP-only cookies

If local authentication is enabled:

- Passwords are hashed using bcrypt.
- Passwords are never stored as plaintext.

# 7. Authorization

All user-owned resources must be protected.

Resources include:

- Emails
- Drafts
- AI results
- Embeddings
- RAG conversations
- Notifications
- User preferences

Every request must verify the authenticated user.

# 8. Redis

Redis will be used for:

### BullMQ Queue Backend

BullMQ uses Redis for job management.

### Caching

Potential cache targets:

- Frequently accessed email data
- AI results
- User preferences
- Temporary processing data

### Temporary State

Short-lived processing state can be stored in Redis where appropriate.

# 9. BullMQ Background Jobs

To prevent long-running AI operations from blocking API requests, background processing will be used.

The initial application will use three main queues.

## 9.1 Email Sync Queue

```text
Gmail API
    ↓
Email Sync Queue
    ↓
BullMQ Worker
    ↓
MongoDB
```

Responsibilities:

- Fetch Gmail messages.
- Normalize email data.
- Store emails.
- Avoid duplicate messages.
- Trigger AI processing.

## 9.2 AI Processing Queue

```text
New Email
    ↓
AI Processing Queue
    ↓
AI Worker
    ├── Email Summary
    ├── Priority Detection
    ├── Meeting Detection
    ├── Phishing Detection
    └── Generate Embedding
```

This allows AI processing to happen asynchronously.

## 9.3 Notification Queue

```text
AI/Event Result
    ↓
Notification Queue
    ↓
Notification Worker
    ↓
Socket.IO
    ↓
React Client
```

# 10. Real-Time Notifications

Socket.IO will provide real-time notifications.

Examples:

```text
New high-priority email received.

Meeting detected in a new email.

Phishing warning generated.

AI processing completed.
```

The frontend should update without requiring a complete page refresh.

# 11. Database

## MongoDB Atlas

MongoDB Atlas will be the primary database.

### Main Collections

```text
users
gmailAccounts
emails
drafts
ragChats
notifications
userPreferences
```

## Email Schema

Conceptual structure:

```javascript
{
  userId,

  gmailMessageId,
  threadId,

  sender: {
    name,
    email
  },

  recipients: [
    {
      name,
      email
    }
  ],

  subject,
  body,

  receivedAt,

  labels: [],

  isRead,
  isStarred,

  ai: {
    summary,
    priority,
    priorityReason,

    meetingDetected,

    meeting: {
      title,
      date,
      time,
      timezone,
      location,
      meetingLink,
      participants
    },

    phishingRisk,
    phishingReasons
  },

  embedding,

  createdAt,
  updatedAt
}
```

# 12. Vector Search

MongoDB Atlas Vector Search will be used for Ask My Inbox.

Each relevant email will have an embedding.

Example:

```javascript
{
  emailId,
  userId,
  embedding: [...]
}
```

The vector index allows semantic search instead of only keyword matching.

Example:

```text
User asks:
What did the client say about the payment?
```

The system can retrieve emails discussing:

```text
invoice
payment
billing
transaction
amount due
```

even when the exact word "payment" does not appear in every email.

# 13. AI Architecture

The project can use either:

- Google Gemini API
- OpenAI API

The AI provider should be abstracted behind a backend service so the application can change providers without rewriting the entire application.

### Suggested Services

```text
ai.service.js
summary.service.js
reply.service.js
writer.service.js
rewriter.service.js
priority.service.js
meeting.service.js
phishing.service.js
aiCheck.service.js
embedding.service.js
rag.service.js
```

# 14. AI Prompt Requirements

AI prompts should:

- Clearly define the task.
- Provide only necessary context.
- Avoid unnecessary email data.
- Request structured JSON when machine-readable output is needed.
- Prevent hallucination.
- Preserve original facts during rewriting.
- Treat retrieved RAG documents as the source of truth.
- Explicitly state when information is unavailable.

### Example Structured Output

```json
{
  "priority": "HIGH",
  "reason": "The sender requested a response before tomorrow.",
  "meetingDetected": true,
  "meeting": {
    "title": "Project Review",
    "date": "2026-10-15",
    "time": "15:00"
  },
  "phishingRisk": "LOW"
}
```

# 15. REST API

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Gmail

```text
GET  /api/gmail/connect
GET  /api/gmail/callback
POST /api/emails/sync
```

## Emails

```text
GET    /api/emails
GET    /api/emails/:id
POST   /api/emails/send
POST   /api/emails/draft
PUT    /api/emails/:id/read
PUT    /api/emails/:id/star
```

## AI

```text
POST /api/ai/summary
POST /api/ai/reply
POST /api/ai/write
POST /api/ai/rewrite
POST /api/ai/priority
POST /api/ai/meeting
POST /api/ai/phishing
POST /api/ai/check
```

## RAG

```text
POST /api/rag/chat
GET  /api/rag/history
```

# 16. Frontend

## Technology

- React
- Vite
- JavaScript ES6+
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios
- Socket.IO Client

# 17. Main Screens

## 17.1 Login

Features:

- Login
- Registration if local authentication is enabled
- Google authentication

## 17.2 Dashboard

Display:

```text
Total Emails
Unread Emails
High Priority
Meetings
Phishing Warnings
```

## 17.3 Inbox

Each email can display:

```text
Sender
Subject
Date
Read/Unread
Priority
Meeting Indicator
Phishing Indicator
```

## 17.4 Email Details

Actions:

```text
AI Summary
Generate Reply
Phishing Analysis
View Priority
View Meeting Details
Reply
Forward
Mark Read/Unread
Star
```

## 17.5 Compose

Features:

```text
To
CC
BCC
Subject
Body
Attachments
```

AI actions:

```text
AI Write
AI Rewrite
AI Check
```

## 17.6 Ask My Inbox

Chat interface for RAG.

Example:

```text
---------------------------------------------
              Ask My Inbox
---------------------------------------------

You:
What important emails did I receive this week?

AI:
You received 4 high-priority emails...

Sources:
• Interview Confirmation
• Project Deadline
• Payment Reminder

---------------------------------------------
[Ask a question...]
---------------------------------------------
```

## 17.7 Settings

- Gmail connection
- AI preferences
- Default reply tone
- User preferences
- Security settings

# 18. Testing Strategy

Testing is a major part of the project.

The goal is to demonstrate:

- Unit testing
- Integration testing
- API testing
- Functional testing
- Frontend testing
- End-to-End testing

## 18.1 Unit Testing

Potential unit tests:

```text
AI Summary Service
AI Reply Service
AI Writer Service
AI Rewriter Service
Priority Detection
Meeting Detection
Phishing Detection
AI Check
Embedding Service
RAG Retrieval Utilities
```

Example:

```text
Input:
Email containing "Urgent response required before 5 PM"

Expected:
Priority = HIGH
```

## 18.2 API Testing

Use **Supertest**.

Test:

```text
Authentication APIs
Email APIs
AI APIs
RAG APIs
Draft APIs
```

Example:

```text
POST /api/ai/summary

Expected:
200 OK

Response:
{
  "summary": "..."
}
```

## 18.3 Integration Testing

Test interactions between components.

Example:

```text
Email Sync
    ↓
MongoDB
    ↓
AI Processing
```

And:

```text
Email
    ↓
Embedding
    ↓
MongoDB Vector Search
    ↓
RAG Response
```

External APIs should be mocked during automated tests where appropriate.

## 18.4 Frontend Testing

Use **React Testing Library**.

Test:

- Login
- Inbox
- Email details
- Compose
- AI Summary button
- AI Reply Generator
- AI Writer
- AI Rewriter
- AI Check
- Ask My Inbox

Example:

```text
User clicks "Generate Summary"

Expected:
Loading indicator appears.

Then:
Summary appears on screen.
```

## 18.5 End-to-End Testing

Use **Playwright**.

Important E2E flow:

```text
Login
  ↓
Open Inbox
  ↓
Open Email
  ↓
Generate AI Summary
  ↓
Generate Reply
  ↓
Edit Reply
  ↓
Run AI Check
  ↓
Save Draft
```

Another flow:

```text
Login
  ↓
Ask My Inbox
  ↓
Ask Question
  ↓
Retrieve Relevant Emails
  ↓
Display AI Answer
```

# 19. Security Requirements

The application must implement:

- HTTPS in production
- HTTP-only cookies
- Secure cookie configuration
- JWT authentication
- bcrypt
- Google OAuth 2.0
- Helmet
- CORS
- Rate limiting
- Input validation
- Secure environment variables
- Authorization middleware
- User-level data isolation

### Secrets

Never expose these to the frontend:

```text
GEMINI_API_KEY
OPENAI_API_KEY
GOOGLE_CLIENT_SECRET
JWT_SECRET
MONGODB_URI
REDIS_URL
```

# 20. Privacy Requirements

Email data can contain sensitive information.

Therefore:

- Do not unnecessarily log email bodies.
- Do not log OAuth access/refresh tokens.
- Do not expose email data through error responses.
- Restrict email access using user authorization.
- Ensure RAG searches are filtered by user ID.
- Store only required data.
- Protect production database credentials.
- Avoid sending unnecessary personal email data to the AI provider.

# 21. High-Level Architecture

```text
                         SMARTMAIL AI
                              │
                 ┌────────────┴────────────┐
                 │                         │
             React App                Express API
                 │                         │
          Redux Toolkit              REST + Socket.IO
                 │                         │
                 │            ┌────────────┼─────────────┐
                 │            │            │             │
                 │        MongoDB        Redis         Gmail
                 │            │            │          OAuth/API
                 │            │         BullMQ
                 │            │            │
                 │            │         Workers
                 │            │            │
                 │            └──────┬─────┘
                 │                   │
                 │               AI Services
                 │                   │
                 │        ┌──────────┴──────────┐
                 │        │                     │
                 │      LLM API             Embeddings
                 │        │                     │
                 │        │              Atlas Vector Search
                 │        │                     │
                 │        └──────────┬──────────┘
                 │                   │
                 └───────────────────┘
```

# 22. Email Processing Flow

```text
                    Gmail
                      ↓
                  Gmail API
                      ↓
              Email Sync Queue
                      ↓
               BullMQ Worker
                      ↓
                  MongoDB
                      ↓
             AI Processing Queue
                      ↓
                  AI Worker
                      │
       ┌──────────────┼───────────────┐
       ↓              ↓               ↓
    Summary       Priority        Meeting
       │              │               │
       └──────────────┼───────────────┘
                      │
               Phishing Detection
                      │
                      ↓
                Generate Embedding
                      ↓
            MongoDB Vector Index
```

# 23. RAG Processing Flow

```text
User asks a question
        ↓
Backend receives question
        ↓
Generate query embedding
        ↓
MongoDB Atlas Vector Search
        ↓
Filter by authenticated userId
        ↓
Retrieve top relevant emails
        ↓
Construct context
        ↓
Send context + question to LLM
        ↓
Generate answer
        ↓
Return answer + relevant email references
```

# 24. AI Email Generation Flow

```text
User Input
    ↓
Express API
    ↓
Validate Request
    ↓
AI Service
    ↓
LLM API
    ↓
Structured Response
    ↓
Validate AI Response
    ↓
Return to Frontend
    ↓
User Reviews
    ↓
Save Draft / Send
```

# 25. Background AI Flow

```text
Gmail Email
      ↓
Email Sync
      ↓
MongoDB
      ↓
BullMQ AI Job
      ↓
AI Worker
      ├── Summary
      ├── Priority
      ├── Meeting
      ├── Phishing
      └── Embedding
      ↓
MongoDB
      ↓
Socket.IO Notification
      ↓
Frontend Update
```

# 26. Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | UI |
| Vite | Frontend tooling |
| JavaScript ES6+ | Application language |
| Tailwind CSS | Styling |
| Redux Toolkit | Global state management |
| React Router | Routing |
| Axios | API communication |
| Socket.IO Client | Real-time updates |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Backend framework |
| JavaScript | Backend language |
| REST APIs | Client-server communication |
| Socket.IO | Real-time communication |

## Database

| Technology | Purpose |
|---|---|
| MongoDB Atlas | Primary database |
| Mongoose | ODM |
| MongoDB Atlas Vector Search | Semantic email retrieval |

## AI

| Technology | Purpose |
|---|---|
| Google Gemini API / OpenAI API | LLM |
| Embedding API | Email/query embeddings |
| Custom RAG | Retrieval-Augmented Generation |
| Prompt Engineering | AI behavior |
| Structured AI Responses | Reliable AI output |

## Email

| Technology | Purpose |
|---|---|
| Gmail API | Email access |
| Google OAuth 2.0 | Gmail authorization |

## Caching & Background Jobs

| Technology | Purpose |
|---|---|
| Redis | Cache and queue backend |
| BullMQ | Background job processing |

## Testing

| Technology | Purpose |
|---|---|
| Node.js Test Runner / Jest | Unit testing |
| Supertest | API testing |
| React Testing Library | Frontend testing |
| Playwright | E2E testing |

## Security

| Technology | Purpose |
|---|---|
| JWT | Authentication |
| bcrypt | Password hashing |
| Helmet | HTTP security headers |
| CORS | Cross-origin security |
| Rate Limiting | Abuse protection |
| Input Validation | Request validation |

## Deployment

| Platform | Purpose |
|---|---|
| Vercel | React frontend |
| Render | Node.js API + workers |
| MongoDB Atlas | Database |
| Managed Redis / Render Redis | Redis + BullMQ |

# 27. Environment Variables

Example:

```env
NODE_ENV=development

PORT=5000

MONGODB_URI=

JWT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

GEMINI_API_KEY=
# OR
OPENAI_API_KEY=

REDIS_URL=

CLIENT_URL=
```

Secrets must be stored in environment variables and never committed to Git.

# 28. Suggested Backend Structure

```text
server/
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   └── redis.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── email.controller.js
│   │   ├── ai.controller.js
│   │   └── rag.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── email.routes.js
│   │   ├── ai.routes.js
│   │   └── rag.routes.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Email.js
│   │   ├── Draft.js
│   │   └── RagChat.js
│   │
│   ├── services/
│   │   ├── ai.service.js
│   │   ├── summary.service.js
│   │   ├── reply.service.js
│   │   ├── writer.service.js
│   │   ├── rewriter.service.js
│   │   ├── priority.service.js
│   │   ├── meeting.service.js
│   │   ├── phishing.service.js
│   │   ├── aiCheck.service.js
│   │   ├── embedding.service.js
│   │   ├── rag.service.js
│   │   └── gmail.service.js
│   │
│   ├── queues/
│   │   ├── redisClient.js
│   │   ├── emailSync.queue.js
│   │   ├── aiProcessing.queue.js
│   │   └── notification.queue.js
│   │
│   ├── workers/
│   │   ├── emailSync.worker.js
│   │   ├── aiProcessing.worker.js
│   │   └── notification.worker.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   │
│   ├── utils/
│   │
│   └── app.js
│
└── package.json
```

# 29. Suggested Frontend Structure

```text
client/
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── email/
│   │   ├── ai/
│   │   └── layout/
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Inbox.jsx
│   │   ├── EmailDetails.jsx
│   │   ├── Compose.jsx
│   │   ├── AskInbox.jsx
│   │   └── Settings.jsx
│   │
│   ├── store/
│   │   ├── store.js
│   │   └── slices/
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── emailApi.js
│   │   └── aiApi.js
│   │
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
└── package.json
```

# 30. Non-Goals for Version 1

To keep the project focused, explainable, and manageable, Version 1 will NOT include:

- LangChain
- LangGraph
- Autonomous AI agents
- Autonomous email sending
- Outlook integration
- Automatic calendar event creation
- Full project management
- Complex workflow automation
- Voice assistant
- Multimodal email analysis
- Advanced CRM
- Enterprise administration

These features can be considered for future versions.

# 31. Implementation Phases

## Phase 1 — Project Foundation

- Create MERN application.
- Configure React/Vite.
- Configure Express.
- Connect MongoDB Atlas.
- Configure environment variables.
- Implement authentication.
- Implement basic application layout.

## Phase 2 — Gmail Integration

- Configure Google Cloud project.
- Configure Gmail API.
- Implement OAuth 2.0.
- Connect Gmail account.
- Fetch emails.
- Store normalized emails.
- Implement inbox.
- Implement email details.
- Implement drafts.
- Implement sending.

## Phase 3 — Core AI

Implement:

- AI Email Summary
- AI Reply Generator
- AI Email Writer
- AI Email Rewriter

## Phase 4 — AI Analysis

Implement:

- AI Priority Detection
- AI Meeting Detection
- AI Phishing Detection
- AI Check

## Phase 5 — RAG

Implement:

- Embedding generation
- MongoDB Vector Search
- Email indexing
- Retrieval
- Context construction
- Ask My Inbox
- RAG chat history

## Phase 6 — Background Processing

Implement:

- Redis
- BullMQ
- Email Sync Queue
- AI Processing Queue
- Notification Queue
- Workers

## Phase 7 — Real-Time Features

Implement:

- Socket.IO
- Important email notifications
- AI processing notifications
- Phishing warnings
- Meeting detection notifications

## Phase 8 — Testing

Implement:

- Unit tests
- Integration tests
- API tests
- Frontend tests
- E2E tests

## Phase 9 — Security

Implement:

- Authentication hardening
- Authorization
- Rate limiting
- Helmet
- CORS
- Input validation
- Secure cookies
- Environment variable protection
- User-level RAG isolation

## Phase 10 — Deployment

Deploy:

```text
React
  ↓
Vercel

Node.js API + Workers
  ↓
Render

MongoDB
  ↓
MongoDB Atlas

Redis
  ↓
Managed Redis / Render Redis
```

# 32. Success Criteria

The project will be considered successful when:

## Email

- Users can securely connect Gmail.
- Emails synchronize correctly.
- Inbox displays email information.
- Users can open email threads.
- Users can compose and send emails.
- Users can save drafts.

## AI

- AI can summarize emails.
- AI can summarize long threads.
- AI can generate contextual replies.
- AI can generate new emails.
- AI can rewrite existing emails.
- AI can determine email priority.
- AI can detect meetings.
- AI can detect potential phishing.
- AI Check can analyze outgoing emails.

## RAG

- Users can ask questions about their inbox.
- Relevant emails are retrieved semantically.
- RAG answers use retrieved email context.
- RAG retrieval is restricted to the authenticated user.
- Relevant email sources can be shown with answers.

## Infrastructure

- Redis is used for caching/queue infrastructure.
- BullMQ handles background jobs.
- AI processing does not unnecessarily block API requests.
- Socket.IO provides real-time updates.

## Testing

- Core services have unit tests.
- APIs have automated tests.
- Important frontend components have tests.
- Critical user workflows have Playwright E2E tests.

## Security

- OAuth credentials are protected.
- AI API keys are protected.
- User email data is isolated.
- Sensitive information is not unnecessarily logged.

## Deployment

- Frontend can be deployed to Vercel.
- Backend/workers can be deployed to Render.
- Database runs on MongoDB Atlas.
- Redis runs through managed Redis infrastructure.

# 33. Final Product Positioning

**SmartMail AI** is an AI-powered Gmail assistant built with the MERN stack.

The project's strongest technical aspects are:

1. LLM integration across multiple practical email workflows.
2. Custom RAG over private email data.
3. MongoDB Atlas Vector Search for semantic retrieval.
4. Redis and BullMQ for asynchronous processing.
5. Socket.IO for real-time updates.
6. AI-assisted phishing detection.
7. AI-powered pre-send email checking.
8. Automated unit, API, frontend, integration, and E2E testing.
9. Secure Gmail OAuth.
10. User-level email and RAG data isolation.

The project intentionally avoids LangChain and LangGraph so that the AI and RAG pipeline remains understandable and explainable.

# 34. One-Line Project Description

> SmartMail AI is a MERN-based intelligent Gmail assistant that uses LLMs, custom RAG, MongoDB Vector Search, Redis, and BullMQ to summarize emails, generate and rewrite replies, detect priority, meetings, and phishing threats, and provide AI-powered pre-send email checks.

# 35. Resume-Level Technology Summary

```text
React.js, Vite, JavaScript, Tailwind CSS, Redux Toolkit,
Node.js, Express.js, MongoDB Atlas, Mongoose,
MongoDB Atlas Vector Search, Google Gemini/OpenAI API,
Gmail API, Google OAuth 2.0, Redis, BullMQ,
Socket.IO, JWT, bcrypt, Helmet, CORS,
Supertest, React Testing Library, Playwright
```
