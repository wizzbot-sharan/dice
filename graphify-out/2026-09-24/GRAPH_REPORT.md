# Graph Report - Dice_scaling copy  (2026-09-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 602 nodes · 1121 edges · 24 communities (17 shown, 7 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 131 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `08134b5e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- start-worker.js
- dice-apply-questions.js
- frontend/package.json
- start-bot.js
- azure.js
- dashboard-server.js
- sync-daily-pipeline.js
- scripts
- browser.js
- due-work-ticker.js
- map-client-record.js
- resume-parser.js
- ref_node_test
- import-operators.js
- createWorkflowStateStore
- .oxlintrc.json
- 009_create_dice_archived_jobs.sql
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- re
- dice_apply_queue
- dice_workflow_sessions

## God Nodes (most connected - your core abstractions)
1. `createPool()` - 25 edges
2. `resolveQuestionAnswer()` - 20 edges
3. `createApplyQueue()` - 19 edges
4. `routeRequest()` - 19 edges
5. `scripts` - 14 edges
6. `sendJson()` - 13 edges
7. `applyToJobOnPage()` - 11 edges
8. `fillCheckboxGroups()` - 11 edges
9. `createServiceClient()` - 11 edges
10. `handleConversationMessage()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `handleJobCallback()` --indirect_call--> `getClientIdForChat()`  [INFERRED]
  start-bot.js → lib/dice-session.js
- `importOperators()` --calls--> `createPool()`  [EXTRACTED]
  scripts/import-operators.js → lib/azure.js
- `runSyncDaily()` --calls--> `createPool()`  [EXTRACTED]
  scripts/sync-daily-pipeline.js → lib/azure.js
- `handlePendingAnswerMessage()` --calls--> `findActivePendingQuestion()`  [EXTRACTED]
  start-bot.js → lib/pending-answers.js
- `handlePendingAnswerMessage()` --calls--> `recordPendingAnswer()`  [EXTRACTED]
  start-bot.js → lib/pending-answers.js

## Import Cycles
- None detected.

## Communities (24 total, 7 thin omitted)

### Community 0 - "start-worker.js"
Cohesion: 0.05
Nodes (68): createPool(), closeSharedBrowser(), isVisibleEnabled(), loadApplyProfile(), azure, { createServiceClient }, getClientIdForChat(), getSessionRow() (+60 more)

### Community 1 - "dice-apply-questions.js"
Cohesion: 0.07
Nodes (55): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), fillCheckboxGroups(), fillCurrentStep() (+47 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.05
Nodes (50): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+42 more)

### Community 3 - "start-bot.js"
Cohesion: 0.06
Nodes (53): linkTelegramChat(), saveAppliedJob(), { applyPromptDecision }, audit(), azure, beginSignIn(), { Bot }, { createDueWorkTicker } (+45 more)

### Community 4 - "azure.js"
Cohesion: 0.05
Nodes (29): createApplyQueue(), claimNextJob(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs(), { createPool }, assertIdentifier(), createQueryBuilder() (+21 more)

### Community 5 - "dashboard-server.js"
Cohesion: 0.08
Nodes (42): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+34 more)

### Community 6 - "sync-daily-pipeline.js"
Cohesion: 0.07
Nodes (31): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson(), getYesterdayDate() (+23 more)

### Community 7 - "scripts"
Cohesion: 0.06
Nodes (33): dependencies, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright, playwright-core (+25 more)

### Community 8 - "browser.js"
Cohesion: 0.09
Nodes (25): crypto, { openBrowser, closeBrowser, useBrowserbase, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), acquireBrowserTicket(), { chromium: localChromium }, closeBrowser() (+17 more)

### Community 9 - "due-work-ticker.js"
Cohesion: 0.09
Nodes (26): applyPromptDecision(), crypto, randomMinutes(), sendJobPrompt(), { applyPromptDecision, sendJobPrompt, randomMinutes }, createDueWorkTicker(), persistWorkflowPatch(), processDueChat() (+18 more)

### Community 10 - "map-client-record.js"
Cohesion: 0.15
Nodes (23): createServiceClient(), ref_path, { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean() (+15 more)

### Community 11 - "resume-parser.js"
Cohesion: 0.16
Nodes (19): calculateDurationYears(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill(), MONTH_NAMES (+11 more)

### Community 12 - "ref_node_test"
Cohesion: 0.17
Nodes (16): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), getAccessToken(), getAuthConfig() (+8 more)

### Community 13 - "import-operators.js"
Cohesion: 0.20
Nodes (12): ref_fs, { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText() (+4 more)

### Community 14 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 15 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 16 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

## Knowledge Gaps
- **228 isolated node(s):** `{ createPool }`, `{ createPool }`, `azure`, `{ createServiceClient }`, `assert` (+223 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 285 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `scripts` to `start-worker.js`, `start-bot.js`, `sync-daily-pipeline.js`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `createPool()` connect `start-worker.js` to `azure.js`, `dashboard-server.js`, `sync-daily-pipeline.js`, `due-work-ticker.js`, `import-operators.js`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ createPool }`, `{ createPool }`, `azure` to the rest of the system?**
  _228 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `start-worker.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05045045045045045 - nodes in this community are weakly interconnected._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.073224043715847 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05367231638418079 - nodes in this community are weakly interconnected._