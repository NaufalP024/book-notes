        const DUMMY_DATA = [
            { id: 'n1', title: 'Belajar CSS Grid', body: 'Pelajari properti grid-template-columns dan grid-auto-rows.', createdAt: '2025-09-01', pinned: true, color: 'var(--bar)' },
            { id: 'n2', title: 'Tugas Web', body: 'Buat minimal 3 custom elements untuk proyek notes app.', createdAt: '2025-09-05', pinned: false, color: 'var(--bar)' },
            { id: 'n3', title: 'Rapat Tim', body: 'Rapat evaluasi proyek pada hari Jumat pukul 16:00.', createdAt: '2025-09-07', pinned: false, color: 'var(--bar)' },
            { id: 'n4', title: 'Desain UI', body: 'Gunakan palette warna yang kontras dan keterbacaan tinggi.', createdAt: '2025-09-10', pinned: false, color: 'var(--bar)' }
        ];

        const $ = (s, el = document) => el.querySelector(s);
        const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

        class NoteItem extends HTMLElement {
            static get observedAttributes() {
                return ['title', 'body', 'date', 'pinned', 'color', 'data-id'];
            }

            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }

            connectedCallback() {
                this.render();
            }

            attributeChangedCallback(name, oldVal, newVal) {
                if (oldVal === newVal) return;
                this.render();
            }

            render() {
                const title = this.getAttribute('title') || '';
                const body = this.getAttribute('body') || '';
                const date = this.getAttribute('date') || '';
                const pinned = this.getAttribute('pinned') === 'true';
                const color = this.getAttribute('color') || 'var(--bar)';
                const dataId = this.getAttribute('data-id') || this.dataset.id || '';
                this.shadowRoot.innerHTML = `
      <style>
        :host { all: initial; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; display:block; color:inherit; }
        .card {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
          padding: 12px;
          border-radius: 10px;
          color: inherit;
          min-height: 120px;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          box-sizing: border-box;
        }
        .colorbar { height:6px; border-radius:6px; background: ${color}; margin-bottom:8px; }
        .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; gap:8px; }
        .title { font-weight:600; }
        .body { flex:1; color: var(--muted, #9fb0c8); white-space:pre-wrap; overflow:hidden; }
        .meta { display:flex; justify-content:space-between; align-items:center; font-size:12px; color: var(--muted, #9fb0c8); margin-top:8px; }
        .actions { display:flex; gap:8px; align-items:center; }
        .btn { background:transparent; border:none; color:inherit; cursor:pointer; padding:6px; border-radius:8px; }
        .pin { background: ${pinned ? 'var(--accent)' : 'transparent'}; color: ${pinned ? 'white' : 'var(--muted)'}; border:1px solid rgba(255,255,255,0.04); padding:6px 8px; border-radius:8px; cursor:pointer; }
        .delete { background: transparent; border: none; cursor:pointer; padding:6px; }
      </style>
      <div class="card" role="article" aria-label="catatan ${escapeHtml(title)}">
        <div>
          <div class="colorbar" aria-hidden="true"></div>
          <div class="header">
            <div class="title">${escapeHtml(title)}</div>
            <div class="actions">
              <button class="btn pin" part="pin">${pinned ? '📌' : '📍'}</button>
              <button class="btn delete" part="delete">🗑️</button>
            </div>
          </div>
          <div class="body">${escapeHtml(truncate(body, 1000))}</div>
        </div>

        <div class="meta">
          <span>${escapeHtml(date)}</span>
          <span class="small">${pinned ? 'Pinned' : ''}</span>
        </div>
      </div>
    `;

                const pinBtn = this.shadowRoot.querySelector('.pin');
                const delBtn = this.shadowRoot.querySelector('.delete');

                if (pinBtn) {
                    pinBtn.addEventListener('click', (ev) => {
                        ev.stopPropagation();

                        this.dispatchEvent(new CustomEvent('toggle-pin', {
                            detail: { id: dataId },
                            bubbles: true,
                            composed: true
                        }));
                    });
                }

                if (delBtn) {
                    delBtn.addEventListener('click', (ev) => {
                        ev.stopPropagation();
                        this.dispatchEvent(new CustomEvent('delete-note', {
                            detail: { id: dataId },
                            bubbles: true,
                            composed: true
                        }));
                    });
                }
            }
        }
        customElements.define('note-item', NoteItem);

        class NoteList extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.notes = [];
            }
            connectedCallback() {
                this.render();
            }
            set data(v) {
                this.notes = Array.isArray(v) ? v : [];
                this.render();
            }
            render() {
                const notes = this.notes || [];
                this.shadowRoot.innerHTML = `
      <style>
        .wrap{min-height:120px}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
      </style>
      <div class="wrap">
        ${notes.length ? `<div class="grid">${notes.map(n => `
          <note-item
            data-id="${n.id}"
            title="${escapeHtmlAttr(n.title)}"
            body="${escapeHtmlAttr(n.body)}"
            date="${n.createdAt}"
            pinned="${n.pinned}"
            color="${n.color || 'var(--bar)'}">
          </note-item>
        `).join('')}</div>` : `<div class="empty">Belum ada catatan. Tambahkan catatan melalui form.</div>`}
      </div>
    `;
            }
        }
        customElements.define('note-list', NoteList);

        class NoteForm extends HTMLElement {
            constructor() { super(); this.attachShadow({ mode: 'open' }); }
            connectedCallback() { this.render(); }
            render() {
                this.shadowRoot.innerHTML = `
      <style>
        form{display:flex;flex-direction:column;gap:8px}
        input, textarea{width:100%;padding-top:10px;padding-bottom:10px;padding-left:5px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit}
        .row{display:flex;gap:8px}
        .hint{font-size:12px;color:var(--muted)}
        .counter{font-size:12px;color:var(--muted);text-align:right}
        .error{color:#ff6b6b;font-size:13px}
        .btn{padding:8px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:inherit;cursor:pointer}
        .primary{background:var(--accent);border:none;color:#fff}
      </style>
      <form>
        <label>
          <div class="hint">Judul</div>
          <input name="title" maxlength="100" placeholder="Masukkan judul..." />
        </label>
        <label>
          <div class="hint">Isi</div>
          <textarea name="body" rows="6" placeholder="Tulis catatan..." ></textarea>
        </label>
        <div class="row" style="justify-content:space-between;align-items:center">
          <div class="counter" id="counter">0</div>
          <div style="display:flex;gap:8px">
            <button type="button" class="btn" style="background-color:red;" id="clear">Bersihkan</button>
            <button type="submit" class="btn primary" id="submit">Simpan</button>
          </div>
        </div>
        <div class="error" id="err" aria-live="polite"></div>
      </form>
    `;

                const form = this.shadowRoot.querySelector('form');
                const title = this.shadowRoot.querySelector('input[name="title"]');
                const body = this.shadowRoot.querySelector('textarea[name="body"]');
                const counter = this.shadowRoot.getElementById('counter');
                const err = this.shadowRoot.getElementById('err');
                const clear = this.shadowRoot.getElementById('clear');

                const validate = () => {
                    const t = title.value.trim();
                    const b = body.value.trim();
                    err.textContent = '';
                    if (!t) err.textContent = 'Judul wajib diisi.';
                    else if (!b) err.textContent = 'Isi catatan wajib diisi.';
                    return !err.textContent;
                };

                title.addEventListener('input', () => { counter.textContent = title.value.length; validate(); });
                body.addEventListener('input', () => { validate(); });

                clear.addEventListener('click', () => { title.value = ''; body.value = ''; counter.textContent = '0'; err.textContent = ''; });

                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    if (!validate()) return;
                    const payload = {
                        id: 'n' + Date.now(),
                        title: title.value.trim(),
                        body: body.value.trim(),
                        createdAt: new Date().toLocaleDateString('id-ID'),
                        pinned: false,
                        color: 'var(--bar)' 
                    };
                    this.dispatchEvent(new CustomEvent('create-note', { bubbles: true, composed: true, detail: payload }));
                    title.value = ''; body.value = ''; counter.textContent = '0';
                });
            }
        }
        customElements.define('note-form', NoteForm);

        (function () {
            const appState = { notes: [...DUMMY_DATA] };

            const noteListEl = document.querySelector('note-list');
            const noteFormEl = document.querySelector('note-form');

            function render() {
                const sorted = [...appState.notes].sort((a, b) => (b.pinned - a.pinned) || (new Date(b.createdAt) - new Date(a.createdAt)));
                noteListEl.data = sorted;
                $('#totalNotes').textContent = appState.notes.length;
                $('#pinnedCount').textContent = appState.notes.filter(n => n.pinned).length;
            }

            noteFormEl.addEventListener('create-note', e => {
                const payload = e.detail;
                if (!payload.color) payload.color = 'var(--bar)';
                appState.notes.unshift(payload);
                render();
            });

            noteListEl.addEventListener('toggle-pin', e => {
                const raw = e.detail;
                const id = raw && (raw.id || raw) || null;
                if (!id) return;
                const idx = appState.notes.findIndex(n => n.id === id);
                if (idx > -1) {
                    appState.notes[idx].pinned = !appState.notes[idx].pinned;
                    render();
                }
            });

            noteListEl.addEventListener('delete-note', e => {
                const raw = e.detail;
                const id = raw && (raw.id || raw) || null;
                if (!id) return;
                appState.notes = appState.notes.filter(n => n.id !== id);
                render();
            });

            render();

            window.__NOTES_APP__ = { state: appState, render };
        })();

        // Helper functions
        function truncate(s, n) { s = s || ''; return s.length > n ? s.slice(0, n - 1) + '…' : s; }
        function escapeHtml(str) { return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
        function escapeHtmlAttr(str) { return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }