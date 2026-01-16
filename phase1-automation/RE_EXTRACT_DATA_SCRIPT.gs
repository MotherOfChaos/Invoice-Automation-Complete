/**
 * RE-EXTRACT DATA FROM EXISTING INVOICES
 * 
 * PURPOSE: Fix invoices that were uploaded WITHOUT Vision API extraction
 * 
 * WHAT IT DOES:
 * 1. Reads spreadsheet to find rows with missing Amount/Invoice#/IBAN
 * 2. Gets the invoice file from Drive Link
 * 3. Extracts data using Vision API
 * 4. Updates the spreadsheet row
 * 
 * HOW TO USE:
 * 1. Paste this code at BOTTOM of your existing script (after all functions)
 * 2. Save
 * 3. Select: reExtractAllInvoices
 * 4. Click Run
 * 5. Wait (can take 5-10 minutes for 147 invoices)
 */

// ============================
// RE-EXTRACTION MAIN FUNCTION
// ============================

function reExtractAllInvoices() {
  Logger.log('🔄 RE-EXTRACTING DATA FROM EXISTING INVOICES...\n');
  
  const startTime = new Date();
  
  try {
    // Get folder structure
    const props = PropertiesService.getScriptProperties();
    const folderData = props.getProperty(CONFIG.scriptProperty);
    
    if (!folderData) {
      Logger.log('❌ No folder structure found. Run initial scan first!');
      return;
    }
    
    const folderStructure = JSON.parse(folderData);
    let totalProcessed = 0;
    let totalExtracted = 0;
    let totalFailed = 0;
    
    // Process each year
    CONFIG.years.forEach(year => {
      if (!folderStructure.years[year]) return;
      
      Logger.log(`\n📅 PROCESSING YEAR: ${year}`);
      const yearData = folderStructure.years[year];
      const spreadsheet = SpreadsheetApp.openById(yearData.spreadsheetId);
      const sheet = spreadsheet.getActiveSheet();
      
      // Get all rows (skip header)
      const lastRow = sheet.getLastRow();
      if (lastRow < 2) {
        Logger.log('   No invoices to process');
        return;
      }
      
      const data = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
      
      // Process each row
      data.forEach((row, index) => {
        const rowNum = index + 2;
        const amount = row[4];      // Column E
        const invoiceNum = row[5];  // Column F
        const iban = row[6];        // Column G
        const driveLink = row[8];   // Column I
        
        // Skip if already has data
        if (amount && invoiceNum && iban) {
          Logger.log(`   ⏭️  Row ${rowNum}: Already has data`);
          return;
        }
        
        // Skip if no Drive link
        if (!driveLink) {
          Logger.log(`   ⚠️  Row ${rowNum}: No Drive link`);
          return;
        }
        
        totalProcessed++;
        Logger.log(`\n   🔍 Row ${rowNum}: Extracting...`);
        
        try {
          // Get file from Drive
          const fileId = extractFileIdFromUrl(driveLink);
          if (!fileId) {
            Logger.log(`      ❌ Could not extract file ID from URL`);
            totalFailed++;
            return;
          }
          
          const file = DriveApp.getFileById(fileId);
          Logger.log(`      📄 ${file.getName()}`);
          
          // Extract data with Vision API
          const extractedData = extractInvoiceDataVision(file);
          
          // Update spreadsheet
          if (extractedData.amount || extractedData.invoiceNumber || extractedData.iban) {
            sheet.getRange(rowNum, 5).setValue(extractedData.amount);           // Amount
            sheet.getRange(rowNum, 6).setValue(extractedData.invoiceNumber);    // Invoice #
            sheet.getRange(rowNum, 7).setValue(extractedData.iban);             // IBAN
            
            Logger.log(`      ✅ Amount: ${extractedData.amount || 'N/A'}`);
            Logger.log(`      ✅ Invoice#: ${extractedData.invoiceNumber || 'N/A'}`);
            Logger.log(`      ✅ IBAN: ${extractedData.iban || 'N/A'}`);
            totalExtracted++;
          } else {
            Logger.log(`      ⚠️  No data extracted (invoice may be unreadable)`);
            totalFailed++;
          }
          
          // Small delay to avoid rate limits
          Utilities.sleep(100);
          
        } catch (error) {
          Logger.log(`      ❌ Error: ${error.message}`);
          totalFailed++;
        }
      });
    });
    
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000);
    
    Logger.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    Logger.log('🎉 RE-EXTRACTION COMPLETE!\n');
    Logger.log(`📊 RESULTS:`);
    Logger.log(`   Total rows checked: ${totalProcessed}`);
    Logger.log(`   Successfully extracted: ${totalExtracted}`);
    Logger.log(`   Failed/unreadable: ${totalFailed}`);
    Logger.log(`   Time taken: ${duration} seconds`);
    Logger.log('\n✅ Check your spreadsheet - Amount/Invoice#/IBAN columns should now be filled!');
    Logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Send email notification
    if (totalExtracted > 0) {
      MailApp.sendEmail({
        to: CONFIG.emailAccounts[0],
        subject: `✅ Re-extraction Complete: ${totalExtracted} invoices updated`,
        body: `Re-extraction completed successfully!\n\n` +
              `Extracted: ${totalExtracted}\n` +
              `Failed: ${totalFailed}\n` +
              `Time: ${duration} seconds\n\n` +
              `Check your Invoices spreadsheet - data should now be populated!`
      });
    }
    
  } catch (error) {
    Logger.log(`\n❌ FATAL ERROR: ${error.message}`);
    Logger.log(error.stack);
    throw error;
  }
}

// ============================
// HELPER: EXTRACT FILE ID FROM URL
// ============================

function extractFileIdFromUrl(url) {
  if (!url) return null;
  
  // Match various Google Drive URL formats
  const patterns = [
    /\/d\/([a-zA-Z0-9_-]+)/,           // /d/FILE_ID
    /id=([a-zA-Z0-9_-]+)/,             // ?id=FILE_ID
    /file\/d\/([a-zA-Z0-9_-]+)/        // /file/d/FILE_ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

// ============================
// TEST SINGLE ROW (FOR DEBUGGING)
// ============================

function testReExtractSingleRow() {
  Logger.log('🧪 TESTING RE-EXTRACTION ON ONE ROW...\n');
  
  try {
    // Get first spreadsheet
    const props = PropertiesService.getScriptProperties();
    const folderData = JSON.parse(props.getProperty(CONFIG.scriptProperty));
    const year = CONFIG.years[0];
    const spreadsheet = SpreadsheetApp.openById(folderData.years[year].spreadsheetId);
    const sheet = spreadsheet.getActiveSheet();
    
    // Get first row with data
    const row = sheet.getRange(2, 1, 1, 10).getValues()[0];
    const driveLink = row[8];
    
    Logger.log(`📄 Testing with: ${row[1]}`); // Sender name
    Logger.log(`🔗 Drive link: ${driveLink}`);
    
    // Extract file ID
    const fileId = extractFileIdFromUrl(driveLink);
    Logger.log(`📋 File ID: ${fileId}`);
    
    // Get file
    const file = DriveApp.getFileById(fileId);
    Logger.log(`✅ File found: ${file.getName()}`);
    
    // Extract data
    Logger.log('\n🔍 Extracting data...');
    const extractedData = extractInvoiceDataVision(file);
    
    Logger.log('\n📊 EXTRACTED DATA:');
    Logger.log(`   Amount: ${extractedData.amount || 'N/A'}`);
    Logger.log(`   Invoice #: ${extractedData.invoiceNumber || 'N/A'}`);
    Logger.log(`   IBAN: ${extractedData.iban || 'N/A'}`);
    
    Logger.log('\n✅ Test successful! Ready to run reExtractAllInvoices()');
    
  } catch (error) {
    Logger.log(`\n❌ Test failed: ${error.message}`);
    Logger.log(error.stack);
  }
}

/**
 * INSTRUCTIONS:
 * 
 * 1. Copy this entire script
 * 2. Go to your "Teatro Invoices" Apps Script
 * 3. Scroll to the VERY BOTTOM (after all existing code)
 * 4. Paste this code
 * 5. Save (Ctrl+S)
 * 
 * TO TEST FIRST:
 * - Select: testReExtractSingleRow
 * - Click Run
 * - Check logs - should show extracted data
 * 
 * TO RUN FULL RE-EXTRACTION:
 * - Select: reExtractAllInvoices
 * - Click Run
 * - Wait 5-10 minutes (147 invoices)
 * - Check spreadsheet - data should be filled!
 * 
 * WHAT TO EXPECT:
 * - 90%+ extraction success rate
 * - Some invoices may fail (complex layouts)
 * - Those need manual entry (normal!)
 * 
 * TIME: ~2-3 seconds per invoice = ~7-10 minutes total
 */
