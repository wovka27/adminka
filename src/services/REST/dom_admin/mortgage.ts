import api from '@/services/REST/utils/dom_admin'

export const fetchGetMortgageList = async (meta: IMeta, f?: any) => {
  return await api.get<IUseMeta<IMortgageListItem[]>>('admin/objects/mortgage', {
    page: meta.page_current,
    per_page: meta.page_per,
    f
  })
}

export const fetchDeleteMortgage = async (uid: string) => {
  return await api.delete<IMortgageListItem>(`admin/objects/mortgage/${uid}`)
}

export const fetchGetMortgage = async (uid: string) => {
  return await api.get<IMortgage>(`admin/objects/mortgage/${uid}`)
}

export const fetchUpdateMortgage = async (uid: string, request_data: any) => {
  return await api.put<IMortgage>(`admin/objects/mortgage/${uid}`, request_data)
}

export const fetchCreateMortgage = async (request_data: any) => {
  return await api.post<IMortgage>(`admin/objects/mortgage`, request_data)
}

export interface IMortgageListItem {
  uid: string
  name: string
  show: boolean
  base_rate: number
  subsidy_period: number
  min_mortgage_term: number
  max_mortgage_term: number
  min_annual_fee: number
  max_amount: number
}

export interface IMortgage {
  uid: string
  name: string
  show: boolean
  weight: number
  subsidized_rate: number
  base_rate: number
  subsidy_period: number
  min_mortgage_term: number
  max_mortgage_term: number
  min_annual_fee: number
  min_amount: number
  max_amount: number
  is_public: boolean
  calc_program_id: number
  active_at: string
  inactive_at: string
  created_at: string
  updated_at: string
  deleted_at: null
  description: string
  program_type: string
  bank: string
  program: string
  prioritized: boolean
}
