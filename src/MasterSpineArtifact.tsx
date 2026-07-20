import { useEffect, useRef, useState } from 'react'
import './artifact.css'
import { ArtifactScene, type ArtifactSceneProps } from './ArtifactScene'

export interface MasterSpineArtifactProps {
  pageMode?: boolean
}

export function MasterSpineArtifact({ pageMode = false }: MasterSpineArtifactProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragProgress, setDragProgress] = useState(0)
  const [isPressed, setIsPressed] = useState(false)
  const [captureMode, setCaptureMode] = useState(false)
  const initialX = useRef(0)
  const [isMobile, setIsMobile] = useState(false)

  // Verify artifact identity and set up capture mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const captureParam = params.get('capture')

    // Set document title
    document.title = 'DAY6_MASTER_SPINE_CAPTURE'

    // Verify root element has correct attribute
    const root = document.querySelector('[data-artifact="day-06-master-spine"]')
    if (!root) {
      console.error('CAPTURE ERROR: Root element missing data-artifact="day-06-master-spine"')
      return
    }

    // Assert title
    if (document.title !== 'DAY6_MASTER_SPINE_CAPTURE') {
      console.error('CAPTURE ERROR: Document title is not DAY6_MASTER_SPINE_CAPTURE')
      return
    }

    // Check if mobile viewport
    const isMobileViewport = window.innerWidth <= 640
    setIsMobile(isMobileViewport)

    // Check for both legacy capture param and new capture-page param
    const capturePageParam = params.get('capture-page')
    const effectiveCaptureParam = capturePageParam || captureParam

    if (effectiveCaptureParam) {
      setCaptureMode(true)
      // Map capture parameter to progress value
      if (effectiveCaptureParam === 'initial' || effectiveCaptureParam === 'artifact-initial' || effectiveCaptureParam === 'mobile-initial') {
        setDragProgress(0.00)
      } else if (effectiveCaptureParam === 'success' || effectiveCaptureParam === 'artifact-success') {
        setDragProgress(0.79)
      } else if (effectiveCaptureParam === 'discovery' || effectiveCaptureParam === 'mobile-discovery' || effectiveCaptureParam === 'artifact-discovery' || effectiveCaptureParam === 'cover') {
        setDragProgress(1.00)
      } else if (effectiveCaptureParam === 'opening') {
        setDragProgress(0.00)
      }
    }
  }, [])

  // SVG dimensions and coordinate system
  const moduleTopY = 450
  const moduleWidth = 180
  const moduleHeight = 240
  const moduleSpacing = 40
  const moduleStartX = 200
  const spineHandleX = moduleStartX - 140

  // Modules array must be defined before landmarks
  const modules = [
    { x: moduleStartX, label: 'M1' },
    { x: moduleStartX + moduleWidth + moduleSpacing, label: 'M2' },
    { x: moduleStartX + 2 * (moduleWidth + moduleSpacing), label: 'M3' },
    { x: moduleStartX + 3 * (moduleWidth + moduleSpacing), label: 'M4' },
  ]

  // Geometric landmarks for spine tip travel (depend on modules and spineHandleX)
  const m1EntranceX = modules[0].x
  const m1ExitX = modules[0].x + moduleWidth
  const m2EntranceX = modules[1].x
  const m2ExitX = modules[1].x + moduleWidth
  const m3EntranceX = modules[2].x
  const initialTipX = spineHandleX + 20

  // Deterministic state interpolation based on spine tip position
  const calculateState = (progress: number) => {
    progress = Math.max(0, Math.min(1, progress))

    let tipX = initialTipX
    let module2ShiftX = 0
    let module2RotZ = 0
    let gapExpansion = 0
    let spineBend = 0

    // Phase 1 (0.00-0.20): Approach Module 1
    if (progress < 0.2) {
      const phase1 = progress / 0.2
      tipX = initialTipX + (m1EntranceX - initialTipX) * phase1
    }
    // Phase 2 (0.20-0.45): Traverse Module 1
    else if (progress < 0.45) {
      const phase2 = (progress - 0.2) / 0.25
      tipX = m1EntranceX + (m1ExitX - m1EntranceX) * phase2
    }
    // Phase 3 (0.45-0.70): Traverse gap and Module 2
    else if (progress < 0.7) {
      const phase3 = (progress - 0.45) / 0.25
      tipX = m1ExitX + (m2ExitX - m1ExitX) * phase3
    }
    // Phase 4A (0.70-0.82): Approach Module 3, no deformation
    else if (progress < 0.82) {
      const phase4a = (progress - 0.7) / 0.12
      tipX = m2ExitX + (m3EntranceX - m2ExitX) * phase4a
    }
    // Phase 4B (0.82-1.00): Contact and bind at Module 3
    else {
      tipX = m3EntranceX  // Clamped at entrance
      const phase4b = (progress - 0.82) / 0.18
      module2ShiftX = phase4b * 24
      module2RotZ = phase4b * 3.5
      gapExpansion = phase4b * 32
      spineBend = phase4b * 6
    }

    // Only deform after Module 3 contact
    const hasContactedModule3 = tipX >= m3EntranceX
    const deformationMultiplier = hasContactedModule3 ? 1 : 0

    return {
      tipX,
      spineX: tipX - 20,  // Spine extends 20 units before tip
      module2ShiftX: module2ShiftX * deformationMultiplier,
      module2RotZ: module2RotZ * deformationMultiplier,
      gapExpansion: gapExpansion * deformationMultiplier,
      spineBend: spineBend * deformationMultiplier,
      hasContactedModule3,
      phase: progress < 0.2 ? 1 : progress < 0.45 ? 2 : progress < 0.7 ? 3 : progress < 0.82 ? 4 : 5,
    }
  }

  const state = calculateState(dragProgress)

  const handlePointerDown = (e: React.PointerEvent) => {
    if (captureMode) return
    setIsPressed(true)
    initialX.current = e.clientX
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (captureMode || !isPressed || !containerRef.current) return
    const deltaX = e.clientX - initialX.current
    const deltaY = e.clientY - (containerRef.current?.getBoundingClientRect().top || 0) - (containerRef.current?.clientHeight || 0) / 2

    // For mobile with rotation, project movement onto the spine axis
    if (isMobile) {
      const angle = -42 * Math.PI / 180
      const projectedDelta = deltaX * Math.cos(angle) + deltaY * Math.sin(angle)
      const progress = projectedDelta / 400
      setDragProgress(progress)
    } else {
      const progress = deltaX / 400
      setDragProgress(progress)
    }
  }

  const handlePointerUp = () => {
    if (captureMode) return
    setIsPressed(false)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (captureMode) return

    if (e.key === 'r' || e.key === 'R') {
      setDragProgress(0)
    } else if (pageMode && (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D')) {
      e.preventDefault()
      setDragProgress(prev => Math.min(1, prev + 0.05))
    } else if (pageMode && (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A')) {
      e.preventDefault()
      setDragProgress(prev => Math.max(0, prev - 0.05))
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [captureMode, pageMode, dragProgress])

  // SVG dimensions
  const svgWidth = 1600
  const svgHeight = 900

  // Dynamic viewBox for framing based on capture mode and page context
  let viewBoxX = 0
  let viewBoxY = 0
  let viewBoxWidth = 1600
  let viewBoxHeight = 900
  const params = new URLSearchParams(window.location.search)
  const capturePage = params.get('capture-page')

  // Desktop artifact framing: 78-84% width, 34-42% height
  if (!isMobile && (capturePage === 'artifact-initial' || capturePage === 'artifact-success' || capturePage === 'artifact-discovery')) {
    viewBoxX = 50
    viewBoxY = 320
    viewBoxWidth = 1300
    viewBoxHeight = 390
  }

  // Desktop cover framing: 82-88% width, 36-44% height with full handle visible
  if (!isMobile && capturePage === 'cover') {
    viewBoxX = -50  // Add left padding to show full handle
    viewBoxY = 310
    viewBoxWidth = 1260  // Slightly wider to include left padding
    viewBoxHeight = 400
  }

  // Tunnel axis: centered vertically inside each module
  const tunnelAxisY = moduleTopY + moduleHeight / 2  // 450 + 120 = 570
  const spineY = tunnelAxisY // Spine travels along tunnel axis

  // Module 3 misregistration: offset large enough to block shaft
  const misregistrationOffset = 14  // Causes contact with 12px diameter shaft

  // Aperture dimensions
  const apertureWidth = 36
  const apertureHeight = 36

  // Module positions adjust only after Module 3 contact
  const module2BaseX = modules[1].x
  const module2FinalX = state.hasContactedModule3 ? module2BaseX + state.module2ShiftX : module2BaseX

  const module3BaseX = modules[2].x
  const module3FinalX = state.hasContactedModule3 ? module3BaseX + state.gapExpansion : module3BaseX

  // Apparatus bounds for transform calculations
  const apparatusMinX = spineHandleX - 18  // Left edge of handle
  const apparatusMaxX = modules[3].x + moduleWidth + 8  // Right edge of Module 4 aperture
  const apparatusMinY = moduleTopY
  const apparatusMaxY = moduleTopY + moduleHeight
  const apparatusCenterX = (apparatusMinX + apparatusMaxX) / 2
  const apparatusCenterY = (apparatusMinY + apparatusMaxY) / 2

  // Mobile scale and transform
  const MOBILE_SCALE = 0.3375
  const mobileSceneProps: ArtifactSceneProps = {
    state,
    modules,
    geometry: {
      moduleStartX,
      moduleTopY,
      moduleWidth,
      moduleHeight,
      moduleSpacing,
      spineHandleX,
      spineY,
      tunnelAxisY,
      m3EntranceX,
      misregistrationOffset,
      m1ExitX,
      m1EntranceX,
      m2EntranceX,
      m2ExitX,
      apertureWidth,
      apertureHeight,
      module2BaseX,
      module2FinalX,
      module3BaseX,
      module3FinalX,
    },
  }

  return (
    <div
      ref={containerRef}
      className={`artifact-container ${captureMode ? 'capture-mode' : ''} ${pageMode ? 'page-mode' : ''} ${isMobile ? 'mobile' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      role="region"
      aria-label="Master spine insertion mechanism"
      tabIndex={pageMode ? 0 : -1}
      data-artifact="day-06-master-spine"
    >
      {!isMobile ? (
        // Desktop rendering - unchanged viewBox framing
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
          className="artifact-svg"
          aria-hidden="true"
        >
          <defs>
            {/* Subtle brushed metal texture */}
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.5" />
            </filter>

            {/* Module body gradient - subtle depth */}
            <linearGradient id="moduleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#8a7f75', stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: '#7a7570', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#6a6560', stopOpacity: 1}} />
            </linearGradient>

            {/* Spine gradient - stronger material definition */}
            <linearGradient id="spineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#c8b8a8', stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: '#b8a898', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#a89880', stopOpacity: 1}} />
            </linearGradient>

            {/* Contact cavity shadow */}
            <radialGradient id="contactShadow" cx="50%" cy="30%">
              <stop offset="0%" style={{stopColor: '#000000', stopOpacity: 0.6}} />
              <stop offset="100%" style={{stopColor: '#000000', stopOpacity: 0}} />
            </radialGradient>

            {/* Base gradient */}
            <linearGradient id="baseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#1a1a1a', stopOpacity: 0.7}} />
              <stop offset="100%" style={{stopColor: '#0a0a0a', stopOpacity: 0.3}} />
            </linearGradient>

            {/* Handle gradient */}
            <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#a89880', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#8a7a68', stopOpacity: 1}} />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect width={svgWidth} height={svgHeight} fill="#0a0a0a" />

          {/* Scene geometry */}
          <ArtifactScene {...mobileSceneProps} />
        </svg>
      ) : (
        // Mobile rendering - rotated and scaled scene
        <svg
          viewBox="0 0 390 844"
          width={390}
          height={844}
          className="artifact-svg mobile-svg"
          aria-hidden="true"
        >
          <defs>
            {/* Module body gradient - subtle depth */}
            <linearGradient id="moduleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#8a7f75', stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: '#7a7570', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#6a6560', stopOpacity: 1}} />
            </linearGradient>

            {/* Spine gradient - stronger material definition */}
            <linearGradient id="spineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#c8b8a8', stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: '#b8a898', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#a89880', stopOpacity: 1}} />
            </linearGradient>

            {/* Contact cavity shadow */}
            <radialGradient id="contactShadow" cx="50%" cy="30%">
              <stop offset="0%" style={{stopColor: '#000000', stopOpacity: 0.6}} />
              <stop offset="100%" style={{stopColor: '#000000', stopOpacity: 0}} />
            </radialGradient>

            {/* Base gradient */}
            <linearGradient id="baseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#1a1a1a', stopOpacity: 0.7}} />
              <stop offset="100%" style={{stopColor: '#0a0a0a', stopOpacity: 0.3}} />
            </linearGradient>

            {/* Handle gradient */}
            <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#a89880', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#8a7a68', stopOpacity: 1}} />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect width={390} height={844} fill="#0a0a0a" />

          {/* Mobile scene with rotation and scale transform */}
          <g
            id="mobile-artifact-scene"
            transform={`translate(185 422) rotate(-42) scale(${MOBILE_SCALE}) translate(-${apparatusCenterX} -${apparatusCenterY})`}
          >
            <ArtifactScene {...mobileSceneProps} />
          </g>
        </svg>
      )}
    </div>
  )
}

