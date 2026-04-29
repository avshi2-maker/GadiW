// src/screens/fileEdit.js
// Edit metadata for an existing document. Hebrew RTL form.
// Created: 26/04/2026 (Lesson 9E — Phase B)
// Updated: 26/04/2026 — Lesson 9E Phase C: real REST PATCH + success banner with timestamp

import { supabase } from '../lib/supabase.js';

var SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
var SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function renderFileEdit(container, session, docId, onCancel, onSaved) {
  // ===== Initial loading shell =====
  container.innerHTML = `
    <div data-screen="fileedit" style="max-width: 700px; margin: 40px auto; padding: 24px; font-family: 'Heebo', sans-serif; direction: rtl;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #ddd; padding-bottom: 16px;">
        <h1 style="font-family: 'Frank Ruhl Libre', serif; font-size: 28px; margin: 0;">עריכת פרטי מסמך</h1>
        <button id="cancel-btn"
          style="padding: 8px 16px; background: #888; color: #fff; border: none; border-radius: 4px; font-size: 14px; cursor: pointer;">
          ביטול
        </button>
      </div>
      <div id="edit-content" style="min-height: 300px;">
        <p style="color: #666; text-align: center; padding: 40px 0;">טוען פרטי מסמך...</p>
      </div>
    </div>
  `;

  container.querySelector('#cancel-btn').addEventListener('click', function () {
    if (typeof onCancel === 'function') { onCancel(); }
  });

  var editContent = container.querySelector('#edit-content');
  var accessToken = session.access_token;

  // ===== Fetch the document =====
  var selectFields = 'id,file_name,file_size,mime_type,doc_tag,direction,doc_date,description,client_id';
  var url = SUPABASE_URL + '/rest/v1/documents?select=' + encodeURIComponent(selectFields) + '&id=eq.' + encodeURIComponent(docId);

  var doc = null;
  try {
    var resp = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    });
    if (!resp.ok) {
      var errText = await resp.text();
      editContent.innerHTML = `<div style="padding: 16px; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c00;">שגיאה בטעינת המסמך: ${errText}</div>`;
      return;
    }
    var rows = await resp.json();
    if (!rows || rows.length === 0) {
      editContent.innerHTML = `<div style="padding: 16px; background: #fff3e0; border: 1px solid #ffcc80; border-radius: 4px; color: #e65100;">המסמך לא נמצא או שאין לך הרשאה</div>`;
      return;
    }
    doc = rows[0];
  } catch (err) {
    editContent.innerHTML = `<div style="padding: 16px; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c00;">שגיאה ברשת: ${err.message}</div>`;
    return;
  }

  // ===== Fetch clients list =====
  var clients = [];
  try {
    var clientsUrl = SUPABASE_URL + '/rest/v1/clients?select=id,full_name&order=full_name.asc';
    var cresp = await fetch(clientsUrl, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    });
    if (cresp.ok) {
      clients = await cresp.json();
    }
  } catch (err) {
    // non-fatal
  }

  // ===== Helpers =====
  function fmtKB(bytes) {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function escapeAttr(s) {
    return String(s || '').replace(/"/g, '&quot;');
  }

  function pad2(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function fmtHebrewDateTime(d) {
    return pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1) + '/' + d.getFullYear() +
      ' · ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
  }

  // ===== Build dropdowns =====
  var clientOptionsHtml = '<option value="">-- בחר לקוח (חובה) --</option>';
  clients.forEach(function (c) {
    var selected = (c.id === doc.client_id) ? ' selected' : '';
    clientOptionsHtml += '<option value="' + escapeAttr(c.id) + '"' + selected + '>' + escapeHtml(c.full_name) + '</option>';
  });

  function dirOption(value) {
    var selected = (doc.direction === value) ? ' selected' : '';
    return '<option value="' + value + '"' + selected + '>' + value + '</option>';
  }

  // ===== Render the edit form =====
  editContent.innerHTML = `
    <div style="background: #1E2D5C; color: #fff; padding: 16px 20px; border-radius: 6px; margin-bottom: 20px;">
      <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">קובץ (לא ניתן לעריכה)</div>
      <div style="font-weight: 500; font-size: 16px; word-break: break-word;">${escapeHtml(doc.file_name)}</div>
      <div style="color: #c5d2e3; font-size: 12px; margin-top: 4px;">${escapeHtml(doc.mime_type || 'unknown')} · ${fmtKB(doc.file_size)}</div>
    </div>

    <div id="edit-status" style="display: none; padding: 12px; border-radius: 4px; margin-bottom: 16px;"></div>

    <form id="edit-form" style="display: flex; flex-direction: column; gap: 16px;">

      <div>
        <label style="display: block; font-weight: 500; margin-bottom: 6px;">תיוג מסמך <span style="color: #c00;">*</span></label>
        <input type="text" id="doc-tag-input" value="${escapeAttr(doc.doc_tag)}" placeholder="חוזה, מכתב, תעודה..."
          style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; direction: rtl;" />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <label style="display: block; font-weight: 500; margin-bottom: 6px;">כיוון <span style="color: #c00;">*</span></label>
          <select id="direction-input" required
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; direction: rtl; background: #fff;">
            ${dirOption('פנימי')}
            ${dirOption('התקבל')}
            ${dirOption('נשלח')}
          </select>
        </div>
        <div>
          <label style="display: block; font-weight: 500; margin-bottom: 6px;">תאריך המסמך</label>
          <input type="date" id="doc-date-input" value="${escapeAttr(doc.doc_date || '')}"
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit;" />
        </div>
      </div>

      <div>
        <label style="display: block; font-weight: 500; margin-bottom: 6px;">לקוח <span style="color: #c00;">*</span></label>
        <select id="client-input"
          style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; direction: rtl; background: #fff;">
          ${clientOptionsHtml}
        </select>
      </div>

      <div>
        <label style="display: block; font-weight: 500; margin-bottom: 6px;">תיאור</label>
        <textarea id="description-input" rows="3" placeholder="תיאור או הערות (אופציונלי)"
          style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; direction: rtl; resize: vertical;">${escapeHtml(doc.description || '')}</textarea>
      </div>

      <div style="display: flex; gap: 8px; justify-content: flex-start; margin-top: 8px;">
        <button type="submit" id="save-btn"
          style="padding: 10px 24px; background: #1E2D5C; color: #fff; border: none; border-radius: 4px; font-size: 15px; font-weight: 500; cursor: pointer;">
          💾 שמור שינויים
        </button>
        <button type="button" id="cancel-btn-2"
          style="padding: 10px 24px; background: #fff; color: #888; border: 1px solid #ccc; border-radius: 4px; font-size: 15px; cursor: pointer;">
          ביטול
        </button>
      </div>

    </form>
  `;

  container.querySelector('#cancel-btn-2').addEventListener('click', function () {
    if (typeof onCancel === 'function') { onCancel(); }
  });

  // ===== Show status helper =====
  function showStatus(message, type) {
    var statusDiv = container.querySelector('#edit-status');
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

  // ===== Form submit — Phase C real save =====
  container.querySelector('#edit-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    var saveBtn = container.querySelector('#save-btn');
    var docTagInput = container.querySelector('#doc-tag-input');
    var directionInput = container.querySelector('#direction-input');
    var docDateInput = container.querySelector('#doc-date-input');
    var clientInput = container.querySelector('#client-input');
    var descriptionInput = container.querySelector('#description-input');

    // ===== Validation =====
    if (!clientInput.value) {
      showStatus('יש לבחור לקוח', 'error');
      clientInput.focus();
      clientInput.style.borderColor = '#c00';
      setTimeout(function () { clientInput.style.borderColor = '#ccc'; }, 3000);
      return;
    }

    if (!docTagInput.value.trim()) {
      showStatus('יש למלא תיוג מסמך (חיוני לחיפוש)', 'error');
      docTagInput.focus();
      docTagInput.style.borderColor = '#c00';
      setTimeout(function () { docTagInput.style.borderColor = '#ccc'; }, 3000);
      return;
    }

    // ===== Lock UI during save =====
    saveBtn.disabled = true;
    saveBtn.style.opacity = '0.6';
    saveBtn.style.cursor = 'wait';
    saveBtn.textContent = 'שומר...';
    showStatus('שומר שינויים...', 'info');

    // ===== Build PATCH payload =====
    var patchBody = {
      doc_tag: docTagInput.value.trim() || null,
      direction: directionInput.value,
      doc_date: docDateInput.value || null,
      client_id: clientInput.value,
      description: descriptionInput.value.trim() || null
    };

    try {
      var patchUrl = SUPABASE_URL + '/rest/v1/documents?id=eq.' + encodeURIComponent(docId);
      var patchResp = await fetch(patchUrl, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(patchBody)
      });

      if (!patchResp.ok) {
        var errText = await patchResp.text();
        showStatus('שגיאה בשמירה: ' + errText.substring(0, 200), 'error');
        saveBtn.disabled = false;
        saveBtn.style.opacity = '1';
        saveBtn.style.cursor = 'pointer';
        saveBtn.textContent = '💾 שמור שינויים';
        return;
      }

      // ===== SUCCESS — show big green banner with timestamp =====
      var now = new Date();
      var timestampHebrew = fmtHebrewDateTime(now);

      editContent.innerHTML = `
        <div style="background: #e8f5e9; border: 2px solid #66bb6a; border-radius: 8px; padding: 32px 24px; text-align: center; margin-bottom: 16px;">
          <div style="font-size: 56px; margin-bottom: 12px;">✅</div>
          <div style="font-size: 22px; font-weight: 500; color: #1b5e20; margin-bottom: 8px;">המסמך נשמר בהצלחה</div>
          <div style="font-size: 14px; color: #2e7d32; margin-bottom: 24px;">עודכן: ${timestampHebrew}</div>
          <button type="button" id="back-to-detail-btn"
            style="padding: 10px 24px; background: #1E2D5C; color: #fff; border: none; border-radius: 4px; font-size: 15px; cursor: pointer;">
            חזרה למסמך
          </button>
          <div style="font-size: 12px; color: #66bb6a; margin-top: 12px;">חוזר אוטומטית בעוד 4 שניות...</div>
        </div>
      `;

      var backBtn = container.querySelector('#back-to-detail-btn');
      var navigated = false;

      function navigateToDetail() {
        if (navigated) return;
        navigated = true;
        if (typeof onSaved === 'function') { onSaved(); }
      }

      backBtn.addEventListener('click', navigateToDetail);
      setTimeout(navigateToDetail, 4000);

    } catch (err) {
      showStatus('שגיאה ברשת: ' + (err.message || String(err)), 'error');
      saveBtn.disabled = false;
      saveBtn.style.opacity = '1';
      saveBtn.style.cursor = 'pointer';
      saveBtn.textContent = '💾 שמור שינויים';
    }
  });
}
