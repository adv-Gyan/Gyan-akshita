/**
 * ============================================================
 * RSVP GOOGLE SHEETS WEB APP
 * ============================================================
 *
 * Copy this file into the Apps Script project bound to the
 * Google Sheet that should receive wedding RSVP responses.
 * ============================================================
 */

const RSVP_SHEET_NAME = 'RSVP';
const RSVP_HEADERS = [
  'Timestamp',
  'Name',
  'Phone Number',
  'Attending',
  'Joining Date(s)',
  'Wishes'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const params = (e && e.parameter) || {};

    if (String(params.website || '').trim()) {
      return jsonResponse_({ ok: true });
    }

    const name = clean_(params.name);
    const phone = clean_(params.phone);
    const attending = clean_(params.attending).toLowerCase();
    const date = clean_(params.date);
    const wishes = clean_(params.wishes);

    if (!name || !phone || !['yes', 'no'].includes(attending)) {
      return jsonResponse_({ ok: false, error: 'Missing or invalid required fields.' });
    }

    if (attending === 'yes' && !date) {
      return jsonResponse_({ ok: false, error: 'Joining date is required for attending guests.' });
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet_(spreadsheet);

    sheet.appendRow([
      new Date(),
      name,
      phone,
      attending === 'yes' ? 'Yes' : 'No',
      attending === 'yes' ? date : 'Not attending',
      wishes
    ]);

    return jsonResponse_({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, error: 'Unable to save RSVP.' });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService
    .createTextOutput('RSVP endpoint is active.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(RSVP_SHEET_NAME);

  if (!sheet) sheet = spreadsheet.insertSheet(RSVP_SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(RSVP_HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, RSVP_HEADERS.length).setFontWeight('bold');
  }

  return sheet;
}

function clean_(value) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 1000);
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
