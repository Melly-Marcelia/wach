<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
import CoachSays from '../components/CoachSays.vue'
import { state, coach } from '../store'

const router = useRouter()
const step = ref(1)
const f = state.feedback

// Perceived exertion, 1–10, with words so the scale means something.
const effortWords = [
  'Barely moving', 'Very easy', 'Easy', 'Comfortable', 'Steady', 'Moderate',
  'Hard', 'Very hard', 'Really hard', 'Maximum',
]
const effortLabel = computed(() => effortWords[f.effort - 1])
const feelings = [
  { id: 'great', e: '😄', l: 'Great' },
  { id: 'good', e: '🙂', l: 'Good' },
  { id: 'meh', e: '😐', l: 'Meh' },
  { id: 'tired', e: '😮‍💨', l: 'Drained' },
  { id: 'bad', e: '😣', l: 'Rough' },
]
const symptoms = ['Nausea', 'Headache', 'Cramps', 'Side stitch', 'Dizzy', 'Sore legs', 'Bloating', 'Nothing']

function toggle(s) {
  if (s === 'Nothing') return (f.symptoms = ['Nothing'])
  f.symptoms = f.symptoms.filter((x) => x !== 'Nothing')
  f.symptoms = f.symptoms.includes(s) ? f.symptoms.filter((x) => x !== s) : [...f.symptoms, s]
}
function done() {
  state.sessionDone = true
  router.push('/analyzing')
}
</script>

<template>
  <div class="ci">
    <header class="bar">
      <button class="icon-btn" aria-label="Close" @click="router.push('/')"><X :size="22" /></button>
      <div class="steps" aria-hidden="true"><i :class="{ on: step >= 1 }" /><i :class="{ on: step >= 2 }" /></div>
      <span class="icon-btn" />
    </header>

    <div v-if="step === 1" class="body">
      <CoachSays dark size="l">Nice, run saved. Before I analyse it, how did it feel?</CoachSays>

      <section class="block">
        <div class="lbl"><span class="type-label text-inverse-muted">Effort</span><span class="type-label value">{{ f.effort }}/10 · {{ effortLabel }}</span></div>
        <input v-model.number="f.effort" type="range" min="1" max="10" class="range" aria-label="Perceived effort from 1 to 10" />
        <div class="ends type-caption"><span>Easy</span><span>Maximum</span></div>
      </section>

      <section class="block">
        <div class="lbl"><span class="type-label text-inverse-muted">Mood</span></div>
        <div class="feel">
          <button v-for="x in feelings" :key="x.id" :class="{ on: f.feeling === x.id }" :aria-pressed="f.feeling === x.id" @click="f.feeling = x.id">
            <span class="emoji" aria-hidden="true">{{ x.e }}</span><span class="type-caption">{{ x.l }}</span>
          </button>
        </div>
      </section>

      <UiButton variant="accent" block class="next" :disabled="!f.feeling" @click="step = 2">Next</UiButton>
    </div>

    <div v-else class="body">
      <CoachSays dark size="l">Anything your body is telling you?</CoachSays>

      <section class="block">
        <div class="lbl"><span class="type-label text-inverse-muted">Body signals</span></div>
        <div class="chips">
          <button
            v-for="s in symptoms" :key="s" class="type-label sym" :class="{ on: f.symptoms.includes(s) }"
            :aria-pressed="f.symptoms.includes(s)" @click="toggle(s)"
          >{{ s }}</button>
        </div>
      </section>

      <section class="block">
        <div class="lbl"><span class="type-label text-inverse-muted">Notes</span><span class="type-caption text-inverse-subtle">optional · private</span></div>
        <textarea v-model="f.notes" rows="4" placeholder="e.g. I felt nauseous after the first km…" class="notes" />
        <p class="type-caption text-inverse-subtle hint">{{ coach.name }} reads these together with your watch data, sleep and cycle.</p>
      </section>

      <div class="next two">
        <UiButton variant="inverse" @click="step = 1">Back</UiButton>
        <UiButton variant="accent" @click="done">Get my debrief</UiButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ci {
  min-height: 100%; background: var(--color-surface-inverse); color: var(--color-text-inverse); display: flex; flex-direction: column;
  padding: max(52px, calc(env(safe-area-inset-top) + var(--space-2))) var(--space-5) calc(var(--space-7) + env(safe-area-inset-bottom));
}
.bar { display: flex; align-items: center; justify-content: space-between; }
.icon-btn { width: var(--size-tap); height: var(--size-tap); display: grid; place-items: center; }
.steps { display: flex; gap: var(--space-2); }
.steps i { width: 28px; height: 4px; border-radius: var(--radius-full); background: var(--color-text-inverse-faint); }
.steps i.on { background: var(--color-accent); }
.body { display: flex; flex-direction: column; flex: 1; margin-top: var(--space-5); }
.block { margin-top: var(--space-7); }
.lbl { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-3); }
.value { color: var(--color-accent); }

.range {
  -webkit-appearance: none; appearance: none; width: 100%; height: 10px; border-radius: var(--radius-full); outline-offset: 6px;
  background: linear-gradient(90deg, var(--color-zone-1), var(--color-zone-2) 30%, var(--color-zone-3) 55%, var(--color-zone-4) 75%, var(--color-zone-5));
}
.range::-webkit-slider-thumb {
  -webkit-appearance: none; width: 30px; height: 30px; border-radius: 50%;
  background: var(--color-surface); border: 4px solid var(--color-surface-inverse); box-shadow: 0 0 0 2px var(--color-surface);
}
.range::-moz-range-thumb { width: 24px; height: 24px; border-radius: 50%; background: var(--color-surface); border: 4px solid var(--color-surface-inverse); }
.ends { display: flex; justify-content: space-between; color: var(--color-text-inverse-subtle); margin-top: var(--space-2); }

.feel { display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--space-2); }
.feel button {
  display: grid; justify-items: center; gap: var(--space-1); padding: var(--space-3) 0; border-radius: var(--radius-m);
  background: var(--color-surface-inverse-raised); box-shadow: inset 0 0 0 1.5px transparent; color: var(--color-text-inverse-muted);
}
.feel button.on { box-shadow: inset 0 0 0 1.5px var(--color-accent); background: var(--color-accent-subtle); color: var(--color-text-inverse); }
.emoji { font-size: var(--size-emoji-m); }

.chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.sym {
  height: var(--size-control-s); padding: 0 var(--space-4); border-radius: var(--radius-full);
  background: var(--color-surface-inverse-raised); box-shadow: inset 0 0 0 1.5px var(--color-border-inverse);
}
.sym.on { background: var(--color-accent); color: var(--color-on-accent); box-shadow: none; }
/* 16px+ so iOS Safari doesn't zoom in when the field is focused */
.notes {
  width: 100%; resize: none; padding: var(--space-4); border-radius: var(--radius-m); border: 0;
  background: var(--color-surface-inverse-raised); box-shadow: inset 0 0 0 1.5px var(--color-border-inverse);
  color: var(--color-text-inverse); font: var(--type-body); font-size: max(16px, 1em);
}
.notes::placeholder { color: var(--color-text-inverse-faint); }
.hint { margin-top: var(--space-2); }

.next { margin-top: auto; padding-top: var(--space-7); }
.two { display: grid; grid-template-columns: 1fr 2fr; gap: var(--space-3); }
</style>
