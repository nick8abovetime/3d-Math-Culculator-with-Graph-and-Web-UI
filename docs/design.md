# 3D Math Calculator - Design Document

## Phase 1: Foundation

### Tech Stack Decisions

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | React 18 + TypeScript | Type safety, component-based architecture |
| Build Tool | Vite | Fast HMR, optimized builds |
| Math Engine | math.js | Comprehensive math expression parsing, symbolic math |
| 3D Graphics | Three.js | Mature 3D library, good React integration (react-three-fiber) |
| Styling | CSS Modules | Scoped styles, no extra dependencies |

**Dependencies to install:**
- `react`, `react-dom` - Core React
- `typescript` - Type safety
- `vite` + `@vitejs/plugin-react` - Build tool
- `mathjs` - Expression parsing and math operations
- `three` - 3D rendering
- `@react-three/fiber` - React bindings for Three.js
- `@react-three/drei` - Useful helpers for R3F

### File Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Root component
├── App.css               # Global styles
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.css
│   ├── InputPanel/
│   │   ├── InputPanel.tsx
│   │   └── InputPanel.css
│   ├── MathInput/
│   │   ├── MathInput.tsx
│   │   └── MathInput.css
│   ├── Viewport2D/
│   │   ├── Viewport2D.tsx
│   │   └── Viewport2D.css
│   ├── Viewport3D/
│   │   ├── Viewport3D.tsx
│   │   └── Viewport3D.css
│   └── History/
│       ├── History.tsx
│       └── History.css
├── hooks/
│   └── useMath.ts        # Math expression evaluation hook
├── utils/
│   └── mathEngine.ts     # math.js wrapper
└── types/
    └── index.ts          # TypeScript interfaces
```

### Component Hierarchy

```
App
├── Header
├── MainContent
│   ├── InputPanel
│   │   ├── MathInput
│   │   └── History
│   └── ViewportContainer
│       ├── Viewport2D (tab)
│       └── Viewport3D (tab)
└── ResultsPanel (collapsible)
```

### UI Layout Details

```
┌─────────────────────────────────────────────────────────────┐
│  3D Math Calculator                    [2D/3D Toggle]      │
├──────────────────────────────────────────┬──────────────────┤
│  INPUT PANEL                             │  VIEWPORT        │
│  ┌────────────────────────────────────┐  │                  │
│  │ f(x) = [expression input____] [✓] │  │   (Three.js      │
│  └────────────────────────────────────┘  │    Canvas)       │
│                                          │                  │
│  HISTORY                                 │                  │
│  • sin(x)                                │                  │
│  • x^2 + 2x + 1                         │                  │
│  • cos(x) * exp(x)                      │                  │
│                                          │                  │
├──────────────────────────────────────────┴──────────────────┤
│  RESULTS: f(x) = sin(x)    [Derivative] [Integrate]        │
│  → Plot displayed in viewport                                 │
└─────────────────────────────────────────────────────────────┘
```

### Key Implementation Notes

1. **MathInput Component**
   - Text input with real-time validation
   - Display syntax errors inline
   - Enter key triggers calculation

2. **Viewport3D Component**
   - Use @react-three/fiber Canvas
   - OrbitControls for rotation/zoom/pan
   - GridHelper for reference plane
   - Function surface created with parametric geometry

3. **State Management**
   - React useState for local component state
   - Lift expression/result state to App level
   - History stored in useState array

4. **Error Handling**
   - Try/catch around math.js evaluation
   - Display user-friendly error messages
   - Highlight invalid input