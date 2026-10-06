SmartMail AI — Technology Stack
===============================

1\. Overview
------------

**SmartMail AI** is a full-stack intelligent email assistant built around the **MERN stack**, Gmail integration, AI-powered email processing, RAG-based inbox search, Redis/BullMQ background processing, real-time notifications, and automated testing.

The project follows a **modular monolithic architecture** rather than a microservices architecture.

### Core Stack

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Frontend       → React + Vite  Language       → JavaScript (ES6+)  Styling        → Tailwind CSS  State          → Redux Toolkit  Backend        → Node.js + Express.js  API            → REST  Database       → MongoDB Atlas + Mongoose  Vector Search  → MongoDB Atlas Vector Search  AI             → Gemini API / OpenAI API  Embeddings     → Embedding Model API  Email          → Gmail API  Authentication → Google OAuth 2.0 + JWT + HTTP-only Cookies  Cache/Queue    → Redis + BullMQ  Realtime       → Socket.IO  Testing        → Node Test Runner/Jest + Supertest + RTL + Playwright  Deployment     → Vercel + Render + MongoDB Atlas + Managed Redis   `

2\. Technology Stack Architecture
=================================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ┌─────────────────────────────────────────────┐  │                  Frontend                   │  │                                             │  │ React + Vite + JavaScript + Tailwind CSS    │  │ Redux Toolkit + React Router + Axios        │  └──────────────────────┬──────────────────────┘                         │                         │ HTTPS / REST                         ▼  ┌─────────────────────────────────────────────┐  │                  Backend                    │  │                                             │  │ Node.js + Express.js + REST APIs            │  │ Authentication + Validation + Security      │  └───────────┬─────────────┬───────────────────┘              │             │              │             │              ▼             ▼       ┌────────────┐  ┌───────────────┐       │ MongoDB    │  │ AI Services   │       │ Atlas      │  │ Gemini/OpenAI  │       └─────┬──────┘  └───────────────┘             │             │ Vector Search             ▼       MongoDB Atlas       Vector Search             Backend                │         ┌──────┴───────┐         ▼              ▼      Redis          BullMQ         │              │         │              ▼         │           Workers         │         ▼     Socket.IO         │         ▼      Frontend   `

3\. Frontend Stack
==================

3.1 React
---------

**Technology:** React

React is used to build the user interface.

Major UI areas include:

*   Inbox
    
*   Email details
    
*   Compose
    
*   Dashboard
    
*   Ask My Inbox
    
*   Security Center
    
*   Settings
    
*   Authentication
    

React provides component-based architecture and makes the email interface easier to divide into reusable components.

3.2 Vite
--------

**Technology:** Vite

Vite is used as the frontend build tool and development server.

Responsibilities:

*   Fast local development
    
*   Hot Module Replacement
    
*   Production builds
    
*   Environment variable handling
    
*   Frontend bundling
    

Development server:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   http://localhost:5173   `

3.3 JavaScript ES6+
-------------------

**Language:** JavaScript

The frontend uses modern JavaScript features including:

*   const / let
    
*   Arrow functions
    
*   Destructuring
    
*   Spread/rest operators
    
*   Promises
    
*   async/await
    
*   Modules
    
*   Array methods
    
*   Optional chaining
    
*   Template literals
    

The project intentionally uses **JavaScript instead of TypeScript** to keep the stack consistent and easier to maintain for the current project scope.

3.4 Tailwind CSS
----------------

Tailwind CSS is used for styling.

It provides:

*   Utility-first styling
    
*   Responsive layouts
    
*   Consistent spacing
    
*   Typography
    
*   Responsive design
    
*   Component-level styling
    

The UI follows a clean SaaS design inspired by modern productivity applications.

The design avoids:

*   Excessive gradients
    
*   Neon effects
    
*   Excessive glassmorphism
    
*   Unnecessary animations
    
*   Overly complex dashboards
    

3.5 Redux Toolkit
-----------------

Redux Toolkit is used for global frontend state management.

Potential state areas:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   auth  emails  drafts  ai  notifications  preferences  ui   `

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Redux Store  │  ├── authSlice  ├── emailSlice  ├── draftSlice  ├── aiSlice  ├── notificationSlice  └── preferenceSlice   `

Redux is useful for maintaining consistent state across multiple email-related components.

3.6 React Router
----------------

React Router manages client-side navigation.

Main routes:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   /login  /dashboard  /inbox  /emails/:id  /compose  /ask-inbox  /security  /settings   `

Protected routes require authentication.

3.7 Axios
---------

Axios is used for HTTP communication between React and the Express backend.

Example flow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   React Component        ↓  API Service        ↓  Axios        ↓  Express REST API   `

Centralizing Axios configuration allows:

*   Base URL configuration
    
*   Credentials handling
    
*   Error handling
    
*   Request configuration
    
*   Response handling
    

3.8 Socket.IO Client
--------------------

Socket.IO Client provides real-time frontend updates.

Used for:

*   New email notifications
    
*   AI processing status
    
*   Priority updates
    
*   Meeting detection
    
*   Phishing alerts
    
*   General notifications
    

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Backend Worker        ↓  Socket.IO Server        ↓  Socket.IO Client        ↓  Redux/UI Update   `

4\. Backend Stack
=================

4.1 Node.js
-----------

Node.js is the runtime environment for the backend.

It is suitable for SmartMail AI because the application performs many I/O-heavy operations:

*   Gmail API requests
    
*   Database operations
    
*   AI API requests
    
*   Redis operations
    
*   Queue operations
    
*   WebSocket communication
    

Node.js's asynchronous I/O model allows the API server to handle these operations efficiently.

4.2 Express.js
--------------

Express.js is used as the backend web framework.

Responsibilities:

*   REST API routing
    
*   Middleware
    
*   Authentication
    
*   Validation
    
*   Error handling
    
*   Request/response processing
    

Basic architecture:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Request     ↓  Express     ↓  Middleware     ↓  Route     ↓  Controller     ↓  Service     ↓  Database / External API   `

5\. REST API
============

The backend exposes REST APIs for:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Authentication  Gmail  Emails  Drafts  AI  RAG  Notifications  Preferences  Health   `

Base API:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   /api   `

Examples:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/auth/login  GET  /api/emails  GET  /api/emails/:id  POST /api/ai/summary  POST /api/ai/reply  POST /api/ai/check  POST /api/rag/chat   `

6\. Database Stack
==================

6.1 MongoDB Atlas
-----------------

MongoDB Atlas is the primary database.

MongoDB is used because the application works with document-oriented data such as:

*   Emails
    
*   Threads
    
*   AI results
    
*   User preferences
    
*   Notifications
    
*   Gmail account information
    
*   RAG conversations
    

6.2 Mongoose
------------

Mongoose provides:

*   MongoDB schemas
    
*   Models
    
*   Validation
    
*   Query helpers
    
*   Middleware
    
*   Database abstraction
    

Main models:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User  GmailAccount  Email  Draft  RagChat  Notification  UserPreference   `

7\. MongoDB Atlas Vector Search
===============================

MongoDB Atlas Vector Search is used for the RAG system.

Email embeddings are stored alongside email data.

Example conceptual structure:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Email  │  ├── userId  ├── subject  ├── body  ├── sender  ├── receivedAt  └── embedding   `

When the user asks a question:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Question     ↓  Embedding     ↓  Vector Search     ↓  Relevant Emails     ↓  LLM     ↓  Answer   `

The vector search is always filtered by the authenticated user's userId.

8\. AI Stack
============

8.1 Gemini API / OpenAI API
---------------------------

SmartMail AI uses an external LLM API for intelligent email operations.

The provider can be configured through environment variables.

AI capabilities include:

*   Email summarization
    
*   Reply generation
    
*   Email writing
    
*   Email rewriting
    
*   Priority detection
    
*   Meeting detection
    
*   Phishing detection
    
*   AI Check
    
*   RAG answer generation
    

The AI provider is accessed from the backend.

API keys are never exposed to the frontend.

9\. AI Service Architecture
===========================

AI functionality is divided into separate services instead of putting all logic into one large controller.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   services/  │  ├── ai.service.js  ├── summary.service.js  ├── reply.service.js  ├── writer.service.js  ├── rewriter.service.js  ├── priority.service.js  ├── meeting.service.js  ├── phishing.service.js  ├── aiCheck.service.js  ├── embedding.service.js  └── rag.service.js   `

This makes each AI capability easier to:

*   Test
    
*   Modify
    
*   Debug
    
*   Replace
    
*   Scale independently
    

10\. Prompt Engineering
=======================

Prompt engineering is used to control AI behavior.

Prompts should specify:

*   Role
    
*   Input context
    
*   Required output
    
*   Constraints
    
*   Formatting
    
*   Safety requirements
    

For example, email rewriting must preserve:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Names  Dates  Numbers  Facts  Intent  Requests   `

The AI should improve wording without changing the meaning.

11\. Structured AI Outputs
==========================

AI responses should be returned in structured formats whenever possible.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "priority": "HIGH",    "reason": "The email contains a deadline."  }   `

Instead of relying on unstructured natural-language output.

This makes AI results easier for the backend and frontend to process.

12\. RAG Technology
===================

SmartMail AI implements **custom/manual RAG**.

The project does **not** use:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   LangChain  LangGraph  Autonomous Agents   `

The RAG pipeline is implemented directly using application services and APIs.

13\. RAG Pipeline
=================

Ingestion
---------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Gmail    ↓  Email Normalization    ↓  MongoDB    ↓  Embedding Service    ↓  Vector    ↓  MongoDB Atlas Vector Search   `

Query
-----

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User Question        ↓  Query Embedding        ↓  MongoDB Atlas Vector Search        ↓  User-specific Email Retrieval        ↓  Context Construction        ↓  LLM        ↓  Answer + Sources   `

14\. Gmail Integration
======================

Gmail API
---------

The Gmail API provides email functionality.

Used capabilities:

*   Inbox synchronization
    
*   Sent messages
    
*   Drafts
    
*   Email details
    
*   Threads
    
*   Search
    
*   Labels
    
*   Mark read/unread
    
*   Star/unstar
    
*   Send
    
*   Reply
    

The backend communicates with Gmail.

The frontend never directly handles Gmail OAuth credentials.

15\. Google OAuth 2.0
=====================

Google OAuth 2.0 is used to connect a user's Gmail account.

Flow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User   ↓  SmartMail AI   ↓  Google OAuth   ↓  User Consent   ↓  OAuth Callback   ↓  Backend   ↓  Gmail Account Connected   `

Sensitive OAuth credentials are stored securely on the backend.

16\. Authentication Stack
=========================

SmartMail AI can use:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   JWT  HTTP-only Cookies  bcrypt  Google OAuth 2.0   `

### JWT

Used for application authentication.

### HTTP-only Cookies

Used to reduce exposure of authentication tokens to client-side JavaScript.

### bcrypt

Used for securely hashing local account passwords.

### Google OAuth

Used for connecting Gmail.

These authentication mechanisms serve different purposes and should not be treated as interchangeable.

17\. Security Stack
===================

The backend uses standard web security practices.

### Helmet

Helps configure secure HTTP headers.

### CORS

Controls which frontend origins can communicate with the API.

### Rate Limiting

Protects:

*   Login
    
*   Registration
    
*   AI endpoints
    
*   RAG endpoints
    
*   Email sending
    
*   Gmail synchronization
    

### Input Validation

Protects APIs from malformed or unexpected data.

### Authorization

Ensures users can only access their own resources.

18\. Redis
==========

Redis is used for:

*   Caching
    
*   Queue infrastructure
    
*   Temporary processing state where appropriate
    

Redis is **not the source of truth**.

MongoDB remains the primary persistent database.

Architecture:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Application     │     ├── MongoDB → Source of Truth     │     └── Redis   → Cache / Queue Infrastructure   `

19\. BullMQ
===========

BullMQ provides background job processing using Redis.

Main queues:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   email-sync  ai-processing  notifications   `

### Email Sync

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Gmail API     ↓  email-sync queue     ↓  Email Sync Worker     ↓  MongoDB   `

### AI Processing

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Email     ↓  ai-processing queue     ↓  AI Worker     ↓  AI Services     ↓  MongoDB   `

### Notifications

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Event     ↓  notifications queue     ↓  Notification Worker     ↓  Socket.IO   `

20\. Background Workers
=======================

Workers handle expensive or long-running operations.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   workers/  │  ├── emailSync.worker.js  ├── aiProcessing.worker.js  └── notification.worker.js   `

This prevents expensive AI/Gmail operations from blocking normal API requests.

21\. Real-Time Technology
=========================

Socket.IO
---------

Socket.IO is used for real-time communication.

Important events:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   email:new  email:priority  email:meeting  email:phishing  ai:processing  ai:completed  notification:new   `

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AI Worker      ↓  MongoDB update      ↓  Socket.IO event      ↓  React      ↓  UI update   `

22\. Testing Stack
==================

Testing is an important part of SmartMail AI because the project is also intended to demonstrate **SDET/software testing skills**.

The testing strategy covers:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Unit Testing  Integration Testing  API Testing  Functional Testing  End-to-End Testing  Component Testing  Validation Testing  Authorization Testing  Error Handling Testing   `

23\. Node.js Test Runner / Jest
===============================

The backend can use either:

*   Node.js built-in Test Runner
    
*   Jest
    

The selected framework should be used consistently across the backend.

Unit tests cover:

*   AI service functions
    
*   Validation
    
*   Utility functions
    
*   Authentication helpers
    
*   RAG utilities
    
*   Queue-related logic
    

24\. Supertest
==============

Supertest is used for API testing.

It allows the application to be tested without manually starting the production server.

Example test areas:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/auth/login  GET /api/emails  POST /api/ai/summary  POST /api/ai/reply  POST /api/rag/chat  POST /api/emails/send   `

Important API tests include:

*   Valid requests
    
*   Invalid requests
    
*   Unauthorized requests
    
*   Forbidden requests
    
*   Not found responses
    
*   Error handling
    
*   Validation failures
    

25\. React Testing Library
==========================

React Testing Library is used for frontend component testing.

Test areas include:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Login  Inbox  Email Details  Compose  AI panels  Ask My Inbox  Security Center  Notifications  Loading states  Error states  Empty states   `

Tests should focus on user behavior rather than implementation details.

26\. Playwright
===============

Playwright is used for end-to-end testing.

### E2E Flow 1 — Email Workflow

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Login   ↓  Inbox   ↓  Open Email   ↓  Generate Summary   ↓  Generate Reply   ↓  Edit Reply   ↓  AI Check   ↓  Save Draft   `

### E2E Flow 2 — RAG

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Login   ↓  Ask My Inbox   ↓  Ask Question   ↓  Retrieve Relevant Emails   ↓  Generate Answer   ↓  Display Sources   `

External services such as Gmail and AI providers should be mocked or isolated in automated test environments where appropriate.

27\. Testing Pyramid
====================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML             `┌─────────────┐               │   E2E Tests │               │  Playwright │               └──────┬──────┘                      │               ┌──────▼──────┐               │ Integration │               │ / API Tests │               │  Supertest  │               └──────┬──────┘                      │            ┌─────────▼─────────┐            │    Unit Tests     │            │ Node Test/Jest    │            └───────────────────┘`

A larger number of fast unit tests should exist compared with slower E2E tests.

28\. Development Tools
======================

Recommended development tools:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   VS Code  Git  GitHub  npm  Postman / Thunder Client  MongoDB Compass  Chrome DevTools   `

### Postman / Thunder Client

Used for:

*   API development
    
*   API debugging
    
*   Request testing
    
*   Authentication testing
    
*   Error testing
    

### MongoDB Compass

Useful for:

*   Inspecting collections
    
*   Running MongoDB queries
    
*   Debugging documents
    
*   Checking indexes
    

29\. Version Control
====================

Git
---

Git is used for:

*   Source control
    
*   Branch management
    
*   Feature development
    
*   Version history
    
*   Collaboration
    

Typical workflow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   main   │   ├── feature/auth   ├── feature/gmail   ├── feature/ai   ├── feature/rag   └── feature/testing   `

30\. GitHub
===========

GitHub is used to host the source code and manage the repository.

Recommended repository structure:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   smartmail-ai/  │  ├── client/  ├── server/  ├── docs/  ├── tests/  ├── README.md  ├── PRD.md  ├── ARCHITECTURE.md  ├── API.md  └── TECHSTACK.md   `

31\. Environment Configuration
==============================

Environment variables are used for secrets and deployment-specific configuration.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   NODE_ENV=development  PORT=5000  MONGODB_URI=...  JWT_SECRET=...  GOOGLE_CLIENT_ID=...  GOOGLE_CLIENT_SECRET=...  GOOGLE_REDIRECT_URI=...  GEMINI_API_KEY=...  REDIS_URL=...  CLIENT_URL=http://localhost:5173   `

Secrets must never be committed to Git.

32\. Deployment Stack
=====================

Frontend
--------

**Vercel**

Used to deploy the React/Vite frontend.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   React + Vite        ↓  Vercel   `

Backend
-------

**Render**

Used to deploy the Node.js/Express backend.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Node.js + Express        ↓  Render   `

Workers
-------

Background workers can run through the deployment infrastructure alongside the backend, depending on the final Render service configuration.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   API Service       +  Worker Process       ↓  Render   `

For larger workloads, workers can later be separated into dedicated services.

Database
--------

**MongoDB Atlas**

Used as the production database.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Backend     ↓  MongoDB Atlas   `

Redis
-----

A managed Redis service such as Render Key Value can be used for production queue/cache infrastructure.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Backend     ↓  Managed Redis     ↓  BullMQ   `

33\. Production Architecture
============================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML                    `Internet                         │               ┌─────────▼─────────┐               │       Vercel      │               │ React Frontend    │               └─────────┬─────────┘                         │                       HTTPS                         │               ┌─────────▼─────────┐               │       Render      │               │ Express API       │               │ + Worker Process   │               └────┬─────┬────┬───┘                    │     │    │                    │     │    └──────────────┐                    │     │                   │                    ▼     ▼                   ▼               MongoDB   Redis             Gmail API                Atlas   + BullMQ                    │                    ▼             Atlas Vector Search                    │                    ▼                AI Provider`

34\. Why MERN?
==============

The MERN stack is appropriate because:

### React

Provides a component-based UI for a complex email client.

### Node.js

Handles I/O-heavy operations efficiently.

### Express

Provides a lightweight REST API framework.

### MongoDB

Works naturally with email documents and AI metadata.

The stack also allows JavaScript to be used across the frontend and backend.

35\. Why MongoDB?
=================

MongoDB fits the project because emails naturally contain nested structures.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Email  ├── sender  ├── recipients  ├── labels  ├── AI analysis  │   ├── summary  │   ├── priority  │   ├── meeting  │   └── phishing  └── embedding   `

A document-oriented database makes this structure straightforward to store.

MongoDB Atlas also provides vector search required for the RAG system.

36\. Why Redis + BullMQ?
========================

Without background processing:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Request   ↓  Gmail API   ↓  AI processing   ↓  Embedding   ↓  Database   ↓  Response   `

The request can become slow.

With BullMQ:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Request   ↓  Create Job   ↓  Fast API Response   ↓  Worker   ↓  Gmail / AI / Embedding   ↓  Database   `

This improves responsiveness and separates API traffic from expensive background work.

37\. Why Socket.IO?
===================

Polling the backend repeatedly is inefficient for real-time updates.

Instead:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Worker   ↓  Socket.IO   ↓  Frontend   `

The UI can immediately display:

*   New emails
    
*   AI completion
    
*   Priority changes
    
*   Meeting alerts
    
*   Phishing alerts
    
*   Notifications
    

38\. Why Custom RAG Instead of LangChain?
=========================================

The RAG implementation is intentionally kept custom.

Advantages:

*   Easier to understand
    
*   Fewer dependencies
    
*   More control over retrieval
    
*   Easier debugging
    
*   Better understanding of embeddings and vector search
    
*   Easier interview explanation
    

The application directly controls:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Embedding   ↓  Vector Search   ↓  Retrieval   ↓  Context Construction   ↓  LLM   `

39\. Technologies Explicitly Not Used
=====================================

The project intentionally does not use:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AWS  LangChain  LangGraph  Docker  Kubernetes  Microservices  Autonomous AI Agents  Outlook API  Automatic Calendar Creation   `

These are excluded to keep the project focused and explainable.

40\. Core Technology Summary
============================

CategoryTechnologyPurposeFrontendReactUIBuild ToolViteDevelopment/buildLanguageJavaScript ES6+Application developmentStylingTailwind CSSUI stylingStateRedux ToolkitGlobal stateRoutingReact RouterNavigationHTTPAxiosAPI communicationBackendNode.jsRuntimeFrameworkExpress.jsREST APIDatabaseMongoDB AtlasPersistent storageODMMongooseMongoDB interactionVector SearchMongoDB Atlas Vector SearchRAG retrievalAIGemini/OpenAI APIAI capabilitiesEmbeddingsEmbedding APISemantic searchEmailGmail APIGmail integrationOAuthGoogle OAuth 2.0Gmail authenticationAuthJWT + HTTP-only CookiesApplication authenticationPassword SecuritybcryptPassword hashingSecurityHelmetSecure headersSecurityCORSCross-origin controlSecurityRate LimitingAbuse protectionQueueBullMQBackground jobsCache/Queue InfraRedisQueue/cache backendRealtimeSocket.IOLive updatesBackend TestingNode Test Runner/JestUnit testingAPI TestingSupertestREST API testingFrontend TestingReact Testing LibraryComponent testingE2E TestingPlaywrightBrowser testingFrontend DeploymentVercelHostingBackend DeploymentRenderHostingDatabase HostingMongoDB AtlasProduction databaseRedis HostingManaged RedisQueue/cache infrastructureVersion ControlGitSource controlRepositoryGitHubCode hosting

41\. Final Stack
================

The final SmartMail AI stack can be summarized as:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Frontend  React  Vite  JavaScript ES6+  Tailwind CSS  Redux Toolkit  React Router  Axios  Socket.IO Client  Backend  Node.js  Express.js  REST APIs  Socket.IO  Database  MongoDB Atlas  Mongoose  MongoDB Atlas Vector Search  AI  Gemini API / OpenAI API  Embeddings  Prompt Engineering  Custom RAG  Email  Gmail API  Google OAuth 2.0  Infrastructure  Redis  BullMQ  Background Workers  Security  JWT  HTTP-only Cookies  bcrypt  Helmet  CORS  Rate Limiting  Input Validation  Authorization  Testing  Node Test Runner / Jest  Supertest  React Testing Library  Playwright  Deployment  Vercel  Render  MongoDB Atlas  Managed Redis  Version Control  Git  GitHub   `

42\. Technology Selection Philosophy
====================================

SmartMail AI intentionally uses technologies that provide a strong balance between:

*   Real-world relevance
    
*   Development speed
    
*   Maintainability
    
*   Scalability
    
*   Security
    
*   Testing
    
*   Interview explainability
    

The project avoids adding technologies simply to make the stack look larger.

The goal is to demonstrate a production-oriented understanding of:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Full-Stack Development          +  AI Integration          +  RAG          +  External API Integration          +  Background Processing          +  Real-Time Systems          +  Security          +  Automated Testing   `

This makes the project suitable for demonstrating **MERN development, backend engineering, AI integration, API development, and SDET/testing skills**.