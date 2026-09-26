# Graph Report - Dice_scaling copy  (2026-09-26)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 642 nodes · 1171 edges · 33 communities (21 shown, 12 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 133 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d2ffad3a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- dashboard-server.js
- start-bot.js
- due-work-ticker.js
- createPool
- sync-daily-pipeline.js
- ref_node_assert
- scripts
- start-worker.js
- azure.js
- map-client-record.js
- browser.js
- createWorkflowStateStore
- apply-worker.js
- dice-session.js
- .oxlintrc.json
- applyToJobOnPage
- runLogin
- 009_create_dice_archived_jobs.sql
- sendMessage
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
8. `applyToJobOnPage()` - 11 edges
9. `handleConversationMessage()` - 11 edges
10. `sendMessage()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `applyToJobOnPage()` --calls--> `fillCurrentStep()`  [EXTRACTED]
  start-worker.js → lib/dice-apply-questions.js
- `importRecords()` --calls--> `createServiceClient()`  [EXTRACTED]
  scripts/import-clients.js → lib/azure.js
- `runSyncDaily()` --calls--> `createServiceClient()`  [EXTRACTED]
  scripts/sync-daily-pipeline.js → lib/azure.js
- `main()` --calls--> `createServiceClient()`  [EXTRACTED]
  scripts/verify-client-lookup.js → lib/azure.js
- `executeQueuedApply()` --calls--> `closeBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js

## Import Cycles
- None detected.

## Communities (33 total, 12 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.05
Nodes (74): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), fillCheckboxGroups(), fillCurrentStep() (+66 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.05
Nodes (53): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+45 more)

### Community 2 - "dashboard-server.js"
Cohesion: 0.08
Nodes (48): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+40 more)

### Community 3 - "start-bot.js"
Cohesion: 0.06
Nodes (49): linkTelegramChat(), { applyPromptDecision }, audit(), azure, beginSignIn(), { Bot }, { createDueWorkTicker }, createHttpServer() (+41 more)

### Community 4 - "due-work-ticker.js"
Cohesion: 0.07
Nodes (41): claimNextJob(), { createPool }, applyPromptDecision(), crypto, { getClientPrefix, getJobDisplay }, randomMinutes(), sendJobPrompt(), getClientIdForChat() (+33 more)

### Community 5 - "createPool"
Cohesion: 0.07
Nodes (29): createApplyQueue(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs(), createPool(), { createPool }, getJobsPendingPreflight(), readJobUrls() (+21 more)

### Community 6 - "sync-daily-pipeline.js"
Cohesion: 0.07
Nodes (32): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_crypto, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson() (+24 more)

### Community 7 - "ref_node_assert"
Cohesion: 0.08
Nodes (30): ENQUEUE_BATCH_CAP, companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), lib_job_scanner_newday_lookback_ms (+22 more)

### Community 8 - "scripts"
Cohesion: 0.06
Nodes (33): dependencies, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright, playwright-core (+25 more)

### Community 9 - "start-worker.js"
Cohesion: 0.06
Nodes (33): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile } (+25 more)

### Community 10 - "azure.js"
Cohesion: 0.09
Nodes (21): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute(), createServiceClient(), parseColumns(), { Pool } (+13 more)

### Community 11 - "map-client-record.js"
Cohesion: 0.20
Nodes (18): { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean(), asDate(), asInteger() (+10 more)

### Community 12 - "browser.js"
Cohesion: 0.15
Nodes (16): acquireBrowserTicket(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openBrowser(), openLocalBrowser() (+8 more)

### Community 13 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 14 - "apply-worker.js"
Cohesion: 0.17
Nodes (12): crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, useBrowserbase, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), users_sharan_desktop_dice_scaling_copy_lib_browser_closebrowser, users_sharan_desktop_dice_scaling_copy_lib_browser_maxconcurrent (+4 more)

### Community 15 - "dice-session.js"
Cohesion: 0.22
Nodes (11): azure, { createServiceClient }, getSessionRow(), readActiveSession(), storageStateIsValid(), acquirePreflight(), executeQueuedApply(), getJobName() (+3 more)

### Community 16 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 17 - "applyToJobOnPage"
Cohesion: 0.33
Nodes (6): isVisibleEnabled(), loadApplyProfile(), applyToJobOnPage(), randomDelay(), sessionExpiredError(), waitRandom()

### Community 18 - "runLogin"
Cohesion: 0.33
Nodes (6): getSessionsPendingLogin(), saveSession(), audit(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay()

### Community 19 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 20 - "sendMessage"
Cohesion: 0.60
Nodes (4): { Bot }, getBot(), sendMessage(), sendMessageWithButtons()

## Knowledge Gaps
- **237 isolated node(s):** `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }`, `IGNORED_COLUMN_KEYS`, `INTENTS` (+232 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 308 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `scripts` to `start-bot.js`, `sendMessage`, `sync-daily-pipeline.js`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `createPool()` connect `createPool` to `azure.js`, `dashboard-server.js`, `due-work-ticker.js`, `sync-daily-pipeline.js`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }` to the rest of the system?**
  _237 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.053297199638663056 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05069124423963134 - nodes in this community are weakly interconnected._
- **Should `dashboard-server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07619738751814223 - nodes in this community are weakly interconnected._