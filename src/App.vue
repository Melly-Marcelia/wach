<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Signal, Wifi, BatteryFull } from 'lucide-vue-next'
import TabBar from './components/TabBar.vue'
import MetricSheet from './components/MetricSheet.vue'
import { state } from './store'

const route = useRoute()
const scroller = ref(null)
const immersive = computed(() => route.meta.immersive)
const showTabs = computed(() => !immersive.value && !route.meta.noTabs)

// iPhone Duo posture for the desktop frame. Remembered in this browser only.
const POSTURE_KEY = 'wach-posture'
const posture = ref('folded')
try { if (localStorage.getItem(POSTURE_KEY) === 'unfolded') posture.value = 'unfolded' } catch {}
watch(posture, (p) => { try { localStorage.setItem(POSTURE_KEY, p) } catch {} })

// Each screen opens at the top of the app's own scroll area.
watch(() => route.fullPath, () => {
  state.metric = null
  if (scroller.value) scroller.value.scrollTop = 0
})
</script>

<template>
  <div class="stage">
    <div class="posture" role="group" aria-label="iPhone Duo posture">
      <button :aria-pressed="posture === 'folded'" @click="posture = 'folded'">Folded</button>
      <button :aria-pressed="posture === 'unfolded'" @click="posture = 'unfolded'">Unfolded</button>
    </div>
    <div class="phone" :class="[{ immersive, tabs: showTabs }, posture]">
      <div class="statusbar" aria-hidden="true">
        <span>9:41</span>
        <span class="sb-icons"><Signal :size="15" /><Wifi :size="15" /><BatteryFull :size="18" /></span>
      </div>
      <div ref="scroller" class="viewport">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in"><component :is="Component" /></Transition>
        </RouterView>
      </div>
      <TabBar v-if="showTabs" />
      <MetricSheet />
      <div class="home-indicator" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
/* Mobile first: on a phone the app is the whole page. */
.stage { height: 100dvh; background: var(--color-bg); }
/* Both are size containers, so wide layouts (iPhone Duo unfolded, in the frame or on
   the real device) are chosen by the space the app actually has, not by a flag. */
.phone { position: relative; width: 100%; height: 100%; overflow: hidden; background: var(--color-bg); container: phone / inline-size; }
.viewport {
  position: absolute; inset: 0; overflow-y: auto; overflow-x: hidden;
  padding-top: env(safe-area-inset-top); scrollbar-width: none; container-type: inline-size;
}
.phone.immersive { background: var(--color-surface-inverse); }
.viewport::-webkit-scrollbar { display: none; }
.phone.immersive .viewport { padding-top: 0; }
.statusbar, .home-indicator, .posture { display: none; }

/* Wide (unfolded): the navbar becomes a side rail, so content moves right of it.
   Screens without a wide design stay in a centered reading column; screens marked
   .wide (Today, Plan) lay themselves out in two columns. 700px = container query
   breakpoint, kept in sync with TabBar, MetricSheet, Today and Plan. */
@container phone (min-width: 700px) {
  .phone.tabs .viewport { padding-left: calc(var(--size-rail) + var(--space-gutter)); }
  .viewport > :not(.wide) { max-width: var(--size-column-max); margin-inline: auto; }
}

/* Desktop: center the app in a phone-sized frame instead of stretching it.
   Touch devices (a real phone, unfolded or not) always run full screen. */
@media (min-width: 600px) and (hover: hover) and (pointer: fine) {
  .stage {
    min-height: 100vh; height: auto; display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: var(--space-6); padding: var(--space-6); background: var(--color-bg-stage);
  }
  .posture {
    display: flex; gap: 2px; padding: 3px; border-radius: var(--radius-full); background: var(--color-surface);
    box-shadow: var(--shadow-float);
  }
  .posture button {
    padding: var(--space-2) var(--space-4); border-radius: var(--radius-full);
    font: var(--type-label); letter-spacing: var(--type-label-tracking); color: var(--color-text-muted);
  }
  .posture button[aria-pressed='true'] { background: var(--color-surface-inverse); color: var(--color-text-inverse); }
  .phone {
    flex: none; width: min(var(--size-device-w), calc(100vw - 48px)); height: min(var(--size-device-h), calc(100vh - 120px)); min-height: 560px;
    border-radius: var(--radius-device); box-shadow: var(--shadow-device);
    transition: width var(--duration-slow) ease, height var(--duration-slow) ease;
  }
  .phone.unfolded { width: min(var(--size-device-unfolded-w), calc(100vw - 48px)); height: min(var(--size-device-unfolded-h), calc(100vh - 120px)); }
  .viewport { padding-top: 50px; }
  .statusbar {
    display: flex; position: absolute; top: 0; left: 0; right: 0; z-index: var(--z-statusbar);
    height: 50px; padding: var(--space-4) 30px 0 34px; justify-content: space-between;
    font: var(--type-title); pointer-events: none;
    background: linear-gradient(var(--color-bg) 70%, transparent);
  }
  .phone.immersive .statusbar { background: none; color: var(--color-text-inverse); }
  .sb-icons { display: flex; gap: 5px; align-items: center; }
  .home-indicator {
    display: block; position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%); z-index: var(--z-home-indicator);
    width: 134px; height: 5px; border-radius: var(--radius-full); background: var(--color-home-indicator); pointer-events: none;
  }
  .phone.immersive .home-indicator { background: var(--color-text-inverse-subtle); }
}
</style>
