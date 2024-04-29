import { type IAppHeaderBreadcrumbsItem, type IAppHeaderBtn, useAppHeaderStore } from '@/stores'

import getDocsLinkFromAsideMenuByPath from '@/helpers/getDocsLinkFromAsideMenuByPath'

export interface IHeaderParams {
  /**
   *
   * Заголовок шапки
   *
   */
  title?: string
  /**
   *
   * Ссылка на доку по разделу
   *
   */
  docs_link?: string
  /**
   *
   * Хлебные крошки
   *
   */
  breadcrumbs: IAppHeaderBreadcrumbsItem[]
  /**
   *
   * Кнопка назад
   *
   */
  handleBack?: Function | null
  /**
   *
   * Кнопка в шапке для определенной логики (в основном для редиректа на страницу создания сущности)
   *
   */
  btn?: IAppHeaderBtn | null
  /**
   *
   * Дополнительная логика по инициализации шапки
   *
   * @param app_header_state
   */
  optionalCallback?: (app_header_state: ReturnType<typeof useAppHeaderStore>) => void
}

export default (params: IHeaderParams) => {
  const app_header_state = useAppHeaderStore()

  app_header_state.title = params.title ?? ''
  app_header_state.docs_link = params.docs_link ? getDocsLinkFromAsideMenuByPath(params.docs_link, 'docs_link') : ''
  app_header_state.breadcrumbs = params.breadcrumbs
  app_header_state.handleBack = params.handleBack ?? null
  app_header_state.btn = params.btn ?? null

  params.optionalCallback?.(app_header_state)
}
