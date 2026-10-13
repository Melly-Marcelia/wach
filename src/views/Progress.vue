<script setup>
import { computed } from 'vue'
import TopBar from '../components/TopBar.vue'
import CoachSays from '../components/CoachSays.vue'
import TrendChart from '../components/TrendChart.vue'
import InsightCard from '../components/InsightCard.vue'
import { state, coach } from '../store'
import { metrics } from '../data/metrics'
import { user } from '../data/scenario'

// Replaces the old Results / Current goal screens. Instead of charts of
// "training load" and "vVO2max", each card answers a question a runner asks.

const headline = computed(() => ({
  clara: 'You are getting fitter, and doing it safely.',
  blaze: 'You’re levelling up 📈 and staying injury-free!',
  theo: 'Your body is getting stronger, gently and steadily.',
})[coach.value.id])

// Easy-run pace at the same heart rate (145 bpm), last 8 weeks. Faster = fitter.
// Plotted as negative seconds so "up" means "better".
const efficiency = [422, 419, 418, 415, 414, 412, 411, 410].map((s) => -s)
// Predicted half-marathon time from VO2max, in minutes (negative: up = faster).
const prediction = [129, 128, 127.5, 126, 125.5, 124.5, 123.5, 123].map((m) => -m)

const load = metrics.load
const loadPos = computed(() => Math.min(100, Math.max(0, ((load.today - 0.5) / (1.8 - 0.5)) * 100)))
</script>

<template>
  <div>
    <TopBar title="Your progress" />
    <div class="screen no-tab">
      <p class="type-overline text-muted">{{ user.goal.title }} · {{ user.goal.weeksLeft }} weeks to go</p>
      <CoachSays size="l" class="head">{{ headline }}</CoachSays>

      <div class="stack-3">
        <InsightCard question="Am I getting fitter?" tech="Aerobic efficiency: pace at a fixed heart rate of 145 bpm">
          <template #answer>Yes. Same effort, <span class="hl">12 s/km faster</span>.</template>
          <TrendChart :values="efficiency" from="8 weeks ago" to="now" label-today="6:50 /km" :height="110" />
          <template #plain>8 weeks ago an easy run at 145 bpm was 7:02 per km. Now it’s 6:50. Your heart does the same work and you go further.</template>
        </InsightCard>

        <InsightCard question="Am I training the right amount?" :tech="load.tech" tappable @open="state.metric = 'load'">
          <template #answer>Yes, you’re in your <span class="hl">sweet spot</span>.</template>
          <div class="gauge" aria-hidden="true">
            <span class="type-caption g low">Too little</span>
            <span class="type-caption g mid">Sweet spot</span>
            <span class="type-caption g high">Injury risk</span>
            <span class="marker" :style="{ left: loadPos + '%' }" />
          </div>
          <template #plain>This week you trained about as much as your body is used to. That’s where you improve without getting hurt.</template>
        </InsightCard>

        <InsightCard question="Am I ready for race day?" tech="Race prediction from VO2max 44 ml/kg/min (+2 in 8 weeks)">
          <template #answer>On track: about <span class="hl">2:03</span>.</template>
          <TrendChart :values="prediction" :band="[-125, -118]" label-band="your goal" from="8 weeks ago" to="now" label-today="2:03" :height="110" />
          <template #plain>If the race were today, your fitness says you’d finish in about 2 hours 3 minutes. Your goal is under 2:05.</template>
        </InsightCard>

        <InsightCard question="Am I recovering well?" tech="Heart rate variability (HRV), 38 ms today" tappable @open="state.metric = 'hrv'">
          <template #answer>Not quite <span class="hl warn">this week</span>.</template>
          <TrendChart :values="metrics.hrv.history" :band="metrics.hrv.normal" label-today="38 ms" :height="110" />
          <template #plain>Your recovery has been dropping for 5 days. That’s common before your period, so this week is lighter on purpose.</template>
        </InsightCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.head { margin: var(--space-2) 0 var(--space-5); }
.gauge { position: relative; display: grid; grid-template-columns: 23% 38.5% 1fr; gap: 3px; margin: var(--space-1) 0 2px; padding-top: var(--space-4); }
.g { height: 28px; border-radius: var(--radius-s); display: grid; place-items: center; font-weight: 700; }
.low { background: var(--color-info-surface); color: var(--color-text-brand); }
.mid { background: var(--color-accent); color: var(--color-on-accent); }
.high { background: var(--color-warning-surface-strong); color: var(--color-warning-text); }
.marker {
  position: absolute; top: 0; width: 0; height: 0; transform: translateX(-50%);
  border: 7px solid transparent; border-top: 10px solid var(--color-text-heading);
}
</style>
