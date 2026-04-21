# TestBank ACH — Figma Make Guidelines & Style Guide

## 📋 Document Overview
This guide establishes design standards for the TestBank ACH "Paga con tu Llave" experience in Figma Make. It serves as the source of truth for visual consistency, component architecture, and token usage across the prototype.

---

## 🎨 Color System

### Primary Brand Colors
| Token | Value | Usage |
|-------|-------|-------|
| `brand-primary` | `#003087` | Primary buttons, headers, active states |
| `brand-secondary` | `#00A8A8` | Accent elements, progress indicators |
| `brand-accent` | `#005BBB` | Hover states, interactive elements |

### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| `error` | `#DC2626` | Error states, rejection, alerts |
| `success` | `#16A34A` | Success confirmations, approved states |
| `warning` | `#D97706` | Warning messages, cautions |

### Neutrals
| Token | Value | Usage |
|-------|-------|-------|
| `surface` | `#F5F7FA` | Screen backgrounds |
| `surface-card` | `#FFFFFF` | Card, modal, input backgrounds |
| `on-surface` | `#1A1A2E` | Primary text, high contrast |
| `text-muted` | `#6B7280` | Secondary text, labels, hints |
| `border` | `#E5E7EB` | Dividers, borders |

---

## 🔤 Typography

### Font Family
- **Default:** Inter (Google Fonts)
- **Fallback:** system-ui, sans-serif

### Type Scale

| Component | Size | Weight | Line Height | Usage |
|-----------|------|--------|-------------|-------|
| H1 | 24px | 700 | 120% | Page headers |
| H2 | 18px | 600 | 130% | Section titles |
| Body | 16px | 400 | 145% | Body text, descriptions |
| Small | 14px | 500 | 140% | Labels, secondary text |
| Tiny | 12px | 500 | 140% | Hints, captions, badges |
| Mono | 14px | 500 | 135% | Key display, order IDs |

### Text Colors
- **Primary:** `on-surface` (#1A1A2E)
- **Secondary:** `text-muted` (#6B7280)
- **Error:** `error` (#DC2626)
- **Success:** `success` (#16A34A)
- **Accent:** `brand-primary` (#003087)

---

## 🔲 Component Library

### Spacing System
All spacing uses an 4px grid:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Micro spacing |
| `sm` | 8px | Compact spacing |
| `md` | 12px | Standard spacing |
| `lg` | 16px | Large spacing |
| `xl` | 24px | Extra large spacing |
| `2xl` | 32px | Section spacing |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `btn` | 8px | Buttons, inputs |
| `card` | 12px | Cards, modals |
| `xl2` | 16px | Large containers |

### Shadows
- **Card:** `0 2px 8px rgba(0,0,0,0.08)` — Subtle elevation
- **Modal:** `0 20px 60px rgba(0,0,0,0.2)` — Strong elevation
- **None:** Flat design for primary surfaces

---

## 📱 Layout Rules

### Screen Dimensions
- **Mobile:** 360px–420px (primary design breakpoint)
- **Tablet:** 768px
- **Desktop:** 1280px+

### Safe Area
- **Mobile:** 16px padding on sides
- **Max width:** 420px (centered on desktop)
- **Status bar:** 24px top safe area (mobile)
- **Bottom nav:** 60px fixed at bottom

### Grid System
- 4-column grid on mobile
- 12-column grid on tablet/desktop
- Gap: 12px

---

## 🔘 Button Component

### Variants
1. **Primary**
   - Background: `brand-primary` (#003087)
   - Text: White
   - Padding: 12px (vertical) × 24px (horizontal)
   - Min height: 48px
   - Hover: `brand-accent` (#005BBB)
   - Active: Scale 95%, opacity 90%

2. **Secondary**
   - Background: `brand-secondary` (#00A8A8)
   - Text: White
   - Padding: 12px × 24px
   - Min height: 48px
   - Hover: Opacity 90%
   - Active: Scale 95%

3. **Ghost**
   - Background: Transparent
   - Border: 1px solid `brand-primary`
   - Text: `brand-primary`
   - Padding: 12px × 24px
   - Min height: 48px
   - Hover: Light blue background
   - Active: Scale 95%

4. **Danger**
   - Background: Transparent
   - Border: 1px solid `error`
   - Text: `error`
   - Padding: 12px × 24px
   - Min height: 48px
   - Hover: Light red background

### States
- **Default:** Normal styling
- **Hover:** Color shift or opacity change
- **Active:** Scale 95% + visual feedback
- **Disabled:** 50% opacity, cursor not-allowed
- **Loading:** Spinner icon + disabled state

---

## 📝 Input Component

### Text Input
- **Border:** 1px solid `border` (#E5E7EB)
- **Border radius:** 8px
- **Padding:** 12px (vertical) × 16px (horizontal)
- **Min height:** 48px
- **Focus state:** Border color → `brand-primary`
- **Error state:** Border color → `error`

### Features
- **Label:** 14px weight 500, `on-surface` color
- **Placeholder:** `text-muted` color, opacity 70%
- **Prefix slot:** For "@ symbol in key input
- **Error message:** 12px, `error` color, below input
- **Transition:** 150ms color change

---

## 🔄 Loading States

### Spinner
- **Size options:** sm (20px), md (40px), lg (64px)
- **Color:** `brand-secondary` (#00A8A8)
- **Animation:** Continuous 360° rotation, 1s cycle
- **Border width:** 2px (sm), 4px (md/lg)

### Progress Indicator
- **Dots:** 3 × 8px circles
- **Color:** `brand-secondary`
- **Animation:** Staggered pulse, 0.2s delay between

---

## 💬 Modal Component

### Layout
- **Position:** Center-bottom on mobile, center on desktop
- **Width:** 100% on mobile, max 420px on desktop
- **Border radius:** 16px (top-rounded on mobile, full on desktop)
- **Padding:** 24px

### Backdrop
- **Color:** Black with 50% opacity
- **Blur:** Optional backdrop-blur 4px
- **Dismiss:** Click outside or Escape key

### Content
- **Gap between elements:** 16px
- **Max height:** 90vh (mobile), 80vh (desktop)
- **Overflow:** Scroll if content exceeds height

---

## 🎯 Flow 1: "Paga con tu Llave" — Screen Specifications

### Step 1: Payment Gateway
**Purpose:** Display order and payment method selection

- **Header:** Gradient or solid `brand-primary` (56px height)
  - Merchant name, order ID, description
  - Text color: White, with opacity layers
- **Amount card:** White card with shadow, overlaps header (-12px)
  - Large bold amount (28px weight 700)
  - Secondary text (12px `text-muted`)
- **Payment methods list:** 3 items
  - Each item: 60px height, border `border`, hover state
  - Primary item (Pagar con mi llave): Border `brand-primary`, ring shadow
  - Icon slot: 40px circle with brand color background
  - Disabled items: Opacity 60%, cursor not-allowed
- **Spacing:** 16px gutters, 12px between items

### Step 2: Key Input Form
**Purpose:** Collect and validate `@` key

- **Header:** Same as Step 1 style
- **Info banner:** Light blue background, left border
  - Icon + instructional text (14px)
  - Example: "@usuario123"
- **Input field:**
  - Label: 14px weight 500
  - Prefix: "@" symbol in gray, locked
  - Placeholder: "@tuusuario"
  - Error message below on validation failure
- **Button:** Full-width primary button, sticky at bottom
- **Spacing:** 24px between sections

### Step 3: Waiting Screen
**Purpose:** Show confirmation is pending

- **Centered layout:** Flex center, gap 24px
- **Spinner container:** 80px circle with light blue background
  - Spinner inside (40px)
- **Text section:**
  - H2: "Procesando tu pago" (18px weight 600)
  - Subtitle: "Esperando confirmación..." (14px `text-muted`)
- **Pulse dots:** 3 × 8px with staggered animation
- **Background:** Neutral `surface`

### Step 4: Auth Modal
**Purpose:** User approves/rejects from bank

- **Header:** Bank icon + "Solicitud de pago" text
- **Details card:** Light background, 3 rows with dividers
  - Merchant, Amount, Key used
  - Values: Bold, monospace for key
- **Buttons (full-width):**
  - "Aprobar pago" → Secondary variant (teal)
  - "Rechazar" → Danger variant (red outline)
- **Spacing:** 20px gap between elements

### Success Screen
**Purpose:** Confirmation after approval

- **Centered layout:** Icon + text + button
- **Icon:** 80px circle, green background, white checkmark
- **Text:** H2 success message + small subtitle
- **Key display:** Monospace, brand color, copy-on-click optional
- **Button:** "Volver al inicio" primary button

### Rejected Screen
**Purpose:** Show payment failed

- **Icon:** 80px circle, red background, white X
- **Text:** H2 error message + subtitle
- **Buttons:**
  - "Intentar de nuevo" → Primary
  - "Volver al inicio" → Ghost variant

---

## 📐 Responsive Breakpoints

### Mobile-first approach
```
Base: 360px–420px (primary)
tablet: 768px
desktop: 1280px+
```

### Key changes
- **Navigation:** Bottom nav stays fixed (mobile), can move to side (desktop, optional)
- **Spacing:** Reduce from 16px to 12px on very small screens
- **Text size:** Base 16px on mobile, 18px+ on desktop
- **Max width:** Always respect 420px max width for card content

---

## ♿ Accessibility

### Color Contrast
- All text should meet WCAG AA standard (4.5:1 for small text, 3:1 for large)
- Ensure `on-surface` (#1A1A2E) on light backgrounds
- Use `text-muted` only for secondary/disabled text

### Touch targets
- Minimum 48px × 48px for all interactive elements
- 8px minimum padding around tap targets
- Avoid small or closely-spaced buttons

### Keyboard navigation
- Tab order follows visual flow
- Escape key closes modals
- Focus states visible on all interactive elements

### Motion
- Keep animations under 3 seconds
- Respect `prefers-reduced-motion` preference
- Use animations to guide attention, not distract

---

## 🔗 Component States Reference

### Button States
- Normal → Hover → Active/Pressed → Disabled
- Loading state overlays normal styling

### Input States
- Empty → Focused → Filled → Error
- Disabled variant available

### Modal States
- Closed (not rendered) → Open (backdrop + content) → Closing (optional transition)

### Flow States
- Each step has distinct visual identity
- Transitions are smooth (150ms–300ms)
- Loading states show progress

---

## 📦 Figma Make Setup

### Color variables
Create color variables in Figma for each token (name matches CSS custom property):
- `brand-primary`
- `brand-secondary`
- `error`, `success`, `warning`
- `surface`, `surface-card`, `on-surface`, `text-muted`, `border`

### Typography variables
- Body (16/400), Small (14/500), Tiny (12/500)
- Heading (24/700), Subheading (18/600)

### Component structure
```
Components/
├── Buttons/
│   ├── Primary
│   ├── Secondary
│   ├── Ghost
│   └── Danger
├── Inputs/
│   ├── Text Input
│   └── Text Input (Error)
├── Layout/
│   ├── Card
│   └── Modal
├── Indicators/
│   ├── Spinner
│   └── Pulse Dots
└── Flows/
    ├── Flow 1 – Gateway
    ├── Flow 1 – Key Input
    ├── Flow 1 – Waiting
    ├── Flow 1 – Auth Modal
    ├── Success Screen
    └── Rejected Screen
```

### Code Connect labels
- Label each component with framework: **React**
- Path format: `src/components/{category}/{ComponentName}.jsx`
- Example: `src/components/ui/Button.jsx`

---

## 🚀 Implementation Checklist

- [ ] Create color variables in Figma
- [ ] Create typography styles in Figma
- [ ] Build component library in Figma
- [ ] Map components to code via Code Connect
- [ ] Test responsive behavior at 360px, 420px, 768px, 1280px
- [ ] Verify WCAG AA contrast on all text
- [ ] Test keyboard navigation and Escape key behavior
- [ ] Verify all animations respect `prefers-reduced-motion`
- [ ] Validate button touch targets (min 48px)

---

## 📞 Design Tokens Export

When extracting tokens from Figma:
1. Use `get_variable_defs` to export all variables
2. Map into `tailwind.config.js` under `theme.extend`
3. Ensure color names match token names exactly
4. Validate all colors render correctly in development

**Current fallback tokens** (while Figma file is pending):
- Colors use ACH Colombia brand palette
- Font: Inter from Google Fonts
- Spacing and radius follow 4px/8px grid
