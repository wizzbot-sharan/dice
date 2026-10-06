# Graph Report - Dice_scaling copy  (2026-10-06)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 712 nodes · 1296 edges · 61 communities (41 shown, 20 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `451c2eac`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- frontend/package.json
- dice-apply-questions.js
- dashboard-server.js
- start-worker.js
- start-bot.js
- resume-parser.js
- scripts
- map-client-record.js
- browser.js
- apply-worker.js
- createApplyQueue
- ref_node_test
- bot-prompt-handler.js
- due-work-ticker.js
- import-operators.js
- azure.js
- getClientPrefix
- sendMessage
- sync-daily-pipeline.js
- job-matching.test.js
- sync-pipeline.test.js
- applyToJobOnPage
- bot-webhook.test.js
- execute
- createPool
- job-application-db.js
- ref_node_assert
- runLogin
- handleConversationMessage
- service-split.test.js
- start-dashboard.js
- apply-queue.test.js
- manager-role.test.js
- processDueChat
- .oxlintrc.json
- prevalidateJob
- 009_create_dice_archived_jobs.sql
- handleJobCallback
- test-match.js
- logger.js
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
- `run()` --calls--> `createPool()`  [EXTRACTED]
  scratch-migrate.js → lib/azure.js
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

## Communities (61 total, 20 thin omitted)

### Community 0 - "frontend/package.json"
Cohesion: 0.05
Nodes (51): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+43 more)

### Community 1 - "dice-apply-questions.js"
Cohesion: 0.08
Nodes (52): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), extractPreflightQuestions(), fillCheckboxGroups() (+44 more)

### Community 2 - "dashboard-server.js"
Cohesion: 0.09
Nodes (44): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+36 more)

### Community 3 - "start-worker.js"
Cohesion: 0.05
Nodes (39): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile, readTotalStepCount, extractPreflightQuestions } (+31 more)

### Community 4 - "start-bot.js"
Cohesion: 0.05
Nodes (36): { applyPromptDecision }, azure, bot, { createDueWorkTicker }, createHttpServer(), { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore } (+28 more)

### Community 5 - "resume-parser.js"
Cohesion: 0.09
Nodes (32): calculateDurationYears(), clearResumeCache(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill() (+24 more)

### Community 6 - "scripts"
Cohesion: 0.06
Nodes (34): dependencies, @aws-sdk/client-s3, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright (+26 more)

### Community 7 - "map-client-record.js"
Cohesion: 0.11
Nodes (27): createServiceClient(), { createServiceClient }, run(), { createServiceClient }, run(), { createServiceClient }, fs, importRecords() (+19 more)

### Community 8 - "browser.js"
Cohesion: 0.10
Nodes (29): acquireBrowserTicket(), cancelIdleTimeout(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openBrowser() (+21 more)

### Community 9 - "apply-worker.js"
Cohesion: 0.14
Nodes (13): { createPool }, crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), assert (+5 more)

### Community 10 - "createApplyQueue"
Cohesion: 0.12
Nodes (4): createApplyQueue(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs()

### Community 11 - "ref_node_test"
Cohesion: 0.17
Nodes (9): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), ref_node_test, assert, { createWorkflowStateStore } (+1 more)

### Community 12 - "bot-prompt-handler.js"
Cohesion: 0.20
Nodes (12): applyPromptDecision(), collectAndSavePreflightAnswer(), { createPool }, crypto, { getClientPrefix, getJobDisplay }, randomMinutes(), sendJobPrompt(), getJobDisplay() (+4 more)

### Community 13 - "due-work-ticker.js"
Cohesion: 0.15
Nodes (12): { applyPromptDecision, sendJobPrompt, randomMinutes }, { createPool }, ENQUEUE_BATCH_CAP, { getClientPrefix }, { NEWDAY_LOOKBACK_MS }, SEND_SPACING_MS, TICKER_BATCH_SIZE, TICKER_INTERVAL_MS (+4 more)

### Community 14 - "import-operators.js"
Cohesion: 0.22
Nodes (11): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+3 more)

### Community 15 - "azure.js"
Cohesion: 0.18
Nodes (10): claimNextJob(), parseColumns(), { Pool }, requireDatabaseUrl(), { createPool }, readJobUrls(), updateJobPreflightStatus(), { createPool } (+2 more)

### Community 16 - "getClientPrefix"
Cohesion: 0.28
Nodes (11): azure, { createServiceClient }, getClientIdForChat(), { getClientPrefix }, getSessionRow(), readActiveSession(), hasHandledJob(), saveAppliedJob() (+3 more)

### Community 17 - "sendMessage"
Cohesion: 0.26
Nodes (11): { Bot }, getBot(), { getClientPrefix }, sendMessage(), sendMessageWithButtons(), node-telegram-bot-api, beginSignIn(), handleCommand() (+3 more)

### Community 18 - "sync-daily-pipeline.js"
Cohesion: 0.26
Nodes (10): { createPool, createServiceClient }, deriveManagerLinks(), fetchJson(), getYesterdayDate(), { mapImportItem }, path, runSyncDaily(), syncCAs() (+2 more)

### Community 19 - "job-matching.test.js"
Cohesion: 0.33
Nodes (9): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), assert, { companyIsExcluded, jobMatchesProfile, roleMatchesJobTitle } (+1 more)

### Community 20 - "sync-pipeline.test.js"
Cohesion: 0.20
Nodes (8): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, assert, { createDashboardServer, syncCooldowns, SYNC_COOLDOWN_MS }, crypto, { getYesterdayDate, runSyncDaily }, stream, test

### Community 21 - "applyToJobOnPage"
Cohesion: 0.29
Nodes (9): isVisibleEnabled(), patchJobProof(), getS3Client(), hasAwsS3Config(), { S3Client, PutObjectCommand }, uploadScreenshot(), @aws-sdk/client-s3, applyToJobOnPage() (+1 more)

### Community 22 - "bot-webhook.test.js"
Cohesion: 0.20
Nodes (8): ref_http, ref_stream, assert, { Bot }, { createWebhookServer }, http, stream, test

### Community 23 - "execute"
Cohesion: 0.36
Nodes (5): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute()

### Community 24 - "createPool"
Cohesion: 0.39
Nodes (8): createPool(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion(), getAnswerForQuestion(), recordPendingAnswer(), savePendingQuestion(), createTelegramQuestionPrompt()

### Community 25 - "job-application-db.js"
Cohesion: 0.22
Nodes (8): applyQueue, azure, { createApplyQueue }, { createServiceClient, createPool }, { getClientIdForChat }, { getClientPrefix, getJobDisplay }, users_sharan_desktop_dice_scaling_copy_lib_apply_queue_createapplyqueue, users_sharan_desktop_dice_scaling_copy_lib_dice_session_getclientidforchat

### Community 26 - "ref_node_assert"
Cohesion: 0.36
Nodes (7): getAccessToken(), getAuthConfig(), sendEmail(), ref_node_assert, assert, { getAuthConfig, sendEmail }, test

### Community 27 - "runLogin"
Cohesion: 0.25
Nodes (8): getSessionsPendingLogin(), saveSession(), audit(), randomDelay(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay(), waitRandom()

### Community 28 - "handleConversationMessage"
Cohesion: 0.32
Nodes (8): linkTelegramChat(), deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP(), verifyOTP()

### Community 29 - "service-split.test.js"
Cohesion: 0.25
Nodes (7): storageStateIsValid(), lib_job_scanner_newday_lookback_ms, assert, { NEWDAY_LOOKBACK_MS }, { storageStateIsValid }, test, users_sharan_desktop_dice_scaling_copy_lib_dice_session_storagestateisvalid

### Community 30 - "start-dashboard.js"
Cohesion: 0.25
Nodes (6): { createDashboardServer }, { createPool }, dashboardPort, dashboardServer, pool, server

### Community 31 - "apply-queue.test.js"
Cohesion: 0.32
Nodes (6): acquire(), assert, { createApplyQueue }, mockTask(), release(), test

### Community 32 - "manager-role.test.js"
Cohesion: 0.25
Nodes (6): assert, { createDashboardServer }, crypto, { deriveManagerLinks, runSyncDaily }, stream, test

### Community 33 - "processDueChat"
Cohesion: 0.48
Nodes (6): createDueWorkTicker(), persistWorkflowPatch(), processDueChat(), start(), tick(), listDueWorkflowChats()

### Community 34 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 35 - "prevalidateJob"
Cohesion: 0.33
Nodes (6): loadApplyProfile(), readTotalStepCount(), acquirePreflight(), getJobName(), prevalidateJob(), releasePreflight()

### Community 36 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 37 - "handleJobCallback"
Cohesion: 0.40
Nodes (5): audit(), handleJobCallback(), persistWorkflowPatch(), processCallbackUpdate(), sendOTPEmail()

### Community 38 - "test-match.js"
Cohesion: 0.40
Nodes (3): companyTokens, subjectTokens, titleTokens

### Community 39 - "logger.js"
Cohesion: 0.50
Nodes (3): clientCache, { createPool }, jobCache

### Community 40 - "create-operator.js"
Cohesion: 0.50
Nodes (3): args, { createPool }, email

## Knowledge Gaps
- **266 isolated node(s):** `autoprefixer`, `oxlint`, `postcss`, `tailwindcss`, `@tailwindcss/vite` (+261 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 356 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `start-bot.js`, `scripts`, `bot-webhook.test.js`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `createApplyQueue()` connect `createApplyQueue` to `apply-worker.js`, `apply-queue.test.js`, `azure.js`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `sendMessage()` (e.g. with `processDueChat()` and `telegram-notify.js`) actually correct?**
  _`sendMessage()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `autoprefixer`, `oxlint`, `postcss` to the rest of the system?**
  _266 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05084745762711865 - nodes in this community are weakly interconnected._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07878787878787878 - nodes in this community are weakly interconnected._
- **Should `dashboard-server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08776595744680851 - nodes in this community are weakly interconnected._