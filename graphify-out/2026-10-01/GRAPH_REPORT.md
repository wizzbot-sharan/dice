# Graph Report - Dice_scaling copy  (2026-10-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 641 nodes · 1175 edges · 51 communities (31 shown, 20 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 133 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8cf93699`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- dashboard-server.js
- sync-daily-pipeline.js
- start-worker.js
- start-bot.js
- scripts
- map-client-record.js
- getClientPrefix
- due-work-ticker.js
- ref_node_assert
- dice-session.js
- browser.js
- createApplyQueue
- sendMessage
- apply-worker.js
- createWorkflowStateStore
- import-operators.js
- createPool
- devDependencies
- execute
- azure.js
- runLogin
- handleConversationMessage
- start-dashboard.js
- apply-queue.test.js
- .oxlintrc.json
- apply-timeout.test.js
- 009_create_dice_archived_jobs.sql
- job-scanner.js
- prevalidateJob
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- dice_applied_jobs
- dice_apply_queue
- dice_workflow_sessions
- lib_browser_usebrowserbase
- users_sharan_desktop_dice_scaling_copy_lib_apply_worker_startapplyworkers
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_applypromptdecision
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_randomminutes
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_sendjobprompt
- users_sharan_desktop_dice_scaling_copy_lib_browser_closebrowser
- users_sharan_desktop_dice_scaling_copy_lib_browser_closesharedbrowser
- users_sharan_desktop_dice_scaling_copy_lib_browser_maxconcurrent
- users_sharan_desktop_dice_scaling_copy_lib_browser_openbrowser
- users_sharan_desktop_dice_scaling_copy_lib_browser_usebrowserbase
- users_sharan_desktop_dice_scaling_copy_lib_job_scanner_getjobspendingpreflight
- users_sharan_desktop_dice_scaling_copy_lib_job_scanner_updatejobpreflightstatus

## God Nodes (most connected - your core abstractions)
1. `createPool()` - 23 edges
2. `getClientPrefix()` - 23 edges
3. `routeRequest()` - 22 edges
4. `resolveQuestionAnswer()` - 20 edges
5. `createApplyQueue()` - 19 edges
6. `sendMessage()` - 19 edges
7. `sendJson()` - 16 edges
8. `scripts` - 14 edges
9. `applyToJobOnPage()` - 12 edges
10. `fillCheckboxGroups()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `handleJobCallback()` --indirect_call--> `getClientIdForChat()`  [INFERRED]
  start-bot.js → lib/dice-session.js
- `handleJobCallback()` --indirect_call--> `saveAppliedJob()`  [INFERRED]
  start-bot.js → lib/job-application-db.js
- `applyToJobOnPage()` --calls--> `fillCurrentStep()`  [EXTRACTED]
  start-worker.js → lib/dice-apply-questions.js
- `sendOTPEmail()` --calls--> `sendEmail()`  [EXTRACTED]
  start-bot.js → lib/mailer.js
- `handleConversationMessage()` --calls--> `getSessionRow()`  [EXTRACTED]
  start-bot.js → lib/dice-session.js

## Import Cycles
- None detected.

## Communities (51 total, 20 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.05
Nodes (74): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), fillCheckboxGroups(), fillCurrentStep() (+66 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.07
Nodes (41): dependencies, axios, lucide-react, react, react-dom, react-router-dom, name, private (+33 more)

### Community 2 - "dashboard-server.js"
Cohesion: 0.10
Nodes (42): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+34 more)

### Community 3 - "sync-daily-pipeline.js"
Cohesion: 0.06
Nodes (32): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson(), getYesterdayDate() (+24 more)

### Community 4 - "start-worker.js"
Cohesion: 0.06
Nodes (35): closeSharedBrowser(), APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto (+27 more)

### Community 5 - "start-bot.js"
Cohesion: 0.06
Nodes (33): { applyPromptDecision }, azure, bot, { createDueWorkTicker }, createHttpServer(), { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore } (+25 more)

### Community 6 - "scripts"
Cohesion: 0.06
Nodes (33): dependencies, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright, playwright-core (+25 more)

### Community 7 - "map-client-record.js"
Cohesion: 0.15
Nodes (22): createServiceClient(), { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean(), asDate() (+14 more)

### Community 8 - "getClientPrefix"
Cohesion: 0.15
Nodes (21): applyPromptDecision(), sendJobPrompt(), isVisibleEnabled(), loadApplyProfile(), getClientIdForChat(), processDueChat(), applyQueue, azure (+13 more)

### Community 9 - "due-work-ticker.js"
Cohesion: 0.13
Nodes (17): { applyPromptDecision, sendJobPrompt, randomMinutes }, createDueWorkTicker(), persistWorkflowPatch(), start(), tick(), { createPool }, ENQUEUE_BATCH_CAP, { getClientPrefix } (+9 more)

### Community 10 - "ref_node_assert"
Cohesion: 0.17
Nodes (16): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), getAccessToken(), getAuthConfig() (+8 more)

### Community 11 - "dice-session.js"
Cohesion: 0.14
Nodes (15): azure, { createServiceClient }, { getClientPrefix }, getSessionRow(), readActiveSession(), storageStateIsValid(), lib_job_scanner_newday_lookback_ms, executeQueuedApply() (+7 more)

### Community 12 - "browser.js"
Cohesion: 0.18
Nodes (14): acquireBrowserTicket(), { chromium: localChromium }, closeBrowser(), getSharedBrowser(), maxConcurrent, openBrowser(), openLocalBrowser(), RECYCLE_THRESHOLD (+6 more)

### Community 13 - "createApplyQueue"
Cohesion: 0.13
Nodes (4): createApplyQueue(), claimNextJob(), { createPool }, users_sharan_desktop_dice_scaling_copy_lib_azure_createpool

### Community 14 - "sendMessage"
Cohesion: 0.18
Nodes (15): { Bot }, getBot(), { getClientPrefix }, sendMessage(), sendMessageWithButtons(), node-telegram-bot-api, audit(), beginSignIn() (+7 more)

### Community 15 - "apply-worker.js"
Cohesion: 0.18
Nodes (12): crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), crypto, { getClientPrefix, getJobDisplay } (+4 more)

### Community 16 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 17 - "import-operators.js"
Cohesion: 0.22
Nodes (11): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+3 more)

### Community 18 - "createPool"
Cohesion: 0.24
Nodes (12): countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs(), createPool(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion(), getAnswerForQuestion() (+4 more)

### Community 19 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom (+2 more)

### Community 20 - "execute"
Cohesion: 0.36
Nodes (5): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute()

### Community 21 - "azure.js"
Cohesion: 0.25
Nodes (6): parseColumns(), { Pool }, requireDatabaseUrl(), args, { createPool }, email

### Community 22 - "runLogin"
Cohesion: 0.25
Nodes (8): getSessionsPendingLogin(), saveSession(), audit(), randomDelay(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay(), waitRandom()

### Community 23 - "handleConversationMessage"
Cohesion: 0.32
Nodes (8): linkTelegramChat(), deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP(), verifyOTP()

### Community 24 - "start-dashboard.js"
Cohesion: 0.25
Nodes (6): { createDashboardServer }, { createPool }, dashboardPort, dashboardServer, pool, server

### Community 25 - "apply-queue.test.js"
Cohesion: 0.32
Nodes (6): acquire(), assert, { createApplyQueue }, mockTask(), release(), test

### Community 26 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 27 - "apply-timeout.test.js"
Cohesion: 0.33
Nodes (4): assert, { createApplyQueue }, { startApplyWorkers }, test

### Community 28 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 29 - "job-scanner.js"
Cohesion: 0.50
Nodes (3): { createPool }, readJobUrls(), updateJobPreflightStatus()

### Community 30 - "prevalidateJob"
Cohesion: 0.50
Nodes (4): acquirePreflight(), getJobName(), prevalidateJob(), releasePreflight()

## Knowledge Gaps
- **243 isolated node(s):** `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }`, `IGNORED_COLUMN_KEYS`, `INTENTS` (+238 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 317 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `sync-daily-pipeline.js`, `start-bot.js`, `scripts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `createApplyQueue()` connect `createApplyQueue` to `apply-queue.test.js`, `createPool`, `apply-timeout.test.js`, `start-worker.js`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }` to the rest of the system?**
  _243 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.053297199638663056 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06547619047619048 - nodes in this community are weakly interconnected._
- **Should `dashboard-server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09696969696969697 - nodes in this community are weakly interconnected._