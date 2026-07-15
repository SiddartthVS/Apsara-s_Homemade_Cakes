import sqlite3
import json

DB = r"C:\Users\sidda\.local\share\mimocode\mimocode.db"
conn = sqlite3.connect(DB)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

RECENT_SESSIONS = [
    "ses_099ac7215ffeqM4QqWxIV9MHc3",  # Positioning headingLeft and headingRight images
    "ses_09f4a0c98ffeGe7tQXFbh8llDa",  # Web project show more/less analysis
    "ses_09f7b9b44fferJHsPM1UIEQocl",  # Excessive spacing: recent-cakes and live-offers
    "ses_09f81606cffebbxDe7dkuc2LyY",  # Fixing recent-cakes.js
    "ses_09f9fe3cfffeHGiZVNArKIEIWS",  # Apply hover darkening to all offer cards
]

# Search for user messages with decision/rule keywords
keywords = ["always", "never", "remember", "rule", "decision", "decided", "tradeoff", "reason",
            "repeat", "again", "every time", "workflow", "keep it", "no ", "don't", "do not",
            "instead", "prefer", "simple", "remove", "revert", "reverted", "undo"]

print("=== USER MESSAGES WITH DECISION/RULE KEYWORDS ===")
for sid in RECENT_SESSIONS:
    cur.execute("""
        SELECT m.id, json_extract(m.data, '$.role') as role,
               json_extract(p.data, '$.text') as text, p.time_created
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
        text_lower = text.lower()
        matched = [kw for kw in keywords if kw in text_lower]
        if matched and len(text.strip()) > 5:
            print(f"\n  [{sid}] (matched: {matched})")
            print(f"  {text[:300]}")

print("\n\n=== ASSISTANT TEXT PARTS (last 5 per session, condensed) ===")
for sid in RECENT_SESSIONS:
    # Get session title
    cur.execute("SELECT title FROM session WHERE id=?", (sid,))
    title = cur.fetchone()['title']
    print(f"\n--- {sid}: {title} ---")
    
    cur.execute("""
        SELECT json_extract(p.data, '$.text') as text, p.time_created
        FROM message m
        JOIN part p ON p.message_id = m.id
        WHERE m.session_id = ?
          AND json_extract(m.data, '$.role') = 'assistant'
          AND json_extract(p.data, '$.type') = 'text'
          AND json_extract(p.data, '$.text') IS NOT NULL
          AND length(json_extract(p.data, '$.text')) > 20
        ORDER BY m.time_created DESC, p.time_created DESC
        LIMIT 5
    """, (sid,))
    rows = cur.fetchall()
    for r in reversed(rows):
        text = r['text'] or ''
        print(f"  > {text[:200]}")

conn.close()
