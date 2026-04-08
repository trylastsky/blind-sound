# Blind Sound

<p align="center">
  <b>Train your spatial hearing in a fast, game-like web experience.</b><br/>
  A focused pet project built with Next.js, React, TypeScript, Web Audio API, and Three.js.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## 🚀 About the project

**Blind Sound** is an interactive hearing trainer where you:

1. Play a sound from a hidden position.
2. Guess where it came from (2D or 3D space).
3. Get immediate feedback and track your progress.

The goal is simple: improve your ability to localize sound sources through short, repeatable sessions.

---

## ✨ Why this pet project is interesting

- Combines **UX, audio logic, and visual interaction** in one app.
- Uses **Web Audio API** for synthetic sound generation and processing.
- Supports both **2D canvas gameplay** and **3D scene interaction**.
- Tracks learning progress with streak and accuracy metrics.
- Saves settings and stats locally for a smooth return experience.

---

## 🎮 Features

### Training modes
- **2D mode** — classic directional localization on a circular field.
- **3D mode** — depth-aware guessing with visual spatial context.

### Gameplay controls
- Difficulty: **Easy / Medium / Hard**
- Sound types: multiple synthetic profiles
- Obstacles simulation:
  - `none`
  - `wall`
  - `pillar`
  - `corner`
  - `tunnel`
  - `maze`
- Adjustable volume

### Progress & persistence
- Total attempts
- Correct attempts / accuracy
- Current streak
- Best streak
- Separate mode stats (2D & 3D)
- Persisted in `localStorage`

---

## 🧱 Tech stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19 + Tailwind CSS 4
- **Language:** TypeScript
- **3D:** Three.js
- **Audio:** Web Audio API
- **Icons:** lucide-react

---

## ⚙️ Getting started

### 1) Clone the repository

```bash
git clone https://github.com/yourusername/blind-sound.git
cd blind-sound