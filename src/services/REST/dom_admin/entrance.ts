import type { IMedia } from '@/services/REST/dom_admin/common_types'
import api from '@/services/REST/utils/dom_admin'

export const fetchGetEntranceList = async (meta: IMeta, f?: any) => {
  return await api.get<IUseMeta<IEntranceListItem[]>>('admin/objects/entrances', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchGetEntrance = async (uid: string) => {
  return await api.get<IEntrance>(`admin/objects/entrances/${uid}`)
}

export const fetchUpdateEntrance = async (uid: string, request_data: any) => {
  return await api.put<IEntrance>(`admin/objects/entrances/${uid}`, request_data)
}
export interface IEntranceListItem {
  uid: string
  floors: number
  name: string
  show: boolean
  flat_count: number
  construction_material: string
  complex_name: string
  house_name: string
}

export interface IEntrance {
  uid: string
  name: string
  show: boolean
  weight: number
  active_at: string
  inactive_at: string
  created_at: string
  updated_at: string
  deleted_at: string
  plan_url: string
  floors: number
  flat_count: number
  media: IMedia[]
  section: string
  entrance: string
  construction_material: string
}
