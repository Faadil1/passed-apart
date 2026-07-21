import { useEffect, useRef, useState } from 'react'
import './artifact.css'
import { ArtifactScene, type ArtifactSceneProps } from './ArtifactScene'

export interface MasterSpineArtifactProps {
  pageMode?: boolean
  onInteractionStart?: () => void
}

export function MasterSpineArtifact({ pageMode = false, onInteractionStart }: MasterSpineArtifactProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragProgress, setDragProgress] = useState(0)
  const [isPressed, setIsPressed] = useState(false)
  const initialX = useRef(0)
  const hasEmittedInteraction = useRef(false)

  // Get current URL params
  const params = new URLSearchParams(window.location.search)
  const captureParam = params.get('capture')
  const capturePageParam = params.get('capture-page')
  const effectiveCaptureParam = capturePageParam || captureParam

  // Derive capture mode and mobile flag from URL
  const captureMode = !!effectiveCaptureParam
  const isMobileCapture = effectiveCaptureParam && effectiveCaptureParam.includes('mobile')
  const isMobile = isMobileCapture || window.innerWidth <= 640
  const capturePage = effectiveCaptureParam

  // Set document title and validate on first mount
  useEffect(() => {
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

    // Set progress based on capture mode
    if (effectiveCaptureParam) {
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
  }, [effectiveCaptureParam])

  // Signal that capture is ready (used by capture scripts)
  useEffect(() => {
    if (captureMode && containerRef.current) {
      // Mark as ready after state has settled
      containerRef.current.setAttribute('data-capture-ready', 'true')
    }
  }, [captureMode, dragProgress])

  // Coordinate system and module definitions
  const moduleTopY = 450
  const moduleWidth = 180
  const moduleHeight = 240
  const moduleSpacing = 40
  const moduleStartX = 200
  const spineHandleX = moduleStartX - 140

  const modules = [
    { x: moduleStartX, label: 'M1' },
    { x: moduleStartX + moduleWidth + moduleSpacing, label: 'M2' },
    { x: moduleStartX + 2 * (moduleWidth + moduleSpacing), label: 'M3' },
    { x: moduleStartX + 3 * (moduleWidth + moduleSpacing), label: 'M4' },
  ]

  // Geometric landmarks
  const m1EntranceX = modules[0].x
  const m1ExitX = modules[0].x + moduleWidth
  const m2EntranceX = modules[1].x
  const m2ExitX = modules[1].x + moduleWidth
  const m3EntranceX = modules[2].x
  const initialTipX = spineHandleX + 20

  // State calculation - MUST be defined here before use in module position calculations
  const calculateState = (progress: number) => {
    progress = Math.max(0, Math.min(1, progress))

    let tipX = initialTipX
    let module2ShiftX = 0
    let module2RotZ = 0
    let gapExpansion = 0
    let spineBend = 0

    if (progress < 0.2) {
      const phase1 = progress / 0.2
      tipX = initialTipX + (m1EntranceX - initialTipX) * phase1
    } else if (progress < 0.45) {
      const phase2 = (progress - 0.2) / 0.25
      tipX = m1EntranceX + (m1ExitX - m1EntranceX) * phase2
    } else if (progress < 0.7) {
      const phase3 = (progress - 0.45) / 0.25
      tipX = m1ExitX + (m2ExitX - m1ExitX) * phase3
    } else if (progress < 0.82) {
      const phase4a = (progress - 0.7) / 0.12
      tipX = m2ExitX + (m3EntranceX - m2ExitX) * phase4a
    } else {
      tipX = m3EntranceX
      const phase4b = (progress - 0.82) / 0.18
      module2ShiftX = phase4b * 24
      module2RotZ = phase4b * 3.5
      gapExpansion = phase4b * 32
      spineBend = phase4b * 6
    }

    const hasContactedModule3 = tipX >= m3EntranceX
    const deformationMultiplier = hasContactedModule3 ? 1 : 0

    return {
      tipX,
      spineX: tipX - 20,
      module2ShiftX: module2ShiftX * deformationMultiplier,
      module2RotZ: module2RotZ * deformationMultiplier,
      gapExpansion: gapExpansion * deformationMultiplier,
      spineBend: spineBend * deformationMultiplier,
      hasContactedModule3,
      phase: progress < 0.2 ? 1 : progress < 0.45 ? 2 : progress < 0.7 ? 3 : progress < 0.82 ? 4 : 5,
    }
  }

  const state = calculateState(dragProgress)

  // Tunnel axis: centered vertically inside each module
  const tunnelAxisY = moduleTopY + moduleHeight / 2
  const spineY = tunnelAxisY
  const misregistrationOffset = 14
  const apertureWidth = 36
  const apertureHeight = 36

  // Module 2 and 3 position calculations (now calculateState is defined)
  const module2BaseX = modules[1].x
  const module2FinalX = dragProgress >= 0.82 ? module2BaseX + state.module2ShiftX : module2BaseX

  const module3BaseX = modules[2].x
  const module3FinalX = dragProgress >= 0.82 ? module3BaseX + state.gapExpansion : module3BaseX

  const handlePointerDown = (e: React.PointerEvent) => {
    if (captureMode) return
    if (!hasEmittedInteraction.current && onInteractionStart) {
      hasEmittedInteraction.current = true
      onInteractionStart()
    }
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

  // Geometry props for ArtifactScene
  const geometryProps: ArtifactSceneProps = {
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
    isMobile,
    capturePage,
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
      <ArtifactScene {...geometryProps} />
    </div>
  )
}

