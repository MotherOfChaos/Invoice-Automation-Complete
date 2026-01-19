/**
 * EMAIL SUBJECT ANALYZER
 * Run this ONCE in Apps Script to analyze what subject keywords are actually used
 *
 * HOW TO USE:
 * 1. Copy this entire file to Apps Script (new project)
 * 2. Select analyzeEmailSubjects from dropdown
 * 3. Click Run
 * 4. Wait 2-3 minutes
 * 5. Check execution logs for results
 */

function analyzeEmailSubjects() {
  Logger.log('='.repeat(80));
  Logger.log('EMAIL SUBJECT ANALYSIS FOR INVOICE AUTOMATION');
  Logger.log('='.repeat(80));

  const CONFIG = {
    emailAccounts: [
      'info@teatrometamorfosis.com',
      'laura@teatrometamorfosis.com'
    ],
    scanStartDate: '2025/01/01',
    currentKeywords: ['invoice', 'factura', 'pago', 'pagos', 'recibo', 'receipt', 'payment']
  };

  // Statistics
  const stats = {
    totalThreads: 0,
    totalMessages: 0,
    totalAttachments: 0,
    subjectKeywords: {},
    subjectsWithoutKeywords: [],
    attachmentPatterns: {}
  };

  const excludeSent = CONFIG.emailAccounts.map(email => `-from:${email}`).join(' ');
  const query = `has:attachment ${excludeSent} in:anywhere after:${CONFIG.scanStartDate}`;

  Logger.log('\nSearch Query: ' + query);
  Logger.log('Scanning emails...\n');

  const threads = GmailApp.search(query, 0, 500);
  stats.totalThreads = threads.length;

  Logger.log(`Found ${threads.length} email threads\n`);

  threads.forEach(thread => {
    const messages = thread.getMessages();

    messages.forEach(message => {
      stats.totalMessages++;
      const subject = message.getSubject().toLowerCase();
      const attachments = message.getAttachments();

      if (attachments.length === 0) return;

      attachments.forEach(attachment => {
        const filename = attachment.getName().toLowerCase();

        // Skip obvious non-invoices
        if (filename.endsWith('.zip') || filename.endsWith('.xlsx') ||
            filename.endsWith('.xls') || filename.endsWith('.jpg') ||
            filename.endsWith('.png') || filename.endsWith('.jpeg')) {
          return;
        }

        stats.totalAttachments++;

        // Extract keywords from subject
        const words = subject.split(/[\s,;:.\-_]+/).filter(w => w.length > 2);
        words.forEach(word => {
          if (!stats.subjectKeywords[word]) {
            stats.subjectKeywords[word] = 0;
          }
          stats.subjectKeywords[word]++;
        });

        // Check if subject has ANY current keyword
        const hasKeyword = CONFIG.currentKeywords.some(kw => subject.includes(kw));

        if (!hasKeyword) {
          stats.subjectsWithoutKeywords.push({
            subject: message.getSubject(),
            filename: attachment.getName(),
            from: message.getFrom()
          });
        }

        // Track filename patterns
        const filenameWords = filename.split(/[\s,;:.\-_]+/).filter(w => w.length > 2);
        filenameWords.forEach(word => {
          if (!stats.attachmentPatterns[word]) {
            stats.attachmentPatterns[word] = 0;
          }
          stats.attachmentPatterns[word]++;
        });
      });
    });
  });

  // Generate Report
  Logger.log('\n' + '='.repeat(80));
  Logger.log('ANALYSIS RESULTS');
  Logger.log('='.repeat(80));

  Logger.log(`\nTotal threads: ${stats.totalThreads}`);
  Logger.log(`Total messages: ${stats.totalMessages}`);
  Logger.log(`Total PDF/DOC attachments: ${stats.totalAttachments}`);

  Logger.log('\n' + '-'.repeat(80));
  Logger.log('TOP 50 SUBJECT KEYWORDS (how often they appear):');
  Logger.log('-'.repeat(80));

  const sortedSubjects = Object.entries(stats.subjectKeywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);

  sortedSubjects.forEach(([word, count]) => {
    Logger.log(`${word.padEnd(30)} → ${count} times`);
  });

  Logger.log('\n' + '-'.repeat(80));
  Logger.log('TOP 50 FILENAME PATTERNS (how often they appear):');
  Logger.log('-'.repeat(80));

  const sortedFilenames = Object.entries(stats.attachmentPatterns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);

  sortedFilenames.forEach(([word, count]) => {
    Logger.log(`${word.padEnd(30)} → ${count} times`);
  });

  Logger.log('\n' + '-'.repeat(80));
  Logger.log(`EMAILS WITHOUT CURRENT KEYWORDS (${stats.subjectsWithoutKeywords.length} cases):`);
  Logger.log('-'.repeat(80));
  Logger.log('First 20 examples:\n');

  stats.subjectsWithoutKeywords.slice(0, 20).forEach(item => {
    Logger.log(`Subject: ${item.subject}`);
    Logger.log(`  File: ${item.filename}`);
    Logger.log(`  From: ${item.from}`);
    Logger.log('');
  });

  Logger.log('\n' + '='.repeat(80));
  Logger.log('RECOMMENDATIONS FOR NEW KEYWORDS:');
  Logger.log('='.repeat(80));

  // Find keywords that appear frequently in subjects
  const recommendations = sortedSubjects
    .filter(([word, count]) =>
      count > 5 &&
      !CONFIG.currentKeywords.includes(word) &&
      word.length > 3
    )
    .slice(0, 20);

  Logger.log('\nAdd these to invoiceKeywords array:');
  recommendations.forEach(([word, count]) => {
    Logger.log(`  '${word}',  // appears ${count} times`);
  });

  Logger.log('\n' + '='.repeat(80));
  Logger.log('ANALYSIS COMPLETE!');
  Logger.log('='.repeat(80));
  Logger.log('\nCopy the keyword recommendations above and add them to your CONFIG.');
}

/**
 * Alternative: Export results to Google Sheet
 * Uncomment and run this if you want results in a spreadsheet
 */
/*
function exportAnalysisToSheet() {
  // Run analysis first
  analyzeEmailSubjects();

  // Create spreadsheet with results
  const ss = SpreadsheetApp.create('Invoice Email Analysis');
  const sheet = ss.getActiveSheet();
  sheet.setName('Subject Keywords');

  // Add headers and data
  // ... (implement if needed)

  Logger.log('Results exported to: ' + ss.getUrl());
}
*/
