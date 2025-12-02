# Design Guidelines: Portal Judicial - Fiscalía RP

## Design Approach
**System-Based Design**: Following government/institutional web standards inspired by official Chilean government portals, with influence from Material Design for structured, accessible interfaces. This is a utility-focused application prioritizing clarity, trust, and efficiency.

## Core Design Principles
1. **Institutional Authority**: Professional, trustworthy appearance befitting government systems
2. **Functional Clarity**: Information hierarchy optimized for quick data retrieval and form completion
3. **Document Fidelity**: Forms and displays should resemble official legal documents

---

## Typography System

**Font Families**:
- Primary: 'Inter' or 'Roboto' (via Google Fonts)
- Monospace: 'Roboto Mono' for RUT, RUC, license plates

**Hierarchy**:
- Page Titles: text-3xl md:text-4xl, font-bold, tracking-tight
- Section Headers: text-2xl md:text-3xl, font-semibold
- Card/Module Titles: text-xl, font-semibold
- Form Labels: text-sm, font-medium, uppercase, tracking-wide
- Body Text: text-base, font-normal
- Legal/Official Text: text-sm, leading-relaxed
- Metadata/Captions: text-xs md:text-sm, font-medium

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-6 md:p-8
- Section spacing: py-12 md:py-16
- Card gaps: gap-6
- Form field spacing: space-y-4

**Container Strategy**:
- Max-width containers: max-w-7xl mx-auto px-4 md:px-6
- Form containers: max-w-2xl mx-auto
- Dashboard grid: max-w-6xl mx-auto

---

## Component Library

### Navigation Bar
- Fixed top position, full width with backdrop blur
- Height: h-16 md:h-20
- Contains: Logo/title (left), user avatar/menu (right)
- User dropdown: Positioned absolute, right-0 top-full, w-64
- Dropdown items: Avatar thumbnail, username, divider, menu options with icons

### Landing Page
**Hero Section**:
- Height: min-h-[60vh] (not full viewport)
- Centered content with max-w-4xl
- Institutional badge/seal image: w-24 h-24 md:w-32 md:h-32
- Main heading + subtitle + CTA button stack
- Background: Subtle gradient or pattern overlay

**Information Section**:
- 2-column grid on desktop (lg:grid-cols-2), single column mobile
- Service cards with icons, titles, brief descriptions
- Padding: py-16 md:py-24

### Dashboard Layout
**Module Grid**:
- 2-column on tablet (md:grid-cols-2), 3-column on desktop (lg:grid-cols-3)
- Gap: gap-6
- Each module card: Minimum height h-48, hover elevation effect

**Search Modules** (Vehicle/Case/Person):
- Icon at top (h-12 w-12)
- Title + description
- Primary action button at bottom
- Visual hierarchy: icon → title → description → button

### Forms (Official Document Style)

**Structure**:
- White background cards with subtle border
- Form header: Institutional heading with reference number
- Grouped fields with clear section breaks
- Field spacing: space-y-6 for sections, space-y-4 for individual fields

**Form Fields**:
- Label above input, font-medium text-sm
- Input fields: Full width, h-12, rounded borders, focus ring
- Helper text below: text-xs
- Required field indicator: Red asterisk
- Select dropdowns: Custom styled with chevron icon

**Document Elements**:
- Legal text blocks: Bordered containers, padding p-4, background subtle
- Signature areas: Dotted border bottom, labeled clearly
- Date/timestamp: Right-aligned, text-sm
- Official seals: Circular badges, positioned bottom-right

### Data Tables
- Striped rows for readability
- Sticky header on scroll
- Column headers: font-semibold, uppercase text-xs, tracking-wide
- Row height: h-16
- Action buttons: Icon buttons aligned right
- Responsive: Stack on mobile with card layout

### Cards (Case/Citizen/Vehicle Display)
- Padding: p-6
- Header section with title + status badge
- Metadata grid: 2-column (label: value pairs)
- Footer with action buttons
- Subtle border, rounded corners

### Status Badges
- Small: px-3 py-1, text-xs, rounded-full
- States: Active, Pending, Closed, Deleted
- Position: Inline with titles or top-right of cards

### Trash/Papelera View
- Warning banner at top (amber/yellow theme)
- Table or grid of deleted items with grayed appearance
- Two-button action: "Restore" (primary) + "Delete Forever" (destructive, outlined)

### Profile Section
- Avatar: Large circular, w-24 h-24
- Username display: text-2xl font-semibold
- Information grid: 2-column layout for data pairs
- Section dividers with icons (Personal Info, Character Background, Records)

### Modals/Dialogs
- Centered overlay with backdrop
- Max-width: max-w-lg
- Padding: p-6
- Header with title + close button
- Content area + action footer

---

## Images

**Logo/Seal**:
- Chilean judicial system seal or custom RP server emblem
- Placement: Navbar (left), Landing hero (centered), Form headers
- Size: 120x120px standard

**Hero Background** (Landing):
- Subtle institutional imagery: Chilean government building façade, abstract justice scales, or Chilean flag elements with dark overlay
- Position: Background cover with overlay gradient
- Treatment: Darkened/desaturated for text legibility

**Avatar Images**:
- Discord user avatars throughout (navbar, profile)
- Fallback: Initials in colored circle

---

## Responsive Behavior
- Mobile-first approach
- Breakpoints: md (768px), lg (1024px)
- Navigation: Hamburger menu on mobile
- Dashboard grid: 1 column → 2 columns → 3 columns
- Forms: Full width on mobile, centered on desktop
- Tables: Convert to stacked cards on mobile

---

## Accessibility
- All interactive elements: Minimum 44x44px touch target
- Form inputs: Associated labels with for/id
- Color contrast: WCAG AA minimum
- Focus indicators: Visible ring on all interactive elements
- Skip navigation link for screen readers