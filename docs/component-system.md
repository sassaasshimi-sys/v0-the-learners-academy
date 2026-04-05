# Component System

## Card System
- **Standard Card:** Padded `p-fluid`, standard radius `lg`, and uses `--card` bg with default border.
- **Glass Card:** Uses `.glass-1` or `.glass-2` instead of solid `--card`, paired with `--shadow-premium`.
- **Interactive Card:** Must include `.hover-lift` and wrap entirely in standard layout bounds.

## Button System
- **Sizes:** 
  - `sm`: h-9 px-3 text-xs
  - `default`: h-10 px-4 py-2 text-sm
  - `lg`: h-11 px-8 text-base
  - `icon`: h-10 w-10
- **Variants:** `default` (primary fill), `destructive`, `outline`, `secondary`, `ghost`, `link`.
- **Text Style:** Sans-serif, medium weight, explicit uppercase only in micro context.

## Table System
- **Density:** 
  - Padded headers (`th` h-12 px-4).
  - Standard rows (`td` p-4 align-middle).
- **Interactions:** Rows explicitly highlight on hover (`hover:bg-muted/50`). Borders sit strictly on the bottom of rows, not fully bordered grids.

## Form System
- **Inputs:** 
  - Height `h-10`, rounded `md`, border `border-input`, focus `ring-ring`. 
- **Labels:** 
  - Font size `text-sm`, medium weight, sans-serif. 
  - Placed exactly `space-y-2` away from input fields.
- **Spacing:** Group rows by `space-y-4`.

## Layout Patterns
- **Dashboard:** Side navigation (`w-64` max) fixed to left, main content area flexing the remainder. Max constraints rely on `max-w-7xl mx-auto`.
- **Page Header:** Flex container (`items-center justify-between`) containing H1 (Serif) and macro Call-To-Action buttons strictly to the right.
- **Grid:** Use standard grid system spanning 1, 2, or 3 columns (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fluid`).

---
DO NOT CREATE NEW PATTERNS WITHOUT EXTENDING THESE.
