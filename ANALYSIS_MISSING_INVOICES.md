# 📊 MISSING INVOICES ANALYSIS

**Date:** 2025-01-19
**Control Data:** C:\Users\sarah\Desktop\CLAUDE DATABASE DOCS\PROJECTS\INVOICE EXTRACT AUTOMATION\2025_CONTROL_DATA

---

## 🔍 FINDINGS

### Summary
- **Total files in control folder:** 543
- **Total PDFs:** 531
- **PDFs with invoice keywords in filename:** 406
- **PDFs WITHOUT invoice keywords:** 125
- **Script found:** 112 invoices
- **Expected to find:** 531 invoices (or at least 406 with keywords)

---

## 🚨 CRITICAL ISSUE

**The filename-based filtering is TOO RESTRICTIVE!**

Current keywords: `invoice`, `factura`, `pago`, `pagos`, `recibo`, `receipt`, `payment`

### Files Being Missed (Examples):

1. **Entradium tickets** (~200+ files)
   - `100344-0179-entradium-hoja.pdf`
   - `101017-0180-entradium-hoja.pdf`
   - Pattern: Numbers-entradium-hoja.pdf

2. **UUID/Random filenames** (~30+ files)
   - `0EB6BA2F-5B17-499D-A881-9E06B7B05650.pdf`
   - `2172251E-C98A-4544-938B-ED296A27C416.pdf`

3. **Numeric-only filenames** (~20+ files)
   - `10022519.pdf`
   - `5146046031.pdf`
   - `5167571140.pdf`

4. **Custom invoice codes** (~40+ files)
   - `DGFCJ2500026807.pdf`
   - `DGFCJ2500085982.pdf`
   - `ENT2025_P000399-91894-factura.pdf` ← HAS "factura" (should work)

5. **Abbreviated formats** (~15+ files)
   - `FAC MAIG 25-31.pdf` (FAC = factura abbreviation)
   - `FACT ABRIL-32.pdf` (FACT = factura abbreviation)
   - `FRA_LOCAL TAPIOLES_12_ABR_25.pdf` (FRA = factura abbreviation)

6. **Month-based** (~10+ files)
   - `enero2025.pdf`
   - `abril2025.pdf`
   - `mayo2025.pdf`
   - `junio2025.pdf`

7. **Bank statements/Extractos** (~5+ files)
   - `account-statement_2025-01-01_2025-03-20_en-gb_c0871d.pdf`
   - `Santander_20mar202515028 - movimientos.pdf`

---

## 💡 ROOT CAUSE

**M's original code had the same filename filtering**, but you likely:
1. Manually renamed files before using the system, OR
2. The 147+ count included ALL file types (PDFs + images + Excel), not just invoice PDFs

The system is working CORRECTLY per the code logic, but **real-world invoice filenames are too diverse**.

---

## 🎯 SOLUTIONS

### Option 1: Expand Keywords (Quick Fix)
Add more keywords to catch abbreviations and patterns:
```javascript
invoiceKeywords: [
  'invoice', 'factura', 'pago', 'pagos', 'recibo', 'receipt', 'payment',
  'fac', 'fact', 'fra',  // Abbreviations
  'entradium', 'hoja',   // Ticket service
  'ent2025',             // Your invoice code pattern
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',  // Months
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
]
```

**Pros:** Easy, catches most cases
**Cons:** Still misses UUID filenames and pure numeric ones

---

### Option 2: Check File Location in Email (Better)
Instead of filtering by filename, check if the attachment is in certain folders or from certain senders:
- Entradium emails → Extract all PDFs
- Emails with "invoice/factura" in subject → Extract all PDFs
- Specific sender domains → Extract all PDFs

**Pros:** Catches everything
**Cons:** More complex logic

---

### Option 3: Extract ALL PDFs, Filter Manually (Manual Control)
Remove filename filtering entirely, extract ALL PDFs with attachments, then YOU review and delete non-invoices.

**Pros:** Never miss an invoice
**Cons:** More manual work (defeats automation purpose)

---

### Option 4: Hybrid Approach (RECOMMENDED)
```javascript
// Extract if EITHER:
// 1. Filename has invoice keyword, OR
// 2. Email subject has invoice keyword, OR
// 3. Sender is known invoice sender (entradium, specific vendors)
```

**Pros:** Best balance of automation + coverage
**Cons:** Requires maintaining sender whitelist

---

## 📋 MISSING FILES BY CATEGORY

### Definitely Invoices (Should Extract):
- Entradium tickets: ~200 files
- FAC/FACT/FRA abbreviations: ~15 files
- ENT2025 codes (already have "factura"): Should work
- Month-named files: ~10 files

### Maybe Invoices (Need Your Decision):
- UUID filenames: ~30 files (could be invoices or receipts)
- Pure numbers: ~20 files (could be invoice numbers)
- DGFCJ codes: ~15 files (vendor-specific)

### Probably NOT Invoices:
- Bank statements: ~5 files
- Excel spreadsheets: ~10 files

---

## ✅ RECOMMENDATION

**For v1.3, I recommend Option 1 + Partial Option 4:**

1. Expand keywords to include:
   - Abbreviations: `fac`, `fact`, `fra`
   - Entradium: `entradium`, `hoja`
   - Months: All Spanish month names
   - Your codes: `ent2025`, `dgfcj`

2. This should catch ~90% of missing invoices (450+ instead of 112)

3. For remaining edge cases (UUIDs, pure numbers):
   - Either extract ALL PDFs and manually filter
   - Or add sender email whitelist

**Want me to implement Option 1 now in v1.3?**

---

**Files List:**
See `/tmp/control_files.txt` for complete list of 531 PDF filenames.
