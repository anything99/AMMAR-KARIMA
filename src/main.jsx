import React from 'react';
import { createRoot } from 'react-dom/client';
import AeroShards from './AeroShards.jsx';
import './AeroShards-layer.css';

const root = document.getElementById('aero-shards-root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <AeroShards
        shardColor="#d9c2ff"
        accentColor="#f0b8d8"
        backgroundColor="transparent"
        material="glass"
        count={950}
        shardSize={0.82}
        spread={1.05}
        twist={1.1}
        billow={0.85}
        speed={0.65}
        scale={1}
        depthOfField={0.72}
        glow={0.38}
        grain={0.035}
        vignette={0.24}
        intro={true}
        mouseInteraction={true}
        mouseStrength={0.45}
        markers="dots"
        pulseOnClick={true}
        holdToGather={true}
        parallax={0.42}
        dpr={1.35}
        className="aero-shards-love"
      />
    </React.StrictMode>
  );
}
