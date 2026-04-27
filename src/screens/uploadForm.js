// src/screens/uploadForm.js
// Upload form screen — Hebrew RTL form for uploading single OR multiple documents.
// Created: 24/04/2026 (Lesson 7)
// Updated: 26/04/2026 — Lesson 9D Phases A-D
// Updated: 26/04/2026 — Lesson 9D Phase E: visual progress UI replaces alert popups
// Updated: 26/04/2026 — Lesson 9B Phase E: data-screen="upload" + .up-header class for mobile

import { supabase } from '../lib/supabase.js';

var SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
var SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function renderUploadForm(container, session, onCancel, onSuccess) {
  container.innerHTML = `
    <style>
      @media (max-width: 768px) {
        [data-screen="upload"] {
          max-width: 100% !important;
          margin: 0 !important;
          padding: 16px 12px !important;
          box-sizing: border-box !important;
        }
        [data-screen="upload"] .up-header {
          flex-direction: column !important;
          align-items: stretch !important;
          gap: 12px !important;
        }
        [data-screen="upload"] .up-header h1 {
          font-size: 22px !important;
          text-align: right !important;
        }
        [data-screen="upload"] .up-header #cancel-btn {
          width: 100% !important;
        }
      }
    </style>
    <div data-screen="upload" style="max-width: 700px; margin: 40px auto; padding: 24px; font-family: 'Heebo', sans-serif; direction: rtl;">

      <div class="up-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #ddd; padding-bottom: 16px;">
        <h1 id="form-title" style="font-family: 'Frank Ruhl Libre', serif; font-size: 28px; margin: 0;">העלאת מסמך חדש</h1>
        <button id="cancel-btn"
          style="padding: 8px 16px; background: #888; color: #fff; border: none; border-radius: 4px; font-size: 14px; cursor: pointer;">
          ביטול
        </button>
      </div>

      <div id="upload-status" style="display: none; padding: 12px; border-radius: 4px; margin-bottom: 16px;"></div>

      <div id="progress-panel" style="display: none; margin-bottom: 16px;"></div>

      <form id="upload-form" style="display: flex; flex-direction: column; gap: 16px;">

        <div>
          <label style="display: block; font-weight: 500; margin-bottom: 6px;">קבצים <span style="color: #c00;">*</span></label>
          <div id="drop-zone"
            style="border: 2px dashed #1F3A5F; border-radius: 8px; padding: 32px 16px; text-align: center; background: #f7f8fa; cursor: pointer; transition: background 0.15s, border-color 0.15s;">
            <div style="font-size: 36px; margin-bottom: 8px;">📁</div>
            <div style="font-size: 15px; color: #333; margin-bottom: 4px;">גרור קבצים לכאן</div>
            <div style="font-size: 13px; color: #888; margin-bottom: 12px;">או</div>
            <button type="button" id="pick-files-btn"
              style="padding: 8px 20px; background: #1F3A5F; color: #fff; border: none; border-radius: 4px; font-size: 14px; cursor: pointer;">
              בחר קבצים מהמחשב
            </button>
            <input type="file" id="file-input" multiple style="display: none;" />
          </div>
          <p style="font-size: 12px; color: #888; margin: 6px 0 0;">ניתן לבחור קובץ אחד או מספר קבצים. גודל מקסימלי לקובץ: 50MB</p>
        </div>

        <div id="file-table-container" style="display: none;"></div>

        <div id="single-tag-block">
          <label style="display: block; font-weight: 500; margin-bottom: 6px;">תיוג מסמך</label>
          <input type="text" id="doc-tag-input" placeholder="חוזה, מכתב, תעודה..."
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; direction: rtl;" />
        </div>

        <div class="up-direction-date-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
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

  var today = new Date().toISOString().split('T')[0];
  container.querySelector('#doc-date-input').value = today;

  container.querySelector('#cancel-btn').addEventListener('click', function () {
    if (typeof onCancel === 'function') { onCancel(); }
  });

  // ===== Wire dropzone =====
  var dropZone = container.querySelector('#drop-zone');
  var fileInput = container.querySelector('#file-input');
  var pickBtn = container.querySelector('#pick-files-btn');

  pickBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    fileInput.click();
  });
  dropZone.addEventListener('click', function () {
    fileInput.click();
  });
  fileInput.addEventListener('change', function (e) {
    var files = Array.from(e.target.files || []);
    handleFiles(files);
    fileInput.value = '';
  });
  dropZone.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropZone.style.background = '#e8f0fb';
    dropZone.style.borderColor = '#0d2747';
  });
  dropZone.addEventListener('dragleave', function (e) {
    e.preventDefault();
    dropZone.style.background = '#f7f8fa';
    dropZone.style.borderColor = '#1F3A5F';
  });
  dropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropZone.style.background = '#f7f8fa';
    dropZone.style.borderColor = '#1F3A5F';
    var files = Array.from(e.dataTransfer.files || []);
    handleFiles(files);
  });

  // ===== File selection state =====
  var selectedFiles = [];
  var fileTableContainer = container.querySelector('#file-table-container');
  var docTagInputBlock = container.querySelector('#single-tag-block');
  var progressPanel = container.querySelector('#progress-panel');

  function makeId() {
    return 'f_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  }

  function fmtKB(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function escapeAttr(s) {
    return String(s || '').replace(/"/g, '&quot;');
  }

  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function statusIcon(status) {
    if (status === 'pending')   return '⌛';
    if (status === 'uploading') return '⏳';
    if (status === 'success')   return '✅';
    if (status === 'failed')    return '❌';
    return '•';
  }

  function statusColor(status) {
    if (status === 'success') return '#1b5e20';
    if (status === 'failed')  return '#b71c1c';
    if (status === 'uploading') return '#0d47a1';
    return '#888';
  }

  function handleFiles(newFiles) {
    if (!newFiles || newFiles.length === 0) { return; }
    var skipped = [];
    newFiles.forEach(function (f) {
      if (f.size > 52428800) {
        skipped.push(f.name + ' (גדול מ-50MB)');
        return;
      }
      var dupe = selectedFiles.find(function (entry) {
        return entry.file.name === f.name && entry.file.size === f.size;
      });
      if (dupe) {
        skipped.push(f.name + ' (כפול)');
        return;
      }
      selectedFiles.push({
        id: makeId(),
        file: f,
        tag: '',
        status: 'pending',
        errorMessage: null,
        documentId: null
      });
    });
    if (skipped.length > 0) {
      alert('הקבצים הבאים דולגו:\n\n• ' + skipped.join('\n• '));
    }
    renderFileTable();
  }

  function removeFile(id) {
    selectedFiles = selectedFiles.filter(function (e) { return e.id !== id; });
    renderFileTable();
  }

  function setFileTag(id, newTag) {
    var entry = selectedFiles.find(function (e) { return e.id === id; });
    if (entry) { entry.tag = newTag; }
  }

  function applyTagToAll(tag) {
    selectedFiles.forEach(function (e) { e.tag = tag; });
    renderFileTable();
  }

  function updateSubmitLabel() {
    var btn = container.querySelector('#submit-btn');
    if (!btn) return;
    if (selectedFiles.length <= 1) {
      btn.textContent = 'העלה מסמך';
    } else {
      btn.textContent = 'העלה ' + selectedFiles.length + ' מסמכים';
    }
  }

  function renderFileTable() {
    if (selectedFiles.length === 0) {
      fileTableContainer.style.display = 'none';
      fileTableContainer.innerHTML = '';
      docTagInputBlock.style.display = 'block';
      updateSubmitLabel();
      return;
    }

    if (selectedFiles.length === 1) {
      fileTableContainer.style.display = 'block';
      fileTableContainer.innerHTML = `
        <div style="background: #f7f8fa; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 14px;">
            <span style="color: #888;">קובץ נבחר:</span>
            <span style="font-weight: 500; margin-right: 6px;">${escapeHtml(selectedFiles[0].file.name)}</span>
            <span style="color: #888; font-size: 12px;">(${fmtKB(selectedFiles[0].file.size)})</span>
          </div>
          <button type="button" data-remove-id="${selectedFiles[0].id}"
            style="background: transparent; border: none; color: #c00; font-size: 16px; cursor: pointer;" title="הסר">✕</button>
        </div>
      `;
      docTagInputBlock.style.display = 'block';
      var removeBtn = fileTableContainer.querySelector('[data-remove-id]');
      removeBtn.addEventListener('click', function () {
        removeFile(removeBtn.getAttribute('data-remove-id'));
      });
      updateSubmitLabel();
      return;
    }

    docTagInputBlock.style.display = 'none';

    var rowsHtml = selectedFiles.map(function (entry, idx) {
      return `
        <div style="display: grid; grid-template-columns: 28px 1fr 80px 1fr 36px; gap: 10px; align-items: center; padding: 10px 12px; border-bottom: 1px solid #eee; background: ${idx % 2 === 0 ? '#fff' : '#fafbfc'};">
          <div style="color: #888; font-size: 13px; text-align: center;">${idx + 1}</div>
          <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px;" title="${escapeAttr(entry.file.name)}">${escapeHtml(entry.file.name)}</div>
          <div style="color: #888; font-size: 12px; text-align: left;">${fmtKB(entry.file.size)}</div>
          <input type="text" data-tag-id="${entry.id}" value="${escapeAttr(entry.tag)}" placeholder="תיוג..."
            style="padding: 6px 8px; border: 1px solid #ccc; border-radius: 3px; font-family: inherit; direction: rtl; font-size: 13px;" />
          <button type="button" data-remove-id="${entry.id}"
            style="background: transparent; border: none; color: #c00; font-size: 15px; cursor: pointer;" title="הסר">✕</button>
        </div>
      `;
    }).join('');

    fileTableContainer.style.display = 'block';
    fileTableContainer.innerHTML = `
      <div style="margin-bottom: 12px; background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
        <div style="background: #1F3A5F; color: #fff; padding: 10px 14px; font-weight: 500; font-size: 14px; display: flex; justify-content: space-between; align-items: center;">
          <span>📂 קבצים שנבחרו (${selectedFiles.length})</span>
          <button type="button" id="clear-all-files-btn"
            style="background: transparent; border: 1px solid #fff; color: #fff; padding: 4px 10px; border-radius: 3px; font-size: 12px; cursor: pointer; font-family: inherit;">
            נקה הכל
          </button>
        </div>
        <div>${rowsHtml}</div>
      </div>

      <div class="up-bulk-apply" style="background: #eef4ff; border: 1px solid #c5d6f0; border-radius: 6px; padding: 12px; margin-bottom: 12px; display: flex; gap: 8px; align-items: center;">
        <span style="font-size: 13px; color: #1F3A5F; white-space: nowrap;">💡 החל תיוג על כל הקבצים:</span>
        <input type="text" id="bulk-tag-input" placeholder="לדוגמה: חוזה"
          style="flex: 1; padding: 6px 8px; border: 1px solid #ccc; border-radius: 3px; font-family: inherit; direction: rtl; font-size: 13px;" />
        <button type="button" id="apply-tag-all-btn"
          style="padding: 6px 14px; background: #1F3A5F; color: #fff; border: none; border-radius: 3px; font-size: 13px; cursor: pointer; white-space: nowrap;">
          החל על הכל
        </button>
      </div>

      <div class="up-add-more" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 8px 12px; background: #fafbfc; border-radius: 4px; border: 1px dashed #ddd;">
        <button type="button" id="add-more-files-btn"
          style="padding: 6px 14px; background: #fff; color: #1F3A5F; border: 1px solid #1F3A5F; border-radius: 3px; font-size: 13px; cursor: pointer;">
          + הוסף קבצים נוספים
        </button>
        <span id="total-size-label" style="color: #666; font-size: 13px;"></span>
      </div>
    `;

    fileTableContainer.querySelectorAll('[data-tag-id]').forEach(function (input) {
      input.addEventListener('input', function () {
        setFileTag(input.getAttribute('data-tag-id'), input.value);
      });
    });

    fileTableContainer.querySelectorAll('[data-remove-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        removeFile(btn.getAttribute('data-remove-id'));
      });
    });

    fileTableContainer.querySelector('#clear-all-files-btn').addEventListener('click', function () {
      if (confirm('להסיר את כל ' + selectedFiles.length + ' הקבצים?')) {
        selectedFiles = [];
        renderFileTable();
      }
    });

    fileTableContainer.querySelector('#apply-tag-all-btn').addEventListener('click', function () {
      var tag = fileTableContainer.querySelector('#bulk-tag-input').value.trim();
      if (!tag) {
        alert('יש להזין תיוג לפני החלה על כל הקבצים');
        return;
      }
      applyTagToAll(tag);
    });

    fileTableContainer.querySelector('#add-more-files-btn').addEventListener('click', function () {
      fileInput.click();
    });

    var totalBytes = selectedFiles.reduce(function (sum, e) { return sum + e.file.size; }, 0);
    fileTableContainer.querySelector('#total-size-label').textContent =
      'סך הכל: ' + selectedFiles.length + ' קבצים · ' + fmtKB(totalBytes);

    updateSubmitLabel();
  }

  function renderProgressUI(currentIndex) {
    if (selectedFiles.length === 0) {
      progressPanel.style.display = 'none';
      progressPanel.innerHTML = '';
      return;
    }

    var doneCount = selectedFiles.filter(function (e) { return e.status === 'success' || e.status === 'failed'; }).length;
    var successCount = selectedFiles.filter(function (e) { return e.status === 'success'; }).length;
    var failedCount = selectedFiles.filter(function (e) { return e.status === 'failed'; }).length;
    var totalCount = selectedFiles.length;
    var percent = Math.round((doneCount / totalCount) * 100);

    var rowsHtml = selectedFiles.map(function (entry, idx) {
      var isCurrent = (idx === currentIndex && entry.status === 'uploading');
      var bg = isCurrent ? '#fff8e1' : (entry.status === 'success' ? '#f1f8f4' : entry.status === 'failed' ? '#fef0ef' : '#fff');
      var errorLine = entry.errorMessage
        ? `<div style="color: #b71c1c; font-size: 12px; margin-top: 4px; padding-right: 28px;">${escapeHtml(entry.errorMessage)}</div>`
        : '';
      return `
        <div style="padding: 10px 14px; border-bottom: 1px solid #eee; background: ${bg};">
          <div style="display: grid; grid-template-columns: 24px 1fr auto; gap: 10px; align-items: center;">
            <div style="font-size: 16px; text-align: center;">${statusIcon(entry.status)}</div>
            <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px;" title="${escapeAttr(entry.file.name)}">${escapeHtml(entry.file.name)}</div>
            <div style="color: ${statusColor(entry.status)}; font-size: 12px; font-weight: 500;">${
              entry.status === 'pending'   ? 'ממתין' :
              entry.status === 'uploading' ? 'מעלה...' :
              entry.status === 'success'   ? 'הועלה' :
              entry.status === 'failed'    ? 'נכשל' : ''
            }</div>
          </div>
          ${errorLine}
        </div>
      `;
    }).join('');

    progressPanel.style.display = 'block';
    progressPanel.innerHTML = `
      <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
        <div style="background: #1F3A5F; color: #fff; padding: 12px 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-weight: 500; font-size: 15px;">📤 מעלה ${doneCount} מתוך ${totalCount}</div>
            <div style="font-size: 13px;">
              ${successCount > 0 ? '<span style="color: #a5d6a7;">✓ ' + successCount + '</span>' : ''}
              ${failedCount > 0 ? ' <span style="color: #ef9a9a;">✕ ' + failedCount + '</span>' : ''}
            </div>
          </div>
          <div style="background: rgba(255,255,255,0.2); border-radius: 10px; height: 8px; overflow: hidden;">
            <div style="background: #fff; height: 100%; width: ${percent}%; transition: width 0.3s;"></div>
          </div>
        </div>
        <div>${rowsHtml}</div>
      </div>
    `;
  }

  // ===== Load client list =====
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
      var optionsHtml = '<option value="">-- בחר לקוח (חובה) --</option>';
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

  // ===== Helpers =====
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
    updateSubmitLabel();
  }

  function truncateError(msg) {
    if (!msg) return 'שגיאה לא ידועה';
    var s = String(msg).trim();
    if (s.length > 200) return s.substring(0, 200) + '...';
    return s;
  }

  // ===== Per-file uploader =====
  async function uploadOneFile(entry, userId, accessToken, sharedFields) {
    var file = entry.file;
    var storagePath = null;

    try {
      var timestamp = Date.now();
      var lastDot = file.name.lastIndexOf('.');
      var ext = lastDot >= 0 ? file.name.substring(lastDot).toLowerCase() : '';
      ext = ext.replace(/[^a-z0-9.]/g, '');
      var randomSuffix = Math.random().toString(36).substring(2, 8);
      var safeName = timestamp + '_' + randomSuffix + ext;
      storagePath = 'inbox/' + userId + '/' + safeName;

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
        var uploadErrText = await uploadResp.text();
        return { success: false, error: 'Storage: ' + truncateError(uploadErrText) };
      }

      var docRow = {
        file_name: file.name,
        file_url: storagePath,
        file_size: file.size,
        mime_type: file.type || null,
        doc_tag: entry.tag.trim() || null,
        direction: sharedFields.direction,
        doc_date: sharedFields.docDate,
        description: sharedFields.description,
        client_id: sharedFields.clientId
      };

      var insertUrl = SUPABASE_URL + '/rest/v1/documents';
      var insertResp = await fetch(insertUrl, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(docRow)
      });

      if (!insertResp.ok) {
        var insertErrText = await insertResp.text();
        await deleteOrphanStorageObject(storagePath, accessToken);
        return { success: false, error: 'DB: ' + truncateError(insertErrText) };
      }

      var insertedRows = await insertResp.json();
      var documentId = (insertedRows && insertedRows[0]) ? insertedRows[0].id : null;
      return { success: true, documentId: documentId };

    } catch (err) {
      if (storagePath) {
        await deleteOrphanStorageObject(storagePath, accessToken);
      }
      return { success: false, error: 'רשת: ' + truncateError(err.message || String(err)) };
    }
  }

  async function deleteOrphanStorageObject(storagePath, accessToken) {
    try {
      var deleteUrl = SUPABASE_URL + '/storage/v1/object/gadi-documents/' + encodeURI(storagePath);
      await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + accessToken
        }
      });
    } catch (e) {
      console.warn('[uploadForm] Failed to clean up orphan:', storagePath, e);
    }
  }

  // ===== Form submit =====
  container.querySelector('#upload-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    var submitBtn = container.querySelector('#submit-btn');
    var statusDiv = container.querySelector('#upload-status');
    var docTagInput = container.querySelector('#doc-tag-input');
    var directionInput = container.querySelector('#direction-input');
    var docDateInput = container.querySelector('#doc-date-input');
    var clientInput = container.querySelector('#client-input');
    var descriptionInput = container.querySelector('#description-input');

    if (selectedFiles.length === 0) {
      showStatus(statusDiv, 'יש לבחור קובץ', 'error');
      return;
    }

    if (!clientInput.value) {
      showStatus(statusDiv, 'יש לבחור לקוח לפני העלאת המסמך', 'error');
      clientInput.focus();
      clientInput.style.borderColor = '#c00';
      setTimeout(function () { clientInput.style.borderColor = '#ccc'; }, 3000);
      return;
    }

    var isBulk = selectedFiles.length > 1;

    if (!isBulk) {
      if (!docTagInput.value.trim()) {
        showStatus(statusDiv, 'יש למלא תיוג מסמך (חיוני לחיפוש)', 'error');
        docTagInput.focus();
        docTagInput.style.borderColor = '#c00';
        setTimeout(function () { docTagInput.style.borderColor = '#ccc'; }, 3000);
        return;
      }
      selectedFiles[0].tag = docTagInput.value.trim();
    } else {
      var firstUntagged = selectedFiles.find(function (entry) { return !entry.tag.trim(); });
      if (firstUntagged) {
        showStatus(statusDiv, 'יש למלא תיוג לכל קובץ (חיוני לחיפוש). אפשר להשתמש ב"החל על הכל"', 'error');
        var rowInput = fileTableContainer.querySelector('[data-tag-id="' + firstUntagged.id + '"]');
        if (rowInput) {
          rowInput.focus();
          rowInput.style.borderColor = '#c00';
          setTimeout(function () { rowInput.style.borderColor = '#ccc'; }, 3000);
        }
        return;
      }
    }

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
    submitBtn.style.cursor = 'wait';

    fileTableContainer.style.display = 'none';
    docTagInputBlock.style.display = 'none';
    statusDiv.style.display = 'none';

    var clientId = clientInput.value;
    var direction = directionInput.value;
    var docDate = docDateInput.value || null;
    var description = descriptionInput.value.trim() || null;
    var userId = session.user.id;

    selectedFiles.forEach(function (entry) {
      entry.status = 'pending';
      entry.errorMessage = null;
      entry.documentId = null;
    });

    renderProgressUI(-1);

    var successCount = 0;
    var failureCount = 0;

    for (var i = 0; i < selectedFiles.length; i++) {
      var entry = selectedFiles[i];
      entry.status = 'uploading';
      submitBtn.textContent = 'מעלה ' + (i + 1) + ' מתוך ' + selectedFiles.length + '...';
      renderProgressUI(i);

      var uploadResult = await uploadOneFile(
        entry,
        userId,
        accessToken,
        { clientId: clientId, direction: direction, docDate: docDate, description: description }
      );

      if (uploadResult.success) {
        entry.status = 'success';
        entry.documentId = uploadResult.documentId;
        successCount++;
      } else {
        entry.status = 'failed';
        entry.errorMessage = uploadResult.error;
        failureCount++;
      }

      renderProgressUI(i);
    }

    if (failureCount === 0) {
      submitBtn.textContent = '✓ הסתיים בהצלחה';
      submitBtn.style.background = '#2e7d32';
      setTimeout(function () {
        if (typeof onSuccess === 'function') { onSuccess(); }
      }, 1800);
    } else if (successCount === 0) {
      submitBtn.textContent = 'נסה שוב';
      submitBtn.style.background = '#1F3A5F';
      restoreFormForRetry();
      resetButton(submitBtn);
    } else {
      submitBtn.textContent = 'נסה שוב את ' + failureCount + ' שנכשלו';
      submitBtn.style.background = '#1F3A5F';
      selectedFiles = selectedFiles.filter(function (entry) { return entry.status === 'failed'; });
      selectedFiles.forEach(function (e) {
        e.status = 'pending';
        e.errorMessage = null;
      });
      restoreFormForRetry();
      resetButton(submitBtn);
    }
  });

  function restoreFormForRetry() {
    progressPanel.style.display = 'none';
    progressPanel.innerHTML = '';
    renderFileTable();
  }
}