<script setup>
// Small status label. Not interactive.
defineProps({ tone: { type: String, default: 'neutral' } }) // neutral · outline · positive · warning · cycle
</script>

<template>
  <span class="ui-chip" :class="`t-${tone}`"><slot /></span>
</template>

<style scoped>
.ui-chip {
  display: inline-flex; align-items: center; gap: var(--space-1); flex: none;
  height: 26px; padding: 0 var(--space-3); border-radius: var(--radius-full);
  font: var(--type-label-s); white-space: nowrap;
}
.t-neutral { background: var(--color-surface-sunken); color: var(--color-text-heading); }
.t-outline { background: var(--color-surface); color: var(--color-text-heading); box-shadow: inset 0 0 0 1px var(--color-border); }
.t-positive { background: var(--color-positive-surface); color: var(--color-positive-text); }
.t-warning { background: var(--color-warning-surface-strong); color: var(--color-warning-text); }
.t-cycle { background: var(--color-cycle-surface); color: var(--color-cycle-text); }
</style>
