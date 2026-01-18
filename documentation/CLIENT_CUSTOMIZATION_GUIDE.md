# CLIENT CUSTOMIZATION GUIDE

**For deploying Invoice Automation System to new clients**

---

## 🎯 QUICK START FOR NEW CLIENT

**Time to customize:** ~5 minutes  
**What you need from client:**
1. Gmail account emails to scan
2. Who should receive notifications
3. Who should have folder access
4. Their Google Cloud Project (for Vision API)

---

## ⚙️ STEP-BY-STEP CUSTOMIZATION

### **STEP 1: Email Configuration**

**Location in code:** Top of file, `CONFIG` object

**What to change:**
```javascript
const CONFIG = {
  // ===== CHANGE THESE EMAIL ACCOUNTS =====
  emailAccounts: [
    'info@CLIENTDOMAIN.com',      // ← Client's first account
    'billing@CLIENTDOMAIN.com'    // ← Client's second account (optional)
  ],
  
  // ===== WHO GETS NOTIFICATIONS? =====
  notificationEmail: 'admin@CLIENTDOMAIN.com',  // ← Daily summaries & errors
  
  // ===== WHO CAN ACCESS THE FOLDER? =====
  shareWithUsers: [
    'admin@CLIENTDOMAIN.com',      // ← Usually admin
    'accountant@CLIENTDOMAIN.com'  // ← Usually accountant/bookkeeper
  ],
```

**Questions to ask client:**
- Which email accounts receive invoices? (can be 1-5 accounts)
- Who should receive automation notifications?
- Who needs access to the invoice folder?

---

### **STEP 2: Folder & Structure**

**Location in code:** `CONFIG` object

**What to change:**
```javascript
  // ===== FOLDER NAME =====
  mainFolderName: 'INVOICES_CLIENT_NAME',  // ← Customize with client name
  
  // ===== YEARS TO TRACK =====
  years: ['2025', '2026'],  // ← Current year + next year usually
  
  // ===== QUARTER NAMES (Language-specific) =====
  quarters: [
    '1r trimestre',   // ← Spanish: Q1
    '2do trimestre',  // ← Spanish: Q2
    '3r trimestre',   // ← Spanish: Q3
    '4to trimestre'   // ← Spanish: Q4
  ],
  // English example: ['Q1', 'Q2', 'Q3', 'Q4']
  // French example: ['1er trimestre', '2ème trimestre', '3ème trimestre', '4ème trimestre']
```

**Questions to ask client:**
- What should the main folder be called?
- Which years to track? (usually current + next)
- What language for quarter names?

---

### **STEP 3: Keywords (Language-specific)**

**Location in code:** `CONFIG` object

**What to change:**
```javascript
  // ===== INVOICE KEYWORDS (Language-specific) =====
  invoiceKeywords: [
    'invoice',   // English
    'factura',   // Spanish
    'pago',      // Spanish: payment
    'pagos',     // Spanish: payments
    'recibo',    // Spanish: receipt
    'receipt',   // English
    'payment'    // English
  ],
  // Add client's language keywords!
  // German: 'rechnung', 'zahlung'
  // French: 'facture', 'paiement', 'reçu'
  // Italian: 'fattura', 'pagamento', 'ricevuta'
```

**Questions to ask client:**
- What language are their invoices in?
- Any specific terms they use? (e.g., "bill", "statement")

---

### **STEP 4: Date Range**

**Location in code:** `CONFIG` object

**What to change:**
```javascript
  // ===== START DATE FOR SCANNING =====
  scanStartDate: '2025/01/01',  // ← When to start scanning from
  
  // Usually: January 1st of current year
  // Or: Client's business start date
  // Or: When they started using email invoices
```

**Questions to ask client:**
- How far back to scan? (last year? last 2 years? all time?)

---

### **STEP 5: Vision API Credentials**

**⚠️ IMPORTANT:** Each client needs their own Google Cloud Project!

**What client needs to do:**
1. Go to https://console.cloud.google.com
2. Create new project (name: "Client Name Invoices")
3. Enable Vision API
4. Create API key
5. Enable billing (pay-as-you-go)

**Location in code:** `CONFIG` object

**What to change:**
```javascript
  // ===== VISION API (Client's own credentials) =====
  visionAPI: {
    projectNumber: 'CLIENT_PROJECT_NUMBER',     // ← From GCP Console
    apiKey: 'CLIENT_API_KEY',                   // ← From GCP Console
    endpoint: 'https://vision.googleapis.com/v1/images:annotate'  // ← Don't change
  },
```

**Help client find these:**
- **Project Number:** GCP Console → Project Info card (number under project name)
- **API Key:** GCP Console → APIs & Services → Credentials → Create API Key

---

### **STEP 6: Automation Schedule**

**Location in code:** `CONFIG` object

**What to change:**
```javascript
  // ===== AUTOMATION SCHEDULE =====
  triggers: {
    morning: '8:00 AM',   // ← Client's preferred morning time
    evening: '6:00 PM'    // ← Client's preferred evening time
  },
```

**Questions to ask client:**
- What times to check for new invoices? (twice daily recommended)
- Timezone consideration (script uses their Google account timezone)

---

### **STEP 7: Spreadsheet Columns (Optional)**

**Location in code:** `CONFIG` object

**Usually don't need to change**, but client might want different columns:

```javascript
  // ===== SPREADSHEET COLUMNS =====
  columns: [
    'Date of Invoice',
    'Name of Entity/Company/Provider',
    'Invoice/Factura Number',
    'Description of Service',
    'Total Amount (with currency)',
    'IBAN / Payment Instructions',
    'Category',          // ← Might rename
    'Payment Status',    // ← Might rename  
    'Drive Link',
    'Notes'
  ]
```

**Questions to ask client:**
- Any custom fields they need? (e.g., "Project Code", "Department")
- Different column names?

---

## 📋 CLIENT ONBOARDING CHECKLIST

Use this when setting up for a new client:

### **Information Gathering:**
- [ ] Client email accounts to scan (1-5 emails)
- [ ] Notification recipient email
- [ ] Folder access recipients (who needs access?)
- [ ] Preferred folder name
- [ ] Years to track
- [ ] Language for quarter names
- [ ] Invoice keywords in their language
- [ ] How far back to scan (date range)
- [ ] Automation schedule times
- [ ] Any custom columns needed

### **Technical Setup (Help Client):**
- [ ] Client creates Google Cloud Project
- [ ] Vision API enabled
- [ ] API key created
- [ ] Billing enabled on GCP
- [ ] Get project number
- [ ] Get API key

### **Code Customization:**
- [ ] Update `emailAccounts`
- [ ] Update `notificationEmail`
- [ ] Update `shareWithUsers`
- [ ] Update `mainFolderName`
- [ ] Update `years`
- [ ] Update `quarters` (language)
- [ ] Update `invoiceKeywords` (language)
- [ ] Update `scanStartDate`
- [ ] Update `visionAPI` credentials
- [ ] Update `triggers` schedule
- [ ] Update `columns` (if needed)

### **Deployment:**
- [ ] Copy code to client's Apps Script
- [ ] Run as client's account (important!)
- [ ] Test `firstRun()`
- [ ] Verify folders created
- [ ] Verify invoices found
- [ ] Set up triggers (8am & 6pm)
- [ ] Test automation
- [ ] Verify notifications work

### **Training Client:**
- [ ] Show them the folder structure
- [ ] Show them the spreadsheets
- [ ] Explain how to review invoices
- [ ] Show them how to add categories manually
- [ ] Explain automation (hands-off after setup)
- [ ] Give them notification email examples
- [ ] Show them how to check execution logs

---

## 💰 PRICING GUIDANCE

**What to charge:**

**Setup Fee:** €500-800 one-time
- Includes: Customization, GCP setup help, deployment, testing, training

**Monthly Fee:** €50-100/month (optional)
- Includes: Monitoring, troubleshooting, updates

**OR:**

**One-Time Only:** €800-1200
- Includes: Everything + 30 days support
- After that: Client manages themselves

---

## 🎯 WHAT MAKES THIS SELLABLE

**Value Propositions:**
- ✅ Saves 10-15 hours/month of manual invoice filing
- ✅ Never lose an invoice
- ✅ Perfect organization automatically
- ✅ Searchable in Drive
- ✅ Extract data automatically (amounts, IBANs)
- ✅ Multi-currency support
- ✅ Works with ANY email account
- ✅ Works in ANY language (customize keywords)
- ✅ Set it and forget it (runs automatically)

**Perfect For:**
- Theaters, venues, event spaces
- Small businesses with 50-500 invoices/year
- Freelancers with multiple clients
- Accountants managing multiple entities
- Anyone drowning in invoice emails

---

## 🔧 TROUBLESHOOTING FOR CLIENTS

**Common Issues:**

**"Not finding all invoices"**
→ Check keywords match their language
→ Add more keywords specific to their vendors

**"Vision API not working"**
→ Check API key is correct
→ Check billing is enabled
→ Check quota limits

**"Not receiving notifications"**
→ Check email address is correct
→ Check spam folder
→ Check Apps Script execution logs

**"Duplicates being created"**
→ Shouldn't happen if code is correct
→ Check execution logs for errors

---

## 📚 DOCUMENTATION TO GIVE CLIENT

**Include these files:**
1. **USER_GUIDE.md** - How to use the system
2. **TROUBLESHOOTING.md** - Common issues & fixes
3. **TRIGGER_SETUP_GUIDE.md** - How automation works
4. **FAQ.md** - Frequently asked questions

---

## ✅ CLIENT SUCCESS CRITERIA

**System is successful when:**
- [ ] Client receives notification emails
- [ ] Invoices appear in organized folders
- [ ] Spreadsheet data is accurate
- [ ] Automation runs twice daily without issues
- [ ] Client doesn't have to think about it
- [ ] Client recommends you to others!

---

**This is a TEMPLATE. Customize for each client!**
