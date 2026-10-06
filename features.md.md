SmartMail AI — Features Documentation
=====================================

1\. Product Overview
--------------------

**SmartMail AI** is an intelligent email management platform that connects with Gmail and helps users understand, write, organize, search, and secure their emails using AI.

The application combines:

*   MERN stack
    
*   Gmail API
    
*   Google OAuth 2.0
    
*   AI-powered email processing
    
*   RAG-based inbox search
    
*   MongoDB Atlas Vector Search
    
*   Redis
    
*   BullMQ
    
*   Socket.IO
    
*   Automated testing
    

The application has one primary goal:

> **Make email easier to understand and act on without taking control away from the user.**

AI assists the user, but the user always remains in control of email actions.

2\. Core Feature Categories
===========================

SmartMail AI is divided into the following feature groups:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   1. Gmail Integration  2. Email Management  3. AI Email Understanding  4. AI Writing Assistant  5. AI Email Security  6. Ask My Inbox — RAG  7. Real-Time Notifications  8. Background Processing  9. User Preferences  10. Authentication & Security  11. Testing & Reliability   `

3\. Gmail Integration
=====================

3.1 Google OAuth 2.0
--------------------

Users can connect their Gmail account using Google OAuth 2.0.

### Flow

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User   ↓  Connect Gmail   ↓  Google OAuth   ↓  User grants permissions   ↓  OAuth callback   ↓  Store encrypted credentials   ↓  Gmail connected   `

The application requests only the Gmail permissions required by the product.

3.2 Inbox Synchronization
-------------------------

Users can synchronize Gmail messages with SmartMail AI.

The synchronization process:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Gmail API   ↓  Email Sync Queue   ↓  BullMQ Worker   ↓  Normalize Email   ↓  MongoDB   ↓  AI Processing Queue   `

Synchronization should be idempotent so that the same Gmail message is not stored multiple times.

3.3 Incremental Sync
--------------------

After the initial synchronization, the application can use Gmail history information to detect changes.

Instead of repeatedly downloading the entire inbox:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Previous historyId         ↓  Gmail History API         ↓  Changed messages         ↓  Update MongoDB   `

This reduces unnecessary API calls and processing.

4\. Email Management
====================

4.1 Inbox
---------

The Inbox is the primary application screen.

Users can view:

*   Sender
    
*   Subject
    
*   Preview
    
*   Date/time
    
*   Read/unread status
    
*   Star status
    
*   Priority
    
*   Meeting indicator
    
*   Phishing indicator
    
*   AI processing status
    

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ---------------------------------------------------------  ★  Google Careers     Interview Invitation      HIGH     Your technical interview is scheduled...      Today  ---------------------------------------------------------  ○  Amazon             Application Update        MEDIUM     Thank you for applying...                     Yesterday  ---------------------------------------------------------   `

4.2 Email Details
-----------------

Users can open an email to view:

*   Complete email body
    
*   Sender
    
*   Recipients
    
*   Subject
    
*   Date
    
*   Attachments
    
*   Labels
    
*   Thread
    
*   AI analysis
    

AI actions are available directly from the email view.

4.3 Thread View
---------------

Related Gmail messages are grouped using the Gmail threadId.

Users can view:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Message 1     ↓  Reply     ↓  Reply     ↓  Latest message   `

This allows AI features such as Reply Generation to understand conversation context.

4.4 Search
----------

Users can search their inbox using normal email search.

Search can consider:

*   Sender
    
*   Subject
    
*   Content
    
*   Labels
    
*   Date
    
*   Read/unread
    
*   Starred
    
*   Priority
    

For semantic questions, users can use **Ask My Inbox**.

4.5 Filters
-----------

Users can filter emails by:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Unread  Starred  Important  High Priority  Meetings  Phishing Alerts   `

4.6 Sort
--------

Emails can be sorted by:

*   Newest
    
*   Oldest
    
*   Priority
    
*   Sender
    

4.7 Mark Read / Unread
----------------------

Users can mark messages as:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Read  Unread   `

4.8 Star Email
--------------

Users can star or unstar emails.

The application keeps the state synchronized with Gmail where supported.

4.9 Labels
----------

Users can view Gmail labels associated with their messages.

Labels can be used for:

*   Filtering
    
*   Organization
    
*   Search
    

5\. AI Email Summary
====================

SmartMail AI can summarize long or complex emails.

The summary focuses on:

*   Main points
    
*   Important information
    
*   Required actions
    
*   Deadlines
    
*   Dates
    
*   Decisions
    

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AI Summary  • Technical interview scheduled for Friday.  • Interview duration: 60 minutes.  • Candidate should join 10 minutes early.  • Resume and ID proof are required.   `

Users can:

*   Regenerate
    
*   Copy
    
*   Review
    

The summary is stored with the email when appropriate.

6\. AI Reply Generator
======================

Users can generate a reply based on the current email or conversation.

### Inputs

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Email / Thread         +  Tone         +  Optional instruction   `

Supported tones:

*   Professional
    
*   Friendly
    
*   Formal
    
*   Concise
    

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User instruction:  "Accept the interview and ask whether the meeting link  will be shared separately."  AI Reply:  Generated editable response   `

The user can:

*   Edit
    
*   Regenerate
    
*   Insert into composer
    
*   Save as draft
    
*   Send after review
    

### Important Rule

**AI never automatically sends the generated reply.**

7\. AI Email Writer
===================

AI Writer generates a new email from a natural-language instruction.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Prompt:  "Write a professional email requesting an extension  for submitting the project."          ↓  AI Writer  Subject:  Request for Project Submission Extension  Body:  Generated email...   `

Users can select a tone:

*   Professional
    
*   Friendly
    
*   Formal
    
*   Concise
    

Users can:

*   Edit
    
*   Regenerate
    
*   Insert
    
*   Save Draft
    
*   Send after review
    

8\. AI Email Rewriter
=====================

The Rewriter improves an existing draft without changing the user's intended message.

Supported modes:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Grammar  Professional  Concise  Friendly  Formal  Clarity   `

### Example

Original:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   I want to know that when you will send the meeting link.   `

Rewritten:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Could you please let me know when the meeting link  will be shared?   `

The AI should preserve:

*   Intent
    
*   Names
    
*   Dates
    
*   Numbers
    
*   Requests
    
*   Important facts
    

9\. AI Priority Detection
=========================

AI automatically classifies emails based on importance and urgency.

Priority levels:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   CRITICAL  HIGH  MEDIUM  LOW   `

The model considers factors such as:

*   Deadlines
    
*   Urgency
    
*   Required action
    
*   Meetings
    
*   Important senders
    
*   Financial notices
    
*   Response requirements
    

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   HIGH  Reason:  The sender requested a response before tomorrow.   `

Users can manually override the AI classification.

10\. AI Meeting Detection
=========================

SmartMail AI detects meeting-related information in emails.

It can extract:

*   Meeting title
    
*   Date
    
*   Time
    
*   Timezone
    
*   Location
    
*   Meeting link
    
*   Participants
    

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Meeting Detected  Technical Interview  October 10, 2026  10:00 AM IST  Google Meet   `

### Product Boundary

SmartMail AI does **not** automatically create calendar events.

The user remains responsible for deciding what to add to their calendar.

11\. AI Phishing Detection
==========================

The application analyzes emails for potential phishing indicators.

The model considers:

*   Sender/domain mismatch
    
*   Suspicious links
    
*   Credential requests
    
*   Financial requests
    
*   Urgency
    
*   Impersonation
    
*   Suspicious attachments
    
*   Social engineering patterns
    

Risk levels:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   SAFE  SUSPICIOUS  HIGH_RISK   `

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   HIGH RISK  Reasons:  • Sender domain appears inconsistent with the claimed company.  • Email requests account credentials.  • Message uses unusual urgency.   `

The UI should clearly communicate:

> **AI assessment — verify sensitive requests independently.**

AI phishing detection is not a replacement for a dedicated security product.

12\. AI Check
=============

AI Check is a pre-send quality and security review.

Before sending an email, the user can select:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AI Check   `

The system analyzes the draft.

12.1 Grammar Check
------------------

Detects:

*   Grammar errors
    
*   Spelling problems
    
*   Sentence issues
    

12.2 Tone Check
---------------

Checks whether the message sounds:

*   Professional
    
*   Friendly
    
*   Formal
    
*   Aggressive
    
*   Too casual
    
*   Unclear
    

12.3 Clarity Check
------------------

Identifies:

*   Ambiguous sentences
    
*   Long or confusing wording
    
*   Missing context
    
*   Unclear requests
    

12.4 Recipient Consistency
--------------------------

Checks whether the message content appears consistent with the selected recipients.

For example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Email body:  "Hi John"  Recipient:  Sarah@example.com   `

The system can flag a possible mismatch.

12.5 Missing Attachment Detection
---------------------------------

If the email contains phrases such as:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   "I've attached the report."  "Please find the document attached."   `

but no attachment exists, AI Check can warn the user.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ⚠ Missing attachment  Your email mentions "the attached report",  but no attachment has been added.   `

12.6 Sensitive Information Detection
------------------------------------

The system checks whether the draft contains potentially sensitive information.

Examples:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Passwords  API keys  Access tokens  Credit card information  Bank information  Sensitive identifiers   `

The system should warn rather than automatically modify or send the message.

12.7 Professionalism
--------------------

The system evaluates whether the message is suitable for professional communication.

It can identify:

*   Excessive slang
    
*   Aggressive wording
    
*   Unprofessional language
    
*   Excessive repetition
    

12.8 AI Check Result
--------------------

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AI CHECK  ✓ Grammar  ✓ Tone  ⚠ Clarity  ✓ Recipient  ⚠ Attachment  ✓ Sensitive information  ✓ Professionalism  Suggestions  --------------------------------  • Consider clarifying the deadline.  • The email mentions an attachment, but none is attached.   `

Available actions:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Apply Suggestions  Review  Ignore  Back to Editor   `

The user remains in control.

13\. Ask My Inbox — RAG
=======================

**Ask My Inbox** is the flagship semantic search feature.

Users can ask questions about their own inbox using natural language.

Examples:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   "What interviews do I have this week?"  "Which recruiters contacted me recently?"  "Show emails related to my project deadline."  "What tasks are waiting for my response?"  "Summarize my recent communication with John."   `

14\. RAG Pipeline
=================

SmartMail AI uses a custom/manual RAG pipeline.

It does not require LangChain or LangGraph.

### Ingestion

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Gmail   ↓  Email Normalization   ↓  MongoDB   ↓  Embedding Service   ↓  Vector Embedding   ↓  MongoDB Atlas Vector Search   `

### Query

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User Question   ↓  Query Embedding   ↓  Vector Search   ↓  User-filtered Emails   ↓  Relevant Context   ↓  LLM   ↓  Answer + Sources   `

15\. RAG Source References
==========================

Every RAG answer should provide source emails when possible.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Answer  You have two interviews scheduled this week.  Sources:  ┌───────────────────────────────────┐  │ Technical Interview Invitation    │  │ Google Careers                    │  │ Oct 8, 2026                       │  └───────────────────────────────────┘  ┌───────────────────────────────────┐  │ Final Interview Round             │  │ Example Company                   │  │ Oct 10, 2026                      │  └───────────────────────────────────┘   `

Users can click a source to open the original email.

16\. RAG Security
=================

The retrieval system must always enforce:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   authenticated userId   `

A user must only retrieve emails belonging to their own Gmail account.

The application must not send the entire inbox to the LLM.

Only relevant retrieved content should be included in the AI context.

17\. Compose Email
==================

The Compose interface provides:

*   To
    
*   CC
    
*   BCC
    
*   Subject
    
*   Email editor
    
*   Formatting
    
*   Attachments
    
*   Links
    
*   Emoji
    
*   Save Draft
    
*   Send
    

AI actions:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AI Write  AI Rewrite  AI Check   `

18\. Draft Management
=====================

Users can save unfinished emails as drafts.

Drafts can be:

*   Created
    
*   Updated
    
*   Edited
    
*   Deleted
    
*   Sent
    

AI-generated content can also be stored inside drafts.

The user can modify AI-generated text before sending.

19\. Real-Time Notifications
============================

SmartMail AI uses Socket.IO to provide real-time updates.

Example events:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   email:new  email:priority  email:meeting  email:phishing  ai:processing  ai:completed  notification:new   `

Example flow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   New Gmail Email        ↓  Worker        ↓  MongoDB        ↓  AI Processing        ↓  Notification        ↓  Socket.IO        ↓  React        ↓  UI Update   `

20\. Background Processing
==========================

Long-running operations are handled using BullMQ.

Main queues:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   email-sync  ai-processing  notifications   `

### Email Sync Queue

Handles:

*   Gmail synchronization
    
*   Email normalization
    
*   Database updates
    

### AI Processing Queue

Handles:

*   Summary
    
*   Priority
    
*   Meeting detection
    
*   Phishing detection
    
*   Embedding generation
    

### Notification Queue

Handles:

*   New email notifications
    
*   AI completion notifications
    
*   Priority alerts
    
*   Meeting alerts
    
*   Phishing alerts
    

21\. Redis
==========

Redis supports the asynchronous infrastructure.

Redis is used for:

*   BullMQ
    
*   Queue management
    
*   Temporary caching
    
*   Job coordination
    

Redis is not the primary database.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   MongoDB     ↓  Persistent data  Redis     ↓  Temporary / asynchronous infrastructure   `

22\. Authentication
===================

SmartMail AI supports secure authentication.

Possible authentication methods:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Email + Password  Google OAuth   `

For local authentication:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Password   ↓  bcrypt   ↓  Password Hash   ↓  MongoDB   `

For authenticated requests:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   JWT   ↓  HTTP-only Cookie   ↓  Authentication Middleware   ↓  User ID   `

23\. Authorization
==================

Authentication answers:

> Who is the user?

Authorization answers:

> What can this user access?

Every protected resource should verify ownership.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Email.findOne({    _id: emailId,    userId: req.user.id  });   `

This prevents cross-user email access.

24\. User Preferences
=====================

Users can configure:

### AI

*   Default reply tone
    
*   Default writer tone
    
*   Priority detection
    
*   Meeting detection
    
*   Phishing detection
    

### Notifications

*   New email notifications
    
*   Priority alerts
    
*   Meeting alerts
    
*   Phishing alerts
    

### Appearance

*   Theme
    

25\. Dashboard
==============

The dashboard provides a quick overview of inbox activity.

Example metrics:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Total Emails  Unread  High Priority  Meetings   `

Additional sections:

### Needs Your Attention

Shows:

*   High-priority emails
    
*   Emails requiring responses
    
*   Suspicious emails
    

### Upcoming Meetings

Shows detected meetings.

### AI Inbox Insights

Provides useful high-level information derived from recent email activity.

26\. Security Center
====================

The Security Center provides a dedicated view for suspicious emails.

Categories:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Safe  Suspicious  High Risk   `

Each alert includes:

*   Email
    
*   Risk level
    
*   Detection reasons
    
*   View Email
    
*   Mark as Reviewed
    

The page should emphasize that phishing results are AI assessments.

27\. Error and Loading States
=============================

Every major feature should support:

### Loading

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Analyzing email...  Generating reply...  Searching your inbox...  Syncing Gmail...   `

### Success

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AI analysis completed  Draft saved  Email sent  Gmail synchronized   `

### Error

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Unable to generate reply.  Please try again.   `

### Empty State

Examples:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   No emails found.  No suspicious emails detected.  No meetings found.  Ask a question about your inbox.   `

28\. AI Human-in-the-Loop Design
================================

SmartMail AI follows a human-in-the-loop approach.

AI can:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Analyze  Suggest  Generate  Rewrite  Classify  Retrieve  Warn   `

The user decides whether to:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Accept  Edit  Ignore  Regenerate  Save  Send   `

The AI should never autonomously send emails.

29\. AI Processing Architecture
===============================

A typical new email flow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   New Email     ↓  Gmail API     ↓  Email Sync Queue     ↓  Sync Worker     ↓  MongoDB     ↓  AI Processing Queue     ↓  AI Worker     ├── Summary     ├── Priority     ├── Meeting     ├── Phishing     └── Embedding     ↓  MongoDB     ↓  Notification Queue     ↓  Socket.IO     ↓  Frontend   `

30\. Testing Features
=====================

SmartMail AI includes automated testing across multiple levels.

Unit Testing
------------

Tests individual functions/services:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AI services  Validation  Authentication helpers  Embedding utilities  RAG utilities  Queue logic   `

API Testing
-----------

Using Supertest or equivalent tooling.

Tests:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Authentication  Email APIs  Draft APIs  AI APIs  RAG APIs  Authorization  Validation  Error handling   `

Frontend Testing
----------------

Using React Testing Library.

Tests:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Inbox  Compose  AI actions  Forms  Loading states  Error states  User interactions   `

End-to-End Testing
------------------

Using Playwright.

Important flows:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Login   ↓  Connect Gmail   ↓  View Inbox   ↓  Open Email   ↓  Generate Summary   ↓  Generate Reply   ↓  Edit Reply   ↓  Save Draft   `

Another flow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Open Ask My Inbox   ↓  Ask Question   ↓  Retrieve Emails   ↓  Display Answer   ↓  Open Source Email   `

31\. Security Testing
=====================

Automated tests should also verify:

*   Unauthorized access
    
*   Cross-user email access
    
*   RAG isolation
    
*   Invalid tokens
    
*   Invalid request data
    
*   Rate limiting
    
*   Socket user isolation
    
*   Queue authorization
    
*   Sensitive data handling
    

Example security test:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User A   ↓  Attempts to access   ↓  User B's Email ID   ↓  API   ↓  403 / 404   `

32\. Performance Features
=========================

SmartMail AI is designed to remain responsive even when AI operations take time.

Techniques include:

*   Background AI processing
    
*   BullMQ workers
    
*   Redis
    
*   MongoDB indexes
    
*   Pagination
    
*   Lightweight inbox responses
    
*   Vector search
    
*   Cached repeated requests where appropriate
    
*   Socket.IO real-time updates
    

33\. API Feature Groups
=======================

The backend is organized around feature-based API routes.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   /api/auth  /api/gmail  /api/emails  /api/ai  /api/rag  /api/notifications  /api/preferences  /api/health   `

34\. Feature-to-Technology Mapping
==================================

FeatureMain TechnologyGmail IntegrationGmail API + OAuthInboxReact + Express + MongoDBEmail SearchMongoDBThread ViewGmail Thread ID + MongoDBAI SummaryGemini/OpenAIAI ReplyGemini/OpenAIAI WriterGemini/OpenAIAI RewriterGemini/OpenAIPriority DetectionGemini/OpenAIMeeting DetectionGemini/OpenAIPhishing DetectionGemini/OpenAIAI CheckGemini/OpenAIAsk My InboxEmbeddings + Vector Search + LLMVector StorageMongoDB AtlasBackground JobsBullMQQueue InfrastructureRedisReal-Time UpdatesSocket.IOAuthenticationJWT + OAuthPassword SecuritybcryptAPI TestingSupertestFrontend TestingReact Testing LibraryE2E TestingPlaywright

35\. MVP Feature Set
====================

The first working version should prioritize:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   1. Authentication  2. Gmail OAuth  3. Inbox Sync  4. Inbox  5. Email Details  6. Thread View  7. Compose  8. Drafts  9. Send Email  10. AI Summary  11. AI Reply  12. AI Writer  13. AI Rewriter  14. AI Check  15. Priority Detection  16. Meeting Detection  17. Phishing Detection  18. Ask My Inbox  19. Redis + BullMQ  20. Socket.IO  21. Automated Tests   `

36\. Feature Prioritization
===========================

Priority 1 — Core Product
-------------------------

These features should receive the highest development and UI polish:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Inbox  Email Details  Compose  Ask My Inbox   `

These represent the primary product experience.

Priority 2 — AI & Security
--------------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   AI Summary  AI Reply  AI Writer  AI Rewriter  AI Check  Priority Detection  Meeting Detection  Phishing Detection  Security Center   `

Priority 3 — Supporting Features
--------------------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Dashboard  Settings  Notifications  Preferences  Advanced filtering   `

37\. Explicit Product Boundaries
================================

SmartMail AI intentionally does **not** include:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Autonomous email sending  Autonomous agents  LangChain/LangGraph  Outlook integration  Automatic calendar creation  AWS infrastructure  Voice assistant  Multimodal email analysis  Full CRM  Enterprise admin system  Complex microservices architecture   `

These boundaries keep the product focused and maintainable.

38\. Final Feature Architecture
===============================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML                         `SMARTMAIL AI                                │         ┌──────────────────────┼──────────────────────┐         │                      │                      │         ▼                      ▼                      ▼   Gmail Integration       Email Management        AI Assistant         │                      │                      │         │                 ┌────┼────┐          ┌──────┼──────┐         │                 │    │    │          │      │      │         ▼                 ▼    ▼    ▼          ▼      ▼      ▼   OAuth               Inbox Thread Draft     Summary Reply Writer   Sync                Search Compose         Rewrite Priority Meeting   Gmail API           Labels Send            Phishing AI Check         │                                      │         │                                      ▼         │                                  Ask Inbox         │                                      │         │                              Vector Search + RAG         │         └─────────────────────────────────────────────┐                                                       │                                                       ▼                                             Background Infrastructure                                                       │                                        ┌──────────────┼──────────────┐                                        ▼              ▼              ▼                                      Redis          BullMQ        Socket.IO                                        │              │              │                                        ▼              ▼              ▼                                     Cache          Workers       Real-time`

39\. Final Product Principle
============================

SmartMail AI is designed around one principle:

> **AI should make email easier to understand and act on, while the user remains in control.**

The product therefore combines:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Gmail    +  Email Management    +  AI Assistance    +  RAG    +  Security Analysis    +  Background Processing    +  Real-Time Updates    +  Automated Testing   `

into one focused email productivity platform.