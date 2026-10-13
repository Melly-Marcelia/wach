<script setup>
import { Info, ChevronRight } from 'lucide-vue-next'

// The metric-translation pattern as a card:
// a runner's question → one-sentence answer → visual → plain explanation → technical name (small).
// Set `tappable` to make the whole card open the metric explainer.
defineProps({ question: { type: String, required: true }, tech: String, tappable: Boolean })
defineEmits(['open'])
</script>

<template>
  <UiCard :as="tappable ? 'button' : 'article'" class="insight" @click="tappable && $emit('open')">
    <p class="type-overline text-muted">{{ question }}</p>
    <p class="type-display-s text-heading answer"><slot name="answer" /></p>
    <slot />
    <p class="type-body plain"><slot name="plain" /></p>
    <p v-if="tech" class="type-caption text-subtle tech">
      <Info :size="12" /> <span class="grow">{{ tech }}</span>
      <ChevronRight v-if="tappable" :size="14" class="text-muted" />
    </p>
  </UiCard>
</template>

<style scoped>
.answer { margin: var(--space-2) 0 var(--space-3); }
.answer :deep(.hl) { color: var(--color-accent-strong); }
.answer :deep(.hl.warn) { color: var(--color-warning-text); }
.plain { margin-top: var(--space-3); }
.tech { display: flex; align-items: center; gap: var(--space-1); margin-top: var(--space-3); padding-top: var(--space-3); box-shadow: 0 -1px 0 var(--color-border); }
</style>
