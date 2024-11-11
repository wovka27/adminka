import api from '@/services/REST/utils/dom_admin'

export const fetchGetApiFlatPropsList = async (meta: IMeta, f?: any) => {
  return await api.get<IApiFlatPropsListItem[]>('admin/objects/flat-properties', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchGetApiFlatPropsItem = async (uid: string) => {
  return await api.get(`admin/objects/flat-properties/${uid}`)
}

export const fetchUpdateApiFlatPropsItem = async (uid: string, request_data: any) => {
  return await api.put(`admin/objects/flat-properties/${uid}`, request_data)
}

export const fetchCreateApiFlatPropsItem = async (request_data: any) => {
  return await api.post(`admin/objects/flat-properties`, request_data)
}

export const fetchDeleteApiFlatPropsItem = async (uid: string) => {
  return await api.delete(`admin/objects/flat-properties/${uid}`)
}

export interface IApiFlatPropsListItem {
  active: boolean
  sort: number
  uid: string
  title: string
}

export interface IApiFlatPropsItem {
  uid: string
  title: string
  public_title: string
  description: string
  code: string
  sort: number
  active: boolean
  filterable: boolean
  is_public: boolean
  is_promo: boolean
  view_mode: number
  images_data: null
  chess_view_data: {
    position: 'list' | 'top-right'
    sign: {
      type: 'color' | 'icon'
      value: string
    }
  }
  active_at: string
  inactive_at: string
  created_at: string
  updated_at: string
  deleted_at: string
}
