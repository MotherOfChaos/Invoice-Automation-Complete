# CONFIGURATION CHECKLIST FOR CODY

**Before submitting final code, verify ALL of these are included:**

---

## ✅ EMAIL CONFIGURATION

- [ ] Scan accounts: `info@teatrometamorfosis.com` and `laura@teatrometamorfosis.com`
- [ ] Exclude sent emails: `-from:info@teatrometamorfosis.com -from:laura@teatrometamorfosis.com`
- [ ] Notification recipient: `sarah@teatrometamorfosis.com` (NOT info@ or laura@)
- [ ] Folder sharing: Both `sarah@` and `laura@` have editor access

---

## ✅ VISION API CREDENTIALS

- [ ] GCP Project Number: `111456918352`
- [ ] API Key: `AIzaSyB1v8s77GqrPGJ7Q_UxFZ82outB5hnhRTw`
- [ ] Endpoint: `https://vision.googleapis.com/v1/images:annotate`
- [ ] API properly configured in code
- [ ] Error handling for Vision API failures

---

## ✅ FOLDER STRUCTURE

- [ ] Main folder: `INVOICES_FACTURAS_TEATRO`
- [ ] Years: `2025`, `2026`
- [ ] Quarters: `1r trimestre`, `2do trimestre`, `3r trimestre`, `4to trimestre`
- [ ] Duplicate folder prevention (checks if exists before creating)
- [ ] Sharing with sarah@ and laura@ configured

---

## ✅ KEYWORDS

All keywords in lowercase for matching:
- [ ] `invoice`
- [ ] `factura`
- [ ] `pago`
- [ ] `pagos`
- [ ] `recibo`
- [ ] `receipt`
- [ ] `payment`

---

## ✅ SEARCH CONFIGURATION

- [ ] Date range: `after:2025/01/01`
- [ ] Search everywhere: `in:anywhere` (includes Trash/Spam)
- [ ] Has attachment: `has:attachment`
- [ ] Exclude sent: `-from:info@ -from:laura@`
- [ ] Complete query working correctly

---

## ✅ FILE HANDLING

- [ ] All file types accepted (PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, ZIP, etc.)
- [ ] Filename format: `YYYY-MM-DD_originalfilename.ext`
- [ ] Duplicate file prevention (checks if exists before uploading)
- [ ] Files uploaded to correct year/quarter folder

---

## ✅ SPREADSHEET CONFIGURATION

**Structure:**
- [ ] One spreadsheet per year: `Invoices_2025`, `Invoices_2026`
- [ ] 4 tabs per spreadsheet (one per quarter)
- [ ] Tab names: `Q1 - 1r trimestre`, `Q2 - 2do trimestre`, etc.
- [ ] Spreadsheet location: Inside year folder

**Columns (in order):**
1. [ ] Date of Invoice
2. [ ] Name of Entity/Company/Provider
3. [ ] Invoice/Factura Number
4. [ ] Description of Service
5. [ ] Total Amount (with currency)
6. [ ] IBAN / Payment Instructions
7. [ ] Category
8. [ ] Payment Status
9. [ ] Drive Link
10. [ ] Notes

---

## ✅ VISION API EXTRACTION

- [ ] Date of invoice extracted
- [ ] Company/provider name extracted
- [ ] Invoice number extracted
- [ ] Description extracted
- [ ] Amount + currency extracted
- [ ] IBAN/payment info extracted (or empty if not found)
- [ ] Graceful handling when data not found

---

## ✅ AUTOMATION CONFIGURATION

- [ ] `dailyAutomation()` function created
- [ ] Runs 8am CET (morning trigger)
- [ ] Runs 6pm CET (evening trigger)
- [ ] Only scans NEW emails (not all emails again)
- [ ] Duplicate prevention working
- [ ] Error handling with notifications
- [ ] Success notifications to sarah@teatrometamorfosis.com
- [ ] Error notifications to sarah@teatrometamorfosis.com

---

## ✅ FUNCTIONS IMPLEMENTED

- [ ] `firstRun()` - Complete setup (run once)
- [ ] `setupFolders()` - Create folder structure
- [ ] `scanAndExtractEmails()` - Find and file invoices
- [ ] `createSpreadsheets()` - Create spreadsheet structure
- [ ] `extractInvoiceData()` - Vision API extraction
- [ ] `dailyAutomation()` - Automatic daily runs

---

## ✅ DUPLICATE PREVENTION

- [ ] Folders: Check if exists before creating
- [ ] Files: Check filename in folder before uploading
- [ ] Spreadsheet: Check Drive link before adding row
- [ ] Can run multiple times safely

---

## ✅ GITHUB REPOSITORY

- [ ] Repo: https://github.com/MotherOfChaos/Invoice-Automation-Complete
- [ ] All versions saved in `/versions/` folder
- [ ] Final code: `INVOICE_AUTOMATION_FINAL.gs`
- [ ] VERSION_HISTORY.md updated
- [ ] TRIGGER_SETUP_GUIDE.md created

---

## ✅ DOCUMENTATION

- [ ] Clear comments in code
- [ ] CONFIG section at top of file
- [ ] VERSION_HISTORY.md filled out
- [ ] TRIGGER_SETUP_GUIDE.md created
- [ ] README.md updated
- [ ] All instructions client-ready

---

## ✅ TESTING COMPLETED

- [ ] `firstRun()` finds all 147+ invoices
- [ ] Folders created correctly
- [ ] Spreadsheets created with correct structure
- [ ] Vision API extraction working
- [ ] IBAN extraction working (or graceful failure)
- [ ] `dailyAutomation()` finds NEW invoices only
- [ ] Running twice produces no duplicates
- [ ] Email notifications received by sarah@
- [ ] Error handling tested

---

## 🎯 FINAL VERIFICATION

**Before marking complete, run this test sequence:**

1. Delete all test folders/files
2. Run `firstRun()`
3. Verify: 147+ invoices found, organized correctly
4. Verify: Spreadsheets created with all data
5. Run `dailyAutomation()`
6. Verify: Finds 0 new (no duplicates)
7. Send test email with "Factura" + PDF attachment
8. Wait 1 minute
9. Run `dailyAutomation()`
10. Verify: Finds 1 new invoice
11. Verify: sarah@ receives success notification
12. Break something intentionally
13. Run `dailyAutomation()`
14. Verify: sarah@ receives error notification

**All tests pass? ✅ Ready for production!**

---

**Cody: Use this checklist before submitting final code!**
