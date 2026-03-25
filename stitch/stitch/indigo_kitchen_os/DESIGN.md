# Design System Documentation: The Editorial Enterprise

This design system is a bespoke framework crafted for high-trust restaurant administration. It rejects the "bootstrap" aesthetic in favor of an editorial, high-density layout that feels more like a premium financial journal than a generic dashboard. It balances the authoritative weight of deep indigos with the airy precision of modern sans-serif typography.

---

## 1. Overview & Creative North Star

**Creative North Star: "The Precise Architect"**
The system is built on the principle of **Inherent Structure**. We do not rely on lines to hold data; we rely on the mathematical rigor of our spacing and the tonal weight of our surfaces. 

To break the "template" look, this system utilizes:
*   **Intentional Asymmetry:** Aligning data-heavy tables against wide, breathable headers.
*   **Tonal Depth:** Using layered surfaces rather than borders to create a sense of physical stacks.
*   **High-Contrast Typography:** Pairing the functional *Inter* for data with the sophisticated, wide-stanced *Manrope* for high-level displays.

---

## 2. Colors & Surface Philosophy

Our palette is anchored in `primary` (#102B88) and `on_surface` (#131B2E), creating an atmosphere of reliability and "Blue-Chip" authority.

### The "No-Line" Rule
**Strict Mandate:** 1px solid borders are prohibited for sectioning or grouping. 
Boundaries must be defined solely through background shifts. A `surface_container_lowest` card must sit on a `surface_container_low` background. This creates a "soft edge" that feels integrated and premium.

### Surface Hierarchy & Nesting
Treat the UI as a series of nested layers.
*   **Base Layer:** `surface` (#FAF8FF) for the main application background.
*   **Section Layer:** `surface_container_low` (#F2F3FF) for grouping related modules.
*   **Content Layer:** `surface_container_lowest` (#FFFFFF) for individual data cards.

### The "Glass & Signature" Rule
For floating navigation or persistent action bars, use Glassmorphism. Apply `surface_container` at 80% opacity with a `20px` backdrop blur. 
*   **Signature Texture:** Use a subtle linear gradient from `primary` (#102B88) to `primary_container` (#2E44A0) at a 135° angle for primary CTAs to provide "soul" and depth.

---

## 3. Typography

The typography strategy separates **System Data** (Inter) from **Executive Insights** (Manrope).

*   **Display & Headlines (Manrope):** Use `display-lg` through `headline-sm` for dashboard summaries and restaurant names. The wider tracking of Manrope conveys a sense of established luxury.
*   **Functional Data (Inter):** Use `title-md` down to `label-sm` for all tabular data and form fields. Inter’s tall x-height ensures legibility even in high-density restaurant order views.
*   **Hierarchy Tip:** Always use `on_surface_variant` (#454652) for labels to create a clear "read-only" vs. "actionable" contrast against `on_surface` data.

---

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** rather than structural geometry.

*   **The Layering Principle:** To lift a card, do not reach for a shadow first. Instead, move from `surface_container_low` to `surface_container_lowest`. The contrast in HEX values provides enough "lift" for the eye.
*   **Ambient Shadows:** If a card represents a "Live Order" or a temporary state, use a shadow with a blur of `32px` and an opacity of `6%`, using the `on_surface` color as the tint.
*   **The "Ghost Border" Fallback:** If accessibility requirements demand a container edge, use the `outline_variant` token (#C5C5D4) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Gradient background (`primary` to `primary_container`). `0.5rem` (8px) corner radius. Typography: `label-md` in bold.
*   **Secondary:** `surface_container_high` background with `on_primary_fixed_variant` text. No border.

### Cards & Lists
*   **Forbid Dividers:** Do not use horizontal rules between list items. Use `spacing-4` (0.9rem) of vertical white space or a subtle hover state shift to `surface_container_highest`.
*   **The "Data Cell":** In high-density views, use `body-sm` for secondary data, colored in `on_surface_variant`.

### Input Fields
*   **State:** Unfocused inputs should use `surface_container_low`. On focus, transition the background to `surface_container_lowest` and apply a `2px` "Ghost Border" of `primary` at 20% opacity.

### High-Trust Accents (Chips)
*   **Active Status:** `tertiary_container` (#00583B) background with `on_tertiary_container` (#42D59A) text.
*   **Pending Status:** Use a custom Amber variant (`#FFBF00` at 10% opacity) with high-contrast dark amber text for "Pending" items to ensure visibility against the indigo UI.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use `spacing-10` (2.25rem) or `spacing-12` (2.75rem) for page margins to create an editorial feel.
*   **Do** use `9999px` (full) roundedness for status chips, but keep cards strictly at `0.5rem` (8px).
*   **Do** align numerical data to the right in tables to maintain "The Precise Architect" look.

### Don't:
*   **Don't** use pure black (#000000) for text. Always use `on_surface` (#131B2E).
*   **Don't** use standard "Drop Shadows." Use the Ambient Shadow rule (large blur, ultra-low opacity).
*   **Don't** use lines to separate header from body. Use a transition from `surface_dim` to `surface`.