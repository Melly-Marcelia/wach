<script setup>
import { computed } from 'vue'
import { coach } from '../store'

// The coach's face. "Wach" means awake/alert, so a soft ring in the coach's
// color breathes around it whenever the coach is present.
const props = defineProps({ size: { type: Number, default: 36 }, coachData: Object, still: Boolean })
const c = computed(() => props.coachData || coach.value)
</script>

<template>
  <span
    class="avatar" :class="{ still, small: size < 32 }"
    :style="{ width: size + 'px', height: size + 'px', '--a': c.hue[0], '--b': c.hue[1] }"
  >
    <img :src="c.face" :alt="`${c.name}, your AI coach`" loading="lazy" decoding="async" />
  </span>
</template>

<style scoped>
.avatar {
  position: relative; display: inline-block; flex: none; border-radius: 50%; overflow: hidden;
  background: var(--b);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--b) 35%, transparent);
  animation: breathe 3.6s ease-in-out infinite;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }
/* At small sizes, zoom in on the face so it stays recognizable. */
.small img { transform: scale(1.35); transform-origin: 50% 35%; }
.still { animation: none; }
@keyframes breathe {
  0%, 100% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--b) 35%, transparent); }
  50% { box-shadow: 0 0 0 7px color-mix(in srgb, var(--b) 18%, transparent); }
}
</style>
