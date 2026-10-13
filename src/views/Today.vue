<script setup>
import logo from '../assets/logo.png'
import { computed, ref } from 'vue'
import { Watch, ChevronRight, Wind, Moon, Sparkles, HeartPulse, Check, Utensils, BatteryLow } from 'lucide-vue-next'
import CoachSays from '../components/CoachSays.vue'
import CoachAvatar from '../components/CoachAvatar.vue'
import SessionIcon from '../components/SessionIcon.vue'
import RangeBar from '../components/RangeBar.vue'
import { state, coach, line, activeStatus, statusOverride, todaySession } from '../store'
import { user, readiness, weather, sessions, articles } from '../data/scenario'
import { metrics } from '../data/metrics'

// Pinned personal photos (the slide promises up to 6). Tap to flip through.
const photos = ['img/hero.png', 'img/article-1.png', 'img/article-2.png']
const photo = ref(0)
const nextPhoto = () => (photo.value = (photo.value + 1) % photos.length)

const session = computed(() => sessions[todaySession.value])

const picks = computed(() => {
  const list = []
  if (activeStatus.value) list.push(articles[activeStatus.value.article])
  if (state.cycleSync) list.push(articles.luteal)
  list.push(articles.shortSleep, articles.breakfast)
  return list.slice(0, 3)
})

const signals = ['sleep', 'rhr', 'hrv', 'cycle', 'load'].map((id) => metrics[id])
</script>

<template>
  <div class="screen wide today">
    <header class="head">
      <div>
        <p class="type-overline text-muted">Monday 19 May</p>
        <img :src="logo" alt="WACH" class="logo" />
      </div>
      <UiChip tone="outline"><Watch :size="14" /> Synced</UiChip>
    </header>

    <!-- Two columns when unfolded: the coach's read on the left, the rest of the day on the right. -->
    <div class="col-main">
    <!-- Photo widget: personal photo, greeting, weather-based outfit advice -->
    <button class="photo" :style="{ backgroundImage: `url(${photos[photo]})` }" aria-label="Next pinned photo" @click="nextPhoto">
      <span class="photo-shade" />
      <span class="photo-body">
        <span class="type-display-l">{{ line('greeting', user.name) }}</span>
        <span class="type-body-s outfit"><Wind :size="15" /> {{ weather.temp }}° · {{ line('outfit') }}</span>
      </span>
      <span class="dots" aria-hidden="true"><i v-for="(p, i) in photos" :key="p" :class="{ on: i === photo }" /></span>
    </button>

    <!-- Status banner, if the runner flagged one -->
    <UiCard v-if="activeStatus" tone="warning" pad="s" to="/status" row class="status-banner">
      <span class="emoji" aria-hidden="true">{{ activeStatus.emoji }}</span>
      <span class="grow type-label">{{ activeStatus.label }} <span class="type-caption text-muted">· your plan is adjusted</span></span>
      <ChevronRight :size="18" />
    </UiCard>

    <!-- The coach's read of today. This is the heart of WACH. -->
    <UiCard as="section" tone="inverse" pad="l" class="brief">
      <div class="readiness">
        <span class="ring" :style="{ '--p': readiness.score }"><span><BatteryLow :size="22" /></span></span>
        <div>
          <p class="type-overline text-inverse-muted">Your body today</p>
          <p class="type-display-s ready-label">{{ readiness.label }}</p>
        </div>
      </div>

      <CoachSays dark label="read your night">
        <template v-if="statusOverride">Because {{ activeStatus.ack }}, no running today: {{ statusOverride.title.toLowerCase() }} instead. Your body comes first.</template>
        <template v-else>{{ state.swap === 'accepted' ? line('swapAccepted') : state.swap === 'kept' ? line('swapKept') : line('brief') }}</template>
        <template v-if="!state.swap && !statusOverride" #actions>
          <UiButton variant="accent" size="s" @click="state.swap = 'accepted'"><Check :size="16" /> Swap to easy 35 min</UiButton>
          <UiButton variant="inverse" size="s" @click="state.swap = 'kept'">Keep 3×2 km</UiButton>
        </template>
      </CoachSays>

      <div class="why">
        <p class="type-overline text-inverse-muted">Why {{ coach.name }} thinks so · tap to understand</p>
        <div class="signals">
          <button v-for="m in signals" :key="m.id" class="signal" :class="m.effect" @click="state.metric = m.id">
            <span class="type-caption text-inverse-muted">{{ m.name }}</span>
            <span class="type-headline verdict">{{ m.verdict }}</span>
            <RangeBar v-if="m.normal" :metric="m" dark class="bar" />
            <span v-else class="bar cyc" aria-hidden="true"><i v-for="d in 14" :key="d" :class="{ on: d === 12 }" /></span>
            <span class="type-caption raw">{{ m.display }}</span>
          </button>
        </div>
      </div>
    </UiCard>
    </div>

    <div class="col-side">
    <!-- Today's plan -->
    <section class="section">
      <UiSectionHeader title="Today’s plan" action="Full week" to="/plan" />
      <UiCard pad="none" class="list">
        <UiListRow v-if="statusOverride" :title="statusOverride.title" :subtitle="statusOverride.sub">
          <template #leading><SessionIcon :type="statusOverride.type" /></template>
          <template #trailing><UiChip tone="positive"><Sparkles :size="12" /> Adapted</UiChip></template>
        </UiListRow>
        <UiListRow v-else to="/session" :title="session.title" :subtitle="`${session.intensity} intensity`">
          <template #leading><SessionIcon type="run" /></template>
          <template v-if="state.swap !== 'kept'" #trailing>
            <UiChip tone="positive"><Sparkles :size="12" /> {{ state.swap === 'accepted' ? 'Adapted' : 'Suggested' }}</UiChip>
          </template>
        </UiListRow>
        <UiListRow title="Stretching" subtitle="10 min · evening">
          <template #leading><SessionIcon type="stretch" /></template>
        </UiListRow>
      </UiCard>
    </section>

    <!-- Cycle-aware note -->
    <section v-if="state.cycleSync" class="section">
      <UiSectionHeader title="Your cycle" />
      <UiCard>
        <div class="cycle-track" role="img" aria-label="Cycle day 24 of 28">
          <span v-for="d in 28" :key="d" :class="{ past: d < 24, today: d === 24, period: d <= 5 }" />
        </div>
        <div class="row row-top cycle-row">
          <CoachAvatar :size="28" />
          <p class="type-voice-s">{{ line('cycle') }}</p>
        </div>
      </UiCard>
    </section>

    <!-- Habit nudge -->
    <section class="section">
      <UiCard tone="positive" pad="s" row>
        <UiIconWell tone="accent" size="s"><Utensils :size="18" /></UiIconWell>
        <p class="type-body-s"><strong>Tonight</strong> · {{ line('habit') }}</p>
      </UiCard>
    </section>

    <!-- Status entry -->
    <section v-if="!activeStatus" class="section">
      <UiCard pad="none" class="list">
        <UiListRow to="/status" title="Injured, sick, fasting?" :subtitle="`Tell ${coach.name} and your plan adapts.`">
          <template #leading><UiIconWell><HeartPulse :size="20" /></UiIconWell></template>
        </UiListRow>
      </UiCard>
    </section>

    <!-- Contextual reading -->
    <section class="section">
      <UiSectionHeader title="Picked for you" />
      <div class="reads">
        <article v-for="a in picks" :key="a.title" class="read">
          <div class="read-img" :style="{ backgroundImage: `url(${a.img})` }" />
          <p class="type-caption text-brand read-why"><Moon :size="11" /> {{ a.why }}</p>
          <p class="type-headline">{{ a.title }}</p>
        </article>
      </div>
    </section>
    </div>
  </div>
</template>

<style scoped>
.head { display: flex; align-items: flex-end; justify-content: space-between; padding: var(--space-2) 0 var(--space-4); }
.logo { height: 22px; margin-top: var(--space-2); mix-blend-mode: multiply; }

.photo {
  position: relative; display: block; width: 100%; height: 178px; border-radius: var(--radius-xl); overflow: hidden;
  background-size: cover; background-position: center 30%; text-align: left; color: var(--color-text-inverse);
}
.photo-shade { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 25%, var(--color-photo-shade)); }
.photo-body { position: absolute; left: var(--space-5); right: var(--space-5); bottom: var(--space-4); display: grid; gap: var(--space-2); }
.outfit { display: flex; gap: var(--space-2); align-items: center; opacity: .92; }
.dots { position: absolute; top: var(--space-4); right: var(--space-4); display: flex; gap: var(--space-1); }
.dots i { width: 6px; height: 6px; border-radius: var(--radius-full); background: var(--color-text-inverse-subtle); transition: width var(--duration-base); }
.dots i.on { background: var(--color-text-inverse); width: 16px; }

.status-banner { margin-top: var(--space-3); }
.emoji { font-size: var(--size-emoji-s); }

.brief { margin-top: var(--space-3); }
.readiness {
  display: flex; align-items: center; gap: var(--space-4);
  padding-bottom: var(--space-4); margin-bottom: var(--space-4); box-shadow: 0 1px 0 var(--color-border-inverse);
}
.ring {
  --p: 50; width: 56px; height: 56px; border-radius: 50%; flex: none; display: grid; place-items: center;
  background: conic-gradient(var(--color-warning) calc(var(--p) * 1%), var(--color-border-inverse) 0);
}
.ring span { width: 44px; height: 44px; border-radius: 50%; background: var(--color-surface-inverse); display: grid; place-items: center; color: var(--color-warning); }
.ready-label { color: var(--color-warning); margin-top: 2px; }

.why { margin-top: var(--space-5); }
.signals {
  display: flex; gap: var(--space-2); overflow-x: auto; scrollbar-width: none;
  margin: var(--space-3) calc(var(--space-4) * -1) 0; padding: 0 var(--space-4) 2px;
}
.signals::-webkit-scrollbar { display: none; }
.signal {
  flex: none; width: 132px; padding: var(--space-3); border-radius: var(--radius-m);
  background: var(--color-surface-inverse-raised); display: flex; flex-direction: column; gap: var(--space-1);
  text-align: left; color: var(--color-text-inverse); transition: background var(--duration-fast);
}
.signal:active { background: var(--color-border-inverse); }
.verdict { min-height: 42px; }
.signal.down .verdict { color: var(--color-warning-on-inverse); }
.signal.up .verdict { color: var(--color-accent); }
.signal.neutral .verdict { color: var(--color-cycle-on-inverse); }
.bar { margin: var(--space-2) 0 var(--space-1); }
.cyc { display: grid; grid-template-columns: repeat(14, 1fr); gap: 2px; height: 6px; }
.cyc i { border-radius: 2px; background: color-mix(in srgb, var(--color-cycle-on-inverse) 30%, transparent); }
.cyc i.on { background: var(--color-cycle-on-inverse); }
.raw { color: var(--color-text-inverse-subtle); }

.list { padding: 0 var(--space-4); }

.cycle-track { display: grid; grid-template-columns: repeat(28, 1fr); gap: 2px; }
.cycle-track span { height: 8px; border-radius: 2px; background: var(--color-border); }
.cycle-track .past { background: var(--color-cycle-phase); }
.cycle-track .period { background: var(--color-cycle-period); }
.cycle-track .today { background: var(--color-text-heading); height: 14px; margin-top: -3px; }
.cycle-row { margin-top: var(--space-4); }

.reads {
  display: flex; gap: var(--space-3); overflow-x: auto; scrollbar-width: none;
  margin: 0 calc(var(--space-gutter) * -1); padding: 0 var(--space-gutter);
}
.reads::-webkit-scrollbar { display: none; }
.read { flex: none; width: 172px; }
.read-img { height: 112px; border-radius: var(--radius-m); background-size: cover; background-position: center; }
.read-why { margin: var(--space-2) 0 2px; display: flex; gap: var(--space-1); align-items: center; font-weight: 600; }

/* Wide (iPhone Duo unfolded): two columns. The coach's read stays in view on the
   left while the day's plan, cycle and reading sit beside it. */
@container (min-width: 700px) {
  .today { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); column-gap: var(--space-5); align-items: start; }
  .head { grid-column: 1 / -1; }
  .col-side > .section:first-child { margin-top: 0; }
  .photo { height: 200px; }
  /* The side column is narrow: show the three reads as a list, not a carousel. */
  .reads { flex-direction: column; overflow: visible; margin: 0; padding: 0; }
  .read { width: auto; display: grid; grid-template-columns: 96px 1fr; column-gap: var(--space-3); align-items: center; }
  .read-img { grid-row: span 2; height: 72px; }
  .read-why { margin: 0; align-self: end; }
  .read .type-headline { align-self: start; }
}
</style>
