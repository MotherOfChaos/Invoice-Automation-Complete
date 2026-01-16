/**
 * FIND MISSING INVOICES SCRIPT
 * Identifies which 3 invoices are in manual folder but NOT in automated results
 * 
 * SETUP:
 * 1. Open your VALIDATION spreadsheet
 * 2. Tools → Script editor
 * 3. Paste this code
 * 4. Update AUTOMATED_SPREADSHEET_ID below
 * 5. Run: findMissingInvoices()
 */

// ============================
// CONFIGURATION
// ============================

const CONFIG = {
  // Get this from your automated spreadsheet URL
  // https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
  AUTOMATED_SPREADSHEET_ID: '1WWt8N8JYu1z4VD9FWR8ZYub3p23Oq-rLYAuBQJf2pMM',
  
  // Sheet name in automated spreadsheet (usually "Invoices")
  AUTOMATED_SHEET_NAME: 'Invoices',
  
  // Column with filenames in automated sheet (usually column I = Drive Link)
  AUTOMATED_FILENAME_COLUMN: 9  // Column I (Drive Link contains filename)
};

// ============================
// MAIN FUNCTION
// ============================

function findMissingInvoices() {
  Logger.log('🔍 FINDING MISSING INVOICES...\n');
  
  try {
    // Get manual files from current spreadsheet
    const manualSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Manual Folder Contents');
    const manualData = manualSheet.getRange(2, 2, manualSheet.getLastRow() - 1, 1).getValues(); // Column B (filenames)
    const manualFiles = manualData.map(row => row[0]).filter(name => name); // Remove empty rows
    
    Logger.log(`📁 Manual folder: ${manualFiles.length} invoices`);
    
    // Get automated files from automated spreadsheet
    const automatedSS = SpreadsheetApp.openById(CONFIG.AUTOMATED_SPREADSHEET_ID);
    const automatedSheet = automatedSS.getSheetByName(CONFIG.AUTOMATED_SHEET_NAME);
    const automatedData = automatedSheet.getRange(2, 9, automatedSheet.getLastRow() - 1, 1).getValues(); // Column I (Drive Link)
    
    // Extract filenames from Drive URLs
    const automatedFiles = automatedData
      .map(row => extractFilenameFromUrl(row[0]))
      .filter(name => name);
    
    Logger.log(`🤖 Automated found: ${automatedFiles.length} invoices`);
    
    // Find missing files (in manual but NOT in automated)
    const missingFiles = manualFiles.filter(manualFile => {
      return !automatedFiles.some(autoFile => 
        autoFile.toLowerCase().includes(manualFile.toLowerCase()) || 
        manualFile.toLowerCase().includes(autoFile.toLowerCase())
      );
    });
    
    Logger.log(`\n❌ MISSING: ${missingFiles.length} invoices\n`);
    
    if (missingFiles.length === 0) {
      Logger.log('🎉 Perfect! All invoices were found by automation!');
      return;
    }
    
    // Get full details for missing files
    const missingDetails = [];
    manualFiles.forEach((filename, index) => {
      if (missingFiles.includes(filename)) {
        const rowData = manualSheet.getRange(index + 2, 1, 1, 9).getValues()[0];
        missingDetails.push({
          filename: rowData[1],
          path: rowData[2],
          dateCreated: rowData[3],
          dateModified: rowData[4],
          size: rowData[5],
          type: rowData[6],
          url: rowData[7]
        });
      }
    });
    
    // Log details
    Logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    Logger.log('📋 MISSING INVOICES DETAILS:\n');
    
    missingDetails.forEach((file, index) => {
      Logger.log(`${index + 1}. ${file.filename}`);
      Logger.log(`   📂 Path: ${file.path}`);
      Logger.log(`   📅 Created: ${file.dateCreated}`);
      Logger.log(`   📅 Modified: ${file.dateModified}`);
      Logger.log(`   📏 Size: ${file.size} bytes`);
      Logger.log(`   📄 Type: ${file.type}`);
      Logger.log(`   🔗 ${file.url}`);
      Logger.log('');
    });
    
    Logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Create analysis sheet
    createMissingInvoicesSheet(missingDetails);
    
    // Analyze patterns
    analyzeWhyMissing(missingDetails);
    
    Logger.log('\n✅ Created "Missing Invoices" sheet in this spreadsheet');
    Logger.log('✅ Check logs above for analysis\n');
    
  } catch (error) {
    Logger.log(`❌ ERROR: ${error.message}`);
    Logger.log('\n⚠️ Make sure you updated AUTOMATED_SPREADSHEET_ID in config!');
    throw error;
  }
}

// ============================
// HELPER: EXTRACT FILENAME
// ============================

function extractFilenameFromUrl(url) {
  if (!url) return '';
  
  // Extract filename from Drive URL
  // Format: https://drive.google.com/file/d/FILE_ID/view
  // Need to use Drive API to get actual filename
  
  try {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      const file = DriveApp.getFileById(fileIdMatch[1]);
      return file.getName();
    }
  } catch (error) {
    // If can't get file, try to extract from URL
  }
  
  return '';
}

// ============================
// CREATE MISSING SHEET
// ============================

function createMissingInvoicesSheet(missingFiles) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Delete existing sheet if present
  const existingSheet = ss.getSheetByName('Missing Invoices');
  if (existingSheet) {
    ss.deleteSheet(existingSheet);
  }
  
  const sheet = ss.insertSheet('Missing Invoices');
  
  // Headers
  const headers = [
    '❌ Missing Invoice',
    'Folder Path',
    'Date Created',
    'Date Modified',
    'Size (bytes)',
    'File Type',
    'Drive Link',
    'Possible Reason'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#e74c3c');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  
  // Add data
  const rows = missingFiles.map(file => [
    file.filename,
    file.path,
    file.dateCreated,
    file.dateModified,
    file.size,
    file.type,
    file.url,
    '' // Will analyze manually
  ]);
  
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
  
  // Format
  sheet.setColumnWidth(1, 350);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 150);
  sheet.setColumnWidth(7, 300);
  sheet.setColumnWidth(8, 300);
  
  sheet.setFrozenRows(1);
}

// ============================
// ANALYZE WHY MISSING
// ============================

function analyzeWhyMissing(missingFiles) {
  Logger.log('\n🔬 ANALYZING WHY THESE WERE MISSED:\n');
  
  // Check filename patterns
  const keywords = ['factura', 'invoice', 'recibo', 'receipt'];
  
  missingFiles.forEach((file, index) => {
    Logger.log(`\n${index + 1}. ${file.filename}`);
    
    // Check if filename contains keywords
    const hasKeyword = keywords.some(keyword => 
      file.filename.toLowerCase().includes(keyword)
    );
    
    if (!hasKeyword) {
      Logger.log(`   ⚠️ REASON: Filename doesn't contain invoice keywords`);
      Logger.log(`   💡 FIX: Add more keywords to CONFIG.invoiceKeywords`);
    }
    
    // Check file type
    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      Logger.log(`   ⚠️ REASON: Unusual file type (${file.type})`);
      Logger.log(`   💡 FIX: Check if file is actually an invoice`);
    }
    
    // Check date
    const created = new Date(file.dateCreated);
    const year = created.getFullYear();
    
    if (year < 2025) {
      Logger.log(`   ⚠️ REASON: File created before 2025 (${year})`);
      Logger.log(`   💡 FIX: Adjust historicalScanStartDate in CONFIG`);
    }
    
    // Check if manually uploaded (might not have email)
    Logger.log(`   📧 CHECK: Was this invoice emailed or manually uploaded?`);
    Logger.log(`   💡 Script only finds invoices that came via EMAIL`);
  });
  
  Logger.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  Logger.log('\n💡 COMMON REASONS FOR MISSING INVOICES:');
  Logger.log('1. Filename lacks keywords (factura, invoice, etc.)');
  Logger.log('2. Invoice was manually uploaded (not emailed)');
  Logger.log('3. Email was sent before historicalScanStartDate');
  Logger.log('4. Email in Trash/Spam (though script checks these)');
  Logger.log('5. Unusual file format (not PDF/image)');
  Logger.log('6. Email sent to different account not monitored');
  Logger.log('\n');
}

// ============================
// QUICK TEST
// ============================

function testMissingScript() {
  Logger.log('🧪 TESTING...\n');
  
  try {
    const ss = SpreadsheetApp.openById(CONFIG.AUTOMATED_SPREADSHEET_ID);
    Logger.log(`✅ Automated spreadsheet found: ${ss.getName()}`);
    
    const sheet = ss.getSheetByName(CONFIG.AUTOMATED_SHEET_NAME);
    if (sheet) {
      Logger.log(`✅ Sheet found: ${CONFIG.AUTOMATED_SHEET_NAME}`);
      Logger.log(`✅ Configuration looks good!\n`);
      Logger.log(`Ready to run: findMissingInvoices()`);
    } else {
      Logger.log(`❌ Sheet "${CONFIG.AUTOMATED_SHEET_NAME}" not found`);
      Logger.log(`Available sheets: ${ss.getSheets().map(s => s.getName()).join(', ')}`);
    }
  } catch (error) {
    Logger.log(`❌ ERROR: ${error.message}`);
    Logger.log(`\n⚠️ Update AUTOMATED_SPREADSHEET_ID in config!`);
  }
}
