<script setup lang="ts">
import api from '@/services/REST/utils/dom_admin'

import getRoute from '@/helpers/getDocsLinkFromAsideMenuByPath'

interface IChangedListItemBtnProps {
  uid: string
}

const props = defineProps<IChangedListItemBtnProps>()
const model = defineModel()

const changeActive = (path: string) => async () => {
  const url = `admin/${getRoute(path, 'route')}/${props.uid}/toggle-show`
  const response = await api.put<{ show: boolean }>(url, { show: !model.value })

  return !(!response || response.show === model.value)
}
</script>

<template>
  <el-switch :before-change="changeActive($route.path)" v-model="model" />
</template>
