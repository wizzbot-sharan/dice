# Graph Report - Dice_scaling copy  (2026-10-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 729 nodes · 1347 edges · 47 communities (29 shown, 18 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 151 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a8f5af23`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- frontend/package.json
- dashboard-server.js
- azure.js
- dice-apply-questions.js
- ref_node_assert
- sync-daily-pipeline.js
- start-bot.js
- start-worker.js
- resume-parser.js
- scripts
- map-client-record.js
- due-work-ticker.js
- browser.js
- start-v2.js
- getClientPrefix
- apply-worker.js
- sendMessage
- blind-apply.js
- createWorkflowStateStore
- job-application-db.js
- zoho-mail-reader.js
- processDueChat
- runLogin
- handleConversationMessage
- 001_v2_tables.sql
- .oxlintrc.json
- prevalidateJob
- s3-screenshot.js
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
1. `createPool()` - 29 edges
2. `routeRequest()` - 22 edges
3. `getClientPrefix()` - 21 edges
4. `resolveQuestionAnswer()` - 21 edges
5. `sendMessage()` - 20 edges
6. `createApplyQueue()` - 19 edges
7. `sendJson()` - 16 edges
8. `applyToJobOnPage()` - 16 edges
9. `scripts` - 15 edges
10. `getClientIdForChat()` - 11 edges

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

## Communities (47 total, 18 thin omitted)

### Community 0 - "frontend/package.json"
Cohesion: 0.05
Nodes (51): dependencies, axios, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+43 more)

### Community 1 - "dashboard-server.js"
Cohesion: 0.07
Nodes (53): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+45 more)

### Community 2 - "azure.js"
Cohesion: 0.05
Nodes (34): createApplyQueue(), claimNextJob(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs(), assertIdentifier(), createPool(), createQueryBuilder() (+26 more)

### Community 3 - "dice-apply-questions.js"
Cohesion: 0.08
Nodes (51): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), extractPreflightQuestions(), fillCheckboxGroups() (+43 more)

### Community 4 - "ref_node_assert"
Cohesion: 0.07
Nodes (34): storageStateIsValid(), companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), lib_job_scanner_newday_lookback_ms (+26 more)

### Community 5 - "sync-daily-pipeline.js"
Cohesion: 0.06
Nodes (33): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, ref_crypto, ref_http, ref_stream, { createPool, createServiceClient }, deriveManagerLinks(), fetchJson() (+25 more)

### Community 6 - "start-bot.js"
Cohesion: 0.05
Nodes (37): { applyPromptDecision }, azure, bot, { createDueWorkTicker }, createHttpServer(), { createServiceClient }, { createWebhookServer }, { createWorkflowStateStore } (+29 more)

### Community 7 - "start-worker.js"
Cohesion: 0.05
Nodes (39): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile, readTotalStepCount, extractPreflightQuestions } (+31 more)

### Community 8 - "resume-parser.js"
Cohesion: 0.09
Nodes (32): calculateDurationYears(), clearResumeCache(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill() (+24 more)

### Community 9 - "scripts"
Cohesion: 0.06
Nodes (35): dependencies, @aws-sdk/client-s3, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright (+27 more)

### Community 10 - "map-client-record.js"
Cohesion: 0.15
Nodes (22): createServiceClient(), { createServiceClient }, fs, importRecords(), { mapImportItem }, path, asBoolean(), asDate() (+14 more)

### Community 11 - "due-work-ticker.js"
Cohesion: 0.13
Nodes (19): applyPromptDecision(), collectAndSavePreflightAnswer(), { createPool }, crypto, { getClientPrefix, getJobDisplay }, randomMinutes(), sendJobPrompt(), { applyPromptDecision, sendJobPrompt, randomMinutes } (+11 more)

### Community 12 - "browser.js"
Cohesion: 0.17
Nodes (16): acquireBrowserTicket(), cancelIdleTimeout(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openLocalBrowser() (+8 more)

### Community 13 - "start-v2.js"
Cohesion: 0.15
Nodes (15): users_sharan_desktop_dice_scaling_copy_lib_zoho_mail_reader_verifyjobapplicationemail, { createPool }, runEmailVerifier(), startEmailVerifier(), { verifyJobApplicationEmail }, main(), { startEmailVerifier }, { startTicker } (+7 more)

### Community 14 - "getClientPrefix"
Cohesion: 0.22
Nodes (15): isVisibleEnabled(), azure, { createServiceClient }, getClientIdForChat(), { getClientPrefix }, getSessionRow(), linkTelegramChat(), readActiveSession() (+7 more)

### Community 15 - "apply-worker.js"
Cohesion: 0.15
Nodes (12): crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), assert, { createApplyQueue } (+4 more)

### Community 16 - "sendMessage"
Cohesion: 0.20
Nodes (14): { Bot }, getBot(), { getClientPrefix }, sendMessage(), sendMessageWithButtons(), node-telegram-bot-api, audit(), beginSignIn() (+6 more)

### Community 17 - "blind-apply.js"
Cohesion: 0.18
Nodes (13): users_sharan_desktop_dice_scaling_copy_lib_browser_closebrowser, users_sharan_desktop_dice_scaling_copy_lib_browser_openbrowser, users_sharan_desktop_dice_scaling_copy_lib_s3_screenshot_uploadscreenshot, blindApply(), { createPool }, getStorageState(), { openBrowser, closeBrowser }, { uploadScreenshot } (+5 more)

### Community 18 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 19 - "job-application-db.js"
Cohesion: 0.17
Nodes (11): { createPool }, applyQueue, azure, { createApplyQueue }, { createServiceClient, createPool }, { getClientIdForChat }, { getClientPrefix, getJobDisplay }, patchJobProof() (+3 more)

### Community 20 - "zoho-mail-reader.js"
Cohesion: 0.27
Nodes (11): openBrowser(), fs, getZohoSessionState(), loginToZohoAdmin(), { openBrowser, closeBrowser }, path, saveZohoSessionState(), setupZohoPage() (+3 more)

### Community 21 - "processDueChat"
Cohesion: 0.23
Nodes (10): createDueWorkTicker(), persistWorkflowPatch(), processDueChat(), start(), tick(), ENQUEUE_BATCH_CAP, listDueWorkflowChats(), assert (+2 more)

### Community 22 - "runLogin"
Cohesion: 0.25
Nodes (8): getSessionsPendingLogin(), saveSession(), audit(), randomDelay(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay(), waitRandom()

### Community 23 - "handleConversationMessage"
Cohesion: 0.38
Nodes (7): deleteOTP(), findUserByEmail(), generateOTP(), handleConversationMessage(), hashOtp(), saveOTP(), verifyOTP()

### Community 24 - "001_v2_tables.sql"
Cohesion: 0.48
Nodes (6): dice_applied_jobs_v2, dice_apply_queue_v2, idx_applied_jobs_v2_applywizz_id, idx_applied_jobs_v2_status, idx_apply_queue_v2_applywizz_id, idx_apply_queue_v2_status

### Community 25 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 26 - "prevalidateJob"
Cohesion: 0.33
Nodes (6): loadApplyProfile(), readTotalStepCount(), acquirePreflight(), getJobName(), prevalidateJob(), releasePreflight()

### Community 27 - "s3-screenshot.js"
Cohesion: 0.53
Nodes (5): getS3Client(), hasAwsS3Config(), { S3Client, PutObjectCommand }, uploadScreenshot(), @aws-sdk/client-s3

### Community 28 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

## Knowledge Gaps
- **271 isolated node(s):** `autoprefixer`, `oxlint`, `postcss`, `tailwindcss`, `@tailwindcss/vite` (+266 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 357 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `node-telegram-bot-api` connect `sendMessage` to `scripts`, `sync-daily-pipeline.js`, `start-bot.js`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `createPool()` connect `azure.js` to `dashboard-server.js`, `sync-daily-pipeline.js`, `due-work-ticker.js`, `start-v2.js`, `getClientPrefix`, `blind-apply.js`, `job-application-db.js`, `processDueChat`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `sendMessage()` (e.g. with `processDueChat()` and `telegram-notify.js`) actually correct?**
  _`sendMessage()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `autoprefixer`, `oxlint`, `postcss` to the rest of the system?**
  _271 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05084745762711865 - nodes in this community are weakly interconnected._
- **Should `dashboard-server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0701344243132671 - nodes in this community are weakly interconnected._
- **Should `azure.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05194805194805195 - nodes in this community are weakly interconnected._