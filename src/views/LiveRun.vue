<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ShieldCheck, Pause, Play, Flag, Siren } from 'lucide-vue-next'
import CoachSays from '../components/CoachSays.vue'
import { coach, line, todaySession } from '../store'
import { guardians, sessions, fmtPace } from '../data/scenario'
import { zoneWords } from '../data/metrics'

const router = useRouter()
const t = ref(372) // start a few minutes in, so the demo has something to show
const paused = ref(false)
const hr = ref(158)
// Live tip follows the body: too hard → slow down, otherwise encourage / form cue.
const calm = ref(1)
let timer

onMounted(() => {
  timer = setInterval(() => {
    if (paused.value) return
    t.value++
    hr.value = Math.round(147 + Math.sin(t.value / 7) * 7)
    if (t.value % 9 === 0) calm.value = calm.value === 1 ? 2 : 1
  }, 1000)
})
onUnmounted(() => clearInterval(timer))

const elapsed = computed(() => `${Math.floor(t.value / 60)}:${String(t.value % 60).padStart(2, '0')}`)
const km = computed(() => (t.value / 390).toFixed(2))
const pace = computed(() => fmtPace(388 + Math.round(Math.sin(t.value / 13) * 6)))
const zone = computed(() => (hr.value > 150 ? 3 : 2))
const nudge = computed(() => (zone.value === 3 ? 0 : calm.value))

function finish() {
  router.push('/check-in')
}
</script>

<template>
  <div class="live">
    <div class="top">
      <span class="type-label rec"><i aria-hidden="true" /> {{ sessions[todaySession].title }}</span>
      <span class="type-label guard"><ShieldCheck :size="14" /> Guardian on</span>
    </div>

    <div class="main">
      <p class="type-label text-inverse-muted">Time</p>
      <p class="type-numeric-xl big" role="timer">{{ elapsed }}</p>
      <div class="grid">
        <div><p class="type-label text-inverse-muted">Distance</p><p class="type-numeric-l">{{ km }}<small class="type-label unit"> km</small></p></div>
        <div><p class="type-label text-inverse-muted">Pace</p><p class="type-numeric-l">{{ pace }}<small class="type-label unit"> /km</small></p></div>
        <div><p class="type-label text-inverse-muted">Heart rate</p><p class="type-numeric-l">{{ hr }}<small class="type-label unit"> bpm</small></p></div>
        <div>
          <p class="type-label text-inverse-muted">Effort</p>
          <p class="type-numeric-l zone">
            <span v-for="z in 5" :key="z" :style="{ background: z <= zone ? `var(--color-zone-${z})` : '' }" aria-hidden="true" />{{ zone }}
          </p>
          <p class="type-label zone-word" :style="{ color: `var(--color-zone-${zone})` }">{{ zoneWords[zone] }}</p>
        </div>
      </div>
    </div>

    <div class="nudge" aria-live="polite">
      <Transition name="fade" mode="out-in">
        <CoachSays :key="nudge + coach.id" dark size="s" label="live">{{ line('live')[nudge] }}</CoachSays>
      </Transition>
    </div>

    <div class="controls">
      <button class="ctl" :aria-label="paused ? 'Resume' : 'Pause'" @click="paused = !paused">
        <component :is="paused ? Play : Pause" :size="26" />
      </button>
      <UiButton variant="accent" size="l" class="finish" @click="finish"><Flag :size="18" /> Finish run</UiButton>
    </div>

    <button class="type-label sim" @click="router.push('/emergency')"><Siren :size="13" /> Demo: simulate a fall</button>
    <p class="type-caption center note">If you stop moving and your heart rate drops sharply, {{ guardians[0].name }} and {{ guardians[1].name }} get an alert.</p>
  </div>
</template>

<style scoped>
.live {
  min-height: 100%; background: var(--color-surface-inverse); color: var(--color-text-inverse);
  display: flex; flex-direction: column;
  padding: max(58px, calc(env(safe-area-inset-top) + var(--space-4))) var(--space-5) calc(var(--space-7) + env(safe-area-inset-bottom));
}
.top { display: flex; justify-content: space-between; align-items: center; }
.rec { display: flex; align-items: center; gap: var(--space-2); }
.rec i { width: 8px; height: 8px; border-radius: 50%; background: var(--color-accent); animation: blink 1.4s infinite; }
.guard { display: flex; align-items: center; gap: var(--space-1); padding: 6px var(--space-3); border-radius: var(--radius-full); background: var(--color-info-on-inverse-surface); color: var(--color-info); }
@keyframes blink { 50% { opacity: .3; } }

.main { margin-top: var(--space-7); }
.big { margin-top: var(--space-1); }
.grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5) var(--space-3);
  margin-top: var(--space-7); padding-top: var(--space-6); box-shadow: 0 -1px 0 var(--color-border-inverse);
}
.grid .type-numeric-l { margin-top: 2px; }
.unit { color: var(--color-text-inverse-muted); }
.zone { display: flex; align-items: center; gap: 3px; }
.zone span { width: 9px; height: 22px; border-radius: 3px; background: var(--color-border-inverse); }
.zone span:last-of-type { margin-right: var(--space-2); }
.zone-word { margin-top: var(--space-1); }

.nudge {
  margin-top: var(--space-7); padding: var(--space-4); border-radius: var(--radius-l); min-height: 108px;
  background: var(--color-surface-inverse-raised); box-shadow: inset 0 0 0 1px var(--color-border-inverse);
}

.controls { display: flex; gap: var(--space-3); margin-top: auto; padding-top: var(--space-6); }
.ctl { width: var(--size-control-l); height: var(--size-control-l); border-radius: 50%; background: var(--color-border-inverse); display: grid; place-items: center; flex: none; }
.finish { flex: 1; }
.sim {
  align-self: center; margin-top: var(--space-4); display: flex; gap: var(--space-2); align-items: center;
  min-height: var(--size-tap); padding: 0 var(--space-3); color: var(--color-warning);
}
.note { color: var(--color-text-inverse-subtle); margin-top: var(--space-1); }
</style>
