# Graph Report - Dice_scaling copy  (2026-10-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 661 nodes · 1212 edges · 50 communities (30 shown, 20 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 141 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6d4ccd75`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- frontend/package.json
- dice-apply-questions.js
- dashboard-server.js
- sync-daily-pipeline.js
- start-bot.js
- ref_node_assert
- resume-parser.js
- due-work-ticker.js
- scripts
- start-worker.js
- map-client-record.js
- getClientPrefix
- browser.js
- createWorkflowStateStore
- import-operators.js
- createApplyQueue
- azure.js
- sendMessage
- createPool
- dice-session.js
- execute
- prevalidateJob
- handleJobCallback
- start-dashboard.js
- apply-queue.test.js
- handleConversationMessage
- .oxlintrc.json
- applyToJobOnPage
- runLogin
- 009_create_dice_archived_jobs.sql
- create-operator.js
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- dice_applied_jobs
- dice_apply_queue
- dice_workflow_sessions
- lib_browser_usebrowserbase
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_applypromptdecision
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_randomminutes
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_sendjobprompt
- users_sharan_desktop_dice_scaling_copy_lib_browser_usebrowserbase
- users_sharan_desktop_dice_scaling_copy_lib_dice_apply_questions_fillcurrentstep
- users_sharan_desktop_dice_scaling_copy_lib_dice_apply_questions_isvisibleenabled
- users_sharan_desktop_dice_scaling_copy_lib_dice_apply_questions_loadapplyprofile
- users_sharan_desktop_dice_scaling_copy_lib_due_work_ticker_createdueworkticker
- users_sharan_desktop_dice_scaling_copy_lib_job_scanner_getjobspendingpreflight

## God Nodes (most connected - your core abstractions)
1. `createPool()` - 24 edges
2. `getClientPrefix()` - 22 edges
3. `routeRequest()` - 22 edges
4. `resolveQuestionAnswer()` - 21 edges
5. `createApplyQueue()` - 20 edges
6. `sendMessage()` - 20 edges
7. `sendJson()` - 16 edges
8. `scripts` - 14 edges
9. `getClientIdForChat()` - 12 edges
10. `applyToJobOnPage()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `handleJobCallback()` --indirect_call--> `getClientIdForChat()`  [INFERRED]
  start-bot.js → lib/dice-session.js
- `handleJobCallback()` --indirect_call--> `saveAppliedJob()`  [INFERRED]
  start-bot.js → lib/job-application-db.js
- `handleJobCallback()` --indirect_call--> `sendMessage()`  [INFERRED]
  start-bot.js → lib/telegram-notify.js
- `handleJobCallback()` --indirect_call--> `saveKnownAnswer()`  [INFERRED]
  start-bot.js → lib/unknown-questions.js
- `prevalidateJob()` --calls--> `extractPreflightQuestions()`  [EXTRACTED]
  start-worker.js → lib/dice-apply-questions.js

## Import Cycles
- None detected.

## Communities (50 total, 20 thin omitted)

### Community 0 - "frontend/package.json"
Cohesion: 0.05
Nodes (51): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+43 more)

### Community 1 - "dice-apply-questions.js"
Cohesion: 0.08
Nodes (51): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), extractPreflightQuestions(), fillCheckboxGroups() (+43 more)

### Community 2 - "dashboard-server.js"
Cohesion: 0.10
Nodes (42): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+34 more)

### Community 3 - "sync-daily-pipeline.js"
Cohesion: 0.06
Nodes (34): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_crypto, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson() (+26 more)

### Community 4 - "start-bot.js"
Cohesion: 0.05
Nodes (38): { applyPromptDecision }, azure, bot, { createDueWorkTicker }, createHttpServer(), { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore } (+30 more)

### Community 5 - "ref_node_assert"
Cohesion: 0.08
Nodes (30): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), lib_job_scanner_newday_lookback_ms, getAccessToken() (+22 more)

### Community 6 - "resume-parser.js"
Cohesion: 0.09
Nodes (32): calculateDurationYears(), clearResumeCache(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill() (+24 more)

### Community 7 - "due-work-ticker.js"
Cohesion: 0.07
Nodes (31): crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), applyPromptDecision(), collectAndSavePreflightAnswer() (+23 more)

### Community 8 - "scripts"
Cohesion: 0.06
Nodes (32): dependencies, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright, playwright-core (+24 more)

### Community 9 - "start-worker.js"
Cohesion: 0.06
Nodes (31): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile, readTotalStepCount, extractPreflightQuestions } (+23 more)

### Community 10 - "map-client-record.js"
Cohesion: 0.15
Nodes (22): createServiceClient(), { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean(), asDate() (+14 more)

### Community 11 - "getClientPrefix"
Cohesion: 0.18
Nodes (17): sendJobPrompt(), getClientIdForChat(), processDueChat(), applyQueue, azure, { createApplyQueue }, { createServiceClient }, { getClientIdForChat } (+9 more)

### Community 12 - "browser.js"
Cohesion: 0.16
Nodes (14): acquireBrowserTicket(), { chromium: localChromium }, closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openLocalBrowser(), RECYCLE_THRESHOLD, releaseBrowserTicket() (+6 more)

### Community 13 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 14 - "import-operators.js"
Cohesion: 0.22
Nodes (11): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+3 more)

### Community 16 - "azure.js"
Cohesion: 0.20
Nodes (9): claimNextJob(), { createPool }, parseColumns(), { Pool }, requireDatabaseUrl(), { createPool }, readJobUrls(), updateJobPreflightStatus() (+1 more)

### Community 17 - "sendMessage"
Cohesion: 0.27
Nodes (10): { Bot }, getBot(), { getClientPrefix }, sendMessage(), sendMessageWithButtons(), node-telegram-bot-api, beginSignIn(), handleCommand() (+2 more)

### Community 18 - "createPool"
Cohesion: 0.29
Nodes (9): countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs(), createPool(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion(), recordPendingAnswer() (+1 more)

### Community 19 - "dice-session.js"
Cohesion: 0.27
Nodes (8): azure, { createServiceClient }, { getClientPrefix }, getSessionRow(), linkTelegramChat(), readActiveSession(), storageStateIsValid(), refreshLogin()

### Community 20 - "execute"
Cohesion: 0.36
Nodes (5): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute()

### Community 21 - "prevalidateJob"
Cohesion: 0.32
Nodes (8): closeBrowser(), openBrowser(), readTotalStepCount(), acquirePreflight(), executeQueuedApply(), getJobName(), prevalidateJob(), releasePreflight()

### Community 22 - "handleJobCallback"
Cohesion: 0.29
Nodes (8): getAnswerForQuestion(), savePendingQuestion(), audit(), handleJobCallback(), persistWorkflowPatch(), processCallbackUpdate(), sendOTPEmail(), createTelegramQuestionPrompt()

### Community 23 - "start-dashboard.js"
Cohesion: 0.25
Nodes (6): { createDashboardServer }, { createPool }, dashboardPort, dashboardServer, pool, server

### Community 24 - "apply-queue.test.js"
Cohesion: 0.32
Nodes (6): acquire(), assert, { createApplyQueue }, mockTask(), release(), test

### Community 25 - "handleConversationMessage"
Cohesion: 0.38
Nodes (7): deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP(), verifyOTP()

### Community 26 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 27 - "applyToJobOnPage"
Cohesion: 0.33
Nodes (6): isVisibleEnabled(), loadApplyProfile(), applyToJobOnPage(), randomDelay(), sessionExpiredError(), waitRandom()

### Community 28 - "runLogin"
Cohesion: 0.33
Nodes (6): getSessionsPendingLogin(), saveSession(), audit(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay()

### Community 29 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 30 - "create-operator.js"
Cohesion: 0.50
Nodes (3): args, { createPool }, email

## Knowledge Gaps
- **248 isolated node(s):** `autoprefixer`, `oxlint`, `postcss`, `tailwindcss`, `@tailwindcss/vite` (+243 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 331 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `scripts`, `sync-daily-pipeline.js`, `start-bot.js`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `createApplyQueue()` connect `createApplyQueue` to `ref_node_assert`, `start-worker.js`, `azure.js`, `createPool`, `apply-queue.test.js`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Are the 17 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 17 INFERRED edges - model-reasoned connections that need verification._
- **What connects `autoprefixer`, `oxlint`, `postcss` to the rest of the system?**
  _248 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05084745762711865 - nodes in this community are weakly interconnected._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07966457023060797 - nodes in this community are weakly interconnected._
- **Should `dashboard-server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09696969696969697 - nodes in this community are weakly interconnected._