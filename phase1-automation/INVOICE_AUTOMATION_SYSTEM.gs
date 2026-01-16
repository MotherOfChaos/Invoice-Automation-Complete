/**
 * INVOICE AUTOMATION SYSTEM WITH AI EXTRACTION
 * v3.0 FINAL - Auto Q1+Q2 Historical Scan
 * 
 * DEPLOYMENT ACCOUNT: Business email (e.g., info@company.com)
 * MONITORS: Multiple email accounts for invoices
 * EXTRACTS: Amount, Invoice Number, IBAN via Google Cloud Vision API
 * ORGANIZES: Year/Quarter folder structure in Google Drive
 * TRACKS: Centralized spreadsheet with auto-filled data
 * COST: FREE (within 1,000 Vision API calls/month)
 * 
 * CONFIGURATION: Edit CONFIG object below
 */

// ============================
// CONFIGURATION - EDIT THIS
// ============================

const CONFIG = {
  // Email accounts to monitor for invoices
  emailAccounts: [
    'info@yourcompany.com',      // PRIMARY - script runs AS this account
    'admin@yourcompany.com'       // SECONDARY - also monitored
  ],
  
  // Keywords to identify invoice emails
  invoiceKeywords: ['factura', 'invoice', 'recibo', 'receipt'],
  
  // Main folder name in Google Drive
  mainFolderName: 'INVOICES_FACTURAS_COMPANY',
  
  // Users to share folders with (team access)
  shareWithUsers: [
    'manager@yourcompany.com',
    'admin@yourcompany.com'
  ],
  
  // Years to create folders for
  years: ['2025', '2026'],
  
  // Quarter names (can be customized for language)
  quarters: ['1r trimestre', '2do trimestre', '3r trimestre', '4to trimestre'],
  
  // Daily scan: how many days back to check
  daysToSearch: 2,
  
  // Historical scan: start date for Q1+Q2 import
  historicalScanStartDate: '2025-01-01',
  historicalScanEndDate: '2025-06-30',
  
  // Enable Vision API for data extraction
  useVisionAPI: true,
  
  // Run historical scan on first execution
  autoRunHistoricalScan: true,
  
  // Script property key for folder structure
  scriptProperty: 'INVOICE_FOLDER_IDS',
  
  // Script property key for first run flag
  firstRunProperty: 'FIRST_RUN_COMPLETE'
};

// ============================
// MAIN FUNCTION - SCHEDULED
// ============================

function processInvoices() {
  try {
    Logger.log('🚀 Starting invoice automation...');
    
    // Check if this is first run
    const props = PropertiesService.getScriptProperties();
    const firstRunComplete = props.getProperty(CONFIG.firstRunProperty);
    
    if (!firstRunComplete && CONFIG.autoRunHistoricalScan) {
      Logger.log('📦 FIRST RUN: Running historical scan Q1+Q2...');
      scanHistoricalInvoices();
      props.setProperty(CONFIG.firstRunProperty, 'true');
      Logger.log('✅ Historical scan complete. Continuing with daily scan...');
    }
    
    const folderStructure = setupFolderStructure();
    Logger.log('✅ Folder structure ready');
    
    let totalProcessed = 0;
    CONFIG.emailAccounts.forEach(email => {
      Logger.log(`\n📧 Processing: ${email}`);
      const processed = processEmailAccount(email, folderStructure, false);
      totalProcessed += processed;
      Logger.log(`   ✅ Found ${processed} invoices`);
    });
    
    Logger.log(`\n✅ COMPLETE! Processed ${totalProcessed} invoices total`);
    if (totalProcessed > 0) {
      sendSummaryEmail(totalProcessed);
    }
  } catch (error) {
    Logger.log('❌ ERROR: ' + error.message);
    MailApp.sendEmail({
      to: CONFIG.emailAccounts[0],
      subject: '⚠️ Invoice Automation Error',
      body: `Error: ${error.message}\n\nCheck Apps Script logs.`
    });
  }
}

// ============================
// HISTORICAL SCAN (Q1+Q2)
// ============================

function scanHistoricalInvoices() {
  Logger.log(`\n📦 HISTORICAL SCAN: ${CONFIG.historicalScanStartDate} to ${CONFIG.historicalScanEndDate}`);
  Logger.log('   Searching ALL folders, labels, Trash, and Spam!\n');
  
  const folderStructure = setupFolderStructure();
  let totalProcessed = 0;
  
  CONFIG.emailAccounts.forEach(email => {
    Logger.log(`\n📧 Processing: ${email}`);
    
    const query = `has:attachment after:${CONFIG.historicalScanStartDate} before:${CONFIG.historicalScanEndDate} in:anywhere -from:${CONFIG.emailAccounts.join(' -from:')}`;
    
    Logger.log(`   Query: ${query}`);
    const threads = GmailApp.search(query, 0, 500);
    Logger.log(`   Found ${threads.length} email threads with attachments`);
    
    let foundInThisAccount = 0;
    threads.forEach(thread => {
      thread.getMessages().forEach(message => {
        message.getAttachments().forEach(attachment => {
          const filename = attachment.getName().toLowerCase();
          const isInvoice = CONFIG.invoiceKeywords.some(keyword => filename.includes(keyword));
          
          if (isInvoice) {
            if (processInvoiceAttachment(message, attachment, folderStructure, email)) {
              foundInThisAccount++;
              totalProcessed++;
              Logger.log(`      ✅ ${attachment.getName()}`);
            }
          }
        });
      });
    });
    
    Logger.log(`   📊 Total invoices from ${email}: ${foundInThisAccount}`);
  });
  
  Logger.log(`\n\n🎉 HISTORICAL SCAN COMPLETE!`);
  Logger.log(`📊 TOTAL INVOICES FOUND: ${totalProcessed}`);
  Logger.log(`📅 Date range: ${CONFIG.historicalScanStartDate} to ${CONFIG.historicalScanEndDate}`);
  
  if (totalProcessed > 0) {
    MailApp.sendEmail({
      to: CONFIG.emailAccounts[0],
      subject: `✅ Historical Scan: ${totalProcessed} invoices imported`,
      body: `Scanned ${CONFIG.historicalScanStartDate} to ${CONFIG.historicalScanEndDate}\n\nFound ${totalProcessed} invoices.\n\nCheck ${CONFIG.mainFolderName} folder.`
    });
  }
}

// ============================
// FOLDER STRUCTURE SETUP
// ============================

function setupFolderStructure() {
  const props = PropertiesService.getScriptProperties();
  let folderData = props.getProperty(CONFIG.scriptProperty);
  
  if (folderData) {
    Logger.log('📁 Using existing folder structure');
    return JSON.parse(folderData);
  }
  
  Logger.log('📁 Creating new folder structure...');
  const mainFolder = DriveApp.createFolder(CONFIG.mainFolderName);
  const structure = {mainFolderId: mainFolder.getId(), years: {}};
  
  CONFIG.years.forEach(year => {
    const yearFolder = mainFolder.createFolder(year);
    structure.years[year] = {folderId: yearFolder.getId(), quarters: {}, spreadsheetId: null};
    
    CONFIG.quarters.forEach((quarter, index) => {
      const quarterFolder = yearFolder.createFolder(quarter);
      structure.years[year].quarters[index + 1] = quarterFolder.getId();
    });
    
    const spreadsheet = createInvoiceSpreadsheet(year, yearFolder);
    structure.years[year].spreadsheetId = spreadsheet.getId();
    Logger.log(`   ✅ Created ${year} with 4 quarters + spreadsheet`);
  });
  
  props.setProperty(CONFIG.scriptProperty, JSON.stringify(structure));
  
  CONFIG.shareWithUsers.forEach(email => {
    try {
      mainFolder.addEditor(email);
      Logger.log(`   ✅ Shared with ${email}`);
    } catch (error) {
      Logger.log(`   ⚠️ Could not share with ${email}: ${error.message}`);
    }
  });
  
  Logger.log(`✅ Folder created: ${mainFolder.getUrl()}`);
  return structure;
}

// ============================
// SPREADSHEET CREATION
// ============================

function createInvoiceSpreadsheet(year, parentFolder) {
  const ss = SpreadsheetApp.create(`Invoices ${year}`);
  const sheet = ss.getActiveSheet();
  sheet.setName('Invoices');
  
  const headers = ['Date Received', 'Sender Name', 'Sender Email', 'Category', 'Amount', 'Invoice Number', 'IBAN / Payment Details', 'Quarter', 'Drive Link', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#667eea');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  sheet.setColumnWidth(1, 120); sheet.setColumnWidth(2, 150); sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 120); sheet.setColumnWidth(5, 100); sheet.setColumnWidth(6, 120);
  sheet.setColumnWidth(7, 200); sheet.setColumnWidth(8, 100); sheet.setColumnWidth(9, 300);
  sheet.setColumnWidth(10, 200);
  sheet.setFrozenRows(1);
  
  DriveApp.getFileById(ss.getId()).moveTo(parentFolder);
  return ss;
}

// ============================
// EMAIL PROCESSING
// ============================

function processEmailAccount(email, folderStructure, isHistoricalScan) {
  let processedCount = 0;
  let searchDate;
  
  if (isHistoricalScan) {
    searchDate = new Date(CONFIG.historicalScanStartDate);
    Logger.log(`   🔍 HISTORICAL: ${CONFIG.historicalScanStartDate}`);
  } else {
    searchDate = new Date();
    searchDate.setDate(searchDate.getDate() - CONFIG.daysToSearch);
    Logger.log(`   🔍 DAILY: last ${CONFIG.daysToSearch} days`);
  }
  
  const query = `has:attachment after:${formatDate(searchDate)} -from:${CONFIG.emailAccounts.join(' -from:')}`;
  const threads = GmailApp.search(query, 0, 500);
  
  threads.forEach(thread => {
    thread.getMessages().forEach(message => {
      message.getAttachments().forEach(attachment => {
        const filename = attachment.getName().toLowerCase();
        const isInvoice = CONFIG.invoiceKeywords.some(keyword => filename.includes(keyword));
        if (isInvoice && processInvoiceAttachment(message, attachment, folderStructure, email)) {
          processedCount++;
        }
      });
    });
  });
  
  return processedCount;
}

// ============================
// INVOICE ATTACHMENT PROCESSING
// ============================

function processInvoiceAttachment(message, attachment, folderStructure, receivingEmail) {
  try {
    const date = message.getDate();
    const year = date.getFullYear().toString();
    const quarter = getQuarter(date);
    
    if (!folderStructure.years[year]) {
      Logger.log(`⚠️ No folder for year ${year}`);
      return false;
    }
    
    const yearData = folderStructure.years[year];
    const quarterFolder = DriveApp.getFolderById(yearData.quarters[quarter]);
    const uniqueFilename = `${formatDate(date)}_${attachment.getName()}`;
    
    const existingFiles = quarterFolder.getFilesByName(uniqueFilename);
    if (existingFiles.hasNext()) {
      Logger.log(`   ⏭️ Already processed: ${uniqueFilename}`);
      return false;
    }
    
    const blob = attachment.copyBlob();
    blob.setName(uniqueFilename);
    const file = quarterFolder.createFile(blob);
    
    let extractedData = {amount: '', invoiceNumber: '', iban: ''};
    if (CONFIG.useVisionAPI) {
      try {
        extractedData = extractInvoiceDataVision(file);
        Logger.log(`   📊 Extracted: Amount=${extractedData.amount}, Invoice#=${extractedData.invoiceNumber}, IBAN=${extractedData.iban}`);
      } catch (error) {
        Logger.log(`   ⚠️ Vision API extraction failed: ${error.message}`);
      }
    }
    
    const spreadsheet = SpreadsheetApp.openById(yearData.spreadsheetId);
    const sheet = spreadsheet.getActiveSheet();
    const senderName = message.getFrom();
    const senderEmail = extractEmail(senderName);
    
    const newRow = [
      formatDate(date),
      senderName,
      senderEmail,
      '',
      extractedData.amount,
      extractedData.invoiceNumber,
      extractedData.iban,
      `Q${quarter}`,
      file.getUrl(),
      ''
    ];
    
    sheet.appendRow(newRow);
    
    Logger.log(`   ✅ Processed: ${attachment.getName()}`);
    return true;
  } catch (error) {
    Logger.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

// ============================
// GOOGLE CLOUD VISION API
// ============================

function extractInvoiceDataVision(driveFile) {
  const fileBlob = driveFile.getBlob();
  const base64Image = Utilities.base64Encode(fileBlob.getBytes());
  
  const visionUrl = 'https://vision.googleapis.com/v1/images:annotate';
  const payload = {
    requests: [{
      image: {content: base64Image},
      features: [{type: 'DOCUMENT_TEXT_DETECTION'}]
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
    return parseInvoiceText(text);
  }
  
  return {amount: '', invoiceNumber: '', iban: ''};
}

// ============================
// TEXT PARSING
// ============================

function parseInvoiceText(text) {
  const data = {amount: '', invoiceNumber: '', iban: ''};
  
  const amountPatterns = [
    /(?:total|amount|importe|subtotal)[\s:]*€?\s*([\d,\.]+)\s*€?/i,
    /€\s*([\d,\.]+)/,
    /([\d,\.]+)\s*€/,
    /EUR\s*([\d,\.]+)/i,
    /USD\s*([\d,\.]+)/i,
    /\$\s*([\d,\.]+)/
  ];
  
  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.amount = match[1].replace(',', '.');
      break;
    }
  }
  
  const invoicePatterns = [
    /(?:invoice|factura|recibo)[\s#:]*(\w+[-/]?\d+)/i,
    /(?:n[uú]mero|number|no\.)[\s:]*(\w+[-/]?\d+)/i,
    /#\s*(\d+)/
  ];
  
  for (const pattern of invoicePatterns) {
    const match = text.match(pattern);
    if (match) {
      data.invoiceNumber = match[1];
      break;
    }
  }
  
  const ibanPattern = /\b([A-Z]{2}\d{2}[\s\d]{12,30})\b/;
  const ibanMatch = text.match(ibanPattern);
  if (ibanMatch) {
    data.iban = ibanMatch[1].replace(/\s/g, '');
  }
  
  return data;
}

// ============================
// HELPER FUNCTIONS
// ============================

function getQuarter(date) {
  return Math.ceil((date.getMonth() + 1) / 3);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function extractEmail(fromString) {
  const match = fromString.match(/<(.+?)>/);
  return match ? match[1] : fromString;
}

function sendSummaryEmail(count) {
  if (count === 0) return;
  MailApp.sendEmail({
    to: CONFIG.emailAccounts[0],
    subject: `✅ Invoice Automation: ${count} invoices processed`,
    body: `${count} new invoices processed with auto-extraction.\n\nCheck ${CONFIG.mainFolderName} folder in Drive.`
  });
}

// ============================
// MANUAL RUN FUNCTIONS
// ============================

function runInitialScan() {
  Logger.log('🚀 RUNNING INITIAL SCAN...');
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty(CONFIG.firstRunProperty);
  processInvoices();
  Logger.log('\n✅ INITIAL SCAN COMPLETE!');
}

function runManual() {
  Logger.log('🚀 MANUAL RUN...');
  const props = PropertiesService.getScriptProperties();
  props.setProperty(CONFIG.firstRunProperty, 'true');
  processInvoices();
}

function runHistoricalScanOnly() {
  Logger.log('🚀 RUNNING HISTORICAL SCAN ONLY...');
  scanHistoricalInvoices();
}

function resetSystem() {
  Logger.log('🗑️ RESETTING SYSTEM...');
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty(CONFIG.scriptProperty);
  props.deleteProperty(CONFIG.firstRunProperty);
  Logger.log('✅ System reset. Run processInvoices() to recreate.');
}
