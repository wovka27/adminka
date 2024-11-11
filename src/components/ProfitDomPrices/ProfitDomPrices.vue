<script setup lang="ts">
import { computed, ref } from 'vue'

import ProfitDomPricesItem from '@/components/ProfitDomPrices/ProfitDomPricesItem.vue'

import useRefs from '@/composables/app/useRefs'

import type { IEstateSmartPrice } from '@/services/REST/dom_admin/estate'

interface IProfitDomPricesProps {
  modelValue: IEstateSmartPrice[]
}

const refs = useRefs('smart-price-types')

const props = defineProps<IProfitDomPricesProps>()
const emit = defineEmits(['update:modelValue'])

const tab_options = [
  { value: 'smart', label: 'Наши цены' },
  { value: 'competitors', label: 'Цены конкурентов' }
]

const crutch = ref('')
const is_select_hidden = ref(true)
const active_tab = ref(tab_options[0])

const model = computed(() => ({
  smart: props.modelValue.filter(isNotCompetitor),
  competitors: props.modelValue.filter(isCompetitor)
}))

const current_prices = computed(() => model.value[active_tab.value.value])

const price_type_options = computed(() => {
  const arr = refs.value.smart_price_types.filter(
    (i) => !current_prices.value.find((j) => i.value === j.price_type_uid)
  )
  return { smart: arr.filter(isNotCompetitor), competitors: arr.filter(isCompetitor) }
})

const isCompetitor = (i) => i.is_competitor
const isNotCompetitor = (i) => !i.is_competitor

const handleTabChange = (tab) => {
  is_select_hidden.value = true
  active_tab.value = tab
  crutch.value = ''
}

const getResult = (val) => Object.values({ ...model.value, [active_tab.value.value]: val }).flat(Infinity)

const handleUpdateField = (key: string, value: string, cost: IEstateSmartPrice) => {
  const result = current_prices.value.map((i) =>
    i.price_type_uid === cost.price_type_uid ? { ...cost, [key]: value } : i
  )

  emit('update:modelValue', getResult(result))
}

const addCost = (price: { label: string; value: string }) => {
  const new_price: IEstateSmartPrice = {
    price_type_uid: price.value,
    comm_remune: '0',
    cost: '0',
    is_competitor: active_tab.value.value === 'competitors',
    old_cost: '0',
    price_type: price.label
  }

  emit('update:modelValue', getResult([...current_prices.value, new_price]))
  is_select_hidden.value = true
}

const removeCost = (price_uid: string) => {
  const value = current_prices.value.filter((i) => i.price_type_uid !== price_uid)

  emit('update:modelValue', getResult(value))
}
</script>

<template>
  <PskGridContainer style="position: relative" grid-span="3" grid-column-count="1" title="Цены ProfitDom">
    <div class="ProfitDomPrices__tabs">
      <PskTabSelect
        :model-value="active_tab"
        :options="tab_options"
        options_value="value"
        options_label="label"
        value_key="value"
        @update:model-value="handleTabChange($event)"
      />
    </div>
    <div v-if="model[active_tab.value].length" class="ProfitDomPrices__prices">
      <ProfitDomPricesItem
        v-for="price of model[active_tab.value]"
        :key="price.price_type_uid"
        :price="price"
        @handle-update-field="handleUpdateField"
        @remove-cost="removeCost"
      />
    </div>

    <div class="ProfitDomPrices__prices">
      <PskButton class="ProfitDomPrices__addBtn" v-if="is_select_hidden" @click="is_select_hidden = false">
        + Добавить цену
      </PskButton>

      <PskSelect
        v-else
        :model-value="crutch"
        @update:model-value="addCost"
        :options="price_type_options[active_tab.value]"
        options_label="label"
        value_key="value"
      />
    </div>
  </PskGridContainer>
</template>

<style lang="scss">
.ProfitDomPrices__prices {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
  gap: 20px 30px;
  margin-bottom: 20px;
}

.ProfitDomPrices__tabs {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: #fff;
  padding-top: 20px;
  margin-top: -20px;
}

.ProfitDomPrices__addBtn {
  button {
    width: inherit;
  }
}
</style>
