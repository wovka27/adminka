import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { type IFiltersComplexOption, fetchGetFiltersComplex } from '@/services/REST/dom_admin/filters'

export const useFiltersStore = defineStore('filters_state', () => {
  const complex_options = ref<IFiltersComplexOption[]>([])
  const complex_selected = ref<IFiltersComplexOption | null>(null)

  const house_options = computed<IFiltersComplexOption["houses"]>(() => complex_options.value.find(i => i.uid === complex_selected.value?.uid)?.houses || []) //prettier-ignore
  const house_selected = ref<IFiltersComplexOption['houses'][0] | null>(null)

  const setFiltersComplex = async (): Promise<boolean> => {
    const response_filters = await fetchGetFiltersComplex()

    if (!response_filters) return false

    complex_options.value = response_filters.map((i) => ({
      ...i,
      houses: i.houses.length ? [{ name: 'Все', uid: '' }, ...i.houses] : []
    }))

    return !!(complex_options.value.length && complex_options.value.unshift({ name: 'Все', uid: '', houses: [] }))
  }

  const $reset = () => {
    complex_options.value = []
    complex_selected.value = null
    house_selected.value = null
  }

  return {
    complex_options,
    complex_selected,
    house_options,
    house_selected,

    setFiltersComplex,
    $reset
  }
})
