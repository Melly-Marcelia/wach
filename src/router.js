import { createRouter, createWebHashHistory } from 'vue-router'
import { state } from './store'

export const screens = [
  { path: '/welcome', name: 'welcome', label: 'Onboarding', component: () => import('./views/Onboarding.vue'), meta: { noTabs: true } },
  { path: '/', name: 'today', label: 'Today', component: () => import('./views/Today.vue') },
  { path: '/plan', name: 'plan', label: 'Adaptive plan', component: () => import('./views/Plan.vue') },
  { path: '/session', name: 'session', label: 'Session detail', component: () => import('./views/Session.vue'), meta: { noTabs: true } },
  { path: '/run', name: 'run', label: 'Live run', component: () => import('./views/LiveRun.vue'), meta: { immersive: true } },
  { path: '/emergency', name: 'emergency', label: 'Emergency', component: () => import('./views/Emergency.vue'), meta: { immersive: true } },
  { path: '/check-in', name: 'checkin', label: 'Post-run check-in', component: () => import('./views/CheckIn.vue'), meta: { immersive: true } },
  { path: '/analyzing', name: 'analyzing', label: 'Analysis', component: () => import('./views/Analyzing.vue'), meta: { immersive: true } },
  { path: '/debrief', name: 'debrief', label: 'AI debrief', component: () => import('./views/Debrief.vue'), meta: { noTabs: true } },
  { path: '/progress', name: 'progress', label: 'Progress', component: () => import('./views/Progress.vue'), meta: { noTabs: true } },
  { path: '/coach', name: 'coach', label: 'Choose your coach', component: () => import('./views/Coach.vue') },
  { path: '/status', name: 'status', label: 'My status', component: () => import('./views/Status.vue') },
  { path: '/me', name: 'me', label: 'Profile & safety', component: () => import('./views/Me.vue') },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: screens,
  scrollBehavior: () => ({ top: 0 }),
})

// First run: everyone starts with onboarding until they have chosen a coach.
router.beforeEach((to) => {
  if (!state.onboarded && to.name !== 'welcome') return { name: 'welcome' }
  if (state.onboarded && to.name === 'welcome') return { name: 'today' }
})
