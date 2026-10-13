<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import logo from '../assets/logo.png'
import CoachAvatar from '../components/CoachAvatar.vue'
import CoachOption from '../components/CoachOption.vue'
import { state } from '../store'
import { coachList, coaches } from '../data/coaches'
import { user } from '../data/scenario'

const router = useRouter()
const step = ref(1) // 1 welcome · 2 choose coach · 3 meet your coach
const picked = ref(null) // nothing preselected: choosing a coach is a real decision
const chosen = computed(() => coaches[picked.value])

function finish() {
  state.coachId = picked.value
  state.onboarded = true
  router.replace('/')
}
</script>

<template>
  <div class="ob">
    <header v-if="step > 1" class="bar">
      <button class="icon-btn" aria-label="Back" @click="step--"><ChevronLeft :size="24" /></button>
      <div class="dots" aria-hidden="true"><i v-for="n in 3" :key="n" :class="{ on: n <= step }" /></div>
      <span class="icon-btn" />
    </header>

    <Transition name="fade" mode="out-in">
      <!-- 1. Welcome -->
      <section v-if="step === 1" key="1" class="body welcome">
        <div class="splash">
          <img :src="logo" alt="WACH" class="logo" />
        </div>

        <UiButton variant="primary" block class="cta" @click="step = 2">Get started</UiButton>
      </section>

      <!-- 2. Choose your coach -->
      <section v-else-if="step === 2" key="2" class="body">
        <h1 class="type-display-m text-heading title-s">Choose your coach</h1>
        <p class="type-body text-muted lead">All three read the same data and keep you just as safe. They just talk to you differently.</p>

        <div class="stack-3 coaches" role="radiogroup" aria-label="Coach">
          <CoachOption v-for="c in coachList" :key="c.id" :coach="c" :selected="picked === c.id" sample="selected" @select="picked = $event" />
        </div>

        <p class="type-caption text-muted center switch">You can switch coach anytime in the Coach tab.</p>
        <UiButton variant="primary" block class="cta" :disabled="!picked" @click="step = 3">
          {{ picked ? `Continue with ${chosen.name}` : 'Pick a coach to continue' }}
        </UiButton>
      </section>

      <!-- 3. Meet your coach -->
      <section v-else key="3" class="body meet">
        <CoachAvatar :size="132" :coach-data="chosen" />
        <p class="type-overline text-muted label">Your coach</p>
        <h1 class="type-display-xl text-heading">{{ chosen.name }}</h1>
        <p class="type-voice-l intro">{{ chosen.intro(user.name) }}</p>
        <UiButton variant="accent" block class="cta" @click="finish">See my day</UiButton>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
.ob { min-height: 100%; display: flex; flex-direction: column; padding: var(--space-2) var(--space-5) calc(var(--space-7) + env(safe-area-inset-bottom)); }
.bar { display: flex; align-items: center; justify-content: space-between; }
.icon-btn { width: var(--size-tap); height: var(--size-tap); display: grid; place-items: center; }
.dots { display: flex; gap: var(--space-2); }
.dots i { width: 28px; height: 4px; border-radius: var(--radius-full); background: var(--color-border); }
.dots i.on { background: var(--color-text-heading); }

.body { display: flex; flex-direction: column; flex: 1; }
.cta { margin-top: auto; }

/* Welcome: just the logo, centered, with the button at the bottom. */
.splash { flex: 1; display: grid; place-items: center; }
.logo { width: 220px; max-width: 70%; mix-blend-mode: multiply; }

.title-s { margin-top: var(--space-3); }
.lead { margin-top: var(--space-2); }
.coaches { margin-top: var(--space-5); }
.switch { margin: var(--space-4) 0 var(--space-3); }

.meet { align-items: center; text-align: center; padding-top: var(--space-10); }
.label { margin-top: var(--space-7); }
.intro { margin: var(--space-4) 0 var(--space-8); color: var(--color-text-heading); }
</style>
