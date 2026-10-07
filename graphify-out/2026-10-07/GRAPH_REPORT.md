# Graph Report - Dice_scaling copy  (2026-10-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 714 nodes · 1296 edges · 59 communities (33 shown, 26 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `40bc903b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- dashboard-server.js
- ref_node_assert
- scripts
- start-bot.js
- resume-parser.js
- start-worker.js
- browser.js
- sync-daily-pipeline.js
- map-client-record.js
- due-work-ticker.js
- import-operators.js
- getClientPrefix
- dice-session.js
- apply-worker.js
- createApplyQueue
- createPool
- azure.js
- createWorkflowStateStore
- sendMessage
- devDependencies
- applyToJobOnPage
- handleConversationMessage
- job-application-db.js
- execute
- runLogin
- start-dashboard.js
- .oxlintrc.json
- prevalidateJob
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
- users_sharan_desktop_dice_scaling_copy_lib_dice_apply_questions_extractpreflightquestions
- users_sharan_desktop_dice_scaling_copy_lib_dice_apply_questions_fillcurrentstep
- users_sharan_desktop_dice_scaling_copy_lib_dice_apply_questions_isvisibleenabled
- users_sharan_desktop_dice_scaling_copy_lib_dice_apply_questions_loadapplyprofile
- users_sharan_desktop_dice_scaling_copy_lib_dice_apply_questions_readtotalstepcount
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

## Communities (59 total, 26 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.08
Nodes (52): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), extractPreflightQuestions(), fillCheckboxGroups() (+44 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.07
Nodes (41): dependencies, axios, lucide-react, react, react-dom, react-router-dom, name, private (+33 more)

### Community 2 - "dashboard-server.js"
Cohesion: 0.10
Nodes (40): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+32 more)

### Community 3 - "ref_node_assert"
Cohesion: 0.07
Nodes (34): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), getAccessToken(), getAuthConfig() (+26 more)

### Community 4 - "scripts"
Cohesion: 0.05
Nodes (39): getS3Client(), hasAwsS3Config(), { S3Client, PutObjectCommand }, uploadScreenshot(), dependencies, @aws-sdk/client-s3, bcryptjs, dotenv (+31 more)

### Community 5 - "start-bot.js"
Cohesion: 0.05
Nodes (35): { applyPromptDecision }, azure, bot, { createDueWorkTicker }, createHttpServer(), { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore } (+27 more)

### Community 6 - "resume-parser.js"
Cohesion: 0.09
Nodes (32): calculateDurationYears(), clearResumeCache(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill() (+24 more)

### Community 7 - "start-worker.js"
Cohesion: 0.05
Nodes (36): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile, readTotalStepCount, extractPreflightQuestions } (+28 more)

### Community 8 - "browser.js"
Cohesion: 0.10
Nodes (29): acquireBrowserTicket(), cancelIdleTimeout(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openBrowser() (+21 more)

### Community 9 - "sync-daily-pipeline.js"
Cohesion: 0.09
Nodes (25): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_crypto, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson(), getYesterdayDate(), { mapImportItem } (+17 more)

### Community 10 - "map-client-record.js"
Cohesion: 0.20
Nodes (18): { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean(), asDate(), asInteger() (+10 more)

### Community 11 - "due-work-ticker.js"
Cohesion: 0.13
Nodes (17): { applyPromptDecision, sendJobPrompt, randomMinutes }, createDueWorkTicker(), persistWorkflowPatch(), start(), tick(), { createPool }, ENQUEUE_BATCH_CAP, { getClientPrefix } (+9 more)

### Community 12 - "import-operators.js"
Cohesion: 0.15
Nodes (15): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+7 more)

### Community 13 - "getClientPrefix"
Cohesion: 0.20
Nodes (16): applyPromptDecision(), collectAndSavePreflightAnswer(), { createPool }, crypto, { getClientPrefix, getJobDisplay }, randomMinutes(), sendJobPrompt(), getClientIdForChat() (+8 more)

### Community 14 - "dice-session.js"
Cohesion: 0.15
Nodes (14): azure, { createServiceClient }, { getClientPrefix }, getSessionRow(), readActiveSession(), storageStateIsValid(), lib_job_scanner_newday_lookback_ms, executeQueuedApply() (+6 more)

### Community 15 - "apply-worker.js"
Cohesion: 0.15
Nodes (12): { createPool }, crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), assert (+4 more)

### Community 16 - "createApplyQueue"
Cohesion: 0.12
Nodes (4): createApplyQueue(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs()

### Community 17 - "createPool"
Cohesion: 0.18
Nodes (13): claimNextJob(), createPool(), { createPool }, readJobUrls(), updateJobPreflightStatus(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion() (+5 more)

### Community 18 - "azure.js"
Cohesion: 0.17
Nodes (12): createServiceClient(), parseColumns(), { Pool }, requireDatabaseUrl(), { createServiceClient }, run(), { createServiceClient }, run() (+4 more)

### Community 19 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 20 - "sendMessage"
Cohesion: 0.27
Nodes (10): { Bot }, getBot(), { getClientPrefix }, sendMessage(), sendMessageWithButtons(), node-telegram-bot-api, beginSignIn(), handleCommand() (+2 more)

### Community 21 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom (+2 more)

### Community 22 - "applyToJobOnPage"
Cohesion: 0.22
Nodes (10): isVisibleEnabled(), patchJobProof(), getAnswerForQuestion(), savePendingQuestion(), handleJobCallback(), persistWorkflowPatch(), processCallbackUpdate(), applyToJobOnPage() (+2 more)

### Community 23 - "handleConversationMessage"
Cohesion: 0.24
Nodes (10): linkTelegramChat(), audit(), deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP() (+2 more)

### Community 24 - "job-application-db.js"
Cohesion: 0.20
Nodes (9): applyQueue, azure, { createApplyQueue }, { createServiceClient, createPool }, { getClientIdForChat }, { getClientPrefix, getJobDisplay }, users_sharan_desktop_dice_scaling_copy_lib_apply_queue_createapplyqueue, users_sharan_desktop_dice_scaling_copy_lib_dice_session_getclientidforchat (+1 more)

### Community 25 - "execute"
Cohesion: 0.36
Nodes (5): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute()

### Community 26 - "runLogin"
Cohesion: 0.25
Nodes (8): getSessionsPendingLogin(), saveSession(), audit(), randomDelay(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay(), waitRandom()

### Community 27 - "start-dashboard.js"
Cohesion: 0.25
Nodes (6): { createDashboardServer }, { createPool }, dashboardPort, dashboardServer, pool, server

### Community 28 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 29 - "prevalidateJob"
Cohesion: 0.33
Nodes (6): loadApplyProfile(), readTotalStepCount(), acquirePreflight(), getJobName(), prevalidateJob(), releasePreflight()

### Community 30 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 31 - "test-match.js"
Cohesion: 0.40
Nodes (3): companyTokens, subjectTokens, titleTokens

### Community 32 - "create-operator.js"
Cohesion: 0.50
Nodes (3): args, { createPool }, email

## Knowledge Gaps
- **266 isolated node(s):** `INTENTS`, `LABELS`, `QUESTION_MAPPINGS`, `{ SKILL_ALIASES }`, `assert` (+261 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 358 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `ref_node_assert`, `scripts`, `start-bot.js`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `createApplyQueue()` connect `createApplyQueue` to `createPool`, `ref_node_assert`, `apply-worker.js`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `sendMessage()` (e.g. with `processDueChat()` and `telegram-notify.js`) actually correct?**
  _`sendMessage()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `INTENTS`, `LABELS`, `QUESTION_MAPPINGS` to the rest of the system?**
  _266 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07878787878787878 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06547619047619048 - nodes in this community are weakly interconnected._
- **Should `dashboard-server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10188261351052048 - nodes in this community are weakly interconnected._