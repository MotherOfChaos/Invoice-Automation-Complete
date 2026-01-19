# MISSING INVOICES - PATTERN ANALYSIS

**Total Missing:** 286 PDFs
**Location:** `MISSING_INVOICES_ANALYSIS` folder

---

## 📊 PATTERNS IDENTIFIED (Before Email Analysis)

### 1. **Entradium Tickets** (~170 files)
Pattern: `XXXXX-XXXX-entradium-hoja.pdf`
Examples:
- 100344-0179-entradium-hoja.pdf
- 101017-0180-entradium-hoja.pdf
- 113275-0253-entradium-hoja.pdf

**Quick Fix:** Add `'entradium'` and `'hoja'` to keywords

---

### 2. **FAC/FACT/FRA Abbreviations** (~25 files)
Examples:
- FAC MAIG 25-31.pdf
- FACT ABRIL-32.pdf
- FRA_LOCAL TAPIOLES_12_ABR_25.pdf
- FRA.CHUCHES.pdf
- FRA.FRINGE25.pdf

**Quick Fix:** Add `'fac'`, `'fact'`, `'fra'` to keywords

---

### 3. **Month Names** (~15 files)
Examples:
- enero2025.pdf
- febrero2025.pdf
- marzo2025.pdf
- abril2025.pdf
- mayo2025.pdf
- junio2025.pdf
- julio2025.pdf
- agosto2025.pdf
- septiembre2025.pdf
- octubre2025.pdf
- noviembre2025.pdf
- diciembre2025.pdf

**Quick Fix:** Add all Spanish month names to keywords

---

### 4. **Vendor-Specific Codes** (~25 files)

**DGFCJ codes** (~12 files):
- DGFCJ2500026807.pdf
- DGFCJ2500085982.pdf
- Pattern: `DGFCJ25XXXXXXXX.pdf`

**P25CON codes** (~10 files):
- 20250127-P25CON003566143.pdf
- 20250226-P25CON009367815.pdf
- Pattern: `YYYYMMDD-P25CONXXXXXXXX.pdf`

**Quick Fix:** Add `'dgfcj'` and `'p25con'` to keywords

---

### 5. **LAS TIAS DEL SEC** (~8 files)
Examples:
- 111_1T_2025_LAS TIAS DEL SEC.pdf
- 2025-0149 Las tias del sec SL.pdf
- Las tias del sec S.L. _19.pdf
- LAS TIAS DEL SEC 14-11-2025.pdf

**Quick Fix:** Add `'tias'` and `'sec'` to keywords

---

### 6. **Nómina (Payroll)** (~10 files)
Examples:
- Nómina 01_2025.pdf
- Nömina 06_2025.pdf
- NOM RUIVAL, MARIA LAURA.pdf
- H.S._Mensual_Finiq_RUIVAL, MARIA LAURA_11-2025.pdf

**Quick Fix:** Add `'nomina'`, `'nómina'`, `'nom'` to keywords

---

### 7. **UUID/Random Filenames** (~20 files)
Examples:
- 0EB6BA2F-5B17-499D-A881-9E06B7B05650.pdf
- 2172251E-C98A-4544-938B-ED296A27C416.pdf
- 38BE528A-B0BC-4171-8FB9-521CB4B8A1A6.pdf

**Problem:** No pattern in filename - NEEDS EMAIL SUBJECT ANALYSIS

---

### 8. **Numeric-Only** (~15 files)
Examples:
- 10022519.pdf
- 5146046031.pdf
- 70001.pdf

**Problem:** No pattern in filename - NEEDS EMAIL SUBJECT ANALYSIS

---

### 9. **Other Specific Vendors** (~10 files)
- Santander_20mar202515028 - movimientos.pdf (bank)
- account-statement_2025-01-01_2025-03-20_en-gb_c0871d.pdf (bank)
- payout BCN 1.2025.pdf (payment)
- MOD.111 3T25.pdf (tax forms)
- MOD.303 3T25.pdf (tax forms)

---

## ✅ IMMEDIATE ACTION (Before Email Analysis)

Add these keywords to catch ~250 out of 286 files:

```javascript
invoiceKeywords: [
  // Current keywords
  'invoice', 'factura', 'pago', 'pagos', 'recibo', 'receipt', 'payment',

  // Abbreviations
  'fac', 'fact', 'fra',

  // Ticket service
  'entradium', 'hoja',

  // Vendor codes
  'dgfcj', 'p25con',

  // Company names
  'tias', 'sec',

  // Payroll
  'nomina', 'nómina', 'nom',

  // Month names (Spanish)
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',

  // Additional
  'payout', 'mod', 'santander'
]
```

This should catch **~250 of the 286 missing invoices** (87% improvement!)

---

## 🔍 REMAINING 36 FILES NEED EMAIL SUBJECT ANALYSIS

Files with no pattern (UUID, numeric, etc.) - 36 files
**Next Step:** Search these in email and extract subjects

Would you like me to:
1. Create v1.3 with expanded keywords NOW (catches 250 more files)
2. Wait for you to analyze the remaining 36 email subjects
3. Then create v1.4 with complete keyword list

---

**Files Available:**
- All 286 missing PDFs: `MISSING_INVOICES_ANALYSIS/` folder
- Complete list: `MISSING_FILES_LIST.txt`
