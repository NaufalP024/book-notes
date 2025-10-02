        const DUMMY_DATA = [
            {
    id: "notes-jT-jjsyz61J8XKiI",
    title: "Welcome to Notes, Dimas!",
    body: "Welcome to Notes! This is your first note. You can archive it, delete it, or create new ones.",
    createdAt: "2022-07-28T10:03:12.594Z",
    archived: false,
  },
  {
    id: "notes-aB-cdefg12345",
    title: "Meeting Agenda",
    body: "Discuss project updates and assign tasks for the upcoming week.",
    createdAt: "2022-08-05T15:30:00.000Z",
    archived: false,
  },
  {
    id: "notes-XyZ-789012345",
    title: "Shopping List",
    body: "Milk, eggs, bread, fruits, and vegetables.",
    createdAt: "2022-08-10T08:45:23.120Z",
    archived: false,
  },
  {
    id: "notes-1a-2b3c4d5e6f",
    title: "Personal Goals",
    body: "Read two books per month, exercise three times a week, learn a new language.",
    createdAt: "2022-08-15T18:12:55.789Z",
    archived: false,
  },
  {
    id: "notes-LMN-456789",
    title: "Recipe: Spaghetti Bolognese",
    body: "Ingredients: ground beef, tomatoes, onions, garlic, pasta. Steps:...",
    createdAt: "2022-08-20T12:30:40.200Z",
    archived: false,
  },
  {
    id: "notes-QwErTyUiOp",
    title: "Workout Routine",
    body: "Monday: Cardio, Tuesday: Upper body, Wednesday: Rest, Thursday: Lower body, Friday: Cardio.",
    createdAt: "2022-08-25T09:15:17.890Z",
    archived: false,
  },
  {
    id: "notes-abcdef-987654",
    title: "Book Recommendations",
    body: "1. 'The Alchemist' by Paulo Coelho\n2. '1984' by George Orwell\n3. 'To Kill a Mockingbird' by Harper Lee",
    createdAt: "2022-09-01T14:20:05.321Z",
    archived: false,
  },
  {
    id: "notes-zyxwv-54321",
    title: "Daily Reflections",
    body: "Write down three positive things that happened today and one thing to improve tomorrow.",
    createdAt: "2022-09-07T20:40:30.150Z",
    archived: false,
  },
  {
    id: "notes-poiuyt-987654",
    title: "Travel Bucket List",
    body: "1. Paris, France\n2. Kyoto, Japan\n3. Santorini, Greece\n4. New York City, USA",
    createdAt: "2022-09-15T11:55:44.678Z",
    archived: false,
  },
  {
    id: "notes-asdfgh-123456",
    title: "Coding Projects",
    body: "1. Build a personal website\n2. Create a mobile app\n3. Contribute to an open-source project",
    createdAt: "2022-09-20T17:10:12.987Z",
    archived: false,
  },
  {
    id: "notes-5678-abcd-efgh",
    title: "Project Deadline",
    body: "Complete project tasks by the deadline on October 1st.",
    createdAt: "2022-09-28T14:00:00.000Z",
    archived: false,
  },
  {
    id: "notes-9876-wxyz-1234",
    title: "Health Checkup",
    body: "Schedule a routine health checkup with the doctor.",
    createdAt: "2022-10-05T09:30:45.600Z",
    archived: false,
  },
  {
    id: "notes-qwerty-8765-4321",
    title: "Financial Goals",
    body: "1. Create a monthly budget\n2. Save 20% of income\n3. Invest in a retirement fund.",
    createdAt: "2022-10-12T12:15:30.890Z",
    archived: false,
  },
  {
    id: "notes-98765-54321-12345",
    title: "Holiday Plans",
    body: "Research and plan for the upcoming holiday destination.",
    createdAt: "2022-10-20T16:45:00.000Z",
    archived: false,
  },
  {
    id: "notes-1234-abcd-5678",
    title: "Language Learning",
    body: "Practice Spanish vocabulary for 30 minutes every day.",
    createdAt: "2022-10-28T08:00:20.120Z",
    archived: false,
  },
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
