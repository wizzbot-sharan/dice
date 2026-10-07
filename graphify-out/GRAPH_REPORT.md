# Graph Report - Dice_scaling copy  (2026-10-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 734 nodes · 1354 edges · 46 communities (25 shown, 21 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 150 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `58b66d8f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- browser.js
- frontend/package.json
- azure.js
- dice-apply-questions.js
- dashboard-server.js
- ref_node_assert
- due-work-ticker.js
- sync-daily-pipeline.js
- start-worker.js
- start-bot.js
- resume-parser.js
- scripts
- map-client-record.js
- getClientPrefix
- dice-session.js
- import-operators.js
- ticker.js
- sendMessage
- job-application-db.js
- runLogin
- handleConversationMessage
- 001_v2_tables.sql
- .oxlintrc.json
- 009_create_dice_archived_jobs.sql
- handleJobCallback
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- createHttpServer
- clients_additional_info
- dice_applied_jobs
- dice_applied_jobs_v2
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
1. `createPool()` - 29 edges
2. `routeRequest()` - 22 edges
3. `getClientPrefix()` - 21 edges
4. `resolveQuestionAnswer()` - 21 edges
5. `sendMessage()` - 20 edges
6. `createApplyQueue()` - 19 edges
7. `applyToJobOnPage()` - 16 edges
8. `sendJson()` - 16 edges
9. `scripts` - 15 edges
10. `closeBrowser()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `handleJobCallback()` --indirect_call--> `saveKnownAnswer()`  [INFERRED]
  start-bot.js → lib/unknown-questions.js
- `handleJobCallback()` --indirect_call--> `getClientIdForChat()`  [INFERRED]
  start-bot.js → lib/dice-session.js
- `handleJobCallback()` --indirect_call--> `saveAppliedJob()`  [INFERRED]
  start-bot.js → lib/job-application-db.js
- `handleJobCallback()` --indirect_call--> `sendMessage()`  [INFERRED]
  start-bot.js → lib/telegram-notify.js
- `handleJobCallback()` --indirect_call--> `getAnswerForQuestion()`  [INFERRED]
  start-bot.js → lib/pending-answers.js

## Import Cycles
- None detected.

## Communities (46 total, 21 thin omitted)

### Community 0 - "browser.js"
Cohesion: 0.06
Nodes (52): acquireBrowserTicket(), cancelIdleTimeout(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openBrowser() (+44 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.05
Nodes (51): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+43 more)

### Community 2 - "azure.js"
Cohesion: 0.05
Nodes (36): createApplyQueue(), claimNextJob(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs(), { createPool }, assertIdentifier(), createPool() (+28 more)

### Community 3 - "dice-apply-questions.js"
Cohesion: 0.08
Nodes (51): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), extractPreflightQuestions(), fillCheckboxGroups() (+43 more)

### Community 4 - "dashboard-server.js"
Cohesion: 0.08
Nodes (48): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+40 more)

### Community 5 - "ref_node_assert"
Cohesion: 0.07
Nodes (32): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), getAccessToken(), getAuthConfig() (+24 more)

### Community 6 - "due-work-ticker.js"
Cohesion: 0.07
Nodes (38): crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), applyPromptDecision(), collectAndSavePreflightAnswer() (+30 more)

### Community 7 - "sync-daily-pipeline.js"
Cohesion: 0.06
Nodes (32): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson(), getYesterdayDate() (+24 more)

### Community 8 - "start-worker.js"
Cohesion: 0.05
Nodes (38): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile, readTotalStepCount, extractPreflightQuestions } (+30 more)

### Community 9 - "start-bot.js"
Cohesion: 0.05
Nodes (35): { applyPromptDecision }, azure, bot, { createDueWorkTicker }, { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore }, crypto (+27 more)

### Community 10 - "resume-parser.js"
Cohesion: 0.09
Nodes (32): calculateDurationYears(), clearResumeCache(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill() (+24 more)

### Community 11 - "scripts"
Cohesion: 0.06
Nodes (35): dependencies, @aws-sdk/client-s3, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright (+27 more)

### Community 12 - "map-client-record.js"
Cohesion: 0.15
Nodes (22): createServiceClient(), { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean(), asDate() (+14 more)

### Community 13 - "getClientPrefix"
Cohesion: 0.20
Nodes (18): isVisibleEnabled(), loadApplyProfile(), readTotalStepCount(), getClientIdForChat(), getSessionRow(), readActiveSession(), hasHandledJob(), patchJobProof() (+10 more)

### Community 14 - "dice-session.js"
Cohesion: 0.15
Nodes (11): azure, { createServiceClient }, { getClientPrefix }, storageStateIsValid(), lib_job_scanner_newday_lookback_ms, assert, { NEWDAY_LOOKBACK_MS }, { storageStateIsValid } (+3 more)

### Community 15 - "import-operators.js"
Cohesion: 0.22
Nodes (11): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+3 more)

### Community 16 - "ticker.js"
Cohesion: 0.19
Nodes (11): users_sharan_desktop_dice_scaling_copy_v2_ticker_startticker, bootV2(), { startTicker }, { startWorkers }, { createPool }, runTicker(), startTicker(), V2_COOLDOWN_MAX (+3 more)

### Community 17 - "sendMessage"
Cohesion: 0.27
Nodes (10): { Bot }, getBot(), { getClientPrefix }, sendMessage(), sendMessageWithButtons(), node-telegram-bot-api, beginSignIn(), handleCommand() (+2 more)

### Community 18 - "job-application-db.js"
Cohesion: 0.22
Nodes (8): applyQueue, azure, { createApplyQueue }, { createServiceClient, createPool }, { getClientIdForChat }, { getClientPrefix, getJobDisplay }, users_sharan_desktop_dice_scaling_copy_lib_apply_queue_createapplyqueue, users_sharan_desktop_dice_scaling_copy_lib_dice_session_getclientidforchat

### Community 19 - "runLogin"
Cohesion: 0.25
Nodes (8): getSessionsPendingLogin(), saveSession(), audit(), randomDelay(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay(), waitRandom()

### Community 20 - "handleConversationMessage"
Cohesion: 0.32
Nodes (8): linkTelegramChat(), deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP(), verifyOTP()

### Community 21 - "001_v2_tables.sql"
Cohesion: 0.48
Nodes (6): dice_applied_jobs_v2, dice_apply_queue_v2, idx_applied_jobs_v2_applywizz_id, idx_applied_jobs_v2_status, idx_apply_queue_v2_applywizz_id, idx_apply_queue_v2_status

### Community 22 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 23 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 24 - "handleJobCallback"
Cohesion: 0.40
Nodes (5): audit(), handleJobCallback(), persistWorkflowPatch(), processCallbackUpdate(), sendOTPEmail()

## Knowledge Gaps
- **272 isolated node(s):** `{ chromium: localChromium }`, `RECYCLE_THRESHOLD`, `ticketWaiters`, `{ S3Client, PutObjectCommand }`, `fs` (+267 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 362 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `start-bot.js`, `scripts`, `sync-daily-pipeline.js`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `createPool()` connect `azure.js` to `browser.js`, `dashboard-server.js`, `due-work-ticker.js`, `sync-daily-pipeline.js`, `getClientPrefix`, `import-operators.js`, `ticker.js`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `sendMessage()` (e.g. with `processDueChat()` and `telegram-notify.js`) actually correct?**
  _`sendMessage()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ chromium: localChromium }`, `RECYCLE_THRESHOLD`, `ticketWaiters` to the rest of the system?**
  _272 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `browser.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0576271186440678 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05084745762711865 - nodes in this community are weakly interconnected._
- **Should `azure.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05201636469900643 - nodes in this community are weakly interconnected._