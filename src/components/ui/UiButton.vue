<script setup>
// Primary action component. Renders a RouterLink when `to` is set.
defineProps({
  variant: { type: String, default: 'primary' }, // primary · accent · secondary · inverse · light · danger
  size: { type: String, default: 'm' }, // s · m · l
  block: Boolean,
  to: [String, Object],
  disabled: Boolean,
})
</script>

<template>
  <component
    :is="to ? 'RouterLink' : 'button'" :to="to" :type="to ? undefined : 'button'" :disabled="to ? undefined : disabled"
    class="ui-button" :class="[`v-${variant}`, `s-${size}`, { block }]"
  >
    <slot />
  </component>
</template>

<style scoped>
.ui-button {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2);
  height: var(--size-control-m); padding: 0 var(--space-6); border-radius: var(--radius-full);
  font: var(--type-button); letter-spacing: var(--type-button-tracking); white-space: nowrap;
  transition: transform var(--duration-fast) ease, opacity var(--duration-base) ease;
}
.ui-button:active { transform: scale(.98); }
.ui-button:disabled { opacity: .35; cursor: default; transform: none; }
.block { display: flex; width: 100%; }

/* s looks compact (40px) but an invisible margin keeps the 44px touch target */
.s-s { position: relative; height: var(--size-control-s); padding: 0 var(--space-4); font: var(--type-button-s); }
.s-s::after { content: ''; position: absolute; inset: -2px 0; }
.s-l { height: var(--size-control-l); font: var(--type-button-l); }

.v-primary { background: var(--color-surface-inverse); color: var(--color-text-inverse); }
.v-accent { background: var(--color-accent); color: var(--color-on-accent); }
.v-secondary { background: transparent; color: var(--color-text-heading); box-shadow: inset 0 0 0 1.5px var(--color-border); }
.v-inverse { background: var(--color-surface-inverse-raised); color: var(--color-text-inverse); box-shadow: inset 0 0 0 1.5px var(--color-border-inverse); }
.v-light { background: var(--color-surface); color: var(--color-text-heading); }
.v-danger { background: var(--color-danger); color: var(--color-text-inverse); }
</style>
