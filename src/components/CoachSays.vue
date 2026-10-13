<script setup>
import CoachAvatar from './CoachAvatar.vue'
import { coach } from '../store'

// Every coach message uses this one pattern: orb, name, then the coach's voice
// (a medium-weight text style, larger than body copy, so it reads as speech).
defineProps({ dark: Boolean, size: { type: String, default: 'm' }, label: String })
</script>

<template>
  <div class="says" :class="{ dark }">
    <div class="who">
      <CoachAvatar :size="size === 'l' ? 36 : 28" />
      <span class="type-label name">{{ coach.name }}</span>
      <span v-if="label" class="type-caption meta">· {{ label }}</span>
    </div>
    <p class="msg" :class="`type-voice-${size}`"><slot /></p>
    <div v-if="$slots.actions" class="actions"><slot name="actions" /></div>
  </div>
</template>

<style scoped>
.who { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2); }
.name { font-weight: 700; }
.meta { color: var(--color-text-muted); }
.dark .meta { color: var(--color-text-inverse-muted); }
.actions { display: flex; gap: var(--space-2); margin-top: var(--space-4); flex-wrap: wrap; }
</style>
