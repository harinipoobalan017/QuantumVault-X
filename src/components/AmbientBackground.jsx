import { useEffect, useRef } from 'react'

/*
  QuantumMesh — A high-tech ambient background.
  Draws an intricate 3D-like rotating wireframe sphere/mesh 
  and a field of connected data nodes that react to mouse movement.
*/

const NODE_COUNT = 100
const CONNECTION_RADIUS = 150

function AmbientBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    let mouseX = width / 2
    let mouseY = height / 2

    // Nodes for the background grid
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      z: Math.random() * 2, // simulated depth
    }))

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    let time = 0

    function drawGrid() {
      // Draw a subtle perspective grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)'
      ctx.lineWidth = 1
      ctx.beginPath()
      
      const gridSpacing = 80
      const offsetX = (time * 10) % gridSpacing
      const offsetY = (time * 10) % gridSpacing

      for (let x = -offsetX; x < width; x += gridSpacing) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let y = -offsetY; y < height; y += gridSpacing) {
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()
    }

    function animate() {
      time += 0.01
      
      // Deep dark background
      ctx.fillStyle = '#020205'
      ctx.fillRect(0, 0, width, height)

      drawGrid()

      // Mouse interactive glow
      const glowGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 600)
      glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.04)')
      glowGrad.addColorStop(1, 'rgba(0, 240, 255, 0)')
      ctx.fillStyle = glowGrad
      ctx.fillRect(0, 0, width, height)

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        
        // Base movement
        node.x += node.vx
        node.y += node.vy

        // Parallax effect from mouse
        const dx = mouseX - (width / 2)
        const dy = mouseY - (height / 2)
        const pX = node.x - (dx * 0.05 * node.z)
        const pY = node.y - (dy * 0.05 * node.z)

        // Screen wrap
        if (node.x < 0) node.x = width
        if (node.x > width) node.x = 0
        if (node.y < 0) node.y = height
        if (node.y > height) node.y = 0

        // Draw node
        ctx.fillStyle = `rgba(0, 240, 255, ${0.1 + node.z * 0.2})`
        ctx.fillRect(pX, pY, 2, 2)

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j]
          
          const pbX = nodeB.x - (dx * 0.05 * nodeB.z)
          const pbY = nodeB.y - (dy * 0.05 * nodeB.z)

          const distSq = (pX - pbX) ** 2 + (pY - pbY) ** 2

          if (distSq < CONNECTION_RADIUS ** 2) {
            const dist = Math.sqrt(distSq)
            const opacity = (1 - dist / CONNECTION_RADIUS) * 0.15
            
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(pX, pY)
            ctx.lineTo(pbX, pbY)
            ctx.stroke()
          }
        }
      }

      // Add a scanline overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1)
      }

      requestAnimationFrame(animate)
    }

    const animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

export default AmbientBackground
