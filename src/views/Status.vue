<script setup>
import { computed, ref } from 'vue'
import { Check, X } from 'lucide-vue-next'
import TopBar from '../components/TopBar.vue'
import CoachSays from '../components/CoachSays.vue'
import { state, line, activeStatus } from '../store'
import { statusOptions, articles } from '../data/scenario'

// Picking a status previews the consequence before anything is saved.
const picked = ref(null)
const preview = computed(() => statusOptions.find((s) => s.id === picked.value))

function confirm() {
  state.status = picked.value
  picked.value = null
}
</script>

<template>
  <div>
    <TopBar title="My status" />
    <div class="screen">
      <UiCard v-if="activeStatus" as="section" class="current">
        <div class="row">
          <span class="emoji" aria-hidden="true">{{ activeStatus.emoji }}</span>
          <div class="grow">
            <p class="type-overline text-muted">Active since today</p>
            <p class="type-headline">{{ activeStatus.label }}</p>
          </div>
          <UiButton variant="secondary" size="s" @click="state.status = null">I’m better</UiButton>
        </div>
        <ul class="changes divided stack-2">
          <li v-for="c in activeStatus.changes" :key="c" class="row row-top type-body-s"><Check :size="15" class="tick" />{{ c }}</li>
        </ul>
      </UiCard>

      <template v-if="!preview">
        <CoachSays v-if="!activeStatus" size="l" class="ask">Is something going on? Tell me and I’ll adjust your plan around it.</CoachSays>
        <UiSectionHeader :title="activeStatus ? 'Change status' : 'What’s going on?'" class="add" />
        <div class="grid">
          <UiCard v-for="s in statusOptions" :key="s.id" as="button" class="option" :class="{ on: state.status === s.id }" @click="picked = s.id">
            <span class="emoji" aria-hidden="true">{{ s.emoji }}</span>
            <span class="type-headline">{{ s.label }}</span>
          </UiCard>
        </div>
        <p class="type-caption text-muted foot">Your period is tracked automatically through cycle sync. You can change that under Me.</p>
      </template>

      <section v-else class="preview">
        <button class="close" aria-label="Cancel" @click="picked = null"><X :size="20" /></button>
        <span class="emoji big" aria-hidden="true">{{ preview.emoji }}</span>
        <CoachSays size="l">{{ line('statusAck', preview.ack) }}</CoachSays>
        <UiCard class="changes-card">
          <ul class="stack-2">
            <li v-for="c in preview.changes" :key="c" class="row row-top type-body-s"><Check :size="15" class="tick" />{{ c }}</li>
          </ul>
        </UiCard>
        <UiCard as="article" pad="s" row class="read">
          <div class="read-img" :style="{ backgroundImage: `url(${articles[preview.article].img})` }" />
          <div>
            <p class="type-caption text-brand why">{{ articles[preview.article].why }}</p>
            <p class="type-headline">{{ articles[preview.article].title }}</p>
          </div>
        </UiCard>
        <UiButton variant="primary" block @click="confirm">Update my plan</UiButton>
      </section>
    </div>
  </div>
</template>

<style scoped>
.ask { margin-top: var(--space-2); }
.add { margin-top: var(--space-6); }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.option { display: grid; justify-items: start; gap: var(--space-5); }
.option.on { box-shadow: inset 0 0 0 2px var(--color-border-strong); }
.emoji { font-size: var(--size-emoji-m); line-height: 1; }
.emoji.big { font-size: var(--size-emoji-l); margin-bottom: var(--space-3); display: block; }
.foot { margin-top: var(--space-4); }

.current { margin-bottom: var(--space-2); }
.changes { margin-top: var(--space-3); }
.divided { padding-top: var(--space-3); box-shadow: 0 -1px 0 var(--color-border); }
.tick { color: var(--color-accent-strong); flex: none; margin-top: 2px; }

.preview { position: relative; padding-top: var(--space-2); }
.close {
  position: absolute; right: 0; top: 0; width: var(--size-tap); height: var(--size-tap); border-radius: 50%;
  background: var(--color-surface); box-shadow: inset 0 0 0 1px var(--color-border); display: grid; place-items: center;
}
.changes-card { margin-top: var(--space-4); }
.read { margin: var(--space-3) 0 var(--space-5); }
.read-img { width: 64px; height: 64px; border-radius: var(--radius-s); background-size: cover; background-position: center; flex: none; }
.why { font-weight: 600; margin-bottom: 2px; }
</style>
