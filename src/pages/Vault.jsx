import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Upload, Lock, FileText, Download, Trash2, Shield,
  Eye, HardDrive, Cloud, CheckCircle2, AlertTriangle
} from 'lucide-react'
import './Vault.css'

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

function Vault() {
  const [files, setFiles] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState(false)
  const [selectedAlgo, setSelectedAlgo] = useState('AES-256-GCM')
  const [showEncryptModal, setShowEncryptModal] = useState(false)
  const [encryptProgress, setEncryptProgress] = useState(0)
  const [isEncrypting, setIsEncrypting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filesRes, statsRes] = await Promise.all([
          fetch('/api/vault/files'),
          fetch('/api/vault/stats')
        ])
        
        const filesData = await filesRes.json()
        const statsData = await statsRes.json()
        
        setFiles(filesData.files)
        setStats(statsData)
      } catch (err) {
        console.error('Failed to fetch vault data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      simulateEncrypt(droppedFiles[0])
    }
  }

  const handleFileSelect = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      simulateEncrypt(selected)
    }
  }

  const simulateEncrypt = async (fileObj) => {
    setIsEncrypting(true)
    setShowEncryptModal(true)
    setEncryptProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setEncryptProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15 + 5
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append('file', fileObj) // We need the actual file object now
      formData.append('algorithm', selectedAlgo)

      // Call actual backend
      const res = await fetch('/api/encrypt', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()

      clearInterval(interval)
      setEncryptProgress(100)

      setTimeout(() => {
        setFiles(prev => [
          {
            id: data.fileId,
            name: data.fileName,
            size: data.encryptedSize,
            encrypted: true,
            status: 'secure',
            createdAt: new Date().toISOString().split('T')[0],
            algorithm: data.algorithm,
            hash: data.hash,
          },
          ...prev,
        ])
        // Update stats
        setStats(prev => ({
          ...prev,
          totalFiles: prev.totalFiles + 1,
          encryptedFiles: prev.encryptedFiles + 1
        }))
        setIsEncrypting(false)
        setShowEncryptModal(false)
      }, 600)

    } catch (err) {
      console.error('Encryption failed:', err)
      clearInterval(interval)
      setIsEncrypting(false)
      setShowEncryptModal(false)
    }
  }

  if (loading || !stats) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading Vault...</div>

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <section className="page-section">
        <div className="section-header">
          <div className="section-badge"><Lock size={14} /> Encrypted Vault</div>
          <h1>Your <span className="gradient-text">Secure Vault</span></h1>
          <p>Upload, encrypt, and manage files with military-grade encryption algorithms.</p>
        </div>

        {/* Storage overview */}
        <motion.div className="vault-overview" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <div className="vault-stats-grid">
            <div className="vault-stat glass-panel">
              <HardDrive size={24} style={{ color: 'var(--accent-cyan)' }} />
              <div>
                <div className="stat-value">{stats.encryptedFiles}</div>
                <div className="stat-label">Encrypted Files</div>
              </div>
            </div>
            <div className="vault-stat glass-panel">
              <Cloud size={24} style={{ color: 'var(--accent-magenta)' }} />
              <div>
                <div className="stat-value">{stats.storageUsed} GB</div>
                <div className="stat-label">Storage Used</div>
              </div>
            </div>
            <div className="vault-stat glass-panel">
              <Shield size={24} style={{ color: 'var(--accent-emerald)' }} />
              <div>
                <div className="stat-value">AES-256</div>
                <div className="stat-label">Encryption</div>
              </div>
            </div>
            <div className="vault-stat glass-panel">
              <CheckCircle2 size={24} style={{ color: 'var(--accent-cyan)' }} />
              <div>
                <div className="stat-value">{stats.integrityScore}%</div>
                <div className="stat-label">Integrity</div>
              </div>
            </div>
          </div>

          <div className="storage-bar-container glass-panel">
            <div className="storage-info">
              <span>Storage Usage</span>
              <span className="storage-numbers">{stats.storageUsed} GB / {stats.storageTotal} GB</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(stats.storageUsed / stats.storageTotal) * 100}%`,
                  background: 'var(--gradient-primary)',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          className={`upload-zone glass-panel ${dragging ? 'dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <Upload size={40} style={{ color: 'var(--accent-cyan)', marginBottom: 12 }} />
          <h3>Drop files to encrypt & upload</h3>
          <p>or click to browse — supports any file type up to 500MB</p>

          <div className="algo-selector">
            <label>Algorithm:</label>
            {['AES-256-GCM', 'ChaCha20-Poly1305', 'AES-256-CBC'].map(algo => (
              <button
                key={algo}
                className={`algo-chip ${selectedAlgo === algo ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setSelectedAlgo(algo) }}
              >
                {algo}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Encryption Progress Modal */}
        {showEncryptModal && (
          <motion.div
            className="encrypt-modal glass-panel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ border: '1px solid var(--accent-cyan)', boxShadow: '0 0 30px rgba(0,240,255,0.2)' }}
          >
            <Lock size={28} style={{ color: 'var(--accent-cyan)' }} />
            <h3>Encrypting File...</h3>
            <p>Using {selectedAlgo}</p>
            <div className="progress-bar" style={{ margin: '16px 0', background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(encryptProgress, 100)}%`,
                  background: 'var(--gradient-primary)',
                }}
              />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
              {Math.min(Math.round(encryptProgress), 100)}%
            </span>
          </motion.div>
        )}

        {/* File list */}
        <motion.div
          className="file-list"
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="file-list-header">
            <h3>Vault Contents</h3>
            <span className="file-count">{files.length} files</span>
          </div>

          {files.map((file, i) => (
            <motion.div
              key={file.id}
              className="file-row glass-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="file-info">
                <div className="file-icon-wrap" style={{ background: 'rgba(0,240,255,0.05)', color: 'var(--accent-cyan)' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <div className="file-name">{file.name}</div>
                  <div className="file-meta">
                    {file.size} · {file.createdAt} · <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{file.algorithm}</span>
                  </div>
                  {file.hash && (
                    <div className="file-hash-row" style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <code style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: 4 }}>
                        {file.hash.slice(0, 16)}...{file.hash.slice(-16)}
                      </code>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(file.hash); }}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.65rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                      >
                        Copy Hash
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="file-status">
                {file.status === 'secure' && (
                  <span className="badge badge-secure" style={{ background: 'rgba(0, 255, 102, 0.1)', color: 'var(--accent-emerald)' }}>
                    <CheckCircle2 size={14} /> Secure
                  </span>
                )}
                {file.status === 'scanning' && (
                  <span className="badge badge-scanning" style={{ background: 'rgba(255, 184, 0, 0.1)', color: 'var(--accent-amber)' }}>
                    <AlertTriangle size={14} /> Scanning
                  </span>
                )}
                {file.status === 'pending' && (
                  <span className="badge badge-pending" style={{ background: 'rgba(0, 102, 255, 0.1)', color: 'var(--accent-blue)' }}>
                    <Lock size={14} /> Pending
                  </span>
                )}
              </div>

              <div className="file-actions">
                <button className="icon-btn" title="Download"><Download size={16} /></button>
                <button className="icon-btn" title="Preview"><Eye size={16} /></button>
                <button className="icon-btn danger" title="Delete"><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.div>
  )
}

export default Vault
