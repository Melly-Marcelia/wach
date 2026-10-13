import { reactive, computed, watch } from 'vue'
import { coaches } from './data/coaches'
import { statusOptions } from './data/scenario'

const initial = () => ({
  onboarded: false,
  coachId: 'clara',
  swap: null, // null = undecided · 'accepted' · 'kept'
  status: null, // id from statusOptions
  cycleSync: true,
  guardianMode: true,
  sessionDone: false,
  metric: null, // id of the metric explainer currently open
  feedback: { effort: 4, feeling: null, symptoms: [], notes: '' },
})

export const state = reactive(initial())

// Remember onboarding and the chosen coach in this browser only (per-viewer convenience).
const KEY = 'wach-profile'
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
  // Coaches were renamed (nova → clara, sol → theo); map old saved ids, and fall back if unknown.
  const renamed = { nova: 'clara', sol: 'theo' }
  const coachId = renamed[saved?.coachId] || saved?.coachId
  if (saved?.onboarded) Object.assign(state, { onboarded: true, coachId: coaches[coachId] ? coachId : 'clara' })
} catch {}
watch(
  () => [state.onboarded, state.coachId],
  () => {
    try { localStorage.setItem(KEY, JSON.stringify({ onboarded: state.onboarded, coachId: state.coachId })) } catch {}
  },
)

export const coach = computed(() => coaches[state.coachId])
export const line = (key, ...args) => {
  const l = coach.value.lines[key]
  return typeof l === 'function' ? l(...args) : l
}
export const activeStatus = computed(() => statusOptions.find((s) => s.id === state.status) || null)
// Some statuses replace today's run entirely.
export const statusOverride = computed(() =>
  ({
    injured: { title: 'Easy swim 30 min', sub: 'No impact · keeps your fitness', type: 'swim' },
    sick: { title: 'Rest day', sub: 'Sleep and fluids. That is the training', type: 'rest' },
  })[state.status] || null,
)
export const todaySession = computed(() => (state.swap === 'kept' ? 'hmPace' : 'easy'))

export function reset() {
  Object.assign(state, initial())
}

// Start over from the onboarding (used by "Replay onboarding" under Me).
export function replayOnboarding() {
  reset()
  state.onboarded = false
}
