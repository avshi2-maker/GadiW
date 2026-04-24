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
  container.querySelector('#upload-form').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('לוגיקת העלאה תתווסף ב-Phase D');
  });
}