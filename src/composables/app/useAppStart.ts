import { onBeforeMount } from 'vue'

import { useAppStateStore } from '@/stores'

import useAuth from '@/composables/app/useAuth'

import initStartData from '@/utils/initStartData'

export default () => {
  const app_state_store = useAppStateStore()

  onBeforeMount(async () => {
    try {
      const is_auth = await useAuth()
      is_auth && (await initStartData())
      await app_state_store.setIsReady(true)
    } catch (error) {
      app_state_store.error_list.push({ title: 'App Start error' })
    }
  })
}
