# Graph Report - Dice_scaling copy  (2026-09-30)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 657 nodes · 1190 edges · 43 communities (29 shown, 14 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 134 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ba006ed3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- dashboard-server.js
- ref_node_assert
- sync-daily-pipeline.js
- due-work-ticker.js
- start-worker.js
- scripts
- start-bot.js
- map-client-record.js
- browser.js
- import-operators.js
- createApplyQueue
- createPool
- users_sharan_desktop_dice_scaling_copy_lib_azure_createpool
- azure.js
- apply-worker.js
- executeQueuedApply
- job-application-db.js
- applyToJobOnPage
- sendMessage
- handleConversationMessage
- dice-session.js
- .oxlintrc.json
- saveAppliedJob
- job-scanner.js
- service-split.test.js
- sendMessage
- 009_create_dice_archived_jobs.sql
- create-operator.js
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- re
- dice_applied_jobs
- dice_apply_queue
- dice_workflow_sessions
- lib_browser_usebrowserbase
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_randomminutes
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_sendjobprompt

## God Nodes (most connected - your core abstractions)
1. `createPool()` - 27 edges
2. `routeRequest()` - 22 edges
3. `resolveQuestionAnswer()` - 20 edges
4. `createApplyQueue()` - 18 edges
5. `sendJson()` - 16 edges
6. `scripts` - 14 edges
7. `fillCheckboxGroups()` - 11 edges
8. `applyToJobOnPage()` - 11 edges
9. `handleConversationMessage()` - 11 edges
10. `saveAppliedJob()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `run()` --calls--> `createPool()`  [EXTRACTED]
  scripts/scratch-db-check.js → lib/azure.js
- `fixMissingCAs()` --calls--> `createPool()`  [EXTRACTED]
  scripts/scratch-db-fix.js → lib/azure.js
- `handleJobCallback()` --indirect_call--> `getClientIdForChat()`  [INFERRED]
  start-bot.js → lib/dice-session.js
- `applyToJobOnPage()` --calls--> `fillCurrentStep()`  [EXTRACTED]
  start-worker.js → lib/dice-apply-questions.js
- `executeQueuedApply()` --calls--> `closeBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js

## Import Cycles
- None detected.

## Communities (43 total, 14 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.05
Nodes (74): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), fillCheckboxGroups(), fillCurrentStep() (+66 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.05
Nodes (53): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+45 more)

### Community 2 - "dashboard-server.js"
Cohesion: 0.08
Nodes (47): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+39 more)

### Community 3 - "ref_node_assert"
Cohesion: 0.06
Nodes (35): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), getAccessToken(), getAuthConfig() (+27 more)

### Community 4 - "sync-daily-pipeline.js"
Cohesion: 0.06
Nodes (32): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson(), getYesterdayDate() (+24 more)

### Community 5 - "due-work-ticker.js"
Cohesion: 0.09
Nodes (32): sleep(), startApplyWorkers(), workerLoop(), applyPromptDecision(), crypto, { getClientPrefix, getJobDisplay }, randomMinutes(), sendJobPrompt() (+24 more)

### Community 6 - "start-worker.js"
Cohesion: 0.06
Nodes (34): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile } (+26 more)

### Community 7 - "scripts"
Cohesion: 0.06
Nodes (33): dependencies, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright, playwright-core (+25 more)

### Community 8 - "start-bot.js"
Cohesion: 0.06
Nodes (30): { applyPromptDecision }, azure, { Bot }, { createDueWorkTicker }, createHttpServer(), { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore } (+22 more)

### Community 9 - "map-client-record.js"
Cohesion: 0.15
Nodes (23): createServiceClient(), ref_fs, { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean() (+15 more)

### Community 10 - "browser.js"
Cohesion: 0.16
Nodes (15): acquireBrowserTicket(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openBrowser(), openLocalBrowser() (+7 more)

### Community 11 - "import-operators.js"
Cohesion: 0.20
Nodes (12): ref_path, { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText() (+4 more)

### Community 13 - "createPool"
Cohesion: 0.22
Nodes (13): countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs(), createPool(), requireDatabaseUrl(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion() (+5 more)

### Community 14 - "users_sharan_desktop_dice_scaling_copy_lib_azure_createpool"
Cohesion: 0.17
Nodes (8): claimNextJob(), { createPool }, run(), { createPool }, fixMissingCAs(), { createPool }, pool, users_sharan_desktop_dice_scaling_copy_lib_azure_createpool

### Community 15 - "azure.js"
Cohesion: 0.27
Nodes (7): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute(), parseColumns(), { Pool }

### Community 16 - "apply-worker.js"
Cohesion: 0.20
Nodes (9): crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, useBrowserbase, maxConcurrent }, users_sharan_desktop_dice_scaling_copy_lib_browser_closebrowser, users_sharan_desktop_dice_scaling_copy_lib_browser_maxconcurrent, users_sharan_desktop_dice_scaling_copy_lib_browser_openbrowser, users_sharan_desktop_dice_scaling_copy_lib_browser_usebrowserbase, users_sharan_desktop_dice_scaling_copy_lib_logger_getclientprefix (+1 more)

### Community 17 - "executeQueuedApply"
Cohesion: 0.27
Nodes (10): getSessionRow(), readActiveSession(), storageStateIsValid(), acquirePreflight(), executeQueuedApply(), getAnyValidStorageState(), getJobName(), prevalidateJob() (+2 more)

### Community 18 - "job-application-db.js"
Cohesion: 0.20
Nodes (9): applyQueue, azure, { createApplyQueue }, { createServiceClient }, { getClientIdForChat }, { getClientPrefix, getJobDisplay }, users_sharan_desktop_dice_scaling_copy_lib_apply_queue_createapplyqueue, users_sharan_desktop_dice_scaling_copy_lib_azure_createserviceclient (+1 more)

### Community 19 - "applyToJobOnPage"
Cohesion: 0.22
Nodes (9): isVisibleEnabled(), loadApplyProfile(), applyToJobOnPage(), audit(), randomDelay(), runLogin(), sessionExpiredError(), typeWithHumanDelay() (+1 more)

### Community 20 - "sendMessage"
Cohesion: 0.32
Nodes (7): getSessionsPendingLogin(), { Bot }, getBot(), sendMessage(), sendMessageWithButtons(), node-telegram-bot-api, runPendingLoginsLoop()

### Community 21 - "handleConversationMessage"
Cohesion: 0.32
Nodes (8): linkTelegramChat(), deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP(), verifyOTP()

### Community 22 - "dice-session.js"
Cohesion: 0.33
Nodes (5): azure, { createServiceClient }, getClientIdForChat(), saveSession(), hasHandledJob()

### Community 23 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 24 - "saveAppliedJob"
Cohesion: 0.33
Nodes (6): saveAppliedJob(), audit(), handleJobCallback(), persistWorkflowPatch(), processCallbackUpdate(), sendOTPEmail()

### Community 25 - "job-scanner.js"
Cohesion: 0.40
Nodes (5): { createPool }, getJobsPendingPreflight(), readJobUrls(), updateJobPreflightStatus(), runPreflightLoop()

### Community 26 - "service-split.test.js"
Cohesion: 0.33
Nodes (5): lib_job_scanner_newday_lookback_ms, assert, { NEWDAY_LOOKBACK_MS }, { storageStateIsValid }, test

### Community 27 - "sendMessage"
Cohesion: 0.53
Nodes (6): beginSignIn(), handleCommand(), processMessageUpdate(), sendMessage(), sendMessageWithButtons(), startNewday()

### Community 28 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 29 - "create-operator.js"
Cohesion: 0.50
Nodes (3): args, { createPool }, email

## Knowledge Gaps
- **242 isolated node(s):** `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }`, `IGNORED_COLUMN_KEYS`, `INTENTS` (+237 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 318 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `start-bot.js`, `sync-daily-pipeline.js`, `scripts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `createPool()` connect `createPool` to `dashboard-server.js`, `sync-daily-pipeline.js`, `due-work-ticker.js`, `import-operators.js`, `users_sharan_desktop_dice_scaling_copy_lib_azure_createpool`, `azure.js`, `job-scanner.js`, `create-operator.js`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }` to the rest of the system?**
  _242 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.053297199638663056 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05069124423963134 - nodes in this community are weakly interconnected._
- **Should `dashboard-server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._