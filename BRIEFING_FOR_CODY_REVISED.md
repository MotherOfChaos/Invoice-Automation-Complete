# INVOICE AUTOMATION SYSTEM - BRIEFING FOR CODY (REVISED)

**Date:** January 18, 2026  
**Project:** Teatro Metamorfosis Invoice Automation  
**New Approach:** Modular functions that can run separately or together  
**Tech Stack:** Google Apps Script, Gmail API, Google Drive API, Vision API (Phase 2)

**⚠️ CRITICAL LESSON LEARNED:**
We lost working code by overwriting it. This briefing implements strict version control. **Every iteration must be saved as a new versioned file.**

**🔑 ALL CONFIGURATION IN ONE PLACE:**
See "MASTER CONFIGURATION" section below - contains all emails, credentials, API keys, etc.

---

## 🎯 PROJECT GOAL

Build modular invoice automation system with separate functions for:
1. Scanning emails and extracting attachments
2. Creating spreadsheets and extracting data from attachments
3. Auto-categorizing expenses (future)

**Key Principle:** Each phase can run independently OR together as "First Run"

---

## ⚙️ MASTER CONFIGURATION - CLIENT CUSTOMIZATION

**🎯 FOR FUTURE CLIENTS: Change these 5 sections to customize for new client**

```javascript
// ==========================================
// MASTER CONFIGURATION - Invoice Automation
// ==========================================

const CONFIG = {
  
  // ============================================
  // 🔧 CLIENT-SPECIFIC: CHANGE FOR EACH CLIENT
  // ============================================
  
  // 1️⃣ EMAIL ACCOUNTS TO SCAN
  emailAccounts: [
    'info@teatrometamorfosis.com',    // ← CHANGE: Client's main email
    'laura@teatrometamorfosis.com'    // ← CHANGE: Client's second email (or remove if only one)
  ],
  
  // 2️⃣ NOTIFICATION EMAIL
  notificationEmail: 'sarah@teatrometamorfosis.com',  // ← CHANGE: Who receives automation notifications
  
  // 3️⃣ FOLDER SHARING
  shareWithUsers: [
    'sarah@teatrometamorfosis.com',   // ← CHANGE: Who needs access to Drive folder
    'laura@teatrometamorfosis.com'    // ← CHANGE: Add/remove users as needed
  ],
  
  // 4️⃣ FOLDER NAME
  mainFolderName: 'INVOICES_FACTURAS_TEATRO',  // ← CHANGE: Client's folder name
  
  // 5️⃣ VISION API CREDENTIALS (if client has their own GCP)
  visionAPI: {
    projectNumber: '111456918352',    // ← CHANGE: Client's GCP project number
    apiKey: 'AIzaSyB1v8s77GqrPGJ7Q_UxFZ82outB5hnhRTw',  // ← CHANGE: Client's Vision API key
    endpoint: 'https://vision.googleapis.com/v1/images:annotate'  // ← KEEP: Same for all
  },
  
  // ============================================
  // ✅ UNIVERSAL: SAME FOR ALL CLIENTS
  // ============================================
  
  years: ['2025', '2026'],  // Update annually
  quarters: ['1r trimestre', '2do trimestre', '3r trimestre', '4to trimestre'],
  invoiceKeywords: ['invoice', 'factura', 'pago', 'pagos', 'recibo', 'receipt', 'payment'],
  scanStartDate: '2025/01/01',
  
  triggers: {
    morning: '8:00 AM',   // CET
    evening: '6:00 PM'    // CET
  },
  
  columns: [
    'Date of Invoice',
    'Name of Entity/Company/Provider',
    'Invoice/Factura Number',
    'Description of Service',
    'Total Amount (with currency)',
    'IBAN / Payment Instructions',
    'Category',
    'Payment Status',
    'Drive Link',
    'Notes'
  ]
};
```

---

## 📋 QUICK SETUP FOR NEW CLIENT (5 minutes)

**What to change:**
1. **emailAccounts** → Client's Gmail accounts to scan
2. **notificationEmail** → Who receives daily summaries
3. **shareWithUsers** → Who needs Drive folder access
4. **mainFolderName** → Client's company name for folder
5. **visionAPI** → Client's GCP project (or use Teatro's for multiple clients)

**What stays the same:**
- Everything else! (keywords, quarters, columns, etc.)

---

## 🔑 CURRENT TEATRO METAMORFOSIS CONFIG

**For reference (this specific deployment):**
- **Scan accounts:** info@teatrometamorfosis.com, laura@teatrometamorfosis.com
- **Notify:** sarah@teatrometamorfosis.com
- **Share folder:** sarah@teatrometamorfosis.com, laura@teatrometamorfosis.com
- **Vision API Project:** 111456918352
- **Vision API Key:** AIzaSyB1v8s77GqrPGJ7Q_UxFZ82outB5hnhRTw
- **Runs:** 8am & 6pm CET daily
- **GitHub:** https://github.com/MotherOfChaos/Invoice-Automation-Complete

---

## 📧 EMAIL ACCOUNTS TO SCAN

- `info@teatrometamorfosis.com`
- `laura@teatrometamorfosis.com`

**Date Range:** All of 2025 + 2026 (from 2025-01-01 onwards)

**Keywords:** INVOICE, FACTURA, PAGO, PAGOS, RECIBO, RECEIPT, PAYMENT

**📨 Notifications Recipient:** All automation notifications (success & errors) go to `sarah@teatrometamorfosis.com`

---

## 📁 REQUIRED FOLDER STRUCTURE

**Created ONLY on first run** - Must check for existing folders to avoid duplicates!

```
INVOICES_FACTURAS_TEATRO/
├── 2025/
│   ├── 1r trimestre/    (Q1: Jan-Mar)
│   ├── 2do trimestre/   (Q2: Apr-Jun)
│   ├── 3r trimestre/    (Q3: Jul-Sep)
│   └── 4to trimestre/   (Q4: Oct-Dec)
└── 2026/
    ├── 1r trimestre/
    ├── 2do trimestre/
    ├── 3r trimestre/
    └── 4to trimestre/
```

**File Naming:** Invoices saved as `YYYY-MM-DD_originalfilename.ext`

**Sharing:** Folder shared with `sarah@teatrometamorfosis.com` and `laura@teatrometamorfosis.com`

---

## 📊 SPREADSHEET STRUCTURE (NEW!)

**One spreadsheet per year:** `Invoices_2025.xlsx`, `Invoices_2026.xlsx`

**Location:** Inside year folder (e.g., in `/2025/` folder)

**Structure:** 4 tabs (one per quarter):
- Tab 1: "Q1 - 1r trimestre"
- Tab 2: "Q2 - 2do trimestre"
- Tab 3: "Q3 - 3r trimestre"
- Tab 4: "Q4 - 4to trimestre"

**Columns in each tab:**
1. Date of Invoice (extracted from invoice, not email date)
2. Name of Entity/Company/Provider (who to pay)
3. Invoice/Factura Number
4. Description of Service (e.g., "Electricity - January", "Show: La Traviata")
5. Total Amount (after IVA/VAT/taxes) - with currency symbol (€, $, £)
6. IBAN / Payment Instructions (bank details, PayPal, wire transfer info, etc.)
7. Category (Phase 4 - manual first)
8. Payment Status (manual - for Laura)
9. Drive Link (URL to file)
10. Notes (manual)

---

## 🔄 MODULAR FUNCTION STRUCTURE

### **MAIN FUNCTIONS:**

```javascript
// ===== FIRST TIME SETUP =====
// Run this ONCE to set up everything
function firstRun() {
  setupFolders();           // Phase 1: Create folders
  scanAndExtractEmails();   // Phase 1: Scan emails & extract attachments
  createSpreadsheets();     // Phase 2: Create spreadsheet structure
  extractInvoiceData();     // Phase 2: Scrape invoices & fill spreadsheet
}

// ===== DAILY AUTOMATION =====
// This runs automatically twice per day (8am & 6pm)
function dailyAutomation() {
  scanAndExtractEmails();   // Find NEW emails only
  extractInvoiceData();     // Extract data from NEW files only
  // Sends email notification if new invoices found
}

// ===== INDIVIDUAL FUNCTIONS =====
// Can also run these separately for testing/maintenance
function setupFolders() { ... }
function scanAndExtractEmails() { ... }
function createSpreadsheets() { ... }
function extractInvoiceData() { ... }
```

---

## ⏰ AUTOMATIC DAILY EXECUTION

**After first run, the system must run automatically twice per day**

**📨 IMPORTANT:** All email notifications (success & errors) are sent to `sarah@teatrometamorfosis.com`

### **Trigger Schedule:**
- **Morning:** 8:00 AM CET
- **Evening:** 6:00 PM CET

### **What Runs Automatically:**
```javascript
// This function runs on schedule (NOT firstRun!)
function dailyAutomation() {
  Logger.log('🤖 AUTOMATIC RUN - ' + new Date());
  
  // Only scan NEW emails and extract data
  // Do NOT recreate folders or spreadsheets
  scanAndExtractEmails();   // Phase 1: New invoices only
  extractInvoiceData();     // Phase 2: Extract data from new files
  
  Logger.log('✅ Daily automation complete');
}
```

### **Setting Up Triggers in Google Apps Script:**

**Cody should include these instructions in documentation:**

1. **In Apps Script Editor:**
   - Click ⏰ **Triggers** (left sidebar)
   - Click **+ Add Trigger** (bottom right)

2. **Morning Trigger:**
   - Function: `dailyAutomation`
   - Deployment: Head
   - Event source: Time-driven
   - Type: Day timer
   - Time: 8am to 9am
   - Click **Save**

3. **Evening Trigger:**
   - Function: `dailyAutomation`
   - Deployment: Head
   - Event source: Time-driven
   - Type: Day timer
   - Time: 6pm to 7pm
   - Click **Save**

### **Automation Safety Checks:**

```javascript
function dailyAutomation() {
  try {
    // Check if folders exist before running
    const mainFolder = DriveApp.getFoldersByName('INVOICES_FACTURAS_TEATRO');
    if (!mainFolder.hasNext()) {
      throw new Error('Main folder not found - run firstRun() first!');
    }
    
    // Run email scan (with duplicate prevention)
    const newInvoices = scanAndExtractEmails();
    Logger.log(`✅ Found ${newInvoices} new invoices`);
    
    // Extract data from new files only
    if (newInvoices > 0) {
      extractInvoiceData();
      
      // Send summary email to SARAH
      MailApp.sendEmail({
        to: 'sarah@teatrometamorfosis.com',
        subject: `✅ Daily Invoice Automation: ${newInvoices} new invoices`,
        body: `Found and processed ${newInvoices} new invoices.\n\nCheck INVOICES_FACTURAS_TEATRO folder.`
      });
    }
    
  } catch (error) {
    // Send error notification to SARAH
    MailApp.sendEmail({
      to: 'sarah@teatrometamorfosis.com',
      subject: '⚠️ Invoice Automation Error',
      body: `Error in daily automation:\n\n${error.message}\n\nCheck Apps Script logs.`
    });
    throw error;
  }
}
```

### **Testing Automation:**

**Before enabling triggers, test manually:**
```javascript
// 1. Run first setup
firstRun();

// 2. Test daily automation (should find 0 new invoices if just ran firstRun)
dailyAutomation();

// 3. Send test invoice email to info@
// (email yourself with "Factura test" subject + PDF attachment)

// 4. Wait 1 minute

// 5. Run dailyAutomation() again
// Should find 1 new invoice

// 6. If test works, enable triggers
```

### **Monitoring Automation:**

**Check execution logs:**
- Apps Script → **Executions** tab
- Shows all automatic runs
- Success/failure status
- Execution time
- Any errors

**Email notifications (sent to sarah@teatrometamorfosis.com):**
- ✅ **Success:** Daily summary if new invoices found
- ❌ **Error:** Immediate notification with error details

**Example Success Email:**
```
To: sarah@teatrometamorfosis.com
Subject: ✅ Daily Invoice Automation: 3 new invoices
Body: Found and processed 3 new invoices.

Check INVOICES_FACTURAS_TEATRO folder.
```

**Example Error Email:**
```
To: sarah@teatrometamorfosis.com
Subject: ⚠️ Invoice Automation Error
Body: Error in daily automation:

[Error message details]

Check Apps Script logs.
```

---

## 📝 PHASE 1: EMAIL SCANNING & ATTACHMENT EXTRACTION

### **Function:** `scanAndExtractEmails()`

**What it does:**
1. Scans both Gmail accounts (info@ and laura@)
2. Searches for emails containing keywords in:
   - Email subject
   - Email body
   - Attachment filename
3. Extracts ALL attachments from matching emails
4. Saves to appropriate year/quarter folder
5. **CRITICAL:** Checks for duplicates before saving!

**Keywords:** INVOICE, FACTURA, PAGO, PAGOS, RECIBO, RECEIPT, PAYMENT

**Accepted File Types:** ALL formats (PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, ZIP, etc.)

**Gmail Query:**
```javascript
// Search emails from 2025 onwards with attachments
// Exclude sent emails from our accounts
// Search everywhere including Trash/Spam
const query = `after:2025/01/01 has:attachment in:anywhere -from:info@teatrometamorfosis.com -from:laura@teatrometamorfosis.com`;
```

**Detection Logic:**
```javascript
function shouldExtractAttachment(message, attachment) {
  const keywords = ['invoice', 'factura', 'pago', 'pagos', 'recibo', 'receipt', 'payment'];
  
  const filename = attachment.getName().toLowerCase();
  const subject = message.getSubject().toLowerCase();
  const body = message.getPlainBody().toLowerCase();
  
  // Extract if keyword found in ANY of these
  return keywords.some(kw => 
    filename.includes(kw) || 
    subject.includes(kw) || 
    body.includes(kw)
  );
}
```

**Duplicate Prevention:**
```javascript
// Check if file already exists before uploading
const datePrefix = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
const newFilename = `${datePrefix}_${attachment.getName()}`;

const existingFiles = quarterFolder.getFilesByName(newFilename);
if (existingFiles.hasNext()) {
  Logger.log(`   ⏭️ SKIP: ${newFilename} already exists`);
  return false; // Skip duplicate
}
```

**Important Notes:**
- NO spreadsheet creation in Phase 1
- Phase 1 ONLY handles email scanning and file organization
- Must work even if run multiple times (duplicate prevention)

---

## 📊 PHASE 2: SPREADSHEET CREATION & DATA EXTRACTION

### **Function:** `createSpreadsheets()`

**What it does:**
1. Creates one spreadsheet per year
2. Each spreadsheet has 4 tabs (one per quarter)
3. Sets up column headers
4. Shares with team

**Location:** Spreadsheet saved inside year folder

**Tab Structure:**
```javascript
// Example for 2025
const spreadsheet = SpreadsheetApp.create('Invoices_2025');

// Create 4 sheets
const q1 = spreadsheet.getActiveSheet();
q1.setName('Q1 - 1r trimestre');

const q2 = spreadsheet.insertSheet('Q2 - 2do trimestre');
const q3 = spreadsheet.insertSheet('Q3 - 3r trimestre');
const q4 = spreadsheet.insertSheet('Q4 - 4to trimestre');

// Move to year folder
const yearFolder = DriveApp.getFolderByName('2025');
DriveApp.getFileById(spreadsheet.getId()).moveTo(yearFolder);
```

### **Function:** `extractInvoiceData()`

**What it does:**
1. Scans all files in quarter folders
2. Uses Google Vision API to extract:
   - Date of invoice
   - Company/provider name
   - Invoice number
   - Description/service
   - Total amount (after taxes)
   - Currency (€, $, £)
   - **IBAN / Payment instructions** (bank account, PayPal, wire transfer details, etc.)
3. Writes data to appropriate quarter tab
4. Adds Drive link to file

**Vision API Configuration:**
- GCP Project: 111456918352
- API Key: `AIzaSyB1v8s77GqrPGJ7Q_UxFZ82outB5hnhRTw`
- Already enabled and billing linked

**Data Extraction Example:**
```javascript
// For each invoice file
const visionResult = callVisionAPI(fileBlob);

// Extract structured data
const invoiceData = {
  date: extractDate(visionResult),           // Date on invoice
  company: extractCompanyName(visionResult), // Who to pay
  invoiceNumber: extractInvoiceNumber(visionResult),
  description: extractDescription(visionResult),
  amount: extractAmount(visionResult),       // After taxes
  currency: extractCurrency(visionResult),   // €, $, £
  iban: extractIBAN(visionResult),          // Bank details/payment info
  driveLink: file.getUrl()
};

// Add to correct quarter tab
const sheet = getQuarterSheet(invoiceData.date);
sheet.appendRow([
  invoiceData.date,
  invoiceData.company,
  invoiceData.invoiceNumber,
  invoiceData.description,
  invoiceData.amount + ' ' + invoiceData.currency,
  invoiceData.iban,              // IBAN or payment instructions
  '', // Category (Phase 4)
  '', // Payment status (manual)
  invoiceData.driveLink,
  '' // Notes (manual)
]);
```

**IBAN Extraction Tips:**
```javascript
function extractIBAN(visionText) {
  // IBAN format: ES12 1234 5678 9012 3456 7890
  const ibanRegex = /[A-Z]{2}\d{2}[\s]?[\d\s]{12,30}/g;
  const iban = visionText.match(ibanRegex);
  
  if (iban) {
    return iban[0].replace(/\s/g, ''); // Remove spaces
  }
  
  // Look for other payment keywords
  const paymentKeywords = ['paypal', 'transferencia', 'wire transfer', 'cuenta', 'account'];
  // Extract context around these keywords
  
  return ''; // Empty if not found (Laura adds manually)
}
```

---

## 🏷️ PHASE 4: CATEGORY AUTO-ASSIGNMENT (FUTURE)

**Initial:** Manual category assignment by Laura

**Future Automation:**
```javascript
const categoryRules = {
  'MORITZ': 'BAR EXPENSES',
  'COPISTERIA': 'PRINTING',
  'ENDESA': 'UTILITIES - ELECTRICITY',
  'AGBAR': 'UTILITIES - WATER',
  // etc...
};

function assignCategory(companyName) {
  for (const [keyword, category] of Object.entries(categoryRules)) {
    if (companyName.toUpperCase().includes(keyword)) {
      return category;
    }
  }
  return ''; // Empty if no match (Laura assigns manually)
}
```

---

## 🔧 TECHNICAL REQUIREMENTS

### **Duplicate Prevention (CRITICAL!):**

**Folders:**
```javascript
function setupFolders() {
  // Check if main folder exists
  const existingFolders = DriveApp.getFoldersByName('INVOICES_FACTURAS_TEATRO');
  
  if (existingFolders.hasNext()) {
    Logger.log('✅ Using existing folder structure');
    return getExistingStructure(existingFolders.next());
  }
  
  // Only create if doesn't exist
  return createNewFolderStructure();
}
```

**Files:**
```javascript
// ALWAYS check before uploading
const existingFiles = quarterFolder.getFilesByName(newFilename);
if (existingFiles.hasNext()) {
  return false; // Skip - already exists
}
```

**Spreadsheet Entries:**
```javascript
// Check if Drive link already exists in spreadsheet
const sheet = getQuarterSheet(date);
const data = sheet.getDataRange().getValues();
const driveLinks = data.map(row => row[7]); // Column 8 = Drive Link

if (driveLinks.includes(fileUrl)) {
  Logger.log('   ⏭️ SKIP: Already in spreadsheet');
  return false;
}
```

---

## 📦 GITHUB REPOSITORY & VERSION CONTROL

**Repo:** https://github.com/MotherOfChaos/Invoice-Automation-Complete

**CRITICAL: VERSION CONTROL STRATEGY**

⚠️ **DO NOT overwrite previous versions!** Save each iteration as NEW file.

**Folder Structure:**
```
/phase1-automation/
  ├── versions/
  │   ├── v1.0_initial_modular.gs
  │   ├── v1.1_duplicate_prevention.gs
  │   ├── v1.2_email_content_search.gs
  │   └── v2.0_working_production.gs
  ├── INVOICE_AUTOMATION_FINAL.gs  (← Latest working version)
  └── README.md

/phase2-extraction/
  ├── versions/
  │   ├── v1.0_vision_api_setup.gs
  │   └── v2.0_working_extraction.gs
  └── DATA_EXTRACTION_FINAL.gs

/documentation/
  ├── SYSTEM_SPECIFICATIONS.md
  ├── TROUBLESHOOTING.md
  ├── DEPLOYMENT_GUIDE.md
  └── VERSION_HISTORY.md
```

---

## 🔧 GIT OPERATIONS FOR CODY

**Yes, Cody CAN interact with Git autonomously!**

### Workflow:
```bash
# Clone repo
git clone https://github.com/MotherOfChaos/Invoice-Automation-Complete.git
cd Invoice-Automation-Complete

# For each iteration
git add phase1-automation/versions/v1.X_description.gs
git commit -m "v1.X: Description of changes"
git push origin main

# Update version history
git add documentation/VERSION_HISTORY.md
git commit -m "Updated version history with v1.X"
git push origin main
```

---

## 🎯 SUCCESS CRITERIA

### **Phase 1 Complete When:**
- [ ] Scans both email accounts
- [ ] Finds all invoices (target: 147+ from 2025)
- [ ] All files organized in correct year/quarter folders
- [ ] NO duplicates (can run multiple times safely)
- [ ] Folders created only once (checks for existing)
- [ ] All file types accepted (PDF, DOC, XLS, images, etc.)
- [ ] Files named: `YYYY-MM-DD_originalname.ext`

### **Phase 2 Complete When:**
- [ ] One spreadsheet per year created
- [ ] 4 tabs per spreadsheet (one per quarter)
- [ ] All invoices extracted and data filled in spreadsheet
- [ ] Correct columns: date, company, number, description, amount+currency, **IBAN**, etc.
- [ ] Vision API successfully extracts data
- [ ] **IBAN/payment info extracted** (or empty if not found)
- [ ] Drive links work

### **Automation Complete When:**
- [ ] `dailyAutomation()` function created
- [ ] Triggers set up for 8am and 6pm CET
- [ ] Test run shows it finds NEW invoices only
- [ ] No duplicates created when run multiple times
- [ ] **Email notifications sent to sarah@teatrometamorfosis.com** (tested both success & error)
- [ ] Execution logs show successful runs
- [ ] Documentation includes trigger setup instructions

### **Ready for Production When:**
- [ ] All Phase 1 + Phase 2 criteria met
- [ ] Automation tested and working
- [ ] Can run `firstRun()` once, then automatic forever
- [ ] Laura can review invoices in organized spreadsheets
- [ ] System runs reliably without intervention

---

## 📦 DELIVERABLES FOR CODY

**For Phase 1:**

1. **All version iterations** in `/phase1-automation/versions/`
   - `v1.0_initial_modular.gs`
   - `v1.1_add_duplicate_prevention.gs`
   - etc.

2. **Final working code:** `INVOICE_AUTOMATION_FINAL.gs`
   - Modular functions
   - Can run separately or together
   - Duplicate prevention working
   - All requirements met
   - **Includes `dailyAutomation()` function**

3. **Test results:**
   - Show it finds 147+ invoices
   - Show duplicate prevention works (run twice, same result)
   - Show folder structure correct
   - **Show automation test (finds NEW invoices only)**

4. **Documentation:**
   - Update VERSION_HISTORY.md
   - Document each version
   - What worked, what didn't
   - **TRIGGER_SETUP_GUIDE.md** - Step-by-step instructions for setting up automatic triggers

**For Phase 2:**

1. **Vision API integration** working
2. **Spreadsheet creation** with correct structure (4 tabs per year)
3. **Data extraction** filling spreadsheets accurately
4. **IBAN extraction** working (or gracefully handling when not found)
5. **Testing** showing accurate extraction

**For Automation:**

1. **`dailyAutomation()` function** tested and working
2. **Email notifications** for success and errors
3. **Documentation:** `TRIGGER_SETUP_GUIDE.md` with:
   - How to set up time-based triggers
   - How to test automation
   - How to monitor executions
   - How to troubleshoot errors
4. **Test results** showing:
   - First run finds all invoices
   - Second run finds 0 (no duplicates)
   - Send test email with invoice
   - Run automation, finds 1 new invoice

---

## 💡 KEY DIFFERENCES FROM PREVIOUS APPROACH

**OLD (broken):**
- Everything in one giant function
- Spreadsheet created during file extraction
- Date received (not date on invoice)
- One sheet per year (not tabs per quarter)
- Couldn't run phases separately
- No duplicate prevention
- Lost working code by overwriting
- **No automation** - manual runs only
- **No IBAN extraction**

**NEW (clean):**
- ✅ Modular functions (run separately or together)
- ✅ Phase 1 = email + files ONLY
- ✅ Phase 2 = spreadsheets + extraction ONLY
- ✅ Date from invoice (not email)
- ✅ Tabs per quarter (not one sheet)
- ✅ Duplicate prevention everywhere
- ✅ Version control (never lose code)
- ✅ Sellable to clients
- ✅ **Automatic daily runs** (8am & 6pm)
- ✅ **IBAN/payment info** extracted
- ✅ **Email notifications** on success/error
- ✅ **Set it and forget it** - runs forever after first setup

---

**Question for Cody:** Can you build this clean modular system from scratch following this new architecture?

**Thank you, Cody!** 🎯
