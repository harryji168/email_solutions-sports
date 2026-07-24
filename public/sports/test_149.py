import urllib.request
import re

url = 'https://data.7msport.com/matches_data/149/en/index.shtml'
req = urllib.request.Request(
    url, 
    data=None, 
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
)

try:
    html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
    scripts = re.findall(r'src="([^"]+\.js[^"]*)"', html)
    print("Scripts found:", scripts)
    for script in scripts:
        print("Script URL:", script)
except Exception as e:
    print("Error:", e)
