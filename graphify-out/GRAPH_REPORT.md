# Graph Report - Dice_scaling copy  (2026-10-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 737 nodes · 1357 edges · 53 communities (32 shown, 21 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 150 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fc001516`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- frontend/package.json
- due-work-ticker.js
- dashboard-server.js
- dice-apply-questions.js
- start-worker.js
- sync-daily-pipeline.js
- start-bot.js
- resume-parser.js
- scripts
- zoho-mail-reader.js
- ref_node_assert
- map-client-record.js
- browser.js
- getClientPrefix
- createApplyQueue
- azure.js
- createWorkflowStateStore
- import-operators.js
- dice-session.js
- sendMessage
- worker.js
- execute
- job-application-db.js
- handleConversationMessage
- service-split.test.js
- handleJobCallback
- ticker.js
- 001_v2_tables.sql
- .oxlintrc.json
- s3-screenshot.js
- 009_create_dice_archived_jobs.sql
- users_sharan_desktop_dice_scaling_copy_lib_azure_createpool
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- clients_additional_info
- dice_applied_jobs
- dice_applied_jobs_v2
- dice_apply_queue
- dice_workflow_sessions
- lib_browser_usebrowserbase
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_applypromptdecision
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_randomminutes
- users_sharan_desktop_dice_scaling_copy_lib_bot_prompt_handler_sendjobprompt
- users_sharan_desktop_dice_scaling_copy_lib_browser_usebrowserbase
- users_sharan_desktop_dice_scaling_copy_lib_due_work_ticker_createdueworkticker
- users_sharan_desktop_dice_scaling_copy_lib_job_scanner_getjobspendingpreflight
- users_sharan_desktop_dice_scaling_copy_v2_login_refreshlogin

## God Nodes (most connected - your core abstractions)
1. `createPool()` - 29 edges
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
- `handleJobCallback()` --indirect_call--> `sendMessage()`  [INFERRED]
  start-bot.js → lib/telegram-notify.js
- `handleJobCallback()` --indirect_call--> `saveKnownAnswer()`  [INFERRED]
  start-bot.js → lib/unknown-questions.js
- `handleJobCallback()` --calls--> `applyPromptDecision()`  [EXTRACTED]
  start-bot.js → lib/bot-prompt-handler.js

## Import Cycles
- None detected.

## Communities (53 total, 21 thin omitted)

### Community 0 - "frontend/package.json"
Cohesion: 0.05
Nodes (51): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+43 more)

### Community 1 - "due-work-ticker.js"
Cohesion: 0.05
Nodes (47): { createPool }, crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), applyPromptDecision() (+39 more)

### Community 2 - "dashboard-server.js"
Cohesion: 0.07
Nodes (50): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+42 more)

### Community 3 - "dice-apply-questions.js"
Cohesion: 0.08
Nodes (51): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), extractPreflightQuestions(), fillCheckboxGroups() (+43 more)

### Community 4 - "start-worker.js"
Cohesion: 0.05
Nodes (40): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile, readTotalStepCount, extractPreflightQuestions } (+32 more)

### Community 5 - "sync-daily-pipeline.js"
Cohesion: 0.06
Nodes (32): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson(), getYesterdayDate() (+24 more)

### Community 6 - "start-bot.js"
Cohesion: 0.05
Nodes (37): { applyPromptDecision }, azure, bot, { createDueWorkTicker }, createHttpServer(), { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore } (+29 more)

### Community 7 - "resume-parser.js"
Cohesion: 0.09
Nodes (32): calculateDurationYears(), clearResumeCache(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill() (+24 more)

### Community 8 - "scripts"
Cohesion: 0.06
Nodes (35): dependencies, @aws-sdk/client-s3, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright (+27 more)

### Community 9 - "zoho-mail-reader.js"
Cohesion: 0.12
Nodes (26): closeBrowser(), openBrowser(), fs, getZohoSessionState(), loginToZohoAdmin(), { openBrowser, closeBrowser }, path, saveZohoSessionState() (+18 more)

### Community 10 - "ref_node_assert"
Cohesion: 0.11
Nodes (22): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), getAccessToken(), getAuthConfig() (+14 more)

### Community 11 - "map-client-record.js"
Cohesion: 0.15
Nodes (22): createServiceClient(), { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean(), asDate() (+14 more)

### Community 12 - "browser.js"
Cohesion: 0.17
Nodes (15): acquireBrowserTicket(), cancelIdleTimeout(), { chromium: localChromium }, closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openLocalBrowser(), RECYCLE_THRESHOLD (+7 more)

### Community 13 - "getClientPrefix"
Cohesion: 0.21
Nodes (17): isVisibleEnabled(), loadApplyProfile(), readTotalStepCount(), getClientIdForChat(), getSessionRow(), readActiveSession(), hasHandledJob(), saveAppliedJob() (+9 more)

### Community 14 - "createApplyQueue"
Cohesion: 0.13
Nodes (3): createApplyQueue(), countActiveQueueItems(), recoverStuckJobs()

### Community 15 - "azure.js"
Cohesion: 0.20
Nodes (12): claimNextJob(), enqueueApplyJob(), createPool(), { Pool }, requireDatabaseUrl(), clearExpiredPendingQuestions(), { createPool }, findActivePendingQuestion() (+4 more)

### Community 16 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 17 - "import-operators.js"
Cohesion: 0.22
Nodes (11): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+3 more)

### Community 18 - "dice-session.js"
Cohesion: 0.18
Nodes (10): azure, { createServiceClient }, { getClientPrefix }, getSessionsPendingLogin(), saveSession(), audit(), runLogin(), runPendingLoginsLoop() (+2 more)

### Community 19 - "sendMessage"
Cohesion: 0.26
Nodes (11): { Bot }, getBot(), { getClientPrefix }, sendMessage(), sendMessageWithButtons(), node-telegram-bot-api, beginSignIn(), handleCommand() (+3 more)

### Community 20 - "worker.js"
Cohesion: 0.22
Nodes (9): users_sharan_desktop_dice_scaling_copy_lib_zoho_mail_reader_verifyjobapplicationemail, users_sharan_desktop_dice_scaling_copy_v2_ticker_startticker, { startTicker }, { startWorkers }, { blindApply }, { createPool }, startWorkers(), { verifyJobApplicationEmail } (+1 more)

### Community 21 - "execute"
Cohesion: 0.31
Nodes (6): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute(), parseColumns()

### Community 22 - "job-application-db.js"
Cohesion: 0.20
Nodes (9): applyQueue, azure, { createApplyQueue }, { createServiceClient, createPool }, { getClientIdForChat }, { getClientPrefix, getJobDisplay }, patchJobProof(), users_sharan_desktop_dice_scaling_copy_lib_apply_queue_createapplyqueue (+1 more)

### Community 23 - "handleConversationMessage"
Cohesion: 0.32
Nodes (8): linkTelegramChat(), deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP(), verifyOTP()

### Community 24 - "service-split.test.js"
Cohesion: 0.25
Nodes (7): storageStateIsValid(), lib_job_scanner_newday_lookback_ms, assert, { NEWDAY_LOOKBACK_MS }, { storageStateIsValid }, test, users_sharan_desktop_dice_scaling_copy_lib_dice_session_storagestateisvalid

### Community 25 - "handleJobCallback"
Cohesion: 0.29
Nodes (8): getAnswerForQuestion(), savePendingQuestion(), audit(), handleJobCallback(), persistWorkflowPatch(), processCallbackUpdate(), sendOTPEmail(), createTelegramQuestionPrompt()

### Community 26 - "ticker.js"
Cohesion: 0.29
Nodes (7): bootV2(), { createPool }, runTicker(), startTicker(), V2_COOLDOWN_MAX, V2_COOLDOWN_MIN, V2_DAILY_LIMIT

### Community 27 - "001_v2_tables.sql"
Cohesion: 0.48
Nodes (6): dice_applied_jobs_v2, dice_apply_queue_v2, idx_applied_jobs_v2_applywizz_id, idx_applied_jobs_v2_status, idx_apply_queue_v2_applywizz_id, idx_apply_queue_v2_status

### Community 28 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 29 - "s3-screenshot.js"
Cohesion: 0.53
Nodes (5): getS3Client(), hasAwsS3Config(), { S3Client, PutObjectCommand }, uploadScreenshot(), @aws-sdk/client-s3

### Community 30 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 31 - "users_sharan_desktop_dice_scaling_copy_lib_azure_createpool"
Cohesion: 0.40
Nodes (4): { createPool }, readJobUrls(), updateJobPreflightStatus(), users_sharan_desktop_dice_scaling_copy_lib_azure_createpool

## Knowledge Gaps
- **274 isolated node(s):** `axios`, `lucide-react`, `react`, `react-dom`, `react-router-dom` (+269 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 364 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `scripts`, `sync-daily-pipeline.js`, `start-bot.js`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `createPool()` connect `azure.js` to `due-work-ticker.js`, `dashboard-server.js`, `sync-daily-pipeline.js`, `zoho-mail-reader.js`, `getClientPrefix`, `createApplyQueue`, `import-operators.js`, `execute`, `job-application-db.js`, `handleJobCallback`, `ticker.js`, `users_sharan_desktop_dice_scaling_copy_lib_azure_createpool`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `sendMessage()` (e.g. with `processDueChat()` and `telegram-notify.js`) actually correct?**
  _`sendMessage()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `axios`, `lucide-react`, `react` to the rest of the system?**
  _274 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05084745762711865 - nodes in this community are weakly interconnected._
- **Should `due-work-ticker.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05325814536340852 - nodes in this community are weakly interconnected._
- **Should `dashboard-server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07012987012987013 - nodes in this community are weakly interconnected._