import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Fingerprint, Smartphone, Key, Shield, CheckCircle2,
  AlertTriangle, LogOut, Clock, MapPin, Monitor
} from 'lucide-react'
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import tt from '@tomtom-international/web-sdk-maps'
import './Security.css'

const TOMTOM_API_KEY = 'jUUpkLz7dU5NkPJsYoW7GzyfZ9DLD0zq'

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const mfaMethodsTemplate = [
  { id: 'biometric', icon: Fingerprint, title: 'Biometric Authentication', desc: 'Use fingerprint or face recognition for instant secure access.', enabled: false, color: 'var(--accent-cyan)' },
  { id: 'totp', icon: Smartphone, title: 'Authenticator App (TOTP)', desc: 'Time-based one-time passwords via Google Authenticator or Authy.', enabled: false, color: 'var(--accent-magenta)' },
  { id: 'hardware', icon: Key, title: 'Hardware Security Key', desc: 'FIDO2/WebAuthn compatible keys like YubiKey for physical 2FA.', enabled: false, color: 'var(--accent-amber)' },
  { id: 'sms', icon: Smartphone, title: 'SMS Verification', desc: 'Receive a one-time code via SMS. Less secure than other methods.', enabled: false, color: 'var(--text-secondary)' },
]

// Separate component to handle the TomTom Map lifecycle
function SessionMap({ lat, lng }) {
  const mapElement = useRef()

  useEffect(() => {
    if (!mapElement.current) return

    const map = tt.map({
      key: TOMTOM_API_KEY,
      container: mapElement.current,
      center: [lng, lat],
      zoom: 12,
      dragPan: false,
      scrollZoom: false,
      boxZoom: false
    })

    // Add a marker for the location
    const markerElement = document.createElement('div')
    markerElement.className = 'map-marker'
    markerElement.style.width = '20px'
    markerElement.style.height = '20px'
    markerElement.style.backgroundColor = 'var(--accent-cyan)'
    markerElement.style.borderRadius = '50%'
    markerElement.style.boxShadow = '0 0 15px var(--accent-cyan)'
    markerElement.style.border = '2px solid #fff'

    new tt.Marker({ element: markerElement })
      .setLngLat([lng, lat])
      .addTo(map)

    return () => map.remove()
  }, [lat, lng])

  return (
    <div 
      ref={mapElement} 
      className="session-map-container" 
      style={{ 
        width: '100%', 
        height: '150px', 
        borderRadius: '8px', 
        overflow: 'hidden', 
        marginTop: '16px', 
        border: '1px solid rgba(0, 240, 255, 0.2)',
        filter: 'invert(100%) hue-rotate(180deg) brightness(80%) contrast(120%)'
      }} 
    />
  )
}

function Security() {
  const [methods, setMethods] = useState(mfaMethodsTemplate)
  const [securityScore, setSecurityScore] = useState(0)
  const [sessions, setSessions] = useState([])
  const [activityLog, setActivityLog] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scoreRes = await fetch('/api/security/score')
        const scoreData = await scoreRes.json()
        setSecurityScore(scoreData.score)
        
        setMethods(prev => prev.map(m => ({
          ...m,
          enabled: scoreData.factors.mfaMethods.includes(m.id)
        })))

        const sessionsRes = await fetch('/api/security/sessions')
        const sessionsData = await sessionsRes.json()
        setSessions(sessionsData.sessions)

        const activityRes = await fetch('/api/security/activity')
        const activityData = await activityRes.json()
        setActivityLog(activityData.activities)
        
        // Try to get precise GPS location for the current session
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            setSessions(prevSessions => {
              return prevSessions.map(session => {
                if (session.current) {
                  return {
                    ...session,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    location: 'Precise GPS Location'
                  }
                }
                return session
              })
            })
          }, (error) => {
            console.log('GPS precision denied or unavailable, falling back to IP location.')
          })
        }
        
      } catch (err) {
        console.error('Failed to fetch security data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleMethod = (id) => {
    setMethods(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, enabled: !m.enabled }
      }
      return m
    }))
    setSecurityScore(prev => prev + (methods.find(m => m.id === id).enabled ? -10 : 10))
  }

  const getScoreColor = () => {
    if (securityScore >= 90) return 'var(--accent-emerald)'
    if (securityScore >= 70) return 'var(--accent-cyan)'
    if (securityScore >= 50) return 'var(--accent-amber)'
    return 'var(--accent-magenta)'
  }

  const getActivityIcon = (type) => {
    if (type === 'security') return Shield
    if (type === 'warning') return Monitor
    return Clock
  }

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading Secure Data...</div>

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <section className="page-section">
        <div className="section-header">
          <div className="section-badge"><Shield size={14} /> Security Center</div>
          <h1>Account <span className="gradient-text">Security</span></h1>
          <p>Manage multi-factor authentication, active sessions, and security preferences.</p>
        </div>

        {/* Security score */}
        <motion.div className="security-score-section" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <div className="score-card glass-panel">
            <div className="score-visual">
              <svg viewBox="0 0 120 120" className="score-ring-svg">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke={getScoreColor()}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${securityScore * 3.27} 327`}
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dasharray 1s ease-out' }}
                />
              </svg>
              <div className="score-number">
                <span style={{ color: getScoreColor() }}>{securityScore}</span>
                <small>/100</small>
              </div>
            </div>
            <div className="score-info">
              <h3>Security Score</h3>
              <p>Enable more authentication methods to increase your score.</p>
              <div className="score-checklist">
                <div className="check-item">
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
                  <span>Strong password set</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
                  <span>Email verified</span>
                </div>
                <div className="check-item">
                  {methods.find(m => m.id === 'hardware')?.enabled
                    ? <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
                    : <AlertTriangle size={16} style={{ color: 'var(--accent-amber)' }} />
                  }
                  <span>Hardware key registered</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* MFA Methods */}
        <motion.div className="mfa-section" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <h3 style={{ marginBottom: 20 }}><Fingerprint size={20} style={{ marginRight: 8 }} />Authentication Methods</h3>
          <div className="mfa-grid">
            {methods.map((m, i) => (
              <motion.div
                key={m.id}
                className={`mfa-card glass-panel ${m.enabled ? 'enabled' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="mfa-card-top">
                  <div className="mfa-icon" style={{ background: `${m.color}15`, color: m.color }}>
                    <m.icon size={24} />
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={m.enabled}
                      onChange={() => toggleMethod(m.id)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <h4>{m.title}</h4>
                <p>{m.desc}</p>
                <div className="mfa-status">
                  {m.enabled
                    ? <span style={{ color: 'var(--accent-emerald)' }}><CheckCircle2 size={14} /> Active</span>
                    : <span style={{ color: 'var(--text-tertiary)' }}>Disabled</span>
                  }
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Active sessions */}
        <motion.div className="sessions-section" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <h3 style={{ marginBottom: 20 }}><Monitor size={20} style={{ marginRight: 8 }} />Active Sessions</h3>
          {sessions.map((s, i) => (
            <motion.div
              key={i}
              className="session-row glass-panel"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="session-info">
                  <Monitor size={18} style={{ color: s.current ? 'var(--accent-cyan)' : 'var(--text-secondary)' }} />
                  <div>
                    <div className="session-device">
                      {s.device}
                      {s.current && <span className="badge badge-secure" style={{ marginLeft: 8, fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-cyan)' }}>Current</span>}
                    </div>
                    <div className="session-meta">
                      <MapPin size={12} /> {s.location} · {s.ip} · {s.lastActive}
                    </div>
                  </div>
                </div>
                {!s.current && (
                  <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                    <LogOut size={14} /> Revoke
                  </button>
                )}
              </div>
              
              {/* TomTom Map Integration */}
              {s.lat && s.lng && (
                <SessionMap lat={s.lat} lng={s.lng} />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Activity log */}
        <motion.div className="activity-section" variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <h3 style={{ marginBottom: 20 }}><Clock size={20} style={{ marginRight: 8 }} />Security Activity</h3>
          <div className="activity-timeline">
            {activityLog.map((a, i) => {
              const Icon = getActivityIcon(a.type)
              return (
                <motion.div
                  key={i}
                  className="activity-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className={`activity-dot ${a.type}`}>
                    <Icon size={14} />
                  </div>
                  <div className="activity-content">
                    <span className="activity-action">{a.action}</span>
                    <span className="activity-time">{a.time}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>
    </motion.div>
  )
}

export default Security
