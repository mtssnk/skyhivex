import { MeshGradient } from '@paper-design/shaders-react'
import { useRef, useState, useEffect } from 'preact/hooks'

interface Props {
  colors: [string, string]
}

export default function MeshGradientBackground({ colors }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!wrapperRef.current) return
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width: Math.round(width), height: Math.round(height) })
    })
    obs.observe(wrapperRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={wrapperRef} class="absolute inset-0 z-0" aria-hidden="true">
      {size.width > 0 && (
        <MeshGradient
          className="animate-fade-in"
          width={size.width}
          height={size.height}
          colors={colors}
          distortion={0.72}
          swirl={0}
          grainMixer={0.32}
          grainOverlay={0.21}
          speed={0.2}
          scale={1}
          offsetX={0.4}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  )
}
