// src/screens/fileList.js
// File list screen — fetches documents owned by the current user from Supabase
// and renders them as a simple list. Hebrew RTL.
// Created: 23/04/2026 (Lesson 6)

import { supabase } from '../lib/supabase.js';

export async function renderFileList(container, session) {
  container.innerHTML = `
    <div style="max-width: 800px; margin: 40px auto; padding: 24px; font-family: 'Heebo', sans-serif; direction: rtl;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #ddd; padding-bottom: 16px;">
        <div>
          <h1 style="font-family: 'Frank Ruhl Libre', serif; font-size: 28px; margin: 0;">המסמכים שלי</h1>
          <p style="color: #666; margin: 4px 0 0; font-size: 14px;">${session.user.email}</p>
        </div>
        <button id="logout-btn"
          style="padding: 8px 16px; background: #c00; color: #fff; border: none; border-radius: 4px; font-size: 14px; cursor: pointer;">
          יציאה
        </button>
      </div>

      <div id="file-list-content" style="min-height: 100px;">
        <p style="color: #666; text-align: center;">טוען מסמכים...</p>
      </div>
    </div>
  `;

  container.querySelector('#logout-btn').addEventListener('click', async function () {
    await supabase.auth.signOut();
  });

  var content = container.querySelector('#file-list-content');

  var result = await supabase
    .from('documents')
    .select('id, file_name, file_size, mime_type, doc_tag, direction, doc_date, uploaded_at')
    .order('uploaded_at', { ascending: false });

  if (result.error) {
    content.innerHTML = `
      <div style="padding: 16px; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c00;">
        שגיאה בטעינת המסמכים: ${result.error.message}
      </div>
    `;
    return;
  }

  var docs = result.data || [];

  if (docs.length === 0) {
    content.innerHTML = `
      <div style="padding: 32px; text-align: center; color: #666; background: #f9f9f9; border-radius: 4px;">
        <p>אין מסמכים להצגה</p>
        <p style="font-size: 14px; margin-top: 8px;">העלאת מסמכים תתווסף בשיעור הבא</p>
      </div>
    `;
    return;
  }

  var rows = docs.map(function (doc) {
    var sizeKB = doc.file_size ? Math.round(doc.file_size / 1024) + ' KB' : '—';
    var date = doc.doc_date ? new Date(doc.doc_date).toLocaleDateString('he-IL') : '—';
    return `
      <div style="padding: 14px 16px; border: 1px solid #eee; border-radius: 4px; margin-bottom: 8px; background: #fff; display: grid; grid-template-columns: 1fr auto auto auto; gap: 16px; align-items: center;">
        <div>
          <div style="font-weight: 500; font-size: 16px;">${doc.file_name}</div>
          <div style="color: #888; font-size: 13px; margin-top: 2px;">${doc.doc_tag || '—'} · ${doc.direction}</div>
        </div>
        <div style="color: #666; font-size: 13px;">${sizeKB}</div>
        <div style="color: #666; font-size: 13px;">${date}</div>
      </div>
    `;
  }).join('');

  content.innerHTML = `
    <div style="color: #666; font-size: 14px; margin-bottom: 12px;">${docs.length} מסמכים</div>
    ${rows}
  `;
}