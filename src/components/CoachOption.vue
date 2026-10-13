<script setup>
import { Check } from 'lucide-vue-next'
import CoachAvatar from './CoachAvatar.vue'

// Selectable coach card, used in onboarding and on the Coach screen.
// The sample shows how this coach would phrase today's advice.
defineProps({
  coach: { type: Object, required: true },
  selected: Boolean,
  sample: { type: String, default: 'always' }, // always · selected
})
defineEmits(['select'])
</script>

<template>
  <UiCard as="button" class="option" :class="{ on: selected }" role="radio" :aria-checked="selected" @click="$emit('select', coach.id)">
    <div class="row">
      <CoachAvatar :size="56" :coach-data="coach" :still="!selected" />
      <div class="grow">
        <p class="type-headline text-heading">{{ coach.name }}</p>
        <p class="type-body-s text-muted">{{ coach.title }}</p>
      </div>
      <span class="radio" aria-hidden="true"><Check v-if="selected" :size="14" /></span>
    </div>
    <p class="type-voice-s text-brand motto">“{{ coach.motto }}”</p>
    <div v-if="sample === 'always' || selected" class="sample">
      <p class="type-overline text-muted">How {{ coach.name }} would tell you about today</p>
      <p class="type-body-s quote">{{ coach.lines.brief() }}</p>
    </div>
  </UiCard>
</template>

<style scoped>
.option { transition: box-shadow var(--duration-base); }
.option.on { box-shadow: inset 0 0 0 2px var(--color-border-strong); }
.radio {
  width: 24px; height: 24px; border-radius: 50%; flex: none; display: grid; place-items: center;
  box-shadow: inset 0 0 0 1.5px var(--color-border);
}
.on .radio { background: var(--color-surface-inverse); box-shadow: none; color: var(--color-accent); }
.motto { margin-top: var(--space-3); }
.sample { margin-top: var(--space-3); padding-top: var(--space-3); box-shadow: 0 -1px 0 var(--color-border); }
.quote { margin-top: var(--space-1); color: var(--color-text-muted); }
.on .quote { color: var(--color-text); }
</style>
