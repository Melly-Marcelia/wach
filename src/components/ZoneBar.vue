<script setup>
// Workout structure drawn as intensity blocks: taller + warmer = harder.
defineProps({ blocks: Array, dark: Boolean })
</script>

<template>
  <div class="zones" :class="{ dark }" role="img" aria-label="Workout structure by heart-rate zone">
    <span
      v-for="(b, i) in blocks" :key="i" class="blk"
      :style="{ flexGrow: b.w, height: 14 + b.zone * 9 + 'px', background: `var(--color-zone-${b.zone})` }"
      :title="b.label"
    />
  </div>
</template>

<style scoped>
.zones { display: flex; align-items: flex-end; gap: 3px; height: 62px; }
.blk { flex-basis: 0; border-radius: var(--radius-xs) var(--radius-xs) 3px 3px; min-width: 6px; }
</style>
