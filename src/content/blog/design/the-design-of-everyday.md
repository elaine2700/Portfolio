---
title: "The Design of Everyday Software"
date: 2026-09-08
thumbnail: "/assets/images/blog/thumb-everyday.svg"
tags: ["Design", "Affordance", "Architecture"]
summary: "Why mental models and physical affordances remain vital in contemporary graphical user interfaces."
order: 2
---

# The Design of Everyday Software

In Don Norman's seminal work *The Design of Everyday Things*, the concept of **affordance** is central: the qualities of an object that communicate how it can be used.

## The Loss of Signifiers

As software transitioned through skeuomorphism, flat design, and hyper-minimalism, many essential signifiers were discarded:
- Buttons that look identical to inert static labels.
- Hidden gesture-only navigations with zero visual cues.
- Undiscoverable keyboard shortcuts without tooltip affordances.

```text
Physical World:      Door Handle  ──>  Pull
                     Flat Plate   ──>  Push

Digital World:       Beveled Pill ──>  Clickable
                     Framed Box   ──>  Interactive Target
```

## Reintroducing Intentionality

When designing modern applications:
- **State Feedback**: Ensure hover, active, and focus states are distinct.
- **Explicit Markers**: In monospace interfaces, prefix active elements with indicators like `>` or underline rules.
- **Predictable Coordinates**: Maintain consistent spatial orientation so users build muscle memory.
