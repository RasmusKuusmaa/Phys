# Electrical engineering content plan

New subject, eighth item on `SCIENCE_ROADMAP.md`'s build order. Same
content model, same schema, same workflow as every prior subject.

Baseline: `content/electrical-engineering/` does not exist yet —
greenfield.

## Scope and framing

"Electrical engineering" here means the engineering-design layer built on
top of physics's already-thorough circuit-theory and solid-state-physics
content — digital logic, semiconductor device engineering, analog
electronics, signal conditioning, power systems, and embedded systems.
Checked overlap before drafting:

- Physics already has extensive circuit-theory content
  (`kirchhoffs-laws-and-circuit-analysis`, `rc-circuit-transients`,
  `inductance-and-rl-circuits`, `ac-circuits-and-impedance`,
  `thevenin-and-norton-equivalent-circuits`) and
  `electric-motors-generators-and-thermoelectric-effects` — this subject
  does not re-derive circuit theory, it covers the design/application
  layer on top of it, the same relationship `general-engineering` has to
  physics's mechanics.
- Physics's `semiconductors-and-doping` concept (module
  `solid-state-physics`) covers the doping mechanism and band-theory
  origin of n-type/p-type material; this subject's own
  `semiconductor-devices-diodes-and-transistors` concept covers the
  device-engineering layer instead — how a p-n junction behaves as a
  circuit element (rectification) and how a transistor functions as a
  switch/amplifier — not a restatement of the doping mechanism.
- Physics's `signals-and-fourier-analysis` concept (module `measurement`)
  covers general frequency-domain signal theory; this subject's own
  `analog-to-digital-conversion-and-signal-conditioning` concept covers
  the applied circuit-engineering layer (actual ADC/DAC design,
  anti-aliasing filter design), not a restatement of the underlying
  signal theory.
- `general-engineering` already has a `control-systems-and-feedback`
  concept — this subject does not re-cover control theory.

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check before committing. Formula + problem-
template + error-model only where a concept has one clean, well-defined
numeric relationship (transformer turns-ratio and amplifier gain are the
clearest candidates in this phase).

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase EE1 — foundational (digital logic, semiconductor devices, analog
## electronics, signal conditioning, power systems, and embedded systems)

Single module for now (`electrical-engineering-fundamentals`), same
one-module-through-later-phases pattern every new subject on this site has
started with.

- [ ] Digital logic and Boolean algebra (logic gates — AND/OR/NOT/NAND/
      NOR/XOR — Boolean algebra, and truth tables for basic combinational
      logic; no prerequisites — the unifying framework
      `embedded-systems-and-microcontrollers` builds on)
- [ ] Semiconductor devices: diodes and transistors (the p-n junction
      diode's rectifying behavior, and the transistor's function as a
      switch/amplifier — the device-engineering layer, distinct from
      physics's existing doping-mechanism concept; no prerequisites)
- [ ] Analog electronics and amplifier design (operational amplifiers,
      amplifier gain and feedback, basic analog circuit design
      principles; prerequisite: semiconductor-devices-diodes-and-
      transistors; a genuine gain-formula candidate)
- [ ] Analog-to-digital conversion and signal conditioning (practical
      ADC/DAC circuit design, and anti-aliasing filter design — the
      applied engineering layer on top of physics's existing general
      signal-theory concept; no prerequisites)
- [ ] Power systems and transformers (AC power transmission, transformer
      operation via the turns ratio, and three-phase power at an
      overview level; no prerequisites; a genuine turns-ratio formula
      candidate)
- [ ] Embedded systems and microcontrollers (microcontroller architecture
      basics — distinct from `computing`'s general-purpose von-Neumann-
      model concept, this is embedded-specific: I/O peripherals,
      interrupts, real-time constraints — and embedded system design
      tradeoffs; prerequisite: digital-logic-and-boolean-algebra)

## Phase EE2 — not yet planned

To be scoped after EE1 lands.

---
