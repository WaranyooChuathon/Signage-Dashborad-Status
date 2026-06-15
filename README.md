# Smart Signage Dashboard — Live Demo

English · **[ภาษาไทย](README-TH.md)**

> A real-time monitoring dashboard for a digital signage network — built for an operations team.
> **This is a live demo** running entirely on sample data, with no real database connection. It opens instantly, no login required.

🔗 **Live Demo:** _<paste your Vercel URL here after deploy>_
👤 **By:** Waranyoo Chuathon · [GitHub](https://github.com/WaranyooChuathon)

---

## Screenshots

![Dashboard](docs/02-dashboard.png)

| Login Showcase | Reports |
|:--:|:--:|
| ![Login](docs/01-login.png) | ![Reports](docs/03-reports.png) |
| **Device List + Side Panel** | **User Management** |
| ![Devices](docs/04-devices.png) | ![Users](docs/05-users.png) |

## Overview

A dashboard for monitoring a network of dozens of digital-signage displays at once —
showing live online/offline status, historical trends, per-device uptime statistics, and user management.

## Features

- **Dashboard** — KPI cards (online / offline / uptime rate), a today donut chart, a trend bar chart (day / week / month / year), and scrollable online & offline device lists with pagination.
- **Device List** — full device table with search and status filtering, plus a detail side panel per device.
- **Reports** — trend chart, per-device uptime ranking (sort high ↔ low), a statistics table, and **CSV export**.
- **User Management** — create / edit / suspend / delete users with roles (Super Admin / Admin / Viewer) and password generation.
- **Dark / Light mode** — system-wide theme toggle driven by CSS variables.
- **Responsive** — adapts from wide desktop down to mobile.

## Tech Stack

| Layer | Technology |
|------|-----------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Plain CSS (glassmorphism, deep navy) — no utility framework |
| Charts | Hand-written SVG arc/path math (donut, trend, overlay) |
| Icons / Fonts | lucide-react · Inter / Plus Jakarta Sans / JetBrains Mono |
| Production data | Supabase (PostgreSQL + RPC functions) |
| Deploy | Vercel |

## Data Architecture (Production vs Demo)

The production app pulls data from Supabase via RPC (`get_online_summary`, `get_device_trend`,
`get_device_uptime`, `get_latest_status`). This demo swaps the data layer out for a **mock layer**
without touching any page UI or logic:

```
lib/mock/data.ts     → deterministic sample-data generators (34 devices, trends, uptime, users)
lib/mock/client.ts   → a mock client mirroring the supabase-js interface (rpc / from / auth)
lib/supabase/*.ts    → return the mock client instead of the real one
```

As a result the demo builds and runs with **no environment variables or secrets**, and never connects to a real database.

## Run Locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

No `.env` setup needed — everything runs on sample data.

## Deploy (Vercel)

1. Push this repo to your own GitHub.
2. Import it into [Vercel](https://vercel.com/new) → framework preset = Next.js.
3. Click Deploy (no env vars required).

---

_This demo uses entirely fictional data and exists for portfolio purposes only. It contains no real data and no connection to any organization's live system._
