<script setup>
// Surface container. `tone` picks the surface, `pad` the inner spacing.
defineProps({
  tone: { type: String, default: 'default' }, // default · inverse · positive · warning · info
  pad: { type: String, default: 'm' }, // none · s · m · l
  as: { type: String, default: 'div' },
  to: [String, Object],
  row: Boolean, // lay children out in a row (icon + text + trailing)
})
</script>

<template>
  <component :is="to ? 'RouterLink' : as" :to="to" class="ui-card" :class="[`t-${tone}`, `p-${pad}`, { 'is-row': row }]">
    <slot />
  </component>
</template>

<style scoped>
.ui-card { display: block; border-radius: var(--radius-l); text-align: left; width: 100%; }
.is-row { display: flex; align-items: center; gap: var(--space-3); }
.p-none { padding: 0; }
.p-s { padding: var(--space-3); }
.p-m { padding: var(--space-4); }
.p-l { padding: var(--space-5) var(--space-4); }

.t-default { background: var(--color-surface); box-shadow: inset 0 0 0 1px var(--color-border); }
.t-inverse { background: var(--color-surface-inverse); color: var(--color-text-inverse); border-radius: var(--radius-xl); }
.t-positive { background: var(--color-positive-surface); }
.t-warning { background: var(--color-warning-surface); box-shadow: inset 0 0 0 1px var(--color-warning-border); }
.t-info { background: var(--color-info-surface); }
</style>
