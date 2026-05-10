import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Menu, X } from 'lucide-react'
import './Navbar.css'

const navLinks = [
  { path: '/', label: 'SYS_HOME' },
  { path: '/vault', label: 'VAULT_CORE' },
  { path: '/verify', label: 'LEDGER_SYNC' },
  { path: '/analysis', label: 'AI_SCANNER' },
  { path: '/security', label: 'SEC_CONFIG' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <motion.div 
      className="nav-container"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.0, 0.9, 0.1, 1.0] }}
    >
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <NavLink to="/" className="nav-logo">
          <Cpu className="logo-icon" size={24} />
          <span className="logo-text">QV_X</span>
        </NavLink>

        <div className="nav-links-desktop">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end={link.path === '/'}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  className="nav-indicator"
                  layoutId="nav-indicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          <button className="nav-cta" onClick={() => navigate('/vault')}>
            [ INIT_VAULT ]
          </button>
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
                end={link.path === '/'}
              >
                <span className="mobile-link-prefix">{'>'}</span> {link.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Navbar
