<script setup lang="ts">
import { computed } from 'vue'

import { useFiltersStore } from '@/stores'

const filters_state = useFiltersStore()
const emit = defineEmits(['complexSelectedChange'])

const tabs = computed(() => filters_state.complex_options.map((i) => ({ label: i.name })))

const model = computed({
  get: () => tabs.value.find((i) => i.label === filters_state.complex_selected?.name) || tabs.value[0],
  set: (tab) => {
    filters_state.complex_selected = filters_state.complex_options.find((i) => i.name === tab.label)!
    filters_state.house_selected = filters_state.complex_selected.houses[0]
    emit('complexSelectedChange')
  }
})
</script>

<template>
  <div class="FilterComplex">
    <PskTabs v-model="model" :tabs="tabs" />
  </div>
</template>
