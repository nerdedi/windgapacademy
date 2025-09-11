#!/usr/bin/env python3
"""Run ruff check with JSON output and summarize top files and error codes.
Writes to /workspaces/windgapacademy/tmp/ruff_all.json and summary files.
"""
import os
import sys
import json
import shutil
import subprocess
from collections import Counter
ROOT = '/workspaces/windgapacademy/o3de/o3de'
TARGET = 'AutomatedTesting/Gem/PythonTests'
OUTDIR = '/workspaces/windgapacademy/tmp'
JSON_OUT = os.path.join(OUTDIR, 'ruff_all.json')
SUMMARY_OUT = os.path.join(OUTDIR, 'ruff_summary.txt')
TOPFILES = os.path.join(OUTDIR, 'ruff_top_files.txt')
TOPCODES = os.path.join(OUTDIR, 'ruff_top_codes.txt')
os.makedirs(OUTDIR, exist_ok=True)
# locate ruff
candidates = [
    os.path.join(ROOT, '.venv-ruff', 'bin', 'ruff'),
    os.path.join(ROOT, '..', '..', '.venv', 'bin', 'ruff'),
]
ruff = None
for p in candidates:
    if os.path.exists(p) and os.access(p, os.X_OK):
        ruff = p
        break
if ruff is None:
    ruff = shutil.which('ruff')
if ruff is None:
    print('ruff binary not found in expected locations', file=sys.stderr)
    sys.exit(2)
print('Using ruff:', ruff)
# run ruff check to JSON
cmd = [ruff, 'check', '--output-format', 'json', '-o', JSON_OUT, TARGET]
print('Running:', ' '.join(cmd))
proc = subprocess.run(cmd, cwd=ROOT)
# parse json if present
if not os.path.exists(JSON_OUT):
    print('JSON output not produced; check ruff run (exit code {})'.format(proc.returncode), file=sys.stderr)
    sys.exit(1)
with open(JSON_OUT, 'r') as f:
    data = json.load(f)
file_counts = Counter()
code_counts = Counter()
for item in data:
    path = item.get('filename')
    for v in item.get('violations', []):
        code = v.get('code')
        file_counts[path] += 1
        code_counts[code] += 1
# write outputs
with open(TOPFILES, 'w') as f:
    for p, c in file_counts.most_common(200):
        f.write(f"{c:6d}  {p}\n")
with open(TOPCODES, 'w') as f:
    for code, c in code_counts.most_common(200):
        f.write(f"{c:6d}  {code}\n")
with open(SUMMARY_OUT, 'w') as f:
    f.write('Top files by violation count:\n')
    for p, c in file_counts.most_common(200):
        f.write(f"{c:6d}  {p}\n")
    f.write('\nTop error codes:\n')
    for code, c in code_counts.most_common(200):
        f.write(f"{c:6d}  {code}\n")
print('Wrote summaries:', JSON_OUT, SUMMARY_OUT, TOPFILES, TOPCODES)
