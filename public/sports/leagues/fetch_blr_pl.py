import json
import re
import datetime

with open('C:/email_solutions/public/sports/leagues/fixture.js', 'r', encoding='utf-8') as f:
    js = f.read()

def extract_array(var_name):
    match = re.search(var_name + r'\s*=\s*\[(.*?)\];', js, re.DOTALL)
    if not match: return []
    content = match.group(1)
    elements = []
    in_str = False
    cur = ''
    for c in content:
        if c == '"' or c == "'":
            in_str = not in_str
        elif c == ',' and not in_str:
            elements.append(cur.strip('\'" '))
            cur = ''
        else:
            cur += c
    if cur:
        elements.append(cur.strip('\'" '))
    return elements

match_ids = extract_array('Tmp_bh_Arr')
runs = extract_array('Run_Arr')
times = extract_array('Time_Arr')
scores = extract_array('Scores_Arr')
teamA = extract_array('TeamA_Arr')
teamB = extract_array('TeamB_Arr')

matches = []
for i in range(len(match_ids)):
    t_parts = times[i].split(',')
    if len(t_parts) == 6:
        dt = datetime.datetime(int(t_parts[0]), int(t_parts[1]), int(t_parts[2]), int(t_parts[3]), int(t_parts[4]), int(t_parts[5]))
        dt = dt - datetime.timedelta(hours=15)
        date = dt.strftime('%Y-%m-%d')
        time_str = dt.strftime('%H:%M')
        day_str = dt.strftime('%A')
    else:
        date = "Unknown"
        time_str = "00:00"
        day_str = ""
    
    score = scores[i] if scores[i] != 'VS' else 'VS'
    if score != 'VS' and '(' in score:
        score_main = score.split('(')[0]
    else:
        score_main = score
        
    title = f"{teamA[i]} {score_main} {teamB[i]}"
    if score == 'VS':
        title = f"{teamA[i]} vs {teamB[i]}"

    match = {
        "date": date,
        "day": day_str,
        "time": time_str,
        "group": f"Round {runs[i]}",
        "title": title,
        "homeTeam": teamA[i],
        "awayTeam": teamB[i],
        "score": score,
        "matchId": match_ids[i]
    }
    matches.append(match)

import os
target_path = 'C:/email_solutions/public/sports/leagues/BLR_PL/2026.json'
os.makedirs(os.path.dirname(target_path), exist_ok=True)
with open(target_path, 'w', encoding='utf-8') as f:
    json.dump(matches, f, indent=4)
print(f"Saved {len(matches)} matches to {target_path}")

target_path2 = 'C:/email_solutions/public/sports/leagues/BLR PL/2026.json'
if os.path.exists(os.path.dirname(target_path2)):
    with open(target_path2, 'w', encoding='utf-8') as f:
        json.dump(matches, f, indent=4)
    print(f"Saved {len(matches)} matches to {target_path2}")
