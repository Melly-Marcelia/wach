<script setup>
import { computed } from 'vue'
import { X, HelpCircle, Lightbulb } from 'lucide-vue-next'
import TrendChart from './TrendChart.vue'
import CoachAvatar from './CoachAvatar.vue'
import { state, coach } from '../store'
import { metrics } from '../data/metrics'

// Bottom sheet that translates one health metric:
// what it is → what today's number means → what to do.
const m = computed(() => metrics[state.metric])
const close = () => (state.metric = null)
const verdictTone = { down: 'warning', up: 'positive', neutral: 'cycle' }
</script>

<template>
  <Transition name="sheet">
    <div v-if="m" class="scrim" @click.self="close">
      <section class="sheet" role="dialog" aria-modal="true" :aria-label="m.name">
        <span class="grab" aria-hidden="true" />
        <header class="head">
          <div>
            <p class="type-overline text-muted">{{ m.tech }}</p>
            <h2 class="type-display-m text-heading title">{{ m.name }}</h2>
          </div>
          <button class="close" aria-label="Close" @click="close"><X :size="20" /></button>
        </header>

        <div class="verdict">
          <span class="type-numeric-l text-heading">{{ m.display }}</span>
          <UiChip :tone="verdictTone[m.effect]">{{ m.verdict }}</UiChip>
        </div>

        <TrendChart v-if="m.history" :values="m.history" :band="m.normal" :label-today="m.display" class="chart" />
        <div v-else class="cycle">
          <span v-for="d in 28" :key="d" :class="{ period: d <= 5, today: d === m.today, phase: d > 14 }" />
          <p class="type-caption text-muted legend"><i class="sw period" /> period · <i class="sw phase" /> days before your period · today is day {{ m.today }}</p>
        </div>

        <div class="blocks">
          <div class="block">
            <UiIconWell size="s"><HelpCircle :size="17" /></UiIconWell>
            <div><p class="type-overline text-muted">What it is</p><p class="type-body text">{{ m.what }}</p></div>
          </div>
          <div class="block">
            <UiIconWell size="s"><Lightbulb :size="17" /></UiIconWell>
            <div><p class="type-overline text-muted">What today’s number means</p><p class="type-body text">{{ m.means }}</p></div>
          </div>
          <div class="block">
            <span class="avatar-well"><CoachAvatar :size="32" /></span>
            <div><p class="type-overline text-muted">What {{ coach.name }} suggests</p><p class="type-voice-m text">{{ m.todo }}</p></div>
          </div>
        </div>
      </section>
    </div>
  </Transition>
</template>

<style scoped>
.scrim { position: absolute; inset: 0; z-index: var(--z-sheet); background: var(--color-scrim); display: flex; align-items: flex-end; }
.sheet {
  width: 100%; max-height: 88%; overflow-y: auto; background: var(--color-surface);
  border-radius: var(--radius-sheet) var(--radius-sheet) 0 0;
  padding: var(--space-3) var(--space-5) calc(var(--space-8) + env(safe-area-inset-bottom));
}
.grab { display: block; width: 40px; height: 5px; border-radius: var(--radius-full); background: var(--color-border); margin: 0 auto var(--space-3); }
.head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); }
.title { margin-top: var(--space-1); }
.close { width: var(--size-tap); height: var(--size-tap); border-radius: 50%; background: var(--color-surface-sunken); display: grid; place-items: center; flex: none; }

.verdict { display: flex; align-items: center; gap: var(--space-3); margin-top: var(--space-3); }
.chart { margin-top: var(--space-3); }

.cycle { display: grid; grid-template-columns: repeat(28, 1fr); gap: 2px; margin-top: var(--space-4); }
.cycle span { height: 18px; border-radius: 3px; background: var(--color-border); }
.cycle .phase { background: var(--color-cycle-phase); }
.cycle .period { background: var(--color-cycle-period); }
.cycle .today { background: var(--color-text-heading); }
.legend { grid-column: 1 / -1; margin-top: var(--space-2); display: flex; align-items: center; gap: var(--space-1); flex-wrap: wrap; }
.sw { display: inline-block; width: 8px; height: 8px; border-radius: 2px; }
.sw.period { background: var(--color-cycle-period); }
.sw.phase { background: var(--color-cycle-phase); }

.blocks { margin-top: var(--space-4); }
.block { display: flex; gap: var(--space-3); padding: var(--space-3) 0; box-shadow: 0 -1px 0 var(--color-border); }
.avatar-well { width: 32px; display: grid; place-items: center; flex: none; align-self: flex-start; }
.text { margin-top: var(--space-1); }

.sheet-enter-active, .sheet-leave-active { transition: background var(--duration-base); }
.sheet-enter-active .sheet, .sheet-leave-active .sheet { transition: transform var(--duration-slow) var(--ease-standard); }
.sheet-enter-from, .sheet-leave-to { background: transparent; }
.sheet-enter-from .sheet, .sheet-leave-to .sheet { transform: translateY(100%); }

/* Wide (iPhone Duo unfolded): a side panel from the right, full height, so the
   screen it explains stays visible next to it. */
@container phone (min-width: 700px) {
  .scrim { justify-content: flex-end; align-items: stretch; }
  .sheet { width: var(--size-panel); max-height: none; border-radius: var(--radius-sheet) 0 0 var(--radius-sheet); padding-top: calc(50px + var(--space-3)); scrollbar-width: none; }
  .grab { display: none; }
  .sheet-enter-from .sheet, .sheet-leave-to .sheet { transform: translateX(100%); }
}
</style>
