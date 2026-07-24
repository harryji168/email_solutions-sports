import urllib.request

url = 'https://data.7msport.com/matches_data/149/en/matches.js'
req = urllib.request.Request(
    url, 
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
)

try:
    js_content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
    with open('test_matches.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    print("Saved test_matches.js, length:", len(js_content))
except Exception as e:
    print("Error:", e)
