import sqlite3
import json

DB = r"C:\Users\sidda\.local\share\mimocode\mimocode.db"
conn = sqlite3.connect(DB)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

RECENT_SESSIONS = [
    "ses_099ac7215ffeqM4QqWxIV9MHc3",
    "ses_09f4a0c98ffeGe7tQXFbh8llDa",
    "ses_09f7b9b44fferJHsPM1UIEQocl",
    "ses_09f81606cffebbxDe7dkuc2LyY",
    "ses_09f9fe3cfffeHGiZVNArKIEIWS",
]

# Get ALL user text messages (excluding system-reminder)
print("=== ALL USER TEXT MESSAGES (non-system) ===")
for sid in RECENT_SESSIONS:
    cur.execute("SELECT title FROM session WHERE id=?", (sid,))
    title = cur.fetchone()['title']
    print(f"\n--- {sid}: {title} ---")
    
    cur.execute("""
        SELECT json_extract(p.data, '$.text') as text, p.time_created
        FROM message m
        JOIN part p ON p.message_id = m.id
        WHERE m.session_id = ?
          AND json_extract(m.data, '$.role') = 'user'
          AND json_extract(p.data, '$.type') = 'text'
        ORDER BY m.time_created
    """, (sid,))
    rows = cur.fetchall()
    for r in rows:
        text = r['text'] or ''
        # Skip system reminders
        if '<system-reminder>' in text:
            continue
        if len(text.strip()) > 3:
            print(f"  USER: {text[:500]}")

conn.close()
