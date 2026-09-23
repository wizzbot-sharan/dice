# Graph Report - Dice_scaling copy  (2026-09-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 599 nodes · 1118 edges · 38 communities (31 shown, 7 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 130 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `05728028`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- dashboard-server.js
- sync-daily-pipeline.js
- ref_node_assert
- start-bot.js
- scripts
- due-work-ticker.js
- start-worker.js
- map-client-record.js
- resume-parser.js
- browser.js
- createWorkflowStateStore
- import-operators.js
- createApplyQueue
- createPool
- job-application-db.js
- dice-session.js
- devDependencies
- handleConversationMessage
- execute
- start-dashboard.js
- apply-queue.test.js
- azure.js
- sendMessage
- .oxlintrc.json
- prevalidateJob
- sendMessage
- 009_create_dice_archived_jobs.sql
- runLogin
- create-operator.js
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- re
- dice_apply_queue
- dice_workflow_sessions

## God Nodes (most connected - your core abstractions)
1. `createPool()` - 25 edges
2. `resolveQuestionAnswer()` - 20 edges
3. `routeRequest()` - 19 edges
4. `createApplyQueue()` - 18 edges
5. `scripts` - 14 edges
6. `sendJson()` - 13 edges
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

## Communities (38 total, 7 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.07
Nodes (55): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), fillCheckboxGroups(), fillCurrentStep() (+47 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.07
Nodes (40): dependencies, axios, lucide-react, react, react-dom, react-router-dom, name, private (+32 more)

### Community 2 - "dashboard-server.js"
Cohesion: 0.10
Nodes (38): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+30 more)

### Community 3 - "sync-daily-pipeline.js"
Cohesion: 0.07
Nodes (31): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson(), getYesterdayDate() (+23 more)

### Community 4 - "ref_node_assert"
Cohesion: 0.08
Nodes (29): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), lib_job_scanner_newday_lookback_ms, getAccessToken() (+21 more)

### Community 5 - "start-bot.js"
Cohesion: 0.06
Nodes (33): { applyPromptDecision }, azure, { Bot }, { createDueWorkTicker }, createHttpServer(), { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore } (+25 more)

### Community 6 - "scripts"
Cohesion: 0.06
Nodes (33): dependencies, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright, playwright-core (+25 more)

### Community 7 - "due-work-ticker.js"
Cohesion: 0.11
Nodes (24): applyPromptDecision(), crypto, randomMinutes(), sendJobPrompt(), { applyPromptDecision, sendJobPrompt, randomMinutes }, createDueWorkTicker(), persistWorkflowPatch(), processDueChat() (+16 more)

### Community 8 - "start-worker.js"
Cohesion: 0.09
Nodes (27): closeSharedBrowser(), isVisibleEnabled(), loadApplyProfile(), APPLY_TIMEOUT_MINUTES, applyQueue, applyToJobOnPage(), azure, { createApplyQueue } (+19 more)

### Community 9 - "map-client-record.js"
Cohesion: 0.15
Nodes (22): createServiceClient(), { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean(), asDate() (+14 more)

### Community 10 - "resume-parser.js"
Cohesion: 0.16
Nodes (19): calculateDurationYears(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill(), MONTH_NAMES (+11 more)

### Community 11 - "browser.js"
Cohesion: 0.16
Nodes (16): crypto, { openBrowser, closeBrowser, useBrowserbase, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), acquireBrowserTicket(), { chromium: localChromium }, closeBrowser() (+8 more)

### Community 12 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 13 - "import-operators.js"
Cohesion: 0.22
Nodes (11): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+3 more)

### Community 14 - "createApplyQueue"
Cohesion: 0.15
Nodes (3): createApplyQueue(), countActiveQueueItems(), enqueueApplyJob()

### Community 15 - "createPool"
Cohesion: 0.27
Nodes (10): createPool(), { createPool }, getJobsPendingPreflight(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion(), getAnswerForQuestion(), recordPendingAnswer() (+2 more)

### Community 16 - "job-application-db.js"
Cohesion: 0.21
Nodes (11): getClientIdForChat(), applyQueue, azure, { createApplyQueue }, { createServiceClient }, { getClientIdForChat }, hasHandledJob(), saveAppliedJob() (+3 more)

### Community 17 - "dice-session.js"
Cohesion: 0.25
Nodes (9): azure, { createServiceClient }, getSessionRow(), readActiveSession(), saveSession(), storageStateIsValid(), executeQueuedApply(), getAnyValidStorageState() (+1 more)

### Community 18 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom (+2 more)

### Community 19 - "handleConversationMessage"
Cohesion: 0.24
Nodes (10): linkTelegramChat(), audit(), deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP() (+2 more)

### Community 20 - "execute"
Cohesion: 0.36
Nodes (5): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute()

### Community 21 - "start-dashboard.js"
Cohesion: 0.25
Nodes (6): { createDashboardServer }, { createPool }, dashboardPort, dashboardServer, pool, server

### Community 22 - "apply-queue.test.js"
Cohesion: 0.32
Nodes (6): acquire(), assert, { createApplyQueue }, mockTask(), release(), test

### Community 23 - "azure.js"
Cohesion: 0.29
Nodes (5): claimNextJob(), { createPool }, parseColumns(), { Pool }, requireDatabaseUrl()

### Community 24 - "sendMessage"
Cohesion: 0.48
Nodes (7): beginSignIn(), handleCommand(), handlePendingAnswerMessage(), processMessageUpdate(), sendMessage(), sendMessageWithButtons(), startNewday()

### Community 25 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 26 - "prevalidateJob"
Cohesion: 0.33
Nodes (6): updateJobPreflightStatus(), acquirePreflight(), getJobName(), prevalidateJob(), releasePreflight(), runPreflightLoop()

### Community 27 - "sendMessage"
Cohesion: 0.47
Nodes (5): { Bot }, getBot(), sendMessage(), sendMessageWithButtons(), node-telegram-bot-api

### Community 28 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 29 - "runLogin"
Cohesion: 0.40
Nodes (5): getSessionsPendingLogin(), audit(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay()

### Community 30 - "create-operator.js"
Cohesion: 0.50
Nodes (3): args, { createPool }, email

## Knowledge Gaps
- **228 isolated node(s):** `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }`, `IGNORED_COLUMN_KEYS`, `INTENTS` (+223 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 285 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `sync-daily-pipeline.js`, `start-bot.js`, `scripts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `createPool()` connect `createPool` to `sync-daily-pipeline.js`, `due-work-ticker.js`, `start-worker.js`, `import-operators.js`, `createApplyQueue`, `execute`, `start-dashboard.js`, `azure.js`, `prevalidateJob`, `create-operator.js`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }` to the rest of the system?**
  _228 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.073224043715847 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06938775510204082 - nodes in this community are weakly interconnected._
- **Should `dashboard-server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1048780487804878 - nodes in this community are weakly interconnected._