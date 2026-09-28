# Graph Report - Dice_scaling copy  (2026-09-28)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 651 nodes · 1184 edges · 38 communities (25 shown, 13 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 134 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ba4e195b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- sync-daily-pipeline.js
- start-bot.js
- dashboard-server.js
- ref_node_assert
- due-work-ticker.js
- start-worker.js
- scripts
- apply-worker.js
- browser.js
- createApplyQueue
- dice-session.js
- import-operators.js
- azure.js
- service-split.test.js
- createPool
- execute
- executeQueuedApply
- start-dashboard.js
- .oxlintrc.json
- applyToJobOnPage
- sendMessage
- 009_create_dice_archived_jobs.sql
- create-operator.js
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- re
- dice_applied_jobs
- dice_apply_queue
- dice_workflow_sessions
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_randomminutes
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_sendjobprompt
- users_sharan_desktop_dice_scaling_copy_lib_browser_closesharedbrowser

## God Nodes (most connected - your core abstractions)
1. `createPool()` - 28 edges
2. `routeRequest()` - 22 edges
3. `resolveQuestionAnswer()` - 20 edges
4. `createApplyQueue()` - 19 edges
5. `sendJson()` - 16 edges
6. `scripts` - 14 edges
7. `fillCheckboxGroups()` - 11 edges
8. `applyToJobOnPage()` - 11 edges
9. `handleConversationMessage()` - 11 edges
10. `sendMessage()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `handleJobCallback()` --indirect_call--> `getClientIdForChat()`  [INFERRED]
  start-bot.js → lib/dice-session.js
- `handleConversationMessage()` --calls--> `linkTelegramChat()`  [EXTRACTED]
  start-bot.js → lib/dice-session.js
- `run()` --calls--> `createPool()`  [EXTRACTED]
  scripts/scratch-db-check.js → lib/azure.js
- `fixMissingCAs()` --calls--> `createPool()`  [EXTRACTED]
  scripts/scratch-db-fix.js → lib/azure.js
- `handleJobCallback()` --indirect_call--> `saveAppliedJob()`  [INFERRED]
  start-bot.js → lib/job-application-db.js

## Import Cycles
- None detected.

## Communities (38 total, 13 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.05
Nodes (74): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), fillCheckboxGroups(), fillCurrentStep() (+66 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.05
Nodes (53): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+45 more)

### Community 2 - "sync-daily-pipeline.js"
Cohesion: 0.06
Nodes (46): createServiceClient(), lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_crypto, { createServiceClient }, fs, importRecords(), { mapImportItem } (+38 more)

### Community 3 - "start-bot.js"
Cohesion: 0.06
Nodes (49): { applyPromptDecision }, audit(), azure, beginSignIn(), { Bot }, { createDueWorkTicker }, createHttpServer(), { createServiceClient } (+41 more)

### Community 4 - "dashboard-server.js"
Cohesion: 0.10
Nodes (42): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+34 more)

### Community 5 - "ref_node_assert"
Cohesion: 0.06
Nodes (33): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), getAccessToken(), getAuthConfig() (+25 more)

### Community 6 - "due-work-ticker.js"
Cohesion: 0.07
Nodes (38): applyPromptDecision(), crypto, { getClientPrefix, getJobDisplay }, randomMinutes(), sendJobPrompt(), { applyPromptDecision, sendJobPrompt, randomMinutes }, createDueWorkTicker(), persistWorkflowPatch() (+30 more)

### Community 7 - "start-worker.js"
Cohesion: 0.06
Nodes (35): closeSharedBrowser(), lib_browser_usebrowserbase, APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore } (+27 more)

### Community 8 - "scripts"
Cohesion: 0.06
Nodes (33): dependencies, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright, playwright-core (+25 more)

### Community 9 - "apply-worker.js"
Cohesion: 0.08
Nodes (23): { createPool }, crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, useBrowserbase, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), acquire() (+15 more)

### Community 10 - "browser.js"
Cohesion: 0.19
Nodes (13): acquireBrowserTicket(), { chromium: localChromium }, closeBrowser(), getSharedBrowser(), maxConcurrent, openBrowser(), openLocalBrowser(), RECYCLE_THRESHOLD (+5 more)

### Community 11 - "createApplyQueue"
Cohesion: 0.13
Nodes (4): createApplyQueue(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs()

### Community 12 - "dice-session.js"
Cohesion: 0.15
Nodes (13): azure, { createServiceClient }, getClientIdForChat(), getSessionsPendingLogin(), linkTelegramChat(), saveSession(), storageStateIsValid(), hasHandledJob() (+5 more)

### Community 13 - "import-operators.js"
Cohesion: 0.22
Nodes (11): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+3 more)

### Community 14 - "azure.js"
Cohesion: 0.20
Nodes (9): claimNextJob(), parseColumns(), { Pool }, requireDatabaseUrl(), { createPool }, run(), { createPool }, fixMissingCAs() (+1 more)

### Community 15 - "service-split.test.js"
Cohesion: 0.18
Nodes (10): { createPool }, getJobsPendingPreflight(), lib_job_scanner_newday_lookback_ms, readJobUrls(), updateJobPreflightStatus(), runPreflightLoop(), assert, { NEWDAY_LOOKBACK_MS } (+2 more)

### Community 16 - "createPool"
Cohesion: 0.36
Nodes (9): createPool(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion(), getAnswerForQuestion(), recordPendingAnswer(), savePendingQuestion(), handlePendingAnswerMessage() (+1 more)

### Community 17 - "execute"
Cohesion: 0.36
Nodes (5): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute()

### Community 18 - "executeQueuedApply"
Cohesion: 0.36
Nodes (8): getSessionRow(), readActiveSession(), acquirePreflight(), executeQueuedApply(), getJobName(), prevalidateJob(), refreshLogin(), releasePreflight()

### Community 19 - "start-dashboard.js"
Cohesion: 0.25
Nodes (6): { createDashboardServer }, { createPool }, dashboardPort, dashboardServer, pool, server

### Community 20 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 21 - "applyToJobOnPage"
Cohesion: 0.33
Nodes (6): isVisibleEnabled(), loadApplyProfile(), applyToJobOnPage(), randomDelay(), sessionExpiredError(), waitRandom()

### Community 22 - "sendMessage"
Cohesion: 0.47
Nodes (5): { Bot }, getBot(), sendMessage(), sendMessageWithButtons(), node-telegram-bot-api

### Community 23 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 24 - "create-operator.js"
Cohesion: 0.50
Nodes (3): args, { createPool }, email

## Knowledge Gaps
- **239 isolated node(s):** `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }`, `IGNORED_COLUMN_KEYS`, `INTENTS` (+234 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 318 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `scripts`, `start-bot.js`, `ref_node_assert`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `createApplyQueue()` connect `createApplyQueue` to `apply-worker.js`, `azure.js`, `start-worker.js`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `createPool()` connect `createPool` to `sync-daily-pipeline.js`, `due-work-ticker.js`, `createApplyQueue`, `import-operators.js`, `azure.js`, `service-split.test.js`, `execute`, `start-dashboard.js`, `create-operator.js`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }` to the rest of the system?**
  _239 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.053297199638663056 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05069124423963134 - nodes in this community are weakly interconnected._