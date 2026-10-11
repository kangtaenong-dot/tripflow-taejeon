---
name: TripFlow Korea Concierge
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a1700'
  on-tertiary-container: '#b87500'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 41px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Manrope
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 21px
    letterSpacing: 0em
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Manrope
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system projects an aura of composed luxury, technological precision, and serene exploration. Designed for discerning domestic and international travelers navigating South Korea, the aesthetic balances modern Korean technological minimalism with high-touch executive concierge hospitality. The visual identity avoids frantic commuter visuals in favor of relaxed, anticipatory guidance—elevating route planning and real-time bypass alerts into tranquil curated itineraries.

The interface combines Modern Glassmorphism with iOS 17 Human Interface principles:
- **Translucent Surfaces:** Ambient backdrop blurs (`backdrop-blur-xl`), crisp micro-borders (`1px` hairline structural dividers), and pure white frosted layers floating above soft architectural slates.
- **Executive Composure:** Generous whitespace, precise typography, muted secondary tones, and vibrant semantic traffic telemetry that clarifies without alarming.
- **Tactile Refinement:** Subtle gradient underlays, low-amplitude spring physics, and restrained depth cues simulating physical frosted acrylic and high-spec automotive displays.

## Colors

The palette establishes an authoritative, daylight-forward environment where deep navy anchors key actions while teal and amber introduce refined exploration accents.

### Core Tones
- **Primary (`#0F172A` - Slate Navy):** The structural anchor. Applied to primary calls-to-action, active state icons, high-emphasis headlines, and bottom navigation anchors.
- **Secondary (`#0D9488` - Deep Teal):** The journey accent. Used for optimal traffic routes, real-time recalculation indicators, booking confirmation chips, and primary status toggles.
- **Tertiary (`#F59E0B` - Warm Amber):** The premium highlight. Dedicated to KTO (Korea Tourism Organization) verified seals, VIP concierge alerts, cultural landmark pins, and transit recommendations.
- **Neutral (`#64748B` - Slate Neutral):** Provides precise secondary labeling, metadata, structural borders, and de-emphasized map controls.

### Semantic Traffic Telemetry
- **Smooth Flow (`#10B981` Emerald):** Uncongested expressways, rapid bypass corridors, and optimal travel windows.
- **Moderate Density (`#F59E0B` Amber):** Slowing velocity, tollgate bottlenecks, and high-season tourist approaches.
- **Severe Congestion (`#F43F5E` Coral Red):** Gridlock warnings, mountain pass restrictions, and active redirection prompts.

### Backgrounds & Surfaces
- **Canvas Base (`#F8FAFC`):** An ultra-clean, neutral slate wash that eliminates pure-white eye fatigue under daylight travel.
- **Card Surface (`#FFFFFF` with `85% - 92%` opacity):** Frosted glass panels allowing map vibrancy and imagery to subtly bleed through.
- **Subtle Outline (`#E2E8F0`):** 1px boundaries ensuring distinct separation on high-density Retina screens.

## Typography

The type system blends the contemporary geometry of **Plus Jakarta Sans** with the balanced legibility of **Manrope**. It aligns directly with the iOS dynamic type scale and accommodates bilingual pairing (Latin and Korean glyphs such as Pretendard/Apple SD Gothic Neo) without baseline shifts or vertical clipping.

- **Headlines (`Plus Jakarta Sans`):** Generates architectural structure and an approachable luxury feel. Kerning is tightened slightly (`-0.01em` to `-0.02em`) across all display scales to maintain typographic tension on compact 393px viewports.
- **Body & Labels (`Manrope`):** Optimized for continuous reading, distance telemetry, and dense metadata tables. Generous x-height prevents numeric degradation when displaying live ETA counters, highway route codes, or bilingual road designations.
- **Numbers & Metrics:** Tabular numerals (`tnum`) must be enforced on all transit arrival metrics, toll calculations, and speed monitors to prevent visual jittering during live re-routes.

## Layout & Spacing

The layout is engineered around an iOS 393pt reference canvas (iPhone standard viewport) utilizing an 8pt baseline grid with 4pt micro-increments.

### Grid & Margins
- **Safe Area Insets:** Fixed horizontal canvas margin of `16px` (`margin: 1rem`) preserves edge clearance for thumb sweeps, expanding to `20px` on sheet modals.
- **Column Structure:** Fluid 4-column system on mobile devices (`gutter: 1rem`), expanding to an 8-column layout when scaled to iPad travel dashboard views.
- **Vertical Hierarchy:**
  - Header & Telemetry Badges: `space-xs` (4px) to `space-sm` (8px) internal gaps.
  - Stacked List Items & Inputs: `space-md` (16px) inter-component separation.
  - Distinct Content Sections: `space-xl` (32px) separation to retain an uncluttered, high-end concierge pace.

### Responsive Behaviors
- **Mobile Handheld (375px - 430px):** Single-column stacked stream. Map actions float within thumb-reach (bottom 40% of the viewport).
- **Sheet Heights:** iOS style bottom sheets snap dynamically to 3 standard detents: 15% (minimized traffic summary), 45% (route alternatives & certified stops), and 90% (turn-by-turn and booking itinerary).

## Elevation & Depth

Depth is established via translucent planes, backdrop filters, and subtle ambient shadows tinted with slate navy rather than raw black.

### Surface Hierarchy
1. **Level 0 (Map / Canvas Base):** Deep vector cartography or soft `#F8FAFC` base screen.
2. **Level 1 (Subordinate Cards):** Background `rgba(255, 255, 255, 0.75)` with `backdrop-filter: blur(16px)`, enclosed by a `1px` border of `rgba(226, 232, 240, 0.8)`. Shadow: `0 2px 8px -2px rgba(15, 23, 42, 0.04)`.
3. **Level 2 (Interactive Cards & Drawers):** Background `rgba(255, 255, 255, 0.90)` with `backdrop-filter: blur(24px)`, `1px` border of `rgba(255, 255, 255, 0.6)`. Shadow: `0 12px 24px -6px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.03)`.
4. **Level 3 (Floating Controls & Navigation Bar):** Background `rgba(15, 23, 42, 0.92)` for dark controls or `rgba(255, 255, 255, 0.94)` for light controls with `backdrop-filter: blur(32px)`. Shadow: `0 20px 32px -8px rgba(15, 23, 42, 0.14)`.

### Border Treatment
Strict `1px` crisp inner highlights simulate frosted glass edges, providing high-contrast definition against dynamic map tiles and photography.

## Shapes

The shape system adopts a roundedness factor of `2`, utilizing continuous iOS-style squircles (`corner-smoothing: 60%`) to deliver a smooth, tailored feel.

### Corner Radii Guidelines
- **Base Components (`0.5rem` / 8px):** Tags, micro-badges, inline text fields, and traffic telemetry pill indicators.
- **Medium Panels (`1rem` / 16px):** Primary interactive buttons, route overview cards, and media modules.
- **Large Containers (`1.5rem` / 24px):** Bottom sheet modals, floating concierge overlays, and pinned itinerary cards.
- **Interactive Micro-controls (`9999px` Full Pill):** Floating map layer toggles, status pills, and audio guide play heads.

## Components

### Buttons
- **Primary CTA:** Background `#0F172A`, text `#FFFFFF`, radius `1rem`, height `52px`. Micro-border: `1px solid rgba(255, 255, 255, 0.1)`. Active state applies `scale(0.98)` with haptic feedback.
- **Secondary / Action:** Translucent teal tint (`rgba(13, 148, 136, 0.1)`), text `#0D9488`, radius `1rem`, height `48px`.
- **Tertiary Glass Button:** Background `rgba(255, 255, 255, 0.85)`, border `1px solid #E2E8F0`, text `#0F172A`, shadow `0 2px 6px rgba(15, 23, 42, 0.05)`.

### Cards & Itinerary Modules
- Constructed using frosted white surfaces (`rgba(255, 255, 255, 0.88)`), wrapped in `1px solid #E2E8F0` with `1.5rem` corner radius.
- Padding uses `space-md` (16px) internally, with content structured into top metadata, headline route, and bottom status metrics.

### Chips & Filter Tags
- Height `36px`, rounded `9999px` (pill), padding `0 14px`.
- Selected: `#0F172A` fill with white text.
- Unselected: `rgba(255, 255, 255, 0.8)` fill with `1px solid #E2E8F0` border and `#64748B` text.

### Traffic Status Indicators
- **Component Anatomy:** Encapsulated pill containing an animated pulsing dot (`6px`) paired with a bold status label and velocity metrics (e.g., `88 km/h`).
- **Smooth Flow:** Green `#10B981` text, background `rgba(16, 185, 129, 0.12)`, border `rgba(16, 185, 129, 0.25)`.
- **Moderate:** Amber `#F59E0B` text, background `rgba(245, 158, 11, 0.12)`, border `rgba(245, 158, 11, 0.25)`.
- **Severe Congestion:** Coral Red `#F43F5E` text, background `rgba(244, 63, 94, 0.12)`, border `rgba(244, 63, 94, 0.25)`.

### Korea Tourism Organization (KTO) Certified Badges
- High-touch seal component featuring a refined warm amber keyline (`#F59E0B`), warm ivory backing (`#FFFBEB`), and stylized micro-badge insignia.
- Typography: `label-sm` in all caps (`KTO CERTIFIED EXCELLENCE`), ensuring credibility for international and VIP travelers.

### Form Inputs & Location Pickers
- Height `52px`, radius `0.75rem`, background `rgba(255, 255, 255, 0.9)`, border `1px solid #E2E8F0`. Focus state shifts border to `#0F172A` with an ambient ring: `0 0 0 3px rgba(15, 23, 42, 0.08)`. Left icon slots feature customized departure (teal) and arrival (amber) pins.