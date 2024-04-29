import api from '@/services/REST/utils/dom_admin'
import type { IMedia } from '@/services/REST/dom_admin/common_types'

export const fetchGetDynamicsList = async (meta: IMeta, f: Record<string, any>) => {
  return await api.get<IUseMeta<IDynamicsListItem[]>>('admin/dynamics', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchGetDynamics = async (uid: string) => {
  return await api.get<IDynamics>(`admin/dynamics/${uid}`)
}

export const fetchDeleteDynamics = async (uid: string) => {
  return await api.delete<IDynamics>(`admin/dynamics/${uid}`)
}

export const fetchUpdateDynamics = async (uid: string, request_data: any) => {
  return await api.put<IDynamics>(`admin/dynamics/${uid}`, request_data)
}
export const fetchCreateDynamics = async (request_data: any) => {
  return await api.post<IDynamics>(`admin/dynamics`, request_data)
}

export interface IDynamicsListItem {
  uid: string
  name: string
  show: boolean
  complex_name: string
  link_video: string
}

export interface IDynamics {
  show: boolean
  uid: string
  name: string
  weight: number
  date: string
  complex_id: string
  link_video: string
  media: IMedia[]
  publication_date: string
  active_at: string
  inactive_at: string
  created_at: string
  updated_at: string
  deleted_at: string
}
