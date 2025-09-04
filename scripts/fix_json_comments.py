#!/usr/bin/env python3
"""
Scan for .json files that contain JavaScript-style comments (// or /* */),
strip the comments, validate JSON, and write a cleaned copy next to the original
with the suffix `.cleaned.json` so you can inspect before replacing originals.

Usage:
  python scripts/fix_json_comments.py --exclude ".vscode,o3de" --dry-run
  python scripts/fix_json_comments.py --exclude ".vscode,o3de"
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path
from typing import Iterable


def strip_json_comments(s: str) -> str:
    out = []
    i = 0
    n = len(s)
    in_str = False
    str_quote = ""
    escape = False
    in_sl = False
    in_ml = False
    while i < n:
        ch = s[i]
        nxt = s[i+1] if i+1 < n else ""
        if in_sl:
            if ch == "\n":
                in_sl = False
                out.append(ch)
            # else skip
            i += 1
            continue
        if in_ml:
            if ch == "*" and nxt == "/":
                in_ml = False
                i += 2
                continue
            i += 1
            continue
        if in_str:
            out.append(ch)
            if not escape and ch == str_quote:
                in_str = False
                str_quote = ""
            escape = (ch == "\\" and not escape)
            i += 1
            continue
        # not in string or comment
        if ch == "/" and nxt == "/":
            in_sl = True
            i += 2
            continue
        if ch == "/" and nxt == "*":
            in_ml = True
            i += 2
            continue
        if ch == '"' or ch == "'":
            in_str = True
            str_quote = ch
            out.append(ch)
            i += 1
            continue
        out.append(ch)
        i += 1
    return "".join(out)


def walk_json_files(root: Path, excludes: Iterable[str]) -> Iterable[Path]:
    ex = set(excludes)
    for p in root.rglob("*.json"):
        parts = set(p.parts)
        if ex & parts:
            continue
        yield p


def process_file(p: Path, dry_run: bool = True) -> bool:
    txt = p.read_text(encoding="utf-8", errors="replace")
    if "//" not in txt and "/*" not in txt:
        return False
    stripped = strip_json_comments(txt)
    try:
        json.loads(stripped)
    except Exception as e:
        print(f"[FAIL] {p}: JSON parse failed after stripping comments: {e}")
        return False
    out = p.with_suffix(p.suffix + ".cleaned.json")
    if dry_run:
        print(f"[OK (dry)] {p} -> {out}")
    else:
        out.write_text(stripped, encoding="utf-8")
        print(f"[OK] {p} -> {out}")
    return True


def main(argv: list[str] | None = None) -> int:
    argv = argv if argv is not None else sys.argv[1:]
    ap = argparse.ArgumentParser()
    ap.add_argument("--exclude", default=".vscode,o3de", help="Comma-separated path parts to exclude")
    ap.add_argument("--dry-run", action="store_true", help="Don't write files, just report")
    ap.add_argument("--root", default=".", help="Workspace root")
    args = ap.parse_args(argv)

    root = Path(args.root).resolve()
    excludes = [x for x in args.exclude.split(",") if x]

    files = list(walk_json_files(root, excludes))
    if not files:
        print("No JSON files found.")
        return 0

    total = 0
    fixed = 0
    for p in files:
        total += 1
        try:
            if process_file(p, dry_run=args.dry_run):
                fixed += 1
        except Exception as e:
            print(f"[ERROR] {p}: {e}")

    print(f"\nScanned {total} .json files; {fixed} files produced cleaned copies (dry_run={args.dry_run}).")
    print("Cleaned copies use the suffix '.cleaned.json' next to the originals.")
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
