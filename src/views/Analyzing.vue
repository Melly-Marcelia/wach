<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Check } from 'lucide-vue-next'
import CoachAvatar from '../components/CoachAvatar.vue'
import { coach, state } from '../store'

const router = useRouter()
// Show what the coach actually blends, one input at a time.
const inputs = [
  'Watch data: pace, heart rate, cadence',
  'Your last 4 weeks of runs',
  'Last night’s sleep and resting heart rate',
  'Cycle day 24',
  state.feedback.notes || state.feedback.symptoms.length ? 'Your notes and body signals' : 'How you said it felt',
]
const done = ref(0)
let timer
onMounted(() => {
  timer = setInterval(() => {
    done.value++
    if (done.value > inputs.length) {
      clearInterval(timer)
      router.replace('/debrief')
    }
  }, 650)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="an">
    <CoachAvatar :size="120" />
    <p class="type-display-s center title">{{ coach.name }} is reading your run</p>
    <ul class="list" aria-live="polite">
      <li v-for="(x, i) in inputs" :key="x" class="type-body" :class="{ done: i < done, now: i === done }">
        <span class="tick"><Check v-if="i < done" :size="13" /></span>{{ x }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.an {
  min-height: 100%; background: var(--color-surface-inverse); color: var(--color-text-inverse);
  display: flex; flex-direction: column; align-items: center; padding: 120px var(--space-7) var(--space-10);
}
.title { margin-top: var(--space-8); }
.list { margin-top: var(--space-8); display: grid; gap: var(--space-4); width: 100%; }
.list li { display: flex; align-items: center; gap: var(--space-3); color: var(--color-text-inverse-faint); transition: color var(--duration-slow); }
.list li.done { color: var(--color-text-inverse); }
.list li.now { color: var(--color-text-inverse-muted); }
.tick { width: 22px; height: 22px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px var(--color-text-inverse-faint); display: grid; place-items: center; flex: none; }
.done .tick { background: var(--color-accent); box-shadow: none; color: var(--color-on-accent); }
</style>
