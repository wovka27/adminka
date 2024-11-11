import api from '@/services/REST/utils/dom_admin'

export const fetchGetFiltersComplex = async () => {
  return await api.get<IFiltersComplexOption[]>('admin/filters')
}

export interface IFiltersComplexOption {
  name: string
  uid: string
  houses: {
    name: string
    uid: string
  }[]
}
