import sqlite3
import json
import sys

DB = r"C:\Users\sidda\.local\share\mimocode\mimocode.db"
conn = sqlite3.connect(DB)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

def query(sql, label=""):
    if label:
        print(f"\n=== {label} ===")
    cur.execute(sql)
    rows = cur.fetchall()
    for r in rows:
        print(dict(r))
    return rows

# 1. List all tables
print("=== TABLES ===")
cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
print([r[0] for r in cur.fetchall()])

# 2. Find sessions for this project
print("\n=== ALL SESSIONS (newest first) ===")
cur.execute("SELECT id, title, directory, time_created FROM session ORDER BY time_created DESC")
sessions = cur.fetchall()
for s in sessions:
    print(f"  {s['id']} | {s['directory'] or 'N/A'} | {s['title'] or 'N/A'} | {s['time_created']}")

# 3. Filter to cakes project sessions
cakes_sessions = [s for s in sessions if s['directory'] and 'cakes' in s['directory'].lower()]
print(f"\n=== CAKES PROJECT SESSIONS: {len(cakes_sessions)} ===")
for s in cakes_sessions:
    print(f"  {s['id']} | {s['title']} | {s['time_created']}")

# 4. For each cakes session, get message counts
print("\n=== SESSION MESSAGE/PART COUNTS ===")
for s in cakes_sessions:
    sid = s['id']
    cur.execute("SELECT COUNT(*) as cnt FROM message WHERE session_id=?", (sid,))
    mcnt = cur.fetchone()['cnt']
    cur.execute("SELECT COUNT(*) as cnt FROM part WHERE session_id=?", (sid,))
    pcnt = cur.fetchone()['cnt']
    print(f"  {sid} | msgs={mcnt} parts={pcnt} | {s['title']}")

conn.close()
