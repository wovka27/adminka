import api from '@/services/REST/utils/dom_admin'

import { message } from '@/utils/message'

export const fetchGetFeedList = async (meta: IMeta, f: Record<string, any>) => {
  return await api.get<IUseMeta<IFeedListItem[]>>('admin/aggregators/feeds', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchDeleteFeedListItem = async (uid: string) => {
  return await api.delete<IFeedListItem>(`admin/aggregators/feeds/${uid}`)
}

export const fetchGetFeed = async (uid: string) => {
  return await api.get<IFeed>(`admin/aggregators/feeds/${uid}`)
}

export const fetchGetForcedFlatsFeed = async (uid: string) => {
  return await api.get<IForcedFlats>(`admin/aggregators/feeds/${uid}/forced-flats`)
}

export const fetchGenerateFeed = async (uid: string) => {
  const response = await api.post<{ message: string }>(`admin/aggregators/feeds/${uid}/generate`)
  if (!response) return
  message('Фид поставлен в очередь для генерации.')
}

export const fetchUpdateFeed = async (uid: string, request_data: any) => {
  return await api.put<IFeed>(`admin/aggregators/feeds/${uid}`, request_data)
}

export const fetchCreateFeed = async (request_data: any) => {
  return await api.post<IFeed>(`admin/aggregators/feeds`, request_data)
}

export interface IFeedListItem {
  uid: string
  name: string
  show: boolean
}

export interface IFeed {
  uid: string
  name: string
  weight: number
  show: boolean
  type: string
  file_name: string
  houses: string[]
  file_url: string
  settings: {
    flat_types: string[]
    marginal_groups: string[]
    statuses: string[]
    price: {
      type: string
      uid: string
    }
    square_type: string
  }
  settings_type: 'PERSONAL' | 'GLOBAL'
  active_at: string
  inactive_at: string
  created_at: string
  updated_at: string
  deleted_at: string
}

export interface IForcedFlats {
  override_global_price_flats: {
    uid: string
    name: string
    uid_aggregator: string
    override_global_price: boolean
    force_load: boolean
    status: string
  }[]
  force_load_flats: {
    uid: string
    name: string
    uid_aggregator: string
    override_global_price: boolean
    force_load: boolean
    status: string
  }[]
}
