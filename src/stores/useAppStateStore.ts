import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'

import package_json from '../../package.json'

export const useAppStateStore = defineStore('app_state', () => {
  const app_version: string = package_json.version
  const is_ready: Ref<boolean> = ref(false) // приложение в состоянии - готово к использованию (используется компонентом AppStartScreen)
  const error_list: Ref<IAppError[]> = ref([]) // список ошибок приложения (используется компонентом AppErrorMessages)
  const getIsStateBeforeEqualAfter: Ref<null | (() => boolean)> = ref(null) // Используется для показа confirm диалога "данные не сохранены... покинуть страницу?"
  const is_app_start_screen_show: Ref<boolean> = ref(true)

  const is_loading = ref(0) // приложение в состоянии - загрузка (используется компонентом AppLoader)
  const setIsLoading = (flag: boolean): void => {
    is_loading.value = flag ? ++is_loading.value : --is_loading.value
  }
  const setIsReady = async (val?: boolean): Promise<void> => {
    is_ready.value = !!val
  }

  const $reset = () => {
    is_ready.value = true
    error_list.value = []
    getIsStateBeforeEqualAfter.value = null
    is_app_start_screen_show.value = false
  }

  return {
    app_version,
    is_ready,
    error_list,
    getIsStateBeforeEqualAfter,
    is_app_start_screen_show,
    is_loading,

    setIsLoading,
    setIsReady,
    $reset
  }
})

export interface IAppError {
  title: string
  description?: string[]
}
