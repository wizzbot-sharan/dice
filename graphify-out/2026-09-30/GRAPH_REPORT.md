# Graph Report - Dice_scaling copy  (2026-09-30)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 664 nodes · 1214 edges · 50 communities (27 shown, 23 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 134 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a480e5e4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- dashboard-server.js
- ref_node_assert
- sync-daily-pipeline.js
- start-bot.js
- scripts
- start-worker.js
- map-client-record.js
- apply-worker.js
- due-work-ticker.js
- getClientPrefix
- import-operators.js
- browser.js
- azure.js
- createPool
- createApplyQueue
- dice-session.js
- createDueWorkTicker
- execute
- runLogin
- service-split.test.js
- sendMessage
- .oxlintrc.json
- 009_create_dice_archived_jobs.sql
- create-operator.js
- prevalidateJob
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- re
- dice_applied_jobs
- dice_apply_queue
- dice_workflow_sessions
- lib_browser_usebrowserbase
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_randomminutes
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_sendjobprompt
- users_sharan_desktop_dice_scaling_copy_lib_dice_session_getclientidforchat
- users_sharan_desktop_dice_scaling_copy_lib_dice_session_getsessionrow
- users_sharan_desktop_dice_scaling_copy_lib_dice_session_getsessionspendinglogin
- users_sharan_desktop_dice_scaling_copy_lib_dice_session_linktelegramchat
- users_sharan_desktop_dice_scaling_copy_lib_dice_session_readactivesession
- users_sharan_desktop_dice_scaling_copy_lib_dice_session_savesession
- users_sharan_desktop_dice_scaling_copy_lib_dice_session_storagestateisvalid
- users_sharan_desktop_dice_scaling_copy_lib_job_application_db_applyqueue
- users_sharan_desktop_dice_scaling_copy_lib_job_application_db_saveappliedjob
- users_sharan_desktop_dice_scaling_copy_lib_telegram_notify_sendmessage

## God Nodes (most connected - your core abstractions)
1. `getClientPrefix()` - 27 edges
2. `createPool()` - 27 edges
3. `routeRequest()` - 22 edges
4. `resolveQuestionAnswer()` - 20 edges
5. `createApplyQueue()` - 18 edges
6. `sendJson()` - 16 edges
7. `scripts` - 14 edges
8. `getClientIdForChat()` - 12 edges
9. `applyToJobOnPage()` - 12 edges
10. `sendMessage()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `run()` --calls--> `createPool()`  [EXTRACTED]
  scripts/scratch-db-check.js → lib/azure.js
- `fixMissingCAs()` --calls--> `createPool()`  [EXTRACTED]
  scripts/scratch-db-fix.js → lib/azure.js
- `applyToJobOnPage()` --calls--> `fillCurrentStep()`  [EXTRACTED]
  start-worker.js → lib/dice-apply-questions.js
- `handleJobCallback()` --calls--> `applyPromptDecision()`  [EXTRACTED]
  start-bot.js → lib/bot-prompt-handler.js
- `applyToJobOnPage()` --calls--> `isVisibleEnabled()`  [EXTRACTED]
  start-worker.js → lib/dice-apply-questions.js

## Import Cycles
- None detected.

## Communities (50 total, 23 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.05
Nodes (74): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), fillCheckboxGroups(), fillCurrentStep() (+66 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.05
Nodes (53): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+45 more)

### Community 2 - "dashboard-server.js"
Cohesion: 0.08
Nodes (46): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+38 more)

### Community 3 - "ref_node_assert"
Cohesion: 0.07
Nodes (31): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), getAccessToken(), getAuthConfig() (+23 more)

### Community 4 - "sync-daily-pipeline.js"
Cohesion: 0.06
Nodes (33): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_crypto, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson() (+25 more)

### Community 5 - "start-bot.js"
Cohesion: 0.07
Nodes (37): linkTelegramChat(), { applyPromptDecision }, audit(), azure, { Bot }, { createDueWorkTicker }, createHttpServer(), { createServiceClient } (+29 more)

### Community 6 - "scripts"
Cohesion: 0.06
Nodes (34): dependencies, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright, playwright-core (+26 more)

### Community 7 - "start-worker.js"
Cohesion: 0.06
Nodes (31): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile } (+23 more)

### Community 8 - "map-client-record.js"
Cohesion: 0.15
Nodes (23): createServiceClient(), ref_path, { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean() (+15 more)

### Community 9 - "apply-worker.js"
Cohesion: 0.11
Nodes (17): { createPool }, crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, useBrowserbase, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), assert (+9 more)

### Community 10 - "due-work-ticker.js"
Cohesion: 0.14
Nodes (17): applyPromptDecision(), crypto, { getClientPrefix, getJobDisplay }, randomMinutes(), sendJobPrompt(), { applyPromptDecision, sendJobPrompt, randomMinutes }, { createPool }, { getClientPrefix } (+9 more)

### Community 11 - "getClientPrefix"
Cohesion: 0.20
Nodes (18): isVisibleEnabled(), loadApplyProfile(), getClientIdForChat(), getSessionRow(), readActiveSession(), hasHandledJob(), saveAppliedJob(), getClientPrefix() (+10 more)

### Community 12 - "import-operators.js"
Cohesion: 0.15
Nodes (15): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+7 more)

### Community 13 - "browser.js"
Cohesion: 0.16
Nodes (15): acquireBrowserTicket(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openBrowser(), openLocalBrowser() (+7 more)

### Community 14 - "azure.js"
Cohesion: 0.15
Nodes (11): claimNextJob(), parseColumns(), { Pool }, requireDatabaseUrl(), { createPool }, run(), { createPool }, fixMissingCAs() (+3 more)

### Community 15 - "createPool"
Cohesion: 0.22
Nodes (14): createPool(), { createPool }, getJobsPendingPreflight(), readJobUrls(), updateJobPreflightStatus(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion() (+6 more)

### Community 16 - "createApplyQueue"
Cohesion: 0.13
Nodes (4): createApplyQueue(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs()

### Community 17 - "dice-session.js"
Cohesion: 0.15
Nodes (11): azure, { createServiceClient }, { getClientPrefix }, applyQueue, azure, { createApplyQueue }, { createServiceClient }, { getClientIdForChat } (+3 more)

### Community 18 - "createDueWorkTicker"
Cohesion: 0.23
Nodes (10): createDueWorkTicker(), persistWorkflowPatch(), processDueChat(), start(), tick(), ENQUEUE_BATCH_CAP, listDueWorkflowChats(), assert (+2 more)

### Community 19 - "execute"
Cohesion: 0.36
Nodes (5): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute()

### Community 20 - "runLogin"
Cohesion: 0.25
Nodes (8): getSessionsPendingLogin(), saveSession(), audit(), randomDelay(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay(), waitRandom()

### Community 21 - "service-split.test.js"
Cohesion: 0.25
Nodes (7): storageStateIsValid(), lib_job_scanner_newday_lookback_ms, getAnyValidStorageState(), assert, { NEWDAY_LOOKBACK_MS }, { storageStateIsValid }, test

### Community 22 - "sendMessage"
Cohesion: 0.43
Nodes (7): beginSignIn(), handleCommand(), persistWorkflowPatch(), processMessageUpdate(), sendMessage(), sendMessageWithButtons(), startNewday()

### Community 23 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 24 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 25 - "create-operator.js"
Cohesion: 0.50
Nodes (3): args, { createPool }, email

### Community 26 - "prevalidateJob"
Cohesion: 0.50
Nodes (4): acquirePreflight(), getJobName(), prevalidateJob(), releasePreflight()

## Knowledge Gaps
- **247 isolated node(s):** `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }`, `IGNORED_COLUMN_KEYS`, `INTENTS` (+242 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 326 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `scripts` to `getClientPrefix`, `sync-daily-pipeline.js`, `start-bot.js`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `createPool()` connect `createPool` to `dashboard-server.js`, `sync-daily-pipeline.js`, `due-work-ticker.js`, `getClientPrefix`, `import-operators.js`, `azure.js`, `createApplyQueue`, `createDueWorkTicker`, `execute`, `create-operator.js`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }` to the rest of the system?**
  _247 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.053297199638663056 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05069124423963134 - nodes in this community are weakly interconnected._
- **Should `dashboard-server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0784313725490196 - nodes in this community are weakly interconnected._