#!/bin/bash
# Optimize all PNG and JPG images in assets/images and output to assets/images-optimized
mkdir -p assets/images-optimized
for img in assets/images/*.{png,jpg,jpeg}; do
  [ -e "$img" ] || continue
  filename=$(basename "$img")
  convert "$img" -strip -interlace Plane -gaussian-blur 0.05 -quality 85 "assets/images-optimized/$filename"
done
