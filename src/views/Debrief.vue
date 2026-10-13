<script setup>
import { computed, ref } from 'vue'
import { Gauge, Moon, NotebookPen, CalendarCheck, ChevronDown } from 'lucide-vue-next'
import TopBar from '../components/TopBar.vue'
import CoachSays from '../components/CoachSays.vue'
import PaceChart from '../components/PaceChart.vue'
import { state, coach, line } from '../store'
import { splits, targetPace, sessionTotals } from '../data/scenario'

const showNumbers = ref(false)
const f = state.feedback

// What the runner told us, phrased for the coach's sentence.
const told = computed(() => {
  const s = f.symptoms.filter((x) => x !== 'Nothing').map((x) => x.toLowerCase())
  if (s.length) return s.length > 1 ? `${s.slice(0, -1).join(', ')} and ${s.at(-1)}` : s[0]
  if (f.notes.trim()) return `“${f.notes.trim().slice(0, 60)}${f.notes.trim().length > 60 ? '…' : ''}”`
  return null
})

const points = computed(() => [
  { icon: Gauge, title: 'Pacing', text: line('debriefPace') },
  { icon: Moon, title: 'Sleep & recovery', text: line('debriefSleep') },
  ...(told.value ? [{ icon: NotebookPen, title: 'What you told me', text: line('debriefNotes', told.value) }] : []),
  { icon: CalendarCheck, title: 'What changes next', text: line('debriefNext') },
])

const emojiBoard = [
  { e: '🚀', l: 'Fast start' },
  { e: '💚', l: 'Zone 2 after km 2' },
  { e: '😴', l: 'Short night' },
  { e: '✅', l: 'Session done' },
]
</script>

<template>
  <div>
    <TopBar title="Debrief" back="/" />
    <div class="screen no-tab">
      <p class="type-overline text-muted">Easy run · Today 17:42</p>

      <CoachSays size="l" class="headline">{{ line('debriefHeadline') }}</CoachSays>

      <div v-if="coach.format === 'emoji'" class="board">
        <UiCard v-for="b in emojiBoard" :key="b.l" pad="s" class="type-caption center tile">
          <span class="emoji" aria-hidden="true">{{ b.e }}</span>{{ b.l }}
        </UiCard>
      </div>

      <UiCard as="section" tone="inverse" pad="s" class="chart">
        <div class="chart-head">
          <p class="type-overline text-inverse-muted">Pace per km</p>
          <p class="type-caption text-inverse-muted">Green band = your easy pace</p>
        </div>
        <PaceChart :splits="splits" :target="targetPace" :highlight="1" />
      </UiCard>

      <ol class="points">
        <li v-for="p in points" :key="p.title" class="point">
          <UiIconWell size="s"><component :is="p.icon" :size="18" /></UiIconWell>
          <div>
            <p class="type-overline text-muted">{{ p.title }}</p>
            <p class="type-body text">{{ p.text }}</p>
          </div>
        </li>
      </ol>

      <section class="section">
        <UiCard as="button" pad="m" class="toggle" :aria-expanded="showNumbers" @click="showNumbers = !showNumbers">
          <span class="type-headline">All session numbers</span>
          <ChevronDown :size="18" class="chev" :class="{ flip: showNumbers }" />
        </UiCard>
        <UiCard v-if="showNumbers" class="totals">
          <div v-for="t in sessionTotals" :key="t.label" class="stack-1">
            <p class="type-caption text-muted">{{ t.label }}</p>
            <p class="type-numeric-m text-heading">{{ t.value }}</p>
            <p class="type-caption text-accent-strong">{{ t.means }}</p>
          </div>
          <p class="type-caption text-muted src">Synced from your watch. Effort {{ f.effort }}/10 from your check-in.</p>
        </UiCard>
      </section>

      <UiButton variant="primary" block to="/plan" class="section">See updated plan</UiButton>
    </div>
  </div>
</template>

<style scoped>
.headline { margin-top: var(--space-3); }
.board { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-2); margin-top: var(--space-4); }
.tile { display: grid; justify-items: center; gap: var(--space-1); font-weight: 600; }
.emoji { font-size: var(--size-emoji-m); }
.chart { margin-top: var(--space-5); }
.chart-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-1); padding: var(--space-1) var(--space-1) 0; }

.points { margin-top: var(--space-5); }
.point { display: flex; gap: var(--space-3); padding: var(--space-4) 0; box-shadow: 0 1px 0 var(--color-border); }
.text { margin-top: var(--space-1); }

.toggle { display: flex; justify-content: space-between; align-items: center; min-height: var(--size-control-m); }
.chev { transition: transform var(--duration-base); }
.flip { transform: rotate(180deg); }
.totals { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); margin-top: var(--space-2); }
.src { grid-column: 1 / -1; }
</style>
