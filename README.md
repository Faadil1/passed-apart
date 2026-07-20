# PASSED APART — A system-level readiness artifact

## Operational Problem

**Approval is stage-specific. Readiness is system-level.**

Four physical modules have been completed independently. Each module:
- Appears locally finished and undamaged
- Passes individual stage gate review
- Has a visible through-channel for a master spine

When a rigid master spine attempts to traverse and unite all modules into a single system, the incompatibility becomes visible. The spine passes smoothly through modules 1 and 2, but becomes blocked at module 3 due to misregistered channels.

Continued pressure does not resolve the problem—it amplifies the contradiction. Module 2 shifts and rotates under pressure, opening an expanding gap between modules 2 and 3.

## Mechanism

The artifact demonstrates a deterministic four-phase insertion sequence:

1. **Phase 1 (0.00–0.25):** Spine approaches Module 1 with perfect alignment
2. **Phase 2 (0.25–0.50):** Spine passes confidently through Module 1 and enters Module 2
3. **Phase 3 (0.50–0.68):** Spine traverses Module 2 and approaches Module 3
4. **Phase 4 (0.68–1.00):** Spine contacts Module 3 and becomes bound; continued pressure causes Module 2 to shift and a gap to expand

The discovery state shows all four modules visible with:
- Spine fully embedded through modules 1 and 2
- Spine tip blocked at module 3
- Module 2 shifted and tilted under pressure
- Expanding gap between modules 2 and 3
- Dark shadow in the gap

No text, labels, colors, or explanatory UI—the physical contradiction is visually unmistakable.

## Running the Artifact

### Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173` with hot reload.

### Interaction

- **Drag horizontally** (right) to insert the spine
- **Press R** to reset to initial state
- State holds after pointer release; no auto-reset animation

### Viewport Scaling

The SVG scales naturally to any viewport size via `viewBox`. Tested on:
- Desktop: 1600×900 and wider
- Tablet: 768×1024
- Mobile: 390×844 (portrait)
- Thumbnail: 984×849 (square)

## Technical Details

### Stack
- React 18 + TypeScript
- Vite bundler
- SVG rendering
- CSS transforms (no physics engine)

### Key Component: MasterSpineArtifact.tsx

**State Machine:**
```typescript
calculateState(progress: number) {
  // Maps 0-1 drag progress to four interpolated phases:
  // - spineInsertionX: horizontal spine travel
  // - module2ShiftX: Module 2 displacement under pressure
  // - module2RotZ: Module 2 rotation (up to 3.5°)
  // - gapExpansion: Gap between Modules 2 and 3 (up to 32px)
  // - spineBend: Spine deflection (up to 6px)
}
```

**Interaction:**
- `handlePointerDown/Move/Up` captures horizontal drag
- Maps 400px drag distance to 0-1 progress
- R key resets progress to 0

**Rendering:**
- Single SVG with deterministic transforms
- No physics simulation
- 60fps capable

### Design Materials

- **Modules:** Brushed aluminum gray (#8b8680), darker channel (#3a3530)
- **Spine:** Pale tan (#c0b0a0), tan handle (#9a8a78)
- **Base:** Subtle dark surface (#1a1a1a, 0.6 opacity)
- **Background:** Pure black (#0a0a0a)

### Visual Signals

✓ Physical alignment (modules shift)  
✓ Insertion depth (spine travel)  
✓ Material contact (spine tip visible)  
✓ Geometric bind (progress arrested)  
✓ Module displacement (Module 2 rotates/translates)  
✓ Expanding gap (dark space grows)  
✓ Restrained shadow (subtle contact shadow)  

✗ No status colors (red/green/yellow)  
✗ No labels or stage numbers  
✗ No progress indicators or gauges  
✗ No explanatory text inside artifact  

## Evidence Files

### Screenshots
- `01-desktop-initial.png` — Spine outside modules, all finished-looking
- `02-desktop-success.png` — Spine traverses modules 1 and 2 smoothly
- `03-desktop-discovery.png` — Spine blocked at module 3, gap expanding
- `04-mobile-discovery.png` — Portrait viewport (657×693)
- `05-square-discovery.png` — Thumbnail crop (984×849)

### Video
- `master-spine-interaction.gif` — Full drag sequence with visual indicators

### Validation
- `VALIDATION-REPORT.md` — Complete gate assessment and hash verification

All screenshots have unique SHA-256 hashes (not duplicates or scaled versions).

## The Principle

This artifact is a physical metaphor for a common operational failure:

> Each stage approves what it sees locally.  
> No stage owns system-level readiness.  
> Incompatibilities emerge only when all components attempt to work together.

The mechanism is universal across industries:
- Manufacturing: Approved parts that don't assemble
- Software: Component API contracts that collide at runtime
- Logistics: Approved shipments that are incompatible in the same vehicle
- Aerospace: Systems that pass unit tests but fail integration tests

## Design Constraints

The artifact was built under specific constraints:

✓ No classroom demonstration appearance  
✓ No technical diagram or schematic  
✓ Unfamiliar functional apparatus  
✓ Industrial material language  
✓ Three-quarter elevated fixed view  
✓ Modules occupy 70–80% of frame  
✓ All four modules always visible  
✓ No module appears defective initially  
✓ Contradiction invisible before insertion  
✓ Single pointer gesture (horizontal drag)  
✓ Deterministic state machine (not physics simulation)  
✓ Responsive design (desktop to mobile)  

## Files

```
day-06-master-spine/
├── src/
│   ├── MasterSpineArtifact.tsx    Main interaction component
│   ├── Spike.tsx                  Wrapper
│   ├── App.tsx                    Root
│   ├── main.tsx                   Entry
│   ├── artifact.css               Artifact styling
│   ├── App.css                    App styling
│   └── index.css                  Global reset
├── artifacts/
│   ├── screenshots/               5 PNG states
│   ├── video/                     GIF proof
│   └── reports/                   Validation report
├── index.html                     HTML entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .gitignore
└── README.md                      This file
```

## Status

✅ **Artifact Gate: PASSED**

- Visual contradiction is unmistakable
- No text or labels required
- All four modules always visible
- Interaction works on desktop and mobile
- Evidence files verified with unique hashes
- Distinct from prior Day 6 attempts

Ready for full build and presentation.

---

**Public Name:** PASSED APART  
**Mechanism:** Master spine attempting to unite independently-completed modules  
**Problem:** Channel misregistration makes system integration impossible  
**Principle:** Every stage approved its part. The system still could not exist.  
**Status:** Complete and validated
