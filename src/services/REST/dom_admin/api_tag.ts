import api from '@/services/REST/utils/dom_admin'

export const fetchGetApiTagList = async () => {
  return await api.get<IApiTagListItem[]>('admin/tags')
}

export const fetchGetApiTag = async (uid: string) => {
  return await api.get<IApiTag>(`admin/tags/${uid}`)
}

export const fetchUpdateApiTag = async (uid: string, request_data: any) => {
  return await api.put<IApiTag>(`admin/tags/${uid}`, request_data)
}

export interface IApiTagListItem {
  uid: string
  name: string
  is_multiple: boolean
}

export interface IApiTag {
  name: string
  sort: number
  title: string
  created_at: string
  updated_at: string
  deleted_at: string
  show_chess: boolean
  show_offers: boolean
  show_public: boolean
  show_present_mode: boolean
  is_multiple: boolean
}
