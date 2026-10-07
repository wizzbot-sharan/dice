# Graph Report - Dice_scaling copy  (2026-10-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 734 nodes · 1363 edges · 41 communities (23 shown, 18 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 152 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `25d3844a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- frontend/package.json
- due-work-ticker.js
- azure.js
- dice-apply-questions.js
- dashboard-server.js
- browser.js
- start-bot.js
- start-worker.js
- sync-daily-pipeline.js
- resume-parser.js
- scripts
- ref_node_assert
- map-client-record.js
- start-v2.js
- getClientPrefix
- sendMessage
- createWorkflowStateStore
- import-operators.js
- dice-session.js
- job-application-db.js
- 001_v2_tables.sql
- .oxlintrc.json
- 009_create_dice_archived_jobs.sql
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- clients_additional_info
- dice_applied_jobs
- dice_apply_queue
- dice_workflow_sessions
- lib_browser_usebrowserbase
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_applypromptdecision
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_randomminutes
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_sendjobprompt
- users_sharan_desktop_dice_scaling_copy_lib_browser_usebrowserbase
- users_sharan_desktop_dice_scaling_copy_lib_due_work_ticker_createdueworkticker
- users_sharan_desktop_dice_scaling_copy_lib_job_scanner_getjobspendingpreflight

## God Nodes (most connected - your core abstractions)
1. `createPool()` - 30 edges
2. `routeRequest()` - 22 edges
3. `getClientPrefix()` - 21 edges
4. `resolveQuestionAnswer()` - 21 edges
5. `sendMessage()` - 20 edges
6. `createApplyQueue()` - 19 edges
7. `applyToJobOnPage()` - 16 edges
8. `sendJson()` - 16 edges
9. `scripts` - 15 edges
10. `processDueChat()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `handleJobCallback()` --indirect_call--> `getClientIdForChat()`  [INFERRED]
  start-bot.js → lib/dice-session.js
- `handleJobCallback()` --indirect_call--> `saveAppliedJob()`  [INFERRED]
  start-bot.js → lib/job-application-db.js
- `handleJobCallback()` --indirect_call--> `getAnswerForQuestion()`  [INFERRED]
  start-bot.js → lib/pending-answers.js
- `handleJobCallback()` --indirect_call--> `savePendingQuestion()`  [INFERRED]
  start-bot.js → lib/pending-answers.js
- `handleJobCallback()` --indirect_call--> `saveKnownAnswer()`  [INFERRED]
  start-bot.js → lib/unknown-questions.js

## Import Cycles
- None detected.

## Communities (41 total, 18 thin omitted)

### Community 0 - "frontend/package.json"
Cohesion: 0.05
Nodes (51): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+43 more)

### Community 1 - "due-work-ticker.js"
Cohesion: 0.05
Nodes (48): { createPool }, crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), applyPromptDecision() (+40 more)

### Community 2 - "azure.js"
Cohesion: 0.05
Nodes (35): createApplyQueue(), claimNextJob(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs(), assertIdentifier(), createPool(), createQueryBuilder() (+27 more)

### Community 3 - "dice-apply-questions.js"
Cohesion: 0.08
Nodes (51): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), extractPreflightQuestions(), fillCheckboxGroups() (+43 more)

### Community 4 - "dashboard-server.js"
Cohesion: 0.08
Nodes (48): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+40 more)

### Community 5 - "browser.js"
Cohesion: 0.07
Nodes (44): acquireBrowserTicket(), cancelIdleTimeout(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openBrowser() (+36 more)

### Community 6 - "start-bot.js"
Cohesion: 0.05
Nodes (43): { applyPromptDecision }, azure, bot, { createDueWorkTicker }, createHttpServer(), { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore } (+35 more)

### Community 7 - "start-worker.js"
Cohesion: 0.05
Nodes (41): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile, readTotalStepCount, extractPreflightQuestions } (+33 more)

### Community 8 - "sync-daily-pipeline.js"
Cohesion: 0.06
Nodes (32): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson(), getYesterdayDate() (+24 more)

### Community 9 - "resume-parser.js"
Cohesion: 0.09
Nodes (32): calculateDurationYears(), clearResumeCache(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill() (+24 more)

### Community 10 - "scripts"
Cohesion: 0.06
Nodes (35): dependencies, @aws-sdk/client-s3, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright (+27 more)

### Community 11 - "ref_node_assert"
Cohesion: 0.11
Nodes (22): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), getAccessToken(), getAuthConfig() (+14 more)

### Community 12 - "map-client-record.js"
Cohesion: 0.15
Nodes (22): createServiceClient(), { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean(), asDate() (+14 more)

### Community 13 - "start-v2.js"
Cohesion: 0.12
Nodes (20): users_sharan_desktop_dice_scaling_copy_lib_zoho_mail_reader_verifyjobapplicationemail, { createPool }, runEmailVerifier(), startEmailVerifier(), { verifyJobApplicationEmail }, main(), { startEmailVerifier }, { startTicker } (+12 more)

### Community 14 - "getClientPrefix"
Cohesion: 0.20
Nodes (18): isVisibleEnabled(), loadApplyProfile(), readTotalStepCount(), getClientIdForChat(), getSessionRow(), readActiveSession(), hasHandledJob(), patchJobProof() (+10 more)

### Community 15 - "sendMessage"
Cohesion: 0.18
Nodes (15): { Bot }, getBot(), { getClientPrefix }, sendMessage(), sendMessageWithButtons(), node-telegram-bot-api, audit(), beginSignIn() (+7 more)

### Community 16 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 17 - "import-operators.js"
Cohesion: 0.22
Nodes (11): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+3 more)

### Community 18 - "dice-session.js"
Cohesion: 0.17
Nodes (11): azure, { createServiceClient }, { getClientPrefix }, getSessionsPendingLogin(), linkTelegramChat(), saveSession(), audit(), runLogin() (+3 more)

### Community 19 - "job-application-db.js"
Cohesion: 0.22
Nodes (8): applyQueue, azure, { createApplyQueue }, { createServiceClient, createPool }, { getClientIdForChat }, { getClientPrefix, getJobDisplay }, users_sharan_desktop_dice_scaling_copy_lib_apply_queue_createapplyqueue, users_sharan_desktop_dice_scaling_copy_lib_dice_session_getclientidforchat

### Community 20 - "001_v2_tables.sql"
Cohesion: 0.48
Nodes (6): dice_applied_jobs_v2, dice_apply_queue_v2, idx_applied_jobs_v2_applywizz_id, idx_applied_jobs_v2_status, idx_apply_queue_v2_applywizz_id, idx_apply_queue_v2_status

### Community 21 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 22 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

## Knowledge Gaps
- **274 isolated node(s):** `axios`, `lucide-react`, `react`, `react-dom`, `react-router-dom` (+269 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 360 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `sync-daily-pipeline.js`, `scripts`, `start-bot.js`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `createPool()` connect `azure.js` to `due-work-ticker.js`, `dashboard-server.js`, `browser.js`, `sync-daily-pipeline.js`, `start-v2.js`, `getClientPrefix`, `import-operators.js`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `sendMessage()` (e.g. with `processDueChat()` and `telegram-notify.js`) actually correct?**
  _`sendMessage()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `axios`, `lucide-react`, `react` to the rest of the system?**
  _274 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05084745762711865 - nodes in this community are weakly interconnected._
- **Should `due-work-ticker.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05384150030248034 - nodes in this community are weakly interconnected._
- **Should `azure.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05194805194805195 - nodes in this community are weakly interconnected._