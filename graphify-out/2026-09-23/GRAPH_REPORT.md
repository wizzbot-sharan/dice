# Graph Report - Dice_scaling copy  (2026-09-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 525 nodes · 1022 edges · 28 communities (23 shown, 5 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 98 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2a70ffd5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- start-bot.js
- apply-queue.test.js
- dashboard-server.js
- sync-daily-pipeline.js
- start-worker.js
- scripts
- map-client-record.js
- resume-parser.js
- apply-worker.js
- import-operators.js
- createApplyQueue
- createPool
- applyToJobOnPage
- dice-session.js
- job-application-db.js
- azure.js
- execute
- runLogin
- start-dashboard.js
- .oxlintrc.json
- 009_create_dice_archived_jobs.sql
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- re
- dice_apply_queue

## God Nodes (most connected - your core abstractions)
1. `createPool()` - 24 edges
2. `resolveQuestionAnswer()` - 20 edges
3. `routeRequest()` - 19 edges
4. `createApplyQueue()` - 18 edges
5. `runJobsLoop()` - 16 edges
6. `runSignInWorkflow()` - 14 edges
7. `sendJson()` - 13 edges
8. `createServiceClient()` - 12 edges
9. `scripts` - 12 edges
10. `fillCheckboxGroups()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `applyToJobOnPage()` --calls--> `fillCurrentStep()`  [EXTRACTED]
  start-worker.js → lib/dice-apply-questions.js
- `executeQueuedApply()` --calls--> `openBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js
- `prevalidateJob()` --calls--> `openBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js
- `runLogin()` --calls--> `openBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js
- `importOperators()` --calls--> `createPool()`  [EXTRACTED]
  scripts/import-operators.js → lib/azure.js

## Import Cycles
- None detected.

## Communities (28 total, 5 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.07
Nodes (55): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), fillCheckboxGroups(), fillCurrentStep() (+47 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.05
Nodes (50): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+42 more)

### Community 2 - "start-bot.js"
Cohesion: 0.08
Nodes (37): getAllRegisteredUsers(), linkTelegramChat(), createWorkflowStateStore(), audit(), azure, { Bot }, { createServiceClient }, { createWorkflowStateStore } (+29 more)

### Community 3 - "apply-queue.test.js"
Cohesion: 0.07
Nodes (32): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), lib_job_scanner_newday_lookback_ms, getAccessToken() (+24 more)

### Community 4 - "dashboard-server.js"
Cohesion: 0.11
Nodes (37): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+29 more)

### Community 5 - "sync-daily-pipeline.js"
Cohesion: 0.09
Nodes (24): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson(), getYesterdayDate(), { mapImportItem } (+16 more)

### Community 6 - "start-worker.js"
Cohesion: 0.09
Nodes (27): getJobsPendingPreflight(), updateJobPreflightStatus(), acquirePreflight(), APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient } (+19 more)

### Community 7 - "scripts"
Cohesion: 0.07
Nodes (27): dependencies, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright, playwright-core (+19 more)

### Community 8 - "map-client-record.js"
Cohesion: 0.15
Nodes (23): createServiceClient(), ref_path, { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean() (+15 more)

### Community 9 - "resume-parser.js"
Cohesion: 0.16
Nodes (19): calculateDurationYears(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill(), MONTH_NAMES (+11 more)

### Community 10 - "apply-worker.js"
Cohesion: 0.13
Nodes (16): crypto, { openBrowser, closeBrowser, useBrowserbase, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), { chromium: localChromium }, closeSharedBrowser(), getSharedBrowser() (+8 more)

### Community 11 - "import-operators.js"
Cohesion: 0.20
Nodes (12): ref_fs, { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText() (+4 more)

### Community 12 - "createApplyQueue"
Cohesion: 0.15
Nodes (3): createApplyQueue(), countActiveQueueItems(), enqueueApplyJob()

### Community 13 - "createPool"
Cohesion: 0.29
Nodes (9): createPool(), { createPool }, readJobUrls(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion(), getAnswerForQuestion(), recordPendingAnswer() (+1 more)

### Community 14 - "applyToJobOnPage"
Cohesion: 0.24
Nodes (10): isVisibleEnabled(), loadApplyProfile(), { Bot }, getBot(), sendMessage(), sendMessageWithButtons(), node-telegram-bot-api, applyToJobOnPage() (+2 more)

### Community 15 - "dice-session.js"
Cohesion: 0.29
Nodes (10): azure, { createServiceClient }, getClientIdForChat(), getSessionRow(), readActiveSession(), saveSession(), storageStateIsValid(), saveAppliedJob() (+2 more)

### Community 16 - "job-application-db.js"
Cohesion: 0.22
Nodes (7): { createPool }, applyQueue, azure, { createApplyQueue }, { createServiceClient }, { getClientIdForChat }, hasHandledJob()

### Community 17 - "azure.js"
Cohesion: 0.22
Nodes (7): claimNextJob(), parseColumns(), { Pool }, requireDatabaseUrl(), args, { createPool }, email

### Community 18 - "execute"
Cohesion: 0.36
Nodes (5): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute()

### Community 19 - "runLogin"
Cohesion: 0.25
Nodes (8): closeBrowser(), getSessionsPendingLogin(), audit(), randomDelay(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay(), waitRandom()

### Community 20 - "start-dashboard.js"
Cohesion: 0.25
Nodes (6): { createDashboardServer }, { createPool }, dashboardPort, dashboardServer, pool, server

### Community 21 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 22 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

## Knowledge Gaps
- **195 isolated node(s):** `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }`, `IGNORED_COLUMN_KEYS`, `INTENTS` (+190 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 233 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createPool()` connect `createPool` to `sync-daily-pipeline.js`, `start-worker.js`, `import-operators.js`, `createApplyQueue`, `job-application-db.js`, `azure.js`, `execute`, `start-dashboard.js`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `createApplyQueue()` connect `createApplyQueue` to `job-application-db.js`, `azure.js`, `apply-queue.test.js`, `start-worker.js`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }` to the rest of the system?**
  _195 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.073224043715847 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05367231638418079 - nodes in this community are weakly interconnected._
- **Should `start-bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08383838383838384 - nodes in this community are weakly interconnected._