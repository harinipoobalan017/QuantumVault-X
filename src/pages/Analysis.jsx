import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Brain, Upload, AlertTriangle, CheckCircle2,
  Activity, Cpu, FileSearch, Bug, Eye
} from 'lucide-react'
import './Analysis.css'

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

function Analysis() {
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanResult, setScanResult] = useState(null)
  const [scanStage, setScanStage] = useState('')
  const [aiModels, setAiModels] = useState([])
  const [recentScans, setRecentScans] = useState([])
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef(null)

  const stages = [
    'Initializing AI models...',
    'Extracting file signatures...',
    'Running heuristic analysis...',
    'Deep learning scan in progress...',
    'Behavioral pattern matching...',
    'Cross-referencing threat database...',
    'Generating final report...',
  ]

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('/api/ai/models')
        const data = await res.json()
        setAiModels(data.models)
      } catch (err) {
        console.error('Failed to fetch AI models:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchModels()
  }, [])

  const startScan = async (file) => {
    setScanning(true)
    setScanProgress(0)
    setScanResult(null)

    // Simulate progress while waiting for API
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 8 + 3
      if (progress >= 95) progress = 95
      setScanProgress(progress)
      setScanStage(stages[Math.min(Math.floor(progress / 15), stages.length - 1)])
    }, 150)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/ai/scan', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()

      clearInterval(interval)
      setScanProgress(100)
      setScanStage(stages[stages.length - 1])

      setTimeout(() => {
        setScanning(false)
        setScanResult(data)
        setRecentScans(prev => [data, ...prev].slice(0, 5))
      }, 500)
    } catch (err) {
      console.error('Scan failed:', err)
      clearInterval(interval)
      setScanning(false)
    }
  }

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) startScan(file)
  }

  const getModelIcon = (name) => {
    if (name.includes('Neural')) return Brain
    if (name.includes('Heuri')) return Eye
    return Cpu
  }

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Initializing AI Engines...</div>

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <section className="page-section">
        <div className="section-header">
          <div className="section-badge"><Brain size={14} /> AI Engine</div>
          <h1>AI Malware <span className="gradient-text">Analysis</span></h1>
          <p>Neural network-powered threat detection scans files in real-time using multiple AI models.</p>
        </div>

        {/* AI Models */}
        <motion.div className="ai-models-row" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          {aiModels.map((model, i) => {
            const Icon = getModelIcon(model.name)
            return (
              <motion.div
                key={model.name}
                className="ai-model-card glass-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="model-header">
                  <Icon size={22} style={{ color: 'var(--accent-cyan)' }} />
                  <span className={`status-dot`} style={{ background: model.status === 'active' ? 'var(--accent-emerald)' : 'var(--accent-magenta)', width: 8, height: 8, borderRadius: '50%', boxShadow: `0 0 8px ${model.status === 'active' ? 'var(--accent-emerald)' : 'var(--accent-magenta)'}` }} />
                </div>
                <h4>{model.name}</h4>
                <p className="model-type">{model.type}</p>
                <div className="model-accuracy">
                  <span>Accuracy</span>
                  <span className="gradient-text" style={{ fontWeight: 700 }}>{model.accuracy}%</span>
                </div>
                <div className="progress-bar" style={{ background: 'rgba(255,255,255,0.05)', height: 4, borderRadius: 2, overflow: 'hidden' }}>
                  <div className="progress-fill" style={{ width: `${model.accuracy}%`, background: 'var(--gradient-primary)', height: '100%' }} />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Scanner */}
        <motion.div className="scanner-box glass-panel" style={{ borderColor: 'var(--border-strong)', boxShadow: '0 0 30px rgba(0, 240, 255, 0.05)' }} variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUpload} />

          {!scanning && !scanResult && (
            <div className="scanner-idle" onClick={() => fileInputRef.current?.click()}>
              <div className="scanner-icon-wrap" style={{ background: 'rgba(0, 240, 255, 0.05)', color: 'var(--accent-cyan)' }}>
                <FileSearch size={48} />
              </div>
              <h3>Drop a file to scan</h3>
              <p>Our AI models will analyze it for malware, exploits, and suspicious patterns</p>
              <button className="btn-primary" style={{ marginTop: 20 }}>
                <Upload size={18} /> Select File
              </button>
            </div>
          )}

          {scanning && (
            <div className="scanner-active">
              <div className="scan-visual" style={{ margin: '0 auto 30px', display: 'flex', justifyContent: 'center' }}>
                <Brain size={48} style={{ color: 'var(--accent-cyan)', animation: 'pulse 1s infinite alternate' }} />
              </div>
              <style>{`@keyframes pulse { 0% { transform: scale(1); filter: drop-shadow(0 0 10px var(--accent-cyan)); } 100% { transform: scale(1.1); filter: drop-shadow(0 0 30px var(--accent-cyan)); } }`}</style>
              <h3>Scanning...</h3>
              <p className="scan-stage">{scanStage}</p>
              <div className="progress-bar" style={{ maxWidth: 400, margin: '16px auto', background: 'rgba(255,255,255,0.05)', height: 4, borderRadius: 2 }}>
                <div className="progress-fill" style={{ width: `${scanProgress}%`, background: 'var(--gradient-primary)', height: '100%' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                {Math.min(Math.round(scanProgress), 100)}%
              </span>
            </div>
          )}

          {scanResult && (
            <motion.div className="scan-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={`result-banner`} style={{ background: scanResult.status === 'clean' ? 'rgba(0, 255, 102, 0.05)' : 'rgba(255, 0, 60, 0.05)', border: `1px solid ${scanResult.status === 'clean' ? 'rgba(0, 255, 102, 0.2)' : 'rgba(255, 0, 60, 0.2)'}`, color: scanResult.status === 'clean' ? 'var(--accent-emerald)' : 'var(--accent-magenta)' }}>
                {scanResult.status === 'clean' ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
                <div>
                  <h3 style={{ color: '#fff', marginBottom: 4 }}>{scanResult.status === 'clean' ? 'File is Clean' : 'Threat Detected!'}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {scanResult.fileName} — {scanResult.status === 'clean' ? 'No threats detected' : `${scanResult.threatDetails?.name} identified`}
                  </p>
                </div>
              </div>

              <div className="scan-meta-grid">
                <div className="scan-meta-item">
                  <span className="meta-label">Confidence</span>
                  <span className="meta-value gradient-text">{scanResult.confidence}%</span>
                </div>
                <div className="scan-meta-item">
                  <span className="meta-label">Models</span>
                  <span className="meta-value">{scanResult.models.length}/3 agree</span>
                </div>
                <div className="scan-meta-item">
                  <span className="meta-label">Scan Time</span>
                  <span className="meta-value">{scanResult.scanTime}</span>
                </div>
                <div className="scan-meta-item">
                  <span className="meta-label">Signatures</span>
                  <span className="meta-value">{scanResult.signaturesChecked?.toLocaleString() || 847293}</span>
                </div>
              </div>
              
              <button className="btn-secondary" onClick={() => { setScanResult(null); }} style={{ marginTop: 20 }}>
                Scan Another File
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <motion.div className="recent-scans" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <h3 style={{ marginBottom: 20 }}><Activity size={20} style={{ marginRight: 8 }} />Recent Scans</h3>
            {recentScans.map((scan, i) => (
              <motion.div
                key={i}
                className="scan-row glass-panel"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="scan-file-info">
                  <FileSearch size={18} style={{ color: 'var(--text-secondary)' }} />
                  <span className="scan-filename">{scan.fileName}</span>
                </div>
                <span className={`badge`} style={{ background: scan.status === 'clean' ? 'rgba(0, 255, 102, 0.1)' : 'rgba(255, 0, 60, 0.1)', color: scan.status === 'clean' ? 'var(--accent-emerald)' : 'var(--accent-magenta)', padding: '4px 12px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>
                  {scan.status === 'clean' ? <><CheckCircle2 size={12} style={{display:'inline', marginRight: 4}} /> Clean</> : <><Bug size={12} style={{display:'inline', marginRight: 4}} /> {scan.threatDetails?.name || 'Threat'}</>}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {scan.confidence}%
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>Just now</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </motion.div>
  )
}

export default Analysis
