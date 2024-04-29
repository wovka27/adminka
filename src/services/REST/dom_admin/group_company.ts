import type { IMedia } from '@/services/REST/dom_admin/common_types'
import api from '@/services/REST/utils/dom_admin'

export const fetchGetGroupCompanyList = async (meta: IMeta, f?: any) => {
  return await api.get<IUseMeta<IGroupCompanyListItem[]>>('admin/developers/company-groups', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchGetGroupCompany = async (uid: string) => {
  return await api.get<IGroupCompany>(`admin/developers/company-groups/${uid}`)
}

export const fetchUpdateGroupCompany = async (uid: string, request_data: any) => {
  return await api.put<IGroupCompany>(`admin/developers/company-groups/${uid}`, request_data)
}

export const fetchCreateGroupCompany = async (request_data: any) => {
  return await api.post<IGroupCompany>(`admin/developers/company-groups`, request_data)
}
export interface IGroupCompanyListItem {
  uid: string
  name: string
  show: boolean
  website_url: string
}

export interface IGroupCompany {
  uid: string
  name: string
  show: boolean
  website_url: string
  weight: number
  regions_activity: string[]
  phone_number: string
  foundation_year: string
  media: IMedia[]
  active_at: string
  inactive_at: string
  created_at: string
  updated_at: string
  deleted_at: string
}
