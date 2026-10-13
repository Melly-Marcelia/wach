# WACH: wearables AI coaching hub

*Wach* (German): awake, alert, observant.

WACH is a running app that turns raw wearable data into guidance you can act on. Most running apps show charts. WACH interprets your data, adapts your training plan to how you feel, and keeps you safe during runs.

This is an interactive prototype of the revised UI, built with Vue 3 and Vite. All data is mocked.

## The revision

Jury feedback on the first version: *the concept is solid, but the UI doesn't reflect it.* The old screens were dashboards (charts, stat tiles, "Training load 602"), which is exactly what the pitch says WACH is not. The revision is built on four rules:

1. **Every metric is translated.** Each health metric follows the same pattern: a human name ("Recovery", not "HRV"), where today sits against *your own* normal range, what that means, and what to do. The technical term stays in small print. Tap any metric on Today to see this.
2. **The coach speaks first.** Every screen opens with an interpretation. The numbers come after, as evidence.
3. **Every change explains itself.** When the plan adapts, you see the original, the new session and the reason.
4. **Safety is always visible.** Guardian mode shows in every session, and the emergency flow says exactly what was detected and who will be alerted.

The visual language follows the moodboard's two axes:

- **Trust, calm, intelligence:** navy surfaces, and the coach's voice set in its own text style.
- **Energy, motion, alertness:** neon green for actions, progress and the active state.

## Try it

```bash
npm install
npm run dev
```

The app is mobile first: on a phone it runs full screen (add it to your home screen for an app-like feel). On a laptop it is centered in an iPhone Duo frame: switch between **Folded** (466 × 678) and **Unfolded** (890 × 626) above the frame. Unfolded, WACH has its own wide layout:

- **Side rail:** navigation moves from the bottom bar to a rail on the left.
- **Today:** two columns, the coach's read of your body on the left and the day's plan, cycle and reading on the right.
- **Plan:** the goal and the coach's summary stay pinned on the left while the week scrolls on the right.
- **Metric explainers:** open as a side panel, so the screen they explain stays visible.
- **Other screens:** stay in a centered 560px reading column.

The wide layout uses container queries (700px and up), so it also applies on a real unfolded iPhone Duo, where the app runs full screen without the frame.

Things to try:

- **Onboarding:** the first visit starts with a short onboarding where you must pick one of the three coaches. Replay it from **Me → Replay onboarding**.
- **Today:** accept or decline the coach's suggested swap, then open **Plan** to see the change and its reason.
- **Today:** tap any metric under "Why Clara thinks so" to see it explained.
- **Progress** (from Me or Plan): questions like "Am I getting fitter?" answered in one sentence, with the technical metric underneath.
- **Coach:** switch between Clara, Blaze and Theo. The tone of the whole app changes.
- **Live run:** start a run, then use "simulate a fall" to see the emergency flow.
- **Debrief:** finish a run, log nausea or a headache, and see the debrief take your notes into account.
- **Status:** set "I'm injured" and watch Today and Plan adapt.

## Design system

Everything visual comes from one set of design tokens, so every screen stays consistent.

**Source of truth:** [`tokens/tokens.json`](tokens/tokens.json), in the W3C Design Tokens format, the same format Figma Tokens Studio uses. `npm run tokens` generates [`src/styles/tokens.css`](src/styles/tokens.css). It also runs automatically before `dev` and `build`. Never edit the generated file by hand.

**Two layers:**

| Layer | Example | Used by |
|---|---|---|
| Primitive: raw values | `--p-color-navy-900: #073045` | Only by semantic tokens |
| Semantic: what a value is for | `--color-surface-inverse`, `--color-text-muted`, `--space-4`, `--radius-l` | Every component and screen |

To change the brand navy, edit one primitive and every surface, text and border that uses it updates.

**Typography:** one family, **Epilogue** (also the body font of the pitch deck). Each text style is a role, available as a `.type-*` class:

| Role | Use |
|---|---|
| `display-xl` / `l` / `m` / `s` | Coach name, greetings, screen titles, answers |
| `voice-l` / `m` / `s` | The coach speaking: medium weight, set apart from data by size and weight |
| `title`, `headline` | Top bar, list rows |
| `body`, `body-s` | Running text |
| `label`, `label-s`, `caption`, `overline` | Labels, chips, fine print, section headers |
| `button`, `button-s`, `button-l`, `nav` | Controls |
| `numeric-xl` / `l` / `m`, `chart` | Live timer, stats, chart axes (tabular figures) |

**Other scales:**
- **Spacing:** a 4px grid (`--space-1` … `--space-16`, plus a 16px `gutter`).
- **Size:** a 44px minimum touch target (`--size-tap`), control heights, icon sizes.
- **Also tokenized:** radius, shadow, motion (duration and easing) and z-index.

**Base components** in [`src/components/ui/`](src/components/ui/): `UiButton`, `UiCard`, `UiChip`, `UiToggle`, `UiListRow`, `UiSectionHeader`, `UiIconWell`. Domain components such as `CoachSays`, `CoachOption`, `InsightCard`, `MetricSheet` and the charts are built on top of them.

**Mobile conventions:**
- Safe-area insets for the notch and home indicator.
- Touch targets of at least 44px.
- Text fields at 16px or more, so iOS doesn't zoom in when you tap them.
- Reduced motion is respected.
- Every control has an accessible name.

## Build

```bash
npm run build   # static output in dist/, works on GitHub Pages or Netlify (hash routing)
```

## Structure

```
tokens/
  tokens.json        design tokens (source of truth)
  build.mjs          generates src/styles/tokens.css
src/
  styles/            tokens.css (generated), base.css, utilities.css
  components/ui/     base components (Button, Card, Chip, Toggle, ListRow…)
  data/coaches.js    three coach personalities: every coach sentence lives here
  data/metrics.js    how each health metric is translated (name, your normal, meaning, advice)
  data/scenario.js   mocked watch, cycle and weather data for one Monday
  store.js           shared state (coach, swap decision, status, check-in)
  components/        domain components (CoachSays, InsightCard, MetricSheet, charts…)
  views/             one file per screen
```

Design by Melly Marcelia.
