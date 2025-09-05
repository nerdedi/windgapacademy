#!/usr/bin/env bash
set -euo pipefail

# Portable Git LFS installer script.
# Strategies:
# 1) If git-lfs present, do nothing.
# 2) If sudo + apt-get available, use apt-get (Debian/Ubuntu).
# 3) Otherwise, attempt to download a linux-amd64 release and install to $HOME/.local/bin.

if command -v git-lfs >/dev/null 2>&1; then
  echo "git-lfs already installed: $(git-lfs version)"
  exit 0
fi

echo "git-lfs not found; attempting install..."

if command -v sudo >/dev/null 2>&1 && command -v apt-get >/dev/null 2>&1; then
  echo "Using sudo apt-get to install git-lfs"
  sudo apt-get update && sudo apt-get install -y git-lfs
  git lfs install || true
  exit 0
fi

OS=$(uname -s)
ARCH=$(uname -m)
echo "Detected OS=$OS ARCH=$ARCH"

if [ "$OS" = "Linux" ] && [ "$ARCH" = "x86_64" ]; then
  echo "Attempting to download git-lfs release for linux-amd64"
  # Find the latest release asset URL for linux-amd64 using GitHub API
  API_URL="https://api.github.com/repos/git-lfs/git-lfs/releases/latest"
  DL_URL=$(curl -s "$API_URL" | grep "browser_download_url" | grep "linux-amd64" | cut -d '"' -f 4 | head -n 1)
  if [ -z "$DL_URL" ]; then
    echo "Could not determine download URL for git-lfs linux-amd64 release"
    exit 1
  fi
  echo "Downloading $DL_URL"
  TMPDIR=$(mktemp -d)
  curl -sL "$DL_URL" -o "$TMPDIR/git-lfs.tar.gz"
  mkdir -p "$TMPDIR/extracted"
  tar -xzf "$TMPDIR/git-lfs.tar.gz" -C "$TMPDIR/extracted"
  BINPATH=$(find "$TMPDIR/extracted" -type f -name git-lfs -print -quit)
  if [ -z "$BINPATH" ]; then
    echo "git-lfs binary not found in archive"
    exit 1
  fi
  mkdir -p "$HOME/.local/bin"
  cp "$BINPATH" "$HOME/.local/bin/git-lfs"
  chmod +x "$HOME/.local/bin/git-lfs"
  export PATH="$HOME/.local/bin:$PATH"
  echo "Installed git-lfs to $HOME/.local/bin/git-lfs"
  git lfs install || true
  exit 0
fi

echo "Automatic installation not supported for OS=$OS ARCH=$ARCH in this script. Please install git-lfs manually. See https://github.com/git-lfs/git-lfs#installation"
exit 1
