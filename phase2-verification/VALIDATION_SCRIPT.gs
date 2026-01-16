/**
 * INVOICE VALIDATION SCRIPT
 * Compares manually uploaded invoices vs automated script results
 * 
 * PURPOSE: Quality control - did automation find everything?
 * 
 * INSTRUCTIONS:
 * 1. Get folder ID of your manually uploaded invoices folder
 * 2. Edit MANUAL_FOLDER_ID below
 * 3. Run: createValidationSpreadsheet()
 * 4. Compare results
 */

// ============================
// CONFIGURATION
// ============================

const VALIDATION_CONFIG = {
  // EDIT THIS: Your manually uploaded invoices folder ID
  // Get it from URL: https://drive.google.com/drive/folders/FOLDER_ID_HERE
  MANUAL_FOLDER_ID: '1JA8MImoRZuJZnsQmfkg4frAUDN5E1x5f',
  
  // Name for validation spreadsheet
  VALIDATION_SPREADSHEET_NAME: 'VALIDATION - Manual vs Automated',
  
  // File extensions to look for
  INVOICE_EXTENSIONS: ['.pdf', '.PDF', '.png', '.jpg', '.jpeg']
};

// ============================
// MAIN VALIDATION FUNCTION
// ============================

function createValidationSpreadsheet() {
  Logger.log('🔍 STARTING VALIDATION...\n');
  
  try {
    // Get manual folder
    const manualFolder = DriveApp.getFolderById(VALIDATION_CONFIG.MANUAL_FOLDER_ID);
    Logger.log(`📁 Scanning folder: ${manualFolder.getName()}`);
    
    // Scan all files recursively
    const allFiles = scanFolderRecursively(manualFolder);
    Logger.log(`\n📊 Found ${allFiles.length} invoice files in manual folder\n`);
    
    // Create validation spreadsheet
    const spreadsheet = createValidationSheet(allFiles);
    Logger.log(`\n✅ VALIDATION SPREADSHEET CREATED!`);
    Logger.log(`🔗 ${spreadsheet.getUrl()}\n`);
    Logger.log(`\n📋 NEXT STEPS:`);
    Logger.log(`1. Open the validation spreadsheet`);
    Logger.log(`2. Compare Column B (Manual) with your automated spreadsheet`);
    Logger.log(`3. Look for:`);
    Logger.log(`   - Missing invoices (in manual but not automated)`);
    Logger.log(`   - Extra invoices (in automated but not manual)`);
    Logger.log(`   - Duplicates`);
    Logger.log(`\n💡 TIP: Sort both by filename to make comparison easier!`);
    
    return spreadsheet;
  } catch (error) {
    Logger.log(`❌ ERROR: ${error.message}`);
    Logger.log(`\n⚠️ Make sure you updated MANUAL_FOLDER_ID in the config!`);
    throw error;
  }
}

// ============================
// RECURSIVE FOLDER SCANNER
// ============================

function scanFolderRecursively(folder, path = '') {
  const files = [];
  const currentPath = path ? `${path}/${folder.getName()}` : folder.getName();
  
  Logger.log(`  📂 Scanning: ${currentPath}`);
  
  // Get all files in current folder
  const fileIterator = folder.getFiles();
  let fileCount = 0;
  
  while (fileIterator.hasNext()) {
    const file = fileIterator.next();
    const filename = file.getName();
    const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    
    // Check if it's an invoice file
    if (VALIDATION_CONFIG.INVOICE_EXTENSIONS.includes(extension)) {
      fileCount++;
      
      files.push({
        filename: filename,
        path: currentPath,
        fullPath: `${currentPath}/${filename}`,
        dateCreated: file.getDateCreated(),
        dateModified: file.getLastUpdated(),
        size: file.getSize(),
        url: file.getUrl(),
        id: file.getId(),
        mimeType: file.getMimeType()
      });
    }
  }
  
  Logger.log(`     ✅ Found ${fileCount} invoices`);
  
  // Recursively scan subfolders
  const folderIterator = folder.getFolders();
  while (folderIterator.hasNext()) {
    const subfolder = folderIterator.next();
    const subfolderFiles = scanFolderRecursively(subfolder, currentPath);
    files.push(...subfolderFiles);
  }
  
  return files;
}

// ============================
// SPREADSHEET CREATION
// ============================

function createValidationSheet(files) {
  // Create new spreadsheet
  const ss = SpreadsheetApp.create(VALIDATION_CONFIG.VALIDATION_SPREADSHEET_NAME);
  const sheet = ss.getActiveSheet();
  sheet.setName('Manual Folder Contents');
  
  // Headers
  const headers = [
    'Row #',
    'Filename',
    'Folder Path',
    'Date Created',
    'Date Modified',
    'Size (bytes)',
    'File Type',
    'Drive Link',
    'Notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#e74c3c');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Add data
  const rows = files.map((file, index) => [
    index + 1,
    file.filename,
    file.path,
    file.dateCreated,
    file.dateModified,
    file.size,
    file.mimeType,
    file.url,
    '' // Notes column for manual comparison
  ]);
  
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
  
  // Format columns
  sheet.setColumnWidth(1, 60);   // Row #
  sheet.setColumnWidth(2, 300);  // Filename
  sheet.setColumnWidth(3, 200);  // Path
  sheet.setColumnWidth(4, 150);  // Date Created
  sheet.setColumnWidth(5, 150);  // Date Modified
  sheet.setColumnWidth(6, 100);  // Size
  sheet.setColumnWidth(7, 150);  // File Type
  sheet.setColumnWidth(8, 300);  // Link
  sheet.setColumnWidth(9, 200);  // Notes
  
  sheet.setFrozenRows(1);
  
  // Add summary sheet
  createSummarySheet(ss, files);
  
  // Add comparison instructions sheet
  createInstructionsSheet(ss);
  
  return ss;
}

// ============================
// SUMMARY SHEET
// ============================

function createSummarySheet(spreadsheet, files) {
  const summarySheet = spreadsheet.insertSheet('Summary');
  
  // Count by folder
  const folderCounts = {};
  files.forEach(file => {
    const folder = file.path;
    folderCounts[folder] = (folderCounts[folder] || 0) + 1;
  });
  
  // Count by file type
  const typeCounts = {};
  files.forEach(file => {
    const ext = file.filename.substring(file.filename.lastIndexOf('.')).toLowerCase();
    typeCounts[ext] = (typeCounts[ext] || 0) + 1;
  });
  
  // Build summary data
  const summaryData = [
    ['📊 VALIDATION SUMMARY', ''],
    ['', ''],
    ['Total Invoices Found:', files.length],
    ['', ''],
    ['📁 BY FOLDER:', 'Count'],
    ['', '']
  ];
  
  Object.entries(folderCounts).sort((a, b) => b[1] - a[1]).forEach(([folder, count]) => {
    summaryData.push([folder, count]);
  });
  
  summaryData.push(['', '']);
  summaryData.push(['📄 BY FILE TYPE:', 'Count']);
  summaryData.push(['', '']);
  
  Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    summaryData.push([type, count]);
  });
  
  // Write to sheet
  summarySheet.getRange(1, 1, summaryData.length, 2).setValues(summaryData);
  
  // Format
  summarySheet.getRange(1, 1, 1, 2).setBackground('#3498db').setFontColor('white').setFontWeight('bold').setFontSize(14);
  summarySheet.getRange(5, 1, 1, 2).setBackground('#95a5a6').setFontWeight('bold');
  
  const fileTypeHeaderRow = summaryData.findIndex(row => row[0] === '📄 BY FILE TYPE:') + 1;
  if (fileTypeHeaderRow > 0) {
    summarySheet.getRange(fileTypeHeaderRow, 1, 1, 2).setBackground('#95a5a6').setFontWeight('bold');
  }
  
  summarySheet.setColumnWidth(1, 400);
  summarySheet.setColumnWidth(2, 100);
}

// ============================
// INSTRUCTIONS SHEET
// ============================

function createInstructionsSheet(spreadsheet) {
  const instructionsSheet = spreadsheet.insertSheet('Comparison Instructions');
  
  const instructions = [
    ['🔍 HOW TO VALIDATE YOUR AUTOMATION'],
    [''],
    ['STEP 1: Get Your Automated Results'],
    ['Open the spreadsheet created by the automation script (in INVOICES_FACTURAS_TEATRO folder)'],
    ['Export or copy the invoice list'],
    [''],
    ['STEP 2: Compare'],
    ['Method A - Manual Visual Comparison:'],
    ['  1. Sort both spreadsheets by filename (Column B in this sheet)'],
    ['  2. Look for filenames in this sheet that are missing in automated sheet'],
    ['  3. Look for filenames in automated sheet that are NOT in this sheet'],
    [''],
    ['Method B - Formula Comparison (Advanced):'],
    ['  1. Copy automated results to a new sheet in this spreadsheet'],
    ['  2. Use VLOOKUP or MATCH formulas to find discrepancies'],
    ['  3. Example: =IF(ISNA(MATCH(B2, AutomatedSheet!B:B, 0)), "MISSING", "FOUND")'],
    [''],
    ['STEP 3: Check for Issues'],
    ['Common issues to look for:'],
    ['  ❌ Missing invoices - In manual folder but NOT found by automation'],
    ['  ❌ Extra invoices - Found by automation but NOT in manual folder'],
    ['  ❌ Duplicates - Same invoice appears multiple times'],
    ['  ❌ Wrong quarter - Invoice in Q1 folder but automation put it in Q2'],
    [''],
    ['STEP 4: Calculate Accuracy'],
    ['Formula: (Invoices Found / Total Invoices) × 100%'],
    [''],
    ['Example:'],
    ['  Manual folder: 150 invoices'],
    ['  Automation found: 147 invoices'],
    ['  Accuracy: (147/150) × 100% = 98%'],
    [''],
    ['STEP 5: Investigate Discrepancies'],
    ['For any missing invoices, check:'],
    ['  • Is the filename formatted differently?'],
    ['  • Does it contain keywords like "factura" or "invoice"?'],
    ['  • Is the email date within the scan range?'],
    ['  • Was it in Spam/Trash folder?'],
    [''],
    ['💡 TARGET ACCURACY: 95%+ is excellent!'],
    ['If accuracy is below 95%, investigate patterns in missing invoices'],
    ['and adjust the script configuration accordingly.']
  ];
  
  instructionsSheet.getRange(1, 1, instructions.length, 1).setValues(instructions);
  instructionsSheet.getRange(1, 1).setBackground('#27ae60').setFontColor('white').setFontWeight('bold').setFontSize(16);
  instructionsSheet.setColumnWidth(1, 800);
  
  // Format section headers
  [3, 7, 15, 21, 28].forEach(row => {
    instructionsSheet.getRange(row, 1).setFontWeight('bold').setFontSize(12).setBackground('#ecf0f1');
  });
}

// ============================
// HELPER FUNCTIONS
// ============================

function getFolderIdFromUrl(url) {
  const match = url.match(/folders\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

function testValidation() {
  Logger.log('🧪 TESTING VALIDATION SCRIPT...\n');
  Logger.log('⚠️ Remember to update MANUAL_FOLDER_ID first!\n');
  
  try {
    const folder = DriveApp.getFolderById(VALIDATION_CONFIG.MANUAL_FOLDER_ID);
    Logger.log(`✅ Folder found: ${folder.getName()}`);
    Logger.log(`✅ Configuration looks good!`);
    Logger.log(`\nReady to run: createValidationSpreadsheet()`);
  } catch (error) {
    Logger.log(`❌ ERROR: ${error.message}`);
    Logger.log(`\n⚠️ UPDATE THE MANUAL_FOLDER_ID IN THE CONFIG!`);
    Logger.log(`\nHow to get folder ID:`);
    Logger.log(`1. Open your manual invoices folder in Drive`);
    Logger.log(`2. Copy the URL`);
    Logger.log(`3. Extract the ID: https://drive.google.com/drive/folders/THIS_IS_THE_ID`);
    Logger.log(`4. Paste it in MANUAL_FOLDER_ID at top of script`);
  }
}

/**
 * QUICK START:
 * 
 * 1. Get your manual folder ID from Drive URL
 * 2. Paste it in MANUAL_FOLDER_ID (line 20)
 * 3. Run: createValidationSpreadsheet()
 * 4. Open the created spreadsheet
 * 5. Compare with your automated results
 * 
 * The spreadsheet will have 3 sheets:
 * - Manual Folder Contents (all files found)
 * - Summary (counts by folder/type)
 * - Comparison Instructions (how to validate)
 */
