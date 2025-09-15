# 🎮 WINDGAP ACADEMY UNITY PROJECT ARCHITECTURE

## 📁 PROJECT FOLDER STRUCTURE

```
WindgapAcademyUnity/
├── Assets/
│   ├── _Project/                          # Main project assets
│   │   ├── Characters/                    # Character models & animations
│   │   │   ├── Natalie/                  # Educator character
│   │   │   │   ├── Models/               # 3D models (FBX)
│   │   │   │   ├── Animations/           # Animation clips
│   │   │   │   ├── Controllers/          # Animator controllers
│   │   │   │   ├── Materials/            # Character materials
│   │   │   │   └── Textures/             # Character textures
│   │   │   ├── Daisy/                    # Student character
│   │   │   ├── Andy/                     # Student character
│   │   │   ├── Winnie/                   # Mascot character
│   │   │   └── Shared/                   # Shared character assets
│   │   │       ├── Scripts/              # Character controller scripts
│   │   │       ├── Prefabs/              # Character prefabs
│   │   │       └── Animations/           # Common animations
│   │   ├── Environments/                  # 3D environments
│   │   │   ├── Academy/                  # Main academy building
│   │   │   │   ├── Classroom/            # Classroom scenes
│   │   │   │   ├── Library/              # Library environment
│   │   │   │   ├── Cafeteria/            # Cafeteria space
│   │   │   │   └── Playground/           # Outdoor areas
│   │   │   ├── Simulations/              # Educational simulations
│   │   │   │   ├── Kitchen/              # Cooking simulation
│   │   │   │   ├── Supermarket/          # Shopping simulation
│   │   │   │   ├── CityBuilder/          # City building
│   │   │   │   └── Zoo/                  # Animal care simulation
│   │   │   └── VirtualSydney/            # Sydney recreation
│   │   ├── UI/                           # User interface assets
│   │   │   ├── Prefabs/                  # UI prefabs
│   │   │   ├── Materials/                # UI materials
│   │   │   ├── Fonts/                    # Typography
│   │   │   └── Icons/                    # UI icons
│   │   ├── Audio/                        # Sound system
│   │   │   ├── Music/                    # Background music
│   │   │   ├── SFX/                      # Sound effects
│   │   │   ├── Voice/                    # Character voices
│   │   │   └── Ambient/                  # Environmental sounds
│   │   ├── Scripts/                      # Core game scripts
│   │   │   ├── Core/                     # Core systems
│   │   │   ├── Characters/               # Character controllers
│   │   │   ├── UI/                       # UI controllers
│   │   │   ├── Audio/                    # Audio management
│   │   │   ├── Networking/               # Web communication
│   │   │   └── Utils/                    # Utility scripts
│   │   ├── Materials/                    # Global materials
│   │   ├── Textures/                     # Global textures
│   │   ├── Prefabs/                      # Global prefabs
│   │   └── Scenes/                       # Unity scenes
│   │       ├── Main/                     # Main scenes
│   │       ├── Lessons/                  # Lesson-specific scenes
│   │       ├── Simulations/              # Simulation scenes
│   │       └── Testing/                  # Development scenes
│   ├── Plugins/                          # Third-party plugins
│   ├── StreamingAssets/                  # Runtime assets
│   └── WebGLTemplates/                   # Custom WebGL templates
├── ProjectSettings/                       # Unity project settings
├── Packages/                             # Package manager
└── UserSettings/                         # User-specific settings
```

## 🎯 ASSET NAMING CONVENTIONS

### Characters

- **Models**: `CHR_[Name]_[Variant].fbx` (e.g., `CHR_Natalie_Educator.fbx`)
- **Animations**: `ANIM_[Character]_[Action].anim` (e.g., `ANIM_Natalie_Wave.anim`)
- **Controllers**: `AC_[Character].controller` (e.g., `AC_Natalie.controller`)

### Environments

- **Scenes**: `ENV_[Location]_[Purpose].unity` (e.g., `ENV_Classroom_Math.unity`)
- **Prefabs**: `PREF_[Type]_[Name].prefab` (e.g., `PREF_Furniture_Desk.prefab`)

### Scripts

- **Controllers**: `[Name]Controller.cs` (e.g., `CharacterController.cs`)
- **Managers**: `[Name]Manager.cs` (e.g., `AnimationManager.cs`)
- **Systems**: `[Name]System.cs` (e.g., `AudioSystem.cs`)

## 🔧 TECHNICAL SPECIFICATIONS

### Unity Version

- **Unity 2023.2 LTS** (Latest stable for WebGL)
- **Universal Render Pipeline (URP)** for optimized web performance
- **WebGL 2.0** target platform

### Performance Targets

- **60 FPS** on modern browsers
- **30 FPS minimum** on older devices
- **< 50MB** initial download size
- **< 5 second** loading time

### Quality Settings

- **High**: Desktop browsers (Chrome, Firefox, Safari)
- **Medium**: Mobile browsers
- **Low**: Older devices/browsers

## 🎨 ANIMATION SPECIFICATIONS

### Character Animation Requirements

- **Idle animations**: Breathing, blinking, subtle movements
- **Locomotion**: Walk, run, turn, stop
- **Gestures**: Point, wave, clap, thumbs up
- **Emotions**: Happy, sad, excited, confused, thinking
- **Educational**: Explain, demonstrate, encourage, correct
- **Accessibility**: Sign language, wheelchair navigation

### Frame Rates

- **Character animations**: 30 FPS
- **UI animations**: 60 FPS
- **Environmental**: 24 FPS

## 🌐 WEBGL OPTIMIZATION

### Build Settings

- **Compression**: Brotli compression enabled
- **Code stripping**: Aggressive stripping
- **Texture compression**: ASTC/DXT formats
- **Audio compression**: Vorbis format

### Memory Management

- **Texture streaming**: Enabled for large environments
- **Audio streaming**: Enabled for music/voice
- **Asset bundles**: For modular content loading
- **Object pooling**: For frequently spawned objects

## 📱 PLATFORM CONSIDERATIONS

### Browser Compatibility

- **Chrome 90+**: Full feature support
- **Firefox 88+**: Full feature support
- **Safari 14+**: Limited WebGL 2.0 support
- **Edge 90+**: Full feature support

### Mobile Support

- **iOS Safari**: Optimized builds
- **Android Chrome**: Performance scaling
- **Touch controls**: Alternative input methods
- **Screen scaling**: Responsive UI design

## 🔄 BUILD PIPELINE

### Development Workflow

1. **Asset Import**: Automated import settings
2. **Quality Assurance**: Automated testing
3. **Build Generation**: Multiple platform builds
4. **Deployment**: Automated upload to web servers
5. **Version Control**: Git LFS for large assets

### Continuous Integration

- **Automated builds**: On code commits
- **Performance testing**: Frame rate monitoring
- **Compatibility testing**: Cross-browser validation
- **Asset validation**: Missing reference detection
