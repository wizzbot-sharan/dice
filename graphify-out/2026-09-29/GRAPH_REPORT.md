# Graph Report - Dice_scaling copy  (2026-09-29)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 656 nodes · 1190 edges · 39 communities (26 shown, 13 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 134 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2c1362f6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- sync-daily-pipeline.js
- azure.js
- dashboard-server.js
- due-work-ticker.js
- start-worker.js
- scripts
- start-bot.js
- createApplyQueue
- map-client-record.js
- browser.js
- import-operators.js
- createWorkflowStateStore
- apply-worker.js
- job-application-db.js
- executeQueuedApply
- handleConversationMessage
- dice-session.js
- .oxlintrc.json
- applyToJobOnPage
- saveAppliedJob
- sendMessage
- sendMessage
- 009_create_dice_archived_jobs.sql
- runLogin
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
1. `createPool()` - 28 edges
2. `routeRequest()` - 22 edges
3. `resolveQuestionAnswer()` - 20 edges
4. `createApplyQueue()` - 18 edges
5. `sendJson()` - 16 edges
6. `scripts` - 14 edges
7. `fillCheckboxGroups()` - 11 edges
8. `handleConversationMessage()` - 11 edges
9. `applyToJobOnPage()` - 11 edges
10. `saveAppliedJob()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `handleJobCallback()` --indirect_call--> `getClientIdForChat()`  [INFERRED]
  start-bot.js → lib/dice-session.js
- `applyToJobOnPage()` --calls--> `fillCurrentStep()`  [EXTRACTED]
  start-worker.js → lib/dice-apply-questions.js
- `runSyncDaily()` --calls--> `createServiceClient()`  [EXTRACTED]
  scripts/sync-daily-pipeline.js → lib/azure.js
- `main()` --calls--> `createServiceClient()`  [EXTRACTED]
  scripts/verify-client-lookup.js → lib/azure.js
- `executeQueuedApply()` --calls--> `closeBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js

## Import Cycles
- None detected.

## Communities (39 total, 13 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.05
Nodes (74): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), fillCheckboxGroups(), fillCurrentStep() (+66 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.05
Nodes (53): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+45 more)

### Community 2 - "sync-daily-pipeline.js"
Cohesion: 0.05
Nodes (48): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens() (+40 more)

### Community 3 - "azure.js"
Cohesion: 0.06
Nodes (40): claimNextJob(), assertIdentifier(), createPool(), createQueryBuilder(), builder, buildWhere(), execute(), parseColumns() (+32 more)

### Community 4 - "dashboard-server.js"
Cohesion: 0.08
Nodes (47): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+39 more)

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

### Community 9 - "createApplyQueue"
Cohesion: 0.07
Nodes (15): createApplyQueue(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs(), { createPool }, acquire(), assert, { createApplyQueue } (+7 more)

### Community 10 - "map-client-record.js"
Cohesion: 0.15
Nodes (23): createServiceClient(), ref_fs, { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean() (+15 more)

### Community 11 - "browser.js"
Cohesion: 0.16
Nodes (15): acquireBrowserTicket(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openBrowser(), openLocalBrowser() (+7 more)

### Community 12 - "import-operators.js"
Cohesion: 0.20
Nodes (12): ref_path, { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText() (+4 more)

### Community 13 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 14 - "apply-worker.js"
Cohesion: 0.20
Nodes (9): crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, useBrowserbase, maxConcurrent }, users_sharan_desktop_dice_scaling_copy_lib_browser_closebrowser, users_sharan_desktop_dice_scaling_copy_lib_browser_maxconcurrent, users_sharan_desktop_dice_scaling_copy_lib_browser_openbrowser, users_sharan_desktop_dice_scaling_copy_lib_browser_usebrowserbase, users_sharan_desktop_dice_scaling_copy_lib_logger_getclientprefix (+1 more)

### Community 15 - "job-application-db.js"
Cohesion: 0.20
Nodes (9): applyQueue, azure, { createApplyQueue }, { createServiceClient }, { getClientIdForChat }, { getClientPrefix, getJobDisplay }, users_sharan_desktop_dice_scaling_copy_lib_apply_queue_createapplyqueue, users_sharan_desktop_dice_scaling_copy_lib_azure_createserviceclient (+1 more)

### Community 16 - "executeQueuedApply"
Cohesion: 0.36
Nodes (8): getSessionRow(), readActiveSession(), acquirePreflight(), executeQueuedApply(), getJobName(), prevalidateJob(), refreshLogin(), releasePreflight()

### Community 17 - "handleConversationMessage"
Cohesion: 0.32
Nodes (8): linkTelegramChat(), deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP(), verifyOTP()

### Community 18 - "dice-session.js"
Cohesion: 0.33
Nodes (5): azure, { createServiceClient }, getClientIdForChat(), saveSession(), hasHandledJob()

### Community 19 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 20 - "applyToJobOnPage"
Cohesion: 0.33
Nodes (6): isVisibleEnabled(), loadApplyProfile(), applyToJobOnPage(), randomDelay(), sessionExpiredError(), waitRandom()

### Community 21 - "saveAppliedJob"
Cohesion: 0.33
Nodes (6): saveAppliedJob(), audit(), handleJobCallback(), persistWorkflowPatch(), processCallbackUpdate(), sendOTPEmail()

### Community 22 - "sendMessage"
Cohesion: 0.47
Nodes (5): { Bot }, getBot(), sendMessage(), sendMessageWithButtons(), node-telegram-bot-api

### Community 23 - "sendMessage"
Cohesion: 0.53
Nodes (6): beginSignIn(), handleCommand(), processMessageUpdate(), sendMessage(), sendMessageWithButtons(), startNewday()

### Community 24 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 25 - "runLogin"
Cohesion: 0.40
Nodes (5): getSessionsPendingLogin(), audit(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay()

## Knowledge Gaps
- **242 isolated node(s):** `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }`, `IGNORED_COLUMN_KEYS`, `INTENTS` (+237 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 317 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `start-bot.js`, `sync-daily-pipeline.js`, `scripts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `createPool()` connect `azure.js` to `sync-daily-pipeline.js`, `dashboard-server.js`, `due-work-ticker.js`, `createApplyQueue`, `import-operators.js`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }` to the rest of the system?**
  _242 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.053297199638663056 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05069124423963134 - nodes in this community are weakly interconnected._
- **Should `sync-daily-pipeline.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05028248587570622 - nodes in this community are weakly interconnected._