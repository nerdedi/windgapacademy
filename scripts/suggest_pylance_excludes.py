#!/usr/bin/env python3
"""
Scan the workspace for large directories and print suggested glob exclude patterns
for `python.analysis.exclude`. This script does not modify any files by default.

Usage:
  python scripts/suggest_pylance_excludes.py --top 10

Options:
  --top N    Show top N largest directories (default 10)
  --min-size BYTES  Only consider dirs >= BYTES
"""
from __future__ import annotations
import os
import sys
import argparse
from pathlib import Path


def dir_size(path: Path, ignore_dirs: set[str]) -> int:
    total = 0
    for root, dirs, files in os.walk(path, topdown=True):
        # prune ignored directories
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for f in files:
            try:
                st = os.stat(os.path.join(root, f))
                total += st.st_size
            except Exception:
                pass
    return total


def human(n: float) -> str:
    for unit in ("B", "KB", "MB", "GB", "TB"):
        if n < 1024:
            return f"{n:.1f}{unit}"
        n /= 1024
    return f"{n:.1f}PB"


def main(argv: list[str] | None = None) -> int:
    argv = argv if argv is not None else sys.argv[1:]
    p = argparse.ArgumentParser()
    p.add_argument("--top", type=int, default=10)
    p.add_argument("--min-size", type=int, default=0)
    args = p.parse_args(argv)

    root = Path.cwd()
    ignore_dirs = {".git", "node_modules", "__pycache__", ".venv", "venv"}

    candidates: list[tuple[Path, int]] = []
    # consider top-level directories only for suggestions
    for child in sorted(root.iterdir()):
        if not child.is_dir():
            continue
        if child.name in ignore_dirs:
            continue
        size = dir_size(child, ignore_dirs)
        if size >= args.min_size:
            candidates.append((child, size))

    candidates.sort(key=lambda x: x[1], reverse=True)

    print("Top directories by size (suggested exclude patterns):")
    suggestions = []
    for pth, sz in candidates[: args.top]:
        pattern = f"{pth.as_posix()}/**"
        suggestions.append(pattern)
        print(f"  {human(sz):>8}  {pattern}")

    if suggestions:
        print("\nSuggested `python.analysis.exclude` additions (JSON array):")
        print("[")
        for s in suggestions:
            print(f'  "{s}",')
        print("]")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
