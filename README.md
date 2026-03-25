# Lumiaxy — Next.js Website

A premium, production-grade Next.js website for **Lumiaxy**, a modern tech platform delivering futuristic and intelligent web solutions. Inspired by the FusionAI Framer template design — rebuilt from scratch in Next.js 14 with TypeScript, Tailwind CSS, and Framer Motion.

---

## ✨ Features

- **Next.js 14** with App Router & TypeScript
- **Tailwind CSS** for responsive utility-first styling
- **Framer Motion** for smooth, professional animations
- **Fully Responsive** — mobile-first design for all screen sizes
- **Dark Theme** with a premium deep-space aesthetic
- **Reusable Components** — every section is isolated and reusable
- **Custom Fonts** via Fontshare (Clash Display + Cabinet Grotesk)
- **Animated Dashboard Mockup** in the Hero section
- **Scroll-triggered animations** on every section
- **Marquee trust bar**, bento feature grid, tab-based feature explorer
- **Animated stats counter**, testimonials grid, email newsletter CTA

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
lumiaxy/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles, CSS variables, animations
│   │   ├── layout.tsx           # Root layout with metadata
│   │   └── page.tsx             # Main page (assembles all sections)
│   └── components/
│       ├── Navbar.tsx           # Sticky nav with mobile drawer
│       ├── Hero.tsx             # Hero section with headline + CTA
│       ├── DashboardMockup.tsx  # Animated UI mockup inside Hero
│       ├── TrustBar.tsx         # Animated logo marquee
│       ├── Features.tsx         # Bento grid of 8 features
│       ├── About.tsx            # About section with orbital visual
│       ├── FeatureDetails.tsx   # Tab-based deep dive feature explorer
│       ├── Stats.tsx            # Animated counter stats
│       ├── Testimonials.tsx     # Customer testimonial cards
│       ├── CTA.tsx              # Call-to-action section
│       └── Footer.tsx           # Full footer with newsletter
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
├── postcss.config.js
└── package.json
```

---

## 🎨 Design System

### Colors
| Token | Value | Usage |
|---|---|---|
| `brand-500` | `#6272f1` | Primary brand color |
| `accent-violet` | `#8b5cf6` | Gradient accent |
| `accent-cyan` | `#00e5ff` | Highlight / glow |
| `dark-950` | `#04050a` | Page background |
| `dark-900` | `#070b14` | Surface / card bg |

### Typography
- **Display / Headings**: Clash Display (via Fontshare)
- **Body**: Cabinet Grotesk (via Fontshare)
- **Mono / Labels**: JetBrains Mono (Google Fonts)

### Key CSS Utilities (globals.css)
- `.gradient-text` — Brand gradient text
- `.glass` — Glassmorphism card surface
- `.card-hover` — Hover lift + glow effect
- `.grid-bg` — Subtle dot/line grid overlay
- `.marquee-container` — Faded marquee mask

---

## 🛠 Customization

### Change brand name / content
Edit text strings directly in each component file inside `src/components/`.

### Change colors
Update the color tokens in `tailwind.config.ts` and the CSS variables in `src/app/globals.css`.

### Add/remove sections
Import or remove section components in `src/app/page.tsx`.

### Deploy to Vercel
```bash
npx vercel
```
Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `next` | Framework |
| `react` / `react-dom` | UI library |
| `framer-motion` | Animations |
| `lucide-react` | Icon set |
| `tailwindcss` | Styling |
| `typescript` | Type safety |

---

## 📄 License

MIT — free to use for personal and commercial projects.
