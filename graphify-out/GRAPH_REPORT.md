# Graph Report - Dice_scaling copy  (2026-10-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 727 nodes · 1309 edges · 56 communities (34 shown, 22 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `248ddecf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- frontend/package.json
- dice-apply-questions.js
- dashboard-server.js
- sync-daily-pipeline.js
- due-work-ticker.js
- start-worker.js
- start-bot.js
- scripts
- resume-parser.js
- map-client-record.js
- browser.js
- createApplyQueue
- createWorkflowStateStore
- import-operators.js
- azure.js
- getClientPrefix
- dice-session.js
- sendMessage
- job-matching.test.js
- users_sharan_desktop_dice_scaling_copy_lib_azure_createpool
- createPool
- job-application-db.js
- apply-timeout.test.js
- handleConversationMessage
- start-dashboard.js
- apply-queue.test.js
- runLogin
- .oxlintrc.json
- prevalidateJob
- s3-screenshot.js
- 009_create_dice_archived_jobs.sql
- handleJobCallback
- test-match.js
- create-operator.js
- test-db-constraint.js
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
7. `applyToJobOnPage()` - 16 edges
8. `sendJson()` - 16 edges
9. `scripts` - 14 edges
10. `fillCheckboxGroups()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `handleJobCallback()` --indirect_call--> `getClientIdForChat()`  [INFERRED]
  start-bot.js → lib/dice-session.js
- `handleJobCallback()` --indirect_call--> `saveAppliedJob()`  [INFERRED]
  start-bot.js → lib/job-application-db.js
- `handleJobCallback()` --indirect_call--> `sendMessage()`  [INFERRED]
  start-bot.js → lib/telegram-notify.js
- `run()` --calls--> `createPool()`  [EXTRACTED]
  scratch-migrate.js → lib/azure.js
- `handleJobCallback()` --indirect_call--> `getAnswerForQuestion()`  [INFERRED]
  start-bot.js → lib/pending-answers.js

## Import Cycles
- None detected.

## Communities (56 total, 22 thin omitted)

### Community 0 - "frontend/package.json"
Cohesion: 0.05
Nodes (51): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+43 more)

### Community 1 - "dice-apply-questions.js"
Cohesion: 0.08
Nodes (52): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), extractPreflightQuestions(), fillCheckboxGroups() (+44 more)

### Community 2 - "dashboard-server.js"
Cohesion: 0.07
Nodes (48): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+40 more)

### Community 3 - "sync-daily-pipeline.js"
Cohesion: 0.05
Nodes (43): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, getAccessToken(), getAuthConfig(), sendEmail(), ref_http, ref_node_assert, ref_node_test (+35 more)

### Community 4 - "due-work-ticker.js"
Cohesion: 0.07
Nodes (38): crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), applyPromptDecision(), collectAndSavePreflightAnswer() (+30 more)

### Community 5 - "start-worker.js"
Cohesion: 0.05
Nodes (40): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile, readTotalStepCount, extractPreflightQuestions } (+32 more)

### Community 6 - "start-bot.js"
Cohesion: 0.05
Nodes (36): { applyPromptDecision }, azure, bot, { createDueWorkTicker }, createHttpServer(), { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore } (+28 more)

### Community 7 - "scripts"
Cohesion: 0.05
Nodes (35): dependencies, @aws-sdk/client-s3, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright (+27 more)

### Community 8 - "resume-parser.js"
Cohesion: 0.09
Nodes (32): calculateDurationYears(), clearResumeCache(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill() (+24 more)

### Community 9 - "map-client-record.js"
Cohesion: 0.11
Nodes (27): createServiceClient(), { createServiceClient }, run(), { createServiceClient }, run(), { createServiceClient }, fs, importRecords() (+19 more)

### Community 10 - "browser.js"
Cohesion: 0.10
Nodes (29): acquireBrowserTicket(), cancelIdleTimeout(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openBrowser() (+21 more)

### Community 11 - "createApplyQueue"
Cohesion: 0.12
Nodes (4): createApplyQueue(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs()

### Community 12 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 13 - "import-operators.js"
Cohesion: 0.22
Nodes (11): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+3 more)

### Community 14 - "azure.js"
Cohesion: 0.24
Nodes (8): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute(), parseColumns(), { Pool }, requireDatabaseUrl()

### Community 15 - "getClientPrefix"
Cohesion: 0.28
Nodes (13): isVisibleEnabled(), getClientIdForChat(), getSessionRow(), readActiveSession(), saveSession(), hasHandledJob(), patchJobProof(), saveAppliedJob() (+5 more)

### Community 16 - "dice-session.js"
Cohesion: 0.17
Nodes (10): azure, { createServiceClient }, { getClientPrefix }, storageStateIsValid(), lib_job_scanner_newday_lookback_ms, assert, { NEWDAY_LOOKBACK_MS }, { storageStateIsValid } (+2 more)

### Community 17 - "sendMessage"
Cohesion: 0.26
Nodes (11): { Bot }, getBot(), { getClientPrefix }, sendMessage(), sendMessageWithButtons(), node-telegram-bot-api, beginSignIn(), handleCommand() (+3 more)

### Community 18 - "job-matching.test.js"
Cohesion: 0.33
Nodes (9): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), assert, { companyIsExcluded, jobMatchesProfile, roleMatchesJobTitle } (+1 more)

### Community 19 - "users_sharan_desktop_dice_scaling_copy_lib_azure_createpool"
Cohesion: 0.22
Nodes (7): claimNextJob(), { createPool }, readJobUrls(), updateJobPreflightStatus(), { createPool }, run(), users_sharan_desktop_dice_scaling_copy_lib_azure_createpool

### Community 20 - "createPool"
Cohesion: 0.39
Nodes (8): createPool(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion(), getAnswerForQuestion(), recordPendingAnswer(), savePendingQuestion(), createTelegramQuestionPrompt()

### Community 21 - "job-application-db.js"
Cohesion: 0.22
Nodes (8): applyQueue, azure, { createApplyQueue }, { createServiceClient, createPool }, { getClientIdForChat }, { getClientPrefix, getJobDisplay }, users_sharan_desktop_dice_scaling_copy_lib_apply_queue_createapplyqueue, users_sharan_desktop_dice_scaling_copy_lib_dice_session_getclientidforchat

### Community 22 - "apply-timeout.test.js"
Cohesion: 0.25
Nodes (5): { createPool }, assert, { createApplyQueue }, { startApplyWorkers }, test

### Community 23 - "handleConversationMessage"
Cohesion: 0.32
Nodes (8): linkTelegramChat(), deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP(), verifyOTP()

### Community 24 - "start-dashboard.js"
Cohesion: 0.25
Nodes (6): { createDashboardServer }, { createPool }, dashboardPort, dashboardServer, pool, server

### Community 25 - "apply-queue.test.js"
Cohesion: 0.32
Nodes (6): acquire(), assert, { createApplyQueue }, mockTask(), release(), test

### Community 26 - "runLogin"
Cohesion: 0.29
Nodes (7): getSessionsPendingLogin(), audit(), randomDelay(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay(), waitRandom()

### Community 27 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 28 - "prevalidateJob"
Cohesion: 0.33
Nodes (6): loadApplyProfile(), readTotalStepCount(), acquirePreflight(), getJobName(), prevalidateJob(), releasePreflight()

### Community 29 - "s3-screenshot.js"
Cohesion: 0.53
Nodes (5): getS3Client(), hasAwsS3Config(), { S3Client, PutObjectCommand }, uploadScreenshot(), @aws-sdk/client-s3

### Community 30 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 31 - "handleJobCallback"
Cohesion: 0.40
Nodes (5): audit(), handleJobCallback(), persistWorkflowPatch(), processCallbackUpdate(), sendOTPEmail()

### Community 32 - "test-match.js"
Cohesion: 0.40
Nodes (3): companyTokens, subjectTokens, titleTokens

### Community 33 - "create-operator.js"
Cohesion: 0.50
Nodes (3): args, { createPool }, email

## Knowledge Gaps
- **272 isolated node(s):** `axios`, `lucide-react`, `react`, `react-dom`, `react-router-dom` (+267 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 367 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `sync-daily-pipeline.js`, `start-bot.js`, `scripts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `createApplyQueue()` connect `createApplyQueue` to `apply-queue.test.js`, `users_sharan_desktop_dice_scaling_copy_lib_azure_createpool`, `apply-timeout.test.js`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `sendMessage()` (e.g. with `processDueChat()` and `telegram-notify.js`) actually correct?**
  _`sendMessage()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `axios`, `lucide-react`, `react` to the rest of the system?**
  _272 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05084745762711865 - nodes in this community are weakly interconnected._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07878787878787878 - nodes in this community are weakly interconnected._
- **Should `dashboard-server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07337526205450734 - nodes in this community are weakly interconnected._