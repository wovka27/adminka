import api from '@/services/REST/utils/dom_admin'

export const fetchGetPromotionCategoryList = async (meta: IMeta, f: Record<string, any>) => {
  return await api.get<IUseMeta<IPromotionCategoryListItem[]>>('admin/promotion/categories', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchDeletePromotionCategoryListItem = async (uid: string) => {
  return await api.delete<IPromotionCategoryListItem>(`admin/promotion/categories/${uid}`)
}

export const fetchGetPromotionCategoryItem = async (uid: string) => {
  return await api.get<IPromotionCategoryItem>(`admin/promotion/categories/${uid}`)
}

export const fetchUpdatePromotionCategoryItem = async (uid: string, request_data: any) => {
  return await api.put<IPromotionCategoryItem>(`admin/promotion/categories/${uid}`, request_data)
}

export const fetchCreatePromotionCategoryItem = async (request_data: any) => {
  return await api.post<IPromotionCategoryItem>(`admin/promotion/categories`, request_data)
}

export interface IPromotionCategoryListItem {
  uid: string
  name: string
  show: boolean
  complex_name: string
}

export interface IPromotionCategoryItem {
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
  form: {
    button_label: string
    header_text: string
    content_text: string
    button_text: string
  }
  show_form: boolean
  description: string
  anchor_link: string
}
