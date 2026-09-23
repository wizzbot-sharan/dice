# Graph Report - Dice_scaling copy  (2026-09-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 530 nodes · 1027 edges · 25 communities (20 shown, 5 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 98 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2a70ffd5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- createPool
- start-bot.js
- dashboard-server.js
- apply-queue.test.js
- scripts
- sync-daily-pipeline.js
- map-client-record.js
- start-worker.js
- resume-parser.js
- browser.js
- import-operators.js
- apply-worker.js
- dice-session.js
- job-application-db.js
- .oxlintrc.json
- applyToJobOnPage
- 009_create_dice_archived_jobs.sql
- sendMessage
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
7. `scripts` - 14 edges
8. `sendJson()` - 13 edges
9. `createServiceClient()` - 12 edges
10. `fillCheckboxGroups()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `applyToJobOnPage()` --calls--> `fillCurrentStep()`  [EXTRACTED]
  start-worker.js → lib/dice-apply-questions.js
- `runLogin()` --calls--> `openBrowser()`  [EXTRACTED]
  start-worker.js → lib/browser.js
- `executeQueuedApply()` --calls--> `readActiveSession()`  [EXTRACTED]
  start-worker.js → lib/dice-session.js
- `executeQueuedApply()` --calls--> `saveAppliedJob()`  [EXTRACTED]
  start-worker.js → lib/job-application-db.js
- `executeQueuedApply()` --calls--> `sendMessage()`  [EXTRACTED]
  start-worker.js → lib/telegram-notify.js

## Import Cycles
- None detected.

## Communities (25 total, 5 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.07
Nodes (55): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), fillCheckboxGroups(), fillCurrentStep() (+47 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.05
Nodes (50): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+42 more)

### Community 2 - "createPool"
Cohesion: 0.06
Nodes (32): createApplyQueue(), claimNextJob(), countActiveQueueItems(), enqueueApplyJob(), { createPool }, assertIdentifier(), createPool(), createQueryBuilder() (+24 more)

### Community 3 - "start-bot.js"
Cohesion: 0.09
Nodes (36): linkTelegramChat(), createWorkflowStateStore(), audit(), azure, { Bot }, { createServiceClient }, { createWorkflowStateStore }, crypto (+28 more)

### Community 4 - "dashboard-server.js"
Cohesion: 0.11
Nodes (37): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+29 more)

### Community 5 - "apply-queue.test.js"
Cohesion: 0.09
Nodes (28): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), lib_job_scanner_newday_lookback_ms, getAccessToken() (+20 more)

### Community 6 - "scripts"
Cohesion: 0.06
Nodes (33): dependencies, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright, playwright-core (+25 more)

### Community 7 - "sync-daily-pipeline.js"
Cohesion: 0.09
Nodes (24): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson(), getYesterdayDate(), { mapImportItem } (+16 more)

### Community 8 - "map-client-record.js"
Cohesion: 0.15
Nodes (23): createServiceClient(), ref_fs, { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean() (+15 more)

### Community 9 - "start-worker.js"
Cohesion: 0.09
Nodes (25): closeSharedBrowser(), getJobsPendingPreflight(), updateJobPreflightStatus(), APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient } (+17 more)

### Community 10 - "resume-parser.js"
Cohesion: 0.16
Nodes (19): calculateDurationYears(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill(), MONTH_NAMES (+11 more)

### Community 11 - "browser.js"
Cohesion: 0.18
Nodes (13): { chromium: localChromium }, closeBrowser(), getSharedBrowser(), maxConcurrent, openBrowser(), openLocalBrowser(), RECYCLE_THRESHOLD, playwright (+5 more)

### Community 12 - "import-operators.js"
Cohesion: 0.20
Nodes (12): ref_path, { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText() (+4 more)

### Community 13 - "apply-worker.js"
Cohesion: 0.16
Nodes (11): crypto, { openBrowser, closeBrowser, useBrowserbase, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), lib_browser_usebrowserbase, ref_crypto, assert (+3 more)

### Community 14 - "dice-session.js"
Cohesion: 0.20
Nodes (13): azure, { createServiceClient }, getAllRegisteredUsers(), getSessionRow(), getSessionsPendingLogin(), readActiveSession(), saveSession(), storageStateIsValid() (+5 more)

### Community 15 - "job-application-db.js"
Cohesion: 0.28
Nodes (8): getClientIdForChat(), applyQueue, azure, { createApplyQueue }, { createServiceClient }, { getClientIdForChat }, hasHandledJob(), saveAppliedJob()

### Community 16 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 17 - "applyToJobOnPage"
Cohesion: 0.33
Nodes (6): isVisibleEnabled(), loadApplyProfile(), applyToJobOnPage(), randomDelay(), sessionExpiredError(), waitRandom()

### Community 18 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 19 - "sendMessage"
Cohesion: 0.60
Nodes (4): { Bot }, getBot(), sendMessage(), sendMessageWithButtons()

## Knowledge Gaps
- **199 isolated node(s):** `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }`, `IGNORED_COLUMN_KEYS`, `INTENTS` (+194 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 237 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createPool()` connect `createPool` to `start-worker.js`, `import-operators.js`, `sync-daily-pipeline.js`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `createApplyQueue()` connect `createPool` to `start-worker.js`, `apply-worker.js`, `apply-queue.test.js`, `job-application-db.js`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }` to the rest of the system?**
  _199 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.073224043715847 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05367231638418079 - nodes in this community are weakly interconnected._
- **Should `createPool` be split into smaller, more focused modules?**
  _Cohesion score 0.05587808417997097 - nodes in this community are weakly interconnected._