import api from '@/services/REST/utils/dom_admin'

export const fetchGetCompilationList = async (meta: IMeta, f?: any) => {
  return await api.get<IUseMeta<ICompilationListItem[]>>('admin/compilations', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchGetCompilationItem = async (promotion_element_uid: string) => {
  return await api.get<ICompilationItem>(`admin/compilations/${promotion_element_uid}`)
}

export const fetchUpdateCompilation = async (compilation_uid: string, request_data: any) => {
  return await api.put(`admin/compilations/${compilation_uid}`, request_data)
}

export const fetchCreateCompilation = async (request_data: any) => {
  return await api.post(`admin/compilations`, request_data)
}

export const fetchDeleteCompilation = async (uid: string) => {
  return await api.delete<any>(`admin/compilations/${uid}`)
}

export interface ICompilationListItem {
  uid: string
  name: string
  show: true
  weight: number
}

export interface ICompilationItem {
  uid: string
  name: string
  show: boolean
  slug: string
  weight: number
  conditions: string[]
  complexes: IComplexItem[]
  active_at: null
  inactive_at: null
  created_at: '2024-01-15 11:04:48'
  updated_at: '2024-01-15 11:04:48'
  deleted_at: null
}

export interface IComplexItem {
  uid: string
  name: string
  show: boolean
  description: string
  class_type: string
  title: string
  weight: number
}
