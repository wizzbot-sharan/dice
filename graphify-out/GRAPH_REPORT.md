# Graph Report - Dice_scaling copy  (2026-09-28)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 643 nodes · 1173 edges · 37 communities (25 shown, 12 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 134 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fd522ea2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- start-bot.js
- dashboard-server.js
- due-work-ticker.js
- sync-daily-pipeline.js
- start-worker.js
- ref_node_assert
- scripts
- map-client-record.js
- apply-worker.js
- browser.js
- createApplyQueue
- dice-session.js
- import-operators.js
- applyToJobOnPage
- service-split.test.js
- createPool
- azure.js
- execute
- start-dashboard.js
- apply-queue.test.js
- sendMessage
- .oxlintrc.json
- 009_create_dice_archived_jobs.sql
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
1. `createPool()` - 26 edges
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
- `handleJobCallback()` --indirect_call--> `saveAppliedJob()`  [INFERRED]
  start-bot.js → lib/job-application-db.js
- `applyToJobOnPage()` --calls--> `fillCurrentStep()`  [EXTRACTED]
  start-worker.js → lib/dice-apply-questions.js
- `executeQueuedApply()` --calls--> `closeBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js
- `prevalidateJob()` --calls--> `closeBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js

## Import Cycles
- None detected.

## Communities (37 total, 12 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.05
Nodes (74): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), fillCheckboxGroups(), fillCurrentStep() (+66 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.05
Nodes (53): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+45 more)

### Community 2 - "start-bot.js"
Cohesion: 0.05
Nodes (53): linkTelegramChat(), findActivePendingQuestion(), recordPendingAnswer(), { applyPromptDecision }, audit(), azure, beginSignIn(), { Bot } (+45 more)

### Community 3 - "dashboard-server.js"
Cohesion: 0.10
Nodes (42): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+34 more)

### Community 4 - "due-work-ticker.js"
Cohesion: 0.07
Nodes (38): applyPromptDecision(), crypto, { getClientPrefix, getJobDisplay }, randomMinutes(), sendJobPrompt(), { applyPromptDecision, sendJobPrompt, randomMinutes }, createDueWorkTicker(), persistWorkflowPatch() (+30 more)

### Community 5 - "sync-daily-pipeline.js"
Cohesion: 0.07
Nodes (32): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_crypto, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson() (+24 more)

### Community 6 - "start-worker.js"
Cohesion: 0.06
Nodes (35): closeSharedBrowser(), lib_browser_usebrowserbase, APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore } (+27 more)

### Community 7 - "ref_node_assert"
Cohesion: 0.09
Nodes (25): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), getAccessToken(), getAuthConfig() (+17 more)

### Community 8 - "scripts"
Cohesion: 0.06
Nodes (33): dependencies, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright, playwright-core (+25 more)

### Community 9 - "map-client-record.js"
Cohesion: 0.15
Nodes (22): createServiceClient(), { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean(), asDate() (+14 more)

### Community 10 - "apply-worker.js"
Cohesion: 0.12
Nodes (16): crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, useBrowserbase, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), assert, { createApplyQueue } (+8 more)

### Community 11 - "browser.js"
Cohesion: 0.18
Nodes (14): acquireBrowserTicket(), { chromium: localChromium }, closeBrowser(), getSharedBrowser(), maxConcurrent, openBrowser(), openLocalBrowser(), RECYCLE_THRESHOLD (+6 more)

### Community 12 - "createApplyQueue"
Cohesion: 0.13
Nodes (4): createApplyQueue(), claimNextJob(), { createPool }, users_sharan_desktop_dice_scaling_copy_lib_azure_createpool

### Community 13 - "dice-session.js"
Cohesion: 0.20
Nodes (12): azure, { createServiceClient }, getSessionRow(), readActiveSession(), storageStateIsValid(), acquirePreflight(), executeQueuedApply(), getAnyValidStorageState() (+4 more)

### Community 14 - "import-operators.js"
Cohesion: 0.22
Nodes (11): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+3 more)

### Community 15 - "applyToJobOnPage"
Cohesion: 0.18
Nodes (12): isVisibleEnabled(), loadApplyProfile(), getClientIdForChat(), saveSession(), hasHandledJob(), applyToJobOnPage(), audit(), randomDelay() (+4 more)

### Community 16 - "service-split.test.js"
Cohesion: 0.18
Nodes (10): lib_job_scanner_newday_lookback_ms, clearExpiredPendingQuestions(), { createPool }, getAnswerForQuestion(), savePendingQuestion(), createTelegramQuestionPrompt(), assert, { NEWDAY_LOOKBACK_MS } (+2 more)

### Community 17 - "createPool"
Cohesion: 0.29
Nodes (9): countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs(), createPool(), { createPool }, getJobsPendingPreflight(), readJobUrls(), updateJobPreflightStatus() (+1 more)

### Community 18 - "azure.js"
Cohesion: 0.25
Nodes (7): assertIdentifier(), parseColumns(), { Pool }, requireDatabaseUrl(), args, { createPool }, email

### Community 19 - "execute"
Cohesion: 0.39
Nodes (4): createQueryBuilder(), builder, buildWhere(), execute()

### Community 20 - "start-dashboard.js"
Cohesion: 0.25
Nodes (6): { createDashboardServer }, { createPool }, dashboardPort, dashboardServer, pool, server

### Community 21 - "apply-queue.test.js"
Cohesion: 0.32
Nodes (6): acquire(), assert, { createApplyQueue }, mockTask(), release(), test

### Community 22 - "sendMessage"
Cohesion: 0.38
Nodes (6): getSessionsPendingLogin(), { Bot }, getBot(), sendMessage(), sendMessageWithButtons(), runPendingLoginsLoop()

### Community 23 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 24 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

## Knowledge Gaps
- **237 isolated node(s):** `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }`, `IGNORED_COLUMN_KEYS`, `INTENTS` (+232 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 314 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `scripts` to `start-bot.js`, `sync-daily-pipeline.js`, `sendMessage`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `createApplyQueue()` connect `createApplyQueue` to `createPool`, `apply-worker.js`, `apply-queue.test.js`, `start-worker.js`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }` to the rest of the system?**
  _237 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.053297199638663056 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05069124423963134 - nodes in this community are weakly interconnected._
- **Should `start-bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05454545454545454 - nodes in this community are weakly interconnected._