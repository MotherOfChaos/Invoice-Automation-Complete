# 📋 INVOICE AUTOMATION SYSTEM - SPECIFICATIONS

**Version:** 3.0 Final  
**Last Updated:** January 16, 2026  
**Client:** Teatro Metamorfosis (Barcelona)

---

## 🎯 SYSTEM OVERVIEW

**Purpose:** Automatically process invoices received via email with AI-powered data extraction

**Automation Level:** 98%  
**Monthly Cost:** €0 (within free tier)  
**Accuracy Rate:** 98% (147/150 invoices found)

---

## ✅ WHAT THE SYSTEM DOES

### Email Processing
- ✅ Monitors multiple email accounts (info@, laura@)
- ✅ Scans Gmail for attachments with invoice keywords
- ✅ Searches: Inbox, Sent, Spam, Trash, All folders
- ✅ Processes PDF and image attachments
- ✅ Runs historical scan (Q1+Q2) on first execution
- ✅ Scheduled scanning: 3 times daily

### Data Extraction (AI-Powered)
- ✅ Extracts invoice amount (90%+ accuracy)
- ✅ Extracts invoice number (90%+ accuracy)
- ✅ Extracts IBAN/payment details (90%+ accuracy)
- ✅ Supports multiple currencies (EUR, USD, GBP)
- ✅ Graceful fallback if extraction fails

### Organization
- ✅ Creates year/quarter folder structure
- ✅ Uploads invoices to correct quarter
- ✅ Prevents duplicates
- ✅ Names files with date prefix (YYYY-MM-DD_filename.pdf)
- ✅ Shares folders with team members

### Tracking
- ✅ Creates annual spreadsheets
- ✅ Auto-fills: Date, Sender, Email, Amount, Invoice#, IBAN, Quarter, Drive Link
- ✅ Leaves blank: Category, Notes (for manual entry)
- ✅ Formatted with headers and colors

---

## ❌ WHAT THE SYSTEM DOES NOT DO

### Critical Limitations

**1. ONLY PROCESSES EMAIL INVOICES**
- ❌ Cannot find invoices downloaded from portals
- ❌ Cannot process manually uploaded files
- ❌ Cannot scan paper invoices (unless emailed as attachment)
- ❌ Cannot access invoices from ticket platforms
- ❌ Cannot retrieve invoices from external systems

**2. MANUAL WORK STILL REQUIRED**
- ❌ Does not auto-categorize invoices (team must add category)
- ❌ Does not add notes (team must add notes)
- ❌ Does not verify extracted data (team should double-check)
- ❌ Does not pay invoices (only organizes them)
- ❌ Does not send reminders for unpaid invoices

**3. TECHNICAL LIMITATIONS**
- ❌ Cannot process invoices older than historicalScanStartDate
- ❌ Cannot access emails not sent to monitored accounts
- ❌ Cannot guarantee 100% extraction accuracy (10% need manual fixes)
- ❌ Cannot process handwritten invoices
- ❌ Cannot extract data from complex multi-page invoices

---

## 🔧 SYSTEM REQUIREMENTS

### Google Workspace
- ✅ Business email account (info@company.com)
- ✅ Google Drive access
- ✅ Gmail access
- ✅ Google Sheets access

### Google Cloud Platform
- ✅ GCP Project (free tier)
- ✅ Cloud Vision API enabled
- ✅ Drive API enabled
- ✅ Gmail API enabled
- ✅ Sheets API enabled
- ✅ OAuth consent configured

### Apps Script
- ✅ Project linked to GCP
- ✅ Code deployed
- ✅ Permissions authorized
- ✅ Triggers configured (3x daily)

---

## 📊 CONFIGURATION PARAMETERS

### Email Accounts Monitored
```javascript
emailAccounts: [
  'info@teatrometamorfosis.com',      // PRIMARY
  'laura@teatrometamorfosis.com'      // SECONDARY
]
```

### Invoice Keywords
```javascript
invoiceKeywords: ['factura', 'invoice', 'recibo', 'receipt']
```
**Note:** Invoices without these keywords in filename will be missed

### Date Ranges
```javascript
historicalScanStartDate: '2025-01-01'  // Q1 start
historicalScanEndDate: '2025-06-30'     // Q2 end
daysToSearch: 2                         // Daily scan looks back 2 days
```

### Folder Structure
```javascript
mainFolderName: 'INVOICES_FACTURAS_TEATRO'
years: ['2025', '2026']
quarters: ['1r trimestre', '2do trimestre', '3r trimestre', '4to trimestre']
```

### Shared Access
```javascript
shareWithUsers: [
  'sarah@teatrometamorfosis.com',
  'laura@teatrometamorfosis.com'
]
```

---

## 📈 PERFORMANCE METRICS

### Accuracy
- **Overall:** 98% (147/150 invoices found)
- **Data Extraction:** 90%+ accuracy
- **Target:** 95%+ considered excellent

### Missing Invoices Analysis
**3 invoices not found because:**
1. Downloaded from ticket platform (not emailed)
2. Manually uploaded to Drive (not emailed)
3. Different source (not emailed)

**Conclusion:** System working as designed - only processes EMAIL invoices

### Processing Speed
- **First run:** 5-10 minutes (creates folders + historical scan)
- **Daily runs:** 30-60 seconds (scans last 2 days)
- **Per invoice:** <2 seconds (upload + extraction + spreadsheet entry)

### Cost
- **Monthly:** €0 (within free tier limits)
- **Free tier:** 1,000 Vision API calls/month
- **Usage:** ~150-300 invoices/month = well within free tier

---

## 🚨 KNOWN ISSUES & WORKAROUNDS

### Issue 1: Manual Invoices Not Found
**Problem:** Invoices downloaded from portals or manually uploaded  
**Workaround:** Team manually uploads to correct quarter folder  
**Impact:** 2% of invoices (acceptable)

### Issue 2: 10% Extraction Errors
**Problem:** Vision API misreads some invoices  
**Workaround:** Team manually corrects in spreadsheet  
**Impact:** 15-30 seconds per invoice to fix

### Issue 3: Missing Invoice Keywords
**Problem:** Some invoices don't contain "factura" or "invoice" in filename  
**Workaround:** Add more keywords to CONFIG or rename attachments  
**Impact:** Rare (<1%)

### Issue 4: Wrong Email Account
**Problem:** Invoice sent to personal email (sarah@) not monitored account  
**Workaround:** Forward to info@ or laura@  
**Impact:** Rare (<1%)

---

## 🔐 SECURITY & PRIVACY

### Data Access
- ✅ Script runs AS business account (info@)
- ✅ Only accesses emails sent TO monitored accounts
- ✅ Does not read personal emails
- ✅ OAuth permissions limited to: Gmail, Drive, Sheets

### Data Storage
- ✅ All data stored in company Google Drive
- ✅ Folders shared only with specified team members
- ✅ No data sent to external servers (except Google APIs)
- ✅ Vision API does not store invoice images

### Permissions Required
- ✅ Read Gmail messages
- ✅ Read/write Google Drive
- ✅ Read/write Google Sheets
- ✅ Cloud Vision API access

---

## 📅 MAINTENANCE SCHEDULE

### Daily
- ✅ Automated scans (3x: 8am, 3pm, 10pm)
- ✅ No manual intervention needed

### Weekly
- ✅ Team reviews spreadsheet for missing categories
- ✅ Team verifies extracted amounts
- ✅ Team adds notes as needed

### Monthly
- ✅ Check for any missing invoices
- ✅ Verify folder structure intact
- ✅ Review error logs (if any)

### Quarterly
- ✅ Verify all invoices archived
- ✅ Check storage usage (should be minimal)
- ✅ Confirm triggers still running

### Annually
- ✅ Update year folders (add 2027, 2028, etc.)
- ✅ Archive old years
- ✅ Review keyword list (add new terms if needed)

---

## 🎓 USER WORKFLOW

### For Team Members (Laura, Sarah)

**Daily Routine:**
1. Check email for invoice notification
2. Open spreadsheet link from notification
3. Add **Category** for new invoices
4. Add **Notes** if needed
5. Verify **Amount** is correct (fix if wrong)
6. Done! (5-10 minutes total)

**For Manual Invoices:**
1. Download invoice from portal/platform
2. Navigate to INVOICES_FACTURAS_TEATRO folder
3. Open correct Year → Quarter folder
4. Upload invoice with descriptive filename
5. Open spreadsheet for that year
6. Manually add row with invoice details
7. Done! (2-3 minutes per invoice)

---

## 🔄 SYSTEM LIFECYCLE

### Phase 1: Initial Deployment (Completed)
✅ GCP project created  
✅ APIs enabled  
✅ OAuth configured  
✅ Code deployed  
✅ Permissions authorized  
✅ Historical scan completed (Q1+Q2)

### Phase 2: Validation (Completed)
✅ Created validation script  
✅ Compared manual vs automated results  
✅ Found 147/150 = 98% accuracy  
✅ Identified 3 missing (manual uploads)  
✅ Confirmed system working as designed

### Phase 3: Production (Current)
✅ Running daily scans  
✅ Processing new invoices automatically  
✅ Team using spreadsheets  
✅ System stable and reliable

### Phase 4: Optimization (Future)
🔜 Add more invoice keywords based on patterns  
🔜 Create monthly summary reports  
🔜 Add payment tracking (optional)  
🔜 Integrate with accounting software (optional)

---

## 📚 RELATED DOCUMENTATION

- **DEPLOYMENT_GUIDE.md** - How to deploy for new client
- **TROUBLESHOOTING.md** - Common issues and fixes
- **IMPLEMENTATION_LOG.md** - Lessons learned
- **Phase 1 Code** - `/phase1-automation/INVOICE_AUTOMATION_FINAL.gs`
- **Phase 2 Code** - `/phase2-verification/VALIDATION_SCRIPT.gs`

---

## 📞 SUPPORT

**For technical issues:**
- Check TROUBLESHOOTING.md first
- Review Apps Script execution logs
- Verify APIs still enabled
- Check trigger configuration

**For system changes:**
- Update CONFIG object in code
- Redeploy if needed
- Test with sample invoice
- Update documentation

---

**Document Version:** 1.0  
**Last Review:** January 16, 2026  
**Next Review:** April 2026 (quarterly)
