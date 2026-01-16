# 🔧 TROUBLESHOOTING GUIDE
## Invoice Automation System

**Like a washing machine manual - simple, clear, step-by-step solutions**

---

## 📖 HOW TO USE THIS GUIDE

1. Find your problem in the list below
2. Follow the step-by-step solution
3. If problem persists, see "Getting Help" section

**🟢 Green checkmarks** = Do this  
**❌ Red X** = Don't do this  
**💡 Lightbulb** = Helpful tip

---

## 🚨 COMMON PROBLEMS

---

### Problem 1: "Invoice Not Found by System"

**Symptoms:**
- Invoice was emailed but not in spreadsheet
- Invoice in email but not in Drive folder
- Spreadsheet missing invoices you know were sent

**Solution:**

**STEP 1: Check if it's really an email invoice**
- 🟢 Was invoice sent as EMAIL ATTACHMENT?
- ❌ Downloaded from portal? → System won't find it (manual upload needed)
- ❌ Manually added to Drive? → System won't find it (add to spreadsheet manually)

**STEP 2: Check filename**
- 🟢 Does filename contain: "factura", "invoice", "recibo", or "receipt"?
- ❌ Filename is "document.pdf"? → System won't recognize it
- **Fix:** Forward email with better subject line or rename attachment

**STEP 3: Check email account**
- 🟢 Was it sent to info@ or laura@teatrometamorfosis.com?
- ❌ Sent to sarah@ or personal email? → System won't see it
- **Fix:** Forward to info@ or laura@

**STEP 4: Check date**
- 🟢 Was email received after January 1, 2025?
- ❌ Older than that? → Outside scan range
- **Fix:** Manually upload to correct quarter folder

**STEP 5: Wait and recheck**
- 🟢 System runs 3 times daily (8am, 3pm, 10pm)
- 🟢 Email received at 4pm? Wait until 10pm scan
- 💡 Check spreadsheet after next scheduled scan

**Still missing?**
→ Go to "Advanced Troubleshooting" section below

---

### Problem 2: "Wrong Amount Extracted"

**Symptoms:**
- Spreadsheet shows €56.61 but invoice is €565.61
- Amount column is blank
- Amount has weird numbers

**Solution:**

**STEP 1: Understand this is normal**
- 🟢 Vision API has ~90% accuracy
- 🟢 10% of invoices need manual correction
- 💡 This is EXPECTED behavior

**STEP 2: Fix it manually**
1. Open the spreadsheet
2. Find the row with wrong amount
3. Click on "Amount" cell (Column E)
4. Type correct amount
5. Press Enter
6. Done! (15 seconds)

**STEP 3: Check the actual invoice**
- 🟢 Click "Drive Link" (Column I)
- 🟢 Verify correct amount on PDF
- 🟢 Update spreadsheet

**Prevention:**
- ❌ Can't prevent - AI isn't 100% perfect
- 🟢 Quick weekly review catches errors
- 💡 Laura spends 5-10 min/week fixing these

---

### Problem 3: "Duplicate Invoices"

**Symptoms:**
- Same invoice appears twice in spreadsheet
- Same invoice in folder twice
- Multiple entries for one invoice

**Solution:**

**STEP 1: Check if they're really duplicates**
- 🟢 Open both Drive links
- 🟢 Compare filenames and dates
- 🟢 Some vendors send corrected versions (not duplicates!)

**STEP 2: If truly duplicate:**
1. Keep the FIRST entry (earlier date)
2. Delete the duplicate row in spreadsheet
3. Delete duplicate file in Drive folder
4. Done!

**STEP 3: Prevent future duplicates**
- 💡 System already checks for duplicates
- 💡 Happens if filename changes slightly
- 💡 Or if forwarded multiple times

**Note:** Rare issue (<1% of invoices)

---

### Problem 4: "Spreadsheet Not Updating"

**Symptoms:**
- New invoices not appearing in spreadsheet
- Spreadsheet last updated days ago
- Row count not increasing

**Solution:**

**STEP 1: Check if automation is running**
1. Go to: script.google.com
2. Open project: "Teatro Invoices"
3. Click "Triggers" (clock icon, left side)
4. Do you see trigger for "processInvoices"?

**If NO triggers:**
- 🟢 Click "Add Trigger" (bottom right)
- 🟢 Function: processInvoices
- 🟢 Event: Time-driven
- 🟢 Type: Hour timer
- 🟢 Interval: Every 8 hours
- 🟢 Save
- ✅ Fixed!

**If triggers exist:**
- 🟢 Check "Executions" tab (left side)
- 🟢 See any red errors?
- → Go to "Error Messages" section below

**STEP 2: Manual run test**
1. In Apps Script, select: processInvoices
2. Click Run (▶ button)
3. Wait 1-2 minutes
4. Check spreadsheet - did new invoices appear?

**If YES:** Triggers were the problem (fixed in Step 1)  
**If NO:** → Go to "Error Messages" section below

---

### Problem 5: "Can't Find Spreadsheet"

**Symptoms:**
- Don't know where spreadsheet is
- Can't find INVOICES_FACTURAS_TEATRO folder
- Lost link to spreadsheet

**Solution:**

**STEP 1: Search Google Drive**
1. Go to: drive.google.com (as info@)
2. Search box (top): "Invoices 2025"
3. Click on result
4. ✅ Found it!

**STEP 2: Bookmark it**
- 🟢 Once open, click Star icon (top right)
- 🟢 Now in "Starred" for easy access
- 💡 Do this for main folder too!

**STEP 3: Get direct link**
1. Open spreadsheet
2. Copy URL from browser
3. Save in your notes/bookmarks
4. Share with team if needed

**Can't find folder at all?**
→ Go to "System Not Working" section below

---

### Problem 6: "Categories Not Filled In"

**Symptoms:**
- Category column (Column D) is blank
- Expected automation to fill categories
- Confused about what to enter

**Solution:**

**STEP 1: Understand this is MANUAL**
- 🟢 System does NOT auto-fill categories
- 🟢 Team must add categories manually
- 💡 This is by design (requires human judgment)

**STEP 2: Add categories yourself**
1. Open spreadsheet
2. Click on Category cell (Column D)
3. Type category (e.g., "Marketing", "Supplies", "Rent")
4. Press Enter
5. Repeat for each invoice

**STEP 3: Create category list**
- 💡 Common categories for Teatro:
  - Marketing
  - Supplies
  - Utilities
  - Rent
  - Services
  - Equipment
  - Other

**Time required:** 5-10 minutes per week

---

### Problem 7: "Email Notification Not Received"

**Symptoms:**
- Used to get email notifications
- Now not receiving them
- Want to know when new invoices processed

**Solution:**

**STEP 1: Check if feature enabled**
- 🟢 System sends notification ONLY if invoices found
- 🟢 If 0 new invoices → no email sent
- 💡 This is normal behavior

**STEP 2: Check spam folder**
1. Open Gmail
2. Check Spam folder
3. Look for emails from: info@teatrometamorfosis.com
4. Subject: "✅ Invoice Automation: X invoices processed"
5. If found → Mark as "Not Spam"

**STEP 3: Verify email address**
1. Go to: script.google.com
2. Open: "Teatro Invoices"
3. Check CONFIG section (line 14)
4. First email in emailAccounts array gets notifications
5. Is it correct?

**Want notifications to different email?**
- 🟢 Change line 14 to desired email
- 🟢 Save
- ✅ Future notifications go there

---

## 🔴 ERROR MESSAGES

---

### Error: "Server error occurred. Please wait and try again."

**What it means:** Google's servers are temporarily busy

**Solution:**
1. **Wait 30-60 minutes**
2. Try again
3. Usually resolves itself
4. If persists after 2 hours → Check API status

**This happens when:**
- APIs just enabled (need time to propagate)
- High Google server load
- Rate limits hit (rare)

**Prevention:** None - this is Google's side

---

### Error: "Permission denied"

**What it means:** Script doesn't have access to email/drive/sheets

**Solution:**
1. Go to: script.google.com
2. Open: "Teatro Invoices"
3. Select: processInvoices
4. Click Run
5. Click "Review permissions"
6. Click "Allow"
7. Try again

**If "Allow" doesn't appear:**
- Go to: myaccount.google.com/permissions
- Find "Teatro Invoices"
- Remove it
- Run script again
- Re-authorize

---

### Error: "Cannot find folder"

**What it means:** Folder structure missing or deleted

**Solution:**
1. Go to: script.google.com
2. Open: "Teatro Invoices"
3. Select: resetSystem
4. Click Run
5. Then select: processInvoices
6. Click Run
7. Folder structure recreated!

**⚠️ WARNING:** Only do this if folder truly missing!

---

### Error: "API not enabled"

**What it means:** One of the required Google APIs is disabled

**Solution:**
1. Go to: console.cloud.google.com
2. Click project dropdown (top left)
3. Select: "Teatro Invoices"
4. Search: "Vision API" → Click → Enable
5. Search: "Drive API" → Click → Enable
6. Search: "Gmail API" → Click → Enable
7. Search: "Sheets API" → Click → Enable
8. Wait 30 minutes
9. Try script again

---

## 🛠️ ADVANCED TROUBLESHOOTING

---

### "My specific problem isn't listed above"

**STEP 1: Check execution logs**
1. Go to: script.google.com
2. Open: "Teatro Invoices"
3. Click "Executions" (left sidebar)
4. Find latest run
5. Click to see logs
6. Look for error messages (red text)
7. Copy error message

**STEP 2: Search error online**
- 🟢 Google the error message
- 🟢 Often find solutions in forums
- 💡 Apps Script has good documentation

**STEP 3: Check configuration**
1. Open script
2. Find CONFIG section (top)
3. Verify all settings correct:
   - Email accounts correct?
   - Folder name correct?
   - Keywords appropriate?

**STEP 4: Test with single invoice**
1. Email yourself a test invoice
2. Wait for next scan time
3. Did it process?
4. If YES → Other invoices have different issue
5. If NO → System-wide problem

---

### "System completely stopped working"

**Nuclear option - Fresh restart:**

**⚠️ ONLY IF DESPERATE - WILL LOSE TRIGGERS**

1. Go to: console.cloud.google.com
2. Delete project: "Teatro Invoices"
3. Go to: script.google.com
4. Delete script: "Teatro Invoices"
5. Follow DEPLOYMENT_GUIDE.md from scratch
6. Re-deploy entire system

**Before doing this:**
- ✅ Export all spreadsheet data
- ✅ Note all configuration settings
- ✅ Backup folder structure
- ✅ Try simpler fixes first!

---

## 💡 PREVENTION TIPS

---

### Keep System Running Smoothly

**✅ DO:**
- Check spreadsheet weekly
- Review categories monthly
- Verify triggers quarterly
- Keep email accounts active
- Forward invoices to monitored emails

**❌ DON'T:**
- Delete INVOICES_FACTURAS_TEATRO folder
- Disable APIs in Google Cloud
- Remove script authorization
- Change folder names manually
- Mess with script code (unless you know what you're doing)

---

### Regular Maintenance Checklist

**Weekly (5 minutes):**
- [ ] Open latest spreadsheet
- [ ] Add categories to new invoices
- [ ] Verify amounts look reasonable
- [ ] Check for obvious errors

**Monthly (10 minutes):**
- [ ] Count invoices in spreadsheet vs email
- [ ] Verify folder structure intact
- [ ] Check any missing invoices
- [ ] Review error logs (if any)

**Quarterly (15 minutes):**
- [ ] Go to script.google.com
- [ ] Check triggers still active
- [ ] Review execution history
- [ ] Confirm APIs still enabled
- [ ] Update documentation if needed

---

## 📞 GETTING HELP

---

### If problem still not solved:

**1. Gather information:**
- Error message (exact text)
- When problem started
- What you were trying to do
- Screenshots if helpful

**2. Check documentation:**
- SYSTEM_SPECIFICATIONS.md
- IMPLEMENTATION_LOG.md
- This troubleshooting guide

**3. Contact support:**
- Review Apps Script execution logs
- Check Google API status page
- Search Google Apps Script forums

---

## 📚 QUICK REFERENCE

**Key Links:**
- Apps Script: script.google.com
- Google Cloud: console.cloud.google.com
- Main Folder: Search "INVOICES_FACTURAS_TEATRO" in Drive
- Spreadsheet: Search "Invoices 2025" in Drive

**Common Actions:**
- Run manual scan: Apps Script → processInvoices → Run
- Check triggers: Apps Script → Triggers (clock icon)
- View logs: Apps Script → Executions
- Reset system: Apps Script → resetSystem → Run (CAREFUL!)

**Contact Info:**
- Technical documentation: See GitHub repo
- System specifications: SYSTEM_SPECIFICATIONS.md
- Deployment guide: DEPLOYMENT_GUIDE.md

---

**Guide Version:** 1.0  
**Last Updated:** January 16, 2026  
**Next Update:** As needed based on user feedback
