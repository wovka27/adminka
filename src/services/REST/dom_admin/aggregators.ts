import api from '@/services/REST/utils/dom_admin'

export const fetchGetAggregator = async <T>(uid: string) => {
  return api.get<T>(`admin/aggregators/${uid}`)
}

export const fetchUpdateAggregator = async <T>(uid: string, request_data: any) => {
  return api.put<T>(`admin/aggregators/${uid}`, { data: request_data })
}
