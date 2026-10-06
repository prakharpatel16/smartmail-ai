SmartMail AI — Deployment Documentation
=======================================

1\. Deployment Overview
-----------------------

SmartMail AI uses a simple cloud deployment architecture designed for a production-ready portfolio project.

### Deployment Stack

ComponentPlatformFrontendVercelBackend APIRenderBackground WorkersRenderDatabaseMongoDB AtlasRedisRender Key Value / Managed RedisEmail ProviderGmail APIAI ProviderGoogle Gemini API / OpenAI APIReal-Time CommunicationSocket.IOSource ControlGitHub

High-level architecture:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML                         `USER                             │                             ▼                      ┌─────────────┐                      │   Vercel    │                      │   React     │                      │  Frontend   │                      └──────┬──────┘                             │ HTTPS                             ▼                      ┌─────────────┐                      │   Render    │                      │ Express API │                      └──────┬──────┘                             │                ┌────────────┼─────────────┐                │            │             │                ▼            ▼             ▼         MongoDB Atlas     Redis       AI Provider                │            │        Gemini/OpenAI                │            │                │          BullMQ                │            │                │            ▼                │       Render Worker                │            │                └────────────┼─────────────┐                             │             │                             ▼             ▼                        Gmail API      Socket.IO                                           │                                           ▼                                        Frontend`

2\. Production Architecture
===========================

The production system consists of:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Frontend     ↓  Vercel  Backend API     ↓  Render Web Service  Background Processing     ↓  Render Worker  Database     ↓  MongoDB Atlas  Queue / Cache     ↓  Redis  Email Integration     ↓  Gmail API  AI     ↓  Gemini / OpenAI   `

The architecture is intentionally a **modular monolith with background workers**, rather than multiple microservices.

3\. Deployment Requirements
===========================

Before deployment, the following should be available:

*   GitHub repository
    
*   Vercel account
    
*   Render account
    
*   MongoDB Atlas account
    
*   Redis instance
    
*   Google Cloud project
    
*   Gmail API enabled
    
*   Google OAuth credentials
    
*   AI API key
    

4\. Repository Structure
========================

Recommended repository:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   SmartMail-AI/  │  ├── client/  │   ├── src/  │   ├── public/  │   ├── package.json  │   └── vite.config.js  │  ├── server/  │   ├── src/  │   │   ├── config/  │   │   ├── controllers/  │   │   ├── middleware/  │   │   ├── models/  │   │   ├── queues/  │   │   ├── routes/  │   │   ├── services/  │   │   ├── utils/  │   │   ├── workers/  │   │   └── app.js  │   │  │   └── package.json  │  ├── README.md  ├── PRD.md  ├── FEATURES.md  ├── DATABASE.md  ├── API.md  ├── ARCHITECTURE.md  ├── SECURITY.md  ├── TECHSTACK.md  └── DEPLOYMENT.md   `

5\. Environment Separation
==========================

The project should maintain separate environments:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Development       ↓  Testing       ↓  Production   `

Each environment should have separate credentials where practical.

Never commit production secrets to GitHub.

6\. Environment Variables
=========================

Backend
-------

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   NODE_ENV=production  PORT=5000  MONGODB_URI=mongodb+srv://...  REDIS_URL=redis://...  JWT_SECRET=...  GOOGLE_CLIENT_ID=...  GOOGLE_CLIENT_SECRET=...  GOOGLE_REDIRECT_URI=https://your-api-domain.com/api/gmail/callback  GEMINI_API_KEY=...  OPENAI_API_KEY=...  CLIENT_URL=https://your-frontend-domain.vercel.app   `

Only configure the AI provider that the application actually uses.

For example, if Gemini is selected:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   GEMINI_API_KEY=...   `

There is no need to expose or configure an unused provider.

7\. Frontend Environment Variables
==================================

Frontend variables should contain only values safe to expose to the browser.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   VITE_API_URL=https://your-api-domain.com/api   `

Never put secrets in:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   VITE_*   `

because Vite frontend environment variables are bundled into client-side code.

Never expose:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   JWT_SECRET  GOOGLE_CLIENT_SECRET  GEMINI_API_KEY  OPENAI_API_KEY  MONGODB_URI  REDIS_URL   `

to the frontend.

8\. MongoDB Atlas Deployment
============================

MongoDB Atlas is the production database.

### Steps

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   MongoDB Atlas       ↓  Create Project       ↓  Create Cluster       ↓  Create Database User       ↓  Configure Network Access       ↓  Obtain Connection String       ↓  Add MONGODB_URI to Render   `

Example database:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   talentpulse   `

For SmartMail AI, a dedicated database name such as:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   smartmail   `

is recommended.

9\. MongoDB Database User
=========================

Create a dedicated database user for the application.

The credentials should:

*   Use a strong password.
    
*   Have only the permissions required by the application.
    
*   Never be committed to Git.
    
*   Never be exposed to the frontend.
    

The connection string should be stored in Render as:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   MONGODB_URI=...   `

10\. MongoDB Network Access
===========================

The backend must be able to connect to MongoDB Atlas.

Atlas network access should be configured according to the application's production networking requirements.

Avoid unnecessarily exposing the database.

Application traffic should go through:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Frontend     ↓  Backend     ↓  MongoDB   `

The browser should never connect directly to MongoDB.

11\. MongoDB Atlas Vector Search
================================

Ask My Inbox requires MongoDB Atlas Vector Search.

The emails.embedding field is used for semantic retrieval.

Conceptually:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Email   ↓  Embedding Model   ↓  Vector   ↓  MongoDB Atlas   ↓  Vector Search Index   `

The vector index must use dimensions compatible with the selected embedding model.

Example conceptual configuration:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "fields": [      {        "type": "vector",        "path": "embedding",        "numDimensions": 1536,        "similarity": "cosine"      }    ]  }   `

The exact dimension should be changed if a different embedding model is selected.

12\. Redis Deployment
=====================

Redis is required for:

*   BullMQ
    
*   Background jobs
    
*   Temporary cache
    
*   Job coordination
    

A managed Redis service should be used in production.

The recommended setup is:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Render    │    ├── Web Service    │    ├── Worker    │    └── Managed Redis   `

The API and worker should use the same Redis instance.

13\. Redis Configuration
========================

The backend receives the Redis connection through:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   REDIS_URL=...   `

The application should not hardcode Redis credentials.

Redis should not be publicly exposed unnecessarily.

14\. BullMQ Deployment
======================

BullMQ requires Redis.

The architecture is:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Express API       │       ▼     Redis       │       ▼     BullMQ       │       ▼   Worker Process   `

Main queues:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   email-sync  ai-processing  notifications   `

15\. Render Backend Deployment
==============================

Create a Render Web Service for the backend.

### Source

Connect the GitHub repository.

### Root Directory

If the backend is located under:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   server/   `

set:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Root Directory: server   `

### Build Command

For a standard Node.js backend:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm install   `

or:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm ci   `

if a lockfile is committed.

### Start Command

For the API:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm start   `

The actual command must match the scripts section in server/package.json.

16\. Backend Package Scripts
============================

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "scripts": {      "start": "node src/server.js",      "worker": "node src/workers/index.js",      "dev": "nodemon src/server.js",      "test": "node --test"    }  }   `

The exact script names depend on the implementation.

17\. Worker Deployment
======================

Background workers should run separately from the HTTP API when possible.

Recommended Render setup:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Render  │  ├── SmartMail API  │     └── Express  │  └── SmartMail Worker        └── BullMQ Workers   `

Worker start command:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run worker   `

The worker should connect to:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   MongoDB Atlas  Redis  Gmail API  AI Provider   `

as required by its jobs.

18\. API + Worker Alternative
=============================

For a smaller deployment, API and worker processes can initially run on the same Render service if the project implementation supports this.

For example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   API Process       +  Worker Process   `

However, separate Render services are preferable because:

*   Workers can restart independently.
    
*   API traffic does not directly compete with worker processes.
    
*   Workers can scale independently.
    
*   Failures are easier to isolate.
    

19\. Health Check
=================

The backend should expose:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   GET /api/health   `

Example response:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "success": true,    "data": {      "status": "ok"    }  }   `

Render can use this endpoint for health monitoring.

A production health check should verify application availability without performing expensive operations.

20\. Vercel Frontend Deployment
===============================

The React/Vite frontend is deployed to Vercel.

### Configuration

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Framework:  Vite  Root Directory:  client  Build Command:  npm run build  Output Directory:  dist   `

The exact settings can be automatically detected by Vercel.

21\. Frontend Environment Variable
==================================

Vercel should contain:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   VITE_API_URL=https://your-render-api.onrender.com/api   `

After changing environment variables, the frontend must be redeployed.

22\. Frontend → Backend Communication
=====================================

Production flow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Browser     ↓ HTTPS  Vercel     ↓ HTTPS API request  Render Backend     ↓  MongoDB / Redis / Gmail / AI   `

The frontend should never communicate directly with:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   MongoDB  Redis  Gmail credentials  AI API   `

23\. CORS Configuration
=======================

The backend should allow requests from the production frontend.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cors({    origin: process.env.CLIENT_URL,    credentials: true  });   `

The production value should be:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   CLIENT_URL=https://your-frontend-domain.vercel.app   `

Avoid using unrestricted:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   *   `

when credentials are involved.

24\. Socket.IO Production Configuration
=======================================

Socket.IO runs through the backend service.

Architecture:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   React    │    │ WebSocket    ▼  Render Backend    │    ▼  Socket.IO   `

The backend should allow the production frontend origin.

User-specific rooms can be used:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   user:   `

This prevents notifications intended for one user from being broadcast to every connected user.

25\. Gmail OAuth Production Configuration
=========================================

Google OAuth requires production callback URLs.

Development:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   http://localhost:5000/api/gmail/callback   `

Production:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   https://your-api-domain.com/api/gmail/callback   `

The production callback URL must be configured in the Google Cloud project.

26\. Google Cloud Configuration
===============================

Required services/configuration:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Google Cloud Project         ↓  Gmail API         ↓  OAuth Consent Screen         ↓  OAuth Client         ↓  Authorized Redirect URI   `

The OAuth client should use the correct production backend callback.

27\. Gmail OAuth Flow in Production
===================================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User   ↓  Vercel Frontend   ↓  Render Backend   ↓  Google OAuth   ↓  User Consent   ↓  Google Callback   ↓  Render Backend   ↓  Encrypted Token Storage   ↓  Gmail Connected   `

OAuth secrets remain on the backend.

28\. Gmail API Considerations
=============================

The application must handle:

*   Access token expiration
    
*   Refresh tokens
    
*   API errors
    
*   Rate limits
    
*   Invalid permissions
    
*   Revoked access
    
*   Deleted messages
    
*   Synchronization failures
    

Workers should retry temporary Gmail API failures where appropriate.

29\. AI Provider Deployment
===========================

SmartMail AI can use:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Google Gemini API   `

or:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   OpenAI API   `

The API key must be stored only on the backend.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   GEMINI_API_KEY=...   `

AI requests should follow the application's security and privacy requirements.

30\. AI Request Flow
====================

Production AI request:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   React   ↓  Render API   ↓  Authentication   ↓  Authorization   ↓  AI Service   ↓  Gemini/OpenAI   ↓  AI Result   ↓  MongoDB   ↓  Response   `

For expensive/background operations:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   API   ↓  BullMQ   ↓  Redis   ↓  AI Worker   ↓  AI Provider   ↓  MongoDB   ↓  Socket.IO   ↓  Frontend   `

31\. Production RAG Deployment
==============================

Ask My Inbox uses:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   MongoDB Atlas  +  Atlas Vector Search  +  Embedding Model  +  LLM   `

Flow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User Question        ↓  Render API        ↓  Generate Query Embedding        ↓  Atlas Vector Search        ↓  User ID Filter        ↓  Relevant Emails        ↓  Context Construction        ↓  LLM        ↓  Answer + Sources        ↓  Frontend   `

32\. RAG Data Privacy
=====================

Only relevant email context should be sent to the AI provider.

The application should avoid:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Entire inbox → LLM   `

Instead:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Question     ↓  Relevant emails     ↓  Limited context     ↓  LLM   `

This reduces unnecessary data exposure and token usage.

33\. Production Security Configuration
======================================

The backend should use:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   HTTPS  Helmet  CORS  Rate Limiting  Input Validation  Authentication Middleware  Authorization Middleware  Secure Cookies  Environment Variables  Encrypted OAuth Credentials   `

Production configuration should also disable verbose development errors.

34\. Cookies
============

If JWT authentication uses HTTP-only cookies, production cookies should be configured appropriately.

Conceptually:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    httpOnly: true,    secure: true,    sameSite: "none"  }   `

The exact sameSite configuration depends on the frontend/backend deployment domains and authentication architecture.

CSRF protection should be considered when using cookie-based authentication.

35\. Secrets Management
=======================

Secrets must exist only in:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Render Environment Variables  Vercel Environment Variables  Local .env files   `

Never commit:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   .env  .env.production  credentials.json  OAuth client secrets  private keys  API keys  database passwords   `

to GitHub.

36\. .gitignore
===============

Recommended entries:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   node_modules/  .env  .env.*  !.env.example  dist/  coverage/  logs/  uploads/   `

The exact ignore rules should match the project requirements.

37\. Deployment Process
=======================

Recommended deployment workflow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Developer     ↓  Local Development     ↓  Run Tests     ↓  Git Commit     ↓  Git Push     ↓  GitHub     ↓  Vercel / Render     ↓  Build     ↓  Deploy     ↓  Health Check     ↓  Production   `

38\. Pre-Deployment Checklist
=============================

Before deployment, verify:

### Backend

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   □ Production start command works  □ API starts successfully  □ MongoDB connection works  □ Redis connection works  □ Workers start successfully  □ Health endpoint works  □ Environment variables configured  □ CORS configured  □ Authentication works   `

### Frontend

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   □ Production build succeeds  □ API URL configured  □ Routing works  □ Authentication works  □ Socket.IO connects  □ Loading/error states work   `

### Gmail

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   □ Gmail API enabled  □ OAuth consent configured  □ Production redirect URI configured  □ Gmail connection works  □ Token refresh works   `

### AI

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   □ AI API key configured  □ Summary works  □ Reply generation works  □ Writer works  □ Rewriter works  □ AI Check works  □ Priority detection works  □ Meeting detection works  □ Phishing detection works  □ RAG works   `

39\. Post-Deployment Verification
=================================

After deployment:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   1. Open frontend  2. Register/login  3. Connect Gmail  4. Synchronize inbox  5. Open an email  6. Generate AI summary  7. Generate reply  8. Test AI Writer  9. Test AI Rewriter  10. Run AI Check  11. Test priority detection  12. Test meeting detection  13. Test phishing detection  14. Ask a RAG question  15. Verify source emails  16. Test notifications  17. Test draft saving  18. Test sending   `

40\. Worker Verification
========================

Verify that:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Redis     ↓  BullMQ     ↓  Worker   `

is working correctly.

Test:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   New email   ↓  Sync job   ↓  Email stored   ↓  AI job   ↓  AI result stored   ↓  Notification   ↓  Socket event   `

If a job fails, verify that retry behavior works.

41\. Queue Failure Handling
===========================

Workers should handle temporary failures.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AI Job   ↓  AI Provider Error   ↓  Retry   ↓  Retry   ↓  Retry Limit   ↓  Failed Job   `

Permanent failures should not cause infinite retries.

Failed jobs should be observable through logs/monitoring.

42\. Deployment Failure Troubleshooting
=======================================

Failed to Fetch
---------------

Check:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Frontend VITE_API_URL  Backend URL  CORS  HTTPS  Render service status  API health endpoint  Browser console  Network tab   `

MongoDB Connection Failed
-------------------------

Check:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   MONGODB_URI  Atlas database user  Atlas network access  Database availability  Connection string   `

Redis Connection Failed
-----------------------

Check:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   REDIS_URL  Redis service status  Redis credentials  Region/network configuration  Worker logs  API logs   `

Gmail OAuth Failed
------------------

Check:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   GOOGLE_CLIENT_ID  GOOGLE_CLIENT_SECRET  GOOGLE_REDIRECT_URI  Google Cloud OAuth configuration  Authorized redirect URI  Gmail API   `

AI Feature Failed
-----------------

Check:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AI API key  AI provider availability  Backend logs  Request validation  Rate limits  Model configuration   `

Socket.IO Not Connecting
------------------------

Check:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Backend URL  CORS  Socket.IO client URL  HTTPS/WSS  Authentication  Production frontend origin   `

43\. Logging
============

Production logs should help diagnose:

*   API errors
    
*   Worker errors
    
*   Queue failures
    
*   Gmail synchronization errors
    
*   AI failures
    
*   Database connection problems
    

Do not log:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   OAuth tokens  Passwords  API keys  Full email bodies  Sensitive user information   `

Use structured logs where practical.

44\. Monitoring
===============

Monitor at minimum:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   API availability  Database connectivity  Redis connectivity  Worker health  Queue failures  AI API failures  Gmail sync failures  Request errors  Response latency   `

The /api/health endpoint can provide basic application health information.

45\. Scaling Strategy
=====================

The initial deployment can be:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   1 Vercel Frontend  1 Render API  1 Render Worker  1 MongoDB Atlas  1 Redis   `

As usage increases:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML             `┌── API Instance 1  Load Balancer┼── API Instance 2               └── API Instance 3               ┌── Worker 1  Redis/BullMQ ├── Worker 2               └── Worker 3`

MongoDB Atlas and Redis remain shared infrastructure.

46\. Worker Scaling
===================

Workers can be scaled independently based on queue load.

For example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Low traffic:  1 Worker  Medium traffic:  2 Workers  High traffic:  Multiple Workers   `

BullMQ coordinates jobs through Redis.

47\. Cost-Conscious Deployment
==============================

For a portfolio project, keep the architecture simple.

Recommended:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Vercel     ↓  Frontend  Render     ↓  API + Worker  MongoDB Atlas     ↓  Database  Managed Redis     ↓  Queues  Gemini/OpenAI     ↓  AI   `

Do not introduce Kubernetes, multiple microservices, or complex cloud infrastructure unless the project actually requires them.

48\. Production Data Flow
=========================

New Email
---------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Gmail   ↓  Render API   ↓  Redis/BullMQ   ↓  Email Sync Worker   ↓  MongoDB   ↓  AI Processing Worker   ↓  AI Provider   ↓  MongoDB   ↓  Notification Worker   ↓  Socket.IO   ↓  Vercel Frontend   `

User Generates Reply
--------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Vercel   ↓  Render API   ↓  Authentication   ↓  Email/Thread Retrieval   ↓  AI Reply Service   ↓  Gemini/OpenAI   ↓  Generated Reply   ↓  Vercel   ↓  User Reviews   ↓  Save Draft / Send   `

Ask My Inbox
------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Vercel   ↓  Render API   ↓  Query Embedding   ↓  MongoDB Atlas Vector Search   ↓  User-filtered Emails   ↓  Context Construction   ↓  LLM   ↓  Answer + Sources   ↓  Vercel   `

49\. Deployment Security Boundaries
===================================

The production system follows:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML                    `INTERNET                          │                          ▼                   Vercel Frontend                          │                      HTTPS only                          │                          ▼                   Render API                    │    │    │                    │    │    └── AI Provider                    │    │                    │    └────── Redis                    │                    └────────── MongoDB Atlas                           ▲                           │                    Render Worker`

MongoDB and Redis should never be directly accessible from the browser.

50\. Recommended Production Setup
=================================

For the initial SmartMail AI deployment:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Frontend  Vercel  │  └── React + Vite  Backend  Render Web Service  │  └── Node.js + Express + Socket.IO  Worker  Render Background Worker  │  └── BullMQ Workers  Database  MongoDB Atlas  │  └── SmartMail database  └── Vector Search  Redis  Managed Redis / Render Key Value  │  └── BullMQ + Cache  Email  Gmail API  AI  Gemini API   `

51\. Deployment Philosophy
==========================

SmartMail AI is intentionally deployed using managed services rather than manually managing infrastructure.

The goal is:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Simple  +  Secure  +  Reliable  +  Easy to deploy  +  Easy to explain  +  Easy to scale   `

The architecture avoids unnecessary infrastructure complexity while still demonstrating production concepts such as:

*   Cloud deployment
    
*   Environment configuration
    
*   OAuth
    
*   Managed databases
    
*   Redis
    
*   Background workers
    
*   Queues
    
*   Real-time communication
    
*   Vector search
    
*   AI integration
    
*   Automated testing
    
*   Security
    
*   Monitoring
    

52\. Final Deployment Architecture
==================================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML                           `USERS                               │                               ▼                      ┌─────────────────┐                      │     Vercel      │                      │ React + Vite    │                      └────────┬────────┘                               │                             HTTPS                               │                               ▼                      ┌─────────────────┐                      │     Render      │                      │ Express API     │                      │ Socket.IO       │                      └───────┬─────────┘                              │            ┌─────────────────┼──────────────────┐            │                 │                  │            ▼                 ▼                  ▼   ┌────────────────┐  ┌─────────────┐  ┌─────────────────┐   │ MongoDB Atlas  │  │    Redis    │  │  Gemini/OpenAI  │   │                │  │             │  │                 │   │ Users          │  │ BullMQ      │  │ Summary         │   │ Gmail Accounts │  │ Cache       │  │ Reply           │   │ Emails         │  │ Jobs        │  │ Writer          │   │ Drafts         │  │             │  │ Rewriter        │   │ RAG Chats      │  └──────┬──────┘  │ AI Check        │   │ Notifications  │         │         │ Priority        │   │ Preferences    │         │         │ Meeting         │   │ Embeddings     │         │         │ Phishing        │   └────────────────┘         │         └─────────────────┘            │                 │            │                 ▼            │        ┌─────────────────┐            │        │ Render Worker   │            │        │                 │            │        │ Email Sync      │            │        │ AI Processing   │            │        │ Notifications   │            │        └───────┬─────────┘            │                │            │                ▼            │          Gmail API            │            └────── Atlas Vector Search                           │                           ▼                     Ask My Inbox`

Final Production Stack
----------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Vercel     ↓  React + Vite  Render     ↓  Node.js + Express + Socket.IO  Render Worker     ↓  BullMQ  Redis     ↓  Queue + Cache  MongoDB Atlas     ↓  Persistent Data + Vector Search  Gmail API     ↓  Email Integration  Gemini/OpenAI     ↓  AI Features   `

This deployment architecture provides a practical production setup without introducing unnecessary cloud complexity.