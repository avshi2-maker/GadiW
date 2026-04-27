// src/screens/fileDetail.js
// File detail screen — shows full metadata + download + inline preview
// for a single document. Hebrew RTL.
// Created: 25/04/2026 (Lesson 8 — Phase A stub)
// Updated: 25/04/2026 (Phase B — real metadata UI with REST fetch)
// Updated: 26/04/2026 (Lesson 9E Phase A — added ערוך button)
// Updated: 26/04/2026 (Bug fix — defensive null-checks + scoped queries to fix
//                       race condition when re-rendered from edit→save→navigate flow)

import { supabase } from '../lib/supabase.js';
import { renderFileEdit } from './fileEdit.js';

var SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
var SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function renderFileDetail(container, session, docId, onBack) {
  // ===== Initial shell with loading state =====
  container.innerHTML = `
    <div data-screen="filedetail" style="max-width: 900px; margin: 40px auto; padding: 24px; font-family: 'Heebo', sans-serif; direction: rtl;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #ddd; padding-bottom: 16px;">
        <h1 style="font-family: 'Frank Ruhl Libre', serif; font-size: 28px; margin: 0;">פרטי מסמך</h1>
        <button id="back-btn"
          style="padding: 8px 16px; background: #888; color: #fff; border: none; border-radius: 4px; font-size: 14px; cursor: pointer;">
          ← חזרה לרשימה
        </button>
      </div>
      <div id="detail-content" style="min-height: 200px;">
        <p style="color: #666; text-align: center; padding: 40px 0;">טוען פרטים...</p>
      </div>
    </div>
  `;

  // Defensive: only wire if element exists
  var backBtn = container.querySelector('#back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      if (typeof onBack === 'function') { onBack(); }
    });
  }

  var detailContent = container.querySelector('#detail-content');
  if (!detailContent) { return; } // Container was replaced; bail out cleanly

  // ===== Fetch the document record + joined client name (one round-trip) =====
  var accessToken = session.access_token;
  var selectFields = 'id,file_name,file_url,file_size,mime_type,doc_tag,direction,doc_date,description,uploaded_at,client_id,clients(full_name)';
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
      detailContent.innerHTML = `
        <div style="padding: 16px; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c00;">
          שגיאה בטעינת פרטי המסמך: ${errText}
        </div>
      `;
      return;
    }

    var rows = await resp.json();
    if (!rows || rows.length === 0) {
      detailContent.innerHTML = `
        <div style="padding: 16px; background: #fff3e0; border: 1px solid #ffcc80; border-radius: 4px; color: #e65100;">
          המסמך לא נמצא או שאין לך הרשאה לצפות בו
        </div>
      `;
      return;
    }
    doc = rows[0];
  } catch (err) {
    detailContent.innerHTML = `
      <div style="padding: 16px; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c00;">
        שגיאה ברשת: ${err.message}
      </div>
    `;
    return;
  }

  // ===== Format helpers =====
  function fmtSize(bytes) {
    if (!bytes && bytes !== 0) return '—';
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
  function fmtDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('he-IL');
  }
  function fmtDateTime(dateStr) {
    if (!dateStr) return '—';
    var d = new Date(dateStr);
    return d.toLocaleDateString('he-IL') + ' ' + d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
  }
  function escapeHtml(s) {
    if (s === null || s === undefined) return '—';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  var clientName = (doc.clients && doc.clients.full_name) ? doc.clients.full_name : '—';

  // ===== Render the detail card =====
  detailContent.innerHTML = `
    <!-- File name header -->
    <div style="background: #1F3A5F; color: #fff; padding: 20px 24px; border-radius: 6px 6px 0 0; display: flex; justify-content: space-between; align-items: center; gap: 16px;">
      <div style="min-width: 0; flex: 1;">
        <div style="font-size: 22px; font-weight: 500; word-break: break-word;">${escapeHtml(doc.file_name)}</div>
        <div style="color: #c5d2e3; font-size: 13px; margin-top: 4px;">${escapeHtml(doc.mime_type || 'unknown type')} · ${fmtSize(doc.file_size)}</div>
      </div>
    </div>

    <!-- Action buttons -->
    <div style="background: #f7f8fa; padding: 16px 24px; border-bottom: 1px solid #e5e7eb; display: flex; gap: 8px; flex-wrap: wrap;">
      <button id="download-btn"
        style="padding: 10px 20px; background: #1F3A5F; color: #fff; border: none; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer;">
        ⬇ הורדה
      </button>
      <button id="edit-btn"
        style="padding: 10px 20px; background: #fff; color: #1F3A5F; border: 1px solid #1F3A5F; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer;">
        ✏️ ערוך
      </button>
      <button id="preview-btn"
        style="padding: 10px 20px; background: #fff; color: #1F3A5F; border: 1px solid #1F3A5F; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer;">
        👁 תצוגה מקדימה
      </button>
    </div>

    <!-- Metadata grid -->
    <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 6px 6px; padding: 24px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px 32px;">

        <div>
          <div style="color: #888; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">תיוג</div>
          <div style="font-size: 15px; color: #222;">${escapeHtml(doc.doc_tag)}</div>
        </div>

        <div>
          <div style="color: #888; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">כיוון</div>
          <div style="font-size: 15px; color: #222;">${escapeHtml(doc.direction)}</div>
        </div>

        <div>
          <div style="color: #888; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">תאריך המסמך</div>
          <div style="font-size: 15px; color: #222;">${fmtDate(doc.doc_date)}</div>
        </div>

        <div>
          <div style="color: #888; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">לקוח</div>
          <div style="font-size: 15px; color: #222;">${escapeHtml(clientName)}</div>
        </div>

        <div style="grid-column: 1 / -1;">
          <div style="color: #888; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">תיאור</div>
          <div style="font-size: 15px; color: #222; white-space: pre-wrap;">${escapeHtml(doc.description)}</div>
        </div>

      </div>

      <!-- Footer metadata strip -->
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #e5e7eb; color: #888; font-size: 12px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <span>הועלה: ${fmtDateTime(doc.uploaded_at)}</span>
        <span style="font-family: monospace; direction: ltr;">${escapeHtml(doc.id)}</span>
      </div>
    </div>

    <!-- Preview area -->
    <div id="preview-area" style="margin-top: 24px;"></div>
  `;

  // ===== DEFENSIVE: scope queries to detailContent (which holds the buttons)
  // and null-check before wiring. Prevents race-condition crashes when this
  // function is re-invoked during edit→save→navigate flow. =====

  var downloadBtn = detailContent.querySelector('#download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', async function () {
      var btn = this;
      var originalText = btn.textContent;
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btn.style.cursor = 'wait';
      btn.textContent = 'מכין הורדה...';

      try {
        // Step 1: Get a signed URL from Supabase Storage (valid 1 hour)
        var signUrl = SUPABASE_URL + '/storage/v1/object/sign/gadi-documents/' + encodeURI(doc.file_url);
        var signResp = await fetch(signUrl, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ expiresIn: 3600 })
        });

        if (!signResp.ok) {
          var errText = await signResp.text();
          alert('שגיאה בהכנת הורדה: ' + errText);
          return;
        }

        var signData = await signResp.json();
        var signedDownloadUrl = SUPABASE_URL + '/storage/v1' + signData.signedURL;

        // Step 2: Show progress for large files
        btn.textContent = 'מוריד...';

        // Step 3: Fetch the actual file bytes
        var fileResp = await fetch(signedDownloadUrl);
        if (!fileResp.ok) {
          alert('שגיאה בהורדה: HTTP ' + fileResp.status);
          return;
        }

        // Step 4: Convert response to a Blob (binary in-memory)
        var blob = await fileResp.blob();

        // Step 5: Create a local blob URL — same-origin so 'download' attribute works
        var blobUrl = URL.createObjectURL(blob);

        // Step 6: Trigger download with the original Hebrew filename
        var link = document.createElement('a');
        link.href = blobUrl;
        link.download = doc.file_name;  // Hebrew filename now preserved
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Step 7: Free the blob URL after the download starts
        setTimeout(function () { URL.revokeObjectURL(blobUrl); }, 1000);

      } catch (err) {
        alert('שגיאה ברשת: ' + err.message);
      } finally {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.textContent = originalText;
      }
    });
  }

  var editBtn = detailContent.querySelector('#edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', function () {
      renderFileEdit(
        container,
        session,
        docId,
        function onCancel() {
          renderFileDetail(container, session, docId, onBack);
        },
        function onSaved() {
          renderFileDetail(container, session, docId, onBack);
        }
      );
    });
  }

  var previewBtn = detailContent.querySelector('#preview-btn');
  if (previewBtn) {
    previewBtn.addEventListener('click', async function () {
      var btn = this;
      var previewArea = container.querySelector('#preview-area');
      if (!previewArea) { return; }

      // TOGGLE: if preview is already showing, hide it
      if (previewArea.dataset.showing === 'true') {
        previewArea.innerHTML = '';
        previewArea.dataset.showing = 'false';
        btn.textContent = '👁 תצוגה מקדימה';
        return;
      }

      var originalText = btn.textContent;
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btn.style.cursor = 'wait';
      btn.textContent = 'טוען תצוגה...';

      try {
        // Step 1: Detect what kind of file we have
        var mime = (doc.mime_type || '').toLowerCase();
        var fileNameLower = (doc.file_name || '').toLowerCase();
        var isPdf   = mime.indexOf('pdf') >= 0 || fileNameLower.endsWith('.pdf');
        var isImage = mime.indexOf('image/') === 0
                   || /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileNameLower);

        // Step 2: If we can't preview, show friendly message and stop
        if (!isPdf && !isImage) {
          previewArea.innerHTML = `
            <div style="background: #fff3e0; border: 1px solid #ffcc80; border-radius: 6px; padding: 24px; text-align: center; color: #e65100;">
              <div style="font-size: 48px; margin-bottom: 8px;">📄</div>
              <div style="font-size: 16px; font-weight: 500; margin-bottom: 4px;">תצוגה מקדימה לא זמינה לסוג קובץ זה</div>
              <div style="font-size: 13px; color: #888;">סוג: ${mime || 'לא ידוע'} — אנא השתמש בכפתור הורדה</div>
            </div>
          `;
          previewArea.dataset.showing = 'true';
          btn.textContent = '✕ סגור תצוגה';
          return;
        }

        // Step 3: Get a signed URL (same as download)
        var signUrl = SUPABASE_URL + '/storage/v1/object/sign/gadi-documents/' + encodeURI(doc.file_url);
        var signResp = await fetch(signUrl, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ expiresIn: 3600 })
        });

        if (!signResp.ok) {
          var errText = await signResp.text();
          previewArea.innerHTML = `
            <div style="background: #fee; border: 1px solid #fcc; border-radius: 6px; padding: 16px; color: #c00;">
              שגיאה בהכנת תצוגה: ${errText}
            </div>
          `;
          previewArea.dataset.showing = 'true';
          btn.textContent = '✕ סגור תצוגה';
          return;
        }

        var signData = await signResp.json();
        var signedFileUrl = SUPABASE_URL + '/storage/v1' + signData.signedURL;

        // Step 4: Render the appropriate preview
        if (isPdf) {
          previewArea.innerHTML = `
            <div style="background: #f7f8fa; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px;">
              <div style="color: #888; font-size: 12px; margin-bottom: 8px; text-align: center;">תצוגה מקדימה — קובץ PDF</div>
              <iframe src="${signedFileUrl}"
                style="width: 100%; height: 700px; border: 1px solid #ccc; border-radius: 4px; background: #fff;"
                title="PDF Preview">
              </iframe>
            </div>
          `;
        } else if (isImage) {
          previewArea.innerHTML = `
            <div style="background: #f7f8fa; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; text-align: center;">
              <div style="color: #888; font-size: 12px; margin-bottom: 12px;">תצוגה מקדימה — תמונה</div>
              <img src="${signedFileUrl}" alt="${doc.file_name}"
                style="max-width: 100%; max-height: 700px; border: 1px solid #ccc; border-radius: 4px; background: #fff;" />
            </div>
          `;
        }

        previewArea.dataset.showing = 'true';
        btn.textContent = '✕ סגור תצוגה';

        // Smooth scroll to the preview
        previewArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

      } catch (err) {
        previewArea.innerHTML = `
          <div style="background: #fee; border: 1px solid #fcc; border-radius: 6px; padding: 16px; color: #c00;">
            שגיאה ברשת: ${err.message}
          </div>
        `;
        previewArea.dataset.showing = 'true';
        btn.textContent = '✕ סגור תצוגה';
      } finally {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
      }
    });
  }
}