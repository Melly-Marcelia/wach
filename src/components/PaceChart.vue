<script setup>
import { computed } from 'vue'
import { fmtPace } from '../data/scenario'

// Pace per km against the target band. Faster = higher.
// Only the km that matters gets a label: the chart makes one point.
const props = defineProps({ splits: Array, target: Array, highlight: Number })
const W = 320, H = 150, pad = { l: 34, r: 20, t: 24, b: 22 }
const min = 345, max = 420
const x = (i) => pad.l + (i * (W - pad.l - pad.r)) / (props.splits.length - 1)
const y = (p) => pad.t + ((p - min) / (max - min)) * (H - pad.t - pad.b)
const path = computed(() => props.splits.map((s, i) => `${i ? 'L' : 'M'}${x(i)},${y(s.pace)}`).join(' '))
const hl = computed(() => props.splits.findIndex((s) => s.km === props.highlight))
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="chart" role="img" aria-label="Pace per kilometre compared with your target range">
    <rect :x="pad.l" :y="y(target[0])" :width="W - pad.l - pad.r" :height="y(target[1]) - y(target[0])" class="band" rx="4" />
    <text :x="W - pad.r - 4" :y="y(target[0]) - 6" class="band-label" text-anchor="end">target 6:30–6:50</text>
    <text v-for="p in [360, 390, 420]" :key="p" :x="pad.l - 8" :y="y(p) + 4" class="axis" text-anchor="end">{{ fmtPace(p) }}</text>
    <path :d="path" class="line" />
    <g v-for="(s, i) in splits" :key="s.km">
      <circle :cx="x(i)" :cy="y(s.pace)" :r="i === hl ? 6 : 3.5" :class="i === hl ? 'dot-hl' : 'dot'" />
      <text :x="x(i)" :y="H - 6" class="axis" text-anchor="middle">km {{ s.km }}</text>
    </g>
    <g v-if="hl > -1">
      <text :x="x(hl) + 10" :y="y(splits[hl].pace) + 4" class="hl-label">{{ fmtPace(splits[hl].pace) }} · too fast</text>
    </g>
  </svg>
</template>

<style scoped>
.chart { width: 100%; height: auto; }
.band { fill: var(--color-normal-range); opacity: .55; }
.band-label { font: var(--type-chart); font-weight: 600; fill: var(--color-accent); }
.axis { font: var(--type-chart); fill: var(--color-text-inverse-subtle); }
.line { fill: none; stroke: var(--color-text-inverse); stroke-width: 2; stroke-linejoin: round; }
.dot { fill: var(--color-text-inverse); }
.dot-hl { fill: var(--color-warning); stroke: var(--color-surface-inverse); stroke-width: 2; }
.hl-label { font: var(--type-caption); font-weight: 700; fill: var(--color-warning); }
</style>
