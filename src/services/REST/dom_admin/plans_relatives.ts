import api from '@/services/REST/utils/dom_admin'

export const fetchGetPlanRelativeList = async (meta: IMeta, f: Record<string, any>) => {
  return await api.get<IUseMeta<IPlanRelativeListItem[]>>('admin/objects/plans/relatives', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchGetPlanRelative = async (uid: string) => {
  return await api.get<IPlansRelative>(`admin/objects/plans/relatives/${uid}`)
}

export const fetchDeletePlanRelative = async (uid: string) => {
  return await api.delete<IPlansRelative>(`admin/objects/plans/relatives/${uid}`)
}

export const fetchUpdatePlanRelative = async (uid: string, request_data: any) => {
  return await api.put<IPlansRelative>(`admin/objects/plans/relatives/${uid}`, request_data)
}
export const fetchCreatePlanRelative = async (request_data: any) => {
  return await api.post<IPlansRelative>(`admin/objects/plans/relatives`, request_data)
}
export interface IPlanRelativeListItem {
  uid: string
  name: string
}

export interface IPlansRelative {
  uid: string
  name: string
  description: string
  feature: {
    uid: string
    title: string
    feature_type: string
    description: string
    extra_text: string
  }
  plan: {
    uid: string
    name: string
    article: string
    show: boolean
    square: string
    rooms: number
  }
  relatives: IIPlansRelativeRelatives[]
}

export interface IIPlansRelativeRelatives {
  uid: string
  name: string
  article: string
  show: boolean
  square: number
  rooms: number
}
