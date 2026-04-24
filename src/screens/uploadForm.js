// src/screens/uploadForm.js
// Upload form screen — Hebrew RTL form for uploading a single document to
// Supabase Storage + documents table. Phase C: UI only (no upload logic yet).
// Created: 24/04/2026 (Lesson 7 — Phase C)

import { supabase } from '../lib/supabase.js';

var SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
var SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function renderUploadForm(container, session, onCancel, onSuccess) {
  container.innerHTML = `
    <div style="max-width: 700px; margin: 40px auto; padding: 24px; font-family: 'Heebo', sans-serif; direction: rtl;">

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #ddd; padding-bottom: 16px;">
        <h1 style="font-family: 'Frank Ruhl Libre', serif; font-size: 28px; margin: 0;">העלאת מסמך חדש</h1>
        <button id="cancel-btn"
          style="padding: 8px 16px; background: #888; color: #fff; border: none; border-radius: 4px; font-size: 14px; cursor: pointer;">
          ביטול
        </button>
      </div>

      <div id="upload-status" style="display: none; padding: 12px; border-radius: 4px; margin-bottom: 16px;"></div>

      <form id="upload-form" style="display: flex; flex-direction: column; gap: 16px;">

        <div>
          <label style="display: block; font-weight: 500; margin-bottom: 6px;">קובץ <span style="color: #c00;">*</span></label>
          <input type="file" id="file-input" required
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit;" />
          <p style="font-size: 12px; color: #888; margin: 4px 0 0;">גודל מקסימלי: 50MB</p>
        </div>

        <div>
          <label style="display: block; font-weight: 500; margin-bottom: 6px;">תיוג מסמך</label>
          <input type="text" id="doc-tag-input" placeholder="חוזה, מכתב, תעודה..."
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; direction: rtl;" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label style="display: block; font-weight: 500; margin-bottom: 6px;">כיוון <span style="color: #c00;">*</span></label>
            <select id="direction-input" required
              style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; direction: rtl; background: #fff;">
              <option value="פנימי">פנימי</option>
              <option value="התקבל">התקבל</option>
              <option value="נשלח">נשלח</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-weight: 500; margin-bottom: 6px;">תאריך המסמך</label>
            <input type="date" id="doc-date-input"
              style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit;" />
          </div>
        </div>

        <div>
          <label style="display: block; font-weight: 500; margin-bottom: 6px;">לקוח</label>
          <select id="client-input"
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; direction: rtl; background: #fff;">
            <option value="">-- טוען לקוחות --</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-weight: 500; margin-bottom: 6px;">תיאור</label>
          <textarea id="description-input" rows="3" placeholder="תיאור או הערות (אופציונלי)"
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; direction: rtl; resize: vertical;"></textarea>
        </div>

        <div style="display: flex; gap: 8px; justify-content: flex-start; margin-top: 8px;">
          <button type="submit" id="submit-btn"
            style="padding: 10px 24px; background: #1F3A5F; color: #fff; border: none; border-radius: 4px; font-size: 15px; font-weight: 500; cursor: pointer;">
            העלה מסמך
          </button>
        </div>

      </form>
    </div>
  `;

  // Default the date to today
  var today = new Date().toISOString().split('T')[0];
  container.querySelector('#doc-date-input').value = today;

  // Cancel button → return to file list
  container.querySelector('#cancel-btn').addEventListener('click', function () {
    if (typeof onCancel === 'function') { onCancel(); }
  });

  // Load client list into dropdown
  var accessToken = session.access_token;
  var clientSelect = container.querySelector('#client-input');

  try {
    var clientsUrl = SUPABASE_URL + '/rest/v1/clients?select=id,full_name&order=full_name.asc';
    var resp = await fetch(clientsUrl, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (resp.ok) {
      var clients = await resp.json();
      var optionsHtml = '<option value="">-- ללא לקוח --</option>';
      clients.forEach(function (c) {
        optionsHtml += '<option value="' + c.id + '">' + c.full_name + '</option>';
      });
      clientSelect.innerHTML = optionsHtml;
    } else {
      clientSelect.innerHTML = '<option value="">-- שגיאה בטעינת לקוחות --</option>';
    }
  } catch (err) {
    clientSelect.innerHTML = '<option value="">-- שגיאה ברשת --</option>';
  }

  // Form submit → Phase D will wire this. For now, placeholder.
  // Phase D — actual upload logic
  container.querySelector('#upload-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    var submitBtn = container.querySelector('#submit-btn');
    var statusDiv = container.querySelector('#upload-status');
    var fileInput = container.querySelector('#file-input');
    var docTagInput = container.querySelector('#doc-tag-input');
    var directionInput = container.querySelector('#direction-input');
    var docDateInput = container.querySelector('#doc-date-input');
    var clientInput = container.querySelector('#client-input');
    var descriptionInput = container.querySelector('#description-input');

    // Validate a file was chosen
    if (!fileInput.files || fileInput.files.length === 0) {
      showStatus(statusDiv, 'יש לבחור קובץ', 'error');
      return;
    }
    var file = fileInput.files[0];

    // Validate file size (50MB = 52428800 bytes)
    if (file.size > 52428800) {
      showStatus(statusDiv, 'הקובץ גדול מדי. גודל מקסימלי: 50MB', 'error');
      return;
    }

    // Disable the button + show progress
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
    submitBtn.style.cursor = 'wait';
    submitBtn.textContent = 'מעלה...';
    showStatus(statusDiv, 'מעלה את הקובץ, אנא המתן...', 'info');

    try {
      // ===== STEP 1: Upload file to Supabase Storage =====
      // Build a unique storage path with ASCII-only filename.
      // Supabase Storage rejects non-ASCII chars (Hebrew, spaces, etc.) in keys.
      // We preserve the original Hebrew filename in the DB (file_name column)
      // and use a sanitized ASCII slug for the storage path only.
      var userId = session.user.id;
      var timestamp = Date.now();

      // Extract extension (e.g. ".pdf", ".jpg")
      var lastDot = file.name.lastIndexOf('.');
      var ext = lastDot >= 0 ? file.name.substring(lastDot).toLowerCase() : '';
      ext = ext.replace(/[^a-z0-9.]/g, ''); // keep only safe chars in extension

      // Build a safe ASCII filename: timestamp + random + extension
      // Hebrew/original name is preserved in documents.file_name for display
      var randomSuffix = Math.random().toString(36).substring(2, 8);
      var safeName = timestamp + '_' + randomSuffix + ext;
      var storagePath = 'inbox/' + userId + '/' + safeName;

      var uploadUrl = SUPABASE_URL + '/storage/v1/object/gadi-documents/' + encodeURI(storagePath);

      var uploadResp = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': file.type || 'application/octet-stream',
          'x-upsert': 'false'
        },
        body: file
      });

      if (!uploadResp.ok) {
        var uploadErr = await uploadResp.text();
        showStatus(statusDiv, 'שגיאה בהעלאת הקובץ: ' + uploadErr, 'error');
        resetButton(submitBtn);
        return;
      }

      // ===== STEP 2: Insert metadata row into documents table =====
      var clientId = clientInput.value || null;
      var docTag = docTagInput.value.trim() || null;
      var description = descriptionInput.value.trim() || null;

      var docRow = {
        file_name: file.name,
        file_url: storagePath,
        file_size: file.size,
        mime_type: file.type || null,
        doc_tag: docTag,
        direction: directionInput.value,
        doc_date: docDateInput.value || null,
        description: description
      };
      if (clientId) { docRow.client_id = clientId; }

      var insertUrl = SUPABASE_URL + '/rest/v1/documents';
      var insertResp = await fetch(insertUrl, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(docRow)
      });

      if (!insertResp.ok) {
        var insertErr = await insertResp.text();
        showStatus(statusDiv, 'הקובץ הועלה אבל נכשלה שמירת הפרטים: ' + insertErr, 'error');
        resetButton(submitBtn);
        return;
      }

      // ===== Success =====
      showStatus(statusDiv, '✓ המסמך הועלה בהצלחה', 'success');
      submitBtn.textContent = 'הועלה בהצלחה';

      // Wait 1.2 seconds so the user sees the success message, then return to list
      setTimeout(function () {
        if (typeof onSuccess === 'function') { onSuccess(); }
      }, 1200);

    } catch (err) {
      showStatus(statusDiv, 'שגיאה ברשת: ' + err.message, 'error');
      resetButton(submitBtn);
    }
  });
}

// ===== Helper functions =====

function showStatus(statusDiv, message, type) {
  var colors = {
    info:    { bg: '#e3f2fd', border: '#90caf9', text: '#0d47a1' },
    success: { bg: '#e8f5e9', border: '#a5d6a7', text: '#1b5e20' },
    error:   { bg: '#ffebee', border: '#ef9a9a', text: '#b71c1c' }
  };
  var c = colors[type] || colors.info;
  statusDiv.style.display = 'block';
  statusDiv.style.background = c.bg;
  statusDiv.style.border = '1px solid ' + c.border;
  statusDiv.style.color = c.text;
  statusDiv.textContent = message;
}

function resetButton(btn) {
  btn.disabled = false;
  btn.style.opacity = '1';
  btn.style.cursor = 'pointer';
  btn.textContent = 'העלה מסמך';
}