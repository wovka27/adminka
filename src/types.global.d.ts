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

declare type AggregatorItemType = 'avito' | 'cian' | 'dom_click' | 'yandex' | 'm2' | 'idalite' | 'etagi'
declare type EntityForAggregatorType = 'real_property' | 'house' | 'complex'
declare type ResponseAggregatorKey = `${AggregatorItemType}_${EntityForAggregatorType}`
declare type EntityName = 'apartment' | 'commercial' | 'complex' | 'flat' | 'house' | 'pantry' | 'parking'

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
