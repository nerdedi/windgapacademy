#!/usr/bin/env python3
"""Parse ruff run log and summarize top files and error codes."""
import re
from collections import Counter
LOG='/workspaces/windgapacademy/tmp/ruff_dir_batch.log'
OUT_DIR='/workspaces/windgapacademy/tmp'
TOP_FILES=f'{OUT_DIR}/ruff_top_files.txt'
TOP_CODES=f'{OUT_DIR}/ruff_top_codes.txt'
SUMMARY=f'{OUT_DIR}/ruff_log_summary.txt'
code_re=re.compile(r'^([A-Z][0-9]{3})\b')
path_re=re.compile(r'-->\s*(\S+):(\d+):(\d+)')
file_counts=Counter()
code_counts=Counter()
try:
    with open(LOG,'r',errors='ignore') as f:
        last_code=None
        for line in f:
            line=line.rstrip('\n')
            m=code_re.match(line.strip())
            if m:
                last_code=m.group(1)
                continue
            m2=path_re.search(line)
            if m2 and last_code:
                path=m2.group(1)
                file_counts[path]+=1
                code_counts[last_code]+=1
                last_code=None
except FileNotFoundError:
    print('Log file not found:', LOG)
    raise
# write outputs
with open(TOP_FILES,'w') as f:
    for p,c in file_counts.most_common(200):
        f.write(f"{c:6d}  {p}\n")
with open(TOP_CODES,'w') as f:
    for code,c in code_counts.most_common(200):
        f.write(f"{c:6d}  {code}\n")
with open(SUMMARY,'w') as f:
    f.write('Top files by violation count:\n')
    for p,c in file_counts.most_common(200):
        f.write(f"{c:6d}  {p}\n")
    f.write('\nTop error codes:\n')
    for code,c in code_counts.most_common(200):
        f.write(f"{c:6d}  {code}\n")
print('Wrote:', TOP_FILES, TOP_CODES, SUMMARY)
