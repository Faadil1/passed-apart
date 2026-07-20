import { MasterSpineArtifact } from './MasterSpineArtifact'
import { PageLayout } from './PageLayout'
import './capture-modes.css'

const baseUrl = import.meta.env.BASE_URL

type CapturePage =
  | 'opening'
  | 'artifact-initial'
  | 'artifact-success'
  | 'artifact-discovery'
  | 'cover'
  | 'mobile-initial'
  | 'mobile-discovery'
  | 'proof'

export function Spike() {
  const params = new URLSearchParams(window.location.search)
  const capturePage = params.get('capture-page') as CapturePage | null
  const legacyCapture = params.has('capture')

  // Legacy support: old ?capture parameter redirects to ?capture-page=artifact-initial
  if (legacyCapture && !capturePage) {
    return <MasterSpineArtifact />
  }

  // Render specific capture pages
  if (capturePage === 'opening') {
    return (
      <div className="page-layout capture-page capture-opening">
        <section className="section section-opening">
          <div className="opening-content">
            <h1 className="opening-title">DAY 6</h1>
            <p className="opening-problem">
              Every stage approved its part.<br />
              The system still could not exist.
            </p>
            <p className="opening-explanation">
              Compatibility was tested only after local approval had already created commitment.
            </p>
          </div>
        </section>
      </div>
    )
  }

  if (capturePage === 'artifact-initial') {
    return (
      <div className="page-layout capture-page capture-artifact">
        <section className="section section-artifact">
          <div className="artifact-frame">
            <MasterSpineArtifact pageMode={false} />
          </div>
        </section>
      </div>
    )
  }

  if (capturePage === 'artifact-success') {
    return (
      <div className="page-layout capture-page capture-artifact">
        <section className="section section-artifact">
          <div className="artifact-frame">
            <MasterSpineArtifact pageMode={false} />
          </div>
        </section>
      </div>
    )
  }

  if (capturePage === 'artifact-discovery') {
    return (
      <div className="page-layout capture-page capture-artifact">
        <section className="section section-artifact">
          <div className="artifact-frame">
            <MasterSpineArtifact pageMode={false} />
          </div>
        </section>
      </div>
    )
  }

  if (capturePage === 'cover') {
    return (
      <div className="page-layout capture-page capture-cover">
        <section className="section section-artifact">
          <div className="artifact-frame no-text">
            <MasterSpineArtifact pageMode={false} />
          </div>
        </section>
      </div>
    )
  }

  if (capturePage === 'mobile-initial') {
    return (
      <div className="page-layout capture-page capture-mobile-initial">
        <section className="section section-artifact">
          <div className="artifact-frame">
            <MasterSpineArtifact pageMode={false} />
          </div>
        </section>
      </div>
    )
  }

  if (capturePage === 'mobile-discovery') {
    return (
      <div className="page-layout capture-page capture-mobile-discovery">
        <section className="section section-artifact">
          <div className="artifact-frame">
            <MasterSpineArtifact pageMode={false} />
          </div>
        </section>
      </div>
    )
  }

  if (capturePage === 'proof') {
    return (
      <div className="page-layout capture-page capture-proof">
        <section className="section section-proof">
          <div className="proof-container">
            <div className="proof-strip">
              <div className="proof-state">
                <img src={`${baseUrl}evidence/initial.png`} alt="Initial state: spine outside modules, all finished" className="proof-image" loading="eager" />
                <p className="proof-label">Finished</p>
              </div>
              <div className="proof-state">
                <img src={`${baseUrl}evidence/success.png`} alt="Success state: spine exits module 2, confident integration" className="proof-image" loading="eager" />
                <p className="proof-label">Confident</p>
              </div>
              <div className="proof-state">
                <img src={`${baseUrl}evidence/discovery.png`} alt="Discovery state: spine blocked at module 3, contradiction revealed" className="proof-image" loading="eager" />
                <p className="proof-label">Contradiction</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Default: render normal PageLayout
  return <PageLayout />
}
