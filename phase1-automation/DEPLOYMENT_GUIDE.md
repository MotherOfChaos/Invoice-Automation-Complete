# 🔍 GOOGLE CLOUD VISION API - SETUP GUIDE

**For: Teatro Invoice Automation with Auto-Extraction**

---

## 📋 WHAT THIS DOES

Adds automatic data extraction to your invoice automation:
- ✅ Reads PDF and JPEG invoices
- ✅ Extracts: Amount, Invoice Number, IBAN
- ✅ Auto-fills spreadsheet (Laura just adds category/notes)
- ✅ **FREE:** 1,000 requests/month (30+ invoices/day)

---

## ⚙️ ONE-TIME SETUP (10 minutes)

### STEP 1: Enable Cloud Vision API

1. Go to: **https://console.cloud.google.com**
2. Sign in as **info@teatrometamorfosis.com**
3. **Create a new project:**
   - Click "Select a project" (top left)
   - Click "NEW PROJECT"
   - Name: **Teatro Invoice Automation**
   - Click "CREATE"
4. Wait for project creation (~30 seconds)

---

### STEP 2: Enable Vision API

1. In the search bar (top), type: **Vision API**
2. Click **"Cloud Vision API"**
3. Click **"ENABLE"**
4. Wait for activation (~1 minute)

✅ **Vision API is now active!**

---

### STEP 3: Link to Apps Script

1. Go back to your Apps Script project: **script.google.com**
2. Click **⚙️ Settings** (left sidebar)
3. Scroll down to **"Google Cloud Platform (GCP) Project"**
4. Click **"Change project"**
5. Enter your GCP project number:
   - Go back to Cloud Console
   - Click project name (top left)
   - Copy the **Project Number** (looks like: 123456789012)
6. Paste into Apps Script
7. Click **"Set Project"**

✅ **Apps Script linked to Cloud Vision!**

---

### STEP 4: Deploy Updated Code

1. **Delete** all old code in Apps Script
2. **Paste** the new code (INVOICE_AUTOMATION_WITH_VISION.gs)
3. **Save** (File > Save or Ctrl+S)
4. **Authorize:**
   - Select `runInitialScan` from dropdown
   - Click ▶ Run
   - Authorize new permissions (Vision API access)

✅ **Ready to test!**

---

## 🧪 TESTING

### Test 1: Process One Invoice

1. Upload a test invoice to info@ or laura@ email
2. Run `runManual` in Apps Script
3. Check logs - should see:
   - "Extracted: Amount: 150.50"
   - "Extracted: Invoice #: INV-2025-001"
   - "Extracted: IBAN: ES12..."
4. Check spreadsheet - fields should be auto-filled!

### Test 2: Date Range Scan

1. Run `scanDateRange` (Q1+Q2 2025)
2. Check Drive folders - invoices uploaded
3. Check spreadsheets - data extracted
4. **Note:** First 1,000 invoices = FREE

---

## 💰 COSTS & LIMITS

**FREE TIER:**
- 1,000 requests/month = FREE
- ~30 invoices/day = FREE
- After 1,000 = €1.50 per 1,000 images

**Your usage:**
- Estimated: 100-300 invoices/month
- **Cost: FREE** ✅

**If you exceed 1,000/month:**
- Cost = ~€1.50-€5/month (still very cheap!)

---

## 🔧 TROUBLESHOOTING

**Error: "Vision API not enabled"**
- Go back to Step 2, make sure API is enabled
- Wait 5 minutes and try again

**Error: "Permission denied"**
- Re-authorize in Apps Script
- Make sure you're signed in as info@

**Extraction not accurate:**
- Vision API works 90%+ of the time
- Laura can manually fix the 10% edge cases

---

## ✅ AFTER SETUP

**Daily automation:**
- Runs 3x/day (8am, 3pm, 10pm)
- Finds new invoices
- Extracts data automatically
- Laura reviews spreadsheet
- 98% automated! 🎉

---

**Questions? Let M know!** 💚
