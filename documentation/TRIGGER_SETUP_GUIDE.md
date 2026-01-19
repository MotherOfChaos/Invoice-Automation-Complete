# TRIGGER SETUP GUIDE

**How to activate daily automation for the Invoice Automation System**

---

## 🎯 OVERVIEW

The invoice automation system runs automatically **twice daily**:
- **Morning:** 8:00 AM CET
- **Evening:** 6:00 PM CET

This guide shows you how to set up the automation triggers.

---

## ⚡ QUICK SETUP (3 STEPS)

### Step 1: Complete First Run
Before setting up automation, you MUST run the initial setup:

1. Open your Google Apps Script project
2. Select `firstRun` from the function dropdown
3. Click "Run"
4. Wait for completion (check logs)
5. Verify folders and spreadsheets created in Drive

### Step 2: Activate Triggers
Once first run is complete:

1. Select `setupDailyTriggers` from the function dropdown
2. Click "Run"
3. Done! ✅

### Step 3: Verify Triggers Active
Check that triggers are running:

1. In Apps Script, click the **clock icon** (⏰) on the left sidebar
2. You should see 2 triggers:
   - `dailyAutomation` at 8:00 AM
   - `dailyAutomation` at 6:00 PM

---

## 📋 DETAILED TRIGGER SETUP

### What Triggers Do

**Triggers automatically run functions at scheduled times.**

For this system:
- The `dailyAutomation()` function runs twice per day
- Each run scans for NEW invoices (last 24 hours only)
- No duplicates are created
- You receive email notifications for each run

### Manual Trigger Setup (Alternative Method)

If you prefer to set up triggers manually:

1. Open your Apps Script project
2. Click the **clock icon** (⏰) on the left sidebar
3. Click "+ Add Trigger" (bottom right)
4. Configure:
   - **Function to run:** `dailyAutomation`
   - **Deployment:** Head
   - **Event source:** Time-driven
   - **Type of time based trigger:** Day timer
   - **Time of day:** 8am to 9am
5. Click "Save"
6. Repeat for evening trigger (6pm to 7pm)

### Automated Trigger Setup (Recommended)

Use the built-in function:

```javascript
setupDailyTriggers()
```

This function:
- Deletes any existing triggers for `dailyAutomation`
- Creates morning trigger (8:00 AM)
- Creates evening trigger (6:00 PM)
- Logs confirmation

**Benefit:** Prevents duplicate triggers if run multiple times.

---

## 🔧 MANAGING TRIGGERS

### Viewing Active Triggers

1. Apps Script → Click **clock icon** (⏰)
2. See list of all triggers
3. Click on any trigger to see details

### Editing Triggers

You cannot edit existing triggers. To change:
1. Delete the old trigger
2. Create a new trigger with updated settings

OR use the `setupDailyTriggers()` function which does this automatically.

### Deleting Triggers

**To pause automation:**

Use the built-in function:
```javascript
removeTriggers()
```

OR manually:
1. Apps Script → Click **clock icon** (⏰)
2. Click the **three dots** (...) next to the trigger
3. Select "Delete trigger"
4. Confirm deletion

### Re-enabling After Deletion

Simply run `setupDailyTriggers()` again.

---

## 📧 NOTIFICATIONS

### What You'll Receive

**Daily Summary (if new invoices found):**
```
Subject: ✅ Daily Invoice Check - 3 New Invoice(s)

DAILY AUTOMATION COMPLETED ✅

Duration: 1.23 minutes

New invoices processed:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 New emails scanned: 3
📎 New invoices found: 3
📁 Files organized: 3
📊 Data rows added: 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Time: Mon Jan 19 2025 18:00:00 GMT+0100 (CET)
```

**No New Invoices:**
```
Subject: 📧 Daily Invoice Check - No New Invoices

Daily automation check completed.

No new invoices found in the last 24 hours.

Time: Mon Jan 19 2025 08:00:00 GMT+0100 (CET)
```

**Error Notification:**
```
Subject: ❌ Daily Invoice Check - ERROR

ERROR during daily automation:

[Error message details]

Stack trace:
[Stack trace details]

Time: Mon Jan 19 2025 18:00:00 GMT+0100 (CET)
```

### Notification Recipient

Configured in CONFIG:
```javascript
notificationEmail: 'sarah@teatrometamorfosis.com'
```

Change this to receive notifications at a different email.

---

## 🧪 TESTING AUTOMATION

### Test Before Going Live

**Step 1: Test First Run**
```javascript
firstRun()
```
- Should find 147+ invoices
- Should create folders and spreadsheets
- Should receive success notification

**Step 2: Test Daily Automation (No New Invoices)**
```javascript
dailyAutomation()
```
- Should find 0 new invoices
- Should receive "No New Invoices" notification
- Proves duplicate prevention works!

**Step 3: Send Test Invoice**
1. Email yourself (to info@ or laura@) with subject "Test Factura"
2. Attach a PDF file
3. Wait 1 minute

**Step 4: Test Daily Automation (With New Invoice)**
```javascript
dailyAutomation()
```
- Should find 1 new invoice
- Should organize it into correct folder
- Should add row to spreadsheet
- Should receive success notification

**Step 5: Activate Triggers**
```javascript
setupDailyTriggers()
```
- Check trigger list (clock icon)
- Should see 2 triggers

**Step 6: Wait for Next Scheduled Run**
- Wait until next 8am or 6pm
- Check email for notification
- Verify in execution logs (Apps Script → "Executions")

---

## 📊 MONITORING AUTOMATION

### Execution Logs

**View all script executions:**
1. Apps Script → Click "Executions" in left sidebar
2. See complete history of all runs
3. Click any execution to see detailed logs

**What to look for:**
- ✅ Green checkmark = Success
- ❌ Red X = Error
- Duration time
- Detailed logs of what happened

### Checking Last Run

1. Go to "Executions"
2. Find the most recent `dailyAutomation` execution
3. Click to see logs
4. Verify:
   - How many emails scanned
   - How many invoices found
   - Any errors or warnings

### Troubleshooting Failed Runs

If automation fails:

**Check 1: Email Permissions**
- Script needs access to Gmail
- Re-authorize if needed

**Check 2: Drive Permissions**
- Script needs access to Drive
- Check folder permissions

**Check 3: Vision API**
- Check API key is valid
- Check billing is enabled on GCP
- Check quota limits

**Check 4: Execution Logs**
- Read detailed error message
- Check stack trace
- Error notifications sent to configured email

---

## ⚙️ CUSTOMIZING SCHEDULE

### Change Run Times

Edit the CONFIG section:

```javascript
triggers: {
  morning: 8,   // ← Change to different hour (0-23)
  evening: 18   // ← Change to different hour (0-23)
}
```

Then run:
```javascript
setupDailyTriggers()
```

### Run More/Less Frequently

**More than twice daily:**
Manually create additional triggers in the trigger UI.

**Once daily:**
Delete one of the triggers manually.

**Different days:**
Modify the `setupDailyTriggers()` function to use `.onWeekDay()` instead of `.everyDays(1)`.

---

## 🚨 IMPORTANT NOTES

### Timezone
- Triggers use your Google Account timezone
- Check: File → Project Settings → Time zone
- Default: (GMT+01:00) Madrid (CET)

### Trigger Delays
- Time-based triggers may run within ~1 hour of scheduled time
- This is normal Google Apps Script behavior
- Example: 8am trigger might run between 8:00-9:00am

### Execution Limits
- Google Apps Script has daily execution limits
- Typically: 90 minutes/day for free accounts
- This system uses ~2-5 minutes per run
- Well within limits for twice-daily runs

### Email Quota
- Free Gmail accounts: 100 emails/day
- This system sends 2-3 emails/day (notifications)
- Well within limits

---

## 📋 TRIGGER CHECKLIST

Use this to verify everything is set up correctly:

### Initial Setup
- [ ] Ran `firstRun()` successfully
- [ ] Verified folders created in Drive
- [ ] Verified spreadsheets created with data
- [ ] Received first run success notification

### Trigger Activation
- [ ] Ran `setupDailyTriggers()`
- [ ] Checked trigger list (clock icon) - see 2 triggers
- [ ] Both triggers show `dailyAutomation` function
- [ ] Both triggers show "Time-driven" type

### Testing
- [ ] Ran `dailyAutomation()` manually
- [ ] Received "No New Invoices" notification
- [ ] Sent test invoice email
- [ ] Ran `dailyAutomation()` again
- [ ] Found 1 new invoice
- [ ] Received success notification

### Monitoring
- [ ] Know how to check Executions log
- [ ] Notifications arriving at correct email
- [ ] No errors in execution logs
- [ ] System running smoothly

---

## 🆘 TROUBLESHOOTING

### Triggers Not Running

**Problem:** No executions showing in logs at scheduled times

**Solutions:**
1. Check triggers exist (clock icon)
2. Verify trigger times are in the future
3. Check timezone settings
4. Re-run `setupDailyTriggers()`

### Getting Error Emails

**Problem:** Receiving error notifications

**Solutions:**
1. Check execution logs for details
2. Verify Gmail access permissions
3. Verify Drive folder still exists
4. Check Vision API credentials
5. Re-authorize script if needed

### Not Receiving Notifications

**Problem:** No emails arriving

**Solutions:**
1. Check spam/junk folder
2. Verify `notificationEmail` in CONFIG
3. Check execution logs (script might not be running)
4. Verify MailApp permissions

### Duplicate Invoices Created

**Problem:** Same invoice appearing multiple times

**Solutions:**
1. Check logs - shouldn't happen!
2. Verify duplicate prevention logic
3. Contact support if issue persists
4. Code has 3 levels of duplicate prevention

---

## 💡 BEST PRACTICES

✅ **DO:**
- Monitor execution logs weekly
- Keep backup of working code
- Test after making any changes
- Update VERSION_HISTORY.md with changes

❌ **DON'T:**
- Create too many manual triggers (causes duplicates)
- Modify code without testing
- Delete triggers accidentally
- Ignore error notifications

---

## 📚 RELATED DOCUMENTATION

- `VERSION_HISTORY.md` - Track code versions
- `CONFIGURATION_CHECKLIST.md` - Verify setup
- `CLIENT_CUSTOMIZATION_GUIDE.md` - For deploying to clients
- `BRIEFING_FOR_CODY_REVISED.md` - Complete specs

---

**Questions? Check the execution logs first!**

Most issues show clear error messages in the logs. If stuck, review the detailed logs and error notifications.

---

**Last Updated:** 2025-01-19
**Current Version:** v1.0
