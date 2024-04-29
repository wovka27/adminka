import type { Router } from 'vue-router'

import { useAppStateStore } from '@/stores'

import RestApi from '@/services/REST/utils/RestApi'

export const BASE_URL = import.meta.env.VITE_API_BASE_URL
export default async (app_state_store: ReturnType<typeof useAppStateStore>, router: Router) => {
  const dom_admin_token = localStorage.getItem('dom_admin_token')

  if (!dom_admin_token) return !!(await router.replace('/login'))

  new RestApi('dom_admin', {
    url_api: BASE_URL,
    url_refresh: BASE_URL + 'auth/refresh',
    token: dom_admin_token,
    cbPreFetch: () => {
      app_state_store.setIsLoading(true)
    },
    cbPostFetch: () => {
      app_state_store.setIsLoading(false)
    },
    cbHandlerErrorResponse: async (error: any, controller) => {
      if (JSON.stringify(error) === '{}') {
        await app_state_store.setIsReady(false)
        app_state_store.is_app_start_screen_show = false
        app_state_store.error_list.push({ title: 'Что-то пошло не так...', description: [error] })
        controller?.abort()
        return
      }

      let error_title: string = ''
      let error_description: string[] = []

      for (const [key, val] of Object.entries(error)) {
        if (key === ('message' || 'error') && typeof val === 'string') {
          error_title = val
        }
        if (val && typeof val === 'object') {
          error_description = Object.entries(val).reduce((acc: string[], [_, val]) => {
            if (Array.isArray(val) && typeof val[0] === 'string') acc.push(val[0])

            return acc
          }, [])
        }
      }

      app_state_store.error_list.push({ title: error_title, description: error_description })
    },
    cbHandlerErrorRefreshToken: async () => {
      await router.replace('/login')
    }
  })

  return true
}
