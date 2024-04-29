import { useRouter } from 'vue-router'

import { useAppStateStore } from '@/stores'

import initRestApiConfig from '@/utils/initRestApiConfig'

export default async (): Promise<boolean> => {
  const router = useRouter()
  const app_state_store = useAppStateStore()

  return initRestApiConfig(app_state_store, router)
}
