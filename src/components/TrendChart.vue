<script setup>
import { computed } from 'vue'

// Last 14 days against your normal range. Only today is labeled.
const props = defineProps({
  values: Array, band: Array, labelToday: String, labelBand: { type: String, default: 'your normal' },
  dark: Boolean, height: { type: Number, default: 120 },
  from: { type: String, default: '2 weeks ago' }, to: { type: String, default: 'today' },
})
const W = 320, pad = { l: 6, r: 78, t: 16, b: 30 }
const H = computed(() => props.height)
const range = computed(() => {
  const all = [...props.values, ...(props.band || [])]
  const lo = Math.min(...all), hi = Math.max(...all), p = (hi - lo) * 0.18
  return [lo - p, hi + p]
})
const x = (i) => pad.l + (i * (W - pad.l - pad.r)) / (props.values.length - 1)
const y = (v) => pad.t + (1 - (v - range.value[0]) / (range.value[1] - range.value[0])) * (H.value - pad.t - pad.b)
const d = computed(() => props.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' '))
const last = computed(() => props.values.length - 1)
// Put the label on the side of the dot the line is NOT coming from.
const rising = computed(() => props.values.at(-1) >= props.values.at(-2))
const outside = computed(() => props.band && (props.values.at(-1) < props.band[0] || props.values.at(-1) > props.band[1]))
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="tc" :class="{ dark }" role="img" :aria-label="`Last ${values.length} days compared with your normal range`">
    <template v-if="band">
      <rect :x="pad.l" :y="y(band[1])" :width="W - pad.l - pad.r" :height="y(band[0]) - y(band[1])" class="band" rx="4" />
      <text :x="W - pad.r + 6" :y="(y(band[0]) + y(band[1])) / 2 + 4" class="band-label">{{ labelBand }}</text>
    </template>
    <path :d="d" class="line" />
    <circle :cx="x(last)" :cy="y(values[last])" r="5.5" class="today" :class="{ outside }" />
    <text v-if="labelToday" :x="x(last) - 10" :y="y(values[last]) + (rising ? -10 : 17)" class="today-label" text-anchor="end">{{ labelToday }}</text>
    <text :x="pad.l" :y="H - 3" class="axis">{{ from }}</text>
    <text :x="x(last)" :y="H - 3" class="axis" text-anchor="end">{{ to }}</text>
  </svg>
</template>

<style scoped>
.tc { width: 100%; height: auto; }
.band { fill: var(--color-normal-range); opacity: .55; }
.band-label { font: var(--type-chart); font-weight: 600; fill: var(--color-accent-strong); }
.dark .band-label { fill: var(--color-accent); }
.line { fill: none; stroke: var(--color-text-brand); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
.dark .line { stroke: var(--color-text-inverse); }
.today { fill: var(--color-accent-strong); stroke: var(--color-surface); stroke-width: 2; }
.dark .today { fill: var(--color-accent); stroke: var(--color-surface-inverse); }
.today.outside { fill: var(--color-warning); }
.today-label { font: var(--type-caption); font-weight: 700; fill: var(--color-text-heading); }
.dark .today-label { fill: var(--color-text-inverse); }
.axis { font: var(--type-chart); fill: var(--color-text-subtle); }
</style>
