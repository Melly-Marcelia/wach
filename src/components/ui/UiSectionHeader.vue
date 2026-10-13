<script setup>
// Overline title for a screen section, with an optional link on the right.
defineProps({ title: { type: String, required: true }, action: String, to: [String, Object] })
</script>

<template>
  <div class="ui-section-header">
    <h2 class="type-overline text-muted">{{ title }}</h2>
    <RouterLink v-if="action && to" :to="to" class="link">{{ action }}</RouterLink>
  </div>
</template>

<style scoped>
.ui-section-header { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-3); margin-bottom: var(--space-3); }
</style>
