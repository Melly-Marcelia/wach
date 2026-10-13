<script setup>
// Rounded square behind an icon, used in lists and explanations.
defineProps({ tone: { type: String, default: 'info' }, size: { type: String, default: 'm' } }) // info · rest · accent · neutral
</script>

<template>
  <span class="ui-icon-well" :class="[`t-${tone}`, `s-${size}`]" aria-hidden="true"><slot /></span>
</template>

<style scoped>
.ui-icon-well { flex: none; display: grid; place-items: center; border-radius: var(--radius-m); }
.s-m { width: var(--size-icon-well); height: var(--size-icon-well); }
.s-s { width: 32px; height: 32px; border-radius: var(--radius-s); }
.t-info { background: var(--color-info-surface); color: var(--color-text-brand); }
.t-rest { background: var(--color-rest-surface); color: var(--color-rest-text); }
.t-accent { background: var(--color-accent); color: var(--color-on-accent); }
.t-neutral { background: var(--color-surface-sunken); color: var(--color-text-brand); }
</style>
