import React, { useState, useRef, useEffect } from 'react'
import SelectSlider from './SelectSlider'
import { VFX } from '@vfx-js/core'
import { useFrame } from '@react-three/fiber'

export default function Slider() {

    const vfx = new VFX()
    const imContainer = useRef({})

    const arr1 = ['im2', 'im1', 'im3']

    const [activeSlide, changeArrIndex] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);


    const clickLeft = () => {
        changeArrIndex((prev) => prev > 0 ? prev - 1 : 0)
    }
    const clickRight = () => {
        changeArrIndex((prev) => prev < arr1.length - 1 ? prev + 1 : prev)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const shader = `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 offset;
    uniform float time;
    uniform float enterTime;
    uniform sampler2D src;

    float nn(float y, float t) {
    // Decay factor: starts at 1, reaches near 0 after 2 seconds
    // float decay = max(0., 1. - t * .5);
    
    float n = (
        sin(y * .5 + t * 15. + sin(y * 2. + t * 20.)) * 1.2 +
        sin(y * 2. + t * 8. + sin(y * 1.5 + t * 18.)) * .8 +
        sin(y * 3.5 + t * 6.) * .6
    );
    n += sin(y * 200. + t * 150.) * sin(y * 1000. - t * 50.) * .4;
    n += sin(y * 500. + t * 300.) * cos(y * 800. + t * 200.) * .2;

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

        // if (enterTime < 1.5) {
        //     float t = 1. - enterTime / 1.5;
        //     uv.x = uv.x > t ? uv.x : t;
        // }
        
        vec2 uvr = uv, uvg = uv, uvb = uv;

        float t = mod(time, 60.);

        float amp = 100. / resolution.x;

        if (abs(nn(uv.y, t)) < 1.) {
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
            smoothstep(0., .9, cr.a + cg.a + cb.a)
        );

        // gl_FragColor = texture2D(src, uv);
    }
    `

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const preloadImages = async () => {
            await Promise.all(arr1.map(item => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = `./images/${item}.png`;
                });
            }));
            setImagesLoaded(true);
        };

        preloadImages();
    }, []);

    useEffect(() => {
        if (!imagesLoaded) return;

        vfx.add(imContainer.current[activeSlide], {
            shader, overflow: 5, uniforms: {
            }
        })

        setTimeout(() => {
            vfx.remove(imContainer.current[activeSlide])
            vfx.destroy(imContainer.current[activeSlide])
        }, 900)

    }, [activeSlide, imagesLoaded])


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div className="max-w-full mx-auto">
            <div className="flex justify-center items-center space-x-10">
                <button onClick={clickLeft} className="border border-black px-3 rounded-2xl max-h-10"> {'<'} </button>
                {arr1.map((item, index) => (
                    <img ref={el => imContainer.current[index] = el} src={`./images/${item}.png`} key={item} className={`bg-pink-700 max-h-[50vh] ${activeSlide === index ? "" : "hidden"}`} />
                ))}
                <button onClick={clickRight} className="border border-black px-3 rounded-2xl max-h-10"> {'>'} </button>
            </div>
            <div className="flex flex-row  max-w-full">
                <SelectSlider imData={arr1} changeArrIndex={changeArrIndex} activeSlide={activeSlide} />
            </div>
        </div>

    )
} 