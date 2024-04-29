import { onMounted, ref } from 'vue'
import type { RouteParams, Router } from 'vue-router'

import { useAppStateStore } from '@/stores'

import useAppHeader, { type IHeaderParams } from '@/composables/app/useAppHeader'
import useDefaultFields from '@/composables/app/useDefaultFields'

import { message } from '@/utils/message'

import getHandleBackArgs from '@/helpers/getHandleBackArgs'
import getRequestDataFromDeletedMedia from '@/helpers/getRequestDataFromDeletedMedia'

interface IEditorViewProps {
  /**
   *
   * Прокидывать весь instance useRouter
   *
   */
  router: Router
  /**
   *
   * Название route.name для перехода на листинг сущности
   *
   */
  back_route_name: string
  /**
   *
   * Опционально. Данные для полей по умолчанию на детальной странице сущности:
   * "Активен, начало активности, конец активности, сортировка, дата создания, дата обновления"
   * default_fields Прокидывается в v-model компонента DefaultFormFields
   *
   */
  default_fields?: boolean
  /**
   *
   * Запрос на получение сущности. Прокидывать без вызова готовую функцию / объявить явно
   * @param uid
   *
   */
  fetchGetEntity: (uid: string) => Promise<any>
  /**
   *
   * Получение UID по нужному params в роуте
   *
   * @param route_params
   */
  fetchGetEntityUid?: (route_params: RouteParams) => string
  /**
   *
   * Запись данных в элементы формы из form_data, полученной с backend. Объявить явно
   * @param form_data
   *
   */
  setFormData: (form_data: any) => void
  /**
   *
   * Формирование тела для отправки запроса и для обновления данных в элементах формы. Объявить явно
   *
   */
  getRequestData: () => Record<string, any>
  /**
   *
   * Действия в функции Apply
   *
   */
  apply: {
    /**
     *
     * Опционально. Дополнительная функция формирования тела в момент отправки запроса
     *
     */
    request_data?: () => Record<string, any>
    /**
     *
     * Действия в момент обновления сущности
     *
     */
    update: {
      /**
       *
       * Обновление сущности. Прокидывать без вызова / объявить явно
       * @param uid
       * @param request_data
       *
       */
      fetchUpdateEntity: (uid: string, request_data: any) => Promise<any>
      /**
       *
       * Опционально. Текст сообщения при успешном обновлении (по умолчанию "Успешно изменено")
       *
       */
      success_message?: string
      /**
       *
       * Опционально. Для выполнения дополнительной логики до обновления сущности
       *
       */
      beforeResponseFn?: () => Promise<void>
      /**
       *
       * Опционально. Для выполнения дополнительной логики после обновления сущности
       * @param response
       *
       */
      afterResponseFn?: (response: any, request_data_before?: any) => Promise<void>
    }
    /**
     *
     * Опционально. Действия в момент создания сущности
     *
     */
    create?: {
      /**
       *
       * Создание сущности. Прокидывать без вызова / объявить явно
       * @param request_data
       *
       */
      fetchCreateEntity: (request_data: any) => Promise<any>
      /**
       *
       * Текст сообщения при успешном создании
       *
       */
      success_message: string
      /**
       *
       * Опционально. Для выполнения дополнительной логики до создания сущности
       *
       */
      beforeResponseFn?: () => Promise<{
        ok: boolean
        reject_text?: string
      }>
      /**
       *
       * Опционально. Для выполнения дополнительной логики после создания сущности
       * @param response
       *
       */
      afterResponseFn?: (response: any) => Promise<void>
    }
  }
  /**
   *
   * Действия при монтировании страницы
   *
   */
  mount?: {
    /**
     *
     * Опционально. Действия при монтировании страницы создания сущности
     *
     */
    create?: {
      /**
       *
       * Формирование шапки при монтировании страницы создания сущности
       *
       */
      app_header_props?: Omit<IHeaderParams, 'handleBack' | 'docs_link'>
      /**
       *
       * Опционально. Для выполнения дополнительной логики при монтировании страницы создания сущности
       *
       */
      fn?: () => Promise<void>
    }
    /**
     *
     * Общие действия при монтировании страницы
     *
     */
    common: {
      /**
       *
       * Опционально. Массив дополнительных запросов
       *
       */
      fetch_list?: Array<Promise<any>>
      /**
       *
       * Формирование шапки при монтировании страницы
       *
       */
      app_header_props?: (response: any[]) => Omit<IHeaderParams, 'handleBack' | 'docs_link'>
      /**
       *
       * Опционально. Для выполнения дополнительной логики при монтировании страницы после получения данных
       * @param response_list
       *
       */
      fn?: (response_list: Array<any>) => Promise<void> // Для выполнения дополнительной логики
    }
  }
}

export default (options: IEditorViewProps) => {
  const app_state_store = useAppStateStore()
  const { default_fields, getRequestDefaultFields, getDefaultFieldsData } = useDefaultFields()

  const is_data_loaded = ref(false)

  let request_data_before = ''

  const route_params = options.router.currentRoute.value.params

  const entity_uid = options.fetchGetEntityUid?.(route_params) ?? (route_params.uid as string)

  const getPromises = () =>
    options.mount?.common.fetch_list?.length
      ? [options.fetchGetEntity(entity_uid), ...options.mount.common.fetch_list]
      : [options.fetchGetEntity(entity_uid)]
  const getRequestData = () => ({
    ...options.getRequestData(),
    ...(options.default_fields && getRequestDefaultFields())
  })
  const setFormData = (form_data: any) => {
    options.default_fields && getDefaultFieldsData(form_data)
    options.setFormData(form_data)
  }
  const pushCommonData = () => {
    setFormData(getRequestDataBefore())
  }
  const getRequestDataBefore = () => JSON.parse(request_data_before)
  const handleBack = () => void options.router.push(getHandleBackArgs(options.back_route_name))
  const setRequestDataBefore = () => (request_data_before = JSON.stringify(getRequestData()))
  const getIsStateBeforeEqualAfter = () => JSON.stringify(getRequestData()) === request_data_before

  const apply = async () => {
    const request_data = getRequestDataFromDeletedMedia({ ...getRequestData(), ...options.apply.request_data?.() })

    if (options.apply.create && route_params.uid === 'create') {
      if (options.apply.create.beforeResponseFn) {
        const result = await options.apply.create.beforeResponseFn()

        if (!result.ok) return result.reject_text && message(result.reject_text, 'error')
      }

      const response = await options.apply.create.fetchCreateEntity(request_data)

      if (!response) return

      await options.apply.create.afterResponseFn?.(response) // Для выполнения дополнительной логики в данном блоке

      app_state_store.getIsStateBeforeEqualAfter = null
      message(options.apply.create.success_message)
      handleBack()
      return
    }

    await options.apply.update.beforeResponseFn?.() // Для выполнения дополнительной логики в данном блоке

    const response = await options.apply.update.fetchUpdateEntity(entity_uid, request_data)

    if (!response) return

    await options.apply.update.afterResponseFn?.(response, getRequestDataBefore())

    setFormData(response)
    setRequestDataBefore()
    message(options.apply.update.success_message ?? 'Успешно изменено')
  }

  onMounted(async () => {
    if (options.mount?.create && route_params.uid === 'create') {
      // ----------------------------------- INIT HEADER (start) ---------------------------------
      options.mount.create.app_header_props && useAppHeader({ ...options.mount.create.app_header_props, handleBack })
      // ----------------------------------- INIT HEADER (end) -----------------------------------

      await options.mount.create.fn?.() // Для выполнения дополнительной логики в данном блоке

      setRequestDataBefore()
      is_data_loaded.value = true
      return
    }

    const response = await Promise.all(getPromises())

    if (!response.some(Boolean)) return handleBack()

    setFormData(response[0])

    options.mount?.common.fn?.(response) // Для выполнения дополнительной логики в данном блоке

    // ----------------------------------- INIT HEADER (start) ---------------------------------
    options.mount?.common.app_header_props &&
      useAppHeader({ ...options.mount.common.app_header_props(response), handleBack })
    // ----------------------------------- INIT HEADER (end) -----------------------------------

    app_state_store.getIsStateBeforeEqualAfter = getIsStateBeforeEqualAfter
    setRequestDataBefore()
    is_data_loaded.value = true
  })
  return {
    is_data_loaded,
    default_fields,
    getRequestData,
    setFormData,
    apply,
    pushCommonData,
    getIsStateBeforeEqualAfter
  }
}
