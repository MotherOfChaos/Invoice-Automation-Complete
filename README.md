# Invoice Automation System

**Complete briefing package for building an automated invoice processing system**

---

## 🎯 For Cody: START HERE

**Main Briefing:** [BRIEFING_FOR_CODY_REVISED.md](BRIEFING_FOR_CODY_REVISED.md)

This 781-line document contains everything you need:
- ✅ All credentials (emails, API keys, project numbers)
- ✅ Complete technical specifications
- ✅ Modular function architecture
- ✅ Code examples and structure
- ✅ Success criteria
- ✅ Version control requirements

**Also Read:**
- [START_HERE_CODY.md](START_HERE_CODY.md) - Your quick start guide
- [documentation/CONFIGURATION_CHECKLIST.md](documentation/CONFIGURATION_CHECKLIST.md) - Verification checklist
- [documentation/CLIENT_CUSTOMIZATION_GUIDE.md](documentation/CLIENT_CUSTOMIZATION_GUIDE.md) - For selling to clients

---

## 📋 What This System Does

**Automated Invoice Processing for Teatro Metamorfosis:**

### Phase 1: Email Scanning & Filing
- Scans 2 Gmail accounts (info@ and laura@)
- Finds invoices using keywords (invoice, factura, pago, etc.)
- Organizes files into year/quarter folders
- Complete duplicate prevention

### Phase 2: Data Extraction
- Uses Google Vision API to extract:
  - Invoice date
  - Company/provider name
  - Invoice number
  - Description of service
  - Total amount (with currency)
  - IBAN/payment instructions
- Fills spreadsheet automatically (1 per year, 4 tabs per quarter)

### Automation
- Runs automatically twice daily (8am & 6pm CET)
- Sends notifications to sarah@teatrometamorfosis.com
- Error handling with email alerts

---

## 🔑 Key Features

- **Modular:** Functions can run separately or together
- **Version Controlled:** Save each iteration (v1.0, v1.1, v2.0, etc.)
- **Duplicate Prevention:** Can run multiple times safely
- **Sellable:** Only 5 settings to change per client!
- **Production Ready:** Runs automatically forever after setup

---

## 📦 Repository Structure

```
/
├── BRIEFING_FOR_CODY_REVISED.md      ← MAIN BRIEFING (START HERE!)
├── START_HERE_CODY.md                ← Quick start for Cody
├── START_HERE_SARAH.md               ← Instructions for Sarah
├── PACKAGE_SUMMARY.md                ← Overview of everything
└── documentation/
    ├── CLIENT_CUSTOMIZATION_GUIDE.md ← Make it sellable!
    ├── CONFIGURATION_CHECKLIST.md    ← Verification checklist
    └── VERSION_HISTORY_TEMPLATE.md   ← Template to fill

/phase1-automation/                   ← Cody creates this
    ├── versions/
    │   ├── v1.0_description.gs
    │   ├── v1.1_description.gs
    │   └── v2.0_working_production.gs
    └── INVOICE_AUTOMATION_FINAL.gs   ← Latest working version

/documentation/                       ← Cody adds to this
    ├── VERSION_HISTORY.md            ← Cody fills this
    └── TRIGGER_SETUP_GUIDE.md        ← Cody creates this
```

---

## 🚀 Quick Start for Cody

1. **Read:** [BRIEFING_FOR_CODY_REVISED.md](BRIEFING_FOR_CODY_REVISED.md) (~15 min)
2. **Verify:** Check [CONFIGURATION_CHECKLIST.md](documentation/CONFIGURATION_CHECKLIST.md)
3. **Build:** Start with v1.0 (basic email scanning)
4. **Iterate:** Save each version in `/phase1-automation/versions/`
5. **Document:** Fill [VERSION_HISTORY_TEMPLATE.md](documentation/VERSION_HISTORY_TEMPLATE.md)
6. **Test:** Must find 147+ invoices
7. **Push:** All code to this repo

---

## 🎯 Success Criteria

- [x] Finds all 147+ invoices from Teatro
- [x] Modular functions (can run separately)
- [x] Complete duplicate prevention
- [x] Vision API extraction working
- [x] IBAN/payment info extracted
- [x] Daily automation configured
- [x] All versions saved
- [x] VERSION_HISTORY.md complete
- [x] Client-customizable (sellable!)

**✅ v1.0 COMPLETE - Production Ready!**

---

## 💰 For Selling to Clients

See [CLIENT_CUSTOMIZATION_GUIDE.md](documentation/CLIENT_CUSTOMIZATION_GUIDE.md)

**Only 5 settings to change:**
1. Email accounts to scan
2. Notification email
3. Folder sharing
4. Folder name
5. Vision API credentials

**Pricing:** €500-1200 one-time setup

---

## 📞 Contact

**Project:** Teatro Metamorfosis Invoice Automation  
**Date:** January 18, 2026  
**Client:** Sarah (MotherOfChaos)

---

**Cody: Everything you need is in this repo. Read the briefing and start building!** 🎯
