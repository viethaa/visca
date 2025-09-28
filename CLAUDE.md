# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VISCA is a Next.js application that displays school information with an interactive map interface. It integrates with Google Sheets for dynamic data fetching and uses OpenLayers for map visualization.

## Development Commands

- **Development server**: `npm run dev` (starts on http://localhost:3000)
- **Build**: `npm run build`
- **Production server**: `npm start`
- **Linting**: `npm run lint`

## Architecture

### Core Structure
- **Framework**: Next.js with Pages Router (not App Router)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Map Library**: OpenLayers (ol package)
- **UI Components**: Radix UI primitives with custom styling

### Key Directories
- `src/pages/`: Next.js pages (index.js is main page)
- `src/components/`: React components organized by purpose
  - `layout/`: Header and Footer components
  - `map/`: Map-related components (MapContainer, Map, InfoSheet, PlaceInfoSheet)
  - `ui/`: shadcn/ui components (button, dialog, accordion, etc.)
- `src/lib/`: Utility functions
- `src/styles/`: Global CSS and Tailwind styles

### Data Flow
- School data can come from Google Sheets API or fallback to local `data.json`
- Main page uses `getStaticProps` with 60-second revalidation
- Order preservation is critical - data should maintain spreadsheet order
- Environment variables required: `SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`

### Component Architecture
- `MapContainer`: State management for map interactions and modals
- `Map`: OpenLayers integration with markers for schools, places, and hotels
- `InfoSheet`/`PlaceInfoSheet`: Modal dialogs for displaying detailed information
- `List`: Displays school information in structured format

### Styling System
- Uses Tailwind CSS with custom configuration
- Dark theme with gradient backgrounds
- Custom fonts: Inter for sans-serif, Roboto Mono for monospace
- shadcn/ui components configured for JSX (not TSX)
- Path aliases: `@/components` and `@/lib/utils`

## Important Notes

- **Data Order**: Never sort or reorder school data - preserve original spreadsheet order
- **Error Handling**: Always fall back to local data.json if Google Sheets fails
- **Environment**: Requires environment variables for Google Sheets integration
- **Map Integration**: Uses custom pin markers and location data from school records
