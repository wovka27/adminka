import { type Ref, onBeforeMount, ref } from 'vue'
import { type Router } from 'vue-router'

import { useFiltersStore } from '@/stores'

import RestApi from '@/services/REST/utils/RestApi'

import getMetaFromUrlQuery from '@/helpers/getMetaFromUrlQuery'

type IResponseDataList<T> = IUseMeta<T[]> | T[] | null

interface IListOptions<T> {
  /**
   *
   * Прокидывать весь instance useRouter
   *
   */
  router: Router
  meta: boolean
  sort: boolean
  /**
   *
   * Получение списка данных
   * @param meta
   * @param params
   *
   */
  fetchGetList: (meta: IMeta, params: Record<string, any>) => Promise<IResponseDataList<T>>
  /**
   *
   * Получение нужного вида ответа для списка данных
   * @param response
   *
   */
  getRightKindOfResponseForDataList: (response: any) => any
  /**
   *
   * Действие по фильтрам
   *
   */
  filter?: Partial<{
    /**
     *
     * Фильтр по комплексам
     *
     */
    complex: boolean
    /**
     *
     * Фильтр по домам
     *
     */
    house: boolean
    /**
     *
     * Дополнительная логика для фильтров
     * @param query
     * @param params
     *
     */
    filterFn: (query: Record<string, string | number>, params: Record<string, any>) => void
  }>
  /**
   *
   * Дополнительная логика при изменении фильтров
   * @param args
   *
   */
  handleChangeFilterCallback?: (...args: any) => void
  /**
   *
   * Дополнительная логика для монтирования страницы
   *
   */
  onBeforeMountCallback?: () => Promise<void>
}

export default <T>(options: IListOptions<T>) => {
  const filters_store = useFiltersStore()

  const data_list: Ref<NonNullable<Awaited<ReturnType<typeof options.fetchGetList>>>> = ref([])
  const sort: Ref<ISort | undefined> = ref()
  const meta: Ref<IMeta> = ref({ page_current: 1, page_per: 5, page_last: 1 })

  const setList = async (): Promise<void> => {
    const request_params: Record<string, any> = {}

    const query: Record<string, any> = {
      page_current: meta.value.page_current,
      page_per: meta.value.page_per
    }

    if (options.sort && sort.value) {
      request_params.sort = sort.value
      query.sort = sort.value
    }

    if (options.filter?.complex) {
      if (filters_store.complex_selected?.uid) {
        request_params.complex = filters_store.complex_selected.uid
        query.complex = filters_store.complex_selected.uid
      }

      if (options.filter?.house && filters_store.complex_selected?.uid && filters_store.house_selected?.uid) {
        request_params.house = filters_store.house_selected.uid
        query.house = filters_store.house_selected.uid
      }
    }

    options.filter?.filterFn?.(query, request_params)

    await options.router.replace({
      query: Object.fromEntries(new URLSearchParams(RestApi.queryStringify(query)))
    })

    const response_data_list = await options.fetchGetList(meta.value, request_params)

    if (!response_data_list) return

    data_list.value = options.getRightKindOfResponseForDataList(response_data_list)

    if (options.meta) {
      meta.value.page_last = (<IUseMeta<T[]>>response_data_list).meta.last_page
    }
  }

  const handleChangeFilter = async (...args: any) => {
    options.handleChangeFilterCallback?.(...args)
    meta.value.page_current = 1
    await setList()
  }

  const findQueryPredicate = (key: string) => (i: any) => i.uid === options.router.currentRoute.value.query?.[key]

  onBeforeMount(async () => {
    if (options.filter?.complex) {
      filters_store.complex_selected =
        filters_store.complex_options.find(findQueryPredicate('complex')) ?? filters_store.complex_selected
    }

    if (options.filter?.house) {
      filters_store.house_selected =
        filters_store.house_options.find(findQueryPredicate('house')) ?? filters_store.house_selected
    }

    if (options.meta) {
      meta.value = getMetaFromUrlQuery()
    }
    if (options.sort) {
      sort.value = RestApi.parseQueryString(RestApi.queryStringify(options.router.currentRoute.value.query))?.sort
    }

    await options.onBeforeMountCallback?.()

    await setList()
  })

  return {
    data_list,
    sort,
    meta,
    setList,
    handleChangeFilter
  }
}
