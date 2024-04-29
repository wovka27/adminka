import api from '@/services/REST/utils/dom_admin'

export const fetchGetLegalEntityList = async (meta: IMeta, f?: any) => {
  return await api.get<IUseMeta<ILegalEntityListItem[]>>('admin/developers/legal-entities', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchGetLegalEntity = async (uid: string) => {
  return await api.get<ILegalEntity>(`admin/developers/legal-entities/${uid}`)
}

export const fetchUpdateLegalEntity = async (uid: string, request_data: any) => {
  return await api.put<ILegalEntity>(`admin/developers/legal-entities/${uid}`, request_data)
}

export const fetchCreateLegalEntity = async (request_data: any) => {
  return await api.post<ILegalEntity>(`admin/developers/legal-entities`, request_data)
}

export interface ILegalEntityListItem {
  uid: string
  name: string
  show: boolean
  abbreviated_name: string
  inn: string
  kpp: string
  company_group: string
}

export interface ILegalEntity {
  uid: string
  show: boolean
  name: string
  weight: string
  full_name: string
  leader_second_name: string
  leader_last_name: string
  ogrn: string
  phone_number: string
  website_url: string
  leader_first_name: string
  email: string
  legal_address: string
  actual_address: string
  company_group_uid: string
  abbreviated_name: string
  inn: string
  kpp: string
  active_at: string
  inactive_at: string
  created_at: string
  updated_at: string
  deleted_at: string
}
