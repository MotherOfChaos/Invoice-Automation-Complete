# ✅ CLIENT DEPLOYMENT CHECKLIST
## Prevent Common Issues - Use This for Every Client!

**Created:** January 16, 2026  
**Purpose:** Ensure ZERO errors when deploying to clients

---

## 📋 PRE-DEPLOYMENT (Before touching any code)

### ☑️ Step 1: Account Verification (5 min)
- [ ] Confirmed which email will RUN the automation (e.g., info@company.com)
- [ ] Client is signed into that account in browser
- [ ] No other Google accounts signed in (prevents confusion)
- [ ] Account has Google Workspace access (not free Gmail)

### ☑️ Step 2: Requirements Check (2 min)
- [ ] Client has billing enabled on Google Cloud (even for free tier)
- [ ] Client can create GCP projects
- [ ] Client has admin access to email accounts
- [ ] Client has Drive admin permissions

---

## 🔧 DEPLOYMENT PHASE 1: Google Cloud Setup (15 min)

### ☑️ Step 3: Create GCP Project
- [ ] Go to console.cloud.google.com
- [ ] Signed in as BUSINESS account (verified in top-right)
- [ ] Create NEW project with clear name: "[ClientName] Invoice Automation"
- [ ] Copy Project Number immediately (paste in notes)
- [ ] **WAIT 2 minutes** for project to fully initialize

### ☑️ Step 4: Enable ALL APIs At Once
**CRITICAL:** Enable all 4 APIs before doing anything else!

- [ ] Search "Vision API" → Enable
- [ ] Search "Drive API" → Enable
- [ ] Search "Gmail API" → Enable
- [ ] Search "Sheets API" → Enable
- [ ] **Verify all 4 show green "API enabled" badge**
- [ ] **WAIT 30 minutes** before continuing (grab coffee!)

### ☑️ Step 5: OAuth Consent Screen
- [ ] Go to: APIs & Services → OAuth consent screen
- [ ] Select: External (unless G Suite)
- [ ] App name: "[ClientName] Invoice Automation"
- [ ] User support email: [business account]
- [ ] Developer email: [business account]
- [ ] Save & Continue (3 times, skip optional)
- [ ] Verify "Summary" page shows completed

---

## 💻 DEPLOYMENT PHASE 2: Apps Script (10 min)

### ☑️ Step 6: Create Apps Script Project
- [ ] Go to script.google.com
- [ ] Signed in as BUSINESS account (verified)
- [ ] Click "New project"
- [ ] Name it: "[ClientName] Invoice Automation"
- [ ] **DO NOT paste code yet!**

### ☑️ Step 7: Link GCP Project
**CRITICAL:** Do this BEFORE pasting any code!

- [ ] Click ⚙️ Settings (left sidebar)
- [ ] Scroll to "Google Cloud Platform (GCP) Project"
- [ ] Click "Change project"
- [ ] Paste Project Number from Step 3
- [ ] Click "Set Project"
- [ ] Verify: Shows "[ClientName] Invoice Automation" project name
- [ ] **If OAuth consent error:** Complete Step 5 first

### ☑️ Step 8: Deploy Code
- [ ] Copy INVOICE_AUTOMATION_SYSTEM.gs from GitHub
- [ ] Delete default "myFunction()" code
- [ ] Paste complete code
- [ ] **VERIFY these lines exist:**
  - [ ] Line ~30: `useVisionAPI: true,`
  - [ ] Line ~35: `autoRunHistoricalScan: true,`
  - [ ] Function exists: `extractInvoiceDataVision`
  - [ ] Function exists: `parseInvoiceText`

### ☑️ Step 9: Configure for Client
Edit CONFIG section (lines 14-50):

- [ ] `emailAccounts`: Replace with client's emails
- [ ] `mainFolderName`: Client-specific name
- [ ] `shareWithUsers`: Client team emails
- [ ] `historicalScanStartDate`: Adjust to client needs
- [ ] `historicalScanEndDate`: Adjust to client needs
- [ ] Save (Ctrl+S)

---

## ✅ DEPLOYMENT PHASE 3: Testing (10 min)

### ☑️ Step 10: First Authorization
- [ ] Select function: `processInvoices`
- [ ] Click Run ▶
- [ ] Click "Review permissions"
- [ ] **Verify:** Shows correct business account
- [ ] Click "Advanced"
- [ ] Click "Go to [App Name] (unsafe)"
- [ ] Review ALL permissions requested
- [ ] Click "Allow"
- [ ] **Wait for execution to complete** (DO NOT close tab!)

### ☑️ Step 11: Verify Folder Creation
- [ ] Go to drive.google.com (business account)
- [ ] Search: "[mainFolderName from config]"
- [ ] Folder exists? → ✅ Good
- [ ] Open folder → See year folders? → ✅ Good
- [ ] Open year → See quarter folders? → ✅ Good
- [ ] Open year → See spreadsheet? → ✅ Good

### ☑️ Step 12: Check Execution Logs
- [ ] In Apps Script: View → Logs (or Executions tab)
- [ ] Look for: "✅ Folder created"
- [ ] Look for: "📦 FIRST RUN: Running historical scan"
- [ ] Look for: "📧 Processing: [email accounts]"
- [ ] **CRITICAL CHECK:** Look for "📊 Extracted: Amount=..."
  - [ ] **If MISSING** → Vision API not working! (see troubleshooting)
  - [ ] **If PRESENT** → ✅ Perfect! Extraction working!

### ☑️ Step 13: Verify Spreadsheet Data
**THIS IS THE CRITICAL CHECK!**

- [ ] Open the Invoices [Year] spreadsheet
- [ ] Check columns exist: Date, Sender, Email, Category, **Amount**, **Invoice Number**, **IBAN**, Quarter, Link, Notes
- [ ] **If invoices found, check Column E (Amount):**
  - [ ] Has numbers? → ✅ PERFECT! Extraction working!
  - [ ] Empty? → ❌ PROBLEM! (run re-extraction script)

---

## 🔄 DEPLOYMENT PHASE 4: Automation Setup (5 min)

### ☑️ Step 14: Create Triggers
- [ ] In Apps Script: Click Triggers (⏰ clock icon, left)
- [ ] Click "+ Add Trigger" (bottom right)
- [ ] Function: `processInvoices`
- [ ] Event source: Time-driven
- [ ] Type: Hour timer
- [ ] Interval: Every 8 hours
- [ ] Save
- [ ] Repeat for 3 triggers total (8am, 4pm, 12am coverage)

---

## 📊 POST-DEPLOYMENT VALIDATION (5 min)

### ☑️ Step 15: Send Test Invoice
- [ ] Email test invoice to monitored account
- [ ] Wait 5 minutes
- [ ] Manually run: `processInvoices`
- [ ] Check logs for extraction messages
- [ ] Verify appears in spreadsheet
- [ ] **Check Amount column has value** → ✅ Success!

### ☑️ Step 16: Client Training
- [ ] Show client the Drive folder
- [ ] Show client the spreadsheet
- [ ] Explain columns they need to fill (Category, Notes)
- [ ] Explain 10% may need manual corrections
- [ ] Give access to TROUBLESHOOTING.md

---

## 🚨 COMMON PITFALLS - AVOID THESE!

### ❌ MISTAKE 1: Wrong Account
**Problem:** Deployed in personal account instead of business  
**Prevention:** Verify account in top-right of every page  
**Fix:** Delete everything, start over with correct account

### ❌ MISTAKE 2: APIs Not Enabled
**Problem:** Forgot to enable Drive API, extraction fails  
**Prevention:** Enable ALL 4 APIs at once in Step 4  
**Fix:** Enable missing API, wait 30 min, run again

### ❌ MISTAKE 3: APIs Not Propagated
**Problem:** Enabled APIs but tested immediately  
**Prevention:** Wait 30 minutes after enabling (Step 4)  
**Fix:** Just wait, don't rush

### ❌ MISTAKE 4: GCP Not Linked Before Code
**Problem:** Pasted code before linking GCP project  
**Prevention:** Link GCP (Step 7) BEFORE pasting code (Step 8)  
**Fix:** Link GCP project, might need to re-authorize

### ❌ MISTAKE 5: Code Without Vision API
**Problem:** Deployed old version without extraction code  
**Prevention:** Verify functions exist in Step 8  
**Fix:** Use re-extraction script (see below)

### ❌ MISTAKE 6: Invoices Processed Before Extraction Working
**Problem:** 147 invoices uploaded but Amount/IBAN empty  
**Prevention:** Verify extraction in logs (Step 12)  
**Fix:** Run RE_EXTRACT_DATA_SCRIPT.gs (one-time fix)

---

## 🔧 IF EXTRACTION IS MISSING (Emergency Fix)

**Symptoms:**
- Invoices in Drive ✅
- Invoices in spreadsheet ✅
- But Amount/Invoice#/IBAN columns EMPTY ❌

**Fix:**
1. Open Apps Script
2. Scroll to VERY BOTTOM of code
3. Paste: `RE_EXTRACT_DATA_SCRIPT.gs` (from GitHub)
4. Save
5. Select: `testReExtractSingleRow` → Run → Check logs
6. If works: Select `reExtractAllInvoices` → Run
7. Wait 5-10 minutes
8. Check spreadsheet → Data should be filled!

**Why this happens:**
- Invoices processed before Vision API fully working
- System marks them "done" so won't re-process
- Re-extraction script fixes retroactively

---

## ✅ SUCCESS CRITERIA

**Deployment is successful when:**

- [ ] Folder structure exists in Drive
- [ ] Spreadsheet has all 10 columns
- [ ] Test invoice appears in spreadsheet
- [ ] **Amount column has extracted value** (most critical!)
- [ ] **Invoice Number column has extracted value**
- [ ] **IBAN column has extracted value**
- [ ] Triggers are running automatically
- [ ] Client can access and edit spreadsheet
- [ ] Client trained on Category/Notes entry

**If ALL checkboxes above = ✅ → Deployment complete! 🎉**

---

## 📞 TROUBLESHOOTING REFERENCE

**Issue:** Spreadsheet columns empty  
**Check:** Step 12 & 13  
**Fix:** Re-extraction script

**Issue:** "API not enabled" error  
**Check:** Step 4  
**Fix:** Enable missing API, wait 30 min

**Issue:** "Permission denied"  
**Check:** Step 10  
**Fix:** Re-authorize

**Issue:** Folder not created  
**Check:** Step 11  
**Fix:** Check Drive API enabled

**Issue:** Extraction not showing in logs  
**Check:** Step 12  
**Fix:** Verify code has extraction functions

---

## 📝 CLIENT HANDOFF CHECKLIST

Before leaving client site:

- [ ] All success criteria met (above)
- [ ] Client can open spreadsheet
- [ ] Client knows how to add Category/Notes
- [ ] Client has TROUBLESHOOTING.md link
- [ ] Client knows system only works on EMAIL invoices
- [ ] Client knows 10% extraction errors are normal
- [ ] Scheduled 1-week follow-up
- [ ] Scheduled 1-month check-in

---

## 🎓 LESSONS FROM TEATRO DEPLOYMENT

**What we learned the hard way:**

1. **APIs need 30-60 min to propagate** - don't rush!
2. **Link GCP BEFORE pasting code** - order matters!
3. **Verify extraction in logs immediately** - catch issues early!
4. **Check spreadsheet columns have data** - visual confirmation!
5. **Test with real invoice before celebrating** - end-to-end validation!

**Time estimates:**
- Perfect deployment: 45 minutes
- With one issue: 90 minutes
- With major issue: 2-3 hours (or fresh start)

**Fresh start is faster than debugging after:**
- 30 minutes into wrong account
- 45 minutes of API issues
- 60 minutes of extraction problems

---

## 📊 DEPLOYMENT TRACKING

**Client:** _______________  
**Date:** _______________  
**Deployed by:** _______________  
**Time taken:** _______________  
**Issues encountered:** _______________  
**Resolution:** _______________  
**Success?** ☐ Yes ☐ No (if no, notes below)

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________

---

**Version:** 1.0  
**Last Updated:** January 16, 2026  
**Next Review:** After next 3 client deployments

**This checklist exists because we made ALL these mistakes with Teatro so YOU don't have to!** 💚
