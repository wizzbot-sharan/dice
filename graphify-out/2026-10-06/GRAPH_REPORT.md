# Graph Report - Dice_scaling copy  (2026-10-06)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 705 nodes · 1286 edges · 54 communities (35 shown, 19 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `071c314b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- due-work-ticker.js
- sync-daily-pipeline.js
- dashboard-server.js
- start-worker.js
- start-bot.js
- resume-parser.js
- map-client-record.js
- scripts
- browser.js
- createApplyQueue
- import-operators.js
- azure.js
- dice-session.js
- createWorkflowStateStore
- getClientPrefix
- sendMessage
- job-matching.test.js
- devDependencies
- createPool
- job-application-db.js
- apply-timeout.test.js
- execute
- runLogin
- start-dashboard.js
- apply-queue.test.js
- handleConversationMessage
- .oxlintrc.json
- prevalidateJob
- s3-screenshot.js
- 009_create_dice_archived_jobs.sql
- handleJobCallback
- test-match.js
- create-operator.js
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- test-date.js
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

## Communities (54 total, 19 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.08
Nodes (51): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), extractPreflightQuestions(), fillCheckboxGroups() (+43 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.07
Nodes (41): dependencies, axios, lucide-react, react, react-dom, react-router-dom, name, private (+33 more)

### Community 2 - "due-work-ticker.js"
Cohesion: 0.06
Nodes (42): crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), applyPromptDecision(), collectAndSavePreflightAnswer() (+34 more)

### Community 3 - "sync-daily-pipeline.js"
Cohesion: 0.06
Nodes (39): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, getAccessToken(), getAuthConfig(), sendEmail(), ref_http, ref_node_assert, ref_stream (+31 more)

### Community 4 - "dashboard-server.js"
Cohesion: 0.10
Nodes (41): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+33 more)

### Community 5 - "start-worker.js"
Cohesion: 0.05
Nodes (39): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile, readTotalStepCount, extractPreflightQuestions } (+31 more)

### Community 6 - "start-bot.js"
Cohesion: 0.05
Nodes (36): { applyPromptDecision }, azure, bot, { createDueWorkTicker }, createHttpServer(), { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore } (+28 more)

### Community 7 - "resume-parser.js"
Cohesion: 0.09
Nodes (32): calculateDurationYears(), clearResumeCache(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill() (+24 more)

### Community 8 - "map-client-record.js"
Cohesion: 0.11
Nodes (28): createServiceClient(), ref_fs, { createServiceClient }, run(), { createServiceClient }, run(), { createServiceClient }, fs (+20 more)

### Community 9 - "scripts"
Cohesion: 0.06
Nodes (33): dependencies, @aws-sdk/client-s3, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright (+25 more)

### Community 10 - "browser.js"
Cohesion: 0.10
Nodes (28): acquireBrowserTicket(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openBrowser(), openLocalBrowser() (+20 more)

### Community 11 - "createApplyQueue"
Cohesion: 0.12
Nodes (4): createApplyQueue(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs()

### Community 12 - "import-operators.js"
Cohesion: 0.20
Nodes (12): ref_path, { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText() (+4 more)

### Community 13 - "azure.js"
Cohesion: 0.18
Nodes (11): claimNextJob(), assertIdentifier(), parseColumns(), { Pool }, requireDatabaseUrl(), { createPool }, readJobUrls(), updateJobPreflightStatus() (+3 more)

### Community 14 - "dice-session.js"
Cohesion: 0.15
Nodes (11): azure, { createServiceClient }, { getClientPrefix }, linkTelegramChat(), storageStateIsValid(), lib_job_scanner_newday_lookback_ms, assert, { NEWDAY_LOOKBACK_MS } (+3 more)

### Community 15 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 16 - "getClientPrefix"
Cohesion: 0.32
Nodes (12): isVisibleEnabled(), getClientIdForChat(), getSessionRow(), readActiveSession(), hasHandledJob(), patchJobProof(), saveAppliedJob(), getClientPrefix() (+4 more)

### Community 17 - "sendMessage"
Cohesion: 0.26
Nodes (11): { Bot }, getBot(), { getClientPrefix }, sendMessage(), sendMessageWithButtons(), node-telegram-bot-api, beginSignIn(), handleCommand() (+3 more)

### Community 18 - "job-matching.test.js"
Cohesion: 0.33
Nodes (9): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), assert, { companyIsExcluded, jobMatchesProfile, roleMatchesJobTitle } (+1 more)

### Community 19 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom (+2 more)

### Community 20 - "createPool"
Cohesion: 0.39
Nodes (8): createPool(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion(), getAnswerForQuestion(), recordPendingAnswer(), savePendingQuestion(), createTelegramQuestionPrompt()

### Community 21 - "job-application-db.js"
Cohesion: 0.22
Nodes (8): applyQueue, azure, { createApplyQueue }, { createServiceClient, createPool }, { getClientIdForChat }, { getClientPrefix, getJobDisplay }, users_sharan_desktop_dice_scaling_copy_lib_apply_queue_createapplyqueue, users_sharan_desktop_dice_scaling_copy_lib_dice_session_getclientidforchat

### Community 22 - "apply-timeout.test.js"
Cohesion: 0.25
Nodes (5): { createPool }, assert, { createApplyQueue }, { startApplyWorkers }, test

### Community 23 - "execute"
Cohesion: 0.39
Nodes (4): createQueryBuilder(), builder, buildWhere(), execute()

### Community 24 - "runLogin"
Cohesion: 0.25
Nodes (8): getSessionsPendingLogin(), saveSession(), audit(), randomDelay(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay(), waitRandom()

### Community 25 - "start-dashboard.js"
Cohesion: 0.25
Nodes (6): { createDashboardServer }, { createPool }, dashboardPort, dashboardServer, pool, server

### Community 26 - "apply-queue.test.js"
Cohesion: 0.32
Nodes (6): acquire(), assert, { createApplyQueue }, mockTask(), release(), test

### Community 27 - "handleConversationMessage"
Cohesion: 0.38
Nodes (7): deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP(), verifyOTP()

### Community 28 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 29 - "prevalidateJob"
Cohesion: 0.33
Nodes (6): loadApplyProfile(), readTotalStepCount(), acquirePreflight(), getJobName(), prevalidateJob(), releasePreflight()

### Community 30 - "s3-screenshot.js"
Cohesion: 0.53
Nodes (5): getS3Client(), hasAwsS3Config(), { S3Client, PutObjectCommand }, uploadScreenshot(), @aws-sdk/client-s3

### Community 31 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 32 - "handleJobCallback"
Cohesion: 0.40
Nodes (5): audit(), handleJobCallback(), persistWorkflowPatch(), processCallbackUpdate(), sendOTPEmail()

### Community 33 - "test-match.js"
Cohesion: 0.40
Nodes (3): companyTokens, subjectTokens, titleTokens

### Community 34 - "create-operator.js"
Cohesion: 0.50
Nodes (3): args, { createPool }, email

## Knowledge Gaps
- **263 isolated node(s):** `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }`, `IGNORED_COLUMN_KEYS`, `INTENTS` (+258 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 352 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `scripts`, `sync-daily-pipeline.js`, `start-bot.js`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `createApplyQueue()` connect `createApplyQueue` to `apply-queue.test.js`, `azure.js`, `apply-timeout.test.js`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `sendMessage()` (e.g. with `processDueChat()` and `telegram-notify.js`) actually correct?**
  _`sendMessage()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }` to the rest of the system?**
  _263 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08106219426974144 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06547619047619048 - nodes in this community are weakly interconnected._
- **Should `due-work-ticker.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06292517006802721 - nodes in this community are weakly interconnected._