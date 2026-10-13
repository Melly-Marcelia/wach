<script setup>
import { ChevronLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
defineProps({ title: String, dark: Boolean, back: { type: [String, Boolean], default: true } })
const router = useRouter()
const goBack = (to) => (typeof to === 'string' ? router.push(to) : router.back())
</script>

<template>
  <header class="top" :class="{ dark }">
    <button v-if="back" class="back" aria-label="Back" @click="goBack(back)"><ChevronLeft :size="24" /></button>
    <span v-else class="back" />
    <h1 class="title">{{ title }}</h1>
    <div class="right"><slot /></div>
  </header>
</template>

<style scoped>
.top {
  position: sticky; top: 0; z-index: var(--z-header);
  display: grid; grid-template-columns: var(--size-tap) 1fr var(--size-tap); align-items: center;
  height: var(--size-topbar); padding: 0 var(--space-2);
  background: color-mix(in srgb, var(--color-bg) 92%, transparent); backdrop-filter: blur(12px);
}
.top.dark { background: var(--color-surface-inverse); color: var(--color-text-inverse); }
.back { width: var(--size-tap); height: var(--size-tap); display: grid; place-items: center; border-radius: 50%; }
.title { text-align: center; font: var(--type-title); letter-spacing: var(--type-title-tracking); }
.right { display: flex; justify-content: flex-end; }
</style>
