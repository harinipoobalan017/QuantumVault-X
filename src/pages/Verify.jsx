import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Link2, CheckCircle2, Clock, Hash, Database, Globe,
  Activity, Server, Shield, RefreshCw, AlertTriangle
} from 'lucide-react'
import './Verify.css'

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const nodes = [
  { name: 'US-East-1', status: 'online', latency: '12ms', load: 34 },
  { name: 'EU-West-1', status: 'online', latency: '28ms', load: 52 },
  { name: 'AP-South-1', status: 'online', latency: '45ms', load: 18 },
  { name: 'US-West-2', status: 'online', latency: '15ms', load: 67 },
  { name: 'EU-Central-1', status: 'warning', latency: '89ms', load: 88 },
  { name: 'AP-East-1', status: 'online', latency: '52ms', load: 41 },
]

function Verify() {
  const [verifyHash, setVerifyHash] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState(null)
  const [networkStatus, setNetworkStatus] = useState(null)
  const [recentBlocks, setRecentBlocks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchStatus = async () => {
    try {
      const [statusRes, blocksRes] = await Promise.all([
        fetch('/api/blockchain/status'),
        fetch('/api/blockchain/blocks')
      ])
      const statusData = await statusRes.json()
      const blocksData = await blocksRes.json()
      
      setNetworkStatus(statusData)
      setRecentBlocks(blocksData.blocks)
    } catch (err) {
      console.error('Failed to fetch blockchain data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 12000)
    return () => clearInterval(interval)
  }, [])

  const handleVerify = async () => {
    if (!verifyHash.trim()) return
    setVerifying(true)
    setVerifyResult(null)
    
    try {
      const res = await fetch('/api/blockchain/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash: verifyHash })
      })
      const data = await res.json()
      
      // Simulate slight delay for dramatic effect
      setTimeout(() => {
        setVerifying(false)
        if (data.verified) {
          setVerifyResult({
            valid: true,
            block: data.block,
            chain: data.chain,
            timestamp: data.timestamp,
            confirmations: data.confirmations,
          })
        } else {
          setVerifyResult({ valid: false })
        }
      }, 1500)
    } catch (err) {
      setVerifying(false)
      setVerifyResult({ valid: false, error: true })
    }
  }

  if (loading || !networkStatus) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Syncing Ledger...</div>

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <section className="page-section">
        <div className="section-header">
          <div className="section-badge"><Link2 size={14} /> Blockchain Ledger</div>
          <h1>On-Chain <span className="gradient-text">Verification</span></h1>
          <p>Every file hash is anchored to a decentralized ledger for immutable proof of integrity.</p>
        </div>

        {/* Network stats */}
        <motion.div className="chain-stats" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <div className="chain-stat glass-panel">
            <Database size={22} style={{ color: 'var(--accent-cyan)' }} />
            <div className="stat-value gradient-text">{networkStatus.blockHeight.toLocaleString()}</div>
            <div className="stat-label">Block Height</div>
          </div>
          <div className="chain-stat glass-panel">
            <Activity size={22} style={{ color: 'var(--accent-emerald)' }} />
            <div className="stat-value" style={{ color: 'var(--accent-emerald)' }}>{networkStatus.networkStatus.toUpperCase()}</div>
            <div className="stat-label">Network Status</div>
          </div>
          <div className="chain-stat glass-panel">
            <Server size={22} style={{ color: 'var(--accent-magenta)' }} />
            <div className="stat-value gradient-text">{networkStatus.nodesOnline}/{networkStatus.totalNodes}</div>
            <div className="stat-label">Nodes Online</div>
          </div>
          <div className="chain-stat glass-panel">
            <Shield size={22} style={{ color: 'var(--accent-amber)' }} />
            <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>{networkStatus.gasPrice}</div>
            <div className="stat-label">Gas Price</div>
          </div>
        </motion.div>

        {/* Verify input */}
        <motion.div className="verify-box glass-panel" style={{ borderColor: 'var(--border-strong)', boxShadow: '0 0 30px rgba(0, 240, 255, 0.05)' }} variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <h3><Hash size={20} /> Verify File Integrity</h3>
          <p>Enter a file hash or transaction ID to verify its on-chain status.</p>
          <div className="verify-input-row">
            <input
              type="text"
              placeholder="Enter file hash (0x...) or transaction ID"
              value={verifyHash}
              onChange={(e) => setVerifyHash(e.target.value)}
              className="verify-input"
            />
            <button
              className="btn-primary"
              onClick={handleVerify}
              disabled={verifying}
            >
              {verifying ? <RefreshCw size={18} className="spin" /> : <><CheckCircle2 size={18} /> Verify</>}
            </button>
          </div>

          {verifyResult && (
            <motion.div
              className="verify-result"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.4 }}
              style={{ background: verifyResult.valid ? 'rgba(0, 255, 102, 0.05)' : 'rgba(255, 0, 60, 0.05)', borderColor: verifyResult.valid ? 'rgba(0, 255, 102, 0.2)' : 'rgba(255, 0, 60, 0.2)' }}
            >
              {verifyResult.valid ? (
                <>
                  <div className="result-header">
                    <CheckCircle2 size={24} style={{ color: 'var(--accent-emerald)' }} />
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>VERIFIED — File integrity confirmed</span>
                  </div>
                  <div className="result-grid">
                    <div className="result-item">
                      <span className="result-label">Chain</span>
                      <span className="result-value">{verifyResult.chain}</span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Block</span>
                      <span className="result-value">#{verifyResult.block.toLocaleString()}</span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Confirmations</span>
                      <span className="result-value">{verifyResult.confirmations}</span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Timestamp</span>
                      <span className="result-value">{new Date(verifyResult.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="result-header">
                  <AlertTriangle size={24} style={{ color: 'var(--accent-magenta)' }} />
                  <span style={{ color: 'var(--accent-magenta)', fontWeight: 700 }}>INVALID — Hash not found on ledger</span>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Recent blocks */}
        <motion.div className="blocks-section" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <h3 style={{ marginBottom: 20 }}>Recent Blocks</h3>
          <div className="blocks-list">
            {recentBlocks.map((block, i) => (
              <motion.div
                key={block.id}
                className="block-row glass-panel"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="block-id">
                  <Database size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <span className="gradient-text">#{block.id.toLocaleString()}</span>
                </div>
                <div className="block-hash" title={block.hash}>
                  {block.hash.slice(0, 10)}...{block.hash.slice(-8)}
                </div>
                <div className="block-meta">
                  <span>{block.txCount} txns</span>
                  <span>{block.filesAnchored} files</span>
                </div>
                <div className="block-time">
                  <Clock size={14} />
                  {block.timestamp}
                </div>
                <span className="badge badge-secure" style={{ background: 'rgba(0, 255, 102, 0.1)', color: 'var(--accent-emerald)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>
                  <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px' }} /> Confirmed
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Node status */}
        <motion.div className="nodes-section" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <h3 style={{ marginBottom: 20 }}>
            <Globe size={20} style={{ marginRight: 8 }} />
            Global Node Network
          </h3>
          <div className="nodes-grid">
            {nodes.map((node, i) => (
              <motion.div
                key={node.name}
                className="node-card glass-panel"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="node-header">
                  <Server size={18} />
                  <span className="node-name">{node.name}</span>
                  <span className="status-dot" style={{ background: node.status === 'online' ? 'var(--accent-emerald)' : 'var(--accent-amber)', width: 8, height: 8, borderRadius: '50%', boxShadow: `0 0 8px ${node.status === 'online' ? 'var(--accent-emerald)' : 'var(--accent-amber)'}` }} />
                </div>
                <div className="node-details">
                  <div className="node-detail">
                    <span>Latency</span>
                    <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{node.latency}</span>
                  </div>
                  <div className="node-detail">
                    <span>Load</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{node.load}%</span>
                  </div>
                </div>
                <div className="progress-bar" style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                  <div
                    className="progress-fill"
                    style={{
                      height: '100%',
                      width: `${node.load}%`,
                      background: node.load > 80 ? 'var(--accent-amber)' : 'var(--gradient-primary)',
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </motion.div>
  )
}

export default Verify
