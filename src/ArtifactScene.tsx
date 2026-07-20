export interface CalculatedState {
  tipX: number
  spineX: number
  module2ShiftX: number
  module2RotZ: number
  gapExpansion: number
  spineBend: number
  hasContactedModule3: boolean
  phase: number
}

export interface ModuleDefinition {
  x: number
  label: string
}

export interface ArtifactSceneProps {
  state: CalculatedState
  modules: ModuleDefinition[]
  geometry: {
    moduleStartX: number
    moduleTopY: number
    moduleWidth: number
    moduleHeight: number
    moduleSpacing: number
    spineHandleX: number
    spineY: number
    tunnelAxisY: number
    m3EntranceX: number
    misregistrationOffset: number
    m1ExitX: number
    m1EntranceX: number
    m2EntranceX: number
    m2ExitX: number
    apertureWidth: number
    apertureHeight: number
    module2BaseX: number
    module2FinalX: number
    module3BaseX: number
    module3FinalX: number
  }
}

export function ArtifactScene({ state, modules, geometry }: ArtifactSceneProps) {
  const {
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
    module2FinalX,
    module3FinalX,
  } = geometry

  return (
    <g id="artifact-scene">
      {/* Grounding shadow - stronger depth */}
      <ellipse
        cx={moduleStartX + 400}
        cy={moduleTopY + 240}
        rx={550}
        ry={120}
        fill="#000000"
        opacity={0.15}
        data-part="shadow-ground"
      />

      {/* Base surface - with depth gradient */}
      <rect
        x={moduleStartX - 100}
        y={moduleTopY + 140}
        width={900}
        height={160}
        fill="url(#baseGradient)"
        opacity={0.6}
        data-part="base"
      />

      {/* RENDER ORDER: Spine first (will be covered by modules) */}

      {/* Continuous spine shaft from handle through all modules - enhanced with gradient */}
      <line
        x1={spineHandleX}
        y1={spineY}
        x2={state.tipX}
        y2={spineY}
        stroke="url(#spineGradient)"
        strokeWidth={12}
        strokeLinecap="round"
        data-part="spine"
      />

      {/* Spine highlight - 1px machined edge */}
      <line
        x1={spineHandleX}
        y1={spineY - 6}
        x2={state.tipX}
        y2={spineY - 6}
        stroke="#d8c8b8"
        strokeWidth={1}
        opacity={0.4}
        data-part="spine-highlight"
      />

      {/* Spine handle - with depth gradient */}
      <rect
        x={spineHandleX - 18}
        y={spineY - 32}
        width={36}
        height={64}
        fill="url(#handleGradient)"
        stroke="#5a4a38"
        strokeWidth={2}
        rx={2}
        data-part="handle"
      />

      {/* Handle top edge highlight */}
      <line
        x1={spineHandleX - 16}
        y1={spineY - 30}
        x2={spineHandleX + 16}
        y2={spineY - 30}
        stroke="#b8a898"
        strokeWidth={1}
        opacity={0.3}
      />

      {/* Handle grip lines - darker for contrast */}
      <line
        x1={spineHandleX - 16}
        y1={spineY - 20}
        x2={spineHandleX + 16}
        y2={spineY - 20}
        stroke="#8a7a68"
        strokeWidth={2}
        opacity={0.6}
      />
      <line
        x1={spineHandleX - 16}
        y1={spineY}
        x2={spineHandleX + 16}
        y2={spineY}
        stroke="#8a7a68"
        strokeWidth={2}
        opacity={0.6}
      />
      <line
        x1={spineHandleX - 16}
        y1={spineY + 20}
        x2={spineHandleX + 16}
        y2={spineY + 20}
        stroke="#8a7a68"
        strokeWidth={2}
        opacity={0.6}
      />

      {/* Spine tip - enhanced with highlight */}
      <circle cx={state.tipX} cy={spineY} r={6} fill="#a89880" data-part="spine-tip" />
      <circle
        cx={state.tipX}
        cy={spineY}
        r={2}
        fill="#c8b8a8"
        opacity={0.6}
        data-part="spine-tip-highlight"
      />

      {/* Module bodies - render AFTER spine so shaft disappears inside */}
      {modules.map((mod, idx) => {
        let modX = mod.x
        let modY = moduleTopY
        let modRotZ = 0

        // Module 2 shifts and rotates under pressure (only after contact)
        if (idx === 1 && state.phase === 4) {
          modX = module2FinalX
          modRotZ = state.module2RotZ
        }

        // Module 3 moves right as gap expands (only after contact)
        if (idx === 2 && state.phase === 4) {
          modX = module3FinalX
        }

        // Determine tunnel axis for this module
        const moduleTunnelAxisY =
          idx === 2 ? tunnelAxisY + misregistrationOffset : tunnelAxisY
        const apertureY =
          modY + (moduleHeight - apertureHeight) / 2 + (idx === 2 ? misregistrationOffset : 0)

        return (
          <g key={`module-${idx}`} data-part={`module-${idx + 1}`}>
            {/* Module body - with depth and material definition */}
            <g transform={`translate(${modX}, ${modY}) rotate(${modRotZ} ${moduleWidth / 2} ${moduleHeight / 2})`}>
              {/* Main body with gradient */}
              <rect
                x={0}
                y={0}
                width={moduleWidth}
                height={moduleHeight}
                fill="url(#moduleGradient)"
                stroke="#4a4540"
                strokeWidth={2}
              />

              {/* Top edge highlight - 1px machined edge */}
              <line
                x1={1}
                y1={1}
                x2={moduleWidth - 1}
                y2={1}
                stroke="#9a8f85"
                strokeWidth={1}
                opacity={0.5}
              />

              {/* Left edge subtle highlight */}
              <line
                x1={1}
                y1={1}
                x2={1}
                y2={moduleHeight - 1}
                stroke="#8a7f75"
                strokeWidth={1}
                opacity={0.3}
              />

              {/* Left entrance aperture - deeper cavity */}
              <rect
                x={-8}
                y={(moduleHeight - apertureHeight) / 2 + (idx === 2 ? misregistrationOffset : 0)}
                width={apertureWidth + 8}
                height={apertureHeight}
                fill="#1a1510"
                stroke="#3a3530"
                strokeWidth={1}
              />
              <rect
                x={0}
                y={(moduleHeight - apertureHeight) / 2 + (idx === 2 ? misregistrationOffset : 0)}
                width={apertureWidth}
                height={apertureHeight}
                fill="#0a0a08"
              />

              {/* Right exit aperture - matching depth */}
              <rect
                x={moduleWidth + 8}
                y={(moduleHeight - apertureHeight) / 2 + (idx === 2 ? misregistrationOffset : 0)}
                width={apertureWidth}
                height={apertureHeight}
                fill="#0a0a08"
                stroke="#3a3530"
                strokeWidth={1}
              />
              <rect
                x={moduleWidth}
                y={(moduleHeight - apertureHeight) / 2 + (idx === 2 ? misregistrationOffset : 0)}
                width={apertureWidth + 8}
                height={apertureHeight}
                fill="#1a1510"
              />

              {/* Top surface highlight - more prominent */}
              <line
                x1={0}
                y1={10}
                x2={moduleWidth}
                y2={10}
                stroke="#8a7f75"
                strokeWidth={1.5}
                opacity={0.7}
              />
            </g>

            {/* Shadow under shifted module 2 - stronger depth */}
            {idx === 1 && state.module2ShiftX > 1 && (
              <ellipse
                cx={modX + moduleWidth / 2}
                cy={moduleTopY + moduleHeight + 8}
                rx={moduleWidth / 2 + 20}
                ry={14}
                fill="#000000"
                opacity={Math.min(state.module2ShiftX / 25, 0.35)}
              />
            )}

            {/* Expanding gap shadow between Modules 2 and 3 - much more prominent */}
            {idx === 2 && state.gapExpansion > 2 && (
              <>
                {/* Bright gap highlight for visibility */}
                <rect
                  x={modules[1].x + moduleWidth + moduleSpacing}
                  y={moduleTopY + 40}
                  width={state.gapExpansion}
                  height={moduleHeight - 80}
                  fill="#0a0a0a"
                  opacity={Math.min(state.gapExpansion / 35, 0.5)}
                  data-part="gap-shadow"
                />
                {/* Edge highlight in gap */}
                <line
                  x1={modules[1].x + moduleWidth + moduleSpacing}
                  y1={moduleTopY + 50}
                  x2={modules[1].x + moduleWidth + moduleSpacing}
                  y2={moduleTopY + moduleHeight - 50}
                  stroke="#2a2a2a"
                  strokeWidth={1}
                  opacity={Math.min(state.gapExpansion / 40, 0.4)}
                />
              </>
            )}
          </g>
        )
      })}

      {/* Exposed shaft segments AFTER modules (so they appear on top) */}

      {/* Spine visible between Module 1 and Module 2 */}
      {state.tipX > m1ExitX && state.tipX < m2EntranceX && (
        <line
          x1={m1ExitX + 4}
          y1={spineY}
          x2={Math.min(state.tipX, m2EntranceX - 4)}
          y2={spineY}
          stroke="#b8a898"
          strokeWidth={12}
          strokeLinecap="round"
          data-part="spine-gap-1-2"
        />
      )}

      {/* Spine visible between Module 2 and Module 3 */}
      {state.tipX > m2ExitX && (
        <line
          x1={m2ExitX + 4}
          y1={spineY}
          x2={Math.min(state.tipX, m3EntranceX - 4)}
          y2={spineY + state.spineBend * 0.3}
          stroke="#b8a898"
          strokeWidth={12}
          strokeLinecap="round"
          data-part="spine-gap-2-3"
        />
      )}

      {/* Contact shadow at Module 3 aperture (only after collision) - strong focal point */}
      {state.hasContactedModule3 && (
        <>
          {/* Deep contact cavity - primary visual focal point */}
          <ellipse
            cx={m3EntranceX}
            cy={tunnelAxisY + misregistrationOffset}
            rx={14}
            ry={16}
            fill="url(#contactShadow)"
            opacity={Math.min(state.spineBend / 6, 0.6)}
            data-part="collision"
          />
          {/* Contact pressure ring */}
          <circle
            cx={m3EntranceX}
            cy={tunnelAxisY + misregistrationOffset}
            r={10}
            fill="none"
            stroke="#4a4a4a"
            strokeWidth={1}
            opacity={Math.min(state.spineBend / 10, 0.3)}
            data-part="collision-ring"
          />
        </>
      )}
    </g>
  )
}
