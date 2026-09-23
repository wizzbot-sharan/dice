# Graph Report - Dice_scaling copy  (2026-09-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 596 nodes · 1120 edges · 38 communities (31 shown, 7 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 133 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7acab9b2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sync-daily-pipeline.js
- dice-apply-questions.js
- dashboard-server.js
- frontend/package.json
- scripts
- start-worker.js
- start-bot.js
- map-client-record.js
- browser.js
- resume-parser.js
- due-work-ticker.js
- dice-session.js
- createWorkflowStateStore
- createApplyQueue
- service-split.test.js
- sendMessage
- devDependencies
- createPool
- processDueChat
- apply-timeout.test.js
- execute
- executeQueuedApply
- handleConversationMessage
- start-dashboard.js
- apply-queue.test.js
- .oxlintrc.json
- azure.js
- sendMessage
- 009_create_dice_archived_jobs.sql
- due-work-ticker.test.js
- create-operator.js
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- re
- dice_apply_queue
- dice_workflow_sessions

## God Nodes (most connected - your core abstractions)
1. `createPool()` - 25 edges
2. `resolveQuestionAnswer()` - 20 edges
3. `routeRequest()` - 19 edges
4. `createApplyQueue()` - 18 edges
5. `scripts` - 14 edges
6. `sendJson()` - 13 edges
7. `sendMessage()` - 12 edges
8. `fillCheckboxGroups()` - 11 edges
9. `createWorkflowStateStore()` - 11 edges
10. `processDueChat()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `handleJobCallback()` --indirect_call--> `getClientIdForChat()`  [INFERRED]
  start-bot.js → lib/dice-session.js
- `handleJobCallback()` --indirect_call--> `saveAppliedJob()`  [INFERRED]
  start-bot.js → lib/job-application-db.js
- `processDueChat()` --indirect_call--> `audit()`  [INFERRED]
  lib/due-work-ticker.js → start-bot.js
- `processDueChat()` --indirect_call--> `sendMessage()`  [INFERRED]
  lib/due-work-ticker.js → start-bot.js
- `sendOTPEmail()` --calls--> `sendEmail()`  [EXTRACTED]
  start-bot.js → lib/mailer.js

## Import Cycles
- None detected.

## Communities (38 total, 7 thin omitted)

### Community 0 - "sync-daily-pipeline.js"
Cohesion: 0.05
Nodes (48): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens() (+40 more)

### Community 1 - "dice-apply-questions.js"
Cohesion: 0.08
Nodes (54): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), fillCheckboxGroups(), fillCurrentStep() (+46 more)

### Community 2 - "dashboard-server.js"
Cohesion: 0.07
Nodes (49): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+41 more)

### Community 3 - "frontend/package.json"
Cohesion: 0.07
Nodes (40): dependencies, axios, lucide-react, react, react-dom, react-router-dom, name, private (+32 more)

### Community 4 - "scripts"
Cohesion: 0.06
Nodes (33): dependencies, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright, playwright-core (+25 more)

### Community 5 - "start-worker.js"
Cohesion: 0.08
Nodes (32): closeSharedBrowser(), isVisibleEnabled(), loadApplyProfile(), getSessionsPendingLogin(), APPLY_TIMEOUT_MINUTES, applyQueue, applyToJobOnPage(), audit() (+24 more)

### Community 6 - "start-bot.js"
Cohesion: 0.06
Nodes (30): { applyPromptDecision }, azure, { Bot }, { createDueWorkTicker }, createHttpServer(), { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore } (+22 more)

### Community 7 - "map-client-record.js"
Cohesion: 0.15
Nodes (22): createServiceClient(), { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean(), asDate() (+14 more)

### Community 8 - "browser.js"
Cohesion: 0.13
Nodes (19): crypto, { openBrowser, closeBrowser, useBrowserbase, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), acquireBrowserTicket(), { chromium: localChromium }, closeBrowser() (+11 more)

### Community 9 - "resume-parser.js"
Cohesion: 0.15
Nodes (20): calculateDurationYears(), clearResumeCache(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill() (+12 more)

### Community 10 - "due-work-ticker.js"
Cohesion: 0.17
Nodes (13): applyPromptDecision(), crypto, randomMinutes(), sendJobPrompt(), { applyPromptDecision, sendJobPrompt, randomMinutes }, { createPool }, { NEWDAY_LOOKBACK_MS }, SEND_SPACING_MS (+5 more)

### Community 11 - "dice-session.js"
Cohesion: 0.19
Nodes (11): azure, { createServiceClient }, getClientIdForChat(), saveSession(), applyQueue, azure, { createApplyQueue }, { createServiceClient } (+3 more)

### Community 12 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 13 - "createApplyQueue"
Cohesion: 0.15
Nodes (3): createApplyQueue(), countActiveQueueItems(), enqueueApplyJob()

### Community 14 - "service-split.test.js"
Cohesion: 0.18
Nodes (11): storageStateIsValid(), { createPool }, getJobsPendingPreflight(), lib_job_scanner_newday_lookback_ms, updateJobPreflightStatus(), getAnyValidStorageState(), runPreflightLoop(), assert (+3 more)

### Community 15 - "sendMessage"
Cohesion: 0.29
Nodes (11): audit(), beginSignIn(), handleCommand(), handleJobCallback(), handlePendingAnswerMessage(), persistWorkflowPatch(), processCallbackUpdate(), processMessageUpdate() (+3 more)

### Community 16 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom (+2 more)

### Community 17 - "createPool"
Cohesion: 0.39
Nodes (8): createPool(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion(), getAnswerForQuestion(), recordPendingAnswer(), savePendingQuestion(), createTelegramQuestionPrompt()

### Community 18 - "processDueChat"
Cohesion: 0.33
Nodes (8): createDueWorkTicker(), persistWorkflowPatch(), processDueChat(), start(), tick(), listDueWorkflowChats(), readJobUrls(), sendMessageWithButtons()

### Community 19 - "apply-timeout.test.js"
Cohesion: 0.25
Nodes (5): { createPool }, assert, { createApplyQueue }, { startApplyWorkers }, test

### Community 20 - "execute"
Cohesion: 0.39
Nodes (4): createQueryBuilder(), builder, buildWhere(), execute()

### Community 21 - "executeQueuedApply"
Cohesion: 0.36
Nodes (8): getSessionRow(), readActiveSession(), acquirePreflight(), executeQueuedApply(), getJobName(), prevalidateJob(), refreshLogin(), releasePreflight()

### Community 22 - "handleConversationMessage"
Cohesion: 0.32
Nodes (8): linkTelegramChat(), deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP(), verifyOTP()

### Community 23 - "start-dashboard.js"
Cohesion: 0.25
Nodes (6): { createDashboardServer }, { createPool }, dashboardPort, dashboardServer, pool, server

### Community 24 - "apply-queue.test.js"
Cohesion: 0.32
Nodes (6): acquire(), assert, { createApplyQueue }, mockTask(), release(), test

### Community 25 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 26 - "azure.js"
Cohesion: 0.40
Nodes (5): claimNextJob(), assertIdentifier(), parseColumns(), { Pool }, requireDatabaseUrl()

### Community 27 - "sendMessage"
Cohesion: 0.47
Nodes (5): { Bot }, getBot(), sendMessage(), sendMessageWithButtons(), node-telegram-bot-api

### Community 28 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 29 - "due-work-ticker.test.js"
Cohesion: 0.40
Nodes (4): ENQUEUE_BATCH_CAP, assert, { createDueWorkTicker, ENQUEUE_BATCH_CAP }, test

### Community 30 - "create-operator.js"
Cohesion: 0.50
Nodes (3): args, { createPool }, email

## Knowledge Gaps
- **228 isolated node(s):** `STOP_WORDS`, `assert`, `{ companyIsExcluded, jobMatchesProfile, roleMatchesJobTitle }`, `test`, `assert` (+223 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 282 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `sync-daily-pipeline.js`, `scripts`, `start-bot.js`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `createPool()` connect `createPool` to `sync-daily-pipeline.js`, `dashboard-server.js`, `start-worker.js`, `createApplyQueue`, `service-split.test.js`, `processDueChat`, `apply-timeout.test.js`, `execute`, `start-dashboard.js`, `azure.js`, `create-operator.js`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `STOP_WORDS`, `assert`, `{ companyIsExcluded, jobMatchesProfile, roleMatchesJobTitle }` to the rest of the system?**
  _228 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync-daily-pipeline.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05028248587570622 - nodes in this community are weakly interconnected._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07514124293785311 - nodes in this community are weakly interconnected._
- **Should `dashboard-server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._