---
title: "What I Did This Weekend"
date: 2026-09-12
thumbnail: "/assets/images/blog/thumb-weekend.svg"
tags: ["Life", "Notes", "Productivity"]
summary: "Reflections on building physical synthesizers, mechanical keyboards, and experimenting with canvas rendering loops."
order: 2
---

# What I Did This Weekend

Every few weeks, stepping away from full-stack architecture to build physical tactile objects recalibrates how I think about user experience and software interfaces.

## 1. Physical Tactility vs Digital Flatness

We spend countless hours staring at glass and OLED panels. When you interact with physical dials, rotary encoders, or mechanical switches, the mechanical feedback is immediate, unambiguous, and sensory.

> The tactile feel of a high-tolerance aluminum dial provides an intuitive sense of precision that software interfaces constantly strive to emulate.

In digital design, this is why subtle micro-animations, physical spring physics, and restrained typography matter. They reintroduce weight and materiality to ephemeral pixels.

## 2. Experiments with Canvas 2D and Force Physics

I spent Sunday evening prototyping custom D3-force simulations rendered directly onto an HTML5 Canvas context. Unlike DOM-heavy SVGs that degrade with hundreds of interactive nodes, Canvas renders tens of thousands of primitives at 60 FPS while keeping memory footprints minimal.

Key takeaways from the experiment:
- **Device Pixel Ratio (DPR)**: Always scale the backing store by `window.devicePixelRatio` to prevent blurry text on high-density Retina displays.
- **Velocity Decay**: Setting a moderate velocity decay (`0.35` to `0.4`) stabilizes physics oscillations quickly, avoiding chaotic jitter.
- **Hit Testing Math**: Simple radial Euclidean distance checks `(dx * dx + dy * dy <= r * r)` perform orders of magnitude faster than path intersection methods.

More notes coming soon as this graph engine matures!
