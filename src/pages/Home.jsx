import { motion } from 'framer-motion'
import { Shield, Lock, Brain, Link2, Fingerprint, Activity, Server } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8, ease: [0.0, 0.9, 0.1, 1.0] } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.15 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.0, 0.9, 0.1, 1.0] } },
}

function Home() {
  const navigate = useNavigate()

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="home-container">
      {/* ===== HERO ===== */}
      <section className="hero-section">
        <motion.div className="hero-content" variants={stagger} initial="initial" animate="animate">
          
          <motion.div variants={fadeUp} className="hero-badge">
            <span className="indicator" /> SYSTEM_ONLINE // STATUS: SECURE
          </motion.div>

          <motion.h1 variants={fadeUp} className="hero-title">
            ZERO TRUST.<br />
            ABSOLUTE <span className="gradient-text">CONTROL.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="hero-subtitle">
            QuantumVault X architecture forces strict cryptographic boundaries. 
            AI-driven threat analysis meets immutable blockchain ledgers. 
            Data isolation is mathematical certainty.
          </motion.p>

          <motion.div variants={fadeUp} className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/vault')}>
              INITIALIZE_VAULT
            </button>
            <button className="btn-secondary" onClick={() => navigate('/analysis')}>
              [ RUN_SCANNER ]
            </button>
          </motion.div>

        </motion.div>

        {/* Abstract Quantum Core Visual */}
        <motion.div 
          className="quantum-core-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.0, 0.9, 0.1, 1.0] }}
        >
          <div className="core-ring outer"></div>
          <div className="core-ring middle"></div>
          <div className="core-ring inner"></div>
          <div className="core-center">
            <div className="core-pulse"></div>
            <Lock size={32} className="core-icon" />
          </div>
          
          {/* Data Lines intersecting */}
          <div className="data-line horizontal"></div>
          <div className="data-line vertical"></div>
          <div className="data-line diag-1"></div>
          <div className="data-line diag-2"></div>
        </motion.div>
      </section>

      {/* ===== BENTO BOX FEATURES ===== */}
      <section className="page-section">
        <div className="bento-grid">
          
          {/* Main Feature - AI */}
          <motion.div className="bento-card bento-large glass-panel" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <div className="bento-content">
              <div className="bento-icon"><Brain size={32} /></div>
              <h3>Neural Threat Detection</h3>
              <p>Real-time heuristic analysis intercepts zero-day payloads before they breach the perimeter.</p>
              <div className="bento-meta">
                <span className="meta-tag">MODELS: 3 ACTIVE</span>
                <span className="meta-tag">LATENCY: 12ms</span>
              </div>
            </div>
            <div className="bento-visual ai-visual">
              <div className="scan-bar"></div>
            </div>
          </motion.div>

          {/* Secondary - Encryption */}
          <motion.div className="bento-card glass-panel" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <div className="bento-content">
              <div className="bento-icon"><Shield size={24} /></div>
              <h4>Quantum Resistance</h4>
              <p>AES-256-GCM combined with post-quantum lattice cryptography.</p>
            </div>
          </motion.div>

          {/* Secondary - Blockchain */}
          <motion.div className="bento-card glass-panel" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <div className="bento-content">
              <div className="bento-icon"><Link2 size={24} /></div>
              <h4>Ledger Verification</h4>
              <p>File state hashes are irreversibly anchored to decentralized nodes.</p>
            </div>
          </motion.div>

          {/* Wide Feature - Terminal */}
          <motion.div className="bento-card bento-wide glass-panel" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <div className="terminal-header">
              <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
              <span className="term-title">qv_shell</span>
            </div>
            <div className="terminal-body">
              <div className="term-line"><span className="prompt">root@qv:~#</span> execute protocol --secure-upload</div>
              <div className="term-line success">[OK] Establishing TLS 1.3 Handshake</div>
              <div className="term-line success">[OK] File fragmented & encrypted</div>
              <div className="term-line info">Distributing across 12 geographic nodes...</div>
              <div className="term-line"><span className="prompt">root@qv:~#</span> <span className="cursor">_</span></div>
            </div>
          </motion.div>

          {/* Small Stats */}
          <motion.div className="bento-card bento-stat glass-panel" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <Activity size={20} className="stat-icon" />
            <div className="stat-val gradient-text">99.999%</div>
            <div className="stat-label">Uptime SLA</div>
          </motion.div>

          <motion.div className="bento-card bento-stat glass-panel" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <Server size={20} className="stat-icon" />
            <div className="stat-val gradient-text">4,281</div>
            <div className="stat-label">Active Nodes</div>
          </motion.div>

          <motion.div className="bento-card bento-stat glass-panel" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <Fingerprint size={20} className="stat-icon" />
            <div className="stat-val gradient-text">FIDO2</div>
            <div className="stat-label">Auth Protocol</div>
          </motion.div>

        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span>[ SYSTEM_ID: QV_X ]</span>
          </div>
          <div className="footer-links">
            <span className="footer-link">SEC_POLICY</span>
            <span className="footer-link">NODE_MAP</span>
            <span className="footer-link">API_DOCS</span>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}

export default Home
