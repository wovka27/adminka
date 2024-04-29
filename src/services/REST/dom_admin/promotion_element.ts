import type { IMedia } from '@/services/REST/dom_admin/common_types'
import api from '@/services/REST/utils/dom_admin'

export const fetchGetPromotionElementList = async (meta: IMeta, f: Record<string, any>) => {
  return await api.get<IUseMeta<IPromotionElementListItem[]>>('admin/promotion/elements', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchDeletePromotionElementListItem = async (uid: string) => {
  return await api.delete<IPromotionElementListItem>(`admin/promotion/elements/${uid}`)
}

export const fetchGetPromotionElementItem = async (uid: string) => {
  return await api.get<IPromotionElementItem>(`admin/promotion/elements/${uid}`)
}

export const fetchUpdatePromotionElementItem = async (uid: string, request_data: any) => {
  return await api.put<IPromotionElementItem>(`admin/promotion/elements/${uid}`, request_data)
}

export const fetchCreatePromotionElementItem = async (request_data: any) => {
  return await api.post<IPromotionElementItem>(`admin/promotion/elements`, request_data)
}

export interface IPromotionElementListItem {
  uid: string
  name: string
  show: boolean
  category: string
  complex_name: string
}

export interface IPromotionElementItem {
  uid: string
  name: string
  show: boolean
  weight: number
  slug: string
  media: IMedia
  prom_categories_id: string
  tags: string[]
  deadline: string
  availability_percent: string
  square: number
  mortgage_rate: number
  description: string
  payment: number
  mortgage_term: number
  mortgage_name: string
  old_mortgage_rate: number
  old_payment: number
  form: {
    button_label: string
    header_text: string
    content_text: string
    button_text: string
  }
  discount: number
  text_tooltip: string
  discount_text: string
  active_at: string
  inactive_at: string
  created_at: string
  updated_at: string
  deleted_at: string
}

export interface ICategoryOption {
  uid: string
  name: string
  category_promotions: {
    name: string
    uid: string
  }[]
}
