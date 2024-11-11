import { fetchGetAggregator, fetchUpdateAggregator } from '@/services/REST/dom_admin/aggregators'
import type { IAggregatorItem, IMedia } from '@/services/REST/dom_admin/common_types'
import api from '@/services/REST/utils/dom_admin'

export const fetchGetHouseList = async (meta: IMeta, f?: any) => {
  return await api.get<IUseMeta<IHouseListItem[]>>('admin/objects/houses', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchGetHouse = async (uid: string) => {
  return await api.get<IHouse>(`admin/objects/houses/${uid}`)
}

export const fetchUpdateHouse = async (uid: string, request_data: any) => {
  return await api.put<IHouse>(`admin/objects/houses/${uid}`, request_data)
}
export const fetchGetHouseAggregatorAvito = async (uid: string): Promise<IHouseAggregatorAvito | null> => {
  return fetchGetAggregator<IHouseAggregatorAvito>(uid)
}
export const fetchUpdateHouseAggregatorAvito = async (
  uid: string,
  request_data: IHouseAggregatorAvito['data']
): Promise<IHouseAggregatorAvito | null> => {
  return fetchUpdateAggregator<IHouseAggregatorAvito>(uid, request_data)
}
export const fetchGetHouseAggregatorCian = async (uid: string): Promise<IHouseAggregatorCian | null> => {
  return fetchGetAggregator<IHouseAggregatorCian>(uid)
}
export const fetchGetHouseAggregatorM2 = async (uid: string): Promise<IHouseAggregatorM2 | null> => {
  return fetchGetAggregator<IHouseAggregatorM2>(uid)
}

export const fetchUpdateHouseAggregatorCian = async (
  uid: string,
  request_data: IHouseAggregatorCian['data']
): Promise<IHouseAggregatorCian | null> => {
  return fetchUpdateAggregator<IHouseAggregatorCian>(uid, request_data)
}
export const fetchUpdateHouseAggregatorM2 = async (
  uid: string,
  request_data: IHouseAggregatorM2['data']
): Promise<IHouseAggregatorM2 | null> => {
  return fetchUpdateAggregator<IHouseAggregatorM2>(uid, request_data)
}

export const fetchGetHouseAggregatorDomClick = async (uid: string): Promise<IHouseAggregatorDomClick | null> => {
  return fetchGetAggregator<IHouseAggregatorDomClick>(uid)
}
export const fetchUpdateHouseAggregatorDomClick = async (
  uid: string,
  request_data: IHouseAggregatorDomClick['data']
): Promise<IHouseAggregatorDomClick | null> => {
  return fetchUpdateAggregator<IHouseAggregatorDomClick>(uid, request_data)
}
export const fetchGetHouseAggregatorYandex = async (uid: string): Promise<IHouseAggregatorYandex | null> => {
  return fetchGetAggregator<IHouseAggregatorYandex>(uid)
}
export const fetchUpdateHouseAggregatorYandex = async (
  uid: string,
  request_data: IHouseAggregatorYandex['data']
): Promise<IHouseAggregatorYandex | null> => {
  return fetchUpdateAggregator<IHouseAggregatorYandex>(uid, request_data)
}

export interface IHouseListItem {
  uid: string
  name: string
  show: boolean
  floors: number
  ready_date: string
  address_fillable: string
  complex_name: string
}

export interface IHouse {
  uid: string
  name: string
  show: boolean
  weight: number
  ready_date: string
  ready_at: string
  active_at: string
  inactive_at: string
  created_at: string
  updated_at: string
  deleted_at: string
  plan_url: string
  address_fillable: string
  floors: number
  sales_start: string
  commissioning_before: string
  actual_commissioning_at: string
  keys_delivery_before: string
  actual_keys_delivery_at: string
  legal_entity_uid: string
  media: IMedia[]
  title_for_site: string
  slug: string
  construction_method: string
  aggregators_items: IAggregatorItem[]
  offer_type: 0
}

export interface IHouseAggregatorAvito extends IAggregatorItem {
  media: IMedia[]
  data: {
    house_id: string
    courtyard: string[]
    parking: string[]
    freight_elevator: string
    passenger_elevator: string
  }
}

export interface IHouseAggregatorCian extends IAggregatorItem {
  media: IMedia[]
  data: {
    house_id: string
    project_declaration_url: string
    has_ramp: boolean
    parking_type: string
    is_house_complete: boolean
    passenger_lifts_count: string
    cargo_lifts_count: string
  }
}

export interface IHouseAggregatorM2 extends IHouseAggregatorCian {}

export interface IHouseAggregatorYandex extends IAggregatorItem {
  media: IMedia[]
  data: {
    house_id: string
    building_phase: string
    guarded_building: boolean
    parking: boolean
    lift: boolean
    rubbish_chute: boolean
    building_state: string
    is_elite: boolean
  }
}

export interface IHouseAggregatorDomClick extends IAggregatorItem {
  media: IMedia[]
  data: {
    house_id: string
    date_complete: Date
    floors_ready: string
    building_state: string
    building_phase: string
    ceiling_height: string
    passenger_lifts_count: string
    cargo_lifts_count: string
  }
}
