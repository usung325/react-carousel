import React, { useState, useRef, useEffect } from 'react'
import SelectSlider from './SelectSlider'
import { VFX } from '@vfx-js/core'
import { useFrame } from '@react-three/fiber'

export default function Slider() {
    const vfx = new VFX()
    const imContainer = useRef()

    const arr1 = ['im1', 'im2', 'im1']

    const [activeSlide, changeArrIndex] = useState(0);
    const clickLeft = () => {
        changeArrIndex((prev) => prev > 0 ? prev - 1 : 0)
    }
    const clickRight = () => {
        changeArrIndex((prev) => prev < arr1.length - 1 ? prev + 1 : prev)
    }
    const shader = `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 offset;
    uniform float time;
    uniform float enterTime;
    uniform sampler2D src;

    float nn(float y, float t) {
        float n = (
            sin(y * .07 + t * 8. + sin(y * .5 + t * 10.)) +
            sin(y * .7 + t * 2. + sin(y * .3 + t * 8.)) * .7 +
            sin(y * 1.1 + t * 2.8) * .4
        );

        n += sin(y * 124. + t * 100.7) * sin(y * 877. - t * 38.8) * .3;

        return n;
    }

    float step2(float t, vec2 uv) {
        return step(t, uv.x) * step(t, uv.y);
    }

    float inside(vec2 uv) {
        return step2(0., uv) * step2(0., 1. - uv);
    }

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;

        if (enterTime < 1.5) {
            float t = 1. - enterTime / 1.5;
            uv.x = uv.x > t ? uv.x : t;
        }

        vec2 uvr = uv, uvg = uv, uvb = uv;

        float t = mod(time, 30.);

        float amp = 10. / resolution.x;

        if (abs(nn(uv.y, t)) > 1.) {
            uvr.x += nn(uv.y, t) * amp;
            uvg.x += nn(uv.y, t + 10.) * amp;
            uvb.x += nn(uv.y, t + 20.) * amp;
        }

        vec4 cr = texture2D(src, uvr) * inside(uvr);
        vec4 cg = texture2D(src, uvg) * inside(uvg);
        vec4 cb = texture2D(src, uvb) * inside(uvb);

        gl_FragColor = vec4(
            cr.r,
            cg.g,
            cb.b,
            smoothstep(.0, 1., cr.a + cg.a + cb.a)
        );

        // gl_FragColor = texture2D(src, uv);
    }
    `
    useEffect(() => {
        vfx.add(imContainer.current, {
            shader, uniforms: {

            }
        })
    }, [activeSlide])

    return (
        <div className="max-w-full mx-auto">
            <div className="flex justify-center items-center space-x-10">
                <button onClick={clickLeft} className="bg-pink-400 px-3 rounded-2xl max-h-10"> {'<'} </button>
                {arr1.map((item, index) => (
                    <img ref={imContainer} src={`./images/${item}.png`} key={item} className={`bg-pink-700 max-h-[50vh] ${activeSlide === index ? "" : "hidden"}`} />
                ))}
                <button onClick={clickRight} className="bg-pink-400 px-3 rounded-2xl max-h-10"> {'>'} </button>
            </div>
            <div className="flex flex-row  max-w-full">
                <SelectSlider imData={arr1} changeArrIndex={changeArrIndex} activeSlide={activeSlide} />
            </div>
        </div>

    )
} 