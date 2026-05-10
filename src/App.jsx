import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AmbientBackground from './components/AmbientBackground'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Vault from './pages/Vault'
import Verify from './pages/Verify'
import Analysis from './pages/Analysis'
import Security from './pages/Security'

function App() {
  const location = useLocation()

  return (
    <>
      <AmbientBackground />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/security" element={<Security />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  )
}

export default App
