// @ts-nocheck
import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { IEstateGlobalSetting } from '@/services/REST/dom_admin/estate'

export const useGlobalSettingsStore = defineStore('global_settings', () => {
  const global_settings_list = ref<IEstateGlobalSetting[]>([])
  const transformed_global_settings_list = ref(Object.create(null))
  const getGlobalSettings = (list?: IEstateGlobalSetting[]) => {
    global_settings_list.value = list ?? []
  }

  const getTransformedGlobalSettingsData = (type: IEstateGlobalSetting['type']) => {
    const settings_filtered = global_settings_list.value.filter((i) => i.type === type)
    transformed_global_settings_list.value = Object.groupBy<IEstateGlobalSetting>(
      settings_filtered,
      (item: IEstateGlobalSetting) => item.settings_type
    )
  }

  const $reset = () => {
    global_settings_list.value = []
    transformed_global_settings_list.value = Object.create(null)
  }

  return {
    global_settings_list,
    getGlobalSettings,
    getTransformedGlobalSettingsData,
    transformed_global_settings_list,
    $reset
  }
})
