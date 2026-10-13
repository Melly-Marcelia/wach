<script setup>
import { Footprints, Waves, Moon, PersonStanding, Flower2, Activity } from 'lucide-vue-next'

const map = { run: Footprints, swim: Waves, rest: Moon, stretch: PersonStanding, yoga: Flower2 }
defineProps({ type: String, size: { type: Number, default: 20 } })
</script>

<template>
  <UiIconWell :tone="type === 'rest' ? 'rest' : 'info'"><component :is="map[type] || Activity" :size="size" /></UiIconWell>
</template>
