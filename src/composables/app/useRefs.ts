import { onMounted, ref } from 'vue'

import api from '@/services/REST/utils/dom_admin'

type StrEnumType = <T extends RefRequestParamNamesType>(o: Array<T>) => { [K in T]: K }
const strEnum: StrEnumType = (arr) =>
  arr.reduce(
    (res, key) => ({
      ...res,
      [key]: key
    }),
    Object.create(null)
  )

export default <T extends RefRequestParamNamesType>(...ref_names: T[]) => {
  const names = strEnum(ref_names)

  type ResultType = { [K in RefKeys[keyof Pick<RefKeys, keyof typeof names>]]: InterRefKeysType[K] }

  const defaultValue = ref_names.reduce<ResultType>(
    (acc, i) => ({
      ...acc,
      [i.replace(/-/g, '_')]: []
    }),
    Object.create(null)
  )

  const refs = ref<ResultType>(defaultValue)

  onMounted(async () => {
    // @ts-ignore
    refs.value = (await api.get('admin/refs', { q: String(ref_names) })) ?? defaultValue
    // console.log(Object.values((await api.get('admin/refs/list')) || {}).flat(Infinity)) // для сверки актуального списка рефов из бэка
  })

  return refs
}

interface RefKeys {
  'company-groups-with-legal-entities': 'company_groups_with_legal_entities'
  'complexes-with-infrastructure-categories': 'complexes_with_infrastructure_categories'
  'complexes-with-plans': 'complexes_with_plans'
  'complexes-with-promotion-categories': 'complexes_with_promotion_categories'
  'complexes-with-houses': 'complexes_with_houses'
  'api-resource-settings-types': 'api_resource_settings_types'
  'public-scopes': 'public_scopes'
  'avito-balcony-types': 'avito_balcony_types'
  'avito-bathroom-types': 'avito_bathroom_types'
  'avito-categories': 'avito_categories'
  'avito-contact-methods': 'avito_contact_methods'
  'avito-courtyard': 'avito_courtyard'
  'avito-deal-types': 'avito_deal_types'
  'avito-decoration-types': 'avito_decoration_types'
  'avito-elevator': 'avito_elevator'
  'avito-listing-fee-types': 'avito_listing_fee_types'
  'avito-market-types': 'avito_market_types'
  'avito-nd-additionally': 'avito_nd_additionally'
  'avito-operation-types': 'avito_operation_types'
  'avito-parking': 'avito_parking'
  'avito-property-rights': 'avito_property_rights'
  'avito-property-statuses': 'avito_property_statuses'
  'avito-room-types': 'avito_room_types'
  'bank-programs': 'bank_programs'
  banks: 'banks'
  'cian-categories': 'cian_categories'
  'cian-decoration-types': 'cian_decoration_types'
  'cian-parking': 'cian_parking'
  'company-groups': 'company_groups'
  'complex-classes': 'complex_classes'
  complexes: 'complexes'
  'construction-materials': 'construction_materials'
  'dom-click-housing-types': 'dom_click_housing_types'
  'dom-click-balcony-types': 'dom_click_balcony_types'
  'dom-click-bathroom-types': 'dom_click_bathroom_types'
  'dom-click-building-state': 'dom_click_building_state'
  'dom-click-parking': 'dom_click_parking'
  'dom-click-renovation-types': 'dom_click_renovation_types'
  'flat-properties': 'flat_properties'
  'feed-settings-type': 'feed_settings_type'
  features: 'features'
  'house-offer-types': 'house_offer_types'
  'interior-types': 'interior_types'
  'margin-groups': 'margin_groups'
  'price-types': 'price_types'
  'merged-price-types': 'merged_price_types'
  'real-property-types': 'real_property_types'
  'real-property-statuses': 'real_property_statuses'
  'real-property-square-types': 'real_property_square_types'
  'smart-price-types': 'smart_price_types'
  'window-placements': 'window_placements'
  'window-views': 'window_views'
  'yandex-balcony-types': 'yandex_balcony_types'
  'yandex-bathroom-types': 'yandex_bathroom_types'
  'yandex-building-state': 'yandex_building_state'
  'yandex-categories': 'yandex_categories'
  'yandex-room-types': 'yandex_room_types'
  'activity-regions': 'activity_regions'
  'cian-replacement-room-count': 'cian_replacement_room_count'
  'yandex-replacement-room-count': 'yandex_replacement_room_count'
  'dom-click-replacement-room-count': 'dom_click_replacement_room_count'
  'avito-replacement-room-count': 'avito_replacement_room_count'
}

export interface InterRefKeysType {
  api_resource_settings_types: IRefOption[]
  public_scopes: string[]
  activity_regions: string[]
  avito_balcony_types: string[]
  avito_bathroom_types: string[]
  avito_categories: string[]
  avito_contact_methods: string[]
  avito_courtyard: string[]
  avito_deal_types: string[]
  avito_decoration_types: string[]
  avito_elevator: string[]
  avito_listing_fee_types: string[]
  avito_market_types: string[]
  avito_nd_additionally: string[]
  avito_operation_types: string[]
  avito_parking: string[]
  avito_property_rights: string[]
  avito_property_statuses: string[]
  avito_room_types: string[]
  banks: IRefOption[]
  bank_programs: IRefOption[]
  cian_categories: string[]
  cian_decoration_types: string[]
  cian_parking: string[]
  company_groups: IRefOption[]
  company_groups_with_legal_entities: IRefNestedOption[]
  complex_classes: IRefOption[]
  complexes: IRefOption[]
  complexes_with_infrastructure_categories: IRefNestedOption[]
  complexes_with_plans: IRefNestedOption[]
  complexes_with_promotion_categories: IRefNestedOption[]
  complexes_with_houses: IRefNestedOption[]
  construction_materials: string[]
  dom_click_balcony_types: string[]
  dom_click_bathroom_types: string[]
  dom_click_building_state: string[]
  dom_click_housing_types: IRefOption[]
  dom_click_parking: string[]
  dom_click_renovation_types: string[]
  flat_properties: IRefOption[]
  feed_settings_type: IRefOption[]
  features: IRefOption[]
  house_offer_types: string[]
  interior_types: string[]
  margin_groups: IRefOption[]
  price_types: IRefOption[]
  merged_price_types: IRefNestedOption[]
  real_property_types: IRefOption[]
  real_property_statuses: string[]
  real_property_square_types: string[]
  smart_price_types: IRefOption[]
  window_placements: string[]
  window_views: string[]
  yandex_balcony_types: string[]
  yandex_bathroom_types: string[]
  yandex_building_state: string[]
  yandex_categories: string[]
  yandex_room_types: string[]
  cian_replacement_room_count: IRefOption[]
  yandex_replacement_room_count: IRefOption[]
  dom_click_replacement_room_count: IRefOption[]
  avito_replacement_room_count: IRefOption[]
}

export interface IRefOption {
  value: string
  label: string
  is_active?: boolean
  is_competitor?: boolean
}

export interface IRefNestedOption extends IRefOption {
  children: IRefNestedOption[]
}

type RefRequestParamNamesType = keyof RefKeys
