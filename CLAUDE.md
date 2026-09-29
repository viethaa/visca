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
- `src/pages/`: `index.js` (hero with campus slideshow, school directory, visit steps, fair), `schools/[id].js` (one page per school, ISR with `fallback: 'blocking'`), `map.js` (map explorer), `hotels.js`. `/schools` redirects to `/#schools` (see `next.config.mjs`).
- `src/components/layout/`: shared `Header` (use `overlay` over a dark hero) and `Footer`
- `src/components/home/`: home page sections; `Directory.js` also exports `SchoolLogo`, `CopyButton` and `matchSchool`
- `src/components/map/`: `MapExplorer` (floating glass panel over a full-screen map: search, All/Schools/Hotels/Places filter with a sliding marker, grouped list, detail view; bottom sheet on phones; deep links `?school=` / `?hotel=`) and `MapView` (OpenLayers, client-only; `fitPadding` and `focusOffset` keep markers clear of the panel, `embedded` turns off wheel zoom)
- `src/components/ui/`: shadcn/ui primitives (dialog and sheet sit at `z-[1100]`, above the header)
- `src/components/Slideshow.js`: crossfading photo slideshow used on the home page and school pages; skips images that fail to load
- `src/lib/`: data and helpers — `schools.js` (logos, `normalizeSchool`, `mailtoHref`), `theme.js` (theme list, `setTheme`, `useTheme`), `loadSchools.js` (server-only, for `getStaticProps`), `hotels.js` (single hotel list), `site.js` (nav, fair, places)

### Data Flow
- The sheet's picture column (L) may hold several photo URLs separated by spaces, new lines, or a comma before the next link; they become `school.pics` for the slideshow. The email column may hold several addresses; they become `school.emails`.
- Website-only schools (not yet in the sheet) live in `src/lib/extraSchools.js` and are appended after the sheet's schools; a sheet row with the same name replaces them. School photos/logos are in `public/schools/` and mapped by exact school name in `SCHOOL_PHOTOS` / `SCHOOL_LOGOS` (`src/lib/schools.js`). Each school has a 3–4 photo gallery (`<key>-N.jpg`, picked from the school's own website; school-supplied `.webp` first where there is one). When a school has local photos, the sheet's picture column is ignored.
- Pages call `loadSchools()` in `getStaticProps` (60-second revalidation). It reads the Google Sheet, or falls back to `data.json`, and normalizes both shapes through `normalizeSchool`.
- Order preservation is critical - data should maintain spreadsheet order
- Environment variables: `SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `NEXT_PUBLIC_STADIAMAPS_API`

### Design System
- Based on `docs/design-systems/integrated-biosciences.md` (2026-09-28) with a VISCA twist. Older references (Slush, Hyper Foundation) are in the same folder for reference only.
- Mixed theme by bands: wrap blocks in `.band-dark` (abyss ink #222f30, add `.dots` for the faint dot field), `.band-light` (bone #f7f7f5, white cards) or `.band-void` (black footer). Tokens (`paper`, `surface`, `mist`, `ink`, `muted`, `line`, `jade`) switch per band, so components adapt to where they sit. Fixed colors: `abyss`, `bone`, `signal` (#cef79e).
- Lime `signal` is micro-scale only: 40px `.arrow-btn` / `ArrowLink`, 6px `Tag` dots, active nav/filter pills, map zoom buttons. Never a large surface or text background.
- Type: one weight (400) everywhere. Inter Tight (sans) + Roboto Mono (labels, nav, buttons, counters) via `next/font` in `_app.js`. Scale helpers: `.t-hero`, `.t-display`, `.t-heading`, `.t-sub`, `.t-mono`. Never add bold utilities.
- Layout helpers: `.wrap` (1200px column), `.band` (section padding), `.card` (20px radius, hairline), `.field`, `.btn-primary`, `.btn-ghost`, `.link`, `.text-link`. Shared bits in `components/Lab.js`: `Counter` ("01 / 03"), `Tag`, `ArrowLink`.
- Twist: `.specimen` renders photos as dark green monochrome that bloom to full color on hover; footer ends in a giant wordmark.
- Home banner (`home/Hero.js`): an inset rounded panel like the Integrated Bio hero, with moving abstract artwork (`home/HeroArt.js`: drifting blurred blobs via CSS keyframes plus SVG ribbons morphing via SMIL; static under reduced motion), the header floating inside it (`<Header overlay />`), headline words sliding up (`animate-word`), a live readout (Hanoi time, counts) and a Browse schools button + lime arrow.
- HeroArt layers: colour field, drifting blurred blobs, a slowly rotating lit tube, a morphing brown ribbon with light/dark edges, a thin thread, a travelling glint, shade and fine grain. Layers sit in `.depth` wrappers that shift slightly with the pointer (`--px/--py`). Keep curves clear of the headline, copy and buttons.
- Section motion (`components/Reveal.js`): `Sheet` makes each band after the banner slide over the previous one (rounded top corners, small overlap, scale 96% to 100% on scroll); `Reveal` fades/lifts content in once. Dark bands' dots drift slowly. All respect reduced motion.
- "Plan a visit" panel (`home/PlanVisit.js`) uses its own backdrop, `home/PlanArt.js` (drifting topographic contour rings over a teal-to-copper field), so it differs from the banner art.
- Home hotels section (`home/HotelsTeaser.js`): a slot-based carousel of all hotels (middle card larger, with description on desktop); cards glide between fixed slots every 4.2s, pause on hover/focus, side cards are clickable, and there are prev/next controls plus a "View all hotels" pill. Uses each hotel's `exterior` photo (`public/hotels/`, set in `lib/hotels.js`; Lotte photo needs its CC BY 4.0 credit shown).
- School page (`pages/schools/[id].js`): `components/schools/Stage.js`, an inset full-screen photo carousel (crossfade + slow zoom, thin progress segments, prev/next) with `<Header overlay back={…} />` inside it; the school logo and a district chip (glides to the map) share one line above the name, so long names get the full width (names over 24 characters step down a size). Then one light panel: resource links, map (`MapView embedded`, no wheel zoom), the 3 nearest hotels, the sticky "Book a visit" card (first on phones; the owner likes it, keep it), closed by `FooterNote` behind a hairline, no separate footer. Keep it minimal: no eyebrow labels, breadcrumb or previous/next schools.
- Scroll cues (`components/ScrollCues.js`): `useSectionSnap(ids)` glides one wheel/key gesture to the next section on desktop (tall sections scroll natively, then stop at their end); `NextCue` is a small bobbing chevron; `ScrollProgress` is a thin lime bar at the top. No section rail.
- Map page (`pages/map.js`): one inset rounded map filling the screen with `<Header overlay />` on it and a soft shade under the header; no footer. District labels come from `districtOf(address)` (`lib/schools.js`).
- Footer (`layout/Footer.js`): a slim rounded panel with the logo mark, copyright line and a Back to top link.
- Hotels page (`pages/hotels.js`): opens with `components/hotels/Showcase.js`, a full-screen inset photo stage ("Our Recommended Hotels") that crossfades through the current hotel's photos then advances to the next hotel, with progress segments, prev/next and a Details button. Below: a light panel with area filter pills, a numbered index (left) and a sticky preview (right); the footer line (`FooterNote`) closes that panel. Photos: 4–5 per hotel in `public/hotels/<id>.jpg` and `<id>-N.jpg` (counts in `COUNTS`, license credits in `PHOTO_CREDITS`, `lib/hotels.js`). Main exteriors are ~2400px; after replacing a file in `public/`, clear `.next/cache/images` or the old version keeps showing.
- Header: logo on the left, a small translucent pill on the right (links with a sliding white active marker, a divider, Contact); "Menu" dropdown on phones.
- Header is not sticky (the owner tried it and removed it); `back={{ href, label }}` adds a round back button before the logo; it sits at the top of the first dark band. Pages: `<div className='band-dark dots'><Header /></div><main id='main'>…bands…</main><Footer />`.
- No shadows, no gradients as decoration; depth comes from band contrast and 1px hairlines.
- Map uses dark tiles; markers are drawn on canvas; remote logos load through `/_next/image` to avoid CORS failures.

## Important Notes

- **Data Order**: Never sort or reorder school data - preserve original spreadsheet order. Exception: the home page directory grid is displayed A–Z at the owner's request (sorted in `Directory.js` only); previous/next links on school pages still follow the sheet.
- **Error Handling**: Always fall back to local data.json if Google Sheets fails
- **Environment**: Requires environment variables for Google Sheets integration
- **Map Integration**: Markers come from school coordinates in the sheet, plus `HOTELS` and `PLACES`
