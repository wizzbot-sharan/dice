# Graph Report - Dice_scaling copy  (2026-09-26)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 641 nodes · 1168 edges · 40 communities (27 shown, 13 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 133 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `98fa01a9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- start-bot.js
- dashboard-server.js
- ref_node_assert
- sync-daily-pipeline.js
- due-work-ticker.js
- scripts
- start-worker.js
- map-client-record.js
- browser.js
- createPool
- createApplyQueue
- import-operators.js
- apply-worker.js
- dice-session.js
- job-matching.test.js
- execute
- azure.js
- start-dashboard.js
- apply-queue.test.js
- .oxlintrc.json
- applyToJobOnPage
- runLogin
- 009_create_dice_archived_jobs.sql
- sendMessage
- create-operator.js
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- os
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
- `handleJobCallback()` --indirect_call--> `saveAppliedJob()`  [INFERRED]
  start-bot.js → lib/job-application-db.js
- `applyToJobOnPage()` --calls--> `fillCurrentStep()`  [EXTRACTED]
  start-worker.js → lib/dice-apply-questions.js
- `executeQueuedApply()` --calls--> `closeBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js
- `prevalidateJob()` --calls--> `closeBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js
- `runLogin()` --calls--> `closeBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js

## Import Cycles
- None detected.

## Communities (40 total, 13 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.05
Nodes (74): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), fillCheckboxGroups(), fillCurrentStep() (+66 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.05
Nodes (50): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+42 more)

### Community 2 - "start-bot.js"
Cohesion: 0.06
Nodes (53): getClientIdForChat(), linkTelegramChat(), hasHandledJob(), { applyPromptDecision }, audit(), azure, beginSignIn(), { Bot } (+45 more)

### Community 3 - "dashboard-server.js"
Cohesion: 0.10
Nodes (42): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+34 more)

### Community 4 - "ref_node_assert"
Cohesion: 0.06
Nodes (29): ENQUEUE_BATCH_CAP, lib_job_scanner_newday_lookback_ms, getAccessToken(), getAuthConfig(), sendEmail(), createWorkflowStateStore(), claimTelegramUpdate(), clearConversation() (+21 more)

### Community 5 - "sync-daily-pipeline.js"
Cohesion: 0.07
Nodes (32): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_crypto, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson() (+24 more)

### Community 6 - "due-work-ticker.js"
Cohesion: 0.09
Nodes (34): applyPromptDecision(), crypto, { getClientPrefix, getJobDisplay }, randomMinutes(), sendJobPrompt(), { applyPromptDecision, sendJobPrompt, randomMinutes }, createDueWorkTicker(), persistWorkflowPatch() (+26 more)

### Community 7 - "scripts"
Cohesion: 0.06
Nodes (33): dependencies, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright, playwright-core (+25 more)

### Community 8 - "start-worker.js"
Cohesion: 0.06
Nodes (33): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile } (+25 more)

### Community 9 - "map-client-record.js"
Cohesion: 0.15
Nodes (22): createServiceClient(), { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean(), asDate() (+14 more)

### Community 10 - "browser.js"
Cohesion: 0.15
Nodes (16): acquireBrowserTicket(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openBrowser(), openLocalBrowser() (+8 more)

### Community 11 - "createPool"
Cohesion: 0.21
Nodes (14): createPool(), { createPool }, getJobsPendingPreflight(), readJobUrls(), updateJobPreflightStatus(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion() (+6 more)

### Community 12 - "createApplyQueue"
Cohesion: 0.14
Nodes (4): createApplyQueue(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs()

### Community 13 - "import-operators.js"
Cohesion: 0.22
Nodes (11): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+3 more)

### Community 14 - "apply-worker.js"
Cohesion: 0.17
Nodes (12): crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, useBrowserbase, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), users_sharan_desktop_dice_scaling_copy_lib_browser_closebrowser, users_sharan_desktop_dice_scaling_copy_lib_browser_maxconcurrent (+4 more)

### Community 15 - "dice-session.js"
Cohesion: 0.22
Nodes (11): azure, { createServiceClient }, getSessionRow(), readActiveSession(), storageStateIsValid(), acquirePreflight(), executeQueuedApply(), getJobName() (+3 more)

### Community 16 - "job-matching.test.js"
Cohesion: 0.33
Nodes (9): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), assert, { companyIsExcluded, jobMatchesProfile, roleMatchesJobTitle } (+1 more)

### Community 17 - "execute"
Cohesion: 0.36
Nodes (5): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute()

### Community 18 - "azure.js"
Cohesion: 0.29
Nodes (6): claimNextJob(), { createPool }, parseColumns(), { Pool }, requireDatabaseUrl(), users_sharan_desktop_dice_scaling_copy_lib_azure_createpool

### Community 19 - "start-dashboard.js"
Cohesion: 0.25
Nodes (6): { createDashboardServer }, { createPool }, dashboardPort, dashboardServer, pool, server

### Community 20 - "apply-queue.test.js"
Cohesion: 0.32
Nodes (6): acquire(), assert, { createApplyQueue }, mockTask(), release(), test

### Community 21 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 22 - "applyToJobOnPage"
Cohesion: 0.33
Nodes (6): isVisibleEnabled(), loadApplyProfile(), applyToJobOnPage(), randomDelay(), sessionExpiredError(), waitRandom()

### Community 23 - "runLogin"
Cohesion: 0.33
Nodes (6): getSessionsPendingLogin(), saveSession(), audit(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay()

### Community 24 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 25 - "sendMessage"
Cohesion: 0.60
Nodes (4): { Bot }, getBot(), sendMessage(), sendMessageWithButtons()

### Community 26 - "create-operator.js"
Cohesion: 0.50
Nodes (3): args, { createPool }, email

## Knowledge Gaps
- **235 isolated node(s):** `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }`, `IGNORED_COLUMN_KEYS`, `INTENTS` (+230 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 308 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `scripts` to `sendMessage`, `start-bot.js`, `sync-daily-pipeline.js`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `createPool()` connect `createPool` to `sync-daily-pipeline.js`, `due-work-ticker.js`, `createApplyQueue`, `import-operators.js`, `execute`, `azure.js`, `start-dashboard.js`, `create-operator.js`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }` to the rest of the system?**
  _235 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.053297199638663056 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05367231638418079 - nodes in this community are weakly interconnected._
- **Should `start-bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05519480519480519 - nodes in this community are weakly interconnected._