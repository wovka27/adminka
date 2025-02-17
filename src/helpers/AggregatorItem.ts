import type { IAggregatorsLayoutProps } from '@/layouts/AggregatorsLayout.vue'

import type { IAggregatorItem } from '@/services/REST/dom_admin/common_types'

export class AggregatorItem {
  private aggregator_name_list: AggregatorItemType[] = [
    'avito',
    'cian',
    'dom_click',
    'yandex',
    'm2',
    'idalite',
    'etagi'
  ]
  private entity_name_map: Record<EntityName, EntityForAggregatorType> = {
    apartment: 'real_property',
    commercial: 'real_property',
    flat: 'real_property',
    pantry: 'real_property',
    parking: 'real_property',
    complex: 'complex',
    house: 'house'
  }

  aggregators_items: IAggregatorsLayoutProps['aggregators'] = []

  constructor(
    private entity_name: EntityName,
    private components: any[]
  ) {}

  private getAggregatorItemData<C>(aggregator: IAggregatorItem, component: C) {
    return { ...aggregator, component }
  }

  getAggregatorItem = (aggregator: IAggregatorItem) => {
    const result: Map<ResponseAggregatorKey, ReturnType<typeof this.getAggregatorItemData>> = new Map(
      this.aggregator_name_list.map((item, index) => [
        `${item}_${this.entity_name_map[this.entity_name]}`,
        this.getAggregatorItemData(aggregator, this.components[index])
      ])
    )

    return result.get(aggregator.type)
  }

  getAggregatorsItems(response: any) {
    const name = `${this.entity_name.charAt(0).toUpperCase()}${this.entity_name.substring(1)}`
    const aggs_map = this.components.reduce((map, agg, idx) => ({ ...map, [agg.__name.replace(name, '')]: idx }), {})

    this.aggregators_items = response.aggregators_items?.length
      ? response.aggregators_items.map(this.getAggregatorItem)
      : []

    this.aggregators_items.sort((a, b) => {
      const a_key = a.component.__name.replace(name, '')
      const b_key = b.component.__name.replace(name, '')

      return aggs_map[a_key] - aggs_map[b_key]
    })
  }
}
