// src/screens/fileList.js
// File list screen — fetches documents owned by the current user from Supabase
// and renders them as a filterable list. Hebrew RTL.
// Created: 23/04/2026 (Lesson 6)
// Updated: 24/04/2026 — bypass SDK for query (SDK wedge workaround)
// Updated: 24/04/2026 — Phase B Lesson 7: upload button
// Updated: 25/04/2026 — Lesson 8 Phase A: clickable rows for detail navigation
// Updated: 26/04/2026 — Lesson 9A Phase B: search + filter UI

import { supabase } from '../lib/supabase.js';
import { renderUploadForm } from './uploadForm.js';
import { renderFileDetail } from './fileDetail.js';

var SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
var SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function renderFileList(container, session) {
  // ===== Initial shell =====
  container.innerHTML = `
    <div style="max-width: 900px; margin: 40px auto; padding: 24px; font-family: 'Heebo', sans-serif; direction: rtl;">

      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #ddd; padding-bottom: 16px;">
        <div>
          <h1 style="font-family: 'Frank Ruhl Libre', serif; font-size: 28px; margin: 0;">המסמכים שלי</h1>
          <p style="color: #666; margin: 4px 0 0; font-size: 14px;">${session.user ? session.user.email : ''}</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="upload-btn"
            style="padding: 8px 16px; background: #1F3A5F; color: #fff; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; font-weight: 500;">
            ➕ העלאת מסמך
          </button>
          <button id="logout-btn"
            style="padding: 8px 16px; background: #c00; color: #fff; border: none; border-radius: 4px; font-size: 14px; cursor: pointer;">
            יציאה
          </button>
        </div>
      </div>

      <!-- Filter panel -->
      <div id="filter-panel" style="background: #f7f8fa; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin-bottom: 16px; display: none;">
        <div style="margin-bottom: 12px;">
          <input type="text" id="search-input" placeholder="🔎 חיפוש בשם קובץ או תיוג..."
            style="width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; font-size: 15px; direction: rtl; background: #fff;" />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 12px; align-items: end;">
          <div>
            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px; font-weight: 500;">תיוג</label>
            <select id="filter-tag"
              style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; direction: rtl; background: #fff;">
              <option value="">הכל</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px; font-weight: 500;">כיוון</label>
            <select id="filter-direction"
              style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; direction: rtl; background: #fff;">
              <option value="">הכל</option>
              <option value="פנימי">פנימי</option>
              <option value="התקבל">התקבל</option>
              <option value="נשלח">נשלח</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px; font-weight: 500;">לקוח</label>
            <select id="filter-client"
              style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; direction: rtl; background: #fff;">
              <option value="">הכל</option>
            </select>
          </div>
          <div>
            <button id="clear-filters-btn"
              style="padding: 8px 14px; background: #fff; color: #c00; border: 1px solid #c00; border-radius: 4px; font-family: inherit; font-size: 13px; cursor: pointer; visibility: hidden; white-space: nowrap;">
              ✕ נקה סינון
            </button>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div id="file-list-content" style="min-height: 100px;">
        <p style="color: #666; text-align: center;">טוען מסמכים...</p>
      </div>
    </div>
  `;

  // ===== Wire header buttons =====
  container.querySelector('#logout-btn').addEventListener('click', async function () {
    try { await supabase.auth.signOut(); } catch (e) {}
    try { localStorage.removeItem('sb-pslwvkymccbngtyvgagj-auth-token'); } catch (e) {}
    window.location.reload();
  });

  container.querySelector('#upload-btn').addEventListener('click', function () {
    renderUploadForm(
      container,
      session,
      function onCancel() { renderFileList(container, session); },
      function onSuccess() { renderFileList(container, session); }
    );
  });

  // ===== Fetch documents (with client name JOIN) — REST, not SDK =====
  var content = container.querySelector('#file-list-content');
  var filterPanel = container.querySelector('#filter-panel');
  var accessToken = session.access_token;

  if (!accessToken) {
    content.innerHTML = `<div style="padding: 16px; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c00;">שגיאה: אין טוקן גישה</div>`;
    return;
  }

  var selectFields = 'id,file_name,file_size,mime_type,doc_tag,direction,doc_date,uploaded_at,client_id,clients(full_name)';
  var url = SUPABASE_URL + '/rest/v1/documents?select=' + encodeURIComponent(selectFields) + '&order=uploaded_at.desc';

  var allDocs = [];
  try {
    var response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      var errText = await response.text();
      content.innerHTML = `<div style="padding: 16px; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c00;">שגיאה בטעינת המסמכים: ${errText}</div>`;
      return;
    }

    allDocs = await response.json();
  } catch (err) {
    content.innerHTML = `<div style="padding: 16px; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c00;">שגיאה ברשת: ${err.message}</div>`;
    return;
  }

  // ===== Empty database state =====
  if (allDocs.length === 0) {
    content.innerHTML = `
      <div style="padding: 32px; text-align: center; color: #666; background: #f9f9f9; border-radius: 4px;">
        <p>אין מסמכים להצגה</p>
        <p style="font-size: 14px; margin-top: 8px;">העלה את המסמך הראשון שלך</p>
      </div>
    `;
    return;
  }

  // ===== Populate filter dropdowns from actual data =====
  filterPanel.style.display = 'block';

  // Unique tags
  var uniqueTags = {};
  allDocs.forEach(function (d) {
    if (d.doc_tag && d.doc_tag.trim()) { uniqueTags[d.doc_tag] = true; }
  });
  var tagSelect = container.querySelector('#filter-tag');
  Object.keys(uniqueTags).sort().forEach(function (tag) {
    var opt = document.createElement('option');
    opt.value = tag;
    opt.textContent = tag;
    tagSelect.appendChild(opt);
  });

  // Unique clients (from the JOIN)
  var uniqueClients = {};
  allDocs.forEach(function (d) {
    if (d.client_id && d.clients && d.clients.full_name) {
      uniqueClients[d.client_id] = d.clients.full_name.trim();
    }
  });
  var clientSelect = container.querySelector('#filter-client');
  Object.keys(uniqueClients)
    .map(function (id) { return { id: id, name: uniqueClients[id] }; })
    .sort(function (a, b) { return a.name.localeCompare(b.name, 'he'); })
    .forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      clientSelect.appendChild(opt);
    });

  // ===== Filter state =====
  var filters = { search: '', tag: '', direction: '', client: '' };

  function applyFilters() {
    var searchLower = filters.search.toLowerCase();
    var filtered = allDocs.filter(function (d) {
      if (filters.search) {
        var nameMatch = (d.file_name || '').toLowerCase().indexOf(searchLower) >= 0;
        var tagMatch  = (d.doc_tag  || '').toLowerCase().indexOf(searchLower) >= 0;
        if (!nameMatch && !tagMatch) return false;
      }
      if (filters.tag && d.doc_tag !== filters.tag) return false;
      if (filters.direction && d.direction !== filters.direction) return false;
      if (filters.client && d.client_id !== filters.client) return false;
      return true;
    });

    renderRows(filtered);
    updateClearButton();
  }

  function updateClearButton() {
    var anyActive = filters.search || filters.tag || filters.direction || filters.client;
    container.querySelector('#clear-filters-btn').style.visibility = anyActive ? 'visible' : 'hidden';
  }

  function renderRows(docs) {
    if (docs.length === 0) {
      content.innerHTML = `
        <div style="padding: 32px; text-align: center; color: #666; background: #f9f9f9; border-radius: 6px;">
          <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
          <p style="margin: 0; font-weight: 500;">אין מסמכים התואמים לסינון</p>
          <p style="font-size: 13px; margin-top: 6px; color: #888;">נסה לשנות את המסננים או נקה את הסינון</p>
        </div>
      `;
      return;
    }

    var rows = docs.map(function (doc) {
      var sizeKB = doc.file_size ? Math.round(doc.file_size / 1024) + ' KB' : '—';
      var date = doc.doc_date ? new Date(doc.doc_date).toLocaleDateString('he-IL') : '—';
      return `
        <div class="doc-row" data-doc-id="${doc.id}"
          style="padding: 14px 16px; border: 1px solid #eee; border-radius: 4px; margin-bottom: 8px; background: #fff; display: grid; grid-template-columns: 1fr auto auto auto; gap: 16px; align-items: center; cursor: pointer; transition: background 0.15s, border-color 0.15s;"
          onmouseover="this.style.background='#f9fafe'; this.style.borderColor='#1F3A5F';"
          onmouseout="this.style.background='#fff'; this.style.borderColor='#eee';">
          <div>
            <div style="font-weight: 500; font-size: 16px;">${escapeHtml(doc.file_name)}</div>
            <div style="color: #888; font-size: 13px; margin-top: 2px;">${escapeHtml(doc.doc_tag || '—')} · ${escapeHtml(doc.direction)}</div>
          </div>
          <div style="color: #666; font-size: 13px;">${sizeKB}</div>
          <div style="color: #666; font-size: 13px;">${date}</div>
        </div>
      `;
    }).join('');

    content.innerHTML = `
      <div style="color: #666; font-size: 14px; margin-bottom: 12px;">
        מציג ${docs.length} מתוך ${allDocs.length} מסמכים
      </div>
      ${rows}
    `;

    // Wire row clicks
    content.querySelectorAll('.doc-row').forEach(function (rowEl) {
      rowEl.addEventListener('click', function () {
        var docId = rowEl.getAttribute('data-doc-id');
        renderFileDetail(
          container,
          session,
          docId,
          function onBack() { renderFileList(container, session); }
        );
      });
    });
  }

  // ===== Wire filter inputs =====
  container.querySelector('#search-input').addEventListener('input', function (e) {
    filters.search = e.target.value;
    applyFilters();
  });
  container.querySelector('#filter-tag').addEventListener('change', function (e) {
    filters.tag = e.target.value;
    applyFilters();
  });
  container.querySelector('#filter-direction').addEventListener('change', function (e) {
    filters.direction = e.target.value;
    applyFilters();
  });
  container.querySelector('#filter-client').addEventListener('change', function (e) {
    filters.client = e.target.value;
    applyFilters();
  });
  container.querySelector('#clear-filters-btn').addEventListener('click', function () {
    filters = { search: '', tag: '', direction: '', client: '' };
    container.querySelector('#search-input').value = '';
    container.querySelector('#filter-tag').value = '';
    container.querySelector('#filter-direction').value = '';
    container.querySelector('#filter-client').value = '';
    applyFilters();
  });

  // ===== Initial render =====
  applyFilters();
}

// ===== Helper =====
function escapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}