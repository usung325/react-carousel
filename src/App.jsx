import { useRef, useState, useEffect } from 'react'
import './App.css'
import Slider from './components/Slider'
import { VFX } from '@vfx-js/core'

function App() {
  const canv = useRef()
  const { initAnimationState, changeAnimationState } = useState(false)
  const vfx = new VFX()

  const shader = `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 offset;
    uniform float time;
    uniform float offsetTime;
    uniform float enterTime;
    uniform sampler2D src;

    void main (void) {
      vec2 uv = (gl_FragCoord.xy - offset) / resolution;

      if (enterTime < offsetTime) {
          float t = 1. - enterTime / offsetTime;
          uv.x = uv.x > t ? uv.x : t;
      }

      gl_FragColor = texture2D(src, uv);
    }
    `

  vfx.add(canv.current, {
    shader, uniforms: {
      offsetTime: 2.5,
    }
  })
  setTimeout(() => {
    vfx.remove(canv.current)
    vfx.destroy(canv.current)
  }, 2500)

  useEffect(() => {

  }, [initAnimationState])

  return (
    <body className="w-screen h-screen mt-24">
      <div ref={canv} >
        <Slider />
      </div>
    </body>
  )
}

export default App
