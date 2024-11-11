import { fetchGetAggregator, fetchUpdateAggregator } from '@/services/REST/dom_admin/aggregators'
import type { IAggregatorItem, IMedia } from '@/services/REST/dom_admin/common_types'
import api from '@/services/REST/utils/dom_admin'

export const fetchGetComplexList = async (meta: IMeta, f?: any) => {
  return api.get<IUseMeta<IComplexListItem[]>>('admin/objects/complexes', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchGetComplex = async (complex_uid: string) => {
  return api.get<IComplex>(`admin/objects/complexes/${complex_uid}`)
}

export const fetchUpdateComplex = async (complex_uid: string, request_data: any) => {
  return api.put<IComplex>(`admin/objects/complexes/${complex_uid}`, request_data)
}

export const fetchGetComplexAggregatorAvito = async (uid: string): Promise<IComplexAggregatorItemAvito | null> => {
  return fetchGetAggregator<IComplexAggregatorItemAvito>(uid)
}
export const fetchGetComplexAggregatorCian = async (uid: string): Promise<IComplexAggregatorItemCian | null> => {
  return fetchGetAggregator<IComplexAggregatorItemCian>(uid)
}
export const fetchGetComplexAggregatorM2 = async (uid: string): Promise<IComplexAggregatorItemM2 | null> => {
  return fetchGetAggregator<IComplexAggregatorItemM2>(uid)
}

export const fetchGetComplexAggregatorDomClick = async (
  uid: string
): Promise<IComplexAggregatorItemDomClick | null> => {
  return fetchGetAggregator<IComplexAggregatorItemDomClick>(uid)
}
export const fetchGetComplexAggregatorYandex = async (uid: string): Promise<IComplexAggregatorItemYandex | null> => {
  return fetchGetAggregator<IComplexAggregatorItemYandex>(uid)
}
export const fetchUpdateComplexAggregatorCian = async (
  uid: string,
  request_data: IComplexAggregatorItemCian['data']
): Promise<IComplexAggregatorItemCian | null> => {
  return fetchUpdateAggregator<IComplexAggregatorItemCian>(uid, request_data)
}

export const fetchUpdateComplexAggregatorM2 = async (
  uid: string,
  request_data: IComplexAggregatorItemM2['data']
): Promise<IComplexAggregatorItemM2 | null> => {
  return fetchUpdateAggregator<IComplexAggregatorItemM2>(uid, request_data)
}


export const fetchUpdateComplexAggregatorAvito = async (
  uid: string,
  request_data: IComplexAggregatorItemAvito['data']
): Promise<IComplexAggregatorItemAvito | null> => {
  return fetchUpdateAggregator<IComplexAggregatorItemAvito>(uid, request_data)
}
export const fetchUpdateComplexAggregatorYandex = async (
  uid: string,
  request_data: IComplexAggregatorItemYandex['data']
): Promise<IComplexAggregatorItemYandex | null> => {
  return fetchUpdateAggregator<IComplexAggregatorItemYandex>(uid, request_data)
}

export const fetchUpdateComplexAggregatorDomClick = async (
  uid: string,
  request_data: IComplexAggregatorItemDomClick['data']
): Promise<IComplexAggregatorItemDomClick | null> => {
  return fetchUpdateAggregator<IComplexAggregatorItemDomClick>(uid, request_data)
}

export interface IComplexListItem {
  uid: string
  name: string
  show: boolean
  description: number
  class_type: number
  title: number
  weight: number
}

export interface IComplex {
  uid: string
  name: string
  title: string
  active_at: null
  inactive_at: null
  created_at: string
  updated_at: string
  deleted_at: string
  description: string
  address: string
  geotag: null
  map_objects: [number, number]
  class_type: {
    uid: string
    title: string
  }
  construction_material: null
  houses_quantity: number
  weight: number
  total_square: null
  common_square: null
  inhabitants: number
  show: boolean
  region: string
  city: string
  country: string
  cashback_text: null
  media: IMedia[]
  aggregators_items: IAggregatorItem[]
}

interface IComplexAggregatorItemAvito extends IAggregatorItem {
  media: IMedia[]
  data: { complex_id: string }
}

interface IComplexAggregatorItemCian extends IAggregatorItem {
  media: IMedia[]
  data: { complex_id: string }
}
interface IComplexAggregatorItemM2 extends IAggregatorItem, IComplexAggregatorItemCian {}

interface IComplexAggregatorItemYandex extends IAggregatorItem {
  media: IMedia[]
  data: { complex_id: string; ready_date: string }
}

interface IComplexAggregatorItemDomClick extends IAggregatorItem {
  media: IMedia[]
  data: {
    complex_id: string
    security: string
    fenced_area: string
    parking: string
    sports_ground: string
    playground: string
    school: string
    kindergarten: string
    utp_main_text: string
    utp_main_title: string
    utp_main_image: string
    utp_secondary_text: string
    utp_secondary_title: string
    utp_secondary_image: string
    description: string
    video: string
    geotag: [number, number]
    address: string
    sales_phone: string
    responsible_officer_phone: string
    timezone: string
    work_day: { day: string; open_at: string; close_at: string }[]
  }
}
