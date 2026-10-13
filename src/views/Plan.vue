<script setup>
import { computed } from 'vue'
import { Sparkles, ChevronRight, ArrowRight, Check } from 'lucide-vue-next'
import CoachSays from '../components/CoachSays.vue'
import SessionIcon from '../components/SessionIcon.vue'
import { state, coach, activeStatus, statusOverride } from '../store'
import { user, week, sessions } from '../data/scenario'

// Resolve each planned item into what the runner will actually do this week,
// keeping the original next to it whenever the coach changed something.
const days = computed(() =>
  week.map((d) => ({
    ...d,
    items: d.items.map((it) => {
      if (it.planned && statusOverride.value) {
        return { id: it.id, ...statusOverride.value, adapted: true, was: sessions[it.planned].title, reason: `Because ${activeStatus.value.ack}` }
      }
      if (it.planned) {
        const swapped = state.swap !== 'kept'
        const s = sessions[swapped ? it.adaptTo : it.planned]
        return {
          id: it.id, type: 'run', link: '/session',
          title: s.title, sub: `${s.intensity} intensity · ${s.duration}`,
          adapted: swapped, pending: !state.swap,
          was: swapped ? sessions[it.planned].title : null, reason: it.reason,
        }
      }
      if (it.movedIfSwap && state.swap === 'accepted') {
        return { ...it, ...it.movedIfSwap, adapted: true, was: it.title, reason: 'Made room for the moved session' }
      }
      return it
    }),
  })),
)
</script>

<template>
  <div class="screen wide plan">
    <!-- Two columns when unfolded: goal and coach summary pinned left, the week scrolling right. -->
    <div class="col-main">
    <header class="hero">
      <p class="type-overline text-muted">Week {{ user.goal.week }} of {{ user.goal.weeks }}</p>
      <h1 class="type-display-m text-heading title">{{ user.goal.title }}</h1>
      <p class="type-body-s text-muted">{{ user.goal.weeksLeft }} weeks to go · {{ user.goal.date }}</p>
      <div class="progress" role="progressbar" :aria-valuenow="user.goal.week" :aria-valuemax="user.goal.weeks"><span :style="{ width: (user.goal.week / user.goal.weeks) * 100 + '%' }" /></div>
      <RouterLink to="/progress" class="link prog">Am I on track? See progress →</RouterLink>
    </header>

    <UiCard>
      <CoachSays size="s" label="this week">
        <template v-if="activeStatus">Your status changed the week. Here is the new plan.</template>
        <template v-else-if="state.swap === 'accepted'">Two sessions moved so that intervals land on a fresher day. Total volume is unchanged.</template>
        <template v-else-if="state.swap === 'kept'">You kept the plan as written. I will keep a close eye on your heart rate.</template>
        <template v-else>One change is waiting for you today. The rest of the week is on track.</template>
      </CoachSays>
    </UiCard>

    <UiCard v-if="activeStatus" tone="warning" to="/status" class="status">
      <p class="type-overline text-warning">{{ activeStatus.emoji }} Because {{ activeStatus.ack }}</p>
      <ul class="stack-2 changes">
        <li v-for="c in activeStatus.changes" :key="c" class="row row-top type-body-s"><Check :size="14" class="tick" />{{ c }}</li>
      </ul>
    </UiCard>
    </div>

    <ol class="days">
      <li v-for="d in days" :key="d.date" class="day" :class="{ today: d.label === 'Today' }">
        <div class="date">
          <span class="type-numeric-m dnum">{{ d.date }}</span>
          <span class="type-caption text-muted">{{ d.day }}</span>
        </div>
        <div class="grow stack-2">
          <p v-if="d.label" class="type-overline text-muted">{{ d.label }}</p>
          <UiCard v-for="it in d.items" :key="it.id" :to="it.link" pad="s" class="item" :class="{ adapted: it.adapted }">
            <UiListRow :title="it.title" :subtitle="it.sub" class="item-row">
              <template #leading><SessionIcon :type="it.type" /></template>
              <template v-if="it.link" #trailing><ChevronRight :size="18" class="text-subtle" /></template>
            </UiListRow>
            <div v-if="it.adapted" class="change">
              <UiChip tone="positive"><Sparkles :size="12" /> {{ it.pending ? 'Suggested by' : 'Adapted by' }} {{ coach.name }}</UiChip>
              <p class="type-caption text-muted was"><s>{{ it.was }}</s> <ArrowRight :size="11" /> {{ it.reason }}</p>
            </div>
          </UiCard>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.hero { padding: var(--space-3) 0 var(--space-4); }
.title { margin: var(--space-1) 0; }
.progress { height: 6px; border-radius: var(--radius-full); background: var(--color-border); margin-top: var(--space-3); overflow: hidden; }
.progress span { display: block; height: 100%; background: var(--color-accent); border-radius: var(--radius-full); }
.prog { display: inline-block; margin-top: var(--space-3); }

.status { margin-top: var(--space-3); }
.changes { margin-top: var(--space-3); }
.tick { color: var(--color-warning-text); flex: none; margin-top: 2px; }

.days { margin-top: var(--space-5); display: grid; gap: var(--space-4); }
.day { display: flex; gap: var(--space-3); }
.date { width: 40px; flex: none; display: flex; flex-direction: column; align-items: center; gap: 2px; padding-top: var(--space-3); }
.dnum { color: var(--color-text-heading); }
.today .dnum { background: var(--color-accent); color: var(--color-on-accent); border-radius: var(--radius-s); padding: 6px 7px; }
.item-row { min-height: 0; padding: 0; }
.item.adapted { box-shadow: inset 0 0 0 1px var(--color-positive-border), inset 3px 0 0 var(--color-accent); }
.change { margin-top: var(--space-3); padding-top: var(--space-3); border-top: 1px dashed var(--color-border); display: grid; gap: var(--space-2); justify-items: start; }
.was { display: flex; align-items: center; gap: var(--space-1); flex-wrap: wrap; }

/* Wide (iPhone Duo unfolded): the goal and the coach's summary stay pinned on the
   left while the week scrolls on the right. */
@container (min-width: 700px) {
  .plan { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); column-gap: var(--space-6); align-items: start; }
  .col-main { position: sticky; top: 0; padding-bottom: var(--space-4); }
  .days { margin-top: var(--space-3); }
}
</style>
