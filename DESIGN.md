---
name: Calvin Yiu, PhD
description: Portfolio and public CV set as a labelled laboratory reagent on amber glass.
colors:
  band-cobalt: "#1f4fd1"
  band-cobalt-ink: "#163a9e"
  label-stock: "#fbfbf7"
  label-shade: "#f1f0ea"
  label-lit: "#ffffff"
  ink: "#121211"
  ink-soft: "#45443f"
  hairline: "#c9c7bd"
  glass-deep: "#241105"
  glass-body: "#4a230a"
  glass-warm: "#6e3810"
  glass-highlight: "#82461a"
  on-glass: "#f4dcbc"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3.25rem, 7.6vw, 6rem)"
    fontWeight: 850
    lineHeight: 0.88
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 66"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 5.2vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 68"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.375rem, 1.9vw, 1.75rem)"
    fontWeight: 750
    lineHeight: 1.08
    fontVariation: "'wdth' 78"
  subhead:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    letterSpacing: "0.01em"
    fontVariation: "'wdth' 70"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  body-small:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 750
    letterSpacing: "0.04em"
    fontVariation: "'wdth' 72"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    fontFeature: "'zero' 0, 'tnum' 1"
  catalogue-number:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 700
    letterSpacing: "0.04em"
    fontFeature: "'zero' 0, 'tnum' 1"
rounded:
  none: "0px"
spacing:
  edge: "clamp(16px, 5vw, 72px)"
  pad: "clamp(20px, 3.3vw, 48px)"
  gap: "clamp(24px, 3.3vw, 48px)"
  bar: "56px"
  row: "10px"
components:
  label-panel:
    backgroundColor: "{colors.label-stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.pad}"
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.label-stock}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
    height: "48px"
  button-solid-hover:
    backgroundColor: "#000000"
    textColor: "{colors.label-stock}"
  button-line:
    backgroundColor: "{colors.label-stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
    height: "48px"
  button-line-hover:
    backgroundColor: "{colors.label-shade}"
    textColor: "{colors.ink}"
  spec-row:
    textColor: "{colors.ink}"
    typography: "{typography.body-small}"
    padding: "10px 0"
  entry-slot:
    textColor: "{colors.ink}"
    padding: "7px 0"
  catalogue-number:
    textColor: "{colors.band-cobalt-ink}"
    typography: "{typography.catalogue-number}"
  prize-tag:
    backgroundColor: "{colors.band-cobalt}"
    textColor: "{colors.label-lit}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "3px 7px 2px"
  contact-route:
    backgroundColor: "{colors.label-stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "clamp(18px, 2.2vw, 28px)"
  contact-route-hover:
    backgroundColor: "{colors.label-lit}"
  nav-bar:
    backgroundColor: "{colors.glass-deep}"
    textColor: "{colors.on-glass}"
    height: "{spacing.bar}"
---

# Design System: Calvin Yiu, PhD

## Overview

**Creative North Star: "The Reagent Label"**

Every section of the CV is a paper label stuck to a bottle of amber glass. The page ground is the glass: a deep amber-brown with one soft vertical highlight running down the middle of the viewport, fixed while the labels scroll past. On it sit near-white label panels, each opened by a cobalt band and divided by black rules into the grids a supplier catalogue uses: specification rows, slotted entries, a certificate-of-analysis table, a reference list.

The type is industrial and compressed. Names and section titles are a heavy condensed grotesk in capitals; running text is the same family at normal width; monospace appears only where a catalogue would print a number, a value or a date. Corners are square everywhere. Depth is a single soft drop under each label, as if it were lifted a millimetre off the glass, and nothing else floats.

The one live element is the molecule on the hero label: a skeletal aspirin whose carbons, on hover or focus, pin a cobalt leader line and an illustrative shift value, while the bonds one and two hops away light up in cobalt. It shows the IMPRESSION mechanism in place rather than describing it.

**Key Characteristics:**
- Amber-glass ground, white label stock, black rules, one cobalt band colour.
- Condensed heavy capitals for names; mono only for numbers, values and dates.
- Fixed-slot entries with right-aligned, deep-linkable catalogue numbers.
- Square corners and 2px / 1px rule hierarchy instead of cards and fills.
- One signature interaction: atom annotation with message-passing bond highlight.

## Colors

A two-material palette: warm amber glass behind, cool white paper in front, with cobalt as the only printed colour.

### Primary
- **Label Cobalt** (band-cobalt): the 18px band across the top of every label, the active atom dot, highlighted bonds, the leader line, the prize tag, text selection and the focus outline. It marks the label as a label and points at the one thing in focus.
- **Deep Cobalt Ink** (band-cobalt-ink): cobalt at text weight. Catalogue numbers, annotation atom ids, and the hover colour of inline links on label stock (9.5:1 on label stock).

### Neutral
- **Label Stock** (label-stock): the ground of every label panel and the molecule field.
- **Shaded Stock** (label-shade): hover fill for line buttons and the highlight behind a deep-linked catalogue entry.
- **Lit Stock** (label-lit): pure white, for the hover state of contact routes, image frames and text on cobalt.
- **Ink** (ink): all primary text, all structural rules, solid button fill, molecule bonds.
- **Soft Ink** (ink-soft): secondary text such as ledes, metadata, slot labels, organisation sublines and talk venues (9.4:1 on label stock).
- **Hairline** (hairline): 1px row rules inside entry slots and the composition list. It is a rule colour only, never text (1.6:1).
- **Glass Deep / Body / Warm / Highlight** (glass-deep, glass-body, glass-warm, glass-highlight): the four stops of the page ground, laid as a horizontal gradient deep → body → warm → highlight (at 51%) → warm → body → deep, with `background-attachment: fixed`. Glass Deep alone fills the top bar and the mobile menu sheet.
- **On-Glass Amber** (on-glass): every piece of text that sits directly on glass: bar name, nav, menu button, footer (5.4:1 at the brightest glass stop).

**The One Ink Rule.** Cobalt is the only chromatic colour printed on a label. Everything else on label stock is ink, soft ink or hairline. A second accent would make the label a poster.

**The Two Materials Rule.** Text either sits on label stock (ink family) or on glass (on-glass amber). Never set ink on glass or amber text on a label.

## Typography

**Display Font:** Archivo variable (with Helvetica Neue, Arial), width axis 62–125%, weight 100–900, self-hosted.
**Body Font:** Archivo at 100% width.
**Label/Mono Font:** JetBrains Mono (with ui-monospace, SF Mono, Menlo), tabular figures on, slashed zero off, self-hosted Latin and Greek subsets (Greek carries the δ in shift annotations).

**Character:** One grotesk doing two jobs by changing width: compressed and heavy for anything that is a name, open and plain for anything that is read. Mono is the catalogue printer.

### Hierarchy
- **Display** (850, clamp 3.25–6rem, lh 0.88, 66% width, caps): the hero name and the contact title only. The "PhD" suffix drops to weight 500 in the same size.
- **Headline** (800, clamp 2.5–4.5rem, lh 0.92, 68% width, caps): section titles in the label head.
- **Title** (750, clamp 1.375–1.75rem, lh 1.08, 78% width, sentence case): entry names. Certificate role names use the same voice at 1.25rem, 80% width.
- **Subhead** (800, 1.5rem, 70% width, caps, ruled 2px beneath): column heads inside a label (Composition, Papers, Talks). Contact route names use this voice at 1.75rem, 72%.
- **Body** (400, 1rem, lh 1.55): running text; ledes at 1.0625rem capped at 68ch, entry prose capped at 62–64ch. The hero role line sits at clamp 1.125–1.4rem, 34ch.
- **Body small** (400, 0.9375rem): spec values, certificate cells, references, talks.
- **Label** (750, 0.8125–0.875rem, 72% width, caps, +0.04em): spec terms, slot terms, table headers, composition terms, the prize tag.
- **Mono** (400–700, 0.8125rem): catalogue numbers, dates, DOIs, URLs, stack lists, label metadata, the hero lot strip, molecule annotations.

**The Width-Is-Rank Rule.** Hierarchy is carried by width and weight of one family, not by adding families. Narrower and heavier means more of a name; 100% width means prose.

**The Printer Rule.** Mono is for what a catalogue would print from a database: numbers, codes, dates, identifiers, stack lists. Never for headings or descriptive sentences.

## Layout

The page is a vertical stack of screens, each holding one label inset from the viewport by an equal edge (clamp 16–72px) on both sides. Inside a label, padding is the pad step (clamp 20–48px) and column gutters the gap step (clamp 24–48px). A 56px sticky top bar sits above, and anchor scrolling offsets by the bar plus 8px.

- **Hero:** the label fills the first viewport (100svh minus the bar). A full-width lot strip, then two columns at 1.12 : 1 divided by a 2px ink rule: name, role, spec table and actions on the left; the molecule on the right.
- **Research software:** two columns at 1.5 : 1, each entry a subgrid of media over body so the two bodies share a baseline.
- **Industry catalogue:** two equal columns; each entry spans three subgrid rows (head, prose, slots) so slots align across the row.
- **Experience:** certificate table and composition aside at 1.75 : 1, divided by a 2px rule.
- **Literature:** papers and talks at 1.25 : 1.
- **Contact:** two equal route blocks.

Responsive steps: at 1100px the hero and certificate stack to one column (the vertical divider becomes a horizontal one; the molecule caps at 640px; photo sits beside the composition list). At 860px the nav collapses to a menu button and every two-column grid becomes one column; subgrid alignment is dropped. At 600px the lot strip loses its last field. At 560px spec rows stack term over value, action buttons go full width, and the certificate and talks tables re-flow as stacked grid rows with the table header hidden.

**The Equal Edge Rule.** Every label sits inside the same edge on left and right at every width; nothing bleeds to the viewport edge except the glass and the bar.

## Elevation & Depth

Depth is physical and singular: each label carries one soft shadow, a 1px dark lip plus a long diffuse drop, as if paper were lifted off glass. Interactive blocks (buttons, contact routes) lift 2px on hover and gain a short soft shadow; on press they drop back with no shadow. There are no hard offset shadows, no layered cards and no glows.

### Shadow Vocabulary
- **Label lift** (`box-shadow: 0 1px 0 rgba(0,0,0,0.25), 0 28px 56px -24px rgba(0,0,0,0.6)`): every label panel, always.
- **Button hover** (`box-shadow: 0 8px 18px -10px rgba(0,0,0,0.55)`): buttons on hover, with translateY(-2px).
- **Route hover** (`box-shadow: 0 14px 28px -16px rgba(0,0,0,0.5)`): contact routes on hover, with translateY(-2px).

**The Paper On Glass Rule.** The label is the only thing that floats at rest. Everything inside it is printed flat; lift appears only as a response to pointer hover.

## Shapes

Square corners everywhere (0px). Form is built from rules, not containers: a 2px ink rule closes the label head, divides hero and certificate columns, opens each catalogue entry and underlines column heads and table headers; a 1px ink rule separates spec rows, certificate rows, references and talks; a 1px hairline separates slot rows and composition rows. Bordered blocks (buttons, contact routes) use a 2px ink outline; image frames and the headshot use 1px ink. The label's cobalt band is an 18px top border, not a separate element.

**The Rule Hierarchy Rule.** 2px ink closes a group, 1px ink separates peers, 1px hairline separates attributes inside one entry. Never use a fill or a radius to do a rule's job.

## Components

### Label
The unit of the page. Label stock ground, 18px cobalt top band, pad-step padding, label-lift shadow. Opens with a head: the section headline on the left, mono metadata (scope and dates, in soft ink) on the right, baseline-aligned and closed by a 2px ink rule. An optional lede follows in soft ink. The hero label is the one variant: zero padding, a mono lot strip (catalogue number, grade, lot) under the band closed by a 2px rule, then the two-column body.

### Spec Table
A definition list of term/value rows. Each row is a 9.5rem term column and a fluid value column, 16px gap, 10px vertical padding, 1px ink rule above each row and below the table. Terms in the label voice; values in body small. A hint row sets its value in soft ink. At 560px, term stacks over value.

### Entry (fixed slots)
Every piece of work is an entry with the same slots in the same order: head, prose, slots, optional links.
- **Head:** entry title on the left, catalogue number right-aligned on the shared baseline, never wrapping.
- **Catalogue number:** mono 700, cobalt ink, unique per entry (CY-01, AZ-01 ...), a link to the entry's own anchor so any entry can be deep-linked. Hover underlines it (3px offset). A targeted entry gains a shaded-stock highlight that bleeds 12px either side.
- **Slots:** definition rows of a 5.5rem term (label voice, soft ink) and a value, 12px gap, 7px padding, hairline rules. Role and Stack always; Methods when there is one. Stack values are mono, joined by middle dots.
- **Catalogue variant:** opened by a 2px ink rule, 14px / 18px vertical padding, no media.
- **Feature variant (research):** a 1px-ink framed image over the body; framed images zoom to 1.03 over 500ms on hover when they are links; logo frames are contained with 10% padding.

### Certificate Table
Experience as a certificate of analysis. Columns Period (mono, 7.5rem), Role (role name in title voice at 1.25rem, description in soft ink to 60ch) and Organisation (600 weight, 30%, department subline in soft ink). Header in the label voice over a 2px ink rule; rows separated by 1px ink. Beside it, the composition aside: a 2px left rule, 128px square headshot with 1px ink border, a subhead, then hairline-ruled term/value rows of skills. At 560px rows re-flow as stacked blocks.

### Reference List and Talks
Papers: title in 650 / 88% width to 52ch, authors in soft ink with Calvin bolded in ink, source line with the DOI as a mono link. Talks: a three-column table (mono date, event in 650, venue right-aligned in soft ink), 1px ink rules. A prize is a cobalt tag in the label voice, white text, square, set under the event.

### Buttons
Solid label blocks, not pills.
- **Shape:** square (0px), 2px ink border, minimum 48px tall, 12px / 20px padding, 650 weight at 90% width, 18px icon with 10px gap.
- **Solid:** ink fill, label-stock text. Hover fills pure black.
- **Line:** transparent on label stock, ink text. Hover fills shaded stock.
- **Hover / Active:** lift 2px with button-hover shadow over 180ms on the house ease; press drops 1px with no shadow over 60ms. Focus is the global 3px cobalt outline at 3px offset.

### Contact Routes
Large bordered blocks, one per channel. Grid of a 40px icon spanning two rows beside the route name (subhead voice, 1.75rem caps) and the mono address in soft ink; a call to action across the bottom whose 2px underline draws in from 0 to full width on hover. Hover also lifts the block 2px, applies the route-hover shadow and brightens the ground to lit stock.

### Navigation
A 56px sticky strip of glass deep with a faint amber 1px bottom rule. Name at left in condensed 800 caps; section links at right in 500 weight, on-glass amber. Links on glass carry no underline at rest; hover draws a 1px underline in and brightens to white. At 860px the links collapse behind a bordered Menu button (label switches to Close) into a full-screen glass-deep sheet of large condensed caps links separated by faint amber rules, fading in over 200ms. Escape closes it and returns focus; body scroll locks while open.

### Inline Links
On label stock, a 1px currentColor underline drawn as a background, thickening to 2px and turning cobalt ink on hover over 260ms.

### Molecule Annotation (signature)
Skeletal aspirin drawn in SVG on label stock: 3.2px ink bonds with round caps, heteroatoms set in Archivo 650 on label-stock knockouts, the formula in mono soft ink at the bottom right. Each carbon is a focusable button with a 22px hit radius. Hover grows a 6px cobalt dot; the active atom holds a 9px dot. Activating an atom (hover, focus, click, Enter or Space) pins one annotation: a 1.5px cobalt leader line from the atom to a mono label pair (atom id in 700 cobalt ink, shift as δ value in ink). At the same time bonds touching the atom turn cobalt at 4.4px and bonds one hop further turn cobalt at 3.6px and 45% opacity, delayed 110ms, so the highlight spreads like message passing. Keyboard focus adds a 2px cobalt ring at 15px radius. One atom is always active (C2 on load).

### Motion
One ease for everything: `cubic-bezier(0.16, 1, 0.3, 1)`. Durations: 160ms for colour fills, 180–200ms for lifts, 220ms for molecule state, 260ms for underlines drawing, 500ms for image zoom. Reduced motion collapses all transitions to near zero and turns off smooth scrolling.

## Do's and Don'ts

### Do:
- **Do** open every section with a label: cobalt band, headline and mono metadata over a 2px ink rule.
- **Do** give every new piece of work an entry with the fixed slots and a unique, linkable catalogue number right-aligned on the title baseline.
- **Do** separate content with the 2px / 1px / hairline rule hierarchy rather than boxes or fills.
- **Do** keep cobalt to the band, focus, the active atom, catalogue numbers, link hover and the prize tag.
- **Do** keep corners square (0px) on every element, including images and buttons.
- **Do** use the single house ease and keep hover lifts at 2px with a soft shadow.

### Don't:
- **Don't** round corners or turn entries into floating cards with their own shadows; only the label floats.
- **Don't** add a second accent colour or set ink on glass.
- **Don't** set headings or descriptive sentences in mono.
- **Don't** add hard offset shadows or glows.
- **Don't** put a small caps line above a section headline; the label head's metadata sits beside the headline, on its baseline.
