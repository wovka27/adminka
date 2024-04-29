import type { IMedia } from '@/services/REST/dom_admin/common_types'
import api from '@/services/REST/utils/dom_admin'

export const fetchGetInfrastructureCategoryList = async (meta: IMeta, f: Record<string, any>) => {
  return await api.get<IUseMeta<IInfrastructureCategoryListItem[]>>('admin/infrastructure/categories', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchDeleteInfrastructureCategoryListItem = async (uid: string) => {
  return await api.delete<IInfrastructureCategoryListItem>(`admin/infrastructure/categories/${uid}`)
}

export const fetchGetInfrastructureCategoryItem = async (uid: string) => {
  return await api.get<IInfrastructureCategoryItem>(`admin/infrastructure/categories/${uid}`)
}

export const fetchUpdateInfrastructureCategoryItem = async (uid: string, request_data: any) => {
  return await api.put<IInfrastructureCategoryItem>(`admin/infrastructure/categories/${uid}`, request_data)
}

export const fetchCreateInfrastructureCategoryItem = async (request_data: any) => {
  return await api.post<IInfrastructureCategoryItem>(`admin/infrastructure/categories`, request_data)
}

export interface IInfrastructureCategoryListItem {
  uid: string
  name: string
  show: boolean
  media: IMedia[]
  complex_name: string
}

export interface IInfrastructureCategoryItem {
  uid: string
  name: string
  show: boolean
  weight: number
  active_at: string
  inactive_at: string
  created_at: string
  updated_at: string
  deleted_at: string
  complex_uid: string
  media: IMedia[]
}
