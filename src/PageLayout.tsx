import { MasterSpineArtifact } from './MasterSpineArtifact'
import { useState } from 'react'
import './page-layout.css'

export function PageLayout() {
  const baseUrl = import.meta.env.BASE_URL
  const [hasInteracted, setHasInteracted] = useState(false)

  const handleArtifactInteraction = () => {
    setHasInteracted(true)
  }

  return (
    <div className="page-layout inspection-experience">
      {/* MOMENT 1: ENCOUNTER - Artifact is the hero */}
      <section className="section section-artifact hero-section">
        <div className="artifact-inspection-frame">
          {/* Restrained inspection label */}
          <div className="inspection-label">
            <h1 className="inspection-title">PASSED APART</h1>
            <p className="inspection-subtitle">A system-level readiness artifact</p>
          </div>

          {/* Interactive artifact */}
          <div className="artifact-frame artifact-hero">
            <MasterSpineArtifact
              pageMode={true}
              onInteractionStart={handleArtifactInteraction}
            />
          </div>

          {/* MOMENT 2: INVITATION - Interaction affordance */}
          {!hasInteracted && (
            <div className="interaction-invitation">
              <p className="invitation-text">Push the master spine</p>
            </div>
          )}
        </div>
      </section>

      {/* MOMENT 4: COLLISION - Annotations reveal after interaction */}
      <section className="section section-collision" data-phase="collision">
        <div className="collision-content">
          <div className="collision-block">
            <h3 className="collision-label">LOCAL APPROVAL</h3>
            <p className="collision-text">
              Each module passed its stage review independently.
            </p>
          </div>
          <div className="collision-block">
            <h3 className="collision-label">SYSTEM READINESS</h3>
            <p className="collision-text">
              The shared reference exposed an incompatibility no local approval detected.
            </p>
          </div>
        </div>
      </section>

      {/* MOMENT 5: OPERATIONAL CONSEQUENCE - Forensic verdict */}
      <section className="section section-verdict">
        <div className="verdict-sequence">
          <div className="verdict-statement">
            <span className="verdict-outcome approved">Approved</span>
            <span className="verdict-separator">—</span>
            <span className="verdict-outcome separate">Separately</span>
          </div>
          <div className="verdict-statement">
            <span className="verdict-outcome bound">Bound</span>
            <span className="verdict-separator">—</span>
            <span className="verdict-outcome together">Together</span>
          </div>
          <div className="verdict-statement">
            <span className="verdict-outcome failed">Failed</span>
            <span className="verdict-separator">—</span>
            <span className="verdict-outcome system">As a System</span>
          </div>
        </div>
      </section>

      {/* Forensic inspection records */}
      <section className="section section-records">
        <div className="records-container">
          <div className="inspection-record">
            <div className="record-stage">Stage 1: Approval</div>
            <img src={`${baseUrl}evidence/initial.png`} alt="Inspection record: initial state, all components passed local review" className="record-image" loading="lazy" />
          </div>
          <div className="inspection-record">
            <div className="record-stage">Stage 2: Integration</div>
            <img src={`${baseUrl}evidence/success.png`} alt="Inspection record: integration phase, spine traverses confidently through first modules" className="record-image" loading="lazy" />
          </div>
          <div className="inspection-record">
            <div className="record-stage">Stage 3: Collision</div>
            <img src={`${baseUrl}evidence/discovery.png`} alt="Inspection record: system-level test reveals incompatibility at module 3" className="record-image" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Core statement - grounding the thesis */}
      <section className="section section-thesis">
        <div className="thesis-content">
          <p className="thesis-statement">
            Every stage approved its part.<br />
            The system still could not exist.
          </p>
        </div>
      </section>
    </div>
  )
}
