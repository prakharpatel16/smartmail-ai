SmartMail AI — System Architecture
==================================

1\. Overview
------------

**SmartMail AI** is a full-stack AI-powered email assistant built around Gmail.

The application allows users to:

*   Read and synchronize Gmail emails
    
*   Summarize emails and threads
    
*   Generate contextual replies
    
*   Write new emails using AI
    
*   Rewrite existing email content
    
*   Detect email priority
    
*   Detect meetings and extract meeting information
    
*   Detect potentially phishing emails
    
*   Run AI checks before sending
    
*   Ask natural-language questions about their inbox
    
*   Retrieve relevant emails using RAG
    
*   Receive real-time notifications
    
*   Manage drafts and email actions
    

The architecture is designed to be:

*   Modular
    
*   Secure
    
*   Testable
    
*   Maintainable
    
*   Asynchronous where appropriate
    
*   Easy to explain in technical interviews
    
*   Scalable without unnecessary complexity
    

2\. Architecture Goals
======================

The system follows these principles:

### Separation of Responsibilities

Each layer has a specific responsibility.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Routes     ↓  Controllers     ↓  Services     ↓  Models / External APIs   `

Controllers should not contain large amounts of business logic.

### User Data Isolation

Every email-related operation must be scoped to the authenticated user.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Authenticated User         ↓  userId         ↓  Database Query         ↓  Only User's Emails   `

This is especially important for the RAG system.

### Asynchronous Processing

Operations that may take significant time are moved to background workers.

Examples:

*   Gmail synchronization
    
*   AI email analysis
    
*   Embedding generation
    
*   Notifications
    

### Human-in-the-Loop AI

AI assists the user but does not independently perform high-impact actions.

For example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AI generates reply         ↓  User reviews         ↓  User edits if required         ↓  User clicks Send   `

The AI never automatically sends the email.

3\. High-Level Architecture
===========================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML                         `┌───────────────────────┐                           │       User            │                           │   Web Browser         │                           └───────────┬───────────┘                                       │                                       ▼                           ┌───────────────────────┐                           │   React + Vite        │                           │   Tailwind CSS        │                           │   Redux Toolkit       │                           └───────────┬───────────┘                                       │                           REST / Socket.IO                                       │                                       ▼                      ┌────────────────────────────────┐                      │       Node.js + Express        │                      │                                │                      │ Controllers / Services / Auth  │                      └───────┬─────────┬────────┬──────┘                              │         │        │               ┌──────────────┘         │        └──────────────┐               │                        │                       │               ▼                        ▼                       ▼      ┌─────────────────┐      ┌─────────────────┐     ┌─────────────────┐      │ MongoDB Atlas    │      │ Redis + BullMQ  │     │ Gmail API       │      │                 │      │                 │     │                 │      │ Users           │      │ Email Sync      │     │ Gmail OAuth     │      │ Emails          │      │ AI Processing   │     │ Emails          │      │ Drafts          │      │ Notifications   │     │ Drafts          │      │ AI Results      │      │                 │     │ Sending         │      │ Embeddings      │      └────────┬────────┘     └─────────────────┘      │ Vector Search   │               │      └────────┬────────┘               ▼               │                ┌─────────────────┐               │                │ Background      │               │                │ Workers         │               │                └────────┬────────┘               │                         │               └──────────────┬──────────┘                              ▼                     ┌─────────────────────┐                     │     AI Layer       │                     │                     │                     │ Gemini / OpenAI     │                     │ Embeddings          │                     │ RAG                 │                     └─────────────────────┘`

4\. Application Layers
======================

SmartMail AI is organized into the following logical layers.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Presentation Layer          ↓  API Layer          ↓  Business Logic Layer          ↓  Data / Integration Layer          ↓  Infrastructure   `

4.1 Presentation Layer
----------------------

Technology:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   React  Vite  Tailwind CSS  Redux Toolkit  React Router  Axios  Socket.IO Client   `

Responsibilities:

*   Render UI
    
*   Collect user input
    
*   Display email data
    
*   Display AI results
    
*   Manage client-side state
    
*   Handle navigation
    
*   Display notifications
    
*   Communicate with backend
    

The frontend does not directly communicate with:

*   MongoDB
    
*   Redis
    
*   Gmail using server credentials
    
*   AI API keys
    

All sensitive operations go through the backend.

5\. Frontend Architecture
=========================

Recommended structure:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   client/  └── src/      ├── components/      │   ├── common/      │   ├── email/      │   ├── ai/      │   └── layout/      │      ├── pages/      │   ├── Login.jsx      │   ├── Dashboard.jsx      │   ├── Inbox.jsx      │   ├── EmailDetails.jsx      │   ├── Compose.jsx      │   ├── AskInbox.jsx      │   ├── SecurityCenter.jsx      │   └── Settings.jsx      │      ├── store/      │   ├── store.js      │   └── slices/      │      ├── services/      │   ├── api.js      │   ├── emailApi.js      │   └── aiApi.js      │      ├── hooks/      ├── utils/      ├── App.jsx      └── main.jsx   `

5.1 Component Organization
--------------------------

### Common Components

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Button  Input  Modal  Dropdown  Badge  Toast  Spinner  ErrorMessage  EmptyState   `

### Email Components

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   EmailRow  EmailList  EmailHeader  EmailBody  EmailToolbar  ReplyBox  DraftEditor   `

### AI Components

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AISummary  AIReplyPanel  AIWriter  AIRewriter  AICheck  PriorityBadge  MeetingCard  PhishingWarning  RAGSourceCard   `

### Layout Components

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Sidebar  TopBar  PageContainer  ProtectedRoute  NotificationPanel  ProfileMenu   `

6\. Backend Architecture
========================

The backend uses:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Node.js  Express.js  MongoDB  Mongoose  Redis  BullMQ  Socket.IO   `

Recommended structure:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   server/  └── src/      ├── config/      │   ├── db.js      │   ├── env.js      │   └── redis.js      │      ├── controllers/      │   ├── auth.controller.js      │   ├── email.controller.js      │   ├── ai.controller.js      │   └── rag.controller.js      │      ├── routes/      │   ├── auth.routes.js      │   ├── email.routes.js      │   ├── ai.routes.js      │   └── rag.routes.js      │      ├── models/      │   ├── User.js      │   ├── GmailAccount.js      │   ├── Email.js      │   ├── Draft.js      │   ├── RagChat.js      │   └── Notification.js      │      ├── services/      │   ├── ai.service.js      │   ├── summary.service.js      │   ├── reply.service.js      │   ├── writer.service.js      │   ├── rewriter.service.js      │   ├── priority.service.js      │   ├── meeting.service.js      │   ├── phishing.service.js      │   ├── aiCheck.service.js      │   ├── embedding.service.js      │   ├── rag.service.js      │   └── gmail.service.js      │      ├── queues/      │   ├── redisClient.js      │   ├── emailSync.queue.js      │   ├── aiProcessing.queue.js      │   └── notification.queue.js      │      ├── workers/      │   ├── emailSync.worker.js      │   ├── aiProcessing.worker.js      │   └── notification.worker.js      │      ├── middleware/      │   ├── auth.middleware.js      │   ├── validation.middleware.js      │   └── error.middleware.js      │      ├── utils/      └── app.js   `

7\. Request Lifecycle
=====================

A normal API request follows:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   React    ↓  Axios    ↓  Express Router    ↓  Authentication Middleware    ↓  Validation Middleware    ↓  Controller    ↓  Service    ↓  MongoDB / Redis / External API    ↓  Controller    ↓  JSON Response    ↓  React   `

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   GET /api/emails        ↓  auth.middleware.js        ↓  email.controller.js        ↓  email.service.js        ↓  Email.find({ userId })        ↓  MongoDB        ↓  Response   `

8\. Authentication Architecture
===============================

Google OAuth 2.0 is used for Gmail authorization.

High-level flow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User   ↓  Connect Gmail   ↓  Backend generates Google OAuth URL   ↓  Google Login   ↓  User grants permission   ↓  Google redirects to callback   ↓  Backend receives authorization code   ↓  Backend exchanges code for tokens   ↓  Account information stored securely   ↓  Gmail API becomes available   `

Application authentication can use:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   JWT  +  HTTP-only Cookie   `

The frontend should not store authentication tokens in local storage.

9\. Gmail Integration Architecture
==================================

The backend is responsible for Gmail communication.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   React    ↓  Express API    ↓  Gmail Service    ↓  Gmail API   `

Operations include:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Fetch emails  Fetch threads  Send email  Create draft  Update draft  Read labels  Sync inbox   `

Gmail credentials and OAuth secrets remain server-side.

10\. Email Synchronization Architecture
=======================================

Email synchronization should not block the API request.

Flow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User clicks Sync         ↓  POST /api/emails/sync         ↓  Backend creates sync job         ↓  Redis/BullMQ         ↓  Email Sync Worker         ↓  Gmail API         ↓  Normalize Email         ↓  MongoDB         ↓  AI Processing Queue   `

This architecture prevents large synchronization tasks from keeping an HTTP request open.

11\. AI Processing Architecture
===============================

AI analysis can be performed asynchronously after emails are synchronized.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   New Email     ↓  MongoDB     ↓  AI Processing Queue     ↓  AI Worker     ├── Summary     ├── Priority     ├── Meeting Detection     ├── Phishing Detection     └── Embedding            ↓        MongoDB   `

AI results are stored with the email.

12\. AI Service Architecture
============================

The AI layer should be modular.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ai.service.js        │        ├── summary.service.js        ├── reply.service.js        ├── writer.service.js        ├── rewriter.service.js        ├── priority.service.js        ├── meeting.service.js        ├── phishing.service.js        ├── aiCheck.service.js        └── embedding.service.js   `

This prevents one large AI service from becoming difficult to maintain.

13\. AI Request Flow
====================

Example: Email Summary

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User clicks "Summarize"          ↓  POST /api/ai/summary          ↓  Authentication          ↓  Validate email ID          ↓  Verify email ownership          ↓  Fetch email/thread          ↓  Build AI prompt          ↓  Gemini / OpenAI          ↓  Parse structured response          ↓  Return summary          ↓  React displays summary   `

14\. AI Reply Architecture
==========================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Current Email       +  Thread Context       +  Selected Tone       +  User Instructions            ↓        AI Service            ↓       LLM Provider            ↓   Generated Reply            ↓   Editable UI            ↓   User Review            ↓   Save Draft / Send   `

The AI never directly triggers the final send operation.

15\. AI Writer Architecture
===========================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User Instruction        ↓  Example:  "Write a professional leave request"        ↓  AI Writer Service        ↓  LLM        ↓  Subject + Body        ↓  User Review        ↓  Insert into Composer   `

16\. AI Rewriter Architecture
=============================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Original Text        +  Rewrite Mode        ↓  AI Rewriter        ↓  LLM        ↓  Rewritten Text        ↓  Original vs Rewritten        ↓  User Accepts / Rejects   `

The rewrite operation should preserve:

*   Intent
    
*   Facts
    
*   Names
    
*   Dates
    
*   Numbers
    
*   Requests
    

17\. Priority Detection Architecture
====================================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Email   ↓  Priority Service   ↓  LLM / Rule-Based Signals   ↓  Priority   ↓  Reason   ↓  MongoDB   `

Possible values:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   CRITICAL  HIGH  MEDIUM  LOW   `

Example result:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "priority": "HIGH",    "reason": "Email contains a deadline and requires a response."  }   `

Users can manually override AI-generated priority.

18\. Meeting Detection Architecture
===================================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Email   ↓  Meeting Service   ↓  AI Analysis   ↓  Meeting Detected?   ↓  Extract Information   ↓  MongoDB   `

Possible fields:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   title  date  time  timezone  location  meetingLink  participants   `

No automatic calendar creation is required in v1.

19\. Phishing Detection Architecture
====================================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Email   ↓  Phishing Service   ↓  Analyze:      Sender      Domain      Links      Urgency      Requests      Attachments      Impersonation   ↓  Risk Classification   ↓  Reasons   ↓  MongoDB   ↓  UI Warning   `

Risk levels:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   SAFE  SUSPICIOUS  HIGH_RISK   `

The system should communicate that this is an AI assessment and not a guaranteed security verdict.

20\. AI Check Architecture
==========================

AI Check runs before sending.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Compose Email        ↓  AI Check        ↓  Grammar  Tone  Clarity  Recipients  Attachments  Sensitive Information  Professionalism        ↓  Issues + Suggestions        ↓  User Review        ↓  Apply / Ignore        ↓  Send   `

The user always controls the final send action.

21\. RAG Architecture
=====================

Ask My Inbox
------------

Ask My Inbox uses a custom Retrieval-Augmented Generation pipeline.

No LangChain or LangGraph is required.

21.1 Email Ingestion
--------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Gmail API      ↓  Email Sync Worker      ↓  Normalize Email      ↓  MongoDB      ↓  Embedding Service      ↓  Embedding API      ↓  Vector      ↓  MongoDB Atlas   `

21.2 User Query
---------------

Example:

> What emails require my attention this week?

Flow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User Question        ↓  RAG API        ↓  Generate Query Embedding        ↓  MongoDB Atlas Vector Search        ↓  Retrieve Relevant Emails        ↓  Filter by userId        ↓  Build Context        ↓  LLM        ↓  Answer        ↓  Source Emails        ↓  React   `

22\. RAG Context Construction
=============================

Retrieved documents should be converted into a controlled context.

Conceptually:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Email 1  Sender: John Smith  Subject: Project Review  Date: October 5  Content: ...  Email 2  Sender: Sarah Lee  Subject: Documentation Request  Date: October 4  Content: ...   `

The AI receives only the relevant retrieved context.

Avoid sending the entire inbox to the model.

23\. RAG Security
=================

RAG must always enforce user ownership.

Conceptually:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Authenticated userId          ↓  Vector Search Filter          ↓  Only documents belonging to userId   `

The system must never allow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User A   ↓  Retrieve   ↓  User B's emails   `

The userId check should happen at the retrieval layer and can also be validated after retrieval as defense in depth.

24\. RAG Source References
==========================

The RAG response should include source emails.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "answer": "You have 5 emails requiring attention this week.",    "sources": [      {        "emailId": "123",        "subject": "Project Review",        "sender": "John Smith"      },      {        "emailId": "456",        "subject": "Documentation Request",        "sender": "Sarah Lee"      }    ]  }   `

The frontend can display these as clickable source cards.

25\. Redis Architecture
=======================

Redis is used primarily for:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   BullMQ  Caching  Temporary processing state   `

MongoDB remains the source of truth.

Architecture:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Express     ↓  Redis     ↓  BullMQ     ↓  Workers   `

26\. BullMQ Architecture
========================

Three primary queues:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   email-sync  ai-processing  notifications   `

### Email Sync

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   API   ↓  email-sync queue   ↓  emailSync.worker.js   ↓  Gmail API   ↓  MongoDB   `

### AI Processing

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   MongoDB   ↓  ai-processing queue   ↓  aiProcessing.worker.js   ↓  AI Services   ↓  MongoDB   `

### Notifications

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AI Result   ↓  notification queue   ↓  notification.worker.js   ↓  Socket.IO   ↓  React   `

27\. Real-Time Architecture
===========================

Socket.IO is used for real-time updates.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Backend     ↓  Socket.IO Server     ↓  WebSocket Connection     ↓  React Socket.IO Client   `

Example event:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AI worker completes phishing analysis          ↓  Save result          ↓  Emit "email:phishing"          ↓  React receives event          ↓  Show notification   `

28\. Notification Flow
======================

Example: High Priority Email

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Gmail   ↓  Sync Worker   ↓  MongoDB   ↓  AI Processing Worker   ↓  Priority = HIGH   ↓  Notification Queue   ↓  Notification Worker   ↓  Socket.IO   ↓  React   ↓  Notification appears   `

29\. Database Architecture
==========================

Primary collections:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   users  gmailAccounts  emails  drafts  ragChats  notifications  userPreferences   `

29.1 Users
----------

Stores application-level user information.

Conceptually:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    _id,    name,    email,    passwordHash,    profileImage,    createdAt,    updatedAt  }   `

29.2 Gmail Accounts
-------------------

Stores information required to connect a user with Gmail.

Conceptually:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    _id,    userId,    email,    provider,    accessToken,    refreshToken,    tokenExpiry,    createdAt,    updatedAt  }   `

OAuth token storage must be handled securely.

29.3 Emails
-----------

Conceptually:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    _id,    userId,    gmailMessageId,    threadId,    sender: {      name,      email    },    recipients: [      {        name,        email      }    ],    subject,    body,    receivedAt,    labels: [],    isRead,    isStarred,    ai: {      summary,      priority,      priorityReason,      meetingDetected,      meeting: {        title,        date,        time,        timezone,        location,        meetingLink,        participants      },      phishingRisk,      phishingReasons    },    embedding,    createdAt,    updatedAt  }   `

30\. API Architecture
=====================

Authentication
--------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/auth/register  POST /api/auth/login  POST /api/auth/logout  GET  /api/auth/me   `

Gmail
-----

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   GET  /api/gmail/connect  GET  /api/gmail/callback  POST /api/emails/sync   `

Emails
------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   GET  /api/emails  GET  /api/emails/:id  POST /api/emails/send  POST /api/emails/draft  PUT  /api/emails/:id/read  PUT  /api/emails/:id/star   `

AI
--

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/ai/summary  POST /api/ai/reply  POST /api/ai/write  POST /api/ai/rewrite  POST /api/ai/priority  POST /api/ai/meeting  POST /api/ai/phishing  POST /api/ai/check   `

RAG
---

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/rag/chat  GET  /api/rag/history   `

31\. API Security Flow
======================

Every protected API follows:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   HTTP Request        ↓  CORS        ↓  Security Headers        ↓  Rate Limiter        ↓  Authentication        ↓  Authorization        ↓  Input Validation        ↓  Controller        ↓  Service   `

32\. Error Handling Architecture
================================

Use centralized error handling.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Controller      ↓  Service throws error      ↓  Express error middleware      ↓  Standard error response   `

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "success": false,    "message": "Unable to process the request."  }   `

Do not expose:

*   Stack traces in production
    
*   API keys
    
*   OAuth tokens
    
*   Database credentials
    
*   Full email content unnecessarily
    

33\. AI Error Handling
======================

AI APIs can fail or timeout.

The application should handle:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Timeout  Rate Limit  Invalid Response  Malformed JSON  Provider Error  Token Limit  Network Failure   `

Example flow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AI Request   ↓  Provider Error   ↓  Service catches error   ↓  Log safe diagnostic information   ↓  Return user-friendly message   `

The UI can display:

> "AI analysis is temporarily unavailable. Please try again."

34\. Background Job Failure Handling
====================================

Workers should support retry behavior for transient failures.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Job   ↓  Worker   ↓  Failure   ↓  Retry   ↓  Success   `

Permanent failures should be recorded for diagnosis rather than endlessly retried.

35\. Caching Strategy
=====================

Caching should be used selectively.

Potential cache candidates:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User preferences  Frequently requested metadata  Short-lived AI results where appropriate  Rate-limit state   `

Do not cache sensitive email data unnecessarily.

MongoDB remains the source of truth.

36\. Security Architecture
==========================

Security layers:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   HTTPS   ↓  CORS   ↓  Helmet   ↓  Rate Limiting   ↓  Authentication   ↓  Authorization   ↓  Validation   ↓  Database User Isolation   ↓  Secure External API Access   `

Important requirements:

*   Secrets only on backend
    
*   HTTP-only authentication cookies
    
*   Password hashing with bcrypt
    
*   Input validation
    
*   User-level authorization
    
*   Secure OAuth handling
    
*   No sensitive data in frontend environment variables
    
*   No sensitive data in logs
    

37\. Testing Architecture
=========================

Testing exists at multiple levels.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Unit Tests       ↓  Integration Tests       ↓  API Tests       ↓  Frontend Tests       ↓  E2E Tests   `

Unit
----

Test:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AI services  Utilities  Validators  RAG utilities  Embedding utilities   `

API
---

Use Supertest for:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Auth  Emails  Drafts  AI  RAG  Authorization  Validation   `

Integration
-----------

Important flows:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Gmail Sync → MongoDB → AI Processing   `

and:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Email → Embedding → Vector Search → RAG   `

External services should be mocked when appropriate.

Frontend
--------

Use React Testing Library for:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Login  Inbox  Email Details  Compose  AI Summary  AI Reply  AI Check  Ask My Inbox  Security Center   `

E2E
---

Use Playwright.

Main workflow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Login   ↓  Inbox   ↓  Open Email   ↓  Generate Summary   ↓  Generate Reply   ↓  Edit Reply   ↓  AI Check   ↓  Save Draft   `

RAG workflow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Login   ↓  Ask My Inbox   ↓  Ask Question   ↓  Retrieve Results   ↓  Display Answer   ↓  Display Sources   `

38\. Deployment Architecture
============================

Production architecture:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML                     `INTERNET                           │                           ▼                 ┌─────────────────┐                 │     Vercel      │                 │ React Frontend  │                 └────────┬────────┘                          │                          │ HTTPS                          ▼                 ┌─────────────────┐                 │     Render      │                 │ Node/Express API│                 └───────┬─┬───────┘                         │ │               ┌─────────┘ └──────────┐               ▼                      ▼        ┌──────────────┐       ┌──────────────┐        │ MongoDB Atlas│       │ Managed Redis│        │              │       │              │        │ Database     │       │ BullMQ       │        │ Vector Search│       │ Queues       │        └──────────────┘       └──────┬───────┘                                      │                                      ▼                               ┌──────────────┐                               │    Worker    │                               │    Render    │                               └──────┬───────┘                                      │                            ┌─────────┴─────────┐                            ▼                   ▼                     Gmail API             AI Provider`

39\. Deployment Responsibilities
================================

Vercel
------

Hosts:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   React application  Static assets  Frontend builds   `

Render
------

Hosts:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Express API  Background workers   `

MongoDB Atlas
-------------

Hosts:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Application database  Email data  AI analysis  Embeddings  Vector Search   `

Managed Redis
-------------

Hosts:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   BullMQ queues  Cache  Background job state   `

40\. Environment Separation
===========================

Use separate configurations for:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Development  Testing  Production   `

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   .env  .env.test  .env.production   `

Real secrets must never be committed to Git.

41\. Complete Data Flow — New Email
===================================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Gmail    ↓  Gmail API    ↓  Email Sync Worker    ↓  Normalize Email    ↓  MongoDB    ↓  AI Processing Queue    ↓  AI Worker    ├── Summary    ├── Priority    ├── Meeting    ├── Phishing    └── Embedding            ↓         MongoDB            ↓   Notification Queue            ↓   Notification Worker            ↓        Socket.IO            ↓          React   `

42\. Complete Data Flow — AI Reply
==================================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User opens email         ↓  React         ↓  POST /api/ai/reply         ↓  Auth         ↓  Ownership validation         ↓  Fetch email/thread         ↓  Reply Service         ↓  LLM         ↓  Generated Reply         ↓  React         ↓  User edits         ↓  Save Draft / Send   `

43\. Complete Data Flow — Ask My Inbox
======================================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User asks question          ↓  React          ↓  POST /api/rag/chat          ↓  Authentication          ↓  Generate Query Embedding          ↓  MongoDB Atlas Vector Search          ↓  User Ownership Filter          ↓  Relevant Emails          ↓  Context Builder          ↓  LLM          ↓  Answer + Sources          ↓  React          ↓  Display Answer          +  Source Email Cards   `

44\. Complete Data Flow — AI Check
==================================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User writes email          ↓  Click AI Check          ↓  POST /api/ai/check          ↓  AI Check Service          ↓  Analyze:      Grammar      Tone      Clarity      Recipients      Attachments      Sensitive Information          ↓  Issues + Suggestions          ↓  React          ↓  User Applies / Ignores          ↓  User Sends   `

45\. Architectural Non-Goals
============================

The first version intentionally does not include:

*   LangChain
    
*   LangGraph
    
*   Autonomous agents
    
*   Autonomous email sending
    
*   Outlook integration
    
*   Automatic calendar creation
    
*   Full CRM
    
*   Enterprise admin system
    
*   Voice assistant
    
*   Multimodal email analysis
    
*   Complex microservice architecture
    
*   AWS infrastructure
    

The application remains a modular monolith with background workers.

46\. Why Modular Monolith?
==========================

SmartMail AI does not need microservices at the initial stage.

The backend can remain one primary Node.js application while separating responsibilities into:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Controllers  Services  Workers  Queues  Models  Middleware   `

This provides:

*   Simpler development
    
*   Easier debugging
    
*   Easier deployment
    
*   Lower infrastructure complexity
    
*   Easier local development
    
*   Clear separation of responsibilities
    

Workers can still run independently when required.

47\. Scalability Strategy
=========================

If usage increases, individual parts can scale independently.

Current:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   React     ↓  Express     ↓  MongoDB + Redis     ↓  Workers   `

Future:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML                    `Load Balancer                           │                ┌──────────┼──────────┐                ▼          ▼          ▼              API 1      API 2      API 3                │          │          │                └──────────┼──────────┘                           │                       Redis                           │                ┌──────────┼──────────┐                ▼          ▼          ▼            Worker 1   Worker 2   Worker 3                           │                           ▼                     MongoDB Atlas`

This scaling path can be introduced only when necessary.

48\. Observability
==================

The application should provide basic operational visibility.

Monitor:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   API errors  AI failures  Queue failures  Worker failures  Database errors  Authentication failures  Request latency  AI response latency   `

Logs should contain useful diagnostic information without exposing:

*   Email bodies
    
*   OAuth tokens
    
*   Passwords
    
*   API keys
    
*   Sensitive user data
    

49\. Architecture Summary
=========================

SmartMail AI follows this architecture:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   React    +  Vite    +  Tailwind    +  Redux Toolkit         │         ▼  Node.js    +  Express    +  Socket.IO         │         ├──────────────► Gmail API         │         ├──────────────► Gemini / OpenAI         │         ├──────────────► MongoDB Atlas         │                    └── Vector Search         │         └──────────────► Redis                              └── BullMQ                                    └── Workers   `

The overall system can be summarized as:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   USER   ↓  REACT FRONTEND   ↓  EXPRESS REST API   ↓  SERVICES   ├── Gmail   ├── AI   ├── RAG   └── Email   ↓  MONGODB / REDIS   ↓  BACKGROUND WORKERS   ↓  AI PROCESSING   ↓  SOCKET.IO   ↓  REAL-TIME UI   `

The architecture intentionally balances **strong engineering concepts with practical project complexity**, making SmartMail AI suitable as a portfolio project while keeping its implementation understandable and interview-friendly.