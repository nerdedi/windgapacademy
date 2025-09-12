#!/usr/bin/env python3
"""
Pre-commit hook to check for Anthropic Claude attribution in files that appear to contain 
AI-generated code but lack proper attribution.
"""

import sys
import re
import os
from pathlib import Path

# Attribution markers to look for
ATTRIBUTION_MARKERS = [
    r'generated with.*(?:Claude|Anthropic)',
    r'assisted by.*(?:Claude|Anthropic)',
    r'(?:Claude|Anthropic).*assisted',
    r'(?:Claude|Anthropic).*generated',
]

# Compiled patterns
ATTRIBUTION_PATTERN = re.compile('|'.join(ATTRIBUTION_MARKERS), re.IGNORECASE)

# Signals that suggest AI generation
AI_SIGNALS = [
    'TODO:',
    'NOTE:',
    'FIXME:',
    'This function',
    'Helper function',
    'Utility function',
    'This component',
    'This implementation',
]

def check_file(filename):
    """Check a file for proper Claude attribution."""
    if not os.path.exists(filename):
        return 0
    
    # Skip files we shouldn't check
    if any(part in filename for part in ['.git', 'node_modules', '.venv', 'venv']):
        return 0
        
    # Skip binary files and very large files
    try:
        if os.path.getsize(filename) > 500000:  # Skip files larger than 500KB
            return 0
            
        with open(filename, 'r', encoding='utf-8') as f:
            try:
                content = f.read()
            except UnicodeDecodeError:
                # Skip binary files
                return 0
    except Exception:
        return 0
    
    # If file is empty, skip
    if not content.strip():
        return 0
        
    file_extension = Path(filename).suffix.lower()
    
    # Only check source code files
    if file_extension not in [
        '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.c', '.cpp', 
        '.h', '.hpp', '.cs', '.go', '.rb', '.php', '.html', '.css',
        '.scss', '.md', '.sh', '.yaml', '.yml', '.json'
    ]:
        return 0
        
    # Check if file contains attribution already
    if ATTRIBUTION_PATTERN.search(content):
        return 0
        
    # Check for signals suggesting AI-generated content
    ai_signal_count = sum(signal in content for signal in AI_SIGNALS)
    
    # If multiple AI signals are found but no attribution, warn the user
    if ai_signal_count >= 2:
        print(f"\n⚠️  {filename} may contain AI-generated code without proper attribution.")
        print("   If you used Claude or Copilot with Claude to generate this code, please add:")
        print("   // Portions of this file were generated with the assistance of Anthropic Claude")
        print("   See CLAUDE_USAGE.md for attribution requirements.")
        return 1
        
    return 0

def main():
    """Main entry point for the script."""
    files = sys.argv[1:]
    exit_code = 0
    
    for filename in files:
        exit_code |= check_file(filename)
        
    if exit_code:
        print("\nThis is just a warning. Use --no-verify to bypass this check if needed.")
        print("See CLAUDE_USAGE.md for attribution requirements.\n")
        
    sys.exit(exit_code)

if __name__ == '__main__':
    main()