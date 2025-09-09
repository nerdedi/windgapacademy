#!/usr/bin/env python3
import re
import sys
from pathlib import Path

ROOT = Path('o3de/AutomatedTesting/Gem/PythonTests')

lambda_re = re.compile(r"(?m)^(?P<indent>\s*)(?P<var>[A-Za-z_][A-Za-z0-9_]*)\s*=\s*lambda\s*(?P<args>[^:]+):\s*(?P<expr>.+)$")
# match common lhs forms like var, call(), obj.attr, arr[index]
true_re = re.compile(r"(?P<lhs>\b[\w\)\]\.]+)\s*==\s*True\b")
false_re = re.compile(r"(?P<lhs>\b[\w\)\]\.]+)\s*==\s*False\b")
for_entity_re = re.compile(r"(?m)^(?P<indent>\s*)for\s+entity\s+in\s+(?P<iter>.+):\s*$")

count = 0
files_changed = []

for py in ROOT.rglob('*.py'):
    s = py.read_text()
    orig = s

    # Convert simple lambda assignments to def
    def lambda_sub(m):
        indent = m.group('indent')
        var = m.group('var')
        args = m.group('args').strip()
        expr = m.group('expr').strip()
        # Build def with return on next line
        return f"{indent}def {var}({args}):\n{indent}    return {expr}"
    s = lambda_re.sub(lambda_sub, s)

    # Replace == True -> identity, == False -> not
    s = true_re.sub(r"\1", s)
    s = false_re.sub(r"not \1", s)

    # Fix 'for entity in' simple shadow: rename to child_entity and update a few lines after
    new_lines = s.splitlines()
    i = 0
    while i < len(new_lines):
        line = new_lines[i]
        m = for_entity_re.match(line)
        if m:
            indent = m.group('indent')
            # replace loop variable
            new_lines[i] = f"{indent}for child_entity in {m.group('iter')}:"
            # compute block indentation (indent + 4 spaces or tab)
            block_indent = indent + ('    ' if '\t' not in indent else '\t')
            j = i + 1
            # update occurrences of 'entity' as a standalone word within the indented block
            while j < len(new_lines):
                lj = new_lines[j]
                # stop when indentation less than or equal to loop indent and line not blank
                if lj.strip() == '':
                    j += 1
                    continue
                if not lj.startswith(block_indent):
                    break
                # replace 'entity' with 'child_entity' when used as a name (word boundaries)
                new_lines[j] = re.sub(r"\bentity\b", 'child_entity', lj)
                j += 1
            i = j
        else:
            i += 1
    s = "\n".join(new_lines)

    if s != orig:
        py.write_text(s)
        files_changed.append(str(py))
        count += 1

print(f"Files changed: {count}")
for f in files_changed:
    print(f)
