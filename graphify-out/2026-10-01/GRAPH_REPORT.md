# Graph Report - Dice_scaling copy  (2026-10-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 686 nodes · 1262 edges · 51 communities (31 shown, 20 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3baeea8e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- due-work-ticker.js
- dashboard-server.js
- map-client-record.js
- sync-daily-pipeline.js
- ref_node_assert
- start-bot.js
- resume-parser.js
- start-worker.js
- scripts
- browser.js
- getClientPrefix
- zoho-mail-reader.js
- createWorkflowStateStore
- createApplyQueue
- azure.js
- applyToJobOnPage
- sendMessage
- devDependencies
- createPool
- execute
- job-application-db.js
- handleConversationMessage
- handleJobCallback
- start-dashboard.js
- apply-queue.test.js
- runLogin
- .oxlintrc.json
- 009_create_dice_archived_jobs.sql
- prevalidateJob
- create-operator.js
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
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
- users_sharan_desktop_dice_scaling_copy_scripts_sync_daily_pipeline_runsyncdaily

## God Nodes (most connected - your core abstractions)
1. `createPool()` - 25 edges
2. `routeRequest()` - 22 edges
3. `resolveQuestionAnswer()` - 21 edges
4. `getClientPrefix()` - 21 edges
5. `sendMessage()` - 20 edges
6. `createApplyQueue()` - 19 edges
7. `applyToJobOnPage()` - 16 edges
8. `sendJson()` - 16 edges
9. `scripts` - 14 edges
10. `runSyncDaily()` - 12 edges

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

## Communities (51 total, 20 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.08
Nodes (51): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), extractPreflightQuestions(), fillCheckboxGroups() (+43 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.07
Nodes (41): dependencies, axios, lucide-react, react, react-dom, react-router-dom, name, private (+33 more)

### Community 2 - "due-work-ticker.js"
Cohesion: 0.07
Nodes (38): crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), applyPromptDecision(), collectAndSavePreflightAnswer() (+30 more)

### Community 3 - "dashboard-server.js"
Cohesion: 0.10
Nodes (40): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+32 more)

### Community 4 - "map-client-record.js"
Cohesion: 0.09
Nodes (35): createServiceClient(), ref_fs, ref_path, { createServiceClient }, fs, importRecords(), { mapImportItem }, path (+27 more)

### Community 5 - "sync-daily-pipeline.js"
Cohesion: 0.06
Nodes (32): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson(), getYesterdayDate() (+24 more)

### Community 6 - "ref_node_assert"
Cohesion: 0.07
Nodes (31): storageStateIsValid(), companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), lib_job_scanner_newday_lookback_ms (+23 more)

### Community 7 - "start-bot.js"
Cohesion: 0.05
Nodes (36): { applyPromptDecision }, azure, bot, { createDueWorkTicker }, createHttpServer(), { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore } (+28 more)

### Community 8 - "resume-parser.js"
Cohesion: 0.09
Nodes (32): calculateDurationYears(), clearResumeCache(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill() (+24 more)

### Community 9 - "start-worker.js"
Cohesion: 0.05
Nodes (36): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile, readTotalStepCount, extractPreflightQuestions } (+28 more)

### Community 10 - "scripts"
Cohesion: 0.06
Nodes (33): dependencies, @aws-sdk/client-s3, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright (+25 more)

### Community 11 - "browser.js"
Cohesion: 0.16
Nodes (15): acquireBrowserTicket(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openLocalBrowser(), RECYCLE_THRESHOLD (+7 more)

### Community 12 - "getClientPrefix"
Cohesion: 0.24
Nodes (13): azure, { createServiceClient }, getClientIdForChat(), { getClientPrefix }, getSessionRow(), readActiveSession(), saveSession(), hasHandledJob() (+5 more)

### Community 13 - "zoho-mail-reader.js"
Cohesion: 0.22
Nodes (13): openBrowser(), fs, getZohoSessionState(), loginToZohoAdmin(), { openBrowser, closeBrowser }, path, saveZohoSessionState(), setupZohoPage() (+5 more)

### Community 14 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 16 - "azure.js"
Cohesion: 0.20
Nodes (9): claimNextJob(), { createPool }, parseColumns(), { Pool }, requireDatabaseUrl(), { createPool }, readJobUrls(), updateJobPreflightStatus() (+1 more)

### Community 17 - "applyToJobOnPage"
Cohesion: 0.25
Nodes (10): isVisibleEnabled(), loadApplyProfile(), patchJobProof(), getS3Client(), hasAwsS3Config(), { S3Client, PutObjectCommand }, uploadScreenshot(), @aws-sdk/client-s3 (+2 more)

### Community 18 - "sendMessage"
Cohesion: 0.27
Nodes (10): { Bot }, getBot(), { getClientPrefix }, sendMessage(), sendMessageWithButtons(), node-telegram-bot-api, beginSignIn(), handleCommand() (+2 more)

### Community 19 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom (+2 more)

### Community 20 - "createPool"
Cohesion: 0.29
Nodes (9): countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs(), createPool(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion(), recordPendingAnswer() (+1 more)

### Community 21 - "execute"
Cohesion: 0.36
Nodes (5): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute()

### Community 22 - "job-application-db.js"
Cohesion: 0.22
Nodes (8): applyQueue, azure, { createApplyQueue }, { createServiceClient }, { getClientIdForChat }, { getClientPrefix, getJobDisplay }, users_sharan_desktop_dice_scaling_copy_lib_apply_queue_createapplyqueue, users_sharan_desktop_dice_scaling_copy_lib_dice_session_getclientidforchat

### Community 23 - "handleConversationMessage"
Cohesion: 0.32
Nodes (8): linkTelegramChat(), deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP(), verifyOTP()

### Community 24 - "handleJobCallback"
Cohesion: 0.29
Nodes (8): getAnswerForQuestion(), savePendingQuestion(), audit(), handleJobCallback(), persistWorkflowPatch(), processCallbackUpdate(), sendOTPEmail(), createTelegramQuestionPrompt()

### Community 25 - "start-dashboard.js"
Cohesion: 0.25
Nodes (6): { createDashboardServer }, { createPool }, dashboardPort, dashboardServer, pool, server

### Community 26 - "apply-queue.test.js"
Cohesion: 0.32
Nodes (6): acquire(), assert, { createApplyQueue }, mockTask(), release(), test

### Community 27 - "runLogin"
Cohesion: 0.29
Nodes (7): getSessionsPendingLogin(), audit(), randomDelay(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay(), waitRandom()

### Community 28 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 29 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 30 - "prevalidateJob"
Cohesion: 0.40
Nodes (5): readTotalStepCount(), acquirePreflight(), getJobName(), prevalidateJob(), releasePreflight()

### Community 31 - "create-operator.js"
Cohesion: 0.50
Nodes (3): args, { createPool }, email

## Knowledge Gaps
- **256 isolated node(s):** `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }`, `IGNORED_COLUMN_KEYS`, `INTENTS` (+251 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 341 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `scripts`, `sync-daily-pipeline.js`, `start-bot.js`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `createApplyQueue()` connect `createApplyQueue` to `azure.js`, `apply-queue.test.js`, `createPool`, `ref_node_assert`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `sendMessage()` (e.g. with `processDueChat()` and `telegram-notify.js`) actually correct?**
  _`sendMessage()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }` to the rest of the system?**
  _256 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07966457023060797 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06547619047619048 - nodes in this community are weakly interconnected._
- **Should `due-work-ticker.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06976744186046512 - nodes in this community are weakly interconnected._