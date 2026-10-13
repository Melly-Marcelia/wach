<script setup>
import { Sparkles } from 'lucide-vue-next'
import CoachAvatar from '../components/CoachAvatar.vue'
import CoachOption from '../components/CoachOption.vue'
import { state, coach } from '../store'
import { coachList } from '../data/coaches'
import { decisions } from '../data/scenario'
</script>

<template>
  <div class="screen">
    <header class="hero">
      <CoachAvatar :size="84" />
      <p class="type-overline text-muted label">Your AI coach</p>
      <h1 class="type-display-l text-heading">{{ coach.name }}</h1>
      <p class="type-voice-m text-brand">“{{ coach.motto }}”</p>
    </header>

    <section class="section">
      <UiSectionHeader title="Choose your coach" />
      <p class="type-body-s text-muted intro">Same data, same safety. Each coach talks to you differently, in nudges, live cues and debriefs.</p>
      <div class="stack-3" role="radiogroup" aria-label="Coach">
        <CoachOption v-for="c in coachList" :key="c.id" :coach="c" :selected="state.coachId === c.id" @select="state.coachId = $event" />
      </div>
    </section>

    <section class="section">
      <UiSectionHeader :title="`Why ${coach.name} changed things`" />
      <ol class="log">
        <li v-for="d in decisions" :key="d.when">
          <span class="dot"><Sparkles :size="12" /></span>
          <div class="stack-1">
            <p class="type-caption text-muted">{{ d.when }}</p>
            <p class="type-headline">{{ d.what }}</p>
            <p class="type-caption text-brand">Because: {{ d.why }}</p>
          </div>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.hero { display: grid; justify-items: center; text-align: center; gap: var(--space-2); padding: var(--space-5) 0 var(--space-2); }
.label { margin-top: var(--space-3); }
.intro { margin-bottom: var(--space-3); }

.log { position: relative; }
.log::before { content: ''; position: absolute; left: 11px; top: var(--space-2); bottom: var(--space-2); width: 2px; background: var(--color-border); }
.log li { position: relative; display: flex; gap: var(--space-4); padding-bottom: var(--space-4); }
.dot { width: 24px; height: 24px; border-radius: 50%; background: var(--color-accent); color: var(--color-on-accent); display: grid; place-items: center; flex: none; z-index: 1; }
</style>
