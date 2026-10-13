<script setup>
import { ChevronRight } from 'lucide-vue-next'

// One row in a grouped list: leading visual, title + subtitle, trailing slot.
// Becomes a link when `to` is set (and shows a chevron).
defineProps({ title: String, subtitle: String, to: [String, Object], as: { type: String, default: 'div' } })
</script>

<template>
  <component :is="to ? 'RouterLink' : as" :to="to" class="ui-list-row">
    <slot name="leading" />
    <div class="text">
      <p class="type-headline">{{ title }}<slot name="title-extra" /></p>
      <p v-if="subtitle || $slots.subtitle" class="type-body-s text-muted"><slot name="subtitle">{{ subtitle }}</slot></p>
    </div>
    <slot name="trailing" />
    <ChevronRight v-if="to" :size="18" class="chev" aria-hidden="true" />
  </component>
</template>

<style scoped>
.ui-list-row {
  display: flex; align-items: center; gap: var(--space-3); width: 100%; text-align: left;
  min-height: calc(var(--size-tap) + var(--space-4)); padding: var(--space-3) 0;
}
.ui-list-row + .ui-list-row { box-shadow: 0 -1px 0 var(--color-border); }
.text { flex: 1; min-width: 0; }
.chev { flex: none; color: var(--color-text-subtle); }
</style>
