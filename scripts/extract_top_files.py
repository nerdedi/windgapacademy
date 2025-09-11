#!/usr/bin/env python3
import json
import collections
JSON='/workspaces/windgapacademy/tmp/ruff_all.json'
OUT='/workspaces/windgapacademy/tmp/ruff_top20_files.txt'
with open(JSON,'r') as f:
    data=json.load(f)
fc=collections.Counter()
for e in data:
    p=e.get('filename')
    if p:
        fc[p]+=1
with open(OUT,'w') as f:
    for p,c in fc.most_common(200):
        f.write(f"{c:6d}  {p}\n")
print('written',OUT)
