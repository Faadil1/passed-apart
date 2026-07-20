import { MasterSpineArtifact } from './MasterSpineArtifact'
import './page-layout.css'

export function PageLayout() {
  const baseUrl = import.meta.env.BASE_URL

  return (
    <div className="page-layout">
      {/* SECTION 1: OPENING FRAME */}
      <section className="section section-opening">
        <div className="opening-content">
          <h1 className="opening-title">PASSED APART</h1>
          <p className="opening-subtitle">A system-level readiness artifact</p>
          <p className="opening-problem">
            Every stage approved its part.<br />
            The system still could not exist.
          </p>
          <p className="opening-explanation">
            Compatibility was tested only after local approval had already created commitment.
          </p>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE ARTIFACT */}
      <section className="section section-artifact">
        <div className="artifact-frame">
          <MasterSpineArtifact pageMode={true} />
        </div>
      </section>

      {/* SECTION 3: THE CONTRADICTION */}
      <section className="section section-contradiction">
        <div className="contradiction-content">
          <div className="contradiction-block">
            <h3 className="contradiction-label">LOCAL APPROVAL</h3>
            <p className="contradiction-text">
              Each module could pass independently.
            </p>
          </div>
          <div className="contradiction-block">
            <h3 className="contradiction-label">SYSTEM READINESS</h3>
            <p className="contradiction-text">
              The shared reference exposed an incompatibility no local inspection owned.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: OPERATIONAL CONSEQUENCE */}
      <section className="section section-consequence">
        <div className="consequence-sequence">
          <span className="consequence-step">Approved</span>
          <span className="consequence-arrow">→</span>
          <span className="consequence-step">Integrated</span>
          <span className="consequence-arrow">→</span>
          <span className="consequence-step">Bound</span>
          <span className="consequence-arrow">→</span>
          <span className="consequence-step">Rework</span>
        </div>
      </section>

      {/* SECTION 5: PROOF */}
      <section className="section section-proof">
        <div className="proof-container">
          <div className="proof-strip">
            <div className="proof-state">
              <img src={`${baseUrl}evidence/initial.png`} alt="Initial state: spine outside modules, all finished" className="proof-image" loading="lazy" />
              <p className="proof-label">Finished</p>
            </div>
            <div className="proof-state">
              <img src={`${baseUrl}evidence/success.png`} alt="Success state: spine exits module 2, confident integration" className="proof-image" loading="lazy" />
              <p className="proof-label">Confident</p>
            </div>
            <div className="proof-state">
              <img src={`${baseUrl}evidence/discovery.png`} alt="Discovery state: spine blocked at module 3, contradiction revealed" className="proof-image" loading="lazy" />
              <p className="proof-label">Contradiction</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
