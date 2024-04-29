<script setup lang="ts">
import { computed } from 'vue'

import { useFiltersStore } from '@/stores'

const filters_state = useFiltersStore()
const emit = defineEmits(['houseSelectedChange'])

const model = computed({
  get: () => filters_state.house_selected || filters_state.house_options[0],
  set: (house) => {
    filters_state.house_selected = filters_state.house_options.find((i) => i.name === house?.name)!
    emit('houseSelectedChange')
  }
})
</script>

<template>
  <div v-if="filters_state.house_options.length" class="FilterHouse">
    <PskTabSelect v-model="model" :options="filters_state.house_options" options_label="name" value_key="uid" />
  </div>
</template>
