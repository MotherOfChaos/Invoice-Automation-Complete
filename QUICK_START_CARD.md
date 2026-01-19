# 🚀 QUICK START CARD - Invoice Automation v1.0

**For Teatro Metamorfosis - Sarah's Cheat Sheet**

---

## 📦 What You Have

✅ **Complete automation system** ready to deploy
✅ **All code in:** `phase1-automation/INVOICE_AUTOMATION_FINAL.gs`
✅ **All documentation** in `documentation/` folder

---

## 🎯 Deploy in 3 Steps (15 minutes)

### 1️⃣ Copy Code to Apps Script
- Go to https://script.google.com
- New project → "Invoice Automation - Teatro"
- Copy `INVOICE_AUTOMATION_FINAL.gs` → Paste in Code.gs
- Save (Ctrl+S)

### 2️⃣ Run First Setup
- Select `firstRun` from dropdown
- Click "Run" ▶
- Authorize permissions
- Wait 10-15 min
- Check logs for "147+ invoices"

### 3️⃣ Activate Daily Automation
- Select `setupDailyTriggers` from dropdown
- Click "Run" ▶
- Click clock icon ⏰ to verify triggers
- Done! ✅

---

## 📧 What Happens Next

**Automatic runs at:**
- 🌅 8:00 AM CET
- 🌆 6:00 PM CET

**You receive email at:** sarah@teatrometamorfosis.com
- ✅ Success: "X new invoices found"
- 📧 No invoices: "No new invoices"
- ❌ Error: "ERROR during automation"

---

## 🔍 Quick Reference

### Where is everything?
```
📁 Drive: INVOICES_FACTURAS_TEATRO/
   ├── 2025/
   │   ├── 1r trimestre/
   │   ├── 2do trimestre/
   │   ├── 3r trimestre/
   │   ├── 4to trimestre/
   │   └── Invoices_2025 (spreadsheet)
   └── 2026/
       └── (same structure)
```

### What gets scanned?
- **Accounts:** info@teatrometamorfosis.com, laura@teatrometamorfosis.com
- **Keywords:** invoice, factura, pago, pagos, recibo, receipt, payment
- **From:** 2025/01/01 onwards
- **Excludes:** Sent emails (no self-scanning)

### What gets extracted?
1. Date of Invoice
2. Company Name
3. Invoice Number
4. Description
5. Amount (with €/$)
6. IBAN/Payment Info
7. Drive Link (automatic)

---

## 🧪 Test Before Going Live

```javascript
// 1. Run first setup
firstRun()  // Should find 147+ invoices

// 2. Test no duplicates
dailyAutomation()  // Should find 0 new

// 3. Send test invoice email to info@ or laura@

// 4. Test with new invoice
dailyAutomation()  // Should find 1 new

// 5. Activate automation
setupDailyTriggers()
```

---

## 🔧 If Something Goes Wrong

### Check Execution Logs
- Apps Script → "Executions" (left sidebar)
- Click any run to see details
- Look for errors or warnings

### Common Fixes

**"No invoices found"**
→ Check keywords in CONFIG
→ Verify date range
→ Check email permissions

**"Vision API error"**
→ Check API key in CONFIG
→ Verify billing enabled on GCP
→ Project: 111456918352

**"Not receiving emails"**
→ Check spam folder
→ Verify notificationEmail in CONFIG

---

## 💰 Want to Sell to Clients?

See: `documentation/CLIENT_CUSTOMIZATION_GUIDE.md`

**Only 5 settings to change!**
- Email accounts
- Notification email
- Folder name
- Keywords (for different language)
- Vision API credentials (client's own)

**Suggested pricing:** €500-1200 one-time setup

---

## 📞 Need Help?

**Read first:**
1. `DELIVERY_SUMMARY.md` - Complete overview
2. `TRIGGER_SETUP_GUIDE.md` - Automation details
3. `VERSION_HISTORY.md` - Technical specs

**Check:**
- Execution logs in Apps Script
- Email notifications for errors
- Drive folder permissions

---

## ✅ Success Checklist

After deployment, verify:

- [ ] Folders created in Drive
- [ ] Spreadsheets created with data
- [ ] 147+ invoices found
- [ ] Vision API extracting data
- [ ] 2 triggers active (clock icon ⏰)
- [ ] Receiving notification emails
- [ ] No duplicates on repeat runs

---

## 🎯 Key Files Quick Reference

**Main Code:**
`phase1-automation/INVOICE_AUTOMATION_FINAL.gs`

**Setup Guide:**
`documentation/TRIGGER_SETUP_GUIDE.md`

**For Clients:**
`documentation/CLIENT_CUSTOMIZATION_GUIDE.md`

**This Summary:**
`DELIVERY_SUMMARY.md`

---

## 🚨 IMPORTANT

**First run takes 10-15 minutes** for 147+ invoices
**Daily runs take < 1 minute** (only new invoices)

**Don't panic if:**
- First run is slow (Vision API processing each invoice)
- Triggers don't run exactly at 8am/6pm (Google allows ±1 hour)

**Do panic if:**
- Error notifications keep arriving
- No invoices found after first run
- Check execution logs immediately!

---

## 🎉 You're All Set!

**Your invoice automation is:**
- ✅ Production ready
- ✅ Fully documented
- ✅ Tested and stable
- ✅ Ready to run forever

**Just deploy and activate triggers!**

---

**Version:** 1.0
**Date:** 2025-01-19
**Next action:** Deploy to Apps Script! 🚀
