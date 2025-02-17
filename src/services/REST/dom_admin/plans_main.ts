import type { IImage } from '@/services/REST/dom_admin/common_types'
import type { RestApiOverrideOptionsType } from '@/services/REST/utils/RestApi'
import api from '@/services/REST/utils/dom_admin'

export const fetchGetPlansMainList = async (
  meta: IMeta,
  f: Record<string, any>,
  options?: RestApiOverrideOptionsType
) => {
  return await api.get<IUseMeta<IPlansMainListItem[]>>(
    'admin/objects/plans',
    {
      page: meta.page_current,
      per_page: meta.page_per,
      f
    },
    options
  )
}

export const fetchGetPlanMain = async (uid: string) => {
  return await api.get<IPlanMain>(`admin/objects/plans/${uid}`)
}

export const fetchUpdatePlanMain = async (uid: string, request_data: any) => {
  return await api.put<IPlanMain>(`admin/objects/plans/${uid}`, request_data)
}

export interface IPlansMainListItem {
  uid: string
  name: string
  article: string
  show: boolean
  square: string | number | null
  rooms: string | number | null
}

export interface IPlanMain {
  uid: string
  name: string
  article: string
  show: boolean
  weight: number
  active_at: null
  inactive_at: null
  created_at: '2023-12-29 11:13:29'
  updated_at: '2024-01-15 14:36:59'
  deleted_at: null
  custom_squares: {
    loggia_square: string
    marketing_square: string
  }
  description: string | null
  insolation: null
  marketing_article: string
  rooms: number | string | null
  tags: string[]
  square: number | string | null
  rating: null
  rent_rating: null
  window_to: null
  video_review: string | null
  sanitary_nodes_count: number | null
  title_for_site: string | null
  loggia_square: number | string | null
  properties: Record<string, boolean> | null
  analogs: IPlanMainAnalog[]
  images: IImage[]
}

export interface IPlanMainAnalog {
  type: string
  value: string
  title: string
  disabled: boolean
  required: boolean
  code: string
  name: string
}
