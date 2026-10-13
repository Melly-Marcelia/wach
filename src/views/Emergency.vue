<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { TriangleAlert, Phone, Send, MapPin, Activity, Footprints, Check } from 'lucide-vue-next'
import { guardians } from '../data/scenario'

// Escalation from the pitch: no interaction within 90 s → guardians are alerted.
const TOTAL = 90
const router = useRouter()
const left = ref(TOTAL)
const phase = ref('counting') // counting · sent · calling
let timer

onMounted(() => {
  timer = setInterval(() => {
    if (phase.value !== 'counting') return
    left.value--
    if (left.value <= 0) phase.value = 'sent'
  }, 1000)
})
onUnmounted(() => clearInterval(timer))

const ring = computed(() => (left.value / TOTAL) * 100)
const names = guardians.map((g) => g.name).join(' and ')

function okay() {
  router.push('/run')
}
</script>

<template>
  <div class="em" :class="phase">
    <template v-if="phase === 'counting'">
      <div class="head">
        <span class="type-label badge"><TriangleAlert :size="16" /> Are you okay?</span>
      </div>

      <div class="count" :style="{ '--p': ring }" role="timer" :aria-label="`${left} seconds until your guardians are alerted`">
        <div class="count-in">
          <span class="type-numeric-xl">{{ left }}</span>
          <span class="type-label text-inverse-muted">seconds</span>
        </div>
      </div>

      <p class="type-body center lead">Until we alert <strong>{{ names }}</strong> with your live location.</p>

      <div class="detected stack-3">
        <p class="type-overline text-inverse-muted">What your watch detected</p>
        <div class="row type-body-s"><Footprints :size="18" class="det-icon" /><span>No movement for <strong>5 min</strong></span></div>
        <div class="row type-body-s"><Activity :size="18" class="det-icon" /><span>Heart rate dropped <strong>148 → 44 bpm</strong></span></div>
        <div class="row type-body-s"><MapPin :size="18" class="det-icon" /><span>Last location: <strong>Parc de Woluwe</strong></span></div>
      </div>

      <div class="actions">
        <UiButton variant="light" size="l" block class="ok" @click="okay"><Check :size="20" /> I’m okay</UiButton>
        <div class="two">
          <UiButton variant="inverse" @click="phase = 'sent'"><Send :size="16" /> Alert now</UiButton>
          <UiButton variant="danger" @click="phase = 'calling'"><Phone :size="16" /> Call 112</UiButton>
        </div>
      </div>
    </template>

    <template v-else-if="phase === 'sent'">
      <div class="done">
        <span class="done-icon"><Send :size="28" /></span>
        <h1 class="type-display-m done-title">{{ names }} have been alerted.</h1>
        <p class="type-body center lead">They can see your live location and heart rate. Stay where you are if you can.</p>
        <ul class="people stack-2">
          <li v-for="g in guardians" :key="g.name" class="row person">
            <span class="type-label avatar">{{ g.initial }}</span>
            <span class="grow"><span class="type-headline">{{ g.name }}</span><br /><span class="type-caption text-inverse-muted">{{ g.relation }} · alert delivered</span></span>
            <Check :size="18" class="delivered" />
          </li>
        </ul>
        <div class="actions">
          <UiButton variant="danger" block @click="phase = 'calling'"><Phone :size="16" /> Call 112</UiButton>
          <UiButton variant="inverse" block @click="okay">I’m okay now. Tell them</UiButton>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="done">
        <span class="done-icon calling"><Phone :size="28" /></span>
        <h1 class="type-display-m done-title">Calling 112…</h1>
        <p class="type-body center lead">Your location and recent heart-rate data are ready to share with the operator. {{ names }} have been notified too.</p>
        <div class="actions"><UiButton variant="inverse" block @click="okay">End call</UiButton></div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.em {
  min-height: 100%; display: flex; flex-direction: column; color: var(--color-text-inverse);
  padding: max(60px, calc(env(safe-area-inset-top) + var(--space-4))) var(--space-5) calc(var(--space-8) + env(safe-area-inset-bottom));
  background: radial-gradient(120% 70% at 50% 0%, var(--color-danger-glow) 0%, var(--color-surface-inverse) 62%);
}
.em.sent, .em.calling { background: var(--color-surface-inverse); }
.head { display: flex; justify-content: center; }
.badge {
  display: inline-flex; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full); background: var(--color-warning); color: var(--color-on-accent); font-weight: 800;
}

.count {
  --p: 100; width: 210px; height: 210px; border-radius: 50%; margin: var(--space-7) auto 0; display: grid; place-items: center;
  background: conic-gradient(var(--color-warning) calc(var(--p) * 1%), var(--color-border-inverse) 0);
}
.count-in {
  width: 184px; height: 184px; border-radius: 50%; background: var(--color-surface-inverse-strong);
  display: grid; place-content: center; text-align: center;
}
.lead { margin-top: var(--space-5); color: var(--color-text-inverse-muted); }
.lead strong { color: var(--color-text-inverse); }

.detected { margin-top: var(--space-6); padding: var(--space-4); border-radius: var(--radius-l); background: var(--color-surface-inverse-raised); }
.det-icon { color: var(--color-warning); flex: none; }

.actions { margin-top: auto; padding-top: var(--space-6); display: grid; gap: var(--space-3); }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }

.done { display: flex; flex-direction: column; flex: 1; text-align: center; }
.done-icon {
  width: 72px; height: 72px; margin: var(--space-8) auto 0; border-radius: 50%;
  display: grid; place-items: center; background: var(--color-accent); color: var(--color-on-accent);
}
.done-icon.calling { background: var(--color-danger); color: var(--color-text-inverse); }
.done-title { margin-top: var(--space-6); }
.people { margin-top: var(--space-7); text-align: left; }
.person { padding: var(--space-3) var(--space-4); border-radius: var(--radius-l); background: var(--color-surface-inverse-raised); }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--color-surface-brand); display: grid; place-items: center; font-weight: 800; flex: none; }
.delivered { color: var(--color-accent); }
</style>
