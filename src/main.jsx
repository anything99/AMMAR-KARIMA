import React from 'react';
import { createRoot } from 'react-dom/client';
import AeroShards from './AeroShards.jsx';
import './AeroShards-layer.css';

const root = document.getElementById('aero-shards-root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <AeroShards
        shardColor="#896ABD"
        accentColor="#A855F7"
        backgroundColor="transparent"
        placement="full"
        material="glass"
        markers="plus"
        count={1300}
        depthOfField={0.75}
        vignette={0.3}
        mouseInteraction
        pulseOnClick
        holdToGather
        lightMode={false}
        shardSize={1}
        spread={1}
        twist={1}
        billow={1}
        speed={1}
        scale={1}
        glow={0.35}
        grain={0.06}
        intro
        mouseStrength={0.6}
        parallax={0.5}
        paused={false}
        dpr={1.35}
        className="aero-shards-love"
      />
    </React.StrictMode>
  );
}
