# Graph Report - Dice_scaling copy  (2026-10-06)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 714 nodes · 1298 edges · 53 communities (31 shown, 22 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `44dd2572`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- dashboard-server.js
- sync-daily-pipeline.js
- scripts
- start-worker.js
- start-bot.js
- ref_node_assert
- resume-parser.js
- map-client-record.js
- due-work-ticker.js
- getClientPrefix
- job-application-db.js
- browser.js
- zoho-mail-reader.js
- createWorkflowStateStore
- import-operators.js
- createApplyQueue
- azure.js
- pending-answers.js
- sendMessage
- devDependencies
- applyToJobOnPage
- createPool
- execute
- handleConversationMessage
- start-dashboard.js
- apply-queue.test.js
- .oxlintrc.json
- 009_create_dice_archived_jobs.sql
- test-match.js
- create-operator.js
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- test-date.js
- test-regex.js
- clients_additional_info
- dice_applied_jobs
- dice_apply_queue
- dice_workflow_sessions
- lib_browser_usebrowserbase
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_applypromptdecision
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_randomminutes
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_sendjobprompt
- users_sharan_desktop_dice_scaling_copy_lib_browser_usebrowserbase
- users_sharan_desktop_dice_scaling_copy_lib_due_work_ticker_createdueworkticker
- users_sharan_desktop_dice_scaling_copy_lib_job_scanner_getjobspendingpreflight

## God Nodes (most connected - your core abstractions)
1. `createPool()` - 26 edges
2. `routeRequest()` - 22 edges
3. `resolveQuestionAnswer()` - 21 edges
4. `getClientPrefix()` - 21 edges
5. `sendMessage()` - 20 edges
6. `createApplyQueue()` - 19 edges
7. `sendJson()` - 16 edges
8. `applyToJobOnPage()` - 16 edges
9. `scripts` - 14 edges
10. `fillCheckboxGroups()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `applyToJobOnPage()` --calls--> `isVisibleEnabled()`  [EXTRACTED]
  start-worker.js → lib/dice-apply-questions.js
- `handleJobCallback()` --indirect_call--> `getClientIdForChat()`  [INFERRED]
  start-bot.js → lib/dice-session.js
- `handleJobCallback()` --indirect_call--> `saveAppliedJob()`  [INFERRED]
  start-bot.js → lib/job-application-db.js
- `run()` --calls--> `createPool()`  [EXTRACTED]
  scratch-migrate.js → lib/azure.js
- `handleJobCallback()` --indirect_call--> `sendMessage()`  [INFERRED]
  start-bot.js → lib/telegram-notify.js

## Import Cycles
- None detected.

## Communities (53 total, 22 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.07
Nodes (55): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), extractPreflightQuestions(), fillCheckboxGroups() (+47 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.07
Nodes (41): dependencies, axios, lucide-react, react, react-dom, react-router-dom, name, private (+33 more)

### Community 2 - "dashboard-server.js"
Cohesion: 0.09
Nodes (44): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+36 more)

### Community 3 - "sync-daily-pipeline.js"
Cohesion: 0.06
Nodes (33): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_crypto, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson() (+25 more)

### Community 4 - "scripts"
Cohesion: 0.05
Nodes (39): getS3Client(), hasAwsS3Config(), { S3Client, PutObjectCommand }, uploadScreenshot(), dependencies, @aws-sdk/client-s3, bcryptjs, dotenv (+31 more)

### Community 5 - "start-worker.js"
Cohesion: 0.05
Nodes (39): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile, readTotalStepCount, extractPreflightQuestions } (+31 more)

### Community 6 - "start-bot.js"
Cohesion: 0.05
Nodes (36): { applyPromptDecision }, azure, bot, { createDueWorkTicker }, createHttpServer(), { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore } (+28 more)

### Community 7 - "ref_node_assert"
Cohesion: 0.08
Nodes (30): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), lib_job_scanner_newday_lookback_ms, getAccessToken() (+22 more)

### Community 8 - "resume-parser.js"
Cohesion: 0.09
Nodes (32): calculateDurationYears(), clearResumeCache(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill() (+24 more)

### Community 9 - "map-client-record.js"
Cohesion: 0.11
Nodes (27): createServiceClient(), { createServiceClient }, run(), { createServiceClient }, run(), { createServiceClient }, fs, importRecords() (+19 more)

### Community 10 - "due-work-ticker.js"
Cohesion: 0.10
Nodes (23): applyPromptDecision(), collectAndSavePreflightAnswer(), { createPool }, crypto, { getClientPrefix, getJobDisplay }, randomMinutes(), { applyPromptDecision, sendJobPrompt, randomMinutes }, createDueWorkTicker() (+15 more)

### Community 11 - "getClientPrefix"
Cohesion: 0.16
Nodes (22): sendJobPrompt(), azure, { createServiceClient }, getClientIdForChat(), { getClientPrefix }, getSessionRow(), getSessionsPendingLogin(), linkTelegramChat() (+14 more)

### Community 12 - "job-application-db.js"
Cohesion: 0.10
Nodes (19): crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), applyQueue, azure (+11 more)

### Community 13 - "browser.js"
Cohesion: 0.17
Nodes (15): acquireBrowserTicket(), cancelIdleTimeout(), { chromium: localChromium }, closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openLocalBrowser(), RECYCLE_THRESHOLD (+7 more)

### Community 14 - "zoho-mail-reader.js"
Cohesion: 0.21
Nodes (14): closeBrowser(), openBrowser(), fs, getZohoSessionState(), loginToZohoAdmin(), { openBrowser, closeBrowser }, path, saveZohoSessionState() (+6 more)

### Community 15 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 16 - "import-operators.js"
Cohesion: 0.22
Nodes (11): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+3 more)

### Community 18 - "azure.js"
Cohesion: 0.22
Nodes (8): claimNextJob(), { createPool }, parseColumns(), { Pool }, requireDatabaseUrl(), { createPool }, run(), users_sharan_desktop_dice_scaling_copy_lib_azure_createpool

### Community 19 - "pending-answers.js"
Cohesion: 0.24
Nodes (10): { createPool }, findActivePendingQuestion(), getAnswerForQuestion(), recordPendingAnswer(), savePendingQuestion(), handleJobCallback(), handlePendingAnswerMessage(), persistWorkflowPatch() (+2 more)

### Community 20 - "sendMessage"
Cohesion: 0.27
Nodes (10): { Bot }, getBot(), { getClientPrefix }, sendMessage(), sendMessageWithButtons(), node-telegram-bot-api, beginSignIn(), handleCommand() (+2 more)

### Community 21 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom (+2 more)

### Community 22 - "applyToJobOnPage"
Cohesion: 0.20
Nodes (10): loadApplyProfile(), patchJobProof(), acquirePreflight(), applyToJobOnPage(), getJobName(), prevalidateJob(), randomDelay(), releasePreflight() (+2 more)

### Community 23 - "createPool"
Cohesion: 0.25
Nodes (8): countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs(), createPool(), { createPool }, readJobUrls(), updateJobPreflightStatus(), clearExpiredPendingQuestions()

### Community 24 - "execute"
Cohesion: 0.36
Nodes (5): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute()

### Community 25 - "handleConversationMessage"
Cohesion: 0.28
Nodes (9): audit(), deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP(), sendOTPEmail() (+1 more)

### Community 26 - "start-dashboard.js"
Cohesion: 0.25
Nodes (6): { createDashboardServer }, { createPool }, dashboardPort, dashboardServer, pool, server

### Community 27 - "apply-queue.test.js"
Cohesion: 0.32
Nodes (6): acquire(), assert, { createApplyQueue }, mockTask(), release(), test

### Community 28 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 29 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 30 - "test-match.js"
Cohesion: 0.40
Nodes (3): companyTokens, subjectTokens, titleTokens

### Community 31 - "create-operator.js"
Cohesion: 0.50
Nodes (3): args, { createPool }, email

## Knowledge Gaps
- **266 isolated node(s):** `INTENTS`, `LABELS`, `QUESTION_MAPPINGS`, `{ SKILL_ALIASES }`, `assert` (+261 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 357 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `sync-daily-pipeline.js`, `scripts`, `start-bot.js`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `createApplyQueue()` connect `createApplyQueue` to `azure.js`, `apply-queue.test.js`, `ref_node_assert`, `createPool`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `sendMessage()` (e.g. with `processDueChat()` and `telegram-notify.js`) actually correct?**
  _`sendMessage()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `INTENTS`, `LABELS`, `QUESTION_MAPPINGS` to the rest of the system?**
  _266 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07259528130671507 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06547619047619048 - nodes in this community are weakly interconnected._
- **Should `dashboard-server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08776595744680851 - nodes in this community are weakly interconnected._