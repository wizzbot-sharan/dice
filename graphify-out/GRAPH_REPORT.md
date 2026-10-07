# Graph Report - Dice_scaling copy  (2026-10-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 764 nodes · 1384 edges · 57 communities (36 shown, 21 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 151 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7667736b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- due-work-ticker.js
- dashboard-server.js
- start-bot.js
- dice-apply-questions.js
- azure.js
- frontend/package.json
- start-worker.js
- scripts
- resume-parser.js
- createPool
- browser.js
- import-operators.js
- start-v2.js
- getClientPrefix
- blind-apply.js
- createWorkflowStateStore
- zoho-mail-reader.js
- sync-daily-pipeline.js
- job-matching.test.js
- devDependencies
- sync-pipeline.test.js
- bot-webhook.test.js
- job-application-db.js
- ref_node_assert
- service-split.test.js
- apply-queue.test.js
- manager-role.test.js
- applyToJobOnPage
- 001_v2_tables.sql
- .oxlintrc.json
- s3-screenshot.js
- 009_create_dice_archived_jobs.sql
- prevalidateJob
- runLogin
- ref_node_test
- test-match.js
- idx_scraped_jobs_preflight
- 007_pending_answers.sql
- test-date.js
- test-regex.js
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
7. `sendJson()` - 16 edges
8. `applyToJobOnPage()` - 16 edges
9. `scripts` - 15 edges
10. `processDueChat()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `run()` --calls--> `createPool()`  [EXTRACTED]
  scratch-migrate.js → lib/azure.js
- `handleJobCallback()` --indirect_call--> `getClientIdForChat()`  [INFERRED]
  start-bot.js → lib/dice-session.js
- `handleJobCallback()` --indirect_call--> `saveAppliedJob()`  [INFERRED]
  start-bot.js → lib/job-application-db.js
- `handleJobCallback()` --indirect_call--> `getAnswerForQuestion()`  [INFERRED]
  start-bot.js → lib/pending-answers.js
- `handleJobCallback()` --indirect_call--> `savePendingQuestion()`  [INFERRED]
  start-bot.js → lib/pending-answers.js

## Import Cycles
- None detected.

## Communities (57 total, 21 thin omitted)

### Community 0 - "due-work-ticker.js"
Cohesion: 0.05
Nodes (49): { createPool }, crypto, { getClientPrefix, getJobDisplay }, { openBrowser, closeBrowser, maxConcurrent }, sleep(), startApplyWorkers(), workerLoop(), applyPromptDecision() (+41 more)

### Community 1 - "dashboard-server.js"
Cohesion: 0.07
Nodes (50): activeSyncs, archiveOldJobs(), authenticate(), authenticateAdmin(), authenticateAdminOrManager(), createDashboardServer(), crypto, DASHBOARD_TIMEZONES (+42 more)

### Community 2 - "start-bot.js"
Cohesion: 0.06
Nodes (52): { Bot }, getBot(), { getClientPrefix }, sendMessage(), sendMessageWithButtons(), node-telegram-bot-api, { applyPromptDecision }, audit() (+44 more)

### Community 3 - "dice-apply-questions.js"
Cohesion: 0.08
Nodes (51): answersToList(), applyQuestionForm(), { classifyQuestionIntent, extractSkillFromQuestion, matchNumericOption, matchBestOption }, clickLabeledControl(), collectCheckboxGroups(), escapeRegExp(), extractPreflightQuestions(), fillCheckboxGroups() (+43 more)

### Community 4 - "azure.js"
Cohesion: 0.07
Nodes (37): assertIdentifier(), createQueryBuilder(), builder, buildWhere(), execute(), createServiceClient(), parseColumns(), { Pool } (+29 more)

### Community 5 - "frontend/package.json"
Cohesion: 0.07
Nodes (41): dependencies, axios, lucide-react, react, react-dom, react-router-dom, name, private (+33 more)

### Community 6 - "start-worker.js"
Cohesion: 0.04
Nodes (44): APPLY_TIMEOUT_MINUTES, applyQueue, azure, { createApplyQueue }, { createPool, createServiceClient }, { createWorkflowStateStore }, crypto, { fillCurrentStep, isVisibleEnabled, loadApplyProfile, readTotalStepCount, extractPreflightQuestions } (+36 more)

### Community 7 - "scripts"
Cohesion: 0.05
Nodes (36): dependencies, @aws-sdk/client-s3, bcryptjs, dotenv, node-telegram-bot-api, pdf-parse, pg, playwright (+28 more)

### Community 8 - "resume-parser.js"
Cohesion: 0.08
Nodes (33): calculateDurationYears(), clearResumeCache(), extractTextFromBuffer(), extractWorkBlocks(), fetchResumeBuffer(), fs, getCandidateResumeData(), getExperienceForSkill() (+25 more)

### Community 9 - "createPool"
Cohesion: 0.09
Nodes (17): createApplyQueue(), claimNextJob(), countActiveQueueItems(), enqueueApplyJob(), recoverStuckJobs(), createPool(), clearExpiredPendingQuestions(), { createPool } (+9 more)

### Community 10 - "browser.js"
Cohesion: 0.17
Nodes (16): acquireBrowserTicket(), cancelIdleTimeout(), { chromium: localChromium }, closeBrowser(), closeSharedBrowser(), getSharedBrowser(), maxConcurrent, openLocalBrowser() (+8 more)

### Community 11 - "import-operators.js"
Cohesion: 0.15
Nodes (15): { createPool }, fs, importOperators(), { mapOperatorRecord }, path, asBoolean(), asText(), asUuid() (+7 more)

### Community 12 - "start-v2.js"
Cohesion: 0.15
Nodes (15): users_sharan_desktop_dice_scaling_copy_lib_zoho_mail_reader_verifyjobapplicationemail, { createPool }, runEmailVerifier(), startEmailVerifier(), { verifyJobApplicationEmail }, main(), { startEmailVerifier }, { startTicker } (+7 more)

### Community 13 - "getClientPrefix"
Cohesion: 0.25
Nodes (13): azure, { createServiceClient }, getClientIdForChat(), { getClientPrefix }, getSessionRow(), linkTelegramChat(), readActiveSession(), saveSession() (+5 more)

### Community 14 - "blind-apply.js"
Cohesion: 0.18
Nodes (13): users_sharan_desktop_dice_scaling_copy_lib_browser_closebrowser, users_sharan_desktop_dice_scaling_copy_lib_browser_openbrowser, users_sharan_desktop_dice_scaling_copy_lib_s3_screenshot_uploadscreenshot, blindApply(), { createPool }, getStorageState(), { openBrowser, closeBrowser }, { uploadScreenshot } (+5 more)

### Community 15 - "createWorkflowStateStore"
Cohesion: 0.19
Nodes (8): createWorkflowStateStore(), claimTelegramUpdate(), clearConversation(), get(), save(), assert, { createWorkflowStateStore }, test

### Community 16 - "zoho-mail-reader.js"
Cohesion: 0.27
Nodes (11): openBrowser(), fs, getZohoSessionState(), loginToZohoAdmin(), { openBrowser, closeBrowser }, path, saveZohoSessionState(), setupZohoPage() (+3 more)

### Community 17 - "sync-daily-pipeline.js"
Cohesion: 0.26
Nodes (10): { createPool, createServiceClient }, deriveManagerLinks(), fetchJson(), getYesterdayDate(), { mapImportItem }, path, runSyncDaily(), syncCAs() (+2 more)

### Community 18 - "job-matching.test.js"
Cohesion: 0.33
Nodes (9): companyIsExcluded(), jobMatchesProfile(), normalizeText(), roleMatchesJobTitle(), STOP_WORDS, tokens(), assert, { companyIsExcluded, jobMatchesProfile, roleMatchesJobTitle } (+1 more)

### Community 19 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom (+2 more)

### Community 20 - "sync-pipeline.test.js"
Cohesion: 0.20
Nodes (8): lib_dashboard_server_sync_cooldown_ms, syncCooldowns, assert, { createDashboardServer, syncCooldowns, SYNC_COOLDOWN_MS }, crypto, { getYesterdayDate, runSyncDaily }, stream, test

### Community 21 - "bot-webhook.test.js"
Cohesion: 0.20
Nodes (8): ref_http, ref_stream, assert, { Bot }, { createWebhookServer }, http, stream, test

### Community 22 - "job-application-db.js"
Cohesion: 0.22
Nodes (8): applyQueue, azure, { createApplyQueue }, { createServiceClient, createPool }, { getClientIdForChat }, { getClientPrefix, getJobDisplay }, users_sharan_desktop_dice_scaling_copy_lib_apply_queue_createapplyqueue, users_sharan_desktop_dice_scaling_copy_lib_dice_session_getclientidforchat

### Community 23 - "ref_node_assert"
Cohesion: 0.36
Nodes (7): getAccessToken(), getAuthConfig(), sendEmail(), ref_node_assert, assert, { getAuthConfig, sendEmail }, test

### Community 24 - "service-split.test.js"
Cohesion: 0.25
Nodes (7): storageStateIsValid(), lib_job_scanner_newday_lookback_ms, assert, { NEWDAY_LOOKBACK_MS }, { storageStateIsValid }, test, users_sharan_desktop_dice_scaling_copy_lib_dice_session_storagestateisvalid

### Community 25 - "apply-queue.test.js"
Cohesion: 0.32
Nodes (6): acquire(), assert, { createApplyQueue }, mockTask(), release(), test

### Community 26 - "manager-role.test.js"
Cohesion: 0.25
Nodes (6): assert, { createDashboardServer }, crypto, { deriveManagerLinks, runSyncDaily }, stream, test

### Community 27 - "applyToJobOnPage"
Cohesion: 0.29
Nodes (7): isVisibleEnabled(), loadApplyProfile(), patchJobProof(), applyToJobOnPage(), randomDelay(), sessionExpiredError(), waitRandom()

### Community 28 - "001_v2_tables.sql"
Cohesion: 0.48
Nodes (6): dice_applied_jobs_v2, dice_apply_queue_v2, idx_applied_jobs_v2_applywizz_id, idx_applied_jobs_v2_status, idx_apply_queue_v2_applywizz_id, idx_apply_queue_v2_status

### Community 29 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 30 - "s3-screenshot.js"
Cohesion: 0.53
Nodes (5): getS3Client(), hasAwsS3Config(), { S3Client, PutObjectCommand }, uploadScreenshot(), @aws-sdk/client-s3

### Community 31 - "009_create_dice_archived_jobs.sql"
Cohesion: 0.70
Nodes (4): dice_archieved_jobs, dice_archived_jobs, idx_archived_jobs_applywizz_id, idx_archived_jobs_scraped_at

### Community 32 - "prevalidateJob"
Cohesion: 0.40
Nodes (5): readTotalStepCount(), acquirePreflight(), getJobName(), prevalidateJob(), releasePreflight()

### Community 33 - "runLogin"
Cohesion: 0.40
Nodes (5): getSessionsPendingLogin(), audit(), runLogin(), runPendingLoginsLoop(), typeWithHumanDelay()

### Community 34 - "ref_node_test"
Cohesion: 0.40
Nodes (4): ref_node_test, assert, { sendJobPrompt, applyPromptDecision }, test

### Community 35 - "test-match.js"
Cohesion: 0.40
Nodes (3): companyTokens, subjectTokens, titleTokens

## Knowledge Gaps
- **287 isolated node(s):** `{ createPool }`, `crypto`, `{ getClientPrefix, getJobDisplay }`, `{ openBrowser, closeBrowser, maxConcurrent }`, `{ createPool }` (+282 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 380 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createPool()` connect `createPool` to `due-work-ticker.js`, `dashboard-server.js`, `azure.js`, `import-operators.js`, `start-v2.js`, `getClientPrefix`, `blind-apply.js`, `sync-daily-pipeline.js`, `applyToJobOnPage`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `node-telegram-bot-api` connect `start-bot.js` to `bot-webhook.test.js`, `scripts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `sendMessage()` (e.g. with `processDueChat()` and `telegram-notify.js`) actually correct?**
  _`sendMessage()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ createPool }`, `crypto`, `{ getClientPrefix, getJobDisplay }` to the rest of the system?**
  _287 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `due-work-ticker.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05028248587570622 - nodes in this community are weakly interconnected._
- **Should `dashboard-server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06704260651629072 - nodes in this community are weakly interconnected._
- **Should `start-bot.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05584415584415584 - nodes in this community are weakly interconnected._