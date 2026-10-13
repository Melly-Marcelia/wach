<script setup>
import { computed } from 'vue'
import { position } from '../data/metrics'

// "Is this normal for me?" in one glance: shaded band = your usual range,
// dot = today. Outside the band turns orange.
const props = defineProps({ metric: Object, dark: Boolean })
const p = computed(() => position(props.metric))
const outside = computed(() => {
  const m = props.metric
  return m.today < m.normal[0] || m.today > m.normal[1]
})
</script>

<template>
  <span class="rb" :class="{ dark }" aria-hidden="true">
    <span class="band" :style="{ left: p.from + '%', width: p.to - p.from + '%' }" />
    <span class="dot" :class="{ outside }" :style="{ left: p.today + '%' }" />
  </span>
</template>

<style scoped>
.rb { position: relative; display: block; height: 6px; border-radius: var(--radius-full); background: var(--color-border); }
.dark { background: var(--color-border-inverse); }
.band { position: absolute; top: 0; bottom: 0; border-radius: var(--radius-full); background: var(--color-normal-range); }
.dot {
  position: absolute; top: 50%; width: 10px; height: 10px; border-radius: 50%; transform: translate(-50%, -50%);
  background: var(--color-accent-strong); box-shadow: 0 0 0 2px var(--color-surface);
}
.dark .dot { background: var(--color-accent); box-shadow: 0 0 0 2px var(--color-surface-inverse); }
.dot.outside { background: var(--color-warning); }
</style>
