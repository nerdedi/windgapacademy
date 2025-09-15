#!/bin/bash

# Blender to Three.js Asset Pipeline Script
# This script automates the process of exporting Blender models and preparing them
# for use with Windgap Academy's WebGL utilities.

# Configuration
BLENDER_PATH="blender"  # Change this to your Blender executable path if needed
BLENDER_SCRIPT_PATH="/workspaces/windgapacademy/scripts/blender_export.py"
SOURCE_DIR="/workspaces/windgapacademy/blender-assets"
TARGET_DIR="/workspaces/windgapacademy/assets"

# Create directories if they don't exist
mkdir -p "$TARGET_DIR/characters"
mkdir -p "$TARGET_DIR/environments"
mkdir -p "$TARGET_DIR/props"

# Check if Blender exists
if ! command -v $BLENDER_PATH &> /dev/null; then
    echo "Blender not found. Please install Blender or update the BLENDER_PATH variable."
    exit 1
fi

# Create Blender export script if it doesn't exist
if [ ! -f "$BLENDER_SCRIPT_PATH" ]; then
    mkdir -p "$(dirname "$BLENDER_SCRIPT_PATH")"
    cat > "$BLENDER_SCRIPT_PATH" << 'EOL'
import bpy
import os
import sys

# Get arguments passed to the script
argv = sys.argv
argv = argv[argv.index("--") + 1:]  # Get all args after --

if len(argv) < 2:
    print("Usage: blender -b -P blender_export.py -- <source_file> <target_file>")
    sys.exit(1)

source_file = argv[0]
target_file = argv[1]

# Clear existing scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# Load the file
bpy.ops.wm.open_mainfile(filepath=source_file)

# Set up export options for glTF
export_settings = {
    'export_format': 'GLB',
    'export_selected': False,
    'export_animations': True,
    'export_anim_single': False,
    'export_frame_range': False,
    'export_frame_step': 1,
    'export_force_sampling': True,
    'export_nla_strips': True,
    'export_def_bones': False,
    'export_apply': False,
    'export_texcoords': True,
    'export_normals': True,
    'export_tangents': True,
    'export_materials': True,
    'export_colors': True,
    'export_cameras': False,
    'export_lights': False,
    'export_yup': True
}

# Create target directory if it doesn't exist
os.makedirs(os.path.dirname(target_file), exist_ok=True)

# Export as GLB
bpy.ops.export_scene.gltf(
    filepath=target_file,
    **export_settings
)

print(f"Exported {source_file} to {target_file}")
EOL
    echo "Created Blender export script at $BLENDER_SCRIPT_PATH"
fi

# Process character models
echo "Processing character models..."
for character_dir in "$SOURCE_DIR/characters"/*/ ; do
    if [ -d "$character_dir" ]; then
        character_name=$(basename "$character_dir")
        echo "Processing character: $character_name"
        
        # Find main character blend file
        blend_file=$(find "$character_dir" -name "*.blend" -not -path "*/\.*" | head -n 1)
        
        if [ -n "$blend_file" ]; then
            target_file="$TARGET_DIR/characters/$character_name/$character_name.glb"
            mkdir -p "$(dirname "$target_file")"
            
            echo "Exporting $blend_file to $target_file"
            $BLENDER_PATH -b -P "$BLENDER_SCRIPT_PATH" -- "$blend_file" "$target_file"
        else
            echo "No .blend file found for character $character_name"
        fi
    fi
done

# Process environment models
echo "Processing environment models..."
for env_dir in "$SOURCE_DIR/environments"/*/ ; do
    if [ -d "$env_dir" ]; then
        env_name=$(basename "$env_dir")
        echo "Processing environment: $env_name"
        
        # Find main environment blend file
        blend_file=$(find "$env_dir" -name "*.blend" -not -path "*/\.*" | head -n 1)
        
        if [ -n "$blend_file" ]; then
            target_file="$TARGET_DIR/environments/$env_name/$env_name.glb"
            mkdir -p "$(dirname "$target_file")"
            
            echo "Exporting $blend_file to $target_file"
            $BLENDER_PATH -b -P "$BLENDER_SCRIPT_PATH" -- "$blend_file" "$target_file"
        else
            echo "No .blend file found for environment $env_name"
        fi
    fi
done

# Process prop models
echo "Processing prop models..."
for prop_file in "$SOURCE_DIR/props"/*.blend ; do
    if [ -f "$prop_file" ]; then
        prop_name=$(basename "$prop_file" .blend)
        echo "Processing prop: $prop_name"
        
        target_file="$TARGET_DIR/props/$prop_name.glb"
        mkdir -p "$(dirname "$target_file")"
        
        echo "Exporting $prop_file to $target_file"
        $BLENDER_PATH -b -P "$BLENDER_SCRIPT_PATH" -- "$prop_file" "$target_file"
    fi
done

echo "Asset pipeline complete!"
echo "Exported assets are available in $TARGET_DIR"