# Graph Report - Dice_scaling copy  (2026-09-26)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 641 nodes · 1170 edges · 38 communities (26 shown, 12 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 133 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `278b547d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- start-bot.js
- due-work-ticker.js
- dashboard-server.js
- createPool
- scripts
- start-worker.js
- createApplyQueue
- map-client-record.js
- browser.js
- dice-session.js
- createWorkflowStateStore
- import-operators.js
- apply-worker.js
- ref_node_assert
- sync-daily-pipeline.js
- sync-pipeline.test.js
- bot-webhook.test.js
- ref_node_test
- manager-role.test.js
- executeQueuedApply
- .oxlintrc.json
- applyToJobOnPage
- sendMessage
- 009_create_dice_archived_jobs.sql
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
1. `createPool()` - 26 edges
2. `routeRequest()` - 22 edges
3. `resolveQuestionAnswer()` - 20 edges
4. `createApplyQueue()` - 17 edges
5. `sendJson()` - 16 edges
6. `scripts` - 14 edges
7. `fillCheckboxGroups()` - 11 edges
8. `handleConversationMessage()` - 11 edges
9. `sendMessage()` - 11 edges
10. `applyToJobOnPage()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `applyToJobOnPage()` --calls--> `fillCurrentStep()`  [EXTRACTED]
  start-worker.js → lib/dice-apply-questions.js
- `executeQueuedApply()` --calls--> `closeBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js
- `prevalidateJob()` --calls--> `closeBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js
- `runLogin()` --calls--> `closeBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js
- `executeQueuedApply()` --calls--> `openBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js

## Import Cycles
- None detected.

## Communities (38 total, 12 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.05
Nodes (74): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), fillCheckboxGroups(), fillCurrentStep() (+66 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.05
Nodes (52): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+44 more)

### Community 2 - "start-bot.js"
Cohesion: 0.06
Nodes (49): linkTelegramChat(), { applyPromptDecision }, audit(), azure, beginSignIn(), { Bot }, { createDueWorkTicker }, createHttpServer() (+41 more)

### Community 3 - "due-work-ticker.js"
Cohesion: 0.07
Nodes (42): applyPromptDecision(), crypto, { getClientPrefix, getJobDisplay }, randomMinutes(), sendJobPrompt(), getClientIdForChat(), { applyPromptDecision, sendJobPrompt, randomMinutes }, createDueWorkTicker() (+34 more)

### Community 4 - "dashboard-server.js"
Cohesion: 0.10
Nodes (42): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+34 more)

### Community 5 - "createPool"
Cohesion: 0.08
Nodes (31): assertIdentifier(), createPool(), createQueryBuilder(), builder, buildWhere(), execute(), parseColumns(), { Pool } (+23 more)

### Community 6 - "scripts"
Cohesion: 0.06
Nodes (33): dependencies, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright, playwright-core (+25 more)

### Community 7 - "start-worker.js"
Cohesion: 0.06
Nodes (33): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile } (+25 more)

### Community 8 - "createApplyQueue"
Cohesion: 0.07
Nodes (17): createApplyQueue(), claimNextJob(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs(), { createPool }, acquire(), assert (+9 more)

### Community 9 - "map-client-record.js"
Cohesion: 0.15
Nodes (22): createServiceClient(), { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean(), asDate() (+14 more)

### Community 10 - "browser.js"
Cohesion: 0.16
Nodes (15): acquireBrowserTicket(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openBrowser(), openLocalBrowser() (+7 more)

### Community 11 - "dice-session.js"
Cohesion: 0.13
Nodes (14): azure, { createServiceClient }, getSessionsPendingLogin(), saveSession(), storageStateIsValid(), lib_job_scanner_newday_lookback_ms, audit(), runLogin() (+6 more)

### Community 12 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 13 - "import-operators.js"
Cohesion: 0.22
Nodes (11): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+3 more)

### Community 14 - "apply-worker.js"
Cohesion: 0.17
Nodes (12): crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, useBrowserbase, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), users_sharan_desktop_dice_scaling_copy_lib_browser_closebrowser, users_sharan_desktop_dice_scaling_copy_lib_browser_maxconcurrent (+4 more)

### Community 15 - "ref_node_assert"
Cohesion: 0.29
Nodes (10): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), ref_node_assert, assert (+2 more)

### Community 16 - "sync-daily-pipeline.js"
Cohesion: 0.29
Nodes (9): { createPool, createServiceClient }, deriveManagerLinks(), fetchJson(), getYesterdayDate(), { mapImportItem }, path, runSyncDaily(), syncCAs() (+1 more)

### Community 17 - "sync-pipeline.test.js"
Cohesion: 0.20
Nodes (8): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, assert, { createDashboardServer, syncCooldowns, SYNC_COOLDOWN_MS }, crypto, { getYesterdayDate, runSyncDaily }, stream, test

### Community 18 - "bot-webhook.test.js"
Cohesion: 0.20
Nodes (8): ref_http, ref_stream, assert, { Bot }, { createWebhookServer }, http, stream, test

### Community 19 - "ref_node_test"
Cohesion: 0.36
Nodes (7): getAccessToken(), getAuthConfig(), sendEmail(), ref_node_test, assert, { getAuthConfig, sendEmail }, test

### Community 20 - "manager-role.test.js"
Cohesion: 0.22
Nodes (7): ref_crypto, assert, { createDashboardServer }, crypto, { deriveManagerLinks, runSyncDaily }, stream, test

### Community 21 - "executeQueuedApply"
Cohesion: 0.36
Nodes (8): getSessionRow(), readActiveSession(), acquirePreflight(), executeQueuedApply(), getJobName(), prevalidateJob(), refreshLogin(), releasePreflight()

### Community 22 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 23 - "applyToJobOnPage"
Cohesion: 0.33
Nodes (6): isVisibleEnabled(), loadApplyProfile(), applyToJobOnPage(), randomDelay(), sessionExpiredError(), waitRandom()

### Community 24 - "sendMessage"
Cohesion: 0.47
Nodes (5): { Bot }, getBot(), sendMessage(), sendMessageWithButtons(), node-telegram-bot-api

### Community 25 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

## Knowledge Gaps
- **236 isolated node(s):** `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }`, `IGNORED_COLUMN_KEYS`, `INTENTS` (+231 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 307 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `start-bot.js`, `bot-webhook.test.js`, `scripts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `createPool()` connect `createPool` to `createApplyQueue`, `sync-daily-pipeline.js`, `due-work-ticker.js`, `import-operators.js`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }` to the rest of the system?**
  _236 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.053297199638663056 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05182443151771549 - nodes in this community are weakly interconnected._
- **Should `start-bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05731523378582202 - nodes in this community are weakly interconnected._