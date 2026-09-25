# Graph Report - Dice_scaling copy  (2026-09-25)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 618 nodes · 1154 edges · 29 communities (20 shown, 9 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 133 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0fdeecc6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dice-apply-questions.js
- frontend/package.json
- start-bot.js
- dashboard-server.js
- due-work-ticker.js
- createApplyQueue
- sync-daily-pipeline.js
- ref_node_assert
- scripts
- start-worker.js
- map-client-record.js
- azure.js
- browser.js
- createPool
- import-operators.js
- service-split.test.js
- dice-session.js
- executeQueuedApply
- .oxlintrc.json
- 009_create_dice_archived_jobs.sql
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- re
- dice_apply_queue
- dice_workflow_sessions
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_randomminutes
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_sendjobprompt

## God Nodes (most connected - your core abstractions)
1. `createPool()` - 27 edges
2. `resolveQuestionAnswer()` - 20 edges
3. `routeRequest()` - 19 edges
4. `createApplyQueue()` - 18 edges
5. `scripts` - 14 edges
6. `sendJson()` - 13 edges
7. `fillCheckboxGroups()` - 11 edges
8. `handleConversationMessage()` - 11 edges
9. `sendMessage()` - 11 edges
10. `saveAppliedJob()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `handleJobCallback()` --indirect_call--> `getClientIdForChat()`  [INFERRED]
  start-bot.js → lib/dice-session.js
- `handleJobCallback()` --indirect_call--> `saveAppliedJob()`  [INFERRED]
  start-bot.js → lib/job-application-db.js
- `applyToJobOnPage()` --calls--> `fillCurrentStep()`  [EXTRACTED]
  start-worker.js → lib/dice-apply-questions.js
- `runSyncDaily()` --calls--> `createServiceClient()`  [EXTRACTED]
  scripts/sync-daily-pipeline.js → lib/azure.js
- `main()` --calls--> `createServiceClient()`  [EXTRACTED]
  scripts/verify-client-lookup.js → lib/azure.js

## Import Cycles
- None detected.

## Communities (29 total, 9 thin omitted)

### Community 0 - "dice-apply-questions.js"
Cohesion: 0.05
Nodes (74): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), fillCheckboxGroups(), fillCurrentStep() (+66 more)

### Community 1 - "frontend/package.json"
Cohesion: 0.05
Nodes (50): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+42 more)

### Community 2 - "start-bot.js"
Cohesion: 0.06
Nodes (49): linkTelegramChat(), { applyPromptDecision }, audit(), azure, beginSignIn(), { Bot }, { createDueWorkTicker }, createHttpServer() (+41 more)

### Community 3 - "dashboard-server.js"
Cohesion: 0.08
Nodes (44): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+36 more)

### Community 4 - "due-work-ticker.js"
Cohesion: 0.07
Nodes (38): applyPromptDecision(), crypto, { getClientPrefix, getJobDisplay }, randomMinutes(), sendJobPrompt(), { applyPromptDecision, sendJobPrompt, randomMinutes }, createDueWorkTicker(), persistWorkflowPatch() (+30 more)

### Community 5 - "createApplyQueue"
Cohesion: 0.06
Nodes (27): createApplyQueue(), claimNextJob(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs(), { createPool }, crypto, { getClientPrefix, getJobDisplay } (+19 more)

### Community 6 - "sync-daily-pipeline.js"
Cohesion: 0.07
Nodes (32): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_crypto, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson() (+24 more)

### Community 7 - "ref_node_assert"
Cohesion: 0.09
Nodes (25): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), getAccessToken(), getAuthConfig() (+17 more)

### Community 8 - "scripts"
Cohesion: 0.06
Nodes (33): dependencies, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright, playwright-core (+25 more)

### Community 9 - "start-worker.js"
Cohesion: 0.08
Nodes (28): closeSharedBrowser(), lib_browser_usebrowserbase, isVisibleEnabled(), loadApplyProfile(), APPLY_TIMEOUT_MINUTES, applyQueue, applyToJobOnPage(), azure (+20 more)

### Community 10 - "map-client-record.js"
Cohesion: 0.15
Nodes (23): createServiceClient(), ref_fs, { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean() (+15 more)

### Community 11 - "azure.js"
Cohesion: 0.17
Nodes (11): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute(), parseColumns(), { Pool }, requireDatabaseUrl() (+3 more)

### Community 12 - "browser.js"
Cohesion: 0.18
Nodes (14): acquireBrowserTicket(), { chromium: localChromium }, closeBrowser(), getSharedBrowser(), maxConcurrent, openBrowser(), openLocalBrowser(), RECYCLE_THRESHOLD (+6 more)

### Community 13 - "createPool"
Cohesion: 0.22
Nodes (14): createPool(), { createPool }, getJobsPendingPreflight(), readJobUrls(), updateJobPreflightStatus(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion() (+6 more)

### Community 14 - "import-operators.js"
Cohesion: 0.20
Nodes (12): ref_path, { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText() (+4 more)

### Community 15 - "service-split.test.js"
Cohesion: 0.18
Nodes (11): storageStateIsValid(), lib_job_scanner_newday_lookback_ms, { Bot }, getBot(), sendMessage(), sendMessageWithButtons(), getAnyValidStorageState(), assert (+3 more)

### Community 16 - "dice-session.js"
Cohesion: 0.20
Nodes (10): azure, { createServiceClient }, getClientIdForChat(), getSessionsPendingLogin(), saveSession(), hasHandledJob(), audit(), runLogin() (+2 more)

### Community 17 - "executeQueuedApply"
Cohesion: 0.36
Nodes (8): getSessionRow(), readActiveSession(), acquirePreflight(), executeQueuedApply(), getJobName(), prevalidateJob(), refreshLogin(), releasePreflight()

### Community 18 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 19 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

## Knowledge Gaps
- **235 isolated node(s):** `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }`, `IGNORED_COLUMN_KEYS`, `INTENTS` (+230 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 297 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `scripts` to `start-bot.js`, `sync-daily-pipeline.js`, `service-split.test.js`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `createPool()` connect `createPool` to `dashboard-server.js`, `due-work-ticker.js`, `createApplyQueue`, `sync-daily-pipeline.js`, `start-worker.js`, `azure.js`, `import-operators.js`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `createApplyQueue()` (e.g. with `apply-queue.js` and `claimNextJob()`) actually correct?**
  _`createApplyQueue()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }`, `{ findKnownAnswer, saveKnownAnswer }`, `{ getCandidateResumeData, getExperienceForSkill, searchResumeForAnswer }` to the rest of the system?**
  _235 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dice-apply-questions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.053297199638663056 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05367231638418079 - nodes in this community are weakly interconnected._
- **Should `start-bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._