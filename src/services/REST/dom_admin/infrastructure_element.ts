import type { IMedia } from '@/services/REST/dom_admin/common_types'
import api from '@/services/REST/utils/dom_admin'

export const fetchGetInfrastructureElementList = async (meta: IMeta, f: Record<string, any>) => {
  return await api.get<IUseMeta<IInfrastructureElementListItem[]>>('admin/infrastructure/elements', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchDeleteInfrastructureElementListItem = async (uid: string) => {
  return await api.delete<IInfrastructureElementListItem>(`admin/infrastructure/elements/${uid}`)
}

export const fetchGetInfrastructureElementItem = async (uid: string) => {
  return await api.get<IInfrastructureElementItem>(`admin/infrastructure/elements/${uid}`)
}

export const fetchUpdateInfrastructureElementItem = async (uid: string, request_data: any) => {
  return await api.put<IInfrastructureElementItem>(`admin/infrastructure/elements/${uid}`, request_data)
}

export const fetchCreateInfrastructureElementItem = async (request_data: any) => {
  return await api.post<IInfrastructureElementItem>(`admin/infrastructure/elements`, request_data)
}

export interface IInfrastructureElementListItem {
  uid: string
  name: string
  show: boolean
  category: string
  complex_name: string
}

export interface IInfrastructureElementItem {
  uid: string
  name: string
  show: boolean
  weight: number
  media: IMedia
  inf_category_uid: string
  map_mark: [number, number]
  car_time: number
  public_transport_time: number
  walking_time: number
  cycling_time: number
  scooter_time: number
  taxi_cost: number
  active_at: string
  inactive_at: string
  created_at: string
  updated_at: string
  deleted_at: string
}

export interface ICategoryOption {
  uid: string
  name: string
  category_infrastructure: {
    name: string
    uid: string
  }[]
}
