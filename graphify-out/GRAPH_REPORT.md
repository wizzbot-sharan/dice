# Graph Report - Dice_scaling copy  (2026-10-06)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 715 nodes · 1298 edges · 54 communities (32 shown, 22 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f4df5705`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- due-work-ticker.js
- dice-apply-questions.js
- frontend/package.json
- dashboard-server.js
- start-worker.js
- sync-daily-pipeline.js
- ref_node_assert
- resume-parser.js
- start-bot.js
- scripts
- map-client-record.js
- browser.js
- createApplyQueue
- azure.js
- dice-session.js
- createWorkflowStateStore
- import-operators.js
- zoho-mail-reader.js
- applyToJobOnPage
- devDependencies
- handleConversationMessage
- execute
- createPool
- runLogin
- start-dashboard.js
- apply-queue.test.js
- sendMessage
- .oxlintrc.json
- telegram-notify.js
- 009_create_dice_archived_jobs.sql
- test-match.js
- create-operator.js
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- createHttpServer
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
3. `getClientPrefix()` - 21 edges
4. `resolveQuestionAnswer()` - 21 edges
5. `sendMessage()` - 20 edges
6. `createApplyQueue()` - 19 edges
7. `applyToJobOnPage()` - 16 edges
8. `sendJson()` - 16 edges
9. `scripts` - 14 edges
10. `getClientIdForChat()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `handleJobCallback()` --indirect_call--> `getAnswerForQuestion()`  [INFERRED]
  start-bot.js → lib/pending-answers.js
- `handleJobCallback()` --indirect_call--> `savePendingQuestion()`  [INFERRED]
  start-bot.js → lib/pending-answers.js
- `handleJobCallback()` --indirect_call--> `sendMessage()`  [INFERRED]
  start-bot.js → lib/telegram-notify.js
- `handleJobCallback()` --indirect_call--> `saveKnownAnswer()`  [INFERRED]
  start-bot.js → lib/unknown-questions.js
- `run()` --calls--> `createPool()`  [EXTRACTED]
  scratch-migrate.js → lib/azure.js

## Import Cycles
- None detected.

## Communities (54 total, 22 thin omitted)

### Community 0 - "due-work-ticker.js"
Cohesion: 0.06
Nodes (52): crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), applyPromptDecision(), collectAndSavePreflightAnswer() (+44 more)

### Community 1 - "dice-apply-questions.js"
Cohesion: 0.07
Nodes (54): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), extractPreflightQuestions(), fillCheckboxGroups() (+46 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.07
Nodes (41): dependencies, axios, lucide-react, react, react-dom, react-router-dom, name, private (+33 more)

### Community 3 - "dashboard-server.js"
Cohesion: 0.09
Nodes (44): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+36 more)

### Community 4 - "start-worker.js"
Cohesion: 0.05
Nodes (40): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile, readTotalStepCount, extractPreflightQuestions } (+32 more)

### Community 5 - "sync-daily-pipeline.js"
Cohesion: 0.06
Nodes (32): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson(), getYesterdayDate() (+24 more)

### Community 6 - "ref_node_assert"
Cohesion: 0.08
Nodes (30): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), lib_job_scanner_newday_lookback_ms, getAccessToken() (+22 more)

### Community 7 - "resume-parser.js"
Cohesion: 0.09
Nodes (32): calculateDurationYears(), clearResumeCache(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill() (+24 more)

### Community 8 - "start-bot.js"
Cohesion: 0.05
Nodes (34): { applyPromptDecision }, azure, bot, { createDueWorkTicker }, { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore }, crypto (+26 more)

### Community 9 - "scripts"
Cohesion: 0.06
Nodes (34): dependencies, @aws-sdk/client-s3, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright (+26 more)

### Community 10 - "map-client-record.js"
Cohesion: 0.11
Nodes (27): createServiceClient(), { createServiceClient }, run(), { createServiceClient }, run(), { createServiceClient }, fs, importRecords() (+19 more)

### Community 11 - "browser.js"
Cohesion: 0.16
Nodes (18): acquireBrowserTicket(), cancelIdleTimeout(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openBrowser() (+10 more)

### Community 12 - "createApplyQueue"
Cohesion: 0.12
Nodes (4): createApplyQueue(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs()

### Community 13 - "azure.js"
Cohesion: 0.16
Nodes (11): claimNextJob(), { createPool }, parseColumns(), { Pool }, requireDatabaseUrl(), { createPool }, readJobUrls(), updateJobPreflightStatus() (+3 more)

### Community 14 - "dice-session.js"
Cohesion: 0.20
Nodes (12): azure, { createServiceClient }, { getClientPrefix }, getSessionRow(), readActiveSession(), storageStateIsValid(), acquirePreflight(), executeQueuedApply() (+4 more)

### Community 15 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 16 - "import-operators.js"
Cohesion: 0.22
Nodes (11): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+3 more)

### Community 17 - "zoho-mail-reader.js"
Cohesion: 0.23
Nodes (11): fs, getZohoSessionState(), loginToZohoAdmin(), { openBrowser, closeBrowser }, path, saveZohoSessionState(), setupZohoPage(), verifyJobApplicationEmail() (+3 more)

### Community 18 - "applyToJobOnPage"
Cohesion: 0.25
Nodes (10): isVisibleEnabled(), loadApplyProfile(), patchJobProof(), getS3Client(), hasAwsS3Config(), { S3Client, PutObjectCommand }, uploadScreenshot(), @aws-sdk/client-s3 (+2 more)

### Community 19 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom (+2 more)

### Community 20 - "handleConversationMessage"
Cohesion: 0.24
Nodes (10): linkTelegramChat(), audit(), deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP() (+2 more)

### Community 21 - "execute"
Cohesion: 0.36
Nodes (5): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute()

### Community 22 - "createPool"
Cohesion: 0.39
Nodes (8): createPool(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion(), getAnswerForQuestion(), recordPendingAnswer(), savePendingQuestion(), createTelegramQuestionPrompt()

### Community 23 - "runLogin"
Cohesion: 0.25
Nodes (8): getSessionsPendingLogin(), saveSession(), audit(), randomDelay(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay(), waitRandom()

### Community 24 - "start-dashboard.js"
Cohesion: 0.25
Nodes (6): { createDashboardServer }, { createPool }, dashboardPort, dashboardServer, pool, server

### Community 25 - "apply-queue.test.js"
Cohesion: 0.32
Nodes (6): acquire(), assert, { createApplyQueue }, mockTask(), release(), test

### Community 26 - "sendMessage"
Cohesion: 0.48
Nodes (7): sendMessage(), beginSignIn(), handleCommand(), handlePendingAnswerMessage(), persistWorkflowPatch(), processMessageUpdate(), startNewday()

### Community 27 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 28 - "telegram-notify.js"
Cohesion: 0.33
Nodes (5): { Bot }, getBot(), { getClientPrefix }, sendMessageWithButtons(), node-telegram-bot-api

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
- **266 isolated node(s):** `{ createPool }`, `crypto`, `{ getClientPrefix, getJobDisplay }`, `{ applyPromptDecision, sendJobPrompt, randomMinutes }`, `{ createPool }` (+261 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 358 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `telegram-notify.js` to `start-bot.js`, `scripts`, `sync-daily-pipeline.js`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `createApplyQueue()` connect `createApplyQueue` to `apply-queue.test.js`, `azure.js`, `ref_node_assert`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `sendMessage()` (e.g. with `processDueChat()` and `telegram-notify.js`) actually correct?**
  _`sendMessage()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ createPool }`, `crypto`, `{ getClientPrefix, getJobDisplay }` to the rest of the system?**
  _266 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `due-work-ticker.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05669199298655757 - nodes in this community are weakly interconnected._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07456140350877193 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06547619047619048 - nodes in this community are weakly interconnected._