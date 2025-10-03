#!/bin/bash

# restructure-project.sh
# This script helps reorganize the Windgap Academy project into a more maintainable structure

echo "╔════════════════════════════════════════════════╗"
echo "║   Windgap Academy Project Restructuring Tool   ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "This script will guide you through restructuring the project."
echo "It will not make any changes without confirmation."
echo ""

# Create backup
create_backup() {
  echo "Creating backup of the current state..."
  BACKUP_DIR="./tmp/project-backup-$(date +%Y%m%d-%H%M%S)"
  mkdir -p "$BACKUP_DIR"
  
  # Copy important directories (not the large ones)
  cp -r ./src "$BACKUP_DIR/src" 2>/dev/null
  cp -r ./components "$BACKUP_DIR/components" 2>/dev/null
  cp -r ./pages "$BACKUP_DIR/pages" 2>/dev/null
  cp -r ./context "$BACKUP_DIR/context" 2>/dev/null
  cp -r ./contexts "$BACKUP_DIR/contexts" 2>/dev/null
  cp -r ./utils "$BACKUP_DIR/utils" 2>/dev/null
  cp -r ./hooks "$BACKUP_DIR/hooks" 2>/dev/null
  cp -r ./styles "$BACKUP_DIR/styles" 2>/dev/null
  
  echo "✓ Backup created at: $BACKUP_DIR"
}

# Function to print section headers
print_header() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  $1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Step 1: Create the new structure
create_structure() {
  print_header "CREATING FEATURE-BASED STRUCTURE"
  echo "Creating directories for the new structure..."
  
  # Main feature directories
  mkdir -p ./src/features/{auth,math-exercises,adaptive-learning,ai-assistant,unity-integration}/{components,hooks,services,utils}
  mkdir -p ./src/shared/{components,hooks,utils,context,styles}
  mkdir -p ./src/app/{layout,routes}
  
  echo "✓ New directory structure created"
}

# Step 2: Consolidate authentication-related files
consolidate_auth() {
  print_header "CONSOLIDATING AUTHENTICATION FILES"
  echo "Preparing to move authentication-related files..."
  echo ""
  
  # Create list of auth-related files
  find ./src ./components ./pages ./contexts ./context -name "*Auth*.jsx" -o -name "*auth*.jsx" \
    -o -name "*Login*.jsx" -o -name "*OAuth*.jsx" > ./tmp/auth-files.txt
  
  echo "Files that will be moved to src/features/auth/:"
  cat ./tmp/auth-files.txt
  echo ""
  
  read -p "Would you like to proceed with moving these files? (y/n): " confirm
  if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    # Create destination directories
    mkdir -p ./src/features/auth/{components,context,hooks,services,utils}
    
    # Copy files (instead of moving to avoid breaking things)
    while IFS= read -r file; do
      # Determine subdirectory based on path
      if [[ $file == *"/components/"* ]]; then
        cp "$file" ./src/features/auth/components/
      elif [[ $file == *"/context"* ]]; then
        cp "$file" ./src/features/auth/context/
      elif [[ $file == *"/hooks/"* ]]; then
        cp "$file" ./src/features/auth/hooks/
      elif [[ $file == *"/services/"* ]]; then
        cp "$file" ./src/features/auth/services/
      elif [[ $file == *"/utils/"* ]]; then
        cp "$file" ./src/features/auth/utils/
      elif [[ $file == *"/pages/"* ]]; then
        cp "$file" ./src/app/routes/
      else
        cp "$file" ./src/features/auth/
      fi
    done < ./tmp/auth-files.txt
    
    echo "✓ Authentication files copied to new structure"
    echo "NOTE: Original files were preserved. After testing, you can remove them."
  else
    echo "Skipping authentication file consolidation."
  fi
}

# Step 3: Consolidate math exercise files
consolidate_math() {
  print_header "CONSOLIDATING MATH EXERCISE FILES"
  echo "Preparing to move math exercise-related files..."
  echo ""
  
  # Create list of math-related files
  find ./src ./components -name "*Math*.jsx" -o -name "*math*.jsx" -o -name "*Exercise*.jsx" \
    -o -name "*exercise*.jsx" -o -name "*Graph*.tsx" > ./tmp/math-files.txt
  
  echo "Files that will be moved to src/features/math-exercises/:"
  cat ./tmp/math-files.txt
  echo ""
  
  read -p "Would you like to proceed with moving these files? (y/n): " confirm
  if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    # Create destination directories
    mkdir -p ./src/features/math-exercises/{components,hooks,utils}
    
    # Copy files (instead of moving to avoid breaking things)
    while IFS= read -r file; do
      # Determine subdirectory based on path
      if [[ $file == *"/components/"* ]]; then
        cp "$file" ./src/features/math-exercises/components/
      elif [[ $file == *"/hooks/"* ]]; then
        cp "$file" ./src/features/math-exercises/hooks/
      elif [[ $file == *"/utils/"* ]]; then
        cp "$file" ./src/features/math-exercises/utils/
      elif [[ $file == *"/exercises/"* ]]; then
        cp "$file" ./src/features/math-exercises/components/
      else
        cp "$file" ./src/features/math-exercises/
      fi
    done < ./tmp/math-files.txt
    
    echo "✓ Math exercise files copied to new structure"
    echo "NOTE: Original files were preserved. After testing, you can remove them."
  else
    echo "Skipping math exercise file consolidation."
  fi
}

# Step 4: Consolidate adaptive learning files
consolidate_adaptive() {
  print_header "CONSOLIDATING ADAPTIVE LEARNING FILES"
  echo "Preparing to move adaptive learning related files..."
  echo ""
  
  # Create list of adaptive-related files
  find ./src ./components -name "*Adaptive*.jsx" -o -name "*adaptive*.jsx" -o -name "*Quest*.jsx" \
    -o -name "*quest*.jsx" > ./tmp/adaptive-files.txt
  
  echo "Files that will be moved to src/features/adaptive-learning/:"
  cat ./tmp/adaptive-files.txt
  echo ""
  
  read -p "Would you like to proceed with moving these files? (y/n): " confirm
  if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    # Create destination directories
    mkdir -p ./src/features/adaptive-learning/{components,hooks,utils}
    
    # Copy files (instead of moving to avoid breaking things)
    while IFS= read -r file; do
      # Determine subdirectory based on path
      if [[ $file == *"/components/"* ]]; then
        cp "$file" ./src/features/adaptive-learning/components/
      elif [[ $file == *"/hooks/"* ]]; then
        cp "$file" ./src/features/adaptive-learning/hooks/
      elif [[ $file == *"/utils/"* ]]; then
        cp "$file" ./src/features/adaptive-learning/utils/
      else
        cp "$file" ./src/features/adaptive-learning/
      fi
    done < ./tmp/adaptive-files.txt
    
    echo "✓ Adaptive learning files copied to new structure"
    echo "NOTE: Original files were preserved. After testing, you can remove them."
  else
    echo "Skipping adaptive learning file consolidation."
  fi
}

# Step 5: Create barrel exports
create_barrels() {
  print_header "CREATING BARREL EXPORTS"
  echo "Creating index.js files for cleaner imports..."
  
  # Function to create a barrel export file
  create_barrel() {
    local dir=$1
    if [ -d "$dir" ] && [ "$(ls -A "$dir")" ]; then
      echo "// Auto-generated barrel export file" > "$dir/index.js"
      echo "" >> "$dir/index.js"
      
      for file in "$dir"/*; do
        if [ -f "$file" ] && [[ "$file" != "$dir/index.js" ]]; then
          filename=$(basename "$file")
          extension="${filename##*.}"
          name="${filename%.*}"
          
          # Skip non-JS/TS files
          if [[ "$extension" != "js" && "$extension" != "jsx" && "$extension" != "ts" && "$extension" != "tsx" ]]; then
            continue
          fi
          
          echo "export { default as $name } from './$name';" >> "$dir/index.js"
        fi
      done
      
      echo "✓ Created barrel export: $dir/index.js"
    fi
  }
  
  # Create barrels for the new structure
  for feature in auth math-exercises adaptive-learning ai-assistant unity-integration; do
    for subdir in components hooks services utils; do
      create_barrel "./src/features/$feature/$subdir"
    done
  done
  
  # Create barrels for shared directories
  for subdir in components hooks utils context; do
    create_barrel "./src/shared/$subdir"
  done
  
  echo "✓ Barrel exports created for easier imports"
}

# Step 6: Create path aliases config
create_path_aliases() {
  print_header "SETTING UP PATH ALIASES"
  echo "Creating/updating jsconfig.json for path aliases..."
  
  cat > ./jsconfig.json << EOL
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/features/*": ["./src/features/*"],
      "@/auth/*": ["./src/features/auth/*"],
      "@/math/*": ["./src/features/math-exercises/*"],
      "@/adaptive/*": ["./src/features/adaptive-learning/*"],
      "@/ai-assistant/*": ["./src/features/ai-assistant/*"],
      "@/unity/*": ["./src/features/unity-integration/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/components/*": ["./src/shared/components/*"],
      "@/hooks/*": ["./src/shared/hooks/*"],
      "@/utils/*": ["./src/shared/utils/*"],
      "@/context/*": ["./src/shared/context/*"],
      "@/styles/*": ["./src/shared/styles/*"],
      "@/app/*": ["./src/app/*"]
    }
  },
  "include": ["src/**/*", "pages/**/*", "components/**/*"]
}
EOL
  
  echo "✓ Path aliases configured in jsconfig.json"
  
  # Update vite.config.js if it exists
  if [ -f "./vite.config.js" ]; then
    echo "Updating path aliases in vite.config.js..."
    # This is a placeholder - in a real script, you would use sed to modify the file
    # or create a more sophisticated approach to update the Vite config
    echo "NOTE: Please manually update your vite.config.js to include these path aliases."
  fi
}

# Main execution flow
print_header "WINDGAP ACADEMY RESTRUCTURING TOOL"
echo "This tool will guide you through restructuring the project into a"
echo "more maintainable, feature-based architecture."
echo ""
echo "The process includes:"
echo "  1. Creating a backup of the current structure"
echo "  2. Setting up a new feature-based directory structure"
echo "  3. Consolidating authentication files"
echo "  4. Consolidating math exercise files"
echo "  5. Consolidating adaptive learning files"
echo "  6. Creating barrel exports for cleaner imports"
echo "  7. Setting up path aliases for simpler imports"
echo ""

read -p "Would you like to proceed? (y/n): " start_confirm
if [[ $start_confirm == [yY] || $start_confirm == [yY][eE][sS] ]]; then
  mkdir -p ./tmp
  create_backup
  create_structure
  consolidate_auth
  consolidate_math
  consolidate_adaptive
  create_barrels
  create_path_aliases
  
  print_header "RESTRUCTURING COMPLETED"
  echo "The project has been restructured with a feature-based organization."
  echo ""
  echo "Next steps:"
  echo "1. Test the new structure thoroughly"
  echo "2. Update imports in your code to use the new path aliases"
  echo "3. Once verified, remove duplicate files from the old structure"
  echo ""
  echo "To use the new optimized workspace, run:"
  echo "code optimized-dev.code-workspace"
else
  echo "Restructuring cancelled. No changes were made."
fi