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

# Get all tool call parts for each session
print("=== TOOL CALLS (write/edit files) PER SESSION ===")
for sid in RECENT_SESSIONS:
    cur.execute("SELECT title FROM session WHERE id=?", (sid,))
    title = cur.fetchone()['title']
    print(f"\n--- {sid}: {title} ---")
    
    cur.execute("""
        SELECT json_extract(p.data, '$.tool') as tool,
               json_extract(p.data, '$.state.input') as input_json,
               json_extract(p.data, '$.state.output') as output_json
        FROM part p
        WHERE p.session_id = ?
          AND json_extract(p.data, '$.type') = 'tool'
          AND json_extract(p.data, '$.tool') IN ('write', 'edit', 'bash')
        ORDER BY p.time_created
    """, (sid,))
    rows = cur.fetchall()
    for r in rows:
        tool = r['tool']
        input_str = r['input_json'] or ''
        output_str = r['output_json'] or ''
        try:
            inp = json.loads(input_str) if input_str else {}
        except:
            inp = {}
        try:
            out = json.loads(output_str) if output_str else {}
        except:
            out = {}
        
        if tool == 'write':
            fp = inp.get('file_path', 'N/A')
            content = inp.get('content', '')
            print(f"  WRITE: {fp}")
            print(f"    content preview: {content[:150]}...")
        elif tool == 'edit':
            fp = inp.get('file_path', 'N/A')
            old = inp.get('old_string', '')[:80]
            new = inp.get('new_string', '')[:80]
            print(f"  EDIT: {fp}")
            print(f"    old: {old}...")
            print(f"    new: {new}...")
        elif tool == 'bash':
            cmd = inp.get('command', '')
            if 'git' in cmd or 'python' in cmd or 'node' in cmd or 'npm' in cmd:
                print(f"  BASH: {cmd[:150]}")

conn.close()
