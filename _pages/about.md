---
permalink: /
title: "Welcome!"
description: "Click the links above to explore my derivations, lab reports, data analysis projects, and electrical engineering work."
author_profile: true
excerpt: "Click the links above to explore my derivations, lab reports, data analysis projects, and electrical engineering work."
header:
  overlay_image: img/labpic.jpg
  overlay_filter: 0.35
---

{% assign lab_report_count = site.publications | where: "category", "lab-reports" | size %}
{% assign physics_notes_count = site.publications | size | minus: lab_report_count %}
{% assign project_count = site.portfolio | size %}
{% assign pdf_count = 0 %}
{% for asset in site.static_files %}
  {% if asset.path contains '/files/' and asset.extname == '.pdf' %}
    {% assign pdf_count = pdf_count | plus: 1 %}
  {% endif %}
{% endfor %}

<section class="home-metrics" aria-label="Site metrics">
  <h2 class="home-metrics__heading">Metrics</h2>
  <ul class="home-metrics__list">
    <li class="home-metrics__item">
      <span class="home-metrics__value" data-count-up="{{ physics_notes_count }}" aria-live="polite">{{ physics_notes_count }}</span>
      <span class="home-metrics__label">Physics Notes</span>
    </li>
    <li class="home-metrics__item">
      <span class="home-metrics__value" data-count-up="{{ lab_report_count }}" aria-live="polite">{{ lab_report_count }}</span>
      <span class="home-metrics__label">Lab Reports</span>
    </li>
    <li class="home-metrics__item">
      <span class="home-metrics__value" data-count-up="{{ project_count }}" aria-live="polite">{{ project_count }}</span>
      <span class="home-metrics__label">Projects</span>
    </li>
    <li class="home-metrics__item">
      <span class="home-metrics__value" data-count-up="{{ pdf_count }}" data-count-suffix="+" aria-live="polite">{{ pdf_count }}+</span>
      <span class="home-metrics__label">PDFs</span>
    </li>
  </ul>
</section>

<section class="home-timeline" aria-label="Experience timeline">
  <h2 class="home-timeline__heading">Experience</h2>
  <div class="home-timeline__track">
    <div class="home-timeline__rail" aria-hidden="true">
      <span class="home-timeline__rail-track"></span>
      <span class="home-timeline__rail-fill"></span>
    </div>
    <ol class="home-timeline__list">
      <li class="home-timeline__item">
        <p class="home-timeline__year">2026–Present</p>
        <div class="home-timeline__node" aria-hidden="true"><span class="home-timeline__node-dot"></span></div>
        <article class="home-timeline__card">
          <span class="home-timeline__pill">Internship</span>
          <h3 class="home-timeline__title">Grid-Connection Engineering Internship — Sungrow</h3>
          <p class="home-timeline__desc">Working on utility-scale grid-connected BESS modelling and harmonic assessments using DIgSILENT PowerFactory and Python. The work covers PCS/inverters, transformers, MV collector networks and grid connections; frequency-dependent Norton equivalents, manufacturer harmonic-current spectra and impedance polygons; charge, discharge, zero-power and outage scenarios; automated study workflows; validation against established results; and investigation of discrepancies including transformer saturation.</p>
        </article>
      </li>
      <li class="home-timeline__item">
        <p class="home-timeline__year">2026</p>
        <div class="home-timeline__node" aria-hidden="true"><span class="home-timeline__node-dot"></span></div>
        <article class="home-timeline__card">
          <span class="home-timeline__pill">Research</span>
          <h3 class="home-timeline__title">Quantum Backscatter Communications — Honours Thesis</h3>
          <p class="home-timeline__desc">Thesis: <em>Modulation Design for Quantum Backscatter Communications: Performance Analysis and Optimisation</em>. Awarded a High Distinction for the research. Research findings submitted to IEEE GLOBECOM 2026 (Quantum Communications and IT Symposium).</p>
          <p class="home-timeline__desc home-timeline__desc--separated"><strong><u>Description:</u></strong><br>Developed a more realistic bit-error-rate model for polarisation-encoded QBC beyond the ideal thermal-bath assumption. Derived and numerically validated analytical models for polarisation rotation, temporal misalignment and pointing jitter, combined them into a unified impairment framework, and optimised pulse width and signal brightness under data-rate and resource constraints. The results identified rotation and pointing jitter as the dominant impairments in the baseline regime and established robust operating regions for practical system design.</p>
          <a class="home-timeline__link" href="{{ '/files/papers/qbc-paper.pdf' | relative_url }}" target="_blank" rel="noopener"><i class="fas fa-file-pdf" aria-hidden="true"></i>Read QBC paper</a>
        </article>
      </li>
      <li class="home-timeline__item">
        <p class="home-timeline__year">2026</p>
        <div class="home-timeline__node" aria-hidden="true"><span class="home-timeline__node-dot"></span></div>
        <article class="home-timeline__card">
          <span class="home-timeline__pill">Education</span>
          <h3 class="home-timeline__title">Electrical Engineering (Honours) and Physics, UNSW</h3>
          <p class="home-timeline__desc">Graduated with a Bachelor of Engineering (Honours) in Electrical Engineering and a Bachelor of Science in Physics from UNSW, achieving a Distinction average.</p>
        </article>
      </li>
      <li class="home-timeline__item">
        <p class="home-timeline__year">2024</p>
        <div class="home-timeline__node" aria-hidden="true"><span class="home-timeline__node-dot"></span></div>
        <article class="home-timeline__card">
          <span class="home-timeline__pill">Teaching</span>
          <h3 class="home-timeline__title">Head Tutor: Quantum Physics</h3>
          <p class="home-timeline__desc">Taught PHYS2111 Quantum Physics classes by leading tutorials and developing tutorial questions and learning resources. The course covered Hilbert spaces, bras and kets, operators, eigenvalues and measurement; spin-½ systems and Pauli matrices; entanglement, commutators and uncertainty; Schrödinger's equation, potential wells and the quantum harmonic oscillator; time evolution, Fourier methods, tunnelling and periodic potentials.</p>
        </article>
      </li>
      <li class="home-timeline__item">
        <p class="home-timeline__year">2024</p>
        <div class="home-timeline__node" aria-hidden="true"><span class="home-timeline__node-dot"></span></div>
        <article class="home-timeline__card">
          <span class="home-timeline__pill">Teaching</span>
          <h3 class="home-timeline__title">Lab Demonstrator: Quantum Mechanics and Classical Mechanics/Special Relativity</h3>
          <p class="home-timeline__desc">Supervised laboratory experiments and assessed reports for PHYS3111 Quantum Mechanics and PHYS2113 Classical Mechanics and Special Relativity. PHYS3111 covered three-dimensional quantum mechanics, angular momentum, the hydrogen atom, spin and identical particles, perturbation theory, band structure, Berry phase and scattering. PHYS2113 covered driven oscillations and resonance, central-force motion, rotational dynamics, Lagrangian and Hamiltonian mechanics, Noether's theorem, coupled modes, Lorentz transformations and relativistic dynamics.</p>
        </article>
      </li>
      <li class="home-timeline__item">
        <p class="home-timeline__year">2023</p>
        <div class="home-timeline__node" aria-hidden="true"><span class="home-timeline__node-dot"></span></div>
        <article class="home-timeline__card">
          <span class="home-timeline__pill">Research</span>
          <h3 class="home-timeline__title">Silicon Quantum Dot Qubit Research Project</h3>
          <p class="home-timeline__desc">Completed a UNSW research project supervised by Professor Rajib Rahman, investigating few-electron physics in gate-defined silicon quantum dots. Modelled lateral confinement using a quantum harmonic-oscillator potential and examined how quantised energy levels, orbital wavefunctions and electron–electron interactions evolved as the dots were filled from one to three electrons. Used NEMO3D on the Gadi supercomputer to run atomistic self-consistent-field calculations; varied XML model parameters, extracted energy eigenvalues and wavefunction slices, checked numerical convergence and analysed the spatial spreading of the wavefunctions with increasing electron number.</p>
        </article>
      </li>
      <li class="home-timeline__item">
        <p class="home-timeline__year">2023</p>
        <div class="home-timeline__node" aria-hidden="true"><span class="home-timeline__node-dot"></span></div>
        <article class="home-timeline__card">
          <span class="home-timeline__pill">Teaching</span>
          <h3 class="home-timeline__title">Physics 1A and 1B Teaching Assistant and Lab Demonstrator</h3>
          <p class="home-timeline__desc">Taught and assessed tutorials and laboratories for UNSW Physics 1A (PHYS1121) and Physics 1B (PHYS1221). Physics 1A covered one-, two- and three-dimensional kinematics; Newtonian dynamics; work, energy, momentum and collisions; rotational motion; temperature, kinetic theory, ideal gases, heat and the first law of thermodynamics; oscillations, wave motion and sound. Physics 1B covered electrostatics, Gauss's law, electric potential, capacitance and dielectrics; magnetic fields, Ampère's law, the Biot–Savart law, Faraday's law, induction and inductance; physical optics, interference, diffraction, gratings, spectra and polarisation; introductory quantum theory, wave–particle duality, and solid-state and semiconductor physics.</p>
        </article>
      </li>
      <li class="home-timeline__item">
        <p class="home-timeline__year">2023</p>
        <div class="home-timeline__node" aria-hidden="true"><span class="home-timeline__node-dot"></span></div>
        <article class="home-timeline__card">
          <span class="home-timeline__pill">Leadership</span>
          <h3 class="home-timeline__title">Student Fellow at UNSW Hall</h3>
          <p class="home-timeline__desc">Selected as one of two Student Fellows for 2023. Led and mentored a residential floor community, held weekly floor meetings, attended residential staff and house meetings, and helped coordinate and supervise college activities and events. Served as a link between residents and college leadership, raising concerns appropriately, maintaining confidentiality, and modelling college values.</p>
        </article>
      </li>
      <li class="home-timeline__item">
        <p class="home-timeline__year">2021–2022</p>
        <div class="home-timeline__node" aria-hidden="true"><span class="home-timeline__node-dot"></span></div>
        <article class="home-timeline__card">
          <span class="home-timeline__pill">Leadership</span>
          <h3 class="home-timeline__title">Operations and Communications Director, UNSW Hall</h3>
          <p class="home-timeline__desc">Helped lead UNSW Hall's operations and communications portfolio as a member of the House Committee. Produced internal publications and advertising, developed and maintained digital communication platforms, documented major college events through photography, and created approved visual content for other directors. Also supported the upkeep and availability of college services and amenities.</p>
        </article>
      </li>
      <li class="home-timeline__item">
        <p class="home-timeline__year">2017–2022</p>
        <div class="home-timeline__node" aria-hidden="true"><span class="home-timeline__node-dot"></span></div>
        <article class="home-timeline__card">
          <span class="home-timeline__pill">Teaching</span>
          <h3 class="home-timeline__title">Piano Teacher</h3>
          <p class="home-timeline__desc">Gave weekly piano lessons to students aged 7 to 27, adapting repertoire, exercises, explanations, and lesson pacing to different ages and ability levels. Developed students' technique, sight-reading, rhythm, musical interpretation, practice habits, confidence, and ability to learn independently.</p>
        </article>
      </li>
    </ol>
  </div>
</section>
