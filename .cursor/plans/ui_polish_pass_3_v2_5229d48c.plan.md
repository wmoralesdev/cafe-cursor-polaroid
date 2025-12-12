---
name: ui polish pass 3 v2
overview: Remove section-level cards/nested cards, improve Editor form hierarchy (not just wrappers), and replace Live Wall MarqueeThumbnail with a public UserPolaroid-style tile including @handle + time + likes.
todos:
  - id: navbar-auth-consistency
    content: Replace auth Logout text with icon-only user menu; normalize header action sizing/spacing.
    status: completed
  - id: title-scale-system
    content: Create/apply a consistent section title/subtitle system across major sections (including editor).
    status: completed
  - id: glass-panels-everywhere
    content: Wrap all major sections in a consistent transparent glass panel surface; add inner variant if needed.
    status: completed
  - id: live-wall-interaction
    content: Add interaction affordances and light controls to Live Wall (browse cues, pause, optional sort).
    status: completed
  - id: editor-cohesion
    content: Unify editor form+preview layout and action hierarchy (stickiness optional).
    status: completed
---

# UI polish pass 3 — remove section cards, improve form, unify tiles

## Decisions (from you)

- **Section surfaces**: **A)** Remove section-level cards; rely on spacing/dividers/background. Glassmorphism only for truly interactive blocks.
- **Live Wall tile**: show **@handle + time + likes** (and open modal on click).

---

## 1) Remove section-level cards + nested card stacks

### Goal

Eliminate “3–4 cards inside one section” (stacked panels) so sections read clean and consistent.

### Changes

- Remove `glass-panel` wrappers from major sections:
- `src/components/sections/editor-section.tsx`
- `src/components/sections/polaroid-marquee.tsx`
- `src/components/sections/user-polaroids.tsx`
- `src/components/sections/photo-strip.tsx`
- `src/components/sections/about-section.tsx`
- `src/components/sections/signed-out-editor-teaser.tsx`
- Keep only:
- section spacing (`py-*`), optional divider (`border-t`), and internal layout.
- Keep glassmorphism only for interactive sub-blocks:
- editor preview/action surface, modal surfaces, small control chips.

### Expected outcome

Consistent page rhythm: headings align, surfaces don’t “double-frame” content.

---

## 2) Editor: real form improvements (not just wrappers)

### Goal

Make the form feel integrated and intentional: clearer grouping, improved density, and obvious primary action.

### Changes

- In `src/components/sections/editor-section.tsx`:
- Remove section-level wrapper panel.
- Rework layout into two clear columns:
  - **Left**: form (with grouped subsections)
  - **Right**: sticky preview + actions (this remains the main glass surface)
- Adjust action hierarchy:
  - If editing existing card: “New card” becomes secondary.
  - Export remains primary.
- In `src/components/form/profile-fields.tsx` (and/or subcomponents):
- Add lightweight subsection headings and separators (no heavy panels).
- Reduce visual noise by making input groups consistent (spacing + label alignment).

### Expected outcome

The editor reads as one product (form → preview → actions), not two unrelated panes.

---

## 3) Live Wall: replace `MarqueeThumbnail` with a public UserPolaroid-style tile

### Goal

Unify design language: Live Wall tiles should feel like the same product as “Your cards”.

### Changes

- Introduce a shared tile component, e.g.:
- `src/components/polaroid/polaroid-tile.tsx` (or `src/components/polaroid/polaroid-list-item.tsx`)
- Refactor `src/components/sections/user-polaroids.tsx` to use this tile:
- keeps selection highlight behavior
- retains delete controls only in user context
- Refactor `src/components/sections/polaroid-marquee.tsx`:
- remove `MarqueeThumbnail`
- render the shared **public** tile variant with:
  - `@handle`
  - `relative time`
  - `like count`
- click opens modal as before

### Expected outcome

The Live Wall looks richer and more interactive without wrapping the whole section in a card.

---

## 4) Live Wall: keep interaction affordances, but as lightweight UI (not panel-on-panel)

### Changes

- Keep: chevrons, pause/resume, drag hint, edge fades.
- Ensure these controls sit on the section layout (or small chips), not inside heavy containers.

---

## 5) Verification

- **Auth navbar** still icon-consistent; user menu works.
- Titles remain aligned via `SectionHeader`.
- No section-level cards remain; only interactive blocks have glass.
- Live Wall tiles use the shared tile component and show **@handle + time + likes**.
- Editor form feels improved via grouping/hierarchy (not just wrappers).

---

## Implementation todos

- **remove-section-cards**: Remove section-level `glass-panel` wrappers and nested panel stacks.
- **editor-form-hierarchy**: Improve form grouping and editor layout; keep preview/actions as the primary glass surface.
- **shared-polaroid-tile**: Create a shared tile component with variants (user vs public).
- **marquee-uses-tile**: Replace `MarqueeThumbnail` with the shared public tile (handle+time+likes).
- **verify-ui**: Verify signed-out and signed-in pages visually and check key interactions (modal, selection, delete, menu).