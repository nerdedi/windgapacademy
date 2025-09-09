#!/usr/bin/env python3
"""Conservative codemod for O3DE Python tests.

Replacements applied (safe, reversible):
- "== None" -> "is None" and "!= None" -> "is not None"
- bare "except:" -> "except Exception:"
- "type(x) == T" -> "isinstance(x, T)" and "type(x) != T" -> "not isinstance(x, T)"

Run from repo root. Edits files in-place and prints a summary of changed files.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / 'o3de' / 'AutomatedTesting' / 'Gem' / 'PythonTests'

patterns = [
    # None comparisons
    (re.compile(r"!=\s*None\b"), "is not None"),
    (re.compile(r"==\s*None\b"), "is None"),
    # bare except
    (re.compile(r"^\s*except:\s*$", re.MULTILINE), "except Exception:"),
    # type(x) == T -> isinstance(x, T)
    (re.compile(r"type\(\s*([A-Za-z0-9_\.\[\]'\"]+)\s*\)\s*==\s*([A-Za-z0-9_\.]+)"), r"isinstance(\1, \2)"),
    (re.compile(r"type\(\s*([A-Za-z0-9_\.\[\]'\"]+)\s*\)\s*!=\s*([A-Za-z0-9_\.]+)"), r"not isinstance(\1, \2)"),
]


def process_file(path: Path) -> bool:
    text = path.read_text(encoding='utf-8')
    new = text
    for pat, repl in patterns:
        new = pat.sub(repl, new)
    if new != text:
        path.write_text(new, encoding='utf-8')
        return True
    return False


def main():
    changed = []
    for p in TARGET.rglob('*.py'):
        try:
            if process_file(p):
                changed.append(str(p.relative_to(ROOT)))
        except Exception as e:
            print(f"ERROR processing {p}: {e}")
    print(f"Files changed: {len(changed)}")
    for f in changed[:200]:
        print(f)


if __name__ == '__main__':
    main()
