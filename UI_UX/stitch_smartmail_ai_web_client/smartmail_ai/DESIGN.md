---
name: SmartMail AI
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#4953bc'
  on-secondary: '#ffffff'
  secondary-container: '#8792fe'
  on-secondary-container: '#17228f'
  tertiary: '#434853'
  on-tertiary: '#ffffff'
  tertiary-container: '#5b606b'
  on-tertiary-container: '#d7dbe8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e0e0ff'
  secondary-fixed-dim: '#bdc2ff'
  on-secondary-fixed: '#000767'
  on-secondary-fixed-variant: '#2f3aa3'
  tertiary-fixed: '#dee2ef'
  tertiary-fixed-dim: '#c2c6d3'
  on-tertiary-fixed: '#171c25'
  on-tertiary-fixed-variant: '#424751'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies high-throughput personal productivity and focused communication. Borrowing the speed and structural precision of modern developer tools alongside the calm legibility of top-tier desktop mail clients, the visual language minimizes cognitive overhead while elevating AI assistance from an intrusive gimmick to an ambient co-pilot.

The core aesthetic combines hyper-clean minimalism with structural utility:
- **Crisp Architecture:** Dense, tabular information hierarchy that treats emails, threads, and triage queues with razor-sharp fidelity.
- **Ambient Intelligence:** AI capabilities are manifested through understated indigo and violet surface washes rather than loud gradients or decorative noise.
- **Decisive Typography:** Scannable monospace-adjacent alignment principles paired with legible grotesque sans-serif fonts to support rapid keyboard-first navigation.
- **Calm Authority:** Crisp white surfaces framed by neutral slate hairline borders to reduce visual fatigue during hours of continuous triage.

## Colors

The palette establishes an ultra-clean, high-legibility light environment with precise semantic signaling for security, priority levels, and AI operations:

- **Base Surfaces & Borders:** Primary canvas rests on pure white (`#FFFFFF`) with secondary utility panels (mail navigation, thread lists) on `#F8FAFC`. Structural division uses hairline borders (`#E2E8F0` and `#F1F5F9`).
- **Typography & Content:** Text utilizes deep slate charcoal (`#0F172A`) for primary headlines, senders, and active threads, shifting to muted slate (`#334155` and `#64748B`) for metadata, timestamps, and body snippets.
- **Primary & AI Accent:** The core interactive tone is vibrant indigo (`#4F46E5`), balanced by AI surface tinting (`#EEF2FF`) and supporting AI accents (`#818CF8`).
- **Priority System:**
  - *Critical:* Crimson stroke and fill (`#E11D48`, background `#FFF1F2`).
  - *High:* Amber-orange (`#EA580C`, background `#FFF7ED`).
  - *Medium:* Subtle slate (`#475569`, background `#F1F5F9`).
  - *Low:* Light slate mute (`#94A3B8`, background `#F8FAFC`).
- **Security & Phishing Badges:**
  - *Safe / Verified:* Emerald (`#059669`, background `#ECFDF5`).
  - *Suspicious / Caution:* Warm Amber (`#D97706`, background `#FFFBEB`).
  - *Malicious / High Risk:* Vibrant Rose (`#E11D48`, background `#FFF1F2`).
- **Meeting & Calendar Triggers:** Rich Emerald (`#10B981`) paired with Indigo (`#4F46E5`) for detected dates and one-click schedule holds.

## Typography

The typography scale utilizes **Inter** across all major communication hierarchies, leaning on precise tracking and disciplined weight pairings to optimize scanning speed across hundreds of thread subjects.

- **Weight Pairing:** Titles and active mail senders utilize `SemiBold` (600) for instantaneous visual acquisition. Body copy remains on `Regular` (400) to keep long-form thread consumption effortless.
- **Tabular & Code Support:** Keyboard shortcuts (`⌘K`, `E`, `J/K`) and message telemetry incorporate monospaced sizing (`JetBrains Mono` or tabular numerals) to reinforce speed and precision.
- **Vertical Density:** Tight line heights (`18px` to `20px` on standard body rows) enforce the compact, professional information density expected of heavy inbox triage applications.

## Layout & Spacing

The layout leverages a disciplined, three-pane fluid column setup reminiscent of Linear and Superhuman desktop architectures:
- **Left Rail (Navigation & Workspaces):** Fixed 240px width, collapsible to a 56px icon rail.
- **Center Pane (Thread List / Triage Stream):** Responsive column bounded between 360px and 480px, maintaining strict 36px–44px single-line thread height for maximum vertical density.
- **Right Pane (Reading View & AI Workspace):** Fluid flex pane taking the remaining canvas, with dedicated toggleable sidecar (320px) for AI drafts, summaries, and action extraction.

### Mobile & Responsive Adaptations
- **Desktop (>= 1024px):** Standard 3-pane workflow with simultaneous list and reading views.
- **Tablet (768px - 1023px):** Left navigation collapses to an off-canvas drawer or rail; thread list and detail view split horizontally or operate via master-detail push.
- **Mobile (< 768px):** Single-pane stack view. Navigation transitions to a bottom bar or swipe drawer. Thread items scale to a comfortable 56px tap target with outer screen margins locked at `1rem`.

## Elevation & Depth

Visual separation relies on crisp surface shifts and hairline borders rather than heavy drop shadows:

- **Surface Tiers:**
  - *Canvas/Base (Level 0):* Pure background `#FFFFFF` for reading messages, complemented by `#F8FAFC` for folder trees and auxiliary sidebars.
  - *Hover & Focus Overlays (Level 1):* Thread hover states transition to `#F1F5F9` with zero shadow.
  - *Floating Dialogs & Command Bar (Level 2):* The universal command palette (`⌘K`), quick-reply composer, and popover menus use `#FFFFFF` encapsulated by a hairline border (`#E2E8F0`) and an ultra-diffused ambient shadow: `0 8px 30px -4px rgba(15, 23, 42, 0.08)`.
- **AI Focus State:** Active AI processing or drafted inline completions employ a subtle border glow: `0 0 0 1px #818CF8, 0 2px 8px rgba(79, 70, 229, 0.06)`.

## Shapes

The interface utilizes a restrained, subtle radius philosophy (`roundedness: 1`). Interactive elements feel engineered and structured rather than overtly soft or playful:

- **Inputs, Buttons, and Cards:** Default to `0.25rem` (4px) to `0.375rem` (6px) corner rounding to maintain a tailored, pro-tool edge.
- **Status & Metadata Badges:** Use `4px` corner radiuses for dense status chips (Critical, Security, Meeting flags) to cleanly match typography bounds.
- **Floating Modals & Composer:** Use `rounded-lg` (`0.5rem` / 8px) to establish soft structural containment for floating contexts without compromising efficiency.

## Components

### Buttons
- **Primary Action (Send, AI Generate):** Solid `#4F46E5` background, white label, 32px height, 12px horizontal padding, 4px border radius. Hover: `#4338CA`.
- **Secondary Action (Discard, Snooze):** Crisp `#FFFFFF` surface with hairline `#E2E8F0` border, `#334155` text. Hover: `#F8FAFC`.
- **Ghost Action (Toolbar icons, thread triage):** Transparent surface, `#64748B` icon color. Hover: `#F1F5F9`, color shifts to `#0F172A`.

### Status Badges & Chips
- **Priority Indicator:** Compact badge, 18px height, 6px horizontal padding, `11px` semi-bold text, uppercase.
  - *Critical:* Background `#FFF1F2`, text `#E11D48`, border `#FFE4E6`.
  - *High:* Background `#FFF7ED`, text `#EA580C`, border `#FFEDD5`.
- **Security Check:** Inline tag displaying verification state:
  - *SPF/DKIM Verified:* Background `#ECFDF5`, text `#059669`.
  - *Suspicious Domain:* Background `#FFFBEB`, text `#D97706`.
  - *Phishing Warning Banner:* Full-width thread banner, background `#FFF1F2`, border `#FECDD3`, text `#9F1239` with bold action link.
- **Meeting Detection:** Background `#EEF2FF`, border `#C7D2FE`, text `#4338CA`, integrated with calendar mini-icon and a "Quick Add" trigger.

### Thread List Items
- **Structure:** Single horizontal flex container, 38px height (compact mode) or 48px (spacious mode).
- **Unread State:** Solid `#0F172A` text, 600 weight, subtle 2px vertical indicator bar in `#4F46E5` on the absolute left edge.
- **Read State:** `#64748B` text, 400 weight, transparent background.
- **Selection State:** Light indigo wash `#F5F7FF` with `#E0E7FF` border containment.

### Inputs & Composer
- **Quick Search / Command Bar:** Frameless input with persistent keyboard shortcut glyph (`⌘K`), background `#F8FAFC`, active state transitions to `#FFFFFF` with hairline `#CBD5E1` outline.
- **Email Composer:** Clean inline or floating box with borderless subject line, markdown formatting bar, and dedicated AI prompt field (`#EEF2FF` background) for autonomous drafting and tone adjustment.