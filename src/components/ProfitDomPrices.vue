<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

import useRefs from '@/composables/app/useRefs'

import type { IEstateSmartPrice } from '@/services/REST/dom_admin/estate'

interface IProfitDomPricesProps {
  modelValue: IEstateSmartPrice[]
}

const refs = useRefs('smart-price-types')

const props = defineProps<IProfitDomPricesProps>()
const emit = defineEmits(['update:modelValue'])

const crutch = ref()
const is_select_hidden = ref(true)

const price_type_options = computed(() =>
  refs.value.smart_price_types.filter((i) => !props.modelValue.find((j) => i.value === j.price_type_uid))
)

const handleUpdateField = (key: string, value: string, cost: IEstateSmartPrice) => {
  const result = props.modelValue.map((i) => (i.price_type_uid === cost.price_type_uid ? { ...cost, [key]: value } : i))

  emit('update:modelValue', result)
}

const addCost = (price: { label: string; value: string }) => {
  const new_price: IEstateSmartPrice = {
    price_type_uid: price.value,
    comm_remune: '0',
    cost: '0',
    old_cost: '0',
    price_type: price.label
  }

  emit('update:modelValue', [...props.modelValue, new_price])
  is_select_hidden.value = true
}

const removeCost = (price_uid: string) => {
  emit(
    'update:modelValue',
    props.modelValue.filter((i) => i.price_type_uid !== price_uid)
  )
}
</script>

<template>
  <div class="ProfitDomPrices">
    <h1 class="ProfitDomPrices__h1">Цены ProfitDom</h1>

    <div v-if="modelValue.length" class="ProfitDomPrices__prices">
      <div class="ProfitDomPrices__priceItem" v-for="price of modelValue" :key="price.price_type_uid">
        <el-icon class="ProfitDomPrices__btnClose" @click="removeCost(price.price_type_uid)">
          <Close class="iconHover_danger" />
        </el-icon>

        <PskInput
          @update:model-value="handleUpdateField('cost', $event, price)"
          :model-value="price.cost"
          :label="price.price_type + ', ₽'"
          type="cash"
        />

        <PskInput
          @update:model-value="handleUpdateField('old_cost', $event, price)"
          :model-value="price.old_cost || '0'"
          label="Старая цена, ₽"
          type="cash"
        />

        <PskInput
          @update:model-value="handleUpdateField('comm_remune', $event, price)"
          :model-value="price.comm_remune"
          label="КВ"
        />
      </div>
    </div>

    <template v-if="price_type_options.length">
      <div class="ProfitDomPrices__prices">
        <PskButton class="ProfitDomPrices__addBtn" v-if="is_select_hidden" @click="is_select_hidden = false">
          + Добавить цену
        </PskButton>

        <PskSelect
          v-else
          :model-value="crutch"
          @update:model-value="addCost"
          :options="price_type_options"
          options_label="label"
          value_key="value"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.ProfitDomPrices__h1 {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 30px;
}

.ProfitDomPrices__priceItem {
  position: relative;
  padding: 20px;
  border-radius: 6px;
  border: 1px solid $c_border_light;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: border-color 150ms ease-in-out;
  &:hover {
    border-color: darken($c_border_light, 15%);
  }
}

.ProfitDomPrices__prices {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px 30px;
  margin-bottom: 20px;
}

.ProfitDomPrices__addBtn {
  button {
    width: inherit;
  }
}

.ProfitDomPrices__btnClose {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
