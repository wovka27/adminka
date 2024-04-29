/**
 @description строка "create" откроект редактор в режиме создания,
    строка с uid сущности откроет редактор в режиме редактирования этой сущности,
    пустая строка - уничтожит редактор

 */
declare type ModeEditorType = string

declare global {
  interface Object {
    groupBy<T>(list: T[], keyGetter: (item: T) => any): { [key: string]: T[] }
  }
}

declare interface IMeta {
  page_per: number
  page_current: number
  page_last: number
}

declare interface IStringOption {
  name: string
  value: string
}

declare interface ISort {
  [key: string]: OrderType
}

declare type OrderType = 'asc' | 'desc'

declare interface IUseMeta<T> {
  payload: T
  meta: IResponseMeta
}

declare interface IResponseMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}
