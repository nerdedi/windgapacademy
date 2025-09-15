# Unity Integration for Windgap Academy

## Quick Start

1. **Install Unity Hub** and **Unity 2023.2 LTS**
2. **Create new Unity project** with 3D (URP) template
3. **Copy the provided C# scripts** to your Unity project
4. **Build for WebGL** platform
5. **Copy build files** to `public/unity-builds/windgap-academy/`

## File Structure

```
public/unity-builds/windgap-academy/
├── Build/
│   ├── windgap-academy.data
│   ├── windgap-academy.framework.js
│   ├── windgap-academy.wasm
│   └── windgap-academy.loader.js
└── TemplateData/
    └── style.css
```

## Testing

- Test page: http://localhost:3000/unity-builds/test.html
- Main integration: Launch any Unity experience from the 3D Experiences page

## Scripts

- `npm run unity:setup` - Run this setup script
- `npm run unity:test` - Instructions for testing
- `npm run unity:copy` - Instructions for copying build files

## Unity Project Setup

1. Create Unity project with these settings:
   - Template: 3D (URP)
   - Platform: WebGL
   - Compression: Brotli
   - Memory: 512MB

2. Copy these scripts to your Unity project:
   - GameManager.cs → Assets/\_Project/Scripts/Core/
   - CharacterController.cs → Assets/\_Project/Scripts/Characters/
   - NatalieController.cs → Assets/\_Project/Scripts/Characters/
   - AnimationManager.cs → Assets/\_Project/Scripts/Animation/

3. Build Settings:
   - File → Build Settings
   - Platform: WebGL
   - Player Settings → Publishing Settings → Compression Format: Brotli
   - Build

4. Copy build output to `public/unity-builds/windgap-academy/`

## Troubleshooting

- **Build fails**: Check Unity console for errors
- **WebGL not loading**: Check browser console for errors
- **Files not found**: Verify file paths match exactly
- **Performance issues**: Reduce quality settings in Unity

For detailed implementation guide, see: unity-implementation-guide.md
