<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { usePricesOptionsStore } from '@/stores/usePricesOptionsStore'

interface IPriceTypeFieldProps {
  modelValue: { value: string; price_type: string } | null
  overridePrice: boolean
}

const price_options_store = usePricesOptionsStore()

const props = defineProps<IPriceTypeFieldProps>()
const emit = defineEmits(['update:modelValue', 'update:overridePrice'])
const input_value = ref<string>('')
const select_value = ref('')
const input_disabled = ref<boolean>(false)
const is_valid = ref<boolean>(false)

const mapAndFlatPriceTypeOptions = (arr: typeof price_options_store.price_type_options) =>
  arr.flatMap((i) => i.children).filter(Boolean)

const getPriceTypeItem = (uid: string) =>
  mapAndFlatPriceTypeOptions(price_options_store.price_type_options).find((i) => i!.value === uid)

const changeInputValue = (value: string) => {
  is_valid.value = !value
  emit('update:modelValue', { price_type: 'manual_price', value: (input_value.value = value) })
}

const changeSelected = (value: string) => {
  const selected = getPriceTypeItem(value)
  ;[input_disabled.value, input_value.value] = [value !== 'manual_price', selected?.cost || '']

  emit('update:modelValue', { value: (select_value.value = value), price_type: selected?.type })
}

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

onMounted(() => {
  const manual = price_options_store.price_type_options[0]
  const selected = [manual, ...mapAndFlatPriceTypeOptions(price_options_store.price_type_options)].find(
    (i) => i?.value === props.modelValue?.value
  )

  input_value.value = selected?.cost ?? (props.modelValue?.value.match(uuidRegex) ? '' : props.modelValue?.value)
  select_value.value = selected?.value ?? manual.value
  input_disabled.value = select_value.value !== manual.value
})
</script>

<template>
  <div class="PriceTypeField">
    <PskSelect
      :model-value="select_value"
      @update:modelValue="changeSelected($event)"
      label="Какой тип цены выгружать"
      required
      group
      :options="price_options_store.price_type_options"
      options_label="label"
      options_value="value"
    />
    <div class="PriceTypeField__line"></div>
    <PskInput
      :model-value="input_value"
      @update:modelValue="changeInputValue($event)"
      label="Выгружаемая цена, ₽"
      :disabled="input_disabled"
      type="cash"
    />
    <PskSwitch
      style="white-space: nowrap; margin-left: 20px"
      :model-value="overridePrice"
      @update:modelValue="$emit('update:overridePrice', $event)"
      label="Принудительная цена"
    />
  </div>
</template>

<style lang="scss">
.PriceTypeField {
  grid-column: span 2;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: nowrap;
}

.PriceTypeField__line {
  height: 1px;
  width: 30px;
  margin-bottom: 15px;
  background-color: #1a1a1a;
}
</style>
