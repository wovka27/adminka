<script setup lang="ts">
import { computed } from 'vue'

import api from '@/services/REST/utils/dom_admin'

import getRouteFromAsideMenuByPath from '@/helpers/getDocsLinkFromAsideMenuByPath'

interface IChangedListItemBtnProps {
  modelValue: boolean
  uid: string
}

const props = defineProps<IChangedListItemBtnProps>()
const emits = defineEmits(['update:modelValue'])
const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits('update:modelValue', value)
  }
})

const changeActive = (path: string) => async () => {
  const url = `admin/${getRouteFromAsideMenuByPath(path, 'route')}/${props.uid}/toggle-show`
  const response = await api.put<{ show: boolean }>(url, { show: !model.value })

  return !(!response || response.show === model.value)
}
</script>

<template>
  <el-switch :before-change="changeActive($route.path)" v-model="model" />
</template>
