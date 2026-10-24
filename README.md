# AMMAR × KARIMA

A cinematic, interactive love-letter experience built with static HTML, CSS, JavaScript and a custom WebGL satin-inspired background. No build step or framework is required.

## Project files
- `index.html`: story structure, star puzzle, memory cards, finale and WebGL background.
- `cinematic.css`: visual system, glass surfaces, floating 3D-style sculptures and responsive motion styling.
- `cinematic.js`: staggered text entrance, scroll reveals, magnetic actions, tilted memory cards, spotlight and click sparks.
- `favicon.svg`: custom heart mark for browser tabs.

## Run locally
Open `index.html` in a modern browser, or serve the folder with any static HTTP server. GitHub Pages can publish the repository directly.

## React Bits attribution
This project adapts interaction patterns from the free [React Bits](https://reactbits.dev/get-started/index) library by David Haz, especially Split Text, Scroll Reveal, Magnet, Tilted Card, Spotlight Card and Click Spark. These have been adapted to plain JavaScript and CSS to keep this site framework-free.

Upstream project: https://github.com/DavidHDev/react-bits
License: https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md

The satin-like WebGL background in `index.html` is an original custom shader built for this project.

## Free-only policy
All project code and effects are implemented with free browser APIs and free/open-source libraries. No paid React Bits Pro components, subscriptions, API keys, premium assets, or payment-required services are required. Third-party CDN-hosted libraries and Google Fonts are free to use, but do require an internet connection.

## Accessibility and performance
The site respects `prefers-reduced-motion`, uses progressive enhancement, and avoids requiring hover interactions to access content. WebGL is configured for low-power rendering with a CSS fallback.
