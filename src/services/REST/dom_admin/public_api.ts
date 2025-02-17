import api from '@/services/REST/utils/dom_admin'

export const fetchGetPublicApiList = (meta: IMeta, f: Record<string, any>) => {
  return api.get<IUseMeta<IPublicApiListItem[]>>('admin/api-resource-settings', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchGetPublicApiItem = (uid: string) => {
  return api.get<IPublicApiItem>(`admin/api-resource-settings/${uid}`)
}

export const fetchPostCreatePublicApiItem = (request_data: IPublicApiItem) => {
  return api.post<IPublicApiItem>(`admin/api-resource-settings`, request_data)
}
export const fetchPutUpdatePublicApiItem = (uid: string, request_data: IPublicApiItem) => {
  return api.put<IPublicApiItem>(`admin/api-resource-settings/${uid}`, request_data)
}

export const fetchDeletePublicApiItem = (uid: string) => {
  return api.delete(`admin/api-resource-settings/${uid}`)
}

export interface IPublicApiListItem {
  uid: string
  name: string
  show: boolean
  weight: number
  type: string
  flat_types: {
    value: string
    label: string
    is_active: boolean
  }[]
}

export interface IPublicApiItem {
  name: string
  show: boolean
  weight: number
  type: string
  public_api_url: string
  settings: IPublicApiItemSettings
}

export interface IPublicApiItemSettings {
  statuses: string[]
  marginal_groups: string[]
  price: {
    type: string
    uid: string
  }[]
  articles: string[]
  flat_properties: string[]
  flat_types: string[]
  houses: string[]
  public_scopes: string[]
}
