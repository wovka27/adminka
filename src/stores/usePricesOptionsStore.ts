import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { IEstatePrice, IEstateSmartPrice } from '@/services/REST/dom_admin/estate'

interface IPriceNestedOption {
  value: string
  label: string
  children?: { value: string; label: string; cost: string; type?: string }[]
}

export const usePricesOptionsStore = defineStore('prices', () => {
  const price_type_options = ref<IPriceNestedOption[]>([])
  const transformPricesData = <T extends IEstatePrice | IEstateSmartPrice>(arr: T[], type: string) =>
    arr.map((i) => ({ value: i.price_type_uid, type, label: i.price_type, cost: i.cost }))
  const getPriceAndSmartPrices = (prices: IEstatePrice[], smart_prices: IEstateSmartPrice[]) => {
    const price = prices?.length
      ? {
          label: 'Цены 1С',
          value: 'price',
          children: transformPricesData(prices, 'price')
        }
      : null
    const smart_price = smart_prices?.length
      ? {
          label: 'Цены ProfitDom',
          value: 'smart_price',
          children: transformPricesData(smart_prices, 'smart_price')
        }
      : null

    price_type_options.value = [
      {
        value: 'manual_price',
        label: 'Ввести вручную'
      },
      ...(<IPriceNestedOption[]>[price, smart_price].filter(Boolean))
    ]
  }

  const $reset = () => {
    price_type_options.value = []
  }
  return { getPriceAndSmartPrices, price_type_options, $reset }
})
