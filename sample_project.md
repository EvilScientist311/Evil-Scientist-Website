---
layout: default
title: Sample Project
---

<div class="container py-5">

# Sample Project Page

This is a test page to see how Markdown, LaTeX, and images render on your site.

---

## Overview

This page demonstrates:
- Markdown text
- LaTeX rendering
- Images from your repo
- Basic Bootstrap styling

---

## Some Physics

Inline math works: $E = mc^2$

Display math:

$$
\psi(x) = A e^{ikx}
$$

Another example:

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

---

## Image

![Quantum Mechanics]({{ '/assets/img/qm.jpg' | relative_url }})

---

## Styled Image (with Bootstrap)

<img 
  src="{{ '/assets/img/optics.jpg' | relative_url }}" 
  class="img-fluid rounded-4 shadow mt-3"
  style="max-width: 500px;"
>

---

## Text Section

You can write normally in Markdown.  

This is useful for:
- explaining derivations  
- documenting simulations  
- writing notes  

---

## Mixed Content Example

Consider a free particle solution:

$$
\psi(x,t) = A e^{i(kx - \omega t)}
$$

This describes a plane wave propagating through space.

---

## Conclusion

Markdown is enough for:
- explanations
- equations
- images

Use HTML only when you need more layout control.

</div>