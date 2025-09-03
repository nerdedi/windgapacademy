#!/usr/bin/env python3
"""Convert a Jupyter notebook to a cleaned Python script.

Usage:
  python scripts/convert_and_cleanup.py path/to/notebook.ipynb path/to/output_script.py

The script will invoke `jupyter nbconvert --to script` and then clean the generated
Python script by removing IPython-specific lines and organizing imports.
"""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from typing import List


SKIP_PATTERNS = [
    r"^\s*#\s*In\[",
    r"get_ipython\(",
    r"from\s+IPython\.display",
    r"Image\(",
    r"^\s*#\s*<hr>",
    r"^\s*#\s*<br>",
]


def convert_notebook_to_script(input_nb: str, output_py: str) -> str:
    """Run nbconvert to produce a .py script. Returns the path to the generated .py file."""
    # nbconvert --output wants a base name (without .py)
    output_base, ext = os.path.splitext(output_py)
    if ext == ".py":
        out_base_for_nb = output_base
    else:
        # if user passed no .py extension, use as-is
        out_base_for_nb = output_py

    cmd = [
        "jupyter",
        "nbconvert",
        "--to",
        "script",
        input_nb,
        "--output",
        out_base_for_nb,
    ]

    try:
        print("Converting notebook to script:", " ".join(cmd))
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print("Error: nbconvert failed:", e, file=sys.stderr)
        raise

    generated_py = out_base_for_nb if out_base_for_nb.endswith(".py") else out_base_for_nb + ".py"
    if not os.path.exists(generated_py):
        raise FileNotFoundError(f"Expected generated script not found: {generated_py}")
    print("Converted to:", generated_py)
    return generated_py


def cleanup_script(path: str, skip_patterns: List[str] | None = None) -> None:
    """Remove IPython-specific lines and organize imports in the given Python script."""
    skip_patterns = skip_patterns or SKIP_PATTERNS
    compiled = [re.compile(p) for p in skip_patterns]

    try:
        with open(path, "r", encoding="utf-8") as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Error reading {path}: {e}", file=sys.stderr)
        raise

    cleaned: List[str] = []
    imports: List[str] = []

    for line in lines:
        s = line.strip()
        # Skip lines that match any skip pattern anywhere in the line
        if any(p.search(line) for p in compiled):
            continue

        # Skip empty prompt-like comment lines typically created by nbconvert
        if s.startswith("# In[") or s.startswith("#\n"):
            continue

        # Collect import lines
        if re.match(r"^\s*(from\s+\S+\s+import|import\s+\S+)", line):
            imports.append(line)
        else:
            cleaned.append(line)

    # Deduplicate and sort imports, keep __future__ imports first
    future_imports = sorted({imp for imp in imports if imp.lstrip().startswith("from __future__")})
    other_imports = sorted({imp for imp in imports if not imp.lstrip().startswith("from __future__")})

    final_lines = []
    if future_imports:
        final_lines.extend(future_imports)
        final_lines.append("\n")

    if other_imports:
        final_lines.extend(other_imports)
        final_lines.append("\n")

    final_lines.extend(cleaned)

    try:
        with open(path, "w", encoding="utf-8") as f:
            f.writelines(final_lines)
    except Exception as e:
        print(f"Error writing cleaned script to {path}: {e}", file=sys.stderr)
        raise

    print("Cleaned script:", path)


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Convert a Jupyter notebook to a cleaned Python script."
    )
    parser.add_argument("notebook", help="Path to the Jupyter notebook file (.ipynb)")
    parser.add_argument("output", help="Desired output Python file path (.py)")
    parser.add_argument("--no-clean", action="store_true", help="Skip the cleanup step")

    args = parser.parse_args(argv)

    try:
        generated = convert_notebook_to_script(args.notebook, args.output)
        # If user requested a specific output filename (including dir), move/rename
        # nbconvert writes to the current working directory by default; if the
        # requested output path differs, move the file.
        desired_py = args.output if args.output.endswith(".py") else args.output + ".py"
        if os.path.abspath(generated) != os.path.abspath(desired_py):
            try:
                os.replace(generated, desired_py)
                generated = desired_py
            except Exception:
                # If move fails, continue with the generated path
                pass

        if not args.no_clean:
            cleanup_script(generated)

        print("Done.")
        return 0
    except Exception as exc:
        print("Failed:", exc, file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
