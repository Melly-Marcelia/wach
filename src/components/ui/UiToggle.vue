<script setup>
// iOS-style switch. Use with v-model; `label` is read by screen readers.
const model = defineModel({ type: Boolean })
defineProps({ label: { type: String, required: true } })
</script>

<template>
  <button class="ui-toggle" :class="{ on: model }" role="switch" :aria-checked="model" :aria-label="label" @click="model = !model">
    <span class="knob" />
  </button>
</template>

<style scoped>
.ui-toggle {
  position: relative; flex: none; width: 50px; height: 30px; border-radius: var(--radius-full);
  background: var(--color-border); transition: background var(--duration-base) ease;
}
/* invisible padding keeps the touch target at 44px */
.ui-toggle::after { content: ''; position: absolute; inset: -7px -2px; }
.knob {
  position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%;
  background: var(--color-surface); box-shadow: var(--shadow-knob);
  transition: transform var(--duration-base) var(--ease-standard);
}
.on { background: var(--color-accent-strong); }
.on .knob { transform: translateX(20px); }
</style>
