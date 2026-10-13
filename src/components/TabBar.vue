<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import wach from '../assets/nav/wach.svg?raw'
import plan from '../assets/nav/plan.svg?raw'
import coachIcon from '../assets/nav/coach.svg?raw'
import profile from '../assets/nav/profile.svg?raw'

// Navbar from the WACH Figma (navy bar, active icon lifted into a raised circle),
// with labels added.
// Icons are the original Figma exports; their white/neon fills follow currentColor
// so the active tab can turn neon.
const tint = (svg) => svg.replace(/fill="(white|#B3F83B)"/g, 'fill="currentColor"').replace(/ style="display: block;"/, '')

const tabs = [
  { to: '/', label: 'Today', icon: tint(wach), match: ['today'] },
  { to: '/plan', label: 'Plan', icon: tint(plan), match: ['plan'] },
  { to: '/coach', label: 'Coach', icon: tint(coachIcon), match: ['coach'] },
  { to: '/me', label: 'Me', icon: tint(profile), match: ['me', 'status'] },
]

const route = useRoute()
const active = computed(() => tabs.findIndex((t) => t.match.includes(route.name)))
</script>

<template>
  <nav class="navbar" :class="{ notched: active > -1 }" :style="{ '--notch-x': `${(Math.max(active, 0) + 0.5) * 25}%` }" aria-label="Main">
    <span class="bar" aria-hidden="true" />
    <span v-if="active > -1" class="bump" aria-hidden="true" />
    <RouterLink
      v-for="(t, i) in tabs" :key="t.to" :to="t.to" class="tab" :class="{ on: i === active, mark: i === 0 }"
      :aria-current="i === active ? 'page' : undefined"
    >
      <span class="icon" aria-hidden="true" v-html="t.icon" />
      <span class="label">{{ t.label }}</span>
    </RouterLink>
  </nav>
</template>

<style>
/* Registered so the notch position can animate between tabs. */
@property --notch-x { syntax: '<length-percentage>'; inherits: true; initial-value: 12.5%; }
</style>

<style scoped>
.navbar {
  position: absolute; left: var(--space-gutter); right: var(--space-gutter); z-index: var(--z-navbar);
  bottom: calc(22px + env(safe-area-inset-bottom));
  display: grid; grid-template-columns: repeat(4, 1fr);
  height: var(--size-navbar);
  filter: drop-shadow(var(--shadow-navbar));
  transition: --notch-x var(--duration-slow) var(--ease-emphasized);
}
/* The bar itself. When a tab is active, a see-through notch (circle + 6px gap)
   is cut out of it so the raised circle floats with the page showing around it. */
.bar { position: absolute; inset: 0; border-radius: var(--radius-m); background: var(--color-surface-brand); }
.navbar.notched .bar {
  --notch-r: calc(var(--size-navbar-bump) / 2 + 6px);
  -webkit-mask: radial-gradient(circle var(--notch-r) at var(--notch-x) 2px, transparent calc(var(--notch-r) - 0.5px), #000 var(--notch-r));
  mask: radial-gradient(circle var(--notch-r) at var(--notch-x) 2px, transparent calc(var(--notch-r) - 0.5px), #000 var(--notch-r));
}
.bump {
  position: absolute; top: -26px; left: calc(var(--notch-x) - var(--size-navbar-bump) / 2);
  width: var(--size-navbar-bump); height: var(--size-navbar-bump); border-radius: 50%;
  background: var(--color-surface-brand);
}
.tab {
  position: relative; display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
  padding-bottom: var(--space-2); color: var(--color-text-inverse);
}
.icon { height: 32px; display: grid; place-items: center; transition: transform var(--duration-slow) var(--ease-emphasized), color var(--duration-base); }
.icon :deep(svg) { max-height: 28px; width: auto; }
.label { margin-top: 2px; font: var(--type-nav); color: var(--color-text-inverse-muted); transition: color var(--duration-base); }
/* Lift so the icon's center lands exactly on the circle's center: the resting icon
   sits 25.5px below the bar's top edge, the circle's center 2px below it. */
.tab.on .icon { color: var(--color-accent); transform: translateY(-23.5px); }
/* Center the WACH mark on its watch face (x 9.98 of 27.7), not its bounding box,
   which the dot pulls to the right: (13.85 - 9.98) × 28/29 ≈ 3.7px. */
.tab.mark .icon { transform: translateX(3.7px); }
.tab.on.mark .icon { transform: translate(3.7px, -23.5px); }
.tab.on .label { color: var(--color-accent); }

/* Wide (iPhone Duo unfolded): a floating side rail instead of the bottom bar.
   The active icon sits in a darker well, with no lift or notch. */
@container phone (min-width: 700px) {
  .navbar {
    left: calc(var(--space-gutter) + env(safe-area-inset-left)); right: auto; top: 50%; bottom: auto; transform: translateY(-50%);
    width: var(--size-rail); height: auto; grid-template-columns: none; grid-auto-rows: 72px; padding: var(--space-2) 0;
  }
  .navbar.notched .bar { -webkit-mask: none; mask: none; }
  .bump { display: none; }
  .tab { justify-content: center; padding-bottom: 0; }
  .icon { width: 48px; height: 40px; border-radius: var(--radius-full); transition: background var(--duration-base), color var(--duration-base); }
  .tab.on .icon, .tab.on.mark .icon { transform: none; background: var(--color-surface-inverse); }
  /* Keep the watch face centered in its well: same math as the bar, at 24px tall. */
  .tab.mark .icon :deep(svg) { transform: translateX(3.2px); }
  .tab.mark .icon { transform: none; }
  .icon :deep(svg) { max-height: 24px; }
}
</style>
