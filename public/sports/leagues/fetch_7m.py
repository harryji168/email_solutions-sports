import urllib.request
import re

url = 'https://data.7msport.com/matches_data/305/en/index.shtml'
req = urllib.request.Request(
    url, 
    data=None, 
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
)

try:
    html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
    scripts = re.findall(r'src="([^"]+\.js[^"]*)"', html)
    print("Found scripts:", scripts)
    
    # Check if there is a fixture.js or matches.js
    for script in scripts:
        if 'fixture' in script or 'matches' in script or 'data' in script:
            print("Potential data script:", script)
            if not script.startswith('http'):
                script_url = 'https://data.7msport.com/matches_data/305/en/' + script
            else:
                script_url = script
            print("Fetching:", script_url)
            req2 = urllib.request.Request(script_url, headers=req.headers)
            js_content = urllib.request.urlopen(req2).read().decode('utf-8', errors='ignore')
            print("Preview of", script_url, ":\n", js_content[:200])
except Exception as e:
    print("Error:", e)
