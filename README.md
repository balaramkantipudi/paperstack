# Paperstack - Construction SaaS Landing Page

A modern SaaS landing page and dashboard for the construction industry, built with React, Vite, and Tailwind CSS.

## Tech Stack
- **Framework:** React + Vite
- **Styling:** Tailwind CSS + HeroUI
- **Icons:** Iconify
- **State Management:** React Hooks (local state)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository (if you haven't already).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.local` (created automatically or use the example below)
   - Ensure `VITE_PUBLIC_SUPABASE_URL` and `VITE_PUBLIC_SUPABASE_ANON_KEY` are set.

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

Build for production:
```bash
npm run build
```

## Project Structure
- `src/components`: UI components and page views
- `src/lib`: Utility functions and API clients
- `src/App.tsx`: Main application entry and routing logic
