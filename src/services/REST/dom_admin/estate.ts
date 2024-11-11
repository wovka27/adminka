import { fetchGetAggregator, fetchUpdateAggregator } from '@/services/REST/dom_admin/aggregators'
import type { IAggregatorItem, IImage, IMedia } from '@/services/REST/dom_admin/common_types'
import api from '@/services/REST/utils/dom_admin'

const getEstateList = async (type: string, meta: IMeta, f?: any) =>
  await api.get<IUseMeta<IEstateListItem[]>>('admin/objects/flats', {
    page: meta.page_current,
    per_page: meta.page_per,
    f: { type, ...f }
  })

export const fetchGetCommercialList = (meta: IMeta, f?: any) => getEstateList('commercial', meta, f)
export const fetchGetApartmentList = (meta: IMeta, f?: any) => getEstateList('apartment', meta, f)
export const fetchGetParkingList = (meta: IMeta, f?: any) => getEstateList('parking', meta, f)
export const fetchGetPantryList = (meta: IMeta, f?: any) => getEstateList('pantry', meta, f)
export const fetchGetFlatList = (meta: IMeta, f?: any) => getEstateList('flat', meta, f)

export const fetchGetEstate = async (uid: string) => {
  return await api.get<IEstate>(`admin/objects/flats/${uid}`)
}

export const fetchUpdateEstate = async (uid: string, request_data: any) => {
  return await api.put<IEstate>(`admin/objects/flats/${uid}`, request_data)
}

export const fetchGetEstateAggregatorAvito = async (uid: string): Promise<IEstateAggregatorAvito | null> => {
  return await fetchGetAggregator<IEstateAggregatorAvito>(uid)
}

export const fetchUpdateEstateAggregatorAvito = async (
  uid: string,
  request_data: IEstateAggregatorAvito['data']
): Promise<IEstateAggregatorAvito | null> => {
  return fetchUpdateAggregator<IEstateAggregatorAvito>(uid, request_data)
}

export const fetchGetEstateAggregatorCian = async (uid: string): Promise<IEstateAggregatorCian | null> => {
  return fetchGetAggregator<IEstateAggregatorCian>(uid)
}
export const fetchGetEstateAggregatorM2 = async (uid: string): Promise<IEstateAggregatorM2 | null> => {
  return fetchGetAggregator<IEstateAggregatorM2>(uid)
}

export const fetchUpdateEstateAggregatorCian = async (
  uid: string,
  request_data: IEstateAggregatorCian['data']
): Promise<IEstateAggregatorCian | null> => {
  return fetchUpdateAggregator<IEstateAggregatorCian>(uid, request_data)
}

export const fetchUpdateEstateAggregatorM2 = async (
  uid: string,
  request_data: IEstateAggregatorM2['data']
): Promise<IEstateAggregatorM2 | null> => {
  return fetchUpdateAggregator<IEstateAggregatorM2>(uid, request_data)
}

export const fetchGetEstateAggregatorYandex = async (uid: string): Promise<IEstateAggregatorYandex | null> => {
  return fetchGetAggregator<IEstateAggregatorYandex>(uid)
}

export const fetchUpdateEstateAggregatorYandex = async (
  uid: string,
  request_data: IEstateAggregatorYandex['data']
): Promise<IEstateAggregatorYandex | null> => {
  return fetchUpdateAggregator<IEstateAggregatorYandex>(uid, request_data)
}

export const fetchGetEstateAggregatorDomClick = async (uid: string): Promise<IEstateAggregatorDomClick | null> => {
  return fetchGetAggregator<IEstateAggregatorDomClick>(uid)
}

export const fetchUpdateEstateAggregatorDomClick = async (
  uid: string,
  request_data: IEstateAggregatorDomClick['data']
): Promise<IEstateAggregatorDomClick | null> => {
  return fetchUpdateAggregator<IEstateAggregatorDomClick>(uid, request_data)
}

export interface IEstateListItem {
  uid: string
  name: string
  show: boolean
  floor: number
  rooms: number
  square: number
  number_on_floor: number
}

export interface IEstate {
  uid: string
  name: string
  show: boolean
  weight: number
  active_at: string
  inactive_at: string
  created_at: string
  updated_at: string
  deleted_at: string
  floor: number
  number: string
  status: string
  common_square: number
  kitchen_square: number
  rooms: number
  custom_squares: {
    living_square: string
    loggia_square: string
    kitchen_square: string
    marketing_square: string
  }
  state: {
    uid: string
    name: string
    status: string
    show_price: boolean
    enabled: boolean
  }
  type: string
  subsidy: boolean
  renovation: boolean
  marginal: boolean
  terrace_square: string
  margin_group: string
  installment: boolean
  trade_in: boolean
  is_penthouse: boolean
  loggias_count: string
  balconies_count: string
  is_special: boolean
  black_friday: boolean
  public_sale: boolean
  delay: boolean
  cashback: boolean
  loyalty: boolean
  video_review: string
  article: string
  plan_type: string
  global_settings: IEstateGlobalSetting[]
  window_view: string
  window_placement: string
  finishing: string
  ceiling_height: string
  living_space: string
  interior: string
  title_for_site: string
  loggia_square: string
  accessors: unknown
  prices: IEstatePrice[]
  smart_prices: IEstateSmartPrice[]
  images: IImage[]
  files: unknown
  description: string
  number_on_floor: number
  aggregators_items: IAggregatorItem[]
  complex: {
    name: string
    uid: string
  }
  house: {
    name: string
    uid: string
  }
}

export interface IEstateGlobalSetting {
  name: string
  settings_type: 'PERSONAL' | 'GLOBAL'
  type: 'avito' | 'cian' | 'dom_click' | 'yandex'
  uid: string
}

export interface IEstateSmartPrice {
  price_type: string
  price_type_uid: string
  cost: string
  old_cost: null | string
  comm_remune: string
  is_competitor?: boolean
}

export interface IEstatePrice {
  price_type: string
  price_type_uid: string
  cost: string
}

export interface IEstateAggregatorAvito extends IAggregatorItem {
  media: IMedia[]
  data: {
    status: boolean
    force_load: boolean
    override_global_price: boolean
    // flat_type: string
    replacement_uid: string
    cost: {
      value: string
      price_type: string
    }
    property_category: string
    operation_type: string[]
    property_status: string[]
    nd_additionally: string[]
    market_type: string
    property_rights: string
    listing_fee: string
    room_type: string[]
    bathroom: string[]
    balcony_or_loggia: string[]
    deal_type: string
    decoration: string
    phone_number: string
    contact_method: string
    description: string
    square_type: string
  }
}

export interface IEstateAggregatorCian extends IAggregatorItem {
  media: IMedia[]
  data: {
    status: boolean
    force_load: boolean
    override_global_price: boolean
    // flat_type: string
    is_apartments: boolean
    replacement_uid: string
    cost: {
      value: string
      price_type: string
    }
    category: string
    decoration: string
    phone_number: string
    is_in_hidden_base: boolean
    description: string
    sale_type: string
    action_id: string
    square_type: string
  }
}

export interface IEstateAggregatorM2 extends IEstateAggregatorCian {}

export interface IEstateAggregatorYandex extends IAggregatorItem {
  media: IMedia[]
  data: {
    status: boolean
    force_load: boolean
    override_global_price: boolean
    // flat_type: string
    replacement_uid: string
    cost: {
      value: string
      price_type: string
    }
    rooms_type: string
    bathroom_unit: string
    balcony: string
    studio: string
    category: string
    apartments: boolean
    is_image_order_change_allowed: boolean
    online_show: string
    phone_number: string
    description: string
    square_type: string
  }
}

export interface IEstateAggregatorDomClick extends IAggregatorItem {
  media: IMedia[]
  data: {
    status: boolean
    force_load: boolean
    override_global_price: boolean
    // flat_type: string
    replacement_uid: string
    housing_type: string
    cost: {
      value: string
      price_type: string
    }
    bathroom: string
    balcony: string
    description: string
    square_type: string
  }
}
