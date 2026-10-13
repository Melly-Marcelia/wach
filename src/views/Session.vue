<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Clock, Zap, Route, Watch, ShieldCheck, Play } from 'lucide-vue-next'
import TopBar from '../components/TopBar.vue'
import CoachSays from '../components/CoachSays.vue'
import ZoneBar from '../components/ZoneBar.vue'
import { state, coach, todaySession } from '../store'
import { sessions, guardians } from '../data/scenario'

const router = useRouter()
const s = computed(() => sessions[todaySession.value])
const legend = computed(() =>
  [{ z: 2, label: 'Easy' }, { z: 4, label: 'Hard' }, { z: 1, label: 'Recovery jog' }].filter((l) => s.value.blocks.some((b) => b.zone === l.z)),
)
const advice = computed(() =>
  todaySession.value === 'easy'
    ? {
        clara: 'This run is for recovery, not fitness. If your heart rate goes over 150, walk for 30 seconds. That is the whole job today.',
        blaze: 'Chill mode 😎 If your heart rate goes past 150, walk 30 sec. That’s it!',
        theo: 'Run at a pace where you could chat with a friend. If your breathing gets heavy, walk for a moment. There is no shame in that.',
      }[coach.value.id]
    : {
        clara: 'You kept the hard session. Start the first rep 5 s/km slower than target. If your heart rate passes 168 I will cut the last rep.',
        blaze: 'Big day 🔥 First rep easy, then let’s go. I’ll call it if your heart says no.',
        theo: 'Go gently into the first rep. If your body says stop, we stop, and that is a good decision too.',
      }[coach.value.id],
)
</script>

<template>
  <div>
    <TopBar title="Today’s session" back="/" />
    <div class="screen no-tab">
      <p class="type-overline text-muted">Monday · {{ s.intensity }} intensity</p>
      <h1 class="type-display-m text-heading title">{{ s.title }}</h1>

      <div class="facts">
        <UiChip tone="outline"><Clock :size="13" /> {{ s.duration }}</UiChip>
        <UiChip tone="outline"><Zap :size="13" /> {{ s.intensity }}</UiChip>
        <UiChip tone="outline"><Route :size="13" /> {{ s.distance }}</UiChip>
      </div>

      <UiCard as="section" tone="inverse" pad="l" class="structure">
        <p class="type-overline text-inverse-muted heading">Structure by effort</p>
        <ZoneBar :blocks="s.blocks" />
        <div class="legend type-caption text-inverse-muted">
          <span v-for="l in legend" :key="l.z"><i :style="{ background: `var(--color-zone-${l.z})` }" /> {{ l.label }}</span>
        </div>
        <ol class="steps">
          <li v-for="(step, i) in s.steps" :key="i">
            <span class="n type-label">{{ i + 1 }}</span>
            <div>
              <p class="type-label text-inverse-muted">{{ step.do }}</p>
              <p class="type-voice-m feel">{{ step.feel }}</p>
              <p class="type-caption detail">{{ step.detail }}</p>
            </div>
          </li>
        </ol>
      </UiCard>

      <UiCard as="section" class="section">
        <CoachSays size="s" label="for this run">{{ advice }}</CoachSays>
      </UiCard>

      <UiCard tone="info" pad="s" row class="guard">
        <ShieldCheck :size="18" class="guard-icon" />
        <p class="type-body-s grow">
          <strong>Guardian mode on.</strong> If you stop moving and your heart rate drops sharply,
          {{ guardians.map((g) => g.name).join(' & ') }} get an alert.
        </p>
      </UiCard>

      <div class="cta">
        <UiButton variant="accent" block @click="router.push('/run')"><Play :size="18" /> Start run</UiButton>
        <UiButton variant="secondary" block><Watch :size="18" /> Send to watch</UiButton>
        <RouterLink to="/status" class="link center cant">Can’t do it today? Tell {{ coach.name }}</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title { margin: var(--space-1) 0 var(--space-3); }
.facts { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.structure { margin-top: var(--space-4); }
.heading { margin-bottom: var(--space-4); }
.legend { display: flex; gap: var(--space-4); margin-top: var(--space-3); }
.legend span { display: flex; align-items: center; gap: var(--space-1); }
.legend i { width: 10px; height: 10px; border-radius: 3px; }
.steps { margin-top: var(--space-5); display: grid; gap: var(--space-4); }
.steps li { display: flex; gap: var(--space-3); }
.n { flex: none; width: 24px; height: 24px; border-radius: 50%; background: var(--color-accent-subtle); color: var(--color-accent); display: grid; place-items: center; }
.feel { margin-top: 2px; }
.detail { color: var(--color-text-inverse-subtle); margin-top: var(--space-1); }
.guard { margin-top: var(--space-3); align-items: flex-start; }
.guard-icon { color: var(--color-text-brand); flex: none; margin-top: 1px; }
.cta { display: grid; gap: var(--space-3); margin-top: var(--space-5); }
.cant { padding: var(--space-3) 0; }
</style>
