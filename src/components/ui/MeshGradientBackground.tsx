"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Fragment Shader: Procedural Animated Mesh Gradient
 * Inspired by Stripe's animated background.
 * Uses Simplex Noise for fluid motion.
 */
const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor1; // Primary: #795CF5
uniform vec3 uColor2; // Lighter: #A78BFA
uniform vec3 uColor3; // Darker: #5B21B6
uniform vec3 uColor4; // Accent: #1AD1B9

varying vec2 vUv;

//	Simplex 3D Noise 
//	by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec2 p2 = vec2(a1.xy);
  float p2z = h.z;
  vec3 p3 = vec3(a1.zw,h.w);
  vec3 p2v3 = vec3(p2, p2z);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2v3, p2v3), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2v3 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2v3,x2), dot(p3,x3) ) );
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.1;
  
  // Skew coordinates for diagonal flow
  vec2 skewedUv = uv;
  skewedUv.x += uv.y * 0.6;
  skewedUv.y -= uv.x * 0.2;
  
  // Domain Warping: Distort UVs with noise
  vec2 warp = vec2(
    snoise(vec3(skewedUv * 0.5, t)),
    snoise(vec3(skewedUv * 0.5 + vec2(5.2, 1.3), t))
  ) * 0.45;
  
  vec2 finalUv = skewedUv + warp;
  
  // Layered "Ribbons"
  float ribbon1 = snoise(vec3(finalUv * 1.2, t * 0.5));
  float ribbon2 = snoise(vec3(finalUv * 0.8 + vec2(10.0), t * 0.3));
  float ribbon3 = snoise(vec3(finalUv * 2.0 - vec2(5.0), t * 0.7));
  
  // Base color (Deep Primary)
  vec3 color = uColor3 * 0.8; 
  
  // Color 1: Soft Lighter Waves
  float mask1 = smoothstep(-0.2, 0.3, ribbon1);
  color = mix(color, uColor1, mask1);
  
  // Color 2: Bright Gradient Tendrils
  float mask2 = smoothstep(0.1, 0.7, ribbon2);
  color = mix(color, uColor2, mask2 * 0.9);
  
  // Color 3: Accent Highlights (Cyan)
  float mask3 = smoothstep(0.4, 0.9, ribbon3);
  color = mix(color, uColor4, mask3 * 0.5);
  
  // Add highlight sheen
  float sheen = smoothstep(0.2, 0.5, ribbon1 * ribbon2);
  color += uColor2 * sheen * 0.15;
  
  // Subtle Noise Grain
  float grain = (fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.035;
  color += grain;
  
  // Global vignette
  float dist = distance(uv, vec2(0.5));
  color *= smoothstep(1.6, 0.45, dist);
  
  // Gamma and Contrast
  color = pow(color, vec3(1.0/1.1));
  color = mix(vec3(0.0), color, 1.15); // Slight contrast boost

  gl_FragColor = vec4(color, 1.0);
}
`;


const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * MeshGradientBackground Component
 * Renders a full-screen animated gradient using Three.js and GLSL.
 */
const MeshGradientBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // Setup Scene
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Setup Mesh
        const geometry = new THREE.PlaneGeometry(2, 2);

        // Brand Colors in Normalized RGB
        const uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uColor1: { value: new THREE.Color("#795CF5") }, // Primary
            uColor2: { value: new THREE.Color("#A78BFA") }, // Lighter tint
            uColor3: { value: new THREE.Color("#5B21B6") }, // Darker shade
            uColor4: { value: new THREE.Color("#1AD1B9") }, // Accent
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Animation Loop
        let animationFrameId: number;
        const animate = (time: number) => {
            uniforms.uTime.value = time * 0.001;
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate(0);

        // Resize Handler
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            renderer.setSize(width, height);
            uniforms.uResolution.value.set(width, height);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden"
            aria-hidden="true"
        />
    );
};

export default MeshGradientBackground;
