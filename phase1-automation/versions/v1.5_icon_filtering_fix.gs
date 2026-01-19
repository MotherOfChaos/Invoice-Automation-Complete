/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INVOICE AUTOMATION SYSTEM v1.5
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * For: Teatro Metamorfosis
 * Created: 2025-01-19
 * Updated: 2025-01-19 v1.5 - FIXED: Icon filtering + size threshold (50KB min)
 *
 * WHAT THIS DOES:
 * - Scans emails for invoices from 2 Gmail accounts
 * - SEARCHES: Email SUBJECT line for keywords (not body, not filenames)
 * - Organizes attachments into year/quarter folders
 * - Creates spreadsheets with quarterly tabs
 * - Extracts invoice data using Google Vision API
 * - Runs automatically twice daily (8am & 6pm CET)
 * - Prevents duplicates at all levels
 *
 * MULTI-LANGUAGE SUPPORT:
 * - Works with Gmail in ANY language (English, Spanish, German, French, etc.)
 * - Gmail search operator "subject:" is universal across all languages
 * - User sees "Asunto:", "Betreff:", "Objet:" but search uses "subject:"
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * SYSTEM COSTS (FOR CLIENT SALES)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * FREE COMPONENTS:
 * ✅ Google Apps Script - FREE (cloud-based, no hosting costs)
 * ✅ Gmail API - FREE (20,000 emails/day quota)
 * ✅ Google Drive API - FREE (within existing Drive storage)
 * ✅ Google Sheets API - FREE (unlimited spreadsheet creation)
 *
 * PAID COMPONENT:
 * 💰 Google Cloud Vision API - OCR/Text extraction from invoices
 *    - First 1,000 requests/month: FREE
 *    - After 1,000 requests/month: $1.50 per 1,000 requests
 *
 * COST EXAMPLES:
 * - 100 invoices/month: $0 (under free tier)
 * - 500 invoices/month: $0 (under free tier)
 * - 1,000 invoices/month: $0 (exactly at free tier limit)
 * - 2,000 invoices/month: $1.50 (1,000 free + 1,000 paid)
 * - 5,000 invoices/month: $6.00 (1,000 free + 4,000 paid)
 *
 * TYPICAL MONTHLY COST: $0-3 for most small businesses
 *
 * OPTIONAL: Vision API can be disabled for $0 cost (manual data entry required)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * - firstRun() - Complete initial setup (run once)
 * - dailyAutomation() - Daily scheduled runs
 * - setupFolders() - Create folder structure
 * - scanAndExtractEmails() - Find and organize invoices
 * - createSpreadsheets() - Generate quarterly workbooks
 * - extractInvoiceData() - Vision API data extraction
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION - MODIFY THESE FOR DIFFERENT CLIENTS
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // ===== EMAIL ACCOUNTS TO SCAN =====
  emailAccounts: [
    'info@teatrometamorfosis.com',
    'laura@teatrometamorfosis.com'
  ],

  // ===== WHO GETS NOTIFICATIONS =====
  notificationEmail: 'sarah@teatrometamorfosis.com',

  // ===== WHO CAN ACCESS THE FOLDER =====
  shareWithUsers: [
    'sarah@teatrometamorfosis.com',
    'laura@teatrometamorfosis.com'
  ],

  // ===== FOLDER STRUCTURE =====
  mainFolderName: 'INVOICES_FACTURAS_TEATRO',
  years: ['2025', '2026'],
  quarters: [
    '1r trimestre',   // Q1: Jan-Mar
    '2do trimestre',  // Q2: Apr-Jun
    '3r trimestre',   // Q3: Jul-Sep
    '4to trimestre'   // Q4: Oct-Dec
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // ===== KEYWORDS TO SEARCH FOR (FOR FUTURE PRODUCT CUSTOMIZATION) =====
  // ═══════════════════════════════════════════════════════════════════════════
  //
  // SEARCH LOCATION: Email SUBJECT line ONLY
  // These keywords are searched in the email subject/asunto field at the Gmail
  // API level, NOT in the email body or attachment filenames.
  //
  // MULTI-LANGUAGE SUPPORT:
  // Gmail's "subject:" search operator works universally across ALL languages:
  //   - English Gmail (Subject:)   → uses "subject:" search operator
  //   - Spanish Gmail (Asunto:)    → uses "subject:" search operator
  //   - German Gmail (Betreff:)    → uses "subject:" search operator
  //   - French Gmail (Objet:)      → uses "subject:" search operator
  //   - Italian Gmail (Oggetto:)   → uses "subject:" search operator
  //   - Portuguese Gmail (Assunto:)→ uses "subject:" search operator
  //
  // The search operator is always "subject:" regardless of interface language.
  //
  // CASE-INSENSITIVE: "Factura", "factura", "FACTURA" all match
  //
  // HOW TO CUSTOMIZE FOR DIFFERENT CLIENTS:
  // - Add language-specific invoice terms for the client's region
  // - Add company-specific invoice codes or abbreviations
  // - Add vendor-specific patterns unique to the business
  // - Add payroll/payment terms if processing payroll documents
  //
  // KEYWORD EXAMPLES BY LANGUAGE:
  // - Spanish: factura, fra, fac, recibo, nómina, pago
  // - English: invoice, receipt, payment, payout, bill
  // - German: rechnung, beleg, zahlung, quittung
  // - French: facture, reçu, paiement, quittance
  // - Italian: fattura, ricevuta, pagamento
  // - Portuguese: fatura, recibo, pagamento
  //
  // ═══════════════════════════════════════════════════════════════════════════

  invoiceKeywords: [
    // Original keywords
    'invoice',
    'invoices',
    'factura',
    'facturas',
    'pago',
    'pagos',
    'recibo',
    'receipt',
    'payment',
    'payout',

    // Invoice abbreviations
    'fra',
    'ftra',
    'fac',
    'fact',

    // Payroll terms
    'nómina',
    'nomina',
    'nömina',
    'nom',
    'hoja de pago',
    'hojas de pago',

    // Additional terms (user-specified)
    'justificante de presentación',
    'limitador de sonido caducado',
    'credit note'
  ],

  // ===== DATE RANGE =====
  scanStartDate: '2025/01/01',  // YYYY/MM/DD format for Gmail search

  // ===== VISION API CREDENTIALS =====
  visionAPI: {
    projectNumber: '111456918352',
    apiKey: 'AIzaSyB1v8s77GqrPGJ7Q_UxFZ82outB5hnhRTw',
    endpoint: 'https://vision.googleapis.com/v1/images:annotate'
  },

  // ===== AUTOMATION SCHEDULE =====
  triggers: {
    morning: 8,   // 8:00 AM CET
    evening: 18   // 6:00 PM CET
  },

  // ===== SPREADSHEET COLUMNS =====
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

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ORCHESTRATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FIRST RUN - Complete Initial Setup
 * Run this ONCE to set up everything from scratch
 */
function firstRun() {
  const startTime = new Date();
  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log('FIRST RUN - Complete Initial Setup');
  Logger.log('Started: ' + startTime);
  Logger.log('═══════════════════════════════════════════════════════════');

  try {
    // Phase 1: Setup folders
    Logger.log('\n📁 PHASE 1: Setting up folder structure...');
    const folderStructure = setupFolders();
    Logger.log('✅ Folders created successfully');

    // Phase 2: Scan and extract emails
    Logger.log('\n📧 PHASE 2: Scanning emails and extracting invoices...');
    const scanResults = scanAndExtractEmails(folderStructure);
    Logger.log('✅ Found and organized ' + scanResults.totalInvoices + ' invoices');

    // Phase 3: Create spreadsheets
    Logger.log('\n📊 PHASE 3: Creating spreadsheets...');
    const spreadsheets = createSpreadsheets(folderStructure);
    Logger.log('✅ Spreadsheets created successfully');

    // Phase 4: Extract invoice data with Vision API
    Logger.log('\n🔍 PHASE 4: Extracting invoice data with Vision API...');
    const extractionResults = extractInvoiceData(folderStructure, spreadsheets);
    Logger.log('✅ Data extraction complete');

    // Send success notification
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000 / 60; // minutes

    const summary = `
FIRST RUN COMPLETED SUCCESSFULLY! ✅

Duration: ${duration.toFixed(2)} minutes

Results:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Emails scanned: ${scanResults.emailsScanned}
📎 Invoices found: ${scanResults.totalInvoices}
📁 Files organized: ${scanResults.filesOrganized}
📊 Data rows extracted: ${extractionResults.rowsExtracted}

Folders created:
${CONFIG.years.map(year => `  • ${year}/ with ${CONFIG.quarters.length} quarterly folders`).join('\n')}

Spreadsheets created:
${CONFIG.years.map(year => `  • Invoices_${year} (${CONFIG.quarters.length} tabs)`).join('\n')}

✅ System is ready for daily automation!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next steps:
1. Review the organized invoices in Drive
2. Check the spreadsheets for accuracy
3. Set up daily triggers (see TRIGGER_SETUP_GUIDE.md)
`;

    MailApp.sendEmail({
      to: CONFIG.notificationEmail,
      subject: '✅ Invoice Automation - First Run Complete',
      body: summary
    });

    Logger.log('\n' + summary);
    Logger.log('═══════════════════════════════════════════════════════════');

    return {
      success: true,
      scanResults: scanResults,
      extractionResults: extractionResults,
      duration: duration
    };

  } catch (error) {
    Logger.log('❌ ERROR during first run: ' + error.toString());

    // Send error notification
    MailApp.sendEmail({
      to: CONFIG.notificationEmail,
      subject: '❌ Invoice Automation - First Run FAILED',
      body: `ERROR during first run:\n\n${error.toString()}\n\nStack trace:\n${error.stack}`
    });

    throw error;
  }
}

/**
 * DAILY AUTOMATION - Scheduled Function
 * Run this twice daily (8am & 6pm) to process NEW invoices only
 */
function dailyAutomation() {
  const startTime = new Date();
  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log('DAILY AUTOMATION RUN');
  Logger.log('Started: ' + startTime);
  Logger.log('═══════════════════════════════════════════════════════════');

  try {
    // Get existing folder structure
    const folderStructure = getFolderStructure();
    if (!folderStructure) {
      throw new Error('Folder structure not found! Run firstRun() first.');
    }

    // Scan for NEW invoices only (last 24 hours)
    Logger.log('\n📧 Scanning for new invoices (last 24 hours)...');
    const scanResults = scanAndExtractEmails(folderStructure, true); // onlyNew = true

    if (scanResults.totalInvoices === 0) {
      Logger.log('✅ No new invoices found');

      // Send summary notification
      MailApp.sendEmail({
        to: CONFIG.notificationEmail,
        subject: '📧 Daily Invoice Check - No New Invoices',
        body: `Daily automation check completed.\n\nNo new invoices found in the last 24 hours.\n\nTime: ${new Date()}`
      });

      return { success: true, newInvoices: 0 };
    }

    // Get spreadsheets
    const spreadsheets = getSpreadsheets(folderStructure);

    // Extract data from new invoices
    Logger.log('\n🔍 Extracting data from new invoices...');
    const extractionResults = extractInvoiceData(folderStructure, spreadsheets, true); // onlyNew = true

    // Send success notification
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000 / 60;

    const summary = `
DAILY AUTOMATION COMPLETED ✅

Duration: ${duration.toFixed(2)} minutes

New invoices processed:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 New emails scanned: ${scanResults.emailsScanned}
📎 New invoices found: ${scanResults.totalInvoices}
📁 Files organized: ${scanResults.filesOrganized}
📊 Data rows added: ${extractionResults.rowsExtracted}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Time: ${new Date()}
`;

    MailApp.sendEmail({
      to: CONFIG.notificationEmail,
      subject: `✅ Daily Invoice Check - ${scanResults.totalInvoices} New Invoice(s)`,
      body: summary
    });

    Logger.log('\n' + summary);
    Logger.log('═══════════════════════════════════════════════════════════');

    return {
      success: true,
      newInvoices: scanResults.totalInvoices,
      scanResults: scanResults,
      extractionResults: extractionResults
    };

  } catch (error) {
    Logger.log('❌ ERROR during daily automation: ' + error.toString());

    // Send error notification
    MailApp.sendEmail({
      to: CONFIG.notificationEmail,
      subject: '❌ Daily Invoice Check - ERROR',
      body: `ERROR during daily automation:\n\n${error.toString()}\n\nStack trace:\n${error.stack}\n\nTime: ${new Date()}`
    });

    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 1: FOLDER SETUP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Setup folder structure with duplicate prevention
 * Creates: INVOICES_FACTURAS_TEATRO/YEAR/QUARTER/
 */
function setupFolders() {
  Logger.log('Creating folder structure...');

  const structure = {
    mainFolder: null,
    years: {}
  };

  // Create or get main folder
  const mainFolderName = CONFIG.mainFolderName;
  const existingFolders = DriveApp.getFoldersByName(mainFolderName);

  if (existingFolders.hasNext()) {
    structure.mainFolder = existingFolders.next();
    Logger.log('✓ Main folder already exists: ' + mainFolderName);
  } else {
    structure.mainFolder = DriveApp.createFolder(mainFolderName);
    Logger.log('✓ Created main folder: ' + mainFolderName);

    // Share with configured users
    CONFIG.shareWithUsers.forEach(email => {
      structure.mainFolder.addEditor(email);
      Logger.log('  → Shared with: ' + email);
    });
  }

  // Create year folders and quarter subfolders
  CONFIG.years.forEach(year => {
    const yearFolders = structure.mainFolder.getFoldersByName(year);
    let yearFolder;

    if (yearFolders.hasNext()) {
      yearFolder = yearFolders.next();
      Logger.log('✓ Year folder already exists: ' + year);
    } else {
      yearFolder = structure.mainFolder.createFolder(year);
      Logger.log('✓ Created year folder: ' + year);
    }

    structure.years[year] = {
      folder: yearFolder,
      quarters: {}
    };

    // Create quarter folders
    CONFIG.quarters.forEach((quarter, index) => {
      const quarterFolders = yearFolder.getFoldersByName(quarter);
      let quarterFolder;

      if (quarterFolders.hasNext()) {
        quarterFolder = quarterFolders.next();
        Logger.log('  ✓ Quarter folder already exists: ' + quarter);
      } else {
        quarterFolder = yearFolder.createFolder(quarter);
        Logger.log('  ✓ Created quarter folder: ' + quarter);
      }

      structure.years[year].quarters[index + 1] = {
        name: quarter,
        folder: quarterFolder
      };
    });
  });

  Logger.log('\n✅ Folder structure complete!');
  return structure;
}

/**
 * Get existing folder structure (for dailyAutomation)
 */
function getFolderStructure() {
  const mainFolderName = CONFIG.mainFolderName;
  const mainFolders = DriveApp.getFoldersByName(mainFolderName);

  if (!mainFolders.hasNext()) {
    return null;
  }

  const structure = {
    mainFolder: mainFolders.next(),
    years: {}
  };

  CONFIG.years.forEach(year => {
    const yearFolders = structure.mainFolder.getFoldersByName(year);
    if (yearFolders.hasNext()) {
      const yearFolder = yearFolders.next();
      structure.years[year] = {
        folder: yearFolder,
        quarters: {}
      };

      CONFIG.quarters.forEach((quarter, index) => {
        const quarterFolders = yearFolder.getFoldersByName(quarter);
        if (quarterFolders.hasNext()) {
          structure.years[year].quarters[index + 1] = {
            name: quarter,
            folder: quarterFolders.next()
          };
        }
      });
    }
  });

  return structure;
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 2: EMAIL SCANNING & ATTACHMENT EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Scan emails and extract invoice attachments
 * @param {Object} folderStructure - Folder structure from setupFolders()
 * @param {Boolean} onlyNew - If true, only scan last 24 hours
 */
function scanAndExtractEmails(folderStructure, onlyNew = false) {
  Logger.log('Scanning emails for invoices...');

  const results = {
    emailsScanned: 0,
    totalInvoices: 0,
    filesOrganized: 0,
    skippedDuplicates: 0
  };

  // Build search query
  let query = buildSearchQuery(onlyNew);
  Logger.log('Search query: ' + query);

  // Search emails
  const threads = GmailApp.search(query);
  Logger.log(`Found ${threads.length} email threads`);

  threads.forEach(thread => {
    const messages = thread.getMessages();

    messages.forEach(message => {
      results.emailsScanned++;

      const attachments = message.getAttachments();
      if (attachments.length === 0) return;

      // ═══════════════════════════════════════════════════════════════════════
      // NO KEYWORD CHECKING NEEDED HERE!
      // Gmail already filtered emails by subject keywords in buildSearchQuery()
      // All emails in this loop already have keywords in their SUBJECT line
      // ═══════════════════════════════════════════════════════════════════════

      const messageDate = message.getDate();
      const year = messageDate.getFullYear().toString();
      const quarter = getQuarter(messageDate);

      // Check if we have this year/quarter in our structure
      if (!folderStructure.years[year] || !folderStructure.years[year].quarters[quarter]) {
        Logger.log(`⚠️ No folder for ${year} Q${quarter}, skipping...`);
        return;
      }

      const quarterFolder = folderStructure.years[year].quarters[quarter].folder;

      // Process attachments with filtering for icons/small images
      attachments.forEach(attachment => {
        try {
          const contentType = attachment.getContentType();
          const fileName = attachment.getName();
          const fileSize = attachment.getSize();

          // ═══════════════════════════════════════════════════════════════════
          // ICON/SMALL IMAGE FILTER
          // ═══════════════════════════════════════════════════════════════════
          // Even though email subject has keywords, emails often contain:
          // - Small icon/logo images (< 50KB)
          // - Email signature images
          // - Tracking pixels
          //
          // We want to save ONLY actual invoice documents (PDFs, large images)
          // ═══════════════════════════════════════════════════════════════════

          // Skip very small files (likely icons/logos/tracking pixels)
          if (fileSize < 50000) { // 50KB threshold
            Logger.log(`  ⊘ Skipped small file (${Math.round(fileSize/1024)}KB): ${fileName}`);
            return;
          }

          // Skip common non-document types
          const skipTypes = [
            'image/gif',
            'image/x-icon',
            'image/vnd.microsoft.icon',
            'text/html',
            'text/plain'
          ];

          if (skipTypes.some(type => contentType.includes(type))) {
            Logger.log(`  ⊘ Skipped non-document type (${contentType}): ${fileName}`);
            return;
          }

          results.totalInvoices++;

          // Create filename with date prefix: YYYY-MM-DD_originalname.ext
          const datePrefix = Utilities.formatDate(messageDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
          const newFileName = `${datePrefix}_${fileName}`;

          // DUPLICATE PREVENTION: Check if file already exists
          const existingFiles = quarterFolder.getFilesByName(newFileName);
          if (existingFiles.hasNext()) {
            Logger.log(`  ⊗ Duplicate skipped: ${newFileName}`);
            results.skippedDuplicates++;
            return;
          }

          // Upload file to Drive
          const blob = attachment.copyBlob();
          const file = quarterFolder.createFile(blob);
          file.setName(newFileName);

          results.filesOrganized++;
          Logger.log(`  ✓ Organized: ${newFileName} (${Math.round(fileSize/1024)}KB) → ${year}/${CONFIG.quarters[quarter - 1]}`);

        } catch (error) {
          Logger.log(`  ✗ Error processing attachment: ${error.toString()}`);
        }
      });
    });
  });

  Logger.log(`\n✅ Email scanning complete!`);
  Logger.log(`   Emails scanned: ${results.emailsScanned}`);
  Logger.log(`   Invoices found: ${results.totalInvoices}`);
  Logger.log(`   Files organized: ${results.filesOrganized}`);
  Logger.log(`   Duplicates skipped: ${results.skippedDuplicates}`);

  return results;
}

/**
 * Build Gmail search query
 * v1.3: Search for ALL attachments, then filter by email subject + filename keywords
 */
function buildSearchQuery(onlyNew = false) {
  const excludeSent = CONFIG.emailAccounts.map(email => `-from:${email}`).join(' ');

  // ═══════════════════════════════════════════════════════════════════════════
  // SEARCH STRATEGY: Filter at Gmail level using SUBJECT line keywords
  // ═══════════════════════════════════════════════════════════════════════════
  //
  // WHY THIS WORKS ACROSS ALL LANGUAGES:
  // The Gmail search operator "subject:" is UNIVERSAL and works regardless of
  // the user's Gmail language interface:
  //   - Spanish Gmail shows "Asunto:" → search uses "subject:"
  //   - German Gmail shows "Betreff:" → search uses "subject:"
  //   - French Gmail shows "Objet:" → search uses "subject:"
  //   - English Gmail shows "Subject:" → search uses "subject:"
  //
  // Gmail's backend search always uses "subject:" regardless of UI language.
  //
  // SEARCH LOGIC:
  // 1. Only get emails with keywords in SUBJECT line (not body, not filename)
  // 2. Only get emails WITH attachments
  // 3. Much faster than downloading all attachments then filtering
  //
  // ═══════════════════════════════════════════════════════════════════════════

  // Build keyword search: subject:(keyword1 OR keyword2 OR keyword3...)
  const keywordSearch = CONFIG.invoiceKeywords
    .map(keyword => `subject:"${keyword}"`)
    .join(' OR ');

  let query = `(${keywordSearch}) has:attachment ${excludeSent} in:anywhere`;

  if (onlyNew) {
    // Last 24 hours
    query += ' newer_than:1d';
  } else {
    // From configured start date
    query += ` after:${CONFIG.scanStartDate}`;
  }

  return query;
}

/**
 * Get quarter number (1-4) from date
 */
function getQuarter(date) {
  const month = date.getMonth() + 1; // 1-12
  return Math.ceil(month / 3); // 1-4
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 3: SPREADSHEET CREATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create spreadsheets with quarterly tabs
 */
function createSpreadsheets(folderStructure) {
  Logger.log('Creating spreadsheets...');

  const spreadsheets = {};

  CONFIG.years.forEach(year => {
    const yearFolder = folderStructure.years[year].folder;
    const spreadsheetName = `Invoices_${year}`;

    // Check if spreadsheet already exists
    const existingSheets = yearFolder.getFilesByName(spreadsheetName);
    let spreadsheet;

    if (existingSheets.hasNext()) {
      spreadsheet = SpreadsheetApp.openById(existingSheets.next().getId());
      Logger.log(`✓ Spreadsheet already exists: ${spreadsheetName}`);
    } else {
      // Create new spreadsheet
      spreadsheet = SpreadsheetApp.create(spreadsheetName);
      const file = DriveApp.getFileById(spreadsheet.getId());

      // Move to year folder
      file.moveTo(yearFolder);

      Logger.log(`✓ Created spreadsheet: ${spreadsheetName}`);
    }

    // Setup quarterly tabs
    const sheets = {};
    CONFIG.quarters.forEach((quarter, index) => {
      const sheetName = `Q${index + 1} - ${quarter}`;
      let sheet = spreadsheet.getSheetByName(sheetName);

      if (!sheet) {
        // Create new sheet
        if (index === 0) {
          // Rename first default sheet
          sheet = spreadsheet.getSheets()[0];
          sheet.setName(sheetName);
        } else {
          sheet = spreadsheet.insertSheet(sheetName);
        }

        // Add header row
        sheet.getRange(1, 1, 1, CONFIG.columns.length).setValues([CONFIG.columns]);
        sheet.getRange(1, 1, 1, CONFIG.columns.length).setFontWeight('bold');
        sheet.setFrozenRows(1);

        // Auto-resize columns
        for (let i = 1; i <= CONFIG.columns.length; i++) {
          sheet.autoResizeColumn(i);
        }

        Logger.log(`  ✓ Created sheet: ${sheetName}`);
      } else {
        Logger.log(`  ✓ Sheet already exists: ${sheetName}`);
      }

      sheets[index + 1] = sheet;
    });

    spreadsheets[year] = {
      spreadsheet: spreadsheet,
      sheets: sheets
    };
  });

  Logger.log('\n✅ Spreadsheets created!');
  return spreadsheets;
}

/**
 * Get existing spreadsheets (for dailyAutomation)
 */
function getSpreadsheets(folderStructure) {
  const spreadsheets = {};

  CONFIG.years.forEach(year => {
    const yearFolder = folderStructure.years[year].folder;
    const spreadsheetName = `Invoices_${year}`;

    const existingSheets = yearFolder.getFilesByName(spreadsheetName);
    if (existingSheets.hasNext()) {
      const spreadsheet = SpreadsheetApp.openById(existingSheets.next().getId());

      const sheets = {};
      CONFIG.quarters.forEach((quarter, index) => {
        const sheetName = `Q${index + 1} - ${quarter}`;
        sheets[index + 1] = spreadsheet.getSheetByName(sheetName);
      });

      spreadsheets[year] = {
        spreadsheet: spreadsheet,
        sheets: sheets
      };
    }
  });

  return spreadsheets;
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 4: VISION API DATA EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extract invoice data using Google Vision API
 */
function extractInvoiceData(folderStructure, spreadsheets, onlyNew = false) {
  Logger.log('Extracting invoice data with Vision API...');

  const results = {
    rowsExtracted: 0,
    errors: 0,
    skippedDuplicates: 0
  };

  CONFIG.years.forEach(year => {
    if (!folderStructure.years[year]) return;

    Object.keys(folderStructure.years[year].quarters).forEach(quarterNum => {
      const quarterFolder = folderStructure.years[year].quarters[quarterNum].folder;
      const sheet = spreadsheets[year].sheets[quarterNum];

      if (!sheet) return;

      // Get all files in this quarter folder
      const files = quarterFolder.getFiles();

      while (files.hasNext()) {
        const file = files.next();

        try {
          // DUPLICATE PREVENTION: Check if this file is already in spreadsheet
          const fileUrl = file.getUrl();
          const existingData = sheet.getDataRange().getValues();
          const alreadyExists = existingData.some(row => row[8] === fileUrl); // Column 9: Drive Link

          if (alreadyExists) {
            results.skippedDuplicates++;
            continue;
          }

          // Skip if onlyNew and file is old
          if (onlyNew) {
            const fileDate = file.getDateCreated();
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            if (fileDate < oneDayAgo) {
              continue;
            }
          }

          Logger.log(`  Processing: ${file.getName()}`);

          // Extract data using Vision API
          const extractedData = extractDataFromFile(file);

          // Add row to spreadsheet
          const rowData = [
            extractedData.invoiceDate || '',
            extractedData.providerName || '',
            extractedData.invoiceNumber || '',
            extractedData.description || '',
            extractedData.totalAmount || '',
            extractedData.iban || '',
            '', // Category (manual)
            '', // Payment Status (manual)
            fileUrl,
            '' // Notes (manual)
          ];

          sheet.appendRow(rowData);
          results.rowsExtracted++;

          Logger.log(`    ✓ Extracted data and added to ${year} Q${quarterNum}`);

        } catch (error) {
          Logger.log(`    ✗ Error extracting data: ${error.toString()}`);
          results.errors++;
        }
      }
    });
  });

  Logger.log(`\n✅ Data extraction complete!`);
  Logger.log(`   Rows extracted: ${results.rowsExtracted}`);
  Logger.log(`   Errors: ${results.errors}`);
  Logger.log(`   Duplicates skipped: ${results.skippedDuplicates}`);

  return results;
}

/**
 * Extract data from a single file using Vision API
 */
function extractDataFromFile(file) {
  const mimeType = file.getMimeType();

  // Only process image files and PDFs
  if (!mimeType.includes('image') && !mimeType.includes('pdf')) {
    return {
      invoiceDate: '',
      providerName: '',
      invoiceNumber: '',
      description: '',
      totalAmount: '',
      iban: ''
    };
  }

  try {
    // Get file as base64
    const blob = file.getBlob();
    const base64 = Utilities.base64Encode(blob.getBytes());

    // Call Vision API
    const visionUrl = `${CONFIG.visionAPI.endpoint}?key=${CONFIG.visionAPI.apiKey}`;

    const payload = {
      requests: [{
        image: {
          content: base64
        },
        features: [{
          type: 'DOCUMENT_TEXT_DETECTION'
        }]
      }]
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(visionUrl, options);
    const result = JSON.parse(response.getContentText());

    if (result.responses && result.responses[0].fullTextAnnotation) {
      const text = result.responses[0].fullTextAnnotation.text;

      // Parse extracted text
      return parseInvoiceText(text);
    }

  } catch (error) {
    Logger.log(`    Vision API error: ${error.toString()}`);
  }

  return {
    invoiceDate: '',
    providerName: '',
    invoiceNumber: '',
    description: '',
    totalAmount: '',
    iban: ''
  };
}

/**
 * Parse invoice text to extract structured data
 */
function parseInvoiceText(text) {
  const data = {
    invoiceDate: '',
    providerName: '',
    invoiceNumber: '',
    description: '',
    totalAmount: '',
    iban: ''
  };

  // Extract date (multiple formats: DD/MM/YYYY, YYYY-MM-DD, etc.)
  const datePatterns = [
    /\b(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})\b/,
    /\b(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})\b/,
    /\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\b/i
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      data.invoiceDate = match[1];
      break;
    }
  }

  // Extract invoice number
  const invoicePatterns = [
    /(?:invoice|factura|n[úu]mero|number|no\.?|#)\s*:?\s*([A-Z0-9\-]+)/i,
    /\b([A-Z]{2,}\d{4,})\b/
  ];

  for (const pattern of invoicePatterns) {
    const match = text.match(pattern);
    if (match) {
      data.invoiceNumber = match[1];
      break;
    }
  }

  // Extract total amount with currency
  const amountPatterns = [
    /(?:total|amount|importe)\s*:?\s*([€$£]\s*[\d,]+\.?\d*)/i,
    /(?:total|amount|importe)\s*:?\s*([\d,]+\.?\d*\s*[€$£])/i,
    /\b([\d,]+\.?\d*)\s*(?:EUR|USD|GBP|€)\b/i
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.totalAmount = match[1].trim();
      break;
    }
  }

  // Extract IBAN
  const ibanPattern = /\b([A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16})\b/;
  const ibanMatch = text.match(ibanPattern);
  if (ibanMatch) {
    data.iban = ibanMatch[1];
  }

  // Extract company name (usually at the top, first few lines)
  const lines = text.split('\n');
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (line.length > 3 && line.length < 100 && !line.match(/^\d+$/)) {
      data.providerName = line;
      break;
    }
  }

  // Extract description (look for common service keywords)
  const descriptionPatterns = [
    /(?:description|concepto|servicio|service)\s*:?\s*(.+)/i
  ];

  for (const pattern of descriptionPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.description = match[1].substring(0, 100); // Limit length
      break;
    }
  }

  return data;
}

// ═══════════════════════════════════════════════════════════════════════════
// TRIGGER SETUP FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Setup daily triggers (run this once to configure automation)
 */
function setupDailyTriggers() {
  // Delete existing triggers first
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'dailyAutomation') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create morning trigger (8am)
  ScriptApp.newTrigger('dailyAutomation')
    .timeBased()
    .atHour(CONFIG.triggers.morning)
    .everyDays(1)
    .create();

  // Create evening trigger (6pm)
  ScriptApp.newTrigger('dailyAutomation')
    .timeBased()
    .atHour(CONFIG.triggers.evening)
    .everyDays(1)
    .create();

  Logger.log('✅ Daily triggers set up successfully!');
  Logger.log(`   Morning: ${CONFIG.triggers.morning}:00`);
  Logger.log(`   Evening: ${CONFIG.triggers.evening}:00`);
}

/**
 * Remove all triggers (for testing or deactivation)
 */
function removeTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  Logger.log('✅ All triggers removed');
}
