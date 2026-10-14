<script setup>
import { ShieldCheck, Watch, Droplet, Plus, HeartPulse, RotateCcw } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import CoachAvatar from '../components/CoachAvatar.vue'
import { state, coach, activeStatus, replayOnboarding } from '../store'
import { user, guardians } from '../data/scenario'

const router = useRouter()
function replay() {
  replayOnboarding()
  router.replace('/welcome')
}
</script>

<template>
  <div class="screen">
    <header class="hero">
      <span class="type-display-m avatar" aria-hidden="true">M</span>
      <div>
        <h1 class="type-display-m text-heading">{{ user.name }}</h1>
        <p class="type-body-s text-muted">WACH runner since February</p>
      </div>
    </header>

    <UiCard as="section" tone="inverse" pad="l">
      <p class="type-overline text-inverse-muted">Goal</p>
      <p class="type-display-s goal-title">{{ user.goal.title }}</p>
      <p class="type-body-s text-inverse-muted">{{ user.goal.date }} · {{ user.goal.weeksLeft }} weeks to go</p>
      <div class="row row-top goal-coach">
        <CoachAvatar :size="28" />
        <p class="type-voice-s">You’re on track. Your long run grew from 8 to 14 km in four weeks, and your easy runs got 12 s/km faster.</p>
      </div>
      <UiButton variant="accent" size="s" to="/progress" class="progress-link">See my progress</UiButton>
    </UiCard>

    <section class="section">
      <UiSectionHeader title="Safety" />
      <UiCard pad="none" class="list">
        <UiListRow title="Guardian mode" subtitle="Alerts after 90 s with no response">
          <template #leading><UiIconWell><ShieldCheck :size="20" /></UiIconWell></template>
          <template #trailing><UiToggle v-model="state.guardianMode" label="Guardian mode" /></template>
        </UiListRow>
        <UiListRow v-for="g in guardians" :key="g.name" :title="g.name" :subtitle="g.relation" to="/me">
          <template #leading><span class="type-label initial">{{ g.initial }}</span></template>
        </UiListRow>
        <UiListRow as="button" title="Add a guardian" class="add">
          <template #leading><UiIconWell tone="neutral"><Plus :size="18" /></UiIconWell></template>
        </UiListRow>
      </UiCard>
    </section>

    <section class="section">
      <UiSectionHeader :title="`What ${coach.name} can read`" />
      <UiCard pad="none" class="list">
        <UiListRow title="Your watch" :subtitle="user.watch">
          <template #leading><UiIconWell><Watch :size="20" /></UiIconWell></template>
          <template #trailing><UiChip tone="positive">Connected</UiChip></template>
        </UiListRow>
        <UiListRow title="Cycle sync" subtitle="Adapts intensity to your phase">
          <template #leading><UiIconWell><Droplet :size="20" /></UiIconWell></template>
          <template #trailing><UiToggle v-model="state.cycleSync" label="Cycle sync" /></template>
        </UiListRow>
        <UiListRow to="/status" title="My status" :subtitle="activeStatus ? activeStatus.label : `Injured, sick, fasting? Tell ${coach.name}`">
          <template #leading><UiIconWell><HeartPulse :size="20" /></UiIconWell></template>
        </UiListRow>
        <UiListRow to="/coach" :title="`Coach: ${coach.name}`" :subtitle="coach.title">
          <template #leading><CoachAvatar :size="40" /></template>
        </UiListRow>
      </UiCard>
    </section>

    <button class="type-label text-muted replay" @click="replay"><RotateCcw :size="15" /> Replay onboarding</button>
  </div>
</template>

<style scoped>
.hero { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4) 0 var(--space-5); }
.avatar {
  width: 64px; height: 64px; border-radius: var(--radius-xl); flex: none; display: grid; place-items: center;
  background: var(--color-surface-brand); color: var(--color-text-inverse);
  /* Display tracking leaves negative space after a lone glyph, and line-height skews it vertically */
  letter-spacing: 0; line-height: 1; text-box: trim-both cap alphabetic;
}
.goal-title { margin: var(--space-2) 0 var(--space-1); }
.goal-coach { margin-top: var(--space-4); padding-top: var(--space-4); box-shadow: 0 -1px 0 var(--color-border-inverse); }
.progress-link { margin-top: var(--space-4); }

.list { padding: 0 var(--space-4); }
.initial {
  width: var(--size-icon-well); height: var(--size-icon-well); border-radius: 50%; flex: none; display: grid; place-items: center;
  background: var(--color-info-surface); color: var(--color-text-brand); font-weight: 800;
}
.add :deep(.type-headline) { color: var(--color-text-brand); }

.replay { display: flex; align-items: center; justify-content: center; gap: var(--space-2); width: 100%; margin-top: var(--space-6); min-height: var(--size-tap); }
</style>
